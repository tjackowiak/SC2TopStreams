var scrolling = false;

function noScrolling() {
    if (new Date().getTime() - scrolling < 100)
        return false
    else
        return true
}

$(window).scroll(function (event) {
    scrolling = event.timeStamp;
})

chrome.extension.sendMessage({getStreams: 10}, function(response) {
    $.each(response, function(k, stream) {
        var row = $('<div class="main"/>');
        $('<img/>').attr({'src': stream.img}).appendTo(row);
        $('<div class="title"/>')
            .text(stream.title).hide()
            .attr('id', stream.channel + 'Info')
            .appendTo(row);
        $('<div class="info"/>')
            .append($('<div/>').text(stream.viewers + ' viewers'))
            .append($('<div/>').text(stream.channel))
            .appendTo(row);
        $(row)
            .click(function() {
                chrome.tabs.create({url: stream.url});
            })
            .mouseenter(function() {
                if(noScrolling())
                    $('#' + stream.channel + 'Info').slideDown('fast')
            })
            .mouseleave(function() {
                    $('#' + stream.channel + 'Info').slideUp('fast')
            })
            .appendTo('#streamList');
        $('<div/>').css('clear', 'both').appendTo('#streamList');
    });
});