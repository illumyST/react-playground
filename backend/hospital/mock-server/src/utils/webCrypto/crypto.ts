import { getConfigWithJson } from '../config';
import {
  aesCbcDecrypt,
  aesCbcEncrypt,
  convertBufferToHexString,
  convertHexStringToBuffer,
  deriveAesCbcKey,
  exportEcdhCryptoKey,
  generateEcdhKeyPair,
  importEcdhCryptoKey,
} from './lib';

type CryptoContext = {
  publicKeyString: string;
  decryptFn: (payload: string, clientKey: string) => Promise<string>;
  encryptFn: (payload: string, clientKey: string) => Promise<string>;
};

const createContext = async (namedCurve: string): Promise<CryptoContext> => {
  const { privateKey, publicKey } = await generateEcdhKeyPair(namedCurve);
  const publicKeyBuffer = await exportEcdhCryptoKey(publicKey, 'spki');
  const publicKeyString = (await convertBufferToHexString(publicKeyBuffer)).toUpperCase();

  const getShareKey = async (clientKey: string) => {
    const serverPublicCryptoKey = await importEcdhCryptoKey(
      convertHexStringToBuffer(clientKey),
      'spki',
      [],
      namedCurve,
    );

    return deriveAesCbcKey(privateKey, serverPublicCryptoKey);
  };

  const decryptFn = async (payload: string, clientKey: string) => {
    const shareKey = await getShareKey(clientKey);
    return aesCbcDecrypt(payload, shareKey, shareKey.slice(0, 16));
  };

  const encryptFn = async (payload: string, clientKey: string) => {
    const shareKey = await getShareKey(clientKey);
    return aesCbcEncrypt(payload, shareKey, shareKey.slice(0, 16));
  };

  return {
    publicKeyString,
    decryptFn,
    encryptFn,
  };
};

let context: Promise<CryptoContext> | undefined;

export const getCryptoContext = async (options: { reset?: boolean } = {}) => {
  if (context && !options.reset) {
    return context;
  }

  const config = getConfigWithJson();
  context = createContext(config.crypto?.namedCurve || 'P-384');
  return context;
};
