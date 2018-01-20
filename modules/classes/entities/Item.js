module.exports = function() {
    this.Item = class {
        constructor(name, x, y, mapID) {
            this.id = Item.nextID;
            this.name = name;
            this.x = x;
            this.y = y;
            this.mapID = mapID;
        }

        update() {

        }
    };
    Item.nextID = 0;
};