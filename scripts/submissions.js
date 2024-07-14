const cells = document.getElementsByTagName('td');
const contest = window.location.pathname.split('/')[2];
const problem = document.getElementsByTagName('td')[1].innerText[0];

let dialog = document.createElement('dialog');
dialog.innerHTML = `<p id='testcase-dialog-detail'></p><button id='testcase-dialog-close-btn'>Close</button>`;

document.body.appendChild(dialog);
document
    .getElementById('testcase-dialog-close-btn')
    .addEventListener('click', () => {
        dialog.close();
    });

function extractResultData() {
    const resultCells = [];

    for (let i = 21; i < cells.length; i++) {
        resultCells.push(cells[i]);
    }

    const res = [];

    for (let i = 0; i < resultCells.length; i += 4) {
        const row = resultCells.slice(i, i + 4);

        res.push({
            index: 21 + i,
            caseName: row[0].innerText,
            status: row[1].innerText,
            execTime: parseInt(row[2].innerText.slice(0, -3)),
            memory: parseInt(row[3].innerText.slice(0, -3))
        });
    }

    return res;
}

async function showTestcase(caseName) {
    const p = document.getElementById('testcase-dialog-detail');

    p.innerHTML = 'Loading...';
    dialog.showModal();

    const testData = await (
        await fetch(
            `https://atcoder-enhancer-api.fly.dev/contest/${contest}/${problem}/testcase/${caseName}`
        )
    ).json();

    p.innerHTML = `<b>Input:</b><br>${testData.in}<br><b>Output:</b><br>${testData.out}`;
}

const results = extractResultData();

for (const i of results) {
    cells[i.index].style.cursor = 'pointer';
    cells[i.index].onclick = () => {
        showTestcase(i.caseName);
    };
}
