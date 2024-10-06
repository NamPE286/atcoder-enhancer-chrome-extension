const user = document
    .getElementsByClassName('dropdown-toggle')[1]
    .innerText.trim();

function getTableIndex() {
    const elems = document.getElementsByTagName('h3');

    for (let i = 0; i < elems.length; i++) {
        if (elems[i].innerText == 'Recent Contests') {
            return i - 1;
        }
    }

    return -1;
}

async function getAllContestProblemCount() {
    const contests = await (
        await fetch(
            'https://kenkoooo.com/atcoder/resources/contest-problem.json'
        )
    ).json();

    const count = {};

    for (const i of contests) {
        if (!(i.contest_id in count)) {
            count[i.contest_id] = 0;
        }

        count[i.contest_id]++;
    }

    return count;
}

function getStartEndTime() {
    const tbody = window.location.pathname.split('/')[2].length
        ? document.getElementsByTagName('tbody')[0].children
        : document.getElementsByTagName('tbody')[getTableIndex()].children;
    const startDateString = tbody[0].children[0].children[0].innerText;
    const endDateString =
        tbody[tbody.length - 1].children[0].children[0].innerText;

    return {
        start: new Date(endDateString).getTime() / 1000,
        end: new Date(startDateString).getTime() / 1000
    };
}

async function getAllContestSubmissionCount() {
    const { start, end } = getStartEndTime();
    const submissions = await (
        await fetch(
            `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${user}&from_second=${start}`
        )
    ).json();

    const count = {};

    for (const i of submissions) {
        if (i.epoch_second > end) {
            break;
        }

        if (i.result != 'AC') {
            continue;
        }

        if (!(i.contest_id in count)) {
            count[i.contest_id] = new Set();
        }

        count[i.contest_id].add(i.problem_id + i.result);
    }

    for (const i in count) {
        count[i] = count[i].size;
    }

    return count;
}

async function main() {
    const contestProblemCount = await getAllContestProblemCount();
    const contestACCount = await getAllContestSubmissionCount();
    const tbody = window.location.pathname.split('/')[2].length
        ? document.getElementsByTagName('tbody')[0].children
        : document.getElementsByTagName('tbody')[getTableIndex()].children;
    const thead = window.location.pathname.split('/')[2].length
        ? document.getElementsByTagName('thead')[0].children
        : document.getElementsByTagName('thead')[getTableIndex()].children;

    const cloned = thead[0].children[2].cloneNode(true);

    cloned.innerText = 'Solved';
    thead[0].children[2].before(cloned);

    for (let i = 0; i < tbody.length; i++) {
        let contest = '';
        const elem = tbody[i].children[1];
        const index = elem.innerHTML.indexOf('href=');

        for (let j = index + 6; elem.innerHTML[j] != '"'; j++) {
            contest += elem.innerHTML[j];
        }

        contest = contest.split('/')[2];
        const cloned = tbody[i].children[2].cloneNode(true);

        cloned.innerText =
            (contestACCount[contest] ? contestACCount[contest] : 0) +
            '/' +
            contestProblemCount[contest];
        tbody[i].children[2].before(cloned);

        if (!(contest in contestACCount)) {
            continue;
        }

        if (contestProblemCount[contest] != contestACCount[contest]) {
            elem.style.backgroundColor = '#fcff63';
        } else {
            elem.style.backgroundColor = '#52ff60';
        }
    }
}

main();
