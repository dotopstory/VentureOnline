//Open socket
var socket = io();
var DEBUG_ON = true;

function clientAlert(message) {
    if(DEBUG_ON) console.log(message);
}

$(window).on('load', function() {
    //Game objects
    var gameCanvas = document.getElementById('gameCanvas').getContext('2d');
    var fps = 100, canvasWidth = 1000, canvasHeight = 750;

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
            //Draw map
            //gameCanvas.drawImage(spritesheet, 0, 0, spritesheet.width, spritesheet.height);

            var player = gameStateCache.players[i];

            //Render player sprite
            console.log(getSprite('test1'));
            var sprite = getSprite('test1');
            sprite.render(gameCanvas, player.x, player.y);

            //Render HP bar
            gameCanvas.fillStyle = "rgba(255, 0, 0, 0.5)";
            gameCanvas.fillRect(player.x + sprite.width / 2 - 50, player.y - sprite.width, 100, 20);
            gameCanvas.fillStyle = "rgba(0, 204, 0, 0.5)";
            gameCanvas.fillRect(player.x + sprite.width / 2 - 50, player.y - sprite.width, (player.hp / player.maxHP) * 100, 20);
            gameCanvas.fillStyle = "rgba(0, 0, 0, 0.2)";
            gameCanvas.strokeRect(player.x + sprite.width / 2 - 50, player.y - sprite.width, 100, 20);

            //Render player name
            gameCanvas.fillStyle = "rgba(0, 0, 0, 1)";
            gameCanvas.fillText(player.username, player.x + sprite.width / 2 - 50 + 2, player.y - sprite.width + 18);

        }

        //Render projectiles
        for(var i in gameStateCache.projectiles) {
            gameCanvas.fillStyle = "rgba(0, 0, 0, 1)";
            gameCanvas.fillRect(gameStateCache.projectiles[i].x - 5, gameStateCache.projectiles[i].y - 5, 10, 10);
        }
    }, 1000 / fps);

});
