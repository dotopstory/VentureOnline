let eventRegister = [];
let mouseX = 0, mouseY = 0;
let mouseMapX = 0, mouseMapY = 0;
let lastMouseMapX = 0, lastMouseMapY = 0;
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
            if(e.keyCode === 68) //D
                socket.emit('keyPress', {inputId: 'right', state: true});
            else if(e.keyCode === 83) //S
                socket.emit('keyPress', {inputId: 'down', state: true});
            else if(e.keyCode === 65) //A
                socket.emit('keyPress', {inputId: 'left', state: true});
            else if(e.keyCode === 87) //W
                socket.emit('keyPress', {inputId: 'up', state: true});
        }
    };

    //KEY UP EVENTS
    document.onkeyup = function(e) {
        let code = e.keyCode;

        eventRegister[code] = false;

        if(!UIManager.isUiFocused()) {
            //Move events
            if(e.keyCode === 68) //D
                socket.emit('keyPress', {inputId: 'right', state: false});
            else if(e.keyCode === 83) //S
                socket.emit('keyPress', {inputId: 'down', state: false});
            else if(e.keyCode === 65) //A
                socket.emit('keyPress', {inputId: 'left', state: false});
            else if(e.keyCode === 87) //W
                socket.emit('keyPress', {inputId: 'up', state: false});
        }

        //Menu events
        if(e.keyCode === 27) UIManager.toggleUiItem('Menu');

        //Chat events
        if(e.keyCode === 13) UIManager.toggleUiItem('Chat');
        if(e.keyCode === 191 && !UIManager.isUiOpen('Chat')) {
            UIManager.toggleUiItem('Chat');
            $('#chat-input').val('/');
        }

        //World Edit events
        if(e.keyCode === 192) UIManager.toggleUiItem('Map Editor');
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
        let rect = document.getElementById("gameCanvas").getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseMapX = parseInt((mouseX + gameCamera.xOffset) / 64);
        mouseMapY = parseInt((mouseY + gameCamera.yOffset) / 64);

         socket.emit('keyPress', {inputId: 'mouseAngle', state: getAngle(client.player.x, client.player.y,
                 mouseX + gameCamera.xOffset, mouseY + gameCamera.yOffset)});
         processMapEditor();
    });


     //Temp
    function getAngle(p1x, p1y, p2x, p2y) {
        let deltaY = p1y - p2y;
        let deltaX = p2x - p1x;
        let inRads = Math.atan2(deltaY, deltaX);
        if (inRads < 0)
            inRads = Math.abs(inRads);
        else
            inRads = 2 * Math.PI - inRads;
        return inRads * 180 / Math.PI ;
    }
});


