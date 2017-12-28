//Initialise express routing
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var tickRate = 20; //Updates per second
var MAX_SERVER_CONNECTIONS = 10, MAX_SERVER_PLAYERS = MAX_SERVER_CONNECTIONS; //Max clients connected, max players in game

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

serverMessage("INFO - Venture Online server has been started.");
var nextSocketID = 0;
var SOCKET_LIST = [];
var DEBUG = true;

//*****************************
// ENTITY CLASS
//*****************************
class Entity {
    constructor(id, spriteName, map) {
        this.id = id;
        this.x = 250;
        this.y = 250;
        this.spdX = 0;
        this.spdY = 0;
        this.spriteName = spriteName;
        this.map = map;
    }

    update() {
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.spdX;
        this.y += this.spdY;
    }

    getDistance(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
}
Entity.nextID = 0;

//*****************************
// PLAYER CLASS
//*****************************
class Player extends Entity {
    constructor(id, username, spriteName, map) {
        //META
        super(id, spriteName, map);
        this.username = username;

        //MOVEMENT
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingAttack = false;
        this.mouseAngle = 0;

        //STATS
        this.maxSpd = 25;
        this.maxHP = 100;
        this.hp = this.maxHP;

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
        var p = new Projectile(this.id, angle, 'test2', this.map);
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

    takeDamage(damageAmount) {
        this.hp = (this.hp - damageAmount) <= 0 ? 0 : this.hp - damageAmount;
        if(this.hp <= 0) this.die();
    }

    die() {
        serverMessage('DEATH - [PLAYER: "' + this.username + '"] died.');
        this.respawn();
    }

    respawn() {

    }
}
Player.list = [];
Player.onConnect = function(socket, username) {
    //Map
    var map = Math.random() < 0.5 ? "map1" : "map2";

    //Create player and add to list
    var player = new Player(socket.id, username, 'test1', map);

    //Listen for input events
    socket.on('keyPress', function(data) {
        if(data.inputId === 'left') player.pressingLeft = data.state;
        if(data.inputId === 'right') player.pressingRight = data.state;
        if(data.inputId === 'up') player.pressingUp = data.state;
        if(data.inputId === 'down') player.pressingDown = data.state;
        if(data.inputId === 'attack') player.pressingAttack = data.state;
        if(data.inputId === 'mouseAngle') player.mouseAngle = data.state;
    });

    //Listen for map changes
    socket.on('changeMap', function(data) {
        if(player.map == 'map1') player.map = 'map2';
        else if(player.map == 'map2') player.map = 'map1';
    });
}

Player.onDisconnect = function(socket) {
    Player.list.splice(socket.id);
}

Player.updateAll = function() {
    //Get data from all connected players
    var pack = [];
    for(var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push({
            id: player.id,
            username: player.username,
            spriteName: player.spriteName,
            x: player.x,
            y: player.y,
            hp: player.hp,
            maxHP: player.maxHP,
            map: player.map
        });
    }
    return pack;
}

//*****************************
// PROJECTILE CLASS
//*****************************
class Projectile extends Entity {
    constructor(parent, angle, spriteName, map) {
        super(Entity.nextID++, spriteName, map);
        this.parent = parent;
        this.spd = 40;
        this.spdX = Math.cos(angle / 180 * Math.PI) * this.spd;
        this.spdY = Math.sin(angle / 180 * Math.PI) * this.spd;
        this.damage = 5;
        this.timer = 0;
        this.isActive = true;
        this.lifeTime = 60; //Ticks
        Projectile.list[this.id] = this;
    }

    update() {
        //if(this.timer++ > this.lifeTime) this.isActive = false;
        super.update();

        for(var i in Player.list) {
            var player = Player.list[i];
            var shooter = Player.list[this.parent];

            //Check for collision between player and projectiles
            if(this.map === player.map && super.getDistance(player) < 32 && this.parent !== player.id) {
                serverMessage('DAMAGE - [PLAYER: "' + (shooter == undefined ? 'Unknown' : shooter.username) + '"] dealt ' + this.damage + ' to [PLAYER "' +
                    player.username + '" / OLD HP=' + player.hp + ' / NEW HP=' + (player.hp - this.damage) + '].');
                player.takeDamage(this.damage);
                this.isActive = false;
            }
        }
    }
}
Projectile.list = [];

Projectile.updateAll = function() {
    //Get data from all connected players
    var pack = [];
    for(var i in Projectile.list) {
        var projectile = Projectile.list[i];
        projectile.update();
        if(!projectile.isActive) {
            delete Projectile.list[i];
            continue;
        }
        pack.push({
            id: projectile.id,
            x: projectile.x,
            y: projectile.y,
            spriteName: projectile.spriteName,
            map: projectile.map
        });
    }
    return pack;
}

//Listen for connection events
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    //Deny client connection if too many clients connected
    if(SOCKET_LIST.length + 1 > MAX_SERVER_CONNECTIONS) {
        console.log('ALERT - denied client connection. Active connections: ' + SOCKET_LIST.length);
        return;
    }

    //Add socket to list
    socket.id = getNextAvailableSocketID();
    SOCKET_LIST[socket.id] = socket;
    serverMessage("INFO - [CLIENT " + socket.id + "] connected to the server. ");

    //Listen for sign in attempts
    socket.on('signIn', function(data) {
        //Deny player sign in if too many players
        if(Player.list.length + 1 > MAX_SERVER_PLAYERS) {
            console.log('ALERT - denied player signi-in on [SLOT ' + socket.id + '].');
            return;
        }

        //Give default username if empty
        if(data.username === '') data.username = "Eddie " + socket.id;

        //Authenticate user
        if(true) {
            Player.onConnect(socket, data.username);
            socket.emit('signInResponse', {success: true});
            socket.emit('initPack', {playerID: socket.id});
            serverMessage("INFO - [CLIENT: " + socket.id + "] signed in as [PLAYER: '" + data.username + "'].");
        } else {
            socket.emit('signInResponse', {success: false});
        }
    });

    //Listen for new messages from clients
    socket.on('sendMessageToServer', function(data) {
        if(Player.list[socket.id] == undefined) {
            serverMessage("ERROR - [CLIENT: " + socket.id + "] attempted to send a message but it failed.");
            return;
        }

        var playerName = getPlayerAtSocketID(socket.id).username;
        console.log(playerName);
        serverMessage('INFO - [CLIENT: ID' + socket.id + ' / USERNAME: ' + playerName + '] sent [MESSAGE: ' + data + ']');

        //Send new message to all players
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', {username: playerName, message: data, messageStyle: 'announcement'});
        }
    });

    //Remove client if disconnected (client sends disconnect automatically)
    socket.on('disconnect', function() {
        serverMessage("INFO - [CLIENT: " + socket.id + "] disconnected from the server.");
        SOCKET_LIST.splice(socket.id);
        Player.onDisconnect(socket);
    });
});

//UPDATE CLIENTS
setInterval(function() {
    //Load package data
    var pack = {
        players: Player.updateAll(),
        projectiles: Projectile.updateAll()
    }

    //Send package data to all clients
    for(var i in Player.list) {
        var socket = SOCKET_LIST[Player.list[i].id];
        if(socket == undefined) continue;
        socket.emit('update', pack);
    }

}, 1000 / tickRate);

//Custom server alert messages
function serverMessage(message) {
    console.log(message);
}

//Return next available socket id
function getNextAvailableSocketID() {
    for(var i = 0; i < MAX_SERVER_CONNECTIONS; i++) {
        if(SOCKET_LIST[i] == undefined) return i;
    }
    return -1;
}

function getPlayerAtSocketID(socketID) {
    for(var i = 0; i < MAX_SERVER_PLAYERS; i++) {
        if(Player.list[i].id === socketID) return Player.list[i];
    }
}
