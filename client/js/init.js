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
    let clientPlayer = null;
    let gameStateCache = {
        players: {},
        projectiles: {}
    };
    let gameCamera = new GameCamera(0, 0);

    //Canvas init
    gameElement.css({'width': canvasWidth, 'height': canvasHeight});
    gameElement.attr('width', canvasWidth);
    gameElement.attr('height', canvasHeight);

    //Listen for init pack from server
    socket.on('initPack', function(data) {
        clientID = data.playerID;
    });

    //Listen for player packet updates
    socket.on('update', function(data) {
        gameStateCache.players = data.players;
        gameStateCache.projectiles = data.projectiles;
        clientPlayer = gameStateCache.players[clientID];
    });

    //RENDER
    setInterval(function() {
        if(clientID == null) return;
        if(clientPlayer == undefined) return;
        gameCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight); //Clear canvas

        //Draw game objects
        gameCamera.setPosition(clientPlayer.x, clientPlayer.y, canvasWidth, canvasHeight);
        renderMap(gameCanvasCtx);
        renderPlayers(gameCanvasCtx);
        renderProjectiles(gameCanvasCtx);

    }, 1000 / fps);

    //Render the map
    function renderMap(ctx) {
        let map = clientPlayer.map;

        for(let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let drawX = x * 64 - gameCamera.xOffset;
                let drawY = y * 64 - gameCamera.yOffset;
                sprites.lightWaterTile.render(ctx, drawX, drawY);
            }
        }
    }

    //Render players
    function renderPlayers(ctx) {
        ctx.font = "16px Arial";
        //Render players
        for(let i in gameStateCache.players) {
            let player = gameStateCache.players[i]; //Save player
            if(player == undefined) continue;
            let drawX = player.x - gameCamera.xOffset;
            let drawY = player.y - gameCamera.yOffset;

            //Skip rendering of players on different map
            if(clientPlayer.map.id !== player.map.id) continue;

            //Render player sprite
            let sprite = sprites.playerDefault;
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
            let drawX = projectile.x - gameCamera.xOffset;
            let drawY = projectile.y - gameCamera.yOffset;

            //Skip rendering of projectiles on different maps
            if(clientPlayer.map.id !== projectile.map.id) continue;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            let sprite = sprites.projectTileTest;
            sprite.render(ctx, drawX, drawY);
        }
    }
});
