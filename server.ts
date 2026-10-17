import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

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

const rooms = new Map<string, Map<string, PeerClient>>();

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

  app.use(express.json({ limit: '10mb' }));

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

  // Active Tunnel Room Status Check (Zero-knowledge: only checks peer count)
  app.get('/api/room/:code', (req, res) => {
    const code = (req.params.code || '').toLowerCase().trim();
    const room = rooms.get(code);
    res.json({
      roomCode: code,
      exists: Boolean(room && room.size > 0),
      peerCount: room ? room.size : 0,
    });
  });

  // Standalone GitHub Release Portable Launcher Generator
  app.get('/api/download-portable/:target', (req, res) => {
    const target = req.params.target;
    const hostUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host || 'localhost:3000'}`;

    if (target === 'windows') {
      const batContent = [
        '@echo off',
        'title AetherTunnel Portable P2P Client (Windows x64)',
        'echo ====================================================================',
        'echo   AetherTunnel - Zero-Install Encrypted P2P File Transfer Tunnel',
        'echo   Transport: WebRTC UDP Hole-Punching + TCP/443 Encrypted Relay',
        'echo   Cipher   : AES-256-GCM End-to-End Authenticated Encryption',
        'echo ====================================================================',
        'echo.',
        'set /p ROOM_CODE="Enter Pairing Code (or press Enter to create a new tunnel): "',
        'if "%ROOM_CODE%"=="" (',
        `  start "" "${hostUrl}"`,
        ') else (',
        `  start "" "${hostUrl}/?room=%ROOM_CODE%"`,
        ')',
        'echo Launching graphical AetherTunnel window...',
        'timeout /t 3 >nul',
      ].join('\r\n');

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="AetherTunnel-Portable-win-x64.bat"'
      );
      res.send(batContent);
      return;
    }

    if (target === 'macos' || target === 'linux') {
      const ext = target === 'macos' ? 'command' : 'sh';
      const shContent = [
        '#!/usr/bin/env bash',
        'set -e',
        'echo "===================================================================="',
        'echo "  AetherTunnel — Zero-Install Encrypted P2P File Transfer Tunnel"',
        'echo "  Transport: WebRTC UDP Hole-Punching + TCP/443 Encrypted Relay"',
        'echo "  Cipher   : AES-256-GCM End-to-End Authenticated Encryption"',
        'echo "===================================================================="',
        'echo ""',
        'read -r -p "Enter Pairing Code (or press Enter to create a new tunnel): " ROOM_CODE',
        `TARGET_URL="${hostUrl}"`,
        'if [ -n "$ROOM_CODE" ]; then',
        `  TARGET_URL="${hostUrl}/?room=$ROOM_CODE"`,
        'fi',
        'echo "Opening graphical AetherTunnel client at $TARGET_URL ..."',
        'if command -v open >/dev/null 2>&1; then',
        '  open "$TARGET_URL"',
        'elif command -v xdg-open >/dev/null 2>&1; then',
        '  xdg-open "$TARGET_URL"',
        'else',
        '  echo "Open this URL in your browser: $TARGET_URL"',
        'fi',
      ].join('\n');

      res.setHeader('Content-Type', 'application/x-sh');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="AetherTunnel-Portable-${target}-universal.${ext}"`
      );
      res.send(shContent);
      return;
    }

    // GitHub Actions Single-Binary Workflow YAML
    const workflowYaml = `name: Build & Publish Standalone AetherTunnel Executables

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  release-binaries:
    name: Build Single-File Portable Executables
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 22 LTS
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install Dependencies & Build Frontend GUI
        run: |
          npm ci
          npm run build

      - name: Bundle Server & Assets into Single CommonJS Entry
        run: |
          npx esbuild server.ts --bundle --platform=node --target=node18 --outfile=dist-bin/aethertunnel-bundle.cjs --external:vite

      - name: Package Standalone Executables (Windows .exe, macOS, Linux)
        run: |
          npx @yao-pkg/pkg dist-bin/aethertunnel-bundle.cjs \\
            --targets node18-win-x64,node18-macos-x64,node18-macos-arm64,node18-linux-x64 \\
            --out-path release-assets \\
            --compress GZip

      - name: Generate SHA-256 Checksums for Release Assets
        run: |
          cd release-assets
          sha256sum * > SHA256SUMS.txt

      - name: Publish Direct Download Executables to GitHub Releases
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: |
            release-assets/*
            release-assets/SHA256SUMS.txt
          generate_release_notes: true
`;

    res.setHeader('Content-Type', 'text/yaml');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="release-executables.yml"'
    );
    res.send(workflowYaml);
  });

  // WebSocket Server for P2P Signaling & Zero-Knowledge Encrypted Chunk Relay
  const wss = new WebSocketServer({ server, path: '/ws-tunnel' });

  wss.on('connection', (ws) => {
    let currentPeer: PeerClient | null = null;

    ws.on('message', (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString());

        switch (msg.type) {
          case 'room:join': {
            const roomCode = String(msg.roomCode || '').toLowerCase().trim();
            const peerId = String(msg.peerId || '');
            const deviceLabel = String(msg.deviceLabel || 'Desktop Peer');
            const natType = String(msg.natType || 'Port-Restricted Cone NAT');

            if (!roomCode || !peerId) return;

            // Leave previous room if any
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

            // Confirm room join to sender
            ws.send(
              JSON.stringify({
                type: 'room:joined',
                roomCode,
                peerId,
                peers: peersList,
              })
            );

            // Notify existing peers in the room
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
              sdp: msg.sdp,
              candidate: msg.candidate,
            });
            break;
          }

          case 'relay:packet': {
            // Zero-knowledge encrypted packet forwarding for Symmetric NAT / Firewall bypass
            if (!currentPeer) return;
            broadcastToRoom(currentPeer.roomCode, currentPeer.id, {
              type: 'relay:packet',
              fromPeerId: currentPeer.id,
              packet: msg.packet,
            });
            break;
          }

          case 'peer:ping': {
            ws.send(
              JSON.stringify({
                type: 'peer:pong',
                clientTimestamp: msg.clientTimestamp,
                serverTimestamp: Date.now(),
              })
            );
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
