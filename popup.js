document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['selectedText'], function(result) {
      const selectedText = result.selectedText;
      if (selectedText) {
          fetchSummarizedText(selectedText).then(summary => {
              document.getElementById('summary').textContent = summary;
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
