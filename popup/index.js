chrome.storage.sync.get('settings.shadowDisabled').then((res) => {
    document.getElementById('toggle-shadow').checked =
        res['settings.shadowDisabled'];
});

chrome.storage.sync.get('settings.ratingHidden').then((res) => {
    document.getElementById('toggle-rating').checked =
        res['settings.ratingHidden'];
});

document.getElementById('toggle-shadow').onchange = (e) => {
    chrome.storage.sync.set({ 'settings.shadowDisabled': e.target.checked });
};

document.getElementById('toggle-rating').onchange = (e) => {
    chrome.storage.sync.set({ 'settings.ratingHidden': e.target.checked });
};
