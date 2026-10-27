import fs from 'node:fs';
import path from 'node:path';
import configDefaultData from '../configs/config-default.json';
import { ConfigType } from '../types/config';
import { runtimePaths } from './paths';

export const configPath = runtimePaths.configs;
const configFile = path.join(configPath, 'config.json');

export const getConfigWithJson = (): Partial<ConfigType> => {
  try {
    createConfigWithJson();
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
  } catch (error) {
    console.error('getConfigWithJson error:', error);
    return {};
  }
};

export const createConfigWithJson = () => {
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
  }

  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(configDefaultData));
  }
};

export const updateConfigFileWithJson = (data: string) => {
  try {
    createConfigWithJson();
    fs.writeFileSync(configFile, data);

    return {
      message: data,
      isError: false,
    };
  } catch (error) {
    console.error('updateConfigFileWithJson error:', error);
    return {
      error,
      isError: true,
    };
  }
};
