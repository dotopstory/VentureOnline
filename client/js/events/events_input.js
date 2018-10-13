let eventRegister = [];
let mouseX = 0, mouseY = 0;
let mouseMapX = 0, mouseMapY = 0;
let lastMouseMapX = 0, lastMouseMapY = 0;
let mouseMapPixelX = 0, mouseMapPixelY = 0;
let pressingMouse1 = false;
$(window).on('load', function() {
    //KEY DOWN EVENTS
    document.onkeydown = function(e) {
        let code = e.keyCode;
        if(eventRegister[code] === true) return;
        eventRegister[code] = true;

        //Prevent scrolling page with certain keys
        let blockDefaultKeysArr = [9];
        if(blockDefaultKeysArr.includes(e.keyCode)) {
            e.preventDefault();
        }

        if(!UIManager.isUiFocused()) {
            //Move events
            if(e.keyCode === 68) // KEY = D
                socket.emit('keyPress', {inputId: 'right', state: true});
            else if(e.keyCode === 83) // KEY = S
                socket.emit('keyPress', {inputId: 'down', state: true});
            else if(e.keyCode === 65) // KEY = A
                socket.emit('keyPress', {inputId: 'left', state: true});
            else if(e.keyCode === 87) // KEY = W
                socket.emit('keyPress', {inputId: 'up', state: true});
        }
    };

    //KEY UP EVENTS
    document.onkeyup = function(e) {
        let code = e.keyCode;

        eventRegister[code] = false;

        if(!UIManager.isUiFocused()) {
            //Move events
            if(e.keyCode === 68) // KEY = D
                socket.emit('keyPress', {inputId: 'right', state: false});
            else if(e.keyCode === 83) // KEY = S
                socket.emit('keyPress', {inputId: 'down', state: false});
            else if(e.keyCode === 65) // KEY = A
                socket.emit('keyPress', {inputId: 'left', state: false});
            else if(e.keyCode === 87) // KEY = W
                socket.emit('keyPress', {inputId: 'up', state: false});
        }

        //Menu events
        if(e.keyCode === 27) UIManager.toggleUiItem('Menu'); // KEY = ESC

        //Chat events
        if(e.keyCode === 13) UIManager.toggleUiItem('Chat'); //  KEY = ENTER
        if(e.keyCode === 191 && !UIManager.isUiOpen('Chat')) { //  KEY = /
            UIManager.toggleUiItem('Chat');
            $('#chat-input').val('/');
        }

        //World Edit events
        if(e.keyCode === 192) UIManager.toggleUiItem('Map Editor'); //  KEY = ~
    };

    //MOUSE EVENTS
    gameElement.on('mousedown',function(e) {
        pressingMouse1 = true;
        if(!UIManager.isUiFocused() && !UIManager.isUiOpen('Map Editor')) {
            socket.emit('keyPress', {inputId: 'attack', state: true});
        }
        processMapEditor();

    });

    $(document).on('mouseup', function(e) {
        socket.emit('keyPress', {inputId: 'attack', state: false});
        pressingMouse1 = false;
    });

    //Listen for mouse events, send mouse angle to server
     gameElement.on('mousemove', function(e) { 
        if(client.player == null) return;
        let rect = document.getElementById("gameCanvas").getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseMapX = parseInt((mouseX + gameCamera.xOffset) / 64);
        mouseMapY = parseInt((mouseY + gameCamera.yOffset) / 64);
        mouseMapPixelX = parseInt((mouseX + gameCamera.xOffset));
        mouseMapPixelY = parseInt((mouseY + gameCamera.yOffset));

        socket.emit('keyPress', {inputId: 'mouseAngle', state: getAngle(client.player.x, client.player.y,
        mouseX + gameCamera.xOffset, mouseY + gameCamera.yOffset)});
        processMapEditor();
    });
    setInterval(function() {
        updateDetailCard({x: mouseMapPixelX, y: mouseMapPixelY});
    }, 250);
});


