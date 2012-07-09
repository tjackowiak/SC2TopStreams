chrome.extension.sendMessage({getStreams: 10}, function(response) {
    $.each(response, function(k, stream) {
        var row = $('<div class="main"/>');
        $('<img/>').attr({'src': stream.img}).appendTo(row);
        $('<div/>')
            .append($('<div/>').text(stream.viewers + ' viewers'))
            .append($('<div/>').text(stream.channel))
            .appendTo(row);
        $(row)
            .click(function() { chrome.tabs.create({url: stream.url}); })
            .appendTo('#streamList');
        $('<div/>').css('clear', 'both').appendTo('#streamList');
    });
});