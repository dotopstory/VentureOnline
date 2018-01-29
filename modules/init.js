let getJSON = require('get-json');
require('./classes/ResourceManager.js')();

module.exports = function() {
    let apiURL = 'http://api.keast.site/venture/';

    this.loadResources = function() {
        this.loadItems();
        this.loadTiles();
    };

    //Read JSON data for items from API
    this.loadItems = function() {
        //Load from local file if in dev environment
        if(process.env.PORT == undefined) {
            ResourceManager.itemList = require('../data/items.json').items;
        } else { //Load from API if in prod/testing
            getJSON(apiURL + 'items.json', function(err, data) {
                ResourceManager.itemList = data.items;
            });
        }
        console.log("Resource Manager: loaded " + ResourceManager.itemList.length + " items.");
    };

    this.loadTiles = function() {
        if(process.env.PORT == undefined) {
            ResourceManager.tileList = require('../data/tiles.json').tiles;
        } else {
            getJSON(apiURL + 'tiles.json', function(err, data) {
                ResourceManager.tileList = data.tiles;
            });
        }
        console.log("Resource Manager: loaded " + ResourceManager.tileList.length + " tiles.");
    };
};