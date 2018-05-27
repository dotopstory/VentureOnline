require(__dirname + "/classes/world/Map.js")();

module.exports = function(app, root) {
    //PAGE ROUTES
    //Default route
    app.get('/', function(req, res) {
        res.sendFile(root + '/client/pages/home.html');
    });

    //Home route
    app.get('/home', function(req, res) {
        res.sendFile(root + '/client/pages/home.html');
    });

    //Play route
    app.get('/play', function(req, res) {
        res.sendFile(root + '/client/pages/play.html');
    });

    //Info route
    app.get('/info', function(req, res) {
        res.sendFile(root + '/client/pages/info.html');
    });

    //API ROUTES
    app.get('/api/getPlayerCount', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send({playerCount: app.playerList.length});
    });

    app.get('/api/getMaps', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send({maps: Map.getMapListString()});
    });
};