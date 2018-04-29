module.exports = function() {
    //Return a random integer between a min and max
    this.getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Min is inclusive, max in exclusive
    };

    //Count the number of not null values in an array
    this.getArrayIndexesInUse = function(array) {
        let count = 0;
        for(let i in array) if(array[i] != undefined) count++;
        return count;
    };

    //Search for an index in an array
    this.getNextAvailableArrayIndex = function(array, maxIndex) {
        for(let i = 0; i < maxIndex; i++) {
            if(array[i] == undefined) return i;
        }
        return -1;
    };

    //Custom server alert messages
    this.serverMessage = function(messageType, messageContent) {
        console.log('[' + messageType + '] - ' + messageContent);
    };

    //Send a message to a list of clients
    this.sendMessageToClients = function(socketList, messageContent, messageStyle, messageFrom, senderMap) {
        //Send new message to all players
        for(let i in socketList) {
            socketList[i].emit('addToChat', {username: messageFrom, message: messageContent, messageStyle: messageStyle, messageMap: senderMap});
        }
    };

    //Get the angle between two points
    this.getAngle = function(point1, point2) {
        let deltaY = point1.y - point2.y;
        let deltaX = point2.x - point1.x;
        let inRads = Math.atan2(deltaY, deltaX);
        if (inRads < 0)
            inRads = Math.abs(inRads);
        else
            inRads = 2 * Math.PI - inRads;
        return inRads * 180 / Math.PI ;
    };

    //Find the point in a list of points
    this.findNearestPoint = function(entityList, point) {
        let minDistance = -1;
        let closestEntity = null;

        for(let i in entityList) {
            let e = entityList[i];
            let distance = distanceBetweenPoints(e.x, e.x, point.x, point.y);
            if(distance < minDistance || closestEntity == null) {
                minDistance = distance;
                closestEntity = e;
            }
        }
        return closestEntity;
    };

    this.distanceBetweenPoints = function(point1, point2) {
        if(point1 == null || point2 == null) return 0;
        return Math.abs(Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)));
    };

    this.arrayContainsArrayItem = function(arr1, arr2) {
        for(let i1 in arr1) {
            for(let i2 in arr2) {
                if(arr1[i1] === arr2[i2]) return true;
            }
        }
        return false;
    };
};