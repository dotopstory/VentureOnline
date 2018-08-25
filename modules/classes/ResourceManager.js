let getJSON = require("get-json");
require("../utils.js")();

module.exports = function() {
    this.ResourceManager = class {
        static init() {
            ResourceManager.load("tileList", "tiles");
            ResourceManager.load("itemList", "items");
            ResourceManager.load("objectList", "objects");
            ResourceManager.load("entityList", "entities");
            ResourceManager.load("regionList", "regions");
        }

        /**
         * Load static content from a local directory or an API
         */
        static load(target, fileName) {
            let isDevMode = process.env.PORT == undefined;
            let fileUrl = isDevMode ?
                "../../data/" + fileName + ".json" :
                ResourceManager.apiUrl + fileName + ".json";

            let returnData = null;
            if(isDevMode) {
                ResourceManager[target] = JSON.parse(JSON.stringify(require(fileUrl)))[fileName];
                serverMessage("INIT", "Resource Manager: loaded " + ResourceManager[target].length + " " + fileName + " from " + fileUrl);
            } else {
                serverMessage("ERROR", fileUrl);
                getJSON(fileUrl, (err, data) => {
                    if(err) {
                        serverMessage("[ERROR] Resource Manager: failed to load: " + fileName + ". Reason: " + err);
                        return;
                    }
                    ResourceManager[target] = JSON.parse(JSON.stringify(data))[fileName];
                    serverMessage("INIT", "Resource Manager: loaded " + ResourceManager[target].length + " " + fileName + " from " + fileUrl);
                });
            }
        }

        static getRandomItem() {
            return ResourceManager.itemList[getRandomInt(0, ResourceManager.itemList.length)];
        }

        static getItemByName(searchName) {
            for(let i in ResourceManager.itemList) {
                if (ResourceManager.itemList[i].name.toString().toLowerCase() === searchName.toString().toLowerCase()) {
                    return ResourceManager.itemList[i];
                }
            }
        }

        static getRandomObject(region) {
            return ResourceManager.objectList[getRandomInt(0, ResourceManager.objectList.length)];
        }

        static getRandomEntity(region) {
            return ResourceManager.entityList[getRandomInt(0, ResourceManager.entityList.length)];
        }
    };
    ResourceManager.apiUrl = "http://static.somesoft.io/venture/";
    ResourceManager.itemList = [];
    ResourceManager.tileList = [];
    ResourceManager.objectList = [];
    ResourceManager.entityList = [];
    ResourceManager.regionList = [];
};
