function getRatingColor(x) {
    if (x < 400) {
        return 'gray';
    }

    if (x < 800) {
        return '#804000';
    }

    if (x < 1200) {
        return 'green';
    }

    if (x < 1600) {
        return '#00c0c0';
    }

    if (x < 2000) {
        return 'blue';
    }

    if (x < 2400) {
        return '#c0c000';
    }

    if (x < 2800) {
        return 'orange';
    }

    if (x < 3200) {
        return 'red';
    }

    return 'darkred';
}

const contest = window.location.pathname.split('/')[2];

chrome.storage.sync.get('settings.ratingHidden').then((res) => {
    if (res['settings.ratingHidden']) {
        return;
    }

    fetch(`https://atcoder-enhancer-api.fly.dev/contest/${contest}`)
        .then((res) => res.json())
        .then((res) => {
            let clonedHead = document
                .getElementsByTagName('thead')
                [
                    document.getElementsByTagName('thead').length - 1
                ].children[0].children[1].cloneNode(true);
            clonedHead.innerText = 'Rating';
            document
                .getElementsByTagName('thead')
                [
                    document.getElementsByTagName('thead').length - 1
                ].children[0].children[1].after(clonedHead);

            const rows =
                document.getElementsByTagName('tbody')[
                    document.getElementsByTagName('tbody').length - 1
                ].children;

            for (let i = 0; i < rows.length; i++) {
                let cloned = rows[i].children[1].cloneNode(true);

                cloned.innerText = res[i].difficulty
                    ? res[i].difficulty
                    : 'Not available';
                cloned.style.color = getRatingColor(res[i].difficulty);

                rows[i].children[1].after(cloned);
            }
        });
});
