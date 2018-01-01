//Open socket
var socket = io();
var DEBUG_ON = true;

//Prevent right click popup menu
document.oncontextmenu = function(event) {
    event.preventDefault();
};

function clientAlert(message) {
    if(DEBUG_ON) console.log(message);
}

$(window).on('load', function() {
    //Game objects
    let gameElement = $('#gameCanvas');
    let gameCanvasCtx = gameElement[0].getContext('2d');
    let fps = 60, canvasWidth = 1000, canvasHeight = 750;
    let clientID = null;

    //Canvas init

    gameElement.css({'width': canvasWidth, 'height': canvasHeight});
    gameElement.attr('width', canvasWidth);
    gameElement.attr('height', canvasHeight);

    //Game state cache
    let gameStateCache = {
        players: {},
        projectiles: {}
    };

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
        if(gameStateCache.players[clientID] === undefined) return;
        gameCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight); //Clear canvas

        //Draw game objects
        renderMap(gameCanvasCtx);
        renderPlayers(gameCanvasCtx);
        renderProjectiles(gameCanvasCtx);
    }, 1000 / fps);

    //Render the map
    function renderMap(ctx) {
        let drawX = canvasWidth / 2 - gameStateCache.players[clientID].x;
        let drawY = canvasHeight / 2 - gameStateCache.players[clientID].y;
        //gameCanvas.drawImage(images['spritesheet1'], 0, 0);
        getSprite(gameStateCache.players[clientID].map).render(gameCanvasCtx, drawX, drawY);
    }

    //Render players
    function renderPlayers(ctx) {
        ctx.font = "16px Arial";
        //Render players
        for(let i in gameStateCache.players) {
            let player = gameStateCache.players[i]; //Save player
            if(player === undefined) continue;
            let drawX = player.x - gameStateCache.players[clientID].x + canvasWidth / 2;
            let drawY = player.y - gameStateCache.players[clientID].y + canvasHeight / 2;
            let map = player.map;

            //Skip rendering of players on different map
            if(gameStateCache.players[clientID].map !== player.map) continue;

            //Render player sprite
            let sprite = getSprite(player.spriteName);
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
            ctx.fillText(player.username, drawX + sprite.width / 2 - 50 + 2, drawY - sprite.width + 16);
        }
    }

    //Render projectiles
    function renderProjectiles(ctx) {
        //Render projectiles
        for(let i in gameStateCache.projectiles) {
            let projectile = gameStateCache.projectiles[i];
            let drawX = projectile.x - gameStateCache.players[clientID].x + canvasWidth / 2;
            let drawY = projectile.y - gameStateCache.players[clientID].y + canvasHeight / 2;

            //Skip rendering of projectiles on different maps
            if(gameStateCache.players[clientID].map !== projectile.map) continue;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            let sprite = getSprite(projectile.spriteName);
            sprite.render(ctx, drawX, drawY);
        }
    }
});
