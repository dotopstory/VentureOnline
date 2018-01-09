class Sprite {
    constructor(spriteSheet, startX, startY, width) {
        this.id = Sprite.nextID++;
        this.spritesheet = spriteSheet;
        this.startX = startX * 64;
        this.startY = startY * 64;
        this.width = width * 64;
        this.height = width * 64;
    }

    render(ctx, x, y) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, x, y, this.width, this.height);
    }

    renderSize(ctx, x, y, width, height) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, x, y, width, height);
    }
}
Sprite.nextID = 0;