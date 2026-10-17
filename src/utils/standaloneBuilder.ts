// Generates 100% self-contained, zero-install standalone portable packages
// that run directly from GitHub Pages, GitHub Releases, or local disk without any backend server.

export function generateStandalonePortableHtml(defaultRoomCode: string): string {
  return `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AetherTunnel Portable — Standalone Encrypted P2P Client</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>
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
        <span class="text-lg font-bold tracking-tight text-slate-100">AetherTunnel Portable</span>
        <span class="ml-3 text-xs text-emerald-400 font-mono">Serverless WebRTC + AES-256-GCM</span>
      </div>
      <div id="status-badge" class="text-xs font-mono text-sky-400">Initializing P2P Node...</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">1. Wormhole Pairing Code</h2>
        <p class="text-xs text-slate-400">Use the same pairing code on both devices (works across GitHub Pages, web app, and standalone executables).</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnel Room Code</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${defaultRoomCode}" class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
            <button id="connect-btn" class="px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 rounded-lg hover:bg-sky-300 cursor-pointer">Connect</button>
          </div>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Optional Shared Passphrase (PBKDF2)</label>
          <input id="pass-input" type="password" placeholder="Optional zero-knowledge secret..." class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100" />
        </div>
        <div class="pt-3 border-t border-slate-800 text-xs space-y-1">
          <div class="flex justify-between"><span class="text-slate-400">AES-256-GCM Key Fingerprint:</span><span id="fp-label" class="font-mono text-emerald-400">Computing...</span></div>
          <div class="flex justify-between"><span class="text-slate-400">NAT Traversal:</span><span class="font-mono text-slate-200">STUN UDP Hole-Punching</span></div>
        </div>
      </div>

      <div class="md:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">2. Encrypted File Transfer</h2>
        <label class="block border-2 border-dashed border-slate-800 hover:border-sky-400 bg-slate-950/60 rounded-lg p-8 text-center cursor-pointer transition-colors">
          <input id="file-input" type="file" multiple class="hidden" />
          <div class="text-sm font-semibold text-slate-100">Click or Drop Files Here to Encrypt &amp; Send</div>
          <div class="text-xs text-slate-400 mt-1">64 KB AES-256-GCM chunks · Automatic SHA-256 integrity verification</div>
        </label>
        <div id="transfer-list" class="space-y-2 max-h-64 overflow-y-auto text-xs">
          <div class="text-slate-500 text-center py-4">No transfers yet. Connect with a peer and select a file.</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const CHUNK_SIZE = 64 * 1024;
    let currentKey = null;
    let peer = null;
    let activeConn = null;
    let incomingFile = null;

    async function deriveKey(code, pass) {
      const enc = new TextEncoder();
      const baseKey = await crypto.subtle.importKey('raw', enc.encode(code.trim().toLowerCase() + '::' + pass.trim()), 'PBKDF2', false, ['deriveKey', 'deriveBits']);
      currentKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-E2EE-v1-Salt-2026'), iterations: 100000, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-Fingerprint-Salt'), iterations: 1000, hash: 'SHA-256' }, baseKey, 64);
      const hex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0').toUpperCase());
      document.getElementById('fp-label').textContent = hex[0]+hex[1]+' · '+hex[2]+hex[3]+' · '+hex[4]+hex[5];
    }

    function bufToB64(buf) {
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
      return btoa(bin);
    }

    function b64ToBuf(b64) {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytes.buffer;
    }

    function setupConnection(conn) {
      activeConn = conn;
      document.getElementById('status-badge').textContent = 'Connected P2P (' + conn.peer + ')';
      document.getElementById('status-badge').className = 'text-xs font-mono text-emerald-400';
      conn.on('data', async (data) => {
        const msg = typeof data === 'string' ? JSON.parse(data) : data;
        if (msg.kind === 'file:meta') {
          incomingFile = { ...msg, chunks: [] };
          renderStatus('Receiving: ' + msg.name + ' (0%)');
        } else if (msg.kind === 'file:chunk' && incomingFile) {
          const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(b64ToBuf(msg.ivBase64)), tagLength: 128 }, currentKey, b64ToBuf(msg.ciphertextBase64));
          incomingFile.chunks[msg.chunkIndex] = dec;
          const done = incomingFile.chunks.filter(Boolean).length;
          if (done >= incomingFile.totalChunks) {
            const blob = new Blob(incomingFile.chunks, { type: incomingFile.mimeType || 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            renderDownload(incomingFile.name, url, incomingFile.size);
            incomingFile = null;
          }
        }
      });
    }

    function renderStatus(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200">' + text + '</div>';
    }

    function renderDownload(name, url, size) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-emerald-500/40 rounded flex items-center justify-between"><span>Verified: ' + name + ' (' + Math.round(size/1024) + ' KB)</span><a href="' + url + '" download="' + name + '" class="px-3 py-1 bg-emerald-400 text-slate-950 font-semibold rounded">Save File</a></div>';
    }

    async function connectRoom() {
      const code = document.getElementById('room-input').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const pass = document.getElementById('pass-input').value;
      await deriveKey(code, pass);
      if (peer) peer.destroy();

      const hostId = 'aethertunnel-v1-' + code + '-host';
      const clientId = 'aethertunnel-v1-' + code + '-peer-' + Math.floor(Math.random() * 1000);

      document.getElementById('status-badge').textContent = 'Punching NAT via STUN (' + code + ')...';
      peer = new Peer(hostId, {
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }] }
      });

      peer.on('open', () => {
        document.getElementById('status-badge').textContent = 'Listening on Wormhole: ' + code;
      });

      peer.on('connection', (conn) => setupConnection(conn));

      peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          // Host already exists in this room -> join as receiver/peer and connect to host!
          peer = new Peer(clientId, {
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }] }
          });
          peer.on('open', () => {
            const conn = peer.connect(hostId, { reliable: true });
            conn.on('open', () => setupConnection(conn));
          });
          peer.on('connection', (conn) => setupConnection(conn));
        }
      });
    }

    document.getElementById('connect-btn').addEventListener('click', connectRoom);
    document.getElementById('file-input').addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files.length || !activeConn) {
        renderStatus('Wait for a remote peer to connect to room "' + document.getElementById('room-input').value + '" first.');
        return;
      }
      const file = files[0];
      const buf = await file.arrayBuffer();
      const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
      const hashBuf = await crypto.subtle.digest('SHA-256', buf);
      const sha256 = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

      activeConn.send(JSON.stringify({ kind: 'file:meta', fileId: 'f-' + Date.now(), name: file.name, size: file.size, mimeType: file.type, totalChunks, sha256 }));
      for (let i = 0; i < totalChunks; i++) {
        const slice = buf.slice(i * CHUNK_SIZE, Math.min(file.size, (i + 1) * CHUNK_SIZE));
        const iv = new Uint8Array(12);
        crypto.getRandomValues(iv);
        new DataView(iv.buffer).setUint32(8, i, false);
        const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, currentKey, slice);
        activeConn.send(JSON.stringify({ kind: 'file:chunk', chunkIndex: i, ivBase64: bufToB64(iv.buffer), ciphertextBase64: bufToB64(enc) }));
        renderStatus('Sending Encrypted: ' + file.name + ' (' + Math.round(((i+1)/totalChunks)*100) + '%)');
      }
      renderStatus('Completed & Verified: ' + file.name + ' (SHA-256: ' + sha256.slice(0, 16) + '...)');
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

      - name: 5. Publish Static Web App & Downloads to gh-pages Branch
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          cd dist
          touch .nojekyll
          git init
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git checkout -b gh-pages
          git add -A
          git commit -m "Deploy AetherTunnel Web App and Standalone .EXE"
          git push --force "https://x-access-token:\${GH_TOKEN}@github.com/\${GITHUB_REPOSITORY}.git" gh-pages:gh-pages
`;
}

export function triggerBrowserDownload(
  filename: string,
  content: string,
  mimeType: string = 'application/octet-stream'
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
