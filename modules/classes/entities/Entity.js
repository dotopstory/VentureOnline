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
        }

        update() {
            this.timer++;
            this.updatePosition();
        }

        updatePosition() {
            this.x += this.spdX;
            this.y += this.spdY;
        }

        dropItem() {
            EntityManager.addItem(new Item(ResourceManager.getRandomItem().name, this.x + getRandomInt(-32, 32), this.y + getRandomInt(-32, 32), this.map.id));
        }

    };
};

