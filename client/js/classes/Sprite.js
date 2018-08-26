class Sprite {
    constructor(spriteSheet, startX, startY, frames, frameChangeFrequency, isLoopFrames) {
        this.id = Sprite.nextID++;
        this.spritesheet = spriteSheet.image;
        this.width = spriteSheet.size;
        this.height = spriteSheet.size;
        this.startX = startX * this.width;
        this.startY = startY * this.height;
        
        //Animated frames
        this.currentFrame = 0;
        this.nextFrame = 1;
        this.lastFrameChange = new Date().getTime();
        this.frames = (frames == null) ? 0 : frames; //Frames = number of frames above the current sprite (x, y) to use as animations frames
        this.frameChangeFrequency = frameChangeFrequency == null ? 0 : frameChangeFrequency; //Time (ms) between frame changes
        this.isLoopFrames = isLoopFrames == null ? false : isLoopFrames; //When on the last frame: go backwards or start from the first frame
        this.preRenderedFrames = {};
    }

    //@Deprecated
    //Render a sprite
    render(ctx, x, y) {
        this.update();
        this.renderSize(ctx, x, y, 64, 64);
    }

    //Render a sprite at a specific size
    renderSize(ctx, x, y, width, height) {
        this.update();
        ctx.drawImage(this.spritesheet, this.startX, this.startY - this.height * this.currentFrame, this.width, this.height, x, y, width, height);
    }

    //Render a sprite at a specific size with an outline
    renderSizeLined(ctx, x, y, width, height) {
        this.update();
        if(this.preRenderedFrames[this.currentFrame] == null) {
            let newCanvasCtx = this.getNewCanvasObject(this.getNewCanvasObject(width, height));
            this.renderSize(newCanvasCtx, 0, 0, width, height);
            this.applyOutline(newCanvasCtx, width, height);
            this.preRenderedFrames[this.currentFrame] = newCanvasCtx;
        }
        ctx.drawImage( this.preRenderedFrames[this.currentFrame].canvas, x, y);
    }

    //Render a specific frame at a specific size
    renderFrameSize(ctx, x, y, width, height, frameIndex) {
        this.update();
        ctx.drawImage(this.spritesheet, this.startX, this.startY - this.height * frameIndex, this.width, this.height, x, y, width, height);
    }

    //Outline the shape of a sprite
    applyOutline(ctx, width, height) {
        for(let y = 0; y < width; y++) {
            for(let x = 0; x < height; x++) {
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

    //Get a new canvas object to pre-render a sprite onto
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

    //Update animation frames
    update() {
        if(this.frames > 0) {
            if(new Date().getTime() - this.lastFrameChange > this.frameChangeFrequency) {
                this.lastFrameChange = new Date().getTime();
                this.changeFrame();
            }
        }
    }

    //Change the current frame
    changeFrame() {
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

//Check if a pixel in the sprite is void
Sprite.isVoidPixel = function(c) {
    if(c[0] == 0 && c[1] == 0 && c[2] == 0 && c[3] == 0) return true;
    return false;
}