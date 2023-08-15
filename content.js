let port = null;

function connectToBackground() {
    port = chrome.runtime.connect({ name: "content-script" });

    port.onDisconnect.addListener(function() {
        port = null;
        // 연결이 끊어진 경우 다시 연결 시도
        setTimeout(connectToBackground, 1000);
    });
}

connectToBackground();

document.addEventListener('mouseup', function() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText && port) {
        port.postMessage({ type: 'TEXT_SELECTION', text: selectedText });
    }
});