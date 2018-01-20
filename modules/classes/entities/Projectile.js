require('./Entity.js')();
require('../../utils.js')();
require('../world/Map.js')();
require('./Player.js')();

module.exports = function() {
    //*****************************
    // PROJECTILE CLASS
    //*****************************
    this.Projectile = class extends Entity {
        constructor(parent, angle, spriteName, map, x, y, multihit) {
            super(Entity.nextID++, spriteName, map, x, y);
            this.parent = parent;
            this.spd = 40;
            this.spdX = Math.cos(angle / 180 * Math.PI) * this.spd;
            this.spdY = Math.sin(angle / 180 * Math.PI) * this.spd;
            this.damage = 100;
            this.timer = 0;
            this.lifeTime = 10; //Ticks
            this.multihit = true;
        }

        update() {
            if(this.timer++ > this.lifeTime) this.isActive = false;
            super.update();

            //Check collision with players
            if(true) {
                for (let i in EntityManager.playerList) {
                    let player = EntityManager.playerList[i];
                    let shooter = EntityManager.playerList[this.parent.id];

                    //Check for collision between player and projectiles
                    if (this.map.id === player.map.id && distanceBetweenPoints(this, player) < 32 && this.parent.id !== player.id) {
                        //serverMessage('DAMAGE - [PLAYER: "' + (shooter === undefined ? 'Unknown' : shooter.username) + '"] dealt ' + this.damage + ' to [PLAYER "' +
                        //player.usernaame + '" / OLD HP=' + player.hp + ' / NEW HP=' + (player.hp - this.damage) + '].');
                        player.takeDamage(this.damage);

                        //Destroy projectile and prevent further damage if not a multihit
                        if(!this.multihit) {
                            this.isActive = false;
                            return;
                        }
                    }
                }
            }

            //Check collision with entities
            if(true) {
                for(let i in EntityManager.entityList) {
                    let e = EntityManager.entityList[i];
                    //Check for collision between player and projectiles
                    if(this.map.id === e.map.id && distanceBetweenPoints(this, e) < 32 && (this.parent.id !== e.id ||
                            (this.parent instanceof Player)) && !(e instanceof Projectile) && !(this.parent instanceof Mob)) {
                        e.takeDamage(this.damage);

                        //Destroy projectile and prevent further damage if not a multihit
                        if(!this.multihit) {
                            this.isActive = false;
                            return;
                        }
                    }
                }
            }
        }
    };
};
