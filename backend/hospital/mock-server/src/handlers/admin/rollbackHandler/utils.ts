import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { MockDataResp } from '../../../types/router';
import { runtimePaths } from '../../../utils/paths';

export const backupPath = runtimePaths.backup;
export const dataPath = runtimePaths.apis;

export const getAllApiStatusFiles = (source: string[], parents: string[], fileName: string) => {
  return readdir(path.join(...source, ...parents), { withFileTypes: true }).then((entries) =>
    entries
      .filter((entry) => entry.isFile() && entry.name.startsWith(fileName))
      .map((entry) => [...parents, entry.name]),
  );
};

export const replaceFiles = (allPaths: string[][], sourceRoot: string[], targetRoot: string[]) => {
  return Promise.allSettled(
    allPaths.map(async (sourcePath) => {
      const targetFile = path.join(...targetRoot, ...sourcePath);
      await mkdir(path.dirname(targetFile), { recursive: true });
      const data = await readFile(path.join(...sourceRoot, ...sourcePath), 'utf-8');
      await writeFile(targetFile, data);
    }),
  );
};

export const rollbackApiAllStatus = (target: string, folderPath: string[], fileName: string) => {
  return getAllApiStatusFiles([backupPath, target], folderPath, fileName).then((allPaths) =>
    replaceFiles(allPaths, [backupPath, target], [dataPath]),
  );
};

export const getHistoryStatusFile = async (
  source: string[],
  parents: string[],
  fileName: string,
  status: string,
) => {
  const allStatusFiles = await getAllApiStatusFiles(source, parents, fileName);
  const apiStatusFilePath = allStatusFiles.find((paths) => paths.at(-1)?.includes(status));

  if (!apiStatusFilePath) {
    return undefined;
  }

  return readFile(path.join(...source, ...apiStatusFilePath), 'utf-8')
    .then((data) => JSON.parse(data) as MockDataResp[])
    .catch(() => undefined);
};
