const cells = document.getElementsByTagName('td');
const problem = document.getElementsByTagName('td')[1].innerText[0]

function extractResultData() {
    const resultCells = [];

    for (let i = 21; i < cells.length; i++) {
        resultCells.push(cells[i]);
    }

    const res = [];

    for (let i = 0; i < resultCells.length; i += 4) {
        const row = resultCells.slice(i, i + 4);

        res.push({
            index: i,
            caseName: row[0].innerText,
            status: row[1].innerText,
            execTime: parseInt(row[2].innerText.slice(0, -3)),
            memory: parseInt(row[3].innerText.slice(0, -3))
        });
    }

    return res;
}

function fetchTestcaseIO(caseName) {

}

console.log(extractResultData())