require(__dirname + "/classes/world/Map.js")();
require(__dirname + "/utils.js")();
require(__dirname + "/enums/Result.js")();

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
            maps: Map.getMapListString(),
            config: serverCache.config
        });
    });

    app.get('/api/player/:username', function(req, res) {
        let searchUsername = req.params.username
        let player = JSON.parse(JSON.stringify(getPlayerByUsername(serverCache.playerList, searchUsername)));
        res.setHeader('Content-Type', 'application/json');
        if(player == null) {
            res.send({
                searchUsername: searchUsername,
                result: Result.Failure,
            });
            return;
        }
        player.map = player.map.name;
        res.send({
            searchUsername: searchUsername,
            result: Result.Success,
            player: player
        });
    });
};