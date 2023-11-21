# Socket-JSON-Enabled
To be abled to send/receive JSON data over Socket. 

# Usage

Server
```js
const JSONEnabled = require('socket-json-enabled');

const server = new Net.Server();
server.on('connection', socket => {
    JSONEnabled(socket);
    socket.on(SONEnabled.EVENT_JSON_DATA, data => {
        socket.sendJSON(data);
    });
    socket.on(JSONEnabled.EVENT_JSON_ERROR, err =>  {
        console.log('server err = ', err);
    });
});

server.listen(3000);
```
Client
```js
const client = new Net.Socket();
JSONEnabled(client);
client.on(SONEnabled.EVENT_JSON_DATA, data => {
    console.log('client recv = ', data);
});
client.on(JSONEnabled.EVENT_JSON_ERROR, err => {
    console.log('client err = ', err);
});

client.connect(3000, 'localhost');


const data = {
    buff: Buffer.allocUnsafe(4),
    array: [1, 2]
}

client.on('connect', () => {
    console.log('client connected.');
    client.sendJSON(data);
});
```

# Events
* EVENT_JSON_DATA: 'json-data'
* EVENT_JSON_ERROR: 'json-error'


