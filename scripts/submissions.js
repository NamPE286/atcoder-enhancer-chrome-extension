const contest = window.location.pathname.split('/')[2];
const problem = document.getElementsByTagName('td')[1].innerText[0];

let dialog = document.createElement('dialog');
let results;
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
    const tables = document.getElementsByTagName('tbody');
    const res = [];
    let resultRows = tables[tables.length - 1].children;

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
            <b>Case Name: </b> ${item.caseName}<br><b>Status:</b> ${item.status}; <b>Exec Time:</b> ${item.execTime}ms; <b>Memory:</b> ${item.memory}KB<br>
            <button id='toggle-input-btn'>Hide/unhide input</button><br>
            <div id='testcase-dialog-input' style='display: block'>
                <b>Input:</b>${copyBtnHTMLString}<pre id="pre-sample6">${testData.in}</pre>
            </div>
            <div id='testcase-dialog-output'>
                <b>Output:</b>${copyBtnHTMLString}<pre id="pre-sample6">${testData.out}</pre>
            </div>
        `;

        document.getElementById('toggle-input-btn').onclick = () => {
            const display = document.getElementById('testcase-dialog-input').style.display
            document.getElementById('testcase-dialog-input').style.display = (display == 'block' ? 'none' : 'block')
        }
    } catch {
        dialogDetail.innerHTML = 'Not available';
    }
}

function filterTestcase(elem, value) {
    const tbody = elem.getElementsByTagName('tbody')[0]
    tbody.innerHTML = ''
    
    for(const i of results) {
        if(i.status == value || value == 'all') {
            tbody.appendChild(i.element)
        }
    }
}

if (window.location.pathname.split('/')[4] != 'me') {
    let elem = document.getElementsByClassName('panel panel-default')[document.getElementsByClassName('panel panel-default').length - 1]
    let cloned = elem.cloneNode(true)

    elem.after(cloned)
    elem.className = ''
    elem.innerHTML = `
        <div id='additional-options'>
            <div style='display: flex; align-items: center; gap: 5px'>
                <label style='margin-bottom: -4px'>Filter:</label>
                <select id='filter-options'>
                    <option value="all">All</option>
                    <option value="AC">Accepted</option>
                    <option value="WA">Wrong answer</option>
                    <option value="TLE">Time limit exceeded</option>
                    <option value="MLE">Memory limit exceeded</option>
                </select>
            </div>
        </div>
    `

    document.getElementById('additional-options').style.cssText = `
        display: flex;
        gap: 20px;
        align-items: center;
        margin-bottom: 10px;
    `

    document.getElementById('filter-options').onchange = () => {
        filterTestcase(cloned, document.getElementById('filter-options').value)
    }

    results = extractResultData();

    for (const i of results) {
        i.element.style.cursor = 'pointer';
        i.element.onclick = () => {
            showTestcase(i);
        };
    }
}
