//Open socket
let socket = io();
let gameElement = null;

//Game objects
let client = new Client();
let gameCamera = null;
let resourceManager = null;
let uiManager = null;

$(window).on("load", function() {
    initGame();
});

//Prevent right click popup menu
document.oncontextmenu = function(event) {
    event.preventDefault();
};

function clientAlert(message) {
    if(client.debugOn) console.log(message);
}

function initGame() {
    //Game objects
    gameElement = $('#gameCanvas');
    let gameCanvasCtx = gameElement[0].getContext('2d');
    let fps = 60, canvasWidth = 1280, canvasHeight = 832;
    let blendWidth = null, blendHeight = null;
    let gameStateCache = {
        players: [],
        projectiles: [],
        items: []
    };

    gameCamera = new GameCamera(0, 0);
    resourceManager = new ResourceManager();
    uiManager = new UIManager();

    //Canvas init
    $('#canvasContainer').css({'width': canvasWidth, 'height': canvasHeight});
    gameElement.css({'width': canvasWidth, 'height': canvasHeight});
    gameElement.attr('width', canvasWidth);
    gameElement.attr('height', canvasHeight);

    //Listen for init pack from server
    socket.on('initPack', function(data) {
        client.id = data.socketID;
        client.playerId = data.playerId;
        client.setMap(data.map);
        ResourceManager.itemList = data.resources.itemList;
        ResourceManager.tileList = data.resources.tileList;
        ResourceManager.objectList = data.resources.objectList;
        ResourceManager.entityList = data.resources.entityList;
    });

    //Listen for player packet updates
    socket.on('update', function(data) {
        let lastPlayer = client.player;

        //Cache entities
        gameStateCache.players = data.players;
        gameStateCache.entities = data.entities;
        gameStateCache.items = data.items;
        client.player = gameStateCache.players[getPlayerIndexById(gameStateCache.players, client.playerId)];
        if(lastPlayer == null) UIManager.onSignIn();
    });

    //Listen for new map changes
    socket.on('changeMap', function(data) {
        client.setMap(data.map);
    });

    //RENDER
    setInterval(function() {
        if(client.player == null) return;
        gameCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight); //Clear canvas

        //Draw game objects
        gameCamera.setPosition(client.player.x, client.player.y, canvasWidth, canvasHeight);

        gameCanvasCtx.mozImageSmoothingEnabled = false;
        gameCanvasCtx.webkitImageSmoothingEnabled = false;
        gameCanvasCtx.msImageSmoothingEnabled = false;
        gameCanvasCtx.imageSmoothingEnabled = false;

        renderMapTiles(gameCanvasCtx);
        blendMapTiles(gameCanvasCtx);
        renderMapObjects(gameCanvasCtx);
        renderItems(gameCanvasCtx);
        renderEntities(gameCanvasCtx);
        renderPlayers(gameCanvasCtx);
        renderGroundItems();
        postRender(gameCanvasCtx);
    }, 1000 / fps);

    //Render the map
    function renderMapTiles(ctx) {
        let map = client.map;

        let xStart = parseInt(Math.max(0, gameCamera.xOffset / TILE_WIDTH) - 1);
        let xEnd = parseInt(Math.min(map.width, (gameCamera.xOffset + canvasWidth) / TILE_WIDTH + 2));
        let yStart = parseInt(Math.max(0, gameCamera.yOffset / TILE_HEIGHT) - 1);
        let yEnd = parseInt(Math.min(map.height, (gameCamera.yOffset + canvasHeight) / TILE_HEIGHT + 2));

        for(let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                let drawX = parseInt(x * 64 - gameCamera.xOffset);
                let drawY = parseInt(y * 64 - gameCamera.yOffset);
                let tileID = map.tiles[y * map.width + x];
                let sprite = ResourceManager.sprites[ResourceManager.tileList[tileID].sprite];
                sprite.render(ctx, drawX, drawY);
            }
        }
    }

    function blendMapTiles(ctx) {
        let map = client.map;
        let xStart = parseInt(Math.max(0, gameCamera.xOffset / TILE_WIDTH));
        let xEnd = parseInt(Math.min(map.width, (gameCamera.xOffset + canvasWidth) / TILE_WIDTH));
        let yStart = parseInt(Math.max(0, gameCamera.yOffset / TILE_HEIGHT));
        let yEnd = parseInt(Math.min(map.height, (gameCamera.yOffset + canvasHeight) / TILE_HEIGHT));

        for(let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                let tileID = map.tiles[y * map.width + x];
                
                //Skip on tile blending if blend index is less than 1
                if(ResourceManager.tileList[tileID].blendIndex < 1) continue;

                let drawX = parseInt(x * 64 - gameCamera.xOffset);
                let drawY = parseInt(y * 64 - gameCamera.yOffset);
                let sprite = ResourceManager.sprites[ResourceManager.tileList[tileID].sprite];
                let isDownDiff = tileID !== map.tiles[(y + 1) * map.width + x];
                let isUpDiff = tileID !== map.tiles[(y - 1) * map.width + x];
                let isLeftDiff = tileID !== map.tiles[y * map.width + x - 1];
                let isRightDiff = tileID !== map.tiles[y * map.width + x + 1];
                
                let canvasSize = 64;
                let newCanvas = $('<canvas/>',{'class':'tileSelectCanvas'});
                let newCanvasCtx = newCanvas[0].getContext('2d');
                newCanvas.css({'width': canvasSize, 'height': canvasSize});
                newCanvas.attr('width', canvasSize);
                newCanvas.attr('height', canvasSize);
                newCanvas.attr('tileID', ResourceManager.tileList[i].id);
                sprite.renderFrameSize(newCanvasCtx, 0, 0, canvasSize, canvasSize, 0);
                let c = newCanvasCtx.getImageData(32, 32, 1, 1).data;

                //Blend options
                if(blendWidth == null || blendHeight  == null) {
                    let blendVariance = 8;
                    blendWidth = 64 + getRandomInt(-blendVariance, blendVariance);
                    blendHeight = 64 + getRandomInt(-blendVariance, blendVariance);
                    blendDepth = 6;
                }

                //Check left
                if(isLeftDiff) {
                    //Blend tiles
                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.6)";
                    ctx.fillRect(drawX, drawY, blendDepth, blendHeight);

                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.4)";
                    ctx.fillRect(drawX - blendDepth, drawY, blendDepth, blendHeight);

                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.3)";
                    ctx.fillRect(drawX - blendDepth * 2, drawY, blendDepth, blendHeight);
                }

                //Check right
                if(isRightDiff) {
                    //Blend tiles
                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.6)";
                    ctx.fillRect(drawX + 60, drawY, blendDepth, blendHeight);

                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.4)";
                    ctx.fillRect(drawX + 64, drawY, blendDepth, blendHeight);

                    ctx.fillRect(drawX + 64, drawY + 32, blendDepth, blendHeight / 2);
                }

                //Check up
                if(isUpDiff) {
                    //Blend tiles
                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.6)";
                    ctx.fillRect(drawX, drawY, blendWidth, blendDepth);

                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.4)";
                    ctx.fillRect(drawX, drawY - blendDepth, blendWidth, blendDepth);

                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.3)";
                    ctx.fillRect(drawX, drawY - blendDepth * 2, blendWidth, blendDepth);

                    ctx.fillRect(drawX + 32, drawY - blendDepth * 3, blendWidth / 2, blendDepth);
                }

                //Check down
                if(isDownDiff) {
                    //Blend tiles
                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.6)";
                    ctx.fillRect(drawX, drawY + 60, blendWidth, blendDepth);

                    ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 0.4)";
                    ctx.fillRect(drawX, drawY + 64, blendWidth, blendDepth);

                    ctx.fillRect(drawX, drawY + 68, blendWidth / 2, blendDepth);
                }
            }
        }
    }

    //Render the map
    function renderMapObjects(ctx) {
        let map = client.map;

        let xStart = parseInt(Math.max(0, gameCamera.xOffset / TILE_WIDTH) - 1);
        let xEnd = parseInt(Math.min(map.width, (gameCamera.xOffset + canvasWidth) / TILE_WIDTH + 2));
        let yStart = parseInt(Math.max(0, gameCamera.yOffset / TILE_HEIGHT) - 1);
        let yEnd = parseInt(Math.min(map.height, (gameCamera.yOffset + canvasHeight) / TILE_HEIGHT + 2));

        for(let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                if(map.objects[y * map.width + x] == null) continue;

                let obj = map.objects[y * map.width + x];
                let drawX = x * 64 - gameCamera.xOffset + obj.xOffset;
                let drawY = y * 64 - gameCamera.yOffset + obj.yOffset;


                let sprite = ResourceManager.sprites[ResourceManager.objectList[obj.id].sprite];
                sprite.renderSize(ctx, drawX, drawY, ResourceManager.objectList[obj.id].size, ResourceManager.objectList[obj.id].size);
            }
        }
    }

    //Render each player
    function renderPlayers(ctx) {
        ctx.font = "16px Arial";
        for(let i in gameStateCache.players) {
            let player = gameStateCache.players[i]; //Save player
            if(player == undefined) continue;
            //Skip rendering of players on different map
            if(client.player.mapId !== player.mapId) continue;

            //Render player sprite
            let drawX = player.x - gameCamera.xOffset;
            let drawY = player.y - gameCamera.yOffset;
            let sprite = ResourceManager.getSpriteByName(player.spriteName);
            sprite.render(ctx, drawX, drawY);
            renderHpBar(ctx, player, sprite, 60, 6);
        }
    }

    function renderHpBar(ctx, entity, sprite, hpBarWidth, hpBarHeight) {
        if(entity == null || entity.type == "static") return;
        //Render HP bar
        let hpBarHeightPx = hpBarHeight;
        let hpBarWidthPx = hpBarWidth;
        let hpBarLineWidth = 1;
        let drawX = entity.x - gameCamera.xOffset;
        let drawY = entity.y - gameCamera.yOffset;
        let drawYOffset = sprite.height + hpBarHeightPx;
        
        //Draw hp bar black background
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(drawX + sprite.width / 2 - hpBarWidthPx / 2 - hpBarLineWidth, drawY + drawYOffset - hpBarLineWidth, hpBarWidthPx + hpBarLineWidth * 2, hpBarHeightPx + hpBarLineWidth *2);

        //Draw current hp bar
        ctx.fillStyle = getHpBarColor(entity.hp, entity.maxHP);
        ctx.fillRect(drawX + sprite.width / 2 - hpBarWidthPx / 2, drawY + drawYOffset, (entity.hp / entity.maxHP) * hpBarWidthPx, hpBarHeightPx);

        //Draw hp bar black outline
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.strokeRect(drawX + sprite.width / 2 - hpBarWidthPx / 2, drawY + drawYOffset, hpBarWidthPx, hpBarHeightPx);
    }

    //Render all non player entities
    function renderEntities(ctx) {
        //Render entities
        for(let i in gameStateCache.entities) {
            let e = gameStateCache.entities[i];
            let drawX = e.x - gameCamera.xOffset;
            let drawY = e.y - gameCamera.yOffset;

            //Skip rendering of projectiles on different maps
            if(client.player.mapId !== e.mapId) continue;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            let sprite = ResourceManager.getSpriteByName(e.spriteName);
            let entitySize = ResourceManager.getEntityByName(e.name);
            let drawWidth = entitySize != null ? entitySize.size : sprite.width;
            let drawHeight = entitySize != null ? entitySize.size : sprite.height;

            sprite.renderSize(ctx, drawX, drawY, drawWidth, drawHeight);
            renderHpBar(ctx, e, {width: drawWidth, height: drawHeight}, parseInt(drawWidth * 0.85), 4);
        }
    }

    //Render all items
    function renderItems(ctx) {
        for(let i in gameStateCache.items) {
            let item = gameStateCache.items[i];

            if(item == undefined) continue;
            let drawX = item.x - gameCamera.xOffset;
            let drawY = item.y - gameCamera.yOffset;

            //Skip rendering of projectiles on different maps
            if(client.player.mapId !== item.mapId) continue;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            let sprite = ResourceManager.getSpriteByName(ResourceManager.getItemByName(item.name).item_sprite);
            sprite.renderSize(ctx, drawX, drawY, 48, 48);
        }
    }

    //Render health effects
    function renderHealthEffects(ctx, fxList, startX, startY) {
        startX += 15;
        let renderCount = 0;
        for(let i in fxList) {
            let fx = fxList[i];
            if(fx == undefined) continue;

            //Configure styles
            ctx.font = '24px Ubuntu';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            //Select color
            ctx.fillStyle = fx.color.toString();

            //Render text
            ctx.fillText(fx.text, startX, startY - parseInt(fx.timer * 1.5));
            ctx.strokeText(fx.text, startX, startY - parseInt(fx.timer * 1.5));
            renderCount++;
            ctx.lineWidth = 1;
        }
    }

    //Rendering that must be done last/after other rendering
    function postRender(ctx) {
        //Post render entities
        for(let i in gameStateCache.entities) {
            let e = gameStateCache.entities[i];
            let drawX = e.x - gameCamera.xOffset;
            let drawY = e.y - gameCamera.yOffset;

            if(client.player.mapId === e.mapId) renderHealthEffects(ctx, e.healthEffects, drawX, drawY);
        }

        //Post render players
        for(let i in gameStateCache.players) {
            let player = gameStateCache.players[i]; //Save player
            if(player == undefined) continue;

            //Skip rendering of players on different map
            if(client.player.mapId != player.mapId) continue;

            let drawX = player.x - gameCamera.xOffset;
            let drawY = player.y - gameCamera.yOffset;
            renderHealthEffects(ctx, player.healthEffects, drawX, drawY);
        }
    }

    function renderGroundItems() {
        let itemList = [];
        for(let i in gameStateCache.items) {
            let item = gameStateCache.items[i];
            if(item === null) continue;
            if(item.mapId !== client.player.mapId || distanceBetweenPoints(item, client.player) > 64) continue;
            itemList.push(item);
        }
        renderItemDisplay(itemList, $('#invGroundItemsDisplay'));
    }

    function renderItemDisplay(itemList, display) {
        display.html('');
        let canvasSize = 48;

        for(let i in itemList) {
            let newCanvas = $('<canvas/>',{'class':'invItemCanvas'});
            let newCanvasCtx = newCanvas[0].getContext('2d');
            newCanvas.css({'width': canvasSize, 'height': canvasSize});
            newCanvas.attr('width', canvasSize);
            newCanvas.attr('height', canvasSize);
            newCanvas.attr('itemName', itemList[i].name);
            newCanvas.attr('itemId', itemList[i].id);
            //newCanvas.attr('onclick', 'mapEditSelectTile(' + i + ')');
            display.append(newCanvas);

            //Render sprite to canvas
            let sprite = ResourceManager.getSpriteByName(ResourceManager.getItemByName(itemList[i].name).item_sprite);
            sprite.renderSize(newCanvasCtx, 8, 8, 32, 32);
        }
    }
}
