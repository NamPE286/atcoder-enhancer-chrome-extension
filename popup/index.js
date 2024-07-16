document.getElementById('toggle-shadow').onchange = (e) => {
    console.log(e.target.checked);
    chrome.storage.sync.set({ 'settings.shadowDisabled': e.target.checked });
};