let fs = require('fs');
require('../../utils.js')();

//*****************************
// MAP CLASS
//*****************************
module.exports = function() {
    this.Map = class {
        constructor(params) {
            if(params == undefined) return;
            this.id = Map.nextID++;

            //Load map from file
            if(params.fileName != null) {
                fs.readFile('./data/maps/' + params.fileName + '.ven', (err, data) => {
                    if (err) {
                        serverMessage("ERROR", err);
                        return;
                    }

                    //Populate object with map data
                    data = JSON.parse(data);
                    this.name = data.name;
                    this.width = data.width;
                    this.height = data.height;
                    this.tiles = data.tiles;
                    this.objects = data.objects;
                });
            } else {
                this.name = params.name;
                this.width = params.width;
                this.height = params.height;
                this.tiles = params.tiles === undefined ? Map.generateNewBlankMap(this.width, this.height, params.tileSeedID) : params.tiles;
                this.objects = params.objects === undefined ? Map.generateMapObjects(this.tiles) : params.objects;
            }
        }

        //Generate new map with same tiles
        static generateNewBlankMap(width, height, tileSeedID) {
            let tileMap = [];
            for (let i = 0; i < width * height; i++) {
                tileMap.push(tileSeedID);
            }
            return tileMap;
        }

        //Generate map objects
        static generateMapObjects(tileList) {
            let objectMap = [];

            for(let i = 0; i < tileList.length; i++) {
                if(getRandomInt(0, 100) < 50
                    && !ResourceManager.tileList[tileList[i]].isSolid) {
                    let newObj = ResourceManager.getRandomObject(null);

                    if(!arrayContainsArrayItem(newObj.regions, ResourceManager.tileList[tileList[i]].regions)) {
                        objectMap.push(null);
                        continue;
                    }

                    objectMap.push({id: newObj.id,
                        xOffset: getRandomInt(-32, 32),
                        yOffset: getRandomInt(-32, 32)});
                } else {
                    objectMap.push(null);
                }

            }
            return objectMap;
        }

        static getMapByName(searchName) {
            for(let i in Map.mapList) {
                let map = Map.mapList[i];
                if(map.name.toString().toLowerCase() === searchName.toString().toLowerCase()) return map;
            }
            return false;
        }

        static getMapListString() {
            let mapListString = '';
            for(let i = 0; i < Map.mapList.length; i++) {
                mapListString += Map.mapList[i].name;
                if(i < Map.mapList.length - 1) mapListString += ', ';
            }
            return mapListString;
        }
    };
    Map.nextID = 0;
};