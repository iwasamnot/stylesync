const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.jsx': 'text/javascript',
  '.ts': 'text/typescript',
  '.tsx': 'text/typescript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL
  let filePath = '.' + req.url;
  
  // Default to index.html
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, try to serve from public folder
        const publicPath = './public' + req.url;
        fs.readFile(publicPath, (publicError, publicContent) => {
          if (publicError) {
            // Still not found, serve index.html for SPA routing
            fs.readFile('./index.html', (indexError, indexContent) => {
              if (indexError) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>File not found: ' + filePath + '</p>');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(indexContent, 'utf-8');
              }
            });
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(publicContent, 'utf-8');
          }
        });
      } else {
        // Some other error
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      // File found, serve it
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Ready for AR testing!');
  console.log('Open http://localhost:' + PORT + ' in your browser');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Server stopped');
  process.exit(0);
});
