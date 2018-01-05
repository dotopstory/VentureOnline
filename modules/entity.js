//*****************************
// ENTITY CLASS
//*****************************
module.exports = function() {
    this.Entity = class {
        constructor(id, spriteName, map) {
            this.id = id;
            this.x = map.width / 2 * 64;
            this.y = map.height / 2 * 64;
            this.spdX = 0;
            this.spdY = 0;
            this.spriteName = spriteName;
            this.map = map;
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
    Entity.nextID = 0;
};