// (function(window, undefined) {
//     'use strict';

    $.fn.dataset = function(key, value) {
        var field = 'data-' + key;

        if (value === undefined) {
            return this.attr(field);
        } else if (value === null) {
            return this.removeAttr(field);
        } else {
            return this.attr(field, value);
        }
    };

    var source   = $('#source')[0];
    var answers  = document.getElementById('answers');;
    var reKorean = /[가-힣]+/;
    var text = {
        forget : '<b>&times;</b>계속 감추기',
        restore: '<b>&#10003;</b>감추기 해제'
    };
    var result   = {};

    function init() {
        initHandler();
        initDataset();
        initAnswers();
        initSettings();
    }

    function initHandler() {
        $('header').on('click', '[data-action]', function(event) {
            var action = $(this).dataset('action');

            $('body').dataset('screen-id', action);
        });

        $('#answers').on('click', 'button', function(event) {
            var self   = $(this);
            var action = self.dataset('action');
            var parent = self.closest('[data-query]');
            var query  = parent.dataset('query');
            var words  = settings.hiddenWords;

            if (action == 'forget') {
                self.dataset('action', 'restore');
                self.html(text.restore);

                words.push(query);
            } else {
                self.dataset('action', 'forget');
                self.html(text.forget);

                words.splice(words.indexOf(query), 1);
            }

            parent.dataset('hidden', action == 'forget');
        });

        // $('toggle-settings').addEventListener('click', function(event) {
        //     // event.preventDefault();
        //     $('settings').classList.toggle('active');
        // });;

        $('#default-answer').on('change', function(event) {
            answers.dataset.defaultAnswer = settings.defaultAnswer = this.checked;
        });

        $('#ignore-non-korean').on('change', function(event) {
            answers.dataset.ignoreNonKorean = settings.ignoreNonKorean = this.checked;
        });

        $('#show-description').on('change', function(event) {
            answers.dataset.showDescription = settings.showDescription = this.checked;
        });

        $('#show-hidden').on('change', function(event) {
            answers.dataset.showHidden = settings.showHidden = this.checked;
        });

        $(answers).on('change', ':checkbox', function(event) {
            var el = event.target;
            var query = el.parentNode.previousSibling.innerHTML;

            result[query] = el.value;
        });
    }

    function initDataset() {
        answers.dataset.ignoreNonKorean = !!settings.ignoreNonKorean;
        answers.dataset.showDescription = !!settings.showDescription;
        answers.dataset.showHidden      = !!settings.showHidden;
    }

    function initAnswers() {
        var count = $('#correctionTableSize');

        if (count.length) {
            if (count.val()) {
                showAnswers();
            } else {
                success();
            }
        } else {
            fail();
        }
    }

    function initSettings() {
        $('#default-answer').prop('checked', !!settings.defaultAnswer);
        $('#ignore-non-korean').prop('checked', !!settings.ignoreNonKorean);
        $('#show-description').prop('checked', !!settings.showDescription);
        $('#show-hidden').prop('checked', !!settings.showHidden);
    }

    function showAnswers() {
        var table = source.querySelectorAll('.tableErrCorrect');

        [].slice.call(table).forEach(function(row, index) {
            var query   = row.querySelector('.tdErrWord').innerHTML;
            var answer  = row.querySelector('.tdReplace').innerHTML;
            var comment = row.querySelector('.tdETNor').innerHTML;

            if (result[query] !== undefined) {
                return;
            }

            result[query] = '';

            var hidden = settings.hiddenWords.indexOf(query) >= 0;

            var article = $('<article/>');
            article.dataset('query', query);
            article.dataset('korean', reKorean.test(query));
            article.dataset('hidden', hidden);

            var h1 = $('<h1/>');
            h1.html(query);

            var description = $('<p/>');
            description.addClass('description');
            description.html(comment);

            var p = $('<p/>');
            p.addClass('answer');

            var forget = $('<button/>');
            forget.attr({
                type: 'button'
            });
            forget.dataset('action', hidden ? 'restore' : 'forget');
            forget.html(hidden ? text.restore : text.forget);

            article.append(h1);
            article.append(p);
            article.append(description);
            article.append(forget);

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
                    query   : query,
                    answer  : answer,
                    index   : index,
                    subIndex: subIndex + 1
                });
            });

            article.appendTo(answers);
        });
    }

    function success() {
        var p = $('<p/>');
        p.addClass('passed');
        p.html('문법 및 철자 오류가 발견되지 않았습니다.');
        p.appendTo(answers);
    }

    function fail() {
        var p = $('<p/>');
        p.addClass('error');
        p.html(source.innerHTML);
        p.appendTo(answers);
    }

    function createAnswer(options) {
        var id = ['answer', options.index, options.subIndex || 0].join('-');

        var radio = $('<input/>');
        radio.attr({
            id   : id,
            type : 'radio',
            name : 'answer-' + options.index,
            value: options.answer || 'none'
        });

        if (settings.defaultAnswer && options.subIndex == 1) {
            radio.prop('checked', true);

            result[options.query] = options.answer;
        }

        var label = $('<label/>');
        label.attr('for', id);
        label.html(options.answer || '&times;');

        options.parent.append(radio);
        options.parent.append(label);
    }

    init();
// })(window);
