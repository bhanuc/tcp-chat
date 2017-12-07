const vorpal = require('vorpal')();

vorpal
    .command('room', 'returns the connected room')
    .action(function(args, callback) {
        this.log('You are connected to Global');
        callback();
    });
vorpal
.command('join room <roomName>', 'Allows you to join the server')
.action(function(args, callback) {
    const self = this;
    const {roomName} = args;
    this.log('you joined room ', roomName);
    callback();
});


vorpal
.command('s <msg>', 'sends a msg')
.action(function(args, callback) {
    const self = this;
    const {msg} = args;
  this.log('msg', msg);
  callback();
});


vorpal
.delimiter('chat$')
.show();