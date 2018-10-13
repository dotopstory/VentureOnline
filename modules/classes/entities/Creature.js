require('./Entity.js')();
require('./Projectile')();

module.exports = function() {
    this.Creature = class extends Entity {
        constructor(id, spriteName, map, x, y, name, stats) {
            super(id, spriteName, map, x, y, name, stats);
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
                    this.attackProj.damage_min, this.attackProj.damage_max, this.attackProj.moveSpeed, this.attackProj.lifetime);
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

            if(point.x < this.x) this.spdX = -this.stats.moveSpeed;
            else if(point.x > this.x) this.spdX = this.stats.moveSpeed;
            else this.spdX = 0;

            if(point.y < this.y) this.spdY = -this.stats.moveSpeed;
            else if(point.y > this.y) this.spdY = this.stats.moveSpeed;
            else this.spdY = 0;
        }
    }
};