var fs = require('fs');
require('./entity.js')();
require('./utils.js')();
require('./map.js')();

module.exports = function() {
    //*****************************
    // PLAYER CLASS
    //*****************************
    this.Player = class extends Entity {
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
            this.x = this.x + getRandomInt(-4, 4) * 64;
            this.y = this.y + getRandomInt(-4, 4) * 64;
            this.hp = this.maxHP;
        }
    };

    Player.list = [];
    Player.onConnect = function(SOCKET_LIST, socket, username) {
        //Create player and add to list
        let player = new Player(socket.id, username, 'test1', Map.mapList[0]);
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
            let newMap = data.map;

            //Update map of all players on the edited map
            if(data.pushToServer)
                for(let i in Player.list)  if(Player.list[i].map.id === newMap.id) changePlayerMap(i, newMap);

            //Update server saved version of map
            Map.mapList[newMap.id] = newMap;

            //Save map to text file on server
            fs.writeFile('maps/limbo.ven', JSON.stringify(newMap), function(err){
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });

    //Change the map of a player
    function changePlayerMap(playerID, map) {
        Player.list[playerID].map = map;
        SOCKET_LIST[playerID].emit('changeMap', {map: map});
        console.log('Sent new map to ' + playerID + " MAP=" + map);
    }
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

    //*****************************
    // PROJECTILE CLASS
    //*****************************
    this.Projectile = class extends Entity {
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
    };
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
            Player.list[senderSocketID].x = parseInt(param1) * 64;
            Player.list[senderSocketID].y = parseInt(param2) * 64;
        }
    }

};
