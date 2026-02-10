#!/usr/bin/env node
/**
 * Script para cargar variables del .env.production
 * Se ejecuta antes del build de Nuxt
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = path.join(__dirname, '..', '.env.production');

console.log('🔨 Cargando variables de producción...');
console.log(`📂 Archivo: ${envFile}`);
console.log('');

if (!fs.existsSync(envFile)) {
  console.error(`❌ Error: No se encontró ${envFile}`);
  process.exit(1);
}

// Leer el archivo .env.production
const envContent = fs.readFileSync(envFile, 'utf-8');
const lines = envContent.split('\n');

let variablesLoaded = 0;

// Procesar cada línea
lines.forEach((line) => {
  // Saltar líneas vacías y comentarios
  if (!line.trim() || line.trim().startsWith('#')) {
    return;
  }

  // Parsear variable
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    // Establecer variable de entorno
    process.env[trimmedKey] = trimmedValue;

    // Mostrar (sin mostrar valores sensibles si es una contraseña)
    if (trimmedKey.includes('PASSWORD') || trimmedKey.includes('SECRET') || trimmedKey.includes('TOKEN')) {
      console.log(`  ✓ ${trimmedKey}=****`);
    } else {
      console.log(`  ✓ ${trimmedKey}=${trimmedValue}`);
    }

    variablesLoaded++;
  }
});

console.log('');
console.log(`✅ ${variablesLoaded} variable(s) cargada(s)`);
console.log('');

