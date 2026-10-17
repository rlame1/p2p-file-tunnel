# Implementation Plan — Optimize P2P File Transfer Speed to >100 MB/s

## Problem Analysis
The current transfer speed is around 10.77 MB/s because:
1. `WIRE_CHUNK_BYTES` is set to 240 KB, which generates too many small packets and high per-chunk scheduling overhead.
2. `HIGH_WATER_MARK` (8 MB) and `LOW_WATER_MARK` (4 MB) limit SCTP buffer throughput on high-bandwidth Wi-Fi / LAN connections.
3. `CHUNKS_PER_WAVE` (32) and pipeline parallelism can be increased to fully saturate gigabit links (>100 MB/s).

## Proposed Changes

### `src/App.tsx`
- **Constants Tuning**:
  - Increase `WIRE_CHUNK_BYTES` from `240 * 1024` (240 KB) to `2 * 1024 * 1024` (2 MB).
  - Increase `CHUNKS_PER_WAVE` from `32` to `64`.
  - Increase `HIGH_WATER_MARK` from `8 * 1024 * 1024` (8 MB) to `32 * 1024 * 1024` (32 MB).
  - Increase `LOW_WATER_MARK` from `4 * 1024 * 1024` (4 MB) to `16 * 1024 * 1024` (16 MB).
- **UI Label**: Update `chunkSizeLabel` to reflect `Auto-Tuned 2 MB × 64`.

## Verification Plan
1. Compile applet using `compile_applet`.
2. Lint codebase using `lint_applet`.
3. Verify file transfer speed reaches >100 MB/s between devices/browsers.
