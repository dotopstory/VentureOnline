let fs = require('fs');
require('./EntityManager')();
require('../../utils.js')();
require('./Creature.js')();

module.exports = function() {
    //*****************************
    // PLAYER CLASS
    //*****************************
    this.Player = class extends Creature {
        constructor(SOCKET_LIST, id, username, spriteName, map) {
            //META
            super(id, spriteName, map, (map.width / 2) * 64, (map.height / 2) * 64);
            //ACCOUNT
            this.accountType = 'default';
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
        }

        update() {
            this.updateSpd();
            if(this.pressingAttack) {
                for(let angle = -20; angle < 20; angle+= 20)
                    this.shootProjectile(this.mouseAngle + angle);
            }
            super.update();
        }

        updateSpd() {
            //Update x axis movement
            if(this.pressingRight) this.spdX = this.maxSpd;
            else if(this.pressingLeft) this.spdX = -this.maxSpd;
            else this.spdX = 0;

            //Update y axis movement
            if(this.pressingUp) this.spdY = -this.maxSpd;
            else if(this.pressingDown) this.spdY = this.maxSpd;
            else this.spdY = 0;

            //Reduce movement distance when travelling diagonally
            if((this.pressingDown || this.pressingUp) && (this.pressingLeft || this.pressingRight)) {
                this.spdX = parseInt(this.spdX * 0.75);
                this.spdY = parseInt(this.spdY * 0.75);
            }
        }

        //Change a players map
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

    Player.onConnect = function(SOCKET_LIST, socket, username) {
        //Create player and add to list
        let player = new Player(SOCKET_LIST, socket.id, username, 'playerDefault', Map.getMapByName('Limbo'));
        EntityManager.addPlayer(player);
        sendMessageToClients(SOCKET_LIST, player.username + ' has joined the server.', 'info');
        //Entity.spawnEntitiesNearPlayer(player);

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
            let newMap = new Map({id: data.map.id, name: data.map.name, width: data.map.width, height: data.map.height,
                tiles: data.map.tiles, isPVP: false});

            //Update map of all players on the edited map
            if(data.pushToServer) {
                for (let i in EntityManager.playerList) {
                    if (EntityManager.playerList[i].map.id === data.map.id) EntityManager.playerList[i].changeMap(newMap);
                }
            }

            //Update server saved version of map
            Map.mapList[newMap.id] = newMap;

            //Save map to text file on server
            fs.writeFile('maps/' + data.fileName + '.ven', JSON.stringify(newMap), function(err) {
                if(err) {
                    return console.log(err);
                }
            });
        });
    };

    Player.onDisconnect = function(SOCKET_LIST, socket) {
        let player = EntityManager.playerList[socket.id];
        delete EntityManager.playerList[socket.id];
        if(player === undefined) return; //If client never signed in
        sendMessageToClients(SOCKET_LIST, player.username + ' has left the server.', 'info');
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
            EntityManager.playerList[senderSocketID].setTileLocation(param1, param2);
        } else if(command === '/map') {
            if(param1 === 'list') {
                sendMessageToClients([SOCKET_LIST[EntityManager.playerList[senderSocketID].id]], 'MAPS: ' + Map.getMapListString(), 'info');
            } else if(param1 === 'reset') {
                let oldMap =  EntityManager.playerList[senderSocketID].map;
                let newMap = new Map({id: oldMap.id, name: oldMap.name, width: oldMap.width, height: oldMap.height, tileSeedID: parseInt(param2)});
                Map.mapList[oldMap.id] = newMap;
                EntityManager.playerList[senderSocketID].changeMap(newMap);
            } else {
                if(Map.getMapByName(param1) === false) return;
                EntityManager.playerList[senderSocketID].changeMap(Map.getMapByName(param1));
            }
        }
    };
};

