require('../utils.js')();

module.exports = function() {
    this.Command = class {
        constructor(arg1, argsCount, commandFunction, description, argsExample, hasMultiWordArgs) {
            this.arg1 = arg1;
            this.argsCount = argsCount;
            this.commandFunction = commandFunction;
            this.description = description;
            this.argsExample = argsExample;
            this.hasMultiWordArgs = hasMultiWordArgs;
        }

        execute(serverCache, command) {
            if(this.commandFunction == null) return;
            if(this.hasMultiWordArgs) {
                let tempArgs = command.args.join(' ');
                command.args = [];
                for(let i = 0; i < this.argsCount; i++) {
                    command.args.push(tempArgs.split(' ')[i]);
                }
                command.args[this.argsCount] = tempArgs.split(' ').slice(this.argsCount).join(' ');
                console.log(command.args);
            }
            if(command.args.length - 1 != this.argsCount) {
                sendMessageToClients([command.socketList[command.senderSocketId]], "Command failed - " + command.args[0] + " takes " +
                    this.argsCount + " arguments but got " + (command.args.length - 1), "info");
                return;
            }
            this.commandFunction(serverCache, command);
        }
    };
    Command.commandList = [
        new Command('/help', 0, showHelpCommand, 'Show the help dialog', ''),
        new Command('/ann', 1, serverAnnounceCommand, 'Announce a message to the server', '[message]', true),
        new Command('/tp', 2, playerTeleportCommand, 'Teleport to a tile location', '[x] [y]'),
        new Command('/maplist', 0, mapListCommand, 'Display a list of all maps', ''),
        new Command('/map', 1, switchMapCommand, 'Switch to a different map', '[map name]'),
        new Command('/msg', 2, privateMsgPlayerCommand, 'Privately message a single player', '[username] [message]', true)
    ];

    //Handle server commands from the client
    this.processServerCommand = function(serverCache, command) {
        serverMessage("INFO", command.playerList[command.senderSocketId].name + " submitted a command: " + command.args);
        for(let i = 0; i < Command.commandList.length; i++) {
            if(Command.commandList[i].arg1 === command.args[0]) {
                Command.commandList[i].execute(serverCache, command);
                return;
            }
        }
        sendMessageToClients([command.socketList[command.senderSocketId]], "Invalid command: " + command.args, "announcement", "SERVER");
    };

    function serverAnnounceCommand(serverCache, command) {
        sendMessageToClients(command.socketList, command.args[1], "announcement", "SERVER");
    }

    function showHelpCommand(serverCache, command) {
        sendMessageToClients([command.socketList[command.senderSocketId]], "Server Commands Help", "info");
        let helpMessage = "";
        for(let i = 0; i < Command.commandList.length; i++) {
            helpMessage = Command.commandList[i].arg1 + " " + Command.commandList[i].argsExample + " = " + Command.commandList[i].description + ".";
            sendMessageToClients([command.socketList[command.senderSocketId]], helpMessage, "info");
        }
    }

    function playerTeleportCommand(serverCache, command) {
        command.playerList[command.senderSocketId].setTileLocation(command.args[1], command.args[2]);
    }

    function mapListCommand(serverCache, command) {
        sendMessageToClients([command.socketList[command.senderSocketId]], 'MAPS: ' + Map.getMapListString(), 'info');
    }

    function switchMapCommand(serverCache, command) {
        if(Map.getMapByName(command.args[1]) === false) return;
        let playerIndex = getPlayerIndexBySocketId(serverCache.playerList, command.senderSocketId);
        sendMessageToClients([command.socketList[command.senderSocketId]], 'Switching to map: ' + command.args[1] + '...', 'info');
        serverCache.playerList[playerIndex].changeMap(serverCache, Map.getMapByName(command.args[1]));
    }

    function privateMsgPlayerCommand(serverCache, command) {
        let senderPlayer = command.playerList[command.senderSocketId];
        let sendToPlayer = getPlayerByUsername(command.playerList, command.args[1]);
        if(sendToPlayer != null) {
            sendMessageToClients([command.socketList[sendToPlayer.id]], command.args[2], "info", "From: " + senderPlayer.name, senderPlayer.map.name);
            sendMessageToClients([command.socketList[command.senderSocketId]], command.args[2], "info", "To: " + sendToPlayer.name, sendToPlayer.map.name);
        } else {
            sendMessageToClients([command.socketList[command.senderSocketId]], "Cannot find player: " + command.args[1], "", "Server");
        }
    }
};