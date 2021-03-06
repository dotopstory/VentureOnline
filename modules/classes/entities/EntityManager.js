require('../../utils.js')();
require('./Mob.js')();
require('./Item.js')();

module.exports = function() {
    this.EntityManager = class {
        static addPlayer(p) {
            EntityManager.playerList[getNextAvailableArrayIndex(EntityManager.playerList, 200)] = p;
        }

        static updateAllPlayers() {
            let pack = [];
            for(let i in EntityManager.playerList) {
                let player = EntityManager.playerList[i];
                player.update();

                //Update spawn timer
                if(EntityManager.spawnTimer > EntityManager.spawnTime) {
                    EntityManager.spawnEntitiesNearPoint(player, getRandomInt(3, 5));
                }

                //Add updated player to pack
                pack[player.id] = {
                    id: player.id,
                    name: player.name,
                    spriteName: player.spriteName,
                    x: player.x,
                    y: player.y,
                    stats: player.stats,
                    mapId: player.map.id,
                    healthEffects: player.healthEffects,
                    equipment: player.equipment,
                    type: player.type,
                    faction: player.faction
                };
            }
            if(EntityManager.spawnTimer > EntityManager.spawnTime) {
                EntityManager.spawnTimer = 0;
                EntityManager.spawnTime = 20 * getRandomInt(10, 15);
            }
            return pack;
        }

        static addEntity(e) {
            EntityManager.entityList.push(e);
        }

        static updateAllEntities() {
            let pack = [];
            for(let i in EntityManager.entityList) {
                let e = EntityManager.entityList[i];
                e.update();

                //Delete entity if inactive
                if(!e.isActive) {
                    EntityManager.entityList.splice(i, 1);
                    continue;
                }

                //Add updated entity to pack
                pack.push({
                    id: e.id,
                    name: e.name,
                    x: e.x,
                    y: e.y,
                    stats: e.stats,
                    spriteName: e.spriteName,
                    mapId: e.map.id,
                    healthEffects: e.healthEffects,
                    type: e.type,
                    faction: e.faction
                });
            }
            return pack;
        }

        static addItem(i) {
            EntityManager.itemList.push(i);
        }

        static updateAllItems() {
            let pack = [];
            for(let i in EntityManager.itemList) {
                //Update item
                let item = EntityManager.itemList[i];
                item.update();

                //Delete item if inactive
                if(!item.isActive) {
                    EntityManager.itemList.splice(i, 1);
                    continue;
                }

                //Add updated item to pack
                pack.push({
                    name: item.name,
                    x: item.x,
                    y: item.y,
                    mapId: item.mapId
                });
            }
            return pack;
        }

        static updateEntityManager() {
            EntityManager.spawnTimer++;
            EntityManager.playerGameState = EntityManager.updateAllPlayers();
            EntityManager.entityGameState = EntityManager.updateAllEntities();
            EntityManager.itemGameState = EntityManager.updateAllItems();
        }

        static spawnEntitiesNearPoint(point, spawnLimit) {
            let spawnRadius = 10, spawnAmount = 0;
            let startX = point.x - 64 * spawnRadius, startY = point.x - 64 * spawnRadius;
            let endX = point.x + 64 * spawnRadius, endY = point.x + 64 * spawnRadius;

            for(let y = startY; y < endY; y+= 64) {
                for(let x = startX; x < endX; x+= 64) {
                    if(spawnAmount >= spawnLimit) return;

                    if(getRandomInt(0, 100) < 5) {
                        let spawnX = x + 64 * 2;
                        let spawnY = y + 64 * 2;

                        let newEntity = ResourceManager.getRandomEntity(null);
                        let e = new Mob(newEntity, point.map, spawnX, spawnY);
                        if(distanceBetweenPoints(point, e) < 64 * 7) continue;

                        e.target = point;
                        EntityManager.addEntity(e);
                        spawnAmount++;
                    }
                }
            }
        }
    };
    EntityManager.nextID = 0;
    EntityManager.spawnTimer = 0;
    EntityManager.spawnTime = 1;
    EntityManager.playerList = [];
    EntityManager.entityList = [];
    EntityManager.itemList = [];
    EntityManager.playerGameState = [];
    EntityManager.entityGameState = [];
    EntityManager.itemGameState = [];
 };
