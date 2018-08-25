require('./Entity.js')();
require('./Projectile')();

module.exports = function() {
    //*****************************
    // CREATURE CLASS
    //*****************************
    this.Creature = class extends Entity {
        constructor(id, spriteName, map, x, y, name) {
            super(id, spriteName, map, x, y, name);

            //STATS
            this.primaryAttackCooldown = 20 * 2;
            this.primaryAttackTimer = 0;
        }

        update() {
            super.update();
        }

        shootProjectile(angle) {
            let angleIncrement = 15;
            angle = angle - Math.floor(this.attackProj.number_of_projectiles / 2) * angleIncrement;
            for(let i = 0; i < this.attackProj.number_of_projectiles; i++) {
                let p = new Projectile(this, angle, this.attackProj.sprite, this.map, this.x, this.y, this.attackProj.multihit,
                    this.attackProj.damage_min, this.attackProj.damage_max, this.attackProj.speed, this.attackProj.lifetime);
                EntityManager.addEntity(p);
                angle += angleIncrement;
            }

        }

        shootAtLocation(point) {
            this.shootProjectile(getAngle(this, point));
        }

        moveToPosition(point, followDistance) {
            followDistance *= 64;
            if(distanceBetweenPoints(this, {x: point.x, y: point.y}) < followDistance) return;

            if(point.x < this.x) this.spdX = -this.maxSpd;
            else if(point.x > this.x) this.spdX = this.maxSpd;
            else this.spdX = 0;

            if(point.y < this.y) this.spdY = -this.maxSpd;
            else if(point.y > this.y) this.spdY = this.maxSpd;
            else this.spdY = 0;
        }
    }
};