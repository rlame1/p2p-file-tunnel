# Implementation Plan — Fix PeerJS WebRTC DataChannel Binary Frame Dropping

## Problem Analysis
When establishing a P2P connection via PeerJS (`peer.connect`), the underlying WebRTC DataChannel (`conn.dataChannel`) was registered with `managedByPeerJs = true`. This caused `registerDataChannelLane` to skip assigning `channel.onmessage`. Because PeerJS's internal message handler does not parse custom raw binary frames (`AETH` / `AETP`), incoming file transfer chunks sent across PeerJS DataChannels were completely dropped, resulting in the receiver showing 0% (`0 chunks`) while the sender reached 100%.

## Proposed Changes

### `src/App.tsx`
- **`registerDataChannelLane`**: 
  - Always assign `channel.onmessage` to inspect incoming messages (`ArrayBuffer` or `Blob`).
  - If the message is a binary frame (`ArrayBuffer`), invoke `handleRawBinaryFrame(data)` immediately.
  - If `managedByPeerJs` is true, skip JSON tunnel packets (to avoid duplicate processing of PeerJS JSON control messages) but ALWAYS process binary frames.
- **`conn.on('data'`**:
  - Ensure `conn.on('data', async (raw: any) => { ... })` properly converts `Blob` or binary payloads to `ArrayBuffer` and passes them to `handleRawBinaryFrame`.

## Verification Plan
1. Compile applet using `compile_applet`.
2. Lint codebase using `lint_applet`.
3. Verify cross-browser file transfers successfully receive chunks, update progress from 0% to 100%, and prompt for saving.
