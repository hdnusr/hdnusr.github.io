// Tetris variables and settings
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const resumeBtn = document.getElementById('resume-btn');
const pauseBtn = document.getElementById('pause-btn');
const startBtn = document.getElementById('start-btn');

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const COLORS = [
    '#00FFFF', // I piece - Light Blue
    '#FFD700', // O piece - Yellow
    '#00FF00', // Z piece - Red
    '#FF0000', // S piece - Green
    '#FFA500', // J piece - Blue
    '#0000FF', // L piece - Orange
    '#800080'  // T piece - Purple
];

const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]], // L
    [[0, 1, 0], [1, 1, 1]], // T
];

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
let currentPiece, currentPosition, gameInterval, isGameOver = false, isPaused = false;
let score = 0;
let gameSpeed = 500;  // Start speed (500ms per frame)

// Initialize the game
function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    gameSpeed = 500; // Reset speed
    isGameOver = false;
    isPaused = false;
    spawnPiece();
    gameInterval = setInterval(update, gameSpeed);

    // Hide the Game Over and Pause screens
    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    startScreen.style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
}

// Draw the game board and active pieces
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board grid
    context.strokeStyle = '#444';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            if (board[row][col]) {
                context.fillStyle = board[row][col];
                context.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
            context.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    // Draw the current piece
    currentPiece.shape.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell) {
                context.fillStyle = currentPiece.color;
                context.fillRect((currentPosition.x + cIndex) * BLOCK_SIZE, (currentPosition.y + rIndex) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

let lastPieces = []; // Track the last two pieces

// Spawn a new tetromino
function spawnPiece() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * tetrominos.length);
    } while (lastPieces.includes(randomIndex) && lastPieces.filter(i => i === randomIndex).length >= 2);

    // Update the lastPieces array
    lastPieces.push(randomIndex);
    if (lastPieces.length > 2) {
        lastPieces.shift(); // Keep only the last two pieces
    }

    currentPiece = {
        shape: tetrominos[randomIndex],
        color: COLORS[randomIndex],
    };
    currentPosition = { x: 4, y: 0 };

    // Check if the new piece collides with the top of the board
    if (!canMove(0, 0)) {
        gameOver();
    }
}

// Move the current piece down by one block
function moveDown() {
    if (canMove(0, 1)) {
        currentPosition.y++;
    } else {
        placePiece();
        checkForLines();
        if (isGameOver) {
            clearInterval(gameInterval);
            showGameOverScreen();
        } else {
            spawnPiece();
        }
    }
}

// Move the current piece left or right
function movePiece(dir) {
    if (canMove(dir, 0)) {
        currentPosition.x += dir;
    }
}

// Rotate the current piece
function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map(row => row[index])).reverse();
    const backupShape = currentPiece.shape;
    currentPiece.shape = rotatedShape;
    if (!canMove(0, 0)) {
        currentPiece.shape = backupShape;
    }
}

// Check if the piece can move to a specific position
function canMove(dx, dy) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const newX = currentPosition.x + col + dx;
                const newY = currentPosition.y + row + dy;
                if (newX < 0 || newX >= COLUMNS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Place the piece on the board
function placePiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const newY = currentPosition.y + row;
                const newX = currentPosition.x + col;
                if (newY >= 0) {
                    board[newY][newX] = currentPiece.color;
                }
            }
        }
    }
}

// Check for completed lines
function checkForLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell)) {
            board.splice(row, 1);
            board.unshift(Array(COLUMNS).fill(null));
            score += 100;
            document.getElementById('score').textContent = `Score: ${score}`;
        }
    }

    // Increase game speed every 5 lines cleared
    
}

// Handle the game over state
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    showGameOverScreen();
}

// Show the Game Over screen
function showGameOverScreen() {
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = `Score: ${score}`;
    document.getElementById('game-container').style.display = 'none';
}

// Show the Pause screen
function showPauseScreen() {
    pauseScreen.style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';
}

// Update the game state
function update() {
    if (!isGameOver && !isPaused) {
        moveDown();
        draw();
    }
}

let isSKeyPressed = false; // To track if the 'S' key is being held
let fastFallInterval = null; // To store the interval for faster fall

// Handle keyboard input
document.addEventListener('keydown', event => {
    if (event.key === 'q') {
        if (!isGameOver) {
            isPaused = !isPaused;
            if (isPaused) {
                showPauseScreen();
            } else {
                pauseScreen.style.display = 'none';
                document.getElementById('game-container').style.display = 'block';
            }
        }
        return; // No further actions if "q" is pressed
    }

    if (event.key === 'e') {
        resetGame();
        return; // No further actions if "e" is pressed
    }

    if (isGameOver || isPaused) return; // Don't accept input if game is over or paused
    
    if (event.key === 's') {
        // Start faster fall when 'S' is pressed
        if (!isSKeyPressed) {
            isSKeyPressed = true;
            fastFallInterval = setInterval(() => {
                moveDown();
                draw(); // Redraw the board after the move
            }, 50); // Adjust this interval to control the speed (lower = faster)
        }
    } else if (event.key === 'a') {
        movePiece(-1);
    } else if (event.key === 'd') {
        movePiece(1);
    } else if (event.key === 'w') {
        rotatePiece();
    }
});

// Stop faster fall when 'S' key is released
document.addEventListener('keyup', event => {
    if (event.key === 's') {
        isSKeyPressed = false;
        clearInterval(fastFallInterval); // Stop the fast fall interval
    }
});


// Start button click handler (Start Game)
startBtn.addEventListener('click', () => {
    resetGame();
});