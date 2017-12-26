
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

    //********************
    //*** ALERTS EVENTS
    //********************
    function showAlert(message, showTimeSecs) {
        var alertDiv = $('#alertDiv');
        alertDiv.hide();

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
    function changeMap(mapName) {
        if(mapName == null) return;
        socket.emit('changeMap', mapName);
    }
});
