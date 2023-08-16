const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Import the 'url' module

const port = 8090;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the URL including query parameters
  const filePath = path.join(__dirname, parsedUrl.pathname); // Use the parsed pathname

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
