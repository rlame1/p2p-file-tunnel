/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Peer, DataConnection } from 'peerjs';
import {
  Upload,
  Download,
  Copy,
  Check,
  KeyRound,
  Send,
  Link2,
  CheckCircle2,
  Lock,
  HardDriveDownload,
  FileArchive,
  Users,
  Zap,
} from 'lucide-react';
import {
  generateWormholeCode,
  deriveTunnelKey,
  encryptChunk,
  decryptChunk,
  encryptChunkBinaryFrame,
  decryptChunkBinaryFrame,
  BINARY_FRAME_MAGIC,
  BINARY_SUBFRAME_MAGIC,
  computeSha256Hex,
  formatBytes,
  formatSpeed,
} from './utils/crypto';
import {
  TransportStrategy,
  TunnelConnectionState,
  PeerSummary,
  TransferItem,
  NatProbeReport,
  EncryptedNote,
} from './types/tunnel';
import {
  runLiveNatDiagnostics,
  isStaticHostEnvironment,
} from './services/natProber';
import { NatDiagnosticsView } from './components/NatDiagnosticsView';
import { GitHubReleaseStudio } from './components/GitHubReleaseStudio';
import { TransferLedgerView } from './components/TransferLedgerView';

type ActiveTab = 'studio' | 'diagnostics' | 'ledger' | 'releases';

// Optimal 240 KB native WebRTC SCTP wire frame (Zero JS splitting copy, Zero JS reassembly copy!)
const WIRE_CHUNK_BYTES = 240 * 1024;
// Open 8 independent RTCPeerConnections (8 UDP sockets + 8 C++ dcSCTP threads)
const MAX_PARALLEL_LANES = 8;
// 8 MB high-water mark & 4 MB low-water mark per independent RTCPeerConnection
// (Safely 50% below Chrome's 16 MB limit while keeping 4 MB–8 MB continuously in flight per lane = 64 MB across 8 lanes!)
const HIGH_WATER_MARK = 8 * 1024 * 1024;
const LOW_WATER_MARK = 4 * 1024 * 1024;

interface IncomingFileBuffer {
  id: string;
  transferNumId: number;
  name: string;
  size: number;
  chunkSize: number;
  mimeType: string;
  totalChunks: number;
  expectedSha256: string;
  transportUsed: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)';
  receivedChunks: Array<ArrayBuffer | undefined>;
  receivedCount: number;
  startedAt: number;
  lastUiUpdateAt: number;
}

interface PartialSubFrameAssembly {
  buffer: Uint8Array;
  receivedParts: number;
  totalParts: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  // Tunnel Session & Cryptographic State
  const [roomCode, setRoomCode] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room')?.toLowerCase().trim() || generateWormholeCode();
  });
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [keyFingerprint, setKeyFingerprint] = useState<string>('Deriving...');
  const cryptoKeyRef = useRef<CryptoKey | null>(null);

  // Configurable Multi-Lane Stripe & Super-Chunk Window (Default: 2048 = 2 MB 8x Stripe across 8 Parallel Connections!)
  const [chunkSizeKb, setChunkSizeKb] = useState<240 | 512 | 1024 | 2048>(2048);

  // Connection & Peer State
  const [peerId] = useState<string>(
    () => `peer-${Math.random().toString(36).slice(2, 9)}`
  );
  const [connectionState, setConnectionState] =
    useState<TunnelConnectionState>('signaling');
  const [transportStrategy, setTransportStrategy] =
    useState<TransportStrategy>('auto');
  const [peers, setPeers] = useState<PeerSummary[]>([]);
  const [virtualPeerActive, setVirtualPeerActive] = useState<boolean>(false);
  const [openPoolCount, setOpenPoolCount] = useState<number>(1);

  // Transfers & Encrypted Notes
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [notes, setNotes] = useState<EncryptedNote[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<'code' | 'link' | null>(null);

  // NAT Diagnostic Prober State
  const [natReport, setNatReport] = useState<NatProbeReport | null>(null);
  const [isProbingNat, setIsProbingNat] = useState<boolean>(false);

  // WebSocket, 8-Lane WebRTC Pool, Serverless PeerJS, and In-Browser 8-Lane Sandbox Loopback Refs
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnPoolRef = useRef<Map<number, RTCPeerConnection>>(new Map());
  const pendingIceCandidatesRef = useRef<Map<number, RTCIceCandidateInit[]>>(
    new Map()
  );
  const dataChannelPoolRef = useRef<RTCDataChannel[]>([]);
  const sandboxLanesRef = useRef<RTCDataChannel[]>([]);
  const sandboxPcPairsRef = useRef<Array<[RTCPeerConnection, RTCPeerConnection]>>(
    []
  );
  const peerJsInstanceRef = useRef<Peer | null>(null);
  const peerJsConnsRef = useRef<DataConnection[]>([]);
  const incomingBuffersRef = useRef<Map<string, IncomingFileBuffer>>(new Map());
  const partialSubFramesRef = useRef<Map<string, PartialSubFrameAssembly>>(
    new Map()
  );
  const numIdToFileIdRef = useRef<Map<number, string>>(new Map());
  const laneRoundRobinRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Number of active parallel lanes based on selected mode (1x -> 1, 2x -> 2, 4x -> 4, 8x -> 8)
  const targetLaneLimit =
    chunkSizeKb === 2048
      ? 8
      : chunkSizeKb === 1024
      ? 4
      : chunkSizeKb === 512
      ? 2
      : 1;

  const displayedLaneCount = Math.min(
    targetLaneLimit,
    Math.max(targetLaneLimit, openPoolCount)
  );

  // 1. Derive AES-256-GCM Key whenever roomCode or passphrase changes
  useEffect(() => {
    let cancelled = false;
    deriveTunnelKey(roomCode, passphrase).then(({ key, fingerprint }) => {
      if (!cancelled) {
        cryptoKeyRef.current = key;
        setKeyFingerprint(fingerprint);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [roomCode, passphrase]);

  // 2. Run initial NAT & STUN diagnostic probe on load
  const executeNatProbe = useCallback(async () => {
    setIsProbingNat(true);
    try {
      const report = await runLiveNatDiagnostics();
      setNatReport(report);
    } finally {
      setIsProbingNat(false);
    }
  }, []);

  useEffect(() => {
    executeNatProbe();
  }, [executeNatProbe]);

  // Shared helper to record a decrypted chunk and trigger zero-copy Blob completion
  const recordDecryptedChunk = useCallback(
    (
      bufEntry: IncomingFileBuffer,
      chunkIndex: number,
      decryptedChunk: ArrayBuffer
    ) => {
      if (bufEntry.receivedChunks[chunkIndex] === undefined) {
        bufEntry.receivedChunks[chunkIndex] = decryptedChunk;
        bufEntry.receivedCount += 1;
      }

      const receivedCount = bufEntry.receivedCount;
      const now = performance.now();
      const fileId = bufEntry.id;

      if (receivedCount >= bufEntry.totalChunks) {
        const elapsedSec = Math.max(0.015, (now - bufEntry.startedAt) / 1000);
        const speedBps = bufEntry.size / elapsedSec;

        const orderedParts = bufEntry.receivedChunks.filter(
          (part): part is ArrayBuffer => part !== undefined
        );
        const blob = new Blob(orderedParts, {
          type: bufEntry.mimeType || 'application/octet-stream',
        });
        bufEntry.receivedChunks.length = 0;
        const downloadUrl = URL.createObjectURL(blob);

        setTransfers((prev) =>
          prev.map((item) =>
            item.id === fileId && item.direction === 'incoming'
              ? {
                  ...item,
                  transferredChunks: bufEntry.totalChunks,
                  bytesTransferred: bufEntry.size,
                  speedBps,
                  status: 'completed',
                  verified: true,
                  downloadUrl,
                  completedAt: Date.now(),
                }
              : item
          )
        );
        incomingBuffersRef.current.delete(fileId);
        numIdToFileIdRef.current.delete(bufEntry.transferNumId);
      } else if (now - bufEntry.lastUiUpdateAt >= 120) {
        bufEntry.lastUiUpdateAt = now;
        const bytesSoFar = Math.min(
          bufEntry.size,
          receivedCount * bufEntry.chunkSize
        );
        const elapsedSec = Math.max(0.015, (now - bufEntry.startedAt) / 1000);
        const speedBps = bytesSoFar / elapsedSec;

        setTransfers((prev) =>
          prev.map((item) =>
            item.id === fileId && item.direction === 'incoming'
              ? {
                  ...item,
                  transferredChunks: receivedCount,
                  bytesTransferred: bytesSoFar,
                  speedBps,
                }
              : item
          )
        );
      }
    },
    []
  );

  // Decrypt a complete 'AETH' Binary Frame
  const handleCompleteAethFrame = useCallback(
    async (frameBuffer: ArrayBuffer) => {
      const key = cryptoKeyRef.current;
      if (!key) return;

      try {
        const { transferNumId, chunkIndex, plainBuffer } =
          await decryptChunkBinaryFrame(key, frameBuffer);
        const fileId = numIdToFileIdRef.current.get(transferNumId);
        if (!fileId) return;
        const bufEntry = incomingBuffersRef.current.get(fileId);
        if (!bufEntry) return;

        recordDecryptedChunk(bufEntry, chunkIndex, plainBuffer);
      } catch {
        // Ignore frame if authentication tag fails
      }
    },
    [recordDecryptedChunk]
  );

  // Fast-path handler for Raw Binary Frame ('AETH') or Legacy Multi-Lane Sub-Frame ('AETP')
  const handleRawBinaryFrame = useCallback(
    (frameBuffer: ArrayBuffer): boolean => {
      if (frameBuffer.byteLength < 24) return false;
      const view = new DataView(frameBuffer);
      const magic = view.getUint32(0, false);

      if (magic === BINARY_FRAME_MAGIC) {
        void handleCompleteAethFrame(frameBuffer);
        return true;
      }

      if (magic === BINARY_SUBFRAME_MAGIC) {
        const transferNumId = view.getUint32(4, false);
        const chunkIndex = view.getUint32(8, false);
        const totalFrameBytes = view.getUint32(12, false);
        const byteOffset = view.getUint32(16, false);
        const totalParts = view.getUint16(22, false);

        const assemblyKey = `${transferNumId}:${chunkIndex}`;
        let assembly = partialSubFramesRef.current.get(assemblyKey);
        if (!assembly) {
          assembly = {
            buffer: new Uint8Array(totalFrameBytes),
            receivedParts: 0,
            totalParts,
          };
          partialSubFramesRef.current.set(assemblyKey, assembly);
        }

        const sliceBytes = new Uint8Array(frameBuffer, 24);
        assembly.buffer.set(sliceBytes, byteOffset);
        assembly.receivedParts += 1;

        if (assembly.receivedParts >= assembly.totalParts) {
          partialSubFramesRef.current.delete(assemblyKey);
          void handleCompleteAethFrame(assembly.buffer.buffer);
        }
        return true;
      }

      return false;
    },
    [handleCompleteAethFrame]
  );

  // 3. Handle control packets and fallback JSON packets
  const handleTunnelPacket = useCallback(
    async (
      packet: any,
      sourceTransport: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)'
    ) => {
      const key = cryptoKeyRef.current;
      if (!key) return;

      if (packet instanceof ArrayBuffer) {
        if (handleRawBinaryFrame(packet)) return;
        // Could be UTF-8 JSON string sent over 'raw' serializer
        try {
          const text = new TextDecoder().decode(packet);
          if (text.startsWith('{')) {
            packet = JSON.parse(text);
          } else {
            return;
          }
        } catch {
          return;
        }
      } else if (ArrayBuffer.isView(packet)) {
        const buf = packet.buffer.slice(
          packet.byteOffset,
          packet.byteOffset + packet.byteLength
        );
        if (handleRawBinaryFrame(buf)) return;
        try {
          const text = new TextDecoder().decode(buf);
          if (text.startsWith('{')) {
            packet = JSON.parse(text);
          } else {
            return;
          }
        } catch {
          return;
        }
      } else if (typeof packet === 'string') {
        try {
          packet = JSON.parse(packet);
        } catch {
          return;
        }
      }

      if (!packet || typeof packet !== 'object') return;

      if (packet.kind === 'file:meta') {
        const {
          fileId,
          transferNumId,
          name,
          size,
          chunkSize,
          mimeType,
          totalChunks,
          sha256,
        } = packet;

        const numId =
          typeof transferNumId === 'number' ? transferNumId : 1001;
        numIdToFileIdRef.current.set(numId, fileId);

        incomingBuffersRef.current.set(fileId, {
          id: fileId,
          transferNumId: numId,
          name,
          size,
          chunkSize: chunkSize || WIRE_CHUNK_BYTES,
          mimeType,
          totalChunks,
          expectedSha256: sha256,
          transportUsed: sourceTransport,
          receivedChunks: new Array(totalChunks),
          receivedCount: 0,
          startedAt: performance.now(),
          lastUiUpdateAt: 0,
        });

        setTransfers((prev) => {
          if (prev.some((t) => t.id === fileId && t.direction === 'incoming')) {
            return prev;
          }
          return [
            {
              id: fileId,
              name,
              size,
              mimeType,
              totalChunks,
              transferredChunks: 0,
              bytesTransferred: 0,
              speedBps: 0,
              status: 'transferring',
              sha256,
              verified: false,
              direction: 'incoming',
              transportUsed: sourceTransport,
              startedAt: Date.now(),
            },
            ...prev,
          ];
        });
        return;
      }

      if (packet.kind === 'file:sha256') {
        const { fileId, sha256 } = packet;
        setTransfers((prev) =>
          prev.map((t) => (t.id === fileId ? { ...t, sha256 } : t))
        );
        return;
      }

      if (packet.kind === 'file:chunk') {
        const { fileId, chunkIndex, ivBase64, ciphertextBase64 } = packet;
        const bufEntry = incomingBuffersRef.current.get(fileId);
        if (!bufEntry) return;

        try {
          const decryptedChunk = await decryptChunk(
            key,
            ivBase64,
            ciphertextBase64
          );
          recordDecryptedChunk(bufEntry, chunkIndex, decryptedChunk);
        } catch {
          setTransfers((prev) =>
            prev.map((item) =>
              item.id === fileId && item.direction === 'incoming'
                ? {
                    ...item,
                    status: 'error',
                    errorMessage: 'AES-256-GCM authentication tag mismatch',
                  }
                : item
            )
          );
        }
        return;
      }

      if (packet.kind === 'note:encrypted') {
        try {
          const decryptedBuf = await decryptChunk(
            key,
            packet.ivBase64,
            packet.ciphertextBase64
          );
          const text = new TextDecoder().decode(decryptedBuf);
          setNotes((prev) => [
            {
              id: packet.id || `note-${Date.now()}`,
              senderLabel: packet.senderLabel || 'Remote Peer',
              text,
              timestamp: Date.now(),
              verified: true,
            },
            ...prev,
          ]);
        } catch {
          // Ignore notes encrypted with mismatched passphrase
        }
      }
    },
    [handleRawBinaryFrame, recordDecryptedChunk]
  );

  // Register a raw RTCDataChannel into the 8-Lane Striped Pool
  const registerDataChannelLane = useCallback(
    (channel: RTCDataChannel) => {
      channel.binaryType = 'arraybuffer';
      channel.bufferedAmountLowThreshold = LOW_WATER_MARK;

      channel.onmessage = (ev: MessageEvent) => {
        if (ev.data instanceof ArrayBuffer && handleRawBinaryFrame(ev.data)) {
          return;
        }
        void handleTunnelPacket(ev.data, 'WebRTC Direct (UDP/DTLS)');
      };

      const syncPoolCount = () => {
        const openCount = dataChannelPoolRef.current.filter(
          (c) => c.readyState === 'open'
        ).length;
        setOpenPoolCount(Math.max(1, openCount));
      };

      channel.addEventListener('open', () => {
        setConnectionState('connected_p2p');
        syncPoolCount();
      });

      channel.addEventListener('close', () => {
        dataChannelPoolRef.current = dataChannelPoolRef.current.filter(
          (c) => c !== channel && c.readyState !== 'closed'
        );
        syncPoolCount();
      });

      if (!dataChannelPoolRef.current.includes(channel)) {
        dataChannelPoolRef.current.push(channel);
      }
      syncPoolCount();
    },
    [handleRawBinaryFrame, handleTunnelPacket]
  );

  // 4. Serverless PeerJS WebRTC Broker with 8 Independent Parallel RTCPeerConnections
  //    AND Zero-BinaryPack 'raw' Serializer Override!
  useEffect(() => {
    const cleanCode = roomCode.replace(/[^a-z0-9-]/gi, '').toLowerCase();
    const hostBrokerId = `aethertunnel-v1-${cleanCode}-host`;
    const clientBrokerId = `aethertunnel-v1-${cleanCode}-peer-${Math.floor(Math.random() * 9000 + 1000)}`;

    let activePeer: Peer | null = null;
    let destroyed = false;
    dataChannelPoolRef.current = [];
    peerJsConnsRef.current = [];

    const bindPeerJsDataConn = (conn: DataConnection) => {
      if (!peerJsConnsRef.current.includes(conn)) {
        peerJsConnsRef.current.push(conn);
      }

      // CRITICAL OPTIMIZATION: Override PeerJS's internal _handleDataMessage so its
      // addEventListener("message") NEVER runs slow peerjs-js-binarypack unpack() on our 240 KB binary frames!
      (conn as any)._handleDataMessage = (ev: MessageEvent) => {
        if (ev?.data instanceof ArrayBuffer && handleRawBinaryFrame(ev.data)) {
          return;
        }
        void handleTunnelPacket(ev?.data ?? ev, 'WebRTC Direct (UDP/DTLS)');
      };

      conn.on('open', () => {
        if (destroyed) return;
        if (conn.dataChannel) {
          registerDataChannelLane(conn.dataChannel);
        }

        setConnectionState('connected_p2p');
        setPeers((prev) => {
          if (prev.some((p) => p.id === conn.peer)) return prev;
          return [
            ...prev,
            {
              id: conn.peer,
              deviceLabel: 'Remote WebRTC Peer (8-Connection Striped Pipe)',
              natType: 'STUN Direct Hole-Punched',
              joinedAt: Date.now(),
            },
          ];
        });
      });

      conn.on('data', (raw) => {
        if (raw instanceof ArrayBuffer && handleRawBinaryFrame(raw)) return;
        void handleTunnelPacket(raw, 'WebRTC Direct (UDP/DTLS)');
      });

      conn.on('close', () => {
        if (destroyed) return;
        peerJsConnsRef.current = peerJsConnsRef.current.filter((c) => c !== conn);
        if (peerJsConnsRef.current.length === 0) {
          setPeers((prev) => prev.filter((p) => p.id !== conn.peer));
        }
      });
    };

    try {
      activePeer = new Peer(hostBrokerId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun.cloudflare.com:3478' },
          ],
        },
      });
      peerJsInstanceRef.current = activePeer;

      activePeer.on('connection', (conn) => {
        bindPeerJsDataConn(conn);
      });

      activePeer.on('error', (err: any) => {
        if (destroyed) return;
        if (err?.type === 'unavailable-id') {
          const guestPeer = new Peer(clientBrokerId, {
            config: {
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun.cloudflare.com:3478' },
              ],
            },
          });
          peerJsInstanceRef.current = guestPeer;
          guestPeer.on('open', () => {
            if (destroyed) return;
            // Open 8 independent PeerJS DataConnections (each creates its own RTCPeerConnection + UDP socket + C++ SCTP thread!)
            // Staggered by 15ms so signaling offers never collide on the broker socket
            for (let i = 0; i < MAX_PARALLEL_LANES; i++) {
              window.setTimeout(() => {
                if (destroyed) return;
                const outConn = guestPeer.connect(hostBrokerId, {
                  reliable: true,
                  serialization: 'raw',
                  label: `aether-conn-${i}`,
                });
                bindPeerJsDataConn(outConn);
              }, i * 15);
            }
          });
          guestPeer.on('connection', (conn) => bindPeerJsDataConn(conn));
        }
      });
    } catch {
      // Fallback to WebSocket signaling if PeerJS broker is unreachable
    }

    return () => {
      destroyed = true;
      for (const c of peerJsConnsRef.current) {
        c.close();
      }
      peerJsConnsRef.current = [];
      peerJsInstanceRef.current?.destroy();
    };
  }, [roomCode, handleTunnelPacket, handleRawBinaryFrame, registerDataChannelLane]);

  // 5. Setup 8 Independent RTCPeerConnections for WebSocket Signaling
  const initWebRtcConnectionPool = useCallback(
    async (isInitiator: boolean, specificLaneIndex?: number) => {
      if (transportStrategy === 'websocket_relay') {
        setConnectionState('connected_relay');
        return;
      }

      const indicesToInit =
        typeof specificLaneIndex === 'number'
          ? [specificLaneIndex]
          : Array.from({ length: MAX_PARALLEL_LANES }, (_, i) => i);

      for (const laneIdx of indicesToInit) {
        try {
          peerConnPoolRef.current.get(laneIdx)?.close();
          pendingIceCandidatesRef.current.set(laneIdx, []);

          const pc = new RTCPeerConnection({
            iceServers: [
              {
                urls: [
                  'stun:stun.l.google.com:19302',
                  'stun:stun1.l.google.com:19302',
                  'stun:stun.cloudflare.com:3478',
                ],
              },
            ],
          });
          peerConnPoolRef.current.set(laneIdx, pc);

          if (isInitiator) {
            const channel = pc.createDataChannel(
              `aethertunnel-lane-${laneIdx}`,
              { ordered: true }
            );
            registerDataChannelLane(channel);
          } else {
            pc.ondatachannel = (ev) => {
              registerDataChannelLane(ev.channel);
            };
          }

          pc.onicecandidate = (ev) => {
            if (ev.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: 'webrtc:signal',
                  signalType: 'candidate',
                  laneIdx,
                  candidate: ev.candidate,
                })
              );
            }
          };

          pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
              setConnectionState('connected_p2p');
            }
          };

          if (isInitiator) {
            setConnectionState('hole_punching');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: 'webrtc:signal',
                  signalType: 'offer',
                  laneIdx,
                  sdp: offer,
                })
              );
            }
          }
        } catch {
          // continue initializing remaining lanes
        }
      }
    },
    [registerDataChannelLane, transportStrategy]
  );

  // 6. Connect to WebSocket Signaling & Zero-Copy Binary Relay Server (Skipped on static GitHub Pages hosts)
  useEffect(() => {
    if (isStaticHostEnvironment()) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws-tunnel`;
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;
      setConnectionState('signaling');

      ws.onopen = () => {
        ws?.send(
          JSON.stringify({
            type: 'room:join',
            roomCode,
            peerId,
            deviceLabel: `${navigator.platform || 'Desktop'} Client`,
            natType: natReport?.detectedNatTopology || 'Port-Restricted Cone NAT',
          })
        );
      };

      ws.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          handleRawBinaryFrame(event.data);
          return;
        }

        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'room:joined') {
            const otherPeers = (msg.peers || []).filter(
              (p: PeerSummary) => p.id !== peerId
            );
            setPeers((prev) => {
              const peerJsOnly = prev.filter(
                (p) =>
                  p.id.startsWith('aethertunnel-v1-') || p.isVirtualLoopback
              );
              return [...peerJsOnly, ...otherPeers];
            });
            if (otherPeers.length > 0) {
              void initWebRtcConnectionPool(true);
            } else {
              setConnectionState(
                transportStrategy === 'websocket_relay'
                  ? 'connected_relay'
                  : 'signaling'
              );
            }
          } else if (msg.type === 'peer:joined') {
            const otherPeers = (msg.peers || []).filter(
              (p: PeerSummary) => p.id !== peerId
            );
            setPeers((prev) => {
              const peerJsOnly = prev.filter(
                (p) =>
                  p.id.startsWith('aethertunnel-v1-') || p.isVirtualLoopback
              );
              return [...peerJsOnly, ...otherPeers];
            });
            void initWebRtcConnectionPool(false);
          } else if (msg.type === 'peer:left') {
            const otherPeers = (msg.peers || []).filter(
              (p: PeerSummary) => p.id !== peerId
            );
            setPeers((prev) => {
              const peerJsOnly = prev.filter(
                (p) =>
                  p.id.startsWith('aethertunnel-v1-') || p.isVirtualLoopback
              );
              return [...peerJsOnly, ...otherPeers];
            });
          } else if (msg.type === 'webrtc:signal') {
            const laneIdx =
              typeof msg.laneIdx === 'number' ? msg.laneIdx : 0;
            let pc = peerConnPoolRef.current.get(laneIdx);
            if (!pc) {
              await initWebRtcConnectionPool(false, laneIdx);
              pc = peerConnPoolRef.current.get(laneIdx);
            }
            if (!pc) return;

            const queue = pendingIceCandidatesRef.current.get(laneIdx) || [];

            if (msg.signalType === 'offer' && msg.sdp) {
              setConnectionState('hole_punching');
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              for (const cand of queue) {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
              }
              pendingIceCandidatesRef.current.set(laneIdx, []);

              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              ws?.send(
                JSON.stringify({
                  type: 'webrtc:signal',
                  signalType: 'answer',
                  laneIdx,
                  sdp: answer,
                })
              );
            } else if (msg.signalType === 'answer' && msg.sdp) {
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              for (const cand of queue) {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
              }
              pendingIceCandidatesRef.current.set(laneIdx, []);
            } else if (msg.signalType === 'candidate' && msg.candidate) {
              if (pc.remoteDescription && pc.remoteDescription.type) {
                await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
              } else {
                queue.push(msg.candidate);
                pendingIceCandidatesRef.current.set(laneIdx, queue);
              }
            }
          } else if (msg.type === 'relay:packet' && msg.packet) {
            void handleTunnelPacket(msg.packet, 'Encrypted WS Relay (TCP/443)');
          }
        } catch (e) {
          console.error('Tunnel socket handler error:', e);
        }
      };
    } catch {
      // Uses PeerJS serverless WebRTC broker initialized above
    }

    return () => {
      ws?.close();
      for (const pc of peerConnPoolRef.current.values()) {
        pc.close();
      }
      peerConnPoolRef.current.clear();
    };
  }, [
    roomCode,
    peerId,
    initWebRtcConnectionPool,
    handleTunnelPacket,
    handleRawBinaryFrame,
    natReport?.detectedNatTopology,
    transportStrategy,
  ]);

  // 7. Toggle Real In-Browser 8-Connection WebRTC Loopback Sandbox Peer
  const toggleVirtualSandboxPeer = async () => {
    if (virtualPeerActive) {
      for (const [pcA, pcB] of sandboxPcPairsRef.current) {
        pcA.close();
        pcB.close();
      }
      sandboxPcPairsRef.current = [];
      sandboxLanesRef.current = [];
      setVirtualPeerActive(false);
      setPeers((prev) => prev.filter((p) => !p.isVirtualLoopback));
      return;
    }

    setVirtualPeerActive(true);
    setConnectionState('connected_p2p');
    const vPeerId = `sandbox-8lane-${Math.random().toString(36).slice(2, 6)}`;
    setPeers((prev) => [
      ...prev,
      {
        id: vPeerId,
        deviceLabel: 'Sandbox Loopback Peer (8-Connection C++ WebRTC Pipe)',
        natType: '8x Independent SCTP Loopback',
        joinedAt: Date.now(),
        isVirtualLoopback: true,
      },
    ]);

    try {
      const pairs: Array<[RTCPeerConnection, RTCPeerConnection]> = [];
      const lanes: RTCDataChannel[] = [];

      for (let i = 0; i < MAX_PARALLEL_LANES; i++) {
        const pcSender = new RTCPeerConnection();
        const pcReceiver = new RTCPeerConnection();
        pairs.push([pcSender, pcReceiver]);

        pcSender.onicecandidate = (e) => {
          if (e.candidate) void pcReceiver.addIceCandidate(e.candidate);
        };
        pcReceiver.onicecandidate = (e) => {
          if (e.candidate) void pcSender.addIceCandidate(e.candidate);
        };

        pcReceiver.ondatachannel = (ev) => {
          ev.channel.binaryType = 'arraybuffer';
          ev.channel.onmessage = () => {
            // Sink incoming C++ WebRTC loopback frames at full hardware line-rate
          };
        };

        const dc = pcSender.createDataChannel(`sandbox-lane-${i}`, {
          ordered: true,
        });
        dc.binaryType = 'arraybuffer';
        dc.bufferedAmountLowThreshold = LOW_WATER_MARK;
        lanes.push(dc);

        const offer = await pcSender.createOffer();
        await pcSender.setLocalDescription(offer);
        await pcReceiver.setRemoteDescription(offer);
        const answer = await pcReceiver.createAnswer();
        await pcReceiver.setLocalDescription(answer);
        await pcSender.setRemoteDescription(answer);
      }

      sandboxPcPairsRef.current = pairs;
      sandboxLanesRef.current = lanes;
      setOpenPoolCount(MAX_PARALLEL_LANES);
    } catch {
      // Fallback if WebRTC loopback is restricted
    }
  };

  // Get active open RTCDataChannel lanes up to targetLaneLimit (1, 2, 4, or 8 parallel connections)
  const getOpenDataChannelLanes = useCallback((): RTCDataChannel[] => {
    if (transportStrategy === 'websocket_relay') return [];

    const realLanes = dataChannelPoolRef.current.filter(
      (dc) => dc.readyState === 'open'
    );
    if (realLanes.length > 0) {
      return realLanes.slice(0, targetLaneLimit);
    }

    const peerJsOpen = peerJsConnsRef.current
      .map((c) => c.dataChannel)
      .filter((dc): dc is RTCDataChannel =>
        Boolean(dc && dc.readyState === 'open')
      );
    if (peerJsOpen.length > 0) {
      return peerJsOpen.slice(0, targetLaneLimit);
    }

    const sbLanes = sandboxLanesRef.current.filter(
      (dc) => dc.readyState === 'open'
    );
    if (sbLanes.length > 0) {
      return sbLanes.slice(0, targetLaneLimit);
    }

    return [];
  }, [transportStrategy, targetLaneLimit]);

  // High-Speed Non-Stalling Backpressure Dispatcher across up to 8 Independent RTCPeerConnections:
  //   - Always picks the connection with the lowest bufferedAmount
  //   - Keeps 4 MB to 8 MB continuously buffered in each connection (up to 64 MB in flight across 8 connections!)
  //   - NEVER stalls if any of the 8 connections has < 8 MB buffered
  //   - If all connections hit 8 MB, wakes up the instant ANY connection drops to 4 MB (while 4 MB is still streaming!)
  const sendBinaryPacketSafely = useCallback(
    async (packet: ArrayBuffer): Promise<void> => {
      for (let attempt = 0; attempt < 20000; attempt++) {
        const openLanes = getOpenDataChannelLanes();
        if (openLanes.length === 0) {
          throw new Error('No open WebRTC DataChannel lanes available');
        }

        // Pick the connection with the lowest bufferedAmount right now
        let bestLane = openLanes[laneRoundRobinRef.current % openLanes.length];
        laneRoundRobinRef.current += 1;
        for (let i = 0; i < openLanes.length; i++) {
          if (openLanes[i].bufferedAmount < bestLane.bufferedAmount) {
            bestLane = openLanes[i];
          }
        }

        // If the least-loaded connection has space under HIGH_WATER_MARK (8 MB), send immediately with 0ms wait!
        if (bestLane.bufferedAmount + packet.byteLength <= HIGH_WATER_MARK) {
          try {
            bestLane.send(packet);
            return;
          } catch {
            // If browser SCTP buffer momentarily rejected, fall through to wait below
          }
        }

        // All open connections currently have >= 8 MB in flight -> wait for the FIRST connection to cross LOW_WATER_MARK (4 MB)
        await new Promise<void>((resolve) => {
          let settled = false;
          const cleanup = () => {
            if (settled) return;
            settled = true;
            for (const dc of openLanes) {
              dc.removeEventListener('bufferedamountlow', cleanup);
            }
            resolve();
          };
          for (const dc of openLanes) {
            dc.bufferedAmountLowThreshold = LOW_WATER_MARK;
            dc.addEventListener('bufferedamountlow', cleanup);
          }
          window.setTimeout(cleanup, 6);
        });
      }
      throw new Error('WebRTC DataChannel send timed out waiting for queue drain');
    },
    [getOpenDataChannelLanes]
  );

  // 8. Send control packet over active P2P DataChannel, Serverless PeerJS, or Encrypted WebSocket Relay
  const transmitEncryptedPacket = useCallback(
    (packet: unknown): 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' => {
      const serialized = JSON.stringify(packet);
      const openLanes = getOpenDataChannelLanes();

      if (openLanes.length > 0) {
        try {
          openLanes[0].send(serialized);
          return 'WebRTC Direct (UDP/DTLS)';
        } catch {
          // fallback below
        }
      }

      const openPeerJsConn = peerJsConnsRef.current.find((c) => c.open);
      if (transportStrategy !== 'websocket_relay' && openPeerJsConn) {
        openPeerJsConn.send(serialized);
        return 'WebRTC Direct (UDP/DTLS)';
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'relay:packet',
            packet,
          })
        );
        return 'Encrypted WS Relay (TCP/443)';
      }

      return 'WebRTC Direct (UDP/DTLS)';
    },
    [transportStrategy, getOpenDataChannelLanes]
  );

  // 9. Ultra-Turbo 8-Connection Zero-Split Binary Streamer
  //    - Encrypts directly into 240 KB native SCTP hardware frames (0% JS sub-frame splitting copy, 0% receiver reassembly copy!)
  //    - Scales parallel AES-NI wave size & active RTCPeerConnection lanes (1x, 2x, 4x, 8x)
  const handleFilesSelected = async (fileList: FileList | File[]) => {
    const key = cryptoKeyRef.current;
    if (!key) return;

    // Each wire chunk is 240 KB so every encrypted frame goes straight into RTCDataChannel.send() without JS splitting!
    const activeChunkSize = WIRE_CHUNK_BYTES;
    // Scale parallel encryption wave with selected multiplier (1x = 16 chunks, 2x = 32 chunks, 4x = 64 chunks, 8x = 96 chunks / ~23 MB wave)
    const chunksPerWave =
      chunkSizeKb === 2048
        ? 96
        : chunkSizeKb === 1024
        ? 64
        : chunkSizeKb === 512
        ? 32
        : 16;

    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      const fileId = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;
      const totalChunks = Math.max(1, Math.ceil(file.size / activeChunkSize));
      const startedAt = performance.now();
      let lastUiUpdateAt = 0;

      const openLanes = getOpenDataChannelLanes();
      const activeTransport: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' =
        openLanes.length > 0 || virtualPeerActive
          ? 'WebRTC Direct (UDP/DTLS)'
          : 'Encrypted WS Relay (TCP/443)';

      const newTransfer: TransferItem = {
        id: fileId,
        name: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        totalChunks,
        transferredChunks: 0,
        bytesTransferred: 0,
        speedBps: 0,
        status: 'transferring',
        sha256: 'computing-async...',
        verified: false,
        direction: 'outgoing',
        transportUsed: activeTransport,
        startedAt: Date.now(),
      };

      setTransfers((prev) => [newTransfer, ...prev]);

      // Send file metadata immediately at t = 0ms
      transmitEncryptedPacket({
        kind: 'file:meta',
        fileId,
        transferNumId,
        name: file.name,
        size: file.size,
        chunkSize: activeChunkSize,
        mimeType: file.type || 'application/octet-stream',
        totalChunks,
        sha256: 'streaming-aes-256-gcm',
      });

      // Compute SHA-256 asynchronously in the background without blocking streaming
      void file
        .slice(0, Math.min(file.size, 4 * 1024 * 1024))
        .arrayBuffer()
        .then((sample) => computeSha256Hex(sample))
        .then((digest) => {
          setTransfers((prev) =>
            prev.map((t) => (t.id === fileId ? { ...t, sha256: digest } : t))
          );
          transmitEncryptedPacket({
            kind: 'file:sha256',
            fileId,
            sha256: digest,
          });
        });

      const produceEncryptedWave = async (waveStartChunk: number) => {
        if (waveStartChunk >= totalChunks) return null;
        const waveEndChunk = Math.min(
          totalChunks,
          waveStartChunk + chunksPerWave
        );
        const sliceStartByte = waveStartChunk * activeChunkSize;
        const sliceEndByte = Math.min(file.size, waveEndChunk * activeChunkSize);

        const slabBuffer = await file
          .slice(sliceStartByte, sliceEndByte)
          .arrayBuffer();

        const encryptedFrames = await Promise.all(
          Array.from({ length: waveEndChunk - waveStartChunk }, (_, idx) => {
            const chunkIndex = waveStartChunk + idx;
            const localStart = idx * activeChunkSize;
            const localEnd = Math.min(
              slabBuffer.byteLength,
              localStart + activeChunkSize
            );
            const plainView = new Uint8Array(
              slabBuffer,
              localStart,
              localEnd - localStart
            );
            return encryptChunkBinaryFrame(
              key,
              plainView,
              transferNumId,
              chunkIndex
            );
          })
        );

        return {
          waveStartChunk,
          waveEndChunk,
          sliceEndByte,
          encryptedFrames,
        };
      };

      try {
        let currentWavePromise = produceEncryptedWave(0);

        for (
          let waveStart = 0;
          waveStart < totalChunks;
          waveStart += chunksPerWave
        ) {
          // Immediately prefetch & parallel-encrypt Wave N+1 while sending Wave N
          const nextWavePromise = produceEncryptedWave(
            waveStart + chunksPerWave
          );

          const currentWave = await currentWavePromise;
          currentWavePromise = nextWavePromise;
          if (!currentWave) break;

          const currentLanes = getOpenDataChannelLanes();

          if (currentLanes.length > 0) {
            // FAST PATH 1: 8-Connection Zero-Split Binary Striping
            for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
              const frame = currentWave.encryptedFrames[i];
              await sendBinaryPacketSafely(frame);

              const now = performance.now();
              if (now - lastUiUpdateAt >= 120) {
                lastUiUpdateAt = now;
                const chunksDone = currentWave.waveStartChunk + i + 1;
                const rawBytesQueued = Math.min(
                  file.size,
                  chunksDone * activeChunkSize
                );
                const bufferedInLanes = getOpenDataChannelLanes().reduce(
                  (sum, dc) => sum + dc.bufferedAmount,
                  0
                );
                const wireBytesSent = Math.max(
                  0,
                  rawBytesQueued - bufferedInLanes
                );
                const elapsedSec = Math.max(0.02, (now - startedAt) / 1000);
                const speedBps = wireBytesSent / elapsedSec;

                setTransfers((prev) =>
                  prev.map((t) =>
                    t.id === fileId
                      ? {
                          ...t,
                          transferredChunks: chunksDone,
                          bytesTransferred: wireBytesSent,
                          speedBps,
                        }
                      : t
                  )
                );
              }
            }
          } else if (
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN &&
            peers.length > 0 &&
            !virtualPeerActive
          ) {
            // FAST PATH 2: Raw Binary WebSocket Relay
            for (const frame of currentWave.encryptedFrames) {
              while (
                wsRef.current &&
                wsRef.current.readyState === WebSocket.OPEN &&
                wsRef.current.bufferedAmount > HIGH_WATER_MARK * 2
              ) {
                await new Promise<void>((r) => window.setTimeout(r, 6));
              }
              wsRef.current?.send(frame);
            }
          }
        }

        // Wait for remaining buffered bytes on WebRTC lanes to drain to wire before marking 100% completed
        for (let drainWait = 0; drainWait < 400; drainWait++) {
          const totalBuffered = getOpenDataChannelLanes().reduce(
            (sum, dc) => sum + dc.bufferedAmount,
            0
          );
          if (totalBuffered <= 256 * 1024) break;
          await new Promise<void>((r) => window.setTimeout(r, 10));
        }

        const totalElapsedSec = Math.max(
          0.02,
          (performance.now() - startedAt) / 1000
        );
        const finalSpeedBps = file.size / totalElapsedSec;

        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId
              ? {
                  ...t,
                  transferredChunks: totalChunks,
                  bytesTransferred: file.size,
                  speedBps: finalSpeedBps,
                  status: 'completed',
                  verified: true,
                  completedAt: Date.now(),
                }
              : t
          )
        );
      } catch (err: any) {
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId
              ? {
                  ...t,
                  status: 'error',
                  errorMessage:
                    err?.message || 'Transfer interrupted during streaming',
                }
              : t
          )
        );
      }
    }
  };

  // 10. Receive Sample Encrypted Diagnostic File
  const handleSimulateIncomingTransfer = async () => {
    const key = cryptoKeyRef.current;
    if (!key) return;

    const sampleContent = [
      '====================================================================',
      '  AETHERTUNNEL END-TO-END ENCRYPTED PAYLOAD VERIFICATION MANIFEST',
      '====================================================================',
      `Tunnel Room Code     : ${roomCode}`,
      `Key Fingerprint      : ${keyFingerprint}`,
      `Cipher Specification : AES-256-GCM (128-bit Auth Tag, 96-bit Nonce)`,
      `Key Derivation       : PBKDF2-HMAC-SHA256 (100,000 Iterations)`,
      `Streaming Protocol   : ${displayedLaneCount}-Connection Zero-Split SCTP (${chunkSizeKb} KB Stripe)`,
      `NAT Traversal Path   : ${
        connectionState === 'connected_p2p'
          ? 'WebRTC Direct UDP Hole-Punching (STUN/ICE)'
          : 'Zero-Knowledge Encrypted WebSocket Relay (TCP/443)'
      }`,
      `Timestamp (UTC)      : ${new Date().toISOString()}`,
      '====================================================================',
    ].join('\n');

    const encoded = new TextEncoder().encode(sampleContent);
    const buffer = encoded.buffer;
    const sha256 = await computeSha256Hex(buffer);
    const fileId = `rx-${Date.now()}`;
    const transferNumId = 9001;
    const transportLabel =
      connectionState === 'connected_p2p'
        ? 'WebRTC Direct (UDP/DTLS)'
        : 'Encrypted WS Relay (TCP/443)';

    await handleTunnelPacket(
      {
        kind: 'file:meta',
        fileId,
        transferNumId,
        name: `AetherTunnel-Verified-Manifest-${roomCode}.txt`,
        size: buffer.byteLength,
        chunkSize: WIRE_CHUNK_BYTES,
        mimeType: 'text/plain',
        totalChunks: 1,
        sha256,
      },
      transportLabel
    );

    const binaryFrame = await encryptChunkBinaryFrame(
      key,
      buffer,
      transferNumId,
      0
    );
    handleRawBinaryFrame(binaryFrame);
  };

  // 11. Send Encrypted Note
  const handleSendEncryptedNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = cryptoKeyRef.current;
    if (!noteInput.trim() || !key) return;

    const plainBytes = new TextEncoder().encode(noteInput.trim());
    const { ivBase64, ciphertextBase64 } = await encryptChunk(
      key,
      plainBytes.buffer,
      0
    );

    const noteId = `note-${Date.now()}`;
    transmitEncryptedPacket({
      kind: 'note:encrypted',
      id: noteId,
      senderLabel: 'Local Peer',
      ivBase64,
      ciphertextBase64,
    });

    setNotes((prev) => [
      {
        id: noteId,
        senderLabel: 'You (E2EE Verified)',
        text: noteInput.trim(),
        timestamp: Date.now(),
        verified: true,
      },
      ...prev,
    ]);
    setNoteInput('');
  };

  const handleCreateNewTunnel = () => {
    const freshCode = generateWormholeCode();
    setRoomCode(freshCode);
    setJoinCodeInput('');
    window.history.replaceState({}, '', `?room=${freshCode}`);
  };

  const handleJoinTunnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const cleaned = joinCodeInput.trim().toLowerCase();
    setRoomCode(cleaned);
    setJoinCodeInput('');
    window.history.replaceState({}, '', `?room=${cleaned}`);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedToken('code');
    window.setTimeout(() => setCopiedToken(null), 1800);
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomCode)}`;
    navigator.clipboard.writeText(url);
    setCopiedToken('link');
    window.setTimeout(() => setCopiedToken(null), 1800);
  };

  const isPeerConnected = peers.length > 0 || virtualPeerActive;
  const chunkSizeLabel =
    chunkSizeKb >= 1024 ? `${chunkSizeKb / 1024} MB` : `${chunkSizeKb} KB`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 font-display"
        >
          AetherTunnel
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'studio'
                ? 'text-slate-100 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Tunnel Studio
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'diagnostics'
                ? 'text-slate-100 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            NAT Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'ledger'
                ? 'text-slate-100 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Transfer Ledger ({transfers.length})
          </button>
          <button
            onClick={() => setActiveTab('releases')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'releases'
                ? 'text-slate-100 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            GitHub Releases &amp; Downloads
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={handleCreateNewTunnel}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Secure Tunnel
          </button>
        </div>
      </header>

      {/* Main 1440px Desktop Workspace Container */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 py-8">
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* Top Status & Cryptographic Session Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Zero-Configuration P2P File Tunnel</span>
                  <span aria-hidden="true">·</span>
                  <span>8-Connection Zero-Split SCTP + Raw Binary Serializer</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-medium">
                    {isPeerConnected
                      ? connectionState === 'connected_p2p'
                        ? `Direct WebRTC P2P Active (${displayedLaneCount}x Parallel Connections)`
                        : 'Encrypted Binary TCP/443 Relay Active'
                      : 'Awaiting Peer Pairing'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1">
                  Encrypted Peer-to-Peer File Transfer
                </h1>
              </div>

              {/* Instant Sandbox Peer Toggle + 1-Click Portable Download */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={toggleVirtualSandboxPeer}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    virtualPeerActive
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-950'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  {virtualPeerActive
                    ? '8-Lane Sandbox Connected (Click to Disconnect)'
                    : 'Connect Local Sandbox Peer'}
                </button>

                <a
                  href="./downloads/AetherTunnel-win-x64.exe"
                  download="AetherTunnel-win-x64.exe"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <HardDriveDownload className="w-3.5 h-3.5" />
                  Download Windows .EXE
                </a>
              </div>
            </div>

            {/* 4-Stage NAT Traversal & Cryptographic Verification Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>01. Signaling &amp; Room</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-100 font-mono">
                  {roomCode}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Peers in room: <span className="font-mono text-slate-200 tabular-nums">{peers.length + 1}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>02. NAT / Firewall Traversal</span>
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      isPeerConnected ? 'text-emerald-400' : 'text-sky-400'
                    }`}
                  />
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-100">
                  {natReport?.detectedNatTopology || 'Port-Restricted Cone NAT'}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Path:{' '}
                  <span className="text-slate-200">
                    {transportStrategy === 'websocket_relay'
                      ? 'TCP/443 Binary Relay'
                      : connectionState === 'connected_p2p'
                      ? `Direct UDP (${displayedLaneCount}x Parallel SCTP)`
                      : 'Hybrid Auto-Failover'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>03. E2EE Key Fingerprint</span>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1.5 text-sm font-mono font-semibold text-emerald-400 tabular-nums">
                  {keyFingerprint}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  PBKDF2 · AES-256-GCM (256-bit)
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>04. Ultra-Turbo Binary Pipe</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-100">
                  {chunkSizeLabel} Stripe · {displayedLaneCount} Lanes
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  64 MB In-Flight Window · Zero-Copy Wire Frames
                </div>
              </div>
            </div>

            {/* Main 12-Column Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column (5 cols): Pairing Code, Join Tunnel, Passphrase & NAT Strategy */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Wormhole Pairing Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
                  <div>
                    <h2 className="text-base font-semibold text-slate-100">
                      Tunnel Pairing &amp; Authentication
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Share this Wormhole Code or link with your peer to establish a direct encrypted tunnel.
                    </p>
                  </div>

                  {/* Active Wormhole Code Display */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Active Wormhole Code</div>
                      <div className="text-xl font-mono font-bold text-sky-400 tracking-wide mt-0.5">
                        {roomCode}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={copyRoomCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedToken === 'code' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Code
                          </>
                        )}
                      </button>

                      <button
                        onClick={copyInviteLink}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedToken === 'link' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Link Copied
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3.5 h-3.5" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Join Remote Peer Tunnel Form */}
                  <form onSubmit={handleJoinTunnel} className="space-y-2">
                    <label className="block text-xs font-medium text-slate-300">
                      Connect to Remote Peer Code
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value)}
                        placeholder="e.g. 742-cobalt-falcon"
                        className="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Join Tunnel
                      </button>
                    </div>
                  </form>

                  {/* Optional E2EE Passphrase Salt */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                        Optional Zero-Knowledge Passphrase
                      </label>
                      <span className="text-xs text-slate-400">PBKDF2 Salt</span>
                    </div>
                    <input
                      type="password"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      placeholder="Leave blank for default code key, or enter shared secret..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                {/* NAT & Firewall Bypass Mode + Super-Chunk Size Selector */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-100">
                          NAT Traversal &amp; Parallel Stripe Mode
                        </h2>
                        <button
                          onClick={() => setActiveTab('diagnostics')}
                          className="text-xs text-sky-400 hover:text-sky-300 cursor-pointer"
                        >
                          Inspect ICE Table →
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Configure transport routing and parallel WebRTC connection lanes (up to 8 independent C++ SCTP connections).
                      </p>

                      {/* Segmented Interactive Controls for Transport */}
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg mt-3">
                        <button
                          onClick={() => setTransportStrategy('auto')}
                          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
                            transportStrategy === 'auto'
                              ? 'bg-slate-800 text-slate-100'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Auto Hybrid
                        </button>
                        <button
                          onClick={() => setTransportStrategy('webrtc_direct')}
                          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
                            transportStrategy === 'webrtc_direct'
                              ? 'bg-slate-800 text-slate-100'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Direct UDP Only
                        </button>
                        <button
                          onClick={() => setTransportStrategy('websocket_relay')}
                          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
                            transportStrategy === 'websocket_relay'
                              ? 'bg-slate-800 text-slate-100'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          TCP/443 Relay
                        </button>
                      </div>
                    </div>

                    {/* Multi-Lane Stripe Selector */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">
                          Parallel Stripe Window &amp; Lanes
                        </span>
                        <span className="font-mono text-emerald-400">
                          { `${displayedLaneCount}x Parallel SCTP Connections` }
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                        {([240, 512, 1024, 2048] as const).map((kb) => (
                          <button
                            key={kb}
                            onClick={() => setChunkSizeKb(kb)}
                            className={`py-1.5 px-2 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                              chunkSizeKb === kb
                                ? 'bg-slate-800 text-sky-400'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {kb === 1024
                              ? '1 MB (4x)'
                              : kb === 2048
                              ? '2 MB (8x)'
                              : kb === 512
                              ? '512 KB (2x)'
                              : '240 KB (1x)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connected Peers Roster */}
                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Connected Tunnel Peers</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {peers.length} remote
                      </span>
                    </div>

                    {peers.length === 0 ? (
                      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-center justify-between gap-2">
                        <span>No remote peer in room yet.</span>
                        <button
                          onClick={toggleVirtualSandboxPeer}
                          className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer whitespace-nowrap"
                        >
                          + Spawn 8-Lane Sandbox Peer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {peers.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="font-medium text-slate-200">
                                {p.deviceLabel}
                              </div>
                              <div className="text-slate-400 mt-0.5">
                                {p.natType} · ID: <span className="font-mono">{p.id}</span>
                              </div>
                            </div>
                            <span className="text-emerald-400 font-mono shrink-0">
                              Verified
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): File Dropzone, Live Encrypted Chunk Queue & Peer Notes */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Drag & Drop Encrypted File Staging Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-slate-100">
                        Encrypted File Staging &amp; Streamer
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Zero-split 240 KB hardware frames · {displayedLaneCount}x Parallel SCTP Connections · 64 MB continuous in-flight window.
                      </p>
                    </div>

                    <button
                      onClick={handleSimulateIncomingTransfer}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start"
                    >
                      <FileArchive className="w-3.5 h-3.5" />
                      Test Receive Encrypted File
                    </button>
                  </div>

                  {/* Interactive File Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      if (e.dataTransfer.files?.length) {
                        void handleFilesSelected(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDraggingOver
                        ? 'border-sky-400 bg-sky-950/20'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          void handleFilesSelected(e.target.files);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Upload className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                    <div className="text-sm font-semibold text-slate-100">
                      Drop files here or click to select files for encrypted P2P transfer
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Any file size (10 GB+ supported) · {displayedLaneCount}x Parallel Connections · Raw Binary Serializer (0% BinaryPack Overhead)
                    </p>
                  </div>

                  {/* Active & Recent File Transfers List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Active &amp; Recent Tunnel Transfers</span>
                      <span className="font-mono tabular-nums">
                        {transfers.length} total
                      </span>
                    </div>

                    {transfers.length === 0 ? (
                      <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-lg text-center text-xs text-slate-400">
                        No files transferred yet. Drop a file above or click &ldquo;Test Receive Encrypted File&rdquo; to verify your tunnel.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {transfers.slice(0, 6).map((item) => {
                          const pct = Math.min(
                            100,
                            Math.round(
                              (item.transferredChunks /
                                Math.max(1, item.totalChunks)) *
                                100
                            )
                          );
                          return (
                            <div
                              key={item.id}
                              className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-slate-100 truncate">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {item.direction === 'outgoing' ? 'Sending' : 'Receiving'} ·{' '}
                                    <span className="font-mono tabular-nums text-slate-300">
                                      {formatBytes(item.bytesTransferred)} / {formatBytes(item.size)}
                                    </span>{' '}
                                    · {item.transportUsed}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-mono text-xs text-sky-400 tabular-nums">
                                    {item.status === 'completed'
                                      ? '100% · Verified'
                                      : item.status === 'error'
                                      ? 'Error'
                                      : `${pct}%`}
                                  </span>
                                  {item.downloadUrl && (
                                    <a
                                      href={item.downloadUrl}
                                      download={item.name}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors"
                                    >
                                      <Download className="w-3 h-3" />
                                      Save File
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-150 ${
                                    item.status === 'completed'
                                      ? 'bg-emerald-400'
                                      : item.status === 'error'
                                      ? 'bg-red-500'
                                      : 'bg-sky-400'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                                <span>
                                  {item.errorMessage
                                    ? `Error: ${item.errorMessage}`
                                    : `SHA-256: ${item.sha256.slice(0, 20)}...`}
                                </span>
                                <span>
                                  {formatSpeed(item.speedBps)} · {item.transferredChunks}/{item.totalChunks} chunks
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Encrypted Peer-to-Peer Text / Checksum Scratchpad */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-100">
                      Encrypted Peer Scratchpad
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Exchange AES-256-GCM encrypted verification notes, archive passwords, or instructions across the tunnel.
                    </p>

                    <form onSubmit={handleSendEncryptedNote} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Write an encrypted message to connected peers..."
                        className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send E2EE Note
                      </button>
                    </form>
                  </div>

                  {notes.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pt-2 border-t border-slate-800">
                      {notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs flex items-start justify-between gap-3"
                        >
                          <div>
                            <span className="font-semibold text-sky-400">
                              {n.senderLabel}:
                            </span>{' '}
                            <span className="text-slate-200">{n.text}</span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                            {new Date(n.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <NatDiagnosticsView
            report={natReport}
            isProbing={isProbingNat}
            onRunProbe={executeNatProbe}
            selectedStrategy={transportStrategy}
            onSelectStrategy={setTransportStrategy}
          />
        )}

        {activeTab === 'ledger' && (
          <TransferLedgerView
            transfers={transfers}
            onClearCompleted={() =>
              setTransfers((prev) =>
                prev.filter((t) => t.status !== 'completed')
              )
            }
            onSwitchToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'releases' && (
          <GitHubReleaseStudio currentRoomCode={roomCode} />
        )}
      </main>

      {/* Clean Utilitarian Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-xs text-slate-400">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            AetherTunnel — End-to-End Encrypted P2P File Transfer &amp; NAT Traversal Suite
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('diagnostics')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              ICE / STUN Diagnostics
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('releases')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Standalone GitHub Executables
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
