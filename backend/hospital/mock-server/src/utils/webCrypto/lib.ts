import { webcrypto } from 'node:crypto';

type KeyFormat = 'spki' | 'pkcs8' | 'raw';
type NodeCryptoKey = CryptoKey;
type BinaryLike = ArrayBuffer | ArrayBufferView;

export const convertBufferToHexString = (buffer: ArrayBuffer) => {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const convertHexStringToBuffer = (hexString: string) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(hexString, 'hex');
  }

  const hex = hexString.match(/[\da-f]{2}/gi) || [];
  return new Uint8Array(hex.map((item) => Number.parseInt(item, 16))).buffer;
};

export const generateEcdhKeyPair = async (namedCurve = 'P-384') => {
  const { publicKey, privateKey } = (await webcrypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve,
    },
    true,
    ['deriveKey', 'deriveBits'],
  )) as CryptoKeyPair;

  return {
    publicKey: publicKey as unknown as NodeCryptoKey,
    privateKey: privateKey as unknown as NodeCryptoKey,
  };
};

export const deriveAesCbcKey = async (
  clientPrivateKey: NodeCryptoKey,
  serverPublicKey: NodeCryptoKey,
) => {
  const shareKey = await webcrypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: serverPublicKey as unknown as CryptoKey,
    },
    clientPrivateKey as unknown as CryptoKey,
    {
      name: 'AES-CBC',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  return webcrypto.subtle.exportKey('raw', shareKey);
};

export type EcdhKeyUsages = 'deriveKey' | 'deriveBits';

export const importEcdhCryptoKey = (
  key: BinaryLike,
  format: 'spki' | 'pkcs8',
  keyUsages: EcdhKeyUsages[],
  namedCurve = 'P-384',
) => {
  return webcrypto.subtle.importKey(
    format,
    key as BufferSource,
    { name: 'ECDH', namedCurve },
    true,
    keyUsages,
  ) as Promise<NodeCryptoKey>;
};

export const exportEcdhCryptoKey = (key: NodeCryptoKey, format: KeyFormat) => {
  return webcrypto.subtle.exportKey(format, key as unknown as CryptoKey);
};

export const aesCbcEncrypt = async (cipherText: string, keyBuffer: BinaryLike, iv: BinaryLike) => {
  const cipherBuffer = new TextEncoder().encode(cipherText);
  const key = await webcrypto.subtle.importKey(
    'raw',
    keyBuffer as BufferSource,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt'],
  );
  const encrypted = await webcrypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: iv as BufferSource,
      length: 256,
    },
    key,
    cipherBuffer,
  );

  return convertBufferToHexString(encrypted).toUpperCase();
};

export const aesCbcDecrypt = async (cipherText: string, keyBuffer: BinaryLike, iv: BinaryLike) => {
  const cipherBuffer = convertHexStringToBuffer(cipherText);
  const key = await webcrypto.subtle.importKey(
    'raw',
    keyBuffer as BufferSource,
    { name: 'AES-CBC', length: 256 },
    false,
    ['decrypt'],
  );
  const decrypted = await webcrypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: iv as BufferSource,
      length: 256,
    },
    key,
    cipherBuffer as BufferSource,
  );

  return new TextDecoder().decode(decrypted);
};
