require('../utils.js')();

module.exports = function() {
    this.Command = class {
        constructor(arg1, argsCount, commandFunction, description, argsExample) {
            this.arg1 = arg1;
            this.argsCount = argsCount;
            this.commandFunction = commandFunction;
            this.description = description;
            this.argsExample = argsExample;
        }

        execute(command) {
            if(this.commandFunction != null) this.commandFunction(command);
        }
    };
    Command.commandList = [
        new Command('/help', 0, showHelpCommand, 'Show the help dialog', ''),
        new Command('/ann', 1, serverAnnounceCommand, 'Announce a message to the server', '[message]')

    ];

    //Handle server commands from the client
    this.processServerCommand = function(command) {
        for(let i = 0; i < Command.commandList.length; i++) {
            serverMessage(command.playerList[command.senderSocketId].username + " submitted a command: " + command.args);
            if(Command.commandList[i].arg1 === command.args[0]) {
                Command.commandList[i].execute(command);
                return;
            }
        }
        sendMessageToClients([command.socketList[command.senderSocketId]], "Invalid command: " + command.args, "announcement", "SERVER");
    };

    function serverAnnounceCommand(command) {
        sendMessageToClients(command.socketList, command.args[1], "announcement", "SERVER");
    }

    function showHelpCommand(command) {
        sendMessageToClients(command.socketList, "Server Commands Help", "announcement", "SERVER");
        let helpMessage = "";
        for(let i = 0; i < Command.commandList.length; i++) {
            helpMessage = Command.commandList[i].arg1 + " " + Command.commandList[i].argsExample + " = " + Command.commandList[i].description + ".";
            sendMessageToClients(command.socketList, helpMessage, "announcement", "SERVER");
        }

    }
};

// let splitMessage = commandLine.split(' ');
// let command = splitMessage[0];
// let param1 = splitMessage[1];
// let param2 = splitMessage[2];
//
// if(command === '/announce' || command === '/ann') {
//     delete splitMessage[0];
//     let message = splitMessage.join(' ');
//     sendMessageToClients(SOCKET_LIST, message, 'announcement', 'SERVER');
// } else if(command === '/tp' || command === '/teleport') {
//     EntityManager.playerList[senderSocketID].setTileLocation(param1, param2);
// } else if(command === '/map') {
//     if(param1 === 'list') {
//         sendMessageToClients([SOCKET_LIST[EntityManager.playerList[senderSocketID].id]], 'MAPS: ' + Map.getMapListString(), 'info');
//     } else if(param1 === 'reset') {
//         let oldMap =  EntityManager.playerList[senderSocketID].map;
//         let newMap = new Map({id: oldMap.id, name: oldMap.name, width: oldMap.width, height: oldMap.height, tileSeedID: parseInt(param2)});
//         Map.mapList[oldMap.id] = newMap;
//         EntityManager.playerList[senderSocketID].changeMap(newMap);
//     } else {
//         if(Map.getMapByName(param1) === false) return;
//         EntityManager.playerList[senderSocketID].changeMap(Map.getMapByName(param1));
//     }
// }
