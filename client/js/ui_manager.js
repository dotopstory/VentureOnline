//********************
//*** UI MANAGER
//********************
class uiItem {
    constructor(element, name, showSeparate, toggleFunction) {
        this.id = uiItem.nextID++;
        this.element = element;
        this.name = name;
        this.toggleFunction = toggleFunction;
        this.showSeparate = showSeparate; //True if ui item must be shown with no other ui items visible
    }
}
uiItem.nextID = 0;
uiItem.uiList = [
    new uiItem($('#menuDiv'), 'Menu', true, null),
    new uiItem($('#chatDiv'), 'Chat', true, initChat),
    new uiItem($('#alertDiv'), 'Alert', false, null)];

function toggleUiItem(uiName) {
    //Get ui item
    var item = getUiItemByName(uiName);

    //Hide all elements except toggled element
    for(var i in uiItem.uiList) {
        if(uiItem.uiList[i].id != item.id && (uiItem.uiList[i].showSeparate && item.showSeparate)) uiItem.uiList[i].element.hide();
    }

    //Close ui item if it exists
    if(item != null) {
        item.element.toggle('slide');
        if(item.toggleFunction != null) item.toggleFunction();
    } else console.log('UI Manager Error - could not find UI item with name: ' + uiName);
}

function getUiItemByName(searchName) {
    for(var i in uiItem.uiList) {
        if(uiItem.uiList[i].name.toLowerCase() == searchName.toLowerCase()) return uiItem.uiList[i];
    }
    return null;
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

//********************
//*** ALERT EVENTS
//********************
function showAlert(message) {
    var alertDiv = $('#alertDiv');

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
var chatText = document.getElementById('chat-text');
var chatInput = $('#chat-input');
var chatForm = document.getElementById('chat-form');

function initChat() {
    $('#chat-input').focus();
}

//Listen for chat events
socket.on("addToChat", function(data) {
    chatText.innerHTML += '<span class="chat-message message-' + data.messageStyle + '"><b>' + data.username+ '</b>: ' + escapeHtml(data.message) + '</span><br>';
    chatText.scrollTop = chatText.scrollHeight;
});

//Chat form submitted event
chatForm.onsubmit = function(e) {
    e.preventDefault(); //Prevent page refresh on form submit
    var message = chatInput.val();
    if(isValidMessage(message)) socket.emit('sendMessageToServer', chatInput.val());
    chatInput.val('');
}

//Check if a message is valid
function isValidMessage(message) {
    if(message.length < 1 || message.length > 100) return false;
    return true;
}
