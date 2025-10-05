#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { copyFile } from 'node:fs/promises';

await esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/main.js',
  sourcemap: true,
})

await copyFile('src/index.html', 'dist/index.html');
await copyFile('src/favicon.ico', 'dist/favicon.ico');
await copyFile('src/index.css', 'dist/index.css');