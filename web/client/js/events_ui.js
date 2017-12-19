$(window).on('load', function() {
    //********************
    //*** SIGN IN EVENTS
    //********************
    //Sign in objects
    var signInDiv = $('#div-signIn');
    var tbUsername = $('#signInUsernameTextbox');
    var btnSignIn = $('#signInSubmitButton');
    
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
        socket.emit('signIn', {username: tbUsername.val(), password: ""});
    }

    //Receive sign in response
    socket.on('signInResponse', function(data) {
        if(data.success) {
            signInDiv.css({'display': 'none'});
            gameDiv.style.display = "inline";
        } else {
            console.log("Error - failed sign in.");
        }
    });
});
