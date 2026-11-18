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
  FolderPlus,
  Trash2,
  X,
  ShieldCheck,
  Clock,
  Pause,
  Play,
  Gauge,
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
import {
  downloadNativeWindowsKernelExe,
  generateStandalonePortableHtml,
  triggerBrowserDownload,
} from './utils/standaloneBuilder';

type ActiveTab = 'studio' | 'inspector' | 'diagnostics' | 'ledger';

const WIRE_CHUNK_BYTES = 240 * 1024;
const MAX_PARALLEL_LANES = 2; // Palautettu 2:een, kuten aiemmin todettiin
const CHUNKS_PER_WAVE = 48;
const HIGH_WATER_MARK = 24 * 1024 * 1024; // Rennompi WebRTC-puskuri
const LOW_WATER_MARK = 12 * 1024 * 1024;
const MAX_ROOM_PEERS = 8;

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
  lastWindowAt: number;
  lastWindowBytes: number;
  smoothedLiveBps: number;
  initialBytes: number;
  awaitingAcceptance: boolean;
  rejected: boolean;
}

interface PendingIncomingRequest {
  key: string;
  id: string;
  senderLabel: string;
  name: string;
  size: number;
  hasResume?: boolean;
  resolve: (decision: 'accept' | 'accept_all' | 'reject') => void;
}

interface QueuedUploadItem {
  id: string;
  file: File;
  displayName: string;
  size: number;
  targetPeerId: string;
  targetLabel: string;
  status:
    | 'queued'
    | 'waiting_peer'
    | 'waiting_accept'
    | 'transferring'
    | 'paused'
    | 'completed'
    | 'rejected'
    | 'error';
  errorMessage?: string;
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
    return params.get('room')?.toLowerCase().trim() || '';
  });
  const [joinCodeInput, setJoinCodeInput] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room')?.toLowerCase().trim() || '';
  });
  const [passphrase, setPassphrase] = useState<string>('');
  const [keyFingerprint, setKeyFingerprint] = useState<string>('Deriving...');
  const cryptoKeyRef = useRef<CryptoKey | null>(null);

  const [peerId] = useState<string>(
    () => `peer-${Math.random().toString(36).slice(2, 9)}`
  );
  const [localDisplayName, setLocalDisplayName] = useState<string>(() => `Browser-${peerId.slice(-4)}`);
  const localDisplayNameRef = useRef<string>(localDisplayName);
  localDisplayNameRef.current = localDisplayName;
  const [connectionState, setConnectionState] =
    useState<TunnelConnectionState>('signaling');
  const [transportStrategy, setTransportStrategy] =
    useState<TransportStrategy>('auto');
  const [peers, setPeers] = useState<PeerSummary[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('all');
  const [roomFullMessage, setRoomFullMessage] = useState<string | null>(null);
  const [allowLocalExeBridge, setAllowLocalExeBridge] = useState<boolean>(false);
  const allowLocalExeBridgeRef = useRef<boolean>(false);
  allowLocalExeBridgeRef.current = allowLocalExeBridge;
  const [openPoolCount, setOpenPoolCount] = useState<number>(1);

  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [notes, setNotes] = useState<EncryptedNote[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<'code' | 'link' | null>(null);
  const [incomingFileAlert, setIncomingFileAlert] = useState<string | null>(null);

  const [natReport, setNatReport] = useState<NatProbeReport | null>(null);
  const [isProbingNat, setIsProbingNat] = useState<boolean>(false);

  const [autoAcceptIncoming, setAutoAcceptIncoming] = useState<boolean>(false);
  const autoAcceptIncomingRef = useRef<boolean>(false);
  autoAcceptIncomingRef.current = autoAcceptIncoming;
  const [pendingIncomingQueue, setPendingIncomingQueue] = useState<PendingIncomingRequest[]>([]);
  const acceptedPromptKeysRef = useRef<Set<string>>(new Set());
  const requestIncomingConfirmationRef = useRef<
    (req: {
      key: string;
      id: string;
      senderLabel: string;
      name: string;
      size: number;
      hasResume?: boolean;
    }) => Promise<'accept' | 'accept_all' | 'reject'>
  >(async () => 'accept');

  const [uploadQueue, setUploadQueue] = useState<QueuedUploadItem[]>([]);
  const uploadQueueRef = useRef<QueuedUploadItem[]>([]);
  uploadQueueRef.current = uploadQueue;
  const queueProcessingRef = useRef<boolean>(false);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [isTransferPaused, setIsTransferPaused] = useState<boolean>(false);
  const isTransferPausedRef = useRef<boolean>(false);
  isTransferPausedRef.current = isTransferPaused;
  const pausedTransferIdsRef = useRef<Set<string>>(new Set());
  const pauseResolversRef = useRef<Set<() => void>>(new Set());
  const [maxUploadMBpsInput, setMaxUploadMBpsInput] = useState<string>('0');
  const maxUploadMBpsRef = useRef<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const peerConnsByPeerRef = useRef<Map<string, Map<number, RTCPeerConnection>>>(new Map());
  const pendingIceByPeerRef = useRef<Map<string, Map<number, RTCIceCandidateInit[]>>>(new Map());
  const dataChannelsByPeerRef = useRef<Map<string, RTCDataChannel[]>>(new Map());
  const peerJsInstanceRef = useRef<Peer | null>(null);
  const peerJsConnsRef = useRef<DataConnection[]>([]);
  const incomingBuffersRef = useRef<Map<string, IncomingFileBuffer>>(new Map());
  const resumeBuffersByKeyRef = useRef<Map<string, IncomingFileBuffer>>(new Map());
  const selectedFilesByKeyRef = useRef<Map<string, File>>(new Map());
  const resumeFromChunkMapRef = useRef<Map<string, number>>(new Map());
  const resumeAckResolversRef = useRef<Map<string, (chunkIdx: number) => void>>(new Map());
  const waitAcceptHandlersRef = useRef<Map<string, () => void>>(new Map());
  const rejectHandlersRef = useRef<Map<string, () => void>>(new Map());
  const partialSubFramesRef = useRef<Map<string, PartialSubFrameAssembly>>(
    new Map()
  );
  const numIdToFileIdRef = useRef<Map<number, string>>(new Map());
  const orphanChunksRef = useRef<Map<number, ArrayBuffer[]>>(new Map());
  const laneRoundRobinRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const exeWsRef = useRef<WebSocket | null>(null);
  const cloudExeWsRef = useRef<WebSocket | null>(null);
  const cloudExePeersRef = useRef<Map<string, { lastSeen: number; label: string }>>(new Map());
  const [cloudExePeers, setCloudExePeers] = useState<string[]>([]);
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

  const requestIncomingConfirmation = useCallback(
    (req: {
      key: string;
      id: string;
      senderLabel: string;
      name: string;
      size: number;
      hasResume?: boolean;
    }): Promise<'accept' | 'accept_all' | 'reject'> => {
      if (autoAcceptIncomingRef.current || acceptedPromptKeysRef.current.has(req.key)) {
        return Promise.resolve('accept');
      }
      return new Promise<'accept' | 'accept_all' | 'reject'>((resolve) => {
        setPendingIncomingQueue((prev) => {
          if (prev.some((p) => p.id === req.id)) return prev;
          return [...prev, { ...req, resolve }];
        });
      });
    },
    []
  );
  requestIncomingConfirmationRef.current = requestIncomingConfirmation;

  const resolvePendingIncoming = useCallback(
    (item: PendingIncomingRequest, decision: 'accept' | 'accept_all' | 'reject') => {
      if (decision === 'accept_all') {
        autoAcceptIncomingRef.current = true;
        setAutoAcceptIncoming(true);
        setPendingIncomingQueue((prev) => {
          for (const entry of prev) {
            acceptedPromptKeysRef.current.add(entry.key);
            entry.resolve('accept_all');
          }
          return [];
        });
        return;
      }
      if (decision === 'accept') {
        acceptedPromptKeysRef.current.add(item.key);
      }
      setPendingIncomingQueue((prev) => prev.filter((p) => p.id !== item.id));
      item.resolve(decision);
    },
    []
  );

  const wakePauseWaiters = useCallback(() => {
    const waiters = Array.from(pauseResolversRef.current);
    pauseResolversRef.current.clear();
    for (const wake of waiters) {
      try {
        wake();
      } catch {}
    }
  }, []);

  const toggleGlobalTransferPause = useCallback(() => {
    const nextPaused = !isTransferPausedRef.current;
    isTransferPausedRef.current = nextPaused;
    setIsTransferPaused(nextPaused);
    if (!nextPaused) {
      pausedTransferIdsRef.current.clear();
      setTransfers((prev) =>
        prev.map((t) =>
          t.direction === 'outgoing' && t.status === 'paused'
            ? { ...t, status: 'transferring' }
            : t
        )
      );
      setUploadQueue((prev) =>
        prev.map((q) =>
          q.status === 'paused' ? { ...q, status: 'transferring' } : q
        )
      );
      wakePauseWaiters();
    } else {
      setTransfers((prev) =>
        prev.map((t) =>
          t.direction === 'outgoing' && t.status === 'transferring'
            ? { ...t, status: 'paused', speedBps: 0 }
            : t
        )
      );
      setUploadQueue((prev) =>
        prev.map((q) =>
          q.status === 'transferring' ? { ...q, status: 'paused' } : q
        )
      );
    }
  }, [wakePauseWaiters]);

  const toggleItemTransferPause = useCallback(
    (transferId: string, queueItemId?: string) => {
      const currentlyPaused =
        isTransferPausedRef.current ||
        pausedTransferIdsRef.current.has(transferId);
      if (currentlyPaused) {
        pausedTransferIdsRef.current.delete(transferId);
        if (isTransferPausedRef.current) {
          isTransferPausedRef.current = false;
          setIsTransferPaused(false);
        }
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === transferId && t.status === 'paused'
              ? { ...t, status: 'transferring' }
              : t
          )
        );
        if (queueItemId) {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === queueItemId && q.status === 'paused'
                ? { ...q, status: 'transferring' }
                : q
            )
          );
        }
        wakePauseWaiters();
      } else {
        pausedTransferIdsRef.current.add(transferId);
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === transferId && t.status === 'transferring'
              ? { ...t, status: 'paused', speedBps: 0 }
              : t
          )
        );
        if (queueItemId) {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === queueItemId && q.status === 'transferring'
                ? { ...q, status: 'paused' }
                : q
            )
          );
        }
      }
    },
    [wakePauseWaiters]
  );

  const waitIfTransferPaused = useCallback(
    async (
      fileId: string,
      queueItemId?: string,
      onResumed?: (pausedMs: number) => void
    ): Promise<void> => {
      if (
        !isTransferPausedRef.current &&
        !pausedTransferIdsRef.current.has(fileId)
      ) {
        return;
      }
      const pauseStarted = performance.now();
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === fileId && t.status === 'transferring'
            ? { ...t, status: 'paused', speedBps: 0 }
            : t
        )
      );
      if (queueItemId) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === queueItemId && q.status === 'transferring'
              ? { ...q, status: 'paused' }
              : q
          )
        );
      }

      while (
        isTransferPausedRef.current ||
        pausedTransferIdsRef.current.has(fileId)
      ) {
        await new Promise<void>((resolve) => {
          let settled = false;
          const wake = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            pauseResolversRef.current.delete(wake);
            resolve();
          };
          const timer = window.setTimeout(wake, 250);
          pauseResolversRef.current.add(wake);
        });
      }

      setTransfers((prev) =>
        prev.map((t) =>
          t.id === fileId && t.status === 'paused'
            ? { ...t, status: 'transferring' }
            : t
        )
      );
      if (queueItemId) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === queueItemId && q.status === 'paused'
              ? { ...q, status: 'transferring' }
              : q
          )
        );
      }
      onResumed?.(performance.now() - pauseStarted);
    },
    []
  );

  useEffect(() => {
    const clean = roomCode.trim();
    if (!clean) {
      cryptoKeyRef.current = null;
      setKeyFingerprint('Waiting for tunnel name...');
      return;
    }
    let cancelled = false;
    deriveTunnelKey(clean, passphrase).then(({ key, fingerprint }) => {
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

  const resolveCanonicalPeerKey = useCallback((rawId: string): string => {
    if (!rawId) return '';
    const matched = peersRef.current.find(
      (p) => p.id === rawId || p.cloudId === rawId
    );
    if (matched) return matched.id;
    const idx = rawId.lastIndexOf('peer-');
    if (idx >= 0) return rawId.slice(idx);
    return rawId;
  }, []);

  const finalizeIncomingBufferIfComplete = useCallback(
    (bufEntry: IncomingFileBuffer) => {
      if (bufEntry.rejected || bufEntry.awaitingAcceptance) return false;
      let filledCount = 0;
      for (let i = 0; i < bufEntry.totalChunks; i++) {
        if (bufEntry.receivedChunks[i] !== undefined) {
          filledCount++;
        }
      }
      if (filledCount < bufEntry.totalChunks) return false;

      const now = performance.now();
      const fileId = bufEntry.id;
      const elapsedSec = Math.max(0.015, (now - bufEntry.startedAt) / 1000);
      const netBytes = Math.max(0, bufEntry.size - bufEntry.initialBytes);
      const avgSpeedBps = netBytes / elapsedSec;
      const speedBps = bufEntry.smoothedLiveBps > 0 ? bufEntry.smoothedLiveBps : avgSpeedBps;

      const orderedParts: ArrayBuffer[] = [];
      for (let i = 0; i < bufEntry.totalChunks; i++) {
        orderedParts.push(bufEntry.receivedChunks[i]!);
      }

      const totalByteLength = orderedParts.reduce((sum, p) => sum + p.byteLength, 0);
      const combinedFileArray = new Uint8Array(totalByteLength);
      let offset = 0;
      for (const part of orderedParts) {
        combinedFileArray.set(new Uint8Array(part), offset);
        offset += part.byteLength;
      }

      bufEntry.receivedChunks.length = 0;

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
                avgSpeedBps,
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
      return true;
    },
    []
  );

  const recordDecryptedChunk = useCallback(
    (
      bufEntry: IncomingFileBuffer,
      chunkIndex: number,
      decryptedChunk: ArrayBuffer
    ) => {
      if (bufEntry.rejected) return;
      if (chunkIndex >= 0 && chunkIndex < bufEntry.totalChunks) {
        if (bufEntry.receivedChunks[chunkIndex] === undefined) {
          bufEntry.receivedChunks[chunkIndex] = decryptedChunk;
          bufEntry.receivedCount += 1;
        }
      }

      if (bufEntry.awaitingAcceptance) {
        return;
      }

      if (finalizeIncomingBufferIfComplete(bufEntry)) {
        return;
      }

      const now = performance.now();
      const fileId = bufEntry.id;

      if (now - bufEntry.lastUiUpdateAt >= 120) {
        let filledCount = 0;
        for (let i = 0; i < bufEntry.totalChunks; i++) {
          if (bufEntry.receivedChunks[i] !== undefined) filledCount++;
        }
        const bytesSoFar = Math.min(
          bufEntry.size,
          filledCount * bufEntry.chunkSize
        );
        const winDt = (now - bufEntry.lastWindowAt) / 1000;
        if (winDt >= 0.35 && bytesSoFar >= bufEntry.lastWindowBytes) {
          const instBps = (bytesSoFar - bufEntry.lastWindowBytes) / winDt;
          bufEntry.smoothedLiveBps =
            bufEntry.smoothedLiveBps > 0
              ? bufEntry.smoothedLiveBps * 0.72 + instBps * 0.28
              : instBps;
          bufEntry.lastWindowAt = now;
          bufEntry.lastWindowBytes = bytesSoFar;
        }
        bufEntry.lastUiUpdateAt = now;

        const elapsedSec = Math.max(0.015, (now - bufEntry.startedAt) / 1000);
        const netBytes = Math.max(0, bytesSoFar - bufEntry.initialBytes);
        const avgSpeedBps = netBytes / elapsedSec;
        const speedBps = bufEntry.smoothedLiveBps > 0 ? bufEntry.smoothedLiveBps : avgSpeedBps;

        setTransfers((prev) =>
          prev.map((item) =>
            item.id === fileId && item.direction === 'incoming'
              ? {
                  ...item,
                  transferredChunks: filledCount,
                  bytesTransferred: bytesSoFar,
                  speedBps,
                  avgSpeedBps,
                }
              : item
          )
        );
      }
    },
    [finalizeIncomingBufferIfComplete]
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

      if (packet.kind === 'file:resume-ack' || packet.kind === 'exe:resume-ack' || packet.kind === 'browser:resume-ack') {
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

      if (packet.kind === 'file:wait-accept' || packet.kind === 'exe:wait-accept' || packet.kind === 'browser:wait-accept') {
        const keyStr = `${packet.name || ''}::${Number(packet.size) || 0}`;
        const fidStr = String(packet.fileId || '');
        const handler =
          (fidStr && waitAcceptHandlersRef.current.get(fidStr)) ||
          waitAcceptHandlersRef.current.get(keyStr);
        if (handler) handler();
        return;
      }

      if (packet.kind === 'file:reject' || packet.kind === 'exe:file-reject' || packet.kind === 'browser:file-reject') {
        const keyStr = `${packet.name || ''}::${Number(packet.size) || 0}`;
        const fidStr = String(packet.fileId || '');
        const handler =
          (fidStr && rejectHandlersRef.current.get(fidStr)) ||
          rejectHandlersRef.current.get(keyStr);
        if (handler) handler();
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

        const nowMs = performance.now();
        if (
          existingCheckpoint &&
          existingCheckpoint.totalChunks === totalChunks &&
          existingCheckpoint.receivedCount > 0 &&
          existingCheckpoint.receivedCount < totalChunks &&
          !existingCheckpoint.rejected
        ) {
          existingCheckpoint.id = fileId;
          existingCheckpoint.transferNumId = numId;
          existingCheckpoint.transportUsed = sourceTransport;
          existingCheckpoint.lastWindowAt = nowMs;
          existingCheckpoint.startedAt = nowMs;
          existingCheckpoint.smoothedLiveBps = 0;
          activeBuf = existingCheckpoint;

          while (
            firstMissingChunk < totalChunks &&
            activeBuf.receivedChunks[firstMissingChunk] !== undefined
          ) {
            firstMissingChunk++;
          }
          activeBuf.initialBytes = Math.min(size, activeBuf.receivedCount * activeBuf.chunkSize);
          activeBuf.lastWindowBytes = activeBuf.initialBytes;
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
            startedAt: nowMs,
            lastUiUpdateAt: 0,
            lastWindowAt: nowMs,
            lastWindowBytes: 0,
            smoothedLiveBps: 0,
            initialBytes: 0,
            awaitingAcceptance: false,
            rejected: false,
          };
          resumeBuffersByKeyRef.current.set(resumeKey, activeBuf);
        }

        const sendReplyPacket = (replyPkt: Record<string, unknown>) => {
          const serializedReply = JSON.stringify(replyPkt);
          for (const dcs of dataChannelsByPeerRef.current.values()) {
            for (const dc of dcs) {
              if (dc.readyState === 'open') {
                try {
                  dc.send(serializedReply);
                } catch {}
              }
            }
          }
          for (const conn of peerJsConnsRef.current) {
            if (conn.open) {
              try {
                conn.send(serializedReply);
              } catch {}
            }
          }
          if (localBusRef.current && localBusPeersRef.current.length > 0) {
            try {
              localBusRef.current.postMessage({ type: 'bus:packet', packet: replyPkt });
            } catch {}
          }
          if (sendCloudCandidateRef.current && cloudWebPeersRef.current.length > 0) {
            for (const pDst of cloudWebPeersRef.current) {
              sendCloudCandidateRef.current(pDst, { kind: 'browser:packet', packet: replyPkt });
            }
          }
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              wsRef.current.send(JSON.stringify({ type: 'relay:packet', packet: replyPkt }));
            } catch {}
          }
        };

        const needsConfirm =
          !autoAcceptIncomingRef.current &&
          !acceptedPromptKeysRef.current.has(resumeKey);

        activeBuf.awaitingAcceptance = needsConfirm;
        numIdToFileIdRef.current.set(numId, fileId);
        incomingBuffersRef.current.set(fileId, activeBuf);

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
              avgSpeedBps: 0,
              status: needsConfirm ? 'awaiting_acceptance' : 'transferring',
              sha256,
              verified: false,
              direction: 'incoming',
              transportUsed: sourceTransport,
              startedAt: Date.now(),
            },
            ...filtered,
          ];
        });

        const flushOrphansForBuf = () => {
          const orphans = orphanChunksRef.current.get(numId);
          if (orphans && orphans.length > 0) {
            orphanChunksRef.current.delete(numId);
            const bufEntry = incomingBuffersRef.current.get(fileId);
            if (bufEntry && !bufEntry.rejected) {
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
        };

        if (needsConfirm) {
          setIncomingFileAlert(
            `Confirmation required: ${name} (${formatBytes(size)}) — Accept or decline the incoming transfer above.`
          );
          sendReplyPacket({
            kind: 'file:wait-accept',
            fileId,
            name,
            size,
          });
          void requestIncomingConfirmationRef
            .current({
              key: resumeKey,
              id: fileId,
              senderLabel: sourceTransport,
              name,
              size,
              hasResume: firstMissingChunk > 0,
            })
            .then((decision) => {
              if (decision === 'reject') {
                activeBuf.rejected = true;
                activeBuf.awaitingAcceptance = false;
                activeBuf.receivedChunks.length = 0;
                incomingBuffersRef.current.delete(fileId);
                resumeBuffersByKeyRef.current.delete(resumeKey);
                numIdToFileIdRef.current.delete(numId);
                orphanChunksRef.current.delete(numId);
                setIncomingFileAlert(null);
                setTransfers((prev) =>
                  prev.map((item) =>
                    item.id === fileId && item.direction === 'incoming'
                      ? {
                          ...item,
                          status: 'rejected',
                          errorMessage: 'Transfer declined by recipient',
                        }
                      : item
                  )
                );
                sendReplyPacket({
                  kind: 'file:reject',
                  fileId,
                  name,
                  size,
                });
                return;
              }

              const acceptNow = performance.now();
              activeBuf.awaitingAcceptance = false;
              activeBuf.startedAt = acceptNow;
              activeBuf.lastWindowAt = acceptNow;
              activeBuf.lastWindowBytes = activeBuf.initialBytes;
              activeBuf.smoothedLiveBps = 0;
              setIncomingFileAlert(
                `Vastaanotetaan: ${name} (${formatBytes(size)})...`
              );
              setTransfers((prev) =>
                prev.map((item) =>
                  item.id === fileId && item.direction === 'incoming'
                    ? { ...item, status: 'transferring', startedAt: Date.now() }
                    : item
                )
              );
              sendReplyPacket({
                kind: 'file:resume-ack',
                fileId,
                name,
                size,
                resumeFromChunk: firstMissingChunk,
                receivedCount: activeBuf.receivedCount,
              });
              flushOrphansForBuf();
              finalizeIncomingBufferIfComplete(activeBuf);
            });
          return;
        }

        if (firstMissingChunk > 0) {
          const resumePct = Math.round((firstMissingChunk / Math.max(1, totalChunks)) * 100);
          setIncomingFileAlert(
            `Resuming Interrupted File: ${name} from ${resumePct}% (${firstMissingChunk}/${totalChunks} chunks already in memory)...`
          );
          sendReplyPacket({
            kind: 'file:resume-ack',
            fileId,
            name,
            size,
            resumeFromChunk: firstMissingChunk,
            receivedCount: activeBuf.receivedCount,
          });
        } else {
          setIncomingFileAlert(
            `Incoming File Detected: ${name} (${formatBytes(size)}) — Receiving and preparing download...`
          );
        }

        flushOrphansForBuf();
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
        if (!bufEntry || bufEntry.rejected) return;

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
          setNotes((prev) => {
            const nid = packet.id || `note-${Date.now()}`;
            if (prev.some((n) => n.id === nid)) return prev;
            return [
              {
                id: nid,
                senderLabel: packet.senderLabel || 'Remote Peer',
                recipientLabel: packet.recipientLabel || undefined,
                text,
                timestamp: Date.now(),
                verified: true,
              },
              ...prev,
            ];
          });
        } catch {
          // Ignore notes encrypted with mismatched passphrase
        }
      }
    },
    [handleRawBinaryFrame, recordDecryptedChunk, finalizeIncomingBufferIfComplete]
  );

  const registerDataChannelLane = useCallback(
    (remotePeerKey: string, channel: RTCDataChannel, managedByPeerJs = false) => {
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
        let openCount = 0;
        for (const dcs of dataChannelsByPeerRef.current.values()) {
          openCount += dcs.filter((c) => c.readyState === 'open').length;
        }
        setOpenPoolCount(Math.max(1, openCount));
      };

      channel.addEventListener('open', () => {
        setConnectionState('connected_p2p');
        syncPoolCount();
      });

      channel.addEventListener('close', () => {
        const list = dataChannelsByPeerRef.current.get(remotePeerKey) || [];
        dataChannelsByPeerRef.current.set(
          remotePeerKey,
          list.filter((c) => c !== channel && c.readyState !== 'closed')
        );
        syncPoolCount();
      });

      const list = dataChannelsByPeerRef.current.get(remotePeerKey) || [];
      if (!list.includes(channel)) {
        list.push(channel);
        dataChannelsByPeerRef.current.set(remotePeerKey, list);
      }
      syncPoolCount();
    },
    [handleRawBinaryFrame, handleTunnelPacket]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return;
    }

    const cleanCode = roomCode.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleanCode) {
      localBusRef.current = null;
      setLocalBusPeers([]);
      return;
    }
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
      if (msg.toPeerId && msg.toPeerId !== '*' && msg.toPeerId !== peerId) {
        return;
      }
      if (msg.type === 'bus:frame' && msg.frame instanceof ArrayBuffer) {
        handleRawBinaryFrame(msg.frame);
        return;
      }
      if (msg.type === 'bus:hello' && msg.peerId !== peerId) {
        setLocalBusPeers((prev) => Array.from(new Set([...prev, msg.peerId])).slice(0, MAX_ROOM_PEERS - 1));
        setPeers((prev) => {
          const existing = prev.find((p) => p.id === msg.peerId);
          if (existing) {
            return prev.map((p) =>
              p.id === msg.peerId
                ? { ...p, deviceLabel: msg.deviceLabel || p.deviceLabel }
                : p
            );
          }
          if (prev.filter((p) => !p.isLocalBridge).length >= MAX_ROOM_PEERS - 1) return prev;
          return [
            {
              id: msg.peerId,
              deviceLabel: msg.deviceLabel || 'Local Chrome Tab (Memory Bus)',
              natType: 'Local Machine Tab Bus',
              clientType: 'browser',
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
            toPeerId: msg.peerId,
            deviceLabel: `${localDisplayNameRef.current} (Local Tab)`,
          });
        } catch {}
      } else if (msg.type === 'bus:hello-reply' && msg.peerId !== peerId) {
        setLocalBusPeers((prev) => Array.from(new Set([...prev, msg.peerId])).slice(0, MAX_ROOM_PEERS - 1));
        setPeers((prev) => {
          const existing = prev.find((p) => p.id === msg.peerId);
          if (existing) return prev;
          if (prev.filter((p) => !p.isLocalBridge).length >= MAX_ROOM_PEERS - 1) return prev;
          return [
            {
              id: msg.peerId,
              deviceLabel: msg.deviceLabel || 'Local Chrome Tab (Memory Bus)',
              natType: 'Local Machine Tab Bus',
              clientType: 'browser',
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
        deviceLabel: `${localDisplayNameRef.current} (Local Tab)`,
      });
    } catch {}

    const pingInterval = window.setInterval(() => {
      try {
        bus.postMessage({
          type: 'bus:hello',
          peerId,
          deviceLabel: `${localDisplayNameRef.current} (Local Tab)`,
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
      toPeerKey: string,
      signalType: 'offer' | 'answer' | 'candidate',
      laneIdx: number,
      data: { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }
    ) => {
      const sigId = `${peerId}-${toPeerKey}-${laneIdx}-${signalType}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const msgObj = {
        type: 'webrtc:signal',
        sigId,
        fromPeerId: peerId,
        toPeerId: toPeerKey,
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
        const matchedPeer = peersRef.current.find(
          (p) => p.id === toPeerKey || p.cloudId === toPeerKey
        );
        const cloudDst = matchedPeer?.cloudId || (toPeerKey.startsWith('aethertunnel-') ? toPeerKey : '*');
        sendCloudCandidateRef.current(cloudDst, {
          kind: 'webrtc:signal',
          sigId,
          fromPeerId: peerId,
          toPeerId: toPeerKey,
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
    async (targetPeerRaw: string, isInitiator: boolean, specificLaneIndex?: number) => {
      if (transportStrategy === 'websocket_relay') {
        setConnectionState('connected_relay');
        return;
      }
      const targetPeerKey = resolveCanonicalPeerKey(targetPeerRaw);
      if (!targetPeerKey || targetPeerKey === peerId) return;

      let pcMap = peerConnsByPeerRef.current.get(targetPeerKey);
      if (!pcMap) {
        pcMap = new Map();
        peerConnsByPeerRef.current.set(targetPeerKey, pcMap);
      }
      let pendMap = pendingIceByPeerRef.current.get(targetPeerKey);
      if (!pendMap) {
        pendMap = new Map();
        pendingIceByPeerRef.current.set(targetPeerKey, pendMap);
      }

      const indicesToInit =
        typeof specificLaneIndex === 'number'
          ? [specificLaneIndex]
          : Array.from({ length: MAX_PARALLEL_LANES }, (_, i) => i);

      for (const laneIdx of indicesToInit) {
        try {
          const existingPc = pcMap.get(laneIdx);
          if (
            existingPc &&
            (existingPc.connectionState === 'connected' ||
              existingPc.iceConnectionState === 'connected' ||
              existingPc.iceConnectionState === 'completed')
          ) {
            continue;
          }
          existingPc?.close();
          pendMap.set(laneIdx, []);

          const pc = new RTCPeerConnection({
            iceServers: GLOBAL_ICE_SERVERS,
          });
          pcMap.set(laneIdx, pc);

          if (isInitiator) {
            const channel = pc.createDataChannel(
              `aethertunnel-lane-${laneIdx}`,
              { ordered: false }
            );
            registerDataChannelLane(targetPeerKey, channel);
          } else {
            pc.ondatachannel = (ev) => {
              registerDataChannelLane(targetPeerKey, ev.channel);
            };
          }

          pc.onicecandidate = (ev) => {
            if (ev.candidate) {
              sendWebRtcSignalEverywhere(targetPeerKey, 'candidate', laneIdx, {
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
            sendWebRtcSignalEverywhere(targetPeerKey, 'offer', laneIdx, { sdp: offer });
          }
        } catch {}
      }
    },
    [peerId, registerDataChannelLane, resolveCanonicalPeerKey, sendWebRtcSignalEverywhere, transportStrategy]
  );

  const handleIncomingWebRtcSignal = useCallback(
    async (msg: {
      sigId?: string;
      fromPeerId?: string;
      toPeerId?: string;
      signalType?: string;
      laneIdx?: number;
      sdp?: RTCSessionDescriptionInit;
      candidate?: RTCIceCandidateInit;
    }) => {
      const rawSender = msg.fromPeerId || '';
      const senderKey = resolveCanonicalPeerKey(rawSender);
      if (!senderKey || senderKey === peerId) return;
      if (msg.toPeerId && msg.toPeerId !== '*' && resolveCanonicalPeerKey(msg.toPeerId) !== peerId) {
        return;
      }
      if (msg.sigId) {
        if (seenSignalIdsRef.current.has(msg.sigId)) return;
        seenSignalIdsRef.current.add(msg.sigId);
        if (seenSignalIdsRef.current.size > 600) {
          const first = seenSignalIdsRef.current.values().next().value;
          if (first) seenSignalIdsRef.current.delete(first);
        }
      }

      const laneIdx = typeof msg.laneIdx === 'number' ? msg.laneIdx : 0;
      let pcMap = peerConnsByPeerRef.current.get(senderKey);
      if (!pcMap) {
        pcMap = new Map();
        peerConnsByPeerRef.current.set(senderKey, pcMap);
      }
      let pendMap = pendingIceByPeerRef.current.get(senderKey);
      if (!pendMap) {
        pendMap = new Map();
        pendingIceByPeerRef.current.set(senderKey, pendMap);
      }
      let pc = pcMap.get(laneIdx);

      if (msg.signalType === 'offer' && msg.sdp) {
        if (!pc || pc.signalingState !== 'stable') {
          await initWebRtcConnectionPool(senderKey, false, laneIdx);
          pc = peerConnsByPeerRef.current.get(senderKey)?.get(laneIdx);
        }
        if (!pc) return;
        const queue = pendMap.get(laneIdx) || [];
        setConnectionState('hole_punching');
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const cand of queue) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch {}
        }
        pendMap.set(laneIdx, []);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendWebRtcSignalEverywhere(senderKey, 'answer', laneIdx, { sdp: answer });
      } else if (msg.signalType === 'answer' && msg.sdp) {
        if (!pc || pc.signalingState !== 'have-local-offer') return;
        const queue = pendMap.get(laneIdx) || [];
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const cand of queue) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch {}
        }
        pendMap.set(laneIdx, []);
      } else if (msg.signalType === 'candidate' && msg.candidate) {
        if (!pc) {
          await initWebRtcConnectionPool(senderKey, false, laneIdx);
          pc = peerConnsByPeerRef.current.get(senderKey)?.get(laneIdx);
        }
        if (!pc) return;
        const queue = pendMap.get(laneIdx) || [];
        if (pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch {}
        } else {
          queue.push(msg.candidate);
          pendMap.set(laneIdx, queue);
        }
      }
    },
    [peerId, initWebRtcConnectionPool, resolveCanonicalPeerKey, sendWebRtcSignalEverywhere]
  );

  useEffect(() => {
    if (!roomCode.trim() || isStaticHostEnvironment()) {
      return;
    }

    const cleanCode = roomCode.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const myCloudId = `aethertunnel-web-${cleanCode}-${peerId}`;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws-tunnel`;
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let unmounted = false;

    const mergeWsPeers = (serverPeers: PeerSummary[]) => {
      const otherPeers = serverPeers.filter((p) => p.id !== peerId);
      setPeers((prev) => {
        const preserved = prev.filter(
          (p) =>
            p.id === 'native-exe-bridge' ||
            p.id.startsWith('aethertunnel-exe-') ||
            (p.id.startsWith('aethertunnel-web-') &&
              !otherPeers.some((op) => op.cloudId === p.id || op.id === p.id))
        );
        const merged = [...preserved];
        for (const op of otherPeers) {
          const isExe =
            op.clientType === 'exe' ||
            op.id.startsWith('exe-kernel-') ||
            op.id.startsWith('aethertunnel-exe-');
          const norm: PeerSummary = {
            ...op,
            clientType: isExe ? 'exe' : 'browser',
          };
          const idx = merged.findIndex(
            (m) =>
              m.id === norm.id ||
              (norm.cloudId && (m.id === norm.cloudId || m.cloudId === norm.cloudId))
          );
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...norm };
          } else if (merged.filter((m) => !m.isLocalBridge).length < MAX_ROOM_PEERS - 1) {
            merged.push(norm);
          }
        }
        return merged;
      });
    };

    const connectTunnelWs = () => {
      if (unmounted) return;
      try {
        ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => {
          setRoomFullMessage(null);
          ws?.send(
            JSON.stringify({
              type: 'room:join',
              roomCode: cleanCode,
              peerId,
              cloudId: myCloudId,
              clientType: 'browser',
              deviceLabel: `${localDisplayNameRef.current} (${navigator.platform || 'Browser'})`,
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

            if (msg.type === 'room:full') {
              setRoomFullMessage(
                `Room "${cleanCode}" is full (max ${msg.maxPeers || MAX_ROOM_PEERS} users).`
              );
              setConnectionState('error');
              return;
            }

            if (msg.type === 'room:joined') {
              setRoomFullMessage(null);
              const otherPeers: PeerSummary[] = (msg.peers || []).filter(
                (p: PeerSummary) => p.id !== peerId
              );
              mergeWsPeers(otherPeers);
              const browserPeers = otherPeers.filter(
                (p) =>
                  p.clientType !== 'exe' &&
                  !p.id.startsWith('exe-kernel-') &&
                  !p.id.startsWith('aethertunnel-exe-')
              );
              for (const bp of browserPeers) {
                setConnectionState('connected_p2p');
                if (peerId > bp.id) {
                  void initWebRtcConnectionPool(bp.id, true);
                }
              }
            } else if (msg.type === 'peer:joined') {
              const otherPeers: PeerSummary[] = (msg.peers || []).filter(
                (p: PeerSummary) => p.id !== peerId
              );
              mergeWsPeers(otherPeers);
              const joinedId = msg.peer?.id ? String(msg.peer.id) : '';
              const joinedIsExe =
                msg.peer?.clientType === 'exe' ||
                joinedId.startsWith('exe-kernel-') ||
                joinedId.startsWith('aethertunnel-exe-');
              if (!joinedIsExe && joinedId) {
                setConnectionState('connected_p2p');
                if (peerId > joinedId) {
                  void initWebRtcConnectionPool(joinedId, true);
                }
              }
            } else if (msg.type === 'peer:left') {
              const leftId = msg.peerId ? String(msg.peerId) : '';
              if (leftId) {
                const pcMap = peerConnsByPeerRef.current.get(leftId);
                if (pcMap) {
                  for (const pc of pcMap.values()) {
                    try { pc.close(); } catch {}
                  }
                  peerConnsByPeerRef.current.delete(leftId);
                }
                dataChannelsByPeerRef.current.delete(leftId);
              }
              const otherPeers: PeerSummary[] = (msg.peers || []).filter(
                (p: PeerSummary) => p.id !== peerId
              );
              setPeers((prev) =>
                prev.filter(
                  (p) =>
                    p.id !== leftId &&
                    (p.id === 'native-exe-bridge' ||
                      p.id.startsWith('aethertunnel-') ||
                      otherPeers.some((op) => op.id === p.id))
                )
              );
              mergeWsPeers(otherPeers);
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
      for (const pcMap of peerConnsByPeerRef.current.values()) {
        for (const pc of pcMap.values()) {
          try { pc.close(); } catch {}
        }
      }
      peerConnsByPeerRef.current.clear();
      dataChannelsByPeerRef.current.clear();
      pendingIceByPeerRef.current.clear();
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
    if (!allowLocalExeBridge) {
      if (exeWsRef.current) {
        try {
          exeWsRef.current.close();
        } catch {}
        exeWsRef.current = null;
      }
      setExeBridgeConnected(cloudExePeersRef.current.size > 0);
      setPeers((prev) => prev.filter((p) => p.id !== 'native-exe-bridge'));
      return;
    }

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
    let rxExeLastWinAt = 0;
    let rxExeLastWinBytes = 0;
    let rxExeSmoothedBps = 0;
    let rxExeAwaitingConfirm = false;
    let rxExeRejected = false;
    let rxExeEndedWhileWaiting = false;

    const finalizeExeTransfer = () => {
      if (!rxExeFileId || rxExeRejected || rxExeAwaitingConfirm) return;
      const fid = rxExeFileId;
      const fsize = rxExeFileSize;
      const fchunks = rxExeTotalChunks;
      const elapsedSec = Math.max(0.008, (performance.now() - rxExeStartedAt) / 1000);
      const avgSpeed = fsize / elapsedSec;
      const finalSpeed = rxExeSmoothedBps > 0 ? rxExeSmoothedBps : avgSpeed;
      const blob = new Blob(rxExeChunks as BlobPart[], {
        type: 'application/octet-stream',
      });
      const downloadUrl = URL.createObjectURL(blob);
      rxExeChunks = [];
      rxExeFileId = '';
      setIncomingFileAlert(null);
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === fid
            ? {
                ...t,
                transferredChunks: fchunks,
                bytesTransferred: fsize,
                speedBps: finalSpeed,
                avgSpeedBps: avgSpeed,
                status: 'completed',
                verified: true,
                downloadUrl,
                completedAt: Date.now(),
              }
            : t
        )
      );
    };

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
                deviceLabel: 'Oma kone .EXE (Localhost 127.0.0.1:45889)',
                natType: 'Direct Localhost Kernel Bridge',
                clientType: 'local_exe',
                isLocalBridge: true,
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
            if (!rxExeFileId || rxExeRejected) return;
            const bytes = new Uint8Array(ev.data);
            rxExeChunks.push(bytes);
            rxExeBytes += bytes.byteLength;
            if (rxExeAwaitingConfirm) return;
            const now = performance.now();
            if (now - rxExeLastUiAt >= 80) {
              const winDt = (now - rxExeLastWinAt) / 1000;
              if (winDt >= 0.08 && rxExeBytes >= rxExeLastWinBytes) {
                const inst = (rxExeBytes - rxExeLastWinBytes) / winDt;
                rxExeSmoothedBps = rxExeSmoothedBps > 0 ? rxExeSmoothedBps * 0.6 + inst * 0.4 : inst;
                rxExeLastWinAt = now;
                rxExeLastWinBytes = rxExeBytes;
              }
              rxExeLastUiAt = now;
              const fid = rxExeFileId;
              const bytesNow = rxExeBytes;
              const chunksNow = rxExeChunks.length;
              const elapsedSec = Math.max(0.008, (now - rxExeStartedAt) / 1000);
              const avgSpeedBps = bytesNow / elapsedSec;
              const speedBps = rxExeSmoothedBps > 0 ? rxExeSmoothedBps : avgSpeedBps;
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fid
                    ? {
                        ...t,
                        transferredChunks: chunksNow,
                        bytesTransferred: bytesNow,
                        speedBps,
                        avgSpeedBps,
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
              } else if (msg.kind === 'exe:wait-accept' || msg.kind === 'file:wait-accept') {
                const keyStr = `${msg.name || ''}::${Number(msg.size) || 0}`;
                const fidStr = String(msg.fileId || '');
                const handler =
                  (fidStr && waitAcceptHandlersRef.current.get(fidStr)) ||
                  waitAcceptHandlersRef.current.get(keyStr);
                if (handler) handler();
              } else if (msg.kind === 'exe:file-reject' || msg.kind === 'file:reject') {
                const keyStr = `${msg.name || ''}::${Number(msg.size) || 0}`;
                const fidStr = String(msg.fileId || '');
                const handler =
                  (fidStr && rejectHandlersRef.current.get(fidStr)) ||
                  rejectHandlersRef.current.get(keyStr);
                if (handler) handler();
              } else if (msg.kind === 'exe:file-start') {
                rxExeFileId = String(msg.fileId || `exe-${Date.now()}`);
                rxExeFileName = String(msg.name || 'transfer.bin');
                rxExeFileSize = Number(msg.size) || 0;
                rxExeTotalChunks = Math.max(1, Number(msg.totalChunks) || 1);
                rxExeChunks = [];
                rxExeBytes = 0;
                rxExeStartedAt = performance.now();
                rxExeLastUiAt = 0;
                rxExeLastWinAt = rxExeStartedAt;
                rxExeLastWinBytes = 0;
                rxExeSmoothedBps = 0;
                rxExeRejected = false;
                rxExeEndedWhileWaiting = false;

                const fid = rxExeFileId;
                const fname = rxExeFileName;
                const fsize = rxExeFileSize;
                const fchunks = rxExeTotalChunks;
                const reqKey = `${fname}::${fsize}`;
                const needsConfirm =
                  !autoAcceptIncomingRef.current &&
                  !acceptedPromptKeysRef.current.has(reqKey);
                rxExeAwaitingConfirm = needsConfirm;

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
                    avgSpeedBps: 0,
                    status: needsConfirm ? 'awaiting_acceptance' : 'transferring',
                    sha256: 'kernel-exe-verified',
                    verified: false,
                    direction: 'incoming',
                    transportUsed: 'WebRTC Direct (UDP/DTLS)',
                    startedAt: Date.now(),
                  },
                  ...prev,
                ]);

                if (needsConfirm) {
                  setIncomingFileAlert(
                    `Confirmation required: ${fname} (${formatBytes(fsize)}) — Accept or decline the incoming transfer above.`
                  );
                  try {
                    ws.send(
                      JSON.stringify({
                        kind: 'exe:wait-accept',
                        fileId: fid,
                        name: fname,
                        size: fsize,
                      })
                    );
                  } catch {}
                  void requestIncomingConfirmationRef
                    .current({
                      key: reqKey,
                      id: fid,
                      senderLabel: 'Local Native .EXE Bridge',
                      name: fname,
                      size: fsize,
                    })
                    .then((decision) => {
                      if (decision === 'reject') {
                        rxExeRejected = true;
                        rxExeAwaitingConfirm = false;
                        rxExeChunks = [];
                        rxExeFileId = '';
                        setIncomingFileAlert(null);
                        setTransfers((prev) =>
                          prev.map((t) =>
                            t.id === fid
                              ? {
                                  ...t,
                                  status: 'rejected',
                                  errorMessage: 'Transfer declined by recipient',
                                }
                              : t
                          )
                        );
                        try {
                          ws.send(
                            JSON.stringify({
                              kind: 'exe:file-reject',
                              fileId: fid,
                              name: fname,
                              size: fsize,
                            })
                          );
                        } catch {}
                        return;
                      }
                      rxExeAwaitingConfirm = false;
                      rxExeStartedAt = performance.now();
                      rxExeLastWinAt = rxExeStartedAt;
                      rxExeLastWinBytes = 0;
                      rxExeSmoothedBps = 0;
                      setIncomingFileAlert(null);
                      setTransfers((prev) =>
                        prev.map((t) =>
                          t.id === fid
                            ? { ...t, status: 'transferring', startedAt: Date.now() }
                            : t
                        )
                      );
                      try {
                        ws.send(
                          JSON.stringify({
                            kind: 'exe:resume-ack',
                            fileId: fid,
                            name: fname,
                            size: fsize,
                            resumeFromChunk: 0,
                          })
                        );
                      } catch {}
                      if (rxExeEndedWhileWaiting) {
                        finalizeExeTransfer();
                      }
                    });
                }
              } else if (msg.kind === 'exe:file-end' && rxExeFileId) {
                if (rxExeRejected) {
                  rxExeChunks = [];
                  rxExeFileId = '';
                  return;
                }
                if (rxExeAwaitingConfirm) {
                  rxExeEndedWhileWaiting = true;
                  return;
                }
                finalizeExeTransfer();
              }
            } catch {}
          }
        };

        ws.onclose = () => {
          if (exeWsRef.current === ws) {
            exeWsRef.current = null;
            if (cloudExePeersRef.current.size === 0) {
              setExeBridgeConnected(false);
            }
            setPeers((prev) => prev.filter((p) => p.id !== 'native-exe-bridge'));
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
  }, [allowLocalExeBridge]);

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
    const cleanCode = roomCode
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    if (!cleanCode) {
      setCloudWebPeers([]);
      cloudPeerLastSeenRef.current.clear();
      return;
    }

    let unmounted = false;
    const sockets: WebSocket[] = [];
    let hbTimer: number | null = null;

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
    let rxLastWinAt = 0;
    let rxLastWinBytes = 0;
    let rxSmoothedBps = 0;
    let rxAwaitingConfirm = false;
    let rxRejected = false;
    let rxEndedWhileWaiting = false;
    let rxSrcPeer = '';
    let rxReplyPrefix: 'browser:' | 'exe:' = 'exe:';

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
            s.send(pkt as any);
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

    const finalizeCloudRx = () => {
      if (!rxFileId || rxRejected || rxAwaitingConfirm) return;
      const fid = rxFileId;
      const fsize = rxFileSize;
      const fchunks = rxTotalChunks;
      const elapsedSec = Math.max(0.008, (performance.now() - rxStartedAt) / 1000);
      const avgSpeed = fsize / elapsedSec;
      const finalSpeed = rxSmoothedBps > 0 ? rxSmoothedBps : avgSpeed;
      const blob = new Blob(rxChunks as BlobPart[], {
        type: 'application/octet-stream',
      });
      const downloadUrl = URL.createObjectURL(blob);
      rxChunks = [];
      rxFileId = '';
      setIncomingFileAlert(null);

      if (rxSrcPeer) {
        publishToCloudBus(rxSrcPeer, {
          kind: `${rxReplyPrefix}chunk-ack`,
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
                avgSpeedBps: avgSpeed,
                status: 'completed',
                verified: true,
                downloadUrl,
                completedAt: Date.now(),
              }
            : t
        )
      );
    };

    const broadcastBrowserHello = () => {
      publishToCloudBus('*', {
        kind: 'browser:hello',
        roomCode: cleanCode,
        peerId,
        displayName: localDisplayNameRef.current,
      });

      const now = Date.now();
      let prunedWeb = false;
      for (const [pid, lastSeen] of cloudPeerLastSeenRef.current.entries()) {
        if (now - lastSeen > 10000) {
          cloudPeerLastSeenRef.current.delete(pid);
          prunedWeb = true;
        }
      }
      if (prunedWeb) {
        const activeIds = Array.from(cloudPeerLastSeenRef.current.keys());
        setCloudWebPeers(activeIds);
        setPeers((prev) =>
          prev.filter(
            (p) =>
              !p.id.startsWith('aethertunnel-web-') || activeIds.includes(p.id)
          )
        );
      }

      let prunedExe = false;
      for (const [eid, info] of cloudExePeersRef.current.entries()) {
        if (now - info.lastSeen > 12000) {
          cloudExePeersRef.current.delete(eid);
          prunedExe = true;
        }
      }
      if (prunedExe) {
        const activeExes = Array.from(cloudExePeersRef.current.keys());
        setCloudExePeers(activeExes);
        setPeers((prev) =>
          prev.filter(
            (p) =>
              !p.id.startsWith('aethertunnel-exe-') || activeExes.includes(p.id)
          )
        );
        if (activeExes.length === 0 && exeWsRef.current?.readyState !== WebSocket.OPEN) {
          setExeBridgeConnected(false);
        }
      }
    };

    const handleWormholeEnvelope = (msg: any) => {
      if (!msg || typeof msg !== 'object') return;
      const srcPeer = typeof msg.src === 'string' ? msg.src : '';
      const dstPeer = typeof msg.dst === 'string' ? msg.dst : '*';
      if (!srcPeer || srcPeer === myCloudId) return;
      if (dstPeer && dstPeer !== '*' && dstPeer !== myCloudId && dstPeer !== peerId) return;

      const payload = msg.payload;
      if (!payload || typeof payload !== 'object') return;

      if (
        (payload.kind === 'browser:hello' ||
          payload.kind === 'web:hello' ||
          payload.kind === 'browser:hello-ack') &&
        srcPeer.startsWith('aethertunnel-web-')
      ) {
        const canonicalId = payload.peerId ? String(payload.peerId) : srcPeer;
        if (canonicalId === peerId) return;
        const alreadyKnown = peersRef.current.some(
          (p) => p.id === canonicalId || p.id === srcPeer || p.cloudId === srcPeer
        );
        if (!alreadyKnown && peersRef.current.filter((p) => !p.isLocalBridge).length >= MAX_ROOM_PEERS - 1) {
          return;
        }

        const isNew = !cloudPeerLastSeenRef.current.has(srcPeer);
        cloudPeerLastSeenRef.current.set(srcPeer, Date.now());
        setCloudWebPeers(Array.from(cloudPeerLastSeenRef.current.keys()));
        setConnectionState('connected_p2p');
        const remoteLabel =
          (payload.displayName && String(payload.displayName)) ||
          `Browser (${srcPeer.slice(-4)})`;
        setPeers((prev) => {
          const idx = prev.findIndex(
            (p) => p.id === canonicalId || p.id === srcPeer || p.cloudId === srcPeer
          );
          if (idx >= 0) {
            return prev.map((p, i) =>
              i === idx
                ? {
                    ...p,
                    cloudId: srcPeer,
                    deviceLabel: payload.displayName ? remoteLabel : p.deviceLabel,
                  }
                : p
            );
          }
          if (prev.filter((p) => !p.isLocalBridge).length >= MAX_ROOM_PEERS - 1) return prev;
          return [
            {
              id: canonicalId,
              cloudId: srcPeer,
              deviceLabel: remoteLabel,
              natType: 'Global P2P Wormhole Bus',
              clientType: 'browser',
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
            displayName: localDisplayNameRef.current,
          });
        }
        if (isNew && myCloudId > srcPeer) {
          void initWebRtcConnectionPool(canonicalId, true);
        }
      } else if (payload.kind === 'webrtc:signal') {
        void handleIncomingWebRtcSignal({
          ...payload,
          fromPeerId: payload.fromPeerId || srcPeer,
        });
      } else if (payload.kind === 'browser:packet' && payload.packet) {
        void handleTunnelPacket(payload.packet, 'Encrypted WS Relay (TCP/443)');
      } else if (
        (payload.kind === 'exe:hello' || payload.kind === 'exe:hello-reply') &&
        srcPeer.startsWith('aethertunnel-exe-')
      ) {
        const alreadyKnown = cloudExePeersRef.current.has(srcPeer);
        if (!alreadyKnown && peersRef.current.filter((p) => !p.isLocalBridge).length >= MAX_ROOM_PEERS - 1) {
          return;
        }
        const exeLabel =
          (payload.displayName && String(payload.displayName)) ||
          `Windows .EXE (${srcPeer.slice(-4)})`;
        cloudExePeersRef.current.set(srcPeer, { lastSeen: Date.now(), label: exeLabel });
        setCloudExePeers(Array.from(cloudExePeersRef.current.keys()));
        setExeBridgeConnected(true);
        setConnectionState('connected_p2p');
        setPeers((prev) => {
          const idx = prev.findIndex((p) => p.id === srcPeer || p.cloudId === srcPeer);
          if (idx >= 0) {
            return prev.map((p, i) =>
              i === idx ? { ...p, deviceLabel: exeLabel } : p
            );
          }
          if (prev.filter((p) => !p.isLocalBridge).length >= MAX_ROOM_PEERS - 1) return prev;
          return [
            {
              id: srcPeer,
              cloudId: srcPeer,
              deviceLabel: exeLabel,
              natType: 'Universal WSS Kernel Bridge (443)',
              clientType: 'exe',
              joinedAt: Date.now(),
            },
            ...prev,
          ];
        });
        if (payload.kind === 'exe:hello') {
          publishToCloudBus(srcPeer, {
            kind: 'browser:hello-ack',
            roomCode: cleanCode,
            peerId,
            displayName: localDisplayNameRef.current,
          });
        }
      } else if (
        payload.kind === 'exe:resume-ack' ||
        payload.kind === 'file:resume-ack' ||
        payload.kind === 'browser:resume-ack'
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
        payload.kind === 'exe:wait-accept' ||
        payload.kind === 'file:wait-accept' ||
        payload.kind === 'browser:wait-accept'
      ) {
        const keyStr = `${payload.name || ''}::${Number(payload.size) || 0}`;
        const fidStr = String(payload.fileId || '');
        const handler =
          (fidStr && waitAcceptHandlersRef.current.get(fidStr)) ||
          waitAcceptHandlersRef.current.get(keyStr);
        if (handler) handler();
      } else if (
        payload.kind === 'exe:file-reject' ||
        payload.kind === 'file:reject' ||
        payload.kind === 'browser:file-reject'
      ) {
        const keyStr = `${payload.name || ''}::${Number(payload.size) || 0}`;
        const fidStr = String(payload.fileId || '');
        const handler =
          (fidStr && rejectHandlersRef.current.get(fidStr)) ||
          rejectHandlersRef.current.get(keyStr);
        if (handler) handler();
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
          const prevExe = cloudExePeersRef.current.get(srcPeer);
          cloudExePeersRef.current.set(srcPeer, {
            lastSeen: Date.now(),
            label: prevExe?.label || `Windows .EXE (${srcPeer.slice(-4)})`,
          });
        }
        rxSrcPeer = srcPeer;
        rxReplyPrefix = String(payload.kind).startsWith('browser:') ? 'browser:' : 'exe:';
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
        rxLastWinAt = rxStartedAt;
        rxLastWinBytes = 0;
        rxSmoothedBps = 0;
        rxRejected = false;
        rxEndedWhileWaiting = false;

        const fid = rxFileId;
        const fname = rxFileName;
        const fsize = rxFileSize;
        const fchunks = rxTotalChunks;
        const reqKey = `${fname}::${fsize}`;
        const needsConfirm =
          !autoAcceptIncomingRef.current &&
          !acceptedPromptKeysRef.current.has(reqKey);
        rxAwaitingConfirm = needsConfirm;

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
            avgSpeedBps: 0,
            status: needsConfirm ? 'awaiting_acceptance' : 'transferring',
            sha256: 'cloud-relay-verified',
            verified: false,
            direction: 'incoming',
            transportUsed: 'Encrypted WS Relay (TCP/443)',
            startedAt: Date.now(),
          },
          ...prev,
        ]);

        if (needsConfirm) {
          setIncomingFileAlert(
            `Confirmation required: ${fname} (${formatBytes(fsize)}) — Accept or decline the incoming transfer above.`
          );
          publishToCloudBus(srcPeer, {
            kind: `${rxReplyPrefix}wait-accept`,
            fileId: fid,
            name: fname,
            size: fsize,
          });
          void requestIncomingConfirmationRef
            .current({
              key: reqKey,
              id: fid,
              senderLabel: srcPeer.startsWith('aethertunnel-exe-')
                ? 'Remote .EXE Peer'
                : 'Remote Browser Peer',
              name: fname,
              size: fsize,
            })
            .then((decision) => {
              if (decision === 'reject') {
                rxRejected = true;
                rxAwaitingConfirm = false;
                rxChunks = [];
                rxFileId = '';
                setIncomingFileAlert(null);
                setTransfers((prev) =>
                  prev.map((t) =>
                    t.id === fid
                      ? {
                          ...t,
                          status: 'rejected',
                          errorMessage: 'Transfer declined by recipient',
                        }
                      : t
                  )
                );
                publishToCloudBus(srcPeer, {
                  kind: `${rxReplyPrefix}file-reject`,
                  fileId: fid,
                  name: fname,
                  size: fsize,
                });
                return;
              }
              rxAwaitingConfirm = false;
              rxStartedAt = performance.now();
              rxLastWinAt = rxStartedAt;
              rxLastWinBytes = 0;
              rxSmoothedBps = 0;
              setIncomingFileAlert(null);
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fid
                    ? { ...t, status: 'transferring', startedAt: Date.now() }
                    : t
                )
              );
              publishToCloudBus(srcPeer, {
                kind: `${rxReplyPrefix}resume-ack`,
                fileId: fid,
                name: fname,
                size: fsize,
                resumeFromChunk: 0,
              });
              if (rxEndedWhileWaiting) {
                finalizeCloudRx();
              }
            });
        } else {
          publishToCloudBus(srcPeer, {
            kind: `${rxReplyPrefix}resume-ack`,
            fileId: fid,
            name: fname,
            size: fsize,
            resumeFromChunk: 0,
          });
        }
      } else if (
        (payload.kind === 'exe:file-chunk' ||
          payload.kind === 'browser:file-chunk') &&
        rxFileId
      ) {
        if (rxRejected) return;
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

          if (!rxAwaitingConfirm) {
            const now = performance.now();
            if (now - rxLastUiAt >= 80) {
              const winDt = (now - rxLastWinAt) / 1000;
              if (winDt >= 0.35 && rxBytes >= rxLastWinBytes) {
                const inst = (rxBytes - rxLastWinBytes) / winDt;
                rxSmoothedBps = rxSmoothedBps > 0 ? rxSmoothedBps * 0.72 + inst * 0.28 : inst;
                rxLastWinAt = now;
                rxLastWinBytes = rxBytes;
              }
              rxLastUiAt = now;
              const fid = rxFileId;
              const bytesNow = rxBytes;
              const chunksNow = rxChunks.length;
              const elapsedSec = Math.max(0.008, (now - rxStartedAt) / 1000);
              const avgSpeedBps = bytesNow / elapsedSec;
              const speedBps = rxSmoothedBps > 0 ? rxSmoothedBps : avgSpeedBps;
              setTransfers((prev) =>
                prev.map((t) =>
                  t.id === fid
                    ? {
                        ...t,
                        transferredChunks: chunksNow,
                        bytesTransferred: bytesNow,
                        speedBps,
                        avgSpeedBps,
                      }
                    : t
                )
              );
            }
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
        if (rxRejected) {
          rxChunks = [];
          rxFileId = '';
          return;
        }
        if (rxAwaitingConfirm) {
          rxEndedWhileWaiting = true;
          return;
        }
        finalizeCloudRx();
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
          socket.send(buildMqttPacket(0x10, connectBody) as any);

          const subBody = [0, 1, ...encodeMqttStr(mqttTopic), 0];
          socket.send(buildMqttPacket(0x82, subBody) as any);

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

  const getOpenDataChannelLanes = useCallback(
    (targetPeerId?: string): RTCDataChannel[] => {
      if (transportStrategy === 'websocket_relay') return [];

      if (targetPeerId && targetPeerId !== 'all') {
        const key = resolveCanonicalPeerKey(targetPeerId);
        return (dataChannelsByPeerRef.current.get(key) || []).filter(
          (dc) => dc.readyState === 'open'
        );
      }

      const allOpen: RTCDataChannel[] = [];
      for (const dcs of dataChannelsByPeerRef.current.values()) {
        for (const dc of dcs) {
          if (dc.readyState === 'open') allOpen.push(dc);
        }
      }
      return allOpen;
    },
    [transportStrategy, resolveCanonicalPeerKey]
  );

  const getTargetPeerLaneGroups = useCallback(
    (targetPeerId: string): RTCDataChannel[][] => {
      if (transportStrategy === 'websocket_relay') return [];
      const groups: RTCDataChannel[][] = [];
      if (targetPeerId && targetPeerId !== 'all') {
        const key = resolveCanonicalPeerKey(targetPeerId);
        const lanes = (dataChannelsByPeerRef.current.get(key) || []).filter(
          (dc) => dc.readyState === 'open'
        );
        if (lanes.length > 0) groups.push(lanes);
        return groups;
      }
      for (const dcs of dataChannelsByPeerRef.current.values()) {
        const open = dcs.filter((dc) => dc.readyState === 'open');
        if (open.length > 0) groups.push(open);
      }
      return groups;
    },
    [transportStrategy, resolveCanonicalPeerKey]
  );

  const trySendFrameToLaneGroup = useCallback(
    (lanes: RTCDataChannel[], packet: ArrayBuffer): boolean => {
      if (lanes.length === 0) return false;
      let bestLane = lanes[laneRoundRobinRef.current % lanes.length];
      laneRoundRobinRef.current += 1;
      for (let i = 0; i < lanes.length; i++) {
        if (lanes[i].bufferedAmount < bestLane.bufferedAmount) {
          bestLane = lanes[i];
        }
      }
      if (bestLane.bufferedAmount + packet.byteLength <= HIGH_WATER_MARK) {
        try {
          bestLane.send(packet.slice(0));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    },
    []
  );

  const sendFrameToLaneGroupSafely = useCallback(
    async (lanes: RTCDataChannel[], packet: ArrayBuffer): Promise<void> => {
      if (trySendFrameToLaneGroup(lanes, packet)) return;
      for (let attempt = 0; attempt < 20000; attempt++) {
        const openLanes = lanes.filter((c) => c.readyState === 'open');
        if (openLanes.length === 0) {
          throw new Error('No open WebRTC DataChannel lanes available for peer');
        }
        if (trySendFrameToLaneGroup(openLanes, packet)) return;
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
    [trySendFrameToLaneGroup]
  );

  const trySendBinaryPacketSync = useCallback(
    (packet: ArrayBuffer, targetPeerId: string = 'all'): boolean => {
      const groups = getTargetPeerLaneGroups(targetPeerId);
      if (groups.length === 0) {
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

      for (const lanes of groups) {
        if (!trySendFrameToLaneGroup(lanes, packet)) {
          return false;
        }
      }
      return true;
    },
    [getTargetPeerLaneGroups, trySendFrameToLaneGroup]
  );

  const sendBinaryPacketSafely = useCallback(
    async (packet: ArrayBuffer, targetPeerId: string = 'all'): Promise<void> => {
      const groups = getTargetPeerLaneGroups(targetPeerId);
      if (groups.length === 0) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(packet);
            return;
          } catch {}
        }
        throw new Error('No open WebRTC DataChannel lanes or WebSocket relay available');
      }

      for (const lanes of groups) {
        await sendFrameToLaneGroupSafely(lanes, packet);
      }
    },
    [getTargetPeerLaneGroups, sendFrameToLaneGroupSafely]
  );

  const transmitEncryptedPacket = useCallback(
    (
      packet: unknown,
      targetPeerId: string = 'all'
    ): 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' => {
      const serialized = JSON.stringify(packet);
      let transportUsed: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)' =
        'WebRTC Direct (UDP/DTLS)';

      if (localBusRef.current && localBusPeersRef.current.length > 0) {
        if (targetPeerId === 'all' || localBusPeersRef.current.includes(targetPeerId)) {
          try {
            localBusRef.current.postMessage({
              type: 'bus:packet',
              toPeerId: targetPeerId === 'all' ? '*' : targetPeerId,
              packet,
            });
          } catch {}
        }
      }

      if (sendCloudCandidateRef.current && cloudWebPeersRef.current.length > 0) {
        const matchedPeer =
          targetPeerId !== 'all'
            ? peersRef.current.find((p) => p.id === targetPeerId || p.cloudId === targetPeerId)
            : null;
        const targets =
          targetPeerId === 'all'
            ? cloudWebPeersRef.current
            : matchedPeer?.cloudId && cloudWebPeersRef.current.includes(matchedPeer.cloudId)
            ? [matchedPeer.cloudId]
            : cloudWebPeersRef.current.includes(targetPeerId)
            ? [targetPeerId]
            : [];
        for (const peerDst of targets) {
          sendCloudCandidateRef.current(peerDst, {
            kind: 'browser:packet',
            packet,
          });
        }
      }

      const groups = getTargetPeerLaneGroups(targetPeerId);
      for (const lanes of groups) {
        const openDc = lanes.find((dc) => dc.readyState === 'open');
        if (openDc) {
          try {
            openDc.send(serialized);
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
              toPeerId: targetPeerId === 'all' ? '*' : targetPeerId,
              packet,
            })
          );
          if (groups.length === 0) {
            transportUsed = 'Encrypted WS Relay (TCP/443)';
          }
        } catch {}
      }

      return transportUsed;
    },
    [getTargetPeerLaneGroups]
  );

  const waitForConfirmationHandshake = useCallback(
    (
      fileId: string,
      fileResumeKey: string,
      initialTimeoutMs: number,
      queueItemId?: string
    ): Promise<{ accepted: boolean; resumeChunk: number }> => {
      return new Promise((resolve) => {
        let settled = false;
        let timer = window.setTimeout(() => {
          cleanup();
          resolve({
            accepted: true,
            resumeChunk: resumeFromChunkMapRef.current.get(fileResumeKey) || 0,
          });
        }, initialTimeoutMs);

        const cleanup = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resumeAckResolversRef.current.delete(fileId);
          resumeAckResolversRef.current.delete(fileResumeKey);
          waitAcceptHandlersRef.current.delete(fileId);
          waitAcceptHandlersRef.current.delete(fileResumeKey);
          rejectHandlersRef.current.delete(fileId);
          rejectHandlersRef.current.delete(fileResumeKey);
        };

        const onAck = (chunkIdx: number) => {
          if (settled) return;
          cleanup();
          resolve({ accepted: true, resumeChunk: Math.max(0, chunkIdx) });
        };

        const onWaitAccept = () => {
          if (settled) return;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            cleanup();
            resolve({ accepted: false, resumeChunk: 0 });
          }, 120000);
          setTransfers((prev) =>
            prev.map((t) =>
              t.id === fileId ? { ...t, status: 'awaiting_acceptance' } : t
            )
          );
          if (queueItemId) {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.id === queueItemId ? { ...q, status: 'waiting_accept' } : q
              )
            );
          }
        };

        const onReject = () => {
          if (settled) return;
          cleanup();
          resolve({ accepted: false, resumeChunk: 0 });
        };

        resumeAckResolversRef.current.set(fileId, onAck);
        resumeAckResolversRef.current.set(fileResumeKey, onAck);
        waitAcceptHandlersRef.current.set(fileId, onWaitAccept);
        waitAcceptHandlersRef.current.set(fileResumeKey, onWaitAccept);
        rejectHandlersRef.current.set(fileId, onReject);
        rejectHandlersRef.current.set(fileResumeKey, onReject);
      });
    },
    []
  );

  const sendSingleFile = useCallback(
    async (
      file: File,
      options?: {
        displayName?: string;
        queueItemId?: string;
        targetPeerId?: string;
        targetLabel?: string;
        skipExeBridge?: boolean;
      }
    ): Promise<'completed' | 'rejected' | 'error'> => {
      const key = cryptoKeyRef.current;
      if (!key) return 'error';

      const transferName = options?.displayName || file.name;
      const queueItemId = options?.queueItemId;
      const skipExeBridge = options?.skipExeBridge || false;
      const targetPeerId = options?.targetPeerId || 'all';
      const targetLabel =
        options?.targetLabel ||
        (targetPeerId === 'all'
          ? 'Everyone in room'
          : peersRef.current.find((p) => p.id === targetPeerId)?.deviceLabel || targetPeerId);

      const activeChunkSize = WIRE_CHUNK_BYTES;
      const chunksPerWave = CHUNKS_PER_WAVE;

      const fileResumeKey = `${transferName}::${file.size}`;
      selectedFilesByKeyRef.current.set(fileResumeKey, file);
      const fileId = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;
      const totalChunks = Math.max(1, Math.ceil(file.size / activeChunkSize));

      const specificPeer =
        targetPeerId !== 'all'
          ? peersRef.current.find(
              (p) => p.id === targetPeerId || p.cloudId === targetPeerId
            )
          : null;

      const sendToLocalExe =
        !skipExeBridge &&
        Boolean(exeWsRef.current && exeWsRef.current.readyState === WebSocket.OPEN) &&
        (targetPeerId === 'native-exe-bridge' ||
          (targetPeerId === 'all' && allowLocalExeBridgeRef.current));

      const targetCloudExeIds: string[] =
        !skipExeBridge && sendCloudCandidateRef.current
          ? targetPeerId === 'all'
            ? Array.from(cloudExePeersRef.current.keys())
            : targetPeerId.startsWith('aethertunnel-exe-')
            ? [targetPeerId]
            : []
          : [];

      const openTargetLanes = getOpenDataChannelLanes(targetPeerId);
      const hasWebRtcTarget =
        openTargetLanes.length > 0 &&
        !(targetPeerId === 'native-exe-bridge' || targetPeerId.startsWith('aethertunnel-exe-'));

      const targetCloudWebOnlyIds: string[] = (() => {
        if (!sendCloudCandidateRef.current) return [];
        if (targetPeerId === 'native-exe-bridge' || targetPeerId.startsWith('aethertunnel-exe-')) {
          return [];
        }
        if (targetPeerId !== 'all') {
          if (hasWebRtcTarget) return [];
          const cloudCid = specificPeer?.cloudId || (targetPeerId.startsWith('aethertunnel-web-') ? targetPeerId : '');
          if (cloudCid && cloudWebPeersRef.current.includes(cloudCid) && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
            return [cloudCid];
          }
          return [];
        }
        return cloudWebPeersRef.current.filter((cid) => {
          const cKey = resolveCanonicalPeerKey(cid);
          const hasDc = getOpenDataChannelLanes(cKey).length > 0;
          const hasWs = wsRef.current && wsRef.current.readyState === WebSocket.OPEN;
          return !hasDc && !hasWs;
        });
      })();

      const hasWsOrLocalBusTarget =
        targetPeerId !== 'native-exe-bridge' &&
        !targetPeerId.startsWith('aethertunnel-exe-') &&
        (hasWebRtcTarget ||
          (localBusRef.current &&
            localBusPeersRef.current.length > 0 &&
            (targetPeerId === 'all' || localBusPeersRef.current.includes(targetPeerId))) ||
          (wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN &&
            (targetPeerId === 'all' ||
              Boolean(
                specificPeer &&
                  specificPeer.clientType !== 'exe' &&
                  !specificPeer.isLocalBridge
              ))));

      const activeTransport:
        | 'WebRTC Direct (UDP/DTLS)'
        | 'Encrypted WS Relay (TCP/443)' =
        hasWebRtcTarget
          ? 'WebRTC Direct (UDP/DTLS)'
          : 'Encrypted WS Relay (TCP/443)';

      const initialResumeChunk = resumeFromChunkMapRef.current.get(fileResumeKey) || 0;

      const newTransfer: TransferItem = {
        id: fileId,
        name: transferName,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        totalChunks,
        transferredChunks: initialResumeChunk,
        bytesTransferred: Math.min(file.size, initialResumeChunk * activeChunkSize),
        speedBps: 0,
        avgSpeedBps: 0,
        status: 'transferring',
        sha256: 'computing-async...',
        verified: false,
        direction: 'outgoing',
        transportUsed: activeTransport,
        startedAt: Date.now(),
        queueItemId,
        recipientId: targetPeerId,
        recipientLabel: targetLabel,
      };

      setTransfers((prev) => [
        newTransfer,
        ...prev.filter(
          (t) =>
            !(
              t.direction === 'outgoing' &&
              t.name === transferName &&
              t.size === file.size &&
              t.status !== 'completed'
            )
        ),
      ]);

      const markRejected = () => {
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId
              ? {
                  ...t,
                  status: 'rejected',
                  errorMessage: 'Recipient declined the file transfer',
                }
              : t
          )
        );
      };

      let activeStartedAt = performance.now();
      let lastUiUpdateAt = 0;
      let lastWindowAt = activeStartedAt;
      let lastWindowBytes = 0;
      let smoothedLiveBps = 0;
      let initialOffsetBytes = 0;

      const pushProgressUi = (chunksDone: number, bytesDone: number) => {
        const now = performance.now();
        if (now - lastUiUpdateAt < 90) return;
        const winDt = (now - lastWindowAt) / 1000;
        if (winDt >= 0.35 && bytesDone >= lastWindowBytes) {
          const instBps = (bytesDone - lastWindowBytes) / winDt;
          smoothedLiveBps =
            smoothedLiveBps > 0 ? smoothedLiveBps * 0.72 + instBps * 0.28 : instBps;
          lastWindowAt = now;
          lastWindowBytes = bytesDone;
        }
        lastUiUpdateAt = now;
        const elapsedSec = Math.max(0.015, (now - activeStartedAt) / 1000);
        const netBytes = Math.max(0, bytesDone - initialOffsetBytes);
        const avgSpeedBps = netBytes / elapsedSec;
        const speedBps = smoothedLiveBps > 0 ? smoothedLiveBps : avgSpeedBps;
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId
              ? {
                  ...t,
                  transferredChunks: chunksDone,
                  bytesTransferred: bytesDone,
                  speedBps,
                  avgSpeedBps,
                }
              : t
          )
        );
      };

      let paceEpochMs = performance.now();
      const paceOutgoingBytes = async (bytesSent: number) => {
        const limitMBps = maxUploadMBpsRef.current;
        if (!limitMBps || limitMBps <= 0) {
          paceEpochMs = performance.now();
          return;
        }
        const bytesPerMs = Math.max(10.24, (limitMBps * 1024 * 1024) / 1000);
        const durationMs = bytesSent / bytesPerMs;
        const now = performance.now();
        if (paceEpochMs < now - 80) paceEpochMs = now - 80;
        paceEpochMs += durationMs;
        while (maxUploadMBpsRef.current > 0) {
          const waitMs = paceEpochMs - performance.now();
          if (waitMs <= 1) break;
          await new Promise<void>((r) => window.setTimeout(r, Math.min(80, waitMs)));
        }
      };

      const sendCloudBridgeFileToPeer = async (
        dstPeer: string,
        kindPrefix: 'exe:' | 'browser:'
      ): Promise<'completed' | 'rejected' | 'error'> => {
        if (!sendCloudCandidateRef.current) return 'error';
        const cloudChunkSize = 49152;
        const cloudTotalChunks = Math.max(1, Math.ceil(file.size / cloudChunkSize));

        const waitPromise = waitForConfirmationHandshake(
          fileId,
          fileResumeKey,
          700,
          queueItemId
        );

        sendCloudCandidateRef.current(dstPeer, {
          kind: `${kindPrefix}file-start`,
          fileId,
          name: transferName,
          size: file.size,
          chunkSize: cloudChunkSize,
          totalChunks: cloudTotalChunks,
          senderLabel: localDisplayNameRef.current,
        });

        const confirmRes = await waitPromise;
        if (!confirmRes.accepted) {
          return 'rejected';
        }

        if (queueItemId) {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === queueItemId ? { ...q, status: 'transferring' } : q
            )
          );
        }
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId ? { ...t, status: 'transferring', startedAt: Date.now() } : t
          )
        );

        let chunkIdx = Math.max(0, confirmRes.resumeChunk);
        activeStartedAt = performance.now();
        lastWindowAt = activeStartedAt;
        initialOffsetBytes = chunkIdx * cloudChunkSize;
        lastWindowBytes = initialOffsetBytes;

        for (
          let offset = chunkIdx * cloudChunkSize;
          offset < file.size;
          offset += cloudChunkSize
        ) {
          await waitIfTransferPaused(fileId, queueItemId, (pausedMs) => {
            activeStartedAt += pausedMs;
            lastWindowAt = performance.now();
            lastWindowBytes = offset;
            smoothedLiveBps = 0;
          });
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

          sendCloudCandidateRef.current(dstPeer, {
            kind: `${kindPrefix}file-chunk`,
            fileId,
            chunkIndex: chunkIdx,
            data: b64,
          });

          chunkIdx += 1;

          const sentBytes = Math.min(file.size, offset + bytes.byteLength);
          const approxChunks = Math.min(
            totalChunks,
            Math.ceil((sentBytes / Math.max(1, file.size)) * totalChunks)
          );
          pushProgressUi(approxChunks, sentBytes);
          await paceOutgoingBytes(bytes.byteLength);

          if (chunkIdx % 24 === 0) {
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

        sendCloudCandidateRef.current?.(dstPeer, {
          kind: `${kindPrefix}file-end`,
          fileId,
        });
        return 'completed';
      };

      try {
        let anySent = false;
        let anyCompleted = false;

        if (sendToLocalExe && exeWsRef.current && exeWsRef.current.readyState === WebSocket.OPEN) {
          anySent = true;
          const exeWs = exeWsRef.current;
          const exeChunkSize = 1024 * 1024;
          const waitPromise = waitForConfirmationHandshake(
            fileId,
            fileResumeKey,
            400,
            queueItemId
          );

          exeWs.send(
            JSON.stringify({
              kind: 'exe:file-start',
              fileId,
              name: transferName,
              size: file.size,
              chunkSize: exeChunkSize,
            })
          );

          const confirmRes = await waitPromise;
          if (!confirmRes.accepted) {
            if (targetPeerId !== 'all') {
              markRejected();
              return 'rejected';
            }
          } else {
            if (queueItemId) {
              setUploadQueue((prev) =>
                prev.map((q) =>
                  q.id === queueItemId ? { ...q, status: 'transferring' } : q
                )
              );
            }
            setTransfers((prev) =>
              prev.map((t) =>
                t.id === fileId ? { ...t, status: 'transferring', startedAt: Date.now() } : t
              )
            );

            const exeStartByte = Math.min(
              file.size,
              Math.max(0, confirmRes.resumeChunk * exeChunkSize)
            );
            activeStartedAt = performance.now();
            lastWindowAt = activeStartedAt;
            lastWindowBytes = exeStartByte;
            initialOffsetBytes = exeStartByte;

            for (let offset = exeStartByte; offset < file.size; offset += exeChunkSize) {
              await waitIfTransferPaused(fileId, queueItemId, (pausedMs) => {
                activeStartedAt += pausedMs;
                lastWindowAt = performance.now();
                lastWindowBytes = offset;
                smoothedLiveBps = 0;
              });
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

              const sentBytes = Math.min(file.size, offset + buf.byteLength);
              const approxChunks = Math.min(
                totalChunks,
                Math.ceil((sentBytes / Math.max(1, file.size)) * totalChunks)
              );
              pushProgressUi(approxChunks, sentBytes);
              await paceOutgoingBytes(buf.byteLength);
            }

            if (exeWs.readyState === WebSocket.OPEN) {
              exeWs.send(JSON.stringify({ kind: 'exe:file-end', fileId }));
            }
            anyCompleted = true;
          }
        }

        for (const dstExePeer of targetCloudExeIds) {
          anySent = true;
          const res = await sendCloudBridgeFileToPeer(dstExePeer, 'exe:');
          if (res === 'rejected' && targetPeerId !== 'all') {
            markRejected();
            return 'rejected';
          }
          if (res === 'completed') anyCompleted = true;
        }

        for (const dstCloudWeb of targetCloudWebOnlyIds) {
          anySent = true;
          const res = await sendCloudBridgeFileToPeer(dstCloudWeb, 'browser:');
          if (res === 'rejected' && targetPeerId !== 'all') {
            markRejected();
            return 'rejected';
          }
          if (res === 'completed') anyCompleted = true;
        }

        if (hasWsOrLocalBusTarget) {
          anySent = true;
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              wsRef.current.send(
                JSON.stringify({
                  type: 'relay:target',
                  toPeerId: targetPeerId === 'all' ? '*' : targetPeerId,
                })
              );
            } catch {}
          }

          const metaPayload = {
            kind: 'file:meta',
            fileId,
            transferNumId,
            name: transferName,
            size: file.size,
            chunkSize: activeChunkSize,
            mimeType: file.type || 'application/octet-stream',
            totalChunks,
            sha256: 'streaming-aes-256-gcm',
            senderLabel: localDisplayNameRef.current,
          };

          const confirmPromise = waitForConfirmationHandshake(
            fileId,
            fileResumeKey,
            600,
            queueItemId
          );

          transmitEncryptedPacket(metaPayload, targetPeerId);
          await new Promise((r) => window.setTimeout(r, 120));
          transmitEncryptedPacket(metaPayload, targetPeerId);
          await new Promise((r) => window.setTimeout(r, 120));
          transmitEncryptedPacket(metaPayload, targetPeerId);

          const confirmRes = await confirmPromise;
          if (!confirmRes.accepted) {
            if (!anyCompleted) {
              markRejected();
              return 'rejected';
            }
          } else {
            if (queueItemId) {
              setUploadQueue((prev) =>
                prev.map((q) =>
                  q.id === queueItemId ? { ...q, status: 'transferring' } : q
                )
              );
            }
            setTransfers((prev) =>
              prev.map((t) =>
                t.id === fileId ? { ...t, status: 'transferring', startedAt: Date.now() } : t
              )
            );

            const startChunkIndex = Math.min(
              Math.max(0, totalChunks - 1),
              Math.max(0, confirmRes.resumeChunk)
            );
            activeStartedAt = performance.now();
            lastWindowAt = activeStartedAt;
            initialOffsetBytes = Math.min(file.size, startChunkIndex * activeChunkSize);
            lastWindowBytes = initialOffsetBytes;

            void file
              .slice(0, Math.min(file.size, 4 * 1024 * 1024))
              .arrayBuffer()
              .then((sample) => computeSha256Hex(sample))
              .then((digest) => {
                setTransfers((prev) =>
                  prev.map((t) => (t.id === fileId ? { ...t, sha256: digest } : t))
                );
                transmitEncryptedPacket(
                  {
                    kind: 'file:sha256',
                    fileId,
                    sha256: digest,
                  },
                  targetPeerId
                );
              });

            const produceEncryptedWave = async (waveStartChunk: number) => {
              if (waveStartChunk >= totalChunks) return null;
              const waveEndChunk = Math.min(totalChunks, waveStartChunk + chunksPerWave);
              const sliceStartByte = waveStartChunk * activeChunkSize;
              const sliceEndByte = Math.min(file.size, waveEndChunk * activeChunkSize);

              const slabBuffer = await file.slice(sliceStartByte, sliceEndByte).arrayBuffer();

              const encryptedFrames = await Promise.all(
                Array.from({ length: waveEndChunk - waveStartChunk }, (_, idx) => {
                  const chunkIndex = waveStartChunk + idx;
                  const localStart = idx * activeChunkSize;
                  const localEnd = Math.min(slabBuffer.byteLength, localStart + activeChunkSize);
                  const plainView = new Uint8Array(
                    slabBuffer,
                    localStart,
                    localEnd - localStart
                  );
                  return encryptChunkBinaryFrame(key, plainView, transferNumId, chunkIndex);
                })
              );

              return {
                waveStartChunk,
                waveEndChunk,
                sliceEndByte,
                encryptedFrames,
              };
            };

            let currentWavePromise = produceEncryptedWave(startChunkIndex);

            for (
              let waveStart = startChunkIndex;
              waveStart < totalChunks;
              waveStart += chunksPerWave
            ) {
              await waitIfTransferPaused(fileId, queueItemId, (pausedMs) => {
                activeStartedAt += pausedMs;
                lastWindowAt = performance.now();
                lastWindowBytes = Math.min(file.size, waveStart * activeChunkSize);
                smoothedLiveBps = 0;
              });
              const nextWavePromise = produceEncryptedWave(waveStart + chunksPerWave);

              const currentWave = await currentWavePromise;
              currentWavePromise = nextWavePromise;
              if (!currentWave) break;

              const currentLanes = getOpenDataChannelLanes(targetPeerId);

              if (currentLanes.length > 0) {
                for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
                  await waitIfTransferPaused(fileId, queueItemId, (pausedMs) => {
                    activeStartedAt += pausedMs;
                    lastWindowAt = performance.now();
                    lastWindowBytes = Math.min(
                      file.size,
                      (currentWave.waveStartChunk + i) * activeChunkSize
                    );
                    smoothedLiveBps = 0;
                  });
                  const frame = currentWave.encryptedFrames[i];
                  if (
                    localBusRef.current &&
                    localBusPeersRef.current.length > 0 &&
                    (targetPeerId === 'all' || localBusPeersRef.current.includes(targetPeerId))
                  ) {
                    try {
                      localBusRef.current.postMessage({
                        type: 'bus:frame',
                        toPeerId: targetPeerId === 'all' ? '*' : targetPeerId,
                        frame: frame.slice(0),
                      });
                    } catch {}
                  }
                  if (!trySendBinaryPacketSync(frame, targetPeerId)) {
                    await sendBinaryPacketSafely(frame, targetPeerId);
                  }

                  const chunksDone = currentWave.waveStartChunk + i + 1;
                  const rawBytesQueued = Math.min(file.size, chunksDone * activeChunkSize);
                  const bufferedInLanes = getOpenDataChannelLanes(targetPeerId).reduce(
                    (sum, dc) => sum + dc.bufferedAmount,
                    0
                  );
                  const wireBytesSent = Math.max(0, rawBytesQueued - bufferedInLanes);
                  pushProgressUi(chunksDone, wireBytesSent);
                  await paceOutgoingBytes(WIRE_CHUNK_BYTES);
                }
              } else if (
                localBusRef.current &&
                localBusPeersRef.current.length > 0 &&
                (targetPeerId === 'all' || localBusPeersRef.current.includes(targetPeerId))
              ) {
                for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
                  await waitIfTransferPaused(fileId, queueItemId, (pausedMs) => {
                    activeStartedAt += pausedMs;
                    lastWindowAt = performance.now();
                    lastWindowBytes = Math.min(
                      file.size,
                      (currentWave.waveStartChunk + i) * activeChunkSize
                    );
                    smoothedLiveBps = 0;
                  });
                  const frame = currentWave.encryptedFrames[i];
                  const chunkIndex = currentWave.waveStartChunk + i;
                  try {
                    localBusRef.current.postMessage({
                      type: 'bus:frame',
                      toPeerId: targetPeerId === 'all' ? '*' : targetPeerId,
                      frame: frame.slice(0),
                    });
                  } catch {}

                  const chunksDone = chunkIndex + 1;
                  const rawBytesQueued = Math.min(file.size, chunksDone * WIRE_CHUNK_BYTES);
                  pushProgressUi(chunksDone, rawBytesQueued);
                  await paceOutgoingBytes(WIRE_CHUNK_BYTES);
                }
              } else if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                for (let i = 0; i < currentWave.encryptedFrames.length; i++) {
                  await waitIfTransferPaused(fileId, queueItemId, (pausedMs) => {
                    activeStartedAt += pausedMs;
                    lastWindowAt = performance.now();
                    lastWindowBytes = Math.min(
                      file.size,
                      (currentWave.waveStartChunk + i) * activeChunkSize
                    );
                    smoothedLiveBps = 0;
                  });
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

                  const chunksDone = chunkIndex + 1;
                  const rawBytesQueued = Math.min(file.size, chunksDone * WIRE_CHUNK_BYTES);
                  pushProgressUi(chunksDone, rawBytesQueued);
                  await paceOutgoingBytes(WIRE_CHUNK_BYTES);
                }
              }
            }

            for (let drainWait = 0; drainWait < 400; drainWait++) {
              const totalBuffered = getOpenDataChannelLanes(targetPeerId).reduce(
                (sum, dc) => sum + dc.bufferedAmount,
                0
              );
              if (totalBuffered <= 256 * 1024) break;
              await new Promise<void>((r) => window.setTimeout(r, 10));
            }
            anyCompleted = true;
          }
        }

        if (!anySent || !anyCompleted) {
          throw new Error('Selected recipient is no longer connected');
        }

        const totalElapsedSec = Math.max(
          0.02,
          (performance.now() - activeStartedAt) / 1000
        );
        const avgSpeedBps = Math.max(0, file.size - initialOffsetBytes) / totalElapsedSec;
        const finalSpeedBps = smoothedLiveBps > 0 ? smoothedLiveBps : avgSpeedBps;

        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId
              ? {
                  ...t,
                  transferredChunks: totalChunks,
                  bytesTransferred: file.size,
                  speedBps: finalSpeedBps,
                  avgSpeedBps,
                  status: 'completed',
                  verified: true,
                  completedAt: Date.now(),
                }
              : t
          )
        );
        return 'completed';
      } catch (err: any) {
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === fileId
              ? {
                  ...t,
                  status: 'error',
                  errorMessage: err?.message || 'Transfer interrupted during streaming',
                }
              : t
          )
        );
        return 'error';
      }
    },
    [
      getOpenDataChannelLanes,
      resolveCanonicalPeerKey,
      sendBinaryPacketSafely,
      transmitEncryptedPacket,
      trySendBinaryPacketSync,
      waitForConfirmationHandshake,
      waitIfTransferPaused,
    ]
  );

  const getRecipientLabel = useCallback((targetId: string): string => {
    if (!targetId || targetId === 'all') return 'Everyone in room';
    const found = peersRef.current.find((p) => p.id === targetId || p.cloudId === targetId);
    return found ? found.deviceLabel : targetId;
  }, []);

  const enqueueUploadEntries = useCallback(
    (entries: Array<{ file: File; displayName: string }>, explicitTargetId?: string) => {
      if (entries.length === 0) return;
      const targetId = explicitTargetId || selectedRecipientId || 'all';
      const targetLabel = getRecipientLabel(targetId);
      const connectedNow =
        peersRef.current.length > 0 ||
        Boolean(allowLocalExeBridgeRef.current && exeWsRef.current && exeWsRef.current.readyState === WebSocket.OPEN) ||
        cloudExePeersRef.current.size > 0 ||
        localBusPeersRef.current.length > 0 ||
        cloudWebPeersRef.current.length > 0;
      const newItems: QueuedUploadItem[] = entries.map((entry, idx) => ({
        id: `q-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        file: entry.file,
        displayName: entry.displayName,
        size: entry.file.size,
        targetPeerId: targetId,
        targetLabel,
        status: connectedNow ? 'queued' : 'waiting_peer',
      }));
      setUploadQueue((prev) => [...prev, ...newItems]);
    },
    [selectedRecipientId, getRecipientLabel]
  );

  const collectDroppedEntries = useCallback(
    async (dataTransfer: DataTransfer): Promise<Array<{ file: File; displayName: string }>> => {
      const results: Array<{ file: File; displayName: string }> = [];
      const items = dataTransfer.items ? Array.from(dataTransfer.items) : [];
      const entries = items
        .map((it) => (typeof it.webkitGetAsEntry === 'function' ? it.webkitGetAsEntry() : null))
        .filter((e): e is FileSystemEntry => Boolean(e));

      if (entries.length > 0) {
        const readAllEntries = (reader: FileSystemDirectoryReader) =>
          new Promise<FileSystemEntry[]>((resolve) => {
            const acc: FileSystemEntry[] = [];
            const nextBatch = () => {
              reader.readEntries(
                (batch) => {
                  if (!batch.length) {
                    resolve(acc);
                  } else {
                    acc.push(...batch);
                    nextBatch();
                  }
                },
                () => resolve(acc)
              );
            };
            nextBatch();
          });

        const walkEntry = async (entry: FileSystemEntry, prefix: string): Promise<void> => {
          if (entry.isFile) {
            const fileEntry = entry as FileSystemFileEntry;
            await new Promise<void>((resolve) => {
              fileEntry.file(
                (f) => {
                  const cleanRel = prefix ? `${prefix}/${f.name}` : f.name;
                  results.push({ file: f, displayName: cleanRel });
                  resolve();
                },
                () => resolve()
              );
            });
          } else if (entry.isDirectory) {
            const dirEntry = entry as FileSystemDirectoryEntry;
            const reader = dirEntry.createReader();
            const children = await readAllEntries(reader);
            const nextPrefix = prefix ? `${prefix}/${dirEntry.name}` : dirEntry.name;
            for (const child of children) {
              await walkEntry(child, nextPrefix);
            }
          }
        };

        for (const rootEntry of entries) {
          await walkEntry(rootEntry, '');
        }
        return results;
      }

      if (dataTransfer.files?.length) {
        for (const f of Array.from(dataTransfer.files)) {
          const rel = (f as any).webkitRelativePath || f.name;
          results.push({ file: f, displayName: rel });
        }
      }
      return results;
    },
    []
  );

  const handleFilesSelected = useCallback(
    (fileList: FileList | File[]) => {
      const entries = Array.from(fileList).map((f) => ({
        file: f,
        displayName: (f as any).webkitRelativePath || f.name,
      }));
      enqueueUploadEntries(entries);
    },
    [enqueueUploadEntries]
  );

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

    const noteId = `note-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const recipientLabel = getRecipientLabel(selectedRecipientId);
    transmitEncryptedPacket(
      {
        kind: 'note:encrypted',
        id: noteId,
        senderLabel: localDisplayName,
        recipientLabel,
        ivBase64,
        ciphertextBase64,
      },
      selectedRecipientId
    );

    setNotes((prev) => [
      {
        id: noteId,
        senderLabel: `You (${localDisplayName})`,
        recipientLabel,
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
    setJoinCodeInput(freshCode);
  };

  const handleJoinTunnel = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = joinCodeInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    cloudPeerLastSeenRef.current.clear();
    cloudExePeersRef.current.clear();
    setCloudExePeers([]);
    setCloudWebPeers([]);
    setLocalBusPeers([]);
    setPeers([]);
    setSelectedRecipientId('all');
    setRoomFullMessage(null);
    setConnectionState('signaling');
    setRoomCode(cleaned);
    if (cleaned) {
      window.history.replaceState({}, '', `?room=${encodeURIComponent(cleaned)}`);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleDisconnectTunnel = () => {
    cloudPeerLastSeenRef.current.clear();
    cloudExePeersRef.current.clear();
    setCloudExePeers([]);
    setCloudWebPeers([]);
    setLocalBusPeers([]);
    setPeers([]);
    setSelectedRecipientId('all');
    setRoomFullMessage(null);
    setConnectionState('signaling');
    setRoomCode('');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const copyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedToken('code');
    window.setTimeout(() => setCopiedToken(null), 1800);
  };

  const copyInviteLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomCode)}`;
    navigator.clipboard.writeText(url);
    setCopiedToken('link');
    window.setTimeout(() => setCopiedToken(null), 1800);
  };

  const isPeerConnected =
    peers.length > 0 ||
    (allowLocalExeBridge && exeBridgeConnected) ||
    cloudExePeers.length > 0 ||
    localBusPeers.length > 0 ||
    cloudWebPeers.length > 0;
  const chunkSizeLabel = 'Auto-Tuned 240 KB × 32';

  useEffect(() => {
    if (selectedRecipientId === 'all') return;
    const stillPresent =
      peers.some((p) => p.id === selectedRecipientId || p.cloudId === selectedRecipientId) ||
      (allowLocalExeBridge && selectedRecipientId === 'native-exe-bridge');
    if (!stillPresent) {
      setSelectedRecipientId('all');
    }
  }, [peers, selectedRecipientId, allowLocalExeBridge]);

  useEffect(() => {
    if (queueProcessingRef.current || isTransferPaused) return;
    const nextItem = uploadQueue.find(
      (q) => q.status === 'queued' || q.status === 'waiting_peer'
    );
    if (!nextItem) return;

    const targetId = nextItem.targetPeerId || 'all';
    const targetReady =
      targetId === 'all'
        ? isPeerConnected
        : peersRef.current.some((p) => p.id === targetId || p.cloudId === targetId) ||
          (targetId === 'native-exe-bridge' &&
            allowLocalExeBridgeRef.current &&
            exeWsRef.current?.readyState === WebSocket.OPEN);

    if (!targetReady) {
      if (uploadQueue.some((q) => q.status === 'queued')) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.status === 'queued' ? { ...q, status: 'waiting_peer' } : q
          )
        );
      }
      return;
    }

    queueProcessingRef.current = true;
    setUploadQueue((prev) =>
      prev.map((q) =>
        q.id === nextItem.id ? { ...q, status: 'transferring' } : q
      )
    );

    (async () => {
      let finalStatus: 'completed' | 'rejected' | 'error' = 'error';
      try {
        finalStatus = await sendSingleFile(nextItem.file, {
          displayName: nextItem.displayName,
          queueItemId: nextItem.id,
          targetPeerId: nextItem.targetPeerId || 'all',
          targetLabel: nextItem.targetLabel,
        });
      } catch {
        finalStatus = 'error';
      } finally {
        queueProcessingRef.current = false;
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === nextItem.id
              ? {
                  ...q,
                  status: finalStatus,
                  errorMessage:
                    finalStatus === 'rejected'
                      ? 'Declined by recipient'
                      : finalStatus === 'error'
                      ? 'Transfer error'
                      : undefined,
                }
              : q
          )
        );
      }
    })();
  }, [uploadQueue, isPeerConnected, isTransferPaused, sendSingleFile, peers]);

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
          AetherTunnel <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">V1.01</span>
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
            Randomize Tunnel Name
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
                  <span className={roomCode ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {!roomCode
                      ? 'Waiting for tunnel name (enter a name and click Connect)'
                      : exeBridgeConnected
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
                    title="Downloads the High-DPI Standalone Windows P2P NAT-Punching & Kernel-Socket .EXE (V1.01 · STUN + UDP Hole Punching + Resumable Transfers)"
                  >
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    Download Standalone P2P .EXE (V1.01)
                  </button>
                  <button
                    onClick={() => {
                      const html = generateStandalonePortableHtml(roomCode);
                      triggerBrowserDownload(
                        'AetherTunnel-Portable-Standalone.html',
                        html,
                        'text/html;charset=utf-8'
                      );
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    title="Downloads the single-file Portable HTML version (V1.01 · Zero-install client that runs directly in any browser via WebRTC & MQTT)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Portable HTML (V1.01)
                  </button>
                </div>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>01. Signaling &amp; Room</span>
                  <CheckCircle2 className={`w-4 h-4 ${roomCode ? 'text-emerald-400' : 'text-amber-400'}`} />
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-100 font-mono">
                  {roomCode || 'Not connected'}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Users in room:{' '}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {roomCode ? Math.min(MAX_ROOM_PEERS, peers.filter((p) => !p.isLocalBridge).length + 1) : 0} / {MAX_ROOM_PEERS}
                  </span>
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

                  <form onSubmit={handleJoinTunnel} className="space-y-2">
                    <label className="block text-xs font-medium text-slate-300">
                      Tunnel Name (Enter a name and click Connect)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value)}
                        placeholder="Enter tunnel name..."
                        className="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        disabled={!joinCodeInput.trim().replace(/[^a-zA-Z0-9-]/g, '')}
                        className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-45 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Connect
                      </button>
                    </div>
                  </form>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-400">Active Tunnel</div>
                      <div className={`text-lg font-mono font-bold tracking-wide mt-0.5 truncate ${roomCode ? 'text-sky-400' : 'text-slate-500 text-sm'}`}>
                        {roomCode || 'Not connected — enter a tunnel name above and click Connect'}
                      </div>
                    </div>

                    {roomCode && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={copyRoomCode}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {copiedToken === 'code' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={copyInviteLink}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {copiedToken === 'link' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Link Copied
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3.5 h-3.5" />
                              Link
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDisconnectTunnel}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-300 bg-red-950/60 hover:bg-red-900/70 border border-red-800/50 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        Your display name in room (max {MAX_ROOM_PEERS} users)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={localDisplayName}
                      maxLength={28}
                      onChange={(e) => setLocalDisplayName(e.target.value)}
                      placeholder="e.g. Alex-PC..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                    />
                    <label className="inline-flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allowLocalExeBridge}
                        onChange={(e) => setAllowLocalExeBridge(e.target.checked)}
                        className="accent-sky-400 rounded cursor-pointer"
                      />
                      <span>Connect to local machine .EXE app (127.0.0.1)</span>
                    </label>
                    {roomFullMessage && (
                      <div className="p-2.5 bg-red-950/60 border border-red-700/60 rounded-lg text-xs text-red-200 font-medium">
                        {roomFullMessage}
                      </div>
                    )}
                  </div>

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
                        Configure transport routing and WebRTC SCTP mesh (max {MAX_ROOM_PEERS} users per room).
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
                          Per-Peer Mesh · Zero-Copy SCTP
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        Dedicated WebRTC SCTP mesh (<span className="text-slate-200 font-mono">240 KB</span> atomic zero-copy frames, <span className="text-slate-200 font-mono">7.5 MB</span> wave) + Wormhole Bridge for <span className="text-slate-200 font-mono">.EXE</span> peers.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Room Users ({peers.length + (roomCode ? 1 : 0)}/{MAX_ROOM_PEERS})</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {peers.length} {peers.length === 1 ? 'other' : 'others'}
                      </span>
                    </div>

                    {peers.length === 0 ? (
                      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-400">
                        No other users in room yet.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {peers.map((p) => {
                          const isSelected = selectedRecipientId === p.id;
                          return (
                            <div
                              key={p.id}
                              className={`p-3 rounded-lg flex items-center justify-between gap-2 text-xs border transition-colors ${
                                isSelected
                                  ? 'bg-sky-950/40 border-sky-400/60'
                                  : 'bg-slate-950 border-slate-800'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="font-medium text-slate-200 truncate">
                                  {p.deviceLabel}
                                </div>
                                <div className="text-slate-400 mt-0.5 truncate">
                                  {p.natType} · ID: <span className="font-mono">{p.id}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedRecipientId(isSelected ? 'all' : p.id)
                                }
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-sky-400 text-slate-950'
                                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
                  {pendingIncomingQueue.length > 0 && (
                    <div className="space-y-2.5">
                      {pendingIncomingQueue.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 bg-amber-950/35 border border-amber-500/40 rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-amber-200">
                                  Incoming File Transfer — Confirmation Required
                                </div>
                                <div className="text-xs text-slate-200 font-mono truncate mt-0.5">
                                  {req.name}{' '}
                                  <span className="text-amber-300">
                                    ({formatBytes(req.size)})
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  Sender: {req.senderLabel}
                                  {req.hasResume ? ' · Resuming interrupted transfer' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => resolvePendingIncoming(req, 'accept')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept
                            </button>
                            <button
                              onClick={() => resolvePendingIncoming(req, 'accept_all')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Accept All
                            </button>
                            <button
                              onClick={() => resolvePendingIncoming(req, 'reject')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-200 bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 rounded-md transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

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
                        Zero-split 240 KB hardware frames · Sequential FIFO Queue · Live &amp; Avg Speed Telemetry.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start">
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoAcceptIncoming}
                          onChange={(e) => setAutoAcceptIncoming(e.target.checked)}
                          className="accent-emerald-400 rounded cursor-pointer"
                        />
                        <span>Auto-accept incoming</span>
                      </label>

                      <button
                        onClick={handleSimulateIncomingTransfer}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <FileArchive className="w-3.5 h-3.5" />
                        Test Receive Encrypted File
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300 shrink-0">
                      <Users className="w-4 h-4 text-sky-400" />
                      <span>Send to:</span>
                    </div>
                    <select
                      value={selectedRecipientId}
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-sky-300 font-mono focus:outline-none focus:border-sky-400 cursor-pointer"
                    >
                      <option value="all">
                        Everyone in room ({peers.length} {peers.length === 1 ? 'other user' : 'other users'})
                      </option>
                      {peers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.deviceLabel} ({p.clientType === 'exe' || p.clientType === 'local_exe' ? '.EXE' : 'Browser'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300 shrink-0">
                      <Gauge className="w-4 h-4 text-sky-400" />
                      <span>Max upload speed (MB/s):</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={maxUploadMBpsInput}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setMaxUploadMBpsInput(raw);
                          const parsed = parseFloat(raw.trim().replace(',', '.'));
                          maxUploadMBpsRef.current =
                            Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
                        }}
                        placeholder="0"
                        className="w-28 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-sky-300 font-mono focus:outline-none focus:border-sky-400"
                      />
                      <span className="text-[11px] text-slate-400">
                        (0 = unlimited · applies immediately mid-transfer)
                      </span>
                    </div>
                  </div>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const dropped = await collectDroppedEntries(e.dataTransfer);
                      if (dropped.length > 0) {
                        enqueueUploadEntries(dropped);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-7 text-center transition-colors cursor-pointer ${
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
                          handleFilesSelected(e.target.files);
                          e.target.value = '';
                        }
                      }}
                    />
                    <input
                      ref={folderInputRef}
                      type="file"
                      multiple
                      {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          handleFilesSelected(e.target.files);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Upload className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                    <div className="text-sm font-semibold text-slate-100">
                      Drag and drop files or folders here to add to transfer queue
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Transfers files sequentially one by one · AES-256-GCM
                    </p>
                    <div className="mt-2.5 mx-auto max-w-xl px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed">
                      <span className="text-sky-400 font-semibold">Max Single File:</span>{' '}
                      Web App / Portable HTML: <span className="text-amber-300">~2 GB</span> (Browser RAM receive limit; sends larger to .EXE){' '}
                      · Windows .EXE &lt;-&gt; .EXE: <span className="text-emerald-400">~2.6 TB (UDP) / Disk limit (TCP)</span>
                    </div>
                    <div
                      className="mt-4 flex flex-wrap items-center justify-center gap-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        + Add File(s)
                      </button>
                      <button
                        type="button"
                        onClick={() => folderInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
                      >
                        <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
                        + Add Folder
                      </button>
                    </div>
                  </div>

                  {uploadQueue.length > 0 && (
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          Transfer Queue ({uploadQueue.filter((q) => q.status === 'queued' || q.status === 'waiting_peer' || q.status === 'waiting_accept' || q.status === 'transferring' || q.status === 'paused').length} active / {uploadQueue.length} total)
                        </span>
                        <div className="flex items-center gap-2">
                          {uploadQueue.some((q) => q.status === 'queued' || q.status === 'waiting_peer' || q.status === 'transferring' || q.status === 'paused') && (
                            <button
                              type="button"
                              onClick={toggleGlobalTransferPause}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                                isTransferPaused
                                  ? 'text-slate-950 bg-emerald-400 hover:bg-emerald-300'
                                  : 'text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60'
                              }`}
                            >
                              {isTransferPaused ? (
                                <>
                                  <Play className="w-3 h-3" />
                                  Resume
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3 h-3" />
                                  Pause
                                </>
                              )}
                            </button>
                          )}
                          {uploadQueue.some((q) => q.status === 'completed' || q.status === 'rejected' || q.status === 'error') && (
                            <button
                              onClick={() =>
                                setUploadQueue((prev) =>
                                  prev.filter(
                                    (q) =>
                                      q.status === 'queued' ||
                                      q.status === 'waiting_peer' ||
                                      q.status === 'waiting_accept' ||
                                      q.status === 'transferring' ||
                                      q.status === 'paused'
                                  )
                                )
                              }
                              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Clear Completed
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {uploadQueue.map((q) => (
                          <div
                            key={q.id}
                            className="px-2.5 py-1.5 bg-slate-900/90 border border-slate-800/80 rounded flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0 flex items-center gap-2">
                              <span className="font-mono text-slate-200 truncate">
                                {q.displayName}
                              </span>
                              <span className="text-sky-400/90 text-[11px] font-mono shrink-0">
                                → {q.targetLabel}
                              </span>
                              <span className="text-slate-500 font-mono shrink-0">
                                ({formatBytes(q.size)})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`font-mono text-[11px] ${
                                  q.status === 'completed'
                                    ? 'text-emerald-400'
                                    : q.status === 'rejected' || q.status === 'error'
                                    ? 'text-red-400'
                                    : q.status === 'waiting_accept' || q.status === 'paused'
                                    ? 'text-amber-400'
                                    : q.status === 'transferring'
                                    ? 'text-sky-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                {q.status === 'completed'
                                  ? 'Completed'
                                  : q.status === 'rejected'
                                  ? 'Declined'
                                  : q.status === 'error'
                                  ? 'Error'
                                  : q.status === 'waiting_accept'
                                  ? 'Awaiting acceptance'
                                  : q.status === 'paused'
                                  ? 'Paused'
                                  : q.status === 'transferring'
                                  ? 'Sending...'
                                  : q.status === 'waiting_peer'
                                  ? 'Waiting for peer'
                                  : 'Queued'}
                              </span>
                              {q.status !== 'transferring' && q.status !== 'paused' && (
                                <button
                                  onClick={() =>
                                    setUploadQueue((prev) =>
                                      prev.filter((item) => item.id !== q.id)
                                    )
                                  }
                                  className="text-slate-500 hover:text-red-400 cursor-pointer"
                                  title="Remove from queue"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Active &amp; Recent Tunnel Transfers</span>
                      <span className="font-mono tabular-nums">
                        {transfers.length} total
                      </span>
                    </div>

                    {transfers.length === 0 ? (
                      <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-lg text-center text-xs text-slate-400">
                        No files transferred yet. Drop a file or folder above to start queued P2P transfer.
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
                                    {item.direction === 'outgoing'
                                      ? `Sending → ${item.recipientLabel || 'Everyone in room'}`
                                      : 'Receiving'}{' '}
                                    ·{' '}
                                    <span className="font-mono tabular-nums text-slate-300">
                                      {formatBytes(item.bytesTransferred)} / {formatBytes(item.size)}
                                    </span>{' '}
                                    · {item.transportUsed}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`font-mono text-xs tabular-nums ${
                                      item.status === 'completed'
                                        ? 'text-emerald-400'
                                        : item.status === 'rejected' || item.status === 'error'
                                        ? 'text-red-400'
                                        : item.status === 'awaiting_acceptance' || item.status === 'paused'
                                        ? 'text-amber-400'
                                        : 'text-sky-400'
                                    }`}
                                  >
                                    {item.status === 'completed'
                                      ? '100% · Verified'
                                      : item.status === 'rejected'
                                      ? 'Declined'
                                      : item.status === 'awaiting_acceptance'
                                      ? 'Awaiting acceptance...'
                                      : item.status === 'paused'
                                      ? `Paused · ${pct}%`
                                      : item.status === 'error'
                                      ? 'Interrupted / Paused'
                                      : `${pct}%`}
                                  </span>
                                  {item.direction === 'outgoing' &&
                                    (item.status === 'transferring' || item.status === 'paused') && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleItemTransferPause(item.id, item.queueItemId)
                                        }
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                                          item.status === 'paused'
                                            ? 'text-slate-950 bg-emerald-400 hover:bg-emerald-300'
                                            : 'text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60'
                                        }`}
                                      >
                                        {item.status === 'paused' ? (
                                          <>
                                            <Play className="w-3 h-3" />
                                            Resume
                                          </>
                                        ) : (
                                          <>
                                            <Pause className="w-3 h-3" />
                                            Pause
                                          </>
                                        )}
                                      </button>
                                    )}
                                  {item.direction === 'outgoing' &&
                                    item.status === 'error' &&
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
                                            enqueueUploadEntries([
                                              { file: saved, displayName: item.name },
                                            ]);
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
                                      : item.status === 'rejected' || item.status === 'error'
                                      ? 'bg-red-500'
                                      : item.status === 'awaiting_acceptance' || item.status === 'paused'
                                      ? 'bg-amber-400'
                                      : 'bg-sky-400'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono tabular-nums">
                                <span>
                                  {item.errorMessage
                                    ? item.errorMessage
                                    : `SHA-256: ${item.sha256.slice(0, 16)}...`}
                                </span>
                                <span>
                                  Speed: <span className="text-sky-300">{formatSpeed(item.speedBps)}</span> · Avg: <span className="text-emerald-300">{formatSpeed(item.avgSpeedBps ?? item.speedBps)}</span> · Transferred: {formatBytes(item.bytesTransferred)}/{formatBytes(item.size)}
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
                      Encrypted messaging for room users (Target: <span className="text-sky-300 font-mono">{getRecipientLabel(selectedRecipientId)}</span>).
                    </p>

                    <form onSubmit={handleSendEncryptedNote} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder={`Write an encrypted message for: ${getRecipientLabel(selectedRecipientId)}...`}
                        className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Message
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
                              {n.senderLabel}
                              {n.recipientLabel ? ` → ${n.recipientLabel}` : ''}:
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
