require('./modules/classes/ResourceManager.js')();
require('./modules/classes/entities/EntityManager.js')();
require('./modules/classes/world/Map.js')();
require('./modules/classes/entities/Player.js')();
require('./modules/enums/ServerState.js')();

//Initialise express routing
let express = require('express');
const app = express();
const server = require('http').Server(app);
server.state = ServerState.Offline;
const io = require('socket.io')(server);
const url = require('url');
const fs = require('fs');
const path = require('path');
server.portNum = process.env.PORT || 2000;
server.name = "Procreate 1.0 beta";
app.use(express.static(__dirname+'/client'));
app.get('*', function(req,res){
  res.sendFile(__dirname, 'index.html');
});

server.listen(server.portNum);

const tickRate = 20; //Updates per second
//Max clients connected (login screen)
const MAX_SERVER_CONNECTIONS = 10;
//Max players in game
const MAX_SERVER_PLAYERS = MAX_SERVER_CONNECTIONS;
const DEBUG_ON = server.portNum === 2000;
const SERVER_STARTUP_TIME = 1000 * (process.env.PORT ? 60 : 0);

//Listen for connection events
let SOCKET_LIST = [];

//Load resources
ResourceManager.init();
Map.mapList = [];
app.socketList = SOCKET_LIST;
app.playerList = EntityManager.playerList;

//Load maps
server.state = ServerState.Loading;
openConnections();
setTimeout(function () {
    server.state = ServerState.Ready;
    Map.mapList = [
        new Map({fileName: 'limbo'}),
        new Map({fileName: 'desert'}),
        new Map({fileName: 'test'}),
        new Map({fileName: 'arctic'}),
        new Map({fileName: 'randomisland'})
    ];
}, SERVER_STARTUP_TIME);

function openConnections() {
    serverMessage("INFO", server.name + " server started listening on port " + server.portNum + ".");
    io.sockets.on('connection', function(socket) {
        //Deny client connection if too many clients connected
        if(SOCKET_LIST.length + 1 > MAX_SERVER_CONNECTIONS) {
            serverMessage("WARN", "denied client connection. Active connections: " + SOCKET_LIST.length);
            return;
        }

        //Add socket to list
        socket.id = getNextAvailableArrayIndex(SOCKET_LIST, MAX_SERVER_CONNECTIONS);
        SOCKET_LIST[socket.id] = socket;
        serverMessage("INFO", "[CLIENT " + socket.id + "] connected to the server. ");

        //Listen for sign in attempts
        socket.on('signIn', function(data) {
            //Deny player sign in if too many players or server not ready.
            if(EntityManager.playerList.length + 1 > MAX_SERVER_PLAYERS || server.state != ServerState.Ready) {
                serverMessage("ALERT", " denied player sign-in on [SLOT " + socket.id + "].");
                return;
            }

            //Give default username if empty
            if(data.username === '') data.username = "Eddie " + socket.id;

            //Authenticate user
            if(true) {
                //Start player connect events
                Player.onConnect(SOCKET_LIST, socket, data.username);

                //Send sign in result and init pack
                socket.emit('signInResponse', {success: true});
                socket.emit('initPack', {socketID: socket.id, map: EntityManager.playerList[socket.id].map,
                    resources: {
                        itemList: ResourceManager.itemList,
                        tileList: ResourceManager.tileList,
                        objectList: ResourceManager.objectList
                    }
                });

                //Notify the server of new sign in
                serverMessage("INFO", "[CLIENT: " + socket.id + "] signed in as [PLAYER: '" + data.username + "'].");
            } else {
                //Send failed sing in response
                socket.emit('signInResponse', {success: false});
            }
        });

        //Remove client if disconnected (client sends disconnect automatically)
        socket.on('disconnect', function() {
            serverMessage("INFO", "[CLIENT: " + socket.id + "] disconnected from the server.");
            Player.onDisconnect(SOCKET_LIST, socket);
            delete SOCKET_LIST[socket.id];
        });
    });
}

//Client update loop
setInterval(function() {
    EntityManager.updateEntityManager();

    //Load package data
    let pack = {
        players: EntityManager.playerGameState,
        entities: EntityManager.entityGameState,
        items: EntityManager.itemList
    };

    //Send package data to all clients
    for(let i in EntityManager.playerList) {
        let socket = SOCKET_LIST[i];
        if(socket == undefined) continue;
        socket.emit('update', pack);
    }
}, 1000 / tickRate);
