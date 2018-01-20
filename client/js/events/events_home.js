$(window).on('load', function () {
    setTimeout(function() { slideDown($('#col1')); }, 10);
    setTimeout(function() { slideDown($('#col2')); }, 200);
    setTimeout(function() { slideDown($('#col3')); }, 400);
    setTimeout(function() { slideDown($('.home-slider')); }, 0);
});

function slideDown(element) {
    element.css({'top': '-200vh'});
    element.show().animate({top: "0"}, 1000);
}

function slideUp(element) {
    element.hide().animate({top: "-200vh"}, 1000);
}