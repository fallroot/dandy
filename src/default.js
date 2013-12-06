(function(window, undefined) {
    'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    var source  = $('source');
    var count   = $('correctionTableSize');
    var answers = $('answers');

    answers.dataset.showDescription = !!settings.showDescription;

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
                var description = document.createElement('p');

                description.classList.add('description');

                h1.innerHTML = query;
                h2.innerHTML = answer;
                description.innerHTML = comment;

                article.appendChild(h1);
                article.appendChild(h2);
                article.appendChild(description);

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

    function initHandler() {
        $('toggle-settings').addEventListener('click', function(event) {
            // event.preventDefault();
            $('settings').classList.toggle('active');
        });;

        $('show-description').addEventListener('change', function(event) {
            answers.dataset.showDescription = settings.showDescription = this.checked;
        });
    }

    initHandler();
})(window);
