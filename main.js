#!/usr/bin/env node
'use strict';

const tcpServer = require('./server');

const PORT = 5000;
const ADDRESS = "127.0.0.1"

const server = new tcpServer(PORT, ADDRESS);

server.init(() => {
  console.log(`TCP-Server started at: ${ADDRESS}:${PORT}`);
});