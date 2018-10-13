//Escape html in a string
function escapeHtml (string) {
    let entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

function distanceBetweenPoints(point1, point2) {
    if(point1 == null || point2 == null) return 0;
    return Math.abs(Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)));
}

function getHpBarColor(currentHp, maxHp) {
    let hpPercent = currentHp / maxHp * 100;
    if(hpPercent < 25) return "rgb(255, 0, 0, 1)";
    if(hpPercent < 50) return "rgb(255, 200, 0, 0.8)";
    if(hpPercent <= 100) return "rgba(0, 255, 0, 0.8)";
    return "rgba(255, 255, 255, 255, 1)";
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Min is inclusive, max in exclusive
};

//Search a playerlist and return the ID of the player that matches the given username
function getPlayerIndexById(playerList, searchId) {
    for(let i in playerList) {
        if(playerList[i] == null) continue;
        if(playerList[i].id === searchId) return i;
    }
    return null;
};

function getCenter(point, size) {
    return {x: parseInt(point.x + size / 2), y: parseInt(point.y + size / 2)};
}

function updateDetailCard(mouseMapPoint) {
    let targetEntity = getEntityAtLocation(mouseMapPoint);
    if(targetEntity != null && targetEntity.name != "projectile") {
        setDetailCardContent(targetEntity);
    }
}

function setDetailCardContent(entity) {
    $("#mainTitle").html(entity.name);
    $("#subTitle").html(entity.id);
    $("#statColumnLeft").html("");
    $("#statColumnRight").html("");
    let stats = entity.stats;
    setStat("HP", stats.currentHp + "/" + stats.maxHp);
    setStat("Attack", stats.attack);
    setStat("Regen", stats.regenHp);
    setStat("Defence", stats.defence);
    setStat("Speed", stats.moveSpeed);
    setStat("Dexterity", stats.dexterity);
}

function setStat(stat, value) {
    $("#statValue" + stat).html(value);
}

function getEntityAtLocation(point) {
    for(let i in gameStateCache.entities) {
        let entity = gameStateCache.entities[i];
        if(entity == null) continue;
        if(distanceBetweenPoints(getCenter(entity, 64), point) < 32) {
            return entity;
        }
    }
    for(let i in gameStateCache.players) {
        let player = gameStateCache.players[i];
        if(player == null) continue;
        if(distanceBetweenPoints(getCenter(player, 64), point) < 32) {
            return player;
        }
    }
    return null;
}

 //Temp
function getAngle(p1x, p1y, p2x, p2y) {
    let deltaY = p1y - p2y;
    let deltaX = p2x - p1x;
    let inRads = Math.atan2(deltaY, deltaX);
    if (inRads < 0)
        inRads = Math.abs(inRads);
    else
        inRads = 2 * Math.PI - inRads;
    return inRads * 180 / Math.PI ;
}