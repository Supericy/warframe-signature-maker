var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// var mongo = require('mongodb').MongoClient;
//
// mongo.connect('mongodb://localhost:27017/test', function (err, db) {
//
// });

console.log('hmmm, test?');

function newConnection(socket) {
    console.log('new connection');
}

function start() {
    io.on('connection', newConnection);

    server.listen(8080);
}

function emitGameEvent(event) {
    io.emit('game-event', event);
}

// start();

exports.start = start;
exports.emitGameEvent = emitGameEvent;
