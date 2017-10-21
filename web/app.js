//Initialise express routing
var express = require('express');
var app = express();
var serv = require('http').Server(app);

//Set public path to client, default to index
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
serv.listen(2000); //Listen for requests on port 2000

console.log("INFO - server has been started.");

var io = require('socket.io')(serv, {});
var nextSocketID = 0;
var SOCKET_LIST = {};

//Listen for connection events
io.sockets.on('connection', function(socket) {
    console.log("INFO - client connected to server.");

    socket.id = nextSocketID++;
    socket.x = 0;
    socket.y = 0;
    SOCKET_LIST[socket.id] = socket;

    //Remove client if disconnected (client sends disconnect automatically)
    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
    })
});

setInterval(function() {
    //Get data from all connected clients
    var pack = [];
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;
        pack.push({
            id: socket.id,
            x: socket.x,
            y: socket.y
        });
    }

    //Send client data to all clients
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

}, 1000/25);
