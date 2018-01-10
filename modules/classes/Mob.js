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
            this.targetPlayer = findNearestEntity(Player.list, this.x, this.y);
        }

        update() {
            if(this.targetPlayer == undefined) this.targetPlayer = findNearestEntity(Player.list, this.x, this.y);

            this.primaryAttackTimer++;
            if(this.primaryAttackTimer > this.primaryAttackCooldown) {
                if(this.targetPlayer != undefined) {
                    super.shootAtLocation(this.targetPlayer.x, this.targetPlayer.y);
                    this.primaryAttackTimer = 0;
                }
            }

            this.spdX = 0;
            this.spdY = 0;
            if(this.targetPlayer != undefined) {
                this.moveToPosition(this.targetPlayer.x, this.targetPlayer.y, 4 * 64);
            }
            super.update();
        }

        idleMove() {
            this.spdX = Math.random() < 0.5 ? this.maxSpd : -this.maxSpd;
        }

        die() {
            this.isActive = false;
        }
    };
};
