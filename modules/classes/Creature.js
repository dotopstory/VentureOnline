require('./Entity.js')();

module.exports = function() {
    this.Creature = class extends Entity {
        constructor(id, spriteName, map, x, y) {
            super(id, spriteName, map, x, y);

            //STATS
            this.maxHP = 1000;
            this.hp = this.maxHP;
            this.maxSpd = 20;
        }

        update() {
            super.update();
        }

        shootProjectile(angle) {
            let p = new Projectile(this.id, angle, 'itemCorn', this.map);
            p.x = this.x;
            p.y = this.y;
        }

        setTileLocation(x, y) {
            this.x = parseInt(x) * 64;
            this.y = parseInt(y) * 64;
        }

        takeDamage(damageAmount) {
            this.hp = (this.hp - damageAmount) <= 0 ? 0 : this.hp - damageAmount;
            if(this.hp <= 0) this.die();
        }

        die() {

        }
    }
};