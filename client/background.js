
chrome.runtime.onInstalled.addListener(function() {
    fetch('http://localhost:5000/home', {
      method: 'GET'
    })
    .then(response => response.text())
    .then(data => document.body.textContent = data)
    .catch((error) => {
      console.error('Error:', error);
    });
  });