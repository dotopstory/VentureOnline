let fs = require('fs');
require('./utils.js')();

//*****************************
// MAP CLASS
//*****************************
module.exports = function() {
    this.Map = class {
        constructor(params) {
            this.id = Map.nextID++;

            //Create new random map
            if(params.fileName != null) {
                fs.readFile('./maps/' + params.fileName + '.ven', (err, data) => {
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
                });
            } else {
                this.name = params.name;
                this.width = params.width;
                this.height = params.height;
                this.tiles = Map.generateNewBlankMap(this.width, this.height, params.tileSeedID);
            }

        }

        static generateNewBlankMap(width, height, tileSeedID) {
            let tileMap = [];
            for (let i = 0; i < width * height; i++) {
                tileMap.push(tileSeedID);
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
};