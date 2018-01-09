let fs = require('fs');
require('../utils.js')();
require('./Creature.js')();

module.exports = function() {
    //*****************************
    // PLAYER CLASS
    //*****************************
    this.Player = class extends Creature {
        constructor(SOCKET_LIST, id, username, spriteName, map) {
            //META
            super(id, spriteName, map);
            this.SOCKET_LIST = SOCKET_LIST;
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
            this.maxHP = 2000;
            this.hp = this.maxHP;

            Player.list[id] = this;
        }

        update() {
            this.updateSpd();
            super.update();
            if(this.pressingAttack) {
                for(let angle = -180; angle < 180; angle += 15) {
                    this.shootProjectile(this.mouseAngle + angle);
                }
            }
        }

        updateSpd() {
            if(this.pressingRight) this.spdX = this.maxSpd;
            else if(this.pressingLeft) this.spdX = -this.maxSpd;
            else this.spdX = 0;

            if(this.pressingUp) this.spdY = -this.maxSpd;
            else if(this.pressingDown) this.spdY = this.maxSpd;
            else this.spdY = 0;
        }

        changeMap(map) {
            this.map = map;
            this.SOCKET_LIST[this.id].emit('changeMap', {map: map});
            console.log('Sent new map to ' + this.id + " MAP=" + this.map);
        }

        die() {
            serverMessage('DEATH - [PLAYER: "' + this.username + '"] died.');
            this.respawn();
        }

        respawn() {
            this.x = this.x + getRandomInt(-4, 4) * 64;
            this.y = this.y + getRandomInt(-4, 4) * 64;
            this.hp = this.maxHP;
        }
    };

    Player.list = [];
    Player.onConnect = function(SOCKET_LIST, socket, username) {
        //Create player and add to list
        let player = new Player(SOCKET_LIST, socket.id, username, 'playerDefault', Map.getMapByName('Limbo'));
        sendMessageToClients(SOCKET_LIST, player.username + ' has joined the server.', 'info');

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
            if (data[0] === '/') processServerCommand(SOCKET_LIST, data, socket.id); //Process a server command
            else sendMessageToClients(SOCKET_LIST, data, 'default', player.username, player.map.name);
        });

        //Listen for map changes
        socket.on('sendNewMapToServer', function(data) {
            let newMap = new Map({id: data.map.id, name: data.map.name, width: data.map.width, height: data.map.height, tiles: data.map.tiles});

            //Update map of all players on the edited map
            if(data.pushToServer) {
                for (let i in Player.list) {
                    if (Player.list[i].map.id === data.map.id) Player.list[i].changeMap(newMap);
                }
            }

            //Update server saved version of map
            Map.mapList[newMap.id] = newMap;

            //Save map to text file on server
            fs.writeFile('maps/' + data.fileName + '.ven', JSON.stringify(newMap), function(err){
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
    };

    Player.onDisconnect = function(SOCKET_LIST, socket) {
        let player = Player.list[socket.id];
        if(player === undefined) return; //If client never signed in
        sendMessageToClients(SOCKET_LIST, player.username + ' has left the server.', 'info');
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

    //Handle server commands from the client
    this.processServerCommand = function(SOCKET_LIST, commandLine, senderSocketID) {
        let splitMessage = commandLine.split(' ');
        let command = splitMessage[0];
        let param1 = splitMessage[1];
        let param2 = splitMessage[2];

        if(command === '/announce' || command === '/ann') {
            delete splitMessage[0];
            let message = splitMessage.join(' ');
            sendMessageToClients(SOCKET_LIST, message, 'announcement', 'SERVER');
        } else if(command === '/tp' || command === '/teleport') {
            Player.list[senderSocketID].setTileLocation(param1, param2);
        } else if(command === '/map') {
            if(param1 === 'list') {
                sendMessageToClients([SOCKET_LIST[Player.list[senderSocketID].id]], 'MAPS: ' + Map.getMapListString(), 'info');
            } else if(param1 === 'reset') {
                let oldMap =  Player.list[senderSocketID].map;
                let newMap = new Map({id: oldMap.id, name: oldMap.name, width: oldMap.width, height: oldMap.height, tileSeedID: parseInt(param2)});
                Map.mapList[oldMap.id] = newMap;
                Player.list[senderSocketID].changeMap(newMap);
            } else {
                if(Map.getMapByName(param1) === false) return;
                Player.list[senderSocketID].changeMap(Map.getMapByName(param1));
            }
        }
    };
};

