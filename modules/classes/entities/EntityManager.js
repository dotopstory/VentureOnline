 module.exports = function() {
    this.EntityManager = class {
        constructor() {

        }

        static addPlayer(p) {
            EntityManager.playerList[p.id] = p;
        }

        static updateAllPlayers() {
            let pack = [];
            for(let i in EntityManager.playerList) {
                let player = EntityManager.playerList[i];
                player.update();
                pack[player.id] = {
                    id: player.id,
                    username: player.username,
                    spriteName: player.spriteName,
                    x: player.x,
                    y: player.y,
                    hp: player.hp,
                    maxHP: player.maxHP,
                    mapID: player.map.id
                };
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
                if(!e.isActive) {
                    delete EntityManager.entityList[i];
                    continue;
                }
                pack.push({
                    id: e.id,
                    x: e.x,
                    y: e.y,
                    spriteName: e.spriteName,
                    mapID: e.map.id
                });
            }
            return pack;
        }
    };
    EntityManager.nextID = 0;
    EntityManager.playerList = [];
    EntityManager.entityList = [];
 };
