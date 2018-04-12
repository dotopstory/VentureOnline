module.exports = function() {
    //*****************************
    // ENTITY CLASS
    //*****************************
    this.Entity = class {
        constructor(id, spriteName, map, x, y) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.spdX = 0;
            this.spdY = 0;
            this.spriteName = spriteName;
            this.map = map;
            this.isActive = true;
            this.isInvisible = false;
            this.isInvulnerable = false;
            this.timer = 0;
            this.healthEffects = [];
            this.bounds = {x: 16, y: 16, width: 40, height: 48};
        }

        update() {
            this.timer++;
            this.updatePosition();
            this.updateHealthEffects();
        }

        updatePosition() {
            this.moveX();
            this.moveY();
        }

        moveX() {
            if(this.spdX > 0) { //Moving right
                let xOffset = parseInt((this.x + this.spdX + this.bounds.width) / 64);
                if(!this.isCollision(xOffset, parseInt((this.y + this.bounds.y + this.bounds.height) / 64))
                && !this.isCollision(xOffset, parseInt((this.y + this.bounds.y) / 64))) {
                    this.x += this.spdX;
                } else {
                    this.x = xOffset * 64 - this.bounds.x - this.bounds.width - 1;
                    this.onMapCollision();
                }
            } else if(this.spdX < 0) { //Moving left
                let xOffset = parseInt((this.x + this.spdX + this.bounds.x) / 64);
                if(!this.isCollision(xOffset, parseInt((this.y + this.bounds.y) / 64))
                && !this.isCollision(xOffset, parseInt((this.y + this.bounds.y + this.bounds.height) / 64))) {
                    this.x += this.spdX;
                } else {
                    this.x = xOffset *  64 + 64 - this.bounds.x
                    this.onMapCollision();
                }
            }
        }

        moveY() {
            if(this.spdY < 0) { //Moving up
                let yOffset = parseInt((this.y + this.spdY + this.bounds.y) / 64);
                if(!this.isCollision(parseInt((this.x + this.bounds.x) / 64), yOffset)
                && !this.isCollision(parseInt((this.x + this.bounds.x + this.bounds.width) / 64), yOffset)) {
                    this.y += this.spdY;
                } else {
                    this.y = yOffset * 64 + 64 - this.bounds.y;
                    this.onMapCollision();
                }
            } else if(this.spdY > 0) { //Moving down
                let yOffset = parseInt((this.y + this.spdY + this.bounds.y + this.bounds.height) / 64);
                if(!this.isCollision(parseInt((this.x + this.bounds.x) / 64), yOffset)
                && !this.isCollision(parseInt((this.x + this.bounds.x + this.bounds.width) / 64), yOffset)) {
                    this.y += this.spdY;
                } else {
                    this.y = yOffset * 64 - this.bounds.y - this.bounds.height - 1;
                    this.onMapCollision();
                }
            }
        }

        isCollision(x, y) {
            //If current tile is null
            if(ResourceManager.tileList[this.map.tiles[y * this.map.width + x]] == null) return true;

            //If current tile is solid
            if(ResourceManager.tileList[this.map.tiles[y * this.map.width + x]].isSolid) return true;

            //???
            if(this.map.objects[y * this.map.width + x] == null) return false;
            // distanceBetweenPoints({
            //         x: x * 64 + this.map.objects[y * this.map.width + x].xOffset,
            //         y: y * 64 + this.map.objects[y * this.map.width + x].yOffset}, this) < 48
            return false;
        }

        onMapCollision() {
            if(this instanceof Projectile) this.isActive = false;
        }

        setTileLocation(x, y) {
            this.x = parseInt(x) * 64;
            this.y = parseInt(y) * 64;
        }

        takeDamage(damageAmount) {
            this.hp = (this.hp - damageAmount) <= 0 ? 0 : this.hp - damageAmount;
            this.addHealthEffect(damageAmount, 'red');
            if(this.hp <= 0) this.die();
        }

        die() {
            this.dropItem();
            this.isActive = false;
        }

        dropItem() {
            EntityManager.addItem(new Item(ResourceManager.getRandomItem().name, this.x + getRandomInt(-32, 32), this.y + getRandomInt(-32, 32), this.map.id));
        }

        addHealthEffect(text, type) {
            this.healthEffects.push({text: text, color: type, timer: 0});
        }

        updateHealthEffects() {
            let lifetime = 20 * 2;
            for(let i in this.healthEffects) {
                let fx = this.healthEffects[i];
                if(fx == undefined) continue;
                fx.timer++;
                if(fx.timer > lifetime) delete this.healthEffects[i];
            }
        }
    };
};

