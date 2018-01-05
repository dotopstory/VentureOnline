class Sprite {
    constructor(startX, startY, width) {
        this.id = Sprite.nextID++;
        this.spritesheet = images['spritesheet1'];
        this.startX = startX * 64;
        this.startY = startY * 64;
        this.width = width * 64;
        Sprite.spriteCount++;
    }

    render(ctx, x, y) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.width, x, y, this.width, this.width);
    }
}
Sprite.nextID = 0;
Sprite.spriteCount = 0;

function getSpriteByID(searchID) {
    for(let i in sprites) if(sprites[i].id === searchID) return sprites[i];
    return sprites[0];
}

let sprites = {};
let images = {
    'spritesheet1': new Image(1600, 1600), //Load main spritesheet}
    'turnipGuy': new Image(64, 64)
};

images['spritesheet1'].src = '/client/res/img/spritesheet_64x64.png';
images['turnipGuy'].src = '/client/res/img/turnipguy.png';

sprites = {
    //*********************
    //**** CREATURES
    //*********************
    //PLAYER
    playerDefault: new Sprite(0, 0, 1),

    //
    mobPrisonGuard: new Sprite(10, 0, 1),

    //PETS
    petDog: new Sprite(10, 2, 1),

    //*********************
    //**** TILES
    //*********************
    //DARK GRASS
    tileDarkGrass: new Sprite(1, 0, 1),
    tileDarkGrassRocks: new Sprite(1, 1, 1),
    tileDarkGrassFlower: new Sprite(1, 2, 1),
    tileDarkGrassFlowers: new Sprite(1, 3, 1),

    //LIGHT GRASS
    tileLightGrass: new Sprite(2, 0, 1),
    tileLightGrassFlowers: new Sprite(2, 2, 1),

    //WATER
    tileDarkWater: new Sprite(4, 0, 1),
    tileLightWater: new Sprite(4, 1, 1),
    tileLightWaterRocks: new Sprite(4, 2, 1),

    //DESERT
    tileDesertSand: new Sprite(5, 0, 1),
    tileDesertSandCactus: new Sprite(5, 1, 1),
    tileDesertSandPond: new Sprite(5, 2, 1),
    tileDesertSkull: new Sprite(5, 3, 1),
    tileDesertBones: new Sprite(5, 4, 1),

    //*********************
    //**** ENTITIES
    //*********************
    //FARMING
    farmDirt: new Sprite(6, 0, 1),
    farmDirtRaked: new Sprite(6, 1, 1),
    farmDirtSeeds: new Sprite(6, 2, 1),
    farmDirtTomatoes: new Sprite(6, 3, 1),
    farmDirtCorn: new Sprite(6, 4, 1),
    farmDirtBlueberries: new Sprite(6, 5, 1),
    farmDirtPotatoes: new Sprite(6, 6, 1),
    farmTree: new Sprite(6, 7, 1),
    farmTreeCut: new Sprite(6, 8, 1),
    farmTreeApples: new Sprite(6, 9, 1),

    //Objects
    entityTree: new Sprite(7, 0, 1),
    entityPond: new Sprite(7, 1, 1),
    entityBrownChest: new Sprite(7, 2, 1),
    entityCactus: new Sprite(7, 3, 1),
    entityRock: new Sprite(7, 4, 1),

    //ITEMS
    //CONSUMABLES
    itemCorn: new Sprite(17, 0, 1),
    itemTomato: new Sprite(17, 1, 1),
    itemBlueberry: new Sprite(17, 2, 1),
    itemPotato: new Sprite(17, 2, 1),

    //STAVES
    staffCorn: new Sprite(14, 0, 1),
};
