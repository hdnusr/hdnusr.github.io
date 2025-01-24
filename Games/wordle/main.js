const board = document.getElementById('board');
        let word = '';
        let currentRow = 0;
        let currentGuess = '';

        async function fetchWord() {
            const response = await fetch('words.txt');
            const text = await response.text();
            const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5);
            word = words[Math.floor(Math.random() * words.length)];
        }

        function createBoard() {
            board.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.id = `tile-${i}`;
                board.appendChild(tile);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (currentRow >= 6 || !word) return;

            const key = e.key.toUpperCase();
            if (key.match(/[A-Z]/) && key.length === 1 && currentGuess.length < 5) {
                currentGuess += key;
                updateBoard();
            } else if (key === 'BACKSPACE' && currentGuess.length > 0) {
                currentGuess = currentGuess.slice(0, -1);
                updateBoard();
            } else if (key === 'ENTER' && currentGuess.length === 5) {
                checkGuess();
            }
        });

        function updateBoard() {
            for (let i = 0; i < 5; i++) {
                const tile = document.getElementById(`tile-${currentRow * 5 + i}`);
                tile.textContent = currentGuess[i] || '';
            }
        }

        function checkGuess() {
            let correctCount = 0;

            for (let i = 0; i < 5; i++) {
                const tile = document.getElementById(`tile-${currentRow * 5 + i}`);
                const letter = currentGuess[i];

                if (letter === word[i]) {
                    tile.classList.add('correct');
                    correctCount++;
                } else if (word.includes(letter)) {
                    tile.classList.add('present');
                } else {
                    tile.classList.add('absent');
                }
            }
            
            if (correctCount === 5) {
                showCustomAlert(`Congratulations! You guessed the word: ${word}`);
            } else {
                currentRow++;
                currentGuess = '';
                if (currentRow === 6) {
                    showEndMessage(`The correct word was: ${word}`);
                }
            }
        }

        function showCustomAlert(message) {
            const alertBox = document.createElement('div');
            alertBox.style.position = 'absolute';
            alertBox.style.top = '50%';
            alertBox.style.left = '50%';
            alertBox.style.transform = 'translate(-50%, -50%)';
            alertBox.style.background = 'white';
            alertBox.style.padding = '20px';
            alertBox.style.border = '2px solid #ccc';
            alertBox.style.fontSize = '20px';
            alertBox.style.textAlign = 'center';
            alertBox.textContent = message;
            document.body.appendChild(alertBox);

            setTimeout(() => {
                alertBox.remove();
                resetGame();
            }, 5000);
        }

        function showEndMessage(message) {
            const endMessage = document.createElement('div');
            endMessage.style.position = 'absolute';
            endMessage.style.top = '50%';
            endMessage.style.left = '50%';
            endMessage.style.transform = 'translate(-50%, -50%)';
            endMessage.style.background = 'white';
            endMessage.style.padding = '20px';
            endMessage.style.border = '2px solid #ccc';
            endMessage.style.fontSize = '20px';
            endMessage.style.textAlign = 'center';
            endMessage.textContent = message;
            document.body.appendChild(endMessage);

            setTimeout(() => {
                endMessage.remove();
                resetGame();
            }, 5000);
        }

        function resetGame() {
            currentRow = 0;
            currentGuess = '';
            fetchWord().then(createBoard);
        }

        fetchWord().then(createBoard);