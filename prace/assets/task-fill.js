/**
 * Úloha „doplň chybějící slova“ – kliknutím: vyber mezeru, pak klikni na slovo.
 * Blok: .task-answer-block--fill
 * Mezery: .task-fill-gap s data-correct="správné slovo"
 * Slova: .task-fill-word s data-value="slovo"
 * Max 3 pokusy.
 */
(function () {
    function init() {
        document.querySelectorAll('.task-answer-block--fill').forEach(function (block) {
            if (block.dataset.fillInitialized === '1') return;
            block.dataset.fillInitialized = '1';

            var maxAttempts = 3;
            var attemptsLeft = maxAttempts;
            var gaps = block.querySelectorAll('.task-fill-gap');
            var words = block.querySelectorAll('.task-fill-word');
            var submitBtn = block.querySelector('.task-answer-submit');
            var feedbackEl = block.querySelector('.task-answer-feedback');
            var attemptsEl = block.querySelector('.task-answer-attempts');
            var selectedGap = null;

            function updateAttemptsDisplay() {
                if (attemptsEl) attemptsEl.textContent = attemptsLeft + '/' + maxAttempts;
                if (attemptsLeft <= 0) block.classList.add('no-attempts');
            }

            function setFeedback(text, isCorrect) {
                if (!feedbackEl) return;
                feedbackEl.textContent = text;
                feedbackEl.className = 'task-answer-feedback' + (isCorrect ? ' correct' : ' wrong');
            }

            function clearSelection() {
                selectedGap = null;
                selectedWord = null;
                block.querySelectorAll('.task-fill-gap').forEach(function (g) { g.classList.remove('selected'); });
                block.querySelectorAll('.task-fill-word').forEach(function (w) { w.classList.remove('selected'); });
            }

            function getGapValue(gap) {
                return (gap.getAttribute('data-filled') || '').trim().toLowerCase();
            }

            function isAllFilled() {
                for (var i = 0; i < gaps.length; i++) {
                    if (!getGapValue(gaps[i])) return false;
                }
                return true;
            }

            function markGapsCorrectWrong() {
                for (var j = 0; j < gaps.length; j++) {
                    var g = gaps[j];
                    var correctVal = (g.getAttribute('data-correct') || '').trim().toLowerCase();
                    var filledVal = getGapValue(g);
                    g.classList.remove('gap-correct', 'gap-wrong');
                    if (filledVal === correctVal) {
                        g.classList.add('gap-correct');
                    } else {
                        g.classList.add('gap-wrong');
                    }
                }
            }

            function checkAnswer() {
                if (!isAllFilled()) {
                    setFeedback('Doplň všechny mezery.', false);
                    return;
                }
                var allCorrect = true;
                for (var j = 0; j < gaps.length; j++) {
                    var correct = (gaps[j].getAttribute('data-correct') || '').trim().toLowerCase();
                    if (getGapValue(gaps[j]) !== correct) {
                        allCorrect = false;
                        break;
                    }
                }
                if (allCorrect) {
                    block.classList.add('solved');
                    markGapsCorrectWrong();
                    if (submitBtn) submitBtn.disabled = true;
                    clearSelection();
                    setFeedback('Správně!', true);
                    return;
                }
                markGapsCorrectWrong();
                attemptsLeft--;
                updateAttemptsDisplay();
                if (attemptsLeft <= 0) {
                    if (submitBtn) submitBtn.disabled = true;
                    setFeedback('Vyčerpal jsi všechny pokusy.', false);
                } else {
                    setFeedback('Některé odpovědi jsou špatně. Oprav červené a zkus znovu. Zbývá ' + attemptsLeft + ' pokusů.', false);
                }
            }

            function placeWordInGap(gap, wordEl) {
                var value = wordEl.getAttribute('data-value') || '';
                gap.textContent = value;
                gap.setAttribute('data-filled', value);
                gap.classList.add('filled');
                gap.classList.remove('selected', 'gap-wrong');
                wordEl.classList.add('used');
                wordEl.classList.remove('selected');
                selectedGap = null;
                selectedWord = null;
            }

            gaps.forEach(function (gap) {
                gap.addEventListener('click', function () {
                    if (gap.classList.contains('gap-correct')) return;
                    if (gap.classList.contains('filled')) {
                        var value = gap.getAttribute('data-filled') || '';
                        gap.textContent = '';
                        gap.removeAttribute('data-filled');
                        gap.classList.remove('filled', 'gap-wrong');
                        if (value) {
                            var usedWord = block.querySelector('.task-fill-word.used[data-value="' + value + '"]');
                            if (usedWord) usedWord.classList.remove('used');
                        }
                        clearSelection();
                        return;
                    }
                    if (selectedWord) {
                        placeWordInGap(gap, selectedWord);
                        gap.classList.remove('gap-wrong');
                        return;
                    }
                    clearSelection();
                    selectedGap = gap;
                    gap.classList.add('selected');
                });
            });

            words.forEach(function (wordEl) {
                wordEl.addEventListener('click', function () {
                    if (wordEl.classList.contains('used')) return;
                    if (selectedGap) {
                        placeWordInGap(selectedGap, wordEl);
                        return;
                    }
                    clearSelection();
                    selectedWord = wordEl;
                    wordEl.classList.add('selected');
                });
            });

            updateAttemptsDisplay();
            if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
