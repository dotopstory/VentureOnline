class Tile {
    constructor(sprite) {
        this.id = Tile.nextID++;
        this.sprite = sprite;
        Tile.tileList.push(this);
        this.isSolid = false;
        this.isSlowing = false;
    }
}
Tile.nextID = 0;
Tile.tileList = [];

class RockTile extends Tile {
    constructor(sprite) {
        super(sprite);
        this.isSolid = true;
    }
}

class GrassTile extends Tile {
    constructor(sprite) {
        super(sprite);
    }
}

class WaterTile extends Tile {
    constructor(sprite) {
        super(sprite);
        this.isSlowing = true;
    }
}

function initTiles() {
    let sprites = ResourceManager.sprites;
    new GrassTile(sprites.tileLightGrass);
    new GrassTile(sprites.tileLightGrassFlowers);
    new GrassTile(sprites.tileDarkGrass);
    new GrassTile(sprites.tileDarkGrassRocks);
    new GrassTile(sprites.tileDarkGrassFlower);
    new GrassTile(sprites.tileDarkGrassFlowers);
    new RockTile(sprites.tileDarkWater);
    new WaterTile(sprites.tileLightWater);
    new WaterTile(sprites.tileLightWaterRocks);
    new GrassTile(sprites.tileDesertSand);
    new GrassTile(sprites.tileDesertSandCactus);
    new GrassTile(sprites.tileDesertSandPond);
    new GrassTile(sprites.tileDesertSkull);
    new GrassTile(sprites.tileDesertBones);
}

//Init
$(window).on('load', function() {
    initTiles();
});
