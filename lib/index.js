'use strict'

const EVENT_JSON_DATA = 'json-data';
const EVENT_JSON_ERROR = 'json-error';

function onData (buffer) {
    if (!this.buffer) {
        this.buffer = Buffer.from(buffer);
    } else {
        this.buffer = Buffer.concat([this.buffer, buffer]);   
    }

    while (this.buffer) {
        const length = this.buffer.readUInt16BE();
        if (this.buffer.length >= (length + 4)) {
            const crc = this.buffer.readUInt16BE(2 + length);
            if (length === crc) {
                try {
                    const str = this.buffer.toString('utf8', 2, length + 2);
                    const data = JSON.parse(str);
                    this.emit(EVENT_JSON_DATA, data);
                } catch (err) {
                    this.emit(EVENT_JSON_ERROR, err);
                }
            } else {
                this.emit(EVENT_JSON_ERROR, new Error('crc check failed.'));
            }
            if (this.buffer.length === (length + 4)) {
                this.buffer = null;
            } else {
                this.buffer = this.buffer.slice(4 + length);
            }                
        } else {
            break;
        }
    }
}   

function sendJSON (data) {
    try {
        const str = JSON.stringify(data);
        const buffer = Buffer.allocUnsafe(str.length + 4);
        buffer.writeUInt16BE(str.length);
        buffer.write(str, 2, str.length),
        buffer.writeUInt16BE(str.length, 2 + str.length);

        return this.write(buffer);
    } catch (err) {
        throw err;
    }
}

function attach (socket) {
    socket.buffer = null;
    socket.on('data',  onData.bind(socket));
    socket.sendJSON = sendJSON.bind(socket);

    return socket;
}
module.exports = attach;
module.exports.EVENT_JSON_DATA = EVENT_JSON_DATA;
module.exports.EVENT_JSON_ERROR = EVENT_JSON_ERROR;