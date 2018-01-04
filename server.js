//Initialise express routing
let express = require('express');
let app = express();
let serv = require('http').Server(app);
let tickRate = 20; //Updates per second
let MAX_SERVER_CONNECTIONS = 10, MAX_SERVER_PLAYERS = MAX_SERVER_CONNECTIONS; //Max clients connected, max players in game
const DEBUG = true;

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
    socket.id = getNextAvailableSocketID()
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
            Player.onConnect(socket, data.username);
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
        Player.onDisconnect(socket);
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
if(DEBUG) {
    setInterval(function() {
        serverMessage('SERVER STATUS: RUNNING / CLIENT COUNT: ' + getArrayIndexesInUse(SOCKET_LIST) + ' / PLAYER COUNT: ' + getArrayIndexesInUse(Player.list));
    }, 5000);
}

//Custom server alert messages
function serverMessage(message) {
    console.log(message);
}

//Send a message to a list of clients
function sendMessageToClients(messageToList, messageContent, messageStyle, messageFrom) {
    //Send new message to all players
    for(let i in SOCKET_LIST) {
        SOCKET_LIST[i].emit('addToChat', {username: messageFrom, message: messageContent, messageStyle: messageStyle});
    }
}

//Handle server commands from the client
function processServerCommand(commandLine, senderSocketID) {
    let splitMessage = commandLine.split(' ');
    let command = splitMessage[0];
    let param1 = splitMessage[1];
    let param2 = splitMessage[2];

    if(command === '/announce' || command === '/ann') {
        delete splitMessage[0];
        let message = splitMessage.join(' ');
        sendMessageToClients(SOCKET_LIST, message, 'announcement', 'SERVER');
    } else if(command === '/tp' || command === '/teleport') {
        Player.list[senderSocketID].x = parseInt(param1) * 64;
        Player.list[senderSocketID].y = parseInt(param2) * 64;
    }
}

//Search for an open socket ID
function getNextAvailableSocketID() {
    for(let i = 0; i < MAX_SERVER_CONNECTIONS; i++) {
        if(SOCKET_LIST[i] == undefined) return i;
    }
    return -1;
}

function getArrayIndexesInUse(array) {
    playerCount = 0;
    for(let i in array) if(array[i] != undefined) playerCount++;
    return playerCount;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Min is inclusive, max in exclusive
}

//*****************************
// ENTITY CLASS
//*****************************
class Entity {
    constructor(id, spriteName, map) {
        this.id = id;
        this.x = map.width / 2 * 64;
        this.y = map.height / 2 * 64;
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
            for(let angle = -180; angle < 180; angle += 20) {
                this.shootProjectile(this.mouseAngle + angle);
            }
        }
    }

    shootProjectile(angle) {
        let p = new Projectile(this.id, angle, 'test2', this.map);
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
    //Create player and add to list
    let player = new Player(socket.id, username, 'test1', Map.mapList[0]);
    sendMessageToClients(SOCKET_LIST, player.username + ' has joined the server.', 'info', 'SERVER');

    //Listen for input events
    socket.on('keyPress', function(data) {
        if(data.inputId === 'left') player.pressingLeft = data.state;
        if(data.inputId === 'right') player.pressingRight = data.state;
        if(data.inputId === 'up') player.pressingUp = data.state;
        if(data.inputId === 'down') player.pressingDown = data.state;
        if(data.inputId === 'attack') player.pressingAttack = data.state;
        if(data.inputId === 'mouseAngle') player.mouseAngle = data.state;
    });

    //Listen for new messages from clients
    socket.on('sendMessageToServer', function(data) {
        if(data[0] === '/') processServerCommand(data, socket.id);
        else sendMessageToClients(SOCKET_LIST, data, 'default', player.username);
    });

    //Listen for map changes
    socket.on('changeMap', function(data) {
        if(player.map === 'map1') player.map = 'map2';
        else if(player.map === 'map2') player.map = 'map1';
    });
};

Player.onDisconnect = function(socket) {
    let player = Player.list[socket.id];
    if(player === undefined) return; //If client never signed in
    sendMessageToClients(SOCKET_LIST, player.username + ' has left the server.', 'info', 'SERVER');
    delete Player.list[socket.id];
};

Player.updateAll = function() {
    //Get data from all connected players
    let pack = [];
    for(let i in Player.list) {
        let player = Player.list[i];
        player.update();
        pack[player.id] = {
            id: player.id,
            username: player.username,
            spriteName: player.spriteName,
            x: player.x,
            y: player.y,
            hp: player.hp,
            maxHP: player.maxHP,
            mapID: player.map.id
        };
    }
    return pack;
};

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
        this.lifeTime = 10; //Ticks
        Projectile.list[this.id] = this;
    }

    update() {
        if(this.timer++ > this.lifeTime) this.isActive = false;
        super.update();

        for(let i in Player.list) {
            let player = Player.list[i];
            let shooter = Player.list[this.parent];

            //Check for collision between player and projectiles
            if(this.map === player.map && super.getDistance(player) < 32 && this.parent !== player.id) {
                //serverMessage('DAMAGE - [PLAYER: "' + (shooter === undefined ? 'Unknown' : shooter.username) + '"] dealt ' + this.damage + ' to [PLAYER "' +
                    //player.username + '" / OLD HP=' + player.hp + ' / NEW HP=' + (player.hp - this.damage) + '].');
                player.takeDamage(this.damage);
                this.isActive = false;
            }
        }
    }
}
Projectile.list = [];

Projectile.updateAll = function() {
    //Get data from all connected players
    let pack = [];
    for(let i in Projectile.list) {
        let projectile = Projectile.list[i];
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
            mapID: projectile.map.id
        });
    }
    return pack;
};

//*****************************
// MAP CLASS
//*****************************
class Map {
    constructor(name, width, height, tiles) {
        this.id = Map.nextID++;
        this.name = name;
        this.width = width;
        this.height = height;
        this.tiles = tiles == null ? Map.generateNewMapTiles(width, height) : tiles;
    }

    static generateNewMapTiles(width, height) {
        let tileMap = [];
        for (let i = 0; i < width * height; i++) {
            tileMap.push(getRandomInt(3, 6));
        }
        return tileMap;
    }

    static getMapByName(searchName) {
        for(let i in Map.mapList) {
            let map = Map.mapList;
            if(map.name.toLowerCase() === searchName.toLowerCase()) return map;
        }
        return false;
    }
}
Map.nextID = 0;
Map.mapList = [ new Map('Limbo', 1000, 1000, null)];
