(function() {
    var chatText = document.getElementById('chat-text');
    var chatInput = document.getElementById('chat-input');
    var chatForm = document.getElementById('chat-form');

    //Listen for chat events
    socket.on("addToChat", function(data) {
        chatText.innerHTML += '<div class="chat-message">' + data + '</div>';
        chatText.scrollTop = chatText.scrollHeight;
    });

    //Chat form submitted event
    chatForm.onsubmit = function(e) {
        e.preventDefault(); //Prevent page refresh on form submit
        socket.emit('sendMessageToServer', chatInput.value);
        chatInput.value = "";
    }
})();
