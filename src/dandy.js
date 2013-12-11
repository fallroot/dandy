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
        restore: '<b>&#x2713;</b>감추기 해제'
    };

    var result  = {};
    var answers = {};
    var config;

    function init() {
        config = arguments[0];

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

            saveAnswers();
        });

        $('#answers').on('click', 'button', function(event) {
            var self   = $(this);
            var action = self.dataset('action');
            var parent = self.closest('[data-query]');
            var query  = parent.dataset('query');
            var words  = config.hiddenWords;

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

            saveAll();
        });

        $('#config').on('change', ':checkbox', function(event) {
            var key   = this.id;
            var value = this.checked;

            config[$.camelCase(key)] = value;

            saveConfig();

            $('#answers').dataset(key, value);

            if (key == 'show-description') {
                return;
            }

            if (key == 'default-answer') {
                $('#answers [data-default-answer=true] [type=radio]:nth-of-type(' + (value ? 2 : 1) + ')').prop('checked', true);
            }

            saveAnswers();
        });

        window.setInterval(function() {
            $('#result').select();
        }, 250);
    }

    function initDataset() {
        var el = $('#answers');

        el.dataset('ignore-non-korean', !!config.ignoreNonKorean);
        el.dataset('show-description', !!config.showDescription);
        el.dataset('show-hidden', !!config.showHidden);
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
        $('#default-answer').prop('checked', !!config.defaultAnswer);
        $('#ignore-non-korean').prop('checked', !!config.ignoreNonKorean);
        $('#show-description').prop('checked', !!config.showDescription);
        $('#show-hidden').prop('checked', !!config.showHidden);
    }

    function showAnswers() {
        var nonKoreanCount = 0;
        var hiddenCount    = 0;

        $('#source .tableErrCorrect').each(function(index) {
            var self = $(this);

            var query   = self.find('.tdErrWord').html();
            var answer  = self.find('.tdReplace').html();
            var comment = self.find('.tdETNor').html();

            if (answers[query] !== undefined) {
                return;
            }

            answers[query] = '';

            var hidden = config.hiddenWords.indexOf(query) >= 0;
            var korean = reKorean.test(query);

            var article = $('<article/>');
            article.dataset('query', query);
            article.dataset('korean', korean);
            article.dataset('hidden', hidden);
            article.dataset('default-answer', true);

            var h1 = $('<h1/>');
            h1.html(query);
            h1.appendTo(article);

            var wrap = $('<p/>');
            wrap.addClass('answer');
            wrap.appendTo(article);

            var description = $('<p/>');
            description.addClass('description');
            description.html(comment);
            description.appendTo(article);

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

            if (hidden) {
                hiddenCount += 1;
            }

            if (!korean) {
                nonKoreanCount += 1;
            }
        });

        if (hiddenCount > 0 || nonKoreanCount > 0) {
            showStats(hiddenCount, nonKoreanCount);
        }

        saveAnswers();
    }

    function showStats(hidden, nonKorean) {
        var messages = [];

        if (nonKorean > 0) {
            messages.push('한글이 없는 단어가 ' + nonKorean + '개');
        }

        if (hidden > 0) {
            messages.push('감춘 단어가 ' + hidden + '개');
        }

        var p = $('<p/>');
        p.addClass('stats');
        p.html(messages.join(' / ') + ' 있습니다.');
        p.prependTo('#answers');
    }

    function success() {
        $('body').dataset('status', 'passed');
    }

    function fail() {
        $('body').dataset('status', 'error');
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

        if (config.defaultAnswer) {
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

    function saveAnswers() {
        var excludeKorean = $('#ignore-non-korean').prop('checked');
        var excludeHidden = !$('#show-hidden').prop('checked');

        var answers = {};
        var count   = 0;

        $('#answers [data-query]').each(function() {
            var self   = $(this);
            var query  = self.dataset('query');
            var answer = self.find(':checked').val();

            if (excludeKorean && !reKorean.test(query)) {
                return;
            }

            if (excludeHidden && self.dataset('hidden') == 'true') {
                return;
            }

            count += 1;

            if (!answer || answer == 'none') {
                return;
            }

            answers[query] = answer;
        });

        if (count) {
            $('body').dataset('status', null);
        } else {
            $('body').dataset('status', 'passed');
        }

        result.answers = answers;

        saveResult();
    }

    function saveConfig() {
        result.config = config;

        saveResult();
    }

    function saveAll() {
        saveConfig();
        saveAnswers();
    }

    function saveResult() {
        $('#result').html(JSON.stringify(result));
    }

    window.dandy = init;

})(window);
