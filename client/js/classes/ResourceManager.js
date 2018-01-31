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
}
ResourceManager.itemList = {};
ResourceManager.tileList = {};
ResourceManager.objectList = {};

//Images
ResourceManager.images = {
    'spritesheet_64x64': new Image(1600, 1600), //Load 64x64 spritesheet
    'spritesheet_16x16': new Image(1600, 1600), //Load 16x16 spritesheet
    'spritesheet_8x8': new Image(800, 800),     //Load 8x8 spritesheet
    'turnipGuy': new Image(64, 64)
};
ResourceManager.images['spritesheet_64x64'].src = '/client/res/img/spritesheet_64x64.png';
ResourceManager.images['spritesheet_16x16'].src = '/client/res/img/spritesheet_16x16.png';
ResourceManager.images['spritesheet_8x8'].src = '/client/res/img/spritesheet_8x8.png';
ResourceManager.images['turnipGuy'].src = '/client/res/img/turnipguy.png';

//Sprites
let ss64 = ResourceManager.images['spritesheet_64x64'];
let ss16 = ResourceManager.images['spritesheet_16x16'];
let ss8 = ResourceManager.images['spritesheet_8x8'];

ResourceManager.sprites = {
    //*********************
    //**** CREATURES
    //*********************
    //PLAYER
    playerDefault: new Sprite(ss64, 0, 0, 64),

    //*********************
    //**** TILES
    //*********************
    //DARK GRASS
    tileDarkGrass: new Sprite(ss64, 1, 0, 64),
    tileDarkGrassRocks: new Sprite(ss64, 1, 1, 64),
    tileDarkGrassFlower: new Sprite(ss64, 1, 2, 64),
    tileDarkGrassFlowers: new Sprite(ss64, 1, 3, 64),

    //LIGHT GRASS
    tileLightGrass: new Sprite(ss64, 2, 0, 64),
    tileLightGrassFlowers: new Sprite(ss64, 2, 2, 64),

    //BUILDING
    tileStoneFloor: new Sprite(ss64, 3, 0, 64),
    tileBrickWall: new Sprite(ss64, 3, 1, 64),
    tilePlanksFloor: new Sprite(ss64, 3, 2, 64),

    //WATER
    tileDarkWater: new Sprite(ss64, 4, 0, 64),
    tileLightWater: new Sprite(ss64, 4, 1, 64),
    tileLightWaterRocks: new Sprite(ss64, 4, 2, 64),
    tileBeachSand: new Sprite(ss64, 4, 3, 64),

    //DESERT
    tileDesertSand: new Sprite(ss64, 5, 0, 64),
    tileDesertSandCactus: new Sprite(ss64, 5, 1, 64),
    tileDesertSandPond: new Sprite(ss64, 5, 2, 64),
    tileDesertSkull: new Sprite(ss64, 5, 3, 64),
    tileDesertBones: new Sprite(ss64, 5, 4, 64),

    //*********************
    //**** ENTITIES
    //*********************
    //FARMING
    farmDirt: new Sprite(ss64, 6, 0, 64),
    farmDirtRaked: new Sprite(ss64, 6, 1, 64),
    farmDirtSeeds: new Sprite(ss64, 6, 2, 64),
    farmDirtTomatoes: new Sprite(ss64, 6, 3, 64),
    farmDirtCorn: new Sprite(ss64, 6, 4, 64),
    farmDirtBlueberries: new Sprite(ss64, 6, 5, 64),
    farmDirtPotatoes: new Sprite(ss64, 6, 6, 64),
    farmTree: new Sprite(ss64, 6, 7, 64),
    farmTreeCut: new Sprite(ss64, 6, 8, 64),
    farmTreeApples: new Sprite(ss64, 6, 9, 64),

    //OBJECTS
    objTree: new Sprite(ss64, 7, 0, 64),
    objPond: new Sprite(ss64, 7, 1, 64),
    objBrownChest: new Sprite(ss64, 7, 2, 64),
    objCactus: new Sprite(ss64, 7, 3, 64),
    objBigRock: new Sprite(ss64, 7, 4, 64),
    objSmallFlowers: new Sprite(ss64, 7, 5, 64),
    objBigFlowers: new Sprite(ss64, 7, 6, 64),
    objSmallRocks: new Sprite(ss64, 7, 7, 64),
    objRoundTreeLarge: new Sprite(ss64, 7, 8, 64),
    objMushroomLarge: new Sprite(ss64, 7, 9, 64),
    objWillowTreeLarge: new Sprite(ss64, 7, 10, 64),
    objRoundBushSmall: new Sprite(ss64, 7, 11, 64),
    objWildBushSmall: new Sprite(ss64, 7, 12, 64),
    objDeadTreeSmall: new Sprite(ss64, 7, 13, 64),
    objPineTreeLarge: new Sprite(ss64, 7, 14, 64),

    //MOBS
    mobPrisonGuard: new Sprite(ss64, 10, 0, 64),
    petDog: new Sprite(ss64, 10, 2, 64),
    mobCube: new Sprite(ss64, 10, 4, 64),

    //ITEMS
    //BOWS
    bowWooden: new Sprite(ss64, 13, 0, 64),

    //STAVES
    staffCorn: new Sprite(ss64, 14, 0, 64),

    //ARMOR
    armorCloth: new Sprite(ss64, 16, 0, 64),

    //CONSUMABLES
    itemCorn: new Sprite(ss64, 17, 0, 64),
    itemTomato: new Sprite(ss64, 17, 1, 64),
    itemBlueberry: new Sprite(ss64, 17, 2, 64),
    itemPotato: new Sprite(ss64, 17, 2, 64),

    //SPELLS
    spellCorn: new Sprite(ss64, 18, 0, 64),

    //PROJECTILES
    projBlueBall: new Sprite(ss64, 21, 0, 64)
};
