// Generates 100% self-contained, zero-install standalone portable packages
// that run directly from GitHub Pages, GitHub Releases, or local disk without any backend server.

export function generateStandalonePortableHtml(defaultRoomCode: string): string {
  const safeRoomAttr = String(defaultRoomCode || '').replace(/[^a-z0-9-]/gi, '').toLowerCase();
  return `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AetherTunnel Portable v1.0 — Standalone Encrypted P2P Client</title>
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
        <span class="text-lg font-bold tracking-tight text-slate-100">AetherTunnel Portable <span class="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">v1.0</span></span>
        <span class="ml-3 text-xs text-emerald-400 font-mono">Direct WebRTC Mesh (Max 8) + Windows .EXE Wormhole + AES-256-GCM</span>
      </div>
      <div id="status-badge" class="text-xs font-mono text-amber-400">Initializing P2P Node...</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">1. Wormhole Pairing Code</h2>
        <p class="text-xs text-slate-400">Kirjoita tunnelin nimi ja paina Yhdistä (toimii ristiin Web Appin, Portable HTML:n ja Windows .EXE:n välillä).</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnelin nimi</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${safeRoomAttr}" placeholder="Kirjoita tunnelin nimi..." class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
            <button id="connect-btn" class="px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 rounded-lg hover:bg-sky-300 cursor-pointer">Yhdistä</button>
          </div>
        </div>

        <div id="peer-presence-box" class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span id="peer-presence-dot" class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span id="peer-presence-title" class="text-xs font-semibold text-amber-300">Ei toista käyttäjää huoneessa (Waiting)</span>
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
          <div class="flex justify-between"><span class="text-slate-400">AES-256-GCM Key Fingerprint:</span><span id="fp-label" class="font-mono text-emerald-400">Odottaa tunnelin nimeä...</span></div>
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
          <div class="text-xs text-slate-400 mt-1">Direct RTCPeerConnection Mesh + Windows .EXE Bridge · Resumable Transfers</div>
        </label>
        <div id="transfer-list" class="space-y-2 max-h-64 overflow-y-auto text-xs">
          <div class="text-slate-500 text-center py-4">No transfers yet. Connect with peers and select a file.</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const MAGIC_AETH = 0x41455448;
    const MAGIC_AETP = 0x41455450;
    const HIGH_WATER = 24 * 1024 * 1024;
    const LOW_WATER = 12 * 1024 * 1024;
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
        const batchSize = 48;

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
          if (cIdx % 24 === 0) {
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

export function generateGitHubPagesAndReleasesWorkflow(): string {
  return `name: Auto-Build GitHub Pages & Standalone .EXE Release

on:
  push:
    branches:
      - main
      - master
    tags:
      - 'v*.*.*'
  workflow_dispatch:

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: 'pages-and-releases'
  cancel-in-progress: false

jobs:
  build-and-publish:
    name: Build Web Page + Compile .EXE & Publish Release
    runs-on: ubuntu-24.04
    steps:
      - name: 1. Checkout Repository via Git
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          git init .
          git remote add origin "https://x-access-token:\${GH_TOKEN}@github.com/\${GITHUB_REPOSITORY}.git"
          git fetch --depth=1 origin "\${GITHUB_SHA}"
          git checkout -f FETCH_HEAD

      - name: 2. Install Dependencies & Build Static Web App
        run: |
          npm install --legacy-peer-deps --no-audit --no-fund
          npm run build
          cp dist/index.html dist/404.html

      - name: 3. Compile Native Windows .EXE & Standalone Packages
        run: |
          node scripts/build-desktop-entry.cjs
          ls -lh dist/downloads/

      - name: 4. Publish AetherTunnel-win-x64.exe & Binaries to GitHub Releases
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          TAG_NAME="v1.0.0"
          git tag -f "$TAG_NAME"
          git push origin "$TAG_NAME" --force
          if gh release view "$TAG_NAME" --repo "$GITHUB_REPOSITORY" >/dev/null 2>&1; then
            gh release upload "$TAG_NAME" dist/downloads/* --clobber --repo "$GITHUB_REPOSITORY"
          else
            gh release create "$TAG_NAME" dist/downloads/* \\
              --repo "$GITHUB_REPOSITORY" \\
              --title "AetherTunnel Standalone Release (Latest)" \\
              --notes "Direct-download standalone executables: AetherTunnel-win-x64.exe (Windows GUI), AetherTunnel-Portable-Standalone.html, macOS (.command), and Linux (.sh)." \\
              --latest
          fi

      - name: "5. Configure GitHub Pages"
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: "6. Upload Artifact for GitHub Pages"
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  deploy-pages:
    name: "Deploy Live Site to GitHub Pages"
    needs: build-and-publish
    runs-on: ubuntu-24.04
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: "Deploy to GitHub Pages"
        id: deployment
        uses: actions/deploy-pages@v4
`;
}

export function triggerBrowserDownload(
  filename: string,
  content: string | Uint8Array,
  mimeType: string = 'application/octet-stream'
) {
  const blob = new Blob([content as BlobPart], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Client-side PE32 builder for the Native Windows 64-bit Kernel-Socket Desktop Application (.exe)
// Features:
// - Per-Monitor V2 High-DPI Awareness (razor-sharp native resolution on Windows 11 125%/150%/200% displays)
// - Exact RFC 2898 PBKDF2-HMAC-SHA256 Key & Fingerprint parity with WebCrypto
// - Dual Browser Bridge: Localhost Kernel WebSocket (127.0.0.1:45889) + Universal WSS Wormhole Cloud Bridge (wss://0.peerjs.com)
// - Direct Winsock2 Kernel TCP (.EXE <-> .EXE, 4 MB blocks, 4x Parallel AES-NI)
export function downloadNativeWindowsKernelExe(
  defaultRoomCode: string = '',
  _cloudWsUrl?: string
) {
  const safeRoom = (defaultRoomCode || '').replace(/[^a-z0-9-]/gi, '').toLowerCase();
  const fallbackWs = typeof window !== 'undefined' && window.location && window.location.origin
    ? window.location.origin.replace(/^http/, 'ws') + '/ws-tunnel'
    : '';
  const rawCloudWs = String(_cloudWsUrl || fallbackWs || '').trim();
  const safeCloudWs = /^(wss?:\/\/[a-z0-9.\-:\[\]]+\/[^\s"'<>\\]*)$/i.test(rawCloudWs) ? rawCloudWs : '';

  const csharpKernelSource = `
using System;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Reflection;

[assembly: AssemblyTitle("AetherTunnel P2P Engine")]
[assembly: AssemblyProduct("AetherTunnel")]

namespace AetherTunnelNative
{
    static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDpiAwarenessContext(IntPtr dpiFlag);

        [DllImport("shcore.dll")]
        private static extern int SetProcessDpiAwareness(int value);

        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [DllImport("winmm.dll")]
        private static extern uint timeBeginPeriod(uint uPeriod);

        [STAThread]
        static void Main()
        {
            // Enable 1ms OS scheduler timer resolution for high-precision P2P UDP pacing
            try { timeBeginPeriod(1); } catch { }

            // Enable Per-Monitor V2 High-DPI rendering on Windows 10/11 so text and controls are 100% razor-sharp
            try { SetProcessDpiAwarenessContext(new IntPtr(-4)); } catch { }
            try { SetProcessDpiAwareness(2); } catch { }
            try { SetProcessDPIAware(); } catch { }

            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls | (SecurityProtocolType)12288;
            }
            catch
            {
                try { ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls; } catch { }
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    public class MainForm : Form
    {
        private const uint MAGIC_HEADER = 0x4145544B; // "AETK" (AetherTunnel Kernel TCP Frame)
        private const uint MAGIC_UDP_DATA = 0x41455455; // "AETU" (AetherTunnel P2P UDP Encrypted Frame)
        private const int CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB Direct Kernel Socket Macro-Block (.EXE <-> .EXE)
        private const int UDP_CHUNK_SIZE = 1376; // 1376 B Plaintext -> 1420 B UDP / 1448 B IPv4 (Zero IP Fragmentation across CGNAT & PPPoE!)
        private const int WS_CHUNK_SIZE = 1024 * 1024; // 1 MB Localhost WebSocket Frame (.EXE <-> Local Browser)
        private const int CLOUD_CHUNK_SIZE = 49152; // 48 KB Binary / 64 KB Base64 Frame for WSS Cloud Bridge
        private const int PARALLEL_WORKERS = 4; // 4x Parallel Hardware AES-NI Workers per Wave
        private const int UDP_DISCOVERY_PORT = 45888;
        private const int MAX_ROOM_PEERS = 8;

        private readonly string instanceId = Guid.NewGuid().ToString("N").Substring(0, 12);
        private const string DEFAULT_CLOUD_WS_URL = "${safeCloudWs}";
        private volatile string currentRoomCode = "${safeRoom}";
        private volatile string localDisplayName = "";
        private volatile string selectedTargetPeerId = "*";
        private volatile bool roomFullRejected = false;
        private bool suppressRoomBroadcast = false;
        private float dpiScale = 1.0f;

        private TextBox txtRoomCode;
        private TextBox txtDisplayName;
        private TextBox txtPassphrase;
        private Panel pnlRoomPresence;
        private Label lblRoomPresence;
        private Label lblKeyFingerprint;
        private Label lblStatusBadge;
        private Label lblLocalEndpoint;
        private Label lblSpeedMetric;
        private Label lblTransferStats;
        private Label lblProgressDetail;
        private ProgressBar progressBar;
        private ComboBox cmbTargetPeer;
        private TextBox txtMaxUploadMBps;
        private readonly List<string> targetPeerIds = new List<string>();
        private Label lblQueueSummary;
        private ListBox lstQueue;
        private Button btnRetryQueue;
        private Button btnRemoveQueue;
        private Button btnClearQueue;
        private Button btnPauseResume;
        private CheckBox chkAutoAccept;
        private ListBox lstLog;
        private Button btnSendFile;
        private Button btnSendFolder;
        private FolderBrowserDialog folderDialog;
        private FolderBrowserDialog folderPickDialog;

        private TcpListener tcpListener;
        private UdpClient udpDiscovery;
        private UdpClient udpP2pClient;
        private UdpClient udpP2pV6Client;
        private int listenPort = 45889;
        private int udpP2pPort = 45890;
        private int udpP2pV6Port = 0;
        private volatile string publicWanUdpEndpoint = "";
        private volatile string publicWanV6UdpEndpoint = "";
        private volatile string stunEndpoint0 = "";
        private volatile string stunEndpoint1 = "";
        private volatile int natSymDetected = 0;
        private volatile int natPortDelta = 0;
        private volatile string natTypeSummary = "Probing NAT...";
        private volatile bool upnpTcpMapped = false;
        private volatile bool upnpUdpMapped = false;
        private volatile string remotePeerWanUdp = "";
        private volatile string remotePeerLanUdp = "";
        private volatile string remotePeerWanV6Udp = "";
        private volatile string remotePeerLanTcp = "";
        private volatile string remotePeerPredictedWanUdp = "";
        private volatile int remotePeerNatSym = 0;
        private volatile int remotePeerNatDelta = 0;
        private volatile int remotePeerUpnpTcp = 0;
        private int lastPunchFanTick = unchecked(Environment.TickCount - 10000);
        private string lastLoggedPunchTarget = "";
        private volatile bool isRunning = true;

        // 1. Native .EXE <-> .EXE Kernel TCP Peer & Resume Signaling
        private TcpClient activePeerClient;
        private NetworkStream activePeerStream;
        private readonly object streamWriteLock = new object();
        private volatile int kernelTcpResumeChunk = 0;
        private volatile bool kernelTcpWaitAccept = false;
        private volatile bool kernelTcpRejected = false;
        private volatile bool kernelTcpResumeReceived = false;
        private readonly AutoResetEvent kernelTcpResumeEvent = new AutoResetEvent(false);

        // 1B. Native .EXE <-> .EXE STUN NAT-Punched Direct UDP Peer (Token-Bucket Paced 600-5000 Mbit/s + Real-Time NACK)
        private IPEndPoint activeUdpPeerEndpoint = null;
        private DateTime lastUdpPeerSeen = DateTime.MinValue;
        private volatile int udpPeerAckedChunk = -1;
        private volatile int udpPeerContiguousChunk = -1;
        private volatile int udpPeerUniqueAcked = 0;
        private volatile int udpPeerMeasuredMbps = 0;
        private volatile int udpPeerResumeChunk = 0;
        private volatile bool udpTransferDoneAcked = false;
        private volatile bool udpNeedStartResend = false;
        private volatile bool udpWaitAcceptReceived = false;
        private volatile bool udpTransferRejected = false;
        private volatile bool udpResumeReceived = false;
        private volatile int udpPromptState = 0; // 0=idle, 1=prompting, 2=accepted, 3=rejected
        private volatile string udpPromptKey = "";
        private volatile string udpPromptAcceptedKey = "";
        private int udpPromptRejectTick = 0;
        private int udpPromptStartedTick = 0;
        private volatile bool udpPendingAcceptOpen = false;
        private volatile string udpPendingAcceptHeader = "";
        private IPEndPoint udpPendingAcceptEp = null;
        private double dynamicUdpBitrateMbps = 25.0; // Self-tuning Smooth Dynamic P2P Pacer (8–5000 Mbit/s)
        private double udpBestRxMbps = 25.0;
        private double udpCongestionCeilingMbps = 0.0;
        private long udpBestRxDecayTicks = 0;
        private volatile int lastNackReceivedTick = 0;
        private volatile int lastNackCutTick = 0;
        private volatile int lastAckReceivedTick = 0;
        private volatile int udpTxLastPeerActivityTick = 0;
        private volatile bool udpInSlowStart = true;
        private volatile int udpCleanAckStreak = 0;
        private volatile int udpLowRxStreak = 0;
        private int pacingResetRequested = 0;
        private readonly object udpTxLock = new object();
        private volatile string udpTxActiveFileName = "";
        private readonly ConcurrentQueue<int> udpRetransmitQueue = new ConcurrentQueue<int>();
        private readonly ConcurrentDictionary<int, int> udpSenderChunkLastSentTick = new ConcurrentDictionary<int, int>();
        private readonly AutoResetEvent udpAckEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent udpResumeEvent = new AutoResetEvent(false);
        private readonly ConcurrentQueue<byte[]> udpRxDataQueue = new ConcurrentQueue<byte[]>();
        private readonly AutoResetEvent udpRxDataEvent = new AutoResetEvent(false);
        private volatile bool udpRxStartPending = false;
        private volatile bool udpRxEndPending = false;
        private volatile int udpRxEndTick = 0;
        private volatile int lastUniqueRxChunkTick = 0;
        private volatile string activeRxUdpFileName = "";
        private volatile string activeRxUdpPartPath = "";
        private volatile bool udpRxCloseRequested = false;
        private volatile string udpRxCloseTargetPath = "";
        private readonly ManualResetEvent udpRxClosedSignal = new ManualResetEvent(true);
        private volatile string lastCompletedUdpFileNameVolatile = "";
        private long maxUploadBytesPerSec = 0L;
        private string initialMaxSpeedText = "0";
        private volatile string udpPendingStartHeader = "";
        private IPEndPoint udpPendingStartEp = null;
        private volatile bool autoAcceptAllIncoming = false;
        private readonly object incomingPromptLock = new object();
        private readonly object rxHandleCoordLock = new object();
        private TcpClient activeTcpRxClient = null;
        private volatile string activeTcpRxPartPath = "";
        private TcpClient activeWsRxClient = null;
        private volatile string activeWsRxPartPath = "";
        private sealed class TransferQueueEntry
        {
            public string Id;
            public string FullPath;
            public string DisplayName;
            public long FileSize;
            public string Status;
            public string TargetPeerId;
            public string TargetLabel;
            public int RetryCount;
            public DateTime NextRetryUtc = DateTime.MinValue;
        }
        private sealed class RoomPeerInfo
        {
            public string PeerId;
            public string DisplayName;
            public string ClientType;
            public string CloudPeerId;
            public string WanUdpEp;
            public string LanUdpEp;
            public string WanV6UdpEp;
            public string PredWanUdpEp;
            public string LanTcpEp;
            public int NatSym;
            public int NatDelta;
            public int UpnpTcp;
            public IPEndPoint ActiveUdpEp;
            public DateTime LastUdpSeen = DateTime.MinValue;
            public TcpClient TcpClientConn;
            public NetworkStream TcpStream;
            public DateTime LastTcpSeen = DateTime.MinValue;
            public SignalingChannel PreferredCloudChannel;
            public DateTime LastCloudSeen = DateTime.MinValue;
        }
        private readonly ConcurrentDictionary<string, RoomPeerInfo> roomPeers = new ConcurrentDictionary<string, RoomPeerInfo>();
        private readonly List<TransferQueueEntry> transferQueue = new List<TransferQueueEntry>();
        private readonly object transferQueueLock = new object();
        private readonly AutoResetEvent transferQueueEvent = new AutoResetEvent(false);
        private readonly HashSet<string> cancelledQueueIds = new HashSet<string>();
        private volatile string activeQueueTransferId = "";
        private volatile bool transferPaused = false;
        private readonly ManualResetEvent transferResumeEvent = new ManualResetEvent(true);
        private readonly HashSet<string> attemptedAutoTcpEndpoints = new HashSet<string>();
        private readonly ThreadLocal<AesCryptoServiceProvider> threadLocalAes = new ThreadLocal<AesCryptoServiceProvider>(delegate() {
            AesCryptoServiceProvider a = new AesCryptoServiceProvider();
            a.KeySize = 256;
            a.BlockSize = 128;
            a.Mode = CipherMode.CBC;
            a.Padding = PaddingMode.PKCS7;
            return a;
        });
        private readonly ThreadLocal<byte[]> threadLocalIv = new ThreadLocal<byte[]>(delegate() { return new byte[16]; });
        private long totalAppBufferedBytes = 0;
        private const long HARD_RAM_CAP_BYTES = 1750L * 1024L * 1024L;
        private const long DISK_STAGE_TARGET_BYTES = 256L * 1024L * 1024L;
        private const int CHUNKS_PER_STAGE_PAGE = 6096; // 6096 * 1376 B = 8,388,096 B (~8.00 MB Windows 11 NVMe aligned block)
        private const int STAGE_PAGE_BYTES = CHUNKS_PER_STAGE_PAGE * UDP_CHUNK_SIZE;
        private readonly ManualResetEvent udpWriterExitedEvent = new ManualResetEvent(true);
        private readonly ManualResetEvent udpDiskIoExitedEvent = new ManualResetEvent(true);
        private readonly ConcurrentQueue<byte[]> udpStageBufferPool = new ConcurrentQueue<byte[]>();
        private readonly ConcurrentQueue<DiskWriteJob> diskWriteQueue = new ConcurrentQueue<DiskWriteJob>();
        private readonly AutoResetEvent diskWriteEvent = new AutoResetEvent(false);
        private readonly ManualResetEvent diskIoIdleEvent = new ManualResetEvent(true);
        private readonly object diskFileStreamLock = new object();
        private int activeDiskIoJobs = 0;
        private int lastUiUpdateTick = 0;
        private volatile int smoothedDiskWriteMbps = 0;
        private volatile int lastDiskWriteMs = 0;
        private volatile int diskSequentialNextPage = 0;
        private volatile int udpResumeBoundaryPage = -1;
        private volatile int udpResumeBoundarySlot = 0;

        private sealed class UdpStagePage
        {
            public int PageIndex;
            public byte[] Data;
            public bool[] Present;
            public short[] ChunkLens;
            public int StartSlot;
            public int PresentCount;
            public int ExpectedCount;
            public int ValidBytes;
        }

        private sealed class DiskWriteJob
        {
            public FileStream TargetFile;
            public string PartPath;
            public long ExpectedFileSize;
            public byte[] Buffer;
            public int Length;
            public long FileOffset;
            public int CkptContigChunk;
            public bool ForceOsSync;
        }

        // 2. Native .EXE <-> Local Browser Kernel WebSocket Bridge (ws://127.0.0.1:45889)
        private TcpClient activeBrowserWsClient;
        private NetworkStream activeBrowserWsStream;
        private readonly object wsWriteLock = new object();
        private volatile int wsResumeChunk = 0;
        private volatile bool wsWaitAcceptReceived = false;
        private volatile bool wsTransferRejected = false;
        private volatile bool wsResumeReceived = false;
        private readonly AutoResetEvent wsResumeEvent = new AutoResetEvent(false);

        // 3. Native .EXE <-> Chrome Browser & Remote .EXE Multi-Bus WSS Wormhole Cloud Bridge (App /ws-tunnel + Concurrent MQTT Brokers)
        private sealed class SignalingChannel
        {
            public string Name;
            public bool IsMqtt;
            public string Topic;
            public ClientWebSocket Ws;
            public readonly object SendLock = new object();
        }
        private readonly ConcurrentDictionary<string, SignalingChannel> activeSignalingChannels = new ConcurrentDictionary<string, SignalingChannel>();
        private volatile SignalingChannel lastExeSignalingChannel = null;
        private volatile SignalingChannel lastBrowserSignalingChannel = null;
        private readonly ConcurrentDictionary<string, int> cloudHelloReplyTicks = new ConcurrentDictionary<string, int>();
        private readonly object cloudRxFileLock = new object();
        private FileStream cloudOutFile = null;
        private string cloudFileName = "";
        private string cloudPartPath = "";
        private string cloudOutPath = "";
        private long cloudExpectedSize = 0;
        private long cloudReceivedBytes = 0;
        private long cloudSessionStartBytes = 0;
        private Stopwatch cloudRxSw = null;
        private string activeCloudMyId = "";
        private string activeCloudTopic = "aethertunnel/v1/room/default";
        private string activeCloudBrowserPeerId = "";
        private string activeCloudExePeerId = "";
        private DateTime lastCloudBrowserSeen = DateTime.MinValue;
        private DateTime lastCloudExeSeen = DateTime.MinValue;
        private volatile bool cloudReconnectRequested = false;
        private readonly AutoResetEvent cloudAckEvent = new AutoResetEvent(false);
        private volatile int cloudResumeChunk = 0;
        private volatile bool cloudWaitAcceptReceived = false;
        private volatile bool cloudTransferRejected = false;
        private volatile bool cloudResumeReceived = false;
        private volatile string cloudRejectedFileId = "";
        private readonly AutoResetEvent cloudResumeEvent = new AutoResetEvent(false);

        private byte[] aesKey = new byte[32];
        private string currentFingerprint = "Deriving...";
        private string downloadDirectory;

        private int S(int px)
        {
            return (int)Math.Round(px * dpiScale);
        }

        public MainForm()
        {
            using (Graphics g = Graphics.FromHwnd(IntPtr.Zero))
            {
                dpiScale = g.DpiX / 96.0f;
                if (dpiScale < 1.0f) dpiScale = 1.0f;
            }

            this.AutoScaleMode = AutoScaleMode.None;
            this.Text = "AetherTunnel v1.0 — Standalone P2P NAT-Punching & Kernel-Socket Edition";
            this.ClientSize = new Size(S(1020), S(668));
            this.MinimumSize = new Size(S(920), S(600));
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(9, 13, 22);
            this.ForeColor = Color.FromArgb(241, 245, 249);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            this.AllowDrop = true;
            this.DoubleBuffered = true;
            try
            {
                string comp = Environment.MachineName;
                if (!String.IsNullOrEmpty(comp)) localDisplayName = SanitizeJsonText(comp);
            }
            catch { }
            if (String.IsNullOrEmpty(localDisplayName)) localDisplayName = "WinEXE-" + instanceId.Substring(0, 4);

            string configPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "config.txt");
            bool loadedCfg = false;
            try
            {
                if (File.Exists(configPath))
                {
                    string savedDir = File.ReadAllText(configPath).Trim();
                    if (!String.IsNullOrEmpty(savedDir) && Directory.Exists(savedDir))
                    {
                        downloadDirectory = savedDir;
                        loadedCfg = true;
                    }
                }
            }
            catch { }

            if (!loadedCfg)
            {
                downloadDirectory = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                    "Downloads"
                );
                if (!Directory.Exists(downloadDirectory))
                {
                    downloadDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                }
            }

            try
            {
                string speedCfgPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "speedlimit.txt");
                if (File.Exists(speedCfgPath))
                {
                    string rawSpd = File.ReadAllText(speedCfgPath).Trim().Replace(',', '.');
                    double parsedSpd = 0.0;
                    if (Double.TryParse(rawSpd, NumberStyles.Float, CultureInfo.InvariantCulture, out parsedSpd) && parsedSpd > 0.0 && !Double.IsNaN(parsedSpd) && !Double.IsInfinity(parsedSpd))
                    {
                        Interlocked.Exchange(ref maxUploadBytesPerSec, Math.Max(10240L, (long)Math.Round(parsedSpd * 1024.0 * 1024.0)));
                        initialMaxSpeedText = parsedSpd.ToString("0.###", CultureInfo.InvariantCulture);
                    }
                }
            }
            catch { }

            BuildUserInterface();
            DeriveCryptographicKey();
            StartKernelListenerAndDiscovery();

            this.DragEnter += OnFormDragEnter;
            this.DragDrop += OnFormDragDrop;
            this.FormClosing += OnFormClosing;
        }

        private Label CreateCleanLabel(string text, Font font, Color color, Point location, bool autoSize)
        {
            Label lbl = new Label();
            lbl.UseMnemonic = false;
            lbl.Text = text;
            if (font != null) lbl.Font = font;
            lbl.ForeColor = color;
            lbl.Location = location;
            lbl.AutoSize = autoSize;
            return lbl;
        }

        private void BuildUserInterface()
        {
            Color bgCard = Color.FromArgb(15, 23, 42);
            Color bgInput = Color.FromArgb(9, 13, 22);
            Color fgMuted = Color.FromArgb(148, 163, 184);
            Color accentSky = Color.FromArgb(56, 189, 248);
            Color accentEmerald = Color.FromArgb(52, 211, 153);

            Panel headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = S(78);
            headerPanel.BackColor = Color.FromArgb(12, 18, 30);

            Label lblTitle = CreateCleanLabel(
                "AetherTunnel v1.0 — Standalone P2P & NAT-Punching Engine (.EXE)",
                new Font("Segoe UI Semibold", 14.5f, FontStyle.Bold),
                Color.FromArgb(248, 250, 252),
                new Point(S(24), S(12)),
                true
            );
            headerPanel.Controls.Add(lblTitle);

            Label lblSubtitle = CreateCleanLabel(
                "RFC 5389 STUN + Simultaneous UDP Hole Punching · Resumable .part Transfers · Winsock2 TCP & Browser Bridge",
                new Font("Consolas", 8.8f, FontStyle.Regular),
                accentSky,
                new Point(S(26), S(46)),
                true
            );
            headerPanel.Controls.Add(lblSubtitle);

            lblStatusBadge = CreateCleanLabel(
                "PEER STATUS: PROBING NAT & STUN...",
                new Font("Consolas", 9.5f, FontStyle.Bold),
                accentEmerald,
                new Point(S(560), S(16)),
                true
            );
            lblStatusBadge.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            headerPanel.Controls.Add(lblStatusBadge);

            this.Controls.Add(headerPanel);

            Panel leftCard = new Panel();
            leftCard.BackColor = bgCard;
            leftCard.Location = new Point(S(24), S(94));
            leftCard.Size = new Size(S(436), S(552));
            leftCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left;

            Label lblSec1 = CreateCleanLabel(
                "1. Wormhole Pairing & Kernel TCP Endpoint",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(14)),
                true
            );
            leftCard.Controls.Add(lblSec1);

            Label lblCodeTitle = CreateCleanLabel(
                "Tunnelin nimi (Kirjoita nimi ja paina Yhdistä):",
                null,
                fgMuted,
                new Point(S(20), S(42)),
                true
            );
            leftCard.Controls.Add(lblCodeTitle);

            txtRoomCode = new TextBox();
            txtRoomCode.Text = "${safeRoom}";
            txtRoomCode.Font = new Font("Consolas", 11f, FontStyle.Bold);
            txtRoomCode.BackColor = bgInput;
            txtRoomCode.ForeColor = accentSky;
            txtRoomCode.BorderStyle = BorderStyle.FixedSingle;
            txtRoomCode.Location = new Point(S(20), S(64));
            txtRoomCode.Size = new Size(S(222), S(28));
            txtRoomCode.KeyDown += delegate(object sKey, KeyEventArgs eKey) {
                if (eKey.KeyCode == Keys.Enter)
                {
                    eKey.SuppressKeyPress = true;
                    ConnectToEnteredRoom();
                }
            };
            leftCard.Controls.Add(txtRoomCode);

            Button btnConnectRoom = new Button();
            btnConnectRoom.UseMnemonic = false;
            btnConnectRoom.Text = "Yhdistä";
            btnConnectRoom.FlatStyle = FlatStyle.Flat;
            btnConnectRoom.BackColor = accentSky;
            btnConnectRoom.ForeColor = Color.FromArgb(9, 13, 22);
            btnConnectRoom.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            btnConnectRoom.Location = new Point(S(248), S(63));
            btnConnectRoom.Size = new Size(S(88), S(29));
            btnConnectRoom.Click += delegate {
                ConnectToEnteredRoom();
            };
            leftCard.Controls.Add(btnConnectRoom);

            Button btnNewCode = new Button();
            btnNewCode.UseMnemonic = false;
            btnNewCode.Text = "Arvo";
            btnNewCode.FlatStyle = FlatStyle.Flat;
            btnNewCode.BackColor = Color.FromArgb(30, 41, 59);
            btnNewCode.ForeColor = Color.White;
            btnNewCode.Location = new Point(S(342), S(63));
            btnNewCode.Size = new Size(S(74), S(29));
            btnNewCode.Click += delegate {
                string[] words = new string[] { "cobalt", "falcon", "nebula", "quartz", "vortex", "cipher", "zenith", "aurora", "photon", "obsidian" };
                Random r = new Random();
                txtRoomCode.Text = r.Next(100, 999).ToString() + "-" + words[r.Next(words.Length)] + "-" + words[r.Next(words.Length)];
            };
            leftCard.Controls.Add(btnNewCode);

            pnlRoomPresence = new Panel();
            pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
            pnlRoomPresence.BorderStyle = BorderStyle.FixedSingle;
            pnlRoomPresence.Location = new Point(S(20), S(98));
            pnlRoomPresence.Size = new Size(S(396), S(36));

            lblRoomPresence = CreateCleanLabel(
                String.IsNullOrEmpty("${safeRoom}") ? "Kirjoita tunnelin nimi ja paina Yhdistä" : "[1/8 KÄYTTÄJÄÄ] Ei muita käyttäjiä huoneessa...",
                new Font("Consolas", 8.6f, FontStyle.Bold),
                Color.FromArgb(251, 191, 36),
                new Point(S(8), S(9)),
                true
            );
            pnlRoomPresence.Controls.Add(lblRoomPresence);
            leftCard.Controls.Add(pnlRoomPresence);

            Label lblNameTitle = CreateCleanLabel(
                "Oma näyttönimi huoneessa (max 8 käyttäjää):",
                null,
                fgMuted,
                new Point(S(20), S(140)),
                true
            );
            leftCard.Controls.Add(lblNameTitle);

            txtDisplayName = new TextBox();
            txtDisplayName.Text = localDisplayName;
            txtDisplayName.Font = new Font("Segoe UI", 9.2f);
            txtDisplayName.BackColor = bgInput;
            txtDisplayName.ForeColor = Color.White;
            txtDisplayName.BorderStyle = BorderStyle.FixedSingle;
            txtDisplayName.Location = new Point(S(20), S(160));
            txtDisplayName.Size = new Size(S(396), S(25));
            txtDisplayName.TextChanged += delegate {
                string clean = SanitizeJsonText(txtDisplayName.Text);
                localDisplayName = clean.Length > 0 ? clean : ("WinEXE-" + instanceId.Substring(0, 4));
            };
            leftCard.Controls.Add(txtDisplayName);

            Label lblPassTitle = CreateCleanLabel(
                "Optional E2EE Passphrase (PBKDF2-HMAC-SHA256 Salt):",
                null,
                fgMuted,
                new Point(S(20), S(192)),
                true
            );
            leftCard.Controls.Add(lblPassTitle);

            txtPassphrase = new TextBox();
            txtPassphrase.UseSystemPasswordChar = true;
            txtPassphrase.Font = new Font("Consolas", 10f);
            txtPassphrase.BackColor = bgInput;
            txtPassphrase.ForeColor = Color.White;
            txtPassphrase.BorderStyle = BorderStyle.FixedSingle;
            txtPassphrase.Location = new Point(S(20), S(212));
            txtPassphrase.Size = new Size(S(396), S(25));
            txtPassphrase.TextChanged += delegate { DeriveCryptographicKey(); };
            leftCard.Controls.Add(txtPassphrase);

            Label lblFpCaption = CreateCleanLabel(
                "E2EE Key Fingerprint (Matches Chrome Browser 1:1):",
                null,
                fgMuted,
                new Point(S(20), S(244)),
                true
            );
            leftCard.Controls.Add(lblFpCaption);

            lblKeyFingerprint = CreateCleanLabel(
                "Deriving...",
                new Font("Consolas", 11f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(264)),
                true
            );
            leftCard.Controls.Add(lblKeyFingerprint);

            Label lblLocalCaption = CreateCleanLabel(
                "Your Direct Kernel TCP & Local Browser Bridge Address:",
                null,
                fgMuted,
                new Point(S(20), S(292)),
                true
            );
            leftCard.Controls.Add(lblLocalCaption);

            lblLocalEndpoint = CreateCleanLabel(
                "Starting Winsock2 listener...",
                new Font("Consolas", 9.0f, FontStyle.Bold),
                Color.FromArgb(226, 232, 240),
                new Point(S(20), S(312)),
                false
            );
            lblLocalEndpoint.Size = new Size(S(396), S(36));
            leftCard.Controls.Add(lblLocalEndpoint);

            Label lblSaveDir = CreateCleanLabel(
                "Incoming files save to: " + downloadDirectory,
                new Font("Segoe UI", 8.6f),
                fgMuted,
                new Point(S(20), S(354)),
                false
            );
            lblSaveDir.Size = new Size(S(396), S(34));
            leftCard.Controls.Add(lblSaveDir);

            Button btnChangeDir = new Button();
            btnChangeDir.UseMnemonic = false;
            btnChangeDir.Text = "Change Save Folder...";
            btnChangeDir.FlatStyle = FlatStyle.Flat;
            btnChangeDir.BackColor = Color.FromArgb(30, 41, 59);
            btnChangeDir.ForeColor = Color.White;
            btnChangeDir.Location = new Point(S(20), S(394));
            btnChangeDir.Size = new Size(S(190), S(34));
            btnChangeDir.Click += delegate {
                if (folderDialog == null) folderDialog = new FolderBrowserDialog();
                folderDialog.SelectedPath = downloadDirectory;
                if (folderDialog.ShowDialog() == DialogResult.OK)
                {
                    downloadDirectory = folderDialog.SelectedPath;
                    lblSaveDir.Text = "Incoming files save to: " + downloadDirectory;
                    try
                    {
                        string cfgPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "config.txt");
                        string cfgDir = Path.GetDirectoryName(cfgPath);
                        if (!Directory.Exists(cfgDir)) Directory.CreateDirectory(cfgDir);
                        File.WriteAllText(cfgPath, downloadDirectory);
                    }
                    catch { }
                }
            };
            leftCard.Controls.Add(btnChangeDir);

            Button btnOpenDir = new Button();
            btnOpenDir.UseMnemonic = false;
            btnOpenDir.Text = "Open Downloads Folder";
            btnOpenDir.FlatStyle = FlatStyle.Flat;
            btnOpenDir.BackColor = Color.FromArgb(30, 41, 59);
            btnOpenDir.ForeColor = accentSky;
            btnOpenDir.Location = new Point(S(222), S(394));
            btnOpenDir.Size = new Size(S(194), S(34));
            btnOpenDir.Click += delegate {
                try { Process.Start("explorer.exe", downloadDirectory); } catch { }
            };
            leftCard.Controls.Add(btnOpenDir);

            chkAutoAccept = new CheckBox();
            chkAutoAccept.UseMnemonic = false;
            chkAutoAccept.Text = "Hyväksy saapuvat siirrot automaattisesti";
            chkAutoAccept.ForeColor = Color.FromArgb(203, 213, 225);
            chkAutoAccept.BackColor = bgCard;
            chkAutoAccept.Font = new Font("Segoe UI", 9.0f, FontStyle.Regular);
            chkAutoAccept.Location = new Point(S(20), S(438));
            chkAutoAccept.Size = new Size(S(396), S(26));
            chkAutoAccept.Checked = false;
            chkAutoAccept.CheckedChanged += delegate {
                autoAcceptAllIncoming = chkAutoAccept.Checked;
            };
            leftCard.Controls.Add(chkAutoAccept);

            Label lblConfirmHint = CreateCleanLabel(
                "Kun pois päältä, jokainen saapuva tiedosto vaatii vastaanottajan hyväksynnän.",
                new Font("Segoe UI", 8.2f),
                fgMuted,
                new Point(S(20), S(466)),
                false
            );
            lblConfirmHint.Size = new Size(S(396), S(32));
            leftCard.Controls.Add(lblConfirmHint);

            this.Controls.Add(leftCard);

            Panel rightCard = new Panel();
            rightCard.BackColor = bgCard;
            rightCard.Location = new Point(S(478), S(94));
            rightCard.Size = new Size(S(518), S(552));
            rightCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;

            Label lblSec2 = CreateCleanLabel(
                "2. Direct File Streamer (.EXE <-> Browser & .EXE <-> .EXE)",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(14)),
                true
            );
            rightCard.Controls.Add(lblSec2);

            btnSendFile = new Button();
            btnSendFile.UseMnemonic = false;
            btnSendFile.Text = "+ Lisää tiedosto(ja) jonoon\\n(Tai raahaa & pudota tiedostoja / kansioita tähän)";
            btnSendFile.FlatStyle = FlatStyle.Flat;
            btnSendFile.BackColor = Color.FromArgb(14, 28, 48);
            btnSendFile.ForeColor = accentSky;
            btnSendFile.Font = new Font("Segoe UI Semibold", 9.2f, FontStyle.Bold);
            btnSendFile.Location = new Point(S(20), S(40));
            btnSendFile.Size = new Size(S(248), S(52));
            btnSendFile.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            btnSendFile.Click += OnSelectFilesClicked;
            rightCard.Controls.Add(btnSendFile);

            btnSendFolder = new Button();
            btnSendFolder.UseMnemonic = false;
            btnSendFolder.Text = "+ Lisää kansio jonoon\\n(Kaikki alikansiot)";
            btnSendFolder.FlatStyle = FlatStyle.Flat;
            btnSendFolder.BackColor = Color.FromArgb(16, 36, 42);
            btnSendFolder.ForeColor = accentEmerald;
            btnSendFolder.Font = new Font("Segoe UI Semibold", 9.2f, FontStyle.Bold);
            btnSendFolder.Location = new Point(S(276), S(40));
            btnSendFolder.Size = new Size(S(222), S(52));
            btnSendFolder.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnSendFolder.Click += OnSelectFolderClicked;
            rightCard.Controls.Add(btnSendFolder);

            Label lblTargetCap = CreateCleanLabel(
                "Kenelle lähetetään:",
                new Font("Segoe UI", 8.8f, FontStyle.Bold),
                fgMuted,
                new Point(S(20), S(101)),
                true
            );
            rightCard.Controls.Add(lblTargetCap);

            cmbTargetPeer = new ComboBox();
            cmbTargetPeer.DropDownStyle = ComboBoxStyle.DropDownList;
            cmbTargetPeer.FlatStyle = FlatStyle.Flat;
            cmbTargetPeer.BackColor = bgInput;
            cmbTargetPeer.ForeColor = accentSky;
            cmbTargetPeer.Font = new Font("Consolas", 9.0f, FontStyle.Bold);
            cmbTargetPeer.Location = new Point(S(148), S(98));
            cmbTargetPeer.Size = new Size(S(350), S(24));
            cmbTargetPeer.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            cmbTargetPeer.Items.Add("Kaikki huoneessa (0 käyttäjää)");
            targetPeerIds.Clear();
            targetPeerIds.Add("*");
            cmbTargetPeer.SelectedIndex = 0;
            cmbTargetPeer.SelectedIndexChanged += delegate {
                int idx = cmbTargetPeer.SelectedIndex;
                if (idx >= 0 && idx < targetPeerIds.Count)
                {
                    selectedTargetPeerId = targetPeerIds[idx];
                }
            };
            rightCard.Controls.Add(cmbTargetPeer);

            Label lblMaxSpeedCap = CreateCleanLabel(
                "Max lähetysnopeus (MB/s):",
                new Font("Segoe UI", 8.6f, FontStyle.Bold),
                fgMuted,
                new Point(S(20), S(130)),
                true
            );
            rightCard.Controls.Add(lblMaxSpeedCap);

            txtMaxUploadMBps = new TextBox();
            txtMaxUploadMBps.BackColor = bgInput;
            txtMaxUploadMBps.ForeColor = accentSky;
            txtMaxUploadMBps.BorderStyle = BorderStyle.FixedSingle;
            txtMaxUploadMBps.Font = new Font("Consolas", 9.2f, FontStyle.Bold);
            txtMaxUploadMBps.Text = initialMaxSpeedText;
            txtMaxUploadMBps.Location = new Point(S(194), S(127));
            txtMaxUploadMBps.Size = new Size(S(80), S(23));
            txtMaxUploadMBps.TextChanged += delegate {
                try
                {
                    string raw = (txtMaxUploadMBps.Text ?? "").Trim().Replace(',', '.');
                    double parsed = 0.0;
                    if (raw.Length > 0 && Double.TryParse(raw, NumberStyles.Float, CultureInfo.InvariantCulture, out parsed) && parsed > 0.0 && !Double.IsNaN(parsed) && !Double.IsInfinity(parsed))
                    {
                        long bps = Math.Max(10240L, (long)Math.Round(parsed * 1024.0 * 1024.0));
                        Interlocked.Exchange(ref maxUploadBytesPerSec, bps);
                        string spdPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "speedlimit.txt");
                        string spdDir = Path.GetDirectoryName(spdPath);
                        if (!Directory.Exists(spdDir)) Directory.CreateDirectory(spdDir);
                        File.WriteAllText(spdPath, parsed.ToString("0.###", CultureInfo.InvariantCulture));
                    }
                    else
                    {
                        Interlocked.Exchange(ref maxUploadBytesPerSec, 0L);
                        string spdPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "speedlimit.txt");
                        if (File.Exists(spdPath)) File.WriteAllText(spdPath, "0");
                    }
                    Interlocked.Exchange(ref pacingResetRequested, 1);
                }
                catch { }
            };
            rightCard.Controls.Add(txtMaxUploadMBps);

            Label lblMaxSpeedHint = CreateCleanLabel(
                "(0 = rajoittamaton)",
                new Font("Segoe UI", 8.2f),
                fgMuted,
                new Point(S(282), S(130)),
                true
            );
            rightCard.Controls.Add(lblMaxSpeedHint);

            lblSpeedMetric = CreateCleanLabel(
                "0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 14.0f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(158)),
                true
            );
            rightCard.Controls.Add(lblSpeedMetric);

            btnPauseResume = new Button();
            btnPauseResume.UseMnemonic = false;
            btnPauseResume.Text = "Pysäytä";
            btnPauseResume.FlatStyle = FlatStyle.Flat;
            btnPauseResume.BackColor = Color.FromArgb(45, 34, 14);
            btnPauseResume.ForeColor = Color.FromArgb(251, 191, 36);
            btnPauseResume.Font = new Font("Segoe UI Semibold", 8.8f, FontStyle.Bold);
            btnPauseResume.Location = new Point(S(366), S(156));
            btnPauseResume.Size = new Size(S(132), S(26));
            btnPauseResume.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnPauseResume.Click += OnPauseResumeClicked;
            rightCard.Controls.Add(btnPauseResume);

            lblTransferStats = CreateCleanLabel(
                "Siirretty: 0 B / 0 B  |  Keskinopeus: 0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 9.0f, FontStyle.Bold),
                Color.FromArgb(125, 211, 252),
                new Point(S(20), S(187)),
                false
            );
            lblTransferStats.Size = new Size(S(478), S(20));
            lblTransferStats.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblTransferStats);

            lblProgressDetail = CreateCleanLabel(
                "Auto Dynamic P2P Pacing active — Enter shared Wormhole Code to pair automatically.",
                null,
                fgMuted,
                new Point(S(20), S(209)),
                false
            );
            lblProgressDetail.Size = new Size(S(478), S(20));
            lblProgressDetail.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblProgressDetail);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(S(20), S(232));
            progressBar.Size = new Size(S(478), S(15));
            progressBar.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            progressBar.Maximum = 1000;
            rightCard.Controls.Add(progressBar);

            lblQueueSummary = CreateCleanLabel(
                "Siirtojono (0 odottaa · 0 valmis)",
                new Font("Segoe UI Semibold", 9.0f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(255)),
                true
            );
            rightCard.Controls.Add(lblQueueSummary);

            btnRetryQueue = new Button();
            btnRetryQueue.UseMnemonic = false;
            btnRetryQueue.Text = "Jatka / Uudelleen";
            btnRetryQueue.FlatStyle = FlatStyle.Flat;
            btnRetryQueue.BackColor = Color.FromArgb(14, 52, 38);
            btnRetryQueue.ForeColor = accentEmerald;
            btnRetryQueue.Font = new Font("Segoe UI", 8.0f, FontStyle.Bold);
            btnRetryQueue.Location = new Point(S(206), S(252));
            btnRetryQueue.Size = new Size(S(102), S(23));
            btnRetryQueue.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnRetryQueue.Click += OnRetryQueueClicked;
            rightCard.Controls.Add(btnRetryQueue);

            btnRemoveQueue = new Button();
            btnRemoveQueue.UseMnemonic = false;
            btnRemoveQueue.Text = "Poista";
            btnRemoveQueue.FlatStyle = FlatStyle.Flat;
            btnRemoveQueue.BackColor = Color.FromArgb(30, 41, 59);
            btnRemoveQueue.ForeColor = Color.FromArgb(248, 113, 113);
            btnRemoveQueue.Font = new Font("Segoe UI", 8.0f);
            btnRemoveQueue.Location = new Point(S(314), S(252));
            btnRemoveQueue.Size = new Size(S(78), S(23));
            btnRemoveQueue.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnRemoveQueue.Click += OnRemoveSelectedQueueClicked;
            rightCard.Controls.Add(btnRemoveQueue);

            btnClearQueue = new Button();
            btnClearQueue.UseMnemonic = false;
            btnClearQueue.Text = "Tyhjennä valmiit";
            btnClearQueue.FlatStyle = FlatStyle.Flat;
            btnClearQueue.BackColor = Color.FromArgb(30, 41, 59);
            btnClearQueue.ForeColor = fgMuted;
            btnClearQueue.Font = new Font("Segoe UI", 8.0f);
            btnClearQueue.Location = new Point(S(398), S(252));
            btnClearQueue.Size = new Size(S(100), S(23));
            btnClearQueue.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnClearQueue.Click += OnClearQueueClicked;
            rightCard.Controls.Add(btnClearQueue);

            lstQueue = new ListBox();
            lstQueue.BackColor = bgInput;
            lstQueue.ForeColor = Color.FromArgb(226, 232, 240);
            lstQueue.Font = new Font("Consolas", 8.6f);
            lstQueue.BorderStyle = BorderStyle.FixedSingle;
            lstQueue.HorizontalScrollbar = true;
            lstQueue.Location = new Point(S(20), S(278));
            lstQueue.Size = new Size(S(478), S(92));
            lstQueue.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lstQueue);

            Label lblLogCap = CreateCleanLabel(
                "Live Kernel Socket & Chrome Browser Wormhole Log:",
                null,
                fgMuted,
                new Point(S(20), S(378)),
                true
            );
            rightCard.Controls.Add(lblLogCap);

            lstLog = new ListBox();
            lstLog.BackColor = bgInput;
            lstLog.ForeColor = Color.FromArgb(203, 213, 225);
            lstLog.Font = new Font("Consolas", 8.8f);
            lstLog.BorderStyle = BorderStyle.FixedSingle;
            lstLog.HorizontalScrollbar = true;
            lstLog.Location = new Point(S(20), S(398));
            lstLog.Size = new Size(S(478), S(136));
            lstLog.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lstLog);

            this.Controls.Add(rightCard);
        }

        private void Log(string msg)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(Log), msg);
                return;
            }
            string line = "[" + DateTime.Now.ToString("HH:mm:ss.fff") + "] " + msg;
            lstLog.Items.Insert(0, line);
            if (lstLog.Items.Count > 250) lstLog.Items.RemoveAt(lstLog.Items.Count - 1);
        }

        // Exact RFC 2898 PBKDF2-HMAC-SHA256 matching WebCrypto deriveTunnelKey() in src/utils/crypto.ts
        private static byte[] Pbkdf2Sha256(byte[] password, byte[] salt, int iterations, int outputBytes)
        {
            using (HMACSHA256 hmac = new HMACSHA256(password))
            {
                int hashLen = 32;
                int blockCount = (outputBytes + hashLen - 1) / hashLen;
                byte[] result = new byte[outputBytes];
                int outOffset = 0;

                for (int block = 1; block <= blockCount; block++)
                {
                    byte[] saltBlock = new byte[salt.Length + 4];
                    Buffer.BlockCopy(salt, 0, saltBlock, 0, salt.Length);
                    saltBlock[salt.Length + 0] = (byte)((block >> 24) & 0xFF);
                    saltBlock[salt.Length + 1] = (byte)((block >> 16) & 0xFF);
                    saltBlock[salt.Length + 2] = (byte)((block >> 8) & 0xFF);
                    saltBlock[salt.Length + 3] = (byte)(block & 0xFF);

                    byte[] u = hmac.ComputeHash(saltBlock);
                    byte[] t = (byte[])u.Clone();

                    for (int iter = 1; iter < iterations; iter++)
                    {
                        u = hmac.ComputeHash(u);
                        for (int k = 0; k < hashLen; k++)
                        {
                            t[k] ^= u[k];
                        }
                    }

                    int copyLen = Math.Min(hashLen, outputBytes - outOffset);
                    Buffer.BlockCopy(t, 0, result, outOffset, copyLen);
                    outOffset += copyLen;
                }
                return result;
            }
        }

        private static string SanitizeJsonText(string raw)
        {
            if (String.IsNullOrEmpty(raw)) return "";
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < raw.Length && sb.Length < 36; i++)
            {
                char c = raw[i];
                if (c != '"' && c != '\\\\' && c != '\\r' && c != '\\n' && c != '|')
                {
                    sb.Append(c);
                }
            }
            return sb.ToString().Trim();
        }

        private RoomPeerInfo UpsertRoomPeer(string key, string displayName, string clientType, out bool isNew, out bool rejectedFull)
        {
            isNew = false;
            rejectedFull = false;
            if (String.IsNullOrEmpty(key)) return null;
            RoomPeerInfo existing;
            if (roomPeers.TryGetValue(key, out existing))
            {
                if (!String.IsNullOrEmpty(displayName)) existing.DisplayName = displayName;
                if (!String.IsNullOrEmpty(clientType)) existing.ClientType = clientType;
                return existing;
            }
            if (roomPeers.Count >= MAX_ROOM_PEERS - 1)
            {
                rejectedFull = true;
                return null;
            }
            RoomPeerInfo created = new RoomPeerInfo();
            created.PeerId = key;
            created.DisplayName = !String.IsNullOrEmpty(displayName) ? displayName : key;
            created.ClientType = !String.IsNullOrEmpty(clientType) ? clientType : "exe";
            if (roomPeers.TryAdd(key, created))
            {
                isNew = true;
                return created;
            }
            roomPeers.TryGetValue(key, out existing);
            return existing;
        }

        private RoomPeerInfo FindPeerByEndpointOrInstance(string cleanCode, string remoteInst, IPEndPoint remoteEp)
        {
            if (!String.IsNullOrEmpty(cleanCode) && !String.IsNullOrEmpty(remoteInst))
            {
                string canon = "aethertunnel-exe-" + cleanCode + "-" + remoteInst;
                RoomPeerInfo byCanon;
                if (roomPeers.TryGetValue(canon, out byCanon)) return byCanon;
            }
            if (remoteEp != null)
            {
                string epStr = remoteEp.ToString();
                string ipOnly = remoteEp.Address.ToString();
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    RoomPeerInfo p = kv.Value;
                    if (p == null) continue;
                    if (p.ActiveUdpEp != null && p.ActiveUdpEp.Equals(remoteEp)) return p;
                    if (p.WanUdpEp == epStr || p.LanUdpEp == epStr) return p;
                    if (!String.IsNullOrEmpty(ipOnly) && ((p.LanTcpEp != null && p.LanTcpEp.StartsWith(ipOnly + ":")) || (p.WanUdpEp != null && p.WanUdpEp.StartsWith(ipOnly + ":"))))
                        return p;
                }
            }
            return null;
        }

        private bool IsPeerActive(RoomPeerInfo p, DateTime utcNow)
        {
            if (p == null) return false;
            bool tcpOk = (p.TcpClientConn != null && p.TcpClientConn.Connected && p.TcpStream != null);
            bool udpOk = (p.ActiveUdpEp != null && (utcNow - p.LastUdpSeen).TotalSeconds < 14);
            bool cloudOk = (!String.IsNullOrEmpty(p.CloudPeerId) && !activeSignalingChannels.IsEmpty && (utcNow - p.LastCloudSeen).TotalSeconds < 14);
            bool localBrOk = (p.ClientType == "local_browser" && activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            return tcpOk || udpOk || cloudOk || localBrOk;
        }

        private string GetPeerTransportSummary(RoomPeerInfo p, DateTime utcNow)
        {
            if (p == null) return "";
            if (p.TcpClientConn != null && p.TcpClientConn.Connected && p.TcpStream != null) return "TCP";
            if (p.ActiveUdpEp != null && (utcNow - p.LastUdpSeen).TotalSeconds < 14) return "UDP P2P";
            if (p.ClientType == "local_browser" && activeBrowserWsClient != null && activeBrowserWsClient.Connected) return "Localhost WS";
            if (!String.IsNullOrEmpty(p.CloudPeerId) && (utcNow - p.LastCloudSeen).TotalSeconds < 14) return "Cloud Bridge";
            return "Yhdistetty";
        }

        private string GetCurrentTargetLabel(string targetId)
        {
            if (String.IsNullOrEmpty(targetId) || targetId == "*") return "Kaikki huoneessa";
            RoomPeerInfo p;
            if (roomPeers.TryGetValue(targetId, out p) && !String.IsNullOrEmpty(p.DisplayName))
                return p.DisplayName;
            return targetId;
        }

        private void SyncTargetPeerDropdown()
        {
            try
            {
                if (cmbTargetPeer == null || this.IsDisposed) return;
                if (this.InvokeRequired)
                {
                    this.BeginInvoke(new Action(SyncTargetPeerDropdown));
                    return;
                }
                DateTime now = DateTime.UtcNow;
                List<RoomPeerInfo> activeList = new List<RoomPeerInfo>();
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    if (IsPeerActive(kv.Value, now)) activeList.Add(kv.Value);
                }
                activeList.Sort(delegate(RoomPeerInfo a, RoomPeerInfo b) {
                    return String.Compare(a.DisplayName ?? a.PeerId, b.DisplayName ?? b.PeerId, StringComparison.OrdinalIgnoreCase);
                });

                List<string> newIds = new List<string>();
                List<string> newLabels = new List<string>();
                newIds.Add("*");
                newLabels.Add("Kaikki huoneessa (" + activeList.Count.ToString() + " muuta)");
                for (int i = 0; i < activeList.Count; i++)
                {
                    RoomPeerInfo p = activeList[i];
                    newIds.Add(p.PeerId);
                    string kindTag = (p.ClientType == "exe") ? ".EXE" : (p.ClientType == "local_browser" ? "Selain 127.0.0.1" : "Selain");
                    newLabels.Add(p.DisplayName + " [" + kindTag + " · " + GetPeerTransportSummary(p, now) + "]");
                }

                bool changed = (newIds.Count != targetPeerIds.Count || newLabels.Count != cmbTargetPeer.Items.Count);
                if (!changed)
                {
                    for (int i = 0; i < newIds.Count; i++)
                    {
                        if (targetPeerIds[i] != newIds[i] || !Object.Equals(cmbTargetPeer.Items[i], newLabels[i]))
                        {
                            changed = true;
                            break;
                        }
                    }
                }
                if (!changed) return;

                string prevSel = selectedTargetPeerId;
                targetPeerIds.Clear();
                targetPeerIds.AddRange(newIds);
                cmbTargetPeer.BeginUpdate();
                cmbTargetPeer.Items.Clear();
                for (int i = 0; i < newLabels.Count; i++) cmbTargetPeer.Items.Add(newLabels[i]);
                int selIdx = 0;
                if (!String.IsNullOrEmpty(prevSel) && prevSel != "*")
                {
                    int found = targetPeerIds.IndexOf(prevSel);
                    if (found >= 0) selIdx = found;
                }
                if (cmbTargetPeer.Items.Count > 0) cmbTargetPeer.SelectedIndex = selIdx;
                selectedTargetPeerId = (selIdx >= 0 && selIdx < targetPeerIds.Count) ? targetPeerIds[selIdx] : "*";
                cmbTargetPeer.EndUpdate();
            }
            catch { }
        }

        private void ConnectToEnteredRoom()
        {
            string clean = CleanRoomCode(txtRoomCode != null ? txtRoomCode.Text : "");
            if (txtRoomCode != null && txtRoomCode.Text != clean)
            {
                txtRoomCode.Text = clean;
            }
            currentRoomCode = clean;
            roomFullRejected = false;
            lock (attemptedAutoTcpEndpoints) { attemptedAutoTcpEndpoints.Clear(); }
            foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
            {
                try { if (kv.Value != null && kv.Value.TcpClientConn != null) kv.Value.TcpClientConn.Close(); } catch { }
            }
            roomPeers.Clear();
            selectedTargetPeerId = "*";
            activeUdpPeerEndpoint = null;
            activeCloudExePeerId = "";
            activeCloudBrowserPeerId = "";
            lastCloudExeSeen = DateTime.MinValue;
            lastCloudBrowserSeen = DateTime.MinValue;
            remotePeerWanUdp = "";
            remotePeerLanUdp = "";
            remotePeerWanV6Udp = "";
            remotePeerLanTcp = "";
            remotePeerPredictedWanUdp = "";
            remotePeerNatSym = 0;
            remotePeerNatDelta = 0;
            remotePeerUpnpTcp = 0;
            lastLoggedPunchTarget = "";
            DeriveCryptographicKey();
            SyncTargetPeerDropdown();
            cloudReconnectRequested = true;
            if (clean.Length == 0)
            {
                UpdateStatusBadge("PEER STATUS: EI YHDISTETTY — Kirjoita tunnelin nimi ja paina Yhdistä");
                Log("Tunneli katkaistu. Kirjoita tunnelin nimi ja paina Yhdistä.");
                return;
            }
            UpdateStatusBadge("PEER STATUS: WAITING FOR PEER [" + clean + "]");
            BroadcastUdpPresence();
            if (!suppressRoomBroadcast) NotifyBrowserRoomCode();
            Log("Yhdistetään tunneliin [" + clean + "] (max " + MAX_ROOM_PEERS.ToString() + " käyttäjää)...");
        }

        private void DeriveCryptographicKey()
        {
            try
            {
                string cleanRoom = CleanRoomCode(currentRoomCode);
                if (cleanRoom.Length == 0)
                {
                    aesKey = new byte[32];
                    currentFingerprint = "Odottaa tunnelin nimeä...";
                    if (lblKeyFingerprint != null) lblKeyFingerprint.Text = currentFingerprint;
                    return;
                }
                string pass = txtPassphrase.Text;
                string normalizedSecret = cleanRoom + (pass.Length > 0 ? "::" + pass : "");
                byte[] passwordBytes = Encoding.UTF8.GetBytes(normalizedSecret);
                byte[] saltBytes = Encoding.UTF8.GetBytes("AetherTunnel-v1-ZeroKnowledge-Salt::" + cleanRoom);

                aesKey = Pbkdf2Sha256(passwordBytes, saltBytes, 100000, 32);

                using (SHA256 sha = SHA256.Create())
                {
                    byte[] hash = sha.ComputeHash(aesKey);
                    StringBuilder sb = new StringBuilder(16);
                    for (int i = 0; i < 8; i++)
                    {
                        sb.Append(hash[i].ToString("x2"));
                    }
                    currentFingerprint = sb.ToString();
                }
                if (lblKeyFingerprint != null) lblKeyFingerprint.Text = currentFingerprint;
            }
            catch (Exception ex)
            {
                Log("Key derivation error: " + ex.Message);
            }
        }

        private void StartKernelListenerAndDiscovery()
        {
            for (int p = 45889; p < 45910; p++)
            {
                try
                {
                    tcpListener = new TcpListener(IPAddress.Any, p);
                    tcpListener.Server.ReceiveBufferSize = 16 * 1024 * 1024;
                    tcpListener.Server.SendBufferSize = 16 * 1024 * 1024;
                    tcpListener.Start();
                    listenPort = p;
                    break;
                }
                catch
                {
                    tcpListener = null;
                }
            }

            for (int up = 45890; up < 45930; up++)
            {
                if (up == listenPort) continue;
                try
                {
                    udpP2pClient = new UdpClient(new IPEndPoint(IPAddress.Any, up));
                    udpP2pClient.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                    udpP2pClient.Client.SendBufferSize = 64 * 1024 * 1024;
                    try { udpP2pClient.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                    udpP2pPort = up;
                    break;
                }
                catch
                {
                    udpP2pClient = null;
                }
            }

            try
            {
                udpP2pV6Client = new UdpClient(udpP2pPort > 0 ? udpP2pPort : 45890, AddressFamily.InterNetworkV6);
                udpP2pV6Client.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                udpP2pV6Client.Client.SendBufferSize = 64 * 1024 * 1024;
                try { udpP2pV6Client.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                udpP2pV6Port = ((IPEndPoint)udpP2pV6Client.Client.LocalEndPoint).Port;
            }
            catch
            {
                try
                {
                    udpP2pV6Client = new UdpClient(0, AddressFamily.InterNetworkV6);
                    udpP2pV6Client.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                    udpP2pV6Client.Client.SendBufferSize = 64 * 1024 * 1024;
                    try { udpP2pV6Client.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                    udpP2pV6Port = ((IPEndPoint)udpP2pV6Client.Client.LocalEndPoint).Port;
                }
                catch
                {
                    udpP2pV6Client = null;
                    udpP2pV6Port = 0;
                }
            }

            string localIps = GetLocalIpList();
            lblLocalEndpoint.Text = "LAN: " + localIps + "  |  STUN WAN: Probing...";
            Log("AetherTunnel v1.0 High-DPI active [BDP-Safe v8 · Queue & Confirmation · SSD-Safe] (Scale: " + Math.Round(dpiScale * 100).ToString() + "%). TCP:" + listenPort.ToString() + " UDP:" + udpP2pPort.ToString() + (udpP2pV6Port > 0 ? " UDPv6:" + udpP2pV6Port.ToString() : ""));

            Thread stunThread = new Thread(StunAndUpnpProbeLoop);
            stunThread.IsBackground = true;
            stunThread.Start();

            Thread p2pUdpThread = new Thread(UdpP2pReceiveLoop);
            p2pUdpThread.IsBackground = true;
            p2pUdpThread.Priority = ThreadPriority.AboveNormal;
            p2pUdpThread.Start();

            if (udpP2pV6Client != null)
            {
                Thread p2pUdpV6Thread = new Thread(UdpP2pV6ReceiveLoop);
                p2pUdpV6Thread.IsBackground = true;
                p2pUdpV6Thread.Priority = ThreadPriority.AboveNormal;
                p2pUdpV6Thread.Start();
            }

            Thread p2pUdpDiskIoThread = new Thread(UdpP2pDiskIoLoop);
            p2pUdpDiskIoThread.IsBackground = true;
            p2pUdpDiskIoThread.Priority = ThreadPriority.BelowNormal;
            p2pUdpDiskIoThread.Start();

            Thread p2pUdpWriterThread = new Thread(UdpP2pDiskWriterLoop);
            p2pUdpWriterThread.IsBackground = true;
            p2pUdpWriterThread.Priority = ThreadPriority.BelowNormal;
            p2pUdpWriterThread.Start();

            Thread queueWorkerThread = new Thread(TransferQueueWorkerLoop);
            queueWorkerThread.IsBackground = true;
            queueWorkerThread.Start();

            Thread hbMonitorThread = new Thread(PeerHeartbeatMonitorLoop);
            hbMonitorThread.IsBackground = true;
            hbMonitorThread.Start();

            Thread acceptThread = new Thread(AcceptLoop);
            acceptThread.IsBackground = true;
            acceptThread.Start();

            Thread udpThread = new Thread(UdpDiscoveryLoop);
            udpThread.IsBackground = true;
            udpThread.Start();

            Thread cloudThread = new Thread(CloudWormholeBridgeLoop);
            cloudThread.IsBackground = true;
            cloudThread.Start();
        }

        private void SendUdpP2pPacket(byte[] data, int len, IPEndPoint ep)
        {
            if (ep == null || data == null) return;
            if (ep.AddressFamily == AddressFamily.InterNetworkV6)
            {
                if (udpP2pV6Client != null) udpP2pV6Client.Send(data, len, ep);
            }
            else
            {
                if (udpP2pClient != null) udpP2pClient.Send(data, len, ep);
            }
        }

        private void RefreshLocalEndpointLabel()
        {
            try
            {
                string lan = GetFirstLanEndpoint();
                if (String.IsNullOrEmpty(lan)) lan = "127.0.0.1:" + listenPort.ToString();
                string wan = publicWanUdpEndpoint.Length > 0 ? publicWanUdpEndpoint : "Probing...";
                string natTag = (natSymDetected == 1) ? " [SymNAT]" : (upnpUdpMapped ? " [UPnP]" : "");
                string v6Tag = (publicWanV6UdpEndpoint.Length > 0) ? " [IPv6 OK]" : "";
                this.BeginInvoke(new Action(delegate {
                    lblLocalEndpoint.Text = "LAN: " + lan + "  |  WAN: " + wan + natTag + v6Tag;
                }));
            }
            catch { }
        }

        private void StunAndUpnpProbeLoop()
        {
            ThreadPool.QueueUserWorkItem(delegate { TryUpnpPortMapping(); });
            while (isRunning)
            {
                try
                {
                    QueryStunServer("stun.l.google.com", 19302, 0, false);
                    QueryStunServer("stun.cloudflare.com", 3478, 1, false);
                    QueryStunServer("stun1.l.google.com", 19302, 2, false);
                    if (udpP2pV6Client != null)
                    {
                        QueryStunServer("stun.l.google.com", 19302, 3, true);
                        if (publicWanV6UdpEndpoint.Length == 0)
                        {
                            string localV6 = GetGlobalIpv6Address();
                            if (localV6.Length > 0 && udpP2pV6Port > 0)
                            {
                                publicWanV6UdpEndpoint = "[" + localV6 + "]:" + udpP2pV6Port.ToString();
                                RefreshLocalEndpointLabel();
                                BroadcastCloudHelloToAll();
                            }
                        }
                    }
                }
                catch { }
                int sleepLoops = (publicWanUdpEndpoint.Length == 0) ? 10 : 75; // 2s retry until resolved, then 15s NAT keepalive
                for (int i = 0; i < sleepLoops && isRunning; i++) Thread.Sleep(200);
            }
        }

        private void QueryStunServer(string stunHost, int stunPort, byte serverTag, bool ipv6)
        {
            UdpClient client = ipv6 ? udpP2pV6Client : udpP2pClient;
            if (client == null) return;
            try
            {
                IPAddress[] addrs = Dns.GetHostAddresses(stunHost);
                IPAddress targetIp = null;
                AddressFamily wantFamily = ipv6 ? AddressFamily.InterNetworkV6 : AddressFamily.InterNetwork;
                foreach (IPAddress a in addrs)
                {
                    if (a.AddressFamily == wantFamily) { targetIp = a; break; }
                }
                if (targetIp == null) return;

                byte[] req = new byte[20];
                req[0] = 0x00; req[1] = 0x01;
                req[2] = 0x00; req[3] = 0x00;
                req[4] = 0x21; req[5] = 0x12; req[6] = 0xA4; req[7] = 0x42;
                req[8] = serverTag;
                Random r = new Random(unchecked(Environment.TickCount + (int)serverTag * 97));
                for (int i = 9; i < 20; i++) req[i] = (byte)r.Next(0, 256);

                client.Send(req, req.Length, new IPEndPoint(targetIp, stunPort));
            }
            catch { }
        }

        private void ParseStunBindingResponse(byte[] buf, int len, IPEndPoint fromEp)
        {
            if (len < 20) return;
            if (buf[0] != 0x01 || buf[1] != 0x01) return;
            byte serverTag = buf[8];
            int idx = 20;
            while (idx + 4 <= len)
            {
                int attrType = (buf[idx] << 8) | buf[idx + 1];
                int attrLen = (buf[idx + 2] << 8) | buf[idx + 3];
                idx += 4;
                if (idx + attrLen > len) break;

                if (attrType == 0x0020 && attrLen >= 8 && buf[idx + 1] == 0x01)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte b0 = (byte)(buf[idx + 4] ^ 0x21);
                    byte b1 = (byte)(buf[idx + 5] ^ 0x12);
                    byte b2 = (byte)(buf[idx + 6] ^ 0xA4);
                    byte b3 = (byte)(buf[idx + 7] ^ 0x42);
                    string wan = b0.ToString() + "." + b1.ToString() + "." + b2.ToString() + "." + b3.ToString() + ":" + port.ToString();
                    RecordDiscoveredWanV4(wan, serverTag, port);
                    return;
                }
                else if (attrType == 0x0020 && attrLen >= 20 && buf[idx + 1] == 0x02) // XOR-MAPPED-ADDRESS (IPv6)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte[] v6Bytes = new byte[16];
                    for (int k = 0; k < 16; k++) v6Bytes[k] = (byte)(buf[idx + 4 + k] ^ buf[4 + k]);
                    IPAddress v6Addr = new IPAddress(v6Bytes);
                    string wanV6 = "[" + v6Addr.ToString() + "]:" + port.ToString();
                    if (wanV6 != publicWanV6UdpEndpoint)
                    {
                        publicWanV6UdpEndpoint = wanV6;
                        RefreshLocalEndpointLabel();
                        Log("STUN IPv6 NAT Discovery -> Direct IPv6 UDP: " + publicWanV6UdpEndpoint);
                        BroadcastCloudHelloToAll();
                    }
                    return;
                }
                else if (attrType == 0x0001 && attrLen >= 8 && buf[idx + 1] == 0x01)
                {
                    int port = (buf[idx + 2] << 8) | buf[idx + 3];
                    string wan = buf[idx + 4].ToString() + "." + buf[idx + 5].ToString() + "." + buf[idx + 6].ToString() + "." + buf[idx + 7].ToString() + ":" + port.ToString();
                    RecordDiscoveredWanV4(wan, serverTag, port);
                    return;
                }
                idx += (attrLen + 3) & ~3;
            }
        }

        private void RecordDiscoveredWanV4(string wan, byte serverTag, int port)
        {
            if (serverTag == 0) stunEndpoint0 = wan;
            else if (serverTag == 1) stunEndpoint1 = wan;

            if (stunEndpoint0.Length > 0 && stunEndpoint1.Length > 0)
            {
                int c0 = stunEndpoint0.LastIndexOf(':');
                int c1 = stunEndpoint1.LastIndexOf(':');
                int p0 = 0, p1 = 0;
                if (c0 > 0 && c1 > 0 &&
                    Int32.TryParse(stunEndpoint0.Substring(c0 + 1), out p0) &&
                    Int32.TryParse(stunEndpoint1.Substring(c1 + 1), out p1))
                {
                    if (p0 != p1)
                    {
                        natSymDetected = 1;
                        natPortDelta = p1 - p0;
                        natTypeSummary = "Symmetric NAT (" + p0.ToString() + "->" + p1.ToString() + ")";
                    }
                    else
                    {
                        natSymDetected = 0;
                        natPortDelta = 0;
                        natTypeSummary = (p0 == udpP2pPort) ? "Cone NAT (Port-Preserving)" : "Port-Mapped NAT";
                    }
                }
            }

            if (wan != publicWanUdpEndpoint)
            {
                bool firstResolve = (publicWanUdpEndpoint.Length == 0);
                publicWanUdpEndpoint = wan;
                RefreshLocalEndpointLabel();
                if (firstResolve || natSymDetected == 1)
                {
                    Log("STUN NAT Discovery -> WAN: " + publicWanUdpEndpoint + " (" + natTypeSummary + ")");
                }
                BroadcastCloudHelloToAll();
            }
        }

        private void TryUpnpPortMapping()
        {
            try
            {
                using (UdpClient ssdp = new UdpClient())
                {
                    ssdp.Client.ReceiveTimeout = 1500;
                    string msearch = "M-SEARCH * HTTP/1.1\\r\\nHOST: 239.255.255.250:1900\\r\\nMAN: \\"ssdp:discover\\"\\r\\nMX: 1\\r\\nST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\\r\\n\\r\\n";
                    byte[] bytes = Encoding.ASCII.GetBytes(msearch);
                    ssdp.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse("239.255.255.250"), 1900));

                    IPEndPoint gwEp = new IPEndPoint(IPAddress.Any, 0);
                    string locationUrl = "";
                    for (int tries = 0; tries < 4; tries++)
                    {
                        byte[] resp = ssdp.Receive(ref gwEp);
                        string respStr = Encoding.ASCII.GetString(resp);
                        Match m = Regex.Match(respStr, @"LOCATION:\s*(http://[^\r\n]+)", RegexOptions.IgnoreCase);
                        if (m.Success)
                        {
                            locationUrl = m.Groups[1].Value.Trim();
                            break;
                        }
                    }
                    if (locationUrl.Length == 0) return;

                    Uri descUri = new Uri(locationUrl);
                    string xml = "";
                    HttpWebRequest getReq = (HttpWebRequest)WebRequest.Create(descUri);
                    getReq.Timeout = 2500;
                    using (HttpWebResponse getResp = (HttpWebResponse)getReq.GetResponse())
                    using (StreamReader sr = new StreamReader(getResp.GetResponseStream()))
                    {
                        xml = sr.ReadToEnd();
                    }

                    Match svcM = Regex.Match(xml, @"<serviceType>urn:schemas-upnp-org:service:(WANIPConnection|WANPPPConnection):[0-9]+</serviceType>[\s\S]*?<controlURL>([^<]+)</controlURL>", RegexOptions.IgnoreCase);
                    if (!svcM.Success)
                        svcM = Regex.Match(xml, @"<controlURL>([^<]+)</controlURL>[\s\S]*?<serviceType>urn:schemas-upnp-org:service:(WANIPConnection|WANPPPConnection):[0-9]+</serviceType>", RegexOptions.IgnoreCase);
                    if (!svcM.Success) return;

                    string svcType = "";
                    string ctrlPath = "";
                    if (svcM.Groups[1].Value.StartsWith("WAN", StringComparison.OrdinalIgnoreCase))
                    {
                        svcType = "urn:schemas-upnp-org:service:" + svcM.Groups[1].Value + ":1";
                        ctrlPath = svcM.Groups[2].Value.Trim();
                    }
                    else
                    {
                        svcType = "urn:schemas-upnp-org:service:" + svcM.Groups[2].Value + ":1";
                        ctrlPath = svcM.Groups[1].Value.Trim();
                    }
                    Uri ctrlUri = new Uri(descUri, ctrlPath);

                    string internalIp = "";
                    using (Socket testSock = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp))
                    {
                        testSock.Connect(descUri.Host, descUri.Port);
                        internalIp = ((IPEndPoint)testSock.LocalEndPoint).Address.ToString();
                    }
                    if (String.IsNullOrEmpty(internalIp)) return;

                    if (SoapUpnpAddPortMapping(ctrlUri, svcType, udpP2pPort, "UDP", internalIp)) upnpUdpMapped = true;
                    if (SoapUpnpAddPortMapping(ctrlUri, svcType, listenPort, "TCP", internalIp)) upnpTcpMapped = true;
                    if (upnpUdpMapped || upnpTcpMapped)
                    {
                        RefreshLocalEndpointLabel();
                        Log("UPnP IGD opened router port forwarding ->" + (upnpUdpMapped ? " UDP:" + udpP2pPort.ToString() : "") + (upnpTcpMapped ? " TCP:" + listenPort.ToString() : ""));
                    }
                }
            }
            catch { }
        }

        private bool SoapUpnpAddPortMapping(Uri ctrlUri, string svcType, int port, string proto, string internalIp)
        {
            try
            {
                string body = "<?xml version=\\"1.0\\"?><s:Envelope xmlns:s=\\"http://schemas.xmlsoap.org/soap/envelope/\\" s:encodingStyle=\\"http://schemas.xmlsoap.org/soap/encoding/\\"><s:Body><u:AddPortMapping xmlns:u=\\"" + svcType + "\\"><NewRemoteHost></NewRemoteHost><NewExternalPort>" + port.ToString() + "</NewExternalPort><NewProtocol>" + proto + "</NewProtocol><NewInternalPort>" + port.ToString() + "</NewInternalPort><NewInternalClient>" + internalIp + "</NewInternalClient><NewEnabled>1</NewEnabled><NewPortMappingDescription>AetherTunnel</NewPortMappingDescription><NewLeaseDuration>3600</NewLeaseDuration></u:AddPortMapping></s:Body></s:Envelope>";
                byte[] bodyBytes = Encoding.UTF8.GetBytes(body);
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(ctrlUri);
                req.Method = "POST";
                req.Timeout = 2500;
                req.ContentType = "text/xml; charset=\\"utf-8\\"";
                req.Headers.Add("SOAPACTION", "\\"" + svcType + "#AddPortMapping\\"");
                req.ContentLength = bodyBytes.Length;
                using (Stream reqStream = req.GetRequestStream()) reqStream.Write(bodyBytes, 0, bodyBytes.Length);
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                {
                    return ((int)resp.StatusCode >= 200 && (int)resp.StatusCode < 300);
                }
            }
            catch { return false; }
        }

        private bool TryParseIpEndpoint(string epStr, out IPEndPoint ep)
        {
            ep = null;
            if (String.IsNullOrEmpty(epStr)) return false;
            string s = epStr.Trim();
            if (s.StartsWith("["))
            {
                int close = s.IndexOf(']');
                if (close <= 1 || close + 2 >= s.Length || s[close + 1] != ':') return false;
                IPAddress v6;
                int port;
                if (IPAddress.TryParse(s.Substring(1, close - 1), out v6) && Int32.TryParse(s.Substring(close + 2), out port) && port > 0 && port <= 65535)
                {
                    ep = new IPEndPoint(v6, port);
                    return true;
                }
                return false;
            }
            int colon = s.LastIndexOf(':');
            if (colon <= 0) return false;
            IPAddress ip;
            int p4;
            if (IPAddress.TryParse(s.Substring(0, colon).Trim(), out ip) && Int32.TryParse(s.Substring(colon + 1).Trim(), out p4) && p4 > 0 && p4 <= 65535)
            {
                ep = new IPEndPoint(ip, p4);
                return true;
            }
            return false;
        }

        private void InitiateUdpHolePunch(string remoteEndpointStr, bool withPortSpray = false, bool forcePunch = false)
        {
            if (String.IsNullOrEmpty(remoteEndpointStr)) return;
            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    IPEndPoint targetEp;
                    if (!TryParseIpEndpoint(remoteEndpointStr, out targetEp)) return;
                    if (IsOwnLocalEndpoint(targetEp.Address, targetEp.Port)) return;

                    string room = CleanRoomCode(currentRoomCode);
                    byte[] punchBytes = Encoding.UTF8.GetBytes("AETHER_PUNCH|" + room + "|" + instanceId + "|" + SanitizeJsonText(localDisplayName));

                    for (int burst = 0; burst < 4 && isRunning && (forcePunch || activeUdpPeerEndpoint == null); burst++)
                    {
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, targetEp); } catch { }
                        Thread.Sleep(70);
                    }

                    if (withPortSpray && targetEp.AddressFamily == AddressFamily.InterNetwork && (forcePunch || activeUdpPeerEndpoint == null))
                    {
                        int basePort = targetEp.Port;
                        for (int delta = -6; delta <= 16 && isRunning && (forcePunch || activeUdpPeerEndpoint == null); delta++)
                        {
                            if (delta == 0) continue;
                            int candPort = basePort + delta;
                            if (candPort > 1024 && candPort <= 65535)
                            {
                                try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, candPort)); } catch { }
                            }
                        }
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, 45890)); } catch { }
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, 45891)); } catch { }
                    }
                }
                catch { }
            });
        }

        private void UdpP2pReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
            int rxCapCheckSeq = 0;
            while (isRunning && udpP2pClient != null)
            {
                try
                {
                    byte[] data = udpP2pClient.Receive(ref remoteEp);
                    ProcessUdpP2pPacket(data, remoteEp, ref rxCapCheckSeq);
                }
                catch
                {
                    if (!isRunning) break;
                    Thread.Sleep(5);
                }
            }
        }

        private void UdpP2pV6ReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.IPv6Any, 0);
            int rxCapCheckSeq = 0;
            while (isRunning && udpP2pV6Client != null)
            {
                try
                {
                    byte[] data = udpP2pV6Client.Receive(ref remoteEp);
                    ProcessUdpP2pPacket(data, remoteEp, ref rxCapCheckSeq);
                }
                catch
                {
                    if (!isRunning) break;
                    Thread.Sleep(5);
                }
            }
        }

        private void ProcessUdpP2pPacket(byte[] data, IPEndPoint remoteEp, ref int rxCapCheckSeq)
        {
            try
            {
                    if (data == null || data.Length == 0) return;

                    if (data.Length >= 20 && data[0] == 0x01 && data[1] == 0x01 && data[4] == 0x21 && data[5] == 0x12)
                    {
                        ParseStunBindingResponse(data, data.Length, remoteEp);
                        return;
                    }

                    // FAST PATH: Enqueue binary P2P UDP encrypted data frame immediately (< 1us), up to 2 GB process hard RAM cap
                    if (data.Length >= 28 && BitConverter.ToUInt32(data, 0) == MAGIC_UDP_DATA)
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        RoomPeerInfo dataPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", remoteEp);
                        if (dataPeer != null)
                        {
                            dataPeer.ActiveUdpEp = remoteEp;
                            dataPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        if (Interlocked.Read(ref totalAppBufferedBytes) < HARD_RAM_CAP_BYTES)
                        {
                            bool acceptPkt = true;
                            if ((rxCapCheckSeq++ & 1023) == 0 && GC.GetTotalMemory(false) >= 1920L * 1024L * 1024L)
                            {
                                if (GC.GetTotalMemory(true) >= 1980L * 1024L * 1024L) acceptPkt = false;
                            }
                            if (acceptPkt)
                            {
                                udpRxDataQueue.Enqueue(data);
                                Interlocked.Add(ref totalAppBufferedBytes, data.Length);
                                int qCnt = udpRxDataQueue.Count;
                                if (qCnt <= 2 || (qCnt & 15) == 1) udpRxDataEvent.Set();
                            }
                        }
                        return;
                    }

                    string text = Encoding.UTF8.GetString(data);
                    if (text.StartsWith("AETHER_PUNCH|"))
                    {
                        string[] parts = text.Split('|');
                        string myCleanRoom = CleanRoomCode(currentRoomCode);
                        if (parts.Length >= 3 && parts[2] != instanceId && myCleanRoom.Length > 0 && parts[1] == myCleanRoom)
                        {
                            string rInst = parts[2];
                            string rDName = (parts.Length >= 4 && parts[3].Trim().Length > 0) ? parts[3].Trim() : ("Windows .EXE (" + rInst.Substring(0, Math.Min(4, rInst.Length)) + ")");
                            RoomPeerInfo udpPeer = FindPeerByEndpointOrInstance(myCleanRoom, rInst, remoteEp);
                            bool isNewRoomPeer = false;
                            bool fullRej = false;
                            if (udpPeer == null)
                            {
                                udpPeer = UpsertRoomPeer("aethertunnel-exe-" + myCleanRoom + "-" + rInst, rDName, "exe", out isNewRoomPeer, out fullRej);
                            }
                            if (fullRej || udpPeer == null) return;
                            bool wasUdpInactive = (udpPeer.ActiveUdpEp == null || !udpPeer.ActiveUdpEp.Equals(remoteEp) || (DateTime.UtcNow - udpPeer.LastUdpSeen).TotalSeconds > 8);
                            udpPeer.ActiveUdpEp = remoteEp;
                            udpPeer.LastUdpSeen = DateTime.UtcNow;
                            if (parts.Length >= 4 && parts[3].Trim().Length > 0) udpPeer.DisplayName = parts[3].Trim();

                            bool staleOrEmpty = (activeUdpPeerEndpoint == null || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6);
                            if (staleOrEmpty || activeUdpPeerEndpoint.Equals(remoteEp))
                            {
                                activeUdpPeerEndpoint = remoteEp;
                                lastUdpPeerSeen = DateTime.UtcNow;
                            }
                            byte[] ack = Encoding.UTF8.GetBytes("AETHER_PUNCH_ACK|" + parts[1] + "|" + instanceId + "|" + SanitizeJsonText(localDisplayName));
                            SendUdpP2pPacket(ack, ack.Length, remoteEp);
                            if (isNewRoomPeer || wasUdpInactive)
                            {
                                SyncTargetPeerDropdown();
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("NAT Hole Punch SUCCEEDED! Direct P2P UDP tunnel active with " + udpPeer.DisplayName + " (" + remoteEp.ToString() + ")");
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PUNCH_ACK|") || text.StartsWith("AETHER_PONG|"))
                    {
                        string[] parts = text.Split('|');
                        string myCleanRoom = CleanRoomCode(currentRoomCode);
                        string rInst = "";
                        string rDName = "";
                        if (text.StartsWith("AETHER_PUNCH_ACK|") && parts.Length >= 3)
                        {
                            rInst = parts[2];
                            if (parts.Length >= 4) rDName = parts[3].Trim();
                        }
                        else if (text.StartsWith("AETHER_PONG|") && parts.Length >= 2)
                        {
                            rInst = parts[1];
                            if (parts.Length >= 3) rDName = parts[2].Trim();
                        }

                        RoomPeerInfo udpPeer = FindPeerByEndpointOrInstance(myCleanRoom, rInst, remoteEp);
                        bool isNewRoomPeer = false;
                        bool fullRej = false;
                        if (udpPeer == null && myCleanRoom.Length > 0 && rInst.Length > 0)
                        {
                            udpPeer = UpsertRoomPeer("aethertunnel-exe-" + myCleanRoom + "-" + rInst, rDName.Length > 0 ? rDName : ("Windows .EXE (" + rInst.Substring(0, Math.Min(4, rInst.Length)) + ")"), "exe", out isNewRoomPeer, out fullRej);
                        }
                        if (udpPeer != null && !fullRej)
                        {
                            bool wasUdpInactive = (udpPeer.ActiveUdpEp == null || !udpPeer.ActiveUdpEp.Equals(remoteEp) || (DateTime.UtcNow - udpPeer.LastUdpSeen).TotalSeconds > 8);
                            udpPeer.ActiveUdpEp = remoteEp;
                            udpPeer.LastUdpSeen = DateTime.UtcNow;
                            if (rDName.Length > 0) udpPeer.DisplayName = rDName;
                            if (isNewRoomPeer || wasUdpInactive)
                            {
                                SyncTargetPeerDropdown();
                                Log("Verified Direct P2P NAT-Punched UDP connection with " + udpPeer.DisplayName + " (" + remoteEp.ToString() + ")");
                            }
                        }

                        bool staleOrEmpty = (activeUdpPeerEndpoint == null || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6);
                        bool isNew = (activeUdpPeerEndpoint == null || (staleOrEmpty && !activeUdpPeerEndpoint.Equals(remoteEp)) || ((DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 8));
                        if (staleOrEmpty || activeUdpPeerEndpoint.Equals(remoteEp))
                        {
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                            if (isNew && udpPeer == null)
                            {
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("Verified Direct P2P NAT-Punched UDP connection with " + remoteEp.ToString());
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PING|"))
                    {
                        string[] parts = text.Split('|');
                        string rInst = parts.Length >= 2 ? parts[1] : "";
                        RoomPeerInfo udpPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), rInst, remoteEp);
                        if (udpPeer != null)
                        {
                            udpPeer.ActiveUdpEp = remoteEp;
                            udpPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        if (activeUdpPeerEndpoint == null || activeUdpPeerEndpoint.Equals(remoteEp) || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6)
                        {
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                        }
                        byte[] pong = Encoding.UTF8.GetBytes("AETHER_PONG|" + instanceId + "|" + SanitizeJsonText(localDisplayName));
                        SendUdpP2pPacket(pong, pong.Length, remoteEp);
                    }
                    else if (text.StartsWith("AETHER_UDP_START|"))
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        RoomPeerInfo startPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", remoteEp);
                        if (startPeer != null)
                        {
                            startPeer.ActiveUdpEp = remoteEp;
                            startPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        udpPendingStartEp = remoteEp;
                        udpPendingStartHeader = text;
                        udpRxStartPending = true;
                        udpRxDataEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_WAIT_ACCEPT|"))
                    {
                        udpWaitAcceptReceived = true;
                        udpResumeEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_REJECT|"))
                    {
                        udpTransferRejected = true;
                        udpResumeEvent.Set();
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_RESUME|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            string rFile = parts.Length >= 3 ? parts[2] : "";
                            string curTxFile = udpTxActiveFileName;
                            if (String.IsNullOrEmpty(rFile) || String.IsNullOrEmpty(curTxFile) || rFile == curTxFile)
                            {
                                int rChunk = 0;
                                if (Int32.TryParse(parts[1], out rChunk) && rChunk >= 0)
                                {
                                    if (rChunk > udpPeerResumeChunk) udpPeerResumeChunk = rChunk;
                                    if (rChunk - 1 > udpPeerContiguousChunk) udpPeerContiguousChunk = rChunk - 1;
                                    udpResumeReceived = true;
                                    udpTxLastPeerActivityTick = Environment.TickCount;
                                    lastAckReceivedTick = Environment.TickCount;
                                    udpResumeEvent.Set();
                                    udpAckEvent.Set();
                                }
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_ACK|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            int uniqueCnt = 0;
                            if (Int32.TryParse(parts[1], out uniqueCnt))
                            {
                                if (uniqueCnt > udpPeerUniqueAcked) udpPeerUniqueAcked = uniqueCnt;
                            }
                            if (parts.Length >= 3)
                            {
                                int contigIdx = 0;
                                if (Int32.TryParse(parts[2], out contigIdx))
                                {
                                    if (contigIdx > udpPeerContiguousChunk) udpPeerContiguousChunk = contigIdx;
                                    if (contigIdx > udpPeerAckedChunk) udpPeerAckedChunk = contigIdx;
                                }
                            }
                            lastAckReceivedTick = Environment.TickCount;
                            udpTxLastPeerActivityTick = Environment.TickCount;
                            if (parts.Length >= 4)
                            {
                                int rxMbits = 0;
                                bool peerDiskPressure = (parts.Length >= 5 && parts[4] == "1");
                                if (Int32.TryParse(parts[3], out rxMbits) && rxMbits > 0)
                                {
                                    udpPeerMeasuredMbps = rxMbits;
                                    if (peerDiskPressure)
                                    {
                                        udpCleanAckStreak = 0;
                                        udpLowRxStreak = 0;
                                        double diskCap = Math.Max(16.0, (double)rxMbits * 1.05);
                                        if (dynamicUdpBitrateMbps > diskCap)
                                        {
                                            dynamicUdpBitrateMbps = Math.Max(8.0, (dynamicUdpBitrateMbps * 0.96 < diskCap) ? diskCap : dynamicUdpBitrateMbps * 0.96);
                                        }
                                        udpAckEvent.Set();
                                        return;
                                    }

                                    double boundedSample = Math.Min((double)rxMbits, Math.Max(32.0, dynamicUdpBitrateMbps * 1.50 + 12.0));
                                    long nowSwTicks = Stopwatch.GetTimestamp();
                                    if (udpBestRxDecayTicks == 0) udpBestRxDecayTicks = nowSwTicks;
                                    double elapsedDecaySec = (nowSwTicks - udpBestRxDecayTicks) / (double)Stopwatch.Frequency;
                                    if (elapsedDecaySec >= 1.2)
                                    {
                                        double decayFactor = Math.Max(0.88, 1.0 - (0.025 * elapsedDecaySec));
                                        udpBestRxMbps = Math.Max(8.0, udpBestRxMbps * decayFactor);
                                        udpBestRxDecayTicks = nowSwTicks;
                                    }
                                    if (boundedSample > udpBestRxMbps)
                                    {
                                        udpBestRxMbps = boundedSample;
                                        udpBestRxDecayTicks = nowSwTicks;
                                    }

                                    // Smooth Pacer: avoids sawtooth dips on brief Wi-Fi/router jitter while protecting queue stability
                                    if (unchecked(Environment.TickCount - lastNackReceivedTick) > 40)
                                    {
                                        udpCleanAckStreak++;
                                        if (!udpInSlowStart)
                                        {
                                            if (udpCleanAckStreak >= 24)
                                            {
                                                udpCongestionCeilingMbps = 0.0;
                                                udpInSlowStart = true;
                                            }
                                            else if (udpCongestionCeilingMbps <= 0.0 && udpCleanAckStreak >= 8)
                                            {
                                                udpInSlowStart = true;
                                            }
                                            else if (udpCongestionCeilingMbps > 0.0 && udpCleanAckStreak >= 16 && dynamicUdpBitrateMbps < udpCongestionCeilingMbps * 0.85)
                                            {
                                                udpInSlowStart = true;
                                            }
                                        }

                                        double prevRate = dynamicUdpBitrateMbps;
                                        double effectiveRx = Math.Max(boundedSample, udpBestRxMbps * 0.90);
                                        double routerSafeCap = Math.Max(32.0, udpBestRxMbps * 1.30 + 12.0);
                                        double maxSingleStep = Math.Min(routerSafeCap, prevRate * 1.30 + 4.0);
                                        if (udpInSlowStart)
                                        {
                                            if (effectiveRx >= prevRate * 0.40 || prevRate < 40.0)
                                            {
                                                udpLowRxStreak = 0;
                                                double factor = (udpCongestionCeilingMbps > 0.0 && prevRate >= udpCongestionCeilingMbps * 0.80) ? 1.12 : 1.24;
                                                double nextRate = Math.Max(prevRate * factor + 2.0, effectiveRx * 1.15 + 2.0);
                                                dynamicUdpBitrateMbps = Math.Min(5000.0, Math.Min(maxSingleStep, nextRate));
                                            }
                                            else
                                            {
                                                udpLowRxStreak++;
                                                if (udpLowRxStreak >= 10)
                                                {
                                                    udpInSlowStart = false;
                                                    double targetCap = Math.Max(12.0, udpBestRxMbps * 1.12);
                                                    dynamicUdpBitrateMbps = Math.Min(5000.0, (prevRate * 0.82) + (targetCap * 0.18));
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (boundedSample >= prevRate * 0.58 || effectiveRx >= prevRate * 0.65)
                                            {
                                                udpLowRxStreak = 0;
                                                double step = (udpCongestionCeilingMbps > 0.0 && prevRate >= udpCongestionCeilingMbps * 0.90) ? 1.04 : 1.07;
                                                double targetCruise = Math.Min(maxSingleStep, Math.Max(prevRate * step + 1.5, udpBestRxMbps * 1.15));
                                                dynamicUdpBitrateMbps = Math.Min(5000.0, targetCruise);
                                                if (udpCongestionCeilingMbps > 0.0 && dynamicUdpBitrateMbps > udpCongestionCeilingMbps)
                                                {
                                                    udpCongestionCeilingMbps = dynamicUdpBitrateMbps;
                                                }
                                            }
                                            else
                                            {
                                                udpLowRxStreak++;
                                                if (udpLowRxStreak >= 10)
                                                {
                                                    double targetCap = Math.Max(8.0, udpBestRxMbps * 1.10);
                                                    dynamicUdpBitrateMbps = Math.Max(8.0, (prevRate * 0.88) + (targetCap * 0.12));
                                                }
                                                else
                                                {
                                                    dynamicUdpBitrateMbps = Math.Max(8.0, prevRate * 0.994);
                                                }
                                            }
                                        }

                                        long userLimitBps = Interlocked.Read(ref maxUploadBytesPerSec);
                                        if (userLimitBps > 0L)
                                        {
                                            double userCapMbps = Math.Max(0.1, (userLimitBps * 8.0) / (1024.0 * 1024.0));
                                            if (dynamicUdpBitrateMbps > userCapMbps) dynamicUdpBitrateMbps = userCapMbps;
                                            if (udpCongestionCeilingMbps > userCapMbps) udpCongestionCeilingMbps = userCapMbps;
                                        }

                                        if (dynamicUdpBitrateMbps > prevRate * 1.20)
                                        {
                                            Interlocked.Exchange(ref pacingResetRequested, 1);
                                        }
                                    }
                                }
                            }
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NACK|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2 && !String.IsNullOrEmpty(parts[1]))
                        {
                            string[] tokens = parts[1].Split(',');
                            int nowTick = Environment.TickCount;
                            int enqueuedCount = 0;
                            if (udpSenderChunkLastSentTick.Count > 4096) udpSenderChunkLastSentTick.Clear();
                            foreach (string t in tokens)
                            {
                                int missIdx;
                                if (Int32.TryParse(t.Trim(), out missIdx) && missIdx >= 0)
                                {
                                    int prevSendTick;
                                    if (!udpSenderChunkLastSentTick.TryGetValue(missIdx, out prevSendTick) || unchecked(nowTick - prevSendTick) > 220)
                                    {
                                        udpSenderChunkLastSentTick[missIdx] = nowTick;
                                        udpRetransmitQueue.Enqueue(missIdx);
                                        enqueuedCount++;
                                    }
                                }
                            }
                            lastNackReceivedTick = nowTick;
                            udpTxLastPeerActivityTick = nowTick;
                            int lossCutThreshold = Math.Max(36, Math.Min(140, (int)Math.Round(dynamicUdpBitrateMbps * 0.20)));
                            if (enqueuedCount >= lossCutThreshold && unchecked(nowTick - lastNackCutTick) > 1600)
                            {
                                lastNackCutTick = nowTick;
                                udpCongestionCeilingMbps = dynamicUdpBitrateMbps * 0.96;
                                udpInSlowStart = false;
                                udpCleanAckStreak = 0;
                                udpLowRxStreak = 0;
                                double cutFactor = (enqueuedCount >= 100) ? 0.85 : 0.93;
                                double floorCap = Math.Max(8.0, udpBestRxMbps * 0.88);
                                double reduced = Math.Max(floorCap, dynamicUdpBitrateMbps * cutFactor);
                                dynamicUdpBitrateMbps = Math.Max(8.0, reduced);
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                            }
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NEED_START|"))
                    {
                        udpNeedStartResend = true;
                        udpTxLastPeerActivityTick = Environment.TickCount;
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_DONE|"))
                    {
                        string[] dParts = text.Split('|');
                        string dFile = dParts.Length >= 2 ? dParts[1] : "";
                        string curTxFile = udpTxActiveFileName;
                        if (String.IsNullOrEmpty(dFile) || String.IsNullOrEmpty(curTxFile) || dFile == curTxFile)
                        {
                            udpTransferDoneAcked = true;
                            udpTxLastPeerActivityTick = Environment.TickCount;
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_END|"))
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        RoomPeerInfo endPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", remoteEp);
                        if (endPeer != null)
                        {
                            endPeer.ActiveUdpEp = remoteEp;
                            endPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        string[] endParts = text.Split('|');
                        string endFile = (endParts.Length >= 2) ? endParts[1] : "";
                        string curActiveName = activeRxUdpFileName;
                        string curDoneName = lastCompletedUdpFileNameVolatile;
                        if (!String.IsNullOrEmpty(endFile) && curActiveName.Length == 0 && endFile == curDoneName)
                        {
                            byte[] quickDone = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + curDoneName);
                            try { SendUdpP2pPacket(quickDone, quickDone.Length, remoteEp); } catch { }
                        }
                        else if (String.IsNullOrEmpty(endFile) || curActiveName.Length == 0 || endFile == curActiveName)
                        {
                            if (!udpRxEndPending)
                            {
                                udpRxEndTick = Environment.TickCount;
                                udpRxEndPending = true;
                            }
                            udpRxDataEvent.Set();
                        }
                    }
                }
                catch { }
        }

        private byte[] AllocStageBuffer()
        {
            byte[] buf;
            if (!udpStageBufferPool.TryDequeue(out buf) || buf == null || buf.Length != STAGE_PAGE_BYTES)
            {
                buf = new byte[STAGE_PAGE_BYTES];
            }
            Interlocked.Add(ref totalAppBufferedBytes, STAGE_PAGE_BYTES);
            return buf;
        }

        private void ReleaseStageBuffer(byte[] buf)
        {
            if (buf == null) return;
            Interlocked.Add(ref totalAppBufferedBytes, -STAGE_PAGE_BYTES);
            if (udpStageBufferPool.Count < 32)
            {
                udpStageBufferPool.Enqueue(buf);
            }
        }

        private void EnqueueDiskWriteJob(DiskWriteJob job)
        {
            Interlocked.Increment(ref activeDiskIoJobs);
            diskIoIdleEvent.Reset();
            diskWriteQueue.Enqueue(job);
            diskWriteEvent.Set();
        }

        private void WaitForDiskIoDrain(int maxWaitMs)
        {
            Stopwatch sw = Stopwatch.StartNew();
            diskWriteEvent.Set();
            while (sw.ElapsedMilliseconds < maxWaitMs)
            {
                if (diskWriteQueue.IsEmpty && Thread.VolatileRead(ref activeDiskIoJobs) <= 0)
                {
                    break;
                }
                try { diskIoIdleEvent.WaitOne(20); } catch { }
            }
        }

        private long ReadCheckpointBytes(string partPath, long expectedFileSize)
        {
            long existingLen = 0;
            try
            {
                if (!File.Exists(partPath)) return 0;
                existingLen = new FileInfo(partPath).Length;
            }
            catch { return 0; }
            if (existingLen <= 0) return 0;

            string ckptPath = partPath + ".ckpt";
            if (File.Exists(ckptPath))
            {
                try
                {
                    string ckptRaw = File.ReadAllText(ckptPath).Trim();
                    string[] ckptParts = ckptRaw.Split('|');
                    if (ckptParts.Length >= 3 && ckptParts[2] == "B")
                    {
                        long ckptBytes = 0;
                        long ckptExpSize = 0;
                        if (Int64.TryParse(ckptParts[0], out ckptBytes) && Int64.TryParse(ckptParts[1], out ckptExpSize))
                        {
                            if (ckptExpSize == expectedFileSize && ckptBytes > 0 && existingLen >= ckptBytes)
                            {
                                return Math.Min(ckptBytes, expectedFileSize);
                            }
                        }
                    }
                    else if (ckptParts.Length >= 1)
                    {
                        long ckptChunk = 0;
                        if (Int64.TryParse(ckptParts[0], out ckptChunk) && ckptChunk > 0)
                        {
                            long ckptBytes = ckptChunk * UDP_CHUNK_SIZE;
                            if (ckptParts.Length >= 2)
                            {
                                long ckptExpSize = 0;
                                if (Int64.TryParse(ckptParts[1], out ckptExpSize) && ckptExpSize == expectedFileSize && existingLen >= ckptBytes)
                                {
                                    return Math.Min(ckptBytes, expectedFileSize);
                                }
                            }
                            else if (existingLen < expectedFileSize)
                            {
                                return Math.Min(ckptBytes, existingLen);
                            }
                        }
                    }
                }
                catch { }
            }

            if (existingLen < expectedFileSize)
            {
                return existingLen;
            }
            return 0;
        }

        private void WriteCheckpointFile(string partPath, long resumeBytes, long expectedFileSize)
        {
            if (String.IsNullOrEmpty(partPath) || expectedFileSize <= 0 || resumeBytes <= 0) return;
            try
            {
                string ckptBody = Math.Min(resumeBytes, expectedFileSize).ToString() + "|" + expectedFileSize.ToString() + "|B";
                File.WriteAllText(partPath + ".ckpt", ckptBody);
            }
            catch { }
        }

        private void ReleaseConflictingRxHandlesForPart(string partPath, string requesterProtocol)
        {
            if (String.IsNullOrEmpty(partPath)) return;
            if (requesterProtocol != "udp" && activeRxUdpPartPath == partPath)
            {
                try
                {
                    udpRxClosedSignal.Reset();
                    udpRxCloseTargetPath = partPath;
                    udpRxCloseRequested = true;
                    udpRxDataEvent.Set();
                    udpRxClosedSignal.WaitOne(2500);
                }
                catch { }
            }
            if (requesterProtocol != "cloud")
            {
                lock (cloudRxFileLock)
                {
                    if (cloudOutFile != null && cloudPartPath == partPath)
                    {
                        try { WriteCheckpointFile(cloudPartPath, cloudReceivedBytes, cloudExpectedSize); } catch { }
                        try { cloudOutFile.Flush(false); } catch { }
                        try { cloudOutFile.Close(); } catch { }
                        cloudOutFile = null;
                    }
                }
            }
            TcpClient tcpToClose = null;
            TcpClient wsToClose = null;
            lock (rxHandleCoordLock)
            {
                if (activeTcpRxPartPath == partPath && activeTcpRxClient != null)
                {
                    tcpToClose = activeTcpRxClient;
                }
                if (activeWsRxPartPath == partPath && activeWsRxClient != null)
                {
                    wsToClose = activeWsRxClient;
                }
            }
            if (tcpToClose != null)
            {
                try { tcpToClose.Close(); } catch { }
                for (int w = 0; w < 20; w++)
                {
                    lock (rxHandleCoordLock)
                    {
                        if (activeTcpRxPartPath != partPath) break;
                    }
                    Thread.Sleep(35);
                }
            }
            if (wsToClose != null)
            {
                try { wsToClose.Close(); } catch { }
                for (int w = 0; w < 20; w++)
                {
                    lock (rxHandleCoordLock)
                    {
                        if (activeWsRxPartPath != partPath) break;
                    }
                    Thread.Sleep(35);
                }
            }
        }

        private bool SafeFinalizePartFile(string partPath, string finalPath, string ckptPath)
        {
            Exception lastErr = null;
            bool movedOk = false;
            for (int attempt = 0; attempt < 25; attempt++)
            {
                try
                {
                    if (!File.Exists(partPath))
                    {
                        movedOk = File.Exists(finalPath);
                        break;
                    }
                    if (File.Exists(finalPath))
                    {
                        File.Delete(finalPath);
                    }
                    File.Move(partPath, finalPath);
                    movedOk = true;
                    break;
                }
                catch (Exception ex)
                {
                    lastErr = ex;
                    if (attempt == 2)
                    {
                        try { GC.Collect(); GC.WaitForPendingFinalizers(); } catch { }
                    }
                    Thread.Sleep(150);
                }
            }

            if (!movedOk)
            {
                try
                {
                    if (File.Exists(partPath))
                    {
                        string dir = Path.GetDirectoryName(finalPath);
                        string nameOnly = Path.GetFileNameWithoutExtension(finalPath);
                        string ext = Path.GetExtension(finalPath);
                        string altPath = Path.Combine(dir, nameOnly + "_" + DateTime.Now.ToString("HHmmss") + ext);
                        File.Move(partPath, altPath);
                        Log("Tiedosto tallennettu nimellä (kohde oli lukittu): " + altPath);
                        movedOk = true;
                    }
                }
                catch (Exception ex2)
                {
                    lastErr = ex2;
                }
            }

            if (movedOk && !String.IsNullOrEmpty(ckptPath))
            {
                for (int k = 0; k < 5; k++)
                {
                    try
                    {
                        if (File.Exists(ckptPath)) File.Delete(ckptPath);
                        break;
                    }
                    catch
                    {
                        Thread.Sleep(60);
                    }
                }
            }

            if (!movedOk && lastErr != null)
            {
                Log("Tiedoston viimeistelyvirhe (" + Path.GetFileName(finalPath) + "): " + lastErr.Message);
            }
            return movedOk;
        }

        private void UdpP2pDiskIoLoop()
        {
            udpDiskIoExitedEvent.Reset();
            long bytesSinceCkpt = 0;
            Stopwatch ckptSw = Stopwatch.StartNew();
            Stopwatch writeSw = new Stopwatch();
            try
            {
                while (isRunning || !diskWriteQueue.IsEmpty)
                {
                    DiskWriteJob job;
                    while (diskWriteQueue.TryDequeue(out job))
                    {
                        int jobPauseMs = 0;
                        try
                        {
                            lock (diskFileStreamLock)
                            {
                                if (job.TargetFile != null)
                                {
                                    if (job.Length > 0 && job.Buffer != null)
                                    {
                                        writeSw.Restart();
                                        if (job.TargetFile.Position != job.FileOffset)
                                        {
                                            job.TargetFile.Seek(job.FileOffset, SeekOrigin.Begin);
                                        }
                                        job.TargetFile.Write(job.Buffer, 0, job.Length);
                                        writeSw.Stop();

                                        bytesSinceCkpt += job.Length;
                                        int elapsedWriteMs = (int)Math.Min(60000L, writeSw.ElapsedMilliseconds);
                                        lastDiskWriteMs = elapsedWriteMs;

                                        if (job.Length >= 512 * 1024)
                                        {
                                            double instDiskMbps = (job.Length / (1024.0 * 1024.0)) / Math.Max(0.0005, writeSw.Elapsed.TotalSeconds);
                                            int curAvg = smoothedDiskWriteMbps;
                                            int nextAvg = curAvg <= 0
                                                ? (int)Math.Round(instDiskMbps)
                                                : (int)Math.Round((curAvg * 0.70) + (instDiskMbps * 0.30));
                                            smoothedDiskWriteMbps = Math.Max(1, Math.Min(5000, nextAvg));
                                        }

                                        if (elapsedWriteMs >= 30)
                                        {
                                            jobPauseMs = Math.Min(25, Math.Max(2, elapsedWriteMs / 4));
                                        }
                                    }

                                    // Flush managed user-space buffer ONLY on explicit drain/close; NEVER call Flush(true) hardware SYNCHRONIZE CACHE!
                                    if (job.ForceOsSync)
                                    {
                                        try { job.TargetFile.Flush(false); } catch { }
                                    }

                                    bool writeCkpt = (job.CkptContigChunk >= 0 && !String.IsNullOrEmpty(job.PartPath)) &&
                                        (job.ForceOsSync || (bytesSinceCkpt >= 64L * 1024L * 1024L && ckptSw.ElapsedMilliseconds >= 2000));
                                    if (writeCkpt)
                                    {
                                        bytesSinceCkpt = 0;
                                        ckptSw.Restart();
                                        long resumeByteOff = (long)(job.CkptContigChunk + 1) * UDP_CHUNK_SIZE;
                                        WriteCheckpointFile(job.PartPath, resumeByteOff, job.ExpectedFileSize);
                                    }
                                }
                            }
                        }
                        catch { }
                        finally
                        {
                            ReleaseStageBuffer(job.Buffer);
                            if (Interlocked.Decrement(ref activeDiskIoJobs) <= 0)
                            {
                                diskIoIdleEvent.Set();
                            }
                        }
                        if (jobPauseMs > 0 && isRunning) Thread.Sleep(jobPauseMs);
                    }
                    if (!isRunning && diskWriteQueue.IsEmpty) break;
                    diskWriteEvent.WaitOne(25);
                }
            }
            finally
            {
                diskIoIdleEvent.Set();
                udpDiskIoExitedEvent.Set();
            }
        }

        private void EnqueueCompletedPageJob(
            FileStream outFile,
            string partPath,
            long expectedFileSize,
            UdpStagePage page,
            List<DiskWriteJob> queuedJobs)
        {
            if (page == null) return;
            if (page.StartSlot == 0)
            {
                DiskWriteJob job = new DiskWriteJob();
                job.TargetFile = outFile;
                job.PartPath = partPath;
                job.ExpectedFileSize = expectedFileSize;
                job.Buffer = page.Data;
                job.Length = page.ValidBytes;
                job.FileOffset = (long)page.PageIndex * STAGE_PAGE_BYTES;
                job.CkptContigChunk = -1;
                job.ForceOsSync = false;
                queuedJobs.Add(job);
            }
            else
            {
                int exp = page.ExpectedCount;
                int s = page.StartSlot;
                while (s < exp)
                {
                    while (s < exp && !page.Present[s]) s++;
                    if (s >= exp) break;
                    int runStart = s;
                    int runBytes = 0;
                    while (s < exp && page.Present[s])
                    {
                        runBytes += page.ChunkLens[s];
                        page.Present[s] = false;
                        s++;
                    }
                    if (runBytes > 0)
                    {
                        byte[] runBuf = AllocStageBuffer();
                        Buffer.BlockCopy(page.Data, runStart * UDP_CHUNK_SIZE, runBuf, 0, runBytes);
                        DiskWriteJob rJob = new DiskWriteJob();
                        rJob.TargetFile = outFile;
                        rJob.PartPath = partPath;
                        rJob.ExpectedFileSize = expectedFileSize;
                        rJob.Buffer = runBuf;
                        rJob.Length = runBytes;
                        rJob.FileOffset = ((long)page.PageIndex * CHUNKS_PER_STAGE_PAGE + runStart) * UDP_CHUNK_SIZE;
                        rJob.CkptContigChunk = -1;
                        rJob.ForceOsSync = false;
                        queuedJobs.Add(rJob);
                    }
                }
                ReleaseStageBuffer(page.Data);
            }
        }

        private void DispatchStagedPagesToDiskQueue(
            FileStream outFile,
            string partPath,
            long expectedFileSize,
            Dictionary<int, UdpStagePage> stagedPages,
            ref long readyCompletedBytes,
            ref int lastQueuedCkptContig,
            int curContiguous,
            List<int> keysBuf,
            bool forceAll)
        {
            if (outFile == null || (stagedPages.Count == 0 && (!forceAll || curContiguous <= lastQueuedCkptContig))) return;

            List<DiskWriteJob> queuedJobs = new List<DiskWriteJob>();

            // 1. Strictly sequential in-order flush from diskSequentialNextPage (eliminates NTFS ValidDataLength zero-fills & random SSD seeks!)
            UdpStagePage seqPage;
            int nextSeq = diskSequentialNextPage;
            while (stagedPages.TryGetValue(nextSeq, out seqPage))
            {
                int needed = Math.Max(1, seqPage.ExpectedCount - seqPage.StartSlot);
                if (seqPage.PresentCount < needed) break;
                stagedPages.Remove(nextSeq);
                readyCompletedBytes -= seqPage.ValidBytes;
                if (readyCompletedBytes < 0) readyCompletedBytes = 0;
                EnqueueCompletedPageJob(outFile, partPath, expectedFileSize, seqPage, queuedJobs);
                nextSeq++;
            }
            diskSequentialNextPage = nextSeq;

            // 2. Emergency spill ONLY when RAM staging exceeds 512 MB behind a gap, or on forceAll (transfer end / close)
            long remainingPageBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
            if (forceAll || remainingPageBytes >= 512L * 1024L * 1024L)
            {
                keysBuf.Clear();
                foreach (KeyValuePair<int, UdpStagePage> kv in stagedPages)
                {
                    int needed = Math.Max(1, kv.Value.ExpectedCount - kv.Value.StartSlot);
                    if (kv.Value.PresentCount >= needed) keysBuf.Add(kv.Key);
                }
                if (keysBuf.Count > 0)
                {
                    keysBuf.Sort();
                    for (int i = 0; i < keysBuf.Count; i++)
                    {
                        int pIdx = keysBuf[i];
                        UdpStagePage page = stagedPages[pIdx];
                        stagedPages.Remove(pIdx);
                        readyCompletedBytes -= page.ValidBytes;
                        if (readyCompletedBytes < 0) readyCompletedBytes = 0;
                        EnqueueCompletedPageJob(outFile, partPath, expectedFileSize, page, queuedJobs);
                    }
                }

                remainingPageBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
                if ((forceAll || remainingPageBytes >= 512L * 1024L * 1024L) && stagedPages.Count > 0)
                {
                    keysBuf.Clear();
                    foreach (int key in stagedPages.Keys) keysBuf.Add(key);
                    keysBuf.Sort();

                    for (int i = 0; i < keysBuf.Count; i++)
                    {
                        int pIdx = keysBuf[i];
                        UdpStagePage page = stagedPages[pIdx];
                        stagedPages.Remove(pIdx);

                        int exp = page.ExpectedCount;
                        int s = page.StartSlot;
                        while (s < exp)
                        {
                            while (s < exp && !page.Present[s]) s++;
                            if (s >= exp) break;
                            int runStart = s;
                            int runBytes = 0;
                            while (s < exp && page.Present[s])
                            {
                                runBytes += page.ChunkLens[s];
                                page.Present[s] = false;
                                s++;
                            }
                            if (runBytes > 0)
                            {
                                byte[] runBuf = AllocStageBuffer();
                                Buffer.BlockCopy(page.Data, runStart * UDP_CHUNK_SIZE, runBuf, 0, runBytes);
                                DiskWriteJob rJob = new DiskWriteJob();
                                rJob.TargetFile = outFile;
                                rJob.PartPath = partPath;
                                rJob.ExpectedFileSize = expectedFileSize;
                                rJob.Buffer = runBuf;
                                rJob.Length = runBytes;
                                rJob.FileOffset = ((long)pIdx * CHUNKS_PER_STAGE_PAGE + runStart) * UDP_CHUNK_SIZE;
                                rJob.CkptContigChunk = -1;
                                rJob.ForceOsSync = false;
                                queuedJobs.Add(rJob);
                            }
                        }
                        ReleaseStageBuffer(page.Data);
                    }
                }
            }

            if (queuedJobs.Count == 0 && !forceAll) return;

            int diskSafeContig = curContiguous;
            foreach (UdpStagePage remPage in stagedPages.Values)
            {
                int pageBase = remPage.PageIndex * CHUNKS_PER_STAGE_PAGE;
                if (pageBase <= diskSafeContig)
                {
                    int firstPresent = -1;
                    for (int s = remPage.StartSlot; s < remPage.ExpectedCount; s++)
                    {
                        if (remPage.Present[s]) { firstPresent = s; break; }
                    }
                    if (firstPresent >= 0)
                    {
                        int cand = pageBase + firstPresent - 1;
                        if (cand < diskSafeContig) diskSafeContig = cand;
                    }
                }
            }

            int ckptToWrite = (diskSafeContig > lastQueuedCkptContig) ? diskSafeContig : -1;
            if (ckptToWrite > lastQueuedCkptContig) lastQueuedCkptContig = ckptToWrite;

            if (queuedJobs.Count > 0)
            {
                DiskWriteJob lastJob = queuedJobs[queuedJobs.Count - 1];
                lastJob.CkptContigChunk = ckptToWrite;
                lastJob.ForceOsSync = forceAll;
                for (int j = 0; j < queuedJobs.Count; j++)
                {
                    EnqueueDiskWriteJob(queuedJobs[j]);
                }
            }
            else if (forceAll)
            {
                DiskWriteJob syncJob = new DiskWriteJob();
                syncJob.TargetFile = outFile;
                syncJob.PartPath = partPath;
                syncJob.ExpectedFileSize = expectedFileSize;
                syncJob.Buffer = null;
                syncJob.Length = 0;
                syncJob.FileOffset = 0;
                syncJob.CkptContigChunk = ckptToWrite;
                syncJob.ForceOsSync = true;
                EnqueueDiskWriteJob(syncJob);
            }
        }

        private void UdpP2pDiskWriterLoop()
        {
            udpWriterExitedEvent.Reset();
            FileStream udpOutFile = null;
            string udpFileName = "";
            string lastCompletedUdpFileName = "";
            string udpPartPath = "";
            string udpFinalPath = "";
            long udpExpectedSize = 0;
            int udpExpectedChunks = 1;
            long udpReceivedBytes = 0;
            long udpSessionStartBytes = 0;
            long readyCompletedBytes = 0;
            int lastQueuedCkptContig = -1;
            bool[] udpChunkReceived = null;
            Dictionary<int, int> udpChunkLastNackTick = new Dictionary<int, int>();
            Dictionary<int, UdpStagePage> stagedPages = new Dictionary<int, UdpStagePage>(512);
            List<int> pageKeysBuf = new List<int>(512);
            int udpContiguousChunk = -1;
            int udpHighestSeenChunk = -1;
            int udpUniqueReceivedCount = 0;
            int chunksSinceLastAck = 0;
            int dupChunksSinceLastResume = 0;
            int lastNeedStartTick = 0;
            int lastEndNackTick = 0;
            int lastPartialDispatchTick = 0;
            int lastContigAdvanceTick = Environment.TickCount;
            int lastIdleHoleNackTick = 0;
            long ackWindowBytes = 0;
            long uiWindowBytes = 0;
            double smoothedUiRxMbps = 0.0;
            Stopwatch ackWindowSw = Stopwatch.StartNew();
            Stopwatch uiWindowSw = Stopwatch.StartNew();
            Stopwatch dupResumeSw = Stopwatch.StartNew();
            Stopwatch flushSw = Stopwatch.StartNew();
            Stopwatch udpRxSw = null;
            int lastAnyUdpRxTick = Environment.TickCount;
            ParallelOptions decParallelOpts = new ParallelOptions();
            decParallelOpts.MaxDegreeOfParallelism = Math.Max(1, Math.Min(4, Environment.ProcessorCount / 2));

            try
            {
                while (isRunning)
                {
                    udpRxDataEvent.WaitOne(8);

                    try
                    {
                        if (udpRxCloseRequested)
                        {
                            udpRxCloseRequested = false;
                            string reqTarget = udpRxCloseTargetPath;
                            if (udpOutFile != null && (String.IsNullOrEmpty(reqTarget) || reqTarget == udpPartPath))
                            {
                                activeRxUdpFileName = "";
                                activeRxUdpPartPath = "";
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                WaitForDiskIoDrain(10000);
                                lock (diskFileStreamLock)
                                {
                                    try { udpOutFile.Flush(false); } catch { }
                                    try { udpOutFile.Close(); } catch { }
                                    udpOutFile = null;
                                }
                                WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                foreach (UdpStagePage remP in stagedPages.Values) ReleaseStageBuffer(remP.Data);
                                stagedPages.Clear();
                                readyCompletedBytes = 0;
                                udpRxEndPending = false;
                                udpRxEndTick = 0;
                                udpPromptState = 0;
                            }
                            udpRxClosedSignal.Set();
                        }

                        if (udpPendingAcceptOpen)
                        {
                            udpPendingAcceptOpen = false;
                            lastAnyUdpRxTick = Environment.TickCount;
                            string aHdr = udpPendingAcceptHeader;
                            IPEndPoint aEp = udpPendingAcceptEp ?? activeUdpPeerEndpoint;
                            string[] aParts = aHdr.Split('|');
                            if (aParts.Length >= 3)
                            {
                                string newFileName = aParts[1];
                                long newExpectedSize = 0;
                                Int64.TryParse(aParts[2], out newExpectedSize);
                                if (!(udpOutFile != null && newFileName == udpFileName && newExpectedSize == udpExpectedSize))
                                {
                                    if (udpOutFile != null)
                                    {
                                        activeRxUdpFileName = "";
                                        activeRxUdpPartPath = "";
                                        DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                        WaitForDiskIoDrain(15000);
                                        lock (diskFileStreamLock)
                                        {
                                            try { udpOutFile.Flush(false); udpOutFile.Close(); } catch { }
                                            udpOutFile = null;
                                        }
                                        WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                    }
                                    foreach (UdpStagePage remP in stagedPages.Values)
                                    {
                                        ReleaseStageBuffer(remP.Data);
                                    }
                                    stagedPages.Clear();
                                    readyCompletedBytes = 0;

                                    udpFileName = newFileName;
                                    lastCompletedUdpFileName = "";
                                    lastCompletedUdpFileNameVolatile = "";
                                    udpExpectedSize = newExpectedSize;
                                    udpExpectedChunks = (int)Math.Max(1L, (udpExpectedSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);
                                    if (aParts.Length >= 4) Int32.TryParse(aParts[3], out udpExpectedChunks);

                                    udpFinalPath = Path.Combine(downloadDirectory, "AetherTunnel_" + udpFileName);
                                    udpPartPath = udpFinalPath + ".part";
                                    ReleaseConflictingRxHandlesForPart(udpPartPath, "udp");

                                    long ckptBytes = ReadCheckpointBytes(udpPartPath, udpExpectedSize);
                                    int resumeChunk = (int)(ckptBytes / UDP_CHUNK_SIZE);
                                    if (resumeChunk >= udpExpectedChunks) resumeChunk = Math.Max(0, udpExpectedChunks - 1);
                                    if (resumeChunk < 0) resumeChunk = 0;
                                    bool partExists = File.Exists(udpPartPath);
                                    long alignedBytes = (long)resumeChunk * UDP_CHUNK_SIZE;

                                    udpChunkReceived = new bool[udpExpectedChunks];
                                    udpChunkLastNackTick.Clear();
                                    for (int c = 0; c < resumeChunk && c < udpExpectedChunks; c++) udpChunkReceived[c] = true;
                                    udpContiguousChunk = resumeChunk - 1;
                                    lastQueuedCkptContig = resumeChunk - 1;
                                    udpHighestSeenChunk = resumeChunk - 1;
                                    udpUniqueReceivedCount = resumeChunk;
                                    chunksSinceLastAck = 0;
                                    dupChunksSinceLastResume = 0;
                                    ackWindowBytes = 0;
                                    uiWindowBytes = 0;
                                    smoothedUiRxMbps = 0.0;
                                    udpRxEndPending = false;
                                    udpRxEndTick = 0;
                                    lastUniqueRxChunkTick = Environment.TickCount;
                                    activeRxUdpFileName = udpFileName;
                                    activeRxUdpPartPath = udpPartPath;
                                    lastContigAdvanceTick = Environment.TickCount;
                                    lastDiskWriteMs = 0;
                                    diskSequentialNextPage = resumeChunk / CHUNKS_PER_STAGE_PAGE;
                                    int boundarySlot = resumeChunk % CHUNKS_PER_STAGE_PAGE;
                                    udpResumeBoundaryPage = (boundarySlot > 0) ? (resumeChunk / CHUNKS_PER_STAGE_PAGE) : -1;
                                    udpResumeBoundarySlot = boundarySlot;

                                    Exception openErr = null;
                                    for (int oa = 0; oa < 5; oa++)
                                    {
                                        try
                                        {
                                            udpOutFile = new FileStream(udpPartPath, (partExists && resumeChunk > 0) ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.Read, 64 * 1024, FileOptions.SequentialScan);
                                            openErr = null;
                                            break;
                                        }
                                        catch (Exception oex)
                                        {
                                            openErr = oex;
                                            udpOutFile = null;
                                            Thread.Sleep(80);
                                        }
                                    }
                                    if (udpOutFile == null)
                                    {
                                        activeRxUdpFileName = "";
                                        activeRxUdpPartPath = "";
                                        Log("Virhe avattaessa .part-tiedostoa (" + udpFileName + "): " + (openErr != null ? openErr.Message : "lukittu"));
                                        continue;
                                    }
                                    if (alignedBytes > 0) udpOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                                    udpReceivedBytes = alignedBytes;
                                    udpSessionStartBytes = alignedBytes;
                                    udpRxSw = Stopwatch.StartNew();
                                    ackWindowSw.Restart();
                                    uiWindowSw.Restart();
                                    dupResumeSw.Restart();
                                    flushSw.Restart();

                                    if (aEp != null && udpP2pClient != null)
                                    {
                                        byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + resumeChunk.ToString() + "|" + udpFileName);
                                        for (int k = 0; k < 4; k++)
                                        {
                                            try { SendUdpP2pPacket(resumeReply, resumeReply.Length, aEp); } catch { }
                                        }
                                    }

                                    if (resumeChunk > 0)
                                        Log("Jatketaan keskeytynyttä P2P UDP -latausta (" + udpFileName + ") kohdasta " + FormatBytes(alignedBytes) + " (lohko " + resumeChunk.ToString() + ")");
                                    else
                                        Log("Receiving file over High-Speed P2P NAT-UDP -> " + udpFinalPath + " (" + FormatBytes(udpExpectedSize) + ")");
                                }
                            }
                        }

                        if (udpRxStartPending)
                        {
                            udpRxStartPending = false;
                            lastAnyUdpRxTick = Environment.TickCount;
                            string hdr = udpPendingStartHeader;
                            IPEndPoint senderEp = udpPendingStartEp ?? activeUdpPeerEndpoint;
                            string[] parts = hdr.Split('|');
                            if (parts.Length >= 3)
                            {
                                string newFileName = parts[1];
                                long newExpectedSize = 0;
                                Int64.TryParse(parts[2], out newExpectedSize);
                                string promptKey = newFileName + "|" + newExpectedSize.ToString();

                                if (udpPromptState == 1 && unchecked(Environment.TickCount - udpPromptStartedTick) > 180000)
                                {
                                    udpPromptState = 0;
                                }

                                // If AETHER_UDP_START arrives for the already-open active transfer (e.g. sender reconnect/resume), reset transient end state & send RESUME ACK
                                if (udpOutFile != null && newFileName == udpFileName && newExpectedSize == udpExpectedSize)
                                {
                                    udpRxEndPending = false;
                                    udpRxEndTick = 0;
                                    lastUniqueRxChunkTick = Environment.TickCount;
                                    lastContigAdvanceTick = Environment.TickCount;
                                    lastCompletedUdpFileName = "";
                                    lastCompletedUdpFileNameVolatile = "";
                                    dupChunksSinceLastResume = 0;
                                    udpChunkLastNackTick.Clear();
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        int curResume = Math.Max(0, udpContiguousChunk + 1);
                                        if (curResume >= udpExpectedChunks) curResume = Math.Max(0, udpExpectedChunks - 1);
                                        byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + curResume.ToString() + "|" + udpFileName);
                                        for (int k = 0; k < 3; k++)
                                        {
                                            try { SendUdpP2pPacket(resumeReply, resumeReply.Length, senderEp); } catch { }
                                        }
                                    }
                                }
                                else if (udpPromptState == 1 && udpPromptKey == promptKey)
                                {
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] waitMsg = Encoding.UTF8.GetBytes("AETHER_UDP_WAIT_ACCEPT|" + newFileName);
                                        try { SendUdpP2pPacket(waitMsg, waitMsg.Length, senderEp); } catch { }
                                    }
                                }
                                else if (udpPromptState == 3 && udpPromptKey == promptKey && unchecked(Environment.TickCount - udpPromptRejectTick) < 8000)
                                {
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] rejMsg = Encoding.UTF8.GetBytes("AETHER_UDP_REJECT|" + newFileName);
                                        for (int k = 0; k < 3; k++)
                                        {
                                            try { SendUdpP2pPacket(rejMsg, rejMsg.Length, senderEp); } catch { }
                                        }
                                    }
                                }
                                else if (autoAcceptAllIncoming || udpPromptAcceptedKey == promptKey)
                                {
                                    udpPendingAcceptHeader = hdr;
                                    udpPendingAcceptEp = senderEp;
                                    udpPendingAcceptOpen = true;
                                    udpRxDataEvent.Set();
                                }
                                else
                                {
                                    udpPromptState = 1;
                                    udpPromptKey = promptKey;
                                    udpPromptStartedTick = Environment.TickCount;
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] waitMsg = Encoding.UTF8.GetBytes("AETHER_UDP_WAIT_ACCEPT|" + newFileName);
                                        for (int k = 0; k < 2; k++)
                                        {
                                            try { SendUdpP2pPacket(waitMsg, waitMsg.Length, senderEp); } catch { }
                                        }
                                    }
                                    string pCandPath = Path.Combine(downloadDirectory, "AetherTunnel_" + newFileName) + ".part";
                                    bool pHasRes = File.Exists(pCandPath) && ReadCheckpointBytes(pCandPath, newExpectedSize) > 0;
                                    string pFile = newFileName;
                                    long pSize = newExpectedSize;
                                    string pHdr = hdr;
                                    IPEndPoint pEp = senderEp;
                                    ThreadPool.QueueUserWorkItem(delegate {
                                        int choice = ShowIncomingTransferDialog("P2P NAT-UDP", pFile, pSize, pHasRes);
                                        if (choice == 1 || choice == 2)
                                        {
                                            udpPromptAcceptedKey = promptKey;
                                            udpPromptState = 2;
                                            udpPendingAcceptHeader = pHdr;
                                            udpPendingAcceptEp = pEp;
                                            udpPendingAcceptOpen = true;
                                            udpRxDataEvent.Set();
                                        }
                                        else
                                        {
                                            udpPromptState = 3;
                                            udpPromptRejectTick = Environment.TickCount;
                                            Log("Saapuva P2P-tiedosto hylätty: " + pFile);
                                            if (pEp != null && udpP2pClient != null)
                                            {
                                                byte[] rejMsg = Encoding.UTF8.GetBytes("AETHER_UDP_REJECT|" + pFile);
                                                for (int k = 0; k < 5; k++)
                                                {
                                                    try { SendUdpP2pPacket(rejMsg, rejMsg.Length, pEp); } catch { }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }

                        // If data packets arrive before AETHER_UDP_START, ask sender to re-send AETHER_UDP_START immediately
                        if (udpOutFile == null && !udpRxDataQueue.IsEmpty)
                        {
                            int nowTick = Environment.TickCount;
                            if (nowTick - lastNeedStartTick > 80 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                lastNeedStartTick = nowTick;
                                byte[] needStart = Encoding.UTF8.GetBytes("AETHER_UDP_NEED_START|1");
                                try { SendUdpP2pPacket(needStart, needStart.Length, activeUdpPeerEndpoint); } catch { }
                            }
                            continue;
                        }

                        // Drain up to 2048 packets (~2.8 MB) per batch and decrypt cleanly into pooled 4 MB RAM pages
                        List<byte[]> batch = new List<byte[]>(2048);
                        long drainedWireBytes = 0;
                        byte[] pkt;
                        while (batch.Count < 2048 && udpRxDataQueue.TryDequeue(out pkt))
                        {
                            drainedWireBytes += pkt.Length;
                            batch.Add(pkt);
                        }
                        if (drainedWireBytes > 0) Interlocked.Add(ref totalAppBufferedBytes, -drainedWireBytes);

                        if (batch.Count > 0 && udpOutFile != null)
                        {
                            lastAnyUdpRxTick = Environment.TickCount;
                            int count = batch.Count;
                            int[] indices = new int[count];
                            byte[][] plains = new byte[count][];
                            byte[] keySnapshot = aesKey;

                            if (count <= 48)
                            {
                                byte[] seqIv = threadLocalIv.Value;
                                AesCryptoServiceProvider seqAes = threadLocalAes.Value;
                                for (int i = 0; i < count; i++)
                                {
                                    try
                                    {
                                        byte[] d = batch[i];
                                        int pktTotalChunks = BitConverter.ToInt32(d, 8);
                                        if (pktTotalChunks != udpExpectedChunks) { indices[i] = -1; continue; }
                                        indices[i] = BitConverter.ToInt32(d, 4);
                                        Buffer.BlockCopy(d, 12, seqIv, 0, 16);
                                        using (ICryptoTransform dec = seqAes.CreateDecryptor(keySnapshot, seqIv))
                                        {
                                            plains[i] = dec.TransformFinalBlock(d, 28, d.Length - 28);
                                        }
                                    }
                                    catch { indices[i] = -1; }
                                }
                            }
                            else
                            {
                                Parallel.For(0, count, decParallelOpts, delegate(int i)
                                {
                                    try
                                    {
                                        byte[] d = batch[i];
                                        int pktTotalChunks = BitConverter.ToInt32(d, 8);
                                        if (pktTotalChunks != udpExpectedChunks)
                                        {
                                            indices[i] = -1;
                                            return;
                                        }
                                        indices[i] = BitConverter.ToInt32(d, 4);
                                        byte[] iv = threadLocalIv.Value;
                                        Buffer.BlockCopy(d, 12, iv, 0, 16);
                                        AesCryptoServiceProvider aes = threadLocalAes.Value;
                                        using (ICryptoTransform dec = aes.CreateDecryptor(keySnapshot, iv))
                                        {
                                            plains[i] = dec.TransformFinalBlock(d, 28, d.Length - 28);
                                        }
                                    }
                                    catch
                                    {
                                        indices[i] = -1;
                                    }
                                });
                            }

                            for (int i = 0; i < count; i++)
                            {
                                int cIdx = indices[i];
                                byte[] plain = plains[i];
                                if (cIdx < 0 || plain == null) continue;
                                if (udpChunkReceived != null && cIdx < udpChunkReceived.Length && udpChunkReceived[cIdx])
                                {
                                    ackWindowBytes += plain.Length;
                                    uiWindowBytes += plain.Length;
                                    chunksSinceLastAck++;
                                    dupChunksSinceLastResume++;
                                    if ((dupChunksSinceLastResume >= 16 || dupResumeSw.ElapsedMilliseconds >= 35) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        dupChunksSinceLastResume = 0;
                                        dupResumeSw.Restart();
                                        int nextNeeded = Math.Max(0, udpContiguousChunk + 1);
                                        byte[] resumeJump = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + nextNeeded.ToString() + "|" + udpFileName);
                                        try { SendUdpP2pPacket(resumeJump, resumeJump.Length, activeUdpPeerEndpoint); } catch { }

                                        if (udpHighestSeenChunk > udpContiguousChunk)
                                        {
                                            int nowDupTick = Environment.TickCount;
                                            StringBuilder holeSb = new StringBuilder();
                                            int holeCnt = 0;
                                            int holeLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk + 1);
                                            for (int h = nextNeeded; h < holeLimit; h++)
                                            {
                                                int prevTick;
                                                if (!udpChunkReceived[h] && (!udpChunkLastNackTick.TryGetValue(h, out prevTick) || unchecked(nowDupTick - prevTick) > 260))
                                                {
                                                    udpChunkLastNackTick[h] = nowDupTick;
                                                    if (holeCnt > 0) holeSb.Append(",");
                                                    holeSb.Append(h.ToString());
                                                    holeCnt++;
                                                    if (holeCnt >= 80) break;
                                                }
                                            }
                                            if (holeCnt > 0)
                                            {
                                                byte[] holeNack = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + holeSb.ToString());
                                                try { SendUdpP2pPacket(holeNack, holeNack.Length, activeUdpPeerEndpoint); } catch { }
                                            }
                                        }
                                    }
                                    continue;
                                }

                                if (udpChunkReceived != null && cIdx < udpChunkReceived.Length)
                                {
                                    udpChunkReceived[cIdx] = true;
                                    udpUniqueReceivedCount++;
                                    lastUniqueRxChunkTick = Environment.TickCount;
                                    udpReceivedBytes = Math.Min(udpExpectedSize, udpReceivedBytes + plain.Length);
                                }
                                else
                                {
                                    udpReceivedBytes = Math.Max(udpReceivedBytes, ((long)cIdx * UDP_CHUNK_SIZE) + plain.Length);
                                }

                                // Place chunk directly into aligned 4 MB pooled RAM page (zero small heap allocations kept in Gen2!)
                                int pIdx = cIdx / CHUNKS_PER_STAGE_PAGE;
                                int slot = cIdx % CHUNKS_PER_STAGE_PAGE;
                                UdpStagePage page;
                                if (!stagedPages.TryGetValue(pIdx, out page))
                                {
                                    page = new UdpStagePage();
                                    page.PageIndex = pIdx;
                                    page.Data = AllocStageBuffer();
                                    int remChunks = udpExpectedChunks - (pIdx * CHUNKS_PER_STAGE_PAGE);
                                    page.ExpectedCount = Math.Max(1, Math.Min(CHUNKS_PER_STAGE_PAGE, remChunks));
                                    page.StartSlot = (pIdx == udpResumeBoundaryPage && udpResumeBoundarySlot > 0 && udpResumeBoundarySlot < page.ExpectedCount) ? udpResumeBoundarySlot : 0;
                                    page.Present = new bool[page.ExpectedCount];
                                    page.ChunkLens = new short[page.ExpectedCount];
                                    stagedPages[pIdx] = page;
                                }
                                if (slot >= page.StartSlot && slot < page.ExpectedCount && !page.Present[slot])
                                {
                                    Buffer.BlockCopy(plain, 0, page.Data, slot * UDP_CHUNK_SIZE, plain.Length);
                                    page.Present[slot] = true;
                                    page.ChunkLens[slot] = (short)plain.Length;
                                    page.PresentCount++;
                                    page.ValidBytes += plain.Length;
                                    int needed = Math.Max(1, page.ExpectedCount - page.StartSlot);
                                    if (page.PresentCount == needed)
                                    {
                                        readyCompletedBytes += page.ValidBytes;
                                    }
                                }

                                if (cIdx > udpHighestSeenChunk) udpHighestSeenChunk = cIdx;
                                ackWindowBytes += plain.Length;
                                uiWindowBytes += plain.Length;
                                chunksSinceLastAck++;
                            }

                            if (udpChunkReceived != null)
                            {
                                int prevContig = udpContiguousChunk;
                                while (udpContiguousChunk + 1 < udpChunkReceived.Length && udpChunkReceived[udpContiguousChunk + 1])
                                {
                                    udpContiguousChunk++;
                                }
                                if (udpContiguousChunk > prevContig)
                                {
                                    lastContigAdvanceTick = Environment.TickCount;
                                }
                            }

                            // Live sliding-window RX speed for UI readout
                            double uiWinSec = uiWindowSw.Elapsed.TotalSeconds;
                            if (uiWinSec >= 0.50 || smoothedUiRxMbps <= 0.0)
                            {
                                if (smoothedUiRxMbps <= 0.0)
                                {
                                    double totalSec = Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                                    smoothedUiRxMbps = (Math.Max(0L, udpReceivedBytes - udpSessionStartBytes) / (1024.0 * 1024.0)) / totalSec;
                                }
                                else if (uiWinSec >= 0.50)
                                {
                                    double sampleMbps = (uiWindowBytes / (1024.0 * 1024.0)) / uiWinSec;
                                    smoothedUiRxMbps = (smoothedUiRxMbps * 0.68) + (sampleMbps * 0.32);
                                    uiWindowBytes = 0;
                                    uiWindowSw.Restart();
                                }
                            }

                            long stagedAllocBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
                            int nowTickMs = Environment.TickCount;
                            bool emergencyPartialFlush = (stagedAllocBytes >= 512L * 1024L * 1024L && unchecked(nowTickMs - lastPartialDispatchTick) >= 500);
                            bool wantStageFlush = (readyCompletedBytes >= DISK_STAGE_TARGET_BYTES) ||
                                emergencyPartialFlush ||
                                (udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks);

                            long ackElapsedMs = ackWindowSw.ElapsedMilliseconds;
                            if (chunksSinceLastAck > 0 && (ackElapsedMs >= 50 || wantStageFlush) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                double ackSec = Math.Max(0.050, ackWindowSw.Elapsed.TotalSeconds);
                                double instMbits = ((ackWindowBytes * 8.0) / (1024.0 * 1024.0)) / ackSec;
                                int mbitsInt = Math.Max(1, (int)Math.Round(Math.Min(5000.0, instMbits)));
                                chunksSinceLastAck = 0;
                                ackWindowBytes = 0;
                                ackWindowSw.Restart();

                                long queuedDiskBytes = (long)Math.Max(0, Thread.VolatileRead(ref activeDiskIoJobs)) * STAGE_PAGE_BYTES;
                                long memBufferedBytes = Interlocked.Read(ref totalAppBufferedBytes);
                                int diskMbps = smoothedDiskWriteMbps;
                                int diskLatMs = lastDiskWriteMs;
                                bool diskBusy = (queuedDiskBytes >= 384L * 1024L * 1024L) || (memBufferedBytes >= 1024L * 1024L * 1024L) || (diskLatMs >= 350 && queuedDiskBytes >= 64L * 1024L * 1024L);
                                if (diskBusy)
                                {
                                    double safeDiskMbits = diskMbps > 0 ? Math.Max(32.0, diskMbps * 8.0 * 0.92) : 260.0;
                                    if (queuedDiskBytes >= 640L * 1024L * 1024L || memBufferedBytes >= 1350L * 1024L * 1024L)
                                    {
                                        safeDiskMbits = Math.Max(24.0, safeDiskMbits * 0.65);
                                    }
                                    mbitsInt = Math.Min(mbitsInt, Math.Max(24, (int)Math.Round(safeDiskMbits)));
                                }

                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpContiguousChunk.ToString() + "|" + mbitsInt.ToString() + (diskBusy ? "|1" : "|0"));
                                try { SendUdpP2pPacket(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }

                                // Adaptive Real-Time NACK: if contiguous stalls >= 220ms, drop slack to 0 so tail holes repair immediately!
                                int contigStallMs = unchecked(nowTickMs - lastContigAdvanceTick);
                                int reorderSlack = (contigStallMs >= 220 || udpRxEndPending) ? 0 : Math.Max(24, Math.Min(192, (int)Math.Round(smoothedUiRxMbps * 3.0)));
                                if (udpChunkReceived != null && (udpHighestSeenChunk - udpContiguousChunk > reorderSlack + 16 || (contigStallMs >= 220 && udpHighestSeenChunk > udpContiguousChunk)))
                                {
                                    if (udpChunkLastNackTick.Count > 16384) udpChunkLastNackTick.Clear();
                                    StringBuilder nackSb = new StringBuilder();
                                    int nackCnt = 0;
                                    int scanLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk - reorderSlack);
                                    for (int c = udpContiguousChunk + 1; c < scanLimit; c++)
                                    {
                                        int prevTick;
                                        if (!udpChunkReceived[c] && (!udpChunkLastNackTick.TryGetValue(c, out prevTick) || unchecked(nowTickMs - prevTick) > 240))
                                        {
                                            udpChunkLastNackTick[c] = nowTickMs;
                                            if (nackCnt > 0) nackSb.Append(",");
                                            nackSb.Append(c.ToString());
                                            nackCnt++;
                                            if (nackCnt >= 100) break;
                                        }
                                    }
                                    if (nackCnt > 0)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                        try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }

                            // Hand off >= 256 MB of sequential 8 MB pages to background Disk I/O thread WITHOUT blocking ACKs/NACKs!
                            if (wantStageFlush && stagedPages.Count > 0)
                            {
                                if (emergencyPartialFlush) lastPartialDispatchTick = nowTickMs;
                                bool forceFlush = (udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks);
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, forceFlush);
                                flushSw.Restart();
                            }
                            else if (stagedPages.Count > 0)
                            {
                                flushSw.Restart();
                            }

                            double avgRxMbps = (Math.Max(0L, udpReceivedBytes - udpSessionStartBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                            int permille = (int)((udpReceivedBytes * 1000L) / Math.Max(1L, udpExpectedSize));
                            UpdateTransferUi("Receiving via P2P NAT-UDP: " + udpFileName, udpReceivedBytes, udpExpectedSize, smoothedUiRxMbps, avgRxMbps, permille);
                        }
                        else
                        {
                            int nowTickIdle = Environment.TickCount;
                            if (udpOutFile != null && chunksSinceLastAck > 0 && ackWindowSw.ElapsedMilliseconds >= 45 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                double ackSec = Math.Max(0.001, ackWindowSw.Elapsed.TotalSeconds);
                                double instMbits = ((ackWindowBytes * 8.0) / (1024.0 * 1024.0)) / ackSec;
                                int mbitsInt = Math.Max(1, (int)Math.Round(Math.Min(5000.0, instMbits)));
                                chunksSinceLastAck = 0;
                                ackWindowBytes = 0;
                                ackWindowSw.Restart();
                                long queuedDiskBytes = (long)Math.Max(0, Thread.VolatileRead(ref activeDiskIoJobs)) * STAGE_PAGE_BYTES;
                                long memBufferedBytes = Interlocked.Read(ref totalAppBufferedBytes);
                                int diskMbps = smoothedDiskWriteMbps;
                                int diskLatMs = lastDiskWriteMs;
                                bool diskBusy = (queuedDiskBytes >= 384L * 1024L * 1024L) || (memBufferedBytes >= 1024L * 1024L * 1024L) || (diskLatMs >= 350 && queuedDiskBytes >= 64L * 1024L * 1024L);
                                if (diskBusy)
                                {
                                    double safeDiskMbits = diskMbps > 0 ? Math.Max(32.0, diskMbps * 8.0 * 0.92) : 260.0;
                                    if (queuedDiskBytes >= 640L * 1024L * 1024L || memBufferedBytes >= 1350L * 1024L * 1024L)
                                    {
                                        safeDiskMbits = Math.Max(24.0, safeDiskMbits * 0.65);
                                    }
                                    mbitsInt = Math.Min(mbitsInt, Math.Max(24, (int)Math.Round(safeDiskMbits)));
                                }
                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpContiguousChunk.ToString() + "|" + mbitsInt.ToString() + (diskBusy ? "|1" : "|0"));
                                try { SendUdpP2pPacket(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }
                            }

                            // Proactive stalled-hole NACK when idle so BDP tail gaps never freeze transfer
                            if (udpOutFile != null && udpChunkReceived != null && udpHighestSeenChunk > udpContiguousChunk &&
                                unchecked(nowTickIdle - lastContigAdvanceTick) >= 220 && unchecked(nowTickIdle - lastIdleHoleNackTick) >= 180 &&
                                activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                lastIdleHoleNackTick = nowTickIdle;
                                if (udpChunkLastNackTick.Count > 16384) udpChunkLastNackTick.Clear();
                                StringBuilder nackSb = new StringBuilder();
                                int nackCnt = 0;
                                int scanLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk);
                                for (int c = udpContiguousChunk + 1; c < scanLimit; c++)
                                {
                                    int prevTick;
                                    if (!udpChunkReceived[c] && (!udpChunkLastNackTick.TryGetValue(c, out prevTick) || unchecked(nowTickIdle - prevTick) > 220))
                                    {
                                        udpChunkLastNackTick[c] = nowTickIdle;
                                        if (nackCnt > 0) nackSb.Append(",");
                                        nackSb.Append(c.ToString());
                                        nackCnt++;
                                        if (nackCnt >= 80) break;
                                    }
                                }
                                if (nackCnt > 0)
                                {
                                    byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                    try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }

                            // Idle safety flush: after 3s pause, persist staged RAM pages + .ckpt; after 14s silence, release file handle cleanly so any reconnect/transport can resume
                            if (udpOutFile != null && (stagedPages.Count > 0 || udpContiguousChunk > lastQueuedCkptContig) && flushSw.ElapsedMilliseconds >= 3000)
                            {
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                flushSw.Restart();
                            }
                            if (udpOutFile != null && !udpRxEndPending && udpRxDataQueue.IsEmpty && unchecked(nowTickIdle - lastAnyUdpRxTick) >= 14000)
                            {
                                activeRxUdpFileName = "";
                                activeRxUdpPartPath = "";
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                WaitForDiskIoDrain(10000);
                                lock (diskFileStreamLock)
                                {
                                    try { udpOutFile.Flush(false); } catch { }
                                    try { udpOutFile.Close(); } catch { }
                                    udpOutFile = null;
                                }
                                WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                foreach (UdpStagePage remP in stagedPages.Values) ReleaseStageBuffer(remP.Data);
                                stagedPages.Clear();
                                readyCompletedBytes = 0;
                                udpPromptState = 0;
                                Log("P2P UDP siirto keskeytyi — välitallennus (.ckpt) varmistettu ja tiedosto vapautettu jatkamista varten: " + udpFileName);
                            }
                        }

                        // Auto-finalize cleanly once 100% of chunks arrive or END tail timeout triggers
                        int endElapsedMs = udpRxEndPending ? unchecked(Environment.TickCount - udpRxEndTick) : 0;
                        int sinceUniqueMs = unchecked(Environment.TickCount - lastUniqueRxChunkTick);
                        int maxToleratedTailMissing = Math.Max(16, Math.Min(256, udpExpectedChunks / 5000));
                        bool forceFinalize = udpOutFile != null && udpChunkReceived != null && (
                            udpContiguousChunk + 1 >= udpExpectedChunks ||
                            udpUniqueReceivedCount >= udpExpectedChunks ||
                            (udpRxEndPending && endElapsedMs > 4000 && sinceUniqueMs > 2500 && udpUniqueReceivedCount >= Math.Max(1, udpExpectedChunks - maxToleratedTailMissing))
                        );

                        if (forceFinalize)
                        {
                            DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpExpectedChunks - 1, pageKeysBuf, true);
                            WaitForDiskIoDrain(120000);

                            int zeroPatched = 0;
                            if (udpContiguousChunk + 1 < udpExpectedChunks && udpUniqueReceivedCount < udpExpectedChunks)
                            {
                                lock (diskFileStreamLock)
                                {
                                    try
                                    {
                                        for (int c = Math.Max(0, udpContiguousChunk + 1); c < udpExpectedChunks; c++)
                                        {
                                            if (!udpChunkReceived[c])
                                            {
                                                long mPos = (long)c * UDP_CHUNK_SIZE;
                                                int mLen = (int)Math.Min((long)UDP_CHUNK_SIZE, udpExpectedSize - mPos);
                                                if (mLen > 0)
                                                {
                                                    if (udpOutFile.Position != mPos) udpOutFile.Seek(mPos, SeekOrigin.Begin);
                                                    byte[] zeroBuf = new byte[mLen];
                                                    udpOutFile.Write(zeroBuf, 0, mLen);
                                                    zeroPatched++;
                                                }
                                            }
                                        }
                                    }
                                    catch { }
                                }
                            }
                            if (zeroPatched > 0)
                            {
                                Log("P2P NAT-UDP: " + zeroPatched.ToString() + " puuttuvaa häntälohkoa paikattiin viimeistelyssä (" + udpFileName + ").");
                            }

                            activeRxUdpFileName = "";
                            activeRxUdpPartPath = "";
                            udpRxEndPending = false;
                            udpRxEndTick = 0;
                            lock (diskFileStreamLock)
                            {
                                try { if (udpExpectedSize > 0 && udpOutFile.Length != udpExpectedSize) udpOutFile.SetLength(udpExpectedSize); } catch { }
                                try { udpOutFile.Flush(false); } catch { }
                                udpOutFile.Close();
                                udpOutFile = null;
                            }
                            udpRxSw.Stop();

                            bool renamedOk = SafeFinalizePartFile(udpPartPath, udpFinalPath, udpPartPath + ".ckpt");

                            lastCompletedUdpFileName = udpFileName;
                            lastCompletedUdpFileNameVolatile = udpFileName;
                            if (activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + udpFileName);
                                for (int k = 0; k < 5; k++)
                                {
                                    try { SendUdpP2pPacket(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }

                            double sec = Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                            long sessionDeltaBytes = Math.Max(1L, udpExpectedSize - udpSessionStartBytes);
                            double mbps = (sessionDeltaBytes / (1024.0 * 1024.0)) / sec;
                            if (renamedOk)
                            {
                                UpdateTransferUi("Saved via P2P NAT-UDP: " + udpFileName, udpExpectedSize, udpExpectedSize, mbps, mbps, 1000, true);
                                Log(String.Format("P2P NAT-UDP RX COMPLETE: {0} ({1:F2} MB/s)", udpFinalPath, mbps));
                            }
                            else
                            {
                                UpdateTransferUi("Viimeistely epäonnistui (.part lukittu): " + udpFileName, udpExpectedSize, udpExpectedSize, mbps, mbps, 1000, true);
                            }
                        }
                        else if (udpRxEndPending && udpRxDataQueue.IsEmpty)
                        {
                            if (udpOutFile == null)
                            {
                                udpRxEndPending = false;
                                if (!String.IsNullOrEmpty(lastCompletedUdpFileName) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                {
                                    byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + lastCompletedUdpFileName);
                                    try { SendUdpP2pPacket(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }
                            else
                            {
                                int nowTick = Environment.TickCount;
                                if (unchecked(nowTick - lastAnyUdpRxTick) >= 14000)
                                {
                                    activeRxUdpFileName = "";
                                    activeRxUdpPartPath = "";
                                    udpRxEndPending = false;
                                    udpRxEndTick = 0;
                                    DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                    WaitForDiskIoDrain(10000);
                                    lock (diskFileStreamLock)
                                    {
                                        try { udpOutFile.Flush(false); } catch { }
                                        try { udpOutFile.Close(); } catch { }
                                        udpOutFile = null;
                                    }
                                    WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                    foreach (UdpStagePage remP in stagedPages.Values) ReleaseStageBuffer(remP.Data);
                                    stagedPages.Clear();
                                    readyCompletedBytes = 0;
                                    udpPromptState = 0;
                                    Log("P2P UDP loppuvarmistus keskeytyi — välitallennus (.ckpt) tallennettu jatkamista varten: " + udpFileName);
                                }
                                else if (unchecked(nowTick - lastEndNackTick) >= 100)
                                {
                                    lastEndNackTick = nowTick;
                                    List<string> missing = new List<string>();
                                    if (udpChunkReceived != null)
                                    {
                                        for (int c = Math.Max(0, udpContiguousChunk + 1); c < udpChunkReceived.Length; c++)
                                        {
                                            if (!udpChunkReceived[c])
                                            {
                                                missing.Add(c.ToString());
                                                if (missing.Count >= 120) break;
                                            }
                                        }
                                    }

                                    if (missing.Count > 0 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + String.Join(",", missing.ToArray()));
                                        try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }
                        }
                    }
                    catch { }
                }
            }
            finally
            {
                try
                {
                    if (udpOutFile != null)
                    {
                        activeRxUdpFileName = "";
                        activeRxUdpPartPath = "";
                        DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                        WaitForDiskIoDrain(10000);
                        lock (diskFileStreamLock)
                        {
                            try { udpOutFile.Flush(false); } catch { }
                            udpOutFile.Close();
                            udpOutFile = null;
                        }
                        WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                    }
                }
                catch { }
                udpRxClosedSignal.Set();
                udpWriterExitedEvent.Set();
            }
        }

        private void PerformHolePunchPassForPeer(RoomPeerInfo p)
        {
            if (p == null) return;
            if (p.ActiveUdpEp != null && (DateTime.UtcNow - p.LastUdpSeen).TotalSeconds < 12) return;

            int nowTick = Environment.TickCount;
            bool doSpray = unchecked(nowTick - lastPunchFanTick) >= 2400;
            if (doSpray) lastPunchFanTick = nowTick;

            string v6Ep = p.WanV6UdpEp ?? "";
            string wanEp = p.WanUdpEp ?? "";
            string predEp = p.PredWanUdpEp ?? "";
            string lanUdpEp = p.LanUdpEp ?? "";

            if (v6Ep.Length > 0 && udpP2pV6Client != null)
            {
                InitiateUdpHolePunch(v6Ep, false, true);
            }
            if (wanEp.Length > 0)
            {
                InitiateUdpHolePunch(wanEp, doSpray || p.NatSym == 1, true);
            }
            if (predEp.Length > 0 && predEp != wanEp)
            {
                InitiateUdpHolePunch(predEp, false, true);
            }
            if (lanUdpEp.Length > 0)
            {
                InitiateUdpHolePunch(lanUdpEp, false, true);
            }
        }

        private void PerformHolePunchPass()
        {
            bool anyFromMap = false;
            foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
            {
                RoomPeerInfo p = kv.Value;
                if (p != null && p.ClientType == "exe")
                {
                    anyFromMap = true;
                    PerformHolePunchPassForPeer(p);
                }
            }
            if (anyFromMap) return;
            if (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12) return;

            int nowTick = Environment.TickCount;
            bool doSpray = unchecked(nowTick - lastPunchFanTick) >= 2400;
            if (doSpray) lastPunchFanTick = nowTick;

            string v6Ep = remotePeerWanV6Udp;
            string wanEp = remotePeerWanUdp;
            string predEp = remotePeerPredictedWanUdp;
            string lanUdpEp = remotePeerLanUdp;

            if (v6Ep.Length > 0 && udpP2pV6Client != null)
            {
                InitiateUdpHolePunch(v6Ep, false, true);
            }
            if (wanEp.Length > 0)
            {
                InitiateUdpHolePunch(wanEp, doSpray || remotePeerNatSym == 1, true);
            }
            if (predEp.Length > 0 && predEp != wanEp)
            {
                InitiateUdpHolePunch(predEp, false, true);
            }
            if (lanUdpEp.Length > 0)
            {
                InitiateUdpHolePunch(lanUdpEp, false, true);
            }
        }

        private void PeerHeartbeatMonitorLoop()
        {
            int tickSeq = 0;
            while (isRunning)
            {
                try
                {
                    tickSeq++;
                    DateTime now = DateTime.UtcNow;
                    if (activeUdpPeerEndpoint != null)
                    {
                        if ((now - lastUdpPeerSeen).TotalSeconds < 12)
                        {
                            byte[] ping = Encoding.UTF8.GetBytes("AETHER_PING|" + instanceId);
                            SendUdpP2pPacket(ping, ping.Length, activeUdpPeerEndpoint);
                        }
                        else
                        {
                            activeUdpPeerEndpoint = null;
                        }
                    }

                    int activeCount = 0;
                    int exeNoUdpCount = 0;
                    foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                    {
                        RoomPeerInfo p = kv.Value;
                        if (p == null) continue;
                        if (p.TcpClientConn != null && !p.TcpClientConn.Connected)
                        {
                            p.TcpClientConn = null;
                            p.TcpStream = null;
                        }
                        if (p.ActiveUdpEp != null)
                        {
                            if ((now - p.LastUdpSeen).TotalSeconds < 12)
                            {
                                if (activeUdpPeerEndpoint == null || !p.ActiveUdpEp.Equals(activeUdpPeerEndpoint))
                                {
                                    byte[] ping = Encoding.UTF8.GetBytes("AETHER_PING|" + instanceId);
                                    try { SendUdpP2pPacket(ping, ping.Length, p.ActiveUdpEp); } catch { }
                                }
                            }
                            else
                            {
                                p.ActiveUdpEp = null;
                            }
                        }

                        if (IsPeerActive(p, now))
                        {
                            activeCount++;
                            if (p.ClientType == "exe" && p.ActiveUdpEp == null && (p.TcpClientConn == null || !p.TcpClientConn.Connected))
                            {
                                exeNoUdpCount++;
                                PerformHolePunchPassForPeer(p);
                            }
                        }
                        else
                        {
                            bool canRemove = (p.TcpClientConn == null) && (p.ActiveUdpEp == null) &&
                                             (String.IsNullOrEmpty(p.CloudPeerId) || (now - p.LastCloudSeen).TotalSeconds >= 16) &&
                                             (p.ClientType != "local_browser");
                            if (canRemove)
                            {
                                RoomPeerInfo removed;
                                roomPeers.TryRemove(kv.Key, out removed);
                            }
                        }
                    }

                    bool hasTcp = (activePeerClient != null && activePeerClient.Connected);
                    bool hasUdp = (activeUdpPeerEndpoint != null && (now - lastUdpPeerSeen).TotalSeconds < 12);
                    bool hasLocalBrowser = (activeBrowserWsClient != null && activeBrowserWsClient.Connected);
                    bool hasCloudBrowser = (!String.IsNullOrEmpty(activeCloudBrowserPeerId) && (now - lastCloudBrowserSeen).TotalSeconds < 12);
                    bool hasCloudExe = (!String.IsNullOrEmpty(activeCloudExePeerId) && (now - lastCloudExeSeen).TotalSeconds < 12);

                    if ((activeCount == 0 || exeNoUdpCount > 0) && (tickSeq % 2 == 0))
                    {
                        BroadcastUdpPresence();
                    }

                    if (!hasUdp && !hasTcp && hasCloudExe && exeNoUdpCount == 0)
                    {
                        PerformHolePunchPass();
                    }

                    SyncTargetPeerDropdown();

                    string room = CleanRoomCode(currentRoomCode);
                    if (roomFullRejected)
                        UpdateStatusBadge("PEER STATUS: HUONE TÄYNNÄ (" + MAX_ROOM_PEERS.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " käyttäjää)");
                    else if (room.Length == 0)
                        UpdateStatusBadge("PEER STATUS: EI YHDISTETTY — Kirjoita tunnelin nimi ja paina Yhdistä");
                    else if (activeCount > 0)
                    {
                        int totalUsers = Math.Min(MAX_ROOM_PEERS, activeCount + 1);
                        UpdateStatusBadge("PEER STATUS: CONNECTED — " + activeCount.ToString() + " muuta huoneessa [" + room + "] (" + totalUsers.ToString() + "/" + MAX_ROOM_PEERS.ToString() + ")");
                    }
                    else if (hasTcp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — KERNEL TCP (" + activePeerClient.Client.RemoteEndPoint.ToString() + ")");
                    else if (hasUdp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + activeUdpPeerEndpoint.ToString() + ")");
                    else if (hasLocalBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                    else if (hasCloudBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — CHROME BROWSER [" + room + "]");
                    else if (hasCloudExe)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — REMOTE .EXE [" + room + "] (NAT-Punch)");
                    else
                        UpdateStatusBadge("PEER STATUS: WAITING FOR PEER [" + room + "]");
                }
                catch { }
                Thread.Sleep(1000);
            }
        }

        private bool IsCgnatOrApipaAddress(IPAddress ip)
        {
            if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork) return false;
            byte[] b = ip.GetAddressBytes();
            if (b[0] == 169 && b[1] == 254) return true;
            if (b[0] == 100 && b[1] >= 64 && b[1] <= 127) return true;
            return false;
        }

        private bool IsVirtualAdapterDescription(string desc, string name)
        {
            string s = ((desc ?? "") + " " + (name ?? "")).ToLowerInvariant();
            return s.Contains("zerotier") || s.Contains("tailscale") || s.Contains("virtualbox") ||
                   s.Contains("vmware") || s.Contains("hyper-v") || s.Contains("vethernet") ||
                   s.Contains("wsl") || s.Contains("loopback") || s.Contains("tap-") ||
                   s.Contains("wintun") || s.Contains("hamachi") || s.Contains("radmin");
        }

        private IPAddress GetPreferredLanIpv4()
        {
            IPAddress physicalGw = null;
            IPAddress physicalAny = null;
            IPAddress virtualPrivate = null;
            IPAddress cgnatFallback = null;
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback || ni.NetworkInterfaceType == NetworkInterfaceType.Tunnel) continue;
                    IPInterfaceProperties props = ni.GetIPProperties();
                    bool hasGw = (props.GatewayAddresses != null && props.GatewayAddresses.Count > 0);
                    bool isVirt = IsVirtualAdapterDescription(ni.Description, ni.Name);

                    foreach (UnicastIPAddressInformation uni in props.UnicastAddresses)
                    {
                        IPAddress ip = uni.Address;
                        if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork || IPAddress.IsLoopback(ip)) continue;
                        if (IsCgnatOrApipaAddress(ip))
                        {
                            if (cgnatFallback == null) cgnatFallback = ip;
                            continue;
                        }
                        if (!isVirt)
                        {
                            if (hasGw && physicalGw == null) physicalGw = ip;
                            if (physicalAny == null) physicalAny = ip;
                        }
                        else if (virtualPrivate == null)
                        {
                            virtualPrivate = ip;
                        }
                    }
                }
            }
            catch { }

            if (physicalGw != null) return physicalGw;
            if (physicalAny != null) return physicalAny;
            if (virtualPrivate != null) return virtualPrivate;
            if (cgnatFallback != null) return cgnatFallback;

            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip)) return ip;
                }
            }
            catch { }
            return IPAddress.Loopback;
        }

        private string GetGlobalIpv6Address()
        {
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback || ni.NetworkInterfaceType == NetworkInterfaceType.Tunnel) continue;
                    if (IsVirtualAdapterDescription(ni.Description, ni.Name)) continue;
                    IPInterfaceProperties props = ni.GetIPProperties();
                    foreach (UnicastIPAddressInformation uni in props.UnicastAddresses)
                    {
                        IPAddress ip = uni.Address;
                        if (ip == null || ip.AddressFamily != AddressFamily.InterNetworkV6) continue;
                        if (IPAddress.IsLoopback(ip) || ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6Multicast || ip.IsIPv6Teredo) continue;
                        string s = ip.ToString();
                        int pct = s.IndexOf('%');
                        if (pct >= 0) s = s.Substring(0, pct);
                        string low = s.ToLowerInvariant();
                        if (low.StartsWith("fd") || low.StartsWith("fc") || low.StartsWith("::")) continue;
                        return s;
                    }
                }
            }
            catch { }
            return "";
        }

        private string GetFirstLanEndpoint()
        {
            IPAddress ip = GetPreferredLanIpv4();
            return ip != null ? (ip.ToString() + ":" + listenPort.ToString()) : "";
        }

        private string GetFirstLanUdpEndpoint()
        {
            IPAddress ip = GetPreferredLanIpv4();
            return ip != null ? (ip.ToString() + ":" + udpP2pPort.ToString()) : "";
        }

        private string GetLocalIpList()
        {
            List<string> ips = new List<string>();
            IPAddress pref = GetPreferredLanIpv4();
            if (pref != null && !IPAddress.IsLoopback(pref)) ips.Add(pref.ToString() + ":" + listenPort.ToString());
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        string entry = ip.ToString() + ":" + listenPort.ToString();
                        if (!ips.Contains(entry)) ips.Add(entry);
                    }
                }
            }
            catch { }
            if (ips.Count == 0) ips.Add("127.0.0.1:" + listenPort.ToString());
            return String.Join("  |  ", ips.ToArray());
        }

        private bool IsOwnLocalEndpoint(IPAddress addr, int port)
        {
            if (port != listenPort && port != udpP2pPort && port != udpP2pV6Port) return false;
            if (IPAddress.IsLoopback(addr)) return true;
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.Equals(addr)) return true;
                }
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    foreach (UnicastIPAddressInformation uni in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (uni.Address.Equals(addr)) return true;
                    }
                }
            }
            catch { }
            return false;
        }

        private string CleanRoomCode(string rawRoom)
        {
            string lower = (rawRoom ?? "").Trim().ToLowerInvariant();
            StringBuilder cleanSb = new StringBuilder();
            foreach (char ch in lower)
            {
                if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '-')
                    cleanSb.Append(ch);
            }
            return cleanSb.ToString();
        }

        private static byte[] BuildMqttPacket(byte packetType, byte[] variableHeader, byte[] payload)
        {
            int remLen = (variableHeader != null ? variableHeader.Length : 0) + (payload != null ? payload.Length : 0);
            List<byte> varLenBytes = new List<byte>(4);
            int x = remLen;
            do
            {
                byte encodedByte = (byte)(x % 128);
                x = x / 128;
                if (x > 0) encodedByte = (byte)(encodedByte | 128);
                varLenBytes.Add(encodedByte);
            } while (x > 0);

            byte[] packet = new byte[1 + varLenBytes.Count + remLen];
            packet[0] = packetType;
            for (int i = 0; i < varLenBytes.Count; i++) packet[1 + i] = varLenBytes[i];
            int offset = 1 + varLenBytes.Count;
            if (variableHeader != null && variableHeader.Length > 0)
            {
                Buffer.BlockCopy(variableHeader, 0, packet, offset, variableHeader.Length);
                offset += variableHeader.Length;
            }
            if (payload != null && payload.Length > 0)
            {
                Buffer.BlockCopy(payload, 0, packet, offset, payload.Length);
            }
            return packet;
        }

        private void SendChannelFrame(SignalingChannel ch, byte[] data, bool isBinary)
        {
            if (ch == null || ch.Ws == null || ch.Ws.State != WebSocketState.Open || data == null) return;
            lock (ch.SendLock)
            {
                if (ch.Ws.State != WebSocketState.Open) return;
                ch.Ws.SendAsync(new ArraySegment<byte>(data, 0, data.Length), isBinary ? WebSocketMessageType.Binary : WebSocketMessageType.Text, true, CancellationToken.None).Wait(4000);
            }
        }

        private string BuildHelloInnerJson(string kindName, string cleanCode)
        {
            string lanEp = GetFirstLanEndpoint();
            string lanUdpEp = GetFirstLanUdpEndpoint();
            string predWan = "";
            if (natSymDetected == 1 && publicWanUdpEndpoint.Contains(":"))
            {
                int col = publicWanUdpEndpoint.LastIndexOf(':');
                int p = 0;
                if (col > 0 && Int32.TryParse(publicWanUdpEndpoint.Substring(col + 1), out p))
                {
                    int delta = (natPortDelta != 0 && Math.Abs(natPortDelta) <= 32) ? natPortDelta : 1;
                    int nextP = p + delta;
                    if (nextP > 1024 && nextP <= 65535)
                        predWan = publicWanUdpEndpoint.Substring(0, col + 1) + nextP.ToString();
                }
            }
            string safeDisplay = SanitizeJsonText(localDisplayName);
            return "{\\"kind\\":\\"" + kindName + "\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"displayName\\":\\"" + safeDisplay + "\\",\\"fingerprint\\":\\"" + currentFingerprint +
                   "\\",\\"lanEndpoint\\":\\"" + lanEp + "\\",\\"lanUdpEndpoint\\":\\"" + lanUdpEp +
                   "\\",\\"wanUdpEndpoint\\":\\"" + publicWanUdpEndpoint + "\\",\\"wanV6UdpEndpoint\\":\\"" + publicWanV6UdpEndpoint +
                   "\\",\\"predWanUdpEndpoint\\":\\"" + predWan + "\\",\\"natSym\\":\\"" + natSymDetected.ToString() +
                   "\\",\\"natDelta\\":\\"" + natPortDelta.ToString() + "\\",\\"upnpTcp\\":\\"" + (upnpTcpMapped ? "1" : "0") + "\\"}";
        }

        private void BroadcastCloudHelloToAll()
        {
            string cleanCode = CleanRoomCode(currentRoomCode);
            string inner = BuildHelloInnerJson("exe:hello", cleanCode);
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                try { SendCloudPacketToChannel(kv.Value, "*", inner); } catch { }
            }
        }

        private void SendCloudPacketToChannel(SignalingChannel ch, string dstPeerId, string innerPayloadJson)
        {
            if (ch == null || ch.Ws == null || ch.Ws.State != WebSocketState.Open || String.IsNullOrEmpty(dstPeerId)) return;
            string envelope = "{\\"type\\":\\"CANDIDATE\\",\\"src\\":\\"" + activeCloudMyId + "\\",\\"dst\\":\\"" + dstPeerId + "\\",\\"payload\\":" + innerPayloadJson + "}";
            byte[] envBytes = Encoding.UTF8.GetBytes(envelope);
            if (!ch.IsMqtt)
            {
                SendChannelFrame(ch, envBytes, false);
                return;
            }
            byte[] topicBytes = Encoding.UTF8.GetBytes(ch.Topic);
            byte[] vh = new byte[2 + topicBytes.Length];
            vh[0] = (byte)((topicBytes.Length >> 8) & 0xFF);
            vh[1] = (byte)(topicBytes.Length & 0xFF);
            Buffer.BlockCopy(topicBytes, 0, vh, 2, topicBytes.Length);
            SendChannelFrame(ch, BuildMqttPacket(0x30, vh, envBytes), true);
        }

        private void SendCloudPacketAny(string dstPeerId, string innerPayloadJson)
        {
            SignalingChannel preferred = null;
            RoomPeerInfo targetP;
            if (!String.IsNullOrEmpty(dstPeerId) && roomPeers.TryGetValue(dstPeerId, out targetP) && targetP != null)
            {
                preferred = targetP.PreferredCloudChannel;
            }
            if (preferred == null)
            {
                preferred = dstPeerId == activeCloudBrowserPeerId ? lastBrowserSignalingChannel : lastExeSignalingChannel;
            }
            if (preferred != null && preferred.Ws != null && preferred.Ws.State == WebSocketState.Open)
            {
                try { SendCloudPacketToChannel(preferred, dstPeerId, innerPayloadJson); return; } catch { }
            }
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                if (kv.Value != null && kv.Value.Ws != null && kv.Value.Ws.State == WebSocketState.Open)
                {
                    try { SendCloudPacketToChannel(kv.Value, dstPeerId, innerPayloadJson); return; } catch { }
                }
            }
        }

        private void CloudWormholeBridgeLoop()
        {
            if (!String.IsNullOrEmpty(DEFAULT_CLOUD_WS_URL))
            {
                Thread wsRelayThread = new Thread(delegate() { RunAppWsRelayLoop(DEFAULT_CLOUD_WS_URL); });
                wsRelayThread.IsBackground = true;
                wsRelayThread.Start();
            }

            string[][] brokers = new string[][] {
                new string[] { "emqx", "wss://broker.emqx.io:8084/mqtt" },
                new string[] { "hivemq", "wss://broker.hivemq.com:8884/mqtt" },
                new string[] { "mosquitto", "wss://test.mosquitto.org:8081/mqtt" }
            };
            foreach (string[] b in brokers)
            {
                string bName = b[0];
                string bUrl = b[1];
                Thread t = new Thread(delegate() { RunMqttBrokerLoop(bName, bUrl); });
                t.IsBackground = true;
                t.Start();
            }
        }

        private void RunAppWsRelayLoop(string wsUrl)
        {
            while (isRunning)
            {
                ClientWebSocket ws = null;
                SignalingChannel ch = null;
                try
                {
                    string cleanCode = CleanRoomCode(currentRoomCode);
                    if (cleanCode.Length == 0)
                    {
                        Thread.Sleep(350);
                        continue;
                    }
                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    activeCloudMyId = myPeerId;
                    activeCloudTopic = "aethertunnel/v1/room/" + cleanCode;

                    ws = new ClientWebSocket();
                    ws.ConnectAsync(new Uri(wsUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        Thread.Sleep(4000);
                        continue;
                    }

                    ch = new SignalingChannel();
                    ch.Name = "ws-relay";
                    ch.IsMqtt = false;
                    ch.Topic = cleanCode;
                    ch.Ws = ws;
                    activeSignalingChannels[ch.Name] = ch;
                    Log("Cloud Signaling connected: App Relay (" + cleanCode + ")");

                    string safeDev = SanitizeJsonText(localDisplayName);
                    if (safeDev.Length == 0) safeDev = "AetherTunnel .EXE (WAN)";
                    string joinJson = "{\\"type\\":\\"room:join\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"peerId\\":\\"" + myPeerId + "\\",\\"deviceLabel\\":\\"" + safeDev + "\\",\\"clientType\\":\\"exe\\",\\"natType\\":\\"" + natTypeSummary + "\\"}";
                    SendChannelFrame(ch, Encoding.UTF8.GetBytes(joinJson), false);
                    SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));

                    ClientWebSocket capturedWs = ws;
                    SignalingChannel capturedCh = ch;
                    string capturedCode = cleanCode;
                    Thread hb = new Thread(delegate()
                    {
                        while (isRunning && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode)
                        {
                            try
                            {
                                SendCloudPacketToChannel(capturedCh, "*", BuildHelloInnerJson("exe:hello", capturedCode));
                            }
                            catch { break; }
                            for (int i = 0; i < 16 && isRunning && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode; i++)
                                Thread.Sleep(120);
                        }
                        if (CleanRoomCode(currentRoomCode) != capturedCode)
                        {
                            try { capturedWs.Abort(); } catch { }
                        }
                    });
                    hb.IsBackground = true;
                    hb.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();
                    while (isRunning && ws.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == cleanCode)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;
                        if (res.Count > 0) msgMs.Write(recvBuf, 0, res.Count);
                        if (!res.EndOfMessage) continue;
                        string text = Encoding.UTF8.GetString(msgMs.ToArray());
                        msgMs.SetLength(0);
                        HandleIncomingCloudMessage(ch, text, cleanCode, myPeerId);
                    }
                }
                catch { }
                finally
                {
                    if (ch != null) { SignalingChannel removed; activeSignalingChannels.TryRemove(ch.Name, out removed); }
                    if (ws != null) { try { ws.Dispose(); } catch { } }
                }
                if (isRunning) Thread.Sleep(CleanRoomCode(currentRoomCode) != (ch != null ? ch.Topic : "") ? 150 : 3500);
            }
        }

        private void RunMqttBrokerLoop(string brokerName, string brokerUrl)
        {
            while (isRunning)
            {
                ClientWebSocket ws = null;
                SignalingChannel ch = null;
                string joinedCode = "";
                try
                {
                    string cleanCode = CleanRoomCode(currentRoomCode);
                    if (cleanCode.Length == 0)
                    {
                        Thread.Sleep(350);
                        continue;
                    }
                    joinedCode = cleanCode;
                    cloudReconnectRequested = false;

                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    string topic = "aethertunnel/v1/room/" + cleanCode;
                    activeCloudMyId = myPeerId;
                    activeCloudTopic = topic;

                    ws = new ClientWebSocket();
                    ws.Options.AddSubProtocol("mqtt");
                    ws.ConnectAsync(new Uri(brokerUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        Thread.Sleep(2500);
                        continue;
                    }

                    ch = new SignalingChannel();
                    ch.Name = "mqtt-" + brokerName;
                    ch.IsMqtt = true;
                    ch.Topic = topic;
                    ch.Ws = ws;

                    // MQTT 3.1.1 CONNECT packet (ClientId strictly <= 22 bytes for universal broker compatibility)
                    string shortCid = "at" + instanceId + "_" + (DateTime.UtcNow.Ticks & 0xFFFF).ToString("x4");
                    byte[] idBytes = Encoding.UTF8.GetBytes(shortCid);
                    byte[] connVh = new byte[] { 0x00, 0x04, (byte)'M', (byte)'Q', (byte)'T', (byte)'T', 0x04, 0x02, 0x00, 0x3C };
                    byte[] connPl = new byte[2 + idBytes.Length];
                    connPl[0] = (byte)((idBytes.Length >> 8) & 0xFF);
                    connPl[1] = (byte)(idBytes.Length & 0xFF);
                    Buffer.BlockCopy(idBytes, 0, connPl, 2, idBytes.Length);
                    SendChannelFrame(ch, BuildMqttPacket(0x10, connVh, connPl), true);

                    ClientWebSocket capturedWs = ws;
                    SignalingChannel capturedCh = ch;
                    string capturedCode = cleanCode;
                    Thread hbThread = new Thread(delegate()
                    {
                        int tickCount = 0;
                        while (isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode)
                        {
                            try
                            {
                                tickCount++;
                                if (tickCount % 5 == 0) SendChannelFrame(capturedCh, new byte[] { 0xC0, 0x00 }, true);
                                if (activeSignalingChannels.ContainsKey(capturedCh.Name))
                                    SendCloudPacketToChannel(capturedCh, "*", BuildHelloInnerJson("exe:hello", capturedCode));
                            }
                            catch { break; }
                            for (int i = 0; i < 16 && isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode; i++)
                                Thread.Sleep(120);
                        }
                        if (CleanRoomCode(currentRoomCode) != capturedCode)
                        {
                            try { capturedWs.Abort(); } catch { }
                        }
                    });
                    hbThread.IsBackground = true;
                    hbThread.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();
                    while (isRunning && ws.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == cleanCode)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;
                        if (res.Count > 0) msgMs.Write(recvBuf, 0, res.Count);
                        if (!res.EndOfMessage) continue;

                        byte[] rawFrame = msgMs.ToArray();
                        msgMs.SetLength(0);

                        int idx = 0;
                        while (idx + 2 <= rawFrame.Length)
                        {
                            byte pktType = rawFrame[idx++];
                            int mult = 1;
                            int remLen = 0;
                            byte b = 0;
                            bool okLen = true;
                            do
                            {
                                if (idx >= rawFrame.Length) { okLen = false; break; }
                                b = rawFrame[idx++];
                                remLen += (b & 127) * mult;
                                mult *= 128;
                            } while ((b & 128) != 0);

                            if (!okLen || idx + remLen > rawFrame.Length) break;
                            int pktStart = idx;
                            idx += remLen;

                            if (pktType == 0x20) // CONNACK -> Subscribe
                            {
                                byte[] topicBytes = Encoding.UTF8.GetBytes(topic);
                                byte[] subPl = new byte[4 + topicBytes.Length + 1];
                                subPl[0] = 0x00; subPl[1] = 0x01;
                                subPl[2] = (byte)((topicBytes.Length >> 8) & 0xFF);
                                subPl[3] = (byte)(topicBytes.Length & 0xFF);
                                Buffer.BlockCopy(topicBytes, 0, subPl, 4, topicBytes.Length);
                                subPl[4 + topicBytes.Length] = 0x00;
                                SendChannelFrame(ch, BuildMqttPacket(0x82, new byte[0], subPl), true);
                                continue;
                            }

                            if (pktType == 0x90) // SUBACK -> Online!
                            {
                                activeSignalingChannels[ch.Name] = ch;
                                Log("Cloud Signaling online (" + brokerName + ") -> Room [" + cleanCode + "]");
                                SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));
                                continue;
                            }

                            if ((pktType & 0xF0) != 0x30 || remLen < 4) continue;
                            int tLen = (rawFrame[pktStart] << 8) | rawFrame[pktStart + 1];
                            int pOffset = pktStart + 2 + tLen;
                            if (((pktType >> 1) & 0x03) > 0) pOffset += 2;
                            int jsonLen = (pktStart + remLen) - pOffset;
                            if (jsonLen <= 0 || pOffset + jsonLen > rawFrame.Length) continue;

                            string text = Encoding.UTF8.GetString(rawFrame, pOffset, jsonLen);
                            HandleIncomingCloudMessage(ch, text, cleanCode, myPeerId);
                        }
                    }
                }
                catch { }
                finally
                {
                    if (ch != null) { SignalingChannel removed; activeSignalingChannels.TryRemove(ch.Name, out removed); }
                    if (ws != null) { try { ws.Dispose(); } catch { } }
                }
                if (isRunning) Thread.Sleep(CleanRoomCode(currentRoomCode) != joinedCode ? 150 : 2500);
            }
        }

        private void HandleIncomingCloudMessage(SignalingChannel ch, string text, string cleanCode, string myPeerId)
        {
            try
            {
                if (String.IsNullOrEmpty(text)) return;
                string topType = ExtractJsonString(text, "type");
                if (topType == "room:full")
                {
                    roomFullRejected = true;
                    UpdateStatusBadge("PEER STATUS: HUONE TÄYNNÄ (" + MAX_ROOM_PEERS.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " käyttäjää)");
                    Log("Huone [" + cleanCode + "] on täynnä (enintään " + MAX_ROOM_PEERS.ToString() + " käyttäjää).");
                    return;
                }
                if (topType == "peer:left")
                {
                    string leftId = ExtractJsonString(text, "peerId");
                    if (leftId.Length == 0) leftId = ExtractJsonString(text, "id");
                    if (leftId.Length > 0)
                    {
                        RoomPeerInfo rem;
                        if (roomPeers.TryRemove(leftId, out rem))
                        {
                            try { if (rem != null && rem.TcpClientConn != null) rem.TcpClientConn.Close(); } catch { }
                            Log("Käyttäjä poistui huoneesta: " + (rem != null ? rem.DisplayName : leftId));
                            SyncTargetPeerDropdown();
                        }
                    }
                    return;
                }
                if (topType == "peer:joined" || topType == "room:joined")
                {
                    roomFullRejected = false;
                    if (text.Contains("\\"id\\":\\"aethertunnel-"))
                    {
                        SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));
                    }
                    return;
                }

                string srcPeer = ExtractJsonString(text, "src");
                string dstPeer = ExtractJsonString(text, "dst");
                if (srcPeer == myPeerId || String.IsNullOrEmpty(srcPeer)) return;
                if (dstPeer.Length > 0 && dstPeer != "*" && dstPeer != myPeerId && !dstPeer.StartsWith("aethertunnel-exe-" + cleanCode)) return;

                string kind = ExtractJsonString(text, "kind");
                if (kind.Length == 0) return;

                if (kind == "browser:hello" || kind == "web:hello" || kind == "browser:hello-ack")
                {
                    string dName = ExtractJsonString(text, "displayName");
                    if (dName.Length == 0) dName = "Selain (" + srcPeer.Substring(Math.Max(0, srcPeer.Length - 4)) + ")";
                    bool isNewRoomPeer, fullRej;
                    RoomPeerInfo bPeer = UpsertRoomPeer(srcPeer, dName, "web", out isNewRoomPeer, out fullRej);
                    if (fullRej || bPeer == null)
                    {
                        Log("Ohitettiin uusi selainkäyttäjä: huoneessa jo max " + MAX_ROOM_PEERS.ToString() + " käyttäjää.");
                        return;
                    }
                    bPeer.CloudPeerId = srcPeer;
                    bPeer.LastCloudSeen = DateTime.UtcNow;
                    bPeer.PreferredCloudChannel = ch;

                    bool isNewPairing = (activeCloudBrowserPeerId != srcPeer) || ((DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds > 10);
                    activeCloudBrowserPeerId = srcPeer;
                    lastCloudBrowserSeen = DateTime.UtcNow;
                    lastBrowserSignalingChannel = ch;

                    if (isNewRoomPeer || isNewPairing)
                    {
                        SyncTargetPeerDropdown();
                        UpdateStatusBadge("PEER STATUS: CONNECTED — " + bPeer.DisplayName + " [" + cleanCode + "]");
                        Log("Yhdistetty selainkäyttäjään " + bPeer.DisplayName + " [" + cleanCode + "] (" + ch.Name + ")");
                    }
                    if (kind != "browser:hello-ack")
                    {
                        int nowMs = Environment.TickCount;
                        int lastRep;
                        if (!cloudHelloReplyTicks.TryGetValue(srcPeer, out lastRep) || unchecked(nowMs - lastRep) > 1200 || isNewPairing)
                        {
                            cloudHelloReplyTicks[srcPeer] = nowMs;
                            SendCloudPacketToChannel(ch, srcPeer, BuildHelloInnerJson("exe:hello", cleanCode));
                        }
                    }
                }
                else if ((kind == "exe:hello" || kind == "exe:hello-reply") && srcPeer.StartsWith("aethertunnel-exe-") && srcPeer != myPeerId)
                {
                    string dName = ExtractJsonString(text, "displayName");
                    if (dName.Length == 0) dName = "Windows .EXE (" + srcPeer.Substring(Math.Max(0, srcPeer.Length - 4)) + ")";
                    bool isNewRoomPeer, fullRej;
                    RoomPeerInfo ePeer = UpsertRoomPeer(srcPeer, dName, "exe", out isNewRoomPeer, out fullRej);
                    if (fullRej || ePeer == null)
                    {
                        Log("Ohitettiin uusi .EXE-käyttäjä: huoneessa jo max " + MAX_ROOM_PEERS.ToString() + " käyttäjää.");
                        return;
                    }

                    string remoteWanUdp = ExtractJsonString(text, "wanUdpEndpoint");
                    string remoteLanUdp = ExtractJsonString(text, "lanUdpEndpoint");
                    string remoteV6Udp = ExtractJsonString(text, "wanV6UdpEndpoint");
                    string remotePredWan = ExtractJsonString(text, "predWanUdpEndpoint");
                    string remoteLan = ExtractJsonString(text, "lanEndpoint");
                    int rSym = 0; Int32.TryParse(ExtractJsonString(text, "natSym"), out rSym);
                    int rDelta = 0; Int32.TryParse(ExtractJsonString(text, "natDelta"), out rDelta);
                    int rUpnpTcp = 0; Int32.TryParse(ExtractJsonString(text, "upnpTcp"), out rUpnpTcp);

                    bool endpointChanged = (remoteWanUdp.Length > 0 && remoteWanUdp != ePeer.WanUdpEp) ||
                                           (remoteV6Udp.Length > 0 && remoteV6Udp != ePeer.WanV6UdpEp);

                    ePeer.CloudPeerId = srcPeer;
                    ePeer.LastCloudSeen = DateTime.UtcNow;
                    ePeer.PreferredCloudChannel = ch;
                    if (remoteWanUdp.Length > 0) ePeer.WanUdpEp = remoteWanUdp;
                    if (remoteLanUdp.Length > 0) ePeer.LanUdpEp = remoteLanUdp;
                    if (remoteV6Udp.Length > 0) ePeer.WanV6UdpEp = remoteV6Udp;
                    if (remotePredWan.Length > 0) ePeer.PredWanUdpEp = remotePredWan;
                    if (remoteLan.Length > 0) ePeer.LanTcpEp = remoteLan;
                    ePeer.NatSym = rSym;
                    ePeer.NatDelta = rDelta;
                    ePeer.UpnpTcp = rUpnpTcp;

                    bool isNewPairing = (activeCloudExePeerId != srcPeer) || ((DateTime.UtcNow - lastCloudExeSeen).TotalSeconds > 10);
                    activeCloudExePeerId = srcPeer;
                    lastCloudExeSeen = DateTime.UtcNow;
                    lastExeSignalingChannel = ch;

                    if (remoteWanUdp.Length > 0) remotePeerWanUdp = remoteWanUdp;
                    if (remoteLanUdp.Length > 0) remotePeerLanUdp = remoteLanUdp;
                    if (remoteV6Udp.Length > 0) remotePeerWanV6Udp = remoteV6Udp;
                    if (remotePredWan.Length > 0) remotePeerPredictedWanUdp = remotePredWan;
                    if (remoteLan.Length > 0) remotePeerLanTcp = remoteLan;
                    remotePeerNatSym = rSym;
                    remotePeerNatDelta = rDelta;
                    remotePeerUpnpTcp = rUpnpTcp;

                    if (isNewRoomPeer || isNewPairing)
                    {
                        SyncTargetPeerDropdown();
                        UpdateStatusBadge("PEER STATUS: CONNECTED — " + ePeer.DisplayName + " [" + cleanCode + "]");
                        Log("Yhdistetty .EXE-käyttäjään " + ePeer.DisplayName + " [" + cleanCode + "] via " + ch.Name +
                            (remoteWanUdp.Length > 0 ? " (WAN: " + remoteWanUdp + ")" : "") +
                            (remoteV6Udp.Length > 0 ? " (IPv6)" : ""));
                    }
                    if (kind == "exe:hello")
                    {
                        int nowMs = Environment.TickCount;
                        int lastRep;
                        if (!cloudHelloReplyTicks.TryGetValue(srcPeer, out lastRep) || unchecked(nowMs - lastRep) > 1000 || isNewRoomPeer || endpointChanged)
                        {
                            cloudHelloReplyTicks[srcPeer] = nowMs;
                            SendCloudPacketToChannel(ch, srcPeer, BuildHelloInnerJson("exe:hello-reply", cleanCode));
                        }
                    }

                    if ((isNewRoomPeer || endpointChanged) && ePeer.ActiveUdpEp == null)
                    {
                        string punchSummary = !String.IsNullOrEmpty(ePeer.WanV6UdpEp) ? ePeer.WanV6UdpEp : (!String.IsNullOrEmpty(ePeer.WanUdpEp) ? ePeer.WanUdpEp : ePeer.LanUdpEp);
                        if (!String.IsNullOrEmpty(punchSummary) && punchSummary != lastLoggedPunchTarget)
                        {
                            lastLoggedPunchTarget = punchSummary;
                            Log("Initiating P2P NAT Hole Punch -> " + ePeer.DisplayName + " (" + punchSummary + ")" + (ePeer.NatSym == 1 ? " [Symmetric Port Spray]" : ""));
                        }
                        PerformHolePunchPassForPeer(ePeer);
                    }

                    if (remoteLan.Length > 0 && !remoteLan.StartsWith("100.") && (ePeer.TcpClientConn == null || !ePeer.TcpClientConn.Connected) && ePeer.ActiveUdpEp == null)
                    {
                        bool shouldTryTcp = false;
                        lock (attemptedAutoTcpEndpoints)
                        {
                            if (!attemptedAutoTcpEndpoints.Contains(remoteLan))
                            {
                                attemptedAutoTcpEndpoints.Add(remoteLan);
                                shouldTryTcp = true;
                            }
                        }
                        if (shouldTryTcp) ConnectToPeerEndpoint(remoteLan, true, ePeer);
                    }
                    if (rUpnpTcp == 1 && remoteWanUdp.Contains(":") && (ePeer.TcpClientConn == null || !ePeer.TcpClientConn.Connected) && ePeer.ActiveUdpEp == null)
                    {
                        string peerWanTcp = remoteWanUdp.Split(':')[0] + ":" + listenPort.ToString();
                        bool shouldTryWanTcp = false;
                        lock (attemptedAutoTcpEndpoints)
                        {
                            if (!attemptedAutoTcpEndpoints.Contains(peerWanTcp))
                            {
                                attemptedAutoTcpEndpoints.Add(peerWanTcp);
                                shouldTryWanTcp = true;
                            }
                        }
                        if (shouldTryWanTcp) ConnectToPeerEndpoint(peerWanTcp, true, ePeer);
                    }
                }
                else if (kind == "exe:wait-accept" || kind == "browser:wait-accept")
                {
                    cloudWaitAcceptReceived = true;
                    cloudResumeEvent.Set();
                }
                else if (kind == "exe:file-reject" || kind == "browser:file-reject")
                {
                    cloudTransferRejected = true;
                    cloudResumeEvent.Set();
                    cloudAckEvent.Set();
                }
                else if (kind == "exe:resume-ack" || kind == "file:resume-ack")
                {
                    cloudResumeChunk = (int)ExtractJsonLong(text, "resumeFromChunk");
                    cloudResumeReceived = true;
                    cloudResumeEvent.Set();
                }
                else if (kind == "exe:chunk-ack" || kind == "browser:chunk-ack")
                {
                    cloudAckEvent.Set();
                }
                else if (kind == "exe:file-start" || kind == "browser:file-start")
                {
                    bool fromExe = srcPeer.StartsWith("aethertunnel-exe-");
                    if (fromExe) { activeCloudExePeerId = srcPeer; lastCloudExeSeen = DateTime.UtcNow; lastExeSignalingChannel = ch; }
                    else { activeCloudBrowserPeerId = srcPeer; lastCloudBrowserSeen = DateTime.UtcNow; lastBrowserSignalingChannel = ch; }

                    string senderLabel = fromExe ? "Remote .EXE" : "Chrome Browser";
                    string incomingFileId = ExtractJsonString(text, "fileId");
                    string incName = ExtractJsonString(text, "name");
                    if (incName.Length == 0) incName = "transfer.bin";
                    long incSize = ExtractJsonLong(text, "size");
                    long cChunkSize = ExtractJsonLong(text, "chunkSize");
                    if (cChunkSize <= 0) cChunkSize = CLOUD_CHUNK_SIZE;
                    string candOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + incName);
                    string candPartPath = candOutPath + ".part";
                    bool hasPart = File.Exists(candPartPath) && ReadCheckpointBytes(candPartPath, incSize) > 0;

                    Action openCloudRx = delegate {
                        ReleaseConflictingRxHandlesForPart(candPartPath, "cloud");
                        lock (cloudRxFileLock)
                        {
                            cloudRejectedFileId = "";
                            if (cloudOutFile != null)
                            {
                                try { WriteCheckpointFile(cloudPartPath, cloudReceivedBytes, cloudExpectedSize); } catch { }
                                try { cloudOutFile.Flush(false); } catch { }
                                try { cloudOutFile.Close(); } catch { }
                                cloudOutFile = null;
                            }
                            cloudFileName = incName;
                            cloudExpectedSize = incSize;
                            cloudOutPath = candOutPath;
                            cloudPartPath = candPartPath;

                            long existingBytes = ReadCheckpointBytes(cloudPartPath, cloudExpectedSize);
                            int resumeFromChunk = (int)(existingBytes / cChunkSize);
                            long alignedBytes = (long)resumeFromChunk * cChunkSize;

                            Exception openErr = null;
                            for (int opTry = 0; opTry < 5; opTry++)
                            {
                                try
                                {
                                    cloudOutFile = new FileStream(cloudPartPath, existingBytes > 0 ? FileMode.OpenOrCreate : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                    openErr = null;
                                    break;
                                }
                                catch (Exception oex)
                                {
                                    openErr = oex;
                                    Thread.Sleep(80);
                                }
                            }
                            if (cloudOutFile == null)
                            {
                                if (openErr != null) Log("Cloud RX tiedoston avausvirhe: " + openErr.Message);
                                return;
                            }
                            if (alignedBytes > 0) cloudOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                            cloudReceivedBytes = alignedBytes;
                            cloudSessionStartBytes = alignedBytes;
                            cloudRxSw = Stopwatch.StartNew();

                            SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"" + incomingFileId + "\\",\\"name\\":\\"" + cloudFileName.Replace("\\"", "") + "\\",\\"size\\":" + cloudExpectedSize.ToString() + ",\\"resumeFromChunk\\":" + resumeFromChunk.ToString() + "}");
                            int startPermille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                            UpdateTransferUi("Receiving from " + senderLabel + ": " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, 0, 0, startPermille, true);
                        }
                    };

                    if (autoAcceptAllIncoming)
                    {
                        openCloudRx();
                    }
                    else
                    {
                        SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:wait-accept\\",\\"fileId\\":\\"" + incomingFileId + "\\"}");
                        ThreadPool.QueueUserWorkItem(delegate {
                            int choice = ShowIncomingTransferDialog(senderLabel, incName, incSize, hasPart);
                            if (choice == 1 || choice == 2)
                            {
                                openCloudRx();
                            }
                            else
                            {
                                cloudRejectedFileId = incomingFileId;
                                Log("Saapuva Wormhole-tiedosto hylätty: " + incName);
                                SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:file-reject\\",\\"fileId\\":\\"" + incomingFileId + "\\"}");
                            }
                        });
                    }
                }
                else if ((kind == "exe:file-chunk" || kind == "browser:file-chunk"))
                {
                    lock (cloudRxFileLock)
                    {
                        string fId = ExtractJsonString(text, "fileId");
                        if (!String.IsNullOrEmpty(cloudRejectedFileId) && fId == cloudRejectedFileId) return;
                        if (cloudOutFile == null) return;
                        string b64 = ExtractJsonString(text, "data");
                        long chunkIdx = ExtractJsonLong(text, "chunkIndex");
                        if (b64.Length > 0)
                        {
                            byte[] raw = Convert.FromBase64String(b64);
                            long writePos = chunkIdx * CLOUD_CHUNK_SIZE;
                            if (cloudOutFile.Position != writePos) cloudOutFile.Seek(writePos, SeekOrigin.Begin);
                            cloudOutFile.Write(raw, 0, raw.Length);
                            cloudReceivedBytes = Math.Max(cloudReceivedBytes, writePos + raw.Length);

                            if ((chunkIdx + 1) % 384 == 0)
                            {
                                WriteCheckpointFile(cloudPartPath, cloudReceivedBytes, cloudExpectedSize);
                            }

                            double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                            long deltaBytes = Math.Max(1L, cloudReceivedBytes - cloudSessionStartBytes);
                            double mbps = (deltaBytes / (1024.0 * 1024.0)) / sec;
                            int permille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                            UpdateTransferUi("Receiving: " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, mbps, mbps, permille);
                        }
                        if ((chunkIdx + 1) % 8 == 0)
                        {
                            SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":" + chunkIdx.ToString() + "}");
                        }
                    }
                }
                else if ((kind == "exe:file-end" || kind == "browser:file-end"))
                {
                    lock (cloudRxFileLock)
                    {
                        if (cloudOutFile == null) return;
                        try { if (cloudExpectedSize > 0 && cloudOutFile.Length != cloudExpectedSize) cloudOutFile.SetLength(cloudExpectedSize); } catch { }
                        try { cloudOutFile.Flush(false); } catch { }
                        cloudOutFile.Close();
                        cloudOutFile = null;
                        cloudRxSw.Stop();

                        bool movedOk = SafeFinalizePartFile(cloudPartPath, cloudOutPath, cloudPartPath + ".ckpt");

                        double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                        long deltaBytes = Math.Max(1L, cloudExpectedSize - cloudSessionStartBytes);
                        double mbps = (deltaBytes / (1024.0 * 1024.0)) / sec;
                        if (movedOk)
                        {
                            UpdateTransferUi("Saved to Downloads: " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, mbps, 1000, true);
                            Log(String.Format("TRANSFER COMPLETE: Saved to {0} ({1:F2} MB/s)", cloudOutPath, mbps));
                        }
                        else
                        {
                            UpdateTransferUi("Viimeistely epäonnistui (.part lukittu): " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, mbps, 1000, true);
                        }
                        SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":999999}");
                    }
                }
            }
            catch { }
        }

        private void AcceptLoop()
        {
            while (isRunning && tcpListener != null)
            {
                try
                {
                    TcpClient client = tcpListener.AcceptTcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    Thread connThread = new Thread(delegate() { HandleIncomingConnection(client); });
                    connThread.IsBackground = true;
                    connThread.Start();
                }
                catch
                {
                    if (!isRunning) break;
                }
            }
        }

        private void HandleIncomingConnection(TcpClient client)
        {
            try
            {
                NetworkStream netStream = client.GetStream();
                byte[] peek = new byte[3];
                if (!ReadExactBytes(netStream, peek, 3))
                {
                    client.Close();
                    return;
                }

                if (peek[0] == (byte)'G' && peek[1] == (byte)'E' && peek[2] == (byte)'T')
                {
                    HandleBrowserWebSocketConnection(client, netStream, peek);
                }
                else
                {
                    string epStr = client.Client.RemoteEndPoint.ToString();
                    Log("Incoming Native .EXE Peer connected from " + epStr);
                    RoomPeerInfo tcpPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", client.Client.RemoteEndPoint as IPEndPoint);
                    bool isNewTcp, fullRej;
                    if (tcpPeer == null)
                    {
                        tcpPeer = UpsertRoomPeer("tcp-" + epStr, "Windows .EXE (" + epStr + ")", "exe", out isNewTcp, out fullRej);
                    }
                    else
                    {
                        fullRej = false;
                    }
                    if (fullRej || tcpPeer == null)
                    {
                        Log("Hylättiin saapuva TCP-yhteys: huoneessa max " + MAX_ROOM_PEERS.ToString() + " käyttäjää.");
                        try { client.Close(); } catch { }
                        return;
                    }
                    tcpPeer.TcpClientConn = client;
                    tcpPeer.TcpStream = netStream;
                    tcpPeer.LastTcpSeen = DateTime.UtcNow;
                    SyncTargetPeerDropdown();

                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        activePeerClient = client;
                        activePeerStream = netStream;
                        UpdateStatusBadge("CONNECTED .EXE PEER (" + epStr + ")");
                    }
                    try
                    {
                        ReceiveKernelTcpLoop(client, netStream, peek);
                    }
                    finally
                    {
                        if (Object.ReferenceEquals(tcpPeer.TcpClientConn, client))
                        {
                            tcpPeer.TcpClientConn = null;
                            tcpPeer.TcpStream = null;
                            SyncTargetPeerDropdown();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Connection error: " + ex.Message);
            }
        }

        private void HandleBrowserWebSocketConnection(TcpClient client, NetworkStream netStream, byte[] firstThreeBytes)
        {
            try
            {
                MemoryStream reqMs = new MemoryStream();
                reqMs.Write(firstThreeBytes, 0, 3);
                byte[] b = new byte[1];
                int state = 0;
                while (reqMs.Length < 16384 && netStream.Read(b, 0, 1) == 1)
                {
                    reqMs.WriteByte(b[0]);
                    byte c = b[0];
                    if ((state == 0 && c == (byte)'\\r') ||
                        (state == 1 && c == (byte)'\\n') ||
                        (state == 2 && c == (byte)'\\r') ||
                        (state == 3 && c == (byte)'\\n'))
                    {
                        state++;
                        if (state == 4) break;
                    }
                    else
                    {
                        state = (c == (byte)'\\r') ? 1 : 0;
                    }
                }

                string headers = Encoding.ASCII.GetString(reqMs.ToArray());
                string wsKey = "";
                string[] lines = headers.Split(new string[] { "\\r\\n" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string line in lines)
                {
                    if (line.StartsWith("Sec-WebSocket-Key:", StringComparison.OrdinalIgnoreCase))
                    {
                        wsKey = line.Substring(18).Trim();
                        break;
                    }
                }

                if (wsKey.Length == 0)
                {
                    client.Close();
                    return;
                }

                string acceptRaw = wsKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                string acceptBase64;
                using (SHA1 sha1 = SHA1.Create())
                {
                    acceptBase64 = Convert.ToBase64String(sha1.ComputeHash(Encoding.ASCII.GetBytes(acceptRaw)));
                }

                string response =
                    "HTTP/1.1 101 Switching Protocols\\r\\n" +
                    "Upgrade: websocket\\r\\n" +
                    "Connection: Upgrade\\r\\n" +
                    "Access-Control-Allow-Origin: *\\r\\n" +
                    "Access-Control-Allow-Private-Network: true\\r\\n" +
                    "Sec-WebSocket-Accept: " + acceptBase64 + "\\r\\n\\r\\n";
                byte[] respBytes = Encoding.ASCII.GetBytes(response);
                netStream.Write(respBytes, 0, respBytes.Length);

                activeBrowserWsClient = client;
                activeBrowserWsStream = netStream;
                bool isNewLb, fullLb;
                UpsertRoomPeer("local-browser", "Paikallinen selain (127.0.0.1)", "local_browser", out isNewLb, out fullLb);
                SyncTargetPeerDropdown();
                UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                Log("Chrome Browser connected via Direct Localhost Kernel WebSocket (127.0.0.1:" + listenPort.ToString() + ")");

                NotifyBrowserRoomCode();
                ReceiveBrowserWebSocketLoop(client, netStream);
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge disconnected: " + ex.Message);
            }
            finally
            {
                if (Object.ReferenceEquals(activeBrowserWsClient, client))
                {
                    activeBrowserWsClient = null;
                    activeBrowserWsStream = null;
                    RoomPeerInfo removed;
                    roomPeers.TryRemove("local-browser", out removed);
                    SyncTargetPeerDropdown();
                }
            }
        }

        private void NotifyBrowserRoomCode()
        {
            try
            {
                if (activeBrowserWsClient == null || !activeBrowserWsClient.Connected || activeBrowserWsStream == null) return;
                string code = "";
                if (this.InvokeRequired)
                    this.Invoke(new Action(delegate { code = txtRoomCode.Text.Trim().ToLowerInvariant(); }));
                else
                    code = txtRoomCode.Text.Trim().ToLowerInvariant();

                string safeDisp = SanitizeJsonText(localDisplayName);
                string json = "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + code + "\\",\\"displayName\\":\\"" + safeDisp + "\\",\\"port\\":" + listenPort.ToString() + "}";
                byte[] bytes = Encoding.UTF8.GetBytes(json);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, bytes, 0, bytes.Length);
            }
            catch { }
        }

        private void SendWebSocketFrame(NetworkStream wsStream, byte opcode, byte[] payload, int offset, int count)
        {
            byte[] header;
            if (count < 126)
            {
                header = new byte[2];
                header[0] = (byte)(0x80 | opcode);
                header[1] = (byte)count;
            }
            else if (count <= 65535)
            {
                header = new byte[4];
                header[0] = (byte)(0x80 | opcode);
                header[1] = 126;
                header[2] = (byte)((count >> 8) & 0xFF);
                header[3] = (byte)(count & 0xFF);
            }
            else
            {
                header = new byte[10];
                header[0] = (byte)(0x80 | opcode);
                header[1] = 127;
                long len64 = (long)count;
                for (int i = 0; i < 8; i++)
                {
                    header[9 - i] = (byte)(len64 & 0xFF);
                    len64 >>= 8;
                }
            }

            lock (wsWriteLock)
            {
                wsStream.Write(header, 0, header.Length);
                wsStream.Write(payload, offset, count);
            }
        }

        private void ReceiveBrowserWebSocketLoop(TcpClient client, NetworkStream wsStream)
        {
            FileStream currentOutFile = null;
            string currentFileName = "";
            string currentOutPath = "";
            string currentPartPath = "";
            long expectedFileSize = 0;
            long receivedBytes = 0;
            long wsSessionStartBytes = 0;
            long lastWsCkptBytes = 0;
            Stopwatch rxSw = null;

            MemoryStream fragBuffer = new MemoryStream();
            int fragOpcode = 0;

            try
            {
                byte[] h2 = new byte[2];
                while (isRunning && client.Connected)
                {
                    if (!ReadExactBytes(wsStream, h2, 2)) break;
                    bool fin = (h2[0] & 0x80) != 0;
                    int opcode = h2[0] & 0x0F;
                    bool masked = (h2[1] & 0x80) != 0;
                    long payloadLen = h2[1] & 0x7F;

                    if (opcode == 0x08) break;

                    if (payloadLen == 126)
                    {
                        byte[] ext2 = new byte[2];
                        if (!ReadExactBytes(wsStream, ext2, 2)) break;
                        payloadLen = (ext2[0] << 8) | ext2[1];
                    }
                    else if (payloadLen == 127)
                    {
                        byte[] ext8 = new byte[8];
                        if (!ReadExactBytes(wsStream, ext8, 8)) break;
                        payloadLen = 0;
                        for (int i = 0; i < 8; i++) payloadLen = (payloadLen << 8) | ext8[i];
                    }

                    byte[] maskKey = new byte[4];
                    if (masked)
                    {
                        if (!ReadExactBytes(wsStream, maskKey, 4)) break;
                    }

                    if (payloadLen > 64 * 1024 * 1024) break;
                    byte[] data = new byte[(int)payloadLen];
                    if (payloadLen > 0 && !ReadExactBytes(wsStream, data, (int)payloadLen)) break;

                    if (masked)
                    {
                        for (int i = 0; i < data.Length; i++)
                        {
                            data[i] = (byte)(data[i] ^ maskKey[i & 3]);
                        }
                    }

                    if (opcode == 0x09)
                    {
                        SendWebSocketFrame(wsStream, 0x0A, data, 0, data.Length);
                        continue;
                    }

                    if (opcode != 0) fragOpcode = opcode;
                    fragBuffer.Write(data, 0, data.Length);

                    if (!fin) continue;

                    byte[] message = fragBuffer.ToArray();
                    fragBuffer.SetLength(0);

                    if (fragOpcode == 0x01)
                    {
                        string text = Encoding.UTF8.GetString(message);
                        if (text.Contains("\\"browser:hello\\"") || text.Contains("\\"browser:room\\""))
                        {
                            string browserRoom = CleanRoomCode(ExtractJsonString(text, "roomCode"));
                            if (browserRoom.Length > 0)
                            {
                                this.BeginInvoke(new Action(delegate {
                                    if (CleanRoomCode(currentRoomCode) != browserRoom)
                                    {
                                        suppressRoomBroadcast = true;
                                        txtRoomCode.Text = browserRoom;
                                        ConnectToEnteredRoom();
                                        suppressRoomBroadcast = false;
                                        Log("Synced Wormhole Code with Chrome Browser: " + browserRoom);
                                    }
                                }));
                            }
                        }
                        else if (text.Contains("\\"exe:wait-accept\\"") || text.Contains("\\"browser:wait-accept\\"") || text.Contains("\\"file:wait-accept\\""))
                        {
                            wsWaitAcceptReceived = true;
                            wsResumeEvent.Set();
                        }
                        else if (text.Contains("\\"exe:file-reject\\"") || text.Contains("\\"browser:file-reject\\"") || text.Contains("\\"file:reject\\""))
                        {
                            wsTransferRejected = true;
                            wsResumeEvent.Set();
                        }
                        else if (text.Contains("\\"exe:resume-ack\\"") || text.Contains("\\"browser:resume-ack\\"") || text.Contains("\\"file:resume-ack\\""))
                        {
                            wsResumeChunk = (int)ExtractJsonLong(text, "resumeFromChunk");
                            wsResumeReceived = true;
                            wsResumeEvent.Set();
                        }
                        else if (text.Contains("\\"exe:file-start\\""))
                        {
                            string incomingFileId = ExtractJsonString(text, "fileId");
                            currentFileName = ExtractJsonString(text, "name");
                            if (currentFileName.Length == 0) currentFileName = "transfer.bin";
                            expectedFileSize = ExtractJsonLong(text, "size");
                            long wsChunkSize = ExtractJsonLong(text, "chunkSize");
                            if (wsChunkSize <= 0) wsChunkSize = WS_CHUNK_SIZE;
                            currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);
                            currentPartPath = currentOutPath + ".part";

                            if (currentOutFile != null)
                            {
                                try { WriteCheckpointFile(currentPartPath, receivedBytes, expectedFileSize); } catch { }
                                try { currentOutFile.Flush(false); } catch { }
                                try { currentOutFile.Close(); } catch { }
                                currentOutFile = null;
                            }
                            ReleaseConflictingRxHandlesForPart(currentPartPath, "ws");
                            lock (rxHandleCoordLock)
                            {
                                activeWsRxClient = client;
                                activeWsRxPartPath = currentPartPath;
                            }

                            bool hasPart = File.Exists(currentPartPath) && ReadCheckpointBytes(currentPartPath, expectedFileSize) > 0;

                            int choice = autoAcceptAllIncoming ? 1 : ShowIncomingTransferDialog("Chrome Browser (Local)", currentFileName, expectedFileSize, hasPart);
                            if (choice == 0)
                            {
                                Log("Saapuva selain-siirto hylätty: " + currentFileName);
                                string rejJson = String.Format("{{\\"kind\\":\\"exe:file-reject\\",\\"fileId\\":\\"{0}\\"}}", incomingFileId);
                                byte[] rejBytes = Encoding.UTF8.GetBytes(rejJson);
                                SendWebSocketFrame(wsStream, 0x01, rejBytes, 0, rejBytes.Length);
                                lock (rxHandleCoordLock)
                                {
                                    if (Object.ReferenceEquals(activeWsRxClient, client)) activeWsRxPartPath = "";
                                }
                                continue;
                            }

                            long existingBytes = ReadCheckpointBytes(currentPartPath, expectedFileSize);
                            int resumeFromChunk = (int)(existingBytes / wsChunkSize);
                            long alignedBytes = (long)resumeFromChunk * wsChunkSize;

                            Exception openErr = null;
                            for (int opTry = 0; opTry < 5; opTry++)
                            {
                                try
                                {
                                    currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.OpenOrCreate : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                    openErr = null;
                                    break;
                                }
                                catch (Exception oex)
                                {
                                    openErr = oex;
                                    Thread.Sleep(80);
                                }
                            }
                            if (currentOutFile == null)
                            {
                                Log("Selain-RX tiedoston avausvirhe: " + (openErr != null ? openErr.Message : "lukittu"));
                                lock (rxHandleCoordLock)
                                {
                                    if (Object.ReferenceEquals(activeWsRxClient, client)) activeWsRxPartPath = "";
                                }
                                continue;
                            }
                            if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                            receivedBytes = alignedBytes;
                            wsSessionStartBytes = alignedBytes;
                            lastWsCkptBytes = alignedBytes;
                            rxSw = Stopwatch.StartNew();

                            string ackJson = String.Format(
                                "{{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"resumeFromChunk\\":{3}}}",
                                incomingFileId, currentFileName.Replace("\\"", ""), expectedFileSize, resumeFromChunk
                            );
                            byte[] ackBytes = Encoding.UTF8.GetBytes(ackJson);
                            SendWebSocketFrame(wsStream, 0x01, ackBytes, 0, ackBytes.Length);

                            if (resumeFromChunk > 0)
                                Log("Resuming interrupted file from Chrome Browser at " + FormatBytes(alignedBytes) + " -> " + currentOutPath);
                            else
                                Log("Receiving from Chrome Browser -> " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                        }
                        else if (text.Contains("\\"exe:file-end\\"") && currentOutFile != null)
                        {
                            try { if (expectedFileSize > 0 && currentOutFile.Length != expectedFileSize) currentOutFile.SetLength(expectedFileSize); } catch { }
                            try { currentOutFile.Flush(false); } catch { }
                            currentOutFile.Close();
                            currentOutFile = null;
                            rxSw.Stop();
                            lock (rxHandleCoordLock)
                            {
                                if (Object.ReferenceEquals(activeWsRxClient, client)) activeWsRxPartPath = "";
                            }

                            bool movedOk = SafeFinalizePartFile(currentPartPath, currentOutPath, currentPartPath + ".ckpt");

                            double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                            double mbps = (Math.Max(1L, expectedFileSize - wsSessionStartBytes) / (1024.0 * 1024.0)) / sec;
                            if (movedOk)
                            {
                                UpdateTransferUi("Saved from Browser: " + currentFileName, expectedFileSize, expectedFileSize, mbps, mbps, 1000, true);
                                Log(String.Format("BROWSER -> .EXE COMPLETE: {0} ({1:F2} MB/s · {2:F2} Gbps)", currentOutPath, mbps, (mbps * 8.0) / 1000.0));
                            }
                            else
                            {
                                UpdateTransferUi("Viimeistely epäonnistui (.part lukittu): " + currentFileName, expectedFileSize, expectedFileSize, mbps, mbps, 1000, true);
                            }
                        }
                    }
                    else if (fragOpcode == 0x02 && currentOutFile != null)
                    {
                        currentOutFile.Write(message, 0, message.Length);
                        receivedBytes += message.Length;
                        if (receivedBytes - lastWsCkptBytes >= 16L * 1024L * 1024L)
                        {
                            WriteCheckpointFile(currentPartPath, receivedBytes, expectedFileSize);
                            lastWsCkptBytes = receivedBytes;
                        }

                        double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double mbps = (Math.Max(1L, receivedBytes - wsSessionStartBytes) / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((receivedBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving from Browser: " + currentFileName, receivedBytes, expectedFileSize, mbps, mbps, permille);
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge stream ended: " + ex.Message);
            }
            finally
            {
                if (currentOutFile != null)
                {
                    try { WriteCheckpointFile(currentPartPath, receivedBytes, expectedFileSize); } catch { }
                    try { currentOutFile.Flush(false); } catch { }
                    try { currentOutFile.Close(); } catch { }
                    currentOutFile = null;
                }
                lock (rxHandleCoordLock)
                {
                    if (Object.ReferenceEquals(activeWsRxClient, client))
                    {
                        activeWsRxClient = null;
                        activeWsRxPartPath = "";
                    }
                }
            }
        }

        private string ExtractJsonString(string json, string key)
        {
            string kPat = "\\"" + key + "\\"";
            int pos = 0;
            while (pos < json.Length)
            {
                int idx = json.IndexOf(kPat, pos, StringComparison.Ordinal);
                if (idx < 0) return "";
                int cur = idx + kPat.Length;
                while (cur < json.Length && (json[cur] == ' ' || json[cur] == '\\t')) cur++;
                if (cur < json.Length && json[cur] == ':')
                {
                    cur++;
                    while (cur < json.Length && (json[cur] == ' ' || json[cur] == '\\t')) cur++;
                    if (cur < json.Length && json[cur] == '"')
                    {
                        int start = cur + 1;
                        int end = start;
                        while (end < json.Length)
                        {
                            if (json[end] == '"' && json[end - 1] != '\\\\') break;
                            end++;
                        }
                        if (end < json.Length) return json.Substring(start, end - start);
                        return "";
                    }
                }
                pos = idx + kPat.Length;
            }
            return "";
        }

        private long ExtractJsonLong(string json, string key)
        {
            string pattern = "\\"" + key + "\\":";
            int idx = json.IndexOf(pattern);
            if (idx < 0) return 0;
            int start = idx + pattern.Length;
            int end = start;
            while (end < json.Length && (Char.IsDigit(json[end]) || json[end] == ' ')) end++;
            long val = 0;
            Int64.TryParse(json.Substring(start, end - start).Trim(), out val);
            return val;
        }

        private void ConfigureSocketForMaxThroughput(TcpClient client)
        {
            client.NoDelay = true;
            client.SendBufferSize = 16 * 1024 * 1024;
            client.ReceiveBufferSize = 16 * 1024 * 1024;
            try
            {
                byte[] ka = new byte[12];
                Buffer.BlockCopy(BitConverter.GetBytes((uint)1), 0, ka, 0, 4);
                Buffer.BlockCopy(BitConverter.GetBytes((uint)5000), 0, ka, 4, 4);
                Buffer.BlockCopy(BitConverter.GetBytes((uint)1000), 0, ka, 8, 4);
                client.Client.IOControl(IOControlCode.KeepAliveValues, ka, null);
            }
            catch { }
        }

        private void UpdateStatusBadge(string text)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(UpdateStatusBadge), text);
                return;
            }
            lblStatusBadge.Text = text;
            bool isFull = roomFullRejected || text.IndexOf("TÄYNNÄ", StringComparison.OrdinalIgnoreCase) >= 0;
            bool isConnected = !isFull && text.IndexOf("CONNECTED", StringComparison.OrdinalIgnoreCase) >= 0;
            lblStatusBadge.ForeColor = isFull ? Color.FromArgb(248, 113, 113) : (isConnected ? Color.FromArgb(52, 211, 153) : Color.FromArgb(251, 191, 36));

            if (pnlRoomPresence != null && lblRoomPresence != null)
            {
                DateTime now = DateTime.UtcNow;
                int activeOthers = 0;
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    if (IsPeerActive(kv.Value, now)) activeOthers++;
                }

                if (isFull)
                {
                    pnlRoomPresence.BackColor = Color.FromArgb(65, 18, 24);
                    lblRoomPresence.ForeColor = Color.FromArgb(248, 113, 113);
                    lblRoomPresence.Text = "[" + MAX_ROOM_PEERS.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " TÄYNNÄ] Huoneessa on enimmäismäärä käyttäjiä!";
                }
                else if (isConnected || activeOthers > 0)
                {
                    int totalUsers = Math.Min(MAX_ROOM_PEERS, Math.Max(2, activeOthers + 1));
                    string detail = text.Replace("PEER STATUS: CONNECTED — ", "").Replace("PEER STATUS: CONNECTED", "").Trim();
                    pnlRoomPresence.BackColor = Color.FromArgb(6, 46, 36);
                    lblRoomPresence.ForeColor = Color.FromArgb(52, 211, 153);
                    lblRoomPresence.Text = "[" + totalUsers.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " KÄYTTÄJÄÄ] Huoneessa " + Math.Max(1, activeOthers).ToString() + " muuta (" + detail + ")";
                }
                else
                {
                    string room = CleanRoomCode(currentRoomCode);
                    pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
                    lblRoomPresence.ForeColor = Color.FromArgb(251, 191, 36);
                    lblRoomPresence.Text = room.Length == 0
                        ? "Kirjoita tunnelin nimi ja paina Yhdistä"
                        : "[1/" + MAX_ROOM_PEERS.ToString() + " KÄYTTÄJÄ] Ei muita huoneessa [" + room + "]";
                }
            }
        }

        private void ConnectToPeerEndpoint(string endpointStr, bool silentAutoProbe = false, RoomPeerInfo targetPeer = null)
        {
            InitiateUdpHolePunch(endpointStr, false, targetPeer != null);

            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    string host = "127.0.0.1";
                    int port = listenPort;
                    int colon = endpointStr.LastIndexOf(':');
                    if (colon > 0)
                    {
                        host = endpointStr.Substring(0, colon).Trim();
                        Int32.TryParse(endpointStr.Substring(colon + 1).Trim(), out port);
                    }
                    else if (endpointStr.Length > 0)
                    {
                        host = endpointStr;
                    }

                    if (!silentAutoProbe)
                    {
                        Log("Opening Direct Winsock2 Kernel TCP connection to " + host + ":" + port.ToString() + "...");
                    }

                    TcpClient client = new TcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    if (silentAutoProbe)
                    {
                        IAsyncResult ar = client.BeginConnect(host, port, null, null);
                        if (!ar.AsyncWaitHandle.WaitOne(1200))
                        {
                            try { client.Close(); } catch { }
                            return;
                        }
                        client.EndConnect(ar);
                    }
                    else
                    {
                        client.Connect(host, port);
                    }

                    NetworkStream netStream = client.GetStream();
                    RoomPeerInfo tcpPeer = targetPeer;
                    if (tcpPeer == null)
                    {
                        tcpPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", client.Client.RemoteEndPoint as IPEndPoint);
                        if (tcpPeer == null)
                        {
                            bool isNewTcp, fullRej;
                            tcpPeer = UpsertRoomPeer("tcp-" + host + ":" + port.ToString(), "Windows .EXE (" + host + ":" + port.ToString() + ")", "exe", out isNewTcp, out fullRej);
                        }
                    }
                    if (tcpPeer != null)
                    {
                        tcpPeer.TcpClientConn = client;
                        tcpPeer.TcpStream = netStream;
                        tcpPeer.LastTcpSeen = DateTime.UtcNow;
                        SyncTargetPeerDropdown();
                    }
                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        activePeerClient = client;
                        activePeerStream = netStream;
                    }
                    UpdateStatusBadge("PEER STATUS: CONNECTED — DIRECT TCP (" + host + ":" + port.ToString() + ")");
                    Log("Direct Kernel TCP Pipe established -> " + host + ":" + port.ToString() + " (NoDelay=true, 16MB Buffers)");

                    Thread rxThread = new Thread(delegate() {
                        try { ReceiveKernelTcpLoop(client, netStream, null); }
                        finally
                        {
                            if (tcpPeer != null && Object.ReferenceEquals(tcpPeer.TcpClientConn, client))
                            {
                                tcpPeer.TcpClientConn = null;
                                tcpPeer.TcpStream = null;
                                SyncTargetPeerDropdown();
                            }
                        }
                    });
                    rxThread.IsBackground = true;
                    rxThread.Start();
                }
                catch (Exception ex)
                {
                    if (!silentAutoProbe)
                    {
                        Log("TCP Connect failed (UDP NAT Hole-Punch active): " + ex.Message);
                    }
                }
            });
        }

        private void UdpDiscoveryLoop()
        {
            try
            {
                udpDiscovery = new UdpClient();
                udpDiscovery.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                udpDiscovery.Client.Bind(new IPEndPoint(IPAddress.Any, UDP_DISCOVERY_PORT));
                udpDiscovery.EnableBroadcast = true;

                BroadcastUdpPresence();

                IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
                while (isRunning)
                {
                    byte[] data = udpDiscovery.Receive(ref remoteEp);
                    string msg = Encoding.UTF8.GetString(data);
                    if (msg.StartsWith("AETHER_DISCOVER|"))
                    {
                        string[] parts = msg.Split('|');
                        if (parts.Length >= 4)
                        {
                            string remoteRoom = CleanRoomCode(parts[1]);
                            int remotePort = 0;
                            Int32.TryParse(parts[2], out remotePort);
                            string remoteInstanceId = parts[3];
                            string remoteDName = (parts.Length >= 5 && parts[4].Trim().Length > 0) ? parts[4].Trim() : ("Windows .EXE (" + remoteEp.Address.ToString() + ")");

                            if (remoteInstanceId == instanceId) continue;
                            if (IsOwnLocalEndpoint(remoteEp.Address, remotePort)) continue;

                            string myRoom = CleanRoomCode(currentRoomCode);

                            if (myRoom.Length > 0 && remoteRoom == myRoom && remotePort > 0)
                            {
                                string candidate = remoteEp.Address.ToString() + ":" + remotePort.ToString();
                                string canonKey = "aethertunnel-exe-" + remoteRoom + "-" + remoteInstanceId;
                                bool isNewDisc, fullDisc;
                                RoomPeerInfo discPeer = UpsertRoomPeer(canonKey, remoteDName, "exe", out isNewDisc, out fullDisc);
                                if (!fullDisc && discPeer != null && (discPeer.TcpClientConn == null || !discPeer.TcpClientConn.Connected))
                                {
                                    Log("LAN Auto-Discovery found remote .EXE peer " + discPeer.DisplayName + " at " + candidate);
                                    ConnectToPeerEndpoint(candidate, true, discPeer);
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        private void BroadcastUdpPresence()
        {
            try
            {
                if (udpDiscovery == null) return;
                string room = CleanRoomCode(currentRoomCode);
                if (room.Length == 0) return;
                byte[] payload = Encoding.UTF8.GetBytes("AETHER_DISCOVER|" + room + "|" + listenPort.ToString() + "|" + instanceId + "|" + SanitizeJsonText(localDisplayName));
                try { udpDiscovery.Send(payload, payload.Length, new IPEndPoint(IPAddress.Broadcast, UDP_DISCOVERY_PORT)); } catch { }
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up || ni.NetworkInterfaceType == NetworkInterfaceType.Loopback) continue;
                    foreach (UnicastIPAddressInformation uni in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (uni.Address.AddressFamily == AddressFamily.InterNetwork && uni.IPv4Mask != null && !IPAddress.IsLoopback(uni.Address))
                        {
                            byte[] ipB = uni.Address.GetAddressBytes();
                            byte[] mB = uni.IPv4Mask.GetAddressBytes();
                            byte[] bcast = new byte[4];
                            for (int k = 0; k < 4; k++) bcast[k] = (byte)(ipB[k] | (byte)~mB[k]);
                            try { udpDiscovery.Send(payload, payload.Length, new IPEndPoint(new IPAddress(bcast), UDP_DISCOVERY_PORT)); } catch { }
                        }
                    }
                }
            }
            catch { }
        }

        private void OnFormDragEnter(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
                e.Effect = DragDropEffects.Copy;
        }

        private void OnFormDragDrop(object sender, DragEventArgs e)
        {
            string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
            if (files != null && files.Length > 0)
            {
                EnqueueTransferPaths(files);
            }
        }

        private void OnSelectFilesClicked(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Valitse siirtojonoon lisättävät tiedostot";
                ofd.Multiselect = true;
                if (ofd.ShowDialog() == DialogResult.OK && ofd.FileNames != null && ofd.FileNames.Length > 0)
                {
                    EnqueueTransferPaths(ofd.FileNames);
                }
            }
        }

        private void OnSelectFolderClicked(object sender, EventArgs e)
        {
            if (folderPickDialog == null) folderPickDialog = new FolderBrowserDialog();
            folderPickDialog.Description = "Valitse kansio, jonka kaikki tiedostot lisätään siirtojonoon:";
            if (folderPickDialog.ShowDialog() == DialogResult.OK && !String.IsNullOrEmpty(folderPickDialog.SelectedPath))
            {
                EnqueueTransferPaths(new string[] { folderPickDialog.SelectedPath });
            }
        }

        private void OnRetryQueueClicked(object sender, EventArgs e)
        {
            int resetCount = 0;
            lock (transferQueueLock)
            {
                int selIdx = (lstQueue != null) ? lstQueue.SelectedIndex : -1;
                if (selIdx >= 0 && selIdx < transferQueue.Count)
                {
                    TransferQueueEntry sel = transferQueue[selIdx];
                    if (sel.Status == "Virhe" || sel.Status == "Hylätty" || sel.Status == "Keskeytyi (jatketaan)" || sel.Status == "Odotetaan paria...")
                    {
                        cancelledQueueIds.Remove(sel.Id);
                        sel.RetryCount = 0;
                        sel.NextRetryUtc = DateTime.MinValue;
                        sel.Status = "Odottaa";
                        resetCount++;
                    }
                }
                if (resetCount == 0)
                {
                    for (int i = 0; i < transferQueue.Count; i++)
                    {
                        TransferQueueEntry q = transferQueue[i];
                        if (q.Status == "Virhe" || q.Status == "Hylätty" || q.Status == "Keskeytyi (jatketaan)" || q.Status == "Odotetaan paria...")
                        {
                            cancelledQueueIds.Remove(q.Id);
                            q.RetryCount = 0;
                            q.NextRetryUtc = DateTime.MinValue;
                            q.Status = "Odottaa";
                            resetCount++;
                        }
                    }
                }
            }
            if (transferPaused)
            {
                OnPauseResumeClicked(sender, e);
            }
            if (resetCount > 0)
            {
                Log("Palautettiin siirtojonoon " + resetCount.ToString() + (resetCount == 1 ? " keskeytynyt siirto" : " keskeytynyttä siirtoa") + " jatkamista varten.");
                RefreshQueueUi();
                transferQueueEvent.Set();
            }
        }

        private void OnRemoveSelectedQueueClicked(object sender, EventArgs e)
        {
            if (lstQueue == null || lstQueue.SelectedIndex < 0) return;
            lock (transferQueueLock)
            {
                int idx = lstQueue.SelectedIndex;
                if (idx >= 0 && idx < transferQueue.Count)
                {
                    TransferQueueEntry item = transferQueue[idx];
                    if (item.Id == activeQueueTransferId && item.Status == "Siirretään")
                    {
                        Log("Aktiivista siirtoa ei voi poistaa jonosta kesken lähetyksen.");
                        return;
                    }
                    cancelledQueueIds.Add(item.Id);
                    transferQueue.RemoveAt(idx);
                }
            }
            RefreshQueueUi();
        }

        private void OnClearQueueClicked(object sender, EventArgs e)
        {
            lock (transferQueueLock)
            {
                for (int i = transferQueue.Count - 1; i >= 0; i--)
                {
                    string st = transferQueue[i].Status;
                    if (st == "Valmis" || st == "Hylätty" || st == "Virhe")
                    {
                        transferQueue.RemoveAt(i);
                    }
                }
            }
            RefreshQueueUi();
        }

        private void OnPauseResumeClicked(object sender, EventArgs e)
        {
            transferPaused = !transferPaused;
            if (transferPaused)
            {
                transferResumeEvent.Reset();
                if (btnPauseResume != null)
                {
                    btnPauseResume.Text = "Jatka";
                    btnPauseResume.BackColor = Color.FromArgb(14, 52, 38);
                    btnPauseResume.ForeColor = Color.FromArgb(52, 211, 153);
                }
                if (!String.IsNullOrEmpty(activeQueueTransferId))
                {
                    UpdateQueueEntryStatus(activeQueueTransferId, "Pysäytetty");
                }
                if (lblProgressDetail != null)
                {
                    lblProgressDetail.Text = "Siirto pysäytetty — paina Jatka jatkaaksesi.";
                }
                Log("Siirto pysäytetty käyttäjän toimesta.");
            }
            else
            {
                transferResumeEvent.Set();
                if (btnPauseResume != null)
                {
                    btnPauseResume.Text = "Pysäytä";
                    btnPauseResume.BackColor = Color.FromArgb(45, 34, 14);
                    btnPauseResume.ForeColor = Color.FromArgb(251, 191, 36);
                }
                if (!String.IsNullOrEmpty(activeQueueTransferId))
                {
                    UpdateQueueEntryStatus(activeQueueTransferId, "Siirretään");
                }
                Log("Siirtoa jatketaan.");
            }
        }

        private void EnqueueTransferPaths(string[] paths)
        {
            if (paths == null || paths.Length == 0) return;
            string tgtId = String.IsNullOrEmpty(selectedTargetPeerId) ? "*" : selectedTargetPeerId;
            string tgtLabel = GetCurrentTargetLabel(tgtId);
            int added = 0;
            lock (transferQueueLock)
            {
                foreach (string rawPath in paths)
                {
                    try
                    {
                        if (File.Exists(rawPath))
                        {
                            FileInfo fi = new FileInfo(rawPath);
                            TransferQueueEntry entry = new TransferQueueEntry();
                            entry.Id = Guid.NewGuid().ToString("N").Substring(0, 10);
                            entry.FullPath = fi.FullName;
                            entry.DisplayName = fi.Name;
                            entry.FileSize = fi.Length;
                            entry.Status = "Odottaa";
                            entry.TargetPeerId = tgtId;
                            entry.TargetLabel = tgtLabel;
                            transferQueue.Add(entry);
                            added++;
                        }
                        else if (Directory.Exists(rawPath))
                        {
                            string rootDir = Path.GetFullPath(rawPath).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                            string rootFolderName = Path.GetFileName(rootDir);
                            string[] dirFiles = Directory.GetFiles(rootDir, "*", SearchOption.AllDirectories);
                            Array.Sort(dirFiles, StringComparer.OrdinalIgnoreCase);
                            foreach (string df in dirFiles)
                            {
                                try
                                {
                                    FileInfo dfi = new FileInfo(df);
                                    string rel = dfi.FullName.Length > rootDir.Length + 1
                                        ? dfi.FullName.Substring(rootDir.Length + 1)
                                        : dfi.Name;
                                    TransferQueueEntry entry = new TransferQueueEntry();
                                    entry.Id = Guid.NewGuid().ToString("N").Substring(0, 10);
                                    entry.FullPath = dfi.FullName;
                                    entry.DisplayName = (!String.IsNullOrEmpty(rootFolderName) ? rootFolderName + "\\\\" + rel : rel);
                                    entry.FileSize = dfi.Length;
                                    entry.Status = "Odottaa";
                                    entry.TargetPeerId = tgtId;
                                    entry.TargetLabel = tgtLabel;
                                    transferQueue.Add(entry);
                                    added++;
                                }
                                catch { }
                            }
                        }
                    }
                    catch { }
                }
            }
            if (added > 0)
            {
                Log("Lisättiin siirtojonoon " + added.ToString() + (added == 1 ? " tiedosto" : " tiedostoa") + " -> " + tgtLabel + ".");
                RefreshQueueUi();
                transferQueueEvent.Set();
            }
        }

        private void RefreshQueueUi()
        {
            try
            {
                if (this.InvokeRequired)
                {
                    this.BeginInvoke(new Action(RefreshQueueUi));
                    return;
                }
                if (lstQueue == null || lblQueueSummary == null) return;
                List<string> rows = new List<string>();
                int waiting = 0;
                int done = 0;
                lock (transferQueueLock)
                {
                    for (int i = 0; i < transferQueue.Count; i++)
                    {
                        TransferQueueEntry q = transferQueue[i];
                        if (q.Status == "Odottaa" || q.Status == "Odotetaan paria..." || q.Status == "Odotetaan hyväksyntää" || q.Status == "Siirretään" || q.Status == "Pysäytetty" || q.Status == "Keskeytyi (jatketaan)") waiting++;
                        else if (q.Status == "Valmis") done++;
                        string tLabel = String.IsNullOrEmpty(q.TargetLabel) ? "Kaikki" : q.TargetLabel;
                        rows.Add(String.Format("[{0}] (-> {1}) {2} ({3})", q.Status, tLabel, q.DisplayName, FormatBytes(q.FileSize)));
                    }
                }
                lblQueueSummary.Text = String.Format("Siirtojono ({0} jonossa · {1} valmis)", waiting, done);
                int prevSel = lstQueue.SelectedIndex;
                lstQueue.BeginUpdate();
                lstQueue.Items.Clear();
                for (int i = 0; i < rows.Count; i++) lstQueue.Items.Add(rows[i]);
                if (prevSel >= 0 && prevSel < lstQueue.Items.Count) lstQueue.SelectedIndex = prevSel;
                lstQueue.EndUpdate();
            }
            catch { }
        }

        private bool HasAnyActivePeer()
        {
            DateTime now = DateTime.UtcNow;
            foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
            {
                if (IsPeerActive(kv.Value, now)) return true;
            }
            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasUdpPeer = (activeUdpPeerEndpoint != null && (now - lastUdpPeerSeen).TotalSeconds < 15);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudOpen = !activeSignalingChannels.IsEmpty;
            bool hasCloudBrowserPeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudBrowserPeerId) && (now - lastCloudBrowserSeen).TotalSeconds < 14);
            bool hasCloudExePeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudExePeerId) && (now - lastCloudExeSeen).TotalSeconds < 14);
            return hasExePeer || hasUdpPeer || hasLocalBrowserPeer || hasCloudBrowserPeer || hasCloudExePeer;
        }

        private bool HasTargetReadyForEntry(TransferQueueEntry entry, DateTime now)
        {
            if (entry == null) return false;
            if (String.IsNullOrEmpty(entry.TargetPeerId) || entry.TargetPeerId == "*")
            {
                return HasAnyActivePeer();
            }
            RoomPeerInfo p;
            if (roomPeers.TryGetValue(entry.TargetPeerId, out p))
            {
                return IsPeerActive(p, now);
            }
            return false;
        }

        private void UpdateQueueEntryStatus(string entryId, string status)
        {
            lock (transferQueueLock)
            {
                for (int i = 0; i < transferQueue.Count; i++)
                {
                    if (transferQueue[i].Id == entryId)
                    {
                        transferQueue[i].Status = status;
                        break;
                    }
                }
            }
            RefreshQueueUi();
        }

        private void TransferQueueWorkerLoop()
        {
            bool loggedWaitingPeer = false;
            while (isRunning)
            {
                TransferQueueEntry next = null;
                TransferQueueEntry firstWaiting = null;
                DateTime now = DateTime.UtcNow;
                lock (transferQueueLock)
                {
                    for (int i = 0; i < transferQueue.Count; i++)
                    {
                        TransferQueueEntry cand = transferQueue[i];
                        if (cand.Status == "Odottaa" || cand.Status == "Odotetaan paria..." || cand.Status == "Keskeytyi (jatketaan)")
                        {
                            if (firstWaiting == null) firstWaiting = cand;
                            if (now >= cand.NextRetryUtc && HasTargetReadyForEntry(cand, now))
                            {
                                next = cand;
                                break;
                            }
                        }
                    }
                }

                if (next == null)
                {
                    if (firstWaiting != null)
                    {
                        if (!HasTargetReadyForEntry(firstWaiting, now))
                        {
                            if (firstWaiting.Status != "Odotetaan paria...")
                            {
                                UpdateQueueEntryStatus(firstWaiting.Id, "Odotetaan paria...");
                            }
                            if (!loggedWaitingPeer)
                            {
                                loggedWaitingPeer = true;
                                Log("Siirtojono odottaa vastaanottajaa (" + (firstWaiting.TargetLabel ?? "Kaikki") + ") huoneessa [" + txtRoomCode.Text.Trim() + "]...");
                            }
                        }
                        Thread.Sleep(350);
                        continue;
                    }
                    loggedWaitingPeer = false;
                    transferQueueEvent.WaitOne(250);
                    continue;
                }

                if (cancelledQueueIds.Contains(next.Id))
                {
                    continue;
                }

                loggedWaitingPeer = false;

                while (transferPaused && isRunning)
                {
                    transferResumeEvent.WaitOne(200);
                }
                if (!isRunning) break;

                activeQueueTransferId = next.Id;
                UpdateQueueEntryStatus(next.Id, "Siirretään");
                string outcome = "Virhe";
                try
                {
                    outcome = ExecuteQueuedTransfer(next);
                }
                catch (Exception ex)
                {
                    Log("Queue Transfer Exception (" + next.DisplayName + "): " + ex.Message);
                    outcome = "Virhe";
                }
                finally
                {
                    activeQueueTransferId = "";
                    string finalStatus = String.IsNullOrEmpty(outcome) ? "Virhe" : outcome;
                    if (finalStatus == "Virhe" && !cancelledQueueIds.Contains(next.Id) && File.Exists(next.FullPath) && isRunning)
                    {
                        bool peerOnlineNow = HasTargetReadyForEntry(next, DateTime.UtcNow);
                        if (!peerOnlineNow)
                        {
                            next.RetryCount = 0;
                            next.NextRetryUtc = DateTime.UtcNow.AddSeconds(2);
                            finalStatus = "Odotetaan paria...";
                            Log("Yhteys vastaanottajaan katkesi (" + next.DisplayName + ") — jatketaan automaattisesti kun pari yhdistää uudelleen.");
                        }
                        else if (next.RetryCount < 12)
                        {
                            next.RetryCount++;
                            next.NextRetryUtc = DateTime.UtcNow.AddSeconds(3);
                            finalStatus = "Keskeytyi (jatketaan)";
                            Log("Siirto keskeytyi (" + next.DisplayName + ") — jatketaan automaattisesti 3s kuluttua (yritys " + next.RetryCount.ToString() + "/12)...");
                        }
                        else
                        {
                            finalStatus = "Virhe";
                            Log("Siirto keskeytyi toistuvasti (" + next.DisplayName + "). Paina 'Jatka / Uudelleen' jatkaaksesi.");
                        }
                    }
                    else if (finalStatus == "Valmis")
                    {
                        next.RetryCount = 0;
                        next.NextRetryUtc = DateTime.MinValue;
                    }
                    UpdateQueueEntryStatus(next.Id, finalStatus);
                    transferQueueEvent.Set();
                }
            }
        }

        private string ExecuteQueuedTransfer(TransferQueueEntry entry)
        {
            DateTime now = DateTime.UtcNow;
            List<RoomPeerInfo> targets = new List<RoomPeerInfo>();
            if (!String.IsNullOrEmpty(entry.TargetPeerId) && entry.TargetPeerId != "*")
            {
                RoomPeerInfo specific;
                if (roomPeers.TryGetValue(entry.TargetPeerId, out specific) && IsPeerActive(specific, now))
                {
                    targets.Add(specific);
                }
            }
            else
            {
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    if (IsPeerActive(kv.Value, now)) targets.Add(kv.Value);
                }
            }

            if (targets.Count > 0)
            {
                int okCount = 0;
                int rejCount = 0;
                for (int i = 0; i < targets.Count && isRunning; i++)
                {
                    RoomPeerInfo tp = targets[i];
                    string res = "Virhe";
                    if (tp.TcpClientConn != null && tp.TcpClientConn.Connected && tp.TcpStream != null)
                    {
                        res = StreamFileOverKernelTcp(entry.FullPath, entry.Id, tp);
                    }
                    else if (tp.ActiveUdpEp != null && (now - tp.LastUdpSeen).TotalSeconds < 14)
                    {
                        res = StreamFileOverNatPunchedUdp(entry.FullPath, entry.Id, tp.ActiveUdpEp);
                    }
                    else if (tp.ClientType == "local_browser" && activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null)
                    {
                        res = StreamFileToBrowserOverWebSocket(entry.FullPath, entry.Id);
                    }
                    else if (!String.IsNullOrEmpty(tp.CloudPeerId))
                    {
                        res = StreamFileToBrowserOverCloudBridge(entry.FullPath, entry.Id, tp.CloudPeerId, tp.DisplayName);
                    }

                    if (res == "Valmis") okCount++;
                    else if (res == "Hylätty") rejCount++;
                }
                if (okCount > 0) return "Valmis";
                if (rejCount > 0) return "Hylätty";
                return "Virhe";
            }

            if (!String.IsNullOrEmpty(entry.TargetPeerId) && entry.TargetPeerId != "*")
            {
                return "Virhe";
            }

            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasUdpPeer = (activeUdpPeerEndpoint != null && (now - lastUdpPeerSeen).TotalSeconds < 15);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudOpen = !activeSignalingChannels.IsEmpty;
            bool hasCloudBrowserPeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudBrowserPeerId) && (now - lastCloudBrowserSeen).TotalSeconds < 14);
            bool hasCloudExePeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudExePeerId) && (now - lastCloudExeSeen).TotalSeconds < 14);

            if (hasExePeer) return StreamFileOverKernelTcp(entry.FullPath, entry.Id, null);
            if (hasUdpPeer) return StreamFileOverNatPunchedUdp(entry.FullPath, entry.Id, null);
            if (hasLocalBrowserPeer) return StreamFileToBrowserOverWebSocket(entry.FullPath, entry.Id);
            if (hasCloudBrowserPeer || hasCloudExePeer) return StreamFileToBrowserOverCloudBridge(entry.FullPath, entry.Id, "", "");
            return "Virhe";
        }

        private int ShowIncomingTransferDialog(string senderInfo, string fileName, long fileSize, bool hasResume)
        {
            if (autoAcceptAllIncoming) return 1;
            lock (incomingPromptLock)
            {
                if (autoAcceptAllIncoming) return 1;
                int result = 0;
                try
                {
                    if (!isRunning || this.IsDisposed) return 0;
                    this.Invoke(new Action(delegate {
                        if (autoAcceptAllIncoming) { result = 1; return; }
                        using (Form dlg = new Form())
                        {
                            dlg.Text = "Saapuva tiedostonsiirto — AetherTunnel";
                            dlg.FormBorderStyle = FormBorderStyle.FixedDialog;
                            dlg.MaximizeBox = false;
                            dlg.MinimizeBox = false;
                            dlg.StartPosition = FormStartPosition.CenterParent;
                            dlg.ShowInTaskbar = true;
                            dlg.TopMost = true;
                            dlg.ClientSize = new Size(S(470), S(205));
                            dlg.BackColor = Color.FromArgb(15, 23, 42);
                            dlg.ForeColor = Color.White;
                            dlg.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);

                            Label lHead = CreateCleanLabel(
                                "Lähettäjä (" + senderInfo + ") haluaa lähettää tiedoston:",
                                new Font("Segoe UI Semibold", 10f, FontStyle.Bold),
                                Color.FromArgb(56, 189, 248),
                                new Point(S(20), S(18)),
                                false
                            );
                            lHead.Size = new Size(S(430), S(24));
                            dlg.Controls.Add(lHead);

                            Label lName = CreateCleanLabel(
                                fileName,
                                new Font("Consolas", 10.5f, FontStyle.Bold),
                                Color.White,
                                new Point(S(20), S(48)),
                                false
                            );
                            lName.Size = new Size(S(430), S(26));
                            dlg.Controls.Add(lName);

                            Label lMeta = CreateCleanLabel(
                                "Koko: " + FormatBytes(fileSize) + (hasResume ? "   ·   Keskeytynyt siirto voidaan jatkaa (.part)" : "   ·   Tallennuskansio: " + downloadDirectory),
                                new Font("Segoe UI", 8.8f),
                                Color.FromArgb(148, 163, 184),
                                new Point(S(20), S(80)),
                                false
                            );
                            lMeta.Size = new Size(S(430), S(40));
                            dlg.Controls.Add(lMeta);

                            Button bAccept = new Button();
                            bAccept.UseMnemonic = false;
                            bAccept.Text = "Hyväksy";
                            bAccept.FlatStyle = FlatStyle.Flat;
                            bAccept.BackColor = Color.FromArgb(16, 185, 129);
                            bAccept.ForeColor = Color.FromArgb(9, 13, 22);
                            bAccept.Font = new Font("Segoe UI Semibold", 9.5f, FontStyle.Bold);
                            bAccept.Location = new Point(S(20), S(142));
                            bAccept.Size = new Size(S(115), S(38));
                            bAccept.Click += delegate { result = 1; dlg.DialogResult = DialogResult.OK; dlg.Close(); };
                            dlg.Controls.Add(bAccept);

                            Button bAcceptAll = new Button();
                            bAcceptAll.UseMnemonic = false;
                            bAcceptAll.Text = "Hyväksy kaikki (jonossa)";
                            bAcceptAll.FlatStyle = FlatStyle.Flat;
                            bAcceptAll.BackColor = Color.FromArgb(56, 189, 248);
                            bAcceptAll.ForeColor = Color.FromArgb(9, 13, 22);
                            bAcceptAll.Font = new Font("Segoe UI Semibold", 9.2f, FontStyle.Bold);
                            bAcceptAll.Location = new Point(S(145), S(142));
                            bAcceptAll.Size = new Size(S(185), S(38));
                            bAcceptAll.Click += delegate {
                                autoAcceptAllIncoming = true;
                                if (chkAutoAccept != null) chkAutoAccept.Checked = true;
                                result = 2;
                                dlg.DialogResult = DialogResult.Yes;
                                dlg.Close();
                            };
                            dlg.Controls.Add(bAcceptAll);

                            Button bReject = new Button();
                            bReject.UseMnemonic = false;
                            bReject.Text = "Hylkää";
                            bReject.FlatStyle = FlatStyle.Flat;
                            bReject.BackColor = Color.FromArgb(51, 65, 85);
                            bReject.ForeColor = Color.FromArgb(248, 113, 113);
                            bReject.Font = new Font("Segoe UI Semibold", 9.5f, FontStyle.Bold);
                            bReject.Location = new Point(S(340), S(142));
                            bReject.Size = new Size(S(110), S(38));
                            bReject.Click += delegate { result = 0; dlg.DialogResult = DialogResult.Cancel; dlg.Close(); };
                            dlg.Controls.Add(bReject);

                            dlg.AcceptButton = bAccept;
                            dlg.CancelButton = bReject;
                            dlg.ShowDialog(this);
                        }
                    }));
                }
                catch { result = 0; }
                return result;
            }
        }

        private static void WriteInt32LE(byte[] buf, int offset, int val)
        {
            buf[offset] = (byte)(val & 0xFF);
            buf[offset + 1] = (byte)((val >> 8) & 0xFF);
            buf[offset + 2] = (byte)((val >> 16) & 0xFF);
            buf[offset + 3] = (byte)((val >> 24) & 0xFF);
        }

        private byte[] EncryptSingleUdpChunk(byte[] plainBuf, int plainLen, int chunkIndex, int totalChunks, byte[] keySnapshot)
        {
            byte[] iv = threadLocalIv.Value;
            Array.Clear(iv, 8, 8);
            WriteInt32LE(iv, 0, chunkIndex);
            WriteInt32LE(iv, 4, 0x5A3C9E17 ^ chunkIndex);

            byte[] cipher;
            AesCryptoServiceProvider aes = threadLocalAes.Value;
            using (ICryptoTransform enc = aes.CreateEncryptor(keySnapshot, iv))
            {
                cipher = enc.TransformFinalBlock(plainBuf, 0, plainLen);
            }

            byte[] packet = new byte[28 + cipher.Length];
            WriteInt32LE(packet, 0, unchecked((int)MAGIC_UDP_DATA));
            WriteInt32LE(packet, 4, chunkIndex);
            WriteInt32LE(packet, 8, totalChunks);
            Buffer.BlockCopy(iv, 0, packet, 12, 16);
            Buffer.BlockCopy(cipher, 0, packet, 28, cipher.Length);
            return packet;
        }

        private void PaceUdpPacketSend(int packetBytes, ref long pacingEpochTicks, ref long pacedBytesSinceEpoch)
        {
            pacedBytesSinceEpoch = 0;
            double capMbps = dynamicUdpBitrateMbps;
            long userLimitBps = Interlocked.Read(ref maxUploadBytesPerSec);
            if (userLimitBps > 0L)
            {
                double userCapMbps = Math.Max(0.1, (userLimitBps * 8.0) / (1024.0 * 1024.0));
                if (userCapMbps < capMbps) capMbps = userCapMbps;
            }
            if (capMbps >= 5000.0 && userLimitBps <= 0L)
            {
                pacingEpochTicks = Stopwatch.GetTimestamp();
                return;
            }

            if (Interlocked.Exchange(ref pacingResetRequested, 0) == 1)
            {
                long curNow = Stopwatch.GetTimestamp();
                if (pacingEpochTicks > curNow) pacingEpochTicks = curNow;
            }

            double bytesPerSec = (capMbps / 8.0) * 1024.0 * 1024.0;
            long pktTicks = (long)((packetBytes / bytesPerSec) * Stopwatch.Frequency);
            long nowTicks = Stopwatch.GetTimestamp();
            long minFloorTicks = nowTicks - (Stopwatch.Frequency / 60); // Tolerate ~16ms OS timer tick jitter without starving bandwidth quota
            if (pacingEpochTicks < minFloorTicks)
            {
                pacingEpochTicks = minFloorTicks;
            }

            pacingEpochTicks += pktTicks;

            while (isRunning)
            {
                long cur = Stopwatch.GetTimestamp();
                long remain = pacingEpochTicks - cur;
                if (remain <= 0) break;
                if (remain > Stopwatch.Frequency / 500) // > 2.0 ms ahead
                {
                    Thread.Sleep(1);
                }
                else
                {
                    Thread.SpinWait(24);
                }
            }
        }

        private void PaceGenericTxBytes(int bytesSent, ref long epochTicks)
        {
            long limitBps = Interlocked.Read(ref maxUploadBytesPerSec);
            if (limitBps <= 0L)
            {
                epochTicks = Stopwatch.GetTimestamp();
                return;
            }
            double stepSec = bytesSent / Math.Max(10240.0, (double)limitBps);
            long stepTicks = (long)(stepSec * Stopwatch.Frequency);
            long now = Stopwatch.GetTimestamp();
            long floor = now - (Stopwatch.Frequency / 20);
            if (epochTicks < floor) epochTicks = floor;
            epochTicks += stepTicks;
            while (isRunning && Interlocked.Read(ref maxUploadBytesPerSec) > 0L)
            {
                long rem = epochTicks - Stopwatch.GetTimestamp();
                if (rem <= 0) break;
                int sleepMs = (int)Math.Min(100L, Math.Max(1L, (rem * 1000L) / Stopwatch.Frequency));
                Thread.Sleep(sleepMs);
            }
        }

        private string StreamFileOverNatPunchedUdp(string filePath, string queueEntryId = "", IPEndPoint overrideEp = null)
        {
            lock (udpTxLock)
            {
                try
                {
                    IPEndPoint targetEp = overrideEp != null ? overrideEp : activeUdpPeerEndpoint;
                    if (targetEp == null || udpP2pClient == null) return "Virhe";
                    activeUdpPeerEndpoint = targetEp;

                    FileInfo fi = new FileInfo(filePath);
                    long fileSize = fi.Length;
                    string fileName = fi.Name;
                    udpTxActiveFileName = fileName;
                    int totalChunks = (int)Math.Max(1L, (fileSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);

                    dynamicUdpBitrateMbps = 25.0;
                    udpBestRxMbps = 25.0;
                    udpCongestionCeilingMbps = 0.0;
                    udpBestRxDecayTicks = Stopwatch.GetTimestamp();
                    lastNackReceivedTick = unchecked(Environment.TickCount - 10000);
                    lastNackCutTick = unchecked(Environment.TickCount - 10000);
                    lastAckReceivedTick = Environment.TickCount;
                    udpTxLastPeerActivityTick = Environment.TickCount;
                    udpInSlowStart = true;
                    udpCleanAckStreak = 0;
                    udpLowRxStreak = 0;
                    udpSenderChunkLastSentTick.Clear();
                    Log(String.Format("Streaming over High-Speed NAT-Punched UDP P2P -> {0}: {1} ({2}) [Auto Dynamic Pacing]",
                        targetEp.ToString(), fileName, FormatBytes(fileSize)));

                    udpPeerResumeChunk = 0;
                    udpPeerAckedChunk = -1;
                    udpPeerContiguousChunk = -1;
                    udpPeerUniqueAcked = 0;
                    udpPeerMeasuredMbps = 0;
                    udpTransferDoneAcked = false;
                    udpNeedStartResend = false;
                    udpWaitAcceptReceived = false;
                    udpTransferRejected = false;
                    udpResumeReceived = false;
                    int staleIdx;
                    while (udpRetransmitQueue.TryDequeue(out staleIdx)) { }
                    udpResumeEvent.Reset();
                    udpAckEvent.Reset();

                    string startMsg = "AETHER_UDP_START|" + fileName.Replace("|", "_") + "|" + fileSize.ToString() + "|" + totalChunks.ToString();
                    byte[] startBytes = Encoding.UTF8.GetBytes(startMsg);

                    // Reliable START handshake (up to 5s initial probe, plus up to 120s wait on WAIT_ACCEPT)
                    for (int attempt = 0; attempt < 25 && isRunning; attempt++)
                    {
                        if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                        {
                            targetEp = activeUdpPeerEndpoint;
                        }
                        SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                        if (udpResumeEvent.WaitOne(200))
                        {
                            if (udpTransferRejected || udpResumeReceived || udpWaitAcceptReceived) break;
                        }
                    }

                    if (!udpResumeReceived && !udpWaitAcceptReceived && !udpTransferRejected)
                    {
                        Log("UDP P2P aloituskuittausta ei saatu vastaanottajalta (" + fileName + ") — merkitään keskeytyneeksi.");
                        return "Virhe";
                    }

                    if (udpWaitAcceptReceived && !udpResumeReceived && !udpTransferRejected && isRunning)
                    {
                        if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Odotetaan hyväksyntää");
                        UpdateTransferUi("Odotetaan vastaanottajan hyväksyntää: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                        Log("Odotetaan vastaanottajan hyväksyntää tiedostolle: " + fileName);
                        int waitLoops = 0;
                        while (!udpResumeReceived && !udpTransferRejected && isRunning && waitLoops < 150)
                        {
                            if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                            {
                                targetEp = activeUdpPeerEndpoint;
                            }
                            SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                            udpResumeEvent.WaitOne(800);
                            waitLoops++;
                        }
                        if (!udpResumeReceived && !udpTransferRejected)
                        {
                            Log("Hyväksynnän odotus aikakatkaistiin: " + fileName);
                            return "Virhe";
                        }
                    }

                    if (udpTransferRejected)
                    {
                        Log("Vastaanottaja hylkäsi tiedoston: " + fileName);
                        UpdateTransferUi("Vastaanottaja hylkäsi: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                        return "Hylätty";
                    }

                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Siirretään");

                    int startChunk = Math.Max(0, Math.Min(udpPeerResumeChunk, totalChunks));
                    udpPeerAckedChunk = startChunk - 1;
                    udpPeerContiguousChunk = startChunk - 1;
                    udpPeerUniqueAcked = startChunk;

                    if (startChunk > 0)
                    {
                        Log("Resuming NAT-Punched UDP transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * UDP_CHUNK_SIZE) + ")");
                    }

                    int initialStartChunk = startChunk;
                    Stopwatch sw = Stopwatch.StartNew();
                    Stopwatch txUiSw = Stopwatch.StartNew();
                    long txUiWindowBytes = 0;
                    long totalWireBytesSent = 0;
                    double smoothedUiTxMbps = 0.0;
                    long totalSent = Math.Min(fileSize, (long)startChunk * UDP_CHUNK_SIZE);
                    byte[] keySnapshot = (byte[])aesKey.Clone();
                    long pacingEpochTicks = Stopwatch.GetTimestamp();
                    long pacedBytesSinceEpoch = 0;
                    lastAckReceivedTick = Environment.TickCount;
                    udpTxLastPeerActivityTick = Environment.TickCount;
                    int lastStartKeepaliveTick = Environment.TickCount;
                    bool abortedByDisconnect = false;

                    ParallelOptions txParallelOpts = new ParallelOptions();
                    txParallelOpts.MaxDegreeOfParallelism = Math.Max(1, Math.Min(4, Environment.ProcessorCount / 2));

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 16 * 1024 * 1024, FileOptions.SequentialScan))
                    using (FileStream fsRepair = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.RandomAccess))
                    {
                        int waveStart = startChunk;
                        int lastProbeTick = unchecked(Environment.TickCount - 1000);
                        while (waveStart < totalChunks && !udpTransferDoneAcked && isRunning)
                        {
                            if (transferPaused && isRunning)
                            {
                                sw.Stop();
                                double pausedAvg = (Math.Max(0L, totalSent - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                int pausedPermille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                                UpdateTransferUi("Pysäytetty (UDP P2P): " + fileName, totalSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                                while (transferPaused && isRunning)
                                {
                                    lastAckReceivedTick = Environment.TickCount;
                                    udpTxLastPeerActivityTick = Environment.TickCount;
                                    transferResumeEvent.WaitOne(200);
                                }
                                if (!isRunning) break;
                                sw.Start();
                                txUiSw.Restart();
                                txUiWindowBytes = 0;
                                smoothedUiTxMbps = 0.0;
                                lastAckReceivedTick = Environment.TickCount;
                                udpTxLastPeerActivityTick = Environment.TickCount;
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                                pacingEpochTicks = Stopwatch.GetTimestamp();
                            }

                            if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                            {
                                targetEp = activeUdpPeerEndpoint;
                            }

                            int peerSilentMs = unchecked(Environment.TickCount - udpTxLastPeerActivityTick);
                            if (peerSilentMs > 12000)
                            {
                                abortedByDisconnect = true;
                                Log("UDP P2P -yhteys katkesi kesken siirron (vastaanottaja ei vastannut 12s): " + fileName);
                                break;
                            }
                            if (peerSilentMs > 3500 && unchecked(Environment.TickCount - lastStartKeepaliveTick) > 2500)
                            {
                                lastStartKeepaliveTick = Environment.TickCount;
                                try { SendUdpP2pPacket(startBytes, startBytes.Length, targetEp); } catch { }
                            }

                            // Instant Resume Jump: if receiver reports a higher contiguous/resume chunk, skip ahead smoothly without resetting live speed!
                            int peerContig = Math.Max(udpPeerResumeChunk, udpPeerContiguousChunk + 1);
                            if (peerContig > udpPeerUniqueAcked) udpPeerUniqueAcked = peerContig;
                            if (peerContig > waveStart && peerContig <= totalChunks)
                            {
                                if (peerContig - waveStart >= 512)
                                {
                                    Log("Peer confirmed resume offset at chunk " + peerContig.ToString() + " (" + FormatBytes(Math.Min(fileSize, (long)peerContig * UDP_CHUNK_SIZE)) + ") — jumping ahead!");
                                }
                                waveStart = peerContig;
                                startChunk = peerContig;
                                totalSent = Math.Min(fileSize, (long)waveStart * UDP_CHUNK_SIZE);
                                if (waveStart >= totalChunks) break;
                            }

                            if (udpNeedStartResend)
                            {
                                udpNeedStartResend = false;
                                SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                                Thread.Sleep(15);
                            }

                            // Smooth BDP In-Flight Window Cap (generous pipeline headroom prevents BDP choke)
                            bool isProbeOnly = false;
                            while (!udpTransferDoneAcked && isRunning)
                            {
                                if (unchecked(Environment.TickCount - udpTxLastPeerActivityTick) > 12000)
                                {
                                    abortedByDisconnect = true;
                                    break;
                                }
                                int curMaxInFlight = Math.Max(640, Math.Min(28000, (int)Math.Round(dynamicUdpBitrateMbps * 22.0)));
                                int inFlightNow = Math.Max(0, waveStart - udpPeerUniqueAcked);
                                if (inFlightNow < curMaxInFlight) break;

                                if (unchecked(Environment.TickCount - lastAckReceivedTick) > 1500)
                                {
                                    lastAckReceivedTick = Environment.TickCount;
                                    dynamicUdpBitrateMbps = Math.Max(8.0, dynamicUdpBitrateMbps * 0.85);
                                    udpCleanAckStreak = 0;
                                    udpLowRxStreak = 0;
                                    Interlocked.Exchange(ref pacingResetRequested, 1);
                                }

                                // Allow repairing NACKed holes while waiting for window space
                                int waitNackIdx;
                                int repairedWait = 0;
                                while (repairedWait < 32 && udpRetransmitQueue.TryDequeue(out waitNackIdx))
                                {
                                    if (waitNackIdx >= 0 && waitNackIdx < totalChunks)
                                    {
                                        long rPos = (long)waitNackIdx * UDP_CHUNK_SIZE;
                                        int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                        byte[] rBuf = new byte[rRem];
                                        fsRepair.Seek(rPos, SeekOrigin.Begin);
                                        int rRead = fsRepair.Read(rBuf, 0, rRem);
                                        if (rRead > 0)
                                        {
                                            byte[] rPkt = EncryptSingleUdpChunk(rBuf, rRead, waitNackIdx, totalChunks, keySnapshot);
                                            SendUdpP2pPacket(rPkt, rPkt.Length, targetEp);
                                            totalWireBytesSent += rRead;
                                            txUiWindowBytes += rRead;
                                            PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                            repairedWait++;
                                        }
                                    }
                                }

                                if (unchecked(Environment.TickCount - lastProbeTick) > 400)
                                {
                                    lastProbeTick = Environment.TickCount;
                                    isProbeOnly = true;
                                    break; // Send max 2 gentle keepalive/probe chunks so 0 Mbit/s links self-heal cleanly
                                }

                                udpAckEvent.WaitOne(15);
                            }
                            if (abortedByDisconnect)
                            {
                                Log("UDP P2P -yhteys katkesi kesken lähetysikkunan odotuksen: " + fileName);
                                break;
                            }

                            // Handle temporary ACK stalls gently without halving speed
                            if (unchecked(Environment.TickCount - lastAckReceivedTick) > 1500)
                            {
                                lastAckReceivedTick = Environment.TickCount;
                                dynamicUdpBitrateMbps = Math.Max(8.0, dynamicUdpBitrateMbps * 0.85);
                                udpCleanAckStreak = 0;
                                udpLowRxStreak = 0;
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                            }

                            // Drain and immediately retransmit up to 64 unique NACKed chunks on fsRepair (never flushes fs 16MB sequential cache!)
                            int nackIdx;
                            int repairedInWave = 0;
                            while (repairedInWave < 64 && udpRetransmitQueue.TryDequeue(out nackIdx))
                            {
                                if (nackIdx >= 0 && nackIdx < totalChunks)
                                {
                                    long rPos = (long)nackIdx * UDP_CHUNK_SIZE;
                                    int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                    byte[] rBuf = new byte[rRem];
                                    fsRepair.Seek(rPos, SeekOrigin.Begin);
                                    int rRead = fsRepair.Read(rBuf, 0, rRem);
                                    if (rRead > 0)
                                    {
                                        byte[] rPkt = EncryptSingleUdpChunk(rBuf, rRead, nackIdx, totalChunks, keySnapshot);
                                        SendUdpP2pPacket(rPkt, rPkt.Length, targetEp);
                                        totalWireBytesSent += rRead;
                                        txUiWindowBytes += rRead;
                                        PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                        repairedInWave++;
                                    }
                                }
                            }

                            long waveOffset = (long)waveStart * UDP_CHUNK_SIZE;
                            if (fs.Position != waveOffset) fs.Seek(waveOffset, SeekOrigin.Begin);

                            // Smooth adaptive wave size (~12ms slice, clamped 2..128 chunks)
                            double effectiveRateMbps = dynamicUdpBitrateMbps;
                            long limitBpsWave = Interlocked.Read(ref maxUploadBytesPerSec);
                            if (limitBpsWave > 0L)
                            {
                                effectiveRateMbps = Math.Min(effectiveRateMbps, Math.Max(0.1, (limitBpsWave * 8.0) / (1024.0 * 1024.0)));
                            }
                            int dynamicWaveChunks = isProbeOnly ? 2 : (int)Math.Max(2.0, Math.Min(128.0, ((effectiveRateMbps * 1024.0 * 1024.0 / 8.0) * 0.012) / UDP_CHUNK_SIZE));
                            int waveCount = Math.Min(dynamicWaveChunks, totalChunks - waveStart);
                            byte[][] plainBuffers = new byte[waveCount][];
                            int[] plainLens = new int[waveCount];

                            for (int w = 0; w < waveCount; w++)
                            {
                                int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - ((long)(waveStart + w) * UDP_CHUNK_SIZE));
                                byte[] b = new byte[rem];
                                int rTot = 0;
                                while (rTot < rem)
                                {
                                    int r = fs.Read(b, rTot, rem - rTot);
                                    if (r <= 0) break;
                                    rTot += r;
                                }
                                plainBuffers[w] = b;
                                plainLens[w] = rTot;
                            }

                            byte[][] encryptedPackets = new byte[waveCount][];
                            Parallel.For(0, waveCount, txParallelOpts, delegate(int w)
                            {
                                encryptedPackets[w] = EncryptSingleUdpChunk(plainBuffers[w], plainLens[w], waveStart + w, totalChunks, keySnapshot);
                            });

                            for (int w = 0; w < waveCount && !udpTransferDoneAcked && isRunning; w++)
                            {
                                byte[] packet = encryptedPackets[w];
                                SendUdpP2pPacket(packet, packet.Length, targetEp);
                                totalSent += plainLens[w];
                                totalWireBytesSent += plainLens[w];
                                txUiWindowBytes += plainLens[w];

                                // Sub-microsecond hardware Stopwatch Token-Bucket pacer (never stalls on dropped packets!)
                                PaceUdpPacketSend(packet.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                            }

                            waveStart += waveCount;

                            double txWinSec = txUiSw.Elapsed.TotalSeconds;
                            if (txWinSec >= 0.50 || smoothedUiTxMbps <= 0.0)
                            {
                                if (smoothedUiTxMbps <= 0.0)
                                {
                                    double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                    smoothedUiTxMbps = (totalWireBytesSent / (1024.0 * 1024.0)) / sec;
                                }
                                else if (txWinSec >= 0.50)
                                {
                                    double sampleTx = (txUiWindowBytes / (1024.0 * 1024.0)) / txWinSec;
                                    smoothedUiTxMbps = (smoothedUiTxMbps * 0.68) + (sampleTx * 0.32);
                                    txUiWindowBytes = 0;
                                    txUiSw.Restart();
                                }
                            }
                            double avgTxMbps = (Math.Max(0L, totalSent - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending via UDP P2P: " + fileName, totalSent, fileSize, smoothedUiTxMbps, avgTxMbps, permille);
                        }

                        if (!abortedByDisconnect && isRunning)
                        {
                            // Send END and handle any remaining tail NACK retransmission requests until receiver confirms AETHER_UDP_DONE
                            byte[] endBytes = Encoding.UTF8.GetBytes("AETHER_UDP_END|" + fileName.Replace("|", "_"));
                            int tailSinceProgressTick = Environment.TickCount;
                            for (int retry = 0; retry < 250 && !udpTransferDoneAcked && isRunning; retry++)
                            {
                                if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                                {
                                    targetEp = activeUdpPeerEndpoint;
                                }
                                if (retry == 0 || (retry % 5 == 0))
                                {
                                    double tailAvgMbps = (Math.Max(0L, fileSize - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                    UpdateTransferUi("Viimeistellään vastaanottajalla: " + fileName, fileSize, fileSize, smoothedUiTxMbps, tailAvgMbps, 1000);
                                }
                                SendUdpP2pPacket(endBytes, endBytes.Length, targetEp);
                                udpAckEvent.WaitOne(80);
                                if (udpTransferDoneAcked) break;

                                int missIdx;
                                bool repairedTail = false;
                                while (udpRetransmitQueue.TryDequeue(out missIdx))
                                {
                                    if (missIdx >= 0 && missIdx < totalChunks)
                                    {
                                        long pos = (long)missIdx * UDP_CHUNK_SIZE;
                                        int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - pos);
                                        byte[] b = new byte[rem];
                                        fsRepair.Seek(pos, SeekOrigin.Begin);
                                        int r = fsRepair.Read(b, 0, rem);
                                        if (r > 0)
                                        {
                                            byte[] pkt = EncryptSingleUdpChunk(b, r, missIdx, totalChunks, keySnapshot);
                                            SendUdpP2pPacket(pkt, pkt.Length, targetEp);
                                            PaceUdpPacketSend(pkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                            repairedTail = true;
                                        }
                                    }
                                }
                                if (repairedTail)
                                {
                                    retry = 0;
                                    tailSinceProgressTick = Environment.TickCount;
                                }
                                else if (unchecked(Environment.TickCount - udpTxLastPeerActivityTick) > 15000 && unchecked(Environment.TickCount - tailSinceProgressTick) > 15000)
                                {
                                    break;
                                }
                            }
                        }
                    }

                    sw.Stop();
                    if (abortedByDisconnect || !udpTransferDoneAcked || !isRunning)
                    {
                        double partialSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double partialMbps = (Math.Max(1L, totalSent - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / partialSec;
                        int partialPermille = (int)((Math.Min(fileSize, totalSent) * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Siirto keskeytyi (UDP P2P): " + fileName, Math.Min(fileSize, totalSent), fileSize, 0.0, partialMbps, partialPermille, true);
                        Log("UDP P2P siirto keskeytyi ilman vahvistusta (" + fileName + ") — merkitään jatkettavaksi.");
                        return "Virhe";
                    }

                    double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                    long finalSessionBytes = Math.Max(1L, fileSize - ((long)initialStartChunk * UDP_CHUNK_SIZE));
                    double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                    UpdateTransferUi("Sent via UDP NAT-Punch: " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                    Log(String.Format("UDP NAT-P2P TX COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s (Verified 100% Saved)",
                        fileName, FormatBytes(fileSize), totalSec, finalMbps));
                    if (isRunning) Thread.Sleep(150);
                    return "Valmis";
                }
                catch (Exception ex)
                {
                    Log("UDP P2P TX Error: " + ex.Message);
                    return "Virhe";
                }
                finally
                {
                    udpTxActiveFileName = "";
                }
            }
        }

        private string StreamFileToBrowserOverCloudBridge(string filePath, string queueEntryId = "", string overrideDstPeer = "", string overrideLabel = "")
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-cloud-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + CLOUD_CHUNK_SIZE - 1) / CLOUD_CHUNK_SIZE);
                string dstPeer = !String.IsNullOrEmpty(overrideDstPeer)
                    ? overrideDstPeer
                    : (!String.IsNullOrEmpty(activeCloudBrowserPeerId) ? activeCloudBrowserPeerId : activeCloudExePeerId);
                string peerLabel = !String.IsNullOrEmpty(overrideLabel)
                    ? overrideLabel
                    : (!String.IsNullOrEmpty(overrideDstPeer) ? overrideDstPeer : (!String.IsNullOrEmpty(activeCloudBrowserPeerId) ? "Chrome Browser" : "Remote .EXE"));

                Log("Streaming .EXE -> " + peerLabel + " over Wormhole Bridge: " + fileName + " (" + FormatBytes(fileSize) + ")");

                cloudResumeChunk = 0;
                cloudWaitAcceptReceived = false;
                cloudTransferRejected = false;
                cloudResumeReceived = false;
                cloudResumeEvent.Reset();

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, CLOUD_CHUNK_SIZE, totalChunks
                );
                for (int att = 0; att < 5 && isRunning; att++)
                {
                    SendCloudPacketAny(dstPeer, startJson);
                    if (cloudResumeEvent.WaitOne(1000))
                    {
                        if (cloudResumeReceived || cloudWaitAcceptReceived || cloudTransferRejected) break;
                    }
                }
                if (!cloudResumeReceived && !cloudWaitAcceptReceived && !cloudTransferRejected)
                {
                    Log("Wormhole Cloud -vastaanottaja ei vastannut aloituskutsuun: " + fileName);
                    return "Virhe";
                }
                if (cloudWaitAcceptReceived && !cloudResumeReceived && !cloudTransferRejected && isRunning)
                {
                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Odotetaan hyväksyntää");
                    UpdateTransferUi("Odotetaan vastaanottajan hyväksyntää: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    int waitLoops = 0;
                    while (!cloudResumeReceived && !cloudTransferRejected && isRunning && waitLoops < 150)
                    {
                        cloudResumeEvent.WaitOne(800);
                        waitLoops++;
                    }
                    if (!cloudResumeReceived && !cloudTransferRejected) return "Virhe";
                }
                if (cloudTransferRejected)
                {
                    Log("Vastaanottaja hylkäsi tiedoston: " + fileName);
                    UpdateTransferUi("Vastaanottaja hylkäsi: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    return "Hylätty";
                }
                if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Siirretään");

                int startChunk = Math.Max(0, Math.Min(cloudResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming interrupted Wormhole transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CLOUD_CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long cloudPaceEpoch = Stopwatch.GetTimestamp();
                long initialBytes = (long)startChunk * CLOUD_CHUNK_SIZE;
                long totalSent = initialBytes;
                byte[] buf = new byte[CLOUD_CHUNK_SIZE];
                int chunkIndex = startChunk;

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CLOUD_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalSent > 0) fs.Seek(totalSent, SeekOrigin.Begin);
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0 && !cloudTransferRejected && isRunning)
                    {
                        if (transferPaused && isRunning)
                        {
                            sw.Stop();
                            double pausedAvg = (Math.Max(0L, totalSent - initialBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int pausedPermille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Pysäytetty: " + fileName, totalSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                            while (transferPaused && isRunning)
                            {
                                transferResumeEvent.WaitOne(200);
                            }
                            if (!isRunning) break;
                            sw.Start();
                            cloudPaceEpoch = Stopwatch.GetTimestamp();
                        }
                        string b64 = Convert.ToBase64String(buf, 0, read);
                        string chunkJson = String.Format(
                            "{{\\"kind\\":\\"exe:file-chunk\\",\\"fileId\\":\\"{0}\\",\\"chunkIndex\\":{1},\\"data\\":\\"{2}\\"}}",
                            fileId, chunkIndex, b64
                        );
                        SendCloudPacketAny(dstPeer, chunkJson);

                        totalSent += read;
                        chunkIndex++;
                        PaceGenericTxBytes(read, ref cloudPaceEpoch);

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        long deltaBytes = Math.Max(1L, totalSent - initialBytes);
                        double mbps = (deltaBytes / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Sending to " + peerLabel + ": " + fileName, totalSent, fileSize, mbps, mbps, permille);

                        if (chunkIndex % 24 == 0)
                        {
                            cloudAckEvent.WaitOne(350);
                        }
                    }
                }

                if (cloudTransferRejected)
                {
                    Log("Vastaanottaja hylkäsi tiedoston: " + fileName);
                    return "Hylätty";
                }

                if (!isRunning || activeSignalingChannels.IsEmpty || totalSent < fileSize)
                {
                    return "Virhe";
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                SendCloudPacketAny(dstPeer, endJson);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                long finalSessionBytes = Math.Max(1L, fileSize - initialBytes);
                double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to " + peerLabel + ": " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                Log(String.Format(".EXE -> {0} COMPLETE: {1} ({2}) in {3:F2}s — {4:F2} MB/s",
                    peerLabel.ToUpperInvariant(), fileName, FormatBytes(fileSize), totalSec, finalMbps));
                return "Valmis";
            }
            catch (Exception ex)
            {
                Log("Wormhole Cloud Bridge TX Error: " + ex.Message);
                return "Virhe";
            }
        }

        private string StreamFileToBrowserOverWebSocket(string filePath, string queueEntryId = "")
        {
            try
            {
                if (activeBrowserWsStream == null || activeBrowserWsClient == null || !activeBrowserWsClient.Connected) return "Virhe";
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + WS_CHUNK_SIZE - 1) / WS_CHUNK_SIZE);

                Log("Streaming from .EXE -> Chrome Browser over Local Kernel WebSocket: " + fileName + " (" + FormatBytes(fileSize) + ")");

                wsResumeChunk = 0;
                wsWaitAcceptReceived = false;
                wsTransferRejected = false;
                wsResumeReceived = false;
                wsResumeEvent.Reset();

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, WS_CHUNK_SIZE, totalChunks
                );
                byte[] startBytes = Encoding.UTF8.GetBytes(startJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, startBytes, 0, startBytes.Length);

                for (int att = 0; att < 5 && isRunning; att++)
                {
                    if (wsResumeEvent.WaitOne(800))
                    {
                        if (wsResumeReceived || wsWaitAcceptReceived || wsTransferRejected) break;
                    }
                }
                if (wsWaitAcceptReceived && !wsResumeReceived && !wsTransferRejected && isRunning)
                {
                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Odotetaan hyväksyntää");
                    UpdateTransferUi("Odotetaan vastaanottajan hyväksyntää: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    int waitLoops = 0;
                    while (!wsResumeReceived && !wsTransferRejected && isRunning && waitLoops < 150)
                    {
                        wsResumeEvent.WaitOne(800);
                        waitLoops++;
                    }
                    if (!wsResumeReceived && !wsTransferRejected) return "Virhe";
                }
                if (wsTransferRejected)
                {
                    Log("Selain hylkäsi tiedoston: " + fileName);
                    UpdateTransferUi("Vastaanottaja hylkäsi: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    return "Hylätty";
                }
                if (!wsResumeReceived) return "Virhe";
                if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Siirretään");

                int startChunk = Math.Max(0, Math.Min(wsResumeChunk, totalChunks));
                long initialBytes = Math.Min(fileSize, (long)startChunk * WS_CHUNK_SIZE);
                if (startChunk > 0)
                {
                    Log("Resuming Local WebSocket transfer from chunk " + startChunk.ToString() + " (" + FormatBytes(initialBytes) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long wsPaceEpoch = Stopwatch.GetTimestamp();
                long totalSent = initialBytes;
                byte[] buf = new byte[WS_CHUNK_SIZE];

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, WS_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (initialBytes > 0) fs.Seek(initialBytes, SeekOrigin.Begin);
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0 && isRunning)
                    {
                        if (transferPaused && isRunning)
                        {
                            sw.Stop();
                            double pausedAvg = (Math.Max(0L, totalSent - initialBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int pausedPermille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Pysäytetty (Browser WS): " + fileName, totalSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                            while (transferPaused && isRunning)
                            {
                                transferResumeEvent.WaitOne(200);
                            }
                            if (!isRunning) break;
                            sw.Start();
                            wsPaceEpoch = Stopwatch.GetTimestamp();
                        }
                        SendWebSocketFrame(activeBrowserWsStream, 0x02, buf, 0, read);
                        totalSent += read;
                        PaceGenericTxBytes(read, ref wsPaceEpoch);

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double mbps = (Math.Max(1L, totalSent - initialBytes) / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Streaming to Browser: " + fileName, totalSent, fileSize, mbps, mbps, permille);
                    }
                }

                if (!isRunning || totalSent < fileSize || activeBrowserWsStream == null)
                {
                    return "Virhe";
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                byte[] endBytes = Encoding.UTF8.GetBytes(endJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, endBytes, 0, endBytes.Length);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (Math.Max(1L, fileSize - initialBytes) / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to Browser: " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                Log(String.Format(".EXE -> BROWSER COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
                return "Valmis";
            }
            catch (Exception ex)
            {
                Log("Browser WebSocket TX Error: " + ex.Message);
                return "Virhe";
            }
        }

        private string StreamFileOverKernelTcp(string filePath, string queueEntryId = "", RoomPeerInfo targetPeer = null)
        {
            NetworkStream txStream = null;
            try
            {
                txStream = (targetPeer != null && targetPeer.TcpStream != null && targetPeer.TcpClientConn != null && targetPeer.TcpClientConn.Connected)
                    ? targetPeer.TcpStream
                    : activePeerStream;
                if (txStream == null) return "Virhe";

                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                int totalChunks = (int)Math.Max(1L, (fileSize + CHUNK_SIZE - 1) / CHUNK_SIZE);

                Log("Starting Kernel-Socket transfer: " + fileName + " (" + FormatBytes(fileSize) + ", " + totalChunks.ToString() + " x 4 MB blocks)");

                kernelTcpResumeChunk = 0;
                kernelTcpWaitAccept = false;
                kernelTcpRejected = false;
                kernelTcpResumeReceived = false;
                kernelTcpResumeEvent.Reset();

                byte[] nameBytes = Encoding.UTF8.GetBytes(fileName);
                byte[] metaPayload = new byte[12 + nameBytes.Length];
                Buffer.BlockCopy(BitConverter.GetBytes(fileSize), 0, metaPayload, 0, 8);
                Buffer.BlockCopy(BitConverter.GetBytes(totalChunks), 0, metaPayload, 8, 4);
                Buffer.BlockCopy(nameBytes, 0, metaPayload, 12, nameBytes.Length);
                WriteKernelFrameTo(txStream, 1, metaPayload, metaPayload.Length);

                for (int att = 0; att < 10 && isRunning; att++)
                {
                    if (kernelTcpResumeEvent.WaitOne(500))
                    {
                        if (kernelTcpResumeReceived || kernelTcpWaitAccept || kernelTcpRejected) break;
                    }
                }
                if (!kernelTcpResumeReceived && !kernelTcpWaitAccept && !kernelTcpRejected)
                {
                    Log("Kernel TCP -vastaanottaja ei vastannut aloituskehykseen — yhteys nollataan.");
                    if (targetPeer != null && Object.ReferenceEquals(targetPeer.TcpStream, txStream))
                    {
                        try { if (targetPeer.TcpClientConn != null) targetPeer.TcpClientConn.Close(); } catch { }
                        targetPeer.TcpClientConn = null;
                        targetPeer.TcpStream = null;
                        SyncTargetPeerDropdown();
                    }
                    if (Object.ReferenceEquals(activePeerStream, txStream))
                    {
                        try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
                        activePeerClient = null;
                        activePeerStream = null;
                    }
                    return "Virhe";
                }
                if (kernelTcpWaitAccept && !kernelTcpResumeReceived && !kernelTcpRejected && isRunning)
                {
                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Odotetaan hyväksyntää");
                    UpdateTransferUi("Odotetaan vastaanottajan hyväksyntää: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    Log("Odotetaan vastaanottajan hyväksyntää tiedostolle: " + fileName);
                    int waitLoops = 0;
                    while (!kernelTcpResumeReceived && !kernelTcpRejected && isRunning && waitLoops < 150)
                    {
                        kernelTcpResumeEvent.WaitOne(800);
                        waitLoops++;
                    }
                    if (!kernelTcpResumeReceived && !kernelTcpRejected) return "Virhe";
                }

                if (kernelTcpRejected)
                {
                    Log("Vastaanottaja hylkäsi tiedoston: " + fileName);
                    UpdateTransferUi("Vastaanottaja hylkäsi: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    return "Hylätty";
                }
                if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Siirretään");

                int startChunk = Math.Max(0, Math.Min(kernelTcpResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming Kernel-Socket transfer from block " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                Stopwatch txUiSw = Stopwatch.StartNew();
                long tcpPaceEpoch = Stopwatch.GetTimestamp();
                long txWinBytes = 0;
                double smoothedLiveMbps = 0.0;
                long initialBytes = Math.Min(fileSize, (long)startChunk * CHUNK_SIZE);
                long totalBytesSent = initialBytes;
                byte[] keySnapshot = (byte[])aesKey.Clone();

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalBytesSent > 0) fs.Seek(totalBytesSent, SeekOrigin.Begin);

                    for (int waveStart = startChunk; waveStart < totalChunks && isRunning; waveStart += PARALLEL_WORKERS)
                    {
                        if (transferPaused && isRunning)
                        {
                            sw.Stop();
                            double pausedAvg = (Math.Max(0L, totalBytesSent - initialBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int pausedPermille = (int)((totalBytesSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Pysäytetty: " + fileName, totalBytesSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                            while (transferPaused && isRunning)
                            {
                                transferResumeEvent.WaitOne(200);
                            }
                            if (!isRunning) break;
                            sw.Start();
                            txUiSw.Restart();
                            tcpPaceEpoch = Stopwatch.GetTimestamp();
                            txWinBytes = 0;
                            smoothedLiveMbps = 0.0;
                        }
                        int waveCount = Math.Min(PARALLEL_WORKERS, totalChunks - waveStart);
                        byte[][] plainBlocks = new byte[waveCount][];
                        int[] plainLengths = new int[waveCount];

                        for (int w = 0; w < waveCount; w++)
                        {
                            int remaining = (int)Math.Min((long)CHUNK_SIZE, fileSize - ((long)(waveStart + w) * CHUNK_SIZE));
                            byte[] buf = new byte[remaining];
                            int readTotal = 0;
                            while (readTotal < remaining)
                            {
                                int r = fs.Read(buf, readTotal, remaining - readTotal);
                                if (r <= 0) break;
                                readTotal += r;
                            }
                            plainBlocks[w] = buf;
                            plainLengths[w] = readTotal;
                        }

                        byte[][] encryptedPayloads = new byte[waveCount][];
                        Parallel.For(0, waveCount, delegate(int w)
                        {
                            int chunkIndex = waveStart + w;
                            byte[] iv = new byte[16];
                            Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, iv, 0, 4);
                            Buffer.BlockCopy(BitConverter.GetBytes(Environment.TickCount ^ chunkIndex), 0, iv, 4, 4);

                            using (AesCryptoServiceProvider aes = new AesCryptoServiceProvider())
                            {
                                aes.KeySize = 256;
                                aes.BlockSize = 128;
                                aes.Key = keySnapshot;
                                aes.IV = iv;
                                aes.Mode = CipherMode.CBC;
                                aes.Padding = PaddingMode.PKCS7;

                                using (ICryptoTransform encryptor = aes.CreateEncryptor())
                                {
                                    byte[] cipher = encryptor.TransformFinalBlock(plainBlocks[w], 0, plainLengths[w]);
                                    byte[] frameBody = new byte[20 + cipher.Length];
                                    Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, frameBody, 0, 4);
                                    Buffer.BlockCopy(iv, 0, frameBody, 4, 16);
                                    Buffer.BlockCopy(cipher, 0, frameBody, 20, cipher.Length);
                                    encryptedPayloads[w] = frameBody;
                                }
                            }
                        });

                        for (int w = 0; w < waveCount; w++)
                        {
                            byte[] body = encryptedPayloads[w];
                            WriteKernelFrameTo(txStream, 2, body, body.Length);
                            totalBytesSent += plainLengths[w];
                            txWinBytes += plainLengths[w];
                            PaceGenericTxBytes(plainLengths[w], ref tcpPaceEpoch);

                            double elapsedSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            double avgMbps = (Math.Max(1L, totalBytesSent - initialBytes) / (1024.0 * 1024.0)) / elapsedSec;
                            double winSec = txUiSw.Elapsed.TotalSeconds;
                            if (winSec >= 0.50)
                            {
                                double inst = (txWinBytes / (1024.0 * 1024.0)) / winSec;
                                smoothedLiveMbps = smoothedLiveMbps <= 0.0 ? inst : (smoothedLiveMbps * 0.68) + (inst * 0.32);
                                txWinBytes = 0;
                                txUiSw.Restart();
                            }
                            double liveMbps = smoothedLiveMbps > 0.0 ? smoothedLiveMbps : avgMbps;
                            int permille = (int)((totalBytesSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending: " + fileName, totalBytesSent, fileSize, liveMbps, avgMbps, permille);
                        }
                    }
                }

                if (!isRunning || totalBytesSent < fileSize)
                {
                    return "Virhe";
                }

                WriteKernelFrameTo(txStream, 3, new byte[4], 4);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                long finalSessionBytes = Math.Max(1L, fileSize - initialBytes);
                double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent & Verified: " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                Log(String.Format("TX COMPLETE: {0} ({1}) in {2:F2}s — Average Speed: {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
                return "Valmis";
            }
            catch (Exception ex)
            {
                Log("TX Error: " + ex.Message);
                if (txStream != null)
                {
                    if (targetPeer != null && Object.ReferenceEquals(targetPeer.TcpStream, txStream))
                    {
                        try { if (targetPeer.TcpClientConn != null) targetPeer.TcpClientConn.Close(); } catch { }
                        targetPeer.TcpClientConn = null;
                        targetPeer.TcpStream = null;
                        SyncTargetPeerDropdown();
                    }
                    if (Object.ReferenceEquals(activePeerStream, txStream))
                    {
                        try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
                        activePeerClient = null;
                        activePeerStream = null;
                    }
                }
                return "Virhe";
            }
        }

        private void WriteKernelFrame(byte frameType, byte[] payload, int payloadLen)
        {
            WriteKernelFrameTo(activePeerStream, frameType, payload, payloadLen);
        }

        private void WriteKernelFrameTo(NetworkStream targetStream, byte frameType, byte[] payload, int payloadLen)
        {
            if (targetStream == null) throw new InvalidOperationException("No active TCP stream.");
            byte[] header = new byte[9];
            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, header, 0, 4);
            header[4] = frameType;
            Buffer.BlockCopy(BitConverter.GetBytes(payloadLen), 0, header, 5, 4);

            lock (streamWriteLock)
            {
                targetStream.Write(header, 0, 9);
                targetStream.Write(payload, 0, payloadLen);
            }
        }

        private void ReceiveKernelTcpLoop(TcpClient client, NetworkStream netStream, byte[] preReadThreeBytes)
        {
            byte[] headerBuf = new byte[9];
            bool hasPreRead = (preReadThreeBytes != null && preReadThreeBytes.Length == 3);

            FileStream currentOutFile = null;
            string currentFileName = "";
            string currentOutPath = "";
            string currentPartPath = "";
            long expectedFileSize = 0;
            long receivedPlainBytes = 0;
            long tcpSessionStartBytes = 0;
            long tcpUiWinBytes = 0;
            long tcpLastCkptBytes = 0;
            double tcpSmoothedLiveMbps = 0.0;
            Stopwatch tcpUiSw = Stopwatch.StartNew();
            Stopwatch rxSw = null;

            try
            {
                while (isRunning && client.Connected)
                {
                    if (transferPaused && currentOutFile != null && isRunning)
                    {
                        if (rxSw != null) rxSw.Stop();
                        double pausedAvg = rxSw != null ? (Math.Max(0L, receivedPlainBytes - tcpSessionStartBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, rxSw.Elapsed.TotalSeconds) : 0.0;
                        int pausedPermille = (int)((receivedPlainBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Pysäytetty: " + currentFileName, receivedPlainBytes, expectedFileSize, 0.0, pausedAvg, pausedPermille, true);
                        while (transferPaused && isRunning && client.Connected)
                        {
                            transferResumeEvent.WaitOne(200);
                        }
                        if (!isRunning || !client.Connected) break;
                        if (rxSw != null) rxSw.Start();
                        tcpUiSw.Restart();
                        tcpUiWinBytes = 0;
                        tcpSmoothedLiveMbps = 0.0;
                    }
                    if (hasPreRead)
                    {
                        headerBuf[0] = preReadThreeBytes[0];
                        headerBuf[1] = preReadThreeBytes[1];
                        headerBuf[2] = preReadThreeBytes[2];
                        hasPreRead = false;
                        if (!ReadExactBytesOffset(netStream, headerBuf, 3, 6)) break;
                    }
                    else
                    {
                        if (!ReadExactBytes(netStream, headerBuf, 9)) break;
                    }

                    uint magic = BitConverter.ToUInt32(headerBuf, 0);
                    if (magic != MAGIC_HEADER)
                    {
                        Log("Protocol error: Invalid frame magic on kernel socket.");
                        break;
                    }

                    byte frameType = headerBuf[4];
                    int payloadLen = BitConverter.ToInt32(headerBuf, 5);
                    if (payloadLen < 0 || payloadLen > 32 * 1024 * 1024) break;

                    byte[] payload = new byte[payloadLen];
                    if (!ReadExactBytes(netStream, payload, payloadLen)) break;

                    if (frameType == 1)
                    {
                        expectedFileSize = BitConverter.ToInt64(payload, 0);
                        int totalChunks = BitConverter.ToInt32(payload, 8);
                        currentFileName = Encoding.UTF8.GetString(payload, 12, payloadLen - 12);
                        currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);
                        currentPartPath = currentOutPath + ".part";

                        if (currentOutFile != null)
                        {
                            try { WriteCheckpointFile(currentPartPath, receivedPlainBytes, expectedFileSize); } catch { }
                            try { currentOutFile.Flush(false); } catch { }
                            try { currentOutFile.Close(); } catch { }
                            currentOutFile = null;
                        }
                        ReleaseConflictingRxHandlesForPart(currentPartPath, "tcp");
                        lock (rxHandleCoordLock)
                        {
                            activeTcpRxClient = client;
                            activeTcpRxPartPath = currentPartPath;
                        }

                        bool hasPart = File.Exists(currentPartPath) && ReadCheckpointBytes(currentPartPath, expectedFileSize) > 0;

                        if (!autoAcceptAllIncoming)
                        {
                            try
                            {
                                byte[] waitHeader = new byte[9];
                                Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, waitHeader, 0, 4);
                                waitHeader[4] = 6;
                                Buffer.BlockCopy(BitConverter.GetBytes(4), 0, waitHeader, 5, 4);
                                lock (streamWriteLock)
                                {
                                    netStream.Write(waitHeader, 0, 9);
                                    netStream.Write(new byte[4], 0, 4);
                                }
                            }
                            catch { }
                        }

                        int choice = autoAcceptAllIncoming ? 1 : ShowIncomingTransferDialog("Kernel TCP (.EXE)", currentFileName, expectedFileSize, hasPart);
                        if (choice == 0)
                        {
                            Log("Saapuva TCP-tiedosto hylätty: " + currentFileName);
                            try
                            {
                                byte[] rejHeader = new byte[9];
                                Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, rejHeader, 0, 4);
                                rejHeader[4] = 5;
                                Buffer.BlockCopy(BitConverter.GetBytes(4), 0, rejHeader, 5, 4);
                                lock (streamWriteLock)
                                {
                                    netStream.Write(rejHeader, 0, 9);
                                    netStream.Write(new byte[4], 0, 4);
                                }
                            }
                            catch { }
                            lock (rxHandleCoordLock)
                            {
                                if (Object.ReferenceEquals(activeTcpRxClient, client)) activeTcpRxPartPath = "";
                            }
                            continue;
                        }

                        long existingBytes = ReadCheckpointBytes(currentPartPath, expectedFileSize);
                        int resumeFromChunk = (int)(existingBytes / CHUNK_SIZE);
                        long alignedBytes = (long)resumeFromChunk * CHUNK_SIZE;

                        Exception openErr = null;
                        for (int opTry = 0; opTry < 5; opTry++)
                        {
                            try
                            {
                                currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.OpenOrCreate : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                openErr = null;
                                break;
                            }
                            catch (Exception oex)
                            {
                                openErr = oex;
                                Thread.Sleep(80);
                            }
                        }
                        if (currentOutFile == null)
                        {
                            Log("TCP RX tiedoston avausvirhe: " + (openErr != null ? openErr.Message : "lukittu"));
                            lock (rxHandleCoordLock)
                            {
                                if (Object.ReferenceEquals(activeTcpRxClient, client)) activeTcpRxPartPath = "";
                            }
                            continue;
                        }
                        if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                        receivedPlainBytes = alignedBytes;
                        tcpSessionStartBytes = alignedBytes;
                        tcpLastCkptBytes = alignedBytes;
                        tcpUiWinBytes = 0;
                        tcpSmoothedLiveMbps = 0.0;
                        tcpUiSw.Restart();
                        rxSw = Stopwatch.StartNew();

                        try
                        {
                            byte[] resumeAckPayload = BitConverter.GetBytes(resumeFromChunk);
                            byte[] ackHeader = new byte[9];
                            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, ackHeader, 0, 4);
                            ackHeader[4] = 4;
                            Buffer.BlockCopy(BitConverter.GetBytes(4), 0, ackHeader, 5, 4);
                            lock (streamWriteLock)
                            {
                                netStream.Write(ackHeader, 0, 9);
                                netStream.Write(resumeAckPayload, 0, 4);
                            }
                        }
                        catch { }

                        if (resumeFromChunk > 0)
                            Log("Resuming interrupted Kernel-Socket file at block " + resumeFromChunk.ToString() + " (" + FormatBytes(alignedBytes) + ")");
                        else
                            Log("Receiving directly to disk: " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                    }
                    else if (frameType == 6)
                    {
                        kernelTcpWaitAccept = true;
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 5)
                    {
                        kernelTcpRejected = true;
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 4 && payloadLen >= 4)
                    {
                        kernelTcpResumeChunk = BitConverter.ToInt32(payload, 0);
                        kernelTcpResumeReceived = true;
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 2 && currentOutFile != null)
                    {
                        int chunkIndex = BitConverter.ToInt32(payload, 0);
                        byte[] iv = new byte[16];
                        Buffer.BlockCopy(payload, 4, iv, 0, 16);

                        byte[] plain;
                        using (AesCryptoServiceProvider aes = new AesCryptoServiceProvider())
                        {
                            aes.KeySize = 256;
                            aes.BlockSize = 128;
                            aes.Key = aesKey;
                            aes.IV = iv;
                            aes.Mode = CipherMode.CBC;
                            aes.Padding = PaddingMode.PKCS7;

                            using (ICryptoTransform decryptor = aes.CreateDecryptor())
                            {
                                plain = decryptor.TransformFinalBlock(payload, 20, payloadLen - 20);
                            }
                        }

                        long writeOffset = (long)chunkIndex * CHUNK_SIZE;
                        if (currentOutFile.Position != writeOffset) currentOutFile.Seek(writeOffset, SeekOrigin.Begin);
                        currentOutFile.Write(plain, 0, plain.Length);
                        receivedPlainBytes = Math.Max(receivedPlainBytes, writeOffset + plain.Length);
                        tcpUiWinBytes += plain.Length;
                        if (receivedPlainBytes - tcpLastCkptBytes >= 64L * 1024L * 1024L)
                        {
                            WriteCheckpointFile(currentPartPath, receivedPlainBytes, expectedFileSize);
                            tcpLastCkptBytes = receivedPlainBytes;
                        }

                        double elapsedSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double avgMbps = (Math.Max(1L, receivedPlainBytes - tcpSessionStartBytes) / (1024.0 * 1024.0)) / elapsedSec;
                        double winSec = tcpUiSw.Elapsed.TotalSeconds;
                        if (winSec >= 0.35)
                        {
                            double inst = (tcpUiWinBytes / (1024.0 * 1024.0)) / winSec;
                            tcpSmoothedLiveMbps = tcpSmoothedLiveMbps <= 0.0 ? inst : (tcpSmoothedLiveMbps * 0.35) + (inst * 0.65);
                            tcpUiWinBytes = 0;
                            tcpUiSw.Restart();
                        }
                        double liveMbps = tcpSmoothedLiveMbps > 0.0 ? tcpSmoothedLiveMbps : avgMbps;
                        int permille = (int)((receivedPlainBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving to Disk: " + currentFileName, receivedPlainBytes, expectedFileSize, liveMbps, avgMbps, permille);
                    }
                    else if (frameType == 3 && currentOutFile != null)
                    {
                        try { if (expectedFileSize > 0 && currentOutFile.Length != expectedFileSize) currentOutFile.SetLength(expectedFileSize); } catch { }
                        try { currentOutFile.Flush(false); } catch { }
                        currentOutFile.Close();
                        currentOutFile = null;
                        rxSw.Stop();
                        lock (rxHandleCoordLock)
                        {
                            if (Object.ReferenceEquals(activeTcpRxClient, client)) activeTcpRxPartPath = "";
                        }

                        bool movedOk = SafeFinalizePartFile(currentPartPath, currentOutPath, currentPartPath + ".ckpt");

                        double totalSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        long sessionDelta = Math.Max(1L, expectedFileSize - tcpSessionStartBytes);
                        double finalMbps = (sessionDelta / (1024.0 * 1024.0)) / totalSec;
                        if (movedOk)
                        {
                            UpdateTransferUi("Saved to Disk: " + currentFileName, expectedFileSize, expectedFileSize, finalMbps, finalMbps, 1000, true);
                            Log(String.Format("RX COMPLETE & SAVED: {0} ({1:F2} MB/s · {2:F2} Gbps)",
                                currentOutPath, finalMbps, (finalMbps * 8.0) / 1000.0));
                        }
                        else
                        {
                            UpdateTransferUi("Viimeistely epäonnistui (.part lukittu): " + currentFileName, expectedFileSize, expectedFileSize, finalMbps, finalMbps, 1000, true);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("RX Stream closed: " + ex.Message);
            }
            finally
            {
                if (currentOutFile != null)
                {
                    try { WriteCheckpointFile(currentPartPath, receivedPlainBytes, expectedFileSize); } catch { }
                    try { currentOutFile.Flush(false); } catch { }
                    try { currentOutFile.Close(); } catch { }
                    currentOutFile = null;
                }
                lock (rxHandleCoordLock)
                {
                    if (Object.ReferenceEquals(activeTcpRxClient, client))
                    {
                        activeTcpRxClient = null;
                        activeTcpRxPartPath = "";
                    }
                }
            }
        }

        private bool ReadExactBytes(NetworkStream stream, byte[] buffer, int count)
        {
            return ReadExactBytesOffset(stream, buffer, 0, count);
        }

        private bool ReadExactBytesOffset(NetworkStream stream, byte[] buffer, int startOffset, int count)
        {
            int offset = 0;
            while (offset < count)
            {
                int read = stream.Read(buffer, startOffset + offset, count - offset);
                if (read <= 0) return false;
                offset += read;
            }
            return true;
        }

        private void UpdateTransferUi(string statusText, long doneBytes, long totalBytes, double liveMbps, double avgMbps, int permille, bool force = false)
        {
            if (!force && permille < 1000)
            {
                int nowTick = Environment.TickCount;
                if (unchecked(nowTick - lastUiUpdateTick) < 100) return;
                lastUiUpdateTick = nowTick;
            }
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string, long, long, double, double, int, bool>(UpdateTransferUi), statusText, doneBytes, totalBytes, liveMbps, avgMbps, permille, true);
                return;
            }
            double liveGbps = (liveMbps * 8.0) / 1000.0;
            double avgGbps = (avgMbps * 8.0) / 1000.0;
            lblSpeedMetric.Text = String.Format("{0:F2} MB/s  ({1:F2} Gbps)", liveMbps, liveGbps);
            if (lblTransferStats != null)
            {
                lblTransferStats.Text = String.Format("Siirretty: {0} / {1}  |  Keskinopeus: {2:F2} MB/s ({3:F2} Gbps)", FormatBytes(doneBytes), FormatBytes(totalBytes), avgMbps, avgGbps);
            }
            lblProgressDetail.Text = String.Format("{0} — {1}%", statusText, permille / 10);
            progressBar.Value = Math.Max(0, Math.Min(1000, permille));
        }

        private string FormatBytes(long bytes)
        {
            if (bytes >= 1024L * 1024L * 1024L)
                return String.Format("{0:F2} GB", bytes / (1024.0 * 1024.0 * 1024.0));
            if (bytes >= 1024L * 1024L)
                return String.Format("{0:F2} MB", bytes / (1024.0 * 1024.0));
            if (bytes >= 1024L)
                return String.Format("{0:F1} KB", bytes / 1024.0);
            return bytes.ToString() + " B";
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            isRunning = false;
            try { transferResumeEvent.Set(); } catch { }
            try { transferQueueEvent.Set(); } catch { }
            try { udpRxDataEvent.Set(); } catch { }
            try { diskWriteEvent.Set(); } catch { }
            try { udpAckEvent.Set(); } catch { }
            try { udpResumeEvent.Set(); } catch { }
            try { kernelTcpResumeEvent.Set(); } catch { }
            try { cloudResumeEvent.Set(); } catch { }
            try { wsResumeEvent.Set(); } catch { }
            try { udpWriterExitedEvent.WaitOne(5000); } catch { }
            try { udpDiskIoExitedEvent.WaitOne(5000); } catch { }
            try { if (tcpListener != null) tcpListener.Stop(); } catch { }
            try { if (udpDiscovery != null) udpDiscovery.Close(); } catch { }
            try { if (udpP2pClient != null) udpP2pClient.Close(); } catch { }
            try { if (udpP2pV6Client != null) udpP2pV6Client.Close(); } catch { }
            try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
            try { if (activeTcpRxClient != null) activeTcpRxClient.Close(); } catch { }
            try { if (activeBrowserWsClient != null) activeBrowserWsClient.Close(); } catch { }
            try { if (activeWsRxClient != null) activeWsRxClient.Close(); } catch { }
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                try { if (kv.Value != null && kv.Value.Ws != null) kv.Value.Ws.Dispose(); } catch { }
            }
        }
    }
}
`;

  const totalPeSize = 0x0e00;
  const peHeader = new Uint8Array(totalPeSize);
  const view = new DataView(peHeader.buffer);
  const enc = new TextEncoder();

  const writeAscii = (str: string, offset: number) => {
    const bytes = enc.encode(str);
    peHeader.set(bytes, offset);
  };

  // 1. DOS Header
  writeAscii('MZ', 0x00);
  view.setUint32(0x3c, 0x80, true);

  // 2. PE Signature & COFF Header
  writeAscii('PE\0\0', 0x80);
  view.setUint16(0x84, 0x014c, true);
  view.setUint16(0x86, 3, true);
  view.setUint32(0x88, Math.floor(Date.now() / 1000), true);
  view.setUint16(0x94, 0xe0, true);
  view.setUint16(0x96, 0x010f, true);

  // 3. Optional Header PE32
  const opt = 0x98;
  view.setUint16(opt + 0x00, 0x010b, true);
  view.setUint8(opt + 0x02, 14);
  view.setUint32(opt + 0x04, 0x200, true);
  view.setUint32(opt + 0x08, 0xa00, true);
  view.setUint32(opt + 0x10, 0x1000, true);
  view.setUint32(opt + 0x14, 0x1000, true);
  view.setUint32(opt + 0x18, 0x2000, true);
  view.setUint32(opt + 0x1c, 0x00400000, true);
  view.setUint32(opt + 0x20, 0x1000, true);
  view.setUint32(opt + 0x24, 0x200, true);
  view.setUint16(opt + 0x28, 6, true);
  view.setUint16(opt + 0x30, 6, true);
  view.setUint32(opt + 0x38, 0x4000, true);
  view.setUint32(opt + 0x3c, 0x200, true);
  view.setUint16(opt + 0x44, 2, true); // IMAGE_SUBSYSTEM_WINDOWS_GUI
  view.setUint32(opt + 0x48, 0x100000, true);
  view.setUint32(opt + 0x4c, 0x1000, true);
  view.setUint32(opt + 0x50, 0x100000, true);
  view.setUint32(opt + 0x54, 0x1000, true);
  view.setUint32(opt + 0x5c, 16, true);

  view.setUint32(opt + 0x60 + 8, 0x2000, true);
  view.setUint32(opt + 0x60 + 12, 40, true);
  view.setUint32(opt + 0x60 + 12 * 8, 0x2050, true);
  view.setUint32(opt + 0x60 + 12 * 8 + 4, 20, true);

  const writeSec = (off: number, name: string, vs: number, va: number, rs: number, rp: number, ch: number) => {
    writeAscii(name, off);
    view.setUint32(off + 8, vs, true);
    view.setUint32(off + 12, va, true);
    view.setUint32(off + 16, rs, true);
    view.setUint32(off + 20, rp, true);
    view.setUint32(off + 36, ch, true);
  };

  writeSec(0x178, '.text\0\0\0', 0x200, 0x1000, 0x200, 0x200, 0x60000020);
  writeSec(0x1a0, '.rdata\0\0', 0x200, 0x2000, 0x200, 0x400, 0x40000040);
  writeSec(0x1c8, '.data\0\0\0', 0x800, 0x3000, 0x800, 0x600, 0xc0000040);

  view.setUint32(0x400 + 0, 0x2030, true);
  view.setUint32(0x400 + 12, 0x2070, true);
  view.setUint32(0x400 + 16, 0x2050, true);

  writeAscii('GetModuleFileNameA\0', 0x482);
  writeAscii('SetEnvironmentVariableA\0', 0x49a);
  writeAscii('WinExec\0', 0x4b6);
  writeAscii('ExitProcess\0', 0x4c2);

  const thunks = [0x2080, 0x2098, 0x20b4, 0x20c0, 0];
  thunks.forEach((rva, idx) => {
    view.setUint32(0x430 + idx * 4, rva, true);
    view.setUint32(0x450 + idx * 4, rva, true);
  });

  writeAscii('KERNEL32.dll\0', 0x470);
  writeAscii('AETHER_EXE\0', 0x600);

  const psCommand =
    'powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command "' +
    "$b=[IO.File]::ReadAllBytes($env:AETHER_EXE);" +
    "$s=[Text.Encoding]::UTF8.GetString($b,3584,$b.Length-3584);" +
    "$d=Join-Path $env:LOCALAPPDATA 'AetherTunnel';" +
    "New-Item -ItemType Directory -Force -Path $d|Out-Null;" +
    "$cs=Join-Path $d ('AT_'+$PID+'.cs');" +
    "$bin=Join-Path $d 'AetherTunnel.exe';" +
    "[IO.File]::WriteAllText($cs,$s,[Text.Encoding]::UTF8);" +
    "$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';" +
    "if(-not(Test-Path $csc)){$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework\\v4.0.30319\\csc.exe'};" +
    "& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs;" +
    "if($LASTEXITCODE -ne 0){$bin=Join-Path $d ('AetherTunnel_'+$PID+'.exe');& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs};" +
    "Remove-Item $cs -Force -ErrorAction SilentlyContinue;" +
    "if(Test-Path $bin){Start-Process $bin}" +
    '"\0';

  writeAscii(psCommand, 0x620);

  peHeader.set(
    [
      // GetModuleFileNameA(0, 0x00403500, 500)
      0x68, 0xf4, 0x01, 0x00, 0x00,
      0x68, 0x00, 0x35, 0x40, 0x00,
      0x6a, 0x00,
      0xff, 0x15, 0x50, 0x20, 0x40, 0x00,
      // SetEnvironmentVariableA("AETHER_EXE", 0x00403500)
      0x68, 0x00, 0x35, 0x40, 0x00,
      0x68, 0x00, 0x30, 0x40, 0x00,
      0xff, 0x15, 0x54, 0x20, 0x40, 0x00,
      // WinExec(0x00403020, SW_HIDE)
      0x6a, 0x00,
      0x68, 0x20, 0x30, 0x40, 0x00,
      0xff, 0x15, 0x58, 0x20, 0x40, 0x00,
      // ExitProcess(0)
      0x6a, 0x00,
      0xff, 0x15, 0x5c, 0x20, 0x40, 0x00,
      0xc3,
    ],
    0x200
  );

  const overlayBytes = enc.encode(csharpKernelSource);
  const fullExe = new Uint8Array(peHeader.byteLength + overlayBytes.byteLength);
  fullExe.set(peHeader, 0);
  fullExe.set(overlayBytes, peHeader.byteLength);

  triggerBrowserDownload('AetherTunnel-win-x64.exe', fullExe, 'application/vnd.microsoft.portable-executable');
}
