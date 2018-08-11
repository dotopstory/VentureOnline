require('../../utils.js')();
require('./Creature.js')();

module.exports = function() {
    //*****************************
    // MOB CLASS
    //*****************************
    this.Mob = class extends Creature {
        constructor(obj, map, x, y) { //newEntity.sprite, point.map, spawnX, spawnY, newEntity.name, newEntity.maxHP, newEntity.speed, newEntity.defence, newEntity.projectiles[0], newEntity.type
            //spriteName, map, x, y, name, maxHP, speed, defence, attackProj, type
            //newEntity.sprite, point.map, spawnX, spawnY, newEntity.name, newEntity.maxHP, newEntity.speed, newEntity.defence, newEntity.projectiles[0], newEntity.type);
            super(EntityManager.nextID++, obj.spriteName, map, x, y);
            this.target = findNearestPoint(EntityManager.playerList, this.x, this.y);
            this.distanceToTarget = null;
            this.lifeTime = 20 * 60 * 10;
            this.name = obj.name;
            this.maxHP = obj.maxHP;
            this.hp = this.maxHP;
            this.speed = obj.speed;
            this.defence = obj.defence;
            this.attackProj = obj.projectiles[0];
            this.type = obj.type;
            this.chaseDistance = obj.chaseDistance;
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
            this.spdX = Math.random() < 0.5 ? this.maxSpd : -this.maxSpd;
        }
    };
};
