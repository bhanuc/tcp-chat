'use strict';
const net = require('net');
const Client = require('./client');
const Store = require('./store');

class Server {
    constructor(port, address) {
        this.port = port || 5000;
        this.address = address || '127.0.0.1';
        this.rooms = {
            'global': []
        };
        this.history = new Store(128);
    }

    init(callback) {
        const server = this;
        server.connection = net.createServer((socket) => {
            let client = new Client(socket);
            const clientName = client.name;
            server.broadcast('global', `${client.name} connected.\n`, client);

            server.rooms.global.push(client);

            socket.on('data', (data) => {
                let m = data.toString().replace(/[\n\r]*$/, '');
                console.log(`${clientName} said: ${m}`);
                socket.write(`We got your message (${m}). Thanks!\n`);
                server.broadcast('global', `${clientName} said: ${m}`, client)
            });

            socket.on('end', () => {
                const {currentRoom} = client;
                server.rooms[currentRoom].clients.splice(server.rooms[currentRoom].clients.indexOf(client), 1);
                console.log(`${client.name} disconnected from ${currentRoom}`);
                server.broadcast(currentRoom, `${client.name} disconnected from ${currentRoom}`);
            });
        });

        this.connection.listen(this.port, this.address);

        this.connection.on('listening', callback);
    }

    broadcast(room, message, clientSender) {
        const clients = this.rooms[room];
        clients.forEach((client) => {
            if (client === clientSender)
                return;
            client.sendMessage(message);
        });
        console.log(message.replace(/\n+$/, ""));
    }
}
module.exports = Server;