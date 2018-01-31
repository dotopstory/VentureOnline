let fs = require('fs');
require('../../utils.js')();

//*****************************
// MAP CLASS
//*****************************
module.exports = function() {
    this.Map = class {
        constructor(params) {
            if(params.id === undefined) this.id = Map.nextID++;
            else this.id = params.id;

            //Create new random map
            if(params.fileName != null) {
                fs.readFile('./data/maps/' + params.fileName + '.ven', (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    //Populate object with map data
                    data = JSON.parse(data);
                    this.name = data.name;
                    this.width = data.width;
                    this.height = data.height;
                    this.tiles = data.tiles;
                    this.objects = Map.generateMapObjects(this.tiles);
                });
            } else {
                this.name = params.name;
                this.width = params.width;
                this.height = params.height;
                this.tiles = params.tiles === undefined ? Map.generateNewBlankMap(this.width, this.height, params.tileSeedID) : params.tiles;
                this.objects = Map.generateMapObjects(this.tiles);
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
                        xOffset: getRandomInt(0, 0),
                        yOffset: getRandomInt(0, 0)});
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