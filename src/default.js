(function(window, undefined) {
    'use strict';

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

    var reKorean = /[가-힣]+/;
    var text = {
        forget : '<b>&times;</b>계속 감추기',
        restore: '<b>&#10003;</b>감추기 해제'
    };

    var answers = {};
    var settings;

    function init() {
        settings = arguments[0];

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

        $('#answers').on('change', ':radio', function() {
            $(this).closest('[data-query]').dataset('default-answer', false);

            changeResult();
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

            changeResult();
        });

        $('#settings').on('change', ':checkbox', function(event) {
            var key   = this.id;
            var value = this.checked;

            settings[$.camelCase(key)] = value;

            $('#answers').dataset(key, value);

            if (key == 'show-description') {
                return;
            }

            if (key == 'default-answer') {
                $('#answers [data-default-answer=true] [type=radio]:nth-of-type(' + (value ? 2 : 1) + ')').prop('checked', true);
            }

            changeResult();
        });

        window.setInterval(function() {
            $('#result').select();
        }, 250);
    }

    function initDataset() {
        var el = $('#answers');

        el.dataset('ignore-non-korean', !!settings.ignoreNonKorean);
        el.dataset('show-description', !!settings.showDescription);
        el.dataset('show-hidden', !!settings.showHidden);
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
        $('#source .tableErrCorrect').each(function(index) {
            var self = $(this);

            var query   = self.find('.tdErrWord').html();
            var answer  = self.find('.tdReplace').html();
            var comment = self.find('.tdETNor').html();

            if (answers[query] !== undefined) {
                return;
            }

            answers[query] = '';

            var hidden = settings.hiddenWords.indexOf(query) >= 0;

            var article = $('<article/>');
            article.dataset('query', query);
            article.dataset('korean', reKorean.test(query));
            article.dataset('hidden', hidden);
            article.dataset('default-answer', true);

            var h1 = $('<h1/>');
            h1.html(query);
            h1.appendTo(article);

            var description = $('<p/>');
            description.addClass('description');
            description.html(comment);
            description.appendTo(article);

            var wrap = $('<p/>');
            wrap.addClass('answer');
            wrap.appendTo(article);

            var forget = $('<button/>');
            forget.attr({
                type: 'button'
            });
            forget.dataset('action', hidden ? 'restore' : 'forget');
            forget.html(hidden ? text.restore : text.forget);
            forget.appendTo(article);

            createAnswer({
                parent: wrap,
                index : index
            });

            answer.split(/\s*<br>\s*/i).forEach(function(answer, subIndex) {
                if (!answer) {
                    return;
                }

                createAnswer({
                    parent  : wrap,
                    query   : query,
                    answer  : answer,
                    index   : index,
                    subIndex: subIndex + 1
                });
            });

            article.appendTo('#answers');
        });
    }

    function success() {
        var p = $('<p/>');
        p.addClass('passed');
        p.html('문법 및 철자 오류가 발견되지 않았습니다.');
        p.appendTo('#answers');
    }

    function fail() {
        var p = $('<p/>');
        p.addClass('error');
        p.html(source.innerHTML);
        p.appendTo('#answers');
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

        if (settings.defaultAnswer) {
            if (options.subIndex == 1) {
                radio.prop('checked', true);
            }
        } else {
            if (!options.subIndex) {
                radio.prop('checked', true);
            }
        }


        var label = $('<label/>');
        label.attr('for', id);
        label.html(options.answer || '&times;');

        options.parent.append(radio);
        options.parent.append(label);
    }

    function changeResult() {
        var excludeKorean = $('#ignore-non-korean').prop('checked');
        var excludeHidden = !$('#show-hidden').prop('checked');
        var answers = {};

        $('#answers [data-query]').each(function() {
            var self   = $(this);
            var query  = self.dataset('query');
            var answer = self.find(':checked').val();

            if (!answer || answer == 'none') {
                return;
            }

            if (excludeKorean && !reKorean.test(query)) {
                return;
            }

            if (excludeHidden && self.dataset('hidden') == 'true') {
                return;
            }

            answers[query] = answer;
        });

        var result = {
            answers : answers,
            settings: settings
        };

        console.log(result);

        $('#result').html(JSON.stringify(result));
    }

    window.dandy = init;

})(window);
