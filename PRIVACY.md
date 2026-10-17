# Privacy Policy & Zero-Knowledge Data Statement

**Last Updated:** October 2026  
**Application:** AetherTunnel — Encrypted P2P File Transfer & NAT Traversal Suite

---

## 1. Core Privacy Principle: Zero Data Collection

**AetherTunnel collects, stores, sells, or shares zero personal data.**

We do not use analytics scripts, tracking pixels, telemetry agents, advertising cookies, user accounts, or persistent databases. When you use AetherTunnel—whether via the GitHub Pages web application, the standalone Windows `.exe`, macOS `.command`, Linux `.sh`, or the portable `.html` file—your activity remains strictly between you and the peer(s) you explicitly connect with.

---

## 2. What We Do NOT Collect or Store

- **No File Storage**: Files transferred through AetherTunnel are streamed in ephemeral 64 KB encrypted memory chunks directly from the sender to the receiver. Files are **never** written to disk on any intermediate server, cloud bucket, or database.
- **No Decryption Keys or Passphrases**: All cryptographic keys are derived locally inside your device's memory using the native Web Crypto API (`PBKDF2-HMAC-SHA256` with 100,000 iterations). Neither your Wormhole Pairing Code secret salt nor your optional passphrase is ever transmitted to a server.
- **No Personal Identifiers or Accounts**: AetherTunnel requires no registration, email address, phone number, or login credentials.
- **No Analytics, Telemetry, or Behavioral Tracking**: There is no Google Analytics, Sentry, Mixpanel, or third-party tracking code embedded anywhere in the application.
- **No Persistent Connection Logs**: Ephemeral room codes and WebRTC signaling handshakes exist only in volatile RAM for the duration of an active pairing handshake and are immediately discarded when the peer disconnects.

---

## 3. How Network & Cryptographic Operations Work

To establish a peer-to-peer tunnel across routers, NATs, and firewalls, the following standard network protocols operate transiently during an active session:

1. **STUN / ICE NAT Traversal**:
   - Your client queries public STUN servers (`stun.l.google.com:19302`, `stun.cloudflare.com:3478`) to discover your public IP address and UDP port mapping (`srflx` candidate) so that a direct peer-to-peer connection can be negotiated with the remote peer.
   - As is standard for all peer-to-peer WebRTC connections, the remote peer you choose to pair with via your Wormhole Code will exchange ICE network candidates with your client to establish the direct data path.

2. **End-to-End Authenticated Encryption (`AES-256-GCM`)**:
   - Every file chunk and peer scratchpad note is encrypted on the sender's device using `AES-256-GCM` before transmission and decrypted only in the receiver's RAM.
   - Even if a strict corporate firewall or Symmetric NAT requires encrypted chunks to pass through a WebSocket relay on port 443, the relay acts as a blind, zero-knowledge forwarder that cannot read, decrypt, or modify the ciphertext.

3. **Local Browser / OS Storage**:
   - Received files are held temporarily in browser/application RAM (`Blob` URL) solely so you can save them to your local disk. Closing the application or tab immediately releases all in-memory buffers.

---

## 4. Open Source Transparency & Verifiability

The entire source code of AetherTunnel—including its Web Crypto API implementation (`src/utils/crypto.ts`), NAT diagnostic prober (`src/services/natProber.ts`), standalone executable builder (`scripts/pe-exe-builder.cjs`), and GitHub Actions build pipeline (`.github/workflows/deploy-pages-and-releases.yml`)—is publicly auditable in this repository.

---

## 5. Attribution

AetherTunnel was engineered using **Google AI Studio** with the **Gemini 4 Argon** language model.
