
let newWindow;

// pop small browser window for softphone
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.windows.create({
      url: './standalong.html',
      type: 'popup',
      focused: true,
      width: 300,
      height: 536
    }, function (wind) {
      newWindow = wind;
    });
});
chrome.windows.onRemoved.addListener(function (id) {
  console.log(id);
  if (newWindow && newWindow.id === id) {
    newWindow = null;
  }
});
