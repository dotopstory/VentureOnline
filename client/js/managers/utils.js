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
    if(hpPercent < 15) return "rgb(255, 0, 0, 1)";
    if(hpPercent < 25) return "rgb(230, 0, 0, 0.8)";
    if(hpPercent < 50) return "rgb(230, 92, 0, 0.8)";
    if(hpPercent <= 100) return "rgba(0, 204, 0, 0.8)";
}
