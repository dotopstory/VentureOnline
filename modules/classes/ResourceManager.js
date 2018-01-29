require('../utils.js')();

module.exports = function() {
    this.ResourceManager = class {
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
    };
    ResourceManager.itemList = {};
    ResourceManager.tileList = {};
    ResourceManager.objectList = {};
    ResourceManager.entityList = {};
};