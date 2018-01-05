//Imports
require('./modules/map.js')();
require('./modules/projectile.js')();

//Initialise express routing
let express = require('express');
let app = express();
let serv = require('http').Server(app);
let tickRate = 20; //Updates per second
let MAX_SERVER_CONNECTIONS = 10, MAX_SERVER_PLAYERS = MAX_SERVER_CONNECTIONS; //Max clients connected, max players in game
const DEBUG_ON = true;

//Default route
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

//Play route
app.get('/play', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

//About route
app.get('/about', function(req, res) {
    res.sendFile(__dirname + '/client/about.html');
});

//Allow client to use client directory only
app.use('/client', express.static(__dirname + '/client'));
serv.listen(process.env.PORT || 2000); //Listen for requests

//Listen for connection events
let io = require('socket.io')(serv, {});
let SOCKET_LIST = [];
serverMessage("INFO - Venture Online server has been started.");

io.sockets.on('connection', function(socket) {
    //Deny client connection if too many clients connected
    if(SOCKET_LIST.length + 1 > MAX_SERVER_CONNECTIONS) {
        serverMessage('ALERT - denied client connection. Active connections: ' + SOCKET_LIST.length);
        return;
    }

    //Add socket to list
    socket.id = getNextAvailableArrayIndex(SOCKET_LIST, MAX_SERVER_CONNECTIONS)
    SOCKET_LIST[socket.id] = socket;
    serverMessage("INFO - [CLIENT " + socket.id + "] connected to the server. ");

    //Listen for sign in attempts
    socket.on('signIn', function(data) {
        //Deny player sign in if too many players
        if(Player.list.length + 1 > MAX_SERVER_PLAYERS) {
            serverMessage('ALERT - denied player sign-in on [SLOT ' + socket.id + '].');
            return;
        }

        //Give default username if empty
        if(data.username === '') data.username = "Eddie " + socket.id;

        //Authenticate user
        if(true) {
            Player.onConnect(SOCKET_LIST, socket, data.username);
            socket.emit('signInResponse', {success: true});
            socket.emit('initPack', {socketID: socket.id, map: Player.list[socket.id].map});
            serverMessage("INFO - [CLIENT: " + socket.id + "] signed in as [PLAYER: '" + data.username + "'].");
        } else {
            socket.emit('signInResponse', {success: false});
        }
    });

    //Remove client if disconnected (client sends disconnect automatically)
    socket.on('disconnect', function() {
        serverMessage("INFO - [CLIENT: " + socket.id + "] disconnected from the server.");
        Player.onDisconnect(SOCKET_LIST, socket);
        delete SOCKET_LIST[socket.id];
    });
});

//UPDATE CLIENTS
setInterval(function() {
    //Load package data
    let pack = {
        players: Player.updateAll(),
        projectiles: Projectile.updateAll()
    };

    //Send package data to all clients
    for(let i in Player.list) {
        let socket = SOCKET_LIST[i];
        if(socket == undefined) continue;
        socket.emit('update', pack);
    }

}, 1000 / tickRate);

//Log the server's status
if(DEBUG_ON) {
    setInterval(function() {
        serverMessage('SERVER STATUS: RUNNING / CLIENT COUNT: ' + getArrayIndexesInUse(SOCKET_LIST) + ' / PLAYER COUNT: ' + getArrayIndexesInUse(Player.list));
    }, 5000);
}

