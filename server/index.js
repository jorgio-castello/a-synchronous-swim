const MessagesClass = require('./js/messageQueue.js');
let userCommands = new MessagesClass();


const keypressHandler = require('./js/keypressHandler');
keypressHandler.initialize(message => userCommands.enqueue.call(userCommands, message));

const httpHandler = require('./js/httpHandler');
httpHandler.initialize(userCommands); //pass our class to the initialize


const http = require('http');
const server = http.createServer(httpHandler.router);

const port = 3000;
const ip = '127.0.0.1';
server.listen(port, ip);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${ip}:${port}`);
