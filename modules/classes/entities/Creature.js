require('./EntityManager.js')();
require('./Entity.js')();


module.exports = function() {
    this.Creature = class extends Entity {
        constructor(id, spriteName, map, x, y) {
            super(id, spriteName, map, x, y);

            //STATS
            this.maxHP = 1000;
            this.hp = this.maxHP;
            this.maxSpd = 15;
            this.primaryAttackCooldown = 20 * 1;
            this.primaryAttackTimer = 0;
        }

        update() {
            super.update();
        }

        shootProjectile(angle) {
            let p = new Projectile(this, angle, 'itemCorn', this.map, this.x, this.y);
            EntityManager.addEntity(p);
        }

        shootAtLocation(pixelX, pixelY) {
            this.shootProjectile(getAngle(this.x, this.y, pixelX, pixelY), 'itemTomato', this.map, this.x, this.y);
        }

        setTileLocation(x, y) {
            this.x = parseInt(x) * 64;
            this.y = parseInt(y) * 64;
        }

        takeDamage(damageAmount) {
            this.hp = (this.hp - damageAmount) <= 0 ? 0 : this.hp - damageAmount;
            if(this.hp <= 0) this.die();
        }

        moveToPosition(x, y, followDistance) {
            if(this.getDistance({x, y}) < followDistance) return;

            if(x < this.x) this.spdX = -this.maxSpd;
            else if(x > this.x) this.spdX = this.maxSpd;
            else this.spdX = 0;

            if(y < this.y) this.spdY = -this.maxSpd;
            else if(y > this.y) this.spdY = this.maxSpd;
            else this.spdY = 0;
        }

        die() {

        }
    }
};