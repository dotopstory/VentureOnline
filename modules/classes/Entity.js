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
            this.isActive = true;
            if(!(this instanceof Player)) Entity.entityList.push(this);
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
    Entity.entityList = [];
    Entity.updateAll = function() {
        //Get data from all connected players
        let pack = [];
        for(let i in Entity.entityList) {
            let e = Entity.entityList[i];
            e.update();
            if(!e.isActive) {
                delete Entity.entityList[i];
                continue;
            }
            pack.push({
                id: e.id,
                x: e.x,
                y: e.y,
                spriteName: e.spriteName,
                mapID: e.map.id
            });
        }
        return pack;
    };
};

