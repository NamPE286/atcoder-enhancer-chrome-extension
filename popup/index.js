chrome.storage.sync.get('settings.shadowDisabled').then((res) => {
    document.getElementById('toggle-shadow').checked =
        res['settings.shadowDisabled'];
});

document.getElementById('toggle-shadow').onchange = (e) => {
    chrome.storage.sync.set({ 'settings.shadowDisabled': e.target.checked });
};
