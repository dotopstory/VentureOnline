require('./Entity.js')();

module.exports = function() {
    //*****************************
    // STATIC ENTITY CLASS
    //*****************************
    this.StaticEntity = class extends Entity {
        constructor(spriteName, map, x, y, name) {
            super(EntityManager.nextID++, spriteName, map, x, y, name);
            this.type = "static";
        }

        update() {
            super.update();
        }

        die() {

        }
    }
};