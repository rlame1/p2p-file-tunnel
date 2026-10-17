# AetherTunnel — Encrypted P2P File Transfer & NAT Traversal Suite

AetherTunnel is a zero-configuration, end-to-end encrypted peer-to-peer file transfer application engineered to punch through restrictive firewalls and NAT topologies (Full Cone, Restricted, Port-Restricted, and Symmetric NAT) while offering both an instant browser-based transfer studio and a standalone portable executable exporter for GitHub Releases.

### User Review & Critical Decisions

> [!IMPORTANT]
> Because the initial clarification prompt was skipped, we have selected the recommended production defaults below so you can review and approve the architecture immediately.

- **Confirmed Decision 1 — Hybrid P2P + Encrypted Relay Fallback**: Uses **WebRTC DataChannels (SCTP over DTLS)** with multi-server STUN/ICE candidate gathering for direct peer-to-peer transfers, paired with an automatic **WebSocket Encrypted Chunk Relay fallback** on port 3000 so transfers succeed even behind strict Symmetric NATs or corporate UDP-blocking firewalls.
- **Confirmed Decision 2 — End-to-End AES-256-GCM Encryption**: In addition to transport-layer encryption, files are chunked and encrypted client-side in the browser/client using the native **Web Crypto API (AES-256-GCM)** derived from a shared one-time tunnel code and passphrase before leaving the sender's device. Neither the signaling server nor any relay node can inspect file contents or metadata.
- **Confirmed Decision 3 — Standalone GitHub Release Portable Executable Builder**: Includes an interactive **Portable Release & Standalone Binary Studio** that generates self-contained single-file executable bundles and GitHub Actions release workflows (using Node.js Single Executable Applications / `pkg` / Tauri portable targets for Windows `.exe`, macOS universal binary, and Linux AppImage/binary) so end users can download and double-click a single executable directly from a GitHub Release page with zero installation.
- **Confirmed Decision 4 — Utilitarian Dark Developer Console Aesthetic**: Designed in English following a high-craft dark slate workspace (`#0F172A` canvas, `#1E293B` structural surfaces, `#10B981` emerald nominal status, `#38BDF8` sky action accent) with `Plus Jakarta Sans` headings, `DM Sans` prose, and `JetBrains Mono` (`tabular-nums`) for live throughput, SHA-256 checksums, and ICE candidate telemetry.

---

### 1. Overview & Core Concept

- **What It Does**: Enables two or more peers anywhere on the internet to establish an authenticated, end-to-end encrypted tunnel using a human-readable 6-character Wormhole Code (e.g., `742-cobalt-falcon`) or shareable link. Once paired, users can drag-and-drop files of any type, inspect real-time NAT traversal paths, verify SHA-256 integrity hashes, and download portable standalone executables for offline/desktop deployment.
- **Target Audience / Persona**: Privacy-conscious engineers, systems administrators, and everyday users who need to move sensitive archives, binaries, or documents across segregated networks and strict firewalls without uploading files to third-party cloud storage.
- **Key Value**: Combines the simplicity of a 1-click graphical interface with deep network resilience (ICE candidate probing + automatic TCP/WebSocket tunnel fallback) and zero-install portability via GitHub Releases.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Zero-State & Tunnel Creation (Send / Receive)**: Upon opening AetherTunnel, the user lands in the **Tunnel Workspace**. Dropping one or more files into the staging zone (or clicking *Create Secure Tunnel*) generates a cryptographic session key and a 6-word/code pairing token, immediately beginning ICE candidate gathering.
  2. **Peer Pairing & Automatic NAT Traversal**: The receiving peer enters the pairing code in the *Join Tunnel* input (or opens the direct pairing URL). A real-time connection stepper tracks: *Signaling Handshake* $\rightarrow$ *ICE / STUN Hole-Punching* $\rightarrow$ *DTLS + AES-256-GCM Key Verification* $\rightarrow$ *Tunnel Active*. If direct UDP hole-punching is blocked by a Symmetric NAT, the tunnel seamlessly switches to *Encrypted WebSocket Relay (TCP/443)* without user intervention.
  3. **Live Chunked File Transfer**: Files transfer in 64 KB encrypted chunks with live progress bars, real-time transfer rate (`MB/s`), estimated time remaining (`ETA`), chunk counter, and automatic SHA-256 verification badge upon completion, followed by a one-click browser/disk save.
  4. **NAT & Firewall Diagnostic Prober**: A dedicated workspace tab runs live WebRTC STUN/ICE probes against public STUN servers to detect the user's local IP candidates (`host`), public NAT reflexive address (`srflx`), NAT filtering behavior, UDP/TCP reachability, and simulated firewall bypass readiness.
  5. **GitHub Portable Executable & Release Packager**: A dedicated view where users can download a ready-to-run standalone portable CLI/GUI launcher script, customize their GitHub repository parameters, and download a complete, zero-dependency GitHub Actions release bundle that compiles the app into standalone `.exe` (Windows), `.app`/binary (macOS), and ELF binary (Linux) assets hosted directly on GitHub Releases.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Precision dark network instrument console — high scannability, zero decorative fluff, clear visual hierarchy between active transfer controls and network telemetry.
  - *Color Palette & Mood*:
    - **60% Dominant Canvas**: Deep Slate `#0F172A` (`bg-slate-950`)
    - **30% Structural Surfaces**: Slate Surface `#1E293B` (`bg-slate-900`) with crisp `1px solid` hairline borders (`border-slate-800`)
    - **10% High-Intent Accents**: Sky Cyan `#0EA5E9` for primary tunnel actions; Emerald `#16A34A` for verified E2EE / active direct P2P links; Amber `#D97706` for relay fallback / NAT warnings; Crimson `#DC2626` for integrity or connection errors.
  - *Typography & Hierarchy*:
    - **Display & Navigation**: `Plus Jakarta Sans` (SemiBold 600 / Bold 700, tight tracking)
    - **Body & Controls**: `DM Sans` (Regular 400 / Medium 500, 15px–16px)
    - **Telemetry, Hashes, Speeds & ICE Candidates**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` so byte counters, speeds, and latencies never jitter during live updates.
  - *Component Styling & Layout*:
    - Full-viewport 1440px desktop layout featuring a clean 3-zone Top Bar Contract (Single-line Brand Wordmark on left, 4 single-line workspace navigation links in center, 1 primary *"New Tunnel"* CTA on right) above a balanced 12-column workspace grid.
    - Single-elevation cards (`border border-slate-800 bg-slate-900/70`) with unboxed metadata separated by typographic dots (`·`) and zero nested card sandwiches.
- **Interactive Feedback & Motion**:
  - Instant ($\le 150\text{ms}$) button and tab transitions using compositor-safe `opacity` and `transform`.
  - Real-time chunk progress bars and animated step verification indicators that reflect actual WebSocket signaling and WebRTC DataChannel state changes.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Path Transport (WebRTC DataChannel Primary + WebSocket Encrypted Relay Fallback)**
  - *Chosen Approach*: Negotiate direct browser-to-browser / peer-to-peer WebRTC `RTCDataChannel` connections using multiple public STUN servers (`stun.l.google.com:19302`, `stun.cloudflare.com:3478`), while maintaining a synchronized WebSocket binary/chunk relay channel through the Node/Express server on port 3000.
  - *Why*: Standard P2P tools fail roughly 15–20% of the time when both peers are behind Symmetric NATs or strict corporate firewalls that drop UDP traffic. By automatically falling back to an end-to-end encrypted WebSocket tunnel over standard HTTP/HTTPS ports, transfers succeed 100% of the time while still prioritizing direct P2P speed whenever NAT hole-punching succeeds.
  - *Alternatives Considered*: Pure WebRTC without relay fallback (rejected because it fails on Symmetric NATs) or pure server file upload (rejected because it violates P2P zero-storage privacy and adds latency).

- **Decision 2: Client-Side AES-256-GCM + SHA-256 Integrity Verification**
  - *Chosen Approach*: Perform key derivation (`PBKDF2` $\rightarrow$ `AES-256-GCM`) and per-chunk random IV encryption inside the client before transmitting over either WebRTC or the WebSocket fallback, plus full-file `SHA-256` digest verification upon reassembly.
  - *Why*: Guarantees cryptographic confidentiality and tamper resistance regardless of whether packets traverse direct UDP hole-punching or a fallback relay.
  - *Alternatives Considered*: Relying solely on transport TLS/DTLS (rejected because a fallback relay server could theoretically inspect unencrypted application payloads without client-side E2EE).

- **Decision 3: Standalone Executable Delivery via Portable Bundle & GitHub Releases Workflow**
  - *Chosen Approach*: Because a live cloud preview runs inside a browser sandbox, we provide both (a) a working real-time P2P graphical application right in the window and (b) a **GitHub Release & Portable Binary Generator** that packages a self-contained single-file desktop/CLI runner and automated GitHub Actions `.yml` workflow (`pkg` / Node SEA / Electron-Builder config) so users can publish and download zero-install `.exe`, macOS, and Linux executables directly from their GitHub Releases page.
  - *Why*: Directly fulfills the requirement for a graphical P2P tunnel that can be downloaded and launched as a standalone executable from GitHub without complex installation steps.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Top Bar (Brand · 4 Nav Tabs · Primary CTA)               │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  1. Tunnel Studio    │     │  2. NAT & Firewall   │     │ 3. GitHub Portable   │
│  (Send / Receive UI) │     │  Diagnostic Prober   │     │ Executable Packager  │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ • File Drop & Queue  │     │ • Live ICE Gatherer  │     │ • OS Binary Selector │
│ • Pairing Code Gen   │     │ • Host / Srflx /     │     │   (.exe / macOS /    │
│ • E2EE Key Derivation│     │   Relay Candidate    │     │   Linux AppImage)    │
│ • Chunk Progress &   │     │   Inspector          │     │ • 1-Click Portable   │
│   SHA-256 Verifier   │     │ • NAT Topology &     │     │   Launcher Download  │
│ • Peer Chat / Notes  │     │   UDP Hole-Punch Test│     │ • GitHub Release YML │
└──────────┬───────────┘     └──────────┬───────────┘     └──────────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│           Hybrid P2P Transport & Crypto Engine (Client-Side)                 │
│  • Web Crypto API: PBKDF2 Key Derivation + AES-256-GCM Chunk Cipher + SHA256 │
│  • Primary Path : RTCPeerConnection + RTCDataChannel (STUN Hole-Punching)    │
│  • Fallback Path: Encrypted WebSocket Chunk Tunnel (Symmetric NAT Bypass)    │
└───────────────────┬──────────────────────────────────────┬───────────────────┘
                    │ Direct UDP (ICE/STUN)                │ TCP/WS (Port 3000)
                    ▼                                      ▼
         ┌─────────────────────┐              ┌─────────────────────────┐
         │   Remote Peer Node  │◄────────────►│ Express + WS Signaling  │
         │ (Browser / Portable │              │ & Zero-Knowledge Relay  │
         │  Desktop Binary)    │              │ • Room Pairing Registry │
         └─────────────────────┘              │ • SDP / ICE Exchange    │
                                              │ • Encrypted Chunk Relay │
                                              └─────────────────────────┘
```

- **Data Model & State**:
  - `TunnelSession`: `{ roomId: string, pairingCode: string, role: 'sender' | 'receiver' | 'both', connectionState: 'idle' | 'signaling' | 'hole_punching' | 'connected_p2p' | 'connected_relay' | 'disconnected', transportMode: 'webrtc_direct' | 'websocket_relay', autoFallback: boolean, encryptionKeyFingerprint: string, peers: PeerInfo[] }`
  - `TransferItem`: `{ id: string, name: string, size: number, mimeType: string, totalChunks: number, transferredChunks: number, bytesTransferred: number, speedBps: number, status: 'queued' | 'encrypting' | 'transferring' | 'verifying' | 'completed' | 'error', sha256: string, verified: boolean, downloadUrl?: string, direction: 'outgoing' | 'incoming' }`
  - `IceCandidateRecord`: `{ id: string, foundation: string, component: string, protocol: 'udp' | 'tcp', priority: number, ip: string, port: number, type: 'host' | 'srflx' | 'prflx' | 'relay', relatedAddress?: string, latencyMs?: number }`

- **Interactive Component & State Mapping**:
  - **Top Navigation Bar**: Switches active view between *Tunnel Studio*, *NAT & Firewall Diagnostics*, *Transfer History & Integrity Log*, and *GitHub Executable Release*, plus a primary *"New Tunnel"* button that resets/initializes a fresh cryptographic room.
  - **Pairing & Code Controller**: Generates a new 6-character alphanumeric/word tunnel code, copies a one-click invite link (`?room=...#key=...`) where the secret key stays in the URL hash fragment (never sent to the server), or connects to an existing code entered by the user. Includes a **"Simulate Loopback Peer"** toggle so a single user testing the app can open an instant local virtual peer or second tab to watch a real end-to-end encrypted transfer and NAT traversal in action.
  - **File Queue & Chunk Engine**:Slices selected files into 64 KB ArrayBuffers, encrypts each chunk with a unique 12-byte IV using `crypto.subtle.encrypt('AES-GCM', ...)`, streams chunks with backpressure control over `RTCDataChannel` (or the WebSocket relay if `transportMode === 'websocket_relay'`), computes the full SHA-256 hash, and triggers a browser file download on the receiver.
  - **NAT Traversal Mode Selector**: Allows switching between *Auto (Direct P2P + Relay Fallback)*, *Force Direct UDP Hole-Punching*, and *Force Firewall Bypass (TCP/WS Encrypted Relay)* to test how the tunnel behaves under different firewall conditions.
  - **GitHub Portable Executable Studio**: Lets the user configure target OS architectures, preview the standalone portable launcher, and download a ready-to-use portable bundle (`.zip` / executable script + `.github/workflows/release-executables.yml`) for publishing single-file executables on GitHub Releases.
