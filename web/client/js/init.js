//Open socket
var socket = io();

//Game objects
var gameDiv = document.getElementById('div-game');
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var gameCanvas = document.getElementById('gameCanvas').getContext('2d');
var fps = 100, canvasWidth = 800, canvasHeight = 600;
gameCanvas.font = "30px Arial";
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
    for(var i in gameStateCache.players)
        gameCanvas.fillText(gameStateCache.players[i].id, gameStateCache.players[i].x, gameStateCache.players[i].y);

    for(var i in gameStateCache.projectiles)
        gameCanvas.fillRect(gameStateCache.projectiles[i].x - 5, gameStateCache.projectiles[i].y - 5, 10, 10);
}, 60 / fps);
