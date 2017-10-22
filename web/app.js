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
var nextSocketID = 0;
var SOCKET_LIST = {};

class Entity {
    constructor() {
        this.id = "";
        this.x = 250;
        this.y = 250;
        this.spdX = 0;
        this.spdY = 0;
    }

    update() {
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.spdX;
        this.y += this.spdY;
    }
}

class Player extends Entity {
    constructor(id) {
        super();
        this.id = id;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.maxSpd = 10;
        Player.list[id] = this;
    }

    update() {
        this.updateSpd();
        super.update();
    }

    updateSpd() {
        if(this.pressingRight) this.spdX = this.maxSpd;
        else if(this.pressingLeft) this.spdX = -this.maxSpd;
        else this.spdX = 0;

        if(this.pressingUp) this.spdY = -this.maxSpd;
        else if(this.pressingDown) this.spdY = this.maxSpd;
        else this.spdY = 0;
    }
}

Player.list = {};
Player.onConnect = function(socket) {
    //Create player and add to list
    var player = new Player(socket.id);

    //Listen for input events
    socket.on('keyPress', function(data) {
        if(data.inputId === 'left') player.pressingLeft = data.state;
        if(data.inputId === 'right') player.pressingRight = data.state;
        if(data.inputId === 'up') player.pressingUp = data.state;
        if(data.inputId === 'down') player.pressingDown = data.state;
    });
}

Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
}

Player.update = function() {
    //Get data from all connected players
    var pack = [];
    for(var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push({
            id: player.id,
            x: player.x,
            y: player.y
        });
    }
    return pack;
}

//Listen for connection events
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    //Add socket to list
    socket.id = nextSocketID++;
    SOCKET_LIST[socket.id] = socket;
    console.log("INFO - client " + socket.id + " connected to the server.");

    Player.onConnect(socket);

    //Remove client if disconnected (client sends disconnect automatically)
    socket.on('disconnect', function() {
        console.log("INFO - client " + socket.id + " disconnected from the server.");
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
});

setInterval(function() {
    var pack = Player.update();

    //Send player data to all clients
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

}, 1000/25);
