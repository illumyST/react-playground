import { RequestHandler } from 'express';
import { readdir } from 'node:fs/promises';
import { Response } from '../../../types/handler';
import { MockDataResp } from '../../../types/router';
import { createResponseError, createResponseOk } from '../../../utils/response';
import { runtimePaths } from '../../../utils/paths';
import { getHistoryStatusFile } from './utils';

export const backupPath = runtimePaths.backup;

export const getBackupList: RequestHandler<
  Record<string, never>,
  { content: string[] },
  void
> = async (_req, res) => {
  const list = await readdir(backupPath, { withFileTypes: true })
    .then((entries) => entries.filter((entry) => entry.isDirectory()).map(({ name }) => name))
    .catch(() => []);

  return res.status(200).json({ content: list });
};

export const getHistoryApiStatus: RequestHandler<
  Record<string, never>,
  Response<MockDataResp[], string>,
  void,
  { status: string; history: string; parents: string[]; filename: string }
> = async (req, res) => {
  const { status, history, parents, filename } = req.query;
  const data = await getHistoryStatusFile([backupPath, history], parents, filename, status);

  if (data !== undefined) {
    return res.status(200).json(createResponseOk(data));
  }

  return res.status(200).json(createResponseError('not found file'));
};
