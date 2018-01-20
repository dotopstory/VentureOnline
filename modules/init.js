let getJSON = require('get-json');
require('./classes/ResourceManager.js')();

module.exports = function() {
    let apiURL = 'http://api.keast.site/venture/';

    this.loadResources = function() {
        this.loadItems();
    };

    //Read JSON data for items from API
    this.loadItems = function() {
        getJSON(apiURL + 'items.json', function(err, data) {
            if(err) {
                console.log('Error locating JSON data for items.');
                return;
            }
            ResourceManager.itemList = data.items;
        });
    }
};