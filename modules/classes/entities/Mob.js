require('../../utils.js')();
require('./Creature.js')();

module.exports = function() {
    //*****************************
    // MOB CLASS
    //*****************************
    this.Mob = class extends Creature {
        constructor(spriteName, map, x, y) {
            super(EntityManager.nextID++, spriteName, map, x, y);
            this.target = findNearestPoint(EntityManager.playerList, this.x, this.y);
            this.lifeTime = 20 * 60 * 10;
            this.distanceToTarget = null;
        }

        update() {
            //Kill of entity after lifetime is over
            if(this.timer > this.lifeTime) {
                this.isActive = false;
                return;
            }

            //Find a target
            if(this.target == undefined) {
                this.target = findNearestPoint(EntityManager.playerList, this.x, this.y);
            }

            //Find new target if it is too far away
            this.distanceToTarget = distanceBetweenPoints(this, this.target);
            if(this.distanceToTarget > 64 * 15) this.target = findNearestPoint(EntityManager.playerList, this.x, this.y);

            //Update movement
            this.spdX = 0;
            this.spdY = 0;
            this.selectAction();

            super.update();
        }

        selectAction() {
            //Attack
            this.primaryAttackTimer++;
            if(this.primaryAttackTimer > this.primaryAttackCooldown) {
                if(this.target != undefined) {
                    super.shootAtLocation(this.target);
                    this.primaryAttackTimer = 0;
                }
            }

            if(this.target != undefined) {
                this.moveToPosition(this.target, 4 * 64);
            }
        }

        idleMove() {
            this.spdX = Math.random() < 0.5 ? this.maxSpd : -this.maxSpd;
        }
    };
};
