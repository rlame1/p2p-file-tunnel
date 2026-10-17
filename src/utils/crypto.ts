// Web Crypto API End-to-End Encryption (AES-256-GCM + PBKDF2 + SHA-256)

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

  // Derive separate verification fingerprint bits so peers can verify identical keys
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

export async function encryptChunk(
  key: CryptoKey,
  plainChunk: ArrayBuffer,
  chunkIndex: number
): Promise<{ ivBase64: string; ciphertextBase64: string; byteLength: number }> {
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  // Mix chunkIndex into the last 4 bytes of IV for strict ordering awareness
  const view = new DataView(iv.buffer);
  view.setUint32(8, chunkIndex, false);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    plainChunk
  );

  return {
    ivBase64: arrayBufferToBase64(iv.buffer),
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
