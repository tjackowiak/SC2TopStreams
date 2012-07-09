var scrollTimestamp = false;

function doingScrolling(timeStamp) {
    if (timeStamp - scrollTimestamp < 100) {
        return true
    }
    else {
        return false
    }
}

$(window).scroll(function (event) {
    scrollTimestamp = event.timeStamp;
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
            .append($('<div/>').html(stream.viewers + ' <span>viewers</span>'))
            .append($('<div/>').text(stream.channel))
            .appendTo(row);
        $(row)
            .click(function() {
                chrome.tabs.create({url: stream.url});
            })
            .hover(
            function(event) {
                timeout = doingScrolling(event.timeStamp) ? 500 : 100;
                $(this).data('timeout', setTimeout( function () {
                    $('#' + stream.channel + 'Info').slideDown('fast')
                }, timeout));                
            },
            function() {
                clearTimeout($(this).data('timeout'));
                $('#' + stream.channel + 'Info').slideUp('fast')
            })
            .appendTo('#streamList');
        $('<div/>').css('clear', 'both').appendTo('#streamList');
    });
});