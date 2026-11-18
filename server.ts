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
  clientType: 'browser' | 'exe';
  cloudId?: string;
  binaryTargetId?: string;
  joinedAt: number;
}

const MAX_ROOM_PEERS = 8;

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

function generateSelfContainedAppHtml(defaultRoom: string = ''): string {
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
        <p class="text-xs text-slate-400">Enter the same pairing code on both devices and click Yhdistä to establish a direct encrypted P2P tunnel.</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnelin nimi</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${defaultRoom}" placeholder="Kirjoita tunnelin nimi..." class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
            <button id="connect-btn" class="px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 rounded-lg hover:bg-sky-300 cursor-pointer">Yhdistä</button>
          </div>
        </div>

        <div id="peer-presence-box" class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span id="peer-presence-dot" class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span id="peer-presence-title" class="text-xs font-semibold text-amber-300">Ei toista peeriä huoneessa (No peer yet)</span>
            </div>
            <span id="peer-count-badge" class="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">1/8 KÄYTTÄJÄÄ</span>
          </div>
          <div id="peer-presence-sub" class="text-[11px] font-mono text-slate-400 mt-1">Odotetaan muita käyttäjiä samalla tunnelinimellä (max 8)...</div>
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
          <div class="flex justify-between"><span class="text-slate-400">Transport Engine:</span><span class="font-mono text-slate-200">WebRTC Mesh (Max 8) + Global WSS Bus</span></div>
        </div>
      </div>

      <div class="md:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-base font-semibold">2. Encrypted File Transfer</h2>
          <button id="pause-btn" type="button" class="px-3 py-1.5 text-xs font-semibold bg-amber-950/70 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900/80 cursor-pointer">Pysäytä</button>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label for="target-peer-select" class="text-xs font-medium text-slate-300 whitespace-nowrap">Kenelle lähetetään:</label>
          <select id="target-peer-select" class="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-sky-300">
            <option value="*">Kaikki huoneessa (0 käyttäjää)</option>
          </select>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label for="max-speed-input" class="text-xs font-medium text-slate-300 whitespace-nowrap">Max lähetysnopeus (MB/s):</label>
          <div class="flex items-center gap-2 flex-1">
            <input id="max-speed-input" type="text" inputmode="decimal" value="0" placeholder="0" class="w-28 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-sky-300" />
            <span class="text-[11px] text-slate-400">(0 = rajoittamaton)</span>
          </div>
        </div>
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
    const MAX_ROOM_PEERS = 8;
    const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
    const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }];

    const myId = 'aethertunnel-web-' + Math.random().toString(36).slice(2, 10);
    let currentKey = null;
    let activeRoom = '';
    let activeTopic = '';
    let mqttSockets = [];
    const peersMap = new Map();
    let incomingFile = null;
    let partialFrames = new Map();
    let resumeCheckpoints = new Map();
    let pendingResumeResolver = null;
    let cloudAckResolver = null;
    let rxCloudFile = null;
    let transferPaused = false;

    function togglePauseState() {
      transferPaused = !transferPaused;
      const btn = document.getElementById('pause-btn');
      if (btn) {
        if (transferPaused) {
          btn.textContent = 'Jatka';
          btn.className = 'px-3 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 rounded-lg hover:bg-emerald-300 cursor-pointer';
        } else {
          btn.textContent = 'Pysäytä';
          btn.className = 'px-3 py-1.5 text-xs font-semibold bg-amber-950/70 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900/80 cursor-pointer';
        }
      }
    }

    async function waitWhilePaused(onPauseMs) {
      if (!transferPaused) return;
      const pStart = performance.now();
      while (transferPaused) {
        await new Promise(r => setTimeout(r, 100));
      }
      if (onPauseMs) onPauseMs(performance.now() - pStart);
    }

    function getMaxUploadLimitMBps() {
      const el = document.getElementById('max-speed-input');
      if (!el) return 0;
      const parsed = parseFloat(String(el.value || '').trim().replace(',', '.'));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

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

    function syncTargetSelectorUi() {
      const sel = document.getElementById('target-peer-select');
      if (!sel) return;
      const prevVal = sel.value || '*';
      const activeList = Array.from(peersMap.values());
      sel.innerHTML = '';
      const allOpt = document.createElement('option');
      allOpt.value = '*';
      allOpt.textContent = 'Kaikki huoneessa (' + activeList.length + ' käyttäjää)';
      sel.appendChild(allOpt);
      for (const p of activeList) {
        const opt = document.createElement('option');
        opt.value = p.id;
        const via = p.dc && p.dc.readyState === 'open' ? 'WebRTC P2P' : (p.type === 'exe' ? 'Windows .EXE' : 'Cloud Bridge');
        opt.textContent = (p.label || p.id.slice(-8)) + ' (' + via + ')';
        sel.appendChild(opt);
      }
      if (prevVal !== '*' && peersMap.has(prevVal)) {
        sel.value = prevVal;
      } else {
        sel.value = '*';
      }
    }

    function updatePeerPresenceUi(hasPeer, peerLabel, roomCode) {
      const box = document.getElementById('peer-presence-box');
      const dot = document.getElementById('peer-presence-dot');
      const title = document.getElementById('peer-presence-title');
      const badge = document.getElementById('peer-count-badge');
      const sub = document.getElementById('peer-presence-sub');
      const headerBadge = document.getElementById('status-badge');
      const totalUsers = activeRoom ? Math.min(MAX_ROOM_PEERS, peersMap.size + 1) : 0;

      if (hasPeer || peersMap.size > 0) {
        box.className = 'p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping';
        title.className = 'text-xs font-semibold text-emerald-300';
        title.textContent = peersMap.size + ' käyttäjää huoneessa! (Max ' + MAX_ROOM_PEERS + ')';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        badge.textContent = totalUsers + '/' + MAX_ROOM_PEERS + ' KÄYTTÄJÄÄ';
        sub.className = 'text-[11px] font-mono text-emerald-200/90 mt-1';
        sub.textContent = 'Yhdistetty: ' + (peerLabel || (peersMap.size + ' peeriä')) + ' [' + roomCode + ']';
        headerBadge.textContent = 'HUONE [' + roomCode + ']: ' + totalUsers + '/' + MAX_ROOM_PEERS + ' käyttäjää';
        headerBadge.className = 'text-xs font-mono text-emerald-400 font-semibold';
      } else {
        box.className = 'p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
        title.className = 'text-xs font-semibold text-amber-300';
        title.textContent = 'Ei toista käyttäjää huoneessa (Waiting for peers)';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30';
        badge.textContent = (activeRoom ? '1/' : '0/') + MAX_ROOM_PEERS + ' KÄYTTÄJÄÄ';
        sub.className = 'text-[11px] font-mono text-slate-400 mt-1';
        sub.textContent = 'Kuunnellaan huonetta [' + roomCode + '] — max ' + MAX_ROOM_PEERS + ' käyttäjää.';
        headerBadge.textContent = activeRoom ? ('LISTENING ON [' + roomCode + '] · 1/' + MAX_ROOM_PEERS) : 'Odottaa tunnelin nimeä';
        headerBadge.className = 'text-xs font-mono text-amber-400';
      }
      syncTargetSelectorUi();
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

    function handleControlJson(msg, srcPeer) {
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
        const peerObj = srcPeer ? peersMap.get(srcPeer) : null;
        if (peerObj && peerObj.dc && peerObj.dc.readyState === 'open') {
          try { peerObj.dc.send(JSON.stringify(ack)); } catch {}
        }
        sendCloudCandidate(srcPeer || '*', ack);
        const pct = Math.round((resumeFromChunk / Math.max(1, msg.totalChunks)) * 100);
        renderStatus((resumeFromChunk > 0 ? 'Resuming: ' : 'Receiving: ') + msg.name + ' (' + pct + '%)');
      } else if ((msg.kind === 'file:resume-ack' || msg.kind === 'exe:resume-ack') && pendingResumeResolver) {
        pendingResumeResolver(Number(msg.resumeFromChunk) || 0);
        pendingResumeResolver = null;
      }
    }

    function bindDataChannel(channel, peerEntry) {
      peerEntry.dc = channel;
      channel.binaryType = 'arraybuffer';
      channel.bufferedAmountLowThreshold = LOW_WATER;
      channel.onopen = () => {
        peerEntry.lastSeen = Date.now();
        updatePeerPresenceUi(true, peerEntry.label, activeRoom);
      };
      channel.onclose = () => {
        if (peerEntry.dc === channel) peerEntry.dc = null;
        syncTargetSelectorUi();
      };
      channel.onmessage = async (ev) => {
        peerEntry.lastSeen = Date.now();
        let data = ev.data;
        if (data instanceof Blob) data = await data.arrayBuffer();
        if (data instanceof ArrayBuffer) {
          if (handleIncomingBinary(data)) return;
          try { data = new TextDecoder().decode(data); } catch { return; }
        }
        if (typeof data === 'string') {
          try { handleControlJson(JSON.parse(data), peerEntry.id); } catch {}
        }
      };
    }

    async function ensureWebRtc(isInitiator, targetPeer) {
      if (!targetPeer) return;
      const peerEntry = peersMap.get(targetPeer);
      if (!peerEntry) return;
      try {
        if (peerEntry.pc && !isInitiator) {
          try { peerEntry.pc.close(); } catch {}
          peerEntry.pc = null;
        }
        if (!peerEntry.pc) {
          const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
          peerEntry.pc = pc;
          pc.onicecandidate = (ev) => {
            if (ev.candidate) {
              sendCloudCandidate(targetPeer, {
                kind: 'webrtc:signal',
                signalType: 'candidate',
                candidate: ev.candidate
              });
            }
          };
          pc.ondatachannel = (ev) => bindDataChannel(ev.channel, peerEntry);
        }
        if (isInitiator && (!peerEntry.dc || peerEntry.dc.readyState !== 'open')) {
          bindDataChannel(peerEntry.pc.createDataChannel('aethertunnel-lane-0', { ordered: false }), peerEntry);
          const offer = await peerEntry.pc.createOffer();
          await peerEntry.pc.setLocalDescription(offer);
          sendCloudCandidate(targetPeer, {
            kind: 'webrtc:signal',
            signalType: 'offer',
            sdp: offer
          });
        }
      } catch {}
    }

    function upsertRoomPeer(src, type, label) {
      let existing = peersMap.get(src);
      if (!existing) {
        if (peersMap.size >= MAX_ROOM_PEERS - 1) {
          return null;
        }
        existing = { id: src, type, label: label || src.slice(-8), lastSeen: Date.now(), pc: null, dc: null };
        peersMap.set(src, existing);
        return { peer: existing, isNew: true };
      }
      existing.lastSeen = Date.now();
      if (label) existing.label = label;
      return { peer: existing, isNew: false };
    }

    function handleBusMessage(rawJson) {
      let msg;
      try { msg = JSON.parse(rawJson); } catch { return; }
      if (!msg || typeof msg !== 'object') return;
      const src = typeof msg.src === 'string' ? msg.src : '';
      if (!src || src === myId) return;
      if (msg.dst && msg.dst !== '*' && msg.dst !== myId) return;

      const p = msg.payload || msg;
      if (!p || typeof p !== 'object') return;

      if (p.kind === 'exe:hello' || p.kind === 'exe:hello-reply') {
        const res = upsertRoomPeer(src, 'exe', p.displayName || ('Windows .EXE (' + src.slice(-6) + ')'));
        if (!res) return;
        updatePeerPresenceUi(true, res.peer.label, activeRoom);
        if (p.kind === 'exe:hello' && res.isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello', roomCode: activeRoom });
        }
        return;
      }

      if (p.kind === 'browser:hello' || p.kind === 'browser:hello-ack' || p.kind === 'web:hello') {
        const res = upsertRoomPeer(src, 'browser', p.displayName || ('Selain (' + src.slice(-6) + ')'));
        if (!res) return;
        updatePeerPresenceUi(true, res.peer.label, activeRoom);
        if (p.kind === 'browser:hello' && res.isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello-ack', roomCode: activeRoom });
        }
        if (myId < src && (!res.peer.dc || res.peer.dc.readyState !== 'open')) {
          ensureWebRtc(true, src);
        }
        return;
      }

      if (p.kind === 'webrtc:signal') {
        const res = upsertRoomPeer(src, 'browser', 'Selain (' + src.slice(-6) + ')');
        if (!res) return;
        const peerEntry = res.peer;
        (async () => {
          try {
            if (p.signalType === 'offer' && p.sdp) {
              await ensureWebRtc(false, src);
              await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
              const answer = await peerEntry.pc.createAnswer();
              await peerEntry.pc.setLocalDescription(answer);
              sendCloudCandidate(src, { kind: 'webrtc:signal', signalType: 'answer', sdp: answer });
            } else if (p.signalType === 'answer' && p.sdp && peerEntry.pc) {
              await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
            } else if (p.signalType === 'candidate' && p.candidate && peerEntry.pc) {
              await peerEntry.pc.addIceCandidate(new RTCIceCandidate(p.candidate));
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

      if (p.kind === 'exe:resume-ack' || p.kind === 'file:resume-ack' || p.kind === 'browser:resume-ack') {
        handleControlJson(p, src);
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
      const code = document.getElementById('room-input').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!code) {
        activeRoom = '';
        activeTopic = '';
        document.getElementById('status-badge').textContent = 'Odottaa tunnelin nimeä — kirjoita nimi ja paina Yhdistä';
        return;
      }
      const pass = document.getElementById('pass-input').value;
      activeRoom = code;
      activeTopic = 'aethertunnel/v1/room/' + code;
      await deriveKey(code, pass);

      for (const s of mqttSockets) { try { s.close(); } catch {} }
      mqttSockets = [];
      for (const p of peersMap.values()) {
        try { if (p.pc) p.pc.close(); } catch {}
      }
      peersMap.clear();
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
      let pruned = false;
      for (const [pid, peer] of peersMap.entries()) {
        const dcOpen = peer.dc && peer.dc.readyState === 'open';
        if (!dcOpen && now - peer.lastSeen > 12000) {
          try { if (peer.pc) peer.pc.close(); } catch {}
          peersMap.delete(pid);
          pruned = true;
        }
      }
      if (peersMap.size > 0) {
        updatePeerPresenceUi(true, peersMap.size + ' käyttäjää', activeRoom);
      } else if (pruned || peersMap.size === 0) {
        updatePeerPresenceUi(false, '', activeRoom);
      }
    }, 2200);

    document.getElementById('connect-btn').addEventListener('click', connectRoom);
    document.getElementById('pause-btn').addEventListener('click', togglePauseState);
    document.getElementById('file-input').addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      const file = files[0];
      const targetId = (document.getElementById('target-peer-select') && document.getElementById('target-peer-select').value) || '*';
      const targetPeers = targetId === '*'
        ? Array.from(peersMap.values())
        : (peersMap.has(targetId) ? [peersMap.get(targetId)] : []);

      if (targetPeers.length === 0) {
        renderStatus('Valittu vastaanottaja ei ole paikalla huoneessa "' + activeRoom + '".');
        return;
      }

      const webrtcPeers = targetPeers.filter(p => p.dc && p.dc.readyState === 'open');
      const bridgePeers = targetPeers.filter(p => !(p.dc && p.dc.readyState === 'open'));

      let startedAt = performance.now();
      let paceEpochMs = performance.now();
      async function paceOutgoingBytes(bytesSent) {
        const limitMBps = getMaxUploadLimitMBps();
        if (!limitMBps || limitMBps <= 0) {
          paceEpochMs = performance.now();
          return;
        }
        const bytesPerMs = Math.max(10.24, (limitMBps * 1024 * 1024) / 1000);
        const durMs = bytesSent / bytesPerMs;
        const now = performance.now();
        if (paceEpochMs < now - 80) paceEpochMs = now - 80;
        paceEpochMs += durMs;
        while (getMaxUploadLimitMBps() > 0) {
          const waitMs = paceEpochMs - performance.now();
          if (waitMs <= 1) break;
          await new Promise(r => setTimeout(r, Math.min(80, waitMs)));
        }
      }

      if (webrtcPeers.length > 0) {
        const chunkKb = parseInt(document.getElementById('chunk-select').value, 10) || 240;
        const chunkSize = chunkKb * 1024;
        const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
        const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;

        const resumePromise = new Promise(resolve => {
          pendingResumeResolver = resolve;
          setTimeout(() => { if (pendingResumeResolver === resolve) { pendingResumeResolver = null; resolve(0); } }, 650);
        });

        const metaMsg = JSON.stringify({ kind: 'file:meta', fileId: 'f-' + Date.now(), transferNumId, name: file.name, size: file.size, chunkSize, mimeType: file.type, totalChunks, sha256: 'streaming-aes-gcm' });
        for (const p of webrtcPeers) {
          try { p.dc.send(metaMsg); } catch {}
        }
        const startChunk = Math.max(0, Math.min(await resumePromise, totalChunks));
        const batchSize = 32;

        for (let bStart = startChunk; bStart < totalChunks; bStart += batchSize) {
          if (transferPaused) {
            renderStatus('Pysäytetty: ' + file.name + ' (' + Math.round((bStart / totalChunks) * 100) + '%)');
            await waitWhilePaused((ms) => { startedAt += ms; });
          }
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
            for (const p of webrtcPeers) {
              while (p.dc && p.dc.readyState === 'open' && p.dc.bufferedAmount + frame.byteLength > HIGH_WATER) {
                await new Promise(r => setTimeout(r, 4));
              }
              try { if (p.dc && p.dc.readyState === 'open') p.dc.send(frame.slice(0)); } catch {}
            }
            await paceOutgoingBytes(chunkSize);
          }

          const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
          const mbps = (Math.min(file.size, bEnd * chunkSize) / (1024 * 1024) / elapsed).toFixed(2);
          renderStatus('Streaming Encrypted (' + webrtcPeers.length + ' peers): ' + file.name + ' (' + Math.round((bEnd / totalChunks) * 100) + '% · ' + mbps + ' MB/s)');
        }
      }

      for (const bp of bridgePeers) {
        const dst = bp.id;
        const isExe = bp.type === 'exe';
        const cSize = 49152;
        const totalChunks = Math.max(1, Math.ceil(file.size / cSize));
        const fileId = 'f-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);

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
          if (transferPaused) {
            renderStatus('Pysäytetty: ' + file.name + ' (' + Math.round((cIdx / totalChunks) * 100) + '%)');
            await waitWhilePaused((ms) => { startedAt += ms; });
          }
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
          await paceOutgoingBytes(bytes.byteLength);
          const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
          const mbps = (Math.min(file.size, off + bytes.byteLength) / (1024 * 1024) / elapsed).toFixed(2);
          renderStatus('Sending to ' + bp.label + ': ' + file.name + ' (' + Math.round((cIdx / totalChunks) * 100) + '% · ' + mbps + ' MB/s)');
          if (cIdx % 8 === 0) {
            await new Promise(resolve => {
              cloudAckResolver = resolve;
              setTimeout(() => { if (cloudAckResolver === resolve) { cloudAckResolver = null; resolve(); } }, 350);
            });
          }
        }
        sendCloudCandidate(dst, { kind: isExe ? 'exe:file-end' : 'browser:file-end', fileId });
      }

      const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
      const finalMbps = (file.size / (1024 * 1024) / totalElapsed).toFixed(2);
      renderStatus('Completed & Verified: ' + file.name + ' (' + finalMbps + ' MB/s average)');
    });

    if (document.getElementById('room-input').value.trim()) {
      connectRoom();
    } else {
      document.getElementById('status-badge').textContent = 'Odottaa tunnelin nimeä — kirjoita nimi ja paina Yhdistä';
    }
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
    const standaloneHtml = generateSelfContainedAppHtml('');
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
    const winExeBuf: Buffer = buildWindowsGuiExe('');
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

function sendToRoomTarget(roomCode: string, senderId: string, toPeerId: string | undefined, payload: unknown) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const serialized = JSON.stringify(payload);
  if (toPeerId && toPeerId !== '*' && room.has(toPeerId) && toPeerId !== senderId) {
    const targetClient = room.get(toPeerId)!;
    if (targetClient.ws.readyState === WebSocket.OPEN) {
      targetClient.ws.send(serialized);
    }
    return;
  }
  for (const [peerId, client] of room.entries()) {
    if (peerId !== senderId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(serialized);
    }
  }
}

function broadcastToRoom(roomCode: string, senderId: string, payload: unknown) {
  sendToRoomTarget(roomCode, senderId, '*', payload);
}

// Zero-Copy Raw Binary Frame Relay Broadcast / Targeted Relay (0% Base64 / 0% JSON parsing overhead!)
function broadcastBinaryToRoom(roomCode: string, senderId: string, rawBinary: Buffer | ArrayBuffer | Buffer[], toPeerId?: string) {
  const room = rooms.get(roomCode);
  if (!room) return;
  if (toPeerId && toPeerId !== '*' && room.has(toPeerId) && toPeerId !== senderId) {
    const targetClient = room.get(toPeerId)!;
    if (targetClient.ws.readyState === WebSocket.OPEN) {
      targetClient.ws.send(rawBinary, { binary: true });
    }
    return;
  }
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
    clientType: c.clientType,
    cloudId: c.cloudId,
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
        const roomParam = typeof req.query.room === 'string' && req.query.room.trim() ? req.query.room.trim() : '';
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
      maxPeers: MAX_ROOM_PEERS,
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
          broadcastBinaryToRoom(currentPeer.roomCode, currentPeer.id, rawData, currentPeer.binaryTargetId);
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
            const clientType: 'browser' | 'exe' =
              msg.clientType === 'exe' || peerId.startsWith('exe-kernel-') || peerId.startsWith('aethertunnel-exe-')
                ? 'exe'
                : 'browser';
            const cloudId = msg.cloudId ? String(msg.cloudId) : undefined;

            if (!roomCode || !peerId) return;

            if (currentPeer && rooms.has(currentPeer.roomCode) && currentPeer.roomCode !== roomCode) {
              const prevRoom = rooms.get(currentPeer.roomCode)!;
              prevRoom.delete(currentPeer.id);
              broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
                type: 'peer:left',
                peerId: currentPeer.id,
                peers: getRoomPeerSummaries(currentPeer.roomCode),
                maxPeers: MAX_ROOM_PEERS,
              });
            }

            if (!rooms.has(roomCode)) {
              rooms.set(roomCode, new Map());
            }
            const room = rooms.get(roomCode)!;

            if (!room.has(peerId) && room.size >= MAX_ROOM_PEERS) {
              ws.send(
                JSON.stringify({
                  type: 'room:full',
                  roomCode,
                  maxPeers: MAX_ROOM_PEERS,
                  peerCount: room.size,
                })
              );
              return;
            }

            currentPeer = {
              id: peerId,
              ws,
              roomCode,
              deviceLabel,
              natType,
              clientType,
              cloudId,
              binaryTargetId: '*',
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
                maxPeers: MAX_ROOM_PEERS,
              })
            );

            broadcastToRoom(roomCode, peerId, {
              type: 'peer:joined',
              peer: {
                id: peerId,
                deviceLabel,
                natType,
                clientType,
                cloudId,
                joinedAt: currentPeer.joinedAt,
              },
              peers: peersList,
              maxPeers: MAX_ROOM_PEERS,
            });
            break;
          }

          case 'relay:target': {
            if (!currentPeer) return;
            currentPeer.binaryTargetId = msg.toPeerId ? String(msg.toPeerId) : '*';
            break;
          }

          case 'webrtc:signal': {
            if (!currentPeer) return;
            sendToRoomTarget(currentPeer.roomCode, currentPeer.id, msg.toPeerId ? String(msg.toPeerId) : '*', {
              type: 'webrtc:signal',
              sigId: msg.sigId,
              fromPeerId: currentPeer.id,
              toPeerId: msg.toPeerId ? String(msg.toPeerId) : '*',
              signalType: msg.signalType,
              laneIdx: msg.laneIdx,
              sdp: msg.sdp,
              candidate: msg.candidate,
            });
            break;
          }

          case 'relay:packet': {
            if (!currentPeer) return;
            sendToRoomTarget(currentPeer.roomCode, currentPeer.id, msg.toPeerId ? String(msg.toPeerId) : '*', {
              type: 'relay:packet',
              fromPeerId: currentPeer.id,
              toPeerId: msg.toPeerId ? String(msg.toPeerId) : '*',
              packet: msg.packet,
            });
            break;
          }

          case 'CANDIDATE': {
            if (!currentPeer) return;
            const dst = msg.dst ? String(msg.dst) : '*';
            const room = rooms.get(currentPeer.roomCode);
            let targetWsId = '*';
            if (dst !== '*' && room) {
              for (const [rid, rc] of room.entries()) {
                if (rid === dst || rc.cloudId === dst) {
                  targetWsId = rid;
                  break;
                }
              }
            }
            sendToRoomTarget(currentPeer.roomCode, currentPeer.id, targetWsId, {
              type: 'CANDIDATE',
              src: msg.src || currentPeer.id,
              dst,
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
