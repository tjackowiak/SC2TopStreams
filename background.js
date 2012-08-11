var twitchTvPage = "http://www.twitch.tv/directory/StarCraft%20II:%20Wings%20of%20Liberty"
var badgeColors = {2: "#A8A8A8", 7: "#007700", 15: "#dd7700", 25: "#dd0000"}
var streams = []

function setBadge(maxViewersCount) {
    maxCount = maxViewersCount / 1000;
    maxCount = Math.round(maxCount);
    color = false;

    for (badge in badgeColors) {
        if (maxCount >= badge) {
            color = badgeColors[badge]
        }
    }

    if (color) {
        chrome.browserAction.setBadgeText({text: maxCount.toString() + 'k'});   
        chrome.browserAction.setBadgeBackgroundColor({color: color});
    }
    else {
        chrome.browserAction.setBadgeText({text: ''});
    }
}

function prepareData(data) {
    returnData = []
    data.children().each(function(index) {
        viewers = $(this).find('div>p.channelname').text().match(/[0-9,]+/)[0]
        channel = $(this).find('div>p.channelname a').text()
        img = $(this).find('a.thumb img')
        img = img.attr('src1') ? img.attr('src1') : img.attr('src')
        returnData.push(
        {
            channel: channel,
            viewers: viewers.replace(',', ' '),
            count: parseInt(viewers.replace(',', '')),
            img: img,
            title: $(this).find('div>p.title a').text(),
            url: 'http://twitch.tv/' + channel.toLowerCase()
        })
    })

    return returnData;
}

function getStreams() {
    $('<div/>').load(twitchTvPage + " div.video",
        function(data) {
            streams = prepareData($(this));
            setBadge(streams[0].count);
        }
    );
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.getStreams) {
        console.log("got request: getStreams");
        sendResponse(streams.slice(0, parseInt(request.getStreams)));
    }

});


$(document).ready( function() {
    getStreams();
    setInterval(getStreams, 60000);
});