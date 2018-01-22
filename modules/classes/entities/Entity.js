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
        }

        update() {
            this.timer++;
            this.updatePosition();
            this.updateHealthEffects();
        }

        updatePosition() {
            this.x += this.spdX;
            this.y += this.spdY;
        }

        setTileLocation(x, y) {
            this.x = parseInt(x) * 64;
            this.y = parseInt(y) * 64;
        }

        takeDamage(damageAmount) {
            this.hp = (this.hp - damageAmount) <= 0 ? 0 : this.hp - damageAmount;
            this.addHealthEffect(damageAmount, "damage");
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
            console.log(this.healthEffects);
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

