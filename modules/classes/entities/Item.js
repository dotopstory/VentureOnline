module.exports = function() {
    this.Item = class {
        constructor(name, x, y, mapID) {
            this.id = Item.nextID;
            this.name = name;
            this.x = x;
            this.y = y;
            this.mapID = mapID;
            this.lifetime = 20 * 10;
            this.timer = 0;
            this.isActive = true;
        }

        update() {
            this.timer++;
            if(this.timer >= this.lifetime) this.isActive = false;
        }
    };
    Item.nextID = 0;
};