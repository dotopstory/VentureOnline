//********************
//*** UI MANAGER
//********************
class uiItem {
    constructor(element, name) {
        this.id = uiItem.nextID++;
        this.element = element;
        this.name = name;
    }
}
uiItem.nextID = 0;
uiItem.uiList = [new uiItem($('#menuDiv'), 'Menu'), new uiItem($('#chatDiv'), 'Chat')];

function toggleUiItem(uiName) {
    //Get ui item
    var uiItem = getUiItemByName(uiName);

    //Hide all elements except toggled element
    for(var i in uiItem.uiList) if(uiItem.uiList[i].id !== uiitem.id) uiItem.uiList[i].element.hide();

    //Close ui item if it exists
    if(uiItem != null) {
        uiItem.element.toggle('slide');
    } else console.log('UI Manager Error - could not find UI item with name: ' + uiName);
}

function getUiItemByName(searchName) {
    for(var i in uiItem.uiList) {
        if(uiItem.uiList[i].name.toLowerCase() == searchName.toLowerCase()) return uiItem.uiList[i];
        return null;
    }
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
            showAlert("Signed In!", 2);
        } else {
            showAlert("Incorrect Login.", 2);
            console.log("Error - failed sign in.");
        }
    });
});

//********************
//*** ALERTS EVENTS
//********************
function showAlert(message, showTimeSecs) {
    var alertDiv = $('#alertDiv');

    //Fill alert contents
    alertDiv.css({'margin-top': $('#navbar').height() + 'px'})
    $('#alertMessage').html(message);
    $('#alertIcon').attr('src', images['turnipGuy'].src)

    //Show alert and set timer for hiding alert
    alertDiv.toggle("slide");
    setTimeout(function() {
        alertDiv.toggle("slide");
    }, showTimeSecs * 1000);
}

//********************
//*** MENU EVENTS
//********************
//Hide menu when clicking menu button
$('.menuButton').on('click', function() {
    toggleUiItem('Menu');
});

//Change map
function changeMap(mapName) {
    socket.emit('changeMap', mapName);
    showAlert('Changed Map', 2);
}
