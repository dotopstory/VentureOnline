class Sprite {
    constructor(startX, startY, width) {
        this.id = Sprite.nextID++;
        this.spritesheet = spritesheet;
        this.startX = startX * 64;
        this.startY = startY * 64;
        this.width = width;
    }

    render(ctx, x, y) {
        ctx.drawImage(spritesheet, this.startX, this.startY, this.width, this.width, x, y, this.width, this.width);
    }
}
Sprite.nextID = 0;

function getSprite(name) {
    return cachedSprites[name];
}

var cachedSprites = {};
var spritesheet = new Image(1600, 1600); //Load main spritesheet
spritesheet.src = '/client/res/img/spritesheet_64x64.png';

clientAlert('Loaded spritesheet: ' + spritesheet.width + ' x ' + spritesheet.height);

spritesheet.onload = function() {
    cachedSprites = {
        'test1': new Sprite(0, 0, 64)
    }
};
