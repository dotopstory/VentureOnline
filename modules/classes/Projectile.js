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
            this.damage = 10000;
            this.timer = 0;
            this.lifeTime = 10; //Ticks
            Projectile.list[this.id] = this;
        }

        update() {
            if(this.timer++ > this.lifeTime) this.isActive = false;
            super.update();

            for(let i in Player.list) {
                let player = Player.list[i];
                let shooter = Player.list[this.parent.id];

                //Check for collision between player and projectiles
                if(this.map.id === player.map.id && super.getDistance(player) < 32 && this.parent.id !== player.id) {
                    //serverMessage('DAMAGE - [PLAYER: "' + (shooter === undefined ? 'Unknown' : shooter.username) + '"] dealt ' + this.damage + ' to [PLAYER "' +
                    //player.username + '" / OLD HP=' + player.hp + ' / NEW HP=' + (player.hp - this.damage) + '].');
                    player.takeDamage(this.damage);
                    this.isActive = false;
                }
            }

            for(let i in Entity.entityList) {
                let e = Entity.entityList[i];
                //Check for collision between player and projectiles
                if(this.map.id === e.map.id && super.getDistance(e) < 32 && (this.parent.id !== e.id || (e instanceof this.parent)) && !(e instanceof Projectile)) {
                    e.takeDamage(this.damage);
                    this.isActive = false;
                }
            }
        }
    };
    Projectile.list = [];
};
