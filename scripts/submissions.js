const contest = window.location.pathname.split('/')[2];
const problem = document.getElementsByTagName('td')[1].innerText[0];

let dialog = document.createElement('dialog');
let copyBtnHTMLString = `
    <div class="div-btn-copy">
        <span class="btn-copy btn-pre" tabindex="0" data-toggle="tooltip" data-trigger="manual" title="" data-target="pre-sample4" data-original-title="Copied!">Copy</span>
    </div>
`;

dialog.innerHTML = `
    <button id='testcase-dialog-close-btn'>x</button><br>
    <div id='testcase-dialog-detail'></div>
`;

document.body.appendChild(dialog);
document.getElementById('testcase-dialog-detail').style.width = '1000px';
document.getElementById('testcase-dialog-detail').style.maxWidth = '100%';
document.getElementById('testcase-dialog-close-btn').style.float = 'right';
document.getElementById('testcase-dialog-close-btn').style.backgroundColor =
    'transparent';
document.getElementById('testcase-dialog-close-btn').style.border = 'none';
document
    .getElementById('testcase-dialog-close-btn')
    .addEventListener('click', () => {
        dialog.close();
    });

function extractResultData() {
    let resultRows;
    const tables = document.getElementsByTagName('tbody');

    for (let i = tables.length - 1; i >= 0; i--) {
        const table = tables[i];

        if (table.children[0].childElementCount == 4) {
            resultRows = table.children;
            break;
        }
    }

    const res = [];

    for (let i = 0; i < resultRows.length; i++) {
        const result = resultRows[i].innerText.split('\t');

        res.push({
            element: resultRows[i],
            caseName: result[0],
            status: result[1],
            execTime: parseInt(result[2].slice(0, -3)),
            memory: parseInt(result[3].slice(0, -3))
        });
    }

    return res;
}

async function showTestcase(item) {
    const dialogDetail = document.getElementById('testcase-dialog-detail');
    dialogDetail.style.textAlign = 'center';
    dialogDetail.innerHTML = 'Loading...';
    dialog.showModal();

    try {
        const testData = await (
            await fetch(
                `https://atcoder-enhancer-api.fly.dev/contest/${contest}/${problem}/testcase/${item.caseName}`
            )
        ).json();

        dialogDetail.style.textAlign = 'left';
        dialogDetail.innerHTML = `
            <b>Case Name: </b> ${item.caseName}<br><b>Status:</b> ${item.status}; <b>Exec Time:</b> ${item.execTime}ms; <b>Memory:</b> ${item.memory}KB<br><br>
            <b>Input:</b>${copyBtnHTMLString}<pre id="pre-sample6">${testData.in}</pre>
            <b>Output:</b>${copyBtnHTMLString}<pre id="pre-sample6">${testData.out}</pre>
        `;
    } catch {
        dialogDetail.innerHTML = 'Not available';
    }
}

if (window.location.pathname.split('/')[4] != 'me') {
    const results = extractResultData();

    for (const i of results) {
        i.element.style.cursor = 'pointer';
        i.element.onclick = () => {
            showTestcase(i);
        };
    }
}
