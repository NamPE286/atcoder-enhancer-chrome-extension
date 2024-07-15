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

document.getElementById('task-statement').innerHTML =
    `Tags: <button id="show-tags-btn">Show</button>` +
    document.getElementById('task-statement').innerHTML;

document.getElementById('show-tags-btn').addEventListener('click', async () => {
    document.getElementById('show-tags-btn').innerText = 'Loading...';
    document.getElementById('show-tags-btn').disabled = true;

    const res = await fetch(
        `https://atcoder-enhancer-api.fly.dev/problem/${problemID}/tags`
    );

    if (!res.ok) {
        let span = document.createElement('span');
        span.innerText = 'Not available';
        document.getElementById('show-tags-btn').replaceWith(span);

        return;
    }

    const tags = await res.json();
    console.log(tags);
    let span = document.createElement('span');
    span.innerText = tags.join(', ');
    document.getElementById('show-tags-btn').replaceWith(span);
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
