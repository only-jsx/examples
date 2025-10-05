#!/usr/bin/env node

import * as esbuild from 'esbuild';

let ctx = await esbuild.context({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/main.js',
  sourcemap: true,
})

let { host, port } = await ctx.serve({
  servedir: 'dist',
});

console.log(`Server started on http://${host}:${port}`);