const sudokuGrid = document.getElementById('sudoku-grid');
    const timerElement = document.getElementById('timer');
    const endScreen = document.getElementById('end-screen');

    function createGrid() {
      for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.pattern = "[1-9]";
        input.oninput = (e) => {
          if (!/^[1-9]?$/.test(e.target.value)) {
            e.target.value = '';
          }
        };

        cell.appendChild(input);
        sudokuGrid.appendChild(cell);
      }
    }

    function checkSudoku() {
      const cells = document.querySelectorAll('.cell input');
      const grid = Array.from(cells).map((cell) => parseInt(cell.value) || 0);

      const isValid = (arr) => new Set(arr.filter((n) => n !== 0)).size === arr.filter((n) => n !== 0).length;

      const checkRows = () => {
        for (let i = 0; i < 9; i++) {
          const row = grid.slice(i * 9, i * 9 + 9);
          if (!isValid(row)) return false;
        }
        return true;
      };

      const checkCols = () => {
        for (let i = 0; i < 9; i++) {
          const col = grid.filter((_, idx) => idx % 9 === i);
          if (!isValid(col)) return false;
        }
        return true;
      };

      const checkBoxes = () => {
        const boxIndices = [
          [0, 1, 2, 9, 10, 11, 18, 19, 20],
          [3, 4, 5, 12, 13, 14, 21, 22, 23],
          [6, 7, 8, 15, 16, 17, 24, 25, 26],
          [27, 28, 29, 36, 37, 38, 45, 46, 47],
          [30, 31, 32, 39, 40, 41, 48, 49, 50],
          [33, 34, 35, 42, 43, 44, 51, 52, 53],
          [54, 55, 56, 63, 64, 65, 72, 73, 74],
          [57, 58, 59, 66, 67, 68, 75, 76, 77],
          [60, 61, 62, 69, 70, 71, 78, 79, 80]
        ];

        return boxIndices.every((indices) => isValid(indices.map((i) => grid[i])));
      };

      const allFilled = grid.every((value) => value !== 0);

      if (allFilled && checkRows() && checkCols() && checkBoxes()) {
        endScreen.classList.add('active');
      } else {
        alert('Sudoku is invalid or not fully filled!');
      }
    }

    function startTimer() {
      let seconds = 0;
      let minutes = 0;

      setInterval(() => {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
        }

        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerElement.textContent = `Time: ${formattedTime}`;
      }, 1000);
    }

    function resetGame() {
      const inputs = document.querySelectorAll('.cell input');
      inputs.forEach(input => input.value = '');
      endScreen.classList.remove('active');
    }

    document.getElementById('check-sudoku').addEventListener('click', checkSudoku);

    createGrid();
    startTimer();