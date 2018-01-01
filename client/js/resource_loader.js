class Sprite {
    constructor(startX, startY, width) {
        this.id = Sprite.nextID++;
        this.spritesheet = images['spritesheet1'];
        this.startX = startX * 64;
        this.startY = startY * 64;
        this.width = width * 64;
    }

    render(ctx, x, y) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.width, x, y, this.width, this.width);
    }
}
Sprite.nextID = 0;

function getSprite(name) {
    return sprites[name];
}

let sprites = {};
let images = {
    'spritesheet1': new Image(1600, 1600), //Load main spritesheet}
    'turnipGuy': new Image(64, 64)
};

images['spritesheet1'].src = '/client/res/img/spritesheet_64x64.png';
images['turnipGuy'].src = '/client/res/img/turnipguy.png';

sprites = {
    playerDefault: new Sprite(0, 0, 1),
    projectTileTest: new Sprite(1, 0, 1),
    lightWaterTile: new Sprite(4, 0, 1)
};
