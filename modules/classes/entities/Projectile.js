require('./Entity.js')();
require('../../utils.js')();
require('../world/Map.js')();

module.exports = function() {
    //*****************************
    // PROJECTILE CLASS
    //*****************************
    this.Projectile = class extends Entity {
        constructor(parent, angle, spriteName, map, x, y, multihit, damageMin, damageMax, speed, lifetime) {
            super(Entity.nextID++, spriteName, map, x, y);
            this.parent = parent;
            this.spd = speed;
            this.lifetime = lifetime;
            this.spdX = Math.cos(angle / 180 * Math.PI) * this.spd;
            this.spdY = Math.sin(angle / 180 * Math.PI) * this.spd;
            this.damageMin = damageMin;
            this.damageMax = damageMax;
            this.timer = 0;
            this.lifeTime = lifetime; //Ticks
            this.multihit = multihit;
            this.hitRadius = 48;
            this.damagedTargets = [];
            this.bounds = {x: 20, y: 20, width: 20, height: 20};
        }

        update() {
            if(this.timer++ >= this.lifeTime) this.isActive = false;
            super.update();
            this.checkCollision();
        }

        checkCollision() {
            //Check collision with players
            if(true) {
                for (let i in EntityManager.playerList) {
                    let player = EntityManager.playerList[i];
                    let shooter = EntityManager.playerList[this.parent.id];

                    //Check for collision between player and projectiles
                    if (this.map.id === player.map.id
                        && distanceBetweenPoints(this, player) < this.hitRadius
                        && this.parent.id !== player.id
                        && this.damagedTargets.indexOf(player.id) === -1) {

                        player.takeDamage(getRandomInt(this.damageMin, this.damageMax + 1));
                        this.onHit(player.id);
                    }
                }
            }

            //Check collision with entities
            if(true) {
                for(let i in EntityManager.entityList) {
                    let e = EntityManager.entityList[i];

                    if(e == undefined) continue;

                    //Check for collision between player and projectiles
                    if(this.map.id === e.map.id
                        && distanceBetweenPoints(this, e) < this.hitRadius
                        && this.parent.id !== e.id
                        && !(e instanceof Projectile)
                        && (this.parent instanceof Player)
                        && (this.damagedTargets.indexOf(e.id) === -1)
                        && this.isActive
                        && e.isActive) {
                        
                        e.takeDamage(getRandomInt(this.damageMin, this.damageMax + 1));
                        this.onHit(e.id);
                    }
                }
            }
        }

        onHit(id) {
            this.damagedTargets.push(id);

            //Destroy projectile and prevent further damage if not a multihit
            if(!this.multihit) {
                this.isActive = false;
                return;
            }
        }
    };
};
