# AetherTunnel — Encrypted P2P File Transfer & NAT Traversal Suite

**AetherTunnel** is a zero-configuration, end-to-end encrypted peer-to-peer (P2P) file transfer application engineered to reliably bypass restrictive NAT topologies and firewalls. It runs directly in the browser via **GitHub Pages** as well as a **standalone zero-install desktop executable** (`.exe` for Windows, `.command` for macOS, and `.sh` for Linux) downloadable straight from GitHub Releases.

> **Built with Google AI Studio (Gemini 4 Argon)**  
> This application, its cryptographic transport architecture, native executable bundler, and automated CI/CD pipeline were created in **Google AI Studio** using the **Gemini 4 Argon** language model.

---

## Live Web App & Direct Executable Downloads

- **Run Directly in Browser (GitHub Pages)**: [https://rlame1.github.io/p2p-file-tunnel/](https://rlame1.github.io/p2p-file-tunnel/)
- **Download Standalone Windows `.EXE` & Binaries**: [GitHub Releases (Latest)](https://github.com/rlame1/p2p-file-tunnel/releases/latest)
- **Privacy Policy (Zero Data Collection)**: [PRIVACY.md](./PRIVACY.md)

---

## What AetherTunnel Does

Moving sensitive archives, binaries, or documents between computers across different networks often requires uploading files to third-party cloud storage or configuring complex port forwarding. **AetherTunnel** solves this by creating an ephemeral, authenticated cryptographic tunnel directly between peers:

1. **Human-Readable Wormhole Pairing**:
   - Generates a simple pairing code (e.g., `742-cobalt-falcon`) or a one-click shareable link.
   - Any peer entering the same Wormhole Code connects directly to the session—whether they are using the GitHub Pages web app or the downloaded standalone `.exe` desktop client.

2. **Client-Side End-to-End Encryption (`AES-256-GCM`)**:
   - Before a single byte leaves your device, AetherTunnel derives a 256-bit cryptographic key locally using the **Web Crypto API (`PBKDF2-HMAC-SHA256`, 100,000 iterations)** from the pairing code and an optional shared zero-knowledge passphrase.
   - Files are sliced into **64 KB chunks**, and each chunk is encrypted with a unique 96-bit initialization vector (IV) and a 128-bit authentication tag (`AES-256-GCM`).
   - A short **Key Fingerprint** (e.g., `E9F2 · 418C · 7B04 · 99D1`) is displayed on both devices so peers can visually verify they share the exact same cryptographic key.

3. **End-to-End `SHA-256` Integrity Verification**:
   - The sender computes a full `SHA-256` digest of the original file prior to chunking.
   - Once all chunks are received and decrypted in memory, the receiver independently computes the `SHA-256` hash of the reassembled file and verifies that it matches bit-for-bit before saving to disk.

4. **Multi-Strategy NAT & Firewall Traversal**:
   - **Primary Path — Direct WebRTC UDP Hole-Punching**: Probes multiple public STUN servers (`stun.l.google.com:19302`, `stun.cloudflare.com:3478`) using RFC 5245 Interactive Connectivity Establishment (ICE) to establish a low-latency direct peer-to-peer `RTCDataChannel` over DTLS/SCTP.
   - **Serverless WebRTC Signaling**: Integrates a serverless WebRTC signaling broker alongside WebSocket signaling so two peers can discover each other directly from static hosting (such as GitHub Pages) or offline portable files without needing a dedicated backend server.
   - **Fallback Path — Encrypted TCP/443 WebSocket Relay**: When both peers are trapped behind strict **Symmetric NATs** (Carrier-Grade NAT) or corporate firewalls that block all outbound UDP traffic, AetherTunnel automatically falls back to forwarding the `AES-256-GCM` encrypted chunks over standard port 443 WebSockets.

5. **Live NAT & Firewall Diagnostic Prober**:
   - Built-in network analyzer that gathers and displays your local (`host`), NAT Server Reflexive (`srflx`), and relay (`relay`) ICE candidates, measures STUN binding latency in milliseconds, and classifies your router's NAT filtering behavior.

6. **Zero-Install Standalone Executables**:
   - Includes a pure Node.js Portable Executable (`PE32 GUI .exe`) builder (`scripts/pe-exe-builder.cjs` and `scripts/build-desktop-entry.cjs`) that embeds the entire compiled graphical application into a single `AetherTunnel-win-x64.exe` binary, a single-file `AetherTunnel-Portable-Standalone.html`, a macOS `.command` bundle, and a Linux `.sh` binary.

---

## Quick Start

### Option A: Use Immediately From GitHub Pages or Releases (No Installation)
1. Open **[https://rlame1.github.io/p2p-file-tunnel/](https://rlame1.github.io/p2p-file-tunnel/)** or download **`AetherTunnel-win-x64.exe`** from **[GitHub Releases](https://github.com/rlame1/p2p-file-tunnel/releases/latest)** and double-click it.
2. Share your **Active Wormhole Code** (or click **Copy Link**) with the receiving peer.
3. Drag and drop any file into the **Encrypted File Staging & Streamer** zone to stream it across the encrypted tunnel.
4. *(Single-Device Testing)*: Click **Connect Local Sandbox Peer** in the top-right corner to spawn a local loopback peer and test live encrypted P2P transfers immediately in a single window.

### Option B: Run From Source Locally
```bash
npm install --legacy-peer-deps
npm run dev
```
Then open `http://localhost:3000` in your browser.

### Building Standalone Executables Locally
```bash
npm run build
node scripts/build-desktop-entry.cjs
```
This outputs the self-contained executables into `dist/downloads/`:
- `dist/downloads/AetherTunnel-win-x64.exe` (Windows 10/11 Native GUI Executable)
- `dist/downloads/AetherTunnel-Portable-Standalone.html` (Universal Single-File HTML App)
- `dist/downloads/AetherTunnel-macos-universal.command` (macOS Universal App)
- `dist/downloads/AetherTunnel-linux-x86_64.sh` (Linux Standalone Executable)
- `dist/downloads/SHA256SUMS.txt` (Cryptographic SHA-256 Checksum Manifest)

---

## Privacy & Security Guarantee

AetherTunnel is built on a strict **Zero-Knowledge, Zero-Telemetry** architecture. No personal data, IP logs, analytics, or file contents are ever collected or stored. Read the full privacy commitment in **[PRIVACY.md](./PRIVACY.md)**.

---

## License

SPDX-License-Identifier: Apache-2.0
