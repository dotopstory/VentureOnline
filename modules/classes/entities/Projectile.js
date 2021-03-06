require('./Entity.js')();
require('../../utils.js')();
require('../world/Map.js')();

module.exports = function() {
    this.Projectile = class extends Entity {
        constructor(parent, angle, spriteName, map, x, y, multihit, damageMin, damageMax, speed, lifetime) {
            super(EntityManager.nextID++, spriteName, map, x, y, "projectile", null);
            this.parent = parent;
            this.lifetime = lifetime;
            this.stats.moveSpeed = speed;
            this.spdX = Math.cos(angle / 180 * Math.PI) * this.stats.moveSpeed;
            this.spdY = Math.sin(angle / 180 * Math.PI) * this.stats.moveSpeed;
            this.damageMin = damageMin;
            this.damageMax = damageMax;
            this.timer = 0;
            this.lifeTime = lifetime; //Ticks
            this.multihit = multihit;
            this.hitRadius = 48;
            this.damagedTargets = [];
            this.bounds = {x: 20, y: 20, width: 20, height: 20};
            this.type = "static";
        }

        update() {
            super.update();
            if(this.timer++ >= this.lifeTime) this.isActive = false;
            this.checkCollision();
        }

        checkCollision() {
            //Check collision with players
            if(true) {
                for (let i in EntityManager.playerList) {
                    let player = EntityManager.playerList[i];
                    let shooter = EntityManager.playerList[this.parent.id];

                    //Check for collision between player and projectiles
                    if (this.map.id == player.map.id
                        && distanceBetweenPoints(this, player) < this.hitRadius
                        && this.parent.id !== player.id
                        && this.damagedTargets.indexOf(player.id) === -1) {

                        player.addHealth(-getRandomInt(this.damageMin, this.damageMax + 1));
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
                    if(this.map.id == e.map.id
                        && distanceBetweenPoints(this, e) < this.hitRadius
                        && this.parent.id !== e.id
                        && !(e instanceof Projectile)
                        && (this.parent instanceof Player)
                        && (this.damagedTargets.indexOf(e.id) === -1)
                        && this.isActive
                        && e.isActive) {
                        
                        e.addHealth(-getRandomInt(this.damageMin, this.damageMax + 1));
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
