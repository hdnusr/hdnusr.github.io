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
const COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#FF0000', '#00FF00', '#0000FF', '#FFA500'];

const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
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

// Spawn a new tetromino
function spawnPiece() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
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

// Handle keyboard input
document.addEventListener('keydown', event => {
    if (isGameOver || isPaused) return; // Don't accept input if game is over or paused
    if (event.key === 'a') {
        movePiece(-1);
    } else if (event.key === 'd') {
        movePiece(1);
    } else if (event.key === 's') {
        // Make the piece drop instantly when down arrow is pressed
        while (canMove(0, 1)) {
            currentPosition.y++;
        }
        placePiece();
        checkForLines();
        if (isGameOver) {
            clearInterval(gameInterval);
            showGameOverScreen();
        } else {
            spawnPiece();
        }
        draw(); // Redraw the board after instant drop
    } else if (event.key === 'w') {
        rotatePiece();
    }
});

// Pause button click handler
pauseBtn.addEventListener('click', () => {
    isPaused = true;
    showPauseScreen();
});

// Resume button click handler
resumeBtn.addEventListener('click', () => {
    isPaused = false;
    pauseScreen.style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});

// Restart button click handler
restartBtn.addEventListener('click', () => {
    resetGame();
});

// Start button click handler (Start Game)
startBtn.addEventListener('click', () => {
    resetGame();
});