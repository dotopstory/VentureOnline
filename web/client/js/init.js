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
        var player = gameStateCache.players[i];
        console.log(player);


        //Render player sprite
        gameCanvas.fillText(player.id, player.x, player.y);

        //Render HP bar
        player.hp = 50;
        gameCanvas.fillStyle = "rgba(255, 0, 0, 0.5)";
        gameCanvas.fillRect(player.x, player.y - 38, 100, 20);
        gameCanvas.fillStyle = "rgba(0, 204, 0, 0.5)"; //
        gameCanvas.fillRect(player.x, player.y - 38, (player.hp / player.maxHP) * 100, 20);
        gameCanvas.fillStyle = "rgba(0, 0, 0, 0.2)";
        gameCanvas.strokeRect(player.x, player.y - 38, 100, 20);

        //Render player name
        gameCanvas.fillStyle = "rgba(0, 0, 0, 1)";
        gameCanvas.fillText(player.username, player.x + 5, player.y - 20);
    }

    //Render projectiles
    for(var i in gameStateCache.projectiles) {
        gameCanvas.fillStyle = "rgba(0, 0, 0, 1)";
        gameCanvas.fillRect(gameStateCache.projectiles[i].x - 5, gameStateCache.projectiles[i].y - 5, 10, 10);
    }
}, 1000 / fps);
