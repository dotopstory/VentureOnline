let fs = require('fs');
require('./EntityManager')();
require('../../utils.js')();
require('./Creature.js')();
require('../Equiment.js')();
require('../CommandManager.js')();

module.exports = function() {
    this.Player = class extends Creature {
        constructor(username, spriteName, map) {
            //META
            super(EntityManager.nextID++, spriteName, map, (map.width / 2) * 64, (map.height / 2) * 64, username);

            //MOVEMENT
            this.pressingRight = false;
            this.pressingLeft = false;
            this.pressingUp = false;
            this.pressingDown = false;
            this.pressingAttack = false;
            this.mouseAngle = 0;
            this.maxSpd = 25;

            //STATS
            this.equipment = new Equipment();
        }

        update() {
            super.update();
            this.equipment.update();
            this.updateSpd();
            if(this.pressingAttack && this.equipment.attack1Timer >= this.equipment.weapon1.fire_rate) {
                this.shootProjectile(this.equipment.weapon1.attack1, this.mouseAngle);
                this.equipment.attack1Timer = 0;
            }
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

        shootProjectile(attack, angle) {
            if(attack == undefined) {
                return;
            }

            let angleIncrement = 15;
            angle = angle - Math.floor(attack.number_of_projectiles / 2) * angleIncrement;
            for(let i = 0; i < attack.number_of_projectiles; i++) {
                let p = new Projectile(this, angle, attack.sprite, this.map, this.x, this.y, attack.multihit, attack.damage_min, attack.damage_max, attack.speed, attack.lifetime);
                EntityManager.addEntity(p);
                angle += angleIncrement;
            }
        }

        //Change a players map
        changeMap(serverCache, map) {
            serverCache.socketList[this.socketId].emit('changeMap', {map: map});
            if(this.map.id != map.id) this.setTileLocation((this.map.width / 2), (this.map.height / 2));
            this.map = map;
        }

        die() {
            serverMessage("DEATH", "[PLAYER: " + this.name + "] died.");
            this.respawn();
        }

        respawn() {
            this.x = this.x + getRandomInt(-4, 4) * 64;
            this.y = this.y + getRandomInt(-4, 4) * 64;
            this.hp = this.maxHP;
        }
    };

    Player.onConnect = function(serverCache, socket, username) {
        //Create player and add to list
        let player = null;
        let cachedPlayer = getPlayerByUsername(serverCache.playerCache, username);
        if(cachedPlayer != null) {
            player = cachedPlayer;
        } else {
            player = new Player(username, 'playerDefault', Map.getMapByName('Limbo'));
            serverCache.playerCache.push(player);
        } 
        player.socketId = socket.id;
        EntityManager.addPlayer(player);
        sendMessageToClients(serverCache.socketList, player.name + ' has joined the server.', 'info');
        sendMessageToClients([socket], 'Welcome to Venture. Type /help for help.', 'info');

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
            if (data[0] === '/') processServerCommand(serverCache, {'socketList': serverCache.socketList, 'playerList': EntityManager.playerList, 'args': data.split(' '), 'senderSocketId': socket.id});
            else sendMessageToClients(serverCache.socketList, data, 'default', player.name, player.map.name);
        });

        //Listen for map changes
        socket.on('sendNewMapToServer', function(data) {
            let newMap = new Map({id: data.map.id, name: data.map.name, width: data.map.width, height: data.map.height,
                tiles: data.map.tiles, objects:data.map.objects, isPVP: false});

            //Update map of all players on the edited map
            if(data.pushToServer) {
                for (let i in EntityManager.playerList) {
                    if (EntityManager.playerList[i].map.id == data.map.id) EntityManager.playerList[i].changeMap(serverCache, newMap);
                }
            }

            //Update server saved version of map
            Map.mapList[newMap.id] = newMap;

            //Save map to text file on server
            fs.writeFile('./data/maps/' + data.fileName + '.ven', JSON.stringify(newMap), function(err) {
                if(err) {
                    return serverMessage("ERROR", err);
                } else {
                    return serverMessage("INFO", "Success - file was saved to: " + './data/maps/' + data.fileName + '.ven')
                }
            });
        });
    };

    Player.onDisconnect = function(serverCache, socket) {
        let player = EntityManager.playerList[socket.id];
        if(player != undefined) {//If client never signed in
            sendMessageToClients(serverCache.socketList, player.name + ' has left the server.', 'info');
        }
        delete EntityManager.playerList[socket.id];
    };
};

