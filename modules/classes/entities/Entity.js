//*****************************
// ENTITY CLASS
//*****************************
module.exports = function() {
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
        }

        update() {
            this.updatePosition();
        }

        updatePosition() {
            this.x += this.spdX;
            this.y += this.spdY;
        }

        getDistance(point) {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
        }
    };
};

