#!/usr/bin/env node
import { start } from './src/index.js';

const args = process.argv.slice(2);
const options = { port: 3000, dir: '.' };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) options.port = parseInt(args[i + 1], 10);
  if (args[i] === '--dir' && args[i + 1]) options.dir = args[i + 1];
}
start(options);