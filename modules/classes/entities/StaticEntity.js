require('./Entity.js')();

module.exports = function() {
    //*****************************
    // STATIC ENTITY CLASS
    //*****************************
    this.StaticEntity = class extends Entity {
        constructor(spriteName, map, x, y) {
            super(Entity.nextID++, spriteName, map, x, y);
            this.type = "static";
        }

        update() {
            super.update();
        }

        die() {

        }
    }
};