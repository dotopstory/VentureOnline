require(__dirname + "/classes/world/Map.js")();
require(__dirname + "/utils.js")();

module.exports = function(root, app, serverCache) {
    
    app.get('/', function(req, res){
        res.sendFile(root, 'index.html');
    });

    //API ROUTES
    app.get('/api/info', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send({
            playersOnline: getArrayIndexesInUse(serverCache.playerList),
            totalPlayers: getArrayIndexesInUse(serverCache.playerCache),
            maps: Map.getMapListString()
        });
    });

    app.get('/api/player/:username', function(req, res) {
        let searchUsername = req.params.username
        let player = getPlayerByUsername(serverCache.playerList, searchUsername);
        res.setHeader('Content-Type', 'application/json');
        if(player == null) {
            res.send({
                searchUsername: searchUsername,
                result: player == "not found",
            });
            return;
        }
        res.send({
            searchUsername: searchUsername,
            result: player == null ? "not found" : "found",
            id: player.id,
            world: player.map.name
        });
    });
};