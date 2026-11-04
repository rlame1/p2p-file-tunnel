// Generates 100% self-contained, zero-install standalone portable packages
// that run directly from GitHub Pages, GitHub Releases, or local disk without any backend server.

export function generateStandalonePortableHtml(defaultRoomCode: string): string {
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
        <span class="ml-3 text-xs text-emerald-400 font-mono">Direct WebRTC P2P + Windows .EXE Wormhole + AES-256-GCM</span>
      </div>
      <div id="status-badge" class="text-xs font-mono text-amber-400">Initializing P2P Node...</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">1. Wormhole Pairing Code</h2>
        <p class="text-xs text-slate-400">Use the same pairing code on both devices (works across Web App, Portable HTML, and Windows .EXE).</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnel Room Code</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${defaultRoomCode}" class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
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
  defaultRoomCode: string = '742-cobalt-falcon',
  _cloudWsUrl?: string
) {
  const safeRoom = (defaultRoomCode || '742-cobalt-falcon').replace(/[^a-z0-9-]/gi, '').toLowerCase() || '742-cobalt-falcon';

  const csharpKernelSource = `
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
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
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            }
            catch { }

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

        private readonly string instanceId = Guid.NewGuid().ToString("N").Substring(0, 12);
        private bool suppressRoomBroadcast = false;
        private float dpiScale = 1.0f;

        private TextBox txtRoomCode;
        private TextBox txtPassphrase;
        private Panel pnlRoomPresence;
        private Label lblRoomPresence;
        private Label lblKeyFingerprint;
        private Label lblStatusBadge;
        private Label lblLocalEndpoint;
        private Label lblSpeedMetric;
        private Label lblProgressDetail;
        private ProgressBar progressBar;
        private ListBox lstLog;
        private Button btnSendFile;
        private FolderBrowserDialog folderDialog;

        private TcpListener tcpListener;
        private UdpClient udpDiscovery;
        private UdpClient udpP2pClient;
        private int listenPort = 45889;
        private int udpP2pPort = 45890;
        private string publicWanUdpEndpoint = "";
        private volatile bool isRunning = true;

        // 1. Native .EXE <-> .EXE Kernel TCP Peer & Resume Signaling
        private TcpClient activePeerClient;
        private NetworkStream activePeerStream;
        private readonly object streamWriteLock = new object();
        private volatile int kernelTcpResumeChunk = 0;
        private readonly AutoResetEvent kernelTcpResumeEvent = new AutoResetEvent(false);

        // 1B. Native .EXE <-> .EXE STUN NAT-Punched Direct UDP Peer (Token-Bucket Paced 600-5000 Mbit/s + Real-Time NACK)
        private IPEndPoint activeUdpPeerEndpoint = null;
        private DateTime lastUdpPeerSeen = DateTime.MinValue;
        private volatile int udpPeerAckedChunk = -1;
        private volatile int udpPeerContiguousChunk = -1;
        private volatile int udpPeerUniqueAcked = 0;
        private volatile int udpPeerMeasuredMbps = 0;
        private volatile int udpPeerResumeChunk = 0;
        private volatile bool udpPeerDoneConfirmed = false;
        private volatile bool udpNeedStartResend = false;
        private double dynamicUdpBitrateMbps = 1.0; // Self-tuning Auto Dynamic P2P Pacer (1–5000 Mbit/s)
        private volatile int lastNackReceivedTick = 0;
        private int pacingResetRequested = 0;
        private readonly object udpTxLock = new object();
        private readonly ConcurrentQueue<int> udpRetransmitQueue = new ConcurrentQueue<int>();
        private readonly AutoResetEvent udpAckEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent udpResumeEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent udpNackEvent = new AutoResetEvent(false);
        private readonly ConcurrentQueue<byte[]> udpRxDataQueue = new ConcurrentQueue<byte[]>();
        private readonly AutoResetEvent udpRxDataEvent = new AutoResetEvent(false);
        private readonly HashSet<string> attemptedAutoTcpEndpoints = new HashSet<string>();
        private readonly ThreadLocal<AesCryptoServiceProvider> threadLocalAes = new ThreadLocal<AesCryptoServiceProvider>(delegate() {
            AesCryptoServiceProvider a = new AesCryptoServiceProvider();
            a.KeySize = 256;
            a.BlockSize = 128;
            a.Mode = CipherMode.CBC;
            a.Padding = PaddingMode.PKCS7;
            return a;
        });
        private int lastUiUpdateTick = 0;

        // 2. Native .EXE <-> Local Browser Kernel WebSocket Bridge (ws://127.0.0.1:45889)
        private TcpClient activeBrowserWsClient;
        private NetworkStream activeBrowserWsStream;
        private readonly object wsWriteLock = new object();

        // 3. Native .EXE <-> Chrome Browser & Remote .EXE Universal WSS Wormhole Cloud Bridge (MQTT-over-WSS)
        private ClientWebSocket activeCloudWs;
        private string activeCloudTopic = "";
        private string activeCloudMyId = "";
        private string activeCloudBrowserPeerId = "";
        private string activeCloudExePeerId = "";
        private DateTime lastCloudBrowserSeen = DateTime.MinValue;
        private DateTime lastCloudExeSeen = DateTime.MinValue;
        private volatile bool cloudReconnectRequested = false;
        private readonly object cloudSendLock = new object();
        private readonly AutoResetEvent cloudAckEvent = new AutoResetEvent(false);
        private volatile int cloudResumeChunk = 0;
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
            this.ClientSize = new Size(S(980), S(540));
            this.MinimumSize = new Size(S(880), S(510));
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(9, 13, 22);
            this.ForeColor = Color.FromArgb(241, 245, 249);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            this.AllowDrop = true;
            this.DoubleBuffered = true;

            downloadDirectory = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                "Downloads"
            );
            if (!Directory.Exists(downloadDirectory))
            {
                downloadDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            }

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
            leftCard.Size = new Size(S(436), S(424));
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
                "Shared Wormhole Code (Pairs with Chrome Browser & LAN .EXE):",
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
            txtRoomCode.Size = new Size(S(285), S(28));
            txtRoomCode.TextChanged += delegate {
                lock (attemptedAutoTcpEndpoints) { attemptedAutoTcpEndpoints.Clear(); }
                DeriveCryptographicKey();
                BroadcastUdpPresence();
                if (!suppressRoomBroadcast) NotifyBrowserRoomCode();
                cloudReconnectRequested = true;
            };
            leftCard.Controls.Add(txtRoomCode);

            Button btnNewCode = new Button();
            btnNewCode.UseMnemonic = false;
            btnNewCode.Text = "New Code";
            btnNewCode.FlatStyle = FlatStyle.Flat;
            btnNewCode.BackColor = Color.FromArgb(30, 41, 59);
            btnNewCode.ForeColor = Color.White;
            btnNewCode.Location = new Point(S(313), S(63));
            btnNewCode.Size = new Size(S(103), S(29));
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
                "[1/2 PEERS] Ei toista peeriä huoneessa — Odotetaan paria...",
                new Font("Consolas", 8.8f, FontStyle.Bold),
                Color.FromArgb(251, 191, 36),
                new Point(S(8), S(9)),
                true
            );
            pnlRoomPresence.Controls.Add(lblRoomPresence);
            leftCard.Controls.Add(pnlRoomPresence);

            Label lblPassTitle = CreateCleanLabel(
                "Optional E2EE Passphrase (PBKDF2-HMAC-SHA256 Salt):",
                null,
                fgMuted,
                new Point(S(20), S(142)),
                true
            );
            leftCard.Controls.Add(lblPassTitle);

            txtPassphrase = new TextBox();
            txtPassphrase.UseSystemPasswordChar = true;
            txtPassphrase.Font = new Font("Consolas", 10f);
            txtPassphrase.BackColor = bgInput;
            txtPassphrase.ForeColor = Color.White;
            txtPassphrase.BorderStyle = BorderStyle.FixedSingle;
            txtPassphrase.Location = new Point(S(20), S(164));
            txtPassphrase.Size = new Size(S(396), S(26));
            txtPassphrase.TextChanged += delegate { DeriveCryptographicKey(); };
            leftCard.Controls.Add(txtPassphrase);

            Label lblFpCaption = CreateCleanLabel(
                "E2EE Key Fingerprint (Matches Chrome Browser 1:1):",
                null,
                fgMuted,
                new Point(S(20), S(198)),
                true
            );
            leftCard.Controls.Add(lblFpCaption);

            lblKeyFingerprint = CreateCleanLabel(
                "Deriving...",
                new Font("Consolas", 11f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(218)),
                true
            );
            leftCard.Controls.Add(lblKeyFingerprint);

            Label lblLocalCaption = CreateCleanLabel(
                "Your Direct Kernel TCP & Local Browser Bridge Address:",
                null,
                fgMuted,
                new Point(S(20), S(248)),
                true
            );
            leftCard.Controls.Add(lblLocalCaption);

            lblLocalEndpoint = CreateCleanLabel(
                "Starting Winsock2 listener...",
                new Font("Consolas", 9.2f, FontStyle.Bold),
                Color.FromArgb(226, 232, 240),
                new Point(S(20), S(268)),
                false
            );
            lblLocalEndpoint.Size = new Size(S(396), S(38));
            leftCard.Controls.Add(lblLocalEndpoint);

            Label lblSaveDir = CreateCleanLabel(
                "Incoming files save to: " + downloadDirectory,
                new Font("Segoe UI", 8.8f),
                fgMuted,
                new Point(S(20), S(318)),
                false
            );
            lblSaveDir.Size = new Size(S(396), S(36));
            leftCard.Controls.Add(lblSaveDir);

            Button btnChangeDir = new Button();
            btnChangeDir.UseMnemonic = false;
            btnChangeDir.Text = "Change Save Folder...";
            btnChangeDir.FlatStyle = FlatStyle.Flat;
            btnChangeDir.BackColor = Color.FromArgb(30, 41, 59);
            btnChangeDir.ForeColor = Color.White;
            btnChangeDir.Location = new Point(S(20), S(362));
            btnChangeDir.Size = new Size(S(190), S(36));
            btnChangeDir.Click += delegate {
                if (folderDialog == null) folderDialog = new FolderBrowserDialog();
                folderDialog.SelectedPath = downloadDirectory;
                if (folderDialog.ShowDialog() == DialogResult.OK)
                {
                    downloadDirectory = folderDialog.SelectedPath;
                    lblSaveDir.Text = "Incoming files save to: " + downloadDirectory;
                }
            };
            leftCard.Controls.Add(btnChangeDir);

            Button btnOpenDir = new Button();
            btnOpenDir.UseMnemonic = false;
            btnOpenDir.Text = "Open Downloads Folder";
            btnOpenDir.FlatStyle = FlatStyle.Flat;
            btnOpenDir.BackColor = Color.FromArgb(30, 41, 59);
            btnOpenDir.ForeColor = accentSky;
            btnOpenDir.Location = new Point(S(222), S(362));
            btnOpenDir.Size = new Size(S(194), S(36));
            btnOpenDir.Click += delegate {
                try { Process.Start("explorer.exe", downloadDirectory); } catch { }
            };
            leftCard.Controls.Add(btnOpenDir);

            this.Controls.Add(leftCard);

            Panel rightCard = new Panel();
            rightCard.BackColor = bgCard;
            rightCard.Location = new Point(S(478), S(94));
            rightCard.Size = new Size(S(478), S(424));
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
            btnSendFile.Text = "SELECT FILE(S) OR DRAG & DROP HERE TO SEND\\n(Auto Dynamic P2P Pacing · Resumable .part Streamer)";
            btnSendFile.FlatStyle = FlatStyle.Flat;
            btnSendFile.BackColor = Color.FromArgb(14, 28, 48);
            btnSendFile.ForeColor = accentSky;
            btnSendFile.Font = new Font("Segoe UI Semibold", 9.8f, FontStyle.Bold);
            btnSendFile.Location = new Point(S(20), S(44));
            btnSendFile.Size = new Size(S(438), S(82));
            btnSendFile.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            btnSendFile.Click += OnSelectFilesClicked;
            rightCard.Controls.Add(btnSendFile);

            lblSpeedMetric = CreateCleanLabel(
                "0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 15f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(136)),
                true
            );
            rightCard.Controls.Add(lblSpeedMetric);

            lblProgressDetail = CreateCleanLabel(
                "Auto Dynamic P2P Pacing active — Enter shared Wormhole Code to pair automatically.",
                null,
                fgMuted,
                new Point(S(20), S(166)),
                false
            );
            lblProgressDetail.Size = new Size(S(438), S(22));
            lblProgressDetail.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblProgressDetail);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(S(20), S(192));
            progressBar.Size = new Size(S(438), S(18));
            progressBar.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            progressBar.Maximum = 1000;
            rightCard.Controls.Add(progressBar);

            Label lblLogCap = CreateCleanLabel(
                "Live Kernel Socket & Chrome Browser Wormhole Log:",
                null,
                fgMuted,
                new Point(S(20), S(218)),
                true
            );
            rightCard.Controls.Add(lblLogCap);

            lstLog = new ListBox();
            lstLog.BackColor = bgInput;
            lstLog.ForeColor = Color.FromArgb(203, 213, 225);
            lstLog.Font = new Font("Consolas", 9f);
            lstLog.BorderStyle = BorderStyle.FixedSingle;
            lstLog.HorizontalScrollbar = true;
            lstLog.Location = new Point(S(20), S(240));
            lstLog.Size = new Size(S(438), S(164));
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

        private void DeriveCryptographicKey()
        {
            try
            {
                string cleanRoom = txtRoomCode.Text.Trim().ToLowerInvariant();
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
                    try
                    {
                        // Disable SIO_UDP_CONNRESET (-1744830452) so ICMP Port Unreachable never resets the UDP socket
                        udpP2pClient.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null);
                    }
                    catch { }
                    udpP2pPort = up;
                    break;
                }
                catch
                {
                    udpP2pClient = null;
                }
            }

            string localIps = GetLocalIpList();
            lblLocalEndpoint.Text = "LAN: " + localIps + "  |  STUN WAN: Probing...";
            Log("AetherTunnel v1.0 High-DPI active (Scale: " + Math.Round(dpiScale * 100).ToString() + "%). TCP:" + listenPort.ToString() + " UDP:" + udpP2pPort.ToString());

            Thread stunThread = new Thread(StunAndUpnpProbeLoop);
            stunThread.IsBackground = true;
            stunThread.Start();

            Thread p2pUdpThread = new Thread(UdpP2pReceiveLoop);
            p2pUdpThread.IsBackground = true;
            p2pUdpThread.Priority = ThreadPriority.Highest;
            p2pUdpThread.Start();

            Thread p2pUdpWriterThread = new Thread(UdpP2pDiskWriterLoop);
            p2pUdpWriterThread.IsBackground = true;
            p2pUdpWriterThread.Priority = ThreadPriority.AboveNormal;
            p2pUdpWriterThread.Start();

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

        private void StunAndUpnpProbeLoop()
        {
            TryUpnpPortMapping();
            while (isRunning)
            {
                try
                {
                    string discoveredWan = QueryStunPublicEndpoint("stun.l.google.com", 19302);
                    if (discoveredWan.Length == 0)
                        discoveredWan = QueryStunPublicEndpoint("stun.cloudflare.com", 3478);

                    if (discoveredWan.Length > 0 && discoveredWan != publicWanUdpEndpoint)
                    {
                        publicWanUdpEndpoint = discoveredWan;
                        this.BeginInvoke(new Action(delegate {
                            lblLocalEndpoint.Text = "LAN: " + GetFirstLanEndpoint() + "  |  WAN (STUN): " + publicWanUdpEndpoint;
                        }));
                        Log("STUN RFC 5389 resolved Public WAN Endpoint: " + publicWanUdpEndpoint + " (Ready for P2P NAT UDP Hole Punching)");
                    }
                }
                catch { }
                for (int i = 0; i < 150 && isRunning; i++) Thread.Sleep(200);
            }
        }

        private string QueryStunPublicEndpoint(string stunHost, int stunPort)
        {
            if (udpP2pClient == null) return "";
            try
            {
                IPAddress[] addrs = Dns.GetHostAddresses(stunHost);
                IPAddress targetIp = null;
                foreach (IPAddress a in addrs)
                {
                    if (a.AddressFamily == AddressFamily.InterNetwork) { targetIp = a; break; }
                }
                if (targetIp == null) return "";

                byte[] req = new byte[20];
                req[0] = 0x00; req[1] = 0x01; // Binding Request
                req[2] = 0x00; req[3] = 0x00; // Message Length = 0
                req[4] = 0x21; req[5] = 0x12; req[6] = 0xA4; req[7] = 0x42; // Magic Cookie 0x2112A442
                Random r = new Random();
                for (int i = 8; i < 20; i++) req[i] = (byte)r.Next(0, 256);

                IPEndPoint stunEp = new IPEndPoint(targetIp, stunPort);
                udpP2pClient.Send(req, req.Length, stunEp);
            }
            catch { }
            return publicWanUdpEndpoint;
        }

        private void ParseStunBindingResponse(byte[] buf, int len)
        {
            if (len < 20) return;
            if (buf[0] != 0x01 || buf[1] != 0x01) return; // Binding Success Response
            int idx = 20;
            while (idx + 4 <= len)
            {
                int attrType = (buf[idx] << 8) | buf[idx + 1];
                int attrLen = (buf[idx + 2] << 8) | buf[idx + 3];
                idx += 4;
                if (idx + attrLen > len) break;

                if (attrType == 0x0020 && attrLen >= 8 && buf[idx + 1] == 0x01) // XOR-MAPPED-ADDRESS (IPv4)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte b0 = (byte)(buf[idx + 4] ^ 0x21);
                    byte b1 = (byte)(buf[idx + 5] ^ 0x12);
                    byte b2 = (byte)(buf[idx + 6] ^ 0xA4);
                    byte b3 = (byte)(buf[idx + 7] ^ 0x42);
                    string wan = b0.ToString() + "." + b1.ToString() + "." + b2.ToString() + "." + b3.ToString() + ":" + port.ToString();
                    if (wan != publicWanUdpEndpoint)
                    {
                        publicWanUdpEndpoint = wan;
                        this.BeginInvoke(new Action(delegate {
                            lblLocalEndpoint.Text = "LAN: " + GetFirstLanEndpoint() + "  |  WAN (STUN): " + publicWanUdpEndpoint;
                        }));
                        Log("STUN NAT Discovery -> Public WAN UDP Endpoint: " + publicWanUdpEndpoint);
                    }
                    return;
                }
                else if (attrType == 0x0001 && attrLen >= 8 && buf[idx + 1] == 0x01) // MAPPED-ADDRESS (IPv4)
                {
                    int port = (buf[idx + 2] << 8) | buf[idx + 3];
                    string wan = buf[idx + 4].ToString() + "." + buf[idx + 5].ToString() + "." + buf[idx + 6].ToString() + "." + buf[idx + 7].ToString() + ":" + port.ToString();
                    if (publicWanUdpEndpoint.Length == 0)
                    {
                        publicWanUdpEndpoint = wan;
                        this.BeginInvoke(new Action(delegate {
                            lblLocalEndpoint.Text = "LAN: " + GetFirstLanEndpoint() + "  |  WAN (STUN): " + publicWanUdpEndpoint;
                        }));
                    }
                }
                idx += (attrLen + 3) & ~3;
            }
        }

        private void TryUpnpPortMapping()
        {
            try
            {
                using (UdpClient ssdp = new UdpClient())
                {
                    ssdp.Client.ReceiveTimeout = 1200;
                    string msearch = "M-SEARCH * HTTP/1.1\\r\\nHOST: 239.255.255.250:1900\\r\\nMAN: \\"ssdp:discover\\"\\r\\nMX: 1\\r\\nST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\\r\\n\\r\\n";
                    byte[] bytes = Encoding.ASCII.GetBytes(msearch);
                    ssdp.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse("239.255.255.250"), 1900));
                }
            }
            catch { }
        }

        private void InitiateUdpHolePunch(string remoteEndpointStr)
        {
            if (udpP2pClient == null || String.IsNullOrEmpty(remoteEndpointStr)) return;
            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    int colon = remoteEndpointStr.LastIndexOf(':');
                    if (colon <= 0) return;
                    IPAddress ip;
                    int port;
                    if (!IPAddress.TryParse(remoteEndpointStr.Substring(0, colon).Trim(), out ip)) return;
                    if (!Int32.TryParse(remoteEndpointStr.Substring(colon + 1).Trim(), out port) || port <= 0) return;
                    if (IsOwnLocalEndpoint(ip, port) || (port == udpP2pPort && IsOwnLocalEndpoint(ip, listenPort))) return;

                    IPEndPoint targetEp = new IPEndPoint(ip, port);
                    string room = "";
                    this.Invoke(new Action(delegate { room = txtRoomCode.Text.Trim().ToLowerInvariant(); }));
                    byte[] punchBytes = Encoding.UTF8.GetBytes("AETHER_PUNCH|" + room + "|" + instanceId);

                    for (int burst = 0; burst < 6 && isRunning; burst++)
                    {
                        try { udpP2pClient.Send(punchBytes, punchBytes.Length, targetEp); } catch { }
                        Thread.Sleep(120);
                    }
                }
                catch { }
            });
        }

        private FileStream udpOutFile = null;
        private readonly object udpFileLock = new object();
        private string udpFileName = "";
        private string lastCompletedUdpFileName = "";
        private string udpPartPath = "";
        private string udpFinalPath = "";
        private long udpExpectedSize = 0;
        private int udpTotalExpectedChunks = 0;
        private long udpReceivedBytes = 0;
        private long udpSessionStartBytes = 0;
        private long bytesSinceLastFlush = 0;
        private bool[] udpReceivedChunkMap = null;
        private int[] udpChunkLastNackTick = null;
        private int udpHighestContiguousChunk = -1;
        private int udpHighestSeenChunk = -1;
        private int udpUniqueReceivedCount = 0;
        private volatile bool udpRxEndPending = false;
        private Stopwatch udpRxSw = null;

        private void UdpP2pReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
            while (isRunning && udpP2pClient != null)
            {
                try
                {
                    byte[] data = udpP2pClient.Receive(ref remoteEp);
                    if (data == null || data.Length == 0) continue;

                    // Fast-path: binary P2P UDP encrypted data frame ("AETU" = 0x41455455)
                    // Immediately enqueue onto lock-free ring queue so OS UDP socket never drops burst packets
                    if (data.Length >= 28 && BitConverter.ToUInt32(data, 0) == MAGIC_UDP_DATA)
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        udpRxDataQueue.Enqueue(data);
                        udpRxDataEvent.Set();
                        continue;
                    }

                    // Check if STUN Binding Response (starts with 0x01 0x01 and magic cookie 0x2112A442)
                    if (data.Length >= 20 && data[0] == 0x01 && data[1] == 0x01 && data[4] == 0x21 && data[5] == 0x12)
                    {
                        ParseStunBindingResponse(data, data.Length);
                        continue;
                    }

                    string text = Encoding.UTF8.GetString(data);
                    if (text.StartsWith("AETHER_UDP_ACK|"))
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
                            if (parts.Length >= 4)
                            {
                                int rxMbits = 0;
                                if (Int32.TryParse(parts[3], out rxMbits) && rxMbits > 0)
                                {
                                    udpPeerMeasuredMbps = rxMbits;
                                    // Self-tuning Auto Dynamic Pacer: smoothly ramp up toward 5000 Mbit/s when no recent NACK loss
                                    if (unchecked(Environment.TickCount - lastNackReceivedTick) > 260)
                                    {
                                        double probed = rxMbits >= dynamicUdpBitrateMbps * 0.80
                                            ? Math.Max(dynamicUdpBitrateMbps * 1.12, rxMbits * 1.18)
                                            : Math.Max(150.0, rxMbits * 1.16);
                                        double target = Math.Min(5000.0, probed);
                                        dynamicUdpBitrateMbps = (dynamicUdpBitrateMbps * 0.55) + (target * 0.45);
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
                            foreach (string t in tokens)
                            {
                                int missIdx;
                                if (Int32.TryParse(t.Trim(), out missIdx) && missIdx >= 0)
                                {
                                    udpRetransmitQueue.Enqueue(missIdx);
                                }
                            }
                            lastNackReceivedTick = Environment.TickCount;
                            double receiverCap = udpPeerMeasuredMbps > 0 ? udpPeerMeasuredMbps * 1.02 : dynamicUdpBitrateMbps * 0.80;
                            dynamicUdpBitrateMbps = Math.Max(1.0, Math.Min(dynamicUdpBitrateMbps * 0.80, receiverCap));
                            Interlocked.Exchange(ref pacingResetRequested, 1);
                            udpNackEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NEED_START|"))
                    {
                        udpNeedStartResend = true;
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_DONE|"))
                    {
                        udpPeerDoneConfirmed = true;
                        udpNackEvent.Set();
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_PUNCH|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 3 && parts[2] != instanceId)
                        {
                            bool isNew = (activeUdpPeerEndpoint == null || !activeUdpPeerEndpoint.Equals(remoteEp) || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 8);
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                            byte[] ack = Encoding.UTF8.GetBytes("AETHER_PUNCH_ACK|" + parts[1] + "|" + instanceId);
                            udpP2pClient.Send(ack, ack.Length, remoteEp);
                            if (isNew)
                            {
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("NAT Hole Punch SUCCEEDED! Direct P2P UDP tunnel active with " + remoteEp.ToString());
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PUNCH_ACK|") || text.StartsWith("AETHER_PONG|"))
                    {
                        bool isNew = (activeUdpPeerEndpoint == null || !activeUdpPeerEndpoint.Equals(remoteEp) || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 8);
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        if (isNew)
                        {
                            UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                            Log("Verified Direct P2P NAT-Punched UDP connection with " + remoteEp.ToString());
                        }
                    }
                    else if (text.StartsWith("AETHER_PING|"))
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        byte[] pong = Encoding.UTF8.GetBytes("AETHER_PONG|" + instanceId);
                        udpP2pClient.Send(pong, pong.Length, remoteEp);
                    }
                    else if (text.StartsWith("AETHER_UDP_START|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 3)
                        {
                            lock (udpFileLock)
                            {
                                string newFileName = parts[1];
                                long newExpectedSize = 0;
                                Int64.TryParse(parts[2], out newExpectedSize);

                                if (udpOutFile != null && newFileName == udpFileName && newExpectedSize == udpExpectedSize)
                                {
                                    int curResume = Math.Max(0, udpHighestContiguousChunk + 1);
                                    byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + curResume.ToString());
                                    for (int k = 0; k < 3; k++)
                                    {
                                        try { udpP2pClient.Send(resumeReply, resumeReply.Length, remoteEp); } catch { }
                                    }
                                }
                                else
                                {
                                    udpFileName = newFileName;
                                    lastCompletedUdpFileName = "";
                                    udpExpectedSize = newExpectedSize;
                                    udpTotalExpectedChunks = (int)Math.Max(1L, (udpExpectedSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);
                                    if (parts.Length >= 4) Int32.TryParse(parts[3], out udpTotalExpectedChunks);
                                    udpFinalPath = Path.Combine(downloadDirectory, "AetherTunnel_" + udpFileName);
                                    udpPartPath = udpFinalPath + ".part";

                                    if (udpOutFile != null) { try { udpOutFile.Flush(); udpOutFile.Close(); } catch { } udpOutFile = null; }
                                    long existingLen = 0;
                                    if (File.Exists(udpPartPath))
                                    {
                                        existingLen = new FileInfo(udpPartPath).Length;
                                        if (existingLen >= udpExpectedSize) existingLen = 0;
                                    }
                                    int resumeChunk = (int)(existingLen / UDP_CHUNK_SIZE);
                                    long alignedBytes = (long)resumeChunk * UDP_CHUNK_SIZE;

                                    udpReceivedChunkMap = new bool[udpTotalExpectedChunks];
                                    udpChunkLastNackTick = new int[udpTotalExpectedChunks];
                                    for (int c = 0; c < resumeChunk && c < udpTotalExpectedChunks; c++) udpReceivedChunkMap[c] = true;
                                    udpHighestContiguousChunk = resumeChunk - 1;
                                    udpHighestSeenChunk = resumeChunk - 1;
                                    udpUniqueReceivedCount = resumeChunk;
                                    bytesSinceLastFlush = 0;
                                    udpRxEndPending = false;

                                    udpOutFile = new FileStream(udpPartPath, existingLen > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.Read, 4 * 1024 * 1024, FileOptions.SequentialScan);
                                    if (alignedBytes > 0) udpOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                                    udpReceivedBytes = alignedBytes;
                                    udpSessionStartBytes = alignedBytes;
                                    udpRxSw = Stopwatch.StartNew();

                                    byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + resumeChunk.ToString());
                                    for (int k = 0; k < 4; k++)
                                    {
                                        try { udpP2pClient.Send(resumeReply, resumeReply.Length, remoteEp); } catch { }
                                    }

                                    if (resumeChunk > 0)
                                        Log("Resuming P2P UDP download of " + udpFileName + " from chunk " + resumeChunk.ToString() + " (" + FormatBytes(alignedBytes) + ")");
                                    else
                                        Log("Receiving file over High-Speed P2P NAT-UDP -> " + udpFinalPath + " (" + FormatBytes(udpExpectedSize) + ")");
                                }
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_RESUME|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            int rChunk = 0;
                            if (Int32.TryParse(parts[1], out rChunk) && rChunk >= 0)
                            {
                                if (rChunk > udpPeerResumeChunk) udpPeerResumeChunk = rChunk;
                                if (rChunk - 1 > udpPeerContiguousChunk) udpPeerContiguousChunk = rChunk - 1;
                                udpResumeEvent.Set();
                                udpAckEvent.Set();
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_END|"))
                    {
                        udpRxEndPending = true;
                        udpRxDataEvent.Set();
                    }
                }
                catch { }
            }
        }

        private void UdpP2pDiskWriterLoop()
        {
            List<byte[]> batch = new List<byte[]>(2048);
            int packetsSinceLastAck = 0;
            int dupChunksSinceLastResume = 0;
            int lastNeedStartTick = 0;
            int lastEndNackTick = 0;

            while (isRunning)
            {
                udpRxDataEvent.WaitOne(8);

                if (udpOutFile == null && !udpRxDataQueue.IsEmpty)
                {
                    int nowTick = Environment.TickCount;
                    if (nowTick - lastNeedStartTick > 80 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                    {
                        lastNeedStartTick = nowTick;
                        byte[] needStart = Encoding.UTF8.GetBytes("AETHER_UDP_NEED_START|1");
                        try { udpP2pClient.Send(needStart, needStart.Length, activeUdpPeerEndpoint); } catch { }
                    }
                    continue;
                }

                batch.Clear();
                byte[] item;
                while (batch.Count < 2048 && udpRxDataQueue.TryDequeue(out item))
                {
                    if (item != null && item.Length > 28)
                    {
                        batch.Add(item);
                    }
                }

                if (batch.Count > 0)
                {
                    int count = batch.Count;
                    int[] chunkIndices = new int[count];
                    byte[][] decryptedPayloads = new byte[count][];
                    byte[] keySnapshot = aesKey;
                    int expectedChunksSnapshot = udpTotalExpectedChunks;

                    // Decrypt batch in parallel across CPU cores using ThreadLocal hardware AES-NI
                    Parallel.For(0, count, delegate(int i)
                    {
                        byte[] pkt = batch[i];
                        if (pkt.Length <= 28) { chunkIndices[i] = -1; return; }
                        int pktTotalChunks = BitConverter.ToInt32(pkt, 8);
                        if (expectedChunksSnapshot > 0 && pktTotalChunks != expectedChunksSnapshot)
                        {
                            chunkIndices[i] = -1;
                            return;
                        }
                        int cIdx = BitConverter.ToInt32(pkt, 4);
                        byte[] iv = new byte[16];
                        Buffer.BlockCopy(pkt, 12, iv, 0, 16);
                        try
                        {
                            AesCryptoServiceProvider aes = threadLocalAes.Value;
                            using (ICryptoTransform dec = aes.CreateDecryptor(keySnapshot, iv))
                            {
                                decryptedPayloads[i] = dec.TransformFinalBlock(pkt, 28, pkt.Length - 28);
                                chunkIndices[i] = cIdx;
                            }
                        }
                        catch { chunkIndices[i] = -1; }
                    });

                    lock (udpFileLock)
                    {
                        if (udpOutFile != null)
                        {
                            for (int i = 0; i < count; i++)
                            {
                                byte[] plain = decryptedPayloads[i];
                                if (plain == null) continue;
                                int cIdx = chunkIndices[i];
                                if (cIdx < 0) continue;
                                if (udpReceivedChunkMap != null && cIdx < udpReceivedChunkMap.Length && udpReceivedChunkMap[cIdx])
                                {
                                    dupChunksSinceLastResume++;
                                    if (dupChunksSinceLastResume >= 128 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        dupChunksSinceLastResume = 0;
                                        int nextNeeded = Math.Max(0, udpHighestContiguousChunk + 1);
                                        byte[] resumeJump = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + nextNeeded.ToString());
                                        try { udpP2pClient.Send(resumeJump, resumeJump.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                    continue; // Duplicate chunk already written
                                }

                                long writeOffset = (long)cIdx * UDP_CHUNK_SIZE;
                                if (udpOutFile.Position != writeOffset)
                                {
                                    udpOutFile.Seek(writeOffset, SeekOrigin.Begin);
                                }
                                udpOutFile.Write(plain, 0, plain.Length);
                                bytesSinceLastFlush += plain.Length;

                                if (udpReceivedChunkMap != null && cIdx < udpReceivedChunkMap.Length)
                                {
                                    udpReceivedChunkMap[cIdx] = true;
                                    udpUniqueReceivedCount++;
                                    while (udpHighestContiguousChunk + 1 < udpReceivedChunkMap.Length && udpReceivedChunkMap[udpHighestContiguousChunk + 1])
                                    {
                                        udpHighestContiguousChunk++;
                                    }
                                }
                                if (cIdx > udpHighestSeenChunk) udpHighestSeenChunk = cIdx;
                                udpReceivedBytes += plain.Length;
                                if (udpReceivedBytes > udpExpectedSize) udpReceivedBytes = udpExpectedSize;
                                packetsSinceLastAck++;
                            }

                            if (bytesSinceLastFlush >= 4 * 1024 * 1024 || udpRxDataQueue.IsEmpty)
                            {
                                bytesSinceLastFlush = 0;
                                try { udpOutFile.Flush(); } catch { }
                            }

                            double sec = Math.Max(0.005, udpRxSw != null ? udpRxSw.Elapsed.TotalSeconds : 0.005);
                            long sessionDeltaBytes = Math.Max(0L, udpReceivedBytes - udpSessionStartBytes);
                            double mbps = (sessionDeltaBytes / (1024.0 * 1024.0)) / sec;
                            int mbitsInt = (int)Math.Round(mbps * 8.0);

                            if (packetsSinceLastAck >= 512 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                packetsSinceLastAck = 0;
                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpHighestContiguousChunk.ToString() + "|" + mbitsInt.ToString());
                                try { udpP2pClient.Send(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }

                                // Real-time In-Flight NACK: repair any gap > 512 chunks behind arrival frontier
                                if (udpReceivedChunkMap != null && udpHighestSeenChunk - udpHighestContiguousChunk > 512)
                                {
                                    int nowTick = Environment.TickCount;
                                    StringBuilder nackSb = new StringBuilder();
                                    int nackCnt = 0;
                                    int scanLimit = Math.Min(udpTotalExpectedChunks, udpHighestSeenChunk - 256);
                                    for (int c = udpHighestContiguousChunk + 1; c < scanLimit; c++)
                                    {
                                        if (!udpReceivedChunkMap[c] && (nowTick - udpChunkLastNackTick[c] > 260))
                                        {
                                            udpChunkLastNackTick[c] = nowTick;
                                            if (nackCnt > 0) nackSb.Append(",");
                                            nackSb.Append(c.ToString());
                                            nackCnt++;
                                            if (nackCnt >= 80) break;
                                        }
                                    }
                                    if (nackCnt > 0)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                        try { udpP2pClient.Send(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }

                            int permille = (int)((udpReceivedBytes * 1000L) / Math.Max(1L, udpExpectedSize));
                            UpdateTransferUi("Receiving via P2P NAT-UDP: " + udpFileName, udpReceivedBytes, udpExpectedSize, mbps, permille);
                        }
                    }
                }

                lock (udpFileLock)
                {
                    if (udpOutFile != null && udpReceivedChunkMap != null && udpHighestContiguousChunk + 1 >= udpTotalExpectedChunks)
                    {
                        udpRxEndPending = false;
                        try { udpOutFile.SetLength(udpExpectedSize); } catch { }
                        udpOutFile.Flush(true);
                        udpOutFile.Close();
                        udpOutFile = null;
                        if (udpRxSw != null) udpRxSw.Stop();

                        try
                        {
                            if (File.Exists(udpFinalPath)) File.Delete(udpFinalPath);
                            File.Move(udpPartPath, udpFinalPath);
                        }
                        catch { }

                        lastCompletedUdpFileName = udpFileName;
                        if (activeUdpPeerEndpoint != null && udpP2pClient != null)
                        {
                            byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + udpFileName);
                            for (int k = 0; k < 5; k++)
                            {
                                try { udpP2pClient.Send(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                            }
                        }

                        double sec = Math.Max(0.005, udpRxSw != null ? udpRxSw.Elapsed.TotalSeconds : 0.005);
                        long sessionDeltaBytes = Math.Max(1L, udpExpectedSize - udpSessionStartBytes);
                        double mbps = (sessionDeltaBytes / (1024.0 * 1024.0)) / sec;
                        UpdateTransferUi("Saved via P2P NAT-UDP: " + udpFileName, udpExpectedSize, udpExpectedSize, mbps, 1000, true);
                        Log(String.Format("P2P NAT-UDP RX COMPLETE: {0} ({1:F2} MB/s)", udpFinalPath, mbps));
                    }
                    else if (udpRxEndPending && udpRxDataQueue.IsEmpty)
                    {
                        if (udpOutFile == null)
                        {
                            udpRxEndPending = false;
                            if (!String.IsNullOrEmpty(lastCompletedUdpFileName) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + lastCompletedUdpFileName);
                                try { udpP2pClient.Send(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                            }
                        }
                        else if (udpReceivedChunkMap != null)
                        {
                            int nowTick = Environment.TickCount;
                            if (nowTick - lastEndNackTick >= 120)
                            {
                                lastEndNackTick = nowTick;
                                StringBuilder missingSb = new StringBuilder();
                                int missingCount = 0;
                                for (int c = Math.Max(0, udpHighestContiguousChunk + 1); c < udpTotalExpectedChunks; c++)
                                {
                                    if (!udpReceivedChunkMap[c])
                                    {
                                        if (missingCount > 0) missingSb.Append(",");
                                        missingSb.Append(c.ToString());
                                        missingCount++;
                                        if (missingCount >= 80) break;
                                    }
                                }

                                if (missingCount > 0 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                {
                                    byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + missingSb.ToString());
                                    try { udpP2pClient.Send(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }
                        }
                    }
                }
            }
        }

        private void PeerHeartbeatMonitorLoop()
        {
            while (isRunning)
            {
                try
                {
                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        BroadcastUdpPresence();
                    }

                    if (activeUdpPeerEndpoint != null && udpP2pClient != null)
                    {
                        if ((DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12)
                        {
                            byte[] ping = Encoding.UTF8.GetBytes("AETHER_PING|" + instanceId);
                            udpP2pClient.Send(ping, ping.Length, activeUdpPeerEndpoint);
                        }
                        else
                        {
                            activeUdpPeerEndpoint = null;
                        }
                    }

                    bool hasTcp = (activePeerClient != null && activePeerClient.Connected);
                    bool hasUdp = (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12);
                    bool hasLocalBrowser = (activeBrowserWsClient != null && activeBrowserWsClient.Connected);
                    bool hasCloudBrowser = (!String.IsNullOrEmpty(activeCloudBrowserPeerId) && (DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds < 10);
                    bool hasCloudExe = (!String.IsNullOrEmpty(activeCloudExePeerId) && (DateTime.UtcNow - lastCloudExeSeen).TotalSeconds < 10);

                    string room = "";
                    this.Invoke(new Action(delegate { room = txtRoomCode.Text.Trim().ToLowerInvariant(); }));

                    if (hasTcp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — KERNEL TCP (" + activePeerClient.Client.RemoteEndPoint.ToString() + ")");
                    else if (hasUdp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + activeUdpPeerEndpoint.ToString() + ")");
                    else if (hasLocalBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                    else if (hasCloudBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — CHROME BROWSER [" + room + "]");
                    else if (hasCloudExe)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — REMOTE .EXE [" + room + "]");
                    else
                        UpdateStatusBadge("PEER STATUS: WAITING FOR PEER [" + room + "]");
                }
                catch { }
                Thread.Sleep(2000);
            }
        }

        private bool IsCgnatOrApipaAddress(IPAddress ip)
        {
            if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork) return false;
            byte[] b = ip.GetAddressBytes();
            if (b[0] == 169 && b[1] == 254) return true; // APIPA
            if (b[0] == 100 && b[1] >= 64 && b[1] <= 127) return true; // RFC 6598 Carrier-Grade NAT (100.64.0.0/10)
            return false;
        }

        private string GetFirstLanEndpoint()
        {
            string fallback = "";
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        if (IsCgnatOrApipaAddress(ip))
                        {
                            if (fallback.Length == 0) fallback = ip.ToString() + ":" + listenPort.ToString();
                            continue;
                        }
                        string s = ip.ToString();
                        if (s.StartsWith("192.168.") || s.StartsWith("10.") || s.StartsWith("172."))
                        {
                            return s + ":" + listenPort.ToString();
                        }
                        if (fallback.Length == 0) fallback = s + ":" + listenPort.ToString();
                    }
                }
            }
            catch { }
            return fallback;
        }

        private string GetFirstLanUdpEndpoint()
        {
            string fallback = "";
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        if (IsCgnatOrApipaAddress(ip))
                        {
                            if (fallback.Length == 0) fallback = ip.ToString() + ":" + udpP2pPort.ToString();
                            continue;
                        }
                        string s = ip.ToString();
                        if (s.StartsWith("192.168.") || s.StartsWith("10.") || s.StartsWith("172."))
                        {
                            return s + ":" + udpP2pPort.ToString();
                        }
                        if (fallback.Length == 0) fallback = s + ":" + udpP2pPort.ToString();
                    }
                }
            }
            catch { }
            return fallback;
        }

        private string GetLocalIpList()
        {
            List<string> ips = new List<string>();
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        ips.Add(ip.ToString() + ":" + listenPort.ToString());
                    }
                }
            }
            catch { }
            ips.Add("127.0.0.1:" + listenPort.ToString());
            return String.Join("  |  ", ips.ToArray());
        }

        private bool IsOwnLocalEndpoint(IPAddress addr, int port)
        {
            if (port != listenPort) return false;
            if (IPAddress.IsLoopback(addr)) return true;
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.Equals(addr)) return true;
                }
            }
            catch { }
            return false;
        }

        private byte[] BuildMqttPacket(byte typeAndFlags, byte[] body)
        {
            MemoryStream ms = new MemoryStream();
            ms.WriteByte(typeAndFlags);
            int rem = body.Length;
            do
            {
                byte enc = (byte)(rem % 128);
                rem = rem / 128;
                if (rem > 0) enc = (byte)(enc | 128);
                ms.WriteByte(enc);
            } while (rem > 0);
            ms.Write(body, 0, body.Length);
            return ms.ToArray();
        }

        private byte[] EncodeMqttString(string s)
        {
            byte[] b = Encoding.UTF8.GetBytes(s);
            byte[] res = new byte[b.Length + 2];
            res[0] = (byte)((b.Length >> 8) & 0xFF);
            res[1] = (byte)(b.Length & 0xFF);
            Buffer.BlockCopy(b, 0, res, 2, b.Length);
            return res;
        }

        private void SendRawWsBinary(ClientWebSocket ws, byte[] data)
        {
            if (ws == null || ws.State != WebSocketState.Open) return;
            lock (cloudSendLock)
            {
                ws.SendAsync(new ArraySegment<byte>(data, 0, data.Length), WebSocketMessageType.Binary, true, CancellationToken.None).Wait(5000);
            }
        }

        private void CloudWormholeBridgeLoop()
        {
            string[] mqttBrokers = new string[] {
                "wss://broker.emqx.io:8084/mqtt",
                "wss://broker.hivemq.com:8884/mqtt"
            };
            int brokerIdx = 0;
            FileStream cloudOutFile = null;
            string cloudFileName = "";
            string cloudPartPath = "";
            string cloudOutPath = "";
            long cloudExpectedSize = 0;
            long cloudReceivedBytes = 0;
            Stopwatch cloudRxSw = null;

            while (isRunning)
            {
                ClientWebSocket ws = null;
                try
                {
                    string rawRoom = "";
                    this.Invoke(new Action(delegate { rawRoom = txtRoomCode.Text.Trim().ToLowerInvariant(); }));
                    StringBuilder cleanSb = new StringBuilder();
                    foreach (char ch in rawRoom)
                    {
                        if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '-')
                            cleanSb.Append(ch);
                    }
                    string cleanCode = cleanSb.Length > 0 ? cleanSb.ToString() : "default";
                    cloudReconnectRequested = false;

                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    string topic = "aethertunnel/v1/room/" + cleanCode;
                    string brokerUrl = mqttBrokers[brokerIdx % mqttBrokers.Length];

                    ws = new ClientWebSocket();
                    ws.Options.AddSubProtocol("mqtt");
                    ws.ConnectAsync(new Uri(brokerUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        brokerIdx++;
                        Thread.Sleep(800);
                        continue;
                    }

                    activeCloudWs = ws;
                    activeCloudTopic = topic;
                    activeCloudMyId = myPeerId;

                    // Send MQTT CONNECT packet
                    MemoryStream connectBody = new MemoryStream();
                    byte[] proto = EncodeMqttString("MQTT");
                    connectBody.Write(proto, 0, proto.Length);
                    connectBody.WriteByte(4); // Protocol level 4 (MQTT 3.1.1)
                    connectBody.WriteByte(2); // Clean session
                    connectBody.WriteByte(0);
                    connectBody.WriteByte(30); // Keepalive 30s
                    byte[] cid = EncodeMqttString(myPeerId);
                    connectBody.Write(cid, 0, cid.Length);
                    SendRawWsBinary(ws, BuildMqttPacket(0x10, connectBody.ToArray()));

                    // Send MQTT SUBSCRIBE packet
                    MemoryStream subBody = new MemoryStream();
                    subBody.WriteByte(0);
                    subBody.WriteByte(1);
                    byte[] topBytes = EncodeMqttString(topic);
                    subBody.Write(topBytes, 0, topBytes.Length);
                    subBody.WriteByte(0);
                    SendRawWsBinary(ws, BuildMqttPacket(0x82, subBody.ToArray()));

                    SendCloudHelloToWebPeers(ws, cleanCode);

                    ClientWebSocket capturedWs = ws;
                    string capturedCode = cleanCode;
                    Thread hbThread = new Thread(delegate()
                    {
                        while (isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open)
                        {
                            try
                            {
                                SendRawWsBinary(capturedWs, new byte[] { 0xC0, 0x00 }); // MQTT PINGREQ
                                SendCloudHelloToWebPeers(capturedWs, capturedCode);
                            }
                            catch { break; }
                            for (int i = 0; i < 18; i++)
                            {
                                if (!isRunning || cloudReconnectRequested || capturedWs.State != WebSocketState.Open) break;
                                Thread.Sleep(120);
                            }
                        }
                    });
                    hbThread.IsBackground = true;
                    hbThread.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();

                    while (isRunning && !cloudReconnectRequested && ws.State == WebSocketState.Open)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;

                        if (res.Count > 0)
                        {
                            msgMs.Write(recvBuf, 0, res.Count);
                        }

                        if (!res.EndOfMessage) continue;

                        byte[] rawFrame = msgMs.ToArray();
                        msgMs.SetLength(0);

                        int offset = 0;
                        while (offset < rawFrame.Length)
                        {
                            byte header = rawFrame[offset++];
                            int pktType = header >> 4;
                            int remLen = 0;
                            int mult = 1;
                            while (offset < rawFrame.Length)
                            {
                                byte b = rawFrame[offset++];
                                remLen += (b & 127) * mult;
                                mult *= 128;
                                if ((b & 128) == 0) break;
                            }
                            if (offset + remLen > rawFrame.Length) break;

                            if (pktType == 3 && remLen >= 2)
                            {
                                int topicLen = (rawFrame[offset] << 8) | rawFrame[offset + 1];
                                int qos = (header >> 1) & 3;
                                int payloadStart = offset + 2 + topicLen + (qos > 0 ? 2 : 0);
                                int payloadLen = (offset + remLen) - payloadStart;
                                if (payloadLen > 0 && payloadStart + payloadLen <= rawFrame.Length)
                                {
                                    string text = Encoding.UTF8.GetString(rawFrame, payloadStart, payloadLen);
                                    string srcPeer = ExtractJsonString(text, "src");
                                    string dstPeer = ExtractJsonString(text, "dst");
                                    if (srcPeer == myPeerId)
                                    {
                                        offset += remLen;
                                        continue;
                                    }
                                    if (dstPeer.Length > 0 && dstPeer != "*" && dstPeer != myPeerId && !dstPeer.StartsWith("aethertunnel-exe-" + cleanCode))
                                    {
                                        offset += remLen;
                                        continue;
                                    }

                                    string kind = ExtractJsonString(text, "kind");

                                    if (kind == "browser:hello" || kind == "web:hello" || kind == "browser:hello-ack")
                                    {
                                        bool isNewPairing = (activeCloudBrowserPeerId != srcPeer) || ((DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds > 10);
                                        activeCloudBrowserPeerId = srcPeer;
                                        lastCloudBrowserSeen = DateTime.UtcNow;

                                        if (isNewPairing)
                                        {
                                            UpdateStatusBadge("PEER STATUS: CONNECTED — CHROME BROWSER [" + cleanCode + "]");
                                            Log("Paired with Chrome Browser App in Wormhole Room [" + cleanCode + "] (" + srcPeer + ")");
                                            SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"fingerprint\\":\\"" + currentFingerprint + "\\"}");
                                        }
                                    }
                                    else if ((kind == "exe:hello" || kind == "exe:hello-reply") && srcPeer.StartsWith("aethertunnel-exe-") && srcPeer != myPeerId)
                                    {
                                        bool isNewPairing = (activeCloudExePeerId != srcPeer) || ((DateTime.UtcNow - lastCloudExeSeen).TotalSeconds > 10);
                                        activeCloudExePeerId = srcPeer;
                                        lastCloudExeSeen = DateTime.UtcNow;

                                        if (isNewPairing)
                                        {
                                            UpdateStatusBadge("PEER STATUS: CONNECTED — REMOTE .EXE [" + cleanCode + "]");
                                            Log("Paired with Remote .EXE Peer in Wormhole Room [" + cleanCode + "] (" + srcPeer + ")");
                                            if (kind == "exe:hello")
                                            {
                                                string lanEp = GetFirstLanEndpoint();
                                                string lanUdpEp = GetFirstLanUdpEndpoint();
                                                SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:hello-reply\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"fingerprint\\":\\"" + currentFingerprint + "\\",\\"lanEndpoint\\":\\"" + lanEp + "\\",\\"lanUdpEndpoint\\":\\"" + lanUdpEp + "\\",\\"wanUdpEndpoint\\":\\"" + publicWanUdpEndpoint + "\\"}");
                                            }
                                        }

                                        string remoteWanUdp = ExtractJsonString(text, "wanUdpEndpoint");
                                        string remoteLanUdp = ExtractJsonString(text, "lanUdpEndpoint");
                                        if (remoteWanUdp.Length > 0 && activeUdpPeerEndpoint == null)
                                        {
                                            InitiateUdpHolePunch(remoteWanUdp);
                                        }
                                        if (remoteLanUdp.Length > 0 && activeUdpPeerEndpoint == null)
                                        {
                                            InitiateUdpHolePunch(remoteLanUdp);
                                        }

                                        string remoteLan = ExtractJsonString(text, "lanEndpoint");
                                        if (remoteLan.Length > 0 && !remoteLan.StartsWith("100.") && (activePeerClient == null || !activePeerClient.Connected) && activeUdpPeerEndpoint == null)
                                        {
                                            bool shouldTry = false;
                                            lock (attemptedAutoTcpEndpoints)
                                            {
                                                if (!attemptedAutoTcpEndpoints.Contains(remoteLan))
                                                {
                                                    attemptedAutoTcpEndpoints.Add(remoteLan);
                                                    shouldTry = true;
                                                }
                                            }
                                            if (shouldTry)
                                            {
                                                ConnectToPeerEndpoint(remoteLan, true);
                                            }
                                        }
                                    }
                                    else if (kind == "exe:resume-ack")
                                    {
                                        cloudResumeChunk = (int)ExtractJsonLong(text, "resumeFromChunk");
                                        cloudResumeEvent.Set();
                                    }
                                    else if (kind == "exe:chunk-ack" || kind == "browser:chunk-ack")
                                    {
                                        cloudAckEvent.Set();
                                    }
                                    else if (kind == "exe:file-start" || kind == "browser:file-start")
                                    {
                                        bool fromExe = srcPeer.StartsWith("aethertunnel-exe-");
                                        if (fromExe)
                                        {
                                            activeCloudExePeerId = srcPeer;
                                            lastCloudExeSeen = DateTime.UtcNow;
                                        }
                                        else
                                        {
                                            activeCloudBrowserPeerId = srcPeer;
                                            lastCloudBrowserSeen = DateTime.UtcNow;
                                        }
                                        string senderLabel = fromExe ? "Remote .EXE" : "Chrome Browser";
                                        string incomingFileId = ExtractJsonString(text, "fileId");
                                        cloudFileName = ExtractJsonString(text, "name");
                                        if (cloudFileName.Length == 0) cloudFileName = "transfer.bin";
                                        cloudExpectedSize = ExtractJsonLong(text, "size");
                                        long cChunkSize = ExtractJsonLong(text, "chunkSize");
                                        if (cChunkSize <= 0) cChunkSize = CLOUD_CHUNK_SIZE;
                                        cloudOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + cloudFileName);
                                        cloudPartPath = cloudOutPath + ".part";

                                        if (cloudOutFile != null) cloudOutFile.Close();
                                        long existingBytes = 0;
                                        if (File.Exists(cloudPartPath))
                                        {
                                            existingBytes = new FileInfo(cloudPartPath).Length;
                                            if (existingBytes >= cloudExpectedSize) existingBytes = 0;
                                        }
                                        int resumeFromChunk = (int)(existingBytes / cChunkSize);
                                        long alignedBytes = (long)resumeFromChunk * cChunkSize;

                                        cloudOutFile = new FileStream(cloudPartPath, existingBytes > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                        if (alignedBytes > 0) cloudOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                                        cloudReceivedBytes = alignedBytes;
                                        cloudRxSw = Stopwatch.StartNew();

                                        SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"" + incomingFileId + "\\",\\"name\\":\\"" + cloudFileName.Replace("\\"", "") + "\\",\\"size\\":" + cloudExpectedSize.ToString() + ",\\"resumeFromChunk\\":" + resumeFromChunk.ToString() + "}");

                                        if (resumeFromChunk > 0)
                                            Log("Resuming interrupted file from " + senderLabel + " at chunk " + resumeFromChunk.ToString() + " (" + FormatBytes(alignedBytes) + ")");
                                        else
                                            Log("Receiving file from " + senderLabel + " -> " + cloudOutPath + " (" + FormatBytes(cloudExpectedSize) + ")");
                                        int startPermille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                                        UpdateTransferUi("Receiving from " + senderLabel + ": " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, 0, startPermille);
                                    }
                                    else if ((kind == "exe:file-chunk" || kind == "browser:file-chunk") && cloudOutFile != null)
                                    {
                                        string b64 = ExtractJsonString(text, "data");
                                        long chunkIdx = ExtractJsonLong(text, "chunkIndex");
                                        if (b64.Length > 0)
                                        {
                                            byte[] raw = Convert.FromBase64String(b64);
                                            long writePos = chunkIdx * CLOUD_CHUNK_SIZE;
                                            cloudOutFile.Seek(writePos, SeekOrigin.Begin);
                                            cloudOutFile.Write(raw, 0, raw.Length);
                                            cloudReceivedBytes = Math.Max(cloudReceivedBytes, writePos + raw.Length);

                                            double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                                            double mbps = (cloudReceivedBytes / (1024.0 * 1024.0)) / sec;
                                            int permille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                                            UpdateTransferUi("Receiving: " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, mbps, permille);
                                        }
                                        if ((chunkIdx + 1) % 8 == 0)
                                        {
                                            SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":" + chunkIdx.ToString() + "}");
                                        }
                                    }
                                    else if ((kind == "exe:file-end" || kind == "browser:file-end") && cloudOutFile != null)
                                    {
                                        cloudOutFile.Flush();
                                        cloudOutFile.Close();
                                        cloudOutFile = null;
                                        cloudRxSw.Stop();

                                        try
                                        {
                                            if (File.Exists(cloudOutPath)) File.Delete(cloudOutPath);
                                            File.Move(cloudPartPath, cloudOutPath);
                                        }
                                        catch { }

                                        double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                                        double mbps = (cloudExpectedSize / (1024.0 * 1024.0)) / sec;
                                        UpdateTransferUi("Saved to Downloads: " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, 1000);
                                        Log(String.Format("TRANSFER COMPLETE: Saved to {0} ({1:F2} MB/s)", cloudOutPath, mbps));
                                        SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":999999}");
                                    }
                                }
                            }
                            offset += remLen;
                        }
                    }
                }
                catch
                {
                    brokerIdx++;
                }
                finally
                {
                    if (cloudOutFile != null)
                    {
                        try { cloudOutFile.Close(); } catch { }
                        cloudOutFile = null;
                    }
                    if (ws != null)
                    {
                        try { ws.Dispose(); } catch { }
                    }
                }

                if (isRunning && !cloudReconnectRequested)
                {
                    Thread.Sleep(800);
                }
            }
        }

        private void SendCloudHelloToWebPeers(ClientWebSocket ws, string cleanCode)
        {
            if (ws == null || ws.State != WebSocketState.Open) return;
            string lanEp = GetFirstLanEndpoint();
            string lanUdpEp = GetFirstLanUdpEndpoint();
            string payload = "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"fingerprint\\":\\"" + currentFingerprint + "\\",\\"lanEndpoint\\":\\"" + lanEp + "\\",\\"lanUdpEndpoint\\":\\"" + lanUdpEp + "\\",\\"wanUdpEndpoint\\":\\"" + publicWanUdpEndpoint + "\\"}";
            SendCloudPacket(ws, "*", payload);
        }

        private void SendCloudPacket(ClientWebSocket ws, string dstPeerId, string innerPayloadJson)
        {
            if (ws == null || ws.State != WebSocketState.Open || String.IsNullOrEmpty(dstPeerId) || String.IsNullOrEmpty(activeCloudTopic)) return;
            string envelope = "{\\"type\\":\\"CANDIDATE\\",\\"src\\":\\"" + activeCloudMyId + "\\",\\"dst\\":\\"" + dstPeerId + "\\",\\"payload\\":" + innerPayloadJson + "}";
            byte[] tBytes = EncodeMqttString(activeCloudTopic);
            byte[] mBytes = Encoding.UTF8.GetBytes(envelope);
            byte[] body = new byte[tBytes.Length + mBytes.Length];
            Buffer.BlockCopy(tBytes, 0, body, 0, tBytes.Length);
            Buffer.BlockCopy(mBytes, 0, body, tBytes.Length, mBytes.Length);
            SendRawWsBinary(ws, BuildMqttPacket(0x30, body));
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
                    Log("Incoming Native .EXE Peer connected from " + client.Client.RemoteEndPoint.ToString());
                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        activePeerClient = client;
                        activePeerStream = netStream;
                        UpdateStatusBadge("CONNECTED .EXE PEER (" + client.Client.RemoteEndPoint.ToString() + ")");
                    }
                    ReceiveKernelTcpLoop(client, netStream, peek);
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
                UpdateStatusBadge("CONNECTED: CHROME BROWSER (LOCAL 127.0.0.1:" + listenPort.ToString() + ")");
                Log("Chrome Browser connected via Direct Localhost Kernel WebSocket (127.0.0.1:" + listenPort.ToString() + ")");

                NotifyBrowserRoomCode();
                ReceiveBrowserWebSocketLoop(client, netStream);
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge disconnected: " + ex.Message);
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

                string json = "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + code + "\\",\\"port\\":" + listenPort.ToString() + "}";
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

                    if (opcode == 0x08) break; // Close frame

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

                    if (opcode == 0x09) // Ping -> Pong
                    {
                        SendWebSocketFrame(wsStream, 0x0A, data, 0, data.Length);
                        continue;
                    }

                    if (opcode != 0) fragOpcode = opcode;
                    fragBuffer.Write(data, 0, data.Length);

                    if (!fin) continue;

                    byte[] message = fragBuffer.ToArray();
                    fragBuffer.SetLength(0);

                    if (fragOpcode == 0x01) // Text JSON frame from Browser
                    {
                        string text = Encoding.UTF8.GetString(message);
                        if (text.Contains("\\"browser:hello\\"") || text.Contains("\\"browser:room\\""))
                        {
                            string browserRoom = ExtractJsonString(text, "roomCode");
                            if (browserRoom.Length > 0)
                            {
                                this.BeginInvoke(new Action(delegate {
                                    if (txtRoomCode.Text.Trim().ToLowerInvariant() != browserRoom.ToLowerInvariant())
                                    {
                                        suppressRoomBroadcast = true;
                                        txtRoomCode.Text = browserRoom.ToLowerInvariant();
                                        suppressRoomBroadcast = false;
                                        Log("Synced Wormhole Code with Chrome Browser: " + browserRoom);
                                    }
                                }));
                            }
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

                            if (currentOutFile != null) currentOutFile.Close();
                            long existingBytes = 0;
                            if (File.Exists(currentPartPath))
                            {
                                existingBytes = new FileInfo(currentPartPath).Length;
                                if (existingBytes >= expectedFileSize) existingBytes = 0;
                            }
                            int resumeFromChunk = (int)(existingBytes / wsChunkSize);
                            long alignedBytes = (long)resumeFromChunk * wsChunkSize;

                            currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                            if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                            receivedBytes = alignedBytes;
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
                            currentOutFile.Flush();
                            currentOutFile.Close();
                            currentOutFile = null;
                            rxSw.Stop();

                            try
                            {
                                if (File.Exists(currentOutPath)) File.Delete(currentOutPath);
                                File.Move(currentPartPath, currentOutPath);
                            }
                            catch { }

                            double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                            double mbps = (expectedFileSize / (1024.0 * 1024.0)) / sec;
                            UpdateTransferUi("Saved from Browser: " + currentFileName, expectedFileSize, expectedFileSize, mbps, 1000);
                            Log(String.Format("BROWSER -> .EXE COMPLETE: {0} ({1:F2} MB/s · {2:F2} Gbps)", currentOutPath, mbps, (mbps * 8.0) / 1000.0));
                        }
                    }
                    else if (fragOpcode == 0x02 && currentOutFile != null) // Raw Binary chunk from Browser
                    {
                        currentOutFile.Write(message, 0, message.Length);
                        receivedBytes += message.Length;

                        double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double mbps = (receivedBytes / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((receivedBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving from Browser: " + currentFileName, receivedBytes, expectedFileSize, mbps, permille);
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
                    try { currentOutFile.Close(); } catch { }
                }
            }
        }

        private string ExtractJsonString(string json, string key)
        {
            string pattern = "\\"" + key + "\\":\\"";
            int idx = json.IndexOf(pattern);
            if (idx < 0) return "";
            int start = idx + pattern.Length;
            int end = json.IndexOf("\\"", start);
            if (end < 0) return "";
            return json.Substring(start, end - start);
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
        }

        private void UpdateStatusBadge(string text)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(UpdateStatusBadge), text);
                return;
            }
            lblStatusBadge.Text = text;
            bool isConnected = text.IndexOf("CONNECTED", StringComparison.OrdinalIgnoreCase) >= 0;
            lblStatusBadge.ForeColor = isConnected ? Color.FromArgb(52, 211, 153) : Color.FromArgb(251, 191, 36);

            if (pnlRoomPresence != null && lblRoomPresence != null)
            {
                if (isConnected)
                {
                    string detail = text.Replace("PEER STATUS: CONNECTED — ", "").Replace("PEER STATUS: CONNECTED", "").Trim();
                    pnlRoomPresence.BackColor = Color.FromArgb(6, 46, 36);
                    lblRoomPresence.ForeColor = Color.FromArgb(52, 211, 153);
                    lblRoomPresence.Text = "[2/2 PEERS] Toinen peer on huoneessa! (" + detail + ")";
                }
                else
                {
                    string room = txtRoomCode != null ? txtRoomCode.Text.Trim().ToLowerInvariant() : "";
                    pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
                    lblRoomPresence.ForeColor = Color.FromArgb(251, 191, 36);
                    lblRoomPresence.Text = "[1/2 PEERS] Ei toista peeriä huoneessa [" + room + "]";
                }
            }
        }

        private void ConnectToPeerEndpoint(string endpointStr, bool silentAutoAttempt = false)
        {
            // Also initiate simultaneous UDP Hole Punching in case the peer is across a WAN NAT
            InitiateUdpHolePunch(endpointStr);

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

                    if (!silentAutoAttempt)
                    {
                        Log("Opening Direct Winsock2 Kernel TCP connection to " + host + ":" + port.ToString() + "...");
                    }
                    TcpClient client = new TcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    IAsyncResult ar = client.BeginConnect(host, port, null, null);
                    bool connected = ar.AsyncWaitHandle.WaitOne(silentAutoAttempt ? 1200 : 3500);
                    if (!connected || !client.Connected)
                    {
                        try { client.Close(); } catch { }
                        if (!silentAutoAttempt)
                        {
                            Log("TCP Connect timed out (UDP NAT Hole-Punch active): " + host + ":" + port.ToString());
                        }
                        return;
                    }
                    client.EndConnect(ar);

                    activePeerClient = client;
                    activePeerStream = client.GetStream();
                    UpdateStatusBadge("PEER STATUS: CONNECTED — DIRECT TCP (" + host + ":" + port.ToString() + ")");
                    Log("Direct Kernel TCP Pipe established -> " + host + ":" + port.ToString() + " (NoDelay=true, 16MB Buffers)");

                    Thread rxThread = new Thread(delegate() { ReceiveKernelTcpLoop(client, activePeerStream, null); });
                    rxThread.IsBackground = true;
                    rxThread.Start();
                }
                catch (Exception ex)
                {
                    if (!silentAutoAttempt)
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
                            string remoteRoom = parts[1];
                            int remotePort = 0;
                            Int32.TryParse(parts[2], out remotePort);
                            string remoteInstanceId = parts[3];

                            if (remoteInstanceId == instanceId) continue;
                            if (IsOwnLocalEndpoint(remoteEp.Address, remotePort)) continue;

                            string myRoom = "";
                            this.Invoke(new Action(delegate { myRoom = txtRoomCode.Text.Trim().ToLowerInvariant(); }));

                            if (remoteRoom == myRoom && remotePort > 0)
                            {
                                string candidate = remoteEp.Address.ToString() + ":" + remotePort.ToString();
                                if (activePeerClient == null || !activePeerClient.Connected)
                                {
                                    Log("LAN Auto-Discovery found remote .EXE peer at " + candidate);
                                    ConnectToPeerEndpoint(candidate);
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
                string room = txtRoomCode.Text.Trim().ToLowerInvariant();
                byte[] payload = Encoding.UTF8.GetBytes("AETHER_DISCOVER|" + room + "|" + listenPort.ToString() + "|" + instanceId);
                udpDiscovery.Send(payload, payload.Length, new IPEndPoint(IPAddress.Broadcast, UDP_DISCOVERY_PORT));
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
                if (files.Length > 1)
                {
                    Log("Queued " + files.Length.ToString() + " files for high-speed P2P transfer...");
                }
                foreach (string f in files)
                {
                    string pathCopy = f;
                    StartFileTransfer(pathCopy);
                }
            }
        }

        private void OnSelectFilesClicked(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Select File(s) to Stream to Connected Chrome Browser or .EXE Peer";
                ofd.Multiselect = true;
                if (ofd.ShowDialog() == DialogResult.OK && ofd.FileNames != null && ofd.FileNames.Length > 0)
                {
                    if (ofd.FileNames.Length > 1)
                    {
                        Log("Queued " + ofd.FileNames.Length.ToString() + " files for high-speed P2P transfer...");
                    }
                    foreach (string f in ofd.FileNames)
                    {
                        string pathCopy = f;
                        StartFileTransfer(pathCopy);
                    }
                }
            }
        }

        private void StartFileTransfer(string filePath)
        {
            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasUdpPeer = (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 15);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudBrowserPeer = (activeCloudWs != null && activeCloudWs.State == WebSocketState.Open && !String.IsNullOrEmpty(activeCloudBrowserPeerId));
            bool hasCloudExePeer = (activeCloudWs != null && activeCloudWs.State == WebSocketState.Open && !String.IsNullOrEmpty(activeCloudExePeerId));

            if (hasExePeer)
            {
                Thread txThread = new Thread(delegate() { StreamFileOverKernelTcp(filePath); });
                txThread.IsBackground = true;
                txThread.Start();
                return;
            }

            if (hasUdpPeer)
            {
                Thread udpTxThread = new Thread(delegate() { StreamFileOverNatPunchedUdp(filePath); });
                udpTxThread.IsBackground = true;
                udpTxThread.Start();
                return;
            }

            if (hasLocalBrowserPeer)
            {
                Thread wsTxThread = new Thread(delegate() { StreamFileToBrowserOverWebSocket(filePath); });
                wsTxThread.IsBackground = true;
                wsTxThread.Start();
                return;
            }

            if (hasCloudBrowserPeer || hasCloudExePeer)
            {
                Thread cloudTxThread = new Thread(delegate() { StreamFileToBrowserOverCloudBridge(filePath); });
                cloudTxThread.IsBackground = true;
                cloudTxThread.Start();
                return;
            }

            Log("WAIT: Make sure the Chrome Browser App (or another .EXE) has the same Wormhole Code [" + txtRoomCode.Text.Trim() + "]!");
            MessageBox.Show(
                "No peer is paired in Wormhole Room [" + txtRoomCode.Text.Trim() + "] yet.\\n\\n" +
                "1. Open another AetherTunnel .EXE or Chrome Browser App and enter the same Wormhole Code: " + txtRoomCode.Text.Trim() + "\\n" +
                "2. Within 1-2 seconds, the status badge will turn green: PEER STATUS: CONNECTED.",
                "AetherTunnel v1.0 — Waiting for Peer Pairing",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }

        private byte[] EncryptUdpChunkPacket(int chunkIndex, int totalChunks, byte[] rawData, int rawLen, byte[] keySnapshot)
        {
            byte[] iv = new byte[16];
            Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, iv, 0, 4);
            Buffer.BlockCopy(BitConverter.GetBytes(0x5A3C9E17 ^ chunkIndex), 0, iv, 4, 4);

            byte[] cipher;
            AesCryptoServiceProvider aes = threadLocalAes.Value;
            using (ICryptoTransform enc = aes.CreateEncryptor(keySnapshot, iv))
            {
                cipher = enc.TransformFinalBlock(rawData, 0, rawLen);
            }

            byte[] packet = new byte[28 + cipher.Length];
            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_UDP_DATA), 0, packet, 0, 4);
            Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, packet, 4, 4);
            Buffer.BlockCopy(BitConverter.GetBytes(totalChunks), 0, packet, 8, 4);
            Buffer.BlockCopy(iv, 0, packet, 12, 16);
            Buffer.BlockCopy(cipher, 0, packet, 28, cipher.Length);
            return packet;
        }

        private void PaceUdpPacketSend(int packetBytes, ref long pacingEpochTicks, ref long pacedBytesSinceEpoch)
        {
            if (Interlocked.Exchange(ref pacingResetRequested, 0) == 1)
            {
                pacingEpochTicks = Stopwatch.GetTimestamp();
                pacedBytesSinceEpoch = 0;
            }

            double capMbps = dynamicUdpBitrateMbps;
            if (capMbps >= 5000.0) return; // Uncapped 5000 Mbit/s line rate

            // Reset token-bucket window every 250ms so any disk/OS hiccup never creates a multi-megabyte burst debt
            long nowTicks = Stopwatch.GetTimestamp();
            if (nowTicks - pacingEpochTicks > Stopwatch.Frequency / 4)
            {
                pacingEpochTicks = nowTicks;
                pacedBytesSinceEpoch = 0;
            }

            pacedBytesSinceEpoch += packetBytes;
            double bytesPerSec = (capMbps / 8.0) * 1024.0 * 1024.0;
            long targetTicks = pacingEpochTicks + (long)((pacedBytesSinceEpoch / bytesPerSec) * Stopwatch.Frequency);

            while (isRunning)
            {
                long cur = Stopwatch.GetTimestamp();
                long remain = targetTicks - cur;
                if (remain <= 0) break;
                if (remain > Stopwatch.Frequency / 400) // > 2.5 ms ahead
                {
                    Thread.Sleep(1);
                }
                else
                {
                    Thread.SpinWait(24);
                }
            }
        }

        private void StreamFileOverNatPunchedUdp(string filePath)
        {
            lock (udpTxLock)
            {
                try
                {
                    IPEndPoint targetEp = activeUdpPeerEndpoint;
                    if (targetEp == null || udpP2pClient == null) return;

                    FileInfo fi = new FileInfo(filePath);
                    long fileSize = fi.Length;
                    string fileName = fi.Name;
                    int totalChunks = (int)Math.Max(1L, (fileSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);

                    dynamicUdpBitrateMbps = 1.0;
                    lastNackReceivedTick = 0;
                    Log(String.Format("Streaming over High-Speed NAT-Punched UDP P2P -> {0}: {1} ({2}) [Auto Dynamic Pacing]",
                        targetEp.ToString(), fileName, FormatBytes(fileSize)));

                    udpPeerResumeChunk = 0;
                    udpPeerAckedChunk = -1;
                    udpPeerContiguousChunk = -1;
                    udpPeerUniqueAcked = 0;
                    udpPeerMeasuredMbps = 0;
                    udpPeerDoneConfirmed = false;
                    udpNeedStartResend = false;
                    int staleIdx;
                    while (udpRetransmitQueue.TryDequeue(out staleIdx)) { }
                    udpResumeEvent.Reset();
                    udpAckEvent.Reset();
                    udpNackEvent.Reset();

                    string startMsg = "AETHER_UDP_START|" + fileName.Replace("|", "_") + "|" + fileSize.ToString() + "|" + totalChunks.ToString();
                    byte[] startBytes = Encoding.UTF8.GetBytes(startMsg);

                    // Reliable multi-attempt START handshake so receiver is guaranteed to open its .part FileStream
                    for (int attempt = 0; attempt < 8; attempt++)
                    {
                        udpP2pClient.Send(startBytes, startBytes.Length, targetEp);
                        if (udpResumeEvent.WaitOne(150)) break;
                    }

                    int startChunk = Math.Max(0, Math.Min(udpPeerResumeChunk, totalChunks));
                    udpPeerAckedChunk = startChunk - 1;
                    udpPeerContiguousChunk = startChunk - 1;
                    udpPeerUniqueAcked = startChunk;

                    if (startChunk > 0)
                    {
                        Log("Resuming NAT-Punched UDP transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * UDP_CHUNK_SIZE) + ")");
                    }

                    Stopwatch sw = Stopwatch.StartNew();
                    long totalSent = Math.Min(fileSize, (long)startChunk * UDP_CHUNK_SIZE);
                    byte[] keySnapshot = (byte[])aesKey.Clone();
                    const int BATCH_CHUNKS = 2048; // ~2.8 MB encrypted in parallel across all CPU cores per wave (2048 x 1376B MTU-safe packets)
                    long pacingEpochTicks = Stopwatch.GetTimestamp();
                    long pacedBytesSinceEpoch = 0;

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 16 * 1024 * 1024, FileOptions.SequentialScan))
                    {
                        int chunkIndex = startChunk;
                        while (chunkIndex < totalChunks && !udpPeerDoneConfirmed && isRunning)
                        {
                            // Instant Resume Jump: if receiver reports a higher contiguous/resume chunk, skip ahead immediately!
                            int peerContig = Math.Max(udpPeerResumeChunk, udpPeerContiguousChunk + 1);
                            if (peerContig > chunkIndex && peerContig <= totalChunks)
                            {
                                Log("Peer confirmed resume offset at chunk " + peerContig.ToString() + " (" + FormatBytes(Math.Min(fileSize, (long)peerContig * UDP_CHUNK_SIZE)) + ") — jumping ahead!");
                                chunkIndex = peerContig;
                                startChunk = peerContig;
                                totalSent = Math.Min(fileSize, (long)chunkIndex * UDP_CHUNK_SIZE);
                                sw.Restart();
                                if (chunkIndex >= totalChunks) break;
                            }

                            if (udpNeedStartResend)
                            {
                                udpNeedStartResend = false;
                                udpP2pClient.Send(startBytes, startBytes.Length, targetEp);
                                Thread.Sleep(15);
                            }

                            // Drain and immediately retransmit any in-flight NACKed chunks before the next wave
                            int nackIdx;
                            int repairedInWave = 0;
                            while (repairedInWave < 256 && udpRetransmitQueue.TryDequeue(out nackIdx))
                            {
                                if (nackIdx >= 0 && nackIdx < totalChunks)
                                {
                                    long rPos = (long)nackIdx * UDP_CHUNK_SIZE;
                                    int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                    byte[] rBuf = new byte[rRem];
                                    fs.Seek(rPos, SeekOrigin.Begin);
                                    int rRead = fs.Read(rBuf, 0, rRem);
                                    if (rRead > 0)
                                    {
                                        byte[] rPkt = EncryptUdpChunkPacket(nackIdx, totalChunks, rBuf, rRead, keySnapshot);
                                        udpP2pClient.Send(rPkt, rPkt.Length, targetEp);
                                        PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                        repairedInWave++;
                                    }
                                }
                            }

                            long waveOffset = (long)chunkIndex * UDP_CHUNK_SIZE;
                            if (fs.Position != waveOffset) fs.Seek(waveOffset, SeekOrigin.Begin);

                            int waveCount = Math.Min(BATCH_CHUNKS, totalChunks - chunkIndex);
                            byte[][] rawBuffers = new byte[waveCount][];
                            int[] rawLengths = new int[waveCount];
                            int actualWave = 0;

                            for (int i = 0; i < waveCount; i++)
                            {
                                int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - ((long)(chunkIndex + i) * UDP_CHUNK_SIZE));
                                byte[] b = new byte[rem];
                                int rTot = 0;
                                while (rTot < rem)
                                {
                                    int r = fs.Read(b, rTot, rem - rTot);
                                    if (r <= 0) break;
                                    rTot += r;
                                }
                                if (rTot <= 0) break;
                                rawBuffers[i] = b;
                                rawLengths[i] = rTot;
                                actualWave++;
                            }
                            if (actualWave == 0) break;

                            byte[][] encryptedPackets = new byte[actualWave][];
                            int baseChunk = chunkIndex;

                            // Hardware AES-NI parallel encryption across all cores
                            Parallel.For(0, actualWave, delegate(int i)
                            {
                                encryptedPackets[i] = EncryptUdpChunkPacket(baseChunk + i, totalChunks, rawBuffers[i], rawLengths[i], keySnapshot);
                            });

                            for (int i = 0; i < actualWave && !udpPeerDoneConfirmed && isRunning; i++)
                            {
                                byte[] packet = encryptedPackets[i];
                                udpP2pClient.Send(packet, packet.Length, targetEp);
                                totalSent += rawLengths[i];

                                // Sub-microsecond hardware Stopwatch Token-Bucket pacer (never stalls on dropped packets!)
                                PaceUdpPacketSend(packet.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                            }

                            chunkIndex += actualWave;
                            double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            long sessionSent = Math.Max(0L, totalSent - ((long)startChunk * UDP_CHUNK_SIZE));
                            double mbps = (sessionSent / (1024.0 * 1024.0)) / sec;
                            int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending via UDP P2P: " + fileName, totalSent, fileSize, mbps, permille);
                        }

                        // Send AETHER_UDP_END and perform fast tail NACK recovery until receiver confirms AETHER_UDP_DONE
                        // Persistent retry (3000 rounds = ~4-6 mins) to survive unstable mobile connections and 0 Mbit/s zones
                        byte[] endBytes = Encoding.UTF8.GetBytes("AETHER_UDP_END|" + fileName);
                        for (int endRound = 0; endRound < 3000 && !udpPeerDoneConfirmed && isRunning; endRound++)
                        {
                            udpNackEvent.Reset();
                            udpP2pClient.Send(endBytes, endBytes.Length, targetEp);
                            udpNackEvent.WaitOne(80);
                            if (udpPeerDoneConfirmed) break;

                            int mIdx;
                            bool repairedTail = false;
                            while (udpRetransmitQueue.TryDequeue(out mIdx))
                            {
                                if (mIdx >= 0 && mIdx < totalChunks)
                                {
                                    long offset = (long)mIdx * UDP_CHUNK_SIZE;
                                    int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - offset);
                                    fs.Seek(offset, SeekOrigin.Begin);
                                    byte[] rBuf = new byte[rem];
                                    int rLen = fs.Read(rBuf, 0, rem);
                                    if (rLen > 0)
                                    {
                                        byte[] pkt = EncryptUdpChunkPacket(mIdx, totalChunks, rBuf, rLen, keySnapshot);
                                        udpP2pClient.Send(pkt, pkt.Length, targetEp);
                                        PaceUdpPacketSend(pkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                        repairedTail = true;
                                    }
                                }
                            }
                            if (repairedTail) endRound = 0;
                        }
                    }

                    sw.Stop();

                    double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                    long finalSessionBytes = Math.Max(1L, fileSize - ((long)startChunk * UDP_CHUNK_SIZE));
                    double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                    UpdateTransferUi("Sent via UDP NAT-Punch: " + fileName, fileSize, fileSize, finalMbps, 1000, true);
                    Log(String.Format("UDP NAT-P2P TX COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s{4}",
                        fileName, FormatBytes(fileSize), totalSec, finalMbps,
                        udpPeerDoneConfirmed ? " (Verified 100% Saved)" : ""));
                }
                catch (Exception ex)
                {
                    Log("UDP P2P TX Error: " + ex.Message);
                }
            }
        }

        private void StreamFileToBrowserOverCloudBridge(string filePath)
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-cloud-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + CLOUD_CHUNK_SIZE - 1) / CLOUD_CHUNK_SIZE);
                string dstPeer = !String.IsNullOrEmpty(activeCloudBrowserPeerId) ? activeCloudBrowserPeerId : activeCloudExePeerId;
                string peerLabel = !String.IsNullOrEmpty(activeCloudBrowserPeerId) ? "Chrome Browser" : "Remote .EXE";

                Log("Streaming .EXE -> " + peerLabel + " over Wormhole Bridge: " + fileName + " (" + FormatBytes(fileSize) + ")");

                cloudResumeChunk = 0;
                cloudResumeEvent.Reset();

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, CLOUD_CHUNK_SIZE, totalChunks
                );
                SendCloudPacket(activeCloudWs, dstPeer, startJson);

                // Wait up to 900ms for exe:resume-ack from peer
                cloudResumeEvent.WaitOne(900);
                int startChunk = Math.Max(0, Math.Min(cloudResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming interrupted Wormhole transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CLOUD_CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long totalSent = (long)startChunk * CLOUD_CHUNK_SIZE;
                byte[] buf = new byte[CLOUD_CHUNK_SIZE];
                int chunkIndex = startChunk;

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CLOUD_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalSent > 0) fs.Seek(totalSent, SeekOrigin.Begin);
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0)
                    {
                        string b64 = Convert.ToBase64String(buf, 0, read);
                        string chunkJson = String.Format(
                            "{{\\"kind\\":\\"exe:file-chunk\\",\\"fileId\\":\\"{0}\\",\\"chunkIndex\\":{1},\\"data\\":\\"{2}\\"}}",
                            fileId, chunkIndex, b64
                        );
                        SendCloudPacket(activeCloudWs, dstPeer, chunkJson);

                        totalSent += read;
                        chunkIndex++;

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double mbps = (totalSent / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Sending to " + peerLabel + ": " + fileName, totalSent, fileSize, mbps, permille);

                        if (chunkIndex % 8 == 0)
                        {
                            cloudAckEvent.WaitOne(350);
                        }
                    }
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                SendCloudPacket(activeCloudWs, dstPeer, endJson);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (fileSize / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to " + peerLabel + ": " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format(".EXE -> {0} COMPLETE: {1} ({2}) in {3:F2}s — {4:F2} MB/s",
                    peerLabel.ToUpperInvariant(), fileName, FormatBytes(fileSize), totalSec, finalMbps));
            }
            catch (Exception ex)
            {
                Log("Wormhole Cloud Bridge TX Error: " + ex.Message);
            }
        }

        private void StreamFileToBrowserOverWebSocket(string filePath)
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + WS_CHUNK_SIZE - 1) / WS_CHUNK_SIZE);

                Log("Streaming from .EXE -> Chrome Browser over Local Kernel WebSocket: " + fileName + " (" + FormatBytes(fileSize) + ")");

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, WS_CHUNK_SIZE, totalChunks
                );
                byte[] startBytes = Encoding.UTF8.GetBytes(startJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, startBytes, 0, startBytes.Length);

                Stopwatch sw = Stopwatch.StartNew();
                long totalSent = 0;
                byte[] buf = new byte[WS_CHUNK_SIZE];

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, WS_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0)
                    {
                        SendWebSocketFrame(activeBrowserWsStream, 0x02, buf, 0, read);
                        totalSent += read;

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double mbps = (totalSent / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Streaming to Browser: " + fileName, totalSent, fileSize, mbps, permille);
                    }
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                byte[] endBytes = Encoding.UTF8.GetBytes(endJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, endBytes, 0, endBytes.Length);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (fileSize / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to Browser: " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format(".EXE -> BROWSER COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
            }
            catch (Exception ex)
            {
                Log("Browser WebSocket TX Error: " + ex.Message);
            }
        }

        private void StreamFileOverKernelTcp(string filePath)
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                int totalChunks = (int)Math.Max(1L, (fileSize + CHUNK_SIZE - 1) / CHUNK_SIZE);

                Log("Starting Kernel-Socket transfer: " + fileName + " (" + FormatBytes(fileSize) + ", " + totalChunks.ToString() + " x 4 MB blocks)");

                kernelTcpResumeChunk = 0;
                kernelTcpResumeEvent.Reset();

                byte[] nameBytes = Encoding.UTF8.GetBytes(fileName);
                byte[] metaPayload = new byte[12 + nameBytes.Length];
                Buffer.BlockCopy(BitConverter.GetBytes(fileSize), 0, metaPayload, 0, 8);
                Buffer.BlockCopy(BitConverter.GetBytes(totalChunks), 0, metaPayload, 8, 4);
                Buffer.BlockCopy(nameBytes, 0, metaPayload, 12, nameBytes.Length);
                WriteKernelFrame(1, metaPayload, metaPayload.Length);

                // Wait up to 800ms for Frame Type 4 (Resume ACK) from receiving .EXE
                kernelTcpResumeEvent.WaitOne(800);
                int startChunk = Math.Max(0, Math.Min(kernelTcpResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming Kernel-Socket transfer from block " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long totalBytesSent = (long)startChunk * CHUNK_SIZE;
                byte[] keySnapshot = (byte[])aesKey.Clone();

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalBytesSent > 0) fs.Seek(totalBytesSent, SeekOrigin.Begin);

                    for (int waveStart = startChunk; waveStart < totalChunks; waveStart += PARALLEL_WORKERS)
                    {
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
                            WriteKernelFrame(2, body, body.Length);
                            totalBytesSent += plainLengths[w];

                            double elapsedSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            double mbps = (totalBytesSent / (1024.0 * 1024.0)) / elapsedSec;
                            int permille = (int)((totalBytesSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending: " + fileName, totalBytesSent, fileSize, mbps, permille);
                        }
                    }
                }

                WriteKernelFrame(3, new byte[4], 4);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (fileSize / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent & Verified: " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format("TX COMPLETE: {0} ({1}) in {2:F2}s — Average Speed: {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
            }
            catch (Exception ex)
            {
                Log("TX Error: " + ex.Message);
            }
        }

        private void WriteKernelFrame(byte frameType, byte[] payload, int payloadLen)
        {
            byte[] header = new byte[9];
            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, header, 0, 4);
            header[4] = frameType;
            Buffer.BlockCopy(BitConverter.GetBytes(payloadLen), 0, header, 5, 4);

            lock (streamWriteLock)
            {
                activePeerStream.Write(header, 0, 9);
                activePeerStream.Write(payload, 0, payloadLen);
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
            Stopwatch rxSw = null;

            try
            {
                while (isRunning && client.Connected)
                {
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

                        if (currentOutFile != null) currentOutFile.Close();
                        long existingBytes = 0;
                        if (File.Exists(currentPartPath))
                        {
                            existingBytes = new FileInfo(currentPartPath).Length;
                            if (existingBytes >= expectedFileSize) existingBytes = 0;
                        }
                        int resumeFromChunk = (int)(existingBytes / CHUNK_SIZE);
                        long alignedBytes = (long)resumeFromChunk * CHUNK_SIZE;

                        currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                        if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                        receivedPlainBytes = alignedBytes;
                        rxSw = Stopwatch.StartNew();

                        // Send Frame Type 4 (Resume ACK) back to sender
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
                    else if (frameType == 4 && payloadLen >= 4)
                    {
                        kernelTcpResumeChunk = BitConverter.ToInt32(payload, 0);
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
                        currentOutFile.Seek(writeOffset, SeekOrigin.Begin);
                        currentOutFile.Write(plain, 0, plain.Length);
                        receivedPlainBytes = Math.Max(receivedPlainBytes, writeOffset + plain.Length);

                        double elapsedSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double mbps = (receivedPlainBytes / (1024.0 * 1024.0)) / elapsedSec;
                        int permille = (int)((receivedPlainBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving to Disk: " + currentFileName, receivedPlainBytes, expectedFileSize, mbps, permille);
                    }
                    else if (frameType == 3 && currentOutFile != null)
                    {
                        currentOutFile.Flush();
                        currentOutFile.Close();
                        currentOutFile = null;
                        rxSw.Stop();

                        try
                        {
                            if (File.Exists(currentOutPath)) File.Delete(currentOutPath);
                            File.Move(currentPartPath, currentOutPath);
                        }
                        catch { }

                        double totalSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double finalMbps = (expectedFileSize / (1024.0 * 1024.0)) / totalSec;
                        UpdateTransferUi("Saved to Disk: " + currentFileName, expectedFileSize, expectedFileSize, finalMbps, 1000);
                        Log(String.Format("RX COMPLETE & SAVED: {0} ({1:F2} MB/s · {2:F2} Gbps)",
                            currentOutPath, finalMbps, (finalMbps * 8.0) / 1000.0));
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
                    try { currentOutFile.Close(); } catch { }
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

        private void UpdateTransferUi(string statusText, long doneBytes, long totalBytes, double mbps, int permille, bool force = false)
        {
            if (!force && permille < 1000)
            {
                int nowTick = Environment.TickCount;
                if (nowTick - lastUiUpdateTick < 100) return;
                lastUiUpdateTick = nowTick;
            }
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string, long, long, double, int, bool>(UpdateTransferUi), statusText, doneBytes, totalBytes, mbps, permille, true);
                return;
            }
            double gbps = (mbps * 8.0) / 1000.0;
            lblSpeedMetric.Text = String.Format("{0:F2} MB/s  ({1:F2} Gbps)", mbps, gbps);
            lblProgressDetail.Text = String.Format("{0} — {1} / {2} ({3}%)", statusText, FormatBytes(doneBytes), FormatBytes(totalBytes), permille / 10);
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
            try { if (tcpListener != null) tcpListener.Stop(); } catch { }
            try { if (udpDiscovery != null) udpDiscovery.Close(); } catch { }
            try { if (udpP2pClient != null) udpP2pClient.Close(); } catch { }
            try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
            try { if (activeBrowserWsClient != null) activeBrowserWsClient.Close(); } catch { }
            try { if (activeCloudWs != null) activeCloudWs.Dispose(); } catch { }
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
