#!/usr/bin/env node


const TCPServer = require('./server');

const PORT = 5000;
const ADDRESS = '127.0.0.1';

const server = new TCPServer(PORT, ADDRESS);

server.init(() => {
  console.log(`TCP-Server started at: ${ADDRESS}:${PORT}`);
});
