$(window).on("load", function() {
    loadHtmlComponents();
});

/**
 * Scan the current html file for "include-html-component" attributes and load the html from the specified location
 */
function loadHtmlComponents() {
    let includeTags = [$("div[include-html-component]")];
    includeTags.forEach(function(tagItem) {
        let fileName = tagItem.attr("include-html-component");
        tagItem.load(fileName, function(response, status, xhr) {
            if(status == "error") {
                tagItem.html("Failed to load html component: " + fileName + ". Reason: " + xhr.status + " " + xhr.statusText);
            }
        });
    });
}