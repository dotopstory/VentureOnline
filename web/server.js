//Initialise express routing
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var tickRate = 30; //Updates per second
var serverMaxConnects = 1, serverMaxPlayers = serverMaxConnects; //Max clients connected, max players in game
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

serverAlert("INFO - server has been started.");
var nextSocketID = 0;
var SOCKET_LIST = [];
var DEBUG = true;

//*****************************
// ENTITY CLASS
//*****************************
class Entity {
    constructor(id) {
        this.id = id;
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
Entity.nextID = 0;

//*****************************
// PLAYER CLASS
//*****************************
class Player extends Entity {
    constructor(id, username) {
        super(id);
        this.username = username;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingAttack = false;
        this.mouseAngle = 0;
        this.maxSpd = 10;
        Player.list[id] = this;
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
Player.list = [];
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
    Player.list.splice(socket.id);
}

Player.update = function() {
    //Get data from all connected players
    var pack = [];
    for(var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push({
            id: player.id,
            username: player.username,
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
        super(Entity.nextID++);
        this.parent = parent;
        this.spdX = Math.cos(angle / 180 * Math.PI) * 10;
        this.spdY = Math.sin(angle / 180 * Math.PI) * 10;
        this.timer = 0;
        this.isActive = true;
        this.lifeTime = 20; //Ticks
        Projectile.list[this.id] = this;
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
Projectile.list = [];

Projectile.update = function() {
    //Get data from all connected players
    var pack = [];
    for(var i in Projectile.list) {
        var projectile = Projectile.list[i];
        projectile.update();
        if(!projectile.isActive) {
            Projectile.list.splice(i);
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
    //Deny client connection if too many clients connected
    if(SOCKET_LIST.length + 1 > serverMaxConnects) {
        console.log('ALERT - denied client connection. Active connections: ' + SOCKET_LIST.length);
        return;
    }

    //Add socket to list
    socket.id = getNextAvailableSocketID();
    SOCKET_LIST[socket.id] = socket;
    serverAlert("INFO - [CLIENT " + socket.id + "] connected to the server. ");

    //Listen for sign in attempts
    socket.on('signIn', function(data) {
        //Deny player sign in if too many players
        if(Player.list.length + 1 > maxServerPlayers) {
            console.log('ALERT - denied player signi-in on [SLOT ' + socket.id + '].');
            return;
        }

        //Give default username if empty
        if(data.username === '') data.username = "Eddie " + socket.id;

        //Authenticate user
        if(true) {
            Player.onConnect(socket, data.username);
            socket.emit('signInResponse', {success: true});
            serverAlert("INFO - [CLIENT: " + socket.id + "] signed in as [PLAYER: '" + data.username + "'].");
        } else {
            socket.emit('signInResponse', {success: false});
        }
    });

    //Listen for new messages from clients
    socket.on('sendMessageToServer', function(data) {
        var playerName = Player.list[socket.id].name;
        serverAlert("INFO - [CLIENT: " + socket.id + "] sent [MESSAGE: " + data + "]");

        //Send new message to all players
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ": " + data);
        }
    });

    //Remove client if disconnected (client sends disconnect automatically)
    socket.on('disconnect', function() {
        serverAlert("INFO - [CLIENT: " + socket.id + "] disconnected from the server.");
        SOCKET_LIST.splice(socket.id);
        Player.onDisconnect(socket);
    });
});

//UPDATE CLIENTS
setInterval(function() {
    //Load package data
    var pack = {
        players: Player.update(),
        projectiles: Projectile.update()
    }

    //Send package data to all clients
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }

}, 1000 / tickRate);

//Custom server alert messages
function serverAlert(message) {
    console.log(message);
}

//Return next available socket id
function getNextAvailableSocketID() {
    for(var i = 0; i < serverMaxConnects; i++) {
        if(SOCKET_LIST[i] == undefined) {
            console.log('INFO - found a free slot ' + i);
            return i;
        }
    }
    return -1;
}
