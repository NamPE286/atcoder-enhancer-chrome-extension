const contest = window.location.pathname.split('/')[2];
const problemID = window.location.pathname.split('/')[4];
const eyeSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg>
`;

async function getStatusElement() {
    console.log(
        `Fetching https://atcoder.jp/contests/${contest}/submissions/me?desc=true&f.Task=${problemID}&orderBy=score ...`
    );

    const res = await (
        await fetch(
            `https://atcoder.jp/contests/${contest}/submissions/me?desc=true&f.Task=${problemID}&orderBy=score`
        )
    ).text();

    const tagStartIndex = res.indexOf('<tbody>') + 7;
    const tagEndIndex = res.indexOf('</tbody>');
    let tbodyHTMLString = '';

    for (let j = tagStartIndex; j < tagEndIndex; j++) {
        tbodyHTMLString += res[j];
    }

    if (!tbodyHTMLString) {
        return null;
    }

    const tbody = document.createElement('tbody');
    tbody.innerHTML = tbodyHTMLString;

    return tbody.children[0].children[6].children[0];
}

async function fetchProblemTags(problemID) {
    const res = await fetch(
        `https://atcoder-tags.herokuapp.com/check/${problemID}`
    );
    const htmlText = await res.text();
    let objText = '';

    for (
        let i = htmlText.indexOf("var dict = JSON.parse('{") + 23;
        i < htmlText.indexOf('var labels = ') + 1000;
        i++
    ) {
        objText += htmlText[i];

        if (htmlText[i] == '}') {
            break;
        }
    }

    let obj = JSON.parse(objText);
    let tags = [];

    for (const i in obj) {
        if (obj[i] != 0) {
            tags.push(i);
        }
    }

    return tags;
}

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

function showRating() {
    fetch(`https://atcoder-enhancer-api.fly.dev/problem/${problemID}`)
        .then((res) => res.json())
        .then((res) => {
            if (!res.difficulty) {
                throw new Error();
            }

            document.getElementById('problem-rating').innerText =
                res.difficulty;
            document.getElementById('problem-rating').style.color =
                getRatingColor(res.difficulty);
        })
        .catch((err) => {
            document.getElementById('problem-rating').innerText =
                'Not available';
        });
}

document.getElementsByTagName('p')[12].innerHTML =
    `Tags : <span class='eye-btn' id="show-tags-btn">${eyeSVG}</span><br>Rating : <span class='eye-btn' id="show-rating-btn">${eyeSVG}</span><br>` +
    document.getElementsByTagName('p')[12].innerHTML;
document.getElementsByTagName('p')[12].style.lineHeight = '22px';

document.getElementById('show-tags-btn').addEventListener('click', async () => {
    document.getElementById('show-tags-btn').innerText = 'Loading...';
    document.getElementById('show-tags-btn').disabled = true;

    try {
        const tags = await fetchProblemTags(problemID);
        let span = document.createElement('span');

        span.innerText = tags.join(', ');
        document.getElementById('show-tags-btn').replaceWith(span);
    } catch {
        let span = document.createElement('span');

        span.innerText = 'Not available';
        document.getElementById('show-tags-btn').replaceWith(span);
    }
});

document
    .getElementById('show-rating-btn')
    .addEventListener('click', async () => {
        document.getElementById('show-rating-btn').innerText = 'Loading...';
        document.getElementById('show-rating-btn').disabled = true;

        const span = document.createElement('span');
        span.id = 'problem-rating';
        span.innerText = '...';

        document.getElementById('show-rating-btn').replaceWith(span);
        showRating();
    });

chrome.storage.sync.get('settings.ratingHidden').then((res) => {
    if (res['settings.ratingHidden']) {
        return;
    }

    document.getElementById('show-rating-btn').click();
});

getStatusElement().then((elem) => {
    if (!elem) {
        return;
    }

    elem.style.fontSize = '21px';
    elem.style.position = 'absolute';
    elem.style.transform = 'translateY(2px)';

    document.getElementsByClassName('h2')[0].style.marginLeft = '65px';
    document.getElementsByClassName('h2')[0].before(elem);
});
