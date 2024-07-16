const user = document
    .getElementsByClassName('dropdown-toggle')[1]
    .innerText.trim();

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
    const tbody = document.getElementsByTagName('tbody')[0].children;
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

async function getContestState() {
    const contestProblemCount = await getAllContestProblemCount();
    const contestSubmissionCount = await getAllContestSubmissionCount();
    const res = {};

    for (const i in contestSubmissionCount) {
        if (contestProblemCount[i] != contestSubmissionCount[i]) {
            res[i] = 0;
        } else {
            res[i] = 1;
        }
    }

    console.log(contestProblemCount, contestSubmissionCount, res)

    return res;
}

async function main() {
    const contestState = await getContestState();
    const tbody = document.getElementsByTagName('tbody')[0].children;

    for (let i = 0; i < tbody.length; i++) {
        const elem = tbody[i].children[1];
        const index = elem.innerHTML.indexOf('href=');
        let contest = '';

        for (let j = index + 6; elem.innerHTML[j] != '"'; j++) {
            contest += elem.innerHTML[j];
        }

        contest = contest.split('/')[2];

        if (!(contest in contestState)) {
            continue;
        }

        if (contestState[contest] == 0) {
            elem.style.backgroundColor = '#fcff63';
        } else if (contestState[contest] == 1) {
            elem.style.backgroundColor = '#52ff60';
        }
    }
}

main();
