class ResourceManager {
    constructor() {
    }

    static getSpriteByID(searchID) {
        for(let i in this.sprites) if(this.sprites[i].id === searchID) return this.sprites[i];
        return this.sprites[0];
    }

    static getSpriteByName(searchName) {
        return ResourceManager.sprites[searchName] == undefined ? ResourceManager.sprites.tileDarkWater : ResourceManager.sprites[searchName];
    }

    static getItemByName(searchName) {
        for(let i in ResourceManager.itemList)
            if(ResourceManager.itemList[i].name.toString().toLowerCase() === searchName.toString().toLowerCase()) return ResourceManager.itemList[i];
        return null;
    }

    static getEntityByName(searchName) {
        for(let i in ResourceManager.entityList)
            if(ResourceManager.entityList[i].name.toString().toLowerCase() === searchName.toString().toLowerCase()) return ResourceManager.entityList[i];
        return null;
    }

    static santityCheck() {
        let src = ResourceManager.sprites; 
        let result = [];
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                for (var key2 in src) {
                    if (src.hasOwnProperty(key2)) {
                        if(src[key].width == src[key2].width && 
                            src[key].startX == src[key2].startX && src[key].startY == src[key2].startY 
                            && key != key2) {
                            result.push({key1:key, key2: key2})
                            break;
                        }
                    }
                }
            }
        }
        if(result.length > 0) {
            console.log("Resource Manager Sanity Check - FAILURE - " + result.length + " conflicts found:");
            for (var i in result) {
                console.log("Sprite conflict: " + result[i].key1 + " -> " + result[i].key2);
            }
        }
        
    }
}
ResourceManager.itemList = [];
ResourceManager.tileList = [];
ResourceManager.objectList = [];
ResourceManager.entityList = [];

//Images
ResourceManager.images = {
    'spritesheet_64x64': new Image(1600, 1600), //Load 64x64 spritesheet
    'spritesheet_16x16': new Image(1600, 1600), //Load 16x16 spritesheet
    'spritesheet_8x8': new Image(800, 800),     //Load 8x8 spritesheet
    'turnipGuy': new Image(64, 64)
};
let root = "../../../resources/";
ResourceManager.images['spritesheet_64x64'].src = root + 'img/spritesheet_64x64.png';
ResourceManager.images['spritesheet_16x16'].src = root + 'img/spritesheet_16x16.png';
ResourceManager.images['spritesheet_8x8'].src = root + 'img/spritesheet_8x8.png';
ResourceManager.images['turnipGuy'].src = root + 'img/turnipguy.png';

//Spritesheets
let ss64 = {"image": ResourceManager.images['spritesheet_64x64'], size: 64};
let ss16 = {"image": ResourceManager.images['spritesheet_16x16'], size: 16};
let ss8 = {"image": ResourceManager.images['spritesheet_8x8'], size: 8};

ResourceManager.sprites = {
    //Animated
    animLightWater: new Sprite(ss16, 0, 784 / 16, 3, 50, false),
    animDarkWater: new Sprite(ss16, 1, 784 / 16, 3, 50, false),
    animCampFire: new Sprite(ss16, 2, 784 / 16, 3, 100, true),

    //Creatures
    //Player
    playerDefault: new Sprite(ss64, 0, 0),

    //Mobs
    mobPrisonGuard: new Sprite(ss64, 10, 2),
    petDog: new Sprite(ss64, 10, 2),
    mobCube: new Sprite(ss64, 10, 4),
    mobDarkInsect: new Sprite(ss8, 0, 99, 1, 300, true),
    mobGreenSpider: new Sprite(ss8, 1, 99, 2, 200, false),

    //Tiles
    //Grass
    tileDarkGrass: new Sprite(ss16, 1, 0),
    tileDarkGrassLight: new Sprite(ss16, 1, 1),
    tileLightGrass: new Sprite(ss16, 2, 0),

    //Building
    tileStoneFloor: new Sprite(ss64, 3, 0),
    tileBrickWall: new Sprite(ss64, 3, 1),
    tilePlanksFloor: new Sprite(ss64, 3, 2),
    tileMarbleFloor: new Sprite(ss16, 3, 0),

    //Water
    tileDarkWater: new Sprite(ss16, 0, 1),
    tileLightWater: new Sprite(ss16, 0, 0),
    tileLightWaterRocks: new Sprite(ss64, 4, 2),
    tileBeachSand: new Sprite(ss64, 4, 3),

    //Desert
    tileDesertSand: new Sprite(ss64, 5, 0),
    tileDesertSandCactus: new Sprite(ss64, 5, 1),
    tileDesertSandPond: new Sprite(ss64, 5, 2),
    tileDesertSkull: new Sprite(ss64, 5, 3),
    tileDesertBones: new Sprite(ss64, 5, 4),

    //Snow
    tileSnow: new Sprite(ss16, 2, 1),
    tileIce: new Sprite(ss8, 0, 0),

    //Entities
    //Farming
    farmDirt: new Sprite(ss64, 6, 0),
    farmDirtRaked: new Sprite(ss64, 6, 1),
    farmDirtSeeds: new Sprite(ss64, 6, 2),
    farmDirtTomatoes: new Sprite(ss64, 6, 3),
    farmDirtCorn: new Sprite(ss64, 6, 4),
    farmDirtBlueberries: new Sprite(ss64, 6, 5),
    farmDirtPotatoes: new Sprite(ss64, 6, 6),
    farmTree: new Sprite(ss64, 6, 7),
    farmTreeCut: new Sprite(ss64, 6, 8),
    farmTreeApples: new Sprite(ss64, 6, 9),

    //Objects
    objRoundTreeLarge: new Sprite(ss64, 7, 8),
    
    objWillowTreeLarge: new Sprite(ss8, 1, 1),
    objMushroomLarge: new Sprite(ss8, 1, 0),
    objRoundBushSmall: new Sprite(ss8, 1, 2),
    objWildBushSmall: new Sprite(ss8, 1, 3),
    objDeadTreeSmall: new Sprite(ss8, 1, 4),
    objPineTreeLarge: new Sprite(ss8, 1, 6),
    objCactus: new Sprite(ss8, 1, 5),

    objPond: new Sprite(ss8, 2, 1),
    objBigFlowers: new Sprite(ss8, 2, 2),
    objBrownChest: new Sprite(ss8, 2, 5),
    objBigRock: new Sprite(ss8, 2, 6),
    objSmallRocks: new Sprite(ss8, 2, 7),
    objSmallFlowers: new Sprite(ss8, 2, 3), //fixme

    objTree: new Sprite(ss8, 3, 7),
    objPondLeaves: new Sprite(ss8, 3, 1),
    objSmallFlowersWhite: new Sprite(ss8, 3, 2),
    objBlossomTreeLargePink: new Sprite(ss8, 3, 3),
    objWillowTreeLargeLight: new Sprite(ss8, 3, 4),
    objBlossomTreeLargeGreen: new Sprite(ss8, 3, 5),
    objRoundTreeSnow: new Sprite(ss8, 3, 6),
    objBlossomTreeLargeBlue: new Sprite(ss8, 3, 8),

    objSnowman: new Sprite(ss16, 0, 2),
    objDeadTreeLargeSnow: new Sprite(ss64, 0, 3),

    //Items
    //Weapons
    bowWooden: new Sprite(ss64, 13, 0),
    staffCorn: new Sprite(ss64, 14, 0),
    armorCloth: new Sprite(ss64, 16, 0),

    //Consumables
    itemCorn: new Sprite(ss64, 17, 0),
    itemTomato: new Sprite(ss64, 17, 1),
    itemBlueberry: new Sprite(ss64, 17, 2),
    itemPotato: new Sprite(ss64, 17, 3),

    //Spells
    spellCorn: new Sprite(ss64, 18, 0),

    //Projectiles
    projBlueBall: new Sprite(ss64, 21, 0),
    projDarkBall: new Sprite(ss64, 21, 1)
};

ResourceManager.santityCheck();