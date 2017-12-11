const vorpal = require('vorpal')();
const net = require('net');

const client = new net.Socket();

client.on('data', function (data) {
  this.vorpal.log(data.toString());
});

client.on('close', function () {
  this.vorpal !== undefined ? this.vorpal.log('connection stopped or cannot connect, client will exit') : console.log('connection stopped or cannot connect, client will exit');
});
client.on('error', function () {
  this.vorpal ? this.vorpal.log('Seems the default server is not running, kindly pass in correct server configuration') : console.log('Seems you are not connected to the server, kindly connect to a server');
});


console.log('chat$ Type help to get started');
vorpal
  .command('room', 'returns the connected room')
  .action(function (args, callback) {
    this.log('You are connected to Global');
    callback();
  });
vorpal
  .command('join [ip] [port] [roomName]', 'Allows you to join the server, args are optional when using default config for server')
  .action(function (args, callback) {
    const self = this;
    const roomName = args.roomName || 'global';
    const ip = args.ip || '127.0.0.1';
    const port = args.port || '5000';
    client.connect(port, ip, () => {
      client.vorpal = self;
      client.write(`join>${roomName}`);
      callback();
    });
  });


vorpal
  .command('msg <msg>', 'sends a msg')
  .action(function (args, callback) {
    const msg = this.commandObject._parent._command.command.split('msg ')[1];
    const self = this;
    try {
      client.write(`msg>${msg}`);
    } catch (error) {
      vorpal.log('Either you have not joined a server or your connection to the server has dropped.');
    }

    callback();
  });

vorpal
  .command('change <room>', 'Change the room')
  .action(function (args, callback) {
    const self = this;
    const {
      room,
    } = args;
    client.write(`change>${room}`);
    callback();
  });


vorpal
  .delimiter('chat$')
  .show();
