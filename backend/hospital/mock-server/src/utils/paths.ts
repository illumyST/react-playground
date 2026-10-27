import path from 'node:path';

const serverRoot = path.resolve(__dirname, '..', '..');

export const runtimePaths = {
  root: serverRoot,
  apis: path.join(serverRoot, 'src', 'apis'),
  backup: path.join(serverRoot, 'src', 'backup'),
  configs: path.join(serverRoot, 'src', 'configs'),
  scenarios: path.join(serverRoot, 'src', 'scenarios'),
};
