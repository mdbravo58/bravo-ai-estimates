// Client-side encryption utilities for sensitive data
// Note: This provides an additional layer of security, but server-side encryption is primary

export class DataEncryption {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  // Generate a key for encryption (in production, this should be derived from user credentials)
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  // Derive key from password (for user-specific encryption)
  static async deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
      "raw",
      this.encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  // Encrypt sensitive data
  static async encryptData(data: string, key: CryptoKey): Promise<{ encryptedData: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = this.encoder.encode(data);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      encryptedData: this.arrayBufferToBase64(encryptedBuffer),
      iv: this.arrayBufferToBase64(iv.buffer)
    };
  }

  // Decrypt sensitive data
  static async decryptData(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
    const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
    const ivBuffer = this.base64ToArrayBuffer(iv);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(ivBuffer),
      },
      key,
      encryptedBuffer
    );

    return this.decoder.decode(decryptedBuffer);
  }

  // Utility functions
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Hash sensitive data for comparison (one-way)
  static async hashData(data: string): Promise<string> {
    const encodedData = this.encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
    return this.arrayBufferToBase64(hashBuffer);
  }

  // Secure data wiping for sensitive variables
  static secureWipe(sensitiveString: string): void {
    // In JavaScript, we can't truly wipe memory, but we can overwrite the reference
    // This is more of a symbolic security practice
    if (typeof sensitiveString === 'string') {
      // Overwrite with random data (conceptual - JS strings are immutable)
      sensitiveString = crypto.getRandomValues(new Uint8Array(sensitiveString.length))
        .reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    }
  }
}

// Hook for secure data handling
import { useState, useCallback } from 'react';

export const useSecureData = () => {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  const initializeEncryption = useCallback(async (password?: string) => {
    try {
      if (password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await DataEncryption.deriveKeyFromPassword(password, salt);
        setEncryptionKey(key);
        // Store salt securely (in production, this would be handled server-side)
        localStorage.setItem('encryption_salt', DataEncryption['arrayBufferToBase64'](salt.buffer));
      } else {
        const key = await DataEncryption.generateKey();
        setEncryptionKey(key);
      }
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
    }
  }, []);

  const encryptSensitiveData = useCallback(async (data: string) => {
    if (!encryptionKey) {
      throw new Error('Encryption not initialized');
    }
    return await DataEncryption.encryptData(data, encryptionKey);
  }, [encryptionKey]);

  const decryptSensitiveData = useCallback(async (encryptedData: string, iv: string) => {
    if (!encryptionKey) {
      throw new Error('Encryption not initialized');
    }
    return await DataEncryption.decryptData(encryptedData, iv, encryptionKey);
  }, [encryptionKey]);

  return {
    initializeEncryption,
    encryptSensitiveData,
    decryptSensitiveData,
    isReady: !!encryptionKey
  };
};

export default DataEncryption;