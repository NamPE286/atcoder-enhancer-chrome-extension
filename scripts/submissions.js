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
    const resultCells = document.getElementsByTagName('tbody')[5].children;
    const res = [];

    for (let i = 0; i < resultCells.length; i += 4) {
        const result = resultCells[i].innerText.split('\t');

        res.push({
            element: resultCells[i],
            caseName: result[0],
            status: result[1],
            execTime: parseInt(result[2].slice(0, -3)),
            memory: parseInt(result[3].slice(0, -3))
        });
    }

    return res;
}

async function showTestcase(caseName) {
    const p = document.getElementById('testcase-dialog-detail');

    p.innerHTML = 'Loading...';
    dialog.showModal();

    try {
        const testData = await (
            await fetch(
                `https://atcoder-enhancer-api.fly.dev/contest/${contest}/${problem}/testcase/${caseName}`
            )
        ).json();

        p.innerHTML = `<b>Input:</b><br>${testData.in}<br><b>Output:</b><br>${testData.out}`;
    } catch {
        p.innerHTML = 'Not available';
    }
}

const results = extractResultData();

for (const i of results) {
    i.element.style.cursor = 'pointer';
    i.element.onclick = () => {
        showTestcase(i.caseName);
    };
}
