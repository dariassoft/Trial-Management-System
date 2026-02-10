#!/usr/bin/env node

/**
 * Script para actualizar version.json antes del build
 * Uso: node scripts/update-version.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const versionFile = path.join(__dirname, '../public/version.json');

// Leer package.json
const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const version = process.env.APP_VERSION || packageJson.version;
const timestamp = new Date().toISOString();
const commit = process.env.GIT_COMMIT || process.env.CI_COMMIT_SHA || 'main';

const versionData = {
  version,
  timestamp,
  commit
};

// Crear directorio si no existe
const dir = path.dirname(versionFile);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));

console.log(`✅ version.json actualizado: ${version} (${timestamp})`);

