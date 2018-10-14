function updateDetailCard(mouseMapPoint) {
    let targetEntity = getEntityAtLocation(mouseMapPoint);
    if(targetEntity != null && targetEntity.name != "projectile") {
        setDetailCardContent(targetEntity);
    } else if(client.player != null) {
        setDetailCardContent(client.player);
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