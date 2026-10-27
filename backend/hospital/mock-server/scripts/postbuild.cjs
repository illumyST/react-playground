const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(path.join(rootDir, 'Web.config'), path.join(distDir, 'Web.config'));

const backupSource = path.join(rootDir, 'public', 'backup.bat');
const backupDir = path.join(distDir, 'backup');
fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(backupSource, path.join(backupDir, 'backup.bat'));
