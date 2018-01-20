require('../utils.js')();

module.exports = function() {
    this.ResourceManager = class {
        static getRandomItem() {
            return ResourceManager.itemList[getRandomInt(0, ResourceManager.itemList.length)];
        }
    };
    ResourceManager.itemList = {};
};