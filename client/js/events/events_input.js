let eventRegister = [];
let mouseX = 0, mouseY = 0;
let mouseMapX = 0, mouseMapY = 0;
let lastMouseMapX = 0, lastMouseMapY = 0;
let pressingMouse1 = false;

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

    if(!isUiFocused()) {
        //Move events
        if(e.keyCode === 68) //D
            socket.emit('keyPress', {inputId: 'right', state: true});
        else if(e.keyCode === 83) //S
            socket.emit('keyPress', {inputId: 'down', state: true});
        else if(e.keyCode === 65) //A
            socket.emit('keyPress', {inputId: 'left', state: true});
        else if(e.keyCode === 87) //W
            socket.emit('keyPress', {inputId: 'up', state: true});

        //Attack events
        else if(e.keyCode === 37) //LEFT
            socket.emit('keyPress', {inputId: 'mouseAngle', state: 180});
        else if(e.keyCode === 38) //UP
            socket.emit('keyPress', {inputId: 'mouseAngle', state: 270});
        else if(e.keyCode === 39) //RIGHT
            socket.emit('keyPress', {inputId: 'mouseAngle', state: 360});

        else if(e.keyCode === 40) //DOWN
            socket.emit('keyPress', {inputId: 'mouseAngle', state: 90});

        //Attack events
        if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40)
            socket.emit('keyPress', {inputId: 'attack', state: true});
    }
};

//KEY UP EVENTS
document.onkeyup = function(e) {
    let code = e.keyCode;

    eventRegister[code] = false;

    if(!isUiFocused()) {
        //Move events
        if(e.keyCode === 68) //D
            socket.emit('keyPress', {inputId: 'right', state: false});
        else if(e.keyCode === 83) //S
            socket.emit('keyPress', {inputId: 'down', state: false});
        else if(e.keyCode === 65) //A
            socket.emit('keyPress', {inputId: 'left', state: false});
        else if(e.keyCode === 87) //W
            socket.emit('keyPress', {inputId: 'up', state: false});

        //Attack events
        if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40)
            socket.emit('keyPress', {inputId: 'attack', state: false});


    }

    //Menu events
    if(e.keyCode === 27) toggleUiItem('Menu');

    //Chat events
    if(e.keyCode === 17) toggleUiItem('Chat');

    //Debug events
    if(e.keyCode === 9) toggleUiItem('Debug');

    //World Edit events
    if(e.keyCode === 192) toggleUiItem('Map Editor');
};

//MOUSE EVENTS
document.onmousedown = function(e) {
    pressingMouse1 = true;
};

document.onmouseup = function(e) {
    pressingMouse1 = false;
};

//Listen for mouse events, send mouse angle to server
document.onmousemove = function(e) {
    let rect = document.getElementById("gameCanvas").getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    mouseMapX = parseInt((mouseX + gameCamera.xOffset) / 64);
    mouseMapY = parseInt((mouseY + gameCamera.yOffset) / 64);

    if(pressingMouse1 && (mouseMapX != lastMouseMapX || mouseMapY != lastMouseMapY)) processMapEditor();
};


