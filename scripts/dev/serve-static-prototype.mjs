#!/usr/bin/env node

/**
 * Simple static file server for the WinMix prototype
 * Serves files from docs/prototypes/winmix-static on port 5500
 * 
 * Usage: node scripts/dev/serve-static-prototype.mjs
 * or: npm run prototype:preview
 */

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 5500;
const ROOT_DIR = join(__dirname, '../../docs/prototypes/winmix-static');

// MIME type mappings
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    // Parse URL and handle root path
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remove query string
    filePath = filePath.split('?')[0];
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // Build full file path
    const fullPath = join(ROOT_DIR, filePath);
    
    // Read file
    const data = await readFile(fullPath);
    
    // Determine content type
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Set headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    
    res.end(data);
    
    // Log successful request
    console.log(`✓ ${res.statusCode} ${req.url} [${contentType}]`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.log(`✗ 404 ${req.url}`);
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      console.error(`✗ 500 ${req.url}:`, err.message);
    }
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('🚀 WinMix Static Prototype Server');
  console.log('================================');
  console.log(`📁 Serving: ${ROOT_DIR}`);
  console.log(`🌐 Local:   http://localhost:${PORT}`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✓ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✓ Server stopped');
    process.exit(0);
  });
});
