document.getElementById('toggle-shadow').onchange = (e) => {
    chrome.storage.sync.set({ 'settings.shadowDisabled': e.target.checked });
};
