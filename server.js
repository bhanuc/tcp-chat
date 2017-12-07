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
                let m = data.toString().replace(/[\n\r]*$/, '').replace(/[^\x00-\x7F]/g, "");
                const [command, meta] = m.split('>');
                switch (command) {
                    case 'change':
                        if (!meta) {
                            socket.write(`join needs a roomname, ex: join csgo\n`);
                        }
                        const {currentRoom} = client;
                        //exit the current room
                        server.rooms[currentRoom].splice(server.rooms[currentRoom].indexOf(client), 1);
                        // join the new room
                        client.currentRoom = meta;
                        server.rooms[meta] && Array.isArray(server.rooms[meta])? server.rooms[meta].push(client):server.rooms[meta] = [client];
                        client.sendMessage(`You have joined: ${meta} \n`);
                        server.history.getHistory(meta).forEach(element => {
                            client.sendMessage(element + '\n');
                        });
                        server.broadcast(meta, `${clientName} joined: ${meta}`, client);
                        break;
                    case 'join':
                        client.currentRoom = meta;
                        server.rooms[meta].push(client);
                        client.sendMessage(`You have joined: ${meta} \n`);
                        server.history.getHistory(meta).forEach(element => {
                            client.sendMessage(element + '\n');
                        });
                        server.broadcast(meta, `${clientName} joined: ${meta}`, client)
                        break;
                    case 'msg':
                        if (meta.length >128) {
                            client.sendMessage(`We only support 128 characters at the moment.`);
                        } else {
                            const {currentRoom} = client;
                            server.history.addMessage(`${clientName} said: ${meta}`, currentRoom)
                            client.sendMessage(`You said: ${meta}`);
                            server.broadcast(client.currentRoom, `${clientName} said: ${meta}`, client)
                        }
                        break;
                    default:
                        socket.write(`Unrecognised command, kindly type 'help' to get started\n`);
                        break;
                }
            });

            socket.on('end', () => {
                const {currentRoom} = client;
                server.rooms[currentRoom].splice(server.rooms[currentRoom].indexOf(client), 1);
                console.log(`${client.name} disconnected from ${currentRoom}`);
                server.broadcast(currentRoom, `${client.name} disconnected from ${currentRoom}`);
            });
            socket.on('error', (err) => {
                console.log(err);
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