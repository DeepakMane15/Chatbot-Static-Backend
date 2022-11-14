var io = require('socket.io-client');
var socket = io.connect('http://localhost:4002');

class logger {
     log  (data) {
        socket.emit('writeLog',{level:data.level, message:data.message, bid:data.bid});
        return;
    }
}
let logger1 = new logger();
logger1.log({level:'error',message:'hello',bid:'1'})

module.exports={logger};