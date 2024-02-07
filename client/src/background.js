chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "getURL") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          sendResponse({url: tabs[0].url});
        });
      }
      // This line is necessary to make the sendResponse function work
      return true;
    }
  );