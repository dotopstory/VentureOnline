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

    //@Deprecated
    render(ctx, x, y) {
        this.renderSize(ctx, x, y, 64, 64);
    }

    renderSize(ctx, x, y, width, height) {
        this.update();
        ctx.drawImage(this.spritesheet, this.startX, this.startY - this.height * this.currentFrame, this.width, this.height, x, y, width, height);
    }

    renderSizeLined(ctx, x, y, width, height) {
        this.update();
        let newCanvasCtx = this.getNewCanvasObject(this.getNewCanvasObject(width, height));
        this.renderSize(newCanvasCtx, 0, 0, width, height);
        this.applyOutline(newCanvasCtx, "#000000");
        ctx.drawImage(newCanvasCtx.canvas, x, y);
    }

    renderFrameSize(ctx, x, y, width, height, frameIndex) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY - this.height * frameIndex, this.width, this.height, x, y, width, height);
    }

    applyOutline(ctx, color) {
        var imageData = ctx.createImageData(64, 64);
        var data = imageData.data;
        for(let y = 0; y < 64; y++) {
            for(let x = 0; x < 64; x++) {
                let c = ctx.getImageData(x, y, 1, 1).data;
                let cUp = ctx.getImageData(x, y - 1, 1, 1).data;
                let cDown = ctx.getImageData(x, y + 1, 1, 1).data;
                let cLeft = ctx.getImageData(x - 1, y, 1, 1).data;
                let cRight = ctx.getImageData(x + 1, y, 1, 1).data;
                
                if(!Sprite.isVoidPixel(c) && (Sprite.isVoidPixel(cUp) || Sprite.isVoidPixel(cDown) || Sprite.isVoidPixel(cLeft) || Sprite.isVoidPixel(cRight))) { 
                    ctx.fillStyle = "rgba("+0+","+0+","+0+","+1+")";
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    getNewCanvasObject(width, height) {
        let newCanvas = $('<canvas/>', {"class": "pixelCanvas"});
        let newCanvasCtx = newCanvas[0].getContext('2d');
        newCanvas.css({'width': width, 'height': height});
        newCanvas.attr('width', width);
        newCanvas.attr('height', height);
        newCanvasCtx.mozImageSmoothingEnabled = false;
        newCanvasCtx.webkitImageSmoothingEnabled = false;
        newCanvasCtx.msImageSmoothingEnabled = false;
        newCanvasCtx.imageSmoothingEnabled = false;
        return newCanvasCtx;
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

Sprite.isVoidPixel = function(c) {
    if(c[0] == 0 && c[1] == 0 && c[2] == 0 && c[3] == 0) return true;
    return false;
}