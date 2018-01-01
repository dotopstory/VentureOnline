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