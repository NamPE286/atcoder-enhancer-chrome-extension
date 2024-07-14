const problemID = window.location.pathname.split('/')[4];

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

    const tags = res.json();
    let span = document.createElement('span');
    span.innerText = tags.join(', ');
    document.getElementById('show-tags-btn').replaceWith(span);
});
