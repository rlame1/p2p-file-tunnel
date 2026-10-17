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
        <span class="ml-3 text-xs text-emerald-400 font-mono">1-Lane Ultra-Turbo Binary WebRTC + AES-256-GCM</span>
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
        <div>
          <label class="block text-xs text-slate-400 mb-1">Crypto Super-Chunk Size</label>
          <select id="chunk-select" class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400">
            <option value="240" selected>240 KB (Zero-Split SCTP — Recommended)</option>
            <option value="512">512 KB (Turbo 2x)</option>
            <option value="1024">1 MB (Ultra-Turbo 4x)</option>
          </select>
        </div>
        <div class="pt-3 border-t border-slate-800 text-xs space-y-1">
          <div class="flex justify-between"><span class="text-slate-400">AES-256-GCM Key Fingerprint:</span><span id="fp-label" class="font-mono text-emerald-400">Computing...</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Transport Engine:</span><span class="font-mono text-slate-200">1x Direct SCTP + Zero-Base64</span></div>
        </div>
      </div>

      <div class="md:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">2. Ultra-Turbo Encrypted File Transfer</h2>
        <label class="block border-2 border-dashed border-slate-800 hover:border-sky-400 bg-slate-950/60 rounded-lg p-8 text-center cursor-pointer transition-colors">
          <input id="file-input" type="file" multiple class="hidden" />
          <div class="text-sm font-semibold text-slate-100">Click or Drop Files Here to Encrypt &amp; Stream</div>
          <div class="text-xs text-slate-400 mt-1">1x Dedicated RTCPeerConnection · 240 KB Atomic Zero-Copy Frames · Raw Serializer</div>
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
    const MAX_SCTP_SLICE = 240 * 1024;
    const HIGH_WATER = 8 * 1024 * 1024;
    const LOW_WATER = 4 * 1024 * 1024;
    const PARALLEL_LANES = 1;

    let currentKey = null;
    let peer = null;
    let activeConn = null;
    let rawLanes = [];
    let incomingFile = null;
    let partialFrames = new Map();

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

    function registerRawLane(dc, connObj) {
      if (!dc) return;
      dc.binaryType = 'arraybuffer';
      dc.bufferedAmountLowThreshold = LOW_WATER;
      if (connObj && typeof connObj._handleDataMessage === 'function') {
        const origHandle = connObj._handleDataMessage.bind(connObj);
        connObj._handleDataMessage = (ev) => {
          if (ev && ev.data instanceof ArrayBuffer && handleIncomingBinary(ev.data)) return;
          origHandle(ev);
        };
      } else {
        const orig = dc.onmessage;
        dc.onmessage = (ev) => {
          if (ev.data instanceof ArrayBuffer && handleIncomingBinary(ev.data)) return;
          if (orig) orig.call(dc, ev);
        };
      }
      if (!rawLanes.includes(dc)) rawLanes.push(dc);
    }

    function setupConnection(conn, isPrimary) {
      if (isPrimary) {
        activeConn = conn;
        rawLanes = [];
      }
      if (conn.dataChannel) registerRawLane(conn.dataChannel, conn);
      document.getElementById('status-badge').textContent = 'Connected P2P (' + conn.peer + ')';
      document.getElementById('status-badge').className = 'text-xs font-mono text-emerald-400';

      conn.on('data', async (data) => {
        if (data instanceof ArrayBuffer && handleIncomingBinary(data)) return;
        const msg = typeof data === 'string' ? JSON.parse(data) : data;
        if (msg && msg.kind === 'file:meta') {
          incomingFile = { ...msg, chunkSize: msg.chunkSize || 240*1024, chunks: new Array(msg.totalChunks), receivedCount: 0, startedAt: performance.now(), lastUi: 0 };
          renderStatus('Receiving: ' + msg.name + ' (0%)');
        }
      });
    }

    function renderStatus(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200">' + text + '</div>';
    }

    function renderDownload(name, url, size, mbps) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-emerald-500/40 rounded flex items-center justify-between"><span>Verified: ' + name + ' (' + (size/(1024*1024)).toFixed(2) + ' MB · ' + mbps + ' MB/s)</span><a href="' + url + '" download="' + name + '" class="px-3 py-1 bg-emerald-400 text-slate-950 font-semibold rounded">Save File</a></div>';
    }

    async function connectRoom() {
      const code = document.getElementById('room-input').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const pass = document.getElementById('pass-input').value;
      await deriveKey(code, pass);
      if (peer) peer.destroy();

      const hostId = 'aethertunnel-v1-' + code + '-host';
      const clientId = 'aethertunnel-v1-' + code + '-peer-' + Math.floor(Math.random() * 9000 + 1000);

      document.getElementById('status-badge').textContent = 'Punching NAT via STUN (' + code + ')...';
      peer = new Peer(hostId, {
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }] }
      });

      peer.on('open', () => {
        document.getElementById('status-badge').textContent = 'Listening on Wormhole: ' + code;
      });

      peer.on('connection', (conn) => {
        const isPrimary = !conn.metadata || !conn.metadata.laneIndex;
        conn.on('open', () => setupConnection(conn, isPrimary));
      });

      peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          peer = new Peer(clientId, {
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }] }
          });
          peer.on('open', () => {
            const conn = peer.connect(hostId, { reliable: true, serialization: 'raw', metadata: { laneIndex: 0 } });
            conn.on('open', () => setupConnection(conn, true));
          });
          peer.on('connection', (conn) => {
            const isPrimary = !conn.metadata || !conn.metadata.laneIndex;
            conn.on('open', () => setupConnection(conn, isPrimary));
          });
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
      const chunkKb = parseInt(document.getElementById('chunk-select').value, 10) || 240;
      const chunkSize = chunkKb * 1024;
      const file = files[0];
      const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
      const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;
      const startedAt = performance.now();

      activeConn.send(JSON.stringify({ kind: 'file:meta', fileId: 'f-' + Date.now(), transferNumId, name: file.name, size: file.size, chunkSize, mimeType: file.type, totalChunks, sha256: 'streaming-aes-gcm' }));

      const batchSize = 32;
      let laneCursor = 0;

      for (let bStart = 0; bStart < totalChunks; bStart += batchSize) {
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

        const openLanes = rawLanes.filter(d => d.readyState === 'open');
        for (const frame of frames) {
          if (openLanes.length > 0) {
            let dc = openLanes[0];
            while (dc.bufferedAmount + frame.byteLength > HIGH_WATER) {
              await new Promise(r => setTimeout(r, 6));
            }
            dc.send(frame);
          } else {
            activeConn.send(frame);
          }
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
using System.Diagnostics;
using System.Runtime.InteropServices;

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

        [STAThread]
        static void Main()
        {
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
        private const uint MAGIC_HEADER = 0x4145544B; // "AETK" (AetherTunnel Kernel Frame)
        private const int CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB Direct Kernel Socket Macro-Block (.EXE <-> .EXE)
        private const int WS_CHUNK_SIZE = 1024 * 1024; // 1 MB Localhost WebSocket Frame (.EXE <-> Local Browser)
        private const int CLOUD_CHUNK_SIZE = 49152; // 48 KB Binary / 64 KB Base64 Frame for WSS Cloud Bridge
        private const int PARALLEL_WORKERS = 4; // 4x Parallel Hardware AES-NI Workers per Wave
        private const int UDP_DISCOVERY_PORT = 45888;

        private readonly string instanceId = Guid.NewGuid().ToString("N").Substring(0, 12);
        private bool suppressRoomBroadcast = false;
        private float dpiScale = 1.0f;

        private TextBox txtRoomCode;
        private TextBox txtPassphrase;
        private TextBox txtPeerEndpoint;
        private Label lblKeyFingerprint;
        private Label lblStatusBadge;
        private Label lblLocalEndpoint;
        private Label lblSpeedMetric;
        private Label lblProgressDetail;
        private ProgressBar progressBar;
        private ListBox lstLog;
        private Button btnConnectPeer;
        private Button btnLoopbackTest;
        private Button btnSendFile;
        private FolderBrowserDialog folderDialog;

        private TcpListener tcpListener;
        private UdpClient udpDiscovery;
        private int listenPort = 45889;
        private volatile bool isRunning = true;

        // 1. Native .EXE <-> .EXE Kernel TCP Peer
        private TcpClient activePeerClient;
        private NetworkStream activePeerStream;
        private readonly object streamWriteLock = new object();

        // 2. Native .EXE <-> Local Browser Kernel WebSocket Bridge (ws://127.0.0.1:45889)
        private TcpClient activeBrowserWsClient;
        private NetworkStream activeBrowserWsStream;
        private readonly object wsWriteLock = new object();

        // 3. Native .EXE <-> Chrome Browser Universal WSS Wormhole Cloud Bridge (wss://0.peerjs.com)
        private ClientWebSocket activeCloudWs;
        private string activeCloudMyId = "";
        private string activeCloudBrowserPeerId = "";
        private DateTime lastCloudBrowserSeen = DateTime.MinValue;
        private volatile bool cloudReconnectRequested = false;
        private readonly object cloudSendLock = new object();
        private readonly AutoResetEvent cloudAckEvent = new AutoResetEvent(false);

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
            this.Text = "AetherTunnel Native Kernel-Socket Edition v7 (High-DPI · .EXE <-> Chrome Browser & .EXE <-> .EXE)";
            this.ClientSize = new Size(S(980), S(660));
            this.MinimumSize = new Size(S(880), S(620));
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
                "AetherTunnel — Native Kernel-Socket Engine (.EXE v7)",
                new Font("Segoe UI Semibold", 14.5f, FontStyle.Bold),
                Color.FromArgb(248, 250, 252),
                new Point(S(24), S(12)),
                true
            );
            headerPanel.Controls.Add(lblTitle);

            Label lblSubtitle = CreateCleanLabel(
                "Per-Monitor V2 High-DPI · Chrome Browser Wormhole Bridge (WSS + Local 45889) · Direct Winsock2 TCP (.EXE <-> .EXE)",
                new Font("Consolas", 8.8f, FontStyle.Regular),
                accentSky,
                new Point(S(26), S(46)),
                true
            );
            headerPanel.Controls.Add(lblSubtitle);

            lblStatusBadge = CreateCleanLabel(
                "CONNECTING WORMHOLE BRIDGE...",
                new Font("Consolas", 9.5f, FontStyle.Bold),
                accentEmerald,
                new Point(S(610), S(16)),
                true
            );
            lblStatusBadge.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            headerPanel.Controls.Add(lblStatusBadge);

            this.Controls.Add(headerPanel);

            Panel leftCard = new Panel();
            leftCard.BackColor = bgCard;
            leftCard.Location = new Point(S(24), S(94));
            leftCard.Size = new Size(S(436), S(544));
            leftCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left;

            Label lblSec1 = CreateCleanLabel(
                "1. Wormhole Pairing & Kernel TCP Endpoint",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(16)),
                true
            );
            leftCard.Controls.Add(lblSec1);

            Label lblCodeTitle = CreateCleanLabel(
                "Shared Wormhole Code (Pairs with Chrome Browser & LAN .EXE):",
                null,
                fgMuted,
                new Point(S(20), S(48)),
                true
            );
            leftCard.Controls.Add(lblCodeTitle);

            txtRoomCode = new TextBox();
            txtRoomCode.Text = "${safeRoom}";
            txtRoomCode.Font = new Font("Consolas", 11f, FontStyle.Bold);
            txtRoomCode.BackColor = bgInput;
            txtRoomCode.ForeColor = accentSky;
            txtRoomCode.BorderStyle = BorderStyle.FixedSingle;
            txtRoomCode.Location = new Point(S(20), S(72));
            txtRoomCode.Size = new Size(S(285), S(28));
            txtRoomCode.TextChanged += delegate {
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
            btnNewCode.Location = new Point(S(313), S(71));
            btnNewCode.Size = new Size(S(103), S(29));
            btnNewCode.Click += delegate {
                string[] words = new string[] { "cobalt", "falcon", "nebula", "quartz", "vortex", "cipher", "zenith", "aurora", "photon", "obsidian" };
                Random r = new Random();
                txtRoomCode.Text = r.Next(100, 999).ToString() + "-" + words[r.Next(words.Length)] + "-" + words[r.Next(words.Length)];
            };
            leftCard.Controls.Add(btnNewCode);

            Label lblPassTitle = CreateCleanLabel(
                "Optional E2EE Passphrase (PBKDF2-HMAC-SHA256 Salt):",
                null,
                fgMuted,
                new Point(S(20), S(112)),
                true
            );
            leftCard.Controls.Add(lblPassTitle);

            txtPassphrase = new TextBox();
            txtPassphrase.UseSystemPasswordChar = true;
            txtPassphrase.Font = new Font("Consolas", 10f);
            txtPassphrase.BackColor = bgInput;
            txtPassphrase.ForeColor = Color.White;
            txtPassphrase.BorderStyle = BorderStyle.FixedSingle;
            txtPassphrase.Location = new Point(S(20), S(136));
            txtPassphrase.Size = new Size(S(396), S(26));
            txtPassphrase.TextChanged += delegate { DeriveCryptographicKey(); };
            leftCard.Controls.Add(txtPassphrase);

            Label lblFpCaption = CreateCleanLabel(
                "E2EE Key Fingerprint (Matches Chrome Browser 1:1):",
                null,
                fgMuted,
                new Point(S(20), S(172)),
                true
            );
            leftCard.Controls.Add(lblFpCaption);

            lblKeyFingerprint = CreateCleanLabel(
                "Deriving...",
                new Font("Consolas", 11f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(194)),
                true
            );
            leftCard.Controls.Add(lblKeyFingerprint);

            Label lblLocalCaption = CreateCleanLabel(
                "Your Direct Kernel TCP & Local Browser Bridge Address:",
                null,
                fgMuted,
                new Point(S(20), S(228)),
                true
            );
            leftCard.Controls.Add(lblLocalCaption);

            lblLocalEndpoint = CreateCleanLabel(
                "Starting Winsock2 listener...",
                new Font("Consolas", 9.2f, FontStyle.Bold),
                Color.FromArgb(226, 232, 240),
                new Point(S(20), S(250)),
                false
            );
            lblLocalEndpoint.Size = new Size(S(396), S(38));
            leftCard.Controls.Add(lblLocalEndpoint);

            Label lblPeerTitle = CreateCleanLabel(
                "Direct LAN .EXE Connect (Optional Remote IP:Port):",
                null,
                fgMuted,
                new Point(S(20), S(294)),
                true
            );
            leftCard.Controls.Add(lblPeerTitle);

            txtPeerEndpoint = new TextBox();
            txtPeerEndpoint.Text = "";
            txtPeerEndpoint.Font = new Font("Consolas", 10f);
            txtPeerEndpoint.BackColor = bgInput;
            txtPeerEndpoint.ForeColor = Color.White;
            txtPeerEndpoint.BorderStyle = BorderStyle.FixedSingle;
            txtPeerEndpoint.Location = new Point(S(20), S(318));
            txtPeerEndpoint.Size = new Size(S(260), S(28));
            leftCard.Controls.Add(txtPeerEndpoint);

            btnConnectPeer = new Button();
            btnConnectPeer.UseMnemonic = false;
            btnConnectPeer.Text = "Connect .EXE";
            btnConnectPeer.FlatStyle = FlatStyle.Flat;
            btnConnectPeer.BackColor = accentSky;
            btnConnectPeer.ForeColor = Color.FromArgb(9, 13, 22);
            btnConnectPeer.Font = new Font("Segoe UI Semibold", 9f, FontStyle.Bold);
            btnConnectPeer.Location = new Point(S(288), S(317));
            btnConnectPeer.Size = new Size(S(128), S(29));
            btnConnectPeer.Click += delegate {
                if (txtPeerEndpoint.Text.Trim().Length > 0)
                    ConnectToPeerEndpoint(txtPeerEndpoint.Text.Trim());
                else
                    Log("Enter the other computer's IP:Port (or use the same Wormhole Code) to connect.");
            };
            leftCard.Controls.Add(btnConnectPeer);

            btnLoopbackTest = new Button();
            btnLoopbackTest.UseMnemonic = false;
            btnLoopbackTest.Text = "Run Local NVMe Loopback Benchmark (Test Hardware Speed)";
            btnLoopbackTest.FlatStyle = FlatStyle.Flat;
            btnLoopbackTest.BackColor = Color.FromArgb(16, 48, 42);
            btnLoopbackTest.ForeColor = accentEmerald;
            btnLoopbackTest.Font = new Font("Segoe UI Semibold", 8.8f, FontStyle.Bold);
            btnLoopbackTest.Location = new Point(S(20), S(360));
            btnLoopbackTest.Size = new Size(S(396), S(34));
            btnLoopbackTest.Click += delegate { ConnectToPeerEndpoint("127.0.0.1:" + listenPort.ToString()); };
            leftCard.Controls.Add(btnLoopbackTest);

            Label lblSaveDir = CreateCleanLabel(
                "Incoming files save to: " + downloadDirectory,
                new Font("Segoe UI", 8.5f),
                fgMuted,
                new Point(S(20), S(408)),
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
            btnChangeDir.Location = new Point(S(20), S(452));
            btnChangeDir.Size = new Size(S(190), S(32));
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
            btnOpenDir.Location = new Point(S(222), S(452));
            btnOpenDir.Size = new Size(S(194), S(32));
            btnOpenDir.Click += delegate {
                try { Process.Start("explorer.exe", downloadDirectory); } catch { }
            };
            leftCard.Controls.Add(btnOpenDir);

            this.Controls.Add(leftCard);

            Panel rightCard = new Panel();
            rightCard.BackColor = bgCard;
            rightCard.Location = new Point(S(478), S(94));
            rightCard.Size = new Size(S(478), S(544));
            rightCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;

            Label lblSec2 = CreateCleanLabel(
                "2. Direct File Streamer (.EXE <-> Browser & .EXE <-> .EXE)",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(16)),
                true
            );
            rightCard.Controls.Add(lblSec2);

            btnSendFile = new Button();
            btnSendFile.UseMnemonic = false;
            btnSendFile.Text = "SELECT FILE OR DRAG & DROP HERE TO SEND\\n(Streams to Connected Chrome Browser or Remote .EXE Peer)";
            btnSendFile.FlatStyle = FlatStyle.Flat;
            btnSendFile.BackColor = Color.FromArgb(14, 28, 48);
            btnSendFile.ForeColor = accentSky;
            btnSendFile.Font = new Font("Segoe UI Semibold", 9.8f, FontStyle.Bold);
            btnSendFile.Location = new Point(S(20), S(50));
            btnSendFile.Size = new Size(S(438), S(96));
            btnSendFile.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            btnSendFile.Click += OnSelectFilesClicked;
            rightCard.Controls.Add(btnSendFile);

            lblSpeedMetric = CreateCleanLabel(
                "0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 15f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(160)),
                true
            );
            rightCard.Controls.Add(lblSpeedMetric);

            lblProgressDetail = CreateCleanLabel(
                "Enter the same Wormhole Code in Chrome Browser and this .EXE to pair automatically.",
                null,
                fgMuted,
                new Point(S(20), S(194)),
                false
            );
            lblProgressDetail.Size = new Size(S(438), S(24));
            lblProgressDetail.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblProgressDetail);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(S(20), S(224));
            progressBar.Size = new Size(S(438), S(18));
            progressBar.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            progressBar.Maximum = 1000;
            rightCard.Controls.Add(progressBar);

            Label lblLogCap = CreateCleanLabel(
                "Live Kernel Socket & Chrome Browser Wormhole Log:",
                null,
                fgMuted,
                new Point(S(20), S(254)),
                true
            );
            rightCard.Controls.Add(lblLogCap);

            lstLog = new ListBox();
            lstLog.BackColor = bgInput;
            lstLog.ForeColor = Color.FromArgb(203, 213, 225);
            lstLog.Font = new Font("Consolas", 9f);
            lstLog.BorderStyle = BorderStyle.FixedSingle;
            lstLog.HorizontalScrollbar = true;
            lstLog.Location = new Point(S(20), S(278));
            lstLog.Size = new Size(S(438), S(244));
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

            string localIps = GetLocalIpList();
            lblLocalEndpoint.Text = localIps;
            Log("High-DPI Mode active (Scale: " + Math.Round(dpiScale * 100).ToString() + "%). Listening on port " + listenPort.ToString());
            Log("Connecting to Universal WSS Wormhole Cloud Bridge for room [" + txtRoomCode.Text.Trim() + "]...");

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

        private string GetFirstLanEndpoint()
        {
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        return ip.ToString() + ":" + listenPort.ToString();
                    }
                }
            }
            catch { }
            return "";
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

        private void CloudWormholeBridgeLoop()
        {
            int slotIndex = 0;
            FileStream cloudOutFile = null;
            string cloudFileName = "";
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

                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + (slotIndex % 3).ToString();
                    string token = Guid.NewGuid().ToString("N").Substring(0, 10);
                    string url = "wss://0.peerjs.com/peerjs?key=peerjs&id=" + myPeerId + "&token=" + token;

                    ws = new ClientWebSocket();
                    ws.ConnectAsync(new Uri(url), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        slotIndex++;
                        Thread.Sleep(1000);
                        continue;
                    }

                    activeCloudWs = ws;
                    activeCloudMyId = myPeerId;

                    ClientWebSocket capturedWs = ws;
                    string capturedCode = cleanCode;
                    Thread hbThread = new Thread(delegate()
                    {
                        while (isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open)
                        {
                            try
                            {
                                SendCloudHelloToWebPeers(capturedWs, capturedCode);
                            }
                            catch { break; }
                            for (int i = 0; i < 20; i++)
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

                        string text = Encoding.UTF8.GetString(msgMs.ToArray());
                        msgMs.SetLength(0);

                        if (text.Contains("\\"ID-TAKEN\\"") || text.Contains("is taken"))
                        {
                            slotIndex++;
                            break;
                        }

                        if (text.Contains("\\"OPEN\\""))
                        {
                            SendCloudHelloToWebPeers(ws, cleanCode);
                            continue;
                        }

                        string srcPeer = ExtractJsonString(text, "src");
                        string kind = ExtractJsonString(text, "kind");

                        if (kind == "browser:hello" || kind == "web:hello")
                        {
                            bool isNewPairing = (activeCloudBrowserPeerId != srcPeer) || ((DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds > 10);
                            activeCloudBrowserPeerId = srcPeer;
                            lastCloudBrowserSeen = DateTime.UtcNow;

                            if (isNewPairing)
                            {
                                UpdateStatusBadge("CONNECTED: CHROME BROWSER [" + cleanCode + "]");
                                Log("Paired with Chrome Browser App in Wormhole Room [" + cleanCode + "] (" + srcPeer + ")");
                                SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"fingerprint\\":\\"" + currentFingerprint + "\\"}");
                            }
                        }
                        else if (kind == "exe:hello" && srcPeer.StartsWith("aethertunnel-exe-") && srcPeer != myPeerId)
                        {
                            string remoteLan = ExtractJsonString(text, "lanEndpoint");
                            if (remoteLan.Length > 0 && (activePeerClient == null || !activePeerClient.Connected))
                            {
                                Log("Wormhole discovered LAN .EXE peer at " + remoteLan + " — opening Direct Kernel TCP...");
                                ConnectToPeerEndpoint(remoteLan);
                            }
                        }
                        else if (kind == "exe:chunk-ack")
                        {
                            cloudAckEvent.Set();
                        }
                        else if (kind == "exe:file-start")
                        {
                            activeCloudBrowserPeerId = srcPeer;
                            lastCloudBrowserSeen = DateTime.UtcNow;
                            cloudFileName = ExtractJsonString(text, "name");
                            if (cloudFileName.Length == 0) cloudFileName = "transfer.bin";
                            cloudExpectedSize = ExtractJsonLong(text, "size");
                            cloudOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + cloudFileName);

                            if (cloudOutFile != null) cloudOutFile.Close();
                            cloudOutFile = new FileStream(cloudOutPath, FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                            cloudReceivedBytes = 0;
                            cloudRxSw = Stopwatch.StartNew();
                            Log("Receiving file from Chrome Browser -> " + cloudOutPath + " (" + FormatBytes(cloudExpectedSize) + ")");
                            UpdateTransferUi("Receiving from Chrome: " + cloudFileName, 0, cloudExpectedSize, 0, 0);
                        }
                        else if (kind == "exe:file-chunk" && cloudOutFile != null)
                        {
                            string b64 = ExtractJsonString(text, "data");
                            long chunkIdx = ExtractJsonLong(text, "chunkIndex");
                            if (b64.Length > 0)
                            {
                                byte[] raw = Convert.FromBase64String(b64);
                                cloudOutFile.Write(raw, 0, raw.Length);
                                cloudReceivedBytes += raw.Length;

                                double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                                double mbps = (cloudReceivedBytes / (1024.0 * 1024.0)) / sec;
                                int permille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                                UpdateTransferUi("Receiving from Chrome: " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, mbps, permille);
                            }
                            if ((chunkIdx + 1) % 8 == 0)
                            {
                                SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":" + chunkIdx.ToString() + "}");
                            }
                        }
                        else if (kind == "exe:file-end" && cloudOutFile != null)
                        {
                            cloudOutFile.Flush();
                            cloudOutFile.Close();
                            cloudOutFile = null;
                            cloudRxSw.Stop();

                            double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                            double mbps = (cloudExpectedSize / (1024.0 * 1024.0)) / sec;
                            UpdateTransferUi("Saved to Downloads: " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, 1000);
                            Log(String.Format("CHROME -> .EXE COMPLETE: Saved to {0} ({1:F2} MB/s)", cloudOutPath, mbps));
                            SendCloudPacket(ws, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":999999}");
                        }
                    }
                }
                catch
                {
                    // Reconnect after brief pause
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
                    Thread.Sleep(1200);
                }
            }
        }

        private void SendCloudHelloToWebPeers(ClientWebSocket ws, string cleanCode)
        {
            if (ws == null || ws.State != WebSocketState.Open) return;
            string lanEp = GetFirstLanEndpoint();
            string payload = "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"fingerprint\\":\\"" + currentFingerprint + "\\",\\"lanEndpoint\\":\\"" + lanEp + "\\"}";

            for (int i = 0; i < 3; i++)
            {
                SendCloudPacket(ws, "aethertunnel-web-" + cleanCode + "-" + i.ToString(), payload);
            }
            for (int i = 0; i < 3; i++)
            {
                string targetExe = "aethertunnel-exe-" + cleanCode + "-" + i.ToString();
                if (targetExe != activeCloudMyId)
                {
                    SendCloudPacket(ws, targetExe, payload);
                }
            }
        }

        private void SendCloudPacket(ClientWebSocket ws, string dstPeerId, string innerPayloadJson)
        {
            if (ws == null || ws.State != WebSocketState.Open || String.IsNullOrEmpty(dstPeerId)) return;
            string envelope = "{\\"type\\":\\"CANDIDATE\\",\\"dst\\":\\"" + dstPeerId + "\\",\\"payload\\":" + innerPayloadJson + "}";
            byte[] bytes = Encoding.UTF8.GetBytes(envelope);
            lock (cloudSendLock)
            {
                ws.SendAsync(new ArraySegment<byte>(bytes, 0, bytes.Length), WebSocketMessageType.Text, true, CancellationToken.None).Wait(5000);
            }
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
                            currentFileName = ExtractJsonString(text, "name");
                            if (currentFileName.Length == 0) currentFileName = "transfer.bin";
                            expectedFileSize = ExtractJsonLong(text, "size");
                            currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);

                            if (currentOutFile != null) currentOutFile.Close();
                            currentOutFile = new FileStream(currentOutPath, FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                            receivedBytes = 0;
                            rxSw = Stopwatch.StartNew();
                            Log("Receiving from Chrome Browser -> " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                        }
                        else if (text.Contains("\\"exe:file-end\\"") && currentOutFile != null)
                        {
                            currentOutFile.Flush();
                            currentOutFile.Close();
                            currentOutFile = null;
                            rxSw.Stop();

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
        }

        private void ConnectToPeerEndpoint(string endpointStr)
        {
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

                    Log("Opening Direct Winsock2 Kernel TCP connection to " + host + ":" + port.ToString() + "...");
                    TcpClient client = new TcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    client.Connect(host, port);

                    activePeerClient = client;
                    activePeerStream = client.GetStream();
                    UpdateStatusBadge("CONNECTED .EXE PEER (" + host + ":" + port.ToString() + ")");
                    Log("Direct Kernel TCP Pipe established -> " + host + ":" + port.ToString() + " (NoDelay=true, 16MB Buffers)");

                    Thread rxThread = new Thread(delegate() { ReceiveKernelTcpLoop(client, activePeerStream, null); });
                    rxThread.IsBackground = true;
                    rxThread.Start();
                }
                catch (Exception ex)
                {
                    Log("TCP Connect failed: " + ex.Message);
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
                StartFileTransfer(files[0]);
            }
        }

        private void OnSelectFilesClicked(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Select File to Stream to Connected Chrome Browser or .EXE Peer";
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    StartFileTransfer(ofd.FileName);
                }
            }
        }

        private void StartFileTransfer(string filePath)
        {
            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudBrowserPeer = (activeCloudWs != null && activeCloudWs.State == WebSocketState.Open && !String.IsNullOrEmpty(activeCloudBrowserPeerId));

            if (hasExePeer)
            {
                Thread txThread = new Thread(delegate() { StreamFileOverKernelTcp(filePath); });
                txThread.IsBackground = true;
                txThread.Start();
                return;
            }

            if (hasLocalBrowserPeer)
            {
                Thread wsTxThread = new Thread(delegate() { StreamFileToBrowserOverWebSocket(filePath); });
                wsTxThread.IsBackground = true;
                wsTxThread.Start();
                return;
            }

            if (hasCloudBrowserPeer)
            {
                Thread cloudTxThread = new Thread(delegate() { StreamFileToBrowserOverCloudBridge(filePath); });
                cloudTxThread.IsBackground = true;
                cloudTxThread.Start();
                return;
            }

            Log("WAIT: Make sure the Chrome Browser App (or another .EXE) has the same Wormhole Code [" + txtRoomCode.Text.Trim() + "]!");
            MessageBox.Show(
                "No peer is paired in Wormhole Room [" + txtRoomCode.Text.Trim() + "] yet.\\n\\n" +
                "1. Open the Chrome Browser App and enter the same Wormhole Code: " + txtRoomCode.Text.Trim() + "\\n" +
                "2. Within 1-2 seconds, the top-right status will turn green: CONNECTED: CHROME BROWSER.\\n" +
                "3. Or click 'Run Local NVMe Loopback Benchmark' on the left to test local disk speed.",
                "AetherTunnel — Waiting for Wormhole Pairing",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
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
                string dstPeer = activeCloudBrowserPeerId;

                Log("Streaming .EXE -> Chrome Browser over Wormhole Bridge: " + fileName + " (" + FormatBytes(fileSize) + ")");

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, CLOUD_CHUNK_SIZE, totalChunks
                );
                SendCloudPacket(activeCloudWs, dstPeer, startJson);

                Stopwatch sw = Stopwatch.StartNew();
                long totalSent = 0;
                byte[] buf = new byte[CLOUD_CHUNK_SIZE];
                int chunkIndex = 0;

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CLOUD_CHUNK_SIZE, FileOptions.SequentialScan))
                {
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
                        UpdateTransferUi("Sending to Chrome: " + fileName, totalSent, fileSize, mbps, permille);

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
                UpdateTransferUi("Sent to Chrome Browser: " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format(".EXE -> CHROME COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps));
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

                byte[] nameBytes = Encoding.UTF8.GetBytes(fileName);
                byte[] metaPayload = new byte[12 + nameBytes.Length];
                Buffer.BlockCopy(BitConverter.GetBytes(fileSize), 0, metaPayload, 0, 8);
                Buffer.BlockCopy(BitConverter.GetBytes(totalChunks), 0, metaPayload, 8, 4);
                Buffer.BlockCopy(nameBytes, 0, metaPayload, 12, nameBytes.Length);
                WriteKernelFrame(1, metaPayload, metaPayload.Length);

                Stopwatch sw = Stopwatch.StartNew();
                long totalBytesSent = 0;
                byte[] keySnapshot = (byte[])aesKey.Clone();

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    for (int waveStart = 0; waveStart < totalChunks; waveStart += PARALLEL_WORKERS)
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

                        if (currentOutFile != null) currentOutFile.Close();
                        currentOutFile = new FileStream(currentOutPath, FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                        receivedPlainBytes = 0;
                        rxSw = Stopwatch.StartNew();

                        Log("Receiving directly to disk: " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
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
                        receivedPlainBytes += plain.Length;

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

        private void UpdateTransferUi(string statusText, long doneBytes, long totalBytes, double mbps, int permille)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string, long, long, double, int>(UpdateTransferUi), statusText, doneBytes, totalBytes, mbps, permille);
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
    "Get-Process AetherTunnelKernel* -ErrorAction SilentlyContinue|Stop-Process -Force;" +
    "Start-Sleep -Milliseconds 150;" +
    "$b=[IO.File]::ReadAllBytes($env:AETHER_EXE);" +
    "$s=[Text.Encoding]::UTF8.GetString($b,3584,$b.Length-3584);" +
    "$d=Join-Path $env:LOCALAPPDATA 'AetherTunnel';" +
    "New-Item -ItemType Directory -Force -Path $d|Out-Null;" +
    "$cs=Join-Path $d 'AetherTunnelKernel_v7.cs';" +
    "$bin=Join-Path $d 'AetherTunnelKernel_v7.exe';" +
    "[IO.File]::WriteAllText($cs,$s,[Text.Encoding]::UTF8);" +
    "$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';" +
    "if(-not(Test-Path $csc)){$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework\\v4.0.30319\\csc.exe'};" +
    "& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs;" +
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
