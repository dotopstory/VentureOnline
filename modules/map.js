require('./utils.js')();

//*****************************
// MAP CLASS
//*****************************
module.exports = function() {
    this.Map = class {
        constructor(name, width, height, tiles) {
            this.id = Map.nextID++;
            this.name = name;
            this.width = width;
            this.height = height;
            this.tiles = tiles == null ? Map.generateNewMapTiles(width, height) : tiles;
        }

        static generateNewMapTiles(width, height) {
            let tileMap = [];
            for (let i = 0; i < width * height; i++) {
                tileMap.push(getRandomInt(2, 3));
            }
            return tileMap;
        }

        static getMapByName(searchName) {
            for(let i in Map.mapList) {
                let map = Map.mapList;
                if(map.name.toLowerCase() === searchName.toLowerCase()) return map;
            }
            return false;
        }
    };
    Map.nextID = 0;
    Map.mapList = [ new Map('Limbo', 500, 500, null)];
};
