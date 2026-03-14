/**
 * Vyhodnocení odpovědí v úlohách
 * - Textové pole: .task-answer-block s .task-answer-input
 * - Výběr možnosti: .task-answer-block--choice s .task-answer-options (radio)
 * Atributy: data-max-attempts, data-correct (nebo pipe-separated), u choice data-name (pro name u radií).
 */
(function () {
    function init() {
        document.querySelectorAll('.task-answer-block').forEach(function (block) {
            if (block.classList.contains('task-answer-block--fill')) return;
            if (block.dataset.initialized === '1') return;
            block.dataset.initialized = '1';

            var isChoice = block.classList.contains('task-answer-block--choice');
            var attrMax = parseInt(block.getAttribute('data-max-attempts'), 10);
            if (!(attrMax > 0)) attrMax = null;
            var maxAttempts = attrMax || (isChoice ? 2 : 5);
            var correctRaw = block.getAttribute('data-correct') || '';
            var correctAnswers = correctRaw.split('|').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);

            var attemptsEl = block.querySelector('.task-answer-attempts');
            var inputEl = block.querySelector('.task-answer-input');
            var submitBtn = block.querySelector('.task-answer-submit');
            var feedbackEl = block.querySelector('.task-answer-feedback');
            var radios = block.querySelectorAll('input[type="radio"]');

            var attemptsLeft = maxAttempts;

            function updateAttemptsDisplay() {
                if (attemptsEl) attemptsEl.textContent = attemptsLeft + '/' + maxAttempts;
                if (attemptsLeft <= 0) block.classList.add('no-attempts');
            }

            function setFeedback(text, isCorrect) {
                if (!feedbackEl) return;
                feedbackEl.textContent = text;
                feedbackEl.className = 'task-answer-feedback' + (isCorrect ? ' correct' : ' wrong');
            }

            function getValue() {
                if (isChoice && radios.length) {
                    for (var i = 0; i < radios.length; i++) {
                        if (radios[i].checked) return radios[i].value.toLowerCase();
                    }
                    return '';
                }
                return (inputEl && inputEl.value) ? inputEl.value.trim().toLowerCase() : '';
            }

            function disableInputs() {
                if (inputEl) inputEl.disabled = true;
                if (submitBtn) submitBtn.disabled = true;
                for (var j = 0; j < radios.length; j++) radios[j].disabled = true;
            }

            function checkAnswer() {
                var value = getValue();
                if (!value) {
                    setFeedback(isChoice ? 'Vyber jednu možnost.' : 'Zadej odpověď.', false);
                    return;
                }
                if (correctAnswers.length === 0) {
                    setFeedback('Úloha nemá nastavenou správnou odpověď.', false);
                    return;
                }
                var correct = correctAnswers.indexOf(value) !== -1;
                if (correct) {
                    block.classList.add('solved');
                    disableInputs();
                    setFeedback('Správně!', true);
                    return;
                }
                attemptsLeft--;
                updateAttemptsDisplay();
                if (attemptsLeft <= 0) {
                    disableInputs();
                    setFeedback('Vyčerpal jsi všechny pokusy.', false);
                } else {
                    setFeedback('Špatně. Zkus to znovu. Zbývá ' + attemptsLeft + ' pokusů.', false);
                }
            }

            updateAttemptsDisplay();

            if (submitBtn) {
                submitBtn.addEventListener('click', checkAnswer);
            }
            if (inputEl) {
                inputEl.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
