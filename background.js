var streams = [];
// var lastFetch = new Date();
// if (!localStorage['limit']) localStorage['limit'] = 50;
// if (!localStorage['category']) localStorage['category'] = 'All';


function getStreams() {
	console.log('Fetching streams @ ' + new Date());

	var req = new XMLHttpRequest();
	req.open(
	    "GET",
	    "http://whosstreaming.xocekim.com/json/?" +
	    	"callback=&" +
	        "limit=100&" +
	        "category=Gaming",
	    true);
	req.onload = onSuccess;
	req.send(null);
}

function onSuccess(data) {
	console.log('Received streams');
	streams = prepareData(data);
	setBadge(streams[0]);
}

function prepareData(data) {
	// parsing data
	data = data.target.responseText;
	data = data.substring(1, data.length - 1);
	data = JSON.parse(data);

	// filterign data
	returnData = [];
	$.each(data, function(k, stream) {
		if(stream.subcatshort == 'SC2') {
			stream.thumb = stream.thumb.replace("150x113", "320x240");
			returnData.push(stream);
		}
	})
	return returnData;
}

function setBadge(stream)
{
	maxCount = stream.count / 1000;
	maxCount = Math.round(maxCount);
	if(maxCount > 7)
	{
		chrome.browserAction.setBadgeText({text: maxCount.toString() + 'k'});
		if(maxCount > 20)
			chrome.browserAction.setBadgeBackgroundColor({color: "#dd0000"});
		else if(maxCount > 10)
			chrome.browserAction.setBadgeBackgroundColor({color: "#dd7700"});
		else
			chrome.browserAction.setBadgeBackgroundColor({color: "#007700"});
	}
	else
	{
		chrome.browserAction.setBadgeText({text: ''});
	}
}

console.log("dzialam");
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("got details");
	sendResponse(streams);
});

getStreams();
setInterval(getStreams, 60000);