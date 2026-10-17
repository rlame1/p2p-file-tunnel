// Web Crypto API End-to-End Encryption (AES-256-GCM + PBKDF2 + SHA-256)
// Direct Binary Engine: Supports 256 KB, 512 KB, 1 MB, and 2 MB Chunks
// with Zero-Copy Raw Binary Frames ('AETH') & SCTP Sub-Frame Slicing ('AETP')

const WORD_LIST_A = [
  'cobalt', 'cipher', 'quantum', 'vortex', 'aether', 'obsidian',
  'titanium', 'helios', 'pulsar', 'zenith', 'aurora', 'vector',
  'prism', 'nexus', 'argon', 'krypton', 'solaris', 'meridian'
];

const WORD_LIST_B = [
  'falcon', 'shield', 'beacon', 'harbor', 'conduit', 'bastion',
  'relay', 'anchor', 'horizon', 'vertex', 'citadel', 'stratum',
  'sentinel', 'circuit', 'bridge', 'matrix', 'quarry', 'keystone'
];

export const BINARY_FRAME_MAGIC = 0x41455448; // 'AETH' (Complete Encrypted Chunk Frame)
export const BINARY_SUBFRAME_MAGIC = 0x41455450; // 'AETP' (SCTP-Safe Zero-Copy Slice of a 512KB–2MB 'AETH' Frame)

// Maximum SCTP payload per RTCDataChannel.send() call (240 KB + 24 B header = 245,784 B < 256 KB limit)
export const MAX_SCTP_SLICE_BYTES = 240 * 1024;

export function generateWormholeCode(): string {
  const randomBytes = new Uint32Array(3);
  window.crypto.getRandomValues(randomBytes);
  const num = (randomBytes[0] % 900) + 100;
  const wordA = WORD_LIST_A[randomBytes[1] % WORD_LIST_A.length];
  const wordB = WORD_LIST_B[randomBytes[2] % WORD_LIST_B.length];
  return `${num}-${wordA}-${wordB}`;
}

export async function deriveTunnelKey(
  wormholeCode: string,
  optionalPassphrase: string = ''
): Promise<{ key: CryptoKey; fingerprint: string }> {
  const encoder = new TextEncoder();
  const normalizedMaterial = `${wormholeCode.trim().toLowerCase()}::${optionalPassphrase.trim()}`;
  const rawKeyMaterial = encoder.encode(normalizedMaterial);
  const salt = encoder.encode('AetherTunnel-E2EE-v1-Salt-2026');

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    rawKeyMaterial,
    { name: 'PBKDF2' },
    false,
    ['deriveKey', 'deriveBits']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const verifyBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode('AetherTunnel-Fingerprint-Salt'),
      iterations: 1000,
      hash: 'SHA-256',
    },
    baseKey,
    64
  );

  const hexArray = Array.from(new Uint8Array(verifyBits)).map((b) =>
    b.toString(16).padStart(2, '0').toUpperCase()
  );
  const fingerprint = `${hexArray[0]}${hexArray[1]} · ${hexArray[2]}${hexArray[3]} · ${hexArray[4]}${hexArray[5]} · ${hexArray[6]}${hexArray[7]}`;

  return { key, fingerprint };
}

// Fast CSPRNG nonce pool to avoid per-chunk syscall overhead
let noncePool = new Uint8Array(12 * 256);
let noncePoolOffset = noncePool.byteLength;

function nextFastIv(chunkIndex: number): Uint8Array {
  if (noncePoolOffset + 12 > noncePool.byteLength) {
    window.crypto.getRandomValues(noncePool);
    noncePoolOffset = 0;
  }
  const iv = noncePool.slice(noncePoolOffset, noncePoolOffset + 12);
  noncePoolOffset += 12;
  new DataView(iv.buffer, iv.byteOffset, 12).setUint32(8, chunkIndex >>> 0, false);
  return iv;
}

/**
 * Zero-Base64 Raw Binary Frame Encryptor for high-speed streaming.
 * Supports large 256 KB, 512 KB, 1 MB, and 2 MB macro-chunks for peak hardware AES-NI speed.
 * Frame Layout (24-byte header + ciphertext):
 *   [0..3]   Uint32 Magic (0x41455448 = 'AETH')
 *   [4..7]   Uint32 transferNumId
 *   [8..11]  Uint32 chunkIndex
 *   [12..23] 12-byte AES-GCM IV
 *   [24..]   AES-256-GCM Ciphertext + 16-byte Auth Tag
 */
export async function encryptChunkBinaryFrame(
  key: CryptoKey,
  plainChunk: ArrayBuffer | Uint8Array,
  transferNumId: number,
  chunkIndex: number
): Promise<ArrayBuffer> {
  const iv = nextFastIv(chunkIndex);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
      tagLength: 128,
    },
    key,
    plainChunk as BufferSource
  );

  const frame = new Uint8Array(24 + encryptedBuffer.byteLength);
  const headerView = new DataView(frame.buffer);
  headerView.setUint32(0, BINARY_FRAME_MAGIC, false);
  headerView.setUint32(4, transferNumId >>> 0, false);
  headerView.setUint32(8, chunkIndex >>> 0, false);
  frame.set(iv, 12);
  frame.set(new Uint8Array(encryptedBuffer), 24);

  return frame.buffer;
}

/**
 * Splits a large 'AETH' binary frame (e.g. 512 KB, 1 MB, or 2 MB) into SCTP-safe
 * 240 KB 'AETP' sub-frames so WebRTC DataChannels can stripe them across multiple parallel lanes
 * without hitting the 256 KB WebRTC SCTP maxMessageSize limit.
 * If the frame is already <= 245,784 bytes, returns [frameBuffer] with zero overhead!
 *
 * 'AETP' Sub-Frame Layout (24-byte header + slice):
 *   [0..3]   Uint32 Magic (0x41455450 = 'AETP')
 *   [4..7]   Uint32 transferNumId
 *   [8..11]  Uint32 chunkIndex
 *   [12..15] Uint32 totalFrameBytes
 *   [16..19] Uint32 byteOffset
 *   [20..21] Uint16 partIndex
 *   [22..23] Uint16 totalParts
 *   [24..]   Raw slice of the 'AETH' frame
 */
export function splitFrameForSctpLanes(frameBuffer: ArrayBuffer): ArrayBuffer[] {
  const totalFrameBytes = frameBuffer.byteLength;
  if (totalFrameBytes <= MAX_SCTP_SLICE_BYTES + 24) {
    return [frameBuffer];
  }

  const mainHeader = new DataView(frameBuffer);
  const transferNumId = mainHeader.getUint32(4, false);
  const chunkIndex = mainHeader.getUint32(8, false);

  const totalParts = Math.ceil(totalFrameBytes / MAX_SCTP_SLICE_BYTES);
  const subFrames: ArrayBuffer[] = new Array(totalParts);
  const srcBytes = new Uint8Array(frameBuffer);

  for (let partIndex = 0; partIndex < totalParts; partIndex++) {
    const byteOffset = partIndex * MAX_SCTP_SLICE_BYTES;
    const sliceLen = Math.min(MAX_SCTP_SLICE_BYTES, totalFrameBytes - byteOffset);
    const subFrame = new Uint8Array(24 + sliceLen);
    const subView = new DataView(subFrame.buffer);

    subView.setUint32(0, BINARY_SUBFRAME_MAGIC, false);
    subView.setUint32(4, transferNumId, false);
    subView.setUint32(8, chunkIndex, false);
    subView.setUint32(12, totalFrameBytes, false);
    subView.setUint32(16, byteOffset, false);
    subView.setUint16(20, partIndex, false);
    subView.setUint16(22, totalParts, false);

    subFrame.set(srcBytes.subarray(byteOffset, byteOffset + sliceLen), 24);
    subFrames[partIndex] = subFrame.buffer;
  }

  return subFrames;
}

/**
 * Zero-Copy Raw Binary Frame Decryptor.
 * Uses typed-array views directly into frameBuffer without copying or Base64 decoding.
 */
export async function decryptChunkBinaryFrame(
  key: CryptoKey,
  frameBuffer: ArrayBuffer
): Promise<{
  transferNumId: number;
  chunkIndex: number;
  plainBuffer: ArrayBuffer;
}> {
  const view = new DataView(frameBuffer);
  const transferNumId = view.getUint32(4, false);
  const chunkIndex = view.getUint32(8, false);
  const iv = new Uint8Array(frameBuffer, 12, 12);
  const ciphertext = new Uint8Array(frameBuffer, 24);

  const plainBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    ciphertext
  );

  return { transferNumId, chunkIndex, plainBuffer };
}

// Fallback Base64 encryptor for small text notes
export async function encryptChunk(
  key: CryptoKey,
  plainChunk: ArrayBuffer,
  chunkIndex: number
): Promise<{ ivBase64: string; ciphertextBase64: string; byteLength: number }> {
  const iv = nextFastIv(chunkIndex);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
      tagLength: 128,
    },
    key,
    plainChunk
  );

  return {
    ivBase64: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    ciphertextBase64: arrayBufferToBase64(encryptedBuffer),
    byteLength: encryptedBuffer.byteLength,
  };
}

export async function decryptChunk(
  key: CryptoKey,
  ivBase64: string,
  ciphertextBase64: string
): Promise<ArrayBuffer> {
  const ivBuffer = base64ToArrayBuffer(ivBase64);
  const cipherBuffer = base64ToArrayBuffer(ciphertextBase64);

  return await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ivBuffer),
      tagLength: 128,
    },
    key,
    cipherBuffer
  );
}

export async function computeSha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await window.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunkSize))
    );
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return '0.00 KB/s';
  return `${formatBytes(bytesPerSec)}/s`;
}
