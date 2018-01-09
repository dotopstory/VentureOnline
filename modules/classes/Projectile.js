require('./Entity.js')();
require('../utils.js')();
require('./Map.js')();
require('./Player.js')();

module.exports = function() {
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
            this.damage = 100;
            this.timer = 0;
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
};
