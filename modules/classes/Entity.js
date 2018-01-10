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
    Entity.spawnEntitiesNearPlayer = function(player) {
        setInterval(function() {
            let offset = 10;
            let startX = player.x / 64 - offset;
            let startY = player.y / 64 - offset;
            let endX = player.x / 64 + offset;
            let endY = player.y / 64 + offset;

            for(let y = startY; y < endY; y++) {
                for(let x = startX; x < endX; x++) {
                    let mob =  Math.random() < 0.01 ? new Mob('mobPrisonGuard', player.map, x * 64, y * 64) : null;
                }
            }
        }, 5000)

    };
};

