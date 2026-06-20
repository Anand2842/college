const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello');
});
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 3000');
});
