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
    new uiItem($('#menuDiv'), 'Menu', true, null),
    new uiItem($('#chatDiv'), 'Chat', true, initChat),
    new uiItem($('#alertDiv'), 'Alert', false, null)];

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
//Hide menu when clicking menu button
$('.menuButton').on('click', function() {
    toggleUiItem('Menu');
});

$('#signOutButton').on('click', function() {
    signOut();
});

//Change map
function changeMap(mapName) {
    socket.emit('changeMap', mapName);
    showAlert('Changed Map.');
}

//Sign out
function signOut() {
    socket.emit('signOut');
    location.href = '/play';
}

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
    chatText.innerHTML += '<span class="chat-message message-' + data.messageStyle + '"><b>' + data.username+ '</b>: ' + escapeHtml(data.message) + '</span><br>';
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
