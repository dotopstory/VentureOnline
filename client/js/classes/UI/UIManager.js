//UI manager
class UIManager {
    constructor() {
        this.uiItems = [];
    }

    addUiItem(newUiItem) {
        this.uiItems.push(newUiItem);
    }

    static toggleUiItem(uiItemName) {
        //Get ui item
        let item = UIManager.getUiItemByName(uiItemName);
        let uiItems = UIManager.uiItems;

        //Hide all elements except toggled element
        for(let i in uiItems) {
            if(uiItems[i].id !== item.id && (uiItems[i].requireFocus && item.requireFocus)) uiItems[i].getElement().hide();
        }

        //Close ui item if it exists
        if(item != null) {
            item.getElement().toggle();
            if(item.toggleFunction != null) item.toggleFunction();
        } else clientAlert("UI Manager Error - could not find UI item with name: " + uiItemName);
    }

    static getUiItemByName(searchName) {
        for(let i in UIManager.uiItems) {
            if(UIManager.uiItems[i].name.toLowerCase() === searchName.toLowerCase()) return UIManager.uiItems[i];
        }
        return null;
    }

    static isUiOpen(searchName) {
        for(let i in UIManager.uiItems)
            if(UIManager.uiItems[i].name.toLowerCase() === searchName.toLowerCase() && UIManager.uiItems[i].getElement().is(":visible")) return true;
        return false;
    }

    static isUiFocused() {
        for(let i in UIManager.uiItems) {
            let item = UIManager.uiItems[i];
            if(item.getElement().is(":visible") && item.requireFocus) return true;
        }
        return false;
    }

    static onSignIn() {
        loadTileSelection($("#tileSelect"));
    }
}
UIManager.uiItems = [
    new uiItem("#menuDiv", "Menu", true),
    new uiItem("#chat-input", "Chat", true, initChat),
    new uiItem("#mapEditDiv", "Map Editor", false, initMapEditor)
];

//Menu events
function signOut() {
    client = null;
    location.href = "/play";
}


//Chat events
let chatText = document.getElementById("chat-text");
let chatInput = $("#chat-input");
let chatForm = document.getElementById("chat-form");
let minMessageLength = 1, maxMessageLength = 100, chatHideDelay = 10000, chatTextTimeout;

chatInput.attr("maxlength", maxMessageLength);

function initChat() {
    chatInput.focus();
    chatInput.val("");

    if(UIManager.isUiOpen("Chat")) $("#chat-text").fadeIn("fast");
    if(!UIManager.isUiOpen("Chat")) {
        clearTimeout(chatTextTimeout);
        chatTextTimeout = setTimeout(function() {
            if(!UIManager.isUiOpen("Chat")) $("#chat-text").fadeOut("slow");
        }, chatHideDelay);
    }

}

//Show the chat text and then fade it out
function showChatText() {
    $("#chat-text").fadeIn("fast");
    chatText.scrollTop = chatText.scrollHeight;

    clearTimeout(chatTextTimeout);
    chatTextTimeout = setTimeout(function() {
        if(!UIManager.isUiOpen("Chat")) $("#chat-text").fadeOut("slow");
    }, chatHideDelay);
}

//Listen for chat events
$(window).on("load", function() {
    socket.on("addToChat", function(data) {
        //Craft message from data
        let message = '<span class="chat-message message-" + data.messageStyle + "">';
        if(data.messageMap != null) message += "[" + data.messageMap + "] ";
        if(data.username != null) message += "<b>" + data.username+ "</b>: ";
        message += escapeHtml(data.message) + "</span><br>";
        chatText.innerHTML += message;

        showChatText();
    });

    //Chat form submitted event
    chatForm.onsubmit = function(e) {
        e.preventDefault(); //Prevent page refresh on form submit
        sendMessageToServer();
    };

    //Hide chat when unfocused
    $("#chat-input").on("blur", function() {
        $("#chat-input").hide();
    });
});

function sendMessageToServer() {
    let message = chatInput.val();
    if(isValidMessage(message)) socket.emit("sendMessageToServer", chatInput.val());
    chatInput.val("");
}

//Check if a message is valid
function isValidMessage(message) {
    if(message.length < minMessageLength || message.length > maxMessageLength) return false;
    return true;
}

$(window).on("load", function() {
    //Sign in events
    //Sign in on eneter press while in username textbox
    $("#signInUsernameTextbox").on("keypress", function(e) {
        if(e.keyCode === 13) sendSignInRequest();
    });

    //Sign in when Play! button clicked
    $("#signInSubmitButton").on("click", function() {
        sendSignInRequest();
    });

    //Receive sign in response
    socket.on("signInResponse", function(data) {
        if(data.success) {
            $("#div-signIn").hide();
            $("#div-game").fadeIn("slow");
            $("#detailCardDiv").fadeIn("slow");
            UIManager.onSignIn();
        } else {
            clientAlert("Error - failed sign in.");
        }
    });
});

//Send sign in
function sendSignInRequestAuto(username, password) {
    socket.emit("signIn", {username: username, password: password});
}

function sendSignInRequest() {
    sendSignInRequestAuto($("#signInUsernameTextbox").val(), "");
}

//Map editor events
let selectedTileID = 0;
let previewTileCanvas;

$(window).on("load", function() {
    //Init the tile preview canvas
    let previewSize = 128;
    previewTileCanvas = $("#editPreviewTile");
    previewTileCanvas.css({"width": previewSize, "height": previewSize});
    previewTileCanvas.attr("width", previewSize);
    previewTileCanvas.attr("height", previewSize);
    let previewTileCanvasCtx = previewTileCanvas[0].getContext("2d");
    previewTileCanvasCtx.mozImageSmoothingEnabled = false;
    previewTileCanvasCtx.webkitImageSmoothingEnabled = false;
    previewTileCanvasCtx.msImageSmoothingEnabled = false;
    previewTileCanvasCtx.imageSmoothingEnabled = false;
    //Render sprite to canvas
    setInterval(function() {
        let tile = ResourceManager.tileList[selectedTileID];
        let sprite = null;
        if(tile != null) sprite = ResourceManager.sprites[tile.sprite];
        if(sprite != null) sprite.renderSize(previewTileCanvasCtx, 0, 0, 128, 128);
    }, 100);
});

function initMapEditor () {
    $("#tbMapName").val(client.map.name);
}

function loadTileSelection(element) {
    let canvasSize = 64;
    for(let i in ResourceManager.tileList) {
        //Create canvas and apply attributes
        let newCanvas = $("<canvas/>",{"class":"pixelCanvas tileSelectCanvas"});
        let newCanvasCtx = newCanvas[0].getContext("2d");
        newCanvas.css({"width": canvasSize, "height": canvasSize});
        newCanvas.attr("width", canvasSize);
        newCanvas.attr("height", canvasSize);
        newCanvas.attr("tileID", ResourceManager.tileList[i].id);
        newCanvas.attr("onclick", "mapEditSelectTile(" + i + ")");
        newCanvasCtx.mozImageSmoothingEnabled = false;
        newCanvasCtx.webkitImageSmoothingEnabled = false;
        newCanvasCtx.msImageSmoothingEnabled = false;
        newCanvasCtx.imageSmoothingEnabled = false;
        element.append(newCanvas);

        //Render sprite to canvas
        setInterval(function() {
            ResourceManager.sprites[ResourceManager.tileList[i].sprite].render(newCanvasCtx, 0, 0);
        }, 100);
    }
}

function processMapEditor() {
    if(!pressingMouse1 || (mouseMapX == lastMouseMapX && mouseMapY == lastMouseMapY) ||  client.id == null ||
        !UIManager.isUiOpen("Map Editor")) return;
    client.map.tiles[mouseMapY * client.map.width + mouseMapX] = selectedTileID;
    lastMouseMapX = mouseMapX;
    lastMouseMapY = mouseMapY;
}

function mapEditSelectTile(id) {
    selectedTileID = id;
    let ctx = previewTileCanvas[0].getContext("2d");
    ResourceManager.sprites[ResourceManager.tileList[selectedTileID].sprite].renderSize(ctx, 0, 0, 128, 128);
}

function cancelMapEdit() {
    client.setMap(client.backupMap);
    UIManager.toggleUiItem("Map Editor");
}

function saveMap(filePath, pushToServer) {
    let newMap = client.map;
    newMap.name = $("#tbMapName").val().toString();
    socket.emit("sendNewMapToServer", {map: client.map, fileName: newMap.name.toLowerCase(), pushToServer: pushToServer});
}