# Implementation Plan — Fix PeerJS Binary Blob Handling for Cross-Browser P2P File Transfers

## Problem Analysis
When testing file transfers between two different browsers or devices via PeerJS WebRTC DataChannels (`conn.on('data')`), incoming binary data chunks (`AETH` frames) arrive as `Blob` objects. Unlike WebRTC native data channels or WebSocket relays, `conn.on('data')` did not convert `Blob` instances into `ArrayBuffer` objects. As a result, `raw instanceof ArrayBuffer` returned `false`, and incoming file chunks were silently dropped, causing the transfer to remain stuck at 0% (`0 / totalChunks`).

## Proposed Changes

### `src/App.tsx`
- In `bindPeerJsDataConn`, update the `conn.on('data', async (raw: any) => { ... })` event listener to check if `raw instanceof Blob`, and if so, convert it to `ArrayBuffer` via `await raw.arrayBuffer()`.
- Ensure that once converted to `ArrayBuffer`, `handleRawBinaryFrame` correctly processes the binary frame, decrypts it, records the chunk, updates progress, and triggers the file save prompt when 100% complete.

## Verification Plan
1. Compile applet using `compile_applet`.
2. Lint codebase using `lint_applet`.
3. Verify that cross-browser file transfers receive chunks correctly and prompt for saving upon completion.
