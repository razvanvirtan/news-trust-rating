chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0 && tabs[0].url && !tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('file://') && !tabs[0].url.startsWith('about:')) {
    const currentURL = encodeURIComponent(tabs[0].url); // Extract current tab's URL
    const iframeURL = `https://localhost:3000/unlock?referrer=${currentURL}`; // Construct iframe URL
    document.getElementById('contentFrame').src = iframeURL; // Set iframe's src
  } else {
    console.error('No active tab found, or tab URL is undefined or restricted.');
  }
});
