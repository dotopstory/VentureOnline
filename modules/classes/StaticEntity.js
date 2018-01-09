require('./Entity.js')();

module.exports = function() {
    this.StaticEntity = class extends Entity {
        constructor(spriteName, map) {
            super(Entity.nextID++, spriteName, map);

            //STATS
            this.maxHP = 1000;
            this.hp = this.maxHP;
            this.maxSpd = 20;
        }

        update() {

        }

        takeDamage(damageAmount) {
            this.hp = (this.hp - damageAmount) <= 0 ? 0 : this.hp - damageAmount;
            if(this.hp <= 0) this.die();
        }

        die() {

        }
    }
};