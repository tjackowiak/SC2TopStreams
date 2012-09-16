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


function prepareData(data){
    var returnData = []
    for (i=0; i<data.streams.length; i++) {
        stream = data.streams[i];
        returnData.push(
        {
            channel: stream.channel.display_name,
            viewers: stream.viewers,
            img: "http://static-cdn.jtvnw.net/previews/"+stream.name+"-320x240.jpg",
            title: stream.channel.status,
            url: stream.channel.url
        })
    }
    return returnData;
}
    
function getStreams() {
    $.get('https://api.twitch.tv/kraken/streams',
        { game: "StarCraft II: Wings of Liberty", limit: 10 },
        function(data) {
            streams = prepareData(data);
            setBadge(streams[0].viewers);
        })
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