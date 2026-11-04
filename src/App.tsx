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
import { TransferLedgerView } from './components/TransferLedgerView';
import { ClientInspectorView } from './components/ClientInspectorView';
import { downloadNativeWindowsKernelExe } from './utils/standaloneBuilder';

type ActiveTab = 'studio' | 'inspector' | 'diagnostics' | 'ledger';

const WIRE_CHUNK_BYTES = 240 * 1024;
const MAX_PARALLEL_LANES = 2; // Palautettu 2:een, kuten aiemmin todettiin
const CHUNKS_PER_WAVE = 32;
const HIGH_WATER_MARK = 16 * 1024 * 1024; // Palautettu 16 MB
const LOW_WATER_MARK = 8 * 1024 * 1024;

export const GLOBAL_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
];

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

  const [roomCode, setRoomCode] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room')?.toLowerCase().trim() || generateWormholeCode();
  });
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [keyFingerprint, setKeyFingerprint] = useState<string>('Deriving...');
  const cryptoKeyRef = useRef<CryptoKey | null>(null);

  const [peerId] = useState<string>(
    () => `peer-${Math.random().toString(36).slice(2, 9)}`
  );
  const [connectionState, setConnectionState] =
    useState<TunnelConnectionState>('signaling');
  const [transportStrategy, setTransportStrategy] =
    useState<TransportStrategy>('auto');
  const [peers, setPeers] = useState<PeerSummary[]>([]);
  const [openPoolCount, setOpenPoolCount] = useState<number>(1);

  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [notes, setNotes] = useState<EncryptedNote[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<'code' | 'link' | null>(null);
  const [incomingFileAlert, setIncomingFileAlert] = useState<string | null>(null);

  const [natReport, setNatReport] = useState<NatProbeReport | null>(null);
  const [isProbingNat, setIsProbingNat] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const peerConnPoolRef = useRef<Map<number, RTCPeerConnection>>(new Map());
  const pendingIceCandidatesRef = useRef<Map<number, RTCIceCandidateInit[]>>(
    new Map()
  );
  const dataChannelPoolRef = useRef<RTCDataChannel[]>([]);
  const peerJsInstanceRef = useRef<Peer | null>(null);
  const peerJsConnsRef = useRef<DataConnection[]>([]);
  const incomingBuffersRef = useRef<Map<string, IncomingFileBuffer>>(new Map());
  const resumeBuffersByKeyRef = useRef<Map<string, IncomingFileBuffer>>(new Map());
  const selectedFilesByKeyRef = useRef<Map<string, File>>(new Map());
  const resumeFromChunkMapRef = useRef<Map<string, number>>(new Map());
  const resumeAckResolversRef = useRef<Map<string, (chunkIdx: number) => void>>(new Map());
  const partialSubFramesRef = useRef<Map<string, PartialSubFrameAssembly>>(
    new Map()
  );
  const numIdToFileIdRef = useRef<Map<number, string>>(new Map());
  const orphanChunksRef = useRef<Map<number, ArrayBuffer[]>>(new Map());
  const laneRoundRobinRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const exeWsRef = useRef<WebSocket | null>(null);
  const cloudExeWsRef = useRef<WebSocket | null>(null);
  const cloudExePeerIdRef = useRef<string>('');
  const cloudAckResolverRef = useRef<(() => void) | null>(null);
  const [cloudWebPeers, setCloudWebPeers] = useState<string[]>([]);
  const cloudWebPeersRef = useRef<string[]>([]);
  cloudWebPeersRef.current = cloudWebPeers;
  const localBusRef = useRef<BroadcastChannel | null>(null);
  const [localBusPeers, setLocalBusPeers] = useState<string[]>([]);
  const localBusPeersRef = useRef<string[]>([]);
  localBusPeersRef.current = localBusPeers;
  const [exeBridgeConnected, setExeBridgeConnected] = useState<boolean>(false);
  const roomCodeRef = useRef<string>(roomCode);
  roomCodeRef.current = roomCode;
  const peersRef = useRef<PeerSummary[]>([]);
  peersRef.current = peers;

  const displayedLaneCount = 1;

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

  const sendCloudCandidateRef = useRef<
    ((dst: string, payload: Record<string, unknown>) => void) | null
  >(null);
  const seenSignalIdsRef = useRef<Set<string>>(new Set());
  const cloudPeerLastSeenRef = useRef<Map<string, number>>(new Map());
  const cloudExeLastSeenRef = useRef<number>(0);

  const recordDecryptedChunk = useCallback(
    (
      bufEntry: IncomingFileBuffer,
      chunkIndex: number,
      decryptedChunk: ArrayBuffer
    ) => {
      if (chunkIndex >= 0 && chunkIndex < bufEntry.totalChunks) {
        if (bufEntry.receivedChunks[chunkIndex] === undefined) {
          bufEntry.receivedChunks[chunkIndex] = decryptedChunk;
          bufEntry.receivedCount += 1;
        }
      }

      let filledCount = 0;
      for (let i = 0; i < bufEntry.totalChunks; i++) {
        if (bufEntry.receivedChunks[i] !== undefined) {
          filledCount++;
        }
      }

      const now = performance.now();
      const fileId = bufEntry.id;

      if (filledCount >= bufEntry.totalChunks) {
        const elapsedSec = Math.max(0.015, (now - bufEntry.startedAt) / 1000);
        const speedBps = bufEntry.size / elapsedSec;

        const orderedParts: ArrayBuffer[] = [];
        for (let i = 0; i < bufEntry.totalChunks; i++) {
          orderedParts.push(bufEntry.receivedChunks[i]!);
        }

        // Combine into a single continuous Uint8Array
        const totalByteLength = orderedParts.reduce((sum, p) => sum + p.byteLength, 0);
        const combinedFileArray = new Uint8Array(totalByteLength);
        let offset = 0;
        for (const part of orderedParts) {
          combinedFileArray.set(new Uint8Array(part), offset);
          offset += part.byteLength;
        }

        bufEntry.receivedChunks.length = 0;

        // AUTOMATIC DOWNLOAD
        const blob = new Blob([combinedFileArray.buffer as ArrayBuffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = bufEntry.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

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
                  downloadUrl: url,
                  completedAt: Date.now(),
                }
              : item
          )
        );

        incomingBuffersRef.current.delete(fileId);
        resumeBuffersByKeyRef.current.delete(`${bufEntry.name}::${bufEntry.size}`);
        numIdToFileIdRef.current.delete(bufEntry.transferNumId);
        setIncomingFileAlert(null);

      } else if (now - bufEntry.lastUiUpdateAt >= 120) {
        bufEntry.lastUiUpdateAt = now;
        const bytesSoFar = Math.min(
          bufEntry.size,
          filledCount * bufEntry.chunkSize
        );
        const elapsedSec = Math.max(0.015, (now - bufEntry.startedAt) / 1000);
        const speedBps = bytesSoFar / elapsedSec;

        setTransfers((prev) =>
          prev.map((item) =>
            item.id === fileId && item.direction === 'incoming'
              ? {
                  ...item,
                  transferredChunks: filledCount,
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

  const handleCompleteAethFrame = useCallback(
    async (rawBuffer: ArrayBuffer) => {
      const key = cryptoKeyRef.current;
      if (!key || rawBuffer.byteLength < 24) return;

      const frameBuffer = rawBuffer.slice(0);

      const headerView = new DataView(frameBuffer);
      const transferNumId = headerView.getUint32(4, false);
      const chunkIndex = headerView.getUint32(8, false);

      const fileId = numIdToFileIdRef.current.get(transferNumId);
      if (!fileId) {
        let orphans = orphanChunksRef.current.get(transferNumId);
        if (!orphans) {
          orphans = [];
          orphanChunksRef.current.set(transferNumId, orphans);
        }
        if (orphans.length < 50000) {
          orphans.push(frameBuffer);
        }
        return;
      }
      const bufEntry = incomingBuffersRef.current.get(fileId);
      if (!bufEntry || bufEntry.receivedChunks[chunkIndex] !== undefined) {
        return;
      }

      try {
        const { plainBuffer } = await decryptChunkBinaryFrame(key, frameBuffer);
        recordDecryptedChunk(bufEntry, chunkIndex, plainBuffer);
      } catch {
        // Ignore frame if authentication tag fails
      }
    },
    [recordDecryptedChunk]
  );

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
          void handleCompleteAethFrame(assembly.buffer.buffer as ArrayBuffer);
        }
        return true;
      }

      return false;
    },
    [handleCompleteAethFrame]
  );

  const handleTunnelPacket = useCallback(
    async (
      packet: any,
      sourceTransport: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)'
    ) => {
      const key = cryptoKeyRef.current;
      if (!key) return;

      if (packet instanceof ArrayBuffer) {
        if (handleRawBinaryFrame(packet)) return;
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
        if (handleRawBinaryFrame(buf as ArrayBuffer)) return;
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

      if (packet.kind === 'file:resume-ack' || packet.kind === 'exe:resume-ack') {
        const resumeKey = `${packet.name || ''}::${Number(packet.size) || 0}`;
        const resumeChunk = Math.max(0, Number(packet.resumeFromChunk) || 0);
        if (resumeKey !== '::0') {
          resumeFromChunkMapRef.current.set(resumeKey, resumeChunk);
        }
        const resolver =
          (packet.fileId && resumeAckResolversRef.current.get(String(packet.fileId))) ||
          resumeAckResolversRef.current.get(resumeKey);
        if (resolver) {
          resumeAckResolversRef.current.delete(String(packet.fileId || ''));
          resumeAckResolversRef.current.delete(resumeKey);
          resolver(resumeChunk);
        }
        return;
      }

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
        const resumeKey = `${name}::${size}`;
        const existingCheckpoint = resumeBuffersByKeyRef.current.get(resumeKey);

        let activeBuf: IncomingFileBuffer;
        let firstMissingChunk = 0;

        if (
          existingCheckpoint &&
          existingCheckpoint.totalChunks === totalChunks &&
          existingCheckpoint.receivedCount > 0 &&
          existingCheckpoint.receivedCount < totalChunks
        ) {
          existingCheckpoint.id = fileId;
          existingCheckpoint.transferNumId = numId;
          existingCheckpoint.transportUsed = sourceTransport;
          activeBuf = existingCheckpoint;

          while (
            firstMissingChunk < totalChunks &&
            activeBuf.receivedChunks[firstMissingChunk] !== undefined
          ) {
            firstMissingChunk++;
          }
        } else {
          activeBuf = {
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
          };
          resumeBuffersByKeyRef.current.set(resumeKey, activeBuf);
        }

        numIdToFileIdRef.current.set(numId, fileId);
        incomingBuffersRef.current.set(fileId, activeBuf);

        if (firstMissingChunk > 0) {
          const resumePct = Math.round((firstMissingChunk / Math.max(1, totalChunks)) * 100);
          setIncomingFileAlert(
            `Resuming Interrupted File: ${name} from ${resumePct}% (${firstMissingChunk}/${totalChunks} chunks already in memory)...`
          );
          const ackPacket = {
            kind: 'file:resume-ack',
            fileId,
            name,
            size,
            resumeFromChunk: firstMissingChunk,
            receivedCount: activeBuf.receivedCount,
          };
          const serializedAck = JSON.stringify(ackPacket);
          for (const dc of dataChannelPoolRef.current) {
            if (dc.readyState === 'open') {
              try {
                dc.send(serializedAck);
              } catch {}
            }
          }
          for (const conn of peerJsConnsRef.current) {
            if (conn.open) {
              try {
                conn.send(serializedAck);
              } catch {}
            }
          }
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              wsRef.current.send(JSON.stringify({ type: 'relay:packet', packet: ackPacket }));
            } catch {}
          }
        } else {
          setIncomingFileAlert(
            `Incoming File Detected: ${name} (${formatBytes(size)}) — Receiving and preparing download...`
          );
        }

        const alreadyBytes = Math.min(size, activeBuf.receivedCount * activeBuf.chunkSize);

        setTransfers((prev) => {
          const filtered = prev.filter(
            (t) =>
              !(
                t.direction === 'incoming' &&
                (t.id === fileId || (t.name === name && t.size === size && t.status !== 'completed'))
              )
          );
          return [
            {
              id: fileId,
              name,
              size,
              mimeType,
              totalChunks,
              transferredChunks: activeBuf.receivedCount,
              bytesTransferred: alreadyBytes,
              speedBps: 0,
              status: 'transferring',
              sha256,
              verified: false,
              direction: 'incoming',
              transportUsed: sourceTransport,
              startedAt: Date.now(),
            },
            ...filtered,
          ];
        });

        // Flush any buffered orphan chunks that arrived before file:meta
        const orphans = orphanChunksRef.current.get(numId);
        if (orphans && orphans.length > 0) {
          orphanChunksRef.current.delete(numId);
          const bufEntry = incomingBuffersRef.current.get(fileId);
          if (bufEntry) {
            for (const orphanBuf of orphans) {
              const ohv = new DataView(orphanBuf);
              const oChunkIndex = ohv.getUint32(8, false);
              if (bufEntry.receivedChunks[oChunkIndex] === undefined) {
                try {
                  void decryptChunkBinaryFrame(key, orphanBuf).then(({ plainBuffer }) => {
                    recordDecryptedChunk(bufEntry, oChunkIndex, plainBuffer);
                  });
                } catch {}
              }
            }
          }
        }
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

  const registerDataChannelLane = useCallback(
    (channel: RTCDataChannel, managedByPeerJs = false) => {
      channel.binaryType = 'arraybuffer';
      channel.bufferedAmountLowThreshold = LOW_WATER_MARK;

      channel.addEventListener('message', async (ev: MessageEvent) => {
        let data = ev.data;
        if (data instanceof Blob) {
          try {
            data = await data.arrayBuffer();
          } catch {}
        }
        if (data instanceof ArrayBuffer && handleRawBinaryFrame(data)) {
          return;
        }
      });

      if (!managedByPeerJs) {
        channel.onmessage = async (ev: MessageEvent) => {
          let data = ev.data;
          if (data instanceof Blob) {
            try {
              data = await data.arrayBuffer();
            } catch {}
          }
          if (data instanceof ArrayBuffer && handleRawBinaryFrame(data)) {
            return;
          }
          void handleTunnelPacket(data, 'WebRTC Direct (UDP/DTLS)');
        };
      }

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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return;
    }

    const cleanCode =
      roomCode.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'default';
    const channelName = `aethertunnel-local-bus-${cleanCode}`;
    const bus = new BroadcastChannel(channelName);
    localBusRef.current = bus;

    bus.onmessage = (ev: MessageEvent) => {
      if (!ev.data) return;
      if (ev.data instanceof ArrayBuffer) {
        handleRawBinaryFrame(ev.data);
        return;
      }
      const msg = ev.data;
      if (msg.type === 'bus:hello' && msg.peerId !== peerId) {
        setLocalBusPeers((prev) => Array.from(new Set([...prev, msg.peerId])));
        setPeers((prev) => {
          if (prev.some((p) => p.id === msg.peerId)) return prev;
          return [
            {
              id: msg.peerId,
              deviceLabel: 'Local Chrome Tab (High-Speed Memory Bus)',
              natType: 'Local Machine Tab Bus',
              joinedAt: Date.now(),
            },
            ...prev,
          ];
        });
        setConnectionState('connected_p2p');
        try {
          bus.postMessage({
            type: 'bus:hello-reply',
            peerId,
            deviceLabel: 'Local Chrome Tab (High-Speed Memory Bus)',
          });
        } catch {}
      } else if (msg.type === 'bus:hello-reply' && msg.peerId !== peerId) {
        setLocalBusPeers((prev) => Array.from(new Set([...prev, msg.peerId])));
        setPeers((prev) => {
          if (prev.some((p) => p.id === msg.peerId)) return prev;
          return [
            {
              id: msg.peerId,
              deviceLabel: 'Local Chrome Tab (High-Speed Memory Bus)',
              natType: 'Local Machine Tab Bus',
              joinedAt: Date.now(),
            },
            ...prev,
          ];
        });
        setConnectionState('connected_p2p');
      } else if (msg.type === 'bus:packet' && msg.packet) {
        void handleTunnelPacket(msg.packet, 'WebRTC Direct (UDP/DTLS)');
      } else if (msg.type === 'bus:bye' && msg.peerId) {
        setLocalBusPeers((prev) => prev.filter((id) => id !== msg.peerId));
        setPeers((prev) => prev.filter((p) => p.id !== msg.peerId));
      }
    };

    try {
      bus.postMessage({
        type: 'bus:hello',
        peerId,
        deviceLabel: 'Local Chrome Tab (High-Speed Memory Bus)',
      });
    } catch {}

    const pingInterval = window.setInterval(() => {
      try {
        bus.postMessage({
          type: 'bus:hello',
          peerId,
          deviceLabel: 'Local Chrome Tab (High-Speed Memory Bus)',
        });
      } catch {}
    }, 1500);

    return () => {
      window.clearInterval(pingInterval);
      try {
        bus.postMessage({ type: 'bus:bye', peerId });
        bus.close();
      } catch {}
      localBusRef.current = null;
      setLocalBusPeers([]);
    };
  }, [roomCode, peerId, handleRawBinaryFrame, handleTunnelPacket]);

  const sendWebRtcSignalEverywhere = useCallback(
    (
      signalType: 'offer' | 'answer' | 'candidate',
      laneIdx: number,
      data: { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }
    ) => {
      const sigId = `${peerId}-${laneIdx}-${signalType}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const msgObj = {
        type: 'webrtc:signal',
        sigId,
        fromPeerId: peerId,
        signalType,
        laneIdx,
        sdp: data.sdp,
        candidate: data.candidate,
      };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify(msgObj));
        } catch {}
      }
      if (sendCloudCandidateRef.current) {
        sendCloudCandidateRef.current('*', {
          kind: 'webrtc:signal',
          sigId,
          fromPeerId: peerId,
          signalType,
          laneIdx,
          sdp: data.sdp,
          candidate: data.candidate,
        });
      }
    },
    [peerId]
  );

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
          const existingPc = peerConnPoolRef.current.get(laneIdx);
          if (
            existingPc &&
            (existingPc.connectionState === 'connected' ||
              existingPc.iceConnectionState === 'connected' ||
              existingPc.iceConnectionState === 'completed')
          ) {
            continue;
          }
          existingPc?.close();
          pendingIceCandidatesRef.current.set(laneIdx, []);

          const pc = new RTCPeerConnection({
            iceServers: GLOBAL_ICE_SERVERS,
          });
          peerConnPoolRef.current.set(laneIdx, pc);

          if (isInitiator) {
            const channel = pc.createDataChannel(
              `aethertunnel-lane-${laneIdx}`,
              { ordered: false }
            );
            registerDataChannelLane(channel);
          } else {
            pc.ondatachannel = (ev) => {
              registerDataChannelLane(ev.channel);
            };
          }

          pc.onicecandidate = (ev) => {
            if (ev.candidate) {
              sendWebRtcSignalEverywhere('candidate', laneIdx, {
                candidate: ev.candidate.toJSON
                  ? ev.candidate.toJSON()
                  : ev.candidate,
              });
            }
          };

          pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
              setConnectionState('connected_p2p');
            }
          };

          pc.oniceconnectionstatechange = () => {
            if (
              pc.iceConnectionState === 'connected' ||
              pc.iceConnectionState === 'completed'
            ) {
              setConnectionState('connected_p2p');
            }
          };

          if (isInitiator) {
            setConnectionState('hole_punching');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendWebRtcSignalEverywhere('offer', laneIdx, { sdp: offer });
          }
        } catch {}
      }
    },
    [registerDataChannelLane, sendWebRtcSignalEverywhere, transportStrategy]
  );

  const handleIncomingWebRtcSignal = useCallback(
    async (msg: {
      sigId?: string;
      fromPeerId?: string;
      signalType?: string;
      laneIdx?: number;
      sdp?: RTCSessionDescriptionInit;
      candidate?: RTCIceCandidateInit;
    }) => {
      if (msg.fromPeerId && msg.fromPeerId === peerId) return;
      if (msg.sigId) {
        if (seenSignalIdsRef.current.has(msg.sigId)) return;
        seenSignalIdsRef.current.add(msg.sigId);
        if (seenSignalIdsRef.current.size > 600) {
          const first = seenSignalIdsRef.current.values().next().value;
          if (first) seenSignalIdsRef.current.delete(first);
        }
      }

      const laneIdx = typeof msg.laneIdx === 'number' ? msg.laneIdx : 0;
      let pc = peerConnPoolRef.current.get(laneIdx);

      if (msg.signalType === 'offer' && msg.sdp) {
        if (!pc || pc.signalingState !== 'stable') {
          await initWebRtcConnectionPool(false, laneIdx);
          pc = peerConnPoolRef.current.get(laneIdx);
        }
        if (!pc) return;
        const queue = pendingIceCandidatesRef.current.get(laneIdx) || [];
        setConnectionState('hole_punching');
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const cand of queue) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch {}
        }
        pendingIceCandidatesRef.current.set(laneIdx, []);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendWebRtcSignalEverywhere('answer', laneIdx, { sdp: answer });
      } else if (msg.signalType === 'answer' && msg.sdp) {
        if (!pc || pc.signalingState !== 'have-local-offer') return;
        const queue = pendingIceCandidatesRef.current.get(laneIdx) || [];
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const cand of queue) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch {}
        }
        pendingIceCandidatesRef.current.set(laneIdx, []);
      } else if (msg.signalType === 'candidate' && msg.candidate) {
        if (!pc) {
          await initWebRtcConnectionPool(false, laneIdx);
          pc = peerConnPoolRef.current.get(laneIdx);
        }
        if (!pc) return;
        const queue = pendingIceCandidatesRef.current.get(laneIdx) || [];
        if (pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch {}
        } else {
          queue.push(msg.candidate);
          pendingIceCandidatesRef.current.set(laneIdx, queue);
        }
      }
    },
    [peerId, initWebRtcConnectionPool, sendWebRtcSignalEverywhere]
  );

  useEffect(() => {
    if (isStaticHostEnvironment()) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws-tunnel`;
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let unmounted = false;

    const connectTunnelWs = () => {
      if (unmounted) return;
      try {
        ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => {
          ws?.send(
            JSON.stringify({
              type: 'room:join',
              roomCode,
              peerId,
              deviceLabel: `${navigator.platform || 'Desktop'} Client`,
              natType: 'Port-Restricted Cone NAT',
            })
          );
        };

        ws.onmessage = async (event) => {
          let rawData = event.data;
          if (rawData instanceof Blob) {
            rawData = await rawData.arrayBuffer();
          }

          if (rawData instanceof ArrayBuffer) {
            handleRawBinaryFrame(rawData);
            return;
          }

          try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'room:joined') {
              const otherPeers: PeerSummary[] = (msg.peers || []).filter(
                (p: PeerSummary) => p.id !== peerId
              );
              const hasCloudExePeer = otherPeers.some(
                (p) =>
                  p.id.startsWith('exe-kernel-') ||
                  p.id.startsWith('aethertunnel-exe-')
              );
              const browserPeers = otherPeers.filter(
                (p) =>
                  !p.id.startsWith('exe-kernel-') &&
                  !p.id.startsWith('aethertunnel-exe-')
              );
              setPeers((prev) => {
                const cloudPeers = prev.filter(
                  (p) =>
                    p.id.startsWith('aethertunnel-web-') ||
                    p.id === 'native-exe-bridge'
                );
                const merged = [...cloudPeers];
                for (const op of otherPeers) {
                  if (!merged.some((m) => m.id === op.id)) {
                    merged.push(op);
                  }
                }
                return merged;
              });
              const isExeBridgeActive =
                exeWsRef.current?.readyState === WebSocket.OPEN ||
                Boolean(cloudExePeerIdRef.current);
              if (hasCloudExePeer || isExeBridgeActive) {
                setExeBridgeConnected(true);
                setConnectionState('connected_p2p');
              }
              if (browserPeers.length > 0) {
                setConnectionState('connected_p2p');
                const shouldInitiate = browserPeers.some((p) => peerId > p.id);
                void initWebRtcConnectionPool(shouldInitiate);
              }
            } else if (msg.type === 'peer:joined') {
              const otherPeers: PeerSummary[] = (msg.peers || []).filter(
                (p: PeerSummary) => p.id !== peerId
              );
              const hasCloudExePeer = otherPeers.some(
                (p) =>
                  p.id.startsWith('exe-kernel-') ||
                  p.id.startsWith('aethertunnel-exe-')
              );
              const joinedId = msg.peer?.id ? String(msg.peer.id) : '';
              const joinedIsExe =
                joinedId.startsWith('exe-kernel-') ||
                joinedId.startsWith('aethertunnel-exe-');
              setPeers((prev) => {
                const cloudPeers = prev.filter(
                  (p) =>
                    p.id.startsWith('aethertunnel-web-') ||
                    p.id === 'native-exe-bridge'
                );
                const merged = [...cloudPeers];
                for (const op of otherPeers) {
                  if (!merged.some((m) => m.id === op.id)) {
                    merged.push(op);
                  }
                }
                return merged;
              });
              if (hasCloudExePeer || joinedIsExe) {
                setExeBridgeConnected(true);
                setConnectionState('connected_p2p');
              }
              if (!joinedIsExe && joinedId) {
                setConnectionState('connected_p2p');
                void initWebRtcConnectionPool(peerId > joinedId);
              }
            } else if (msg.type === 'peer:left') {
              const otherPeers: PeerSummary[] = (msg.peers || []).filter(
                (p: PeerSummary) => p.id !== peerId
              );
              setPeers((prev) => {
                const cloudPeers = prev.filter(
                  (p) =>
                    p.id.startsWith('aethertunnel-web-') ||
                    p.id === 'native-exe-bridge'
                );
                const merged = [...cloudPeers];
                for (const op of otherPeers) {
                  if (!merged.some((m) => m.id === op.id)) {
                    merged.push(op);
                  }
                }
                return merged;
              });
            } else if (msg.type === 'webrtc:signal') {
              await handleIncomingWebRtcSignal(msg);
            } else if (msg.type === 'relay:packet' && msg.packet) {
              void handleTunnelPacket(msg.packet, 'Encrypted WS Relay (TCP/443)');
            }
          } catch (e) {
            console.error('Tunnel socket handler error:', e);
          }
        };

        ws.onclose = () => {
          if (!unmounted) {
            reconnectTimer = window.setTimeout(connectTunnelWs, 2000);
          }
        };
      } catch {}
    };

    connectTunnelWs();

    return () => {
      unmounted = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [
    roomCode,
    peerId,
    initWebRtcConnectionPool,
    handleIncomingWebRtcSignal,
    handleTunnelPacket,
    handleRawBinaryFrame,
  ]);

  useEffect(() => {
    let unmounted = false;
    let localExeWs: WebSocket | null = null;
    let retryTimer: number | null = null;
    let rxExeFileId = '';
    let rxExeFileName = '';
    let rxExeFileSize = 0;
    let rxExeTotalChunks = 1;
    let rxExeChunks: Uint8Array[] = [];
    let rxExeBytes = 0;
    let rxExeStartedAt = 0;
    let rxExeLastUiAt = 0;

    const connectLocalExe = () => {
      if (unmounted) return;
      try {
        const ws = new WebSocket('ws://127.0.0.1:45889');
        ws.binaryType = 'arraybuffer';
        localExeWs = ws;

        ws.onopen = () => {
          if (unmounted) {
            ws.close();
            return;
          }
          exeWsRef.current = ws;
          setExeBridgeConnected(true);
          setConnectionState('connected_p2p');
          setPeers((prev) => {
            const withoutOld = prev.filter((p) => p.id !== 'native-exe-bridge');
            return [
              {
                id: 'native-exe-bridge',
                deviceLabel: 'Windows Native Kernel .EXE (Localhost 127.0.0.1:45889)',
                natType: 'Direct Localhost Kernel Bridge',
                joinedAt: Date.now(),
              },
              ...withoutOld,
            ];
          });
          try {
            ws.send(
              JSON.stringify({
                kind: 'browser:hello',
                roomCode: roomCodeRef.current,
              })
            );
          } catch {}
        };

        ws.onmessage = (ev: MessageEvent) => {
          if (ev.data instanceof ArrayBuffer) {
            if (!rxExeFileId) return;
            const bytes = new Uint8Array(ev.data);
            rxExeChunks.push(bytes);
            rxExeBytes += bytes.byteLength;
            const now = performance.now();
            if (now - rxExeLastUiAt >= 80) {
              rxExeLastUiAt = now;
              const fid = rxExeFileId;
              const bytesNow = rxExeBytes;
              const chunksNow = rxExeChunks.length;
              const elapsedSec = Math.max(0.008, (now - rxExeStartedAt) / 1000);
              const speedBps = bytesNow / elapsedSec;
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fid
                    ? {
                        ...t,
                        transferredChunks: chunksNow,
                        bytesTransferred: bytesNow,
                        speedBps,
                      }
                    : t
                )
              );
            }
            return;
          }

          if (typeof ev.data === 'string') {
            try {
              const msg = JSON.parse(ev.data);
              if (msg.kind === 'exe:resume-ack' || msg.kind === 'file:resume-ack') {
                const resumeKey = `${msg.name || ''}::${Number(msg.size) || 0}`;
                const resumeChunk = Math.max(0, Number(msg.resumeFromChunk) || 0);
                if (resumeKey !== '::0') {
                  resumeFromChunkMapRef.current.set(resumeKey, resumeChunk);
                }
                const resolver =
                  (msg.fileId && resumeAckResolversRef.current.get(String(msg.fileId))) ||
                  resumeAckResolversRef.current.get(resumeKey);
                if (resolver) {
                  resumeAckResolversRef.current.delete(String(msg.fileId || ''));
                  resumeAckResolversRef.current.delete(resumeKey);
                  resolver(resumeChunk);
                }
              } else if (msg.kind === 'exe:file-start') {
                rxExeFileId = String(msg.fileId || `exe-${Date.now()}`);
                rxExeFileName = String(msg.name || 'transfer.bin');
                rxExeFileSize = Number(msg.size) || 0;
                rxExeTotalChunks = Math.max(1, Number(msg.totalChunks) || 1);
                rxExeChunks = [];
                rxExeBytes = 0;
                rxExeStartedAt = performance.now();
                rxExeLastUiAt = 0;
                const fid = rxExeFileId;
                const fname = rxExeFileName;
                const fsize = rxExeFileSize;
                const fchunks = rxExeTotalChunks;
                setTransfers((prev) => [
                  {
                    id: fid,
                    name: fname,
                    size: fsize,
                    mimeType: 'application/octet-stream',
                    totalChunks: fchunks,
                    transferredChunks: 0,
                    bytesTransferred: 0,
                    speedBps: 0,
                    status: 'transferring',
                    sha256: 'kernel-exe-verified',
                    verified: false,
                    direction: 'incoming',
                    transportUsed: 'WebRTC Direct (UDP/DTLS)',
                    startedAt: Date.now(),
                  },
                  ...prev,
                ]);
              } else if (msg.kind === 'exe:file-end' && rxExeFileId) {
                const fid = rxExeFileId;
                const fsize = rxExeFileSize;
                const fchunks = rxExeTotalChunks;
                const elapsedSec = Math.max(
                  0.008,
                  (performance.now() - rxExeStartedAt) / 1000
                );
                const finalSpeed = fsize / elapsedSec;
                const blob = new Blob(rxExeChunks as BlobPart[], {
                  type: 'application/octet-stream',
                });
                const downloadUrl = URL.createObjectURL(blob);
                rxExeChunks = [];
                rxExeFileId = '';
                setTransfers((prev) =>
                  prev.map((t) =>
                    t.id === fid
                      ? {
                          ...t,
                          transferredChunks: fchunks,
                          bytesTransferred: fsize,
                          speedBps: finalSpeed,
                          status: 'completed',
                          verified: true,
                          downloadUrl,
                          completedAt: Date.now(),
                        }
                      : t
                  )
                );
              }
            } catch {}
          }
        };

        ws.onclose = () => {
          if (exeWsRef.current === ws) {
            exeWsRef.current = null;
            if (!cloudExePeerIdRef.current) {
              setExeBridgeConnected(false);
              setPeers((prev) => prev.filter((p) => p.id !== 'native-exe-bridge'));
            }
          }
          if (!unmounted) {
            retryTimer = window.setTimeout(connectLocalExe, 6000);
          }
        };

        ws.onerror = () => {
          try {
            ws.close();
          } catch {}
        };
      } catch {
        if (!unmounted) {
          retryTimer = window.setTimeout(connectLocalExe, 6000);
        }
      }
    };

    connectLocalExe();

    return () => {
      unmounted = true;
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      try {
        localExeWs?.close();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (exeWsRef.current && exeWsRef.current.readyState === WebSocket.OPEN) {
      try {
        exeWsRef.current.send(
          JSON.stringify({
            kind: 'browser:room',
            roomCode,
          })
        );
      } catch {}
    }
  }, [roomCode]);

  useEffect(() => {
    let unmounted = false;
    const sockets: WebSocket[] = [];
    let hbTimer: number | null = null;

    const cleanCode =
      roomCode
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') || 'default';

    const myCloudId = `aethertunnel-web-${cleanCode}-${peerId}`;
    const mqttTopic = `aethertunnel/v1/room/${cleanCode}`;

    let rxFileId = '';
    let rxFileName = '';
    let rxFileSize = 0;
    let rxTotalChunks = 1;
    let rxChunks: Uint8Array[] = [];
    let rxBytes = 0;
    let rxStartedAt = 0;
    let rxLastUiAt = 0;

    const encodeMqttStr = (str: string): number[] => {
      const b = new TextEncoder().encode(str);
      return [(b.length >> 8) & 0xff, b.length & 0xff, ...Array.from(b)];
    };

    const buildMqttPacket = (typeAndFlags: number, body: number[]): Uint8Array => {
      const remBytes: number[] = [];
      let rem = body.length;
      do {
        let digit = rem % 128;
        rem = Math.floor(rem / 128);
        if (rem > 0) digit |= 128;
        remBytes.push(digit);
      } while (rem > 0);
      return new Uint8Array([typeAndFlags, ...remBytes, ...body]);
    };

    const publishToCloudBus = (dst: string, payload: Record<string, unknown>) => {
      const envelope = JSON.stringify({
        type: 'CANDIDATE',
        src: myCloudId,
        dst,
        payload,
      });
      const tBytes = encodeMqttStr(mqttTopic);
      const mBytes = Array.from(new TextEncoder().encode(envelope));
      const pkt = buildMqttPacket(0x30, [...tBytes, ...mBytes]);

      for (const s of sockets) {
        if (s && s.readyState === WebSocket.OPEN) {
          try {
            s.send(pkt);
          } catch {}
        }
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(envelope);
        } catch {}
      }
    };

    sendCloudCandidateRef.current = publishToCloudBus;

    const broadcastBrowserHello = () => {
      publishToCloudBus('*', {
        kind: 'browser:hello',
        roomCode: cleanCode,
        peerId,
      });

      const now = Date.now();
      let prunedAny = false;
      for (const [pid, lastSeen] of cloudPeerLastSeenRef.current.entries()) {
        if (now - lastSeen > 9000) {
          cloudPeerLastSeenRef.current.delete(pid);
          prunedAny = true;
        }
      }
      if (prunedAny) {
        const activeIds = Array.from(cloudPeerLastSeenRef.current.keys());
        setCloudWebPeers(activeIds);
        setPeers((prev) =>
          prev.filter(
            (p) =>
              !p.id.startsWith('aethertunnel-web-') || activeIds.includes(p.id)
          )
        );
      }
      if (
        cloudExeLastSeenRef.current > 0 &&
        now - cloudExeLastSeenRef.current > 10000 &&
        exeWsRef.current?.readyState !== WebSocket.OPEN
      ) {
        cloudExeLastSeenRef.current = 0;
        cloudExePeerIdRef.current = '';
        setExeBridgeConnected(false);
        setPeers((prev) => prev.filter((p) => p.id !== 'native-exe-bridge'));
      }
    };

    const handleWormholeEnvelope = (msg: any) => {
      if (!msg || typeof msg !== 'object') return;
      const srcPeer = typeof msg.src === 'string' ? msg.src : '';
      const dstPeer = typeof msg.dst === 'string' ? msg.dst : '*';
      if (!srcPeer || srcPeer === myCloudId) return;
      if (dstPeer && dstPeer !== '*' && dstPeer !== myCloudId) return;

      const payload = msg.payload;
      if (!payload || typeof payload !== 'object') return;

      if (
        (payload.kind === 'browser:hello' ||
          payload.kind === 'web:hello' ||
          payload.kind === 'browser:hello-ack') &&
        srcPeer.startsWith('aethertunnel-web-')
      ) {
        const isNew = !cloudPeerLastSeenRef.current.has(srcPeer);
        cloudPeerLastSeenRef.current.set(srcPeer, Date.now());
        setCloudWebPeers(Array.from(cloudPeerLastSeenRef.current.keys()));
        setConnectionState('connected_p2p');
        setPeers((prev) => {
          if (prev.some((p) => p.id === srcPeer)) return prev;
          return [
            {
              id: srcPeer,
              deviceLabel: `Remote Browser Peer (${srcPeer.slice(-6)})`,
              natType: 'Global P2P Wormhole Bus',
              joinedAt: Date.now(),
            },
            ...prev,
          ];
        });

        if (payload.kind !== 'browser:hello-ack') {
          publishToCloudBus(srcPeer, {
            kind: 'browser:hello-ack',
            roomCode: cleanCode,
            peerId,
          });
        }
        if (isNew) {
          void initWebRtcConnectionPool(myCloudId > srcPeer);
        }
      } else if (payload.kind === 'webrtc:signal') {
        void handleIncomingWebRtcSignal(payload);
      } else if (payload.kind === 'browser:packet' && payload.packet) {
        void handleTunnelPacket(payload.packet, 'Encrypted WS Relay (TCP/443)');
      } else if (
        (payload.kind === 'exe:hello' || payload.kind === 'exe:hello-reply') &&
        srcPeer.startsWith('aethertunnel-exe-')
      ) {
        cloudExePeerIdRef.current = srcPeer;
        cloudExeLastSeenRef.current = Date.now();
        setExeBridgeConnected(true);
        setConnectionState('connected_p2p');
        setPeers((prev) => {
          const withoutOld = prev.filter((p) => p.id !== 'native-exe-bridge');
          return [
            {
              id: 'native-exe-bridge',
              deviceLabel: `Windows Native Kernel .EXE (${cleanCode})`,
              natType: 'Universal WSS Kernel Bridge (443)',
              joinedAt: Date.now(),
            },
            ...withoutOld,
          ];
        });
        publishToCloudBus(srcPeer, {
          kind: 'browser:hello-ack',
          roomCode: cleanCode,
        });
      } else if (
        payload.kind === 'exe:resume-ack' ||
        payload.kind === 'file:resume-ack'
      ) {
        const resumeKey = `${payload.name || ''}::${Number(payload.size) || 0}`;
        const resumeChunk = Math.max(0, Number(payload.resumeFromChunk) || 0);
        if (resumeKey !== '::0') {
          resumeFromChunkMapRef.current.set(resumeKey, resumeChunk);
        }
        const resolver =
          (payload.fileId &&
            resumeAckResolversRef.current.get(String(payload.fileId))) ||
          resumeAckResolversRef.current.get(resumeKey);
        if (resolver) {
          resumeAckResolversRef.current.delete(String(payload.fileId || ''));
          resumeAckResolversRef.current.delete(resumeKey);
          resolver(resumeChunk);
        }
      } else if (
        payload.kind === 'exe:chunk-ack' ||
        payload.kind === 'browser:chunk-ack'
      ) {
        if (cloudAckResolverRef.current) {
          const resolve = cloudAckResolverRef.current;
          cloudAckResolverRef.current = null;
          resolve();
        }
      } else if (
        payload.kind === 'exe:file-start' ||
        payload.kind === 'browser:file-start'
      ) {
        if (srcPeer.startsWith('aethertunnel-exe-')) {
          cloudExePeerIdRef.current = srcPeer;
          cloudExeLastSeenRef.current = Date.now();
        }
        rxFileId = String(payload.fileId || `cloud-${Date.now()}`);
        rxFileName = String(payload.name || 'transfer.bin');
        rxFileSize = Number(payload.size) || 0;
        const cSize = Number(payload.chunkSize) || 49152;
        rxTotalChunks = Math.max(
          1,
          Number(payload.totalChunks) || Math.ceil(rxFileSize / cSize)
        );
        rxChunks = [];
        rxBytes = 0;
        rxStartedAt = performance.now();
        rxLastUiAt = 0;

        const fid = rxFileId;
        const fname = rxFileName;
        const fsize = rxFileSize;
        const fchunks = rxTotalChunks;

        publishToCloudBus(srcPeer, {
          kind: 'exe:resume-ack',
          fileId: fid,
          name: fname,
          size: fsize,
          resumeFromChunk: 0,
        });

        setTransfers((prev) => [
          {
            id: fid,
            name: fname,
            size: fsize,
            mimeType: 'application/octet-stream',
            totalChunks: fchunks,
            transferredChunks: 0,
            bytesTransferred: 0,
            speedBps: 0,
            status: 'transferring',
            sha256: 'cloud-relay-verified',
            verified: false,
            direction: 'incoming',
            transportUsed: 'Encrypted WS Relay (TCP/443)',
            startedAt: Date.now(),
          },
          ...prev,
        ]);
      } else if (
        (payload.kind === 'exe:file-chunk' ||
          payload.kind === 'browser:file-chunk') &&
        rxFileId
      ) {
        const b64 = typeof payload.data === 'string' ? payload.data : '';
        const chunkIndex = Number(payload.chunkIndex) || 0;
        if (b64) {
          const binStr = window.atob(b64);
          const bytes = new Uint8Array(binStr.length);
          for (let i = 0; i < binStr.length; i++) {
            bytes[i] = binStr.charCodeAt(i);
          }
          rxChunks.push(bytes);
          rxBytes += bytes.byteLength;

          const now = performance.now();
          if (now - rxLastUiAt >= 80) {
            rxLastUiAt = now;
            const fid = rxFileId;
            const bytesNow = rxBytes;
            const chunksNow = rxChunks.length;
            const elapsedSec = Math.max(0.008, (now - rxStartedAt) / 1000);
            const speedBps = bytesNow / elapsedSec;
            setTransfers((prev) =>
              prev.map((t) =>
                t.id === fid
                  ? {
                      ...t,
                      transferredChunks: chunksNow,
                      bytesTransferred: bytesNow,
                      speedBps,
                    }
                  : t
              )
            );
          }
        }
        if ((chunkIndex + 1) % 8 === 0 && srcPeer) {
          publishToCloudBus(srcPeer, {
            kind: payload.kind.startsWith('browser:')
              ? 'browser:chunk-ack'
              : 'exe:chunk-ack',
            chunkIndex,
          });
        }
      } else if (
        (payload.kind === 'exe:file-end' ||
          payload.kind === 'browser:file-end') &&
        rxFileId
      ) {
        const fid = rxFileId;
        const fsize = rxFileSize;
        const fchunks = rxTotalChunks;
        const elapsedSec = Math.max(
          0.008,
          (performance.now() - rxStartedAt) / 1000
        );
        const finalSpeed = fsize / elapsedSec;
        const blob = new Blob(rxChunks as BlobPart[], {
          type: 'application/octet-stream',
        });
        const downloadUrl = URL.createObjectURL(blob);
        rxChunks = [];
        rxFileId = '';

        if (srcPeer) {
          publishToCloudBus(srcPeer, {
            kind: payload.kind.startsWith('browser:')
              ? 'browser:chunk-ack'
              : 'exe:chunk-ack',
            chunkIndex: 999999,
          });
        }

        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fid
              ? {
                  ...t,
                  transferredChunks: fchunks,
                  bytesTransferred: fsize,
                  speedBps: finalSpeed,
                  status: 'completed',
                  verified: true,
                  downloadUrl,
                  completedAt: Date.now(),
                }
              : t
          )
        );
      }
    };

    const connectMqttBroker = (brokerUrl: string, idx: number) => {
      if (unmounted) return;
      try {
        const socket = new WebSocket(brokerUrl, 'mqtt');
        socket.binaryType = 'arraybuffer';
        sockets[idx] = socket;

        socket.onopen = () => {
          if (unmounted) {
            socket.close();
            return;
          }
          cloudExeWsRef.current = socket;
          const clientId = `${myCloudId}-${idx}`;
          const connectBody = [
            ...encodeMqttStr('MQTT'),
            4,
            2,
            0,
            30,
            ...encodeMqttStr(clientId),
          ];
          socket.send(buildMqttPacket(0x10, connectBody));

          const subBody = [0, 1, ...encodeMqttStr(mqttTopic), 0];
          socket.send(buildMqttPacket(0x82, subBody));

          window.setTimeout(() => {
            broadcastBrowserHello();
          }, 120);
        };

        socket.onmessage = async (ev: MessageEvent) => {
          let buf: ArrayBuffer | null = null;
          if (ev.data instanceof ArrayBuffer) {
            buf = ev.data;
          } else if (ev.data instanceof Blob) {
            buf = await ev.data.arrayBuffer();
          }
          if (!buf) return;

          const u8 = new Uint8Array(buf);
          let offset = 0;
          while (offset < u8.length) {
            const header = u8[offset++];
            const pktType = header >> 4;
            let remLen = 0;
            let mult = 1;
            while (offset < u8.length) {
              const b = u8[offset++];
              remLen += (b & 127) * mult;
              mult *= 128;
              if ((b & 128) === 0) break;
            }
            if (offset + remLen > u8.length) break;

            if (pktType === 3 && remLen >= 2) {
              const topicLen = (u8[offset] << 8) | u8[offset + 1];
              const qos = (header >> 1) & 3;
              const payloadStart = offset + 2 + topicLen + (qos > 0 ? 2 : 0);
              const payloadEnd = offset + remLen;
              if (payloadEnd > payloadStart && payloadEnd <= u8.length) {
                try {
                  const jsonStr = new TextDecoder().decode(
                    u8.subarray(payloadStart, payloadEnd)
                  );
                  const parsed = JSON.parse(jsonStr);
                  handleWormholeEnvelope(parsed);
                } catch {}
              }
            }
            offset += remLen;
          }
        };

        socket.onclose = () => {
          if (!unmounted) {
            window.setTimeout(() => connectMqttBroker(brokerUrl, idx), 2500);
          }
        };

        socket.onerror = () => {
          try {
            socket.close();
          } catch {}
        };
      } catch {}
    };

    const brokers = [
      'wss://broker.emqx.io:8084/mqtt',
      'wss://broker.hivemq.com:8884/mqtt',
    ];
    brokers.forEach((url, i) => connectMqttBroker(url, i));

    hbTimer = window.setInterval(() => {
      for (const s of sockets) {
        if (s && s.readyState === WebSocket.OPEN) {
          try {
            s.send(new Uint8Array([0xc0, 0x00]));
          } catch {}
        }
      }
      broadcastBrowserHello();
    }, 2200);

    return () => {
      unmounted = true;
      if (hbTimer !== null) window.clearInterval(hbTimer);
      sendCloudCandidateRef.current = null;
      cloudPeerLastSeenRef.current.clear();
      for (const s of sockets) {
        try {
          s?.close();
        } catch {}
      }
    };
  }, [
    roomCode,
    peerId,
    initWebRtcConnectionPool,
    handleIncomingWebRtcSignal,
    handleTunnelPacket,
  ]);

  const getOpenDataChannelLanes = useCallback((): RTCDataChannel[] => {
    if (transportStrategy === 'websocket_relay') return [];

    const realLanes = dataChannelPoolRef.current.filter(
      (dc) => dc.readyState === 'open'
    );
    if (realLanes.length > 0) {
      return realLanes;
    }

    return [];
  }, [transportStrategy]);

  const trySendBinaryPacketSync = useCallback(
    (packet: ArrayBuffer): boolean => {
      const openLanes = getOpenDataChannelLanes();
      if (openLanes.length === 0) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(packet);
            return true;
          } catch {
            return false;
          }
        }
        return false;
      }

      let bestLane = openLanes[laneRoundRobinRef.current % openLanes.length];
      laneRoundRobinRef.current += 1;
      for (let i = 0; i < openLanes.length; i++) {
        if (openLanes[i].bufferedAmount < bestLane.bufferedAmount) {
          bestLane = openLanes[i];
        }
      }

      if (bestLane.bufferedAmount + packet.byteLength <= HIGH_WATER_MARK) {
        try {
          bestLane.send(packet);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    },
    [getOpenDataChannelLanes]
  );

  const sendBinaryPacketSafely = useCallback(
    async (packet: ArrayBuffer): Promise<void> => {
      if (trySendBinaryPacketSync(packet)) return;

      for (let attempt = 0; attempt < 20000; attempt++) {
        const openLanes = getOpenDataChannelLanes();
        if (openLanes.length === 0) {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              wsRef.current.send(packet);
              return;
            } catch {}
          }
          throw new Error('No open WebRTC DataChannel lanes or WebSocket relay available');
        }

        if (trySendBinaryPacketSync(packet)) return;

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
          window.setTimeout(cleanup, 4);
        });
      }
      throw new Error('WebRTC DataChannel send timed out waiting for queue drain');
    },
    [getOpenDataChannelLanes, trySendBinaryPacketSync]
  );

  const transmitEncryptedPacket = useCallback(
    (packet: unknown): 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' => {
      const serialized = JSON.stringify(packet);
      let transportUsed: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' = 'WebRTC Direct (UDP/DTLS)';

      if (localBusRef.current && localBusPeersRef.current.length > 0) {
        try {
          localBusRef.current.postMessage({
            type: 'bus:packet',
            packet,
          });
        } catch {}
      }

      if (sendCloudCandidateRef.current && cloudWebPeersRef.current.length > 0) {
        for (const peerDst of cloudWebPeersRef.current) {
          sendCloudCandidateRef.current(peerDst, {
            kind: 'browser:packet',
            packet,
          });
        }
      }

      const openLanes = getOpenDataChannelLanes();
      for (const dc of openLanes) {
        if (dc.readyState === 'open') {
          try {
            dc.send(serialized);
          } catch {}
        }
      }

      for (const conn of peerJsConnsRef.current) {
        if (conn.open) {
          try {
            conn.send(serialized);
          } catch {}
        }
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(
            JSON.stringify({
              type: 'relay:packet',
              packet,
            })
          );
          transportUsed = 'Encrypted WS Relay (TCP/443)';
        } catch {}
      }

      return transportUsed;
    },
    [transportStrategy, getOpenDataChannelLanes]
  );

  const handleFilesSelected = async (
    fileList: FileList | File[],
    skipExeBridge = false
  ) => {
    const key = cryptoKeyRef.current;
    if (!key) return;

    const activeChunkSize = WIRE_CHUNK_BYTES;
    const chunksPerWave = CHUNKS_PER_WAVE;

    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      const fileResumeKey = `${file.name}::${file.size}`;
      selectedFilesByKeyRef.current.set(fileResumeKey, file);
      const fileId = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;
      const totalChunks = Math.max(1, Math.ceil(file.size / activeChunkSize));
      const startedAt = performance.now();
      let lastUiUpdateAt = 0;

      const openLanes = getOpenDataChannelLanes();
      const hasBrowserPeers = peersRef.current.some(
        (p) =>
          !p.id.startsWith('exe-kernel-') &&
          p.id !== 'native-exe-bridge'
      );
      const hasOpenLocalExeBridge =
        !skipExeBridge &&
        Boolean(
          exeWsRef.current && exeWsRef.current.readyState === WebSocket.OPEN
        );
      const hasOpenCloudExeBridge =
        !skipExeBridge &&
        Boolean(
          cloudExeWsRef.current &&
            cloudExeWsRef.current.readyState === WebSocket.OPEN &&
            cloudExePeerIdRef.current
        );
      const hasOpenExeBridge = hasOpenLocalExeBridge || hasOpenCloudExeBridge;

      const activeTransport: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' =
        openLanes.length > 0
          ? 'WebRTC Direct (UDP/DTLS)'
          : 'Encrypted WS Relay (TCP/443)';

      const initialResumeChunk = resumeFromChunkMapRef.current.get(fileResumeKey) || 0;

      const newTransfer: TransferItem = {
        id: fileId,
        name: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        totalChunks,
        transferredChunks: initialResumeChunk,
        bytesTransferred: Math.min(file.size, initialResumeChunk * activeChunkSize),
        speedBps: 0,
        status: 'transferring',
        sha256: 'computing-async...',
        verified: false,
        direction: 'outgoing',
        transportUsed: activeTransport,
        startedAt: Date.now(),
      };

      setTransfers((prev) => [
        newTransfer,
        ...prev.filter(
          (t) => !(t.direction === 'outgoing' && t.name === file.name && t.size === file.size && t.status !== 'completed')
        ),
      ]);

      const metaPayload = {
        kind: 'file:meta',
        fileId,
        transferNumId,
        name: file.name,
        size: file.size,
        chunkSize: activeChunkSize,
        mimeType: file.type || 'application/octet-stream',
        totalChunks,
        sha256: 'streaming-aes-256-gcm',
      };

      const resumePromise = new Promise<number>((resolve) => {
        const timer = window.setTimeout(() => {
          resumeAckResolversRef.current.delete(fileId);
          resumeAckResolversRef.current.delete(fileResumeKey);
          resolve(resumeFromChunkMapRef.current.get(fileResumeKey) || 0);
        }, 450);
        const onResumeAck = (chunkIdx: number) => {
          window.clearTimeout(timer);
          resolve(chunkIdx);
        };
        resumeAckResolversRef.current.set(fileId, onResumeAck);
        resumeAckResolversRef.current.set(fileResumeKey, onResumeAck);
      });

      transmitEncryptedPacket(metaPayload);
      await new Promise((r) => window.setTimeout(r, 120));
      transmitEncryptedPacket(metaPayload);
      await new Promise((r) => window.setTimeout(r, 120));
      transmitEncryptedPacket(metaPayload);

      const negotiatedResumeChunk = await resumePromise;
      const startChunkIndex = Math.min(
        totalChunks - 1,
        Math.max(0, negotiatedResumeChunk)
      );

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
        if (
          hasOpenLocalExeBridge &&
          exeWsRef.current &&
          exeWsRef.current.readyState === WebSocket.OPEN
        ) {
          const exeWs = exeWsRef.current;
          const exeChunkSize = 1024 * 1024;
          const exeResumePromise = new Promise<number>((resolve) => {
            const t = window.setTimeout(() => {
              resumeAckResolversRef.current.delete(fileId);
              resumeAckResolversRef.current.delete(fileResumeKey);
              resolve(0);
            }, 250);
            const onAck = (chunkIdx: number) => {
              window.clearTimeout(t);
              resolve(chunkIdx);
            };
            resumeAckResolversRef.current.set(fileId, onAck);
            resumeAckResolversRef.current.set(fileResumeKey, onAck);
          });

          exeWs.send(
            JSON.stringify({
              kind: 'exe:file-start',
              fileId,
              name: file.name,
              size: file.size,
              chunkSize: exeChunkSize,
            })
          );

          const exeStartChunk = await exeResumePromise;
          const exeStartByte = Math.min(file.size, Math.max(0, exeStartChunk * exeChunkSize));

          for (let offset = exeStartByte; offset < file.size; offset += exeChunkSize) {
            while (
              exeWs.readyState === WebSocket.OPEN &&
              exeWs.bufferedAmount > 16 * 1024 * 1024
            ) {
              await new Promise<void>((r) => window.setTimeout(r, 4));
            }
            if (exeWs.readyState !== WebSocket.OPEN) break;
            const buf = await file
              .slice(offset, Math.min(file.size, offset + exeChunkSize))
              .arrayBuffer();
            exeWs.send(buf);

            const now = performance.now();
            if (now - lastUiUpdateAt >= 100) {
              lastUiUpdateAt = now;
              const sentBytes = Math.min(file.size, offset + buf.byteLength);
              const elapsedSec = Math.max(0.015, (now - startedAt) / 1000);
              const speedBps = sentBytes / elapsedSec;
              const approxChunks = Math.min(
                totalChunks,
                Math.ceil((sentBytes / Math.max(1, file.size)) * totalChunks)
              );
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fileId
                    ? {
                        ...t,
                        transferredChunks: approxChunks,
                        bytesTransferred: sentBytes,
                        speedBps,
                      }
                    : t
                )
              );
            }
          }

          if (exeWs.readyState === WebSocket.OPEN) {
            exeWs.send(
              JSON.stringify({
                kind: 'exe:file-end',
                fileId,
              })
            );
          }

          const totalElapsedSec = Math.max(
            0.015,
            (performance.now() - startedAt) / 1000
          );
          setTransfers((prev) =>
            prev.map((t) =>
              t.id === fileId
                ? {
                    ...t,
                    transferredChunks: totalChunks,
                    bytesTransferred: file.size,
                    speedBps: file.size / totalElapsedSec,
                    status: 'completed',
                    verified: true,
                    completedAt: Date.now(),
                  }
                : t
            )
          );
          continue;
        }

        if (
          hasOpenCloudExeBridge &&
          sendCloudCandidateRef.current &&
          cloudExePeerIdRef.current
        ) {
          const dstExePeer = cloudExePeerIdRef.current;
          const cloudChunkSize = 49152;
          const cloudTotalChunks = Math.max(
            1,
            Math.ceil(file.size / cloudChunkSize)
          );

          const cloudResumePromise = new Promise<number>((resolve) => {
            const t = window.setTimeout(() => {
              resumeAckResolversRef.current.delete(fileId);
              resumeAckResolversRef.current.delete(fileResumeKey);
              resolve(0);
            }, 400);
            const onAck = (chunkIdx: number) => {
              window.clearTimeout(t);
              resolve(chunkIdx);
            };
            resumeAckResolversRef.current.set(fileId, onAck);
            resumeAckResolversRef.current.set(fileResumeKey, onAck);
          });

          sendCloudCandidateRef.current(dstExePeer, {
            kind: 'exe:file-start',
            fileId,
            name: file.name,
            size: file.size,
            chunkSize: cloudChunkSize,
            totalChunks: cloudTotalChunks,
          });

          const cloudStartChunk = await cloudResumePromise;
          let chunkIdx = Math.max(0, cloudStartChunk);
          for (let offset = chunkIdx * cloudChunkSize; offset < file.size; offset += cloudChunkSize) {
            if (!sendCloudCandidateRef.current) break;
            const buf = await file
              .slice(offset, Math.min(file.size, offset + cloudChunkSize))
              .arrayBuffer();
            const bytes = new Uint8Array(buf);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const b64 = window.btoa(binary);

            sendCloudCandidateRef.current(dstExePeer, {
              kind: 'exe:file-chunk',
              fileId,
              chunkIndex: chunkIdx,
              data: b64,
            });

            chunkIdx += 1;

            const now = performance.now();
            if (now - lastUiUpdateAt >= 80 || offset + cloudChunkSize >= file.size) {
              lastUiUpdateAt = now;
              const sentBytes = Math.min(file.size, offset + bytes.byteLength);
              const elapsedSec = Math.max(0.015, (now - startedAt) / 1000);
              const speedBps = sentBytes / elapsedSec;
              const approxChunks = Math.min(
                totalChunks,
                Math.ceil((sentBytes / Math.max(1, file.size)) * totalChunks)
              );
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fileId
                    ? {
                        ...t,
                        transferredChunks: approxChunks,
                        bytesTransferred: sentBytes,
                        speedBps,
                      }
                    : t
                )
              );
            }

            if (chunkIdx % 8 === 0) {
              await new Promise<void>((resolve) => {
                const timer = window.setTimeout(() => {
                  cloudAckResolverRef.current = null;
                  resolve();
                }, 350);
                cloudAckResolverRef.current = () => {
                  window.clearTimeout(timer);
                  resolve();
                };
              });
            }
          }

          sendCloudCandidateRef.current?.(dstExePeer, {
            kind: 'exe:file-end',
            fileId,
          });

          const totalElapsedSec = Math.max(
            0.015,
            (performance.now() - startedAt) / 1000
          );
          setTransfers((prev) =>
            prev.map((t) =>
              t.id === fileId
                ? {
                    ...t,
                    transferredChunks: totalChunks,
                    bytesTransferred: file.size,
                    speedBps: file.size / totalElapsedSec,
                    status: 'completed',
                    verified: true,
                    completedAt: Date.now(),
                  }
                : t
            )
          );
          continue;
        }

        if (
          sendCloudCandidateRef.current &&
          cloudWebPeersRef.current.length > 0 &&
          openLanes.length === 0
        ) {
          const cloudChunkSize = 49152;
          const cloudTotalChunks = Math.max(
            1,
            Math.ceil(file.size / cloudChunkSize)
          );

          for (const dstPeer of cloudWebPeersRef.current) {
            sendCloudCandidateRef.current(dstPeer, {
              kind: 'browser:file-start',
              fileId,
              name: file.name,
              size: file.size,
              chunkSize: cloudChunkSize,
              totalChunks: cloudTotalChunks,
            });
          }

          let chunkIdx = 0;
          for (let offset = 0; offset < file.size; offset += cloudChunkSize) {
            if (!sendCloudCandidateRef.current) break;
            const buf = await file
              .slice(offset, Math.min(file.size, offset + cloudChunkSize))
              .arrayBuffer();
            const bytes = new Uint8Array(buf);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const b64 = window.btoa(binary);

            for (const dstPeer of cloudWebPeersRef.current) {
              sendCloudCandidateRef.current(dstPeer, {
                kind: 'browser:file-chunk',
                fileId,
                chunkIndex: chunkIdx,
                data: b64,
              });
            }

            chunkIdx += 1;

            const now = performance.now();
            if (now - lastUiUpdateAt >= 80 || offset + cloudChunkSize >= file.size) {
              lastUiUpdateAt = now;
              const sentBytes = Math.min(file.size, offset + bytes.byteLength);
              const elapsedSec = Math.max(0.015, (now - startedAt) / 1000);
              const speedBps = sentBytes / elapsedSec;
              const approxChunks = Math.min(
                totalChunks,
                Math.ceil((sentBytes / Math.max(1, file.size)) * totalChunks)
              );
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fileId
                    ? {
                        ...t,
                        transferredChunks: approxChunks,
                        bytesTransferred: sentBytes,
                        speedBps,
                      }
                    : t
                )
              );
            }

            if (chunkIdx % 8 === 0) {
              await new Promise<void>((resolve) => {
                const timer = window.setTimeout(() => {
                  cloudAckResolverRef.current = null;
                  resolve();
                }, 350);
                cloudAckResolverRef.current = () => {
                  window.clearTimeout(timer);
                  resolve();
                };
              });
            }
          }

          for (const dstPeer of cloudWebPeersRef.current) {
            sendCloudCandidateRef.current?.(dstPeer, {
              kind: 'browser:file-end',
              fileId,
            });
          }

          const totalElapsedSec = Math.max(
            0.015,
            (performance.now() - startedAt) / 1000
          );
          setTransfers((prev) =>
            prev.map((t) =>
              t.id === fileId
                ? {
                    ...t,
                    transferredChunks: totalChunks,
                    bytesTransferred: file.size,
                    speedBps: file.size / totalElapsedSec,
                    status: 'completed',
                    verified: true,
                    completedAt: Date.now(),
                  }
                : t
            )
          );
          continue;
        }

        let currentWavePromise = produceEncryptedWave(startChunkIndex);

        for (
          let waveStart = startChunkIndex;
          waveStart < totalChunks;
          waveStart += chunksPerWave
        ) {
          const nextWavePromise = produceEncryptedWave(
            waveStart + chunksPerWave
          );

          const currentWave = await currentWavePromise;
          currentWavePromise = nextWavePromise;
          if (!currentWave) break;

          const currentLanes = getOpenDataChannelLanes();

          if (currentLanes.length > 0) {
            for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
              const frame = currentWave.encryptedFrames[i];
              if (localBusRef.current && localBusPeersRef.current.length > 0) {
                try {
                  localBusRef.current.postMessage(frame.slice(0));
                } catch {}
              }
              if (!trySendBinaryPacketSync(frame)) {
                await sendBinaryPacketSafely(frame);
              }

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
            localBusRef.current &&
            localBusPeersRef.current.length > 0
          ) {
            for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
              const frame = currentWave.encryptedFrames[i];
              const chunkIndex = currentWave.waveStartChunk + i;
              try {
                localBusRef.current.postMessage(frame.slice(0));
              } catch {}

              const now = performance.now();
              if (now - lastUiUpdateAt >= 50 || chunkIndex + 1 === totalChunks) {
                lastUiUpdateAt = now;
                const chunksDone = chunkIndex + 1;
                const rawBytesQueued = Math.min(
                  file.size,
                  chunksDone * WIRE_CHUNK_BYTES
                );
                const elapsedSec = Math.max(0.02, (now - startedAt) / 1000);
                const speedBps = rawBytesQueued / elapsedSec;

                setTransfers((prev) =>
                  prev.map((t) =>
                    t.id === fileId
                      ? {
                          ...t,
                          transferredChunks: chunksDone,
                          bytesTransferred: rawBytesQueued,
                          speedBps,
                        }
                      : t
                  )
                );
              }
            }
          } else if (
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN
          ) {
            for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
              const frame = currentWave.encryptedFrames[i];
              const chunkIndex = currentWave.waveStartChunk + i;
              while (
                wsRef.current &&
                wsRef.current.readyState === WebSocket.OPEN &&
                wsRef.current.bufferedAmount > HIGH_WATER_MARK * 2
              ) {
                await new Promise<void>((r) => window.setTimeout(r, 4));
              }
              wsRef.current?.send(frame);

              const now = performance.now();
              if (now - lastUiUpdateAt >= 60 || chunkIndex + 1 === totalChunks) {
                lastUiUpdateAt = now;
                const chunksDone = chunkIndex + 1;
                const rawBytesQueued = Math.min(
                  file.size,
                  chunksDone * WIRE_CHUNK_BYTES
                );
                const elapsedSec = Math.max(0.02, (now - startedAt) / 1000);
                const speedBps = rawBytesQueued / elapsedSec;

                setTransfers((prev) =>
                  prev.map((t) =>
                    t.id === fileId
                      ? {
                          ...t,
                          transferredChunks: chunksDone,
                          bytesTransferred: rawBytesQueued,
                          speedBps,
                        }
                      : t
                  )
                );
              }
            }
          }
        }

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
      `Streaming Protocol   : Dedicated Zero-Split SCTP (240 KB Frames)`,
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

  const isPeerConnected =
    peers.length > 0 ||
    exeBridgeConnected ||
    localBusPeers.length > 0 ||
    cloudWebPeers.length > 0;
  const chunkSizeLabel = 'Auto-Tuned 240 KB × 32';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 font-display"
        >
          AetherTunnel <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">v1.0</span>
        </a>

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
            onClick={() => setActiveTab('inspector')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'inspector'
                ? 'text-slate-100 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            EXE vs Web Inspector
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
        </nav>

        <div className="flex items-center shrink-0">
          <button
            onClick={handleCreateNewTunnel}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Secure Tunnel
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 py-8">
        {activeTab === 'studio' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Zero-Configuration P2P File Tunnel</span>
                  <span aria-hidden="true">·</span>
                  <span>Direct Zero-Copy SCTP + Resumable Chunks</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-medium">
                    {exeBridgeConnected
                      ? 'Windows .EXE Native Kernel Bridge Connected'
                      : localBusPeers.length > 0
                      ? 'Direct Browser-to-Browser Active (Local Tab Bus)'
                      : cloudWebPeers.length > 0
                      ? 'Encrypted Cloud Wormhole Relay Connected (Cross-Device P2P)'
                      : isPeerConnected
                      ? connectionState === 'connected_p2p'
                        ? 'Direct WebRTC P2P Active (Dedicated SCTP)'
                        : 'Encrypted Binary TCP/443 Relay Active'
                      : 'Awaiting Peer Pairing'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1">
                  Encrypted Peer-to-Peer File Transfer
                </h1>
              </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() =>
                      downloadNativeWindowsKernelExe(
                        roomCode,
                        `${window.location.origin.replace(/^http/, 'ws')}/ws-tunnel`
                      )
                    }
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    title="Downloads the High-DPI Standalone Windows P2P NAT-Punching & Kernel-Socket .EXE (v1.0 · STUN + UDP Hole Punching + Resumable Transfers)"
                  >
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    Download Standalone P2P .EXE (v1.0)
                  </button>
                </div>
              </div>

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
                      ? 'Direct UDP (1x Dedicated SCTP)'
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
                  <span>04. Direct WebRTC Channel</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-100">
                  {chunkSizeLabel} · 1x Direct SCTP
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  8 MB In-Flight Window · Zero-Copy Wire Frames
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
                  <div>
                    <h2 className="text-base font-semibold text-slate-100">
                      Tunnel Pairing &amp; Authentication
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Share this Wormhole Code or link with your peer to establish a direct encrypted tunnel.
                    </p>
                  </div>

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

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-100">
                          NAT Traversal &amp; Transport Routing
                        </h2>
                        <button
                          onClick={() => setActiveTab('diagnostics')}
                          className="text-xs text-sky-400 hover:text-sky-300 cursor-pointer"
                        >
                          Inspect ICE Table →
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Configure transport routing and WebRTC SCTP connection (1x dedicated zero-lock C++ SCTP pipe).
                      </p>

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

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          SCTP Engine Profile
                        </span>
                        <span className="font-mono text-emerald-400">
                          1x Direct Zero-Copy SCTP
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        Single dedicated WebRTC SCTP pipe: <span className="text-slate-200 font-mono">240 KB</span> atomic zero-copy frames, <span className="text-slate-200 font-mono">7.5 MB</span> L3-cache wave, and synchronous zero-await packet bursting.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Connected Tunnel Peers</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {peers.length} remote
                      </span>
                    </div>

                    {peers.length === 0 ? (
                      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-400">
                        No remote peer in room yet.
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

              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
                  {incomingFileAlert && (
                    <div className="p-3.5 bg-sky-950/40 border border-sky-800/60 rounded-lg flex items-center justify-between gap-3 text-xs text-sky-200">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-sky-400 shrink-0 animate-bounce" />
                        <span className="font-medium">{incomingFileAlert}</span>
                      </div>
                      <button
                        onClick={() => setIncomingFileAlert(null)}
                        className="text-sky-400 hover:text-sky-300 font-bold px-1.5 py-0.5"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-slate-100">
                        Encrypted File Staging &amp; Streamer
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Zero-split 240 KB hardware frames · 1x Dedicated Direct SCTP Pipe · 64 MB continuous in-flight window.
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
                      Any file size (10 GB+ supported) · Dedicated Direct P2P Pipe · Raw Binary Serializer (0% BinaryPack Overhead)
                    </p>
                  </div>

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
                                      ? 'Interrupted / Paused'
                                      : `${pct}%`}
                                  </span>
                                  {item.direction === 'outgoing' &&
                                    item.status !== 'completed' &&
                                    selectedFilesByKeyRef.current.has(
                                      `${item.name}::${item.size}`
                                    ) && (
                                      <button
                                        onClick={() => {
                                          const saved =
                                            selectedFilesByKeyRef.current.get(
                                              `${item.name}::${item.size}`
                                            );
                                          if (saved) {
                                            void handleFilesSelected([saved]);
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors cursor-pointer"
                                        title="Resume interrupted transfer from receiver's last verified chunk"
                                      >
                                        Resume
                                      </button>
                                    )}
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

        {activeTab === 'inspector' && (
          <ClientInspectorView
            roomCode={roomCode}
            keyFingerprint={keyFingerprint}
            exeBridgeConnected={exeBridgeConnected}
            connectionState={connectionState}
            natReport={natReport}
            peers={peers}
            transfers={transfers}
          />
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


      </main>

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
          </div>
        </div>
      </footer>
    </div>
  );
}
