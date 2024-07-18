const user = window.location.pathname.split('/')[2];

document.getElementsByClassName('row')[0].remove();
document.getElementsByClassName('row')[0].remove();

async function getSubmissionsHTML() {
    const startSecond = Math.floor(new Date().getTime() / 1000 - 2592000);
    const data = (
        await (
            await fetch(
                `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${user}&from_second=${startSecond}`
            )
        ).json()
    ).reverse();
    const problemList = await (
        await fetch(`https://kenkoooo.com/atcoder/resources/problems.json`)
    ).json();
    const problems = {};
    let res = '';

    for (const i of problemList) {
        problems[i.id] = i;
    }

    for (const i of data) {
        res += `
            <tr>
                <td class="no-break"><time class="fixtime-second">${new Date(
                    i.epoch_second * 1000
                ).toLocaleString('en-GB')}</time></td>
                <td><a href="/contests/${i.contest_id}/tasks/${i.problem_id}">${
            i.problem_id[i.problem_id.length - 1].toUpperCase() +
            ' - ' +
            problems[i.problem_id].name
        }</a></td>
                <td><a href="/users/${user}">${user}</a> <a href="/contests/${
            i.contest_id
        }/submissions?f.User=${user}"><span class="glyphicon glyphicon-search black" aria-hidden="true" data-toggle="tooltip" title="" s="" submissions'="" data-original-title="view NamPE15"></span></a></td>
                <td>${i.language}</td>
                <td class="text-right submission-score">${i.point}</td>
                <td class="text-right">${i.length} Byte</td>
                <td class="text-center"><span class="label label-${
                    i.result == 'AC' ? 'success' : 'warning'
                }">${i.result}</span></td><td class="text-right">${
            i.execution_time
        } ms</td><td class="text-right">? KB</td>
                <td class="text-center">
                    <a href="/contests/${i.contest_id}/submissions/${
            i.id
        }">Detail</a>
                </td>
            </tr>
        `;
    }

    return res;
}

const navbar = document.createElement('div');
navbar.innerHTML = `
<div class="col-sm-12">
	<ul id="user-nav-tabs" class="nav nav-tabs">
		<li><a href="/users/NamPE15"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Profile</a></li>
		<li><a href="/users/NamPE15/history"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> Competition History</a></li>
		<li class='active'><a href="/users/NamPE15/submissions"><span class="glyphicon glyphicon-list" aria-hidden="true"></span> Recent Submissions</a></li>
        <li>
            <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Settings<span class="caret"></span></a>
            <ul class="dropdown-menu">
                <li><a href="/settings"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span> General Settings</a></li>
                <li><a href="/settings/icon"><span class="glyphicon glyphicon-picture" aria-hidden="true"></span> Change Photo</a></li>
                <li><a href="/settings/password"><span class="glyphicon glyphicon-lock" aria-hidden="true"></span> Change Password</a></li>
                <li><a href="/settings/mail">Change/Verify Email address</a></li>
                <li><a href="/settings/fav">Manage Fav</a></li>
                <li class="divider"></li>
                <li><a href="/remind_username">Remind Username</a></li>
                <li><a href="/settings/user_screen_name">Change Username</a></li>
                <li><a href="/quit">Delete Account</a></li>
            </ul>
        </li>
	</ul>
</div>
`;
const submissionsTable = document.createElement('div');

document.getElementById('main-container').innerHTML =
    navbar.outerHTML + document.getElementById('main-container').innerHTML;
document.getElementsByTagName('hr')[0].before(submissionsTable);

getSubmissionsHTML().then((res) => {
    submissionsTable.innerHTML = `
        <h2 style='margin-top: 70px; margin-bottom: 20px'><b>Recent Submissions</b></h2>
        <hr>
        <p><i>Latest submissions in 30 days</i></p>
        <table class="table table-bordered table-striped small th-center">
        <thead>
        <tr>
            
            <th width="12%">Submission Time</th>
            <th>Task</th>
            <th>User</th>
            <th>Language</th>
            <th width="5%">Score</th>
            <th width="9%">Code Size</th>
            <th width="5%">Status</th>
            <th width="7%">Exec Time</th>
            <th width="8%">Memory</th>
            <th width="5%"></th>
        </tr>
        </thead>
        <tbody>
            ${res}
        </tbody>
        </table>
    `;
});
