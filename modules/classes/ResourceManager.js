require('../utils.js')();

module.exports = function() {
    this.ResourceManager = class {
        static getRandomItemName() {
            return ResourceManager.itemList[getRandomInt(0, ResourceManager.itemList.length)].name;
        }
    };
    ResourceManager.itemList = {};
};