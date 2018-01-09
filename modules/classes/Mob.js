let fs = require('fs');
require('../utils.js')();
require('./Creature.js')();

module.exports = function() {
    //*****************************
    // MOB CLASS
    //*****************************
    this.Mob = class extends Creature {
        constructor(spriteName, map, x, y) {
            super(Entity.nextID++, spriteName, map, x, y);
        }

        update() {
            this.spdX = 0;
            this.spdY = 0;
            this.moveToPosition(490 * 64, 490 * 64);
            super.update();
        }

        idleMove() {
            this.spdX = Math.random() < 0.5 ? this.maxSpd : -this.maxSpd;
        }

        moveToPosition(x, y) {
            if(this.getDistance({x, y}) < 32) return;

            if(x < this.x) this.spdX = -this.maxSpd;
            else if(x > this.x) this.spdX = this.maxSpd;
            else this.spdX = 0;

            if(y < this.y) this.spdY = -this.maxSpd;
            else if(y > this.y) this.spdY = this.maxSpd;
            else this.spdY = 0;
        }
    };
};
