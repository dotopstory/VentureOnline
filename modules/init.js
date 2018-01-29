let getJSON = require('get-json');
require('./classes/ResourceManager.js')();

module.exports = function() {
    let apiURL = 'http://api.keast.site/venture/';

    this.loadResources = function() {
        this.loadItems();
        this.loadTiles();
        this.loadObjects();
        this.loadEntities();
    };

    //Read JSON data for items from API
    this.loadItems = function() {
        //Load from local file if in dev environment
        if(process.env.PORT == undefined || true) {
            ResourceManager.itemList = require('../data/items.json').items;
        } else { //Load from API if in prod/testing
            getJSON(apiURL + 'items.json', function(err, data) {
                ResourceManager.itemList = data.items;
            });
        }
        console.log("Resource Manager: loaded " + ResourceManager.itemList.length + " items.");
    };

    this.loadTiles = function() {
        if(process.env.PORT == undefined || true) {
            ResourceManager.tileList = require('../data/tiles.json').tiles;
        } else {
            getJSON(apiURL + 'tiles.json', function(err, data) {
                ResourceManager.tileList = data.tiles;
            });
        }
        console.log("Resource Manager: loaded " + ResourceManager.tileList.length + " tiles.");
    };

    this.loadObjects = function() {
        if(process.env.PORT == undefined || true) {
            ResourceManager.objectList = require('../data/objects.json').objects;
        } else {
            getJSON(apiURL + 'objects.json', function(err, data) {
                ResourceManager.objectList = data.objects;
            });
        }
        console.log("Resource Manager: loaded " + ResourceManager.objectList.length + " objects.");
    };

    this.loadEntities = function() {
        if(process.env.PORT == undefined || true) {
            ResourceManager.entityList = require('../data/entities.json').entities;
        } else {
            getJSON(apiURL + 'entities.json', function(err, data) {
                ResourceManager.entityList = data.entities;
            });
        }
        console.log("Resource Manager: loaded " + ResourceManager.entityList.length + " entities.");
    };
};