//Open socket
let socket = io();
let DEBUG_ON = true;
let client = new Client();
let gameCamera = null;
let gameElement;

//Prevent right click popup menu
document.oncontextmenu = function(event) {
    event.preventDefault();
};

function clientAlert(message) {
    if(DEBUG_ON) console.log(message);
}

$(window).on('load', function() {
    //Game objects
    gameElement = $('#gameCanvas');
    let gameCanvasCtx = gameElement[0].getContext('2d');
    let fps = 60, canvasWidth = 1000, canvasHeight = 750;
    let clientID = null;
    let clientPlayer = null;
    let gameStateCache = {
        players: {},
        projectiles: {}
    };
    gameCamera = new GameCamera(0, 0);

    //Canvas init
    gameElement.css({'width': canvasWidth, 'height': canvasHeight});
    gameElement.attr('width', canvasWidth);
    gameElement.attr('height', canvasHeight);

    //Listen for init pack from server
    socket.on('initPack', function(data) {
        client.id = data.socketID;
        client.setMap(data.map);
    });

    //Listen for player packet updates
    socket.on('update', function(data) {
        gameStateCache.players = data.players;
        gameStateCache.projectiles = data.projectiles;
        client.player = gameStateCache.players[client.id];
    });

    //Listen for new map changes
    socket.on('changeMap', function(data) {
        console.log(data);
        client.setMap(data.map);
    });

    //RENDER
    setInterval(function() {
        if(client.player == null) return;
        gameCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight); //Clear canvas

        //Draw game objects
        gameCamera.setPosition(client.player.x, client.player.y, canvasWidth, canvasHeight);
        renderMap(gameCanvasCtx);
        renderPlayers(gameCanvasCtx);
        renderProjectiles(gameCanvasCtx);

    }, 1000 / fps);

    //Render the map
    function renderMap(ctx) {
        let map = client.map;

        let xStart = parseInt(Math.max(0, gameCamera.xOffset / TILE_WIDTH));
        let xEnd = parseInt(Math.min(map.width, (gameCamera.xOffset + canvasWidth) / TILE_WIDTH + 1));
        let yStart = parseInt(Math.max(0, gameCamera.yOffset / TILE_HEIGHT));
        let yEnd = parseInt(Math.min(map.height, (gameCamera.yOffset + canvasHeight) / TILE_HEIGHT + 1));

        //console.log('xStart: ' + xStart + ' / xEnd: ' + xEnd + ' / yStart: ' + yStart + ' / yEnd: ' + yEnd);

        for(let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                let drawX = x * 64 - gameCamera.xOffset;
                let drawY = y * 64 - gameCamera.yOffset;

                let sprite = Tile.tileList[map.tiles[y * map.width + x]].sprite;
                sprite.render(ctx, drawX, drawY);
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
            if(client.player.mapID !== player.mapID) continue;

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
            if(client.player.mapID !== projectile.mapID) continue;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            let sprite = sprites.itemCorn;
            sprite.render(ctx, drawX, drawY);
        }
    }
});
