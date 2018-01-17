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
                this.tiles = params.tiles === undefined ? Map.generateNewBlankMap(this.width, this.height, params.tileSeedID) : params.tiles;
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