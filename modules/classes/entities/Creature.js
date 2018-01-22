require('./Entity.js')();
require('./Projectile')();

module.exports = function() {
    //*****************************
    // CREATURE CLASS
    //*****************************
    this.Creature = class extends Entity {
        constructor(id, spriteName, map, x, y) {
            super(id, spriteName, map, x, y);

            //STATS
            this.maxHP = 1000;
            this.hp = this.maxHP;
            this.maxSpd = 10;
            this.primaryAttackCooldown = 20 * 2;
            this.primaryAttackTimer = 0;
        }

        update() {
            super.update();
        }

        shootProjectile(angle) {
            let p = new Projectile(this, angle, 'itemTomato', this.map, this.x, this.y, true, 100, 200, 10, null);
            EntityManager.addEntity(p);
        }

        shootAtLocation(point) {
            this.shootProjectile(getAngle(this.x, this.y, point.x, point.y));
        }

        moveToPosition(point, followDistance) {
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