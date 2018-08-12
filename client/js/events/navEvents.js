(function() {
    updatePlayerCount();
    setInterval(function() {
        updatePlayerCount();
    }, 5000); 

    function updatePlayerCount() {
        $.ajax({url: "/api/info", success: function(res){
            $("#navPlayerCount").html(res.playersOnline);
        }});
    }
})();