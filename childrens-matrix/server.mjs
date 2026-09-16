#!/usr/bin/env node
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateChildrenMatrix } from './engine/service.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 8790);
const HOST = process.env.HOST || '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function safeStaticPath(urlPath) {
  const cleaned = decodeURIComponent(urlPath.split('?')[0]);
  const rel = cleaned === '/' ? '/index.html' : cleaned;
  const full = normalize(join(__dirname, rel));
  if (!full.startsWith(__dirname)) return null;
  return full;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);

    if (req.method === 'GET' && url.pathname === '/health') {
      return sendJson(res, 200, {
        ok: true,
        service: 'childrens-matrix',
        port: PORT,
        methodology: 'destiny-matrix-22 / children-v1',
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/children-matrix/calculate') {
      try {
        const body = await readBody(req);
        const result = calculateChildrenMatrix(body);
        return sendJson(res, 200, result);
      } catch (err) {
        return sendJson(res, 400, {
          ok: false,
          error: err?.message || 'We couldn\'t calculate the child\'s matrix. Please check the birth date and try again.',
        });
      }
    }

    if (req.method === 'GET') {
      const filePath = safeStaticPath(url.pathname);
      if (!filePath || !existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Not found');
      }
      const type = TYPES[extname(filePath)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      return createReadStream(filePath).pipe(res);
    }

    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
  } catch (err) {
    sendJson(res, 500, { ok: false, error: 'Unexpected server error.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Children's Destiny Matrix listening at http://${HOST}:${PORT}/`);
});
