class Sprite {
    constructor(spriteSheet, startX, startY, size) {
        this.id = Sprite.nextID++;
        this.spritesheet = spriteSheet;
        this.startX = startX * size;
        this.startY = startY * size;
        this.width = size;
        this.height = size;
    }

    render(ctx, x, y) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, x, y, 64, 64);
    }

    renderSize(ctx, x, y, width, height) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, x, y, width, height);
    }
}
Sprite.nextID = 0;