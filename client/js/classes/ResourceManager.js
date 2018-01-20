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
//Images
ResourceManager.images = {
    'spritesheet1': new Image(1600, 1600), //Load main spritesheet}
    'turnipGuy': new Image(64, 64)
};
ResourceManager.images['spritesheet1'].src = '/client/res/img/spritesheet_64x64.png';
ResourceManager.images['turnipGuy'].src = '/client/res/img/turnipguy.png';

//Sprites
let ss = ResourceManager.images['spritesheet1'];
ResourceManager.sprites = {
    //*********************
    //**** CREATURES
    //*********************
    //PLAYER
    playerDefault: new Sprite(ss, 0, 0, 1),

    //
    mobPrisonGuard: new Sprite(ss, 10, 0, 1),

    //PETS
    petDog: new Sprite(ss, 10, 2, 1),

    //*********************
    //**** TILES
    //*********************
    //DARK GRASS
    tileDarkGrass: new Sprite(ss, 1, 0, 1),
    tileDarkGrassRocks: new Sprite(ss, 1, 1, 1),
    tileDarkGrassFlower: new Sprite(ss, 1, 2, 1),
    tileDarkGrassFlowers: new Sprite(ss, 1, 3, 1),

    //LIGHT GRASS
    tileLightGrass: new Sprite(ss, 2, 0, 1),
    tileLightGrassFlowers: new Sprite(ss, 2, 2, 1),

    //WATER
    tileDarkWater: new Sprite(ss, 4, 0, 1),
    tileLightWater: new Sprite(ss, 4, 1, 1),
    tileLightWaterRocks: new Sprite(ss, 4, 2, 1),

    //DESERT
    tileDesertSand: new Sprite(ss, 5, 0, 1),
    tileDesertSandCactus: new Sprite(ss, 5, 1, 1),
    tileDesertSandPond: new Sprite(ss, 5, 2, 1),
    tileDesertSkull: new Sprite(ss, 5, 3, 1),
    tileDesertBones: new Sprite(ss, 5, 4, 1),

    //*********************
    //**** ENTITIES
    //*********************
    //FARMING
    farmDirt: new Sprite(ss, 6, 0, 1),
    farmDirtRaked: new Sprite(ss, 6, 1, 1),
    farmDirtSeeds: new Sprite(ss, 6, 2, 1),
    farmDirtTomatoes: new Sprite(ss, 6, 3, 1),
    farmDirtCorn: new Sprite(ss, 6, 4, 1),
    farmDirtBlueberries: new Sprite(ss, 6, 5, 1),
    farmDirtPotatoes: new Sprite(ss, 6, 6, 1),
    farmTree: new Sprite(ss, 6, 7, 1),
    farmTreeCut: new Sprite(ss, 6, 8, 1),
    farmTreeApples: new Sprite(ss, 6, 9, 1),

    //Objects
    entityTree: new Sprite(ss, 7, 0, 1),
    entityPond: new Sprite(ss, 7, 1, 1),
    entityBrownChest: new Sprite(ss, 7, 2, 1),
    entityCactus: new Sprite(ss, 7, 3, 1),
    entityRock: new Sprite(ss, 7, 4, 1),

    //ITEMS
    //BOWS
    bowWooden: new Sprite(ss, 13, 0, 1),

    //STAVES
    staffCorn: new Sprite(ss, 14, 0, 1),

    //ARMOR
    armorCloth: new Sprite(ss, 16, 0, 1),

    //CONSUMABLES
    itemCorn: new Sprite(ss, 17, 0, 1),
    itemTomato: new Sprite(ss, 17, 1, 1),
    itemBlueberry: new Sprite(ss, 17, 2, 1),
    itemPotato: new Sprite(ss, 17, 2, 1)
};
