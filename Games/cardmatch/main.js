const gameContainer = document.getElementById('gameContainer');
        const winScreen = document.getElementById('winScreen');
        const timeTakenElement = document.getElementById('timeTaken');
        const cardValues = Array.from({ length: 10 }, (_, i) => i + 1).flatMap(x => [x, x]);
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        let matchedCount = 0;
        let startTime;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function createCard(value) {
            const card = document.createElement('div');
            card.classList.add('card', 'hidden');
            card.dataset.value = value;
            card.textContent = value;

            card.addEventListener('click', () => {
                if (lockBoard || card.classList.contains('matched') || card === firstCard) return;

                card.classList.remove('hidden');

                if (!firstCard) {
                    firstCard = card;
                } else {
                    secondCard = card;
                    checkMatch();
                }
            });

            return card;
        }

        function checkMatch() {
            lockBoard = true;
            const isMatch = firstCard.dataset.value === secondCard.dataset.value;

            if (isMatch) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                matchedCount += 2;
                if (matchedCount === cardValues.length) {
                    showWinScreen();
                }
                resetTurn();
            } else {
                setTimeout(() => {
                    firstCard.classList.add('hidden');
                    secondCard.classList.add('hidden');
                    resetTurn();
                }, 1000);
            }
        }

        function resetTurn() {
            [firstCard, secondCard] = [null, null];
            lockBoard = false;
        }

        function showWinScreen() {
            const endTime = new Date();
            const timeTaken = Math.floor((endTime - startTime) / 1000);
            timeTakenElement.textContent = `Time Taken: ${timeTaken} seconds`;
            winScreen.classList.add('visible');
        }

        function initializeGame() {
            shuffle(cardValues);
            cardValues.forEach(value => {
                const card = createCard(value);
                gameContainer.appendChild(card);
            });
            startTime = new Date();
        }

        initializeGame();