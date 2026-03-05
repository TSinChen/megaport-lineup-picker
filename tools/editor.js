const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const HTML_FILE = path.join(__dirname, 'editor.html');

const MIME = {
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  // Serve images
  if (req.url.startsWith('/images/')) {
    const filePath = path.join(PUBLIC_DIR, path.basename(req.url));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // Serve data files
  if (req.url.startsWith('/data/')) {
    const filePath = path.join(DATA_DIR, path.basename(req.url));
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // Default: serve HTML
  const html = fs.readFileSync(HTML_FILE, 'utf-8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Lineup Editor running at http://localhost:${PORT}`);
});
