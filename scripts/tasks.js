const contest = window.location.pathname.split('/')[2];
const tableRows = document.getElementsByTagName('tbody')[0].children;
const problemStatusElements = [];

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

async function main() {
    for (let i = 0; i < tableRows.length; i++) {
        const problemID = contest + '_' + String.fromCharCode(97 + i);

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
            problemStatusElements.push(null);
            
            continue;
        }

        const tbody = document.createElement('tbody');

        tbody.innerHTML = tbodyHTMLString;
        problemStatusElements.push(tbody.children[0].children[6].children[0]);
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

        if (problemStatusElements[i]) {
            cloned.appendChild(problemStatusElements[i]);
        } else {
            cloned.innerHTML = '-';
        }

        tableRows[i].children[0].after(cloned);
    }

    statusCell.innerText = 'Status';
}

main();
