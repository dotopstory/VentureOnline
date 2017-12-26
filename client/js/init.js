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
    var clientID = null;

    //Canvas init
    $('#gameCanvas').css({'width': canvasWidth, 'height': canvasHeight});
    $('#gameCanvas').attr('width', canvasWidth);
    $('#gameCanvas').attr('height', canvasHeight);

    //Game state cache
    var gameStateCache = {
        players: {},
        projectiles: {}
    }

    //Listen for init pack from server
    socket.on('initPack', function(data) {
        clientID = data.playerID;
    });

    //Listen for player packet updates
    socket.on('update', function(data) {
        gameStateCache.players = data.players;
        gameStateCache.projectiles = data.projectiles;
    });

    //RENDER
    setInterval(function() {
        if(clientID == null) return;
        gameCanvas.clearRect(0, 0, canvasWidth, canvasHeight); //Clear canvas

        //Draw game objects
        renderMap(gameCanvas);
        renderPlayers(gameCanvas);
        renderProjectiles(gameCanvas);
    }, 1000 / fps);

    //Render the map
    function renderMap(ctx) {
        var drawX = canvasWidth / 2 - gameStateCache.players[clientID].x;
        var drawY = canvasHeight / 2 - gameStateCache.players[clientID].y;
        //gameCanvas.drawImage(images['spritesheet1'], 0, 0);
        getSprite(gameStateCache.players[clientID].map).render(gameCanvas, drawX, drawY);
    }

    //Render players
    function renderPlayers(ctx) {
        ctx.font = "20px Arial";
        //Render players
        for(var i in gameStateCache.players) {
            var player = gameStateCache.players[i]; //Save player
            var drawX = player.x - gameStateCache.players[clientID].x + canvasWidth / 2;
            var drawY = player.y - gameStateCache.players[clientID].y + canvasHeight / 2;
            var map = player.map;

            //Skip rendering of players on different map
            if(gameStateCache.players[clientID].map !== player.map) continue;

            //Render player sprite
            var sprite = getSprite(player.spriteName);
            sprite.render(ctx, drawX, drawY);

            //Render HP bar
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(drawX + sprite.width / 2 - 50, drawY - sprite.width, 100, 20);
            ctx.fillStyle = "rgba(0, 204, 0, 0.7)";
            ctx.fillRect(drawX + sprite.width / 2 - 50, drawY - sprite.width, (player.hp / player.maxHP) * 100, 20);
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.strokeRect(drawX + sprite.width / 2 - 50, drawY - sprite.width, 100, 20);

            //Render player name
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillText(player.username, drawX + sprite.width / 2 - 50 + 2, drawY - sprite.width + 18);
        }
    }

    //Render projectiles
    function renderProjectiles(ctx) {
        //Render projectiles
        for(var i in gameStateCache.projectiles) {
            var projectile = gameStateCache.projectiles[i];
            var drawX = projectile.x - gameStateCache.players[clientID].x + canvasWidth / 2;
            var drawY = projectile.y - gameStateCache.players[clientID].y + canvasHeight / 2;

            //Skip rendering of projectiles on different maps
            if(gameStateCache.players[clientID].map !== projectile.map) continue;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            var sprite = getSprite(projectile.spriteName);
            sprite.render(ctx, drawX, drawY);
        }
    }
});
