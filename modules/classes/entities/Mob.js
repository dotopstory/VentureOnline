require('../../utils.js')();
require('./Creature.js')();

module.exports = function() {
    this.Mob = class extends Creature {
        constructor(newEntityTemplate, map, x, y) {
            super(EntityManager.nextID++, newEntityTemplate.spriteName, map, x, y, newEntityTemplate.name, newEntityTemplate.stats);
            this.target = findNearestPoint(EntityManager.playerList, this.x, this.y);
            this.distanceToTarget = null;
            this.lifeTime = 20 * 60 * 10;
            this.attackProj = newEntityTemplate.projectiles[0];
            this.type = newEntityTemplate.type;
            this.chaseDistance = newEntityTemplate.chaseDistance;
        }

        update() {
            super.update();
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
                this.moveToPosition(this.target, this.chaseDistance);
            }
        }

        idleMove() {
            this.spdX = Math.random() < 0.5 ? this.stats.moveSpeed : -this.this.stats.moveSpeed;
        }
    };
};
