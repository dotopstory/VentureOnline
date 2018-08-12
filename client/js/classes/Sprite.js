class Sprite {
    constructor(spriteSheet, startX, startY, size, frames, frameChangeFrequency, isLoopFrames) {
        this.id = Sprite.nextID++;
        this.spritesheet = spriteSheet;
        this.startX = startX * size;
        this.startY = startY * size;
        this.width = size;
        this.height = size;
        //Animated frames
        this.currentFrame = 0;
        this.nextFrame = 1;
        this.lastFrameChange = new Date().getTime();
        this.frames = (frames == null) ? 0 : frames; //Frames = number of frames above the current sprite (x, y) to use as animations frames
        this.frameChangeFrequency = frameChangeFrequency == null ? 0 : frameChangeFrequency; //Time (ms) between frame changes
        this.isLoopFrames = isLoopFrames == null ? false : isLoopFrames; //When on the last frame: go backwards or start from the first frame
    }

    render(ctx, x, y) {
        this.renderSize(ctx, x, y, 64, 64);
    }

    renderSize(ctx, x, y, width, height) {
        this.update();
        ctx.drawImage(this.spritesheet, this.startX, this.startY - this.height * this.currentFrame, this.width, this.height, x, y, width, height);
    }

    update() {
        if(new Date().getTime() - this.lastFrameChange > this.frameChangeFrequency) {
            this.lastFrameChange = new Date().getTime();
            this.changeFrame();
        }
    }

    changeFrame() {
        if(this.frames <= 0) return;
        if(this.currentFrame == this.frames && this.isLoopFrames) {
            this.nextFrame = -1;
        } else if(this.currentFrame == this.frames) {
                this.currentFrame = 0;
                return;
        } else if(this.currentFrame == 0) {
            this.nextFrame = 1;
        }
        this.currentFrame += this.nextFrame;
    }
}
Sprite.nextID = 0;