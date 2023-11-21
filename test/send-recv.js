'use strict'

const Net = require('net');

const JSONEnabled = require('../');

const server = new Net.Server();
server.on('connection', socket => {
    console.log('socket connected');
    JSONEnabled(socket);
    socket.on('json-data', data => {
        console.log('recv = ', data);
        socket.sendJSON(data);
    });
    socket.on(JSONEnabled.EVENT_JSON_ERROR, err =>  {
        console.log('server err = ', err);
    });
});

server.listen(3000);

////////////////////

const client = new Net.Socket();
JSONEnabled(client);
client.on('json-data', data => {
    console.log('client recv = ', data);
    // client.sendJSON(data);
});
client.on('json-error', err => {
    console.log('client err = ', err);
});

client.connect(3000, 'localhost');


const data = {
    buff: Buffer.allocUnsafe(4),
    array: [1, 2]
}
// data.b = data;

client.on('connect', () => {
    console.log('client connected.');
    // for (let i = 0; i < 100; ++ i) {
        client.sendJSON(data);
    // }
});

setInterval(() => {
    client.sendJSON(data);
}, 1500);


