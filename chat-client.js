const vorpal = require('vorpal')();
const net = require('net');

const client = new net.Socket();

client.on('data', function (data) {
    this.vorpal.log(data.toString());
});

client.on('close', function () {
    this.vorpal.log('Connection closed');
});
console.log('chat$ Type help to get started')
vorpal
    .command('room', 'returns the connected room')
    .action(function (args, callback) {
        this.log('You are connected to Global');
        callback();
    });
vorpal
    .command('join [ip] [port] [roomName]', 'Allows you to join the server, args are optional')
    .action(function (args, callback) {
        const self = this;
        const roomName = args.roomName || 'global';
        const ip = args.ip || '127.0.0.1';
        const port = args.port || '5000';

        client.connect(port, ip, function () {
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
        client.write(`msg>${msg}`);
        callback();
    });

vorpal
    .command('change <room>', 'Change the room')
    .action(function (args, callback) {
        const self = this;
        const {
            room
        } = args;
        client.write(`change>${room}`);
        callback();
    });


vorpal
    .delimiter('chat$')
    .show();