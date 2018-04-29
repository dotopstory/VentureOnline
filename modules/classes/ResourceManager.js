let getJSON = require('get-json');
require('../utils.js')();

module.exports = function() {
    this.ResourceManager = class {
        static init() {
            ResourceManager.itemList = ResourceManager.load('items');
            ResourceManager.tileList = ResourceManager.load('tiles');
            ResourceManager.objectList = ResourceManager.load('objects');
            ResourceManager.entityList = ResourceManager.load('entities');
        }

        static load(fileName) {
            let returnData = null;
            //Load from local file if in dev environment
            if(process.env.PORT == undefined || true) {
                returnData = require('../../data/' + fileName + '.json')[fileName];
            //Load from API if in prod/testing
            } else {
                getJSON(ResourceManager.apiURL + fileName + '.json', function(err, data) {
                    returnData = data[fileName];
                });
            }
            console.log("Resource Manager: loaded " + returnData.length + " " + fileName + ".");
            return returnData;
        }

        static getRandomItem() {
            return ResourceManager.itemList[getRandomInt(0, ResourceManager.itemList.length)];
        }

        static getItemByName(searchName) {
            for (let i in ResourceManager.itemList) {
                if (ResourceManager.itemList[i].name.toString().toLowerCase() === searchName.toString().toLowerCase())
                    return ResourceManager.itemList[i];
            }
        }
        
        static getRandomObject(region) {
            return ResourceManager.objectList[getRandomInt(0, ResourceManager.objectList.length)];
        }

        static getRandomEntity(region) {
            return ResourceManager.entityList[getRandomInt(0, ResourceManager.entityList.length)];
        }
    };
    ResourceManager.apiURL = 'http://api.keast.site/venture/';
    ResourceManager.itemList = [];
    ResourceManager.tileList = [];
    ResourceManager.objectList = [];
    ResourceManager.entityList = [];
};