chrome.storage.sync.get('settings.shadowDisabled').then((res) => {
    if (!res['settings.shadowDisabled']) {
        return;
    }

    document.getElementById('main-container').style.boxShadow =
        '0px 0px 10px 5px transparent';
});
