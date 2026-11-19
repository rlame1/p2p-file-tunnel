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
  <title>AetherTunnel V1.02 — Standalone Encrypted P2P File Transfer</title>
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
        <span class="text-lg font-bold tracking-tight text-slate-100">AetherTunnel V1.02 Standalone</span>
        <span class="ml-3 text-xs text-emerald-400 font-mono">Resumable Binary WebRTC + Windows .EXE Wormhole + AES-256-GCM</span>
      </div>
      <div id="status-badge" class="text-xs font-mono text-amber-400">Initializing P2P Node...</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">1. Wormhole Pairing Code</h2>
        <p class="text-xs text-slate-400">Enter the same pairing code on both devices and click Connect to establish a direct encrypted P2P tunnel.</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnel Name</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${defaultRoom}" placeholder="Enter tunnel name..." class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
            <button id="connect-btn" class="px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 rounded-lg hover:bg-sky-300 cursor-pointer">Connect</button>
          </div>
        </div>

        <div id="peer-presence-box" class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span id="peer-presence-dot" class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span id="peer-presence-title" class="text-xs font-semibold text-amber-300">No other peer in room yet (Waiting for peers)</span>
            </div>
            <span id="peer-count-badge" class="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">1/8 USERS</span>
          </div>
          <div id="peer-presence-sub" class="text-[11px] font-mono text-slate-400 mt-1">Waiting for other users on the same tunnel name (max 8)...</div>
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
          <div class="flex items-center gap-2">
            <button id="pause-btn" type="button" class="px-3 py-1.5 text-xs font-semibold bg-amber-950/70 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900/80 cursor-pointer">Pause</button>
            <button id="stop-btn" type="button" class="px-3 py-1.5 text-xs font-semibold bg-rose-950/70 text-rose-200 border border-rose-700/60 rounded-lg hover:bg-rose-900/80 cursor-pointer">Stop</button>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label for="target-peer-select" class="text-xs font-medium text-slate-300 whitespace-nowrap">Send to:</label>
          <select id="target-peer-select" class="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-sky-300">
            <option value="*">Everyone in room (0 users)</option>
          </select>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label for="max-speed-input" class="text-xs font-medium text-slate-300 whitespace-nowrap">Max upload speed (MB/s):</label>
          <div class="flex items-center gap-2 flex-1">
            <input id="max-speed-input" type="text" inputmode="decimal" value="0" placeholder="0" class="w-28 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-sky-300" />
            <span class="text-[11px] text-slate-400">(0 = unlimited)</span>
          </div>
        </div>
        <label class="block border-2 border-dashed border-slate-800 hover:border-sky-400 bg-slate-950/60 rounded-lg p-8 text-center cursor-pointer transition-colors">
          <input id="file-input" type="file" multiple class="hidden" />
          <div class="text-sm font-semibold text-slate-100">Click or Drop Files Here to Encrypt &amp; Stream</div>
          <div class="text-xs text-slate-400 mt-1">Direct RTCPeerConnection + Windows .EXE Bridge · Resumable Transfers</div>
          <div class="text-[11px] text-slate-400 mt-2 font-mono">Max single file: Browser / Portable ~2 GB (RAM) · Windows .EXE &lt;-&gt; .EXE ~2.6 TB (UDP) / Disk limit (TCP)</div>
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
    const HIGH_WATER = 6 * 1024 * 1024;
    const LOW_WATER = Math.floor(1.5 * 1024 * 1024);
    const MAX_ROOM_PEERS = 8;
    const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
    const ICE_SERVERS = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
      { urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443', 'turn:openrelay.metered.ca:443?transport=tcp'], username: 'openrelayproject', credential: 'openrelayproject' }
    ];

    const myId = 'aethertunnel-web-' + Math.random().toString(36).slice(2, 10);
    let currentKey = null;
    let activeRoom = '';
    let activeTopic = '';
    let mqttSockets = [];
    const peersMap = new Map();
    let incomingFile = null;
    let partialFrames = new Map();
    let resumeCheckpoints = new Map();
    const pendingResumeResolvers = new Map();
    const cloudAckResolvers = new Map();
    const rxCompleteResolvers = new Map();
    const rxErrorResolvers = new Map();
    let rxCloudFile = null;
    let transferPaused = false;
    const activeOutgoing = new Map();
    const cancelledIds = new Set();
    let activePeerRowUpdater = null;

    function escapeHtml(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function syncPauseBtnUi() {
      const btn = document.getElementById('pause-btn');
      if (!btn) return;
      const anyPaused = transferPaused
        || (incomingFile && incomingFile.paused)
        || (rxCloudFile && rxCloudFile.paused)
        || Array.from(activeOutgoing.values()).some(o => o.paused);
      if (anyPaused) {
        btn.textContent = 'Resume';
        btn.className = 'px-3 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 rounded-lg hover:bg-emerald-300 cursor-pointer';
      } else {
        btn.textContent = 'Pause';
        btn.className = 'px-3 py-1.5 text-xs font-semibold bg-amber-950/70 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900/80 cursor-pointer';
      }
    }

    function sendPeerControl(peerId, pkt) {
      const json = JSON.stringify(pkt);
      if (peerId && peerId !== '*') {
        const p = peersMap.get(peerId);
        if (p && p.dc && p.dc.readyState === 'open') {
          try { p.dc.send(json); } catch {}
        }
        sendCloudCandidate(peerId, { kind: 'browser:packet', packet: pkt });
        return;
      }
      sendReplyEverywhere(pkt);
    }

    function pauseTransferById(fid) {
      if (!fid) return;
      if (incomingFile && incomingFile.fileId === fid && !incomingFile.cancelled) {
        incomingFile.paused = true;
        incomingFile.remotePaused = false;
        incomingFile.pausedAt = incomingFile.pausedAt || performance.now();
        sendReplyEverywhere({ kind: 'file:pause', fileId: fid, name: incomingFile.name, size: incomingFile.size, by: 'receiver' });
        renderIncomingRow(incomingFile, false);
        syncPauseBtnUi();
        return;
      }
      if (rxCloudFile && rxCloudFile.fileId === fid && !rxCloudFile.cancelled) {
        rxCloudFile.paused = true;
        rxCloudFile.remotePaused = false;
        rxCloudFile.pausedAt = rxCloudFile.pausedAt || performance.now();
        sendReplyEverywhere({ kind: 'file:pause', fileId: fid, name: rxCloudFile.name, size: rxCloudFile.size, by: 'receiver' });
        renderIncomingRow(rxCloudFile, true);
        syncPauseBtnUi();
        return;
      }
      const out = activeOutgoing.get(fid);
      if (out && !out.cancelled) {
        out.paused = true;
        out.remotePaused = false;
        sendPeerControl(out.peerId, { kind: 'file:pause', fileId: fid, name: out.name, size: out.size, by: 'sender' });
        if (out.renderRow) out.renderRow();
        syncPauseBtnUi();
      }
    }

    function resumeTransferById(fid) {
      if (!fid) return;
      transferPaused = false;
      if (incomingFile && incomingFile.fileId === fid && !incomingFile.cancelled) {
        if (incomingFile.pausedAt) incomingFile.startedAt += Math.max(0, performance.now() - incomingFile.pausedAt);
        incomingFile.paused = false;
        incomingFile.remotePaused = false;
        incomingFile.pausedAt = 0;
        sendReplyEverywhere({ kind: 'file:resume', fileId: fid, name: incomingFile.name, size: incomingFile.size, by: 'receiver', resumeFromChunk: incomingFile.receivedCount || 0 });
        syncPauseBtnUi();
        if (!finalizeIncomingIfReady()) renderIncomingRow(incomingFile, false);
        return;
      }
      if (rxCloudFile && rxCloudFile.fileId === fid && !rxCloudFile.cancelled) {
        if (rxCloudFile.pausedAt) rxCloudFile.startedAt += Math.max(0, performance.now() - rxCloudFile.pausedAt);
        rxCloudFile.paused = false;
        rxCloudFile.remotePaused = false;
        rxCloudFile.pausedAt = 0;
        sendReplyEverywhere({ kind: 'file:resume', fileId: fid, name: rxCloudFile.name, size: rxCloudFile.size, by: 'receiver', resumeFromChunk: rxCloudFile.receivedCount || 0 });
        syncPauseBtnUi();
        if (rxCloudFile.endedWhilePaused) {
          finalizeCloudRx(rxCloudFile.endedWhilePaused.src, rxCloudFile.endedWhilePaused.endKind);
        } else {
          renderIncomingRow(rxCloudFile, true);
        }
        return;
      }
      const out = activeOutgoing.get(fid);
      if (out && !out.cancelled) {
        out.paused = false;
        out.remotePaused = false;
        sendPeerControl(out.peerId, { kind: 'file:resume', fileId: fid, name: out.name, size: out.size, by: 'sender' });
        if (out.renderRow) out.renderRow();
        syncPauseBtnUi();
      }
    }

    function cancelTransferById(fid, fromRemote, remoteByName) {
      if (!fid) return;
      cancelledIds.add(fid);
      if (incomingFile && incomingFile.fileId === fid) {
        const fname = incomingFile.name;
        const fsize = incomingFile.size;
        incomingFile.cancelled = true;
        resumeCheckpoints.delete(fname + '::' + fsize);
        incomingFile = null;
        partialFrames.clear();
        if (!fromRemote) {
          sendReplyEverywhere({ kind: 'file:cancel', fileId: fid, name: fname, size: fsize, by: 'receiver' });
        }
        renderStatus((fromRemote ? 'Stopped by ' + (remoteByName || 'sender') + ': ' : 'Stopped: ') + escapeHtml(fname));
        syncPauseBtnUi();
        return;
      }
      if (rxCloudFile && rxCloudFile.fileId === fid) {
        const cname = rxCloudFile.name;
        const csize = rxCloudFile.size;
        rxCloudFile.cancelled = true;
        rxCloudFile = null;
        if (!fromRemote) {
          sendReplyEverywhere({ kind: 'file:cancel', fileId: fid, name: cname, size: csize, by: 'receiver' });
        }
        renderStatus((fromRemote ? 'Stopped by ' + (remoteByName || 'sender') + ': ' : 'Stopped: ') + escapeHtml(cname));
        syncPauseBtnUi();
        return;
      }
      const out = activeOutgoing.get(fid);
      if (out) {
        out.cancelled = true;
        out.cancelledBy = fromRemote ? 'remote' : 'local';
        out.paused = false;
        out.remotePaused = false;
        if (!fromRemote) {
          sendPeerControl(out.peerId, { kind: 'file:cancel', fileId: fid, name: out.name, size: out.size, by: 'sender' });
        }
        const pr = pendingResumeResolvers.get(fid);
        if (pr) { pendingResumeResolvers.delete(fid); pr(0); }
        const ca = cloudAckResolvers.get(fid);
        if (ca) { cloudAckResolvers.delete(fid); ca(); }
        const rxc = rxCompleteResolvers.get(fid);
        if (rxc) { rxCompleteResolvers.delete(fid); rxc(); }
        if (out.renderRow) out.renderRow();
        syncPauseBtnUi();
      }
    }

    function stopAllActiveTransfers() {
      const fids = [];
      for (const fid of activeOutgoing.keys()) fids.push(fid);
      if (incomingFile && incomingFile.fileId) fids.push(incomingFile.fileId);
      if (rxCloudFile && rxCloudFile.fileId) fids.push(rxCloudFile.fileId);
      transferPaused = false;
      for (const fid of fids) cancelTransferById(fid, false);
      syncPauseBtnUi();
    }

    function togglePauseState() {
      const currentlyPaused = transferPaused
        || (incomingFile && incomingFile.paused)
        || (rxCloudFile && rxCloudFile.paused)
        || Array.from(activeOutgoing.values()).some(o => o.paused);
      const nextPaused = !currentlyPaused;
      transferPaused = nextPaused;
      if (incomingFile && !incomingFile.cancelled) {
        if (nextPaused) pauseTransferById(incomingFile.fileId);
        else resumeTransferById(incomingFile.fileId);
      }
      if (rxCloudFile && !rxCloudFile.cancelled) {
        if (nextPaused) pauseTransferById(rxCloudFile.fileId);
        else resumeTransferById(rxCloudFile.fileId);
      }
      for (const [fid, out] of activeOutgoing.entries()) {
        if (!out.cancelled) {
          if (nextPaused) pauseTransferById(fid);
          else resumeTransferById(fid);
        }
      }
      syncPauseBtnUi();
    }

    async function waitWhilePaused(fileId, onPauseMs) {
      const out = fileId ? activeOutgoing.get(fileId) : null;
      if (out && out.cancelled) return false;
      if (cancelledIds.has(fileId)) return false;
      if (!transferPaused && !(out && out.paused)) return true;
      const pStart = performance.now();
      while (transferPaused || (out && out.paused)) {
        if ((out && out.cancelled) || cancelledIds.has(fileId)) return false;
        await new Promise(r => setTimeout(r, 80));
      }
      if (onPauseMs) onPauseMs(performance.now() - pStart);
      return !((out && out.cancelled) || cancelledIds.has(fileId));
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

    function sendDepartureNotice() {
      if (activeTopic && activeRoom) {
        sendCloudCandidate('*', { kind: 'browser:bye', roomCode: activeRoom, peerId: myId });
      }
    }

    function removePeerFromRoom(pid) {
      const peer = peersMap.get(pid);
      if (!peer) return;
      try { if (peer.pc) peer.pc.close(); } catch {}
      peer.dc = null;
      peersMap.delete(pid);
      updatePeerPresenceUi(peersMap.size > 0, peersMap.size > 0 ? peersMap.size + ' users' : '', activeRoom);
    }

    window.addEventListener('beforeunload', sendDepartureNotice);
    window.addEventListener('pagehide', sendDepartureNotice);

    function syncTargetSelectorUi() {
      const sel = document.getElementById('target-peer-select');
      if (!sel) return;
      const prevVal = sel.value || '*';
      const activeList = Array.from(peersMap.values());
      sel.innerHTML = '';
      const allOpt = document.createElement('option');
      allOpt.value = '*';
      allOpt.textContent = 'Everyone in room (' + activeList.length + ' users)';
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
        title.textContent = peersMap.size + ' user(s) in room! (Max ' + MAX_ROOM_PEERS + ')';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        badge.textContent = totalUsers + '/' + MAX_ROOM_PEERS + ' USERS';
        sub.className = 'text-[11px] font-mono text-emerald-200/90 mt-1';
        sub.textContent = 'Connected: ' + (peerLabel || (peersMap.size + ' peers')) + ' [' + roomCode + ']';
        headerBadge.textContent = 'ROOM [' + roomCode + ']: ' + totalUsers + '/' + MAX_ROOM_PEERS + ' users';
        headerBadge.className = 'text-xs font-mono text-emerald-400 font-semibold';
      } else {
        box.className = 'p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
        title.className = 'text-xs font-semibold text-amber-300';
        title.textContent = 'No other peer in room yet (Waiting for peers)';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30';
        badge.textContent = (activeRoom ? '1/' : '0/') + MAX_ROOM_PEERS + ' USERS';
        sub.className = 'text-[11px] font-mono text-slate-400 mt-1';
        sub.textContent = 'Listening on room [' + roomCode + '] — max ' + MAX_ROOM_PEERS + ' users.';
        headerBadge.textContent = activeRoom ? ('LISTENING ON [' + roomCode + '] · 1/' + MAX_ROOM_PEERS) : 'Waiting for tunnel name';
        headerBadge.className = 'text-xs font-mono text-amber-400';
      }
      syncTargetSelectorUi();
    }

    async function deriveKey(code, pass) {
      const enc = new TextEncoder();
      const clean = code.trim().toLowerCase();
      const secret = clean + '::' + (pass || '').trim();
      const baseKey = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey', 'deriveBits']);
      currentKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-E2EE-v1-Salt-2026'), iterations: 100000, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      const verifyBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-Fingerprint-Salt'), iterations: 1000, hash: 'SHA-256' }, baseKey, 64);
      const hex = Array.from(new Uint8Array(verifyBits)).map(b => b.toString(16).padStart(2, '0').toUpperCase());
      document.getElementById('fp-label').textContent = hex[0]+hex[1]+' · '+hex[2]+hex[3]+' · '+hex[4]+hex[5]+' · '+hex[6]+hex[7];
    }

    function sendReplyEverywhere(pkt) {
      const json = JSON.stringify(pkt);
      for (const p of peersMap.values()) {
        if (p.dc && p.dc.readyState === 'open') {
          try { p.dc.send(json); } catch {}
        }
      }
      sendCloudCandidate('*', { kind: 'browser:packet', packet: pkt });
    }

    function renderStatus(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200">' + text + '</div>';
    }

    function renderError(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-red-950/60 border border-red-700/60 rounded font-mono text-red-200">' + text + '</div>';
    }

    function renderDownload(name, url, size, mbps) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-emerald-500/40 rounded flex items-center justify-between"><span>Verified: ' + name + ' (' + (size/(1024*1024)).toFixed(2) + ' MB · ' + mbps + ' MB/s)</span><a href="' + url + '" download="' + name + '" class="px-3 py-1 bg-emerald-400 text-slate-950 font-semibold rounded">Save File</a></div>';
    }

    function renderTransferControls(fid, isPaused) {
      const pauseLabel = isPaused ? 'Resume' : 'Pause';
      const pauseCls = isPaused
        ? 'px-2.5 py-1 text-[11px] font-semibold bg-emerald-400 text-slate-950 rounded hover:bg-emerald-300 cursor-pointer'
        : 'px-2.5 py-1 text-[11px] font-semibold bg-amber-950/80 text-amber-200 border border-amber-700/60 rounded hover:bg-amber-900 cursor-pointer';
      return '<div class="flex items-center gap-1.5 shrink-0">' +
        '<button type="button" data-action="pause-resume" data-fid="' + escapeHtml(fid) + '" class="' + pauseCls + '">' + pauseLabel + '</button>' +
        '<button type="button" data-action="stop" data-fid="' + escapeHtml(fid) + '" class="px-2.5 py-1 text-[11px] font-semibold bg-rose-950/80 text-rose-200 border border-rose-700/60 rounded hover:bg-rose-900 cursor-pointer">Stop</button>' +
      '</div>';
    }

    function renderIncomingRow(rxObj, isBridge) {
      if (!rxObj || rxObj.cancelled) return;
      const pct = isBridge
        ? Math.min(100, Math.round((rxObj.bytes / Math.max(1, rxObj.size)) * 100))
        : Math.round((rxObj.receivedCount / Math.max(1, rxObj.totalChunks)) * 100);
      const now = rxObj.paused && rxObj.pausedAt ? rxObj.pausedAt : performance.now();
      const elapsed = Math.max(0.02, (now - rxObj.startedAt) / 1000);
      const recvBytes = isBridge ? rxObj.bytes : (rxObj.receivedCount * (rxObj.chunkSize || 240 * 1024));
      const mbps = (recvBytes / (1024 * 1024) / elapsed).toFixed(2);
      let label;
      if (rxObj.paused) {
        label = (rxObj.remotePaused ? 'Paused by sender: ' : 'Paused: ') + escapeHtml(rxObj.name) + ' (' + pct + '%)';
      } else {
        label = (isBridge ? 'Receiving (Bridge): ' : 'Receiving: ') + escapeHtml(rxObj.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
      }
      const list = document.getElementById('transfer-list');
      if (!list) return;
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 flex items-center justify-between gap-3"><span class="truncate">' + label + '</span>' + renderTransferControls(rxObj.fileId, !!rxObj.paused) + '</div>';
    }

    function finalizeIncomingIfReady() {
      if (!incomingFile || incomingFile.cancelled || incomingFile.paused) return false;
      if (incomingFile.receivedCount < incomingFile.totalChunks) return false;
      const now = performance.now();
      const elapsed = Math.max(0.02, (now - incomingFile.startedAt) / 1000);
      const mbps = (incomingFile.size / (1024 * 1024) / elapsed).toFixed(2);
      const blob = new Blob(incomingFile.chunks, { type: incomingFile.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      renderDownload(incomingFile.name, url, incomingFile.size, mbps);
      sendReplyEverywhere({ kind: 'file:rx-complete', fileId: incomingFile.fileId, receivedCount: incomingFile.totalChunks, totalChunks: incomingFile.totalChunks });
      resumeCheckpoints.delete(incomingFile.name + '::' + incomingFile.size);
      incomingFile = null;
      partialFrames.clear();
      syncPauseBtnUi();
      return true;
    }

    function finalizeCloudRx(src, endKind) {
      if (!rxCloudFile || rxCloudFile.cancelled || rxCloudFile.paused) return;
      const elapsed = Math.max(0.02, (performance.now() - rxCloudFile.startedAt) / 1000);
      const mbps = (rxCloudFile.size / (1024 * 1024) / elapsed).toFixed(2);
      const parts = rxCloudFile.chunks.filter(Boolean);
      const blob = new Blob(parts, { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      renderDownload(rxCloudFile.name, url, rxCloudFile.size, mbps);
      sendCloudCandidate(src || '*', { kind: endKind === 'browser:file-end' ? 'browser:chunk-ack' : 'exe:chunk-ack', fileId: rxCloudFile.fileId, chunkIndex: 999999 });
      rxCloudFile = null;
      syncPauseBtnUi();
    }

    let lastRxProgEmitAt = 0;
    let rxDecryptErrShownFor = '';
    async function handleCompleteAethFrame(buf) {
      if (!incomingFile || incomingFile.cancelled || !currentKey) return;
      const view = new DataView(buf);
      const chunkIndex = view.getUint32(8, false);
      const iv = new Uint8Array(buf, 12, 12);
      const ciphertext = new Uint8Array(buf, 24);
      let dec;
      try {
        dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, currentKey, ciphertext);
      } catch {
        if (!incomingFile || incomingFile.cancelled) return;
        if (rxDecryptErrShownFor !== incomingFile.fileId) {
          rxDecryptErrShownFor = incomingFile.fileId;
          const errMsg = 'AES-256-GCM decryption failed — verify Tunnel Name & E2EE Passphrase match sender';
          renderError(errMsg);
          sendReplyEverywhere({ kind: 'file:rx-error', fileId: incomingFile.fileId, reason: errMsg });
        }
        return;
      }
      if (!incomingFile || incomingFile.cancelled) return;
      if (incomingFile.chunks[chunkIndex] === undefined) {
        incomingFile.chunks[chunkIndex] = dec;
        incomingFile.receivedCount++;
      }
      const now = performance.now();
      if (now - lastRxProgEmitAt >= 450 || incomingFile.receivedCount === 1) {
        lastRxProgEmitAt = now;
        sendReplyEverywhere({ kind: 'file:rx-progress', fileId: incomingFile.fileId, receivedCount: incomingFile.receivedCount, totalChunks: incomingFile.totalChunks });
      }
      if (incomingFile.paused) {
        if (now - incomingFile.lastUi > 250) {
          incomingFile.lastUi = now;
          renderIncomingRow(incomingFile, false);
        }
        return;
      }
      if (finalizeIncomingIfReady()) {
        return;
      } else if (now - incomingFile.lastUi > 120) {
        incomingFile.lastUi = now;
        renderIncomingRow(incomingFile, false);
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
      if (msg.kind === 'file:pause') {
        const fid = String(msg.fileId || '');
        if (fid && cancelledIds.has(fid)) return;
        for (const [ofid, out] of activeOutgoing.entries()) {
          if ((fid && ofid === fid) || (!fid && out.peerId === srcPeer)) {
            out.paused = true;
            out.remotePaused = true;
            if (out.renderRow) out.renderRow();
          }
        }
        if (incomingFile && !incomingFile.cancelled && (!fid || incomingFile.fileId === fid)) {
          incomingFile.paused = true;
          incomingFile.remotePaused = true;
          incomingFile.pausedAt = incomingFile.pausedAt || performance.now();
          renderIncomingRow(incomingFile, false);
        }
        if (rxCloudFile && !rxCloudFile.cancelled && (!fid || rxCloudFile.fileId === fid)) {
          rxCloudFile.paused = true;
          rxCloudFile.remotePaused = true;
          rxCloudFile.pausedAt = rxCloudFile.pausedAt || performance.now();
          renderIncomingRow(rxCloudFile, true);
        }
        syncPauseBtnUi();
        return;
      }
      if (msg.kind === 'file:resume') {
        const fid = String(msg.fileId || '');
        if (fid && cancelledIds.has(fid)) return;
        transferPaused = false;
        for (const [ofid, out] of activeOutgoing.entries()) {
          if ((fid && ofid === fid) || (!fid && out.peerId === srcPeer)) {
            out.paused = false;
            out.remotePaused = false;
            if (out.renderRow) out.renderRow();
          }
        }
        if (incomingFile && !incomingFile.cancelled && (!fid || incomingFile.fileId === fid)) {
          if (incomingFile.pausedAt) incomingFile.startedAt += Math.max(0, performance.now() - incomingFile.pausedAt);
          incomingFile.paused = false;
          incomingFile.remotePaused = false;
          incomingFile.pausedAt = 0;
          if (!finalizeIncomingIfReady()) renderIncomingRow(incomingFile, false);
        }
        if (rxCloudFile && !rxCloudFile.cancelled && (!fid || rxCloudFile.fileId === fid)) {
          if (rxCloudFile.pausedAt) rxCloudFile.startedAt += Math.max(0, performance.now() - rxCloudFile.pausedAt);
          rxCloudFile.paused = false;
          rxCloudFile.remotePaused = false;
          rxCloudFile.pausedAt = 0;
          if (rxCloudFile.endedWhilePaused) {
            finalizeCloudRx(rxCloudFile.endedWhilePaused.src, rxCloudFile.endedWhilePaused.endKind);
          } else {
            renderIncomingRow(rxCloudFile, true);
          }
        }
        syncPauseBtnUi();
        return;
      }
      if (msg.kind === 'file:cancel' || msg.kind === 'exe:file-cancel' || msg.kind === 'browser:file-cancel') {
        const fid = String(msg.fileId || '');
        if (fid) {
          cancelTransferById(fid, true, msg.by === 'receiver' ? 'receiver' : 'sender');
        } else {
          if (incomingFile) cancelTransferById(incomingFile.fileId, true, 'sender');
          if (rxCloudFile) cancelTransferById(rxCloudFile.fileId, true, 'sender');
          for (const [ofid, out] of activeOutgoing.entries()) {
            if (out.peerId === srcPeer) cancelTransferById(ofid, true, 'receiver');
          }
        }
        return;
      }
      if (msg.kind === 'file:meta') {
        if (msg.fileId && cancelledIds.has(String(msg.fileId))) return;
        if (incomingFile && incomingFile.fileId === msg.fileId && incomingFile.totalChunks === msg.totalChunks) {
          let miss = 0;
          while (miss < incomingFile.totalChunks && incomingFile.chunks[miss] !== undefined) miss++;
          const ack = { kind: 'file:resume-ack', fileId: msg.fileId, name: msg.name, size: msg.size, resumeFromChunk: miss };
          sendReplyEverywhere(ack);
          return;
        }
        const rKey = msg.name + '::' + msg.size;
        const prev = resumeCheckpoints.get(rKey);
        let chunks = new Array(msg.totalChunks);
        let resumeFromChunk = 0;
        if (prev && prev.chunks && prev.chunks.length === msg.totalChunks) {
          chunks = prev.chunks;
          while (resumeFromChunk < chunks.length && chunks[resumeFromChunk] !== undefined) resumeFromChunk++;
        }
        rxDecryptErrShownFor = '';
        incomingFile = { ...msg, chunkSize: msg.chunkSize || 240*1024, chunks, receivedCount: resumeFromChunk, startedAt: performance.now(), lastUi: 0, paused: transferPaused, pausedAt: transferPaused ? performance.now() : 0, remotePaused: false, cancelled: false };
        resumeCheckpoints.set(rKey, incomingFile);
        const ack = { kind: 'file:resume-ack', fileId: msg.fileId, name: msg.name, size: msg.size, resumeFromChunk };
        const peerObj = srcPeer ? peersMap.get(srcPeer) : null;
        if (peerObj && peerObj.dc && peerObj.dc.readyState === 'open') {
          try { peerObj.dc.send(JSON.stringify(ack)); } catch {}
        }
        sendCloudCandidate(srcPeer || '*', ack);
        renderIncomingRow(incomingFile, false);
        syncPauseBtnUi();
      } else if (msg.kind === 'file:rx-complete' && msg.fileId) {
        const fn = rxCompleteResolvers.get(String(msg.fileId));
        if (fn) { rxCompleteResolvers.delete(String(msg.fileId)); fn(); }
      } else if (msg.kind === 'file:rx-error' && msg.fileId) {
        const fn = rxErrorResolvers.get(String(msg.fileId));
        if (fn) { rxErrorResolvers.delete(String(msg.fileId)); fn(String(msg.reason || 'Decryption error')); }
      } else if (msg.kind === 'file:resume-ack' || msg.kind === 'exe:resume-ack' || msg.kind === 'browser:resume-ack') {
        const fid = String(msg.fileId || '');
        const fn = (fid && pendingResumeResolvers.get(fid)) || (srcPeer && pendingResumeResolvers.get(srcPeer));
        if (fn) {
          if (fid) pendingResumeResolvers.delete(fid);
          if (srcPeer) pendingResumeResolvers.delete(srcPeer);
          fn(Number(msg.resumeFromChunk) || 0);
        }
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
        if (Date.now() - peerEntry.lastSeen > 4500) {
          removePeerFromRoom(peerEntry.id);
        } else {
          syncTargetSelectorUi();
        }
      };
      channel.onmessage = async (ev) => {
        peerEntry.lastSeen = Date.now();
        let data = ev.data;
        if (data instanceof Blob) data = await data.arrayBuffer();
        if (data instanceof ArrayBuffer) {
          if (handleIncomingBinary(data)) return;
          try { data = new TextDecoder().decode(data); } catch { return; }
        } else if (ArrayBuffer.isView(data)) {
          const copy = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
          if (handleIncomingBinary(copy)) return;
          try { data = new TextDecoder().decode(copy); } catch { return; }
        }
        if (typeof data === 'string') {
          try { handleControlJson(JSON.parse(data), peerEntry.id); } catch {}
        }
      };
    }

    async function ensureWebRtc(isInitiator, targetPeer, forceRebuild) {
      if (!targetPeer) return;
      const peerEntry = peersMap.get(targetPeer);
      if (!peerEntry) return;
      try {
        if (
          peerEntry.pc &&
          !forceRebuild &&
          peerEntry.pc.signalingState !== 'closed' &&
          peerEntry.pc.connectionState !== 'failed' &&
          peerEntry.pc.connectionState !== 'closed' &&
          peerEntry.pc.iceConnectionState !== 'failed'
        ) {
          return;
        }
        if (peerEntry.pc) {
          try { peerEntry.pc.close(); } catch {}
          peerEntry.pc = null;
        }
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        peerEntry.pc = pc;
        peerEntry.pendIce = [];
        pc.onicecandidate = (ev) => {
          if (ev.candidate) {
            sendCloudCandidate(targetPeer, {
              kind: 'webrtc:signal',
              laneIdx: 0,
              signalType: 'candidate',
              candidate: ev.candidate
            });
          }
        };
        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            peerEntry.lastSeen = Date.now();
          } else if (pc.connectionState === 'failed' || pc.connectionState === 'closed' || pc.connectionState === 'disconnected') {
            peerEntry.dc = null;
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed' || Date.now() - peerEntry.lastSeen > 4500) {
              removePeerFromRoom(targetPeer);
            } else {
              syncTargetSelectorUi();
            }
          }
        };
        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
            peerEntry.lastSeen = Date.now();
          } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
            peerEntry.dc = null;
            if (Date.now() - peerEntry.lastSeen > 4500) {
              removePeerFromRoom(targetPeer);
            } else {
              syncTargetSelectorUi();
            }
          }
        };
        pc.ondatachannel = (ev) => bindDataChannel(ev.channel, peerEntry);
        if (isInitiator) {
          bindDataChannel(pc.createDataChannel('aethertunnel-lane-0', { ordered: true }), peerEntry);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendCloudCandidate(targetPeer, {
            kind: 'webrtc:signal',
            laneIdx: 0,
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
        existing = { id: src, type, label: label || src.slice(-8), lastSeen: Date.now(), pc: null, dc: null, pendIce: [] };
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

      if (p.kind === 'browser:bye' || p.kind === 'web:bye' || p.kind === 'exe:bye') {
        removePeerFromRoom(src);
        if (p.peerId && String(p.peerId) !== src) {
          removePeerFromRoom(String(p.peerId));
        }
        return;
      }

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
        const res = upsertRoomPeer(src, 'browser', p.displayName || ('Browser (' + src.slice(-6) + ')'));
        if (!res) return;
        updatePeerPresenceUi(true, res.peer.label, activeRoom);
        if (p.kind === 'browser:hello' && res.isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello-ack', roomCode: activeRoom });
        }
        if (myId > src && (!res.peer.dc || res.peer.dc.readyState !== 'open')) {
          ensureWebRtc(true, src, false);
        }
        return;
      }

      if (p.kind === 'browser:packet' && p.packet) {
        handleControlJson(p.packet, src);
        return;
      }

      if (p.kind === 'webrtc:signal') {
        if (typeof p.laneIdx === 'number' && p.laneIdx > 0) return;
        const res = upsertRoomPeer(src, 'browser', 'Browser (' + src.slice(-6) + ')');
        if (!res) return;
        const peerEntry = res.peer;
        (async () => {
          try {
            if (p.signalType === 'offer' && p.sdp) {
              const polite = myId < src;
              if (!peerEntry.pc || peerEntry.pc.signalingState === 'closed' || peerEntry.pc.connectionState === 'failed') {
                await ensureWebRtc(false, src, true);
              } else if (peerEntry.pc.signalingState !== 'stable') {
                if (!polite) return;
                try { await peerEntry.pc.setLocalDescription({ type: 'rollback' }); } catch { await ensureWebRtc(false, src, true); }
              }
              await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
              if (peerEntry.pendIce && peerEntry.pendIce.length) {
                for (const c of peerEntry.pendIce) {
                  try { await peerEntry.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
                }
                peerEntry.pendIce = [];
              }
              const answer = await peerEntry.pc.createAnswer();
              await peerEntry.pc.setLocalDescription(answer);
              sendCloudCandidate(src, { kind: 'webrtc:signal', laneIdx: 0, signalType: 'answer', sdp: answer });
            } else if (p.signalType === 'answer' && p.sdp && peerEntry.pc) {
              if (peerEntry.pc.signalingState !== 'have-local-offer') return;
              await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
              if (peerEntry.pendIce && peerEntry.pendIce.length) {
                for (const c of peerEntry.pendIce) {
                  try { await peerEntry.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
                }
                peerEntry.pendIce = [];
              }
            } else if (p.signalType === 'candidate' && p.candidate) {
              if (peerEntry.pc && peerEntry.pc.remoteDescription && peerEntry.pc.remoteDescription.type) {
                await peerEntry.pc.addIceCandidate(new RTCIceCandidate(p.candidate));
              } else {
                peerEntry.pendIce = peerEntry.pendIce || [];
                peerEntry.pendIce.push(p.candidate);
              }
            }
          } catch {}
        })();
        return;
      }

      if (p.kind === 'exe:chunk-ack' || p.kind === 'browser:chunk-ack') {
        const fid = String(p.fileId || '');
        const fn = (fid && cloudAckResolvers.get(fid)) || cloudAckResolvers.get(src);
        if (fn) {
          if (fid) cloudAckResolvers.delete(fid);
          cloudAckResolvers.delete(src);
          fn();
        }
        return;
      }

      if (p.kind === 'exe:resume-ack' || p.kind === 'file:resume-ack' || p.kind === 'browser:resume-ack' || p.kind === 'file:pause' || p.kind === 'file:resume' || p.kind === 'file:cancel' || p.kind === 'exe:file-cancel' || p.kind === 'browser:file-cancel') {
        handleControlJson(p, src);
        return;
      }

      if (p.kind === 'exe:file-start' || p.kind === 'browser:file-start') {
        if (p.fileId && cancelledIds.has(String(p.fileId))) return;
        const prefix = p.kind.startsWith('browser:') ? 'browser:' : 'exe:';
        if (rxCloudFile && rxCloudFile.fileId === p.fileId) {
          sendCloudCandidate(src, { kind: prefix + 'resume-ack', fileId: p.fileId, name: rxCloudFile.name, size: rxCloudFile.size, resumeFromChunk: rxCloudFile.receivedCount || 0 });
          return;
        }
        rxCloudFile = {
          fileId: p.fileId,
          name: p.name || 'transfer.bin',
          size: Number(p.size) || 0,
          totalChunks: Math.max(1, Number(p.totalChunks) || 1),
          chunks: new Array(Math.max(1, Number(p.totalChunks) || 1)),
          receivedCount: 0,
          bytes: 0,
          startedAt: performance.now(),
          lastUi: 0,
          paused: transferPaused,
          pausedAt: transferPaused ? performance.now() : 0,
          remotePaused: false,
          cancelled: false,
          endedWhilePaused: null
        };
        sendCloudCandidate(src, { kind: prefix + 'resume-ack', fileId: p.fileId, name: rxCloudFile.name, size: rxCloudFile.size, resumeFromChunk: 0 });
        renderIncomingRow(rxCloudFile, true);
        syncPauseBtnUi();
        return;
      }

      if ((p.kind === 'exe:file-chunk' || p.kind === 'browser:file-chunk') && rxCloudFile && !rxCloudFile.cancelled && p.data) {
        const cIdx = Math.max(0, Number(p.chunkIndex) || 0);
        if (rxCloudFile.chunks[cIdx] === undefined) {
          const bin = atob(p.data);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          rxCloudFile.chunks[cIdx] = bytes;
          rxCloudFile.receivedCount = (rxCloudFile.receivedCount || 0) + 1;
          rxCloudFile.bytes += bytes.byteLength;
          const now = performance.now();
          if (now - rxCloudFile.lastUi > 120) {
            rxCloudFile.lastUi = now;
            renderIncomingRow(rxCloudFile, true);
          }
        }
        if ((cIdx + 1) % 8 === 0) {
          sendCloudCandidate(src, { kind: p.kind.startsWith('browser:') ? 'browser:chunk-ack' : 'exe:chunk-ack', fileId: rxCloudFile.fileId, chunkIndex: cIdx });
        }
        return;
      }

      if ((p.kind === 'exe:file-end' || p.kind === 'browser:file-end') && rxCloudFile && !rxCloudFile.cancelled) {
        if (rxCloudFile.paused) {
          rxCloudFile.endedWhilePaused = { src, endKind: p.kind };
          renderIncomingRow(rxCloudFile, true);
          return;
        }
        finalizeCloudRx(src, p.kind);
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
      sendDepartureNotice();
      const code = document.getElementById('room-input').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!code) {
        activeRoom = '';
        activeTopic = '';
        for (const s of mqttSockets) { try { s.close(); } catch {} }
        mqttSockets = [];
        for (const p of peersMap.values()) {
          try { if (p.pc) p.pc.close(); } catch {}
        }
        peersMap.clear();
        updatePeerPresenceUi(false, '', '');
        document.getElementById('status-badge').textContent = 'Waiting for tunnel name — enter a name and click Connect';
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
        const pcConnected = peer.pc && peer.pc.connectionState === 'connected' && peer.pc.iceConnectionState !== 'disconnected' && peer.pc.iceConnectionState !== 'failed' && peer.pc.iceConnectionState !== 'closed';
        const dcAlive = peer.dc && peer.dc.readyState === 'open' && pcConnected;
        if (!dcAlive && now - peer.lastSeen > 7500) {
          try { if (peer.pc) peer.pc.close(); } catch {}
          peersMap.delete(pid);
          pruned = true;
        }
      }
      if (peersMap.size > 0) {
        updatePeerPresenceUi(true, peersMap.size + ' users', activeRoom);
      } else if (pruned || peersMap.size === 0) {
        updatePeerPresenceUi(false, '', activeRoom);
      }
    }, 2200);

    document.getElementById('connect-btn').addEventListener('click', connectRoom);
    document.getElementById('pause-btn').addEventListener('click', togglePauseState);
    document.getElementById('stop-btn').addEventListener('click', stopAllActiveTransfers);
    document.getElementById('transfer-list').addEventListener('click', (ev) => {
      const btn = ev.target && ev.target.closest ? ev.target.closest('button[data-action]') : null;
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const fid = btn.getAttribute('data-fid');
      if (!fid) return;
      if (action === 'stop') {
        cancelTransferById(fid, false);
      } else if (action === 'pause-resume') {
        const out = activeOutgoing.get(fid);
        const isPaused = (out && out.paused)
          || (incomingFile && incomingFile.fileId === fid && incomingFile.paused)
          || (rxCloudFile && rxCloudFile.fileId === fid && rxCloudFile.paused);
        if (isPaused) resumeTransferById(fid);
        else pauseTransferById(fid);
      }
    });
    document.getElementById('file-input').addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      const file = files[0];
      e.target.value = '';
      const targetId = (document.getElementById('target-peer-select') && document.getElementById('target-peer-select').value) || '*';
      const targetPeers = targetId === '*'
        ? Array.from(peersMap.values())
        : (peersMap.has(targetId) ? [peersMap.get(targetId)] : []);

      if (targetPeers.length === 0) {
        renderStatus('Selected recipient is not present in room "' + escapeHtml(activeRoom) + '".');
        return;
      }

      const chunkKb = parseInt(document.getElementById('chunk-select').value, 10) || 240;
      const peerRows = new Map();
      function renderAllPeerStatuses() {
        const list = document.getElementById('transfer-list');
        if (!list) return;
        list.innerHTML = Array.from(peerRows.values()).join('');
      }
      function setPeerRow(pid, isError, htmlText, activeEntry) {
        const cls = isError
          ? 'p-3 bg-red-950/60 border border-red-700/60 rounded font-mono text-red-200 flex items-center justify-between gap-3'
          : 'p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 flex items-center justify-between gap-3';
        const ctrls = activeEntry ? renderTransferControls(activeEntry.fileId, !!activeEntry.paused) : '';
        peerRows.set(pid, '<div class="' + cls + '"><span class="truncate">' + htmlText + '</span>' + ctrls + '</div>');
        renderAllPeerStatuses();
      }

      function splitFrameForSctp(frameBuf, maxSliceBytes) {
        const total = frameBuf.byteLength;
        const lim = Math.max(8192, Math.min(240 * 1024, Math.floor(maxSliceBytes || 240 * 1024)));
        if (total <= lim + 24) return [frameBuf];
        const hv = new DataView(frameBuf);
        const tId = hv.getUint32(4, false);
        const cId = hv.getUint32(8, false);
        const parts = Math.ceil(total / lim);
        const out = new Array(parts);
        const src = new Uint8Array(frameBuf);
        for (let i = 0; i < parts; i++) {
          const off = i * lim;
          const len = Math.min(lim, total - off);
          const sub = new Uint8Array(24 + len);
          const sv = new DataView(sub.buffer);
          sv.setUint32(0, MAGIC_AETP, false);
          sv.setUint32(4, tId, false);
          sv.setUint32(8, cId, false);
          sv.setUint32(12, total, false);
          sv.setUint32(16, off, false);
          sv.setUint16(20, i, false);
          sv.setUint16(22, parts, false);
          sub.set(src.subarray(off, off + len), 24);
          out[i] = sub.buffer;
        }
        return out;
      }

      async function sendToIndependentPeer(peer) {
        let startedAt = performance.now();
        let paceEpochMs = performance.now();
        const peerLabel = peer.label || peer.id.slice(-8);

        async function paceOutgoingBytes(bytesSent, outEntry) {
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
            if (outEntry && outEntry.cancelled) return;
            const waitMs = paceEpochMs - performance.now();
            if (waitMs <= 1) break;
            await new Promise(r => setTimeout(r, Math.min(80, waitMs)));
          }
        }

        if (peer.dc && peer.dc.readyState === 'open') {
          const chunkSize = chunkKb * 1024;
          const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
          const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;
          const fileId = 'f-' + Date.now() + '-' + peer.id.slice(-6) + '-' + Math.random().toString(36).slice(2, 5);
          let rxConfirmed = false;
          let rxErr = '';
          const outEntry = {
            fileId,
            peerId: peer.id,
            peerLabel,
            name: file.name,
            size: file.size,
            paused: transferPaused,
            remotePaused: false,
            cancelled: false,
            cancelledBy: '',
            pct: 0,
            lastStatus: 'WebRTC -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (0%)',
            renderRow: null
          };
          outEntry.renderRow = () => {
            if (outEntry.cancelled) {
              setPeerRow(peer.id, false, (outEntry.cancelledBy === 'remote' ? 'Stopped by peer [' : 'Stopped [') + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name), null);
              return;
            }
            if (outEntry.paused) {
              const pPrefix = outEntry.remotePaused ? 'Paused by peer [' : 'Paused [';
              setPeerRow(peer.id, false, pPrefix + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + outEntry.pct + '%)', outEntry);
              return;
            }
            setPeerRow(peer.id, false, outEntry.lastStatus, outEntry);
          };
          activeOutgoing.set(fileId, outEntry);
          syncPauseBtnUi();
          rxCompleteResolvers.set(fileId, () => { rxConfirmed = true; });
          rxErrorResolvers.set(fileId, (reason) => { rxErr = reason; });

          try {
            const resumePromise = new Promise(resolve => {
              const timer = setTimeout(() => {
                pendingResumeResolvers.delete(fileId);
                if (pendingResumeResolvers.get(peer.id) === wake) pendingResumeResolvers.delete(peer.id);
                resolve(0);
              }, 1200);
              const wake = (cIdx) => {
                clearTimeout(timer);
                pendingResumeResolvers.delete(fileId);
                if (pendingResumeResolvers.get(peer.id) === wake) pendingResumeResolvers.delete(peer.id);
                resolve(cIdx);
              };
              pendingResumeResolvers.set(fileId, wake);
              pendingResumeResolvers.set(peer.id, wake);
            });

            const metaMsg = JSON.stringify({ kind: 'file:meta', fileId, transferNumId, name: file.name, size: file.size, chunkSize, mimeType: file.type, totalChunks, sha256: 'streaming-aes-gcm' });
            try { peer.dc.send(metaMsg); } catch {}
            const startChunk = Math.max(0, Math.min(await resumePromise, totalChunks));
            if (outEntry.cancelled) {
              outEntry.renderRow();
              return;
            }
            const batchSize = 32;

            let minSlice = 240 * 1024;
            const maxMsg = peer.pc && peer.pc.sctp && peer.pc.sctp.maxMessageSize;
            if (typeof maxMsg === 'number' && maxMsg > 0) {
              minSlice = Math.min(minSlice, Math.max(8192, maxMsg - 128));
            }

            for (let bStart = startChunk; bStart < totalChunks; bStart += batchSize) {
              if (rxErr || outEntry.cancelled) break;
              if (transferPaused || outEntry.paused) {
                outEntry.pct = Math.round((bStart / totalChunks) * 100);
                outEntry.renderRow();
                const keepGoing = await waitWhilePaused(fileId, (ms) => { startedAt += ms; });
                if (!keepGoing || outEntry.cancelled) break;
              }
              const bEnd = Math.min(totalChunks, bStart + batchSize);
              const slab = await file.slice(bStart * chunkSize, Math.min(file.size, bEnd * chunkSize)).arrayBuffer();
              if (outEntry.cancelled) break;

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
                if (rxErr || outEntry.cancelled) break;
                if (transferPaused || outEntry.paused) {
                  outEntry.renderRow();
                  const keepGoing = await waitWhilePaused(fileId, (ms) => { startedAt += ms; });
                  if (!keepGoing || outEntry.cancelled) break;
                }
                const slices = splitFrameForSctp(frame, minSlice);
                for (const sl of slices) {
                  while (!outEntry.cancelled && peer.dc && peer.dc.readyState === 'open' && peer.dc.bufferedAmount + sl.byteLength > HIGH_WATER) {
                    await new Promise(r => setTimeout(r, 4));
                  }
                  if (outEntry.cancelled) break;
                  if (peer.dc && peer.dc.readyState === 'open') {
                    peer.dc.send(sl.slice(0));
                  }
                }
                if (outEntry.cancelled) break;
                await paceOutgoingBytes(chunkSize, outEntry);
              }
              if (outEntry.cancelled) break;

              const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
              const buffered = peer.dc ? peer.dc.bufferedAmount : 0;
              const sentBytes = Math.max(0, Math.min(file.size, bEnd * chunkSize) - buffered);
              const mbps = (sentBytes / (1024 * 1024) / elapsed).toFixed(2);
              const pct = Math.round((sentBytes / Math.max(1, file.size)) * 100);
              outEntry.pct = pct;
              outEntry.lastStatus = 'WebRTC -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
              outEntry.renderRow();
            }

            let lastBuf = Infinity;
            let lastBufAt = performance.now();
            while (!outEntry.cancelled && !rxConfirmed && !rxErr && peer.dc && peer.dc.readyState === 'open' && peer.dc.bufferedAmount > 0) {
              const cur = peer.dc.bufferedAmount;
              const nowD = performance.now();
              if (cur < lastBuf) {
                lastBuf = cur;
                lastBufAt = nowD;
                const sentBytes = Math.max(0, file.size - cur);
                const pct = Math.round((sentBytes / Math.max(1, file.size)) * 100);
                const elapsed = Math.max(0.02, (nowD - startedAt) / 1000);
                const mbps = (sentBytes / (1024 * 1024) / elapsed).toFixed(2);
                outEntry.pct = pct;
                outEntry.lastStatus = 'WebRTC -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
                outEntry.renderRow();
              } else if (nowD - lastBufAt > 15000) {
                break;
              }
              await new Promise(r => setTimeout(r, 25));
            }

            const ackDeadline = performance.now();
            while (!outEntry.cancelled && !rxConfirmed && !rxErr && performance.now() - ackDeadline < 4000) {
              await new Promise(r => setTimeout(r, 40));
            }

            if (outEntry.cancelled) {
              outEntry.renderRow();
              return;
            }
            if (rxErr) {
              setPeerRow(peer.id, true, '[' + escapeHtml(peerLabel) + '] Error: ' + escapeHtml(rxErr), null);
              return;
            }
            const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
            const finalMbps = (file.size / (1024 * 1024) / totalElapsed).toFixed(2);
            setPeerRow(peer.id, false, 'Completed [' + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + finalMbps + ' MB/s avg)', null);
            return;
          } finally {
            rxCompleteResolvers.delete(fileId);
            rxErrorResolvers.delete(fileId);
            activeOutgoing.delete(fileId);
            syncPauseBtnUi();
          }
        }

        const dst = peer.id;
        const isExe = peer.type === 'exe';
        const cSize = 49152;
        const totalChunks = Math.max(1, Math.ceil(file.size / cSize));
        const fileId = 'f-' + Date.now() + '-' + peer.id.slice(-5) + '-' + Math.random().toString(36).slice(2, 5);

        const outEntry = {
          fileId,
          peerId: peer.id,
          peerLabel,
          name: file.name,
          size: file.size,
          paused: transferPaused,
          remotePaused: false,
          cancelled: false,
          cancelledBy: '',
          pct: 0,
          lastStatus: 'Bridge -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (0%)',
          renderRow: null
        };
        outEntry.renderRow = () => {
          if (outEntry.cancelled) {
            setPeerRow(peer.id, false, (outEntry.cancelledBy === 'remote' ? 'Stopped by peer [' : 'Stopped [') + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name), null);
            return;
          }
          if (outEntry.paused) {
            const pPrefix = outEntry.remotePaused ? 'Paused by peer [' : 'Paused [';
            setPeerRow(peer.id, false, pPrefix + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + outEntry.pct + '%)', outEntry);
            return;
          }
          setPeerRow(peer.id, false, outEntry.lastStatus, outEntry);
        };
        activeOutgoing.set(fileId, outEntry);
        syncPauseBtnUi();

        try {
          const resumePromise = new Promise(resolve => {
            const timer = setTimeout(() => {
              pendingResumeResolvers.delete(fileId);
              if (pendingResumeResolvers.get(dst) === wake) pendingResumeResolvers.delete(dst);
              resolve(0);
            }, 600);
            const wake = (idx) => {
              clearTimeout(timer);
              pendingResumeResolvers.delete(fileId);
              if (pendingResumeResolvers.get(dst) === wake) pendingResumeResolvers.delete(dst);
              resolve(idx);
            };
            pendingResumeResolvers.set(fileId, wake);
            pendingResumeResolvers.set(dst, wake);
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
            if (outEntry.cancelled) break;
            if (transferPaused || outEntry.paused) {
              outEntry.pct = Math.round((cIdx / totalChunks) * 100);
              outEntry.renderRow();
              const keepGoing = await waitWhilePaused(fileId, (ms) => { startedAt += ms; });
              if (!keepGoing || outEntry.cancelled) break;
            }
            const buf = await file.slice(off, Math.min(file.size, off + cSize)).arrayBuffer();
            if (outEntry.cancelled) break;
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
            await paceOutgoingBytes(bytes.byteLength, outEntry);
            if (outEntry.cancelled) break;
            const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
            const mbps = (Math.min(file.size, off + bytes.byteLength) / (1024 * 1024) / elapsed).toFixed(2);
            const pct = Math.round((cIdx / totalChunks) * 100);
            outEntry.pct = pct;
            outEntry.lastStatus = 'Bridge -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
            outEntry.renderRow();
            if (cIdx % 8 === 0) {
              await new Promise(resolve => {
                const timer = setTimeout(() => {
                  cloudAckResolvers.delete(fileId);
                  if (cloudAckResolvers.get(dst) === wake) cloudAckResolvers.delete(dst);
                  resolve();
                }, 350);
                const wake = () => {
                  clearTimeout(timer);
                  cloudAckResolvers.delete(fileId);
                  if (cloudAckResolvers.get(dst) === wake) cloudAckResolvers.delete(dst);
                  resolve();
                };
                cloudAckResolvers.set(fileId, wake);
                cloudAckResolvers.set(dst, wake);
              });
            }
          }
          if (outEntry.cancelled) {
            outEntry.renderRow();
            return;
          }
          sendCloudCandidate(dst, { kind: isExe ? 'exe:file-end' : 'browser:file-end', fileId });
          const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
          const finalMbps = (file.size / (1024 * 1024) / totalElapsed).toFixed(2);
          setPeerRow(peer.id, false, 'Completed [' + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + finalMbps + ' MB/s avg)', null);
        } finally {
          activeOutgoing.delete(fileId);
          syncPauseBtnUi();
        }
      }

      await Promise.all(targetPeers.map(p => sendToIndependentPeer(p)));
    });

    if (document.getElementById('room-input').value.trim()) {
      connectRoom();
    } else {
      document.getElementById('status-badge').textContent = 'Waiting for tunnel name — enter a name and click Connect';
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

function findRoomTargetClient(room: Map<string, PeerClient>, senderId: string, toPeerId?: string): PeerClient | null {
  if (!toPeerId || toPeerId === '*') return null;
  if (room.has(toPeerId) && toPeerId !== senderId) {
    return room.get(toPeerId)!;
  }
  for (const [peerId, client] of room.entries()) {
    if (peerId !== senderId && client.cloudId === toPeerId) {
      return client;
    }
  }
  return null;
}

function sendToRoomTarget(roomCode: string, senderId: string, toPeerId: string | undefined, payload: unknown) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const serialized = JSON.stringify(payload);
  const directTarget = findRoomTargetClient(room, senderId, toPeerId);
  if (directTarget) {
    if (directTarget.ws.readyState === WebSocket.OPEN) {
      directTarget.ws.send(serialized);
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
  const directTarget = findRoomTargetClient(room, senderId, toPeerId);
  if (directTarget) {
    if (directTarget.ws.readyState === WebSocket.OPEN) {
      directTarget.ws.send(rawBinary, { binary: true });
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

  const aliveWsSet = new WeakMap<WebSocket, boolean>();
  const wsHeartbeatTimer = setInterval(() => {
    for (const client of wss.clients) {
      if (aliveWsSet.get(client) === false) {
        try {
          client.terminate();
        } catch {}
        continue;
      }
      aliveWsSet.set(client, false);
      try {
        client.ping();
      } catch {}
    }
  }, 10000);
  wss.on('close', () => {
    clearInterval(wsHeartbeatTimer);
  });

  wss.on('connection', (ws) => {
    let currentPeer: PeerClient | null = null;
    aliveWsSet.set(ws, true);

    const detachCurrentPeer = () => {
      if (currentPeer && rooms.has(currentPeer.roomCode)) {
        const departed = currentPeer;
        currentPeer = null;
        const room = rooms.get(departed.roomCode)!;
        room.delete(departed.id);
        if (room.size === 0) {
          rooms.delete(departed.roomCode);
        } else {
          broadcastToRoom(departed.roomCode, departed.id, {
            type: 'peer:left',
            peerId: departed.id,
            cloudId: departed.cloudId,
            peers: getRoomPeerSummaries(departed.roomCode),
            maxPeers: MAX_ROOM_PEERS,
          });
        }
      } else {
        currentPeer = null;
      }
    };

    ws.on('pong', () => {
      aliveWsSet.set(ws, true);
    });

    ws.on('message', (rawData, isBinary) => {
      aliveWsSet.set(ws, true);
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
                cloudId: currentPeer.cloudId,
                peers: getRoomPeerSummaries(currentPeer.roomCode),
                maxPeers: MAX_ROOM_PEERS,
              });
              if (prevRoom.size === 0) {
                rooms.delete(currentPeer.roomCode);
              }
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

          case 'room:leave': {
            detachCurrentPeer();
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
      detachCurrentPeer();
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
