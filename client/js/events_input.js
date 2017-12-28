//KEY DOWN EVENTS
document.onkeydown = function(event) {
    if(event.keyCode === 68) //D
        socket.emit('keyPress', {inputId: 'right', state: true});
    else if(event.keyCode === 83) //S
        socket.emit('keyPress', {inputId: 'down', state: true});
    else if(event.keyCode === 65) //A
        socket.emit('keyPress', {inputId: 'left', state: true});
    else if(event.keyCode === 87) //W
        socket.emit('keyPress', {inputId: 'up', state: true});

    //Attack events
    else if(event.keyCode === 37) //LEFT
        socket.emit('keyPress', {inputId: 'mouseAngle', state: 180});
    else if(event.keyCode === 38) //UP
        socket.emit('keyPress', {inputId: 'mouseAngle', state: 270});
    else if(event.keyCode === 39) //RIGHT
        socket.emit('keyPress', {inputId: 'mouseAngle', state: 360});
    else if(event.keyCode === 40) //DOWN
        socket.emit('keyPress', {inputId: 'mouseAngle', state: 90});

    //Attack events
    if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)
        socket.emit('keyPress', {inputId: 'attack', state: true});
}

//KEY UP EVENTS
document.onkeyup = function(event) {
    //Movement events
    if(event.keyCode === 68) //D
        socket.emit('keyPress', {inputId: 'right', state: false});
    else if(event.keyCode === 83) //S
        socket.emit('keyPress', {inputId: 'down', state: false});
    else if(event.keyCode === 65) //A
        socket.emit('keyPress', {inputId: 'left', state: false});
    else if(event.keyCode === 87) //W
        socket.emit('keyPress', {inputId: 'up', state: false});

    //Attack events
    if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)
        socket.emit('keyPress', {inputId: 'attack', state: false});

    //Menu events
    if(event.keyCode === 27) toggleUiItem('Menu');
}

//MOUSE EVENTS
document.onmousedown = function(event) {
}

document.onmouseup = function(event) {
}

//Listen for mouse events, send mouse angle to server
document.onmousemove = function(event) {
}
