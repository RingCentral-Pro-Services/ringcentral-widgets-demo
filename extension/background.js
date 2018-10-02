
let newWindow;
let thereIsCurrentlyAWindowOpen = false;

// pop small browser window for softphone
chrome.browserAction.onClicked.addListener((tab) => {
  if (!thereIsCurrentlyAWindowOpen) {
    chrome.windows.create({
      url: './standalong.html',
      type: 'popup',
      focused: true,
      height: 536,
      width: 300
    }, (wind) => {
      newWindow = wind;
      thereIsCurrentlyAWindowOpen = true;
    });
  } else {
    chrome.windows.update(newWindow.id, { focused: true });
  }
});

chrome.windows.onRemoved.addListener((id) => {
  if (newWindow && newWindow.id === id) {
    newWindow = null;
    thereIsCurrentlyAWindowOpen = false;
  }
});
