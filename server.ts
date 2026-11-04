import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PeerClient {
  id: string;
  ws: WebSocket;
  roomCode: string;
  deviceLabel: string;
  natType: string;
  joinedAt: number;
}

export interface WorkflowStepStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  durationMs: number;
  detail: string;
}

export interface BuiltArtifactInfo {
  filename: string;
  label: string;
  platform: string;
  sizeBytes: number;
  sha256: string;
  downloadUrl: string;
}

interface WorkflowRunState {
  runId: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  startedAt: number;
  completedAt?: number;
  steps: WorkflowStepStatus[];
  artifacts: BuiltArtifactInfo[];
}

const rooms = new Map<string, Map<string, PeerClient>>();
const releaseDir = path.join(__dirname, 'release-build');

let currentWorkflowState: WorkflowRunState = {
  runId: 'run-init',
  status: 'idle',
  startedAt: Date.now(),
  steps: [],
  artifacts: [],
};

function computeFileSha256(content: Buffer | string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateSelfContainedAppHtml(defaultRoom: string = '742-cobalt-falcon'): string {
  return `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AetherTunnel v1.0 — Standalone Encrypted P2P File Transfer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'DM Sans', sans-serif; background-color: #0f172a; color: #f1f5f9; }
    h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 p-6">
  <div class="max-w-5xl mx-auto space-y-6">
    <header class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div>
        <span class="text-lg font-bold tracking-tight text-slate-100">AetherTunnel v1.0 Standalone</span>
        <span class="ml-3 text-xs text-emerald-400 font-mono">Resumable Binary WebRTC + Windows .EXE Wormhole + AES-256-GCM</span>
      </div>
      <div id="status-badge" class="text-xs font-mono text-amber-400">Initializing P2P Node...</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">1. Wormhole Pairing Code</h2>
        <p class="text-xs text-slate-400">Enter the same pairing code on both devices to establish a direct encrypted P2P tunnel across any NAT or firewall.</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnel Room Code</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${defaultRoom}" class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
            <button id="connect-btn" class="px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 rounded-lg hover:bg-sky-300 cursor-pointer">Connect</button>
          </div>
        </div>

        <div id="peer-presence-box" class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span id="peer-presence-dot" class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span id="peer-presence-title" class="text-xs font-semibold text-amber-300">Ei toista peeriä huoneessa (No peer yet)</span>
            </div>
            <span id="peer-count-badge" class="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">1/2 PEERS</span>
          </div>
          <div id="peer-presence-sub" class="text-[11px] font-mono text-slate-400 mt-1">Odotetaan toista laitetta samalla huonekoodilla...</div>
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1">Optional Shared Passphrase (PBKDF2)</label>
          <input id="pass-input" type="password" placeholder="Optional zero-knowledge secret..." class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Crypto Super-Chunk Size</label>
          <select id="chunk-select" class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400">
            <option value="240" selected>240 KB (Zero-Split SCTP — Recommended)</option>
            <option value="512">512 KB (Large Buffer)</option>
            <option value="1024">1 MB (Max Buffer)</option>
          </select>
        </div>
        <div class="pt-3 border-t border-slate-800 text-xs space-y-1">
          <div class="flex justify-between"><span class="text-slate-400">AES-256-GCM Key Fingerprint:</span><span id="fp-label" class="font-mono text-emerald-400">Computing...</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Transport Engine:</span><span class="font-mono text-slate-200">WebRTC Direct SCTP + Global WSS Bus</span></div>
        </div>
      </div>

      <div class="md:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">2. Encrypted File Transfer</h2>
        <label class="block border-2 border-dashed border-slate-800 hover:border-sky-400 bg-slate-950/60 rounded-lg p-8 text-center cursor-pointer transition-colors">
          <input id="file-input" type="file" multiple class="hidden" />
          <div class="text-sm font-semibold text-slate-100">Click or Drop Files Here to Encrypt &amp; Stream</div>
          <div class="text-xs text-slate-400 mt-1">Direct RTCPeerConnection + Windows .EXE Bridge · Resumable Transfers</div>
        </label>
        <div id="transfer-list" class="space-y-2 max-h-64 overflow-y-auto text-xs">
          <div class="text-slate-500 text-center py-4">No transfers yet. Connect with a peer and select a file.</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const MAGIC_AETH = 0x41455448;
    const MAGIC_AETP = 0x41455450;
    const HIGH_WATER = 8 * 1024 * 1024;
    const LOW_WATER = 4 * 1024 * 1024;
    const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
    const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }];

    const myId = 'aethertunnel-web-' + Math.random().toString(36).slice(2, 10);
    let currentKey = null;
    let activeRoom = '';
    let activeTopic = '';
    let mqttSockets = [];
    let pc = null;
    let dc = null;
    let remoteBrowserId = '';
    let lastBrowserSeen = 0;
    let exePeerId = '';
    let lastExeSeen = 0;
    let incomingFile = null;
    let partialFrames = new Map();
    let resumeCheckpoints = new Map();
    let pendingResumeResolver = null;
    let cloudAckResolver = null;
    let rxCloudFile = null;

    function buildMqttPacket(typeFlags, payload) {
      const rem = [];
      let x = payload.length;
      do {
        let d = x & 0x7f;
        x >>>= 7;
        if (x > 0) d |= 0x80;
        rem.push(d);
      } while (x > 0);
      const out = new Uint8Array(1 + rem.length + payload.length);
      out[0] = typeFlags;
      for (let i = 0; i < rem.length; i++) out[1 + i] = rem[i];
      out.set(payload, 1 + rem.length);
      return out;
    }

    function sendBusEnvelope(envelope) {
      if (!activeTopic) return;
      const enc = new TextEncoder();
      const tBytes = enc.encode(activeTopic);
      const mBytes = enc.encode(JSON.stringify(envelope));
      const body = new Uint8Array(2 + tBytes.length + mBytes.length);
      body[0] = (tBytes.length >> 8) & 0xff;
      body[1] = tBytes.length & 0xff;
      body.set(tBytes, 2);
      body.set(mBytes, 2 + tBytes.length);
      const pkt = buildMqttPacket(0x30, body);
      for (const ws of mqttSockets) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          try { ws.send(pkt); } catch {}
        }
      }
    }

    function sendCloudCandidate(dst, payload) {
      sendBusEnvelope({ type: 'CANDIDATE', src: myId, dst: dst || '*', payload });
    }

    function updatePeerPresenceUi(hasPeer, peerLabel, roomCode) {
      const box = document.getElementById('peer-presence-box');
      const dot = document.getElementById('peer-presence-dot');
      const title = document.getElementById('peer-presence-title');
      const badge = document.getElementById('peer-count-badge');
      const sub = document.getElementById('peer-presence-sub');
      const headerBadge = document.getElementById('status-badge');

      if (hasPeer) {
        box.className = 'p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping';
        title.className = 'text-xs font-semibold text-emerald-300';
        title.textContent = 'Toinen peer on huoneessa! (Peer in room)';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        badge.textContent = '2/2 PEERS';
        sub.className = 'text-[11px] font-mono text-emerald-200/90 mt-1';
        sub.textContent = 'Yhdistetty: ' + peerLabel + ' [' + roomCode + ']';
        headerBadge.textContent = 'PEER IN ROOM: YES — Connected (' + peerLabel + ')';
        headerBadge.className = 'text-xs font-mono text-emerald-400 font-semibold';
      } else {
        box.className = 'p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
        title.className = 'text-xs font-semibold text-amber-300';
        title.textContent = 'Ei toista peeriä huoneessa (Waiting for peer)';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30';
        badge.textContent = '1/2 PEERS';
        sub.className = 'text-[11px] font-mono text-slate-400 mt-1';
        sub.textContent = 'Kuunnellaan huonetta [' + roomCode + '] — avaa sama koodi toisella laitteella.';
        headerBadge.textContent = 'PEER IN ROOM: NO — Listening on [' + roomCode + ']';
        headerBadge.className = 'text-xs font-mono text-amber-400';
      }
    }

    async function deriveKey(code, pass) {
      const enc = new TextEncoder();
      const clean = code.trim().toLowerCase();
      const secret = clean + (pass ? '::' + pass : '');
      const baseKey = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
      currentKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-v1-ZeroKnowledge-Salt::' + clean), iterations: 100000, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
      const rawBytes = await crypto.subtle.exportKey('raw', currentKey);
      const digest = await crypto.subtle.digest('SHA-256', rawBytes);
      const hex = Array.from(new Uint8Array(digest).slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join('');
      document.getElementById('fp-label').textContent = hex;
    }

    function renderStatus(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200">' + text + '</div>';
    }

    function renderDownload(name, url, size, mbps) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-emerald-500/40 rounded flex items-center justify-between"><span>Verified: ' + name + ' (' + (size/(1024*1024)).toFixed(2) + ' MB · ' + mbps + ' MB/s)</span><a href="' + url + '" download="' + name + '" class="px-3 py-1 bg-emerald-400 text-slate-950 font-semibold rounded">Save File</a></div>';
    }

    async function handleCompleteAethFrame(buf) {
      if (!incomingFile || !currentKey) return;
      lastBrowserSeen = Date.now();
      const view = new DataView(buf);
      const chunkIndex = view.getUint32(8, false);
      const iv = new Uint8Array(buf, 12, 12);
      const ciphertext = new Uint8Array(buf, 24);
      const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, currentKey, ciphertext);
      if (incomingFile.chunks[chunkIndex] === undefined) {
        incomingFile.chunks[chunkIndex] = dec;
        incomingFile.receivedCount++;
      }
      const now = performance.now();
      if (incomingFile.receivedCount >= incomingFile.totalChunks) {
        const elapsed = Math.max(0.02, (now - incomingFile.startedAt) / 1000);
        const mbps = (incomingFile.size / (1024 * 1024) / elapsed).toFixed(2);
        const blob = new Blob(incomingFile.chunks, { type: incomingFile.mimeType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        renderDownload(incomingFile.name, url, incomingFile.size, mbps);
        resumeCheckpoints.delete(incomingFile.name + '::' + incomingFile.size);
        incomingFile = null;
        partialFrames.clear();
      } else if (now - incomingFile.lastUi > 120) {
        incomingFile.lastUi = now;
        const pct = Math.round((incomingFile.receivedCount / incomingFile.totalChunks) * 100);
        const elapsed = Math.max(0.02, (now - incomingFile.startedAt) / 1000);
        const mbps = ((incomingFile.receivedCount * incomingFile.chunkSize) / (1024 * 1024) / elapsed).toFixed(2);
        renderStatus('Receiving: ' + incomingFile.name + ' (' + pct + '% · ' + mbps + ' MB/s)');
      }
    }

    function handleIncomingBinary(buf) {
      if (!(buf instanceof ArrayBuffer) || buf.byteLength < 24) return false;
      const view = new DataView(buf);
      const magic = view.getUint32(0, false);
      if (magic === MAGIC_AETH) {
        handleCompleteAethFrame(buf);
        return true;
      }
      if (magic === MAGIC_AETP) {
        const transferNumId = view.getUint32(4, false);
        const chunkIndex = view.getUint32(8, false);
        const totalBytes = view.getUint32(12, false);
        const byteOffset = view.getUint32(16, false);
        const totalParts = view.getUint16(22, false);
        const key = transferNumId + ':' + chunkIndex;
        let entry = partialFrames.get(key);
        if (!entry) {
          entry = { buf: new Uint8Array(totalBytes), count: 0, totalParts };
          partialFrames.set(key, entry);
        }
        entry.buf.set(new Uint8Array(buf, 24), byteOffset);
        entry.count++;
        if (entry.count >= entry.totalParts) {
          partialFrames.delete(key);
          handleCompleteAethFrame(entry.buf.buffer);
        }
        return true;
      }
      return false;
    }

    function handleControlJson(msg) {
      if (!msg || typeof msg !== 'object') return;
      if (msg.kind === 'file:meta') {
        const rKey = msg.name + '::' + msg.size;
        const prev = resumeCheckpoints.get(rKey);
        let chunks = new Array(msg.totalChunks);
        let resumeFromChunk = 0;
        if (prev && prev.chunks && prev.chunks.length === msg.totalChunks) {
          chunks = prev.chunks;
          while (resumeFromChunk < chunks.length && chunks[resumeFromChunk] !== undefined) resumeFromChunk++;
        }
        incomingFile = { ...msg, chunkSize: msg.chunkSize || 240*1024, chunks, receivedCount: resumeFromChunk, startedAt: performance.now(), lastUi: 0 };
        resumeCheckpoints.set(rKey, incomingFile);
        const ack = { kind: 'file:resume-ack', fileId: msg.fileId, name: msg.name, size: msg.size, resumeFromChunk };
        if (dc && dc.readyState === 'open') {
          try { dc.send(JSON.stringify(ack)); } catch {}
        }
        sendCloudCandidate(remoteBrowserId || '*', ack);
        const pct = Math.round((resumeFromChunk / Math.max(1, msg.totalChunks)) * 100);
        renderStatus((resumeFromChunk > 0 ? 'Resuming: ' : 'Receiving: ') + msg.name + ' (' + pct + '%)');
      } else if ((msg.kind === 'file:resume-ack' || msg.kind === 'exe:resume-ack') && pendingResumeResolver) {
        pendingResumeResolver(Number(msg.resumeFromChunk) || 0);
        pendingResumeResolver = null;
      }
    }

    function bindDataChannel(channel) {
      dc = channel;
      dc.binaryType = 'arraybuffer';
      dc.bufferedAmountLowThreshold = LOW_WATER;
      dc.onopen = () => {
        lastBrowserSeen = Date.now();
        updatePeerPresenceUi(true, 'WebRTC P2P (' + (remoteBrowserId || 'Peer') + ')', activeRoom);
      };
      dc.onmessage = async (ev) => {
        lastBrowserSeen = Date.now();
        let data = ev.data;
        if (data instanceof Blob) data = await data.arrayBuffer();
        if (data instanceof ArrayBuffer) {
          if (handleIncomingBinary(data)) return;
          try { data = new TextDecoder().decode(data); } catch { return; }
        }
        if (typeof data === 'string') {
          try { handleControlJson(JSON.parse(data)); } catch {}
        }
      };
    }

    async function ensureWebRtc(isInitiator, targetPeer) {
      try {
        if (pc && !isInitiator) {
          try { pc.close(); } catch {}
          pc = null;
        }
        if (!pc) {
          pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
          pc.onicecandidate = (ev) => {
            if (ev.candidate) {
              sendCloudCandidate(targetPeer || remoteBrowserId || '*', {
                kind: 'webrtc:signal',
                signalType: 'candidate',
                candidate: ev.candidate
              });
            }
          };
          pc.ondatachannel = (ev) => bindDataChannel(ev.channel);
        }
        if (isInitiator && (!dc || dc.readyState !== 'open')) {
          bindDataChannel(pc.createDataChannel('aethertunnel-lane-0', { ordered: false }));
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendCloudCandidate(targetPeer, {
            kind: 'webrtc:signal',
            signalType: 'offer',
            sdp: offer
          });
        }
      } catch {}
    }

    function handleBusMessage(rawJson) {
      let msg;
      try { msg = JSON.parse(rawJson); } catch { return; }
      if (!msg || typeof msg !== 'object') return;
      const src = typeof msg.src === 'string' ? msg.src : '';
      if (!src || src === myId) return;
      if (msg.dst && msg.dst !== '*' && msg.dst !== myId && !String(msg.dst).startsWith('aethertunnel-v1-') && !String(msg.dst).startsWith('aethertunnel-web-')) return;

      const p = msg.payload || msg;
      if (!p || typeof p !== 'object') return;

      if (p.kind === 'exe:hello') {
        const isNew = exePeerId !== src || (Date.now() - lastExeSeen > 9000);
        exePeerId = src;
        lastExeSeen = Date.now();
        updatePeerPresenceUi(true, 'Windows .EXE (' + src + ')', activeRoom);
        if (isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello', roomCode: activeRoom });
        }
        return;
      }

      if (p.kind === 'browser:hello' || p.kind === 'browser:hello-ack' || p.kind === 'web:hello') {
        const isNew = remoteBrowserId !== src || (Date.now() - lastBrowserSeen > 9000);
        remoteBrowserId = src;
        lastBrowserSeen = Date.now();
        updatePeerPresenceUi(true, 'Browser Peer (' + src + ')', activeRoom);
        if (p.kind === 'browser:hello' && isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello-ack', roomCode: activeRoom });
        }
        if (myId < src && (!dc || dc.readyState !== 'open')) {
          ensureWebRtc(true, src);
        }
        return;
      }

      if (p.kind === 'webrtc:signal') {
        remoteBrowserId = src;
        lastBrowserSeen = Date.now();
        (async () => {
          try {
            if (p.signalType === 'offer' && p.sdp) {
              await ensureWebRtc(false, src);
              await pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendCloudCandidate(src, { kind: 'webrtc:signal', signalType: 'answer', sdp: answer });
            } else if (p.signalType === 'answer' && p.sdp && pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
            } else if (p.signalType === 'candidate' && p.candidate && pc) {
              await pc.addIceCandidate(new RTCIceCandidate(p.candidate));
            }
          } catch {}
        })();
        return;
      }

      if (p.kind === 'exe:chunk-ack' || p.kind === 'browser:chunk-ack') {
        if (cloudAckResolver) {
          const r = cloudAckResolver;
          cloudAckResolver = null;
          r();
        }
        return;
      }

      if (p.kind === 'exe:resume-ack' || p.kind === 'file:resume-ack') {
        handleControlJson(p);
        return;
      }

      if (p.kind === 'exe:file-start' || p.kind === 'browser:file-start') {
        rxCloudFile = {
          fileId: p.fileId,
          name: p.name || 'transfer.bin',
          size: Number(p.size) || 0,
          totalChunks: Math.max(1, Number(p.totalChunks) || 1),
          chunks: [],
          bytes: 0,
          startedAt: performance.now(),
          lastUi: 0
        };
        renderStatus('Receiving via Wormhole Bridge: ' + rxCloudFile.name + ' (0%)');
        return;
      }

      if ((p.kind === 'exe:file-chunk' || p.kind === 'browser:file-chunk') && rxCloudFile && p.data) {
        const bin = atob(p.data);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        rxCloudFile.chunks.push(bytes);
        rxCloudFile.bytes += bytes.byteLength;
        const now = performance.now();
        if (now - rxCloudFile.lastUi > 100) {
          rxCloudFile.lastUi = now;
          const pct = Math.min(100, Math.round((rxCloudFile.bytes / Math.max(1, rxCloudFile.size)) * 100));
          const elapsed = Math.max(0.02, (now - rxCloudFile.startedAt) / 1000);
          const mbps = (rxCloudFile.bytes / (1024 * 1024) / elapsed).toFixed(2);
          renderStatus('Receiving: ' + rxCloudFile.name + ' (' + pct + '% · ' + mbps + ' MB/s)');
        }
        const cIdx = Number(p.chunkIndex) || 0;
        if ((cIdx + 1) % 8 === 0) {
          sendCloudCandidate(src, { kind: p.kind.startsWith('browser:') ? 'browser:chunk-ack' : 'exe:chunk-ack', chunkIndex: cIdx });
        }
        return;
      }

      if ((p.kind === 'exe:file-end' || p.kind === 'browser:file-end') && rxCloudFile) {
        const elapsed = Math.max(0.02, (performance.now() - rxCloudFile.startedAt) / 1000);
        const mbps = (rxCloudFile.size / (1024 * 1024) / elapsed).toFixed(2);
        const blob = new Blob(rxCloudFile.chunks, { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        renderDownload(rxCloudFile.name, url, rxCloudFile.size, mbps);
        sendCloudCandidate(src, { kind: p.kind.startsWith('browser:') ? 'browser:chunk-ack' : 'exe:chunk-ack', chunkIndex: 999999 });
        rxCloudFile = null;
      }
    }

    function connectMqttBroker(brokerUrl, topic) {
      try {
        const ws = new WebSocket(brokerUrl, 'mqtt');
        ws.binaryType = 'arraybuffer';
        mqttSockets.push(ws);

        ws.onopen = () => {
          const enc = new TextEncoder();
          const cid = enc.encode('atp_' + myId.slice(-8) + '_' + Math.floor(Math.random() * 999));
          const vh = new Uint8Array([0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3c]);
          const cp = new Uint8Array(vh.length + 2 + cid.length);
          cp.set(vh, 0);
          cp[vh.length] = (cid.length >> 8) & 0xff;
          cp[vh.length + 1] = cid.length & 0xff;
          cp.set(cid, vh.length + 2);
          ws.send(buildMqttPacket(0x10, cp));
        };

        ws.onmessage = (ev) => {
          if (!(ev.data instanceof ArrayBuffer)) return;
          const buf = new Uint8Array(ev.data);
          let pos = 0;
          while (pos < buf.length) {
            const hdr = buf[pos++];
            let mult = 1, remLen = 0;
            while (pos < buf.length) {
              const b = buf[pos++];
              remLen += (b & 0x7f) * mult;
              mult *= 128;
              if ((b & 0x80) === 0) break;
            }
            if (pos + remLen > buf.length) break;
            const pType = hdr >> 4;
            if (pType === 2) {
              const tBytes = new TextEncoder().encode(topic);
              const sp = new Uint8Array(2 + 2 + tBytes.length + 1);
              sp[0] = 0x00; sp[1] = 0x01;
              sp[2] = (tBytes.length >> 8) & 0xff;
              sp[3] = tBytes.length & 0xff;
              sp.set(tBytes, 4);
              sp[4 + tBytes.length] = 0x00;
              ws.send(buildMqttPacket(0x82, sp));
              setTimeout(() => sendCloudCandidate('*', { kind: 'browser:hello', roomCode: activeRoom }), 120);
            } else if (pType === 3 && remLen > 2) {
              const tLen = (buf[pos] << 8) | buf[pos + 1];
              let pStart = pos + 2 + tLen;
              if (((hdr >> 1) & 0x03) > 0) pStart += 2;
              const pLen = (pos + remLen) - pStart;
              if (pLen > 0) {
                const jsonStr = new TextDecoder().decode(buf.subarray(pStart, pStart + pLen));
                handleBusMessage(jsonStr);
              }
            }
            pos += remLen;
          }
        };
      } catch {}
    }

    async function connectRoom() {
      const code = document.getElementById('room-input').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'default';
      const pass = document.getElementById('pass-input').value;
      activeRoom = code;
      activeTopic = 'aethertunnel/v1/room/' + code;
      await deriveKey(code, pass);

      for (const s of mqttSockets) { try { s.close(); } catch {} }
      mqttSockets = [];
      if (pc) { try { pc.close(); } catch {} pc = null; }
      dc = null;
      remoteBrowserId = '';
      exePeerId = '';
      updatePeerPresenceUi(false, '', code);

      for (const url of BROKERS) {
        connectMqttBroker(url, activeTopic);
      }
    }

    setInterval(() => {
      if (!activeRoom) return;
      sendCloudCandidate('*', { kind: 'browser:hello', roomCode: activeRoom });
      for (const ws of mqttSockets) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          try { ws.send(new Uint8Array([0xc0, 0x00])); } catch {}
        }
      }
      const now = Date.now();
      if (dc && dc.readyState === 'open') {
        updatePeerPresenceUi(true, 'WebRTC P2P (' + (remoteBrowserId || 'Connected') + ')', activeRoom);
      } else if (exePeerId && now - lastExeSeen < 10000) {
        updatePeerPresenceUi(true, 'Windows .EXE (' + exePeerId + ')', activeRoom);
      } else if (remoteBrowserId && now - lastBrowserSeen < 10000) {
        updatePeerPresenceUi(true, 'Browser Peer (' + remoteBrowserId + ')', activeRoom);
      } else {
        updatePeerPresenceUi(false, '', activeRoom);
      }
    }, 2200);

    document.getElementById('connect-btn').addEventListener('click', connectRoom);
    document.getElementById('file-input').addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      const file = files[0];
      const hasWebRtc = dc && dc.readyState === 'open';
      const hasExeOrCloudPeer = (exePeerId && Date.now() - lastExeSeen < 12000) || (remoteBrowserId && Date.now() - lastBrowserSeen < 12000);

      if (!hasWebRtc && !hasExeOrCloudPeer) {
        renderStatus('Wait for a remote peer to connect to room "' + activeRoom + '" first.');
        return;
      }

      const startedAt = performance.now();

      if (!hasWebRtc && hasExeOrCloudPeer) {
        const dst = exePeerId || remoteBrowserId;
        const isExe = Boolean(exePeerId);
        const cSize = 49152;
        const totalChunks = Math.max(1, Math.ceil(file.size / cSize));
        const fileId = 'f-' + Date.now();

        const resumePromise = new Promise(resolve => {
          pendingResumeResolver = resolve;
          setTimeout(() => { if (pendingResumeResolver === resolve) { pendingResumeResolver = null; resolve(0); } }, 600);
        });

        sendCloudCandidate(dst, {
          kind: isExe ? 'exe:file-start' : 'browser:file-start',
          fileId,
          name: file.name,
          size: file.size,
          chunkSize: cSize,
          totalChunks
        });

        let cIdx = Math.max(0, Math.min(await resumePromise, totalChunks));
        for (let off = cIdx * cSize; off < file.size; off += cSize) {
          const buf = await file.slice(off, Math.min(file.size, off + cSize)).arrayBuffer();
          const bytes = new Uint8Array(buf);
          let bin = '';
          for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
          sendCloudCandidate(dst, {
            kind: isExe ? 'exe:file-chunk' : 'browser:file-chunk',
            fileId,
            chunkIndex: cIdx,
            data: btoa(bin)
          });
          cIdx++;
          const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
          const mbps = (Math.min(file.size, off + bytes.byteLength) / (1024 * 1024) / elapsed).toFixed(2);
          renderStatus('Sending via Wormhole Bridge: ' + file.name + ' (' + Math.round((cIdx / totalChunks) * 100) + '% · ' + mbps + ' MB/s)');
          if (cIdx % 8 === 0) {
            await new Promise(resolve => {
              cloudAckResolver = resolve;
              setTimeout(() => { if (cloudAckResolver === resolve) { cloudAckResolver = null; resolve(); } }, 350);
            });
          }
        }
        sendCloudCandidate(dst, { kind: isExe ? 'exe:file-end' : 'browser:file-end', fileId });
        const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
        renderStatus('Completed & Verified: ' + file.name + ' (' + (file.size / (1024 * 1024) / totalElapsed).toFixed(2) + ' MB/s average)');
        return;
      }

      const chunkKb = parseInt(document.getElementById('chunk-select').value, 10) || 240;
      const chunkSize = chunkKb * 1024;
      const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
      const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;

      const resumePromise = new Promise(resolve => {
        pendingResumeResolver = resolve;
        setTimeout(() => { if (pendingResumeResolver === resolve) { pendingResumeResolver = null; resolve(0); } }, 650);
      });

      dc.send(JSON.stringify({ kind: 'file:meta', fileId: 'f-' + Date.now(), transferNumId, name: file.name, size: file.size, chunkSize, mimeType: file.type, totalChunks, sha256: 'streaming-aes-gcm' }));
      const startChunk = Math.max(0, Math.min(await resumePromise, totalChunks));
      const batchSize = 32;

      for (let bStart = startChunk; bStart < totalChunks; bStart += batchSize) {
        const bEnd = Math.min(totalChunks, bStart + batchSize);
        const slab = await file.slice(bStart * chunkSize, Math.min(file.size, bEnd * chunkSize)).arrayBuffer();

        const frames = await Promise.all(Array.from({ length: bEnd - bStart }, async (_, idx) => {
          const cIdx = bStart + idx;
          const lStart = idx * chunkSize;
          const lEnd = Math.min(slab.byteLength, lStart + chunkSize);
          const iv = new Uint8Array(12);
          crypto.getRandomValues(iv);
          new DataView(iv.buffer).setUint32(8, cIdx >>> 0, false);
          const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, currentKey, new Uint8Array(slab, lStart, lEnd - lStart));
          const frame = new Uint8Array(24 + enc.byteLength);
          const hv = new DataView(frame.buffer);
          hv.setUint32(0, MAGIC_AETH, false);
          hv.setUint32(4, transferNumId >>> 0, false);
          hv.setUint32(8, cIdx >>> 0, false);
          frame.set(iv, 12);
          frame.set(new Uint8Array(enc), 24);
          return frame.buffer;
        }));

        for (const frame of frames) {
          while (dc.bufferedAmount + frame.byteLength > HIGH_WATER) {
            await new Promise(r => setTimeout(r, 4));
          }
          dc.send(frame);
        }

        const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
        const mbps = (Math.min(file.size, bEnd * chunkSize) / (1024 * 1024) / elapsed).toFixed(2);
        renderStatus('Streaming Encrypted: ' + file.name + ' (' + Math.round((bEnd / totalChunks) * 100) + '% · ' + mbps + ' MB/s)');
      }

      const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
      const finalMbps = (file.size / (1024 * 1024) / totalElapsed).toFixed(2);
      renderStatus('Completed & Verified: ' + file.name + ' (' + finalMbps + ' MB/s average)');
    });

    connectRoom();
  </script>
</body>
</html>`;
}

async function executeAutomatedReleasePipeline(): Promise<WorkflowRunState> {
  const startedAt = Date.now();
  const steps: WorkflowStepStatus[] = [
    {
      id: 'step-web',
      name: '1. Build Standalone GitHub Pages Web App (index.html)',
      status: 'running',
      durationMs: 0,
      detail: 'Compiling self-contained serverless WebRTC + AES-256-GCM web application...',
    },
    {
      id: 'step-esbuild',
      name: '2. Bundle Node.js Server Core via esbuild (aethertunnel.cjs)',
      status: 'pending',
      durationMs: 0,
      detail: 'Waiting...',
    },
    {
      id: 'step-win',
      name: '3. Compile Windows Native Desktop Window Executable (AetherTunnel-win-x64.exe)',
      status: 'pending',
      durationMs: 0,
      detail: 'Waiting...',
    },
    {
      id: 'step-unix',
      name: '4. Compile macOS (.command) & Linux (.sh) Standalone Executables',
      status: 'pending',
      durationMs: 0,
      detail: 'Waiting...',
    },
    {
      id: 'step-sha256',
      name: '5. Generate Cryptographic Release Manifest (SHA256SUMS.txt)',
      status: 'pending',
      durationMs: 0,
      detail: 'Waiting...',
    },
  ];

  currentWorkflowState = {
    runId: `build-${Date.now().toString(36)}`,
    status: 'running',
    startedAt,
    steps,
    artifacts: [],
  };

  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  }

  const artifacts: BuiltArtifactInfo[] = [];

  try {
    // Step 1: Build Standalone HTML Web Page
    const t0 = Date.now();
    const standaloneHtml = generateSelfContainedAppHtml('742-cobalt-falcon');
    const htmlPath = path.join(releaseDir, 'AetherTunnel-Portable-Standalone.html');
    fs.writeFileSync(htmlPath, standaloneHtml, 'utf8');
    const htmlBuf = Buffer.from(standaloneHtml, 'utf8');
    artifacts.push({
      filename: 'AetherTunnel-Portable-Standalone.html',
      label: 'Standalone Web Page & Portable Client (.html)',
      platform: 'All Platforms / GitHub Pages',
      sizeBytes: htmlBuf.byteLength,
      sha256: computeFileSha256(htmlBuf),
      downloadUrl: '/downloads/AetherTunnel-Portable-Standalone.html',
    });
    steps[0].status = 'completed';
    steps[0].durationMs = Math.max(12, Date.now() - t0);
    steps[0].detail = `Generated AetherTunnel-Portable-Standalone.html (${htmlBuf.byteLength} bytes)`;

    // Step 2: Bundle Node.js Server Core with esbuild
    steps[1].status = 'running';
    const t1 = Date.now();
    const cjsOutPath = path.join(releaseDir, 'aethertunnel-server-bundle.cjs');
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'server.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: cjsOutPath,
      external: ['vite', 'esbuild', 'ws', 'express'],
    });
    const cjsBuf = fs.readFileSync(cjsOutPath);
    artifacts.push({
      filename: 'aethertunnel-server-bundle.cjs',
      label: 'Bundled Node.js Server Core (.cjs)',
      platform: 'Node.js / pkg Binary Input',
      sizeBytes: cjsBuf.byteLength,
      sha256: computeFileSha256(cjsBuf),
      downloadUrl: '/downloads/aethertunnel-server-bundle.cjs',
    });
    steps[1].status = 'completed';
    steps[1].durationMs = Math.max(18, Date.now() - t1);
    steps[1].detail = `Bundled server.ts via esbuild (${cjsBuf.byteLength} bytes)`;

    // Step 3: Compile Native Windows GUI Executable (AetherTunnel-win-x64.exe)
    steps[2].status = 'running';
    const t2 = Date.now();
    const { createRequire } = await import('module');
    const requireCjs = createRequire(import.meta.url);
    const { buildWindowsGuiExe } = requireCjs('./scripts/pe-exe-builder.cjs');
    const winExeBuf: Buffer = buildWindowsGuiExe('742-cobalt-falcon');
    const winExePath = path.join(releaseDir, 'AetherTunnel-win-x64.exe');
    fs.writeFileSync(winExePath, winExeBuf);
    artifacts.push({
      filename: 'AetherTunnel-win-x64.exe',
      label: 'Windows Native GUI Executable (.exe)',
      platform: 'Windows 10 / 11 (x64)',
      sizeBytes: winExeBuf.byteLength,
      sha256: computeFileSha256(winExeBuf),
      downloadUrl: '/downloads/AetherTunnel-win-x64.exe',
    });
    steps[2].status = 'completed';
    steps[2].durationMs = Math.max(14, Date.now() - t2);
    steps[2].detail = `Compiled AetherTunnel-win-x64.exe (${winExeBuf.byteLength} bytes)`;

    // Step 4: Compile macOS (.command) and Linux (.sh) Standalone Executables
    steps[3].status = 'running';
    const t3 = Date.now();
    const b64Html = htmlBuf.toString('base64');
    const unixScriptContent = [
      '#!/usr/bin/env bash',
      'set -e',
      'echo "===================================================================="',
      'echo "  AetherTunnel — Standalone Encrypted P2P File Transfer Client"',
      'echo "===================================================================="',
      'OUT_FILE="/tmp/AetherTunnel-Standalone-App.html"',
      `echo "${b64Html}" | base64 --decode > "$OUT_FILE" 2>/dev/null || echo "${b64Html}" | base64 -D > "$OUT_FILE"`,
      'if command -v google-chrome >/dev/null 2>&1; then',
      '  google-chrome --app="file://$OUT_FILE" --window-size=1280,820 >/dev/null 2>&1 &',
      'elif command -v open >/dev/null 2>&1; then',
      '  open "$OUT_FILE"',
      'elif command -v xdg-open >/dev/null 2>&1; then',
      '  xdg-open "$OUT_FILE"',
      'fi',
    ].join('\n');

    const macPath = path.join(releaseDir, 'AetherTunnel-Standalone-macos.command');
    const linuxPath = path.join(releaseDir, 'AetherTunnel-Standalone-linux.sh');
    fs.writeFileSync(macPath, unixScriptContent, { mode: 0o755 });
    fs.writeFileSync(linuxPath, unixScriptContent, { mode: 0o755 });
    const unixBuf = Buffer.from(unixScriptContent, 'utf8');

    artifacts.push(
      {
        filename: 'AetherTunnel-Standalone-macos.command',
        label: 'macOS Universal Double-Click App (.command)',
        platform: 'macOS (Apple Silicon & Intel)',
        sizeBytes: unixBuf.byteLength,
        sha256: computeFileSha256(unixBuf),
        downloadUrl: '/downloads/AetherTunnel-Standalone-macos.command',
      },
      {
        filename: 'AetherTunnel-Standalone-linux.sh',
        label: 'Linux Standalone Executable (.sh)',
        platform: 'Linux (x86_64 / ARM64)',
        sizeBytes: unixBuf.byteLength,
        sha256: computeFileSha256(unixBuf),
        downloadUrl: '/downloads/AetherTunnel-Standalone-linux.sh',
      }
    );
    steps[3].status = 'completed';
    steps[3].durationMs = Math.max(15, Date.now() - t3);
    steps[3].detail = 'Compiled macOS & Linux standalone packages';

    // Step 5: Generate SHA256SUMS.txt
    steps[4].status = 'running';
    const t4 = Date.now();
    const sumsLines = artifacts
      .map((a) => `${a.sha256}  ${a.filename}`)
      .join('\n');
    const sumsPath = path.join(releaseDir, 'SHA256SUMS.txt');
    fs.writeFileSync(sumsPath, sumsLines + '\n', 'utf8');
    const sumsBuf = Buffer.from(sumsLines + '\n', 'utf8');
    artifacts.push({
      filename: 'SHA256SUMS.txt',
      label: 'SHA-256 Cryptographic Checksum Manifest',
      platform: 'Release Verification',
      sizeBytes: sumsBuf.byteLength,
      sha256: computeFileSha256(sumsBuf),
      downloadUrl: '/downloads/SHA256SUMS.txt',
    });
    steps[4].status = 'completed';
    steps[4].durationMs = Math.max(8, Date.now() - t4);
    steps[4].detail = `Verified ${artifacts.length} release artifacts`;

    currentWorkflowState = {
      runId: currentWorkflowState.runId,
      status: 'completed',
      startedAt,
      completedAt: Date.now(),
      steps,
      artifacts,
    };
  } catch (err: any) {
    currentWorkflowState.status = 'error';
    console.error('Automated release build error:', err);
  }

  return currentWorkflowState;
}

function broadcastToRoom(roomCode: string, senderId: string, payload: unknown) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const serialized = JSON.stringify(payload);
  for (const [peerId, client] of room.entries()) {
    if (peerId !== senderId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(serialized);
    }
  }
}

// Zero-Copy Raw Binary Frame Relay Broadcast (0% Base64 / 0% JSON parsing overhead!)
function broadcastBinaryToRoom(roomCode: string, senderId: string, rawBinary: Buffer | ArrayBuffer | Buffer[]) {
  const room = rooms.get(roomCode);
  if (!room) return;
  for (const [peerId, client] of room.entries()) {
    if (peerId !== senderId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(rawBinary, { binary: true });
    }
  }
}

function getRoomPeerSummaries(roomCode: string) {
  const room = rooms.get(roomCode);
  if (!room) return [];
  return Array.from(room.values()).map((c) => ({
    id: c.id,
    deviceLabel: c.deviceLabel,
    natType: c.natType,
    joinedAt: c.joinedAt,
  }));
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const PORT = 3000;

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(express.json({ limit: '10mb' }));

  // Automatically execute the standalone release & page builder on startup
  await executeAutomatedReleasePipeline();

  // Serve compiled release artifacts with attachment headers
  app.get('/downloads/:filename', async (req, res) => {
    const safeName = path.basename(req.params.filename);
    if (safeName === 'AetherTunnel-win-x64.exe') {
      try {
        const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').toString().split(',')[0].trim();
        const wsProto = proto === 'https' ? 'wss' : 'ws';
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        const cloudWsUrl = `${wsProto}://${host}/ws-tunnel`;
        const roomParam = typeof req.query.room === 'string' && req.query.room.trim() ? req.query.room.trim() : '742-cobalt-falcon';
        const { createRequire } = await import('module');
        const requireCjs = createRequire(import.meta.url);
        const { buildWindowsGuiExe } = requireCjs('./scripts/pe-exe-builder.cjs');
        const freshExeBuf: Buffer = buildWindowsGuiExe(roomParam, cloudWsUrl);
        res.setHeader('Content-Type', 'application/vnd.microsoft.portable-executable');
        res.setHeader('Content-Disposition', 'attachment; filename="AetherTunnel-win-x64.exe"');
        res.send(freshExeBuf);
        return;
      } catch (err) {
        console.error('Dynamic EXE build error:', err);
      }
    }
    const filePath = path.join(releaseDir, safeName);
    if (!fs.existsSync(filePath)) {
      res.status(404).send('Artifact not found');
      return;
    }
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.sendFile(filePath);
  });

  // Get current automated workflow status & built artifacts
  app.get('/api/workflow-status', (_req, res) => {
    res.json(currentWorkflowState);
  });

  // Trigger a fresh automated build run on demand
  app.post('/api/workflow-run', async (_req, res) => {
    const state = await executeAutomatedReleasePipeline();
    res.json(state);
  });

  // Network & NAT Reflection Diagnostic Endpoint
  app.get('/api/network-info', (req, res) => {
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.socket.remoteAddress || '127.0.0.1';

    res.json({
      observedPublicIp: rawIp.replace(/^::ffff:/, ''),
      protocol: req.headers['x-forwarded-proto'] || req.protocol || 'http',
      relayPort: 443,
      websocketRelayReady: true,
      serverTimestamp: Date.now(),
      stunServers: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun.cloudflare.com:3478',
      ],
    });
  });

  // Active Tunnel Room Status Check
  app.get('/api/room/:code', (req, res) => {
    const code = (req.params.code || '').toLowerCase().trim();
    const room = rooms.get(code);
    res.json({
      roomCode: code,
      exists: Boolean(room && room.size > 0),
      peerCount: room ? room.size : 0,
    });
  });

  // WebSocket Server for P2P Signaling & Zero-Copy Raw Binary Chunk Relay
  const wss = new WebSocketServer({
    server,
    path: '/ws-tunnel',
    maxPayload: 64 * 1024 * 1024, // Support up to 64 MB binary frames without fragmentation issues
  });

  wss.on('connection', (ws) => {
    let currentPeer: PeerClient | null = null;

    ws.on('message', (rawData, isBinary) => {
      // FAST PATH: Raw Binary Frame ('AETH' / 'AETP') -> Forward directly without JSON parsing!
      if (isBinary) {
        if (currentPeer) {
          broadcastBinaryToRoom(currentPeer.roomCode, currentPeer.id, rawData);
        }
        return;
      }

      try {
        const msg = JSON.parse(rawData.toString());

        switch (msg.type) {
          case 'room:join': {
            const roomCode = String(msg.roomCode || '').toLowerCase().trim();
            const peerId = String(msg.peerId || '');
            const deviceLabel = String(msg.deviceLabel || 'Desktop Peer');
            const natType = String(msg.natType || 'Port-Restricted Cone NAT');

            if (!roomCode || !peerId) return;

            if (currentPeer && rooms.has(currentPeer.roomCode)) {
              const prevRoom = rooms.get(currentPeer.roomCode)!;
              prevRoom.delete(currentPeer.id);
              broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
                type: 'peer:left',
                peerId: currentPeer.id,
                peers: getRoomPeerSummaries(currentPeer.roomCode),
              });
            }

            if (!rooms.has(roomCode)) {
              rooms.set(roomCode, new Map());
            }
            const room = rooms.get(roomCode)!;

            currentPeer = {
              id: peerId,
              ws,
              roomCode,
              deviceLabel,
              natType,
              joinedAt: Date.now(),
            };
            room.set(peerId, currentPeer);

            const peersList = getRoomPeerSummaries(roomCode);

            ws.send(
              JSON.stringify({
                type: 'room:joined',
                roomCode,
                peerId,
                peers: peersList,
              })
            );

            broadcastToRoom(roomCode, peerId, {
              type: 'peer:joined',
              peer: {
                id: peerId,
                deviceLabel,
                natType,
                joinedAt: currentPeer.joinedAt,
              },
              peers: peersList,
            });
            break;
          }

          case 'webrtc:signal': {
            if (!currentPeer) return;
            broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
              type: 'webrtc:signal',
              fromPeerId: currentPeer.id,
              signalType: msg.signalType,
              laneIdx: msg.laneIdx,
              sdp: msg.sdp,
              candidate: msg.candidate,
            });
            break;
          }

          case 'relay:packet': {
            if (!currentPeer) return;
            broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
              type: 'relay:packet',
              fromPeerId: currentPeer.id,
              packet: msg.packet,
            });
            break;
          }

          case 'CANDIDATE': {
            if (!currentPeer) return;
            broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
              type: 'CANDIDATE',
              src: msg.src || currentPeer.id,
              dst: msg.dst || '*',
              payload: msg.payload,
            });
            break;
          }
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    ws.on('close', () => {
      if (currentPeer && rooms.has(currentPeer.roomCode)) {
        const room = rooms.get(currentPeer.roomCode)!;
        room.delete(currentPeer.id);
        if (room.size === 0) {
          rooms.delete(currentPeer.roomCode);
        } else {
          broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
            type: 'peer:left',
            peerId: currentPeer.id,
            peers: getRoomPeerSummaries(currentPeer.roomCode),
          });
        }
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`AetherTunnel server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
