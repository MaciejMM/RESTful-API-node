const http = require('http');
const app = require('./app');
const { post } = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
console.log(`Server running at port ${port}...`)
server.listen(port);