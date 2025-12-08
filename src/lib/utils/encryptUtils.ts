/**
 * Encryption utilities for decrypting preview tokens (server-side only)
 */

import crypto from 'crypto';

/**
 * Get decryption key from environment variable
 */
const getDecryptionKey = (): string => {
  return process.env.SECRET_PREVIEW_TOKEN || '';
};

/**
 * Decrypt string encrypted with AES-256-CBC (server-side only)
 * @param encryptedData - Base64 encoded encrypted string (format: iv:encryptedData)
 * @param key - Decryption key (optional, will use env variable if not provided)
 * @returns Decrypted string
 */
export const decrypt = (encryptedData: string, key?: string): string => {
  const decryptionKey = key || getDecryptionKey();
  
  if (!decryptionKey) {
    throw new Error('Decryption key is required. Set SECRET_PREVIEW_TOKEN');
  }
  
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    // Fallback: try base64 decode if format is wrong (backward compatibility)
    try {
      return Buffer.from(encryptedData, 'base64').toString('utf-8');
    } catch {
      throw new Error('Invalid encrypted data format');
    }
  }
  
  const [ivBase64, encrypted] = parts;
  const iv = Buffer.from(ivBase64, 'base64');
  const algorithm = 'aes-256-cbc';
  const keyBuffer = Buffer.from(decryptionKey.slice(0, 32).padEnd(32, '0'));
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

export const encryptUtils = {
  decrypt
};

