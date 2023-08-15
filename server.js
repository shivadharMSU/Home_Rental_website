const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8090;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});