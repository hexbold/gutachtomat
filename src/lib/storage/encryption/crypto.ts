/**
 * AES-256-GCM Encryption Module
 *
 * Provides client-side encryption for sensitive data before storing in Supabase.
 * Uses the Web Crypto API for secure encryption operations.
 */

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12; // 96 bits, recommended for GCM
const KEY_LENGTH = 256; // bits

/**
 * Encrypted data payload with IV and auth tag.
 */
export interface EncryptedPayload {
  /** Base64 encoded initialization vector */
  iv: string;
  /** Base64 encoded encrypted data (includes GCM auth tag) */
  ciphertext: string;
}

/**
 * Convert ArrayBuffer to Base64 string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Import a raw key (Uint8Array) as a CryptoKey for AES-GCM.
 *
 * @param rawKey 32-byte key (256 bits)
 * @returns CryptoKey for use with encrypt/decrypt
 */
export async function importKey(rawKey: Uint8Array): Promise<CryptoKey> {
  if (rawKey.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes, got ${rawKey.length}`);
  }

  return crypto.subtle.importKey(
    'raw',
    rawKey.buffer.slice(rawKey.byteOffset, rawKey.byteOffset + rawKey.byteLength) as ArrayBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Import a Base64-encoded key as a CryptoKey.
 *
 * @param base64Key Base64-encoded 32-byte key
 * @returns CryptoKey for use with encrypt/decrypt
 */
export async function importKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const rawKey = new Uint8Array(base64ToArrayBuffer(base64Key));
  return importKey(rawKey);
}

/**
 * Generate a new random 256-bit encryption key.
 *
 * @returns Base64-encoded 32-byte key
 */
export function generateKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return arrayBufferToBase64(key.buffer);
}

/**
 * Encrypt plaintext using AES-256-GCM.
 *
 * @param plaintext The string to encrypt
 * @param key The CryptoKey to use for encryption
 * @returns EncryptedPayload with IV and ciphertext
 */
export async function encrypt(plaintext: string, key: CryptoKey): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random IV for each encryption
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Encrypt with GCM (includes authentication tag)
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return {
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(encrypted),
  };
}

/**
 * Decrypt ciphertext using AES-256-GCM.
 *
 * @param payload The EncryptedPayload to decrypt
 * @param key The CryptoKey to use for decryption
 * @returns The decrypted plaintext string
 * @throws Error if decryption fails (wrong key or tampered data)
 */
export async function decrypt(payload: EncryptedPayload, key: CryptoKey): Promise<string> {
  const iv = new Uint8Array(base64ToArrayBuffer(payload.iv));
  const ciphertext = base64ToArrayBuffer(payload.ciphertext);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: invalid key or corrupted data');
  }
}

/**
 * Encrypt a JSON object.
 *
 * @param data The object to encrypt
 * @param key The CryptoKey to use for encryption
 * @returns EncryptedPayload with IV and ciphertext
 */
export async function encryptJson<T>(data: T, key: CryptoKey): Promise<EncryptedPayload> {
  const json = JSON.stringify(data);
  return encrypt(json, key);
}

/**
 * Decrypt a JSON object.
 *
 * @param payload The EncryptedPayload to decrypt
 * @param key The CryptoKey to use for decryption
 * @returns The decrypted and parsed object
 */
export async function decryptJson<T>(payload: EncryptedPayload, key: CryptoKey): Promise<T> {
  const json = await decrypt(payload, key);
  return JSON.parse(json) as T;
}

/**
 * Convert EncryptedPayload to a format suitable for database storage.
 * Returns a single base64 string combining IV and ciphertext.
 */
export function payloadToStorageFormat(payload: EncryptedPayload): {
  encrypted_data: string;
  iv: string;
} {
  return {
    encrypted_data: payload.ciphertext,
    iv: payload.iv,
  };
}

/**
 * Convert database storage format back to EncryptedPayload.
 */
export function storageFormatToPayload(data: {
  encrypted_data: string;
  iv: string;
}): EncryptedPayload {
  return {
    ciphertext: data.encrypted_data,
    iv: data.iv,
  };
}
