console.log("Background service worker is running");

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== "content-script") return;

  port.onMessage.addListener(function(message) {
      if (message.type === 'TEXT_SELECTION') {
          chrome.storage.local.set({ 'selectedText': message.text });
      }
  });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TEXT_SELECTION') {
        chrome.storage.local.set({ 'selectedText': message.text }, () => {
            sendResponse({status: "ok"});
        });
        return true; // 이 줄은 비동기 응답을 가능하게 하므로 유지합니다.
    }
});

chrome.action.onClicked.addListener((tab) => { // 'browserAction' 대신 'action'을 사용합니다.
    chrome.storage.local.get(['selectedText'], function(result) {
        const selectedText = result.selectedText;
        if (selectedText) {
            fetchSummarizedText(selectedText).then(summary => {
                chrome.tabs.sendMessage(tab.id, {type: 'SUMMARIZED_TEXT', summary: summary}); // popup에 메시지를 보냅니다.
            });
        }
    });
});

async function fetchSummarizedText(text) {
    let serverEndpoint = 'http://localhost:3000/summarize';

    let response = await fetch(serverEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    });

    let data = await response.json();
    return data.summary;
}
