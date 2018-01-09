let fs = require('fs');
require('../utils.js')();
require('./Creature.js')();

module.exports = function() {
    //*****************************
    // PLAYER CLASS
    //*****************************
    this.Mob = class extends Creature {
        constructor(spriteName, map) {
            super(Entity.nextID++, spriteName, map);
        }

        update() {
            this.idleMove();
            super.update();
        }

        idleMove() {
            this.spdX = this.maxSpd;
        }
    };
};
