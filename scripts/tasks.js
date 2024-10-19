const contest = window.location.pathname.split('/')[2];
const tableRows = document.getElementsByTagName('tbody')[0].children;
const problemStatus = new Array(tableRows.length).fill(null);

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

async function main() {
    for (let i = 1; true; i++) {
        console.log(
            `Fetching https://atcoder.jp/contests/${contest}/submissions/me?desc=true&orderBy=score&page=${i} ...`
        );

        const res = await (
            await fetch(
                `https://atcoder.jp/contests/${contest}/submissions/me?desc=true&orderBy=score&page=${i}`
            )
        ).text();

        const elem = document.createElement('div');
        elem.innerHTML = res;

        const tbody = elem.getElementsByTagName('tbody');

        if (tbody.length == 0) {
            break;
        }

        const rows = tbody[0].children;

        for (const row of rows) {
            const index =
                row
                    .getElementsByTagName('a')[0]
                    .href.split('_')
                    .at(-1)
                    .toLowerCase()
                    .charCodeAt(0) - 97;
            const statusElem = row.children[6].getElementsByTagName('span')[0];

            if (
                problemStatus[index] == null ||
                problemStatus[index].innerText != 'AC'
            ) {
                problemStatus[index] = statusElem;
            }
        }
    }

    const statusCell = document
        .getElementsByTagName('thead')[0]
        .children[0].children[0].cloneNode(true);

    document
        .getElementsByTagName('thead')[0]
        .children[0].children[0].after(statusCell);

    for (let i = 0; i < tableRows.length; i++) {
        const cloned = document
            .getElementsByTagName('thead')[0]
            .children[0].children[0].cloneNode(true);

        if (problemStatus[i]) {
            cloned.appendChild(problemStatus[i]);
        } else {
            cloned.innerHTML = '-';
        }

        tableRows[i].children[0].after(cloned);
    }

    statusCell.innerText = 'Status';
}

main();
