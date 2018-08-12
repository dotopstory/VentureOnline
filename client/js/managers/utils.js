//Escape html in a string
function escapeHtml (string) {
    let entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

function distanceBetweenPoints(point1, point2) {
    if(point1 == null || point2 == null) return 0;
    return Math.abs(Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)));
}

function getHpBarColor(currentHp, maxHp) {
    let hpPercent = currentHp / maxHp * 100;
    if(hpPercent < 25) return "rgb(255, 0, 0, 1)";
    if(hpPercent < 50) return "rgb(255, 200, 0, 0.8)";
    if(hpPercent <= 100) return "rgba(0, 255, 0, 0.8)";
    return "rgba(255, 255, 255, 255, 1)";
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Min is inclusive, max in exclusive
};

//Search a playerlist and return the ID of the player that matches the given username
function getPlayerIndexById(playerList, searchId) {
    for(let i in playerList) {
        if(playerList[i] == null) continue;
        if(playerList[i].id === searchId) return i;
    }
    return null;
};