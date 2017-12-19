//Open socket
var socket = io();

//Game objects
var gameCanvas = document.getElementById('gameCanvas').getContext('2d');
var fps = 100, canvasWidth = 800, canvasHeight = 600;

//Canvas init
$('#gameCanvas').css({'width': canvasWidth, 'height': canvasHeight});
$('#gameCanvas').attr('width', canvasWidth);
$('#gameCanvas').attr('height', canvasHeight);

//Game state cache
var gameStateCache = {
    players: {},
    projectiles: {}
}

//Listen for player packet updates
socket.on('update', function(data) {
    gameStateCache.players = data.players;
    gameStateCache.projectiles = data.projectiles;
});

//RENDER
setInterval(function() {
    gameCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
    gameCanvas.font = "20px Arial";
    //Render players
    for(var i in gameStateCache.players) {
    console.log(gameStateCache.players[i]);
        //Render player name
        gameCanvas.fillText(gameStateCache.players[i].username, gameStateCache.players[i].x, gameStateCache.players[i].y - 20);
        //Render player sprite
        gameCanvas.fillText(gameStateCache.players[i].id, gameStateCache.players[i].x, gameStateCache.players[i].y);
    }

    //Render projectiles
    for(var i in gameStateCache.projectiles) {
        gameCanvas.fillRect(gameStateCache.projectiles[i].x - 5, gameStateCache.projectiles[i].y - 5, 10, 10);
    }
}, 1000 / fps);
