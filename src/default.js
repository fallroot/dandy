var source  = document.getElementById('source');
var count   = document.getElementById('correctionTableSize');
var answers = document.querySelector('section');

// correctionTableSize가 존재하면 파싱까지는 정상으로 본다.
if (count) {
    // 문법 및 철자 오류가 있나?
    if (parseInt(count.value)) {
        var table = source.querySelectorAll('.tableErrCorrect');

        [].slice.call(table).forEach(function(row) {
            var query   = row.querySelector('.tdErrWord').innerHTML;
            var answer  = row.querySelector('.tdReplace').innerHTML;
            var comment = row.querySelector('.tdETNor').innerHTML;

            var article = document.createElement('article');
            var h1 = document.createElement('h1');
            var h2 = document.createElement('h2');
            var p = document.createElement('p');

            h1.innerHTML = query;
            h2.innerHTML = answer;
            p.innerHTML = comment;

            article.appendChild(h1);
            article.appendChild(h2);
            article.appendChild(p);

            answers.appendChild(article);
        });
    } else {
        var p = document.createElement('p');
        p.classList.add('passed');
        p.innerHTML = '문법 및 철자 오류가 발견되지 않았습니다.';

        answers.appendChild(p);
    }
} else {
    var p = document.createElement('p');
    p.classList.add('error');
    p.innerHTML = source.innerHTML;

    answers.appendChild(p);
}


// var brs = document.querySelectorAll('h2 br');

// Array.prototype.slice.call(brs).forEach(function(br) {
//     if (br.nextSibling) {
//         var delimiter = document.createElement('span');
//         // delimiter.appendChild(document.createTextNode('&middot;'));
//         delimiter.innerHTML = '&middot;';
//         br.parentNode.insertBefore(delimiter, br);
//     }
//     br.parentNode.removeChild(br);
// });
