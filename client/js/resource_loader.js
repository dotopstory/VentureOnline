class Sprite {
    constructor(startX, startY, width) {
        this.id = Sprite.nextID++;
        this.spritesheet = images['spritesheet1'];
        this.startX = startX == 0 ? startX * 64 : startX * 64 + 1;
        this.startY = startY == 0 ? startY * 64 : startY * 64 + 1;
        this.width = width * 64;
    }

    render(ctx, x, y) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.width, x, y, this.width, this.width);
    }
}
Sprite.nextID = 0;

function getSprite(name) {
    return cachedSprites[name];
}

var cachedSprites = {};
var images = {
    'spritesheet1': new Image(1600, 1600), //Load main spritesheet}
    'turnipGuy': new Image(64, 64)
}
images['spritesheet1'].src = '/client/res/img/spritesheet_64x64.png';
images['turnipGuy'].src = '/client/res/img/turnipguy.png';

cachedSprites = {
    'default': new Sprite(0, 0, 1),
    'test1': new Sprite(0, 0, 1),
    'test2': new Sprite(1, 0, 1),
    'map1': new Sprite(0, 0, 5),
    'map2': new Sprite(5, 5, 5)
}
