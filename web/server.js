//Initialise express routing
var express = require('express');
var app = express();
var serv = require('http').Server(app);

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

app.use('/client', express.static(__dirname + '/client'));
serv.listen(2000); //Listen for requests on port 2000

console.log("INFO - server has been started.");
var nextSocketID = 0;
var SOCKET_LIST = {};
var DEBUG = true;

//*****************************
// ENTITY CLASS
//*****************************
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

    getDistance(pt) {
        return Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
    }
}

//*****************************
// PLAYER CLASS
//*****************************
class Player extends Entity {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingAttack = false;
        this.mouseAngle = 0;
        this.maxSpd = 10;
        Player.list[id] = this;
        initPack.players.push({
            id: this.id,
            x: this.x,
            y: this.y
        });
    }

    update() {
        this.updateSpd();
        super.update();
        if(this.pressingAttack) {
            this.shootProjectile(this.mouseAngle - 10);
            this.shootProjectile(this.mouseAngle);
            this.shootProjectile(this.mouseAngle + 10);
        }
    }


    shootProjectile(angle) {
        var p = new Projectile(this.id, angle);
        p.x = this.x;
        p.y = this.y;
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
Player.onConnect = function(socket, username) {
    //Create player and add to list
    var player = new Player(socket.id, username);

    //Listen for input events
    socket.on('keyPress', function(data) {
        if(data.inputId === 'left') player.pressingLeft = data.state;
        if(data.inputId === 'right') player.pressingRight = data.state;
        if(data.inputId === 'up') player.pressingUp = data.state;
        if(data.inputId === 'down') player.pressingDown = data.state;
        if(data.inputId === 'attack') player.pressingAttack = data.state;
        if(data.inputId === 'mouseAngle') player.mouseAngle = data.state;
    });
}

Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
    removePack.players.push(socket.id);
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

//*****************************
// PROJECTILE CLASS
//*****************************
class Projectile extends Entity {
    constructor(parent, angle) {
        super();
        this.id = Math.random();
        this.parent = parent;
        this.spdX = Math.cos(angle / 180 * Math.PI) * 10;
        this.spdY = Math.sin(angle / 180 * Math.PI) * 10;
        this.timer = 0;
        this.isActive = true;
        this.lifeTime = 100; //Ticks
        Projectile.list[this.id] = this;
        initPack.projectiles.push({
            id: this.id,
            x: this.x,
            y: this.y
        });
    }

    update() {
        if(this.time++ > this.lifeTime) this.isActive = false;
        super.update();

        for(var i in Player.list) {
            var p = Player.list[i];

            //Check for collision between player and projectiles
            if(super.getDistance(p) < 32 && this.parent !== p.id) {
                this.isActive = false;
            }
        }
    }
}
Projectile.list = {};

Projectile.update = function() {
    //Get data from all connected players
    var pack = [];
    for(var i in Projectile.list) {
        var projectile = Projectile.list[i];
        projectile.update();
        if(!projectile.isActive) {
            delete Projectile.list[i];
            removePack.projectiles.push(projectile.id);
        }
        pack.push({
            id: projectile.id,
            x: projectile.x,
            y: projectile.y
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
    console.log("INFO - [CLIENT " + socket.id + "] connected to the server.");

    //Listen for sign in attempts
    socket.on('signIn', function(data) {
        if(true) {
            Player.onConnect(socket, data.username);
            socket.emit('signInResponse', {success: true});
            console.log("INFO - [CLIENT: " + socket.id + "] signed in as [PLAYER: " + data.username + "].");
        } else {
            socket.emit('signInResponse', {success: false});
        }
    });

    //Listen for new messages from clients
    socket.on('sendMessageToServer', function(data) {
        var playerName = Player.list[socket.id].name;
        console.log("INFO - [CLIENT: " + socket.id + "] sent [MESSAGE: " + data + "]");

        //Send new message to all players
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ": " + data);
        }
    });

    //Remove client if disconnected (client sends disconnect automatically)
    socket.on('disconnect', function() {
        console.log("INFO - [CLIENT: " + socket.id + "] disconnected from the server.");
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
});

var initPack = {players:[], projectiles:[]};
var removePack = {players:[], projectiles:[]};

setInterval(function() {
    //Load package data
    var pack = {
        players: Player.update(),
        projectiles: Projectile.update()
    }

    //Send package data to all clients
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('init', initPack);
        socket.emit('update', pack);
        socket.emit('remove', removePack);
    }

    initPack.players = [];
    initPack.projectiles = [];
    removePack.players = [];
    removePack.projectiles = [];

}, 1000/25);
