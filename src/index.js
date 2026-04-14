import { createServer } from 'http';
import { readFile, writeFile, unlink, mkdir, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { port: 3000, dir: '.' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) options.port = parseInt(args[i + 1], 10);
    if (args[i] === '--dir' && args[i + 1]) options.dir = args[i + 1];
  }
  return options;
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function getFilePath(baseDir, urlPath) {
  const path = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
  return resolve(baseDir, path);
}

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types = {
    html: 'text/html', htm: 'text/html',
    css: 'text/css', js: 'application/javascript', mjs: 'application/javascript',
    json: 'application/json', xml: 'application/xml',
    txt: 'text/plain', md: 'text/markdown',
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml',
    pdf: 'application/pdf', zip: 'application/zip'
  };
  return types[ext] || 'application/octet-stream';
}

async function handleRequest(req, res, baseDir) {
  const { url: urlPath, method } = req;
  const filePath = getFilePath(baseDir, urlPath);

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  if (!urlPath || urlPath === '/') {
    return sendError(res, 400, 'Missing path');
  }

  if (!filePath.startsWith(resolve(baseDir))) {
    return sendError(res, 403, 'Forbidden');
  }

  try {
    await ensureDir(baseDir);

    if (method === 'GET') {
      const data = await readFile(filePath);
      const contentType = getContentType(urlPath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    }
    else if (method === 'PUT' || method === 'POST') {
      await ensureDir(dirname(filePath));
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      await writeFile(filePath, Buffer.concat(chunks));
      sendJson(res, 201, { success: true, path: urlPath });
    }
    else if (method === 'DELETE') {
      await unlink(filePath);
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*'
      });
      res.end();
    }
    else {
      sendError(res, 405, 'Method not allowed');
    }
  } catch (err) {
    if (err.code === 'ENOENT' && method === 'GET') {
      sendError(res, 404, 'File not found');
    } else if (err.code === 'ENOENT' && (method === 'PUT' || method === 'POST')) {
      sendError(res, 500, 'Failed to create file');
    } else if (err.code === 'ENOENT' && method === 'DELETE') {
      sendError(res, 404, 'File not found');
    } else if (err.code === 'EISDIR') {
      sendError(res, 400, 'Path is a directory');
    } else {
      sendError(res, 500, err.message);
    }
  }
}

export function start(options = {}) {
  const { port = 3000, dir = '.' } = options;
  const baseDir = resolve(dir);

  const server = createServer((req, res) => handleRequest(req, res, baseDir));
  server.listen(port, () => {
    console.log(`htcrud server running on http://localhost:${port}, dir: ${baseDir}`);
  });
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs();
  start(options);
}