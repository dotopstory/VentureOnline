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
    new uiItem($('#debugDiv'), 'Debug', false),
    new uiItem($('#mapEditDiv'), 'Map Editor', false)];

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

function isOpen(searchName) {
    for(let i in uiItem.uiList)
        if(uiItem.uiList[i].name.toLowerCase() === searchName.toLowerCase() && uiItem.uiList[i].element.is(":visible")) return true;
    return false;
}

//********************
//*** DEBUG EVENTS
//********************
$(window).on('load', function() {
    if(!DEBUG_ON) return;

    let debug = $('#debugDiv');
    let output = $('#debugContent');


        setInterval(function() {
            if(client.id == null) return;
            output.html('');
            output.append('Client ID: ' + client.id);
            output.append('<br>Client Username: ' + client.player.username);
            output.append('<br>Client Position: (' + parseInt(client.player.x / TILE_WIDTH) + ', ' + parseInt(client.player.y / TILE_HEIGHT) + ')');
            output.append('<br>Map Name: ' + client.map.name);
            output.append('<br>Map Dimensions: ' + client.map.width + ' x ' + client.map.height);
            output.append('<br>Mouse Position: (' + mouseX + ', ' + mouseY + ')');
            output.append('<br>Mouse Map Position: (' + mouseMapX + ', ' + mouseMapY + ')');
        }, 1000);
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
//Add menu items depending on privelages
if(DEBUG_ON && client.is(['admin', 'mod'])) $('#menuDiv').append('<button class="btn menuButton venButtonOrange" onclick="toggleUiItem(\'Debug\')">Debug</button>');
if(client.is('admin')) $('#menuDiv').append('<button class="btn menuButton venButtonOrange" onclick="toggleUiItem(\'Map Editor\')">Map Editor</button>');


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
    sendMessageToServer();
};


function sendMessageToServer() {
    let message = chatInput.val();
    if(isValidMessage(message)) socket.emit('sendMessageToServer', chatInput.val());
    chatInput.val('');
}

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
let selectedTileID;
let previewTileCanvas;


$(window).on('load', function(){
    let tileSelect = $('#tileSelect');
    loadTileSelection(tileSelect);

    //Init the tile preview canvas
    let previewSize = 128;
    previewTileCanvas = $('#editPreviewTile');
    previewTileCanvas.css({'width': previewSize, 'height': previewSize});
    previewTileCanvas.attr('width', previewSize);
    previewTileCanvas.attr('height', previewSize);
    mapEditSelectTile(0);
});

function loadTileSelection(element) {
    let canvasSize = 64;
    for(let i in Tile.tileList) {
        //Create canvas and apply attributes
        let newCanvas = $('<canvas/>',{'class':'tileSelectCanvas'});
        let newCanvasCtx = newCanvas[0].getContext('2d');
        newCanvas.css({'width': canvasSize, 'height': canvasSize});
        newCanvas.attr('width', canvasSize);
        newCanvas.attr('height', canvasSize);
        newCanvas.attr('tileID', Tile.tileList[i].id);
        newCanvas.attr('onclick', 'mapEditSelectTile(' + i + ')');
        element.append(newCanvas);

        //Render sprite to canvas
        Tile.tileList[i].sprite.render(newCanvasCtx, 0, 0);
    }
}

function processMapEditor() {
    if(!pressingMouse1 | (mouseMapX == lastMouseMapX && mouseMapY == lastMouseMapY) || !client.is('admin') || client.id == null || !isOpen('Map Editor')) return;
    client.map.tiles[mouseMapY * client.map.width + mouseMapX] = selectedTileID;
    lastMouseMapX = mouseMapX;
    lastMouseMapY = mouseMapY;
}

function mapEditSelectTile(id) {
    selectedTileID = id;
    let ctx = previewTileCanvas[0].getContext('2d');
    Tile.tileList[selectedTileID].sprite.renderSize(ctx, 0, 0, 128, 128);
}

function cancelMapEdit() {
    client.setMap(client.backupMap);
    toggleUiItem('Map Editor');
}

function saveMap(filePath, pushToServer) {
    socket.emit('sendNewMapToServer', {map: client.map, filePath: filePath, pushToServer: pushToServer});
}