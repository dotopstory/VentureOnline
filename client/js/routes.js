page.base('/');
page('/', function() { route(["navbar", "play", "ui/mapEditor"]); });
page('play', function() { route(["navbar", "play", "ui/mapEditor"]); });
page('info', function() { route(["navbar", "play", "ui/mapEditor"]); });
page('*', function() { route(["navbar", "play", "ui/mapEditor"]); });
page();

//Processes a route request for a list of views.
function route(views) {
    render(views);
}

//Renders an array of views to a DOM target.
//Renders each view by file name in the order they are set in the array.
function render(views) {
    let viewFolder = "/resources/views/";
    let appTarget = "body";

    $(appTarget).empty();
    for(i in views) {
        let url = viewFolder + views[i] + ".html";
        $(appTarget)
            .append($("<div>")
            .load(url));
    }
}
