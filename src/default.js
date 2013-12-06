// (function(window, undefined) {
//     'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    var source  = $('source');
    var count   = $('correctionTableSize');
    var answers = $('answers');
    var result  = {};

    answers.dataset.showDescription = !!settings.showDescription;

    // correctionTableSize가 존재하면 파싱까지는 정상으로 본다.
    if (count) {
        // 문법 및 철자 오류가 있나?
        if (parseInt(count.value)) {
            var table = source.querySelectorAll('.tableErrCorrect');

            [].slice.call(table).forEach(function(row, index) {
                var query   = row.querySelector('.tdErrWord').innerHTML;
                var answer  = row.querySelector('.tdReplace').innerHTML;
                var comment = row.querySelector('.tdETNor').innerHTML;

                if (result[query] !== undefined) {
                    return;
                }

                result[query] = '';

                var article = document.createElement('article');
                var h1 = document.createElement('h1');
                var description = document.createElement('p');

                description.classList.add('description');

                h1.innerHTML = query;
                // h2.innerHTML = answer;
                description.innerHTML = comment;

                var p = document.createElement('p');
                p.classList.add('answer');

                article.appendChild(h1);
                article.appendChild(p);
                article.appendChild(description);

                // 선택 안 함 버튼
                createAnswer({
                    parent: p,
                    index : index
                });

                answer.split(/\s*<br>\s*/i).forEach(function(answer, subIndex) {
                    if (!answer) {
                        return;
                    }

                    createAnswer({
                        parent  : p,
                        answer  : answer,
                        index   : index,
                        subIndex: subIndex + 1
                    });
                });

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

        $('default-answer').addEventListener('change', function(event) {
            answers.dataset.defaultAnswer = settings.defaultAnswer = this.checked;
        });

        answers.addEventListener('change', function(event) {
            var el = event.target;
            var query = el.parentNode.previousSibling.innerHTML;

            result[query] = el.value;
        });
    }

    function createAnswer(options) {
        var id = ['answer', options.index, options.subIndex || 0].join('-');

        var radio = document.createElement('input');
        radio.id    = id;
        radio.type  = 'radio';
        radio.name  = 'answer-' + options.index;
        radio.value = options.answer || 'none';

        if (settings.defaultAnswer && options.subIndex == 1) {
            radio.checked = true;
        }

        var label = document.createElement('label');
        label.htmlFor   = id;
        label.innerHTML = options.answer || '&times;';

        options.parent.appendChild(radio);
        options.parent.appendChild(label);
    }

    initHandler();
// })(window);
