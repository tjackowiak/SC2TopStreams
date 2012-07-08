
chrome.extension.sendMessage({cosInnego: "hello"}, function(response){
  console.log(response);

  $.each(response, function(k, stream) {
    var row = $('<div class="main"/>');
      $('<img/>').attr({'src': stream.thumb}).appendTo(row);
      $('<div/>')
        .append($('<div/>').text(stream.countString + ' viewers'))
        .append($('<div/>').text(stream.title))
        .appendTo(row);

    $(row)
      .click(function() { chrome.tabs.create({url: stream.url}); })
      .appendTo('#streamList');
    $('<div/>').css('clear', 'both').appendTo('#streamList');

  });

});
