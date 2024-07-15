const contest = window.location.pathname.split('/')[2];
const problemID = window.location.pathname.split('/')[4];

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
        return 'brown';
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

document.getElementById('task-statement').innerHTML =
    `Tags : <button id="show-tags-btn">Show</button><br>Rating : <button id="show-rating-btn">Show</button>` +
    document.getElementById('task-statement').innerHTML;

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

        fetch(`https://atcoder-enhancer-api.fly.dev/problem/${problemID}`)
            .then((res) => res.json())
            .then((res) => {
                if (!res.difficulty) {
                    throw new Error();
                }

                let span = document.createElement('span');

                span.innerText = res.difficulty;
                span.style.fontWeight = 'bold';
                span.style.color = getRatingColor(res.difficulty);

                document.getElementById('show-rating-btn').replaceWith(span);
            })
            .catch((err) => {
                let span = document.createElement('span');

                span.innerText = 'Not available';
                document.getElementById('show-rating-btn').replaceWith(span);
            });
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
