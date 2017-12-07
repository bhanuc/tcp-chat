'use strict';

class Client {
  
  constructor (socket) {
    const self = this;
    self.address = socket.remoteAddress;
    self.port    = socket.remotePort;
    self.name    = `${self.address}:${self.port}`;
    self.socket  = socket;
    self.currentRoom = 'global';
    self.socket.on('error', (err) => {
        console.log(err, TODO);
    });
  }

  sendMessage (message) {
    this.socket.write(message);
  }

}
module.exports = Client;
