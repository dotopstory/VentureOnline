module.exports = function() {
    //Return a random integer between a min and max
    this.getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Min is inclusive, max in exclusive
    };

    //Count the number of not null values in an array
    this.getArrayIndexesInUse = function(array) {
        playerCount = 0;
        for(let i in array) if(array[i] != undefined) playerCount++;
        return playerCount;
    };

    //Search for an index in an array
    this.getNextAvailableArrayIndex = function(array, maxIndex) {
        for(let i = 0; i < maxIndex; i++) {
            if(array[i] == undefined) return i;
        }
        return -1;
    };

    //Custom server alert messages
    this.serverMessage = function(message) {
        console.log(message);
    };

    //Send a message to a list of clients
    this.sendMessageToClients = function(socketList, messageContent, messageStyle, messageFrom, senderMap) {
        //Send new message to all players
        for(let i in socketList) {
            socketList[i].emit('addToChat', {username: messageFrom, message: messageContent, messageStyle: messageStyle, messageMap: senderMap});
        }
    };

    this.getAngle = function(p1x, p1y, p2x, p2y) {
        let deltaY = p1y - p2y;
        let deltaX = p2x - p1x;
        let inRads = Math.atan2(deltaY, deltaX);
        if (inRads < 0)
            inRads = Math.abs(inRads);
        else
            inRads = 2 * Math.PI - inRads;
        return inRads * 180 / Math.PI ;

    };

    this.findNearestEntity = function(entityList, pixelX, pixelY) {
        let minDistance = -1;
        let closestEntity = null;

        for(let i in entityList) {
            let e = entityList[i];
            let distance = distanceBetweenPoints(e.x, e.x, pixelX, pixelY);
            if(distance < minDistance || closestEntity == null) {
                minDistance = distance;
                closestEntity = e;
            }
        }
        return closestEntity;
    };

    this.distanceBetweenPoints = function(p1x, p1y, p2x, p2y) {
        return Math.abs(Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2)));

    };
};