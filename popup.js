var scrollTimestamp = false;

function doingScrolling(timeStamp) {
    if (timeStamp - scrollTimestamp < 100) {
        return true
    }
    else {
        return false
    }
}

// format viewers count
// 1234    -> 1 234
// 1234567 -> 1234 567
function formatViewers (viewers) {
    if (viewers > 1000) {
        viewers = viewers.toString().replace(/(\d+)(\d{3})$/, '$1 $2');
    }
    return viewers
}


chrome.extension.sendMessage({getStreams: 10}, function(response) {
    $.each(response, function(k, stream) {
        var row = $('<div class="main"/>');
        stream.viewers = formatViewers(stream.viewers);
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


$(window).scroll(function (event) {
    scrollTimestamp = event.timeStamp;
})