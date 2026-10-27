import { RequestHandler } from 'express';
import { getConfigWithJson, updateConfigFileWithJson } from '../../utils/config';
import { getCryptoContext } from '../../utils/webCrypto/crypto';

export const getAdminConfigHandler: RequestHandler = async (_req, res) => {
  const config = getConfigWithJson();
  const { publicKeyString } = await getCryptoContext();

  res.status(200).json({
    ...config,
    publicKeyString,
  });
};

export const updateAdminConfigHandler: RequestHandler = (req, res, next) => {
  const { message, isError, error } = updateConfigFileWithJson(JSON.stringify(req.body));

  if (isError) {
    return next(error);
  }

  return res.status(200).json({
    message: '更新成功',
    data: JSON.parse(message || '{}'),
  });
};
