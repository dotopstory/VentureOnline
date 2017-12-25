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
    var playerID = null;

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
        gameCanvas.clearRect(0, 0, canvasWidth, canvasHeight); //Clear canvas

        //Draw game objects
        renderMap(gameCanvas);
        renderPlayers(gameCanvas);
        renderProjectiles(gameCanvas);
    }, 1000 / fps);

    function renderMap(ctx) {
        gameCanvas.drawImage(spritesheet, 0, 0);
    }

    function renderPlayers() {
        gameCanvas.font = "20px Arial";
        //Render players
        for(var i in gameStateCache.players) {
            var player = gameStateCache.players[i]; //Save player

            //Render player sprite
            var sprite = getSprite(player.spriteName);
            sprite.render(gameCanvas, player.x, player.y);

            //Render HP bar
            gameCanvas.fillStyle = "rgba(255, 0, 0, 0.5)";
            gameCanvas.fillRect(player.x + sprite.width / 2 - 50, player.y - sprite.width, 100, 20);
            gameCanvas.fillStyle = "rgba(0, 204, 0, 0.7)";
            gameCanvas.fillRect(player.x + sprite.width / 2 - 50, player.y - sprite.width, (player.hp / player.maxHP) * 100, 20);
            gameCanvas.fillStyle = "rgba(0, 0, 0, 0.2)";
            gameCanvas.strokeRect(player.x + sprite.width / 2 - 50, player.y - sprite.width, 100, 20);

            //Render player name
            gameCanvas.fillStyle = "rgba(0, 0, 0, 1)";
            gameCanvas.fillText(player.username, player.x + sprite.width / 2 - 50 + 2, player.y - sprite.width + 18);

        }
    }

    function renderProjectiles() {
        //Render projectiles
        for(var i in gameStateCache.projectiles) {
            var projectile = gameStateCache.projectiles[i];
            gameCanvas.fillStyle = "rgba(0, 0, 0, 1)";
            var sprite = getSprite(projectile.spriteName);
            sprite.render(gameCanvas, projectile.x, projectile.y);
        }
    }
});
