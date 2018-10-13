require('./Entity.js')();

module.exports = function() {
    this.StaticEntity = class extends Entity {
        constructor(spriteName, map, x, y, name, stats) {
            super(EntityManager.nextID++, spriteName, map, x, y, name, stats);
            this.type = "static";
        }

        update() {
            super.update();
        }

        die() {

        }
    }
};