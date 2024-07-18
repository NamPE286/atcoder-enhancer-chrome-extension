const cloned = document.getElementsByTagName('li')[16].cloneNode(true);
cloned.getElementsByTagName('a')[0].href =
    window.location.href + '/submissions';
cloned.getElementsByTagName('a')[0].innerHTML = cloned
    .getElementsByTagName('a')[0]
    .innerHTML.replace('Competition History', 'Recent Submissions');
cloned.className = '';
document.getElementsByTagName('li')[16].after(cloned);
