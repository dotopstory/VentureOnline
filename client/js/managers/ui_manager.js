//********************
//*** UI MANAGER
//********************
class uiItem {
    constructor(element, name, requireFocus, toggleFunction) {
        this.id = uiItem.nextID++;
        this.element = element;
        this.name = name;
        this.toggleFunction = toggleFunction;
        this.requireFocus = requireFocus; //True if ui item must be shown with no other ui items visible
    }
}
uiItem.nextID = 0;
uiItem.uiList = [
    new uiItem($('#menuDiv'), 'Menu', true),
    new uiItem($('#chatDiv'), 'Chat', true, initChat),
    new uiItem($('#alertDiv'), 'Alert', false),
    new uiItem($('#debugDiv'), 'Debug', true),
    new uiItem($('#mapEditDiv'), 'Map Editor', true)];

//Show/hide a ui item
function toggleUiItem(uiName) {
    //Get ui item
    let item = getUiItemByName(uiName);

    //Hide all elements except toggled element
    for(let i in uiItem.uiList) {
        if(uiItem.uiList[i].id !== item.id && (uiItem.uiList[i].requireFocus && item.requireFocus)) uiItem.uiList[i].element.hide();
    }

    //Close ui item if it exists
    if(item != null) {
        item.element.toggle('slide');
        if(item.toggleFunction != null) item.toggleFunction();
    } else console.log('UI Manager Error - could not find UI item with name: ' + uiName);
}

//Return an item in the ui item list
function getUiItemByName(searchName) {
    for(let i in uiItem.uiList) {
        if(uiItem.uiList[i].name.toLowerCase() === searchName.toLowerCase()) return uiItem.uiList[i];
    }
    return null;
}

//Check if there is a ui item showing and requires focus
function isUiFocused() {
    for(let i in uiItem.uiList) {
        let item = uiItem.uiList[i];
        if(item.element.is(":visible") && item.requireFocus) return true;
    }
    return false;
}

//********************
//*** DEBUG EVENTS
//********************
$(window).on('load', function() {
    if(!DEBUG_ON) return;

    $('#menuDiv').html($('#menuDiv').html() + '<button class="btn menuButton" onclick="toggleUiItem(\'Debug\')">Debug</button>')

    let debug = $('#debugDiv');
    let output = $('#debugContent');

    if(true) {
        setInterval(function() {
            output.html('');
            output.html(output.html() + 'Client ID: ' + client.id);
            output.html(output.html() + '<br>Client Username: ' + client.player.username);
            output.html(output.html() + '<br>Client Position: (' + parseInt(client.player.x / TILE_WIDTH) + ', ' + parseInt(client.player.y / TILE_HEIGHT) + ')');
            output.html(output.html() + '<br>Map Name: ' + client.map.name);
            output.html(output.html() + '<br>Map Dimensions: ' + client.map.width + ' x ' + client.map.height);
            output.html(output.html() + '<br>Mouse Position: (' + mouseX + ', ' + mouseY + ')');
            output.html(output.html() + '<br>Mouse Map Position: (' + mouseMapX + ', ' + mouseMapY + ')');
        }, 1000);
    }
});

//********************
//*** ALERT EVENTS
//********************
function showAlert(message) {
    let alertDiv = $('#alertDiv');

    //Fill alert contents
    alertDiv.css({'margin-top': $('#navbar').height() + 'px'})
    $('#alertMessage').html(message);
    $('#alertIcon').attr('src', images['turnipGuy'].src)

    //Show alert and set timer for hiding alert
    toggleUiItem('Alert');
    setTimeout(function() {
        toggleUiItem('Alert');
    }, 2000);
}

//********************
//*** MENU EVENTS
//********************


//********************
//*** CHAT EVENTS
//********************
let chatText = document.getElementById('chat-text');
let chatInput = $('#chat-input');
let chatForm = document.getElementById('chat-form');
let minMessageLength = 1, maxMessageLength = 100;

chatInput.attr('maxlength', maxMessageLength);

function initChat() {
    chatInput.focus();
    chatInput.val('');
}

//Listen for chat events
socket.on("addToChat", function(data) {
    //Craft message from data
    let message = '<span class="chat-message message-' + data.messageStyle + '">';
    if(data.messageMap != null) message += '[' + data.messageMap + '] ';
    if(data.username != null) message += '<b>' + data.username+ '</b>: ';
    message += escapeHtml(data.message) + '</span><br>';

    //Push message into html
    chatText.innerHTML += message;
    chatText.scrollTop = chatText.scrollHeight;
});

//Chat form submitted event
chatForm.onsubmit = function(e) {
    e.preventDefault(); //Prevent page refresh on form submit
    let message = chatInput.val();
    if(isValidMessage(message)) socket.emit('sendMessageToServer', chatInput.val());
    chatInput.val('');
};

//Check if a message is valid
function isValidMessage(message) {
    if(message.length < minMessageLength || message.length > maxMessageLength) return false;
    return true;
}

$(window).on('load', function() {
    //********************
    //*** SIGN IN EVENTS
    //********************
    //Init
    $('#div-signIn').fadeIn('slow');

    //Sign in on eneter press while in username textbox
    $('#signInUsernameTextbox').on('keypress', function(e) {
        if(e.keyCode === 13) sendSignInRequest();
    });

    //Sign in when Play! button clicked
    $('#signInSubmitButton').on('click', function() {
        sendSignInRequest();
    });

    //Send sign in
    function sendSignInRequest() {
        socket.emit('signIn', {username: $('#signInUsernameTextbox').val(), password: ""});
    }

    //Receive sign in response
    socket.on('signInResponse', function(data) {
        if(data.success) {
            $('#div-signIn').hide();
            $('#div-game').fadeIn('slow');
            showAlert("Signed In!");
        } else {
            showAlert("Incorrect Login.");
            console.log("Error - failed sign in.");
        }
    });
});

//***********************
//*** MAP EDITOR EVENTS
//***********************
let selectedTileID = 0;
$(window).on('load', function(){
    let tileSelect = $('#tileSelect');
    loadTileSelection(tileSelect);
});

function loadTileSelection(element) {
    let canvasSize = 64;
    for(let i in Tile.tileList) {
        //Create canvas and apply attributes
        let newCanvas =
            $('<canvas/>',{'class':'tileSelectCanvas'});
        newCanvas.css({'width': canvasSize, 'height': canvasSize});
        newCanvas.attr('width', canvasSize);
        newCanvas.attr('height', canvasSize);
        newCanvas.attr('tileID', Tile.tileList[i].id);
        newCanvas.attr('onclick', 'mapEditSelectTile(' + i + ')');
        element.append(newCanvas);

        //Render sprite to canvas
        let newCanvasCtx = newCanvas[0].getContext('2d');
        Tile.tileList[i].sprite.render(newCanvasCtx, 0, 0);
    }
}

function processMapEditor() {
    client.map.tiles[mouseMapY * client.map.width + mouseMapX] = selectedTileID;
    lastMouseMapX = mouseMapX;
    lastMouseMapY = mouseMapY;
}

function mapEditSelectTile(id) {
    selectedTileID = id;
}