//Open socket
var socket = io();

//Game objects
var gameDiv = document.getElementById('div-game');
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var gameCanvas = document.getElementById('gameCanvas').getContext('2d');
var fps = 100, canvasWidth = 800, canvasHeight = 600;
gameCanvas.font = "30px Arial";
$('#gameCanvas').attr('width', canvasWidth);
$('#gameCanvas').attr('height', canvasHeight);

//Player cache class
class Player {
    constructor(initPack) {
        this.id = initPack.id;
        this.x = initPack.x;
        this.y = initPack.y;
        Player.list[this.id] = this;
    }
}
Player.list = {};

//Projectile cache class
class Projectile {
    constructor(initPack) {
        this.id = initPack.id;
        this.x = initPack.x;
        this.y = initPack.y;
        Projectile.list[this.id] = this;
    }
}
Projectile.list = {};

//Listen for player packet updates
socket.on('init', function(data) {
    //Draw players
    for(var i = 0; i < data.players.length; i++) {
        new Player(data.players[i]);
    }

    //Draw projectiles
    for(var i = 0; i < data.projectiles.length; i++) {
        new Projectile(data.projectiles[i]);
    }
});

//Listen for player packet updates
socket.on('update', function(data) {
    //Draw players
    for(var i in data.players) {
        //Update player data
        var pack = data.players[i];
        var p = Player.list[pack.id];
        if(p) {
            if(pack.x !== undefined) p.x = pack.x;
            if(pack.y !== undefined) p.y = pack.y;
        }
    }

    //Update projectiles
    for(var i = 0; i < data.projectiles.length; i++) {
        var pack = data.projectiles[i];
        var p = Projectile.list[data.projectiles[i].id];
        if(p) {
            if(pack.x !== undefined) p.x = pack.x;
            if(pack.y !== undefined) p.y = pack.y;
        }
    }
});

socket.on('remove', function(data) {
    for(var i = 0; i < data.players.length; i++)
        delete Player.list[data.players[i]];

    for(var i = 0; i < data.projectiles.length; i++)
        delete Projectile.list[data.projectiles[i]];
});

setInterval(function() {
    gameCanvas.clearRect(0, 0, 800, 600);
    for(var i in Player.list)
        gameCanvas.fillText(Player.list[i].id, Player.list[i].x, Player.list[i].y);

    for(var i in Projectile.list)
        gameCanvas.fillRect(Projectile.list[i].x - 5, Projectile.list[i].y - 5, 10, 10);
}, 60 / fps);
