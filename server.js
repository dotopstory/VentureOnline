require('./modules/classes/ResourceManager.js')();
require('./modules/classes/entities/EntityManager.js')();
require('./modules/classes/world/Map.js')();
require('./modules/classes/entities/Player.js')();
require('./modules/enums/ServerState.js')();
let serverRoutes = require('./modules/serverRoutes.js');

//Initialise express routing
let express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const url = require('url');
const fs = require('fs');
const path = require('path');
app.use(express.static(__dirname + '/client'));
let serverCache = {};
serverCache.portNum = process.env.PORT || 2000;
serverCache.name = "Procreate 1.0 beta";
server.listen(serverCache.portNum);
const tickRate = 20; //Updates per second
//Max clients connected (login screen)
const MAX_SERVER_CONNECTIONS = 10;
//Max players in game
const MAX_SERVER_PLAYERS = MAX_SERVER_CONNECTIONS;
const DEBUG_ON = serverCache.portNum === 2000;
const SERVER_STARTUP_TIME = 1000 * (process.env.PORT ? 60 : 0);

//Listen for connection events
serverRoutes(__dirname, app, serverCache);

//Load resources
ResourceManager.init();
Map.mapList = [];
serverCache.socketList = [];
serverCache.playerList = EntityManager.playerList;
serverCache.playerCache = [];

//Load maps
serverCache.state = ServerState.Loading;
openConnections();
setTimeout(function () {
    serverCache.state = ServerState.Ready;
    Map.mapList = [
        new Map({fileName: 'limbo'}),
        new Map({fileName: 'desert'}),
        new Map({fileName: 'test'}),
        new Map({fileName: 'arctic'}),
        new Map({fileName: 'randomisland'})
    ];
}, SERVER_STARTUP_TIME);

function openConnections() {
    serverMessage("INFO", serverCache.name + " server started listening on port " + serverCache.portNum + ".");
    io.sockets.on('connection', function(socket) {
        //Deny client connection if too many clients connected
        if(getArrayIndexesInUse(serverCache.socketList) + 1 > MAX_SERVER_CONNECTIONS) {
            serverMessage("WARN", "denied client connection. Active connections: " + serverCache.socketList.length);
            return;
        }

        //Add socket to list
        socket.id = getNextAvailableArrayIndex(serverCache.socketList, MAX_SERVER_CONNECTIONS);
        serverCache.socketList[socket.id] = socket;
        serverMessage("INFO", "[CLIENT " + socket.id + "] connected to the server. ");

        //Listen for sign in attempts
        socket.on('signIn', function(data) {
            //Deny player sign in if too many players or server not ready.
            if(getArrayIndexesInUse(serverCache.playerList) + 1 > MAX_SERVER_PLAYERS || serverCache.state != ServerState.Ready) {
                serverMessage("ALERT", " denied client sign-in on [SLOT " + socket.id + "].");
                return;
            }
    
            //Give default username if empty
            if(data.username === '') return;

            //Authenticate user
            if(true) {
                //Start player connect events
                Player.onConnect(serverCache, socket, data.username);
                let player = getPlayerByUsername(serverCache.playerList, data.username);

                //Send sign in result and init pack
                socket.emit('signInResponse', {success: true});
                socket.emit('initPack', {socketID: socket.id, playerId: player.id, map: player.map,
                    resources: {
                        itemList: ResourceManager.itemList,
                        tileList: ResourceManager.tileList,
                        objectList: ResourceManager.objectList
                    }
                });

                //Notify the server of new sign in
                serverMessage("INFO", "[CLIENT: " + player.id + "] signed in as [PLAYER: '" + data.username + "'].");
            } else {
                //Send failed sing in response
                socket.emit('signInResponse', {success: false});
            }
        });

        //Remove client if disconnected (client sends disconnect automatically)
        socket.on('disconnect', function() {
            serverMessage("INFO", "[CLIENT: " + socket.id + "] disconnected from the server.");
            Player.onDisconnect(serverCache, socket);
            delete serverCache.socketList[socket.id];
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
        let socket = serverCache.socketList[i];
        if(socket == undefined) continue;
        socket.emit('update', pack);
    }
}, 1000 / tickRate);
