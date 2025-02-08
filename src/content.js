chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillCredentials") {
    const { username, password } = request;
    document.querySelector('input[type="text"]').value = username;
    document.querySelector('input[type="password"]').value = password;
    sendResponse({ success: true });
  }
});
