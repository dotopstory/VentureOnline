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
    }
};