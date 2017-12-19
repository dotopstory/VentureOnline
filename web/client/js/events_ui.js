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
        } else {
            console.log("Error - failed sign in.");
        }
    });
});
