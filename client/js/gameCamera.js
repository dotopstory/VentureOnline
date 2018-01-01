const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;

class GameCamera {
    constructor(xOffset, yOffset) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    move(xAmount, yAmount) {
        this.xOffset += xAmount;
        this.yOffset += yAmount;
    }

    setPosition(x, y, screenWidth, screenHeight) {
        this.xOffset = x - screenWidth / 2;
        this.yOffset = y - screenHeight / 2;
    }
}