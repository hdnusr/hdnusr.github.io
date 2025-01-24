// ============================
//  HTML Definitions
// ============================

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const finalScore = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const nextCanvas = document.getElementById('next-canvas');
const nextContext = nextCanvas.getContext('2d');

// ============================
//  Canvas Definitions
// ============================

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
let board = Array.from({
	    length: ROWS
    }, () => Array(COLUMNS).fill(null));

// ============================
//  Game Definitions
// ============================

let lastPieces = [];
let score = 0;
const gameSpeed = 700;
const sideToSideInterval = 100;
const COLORS = [
	'#00FFFF', // I piece - Light Blue
	'#FFD700', // O piece - Yellow
	'#00FF00', // Z piece - Red
	'#FF0000', // S piece - Green
	'#FFA500', // J piece - Blue
	'#0000FF', // L piece - Orange
	'#800080' // T piece - Purple
];

const tetrominos = [
	[
		[1, 1, 1, 1]
	], // I
	[
		[1, 1],
		[1, 1]
	], // O
	[
		[1, 1, 0],
		[0, 1, 1]
	], // Z
	[
		[0, 1, 1],
		[1, 1, 0]
	], // S
	[
		[1, 0, 0],
		[1, 1, 1]
	], // J
	[
		[0, 0, 1],
		[1, 1, 1]
	], // L
	[
		[0, 1, 0],
		[1, 1, 1]
	], // T
];

// ============================
//  Key Definitions
// ============================

let isSKeyPressed = false;
let fastFallInterval = null;
let isLeftKeyPressed = false;
let isRightKeyPressed = false;
let moveLeftInterval = null;
let moveRightInterval = null;

// ============================
//  Undefined Definitions
// ============================
let currentPiece, currentPosition, nextPiece, gameInterval, isGameOver = false,
	isPaused = false;

// ============================
//  Game Sound Definitions
// ============================

const lineClearSound = new Audio('./audio/cleared.wav');
const placeSound = new Audio('./audio/place.wav');
const musicTracks = [
	new Audio('./audio/gamemusic1.mp3'),
	new Audio('./audio/gamemusic2.mp3'),
	new Audio('./audio/gamemusic3.mp3'),
	new Audio('./audio/gamemusic4.mp3'),
	new Audio('./audio/gamemusic5.mp3'),
	new Audio('./audio/gamemusic6.mp3'),
	new Audio('./audio/gamemusic7.mp3'),
	new Audio('./audio/gamemusic8.mp3'),
	new Audio('./audio/gamemusic9.mp3'),
	new Audio('./audio/gamemusic10.mp3'),
	new Audio('./audio/gamemusic11.mp3'),
	new Audio('./audio/gamemusic12.mp3'),
	new Audio('./audio/gamemusic13.mp3'),
	new Audio('./audio/gamemusic14.mp3'),
	new Audio('./audio/gamemusic15.mp3'),
	new Audio('./audio/gamemusic16.mp3'),
	new Audio('./audio/gamemusic17.mp3'),
	new Audio('./audio/gamemusic18.mp3'),
	new Audio('./audio/gamemusic19.mp3'),
];

// ============================
//  Music
// ============================
let currentMusic;

musicTracks.forEach(track => {
	track.loop = true;
	track.volume = 0.5;
});

// ============================
//  Functions
// ============================

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    isGameOver = false;
    isPaused = false;
    lastPieces = [];
    nextPiece = generateRandomPiece(); // Initialize next piece
    spawnPiece();
    gameInterval = setInterval(update, gameSpeed);

    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    startScreen.style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    currentMusic = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    currentMusic.currentTime = 0;
    currentMusic.play();
}

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
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

	currentPiece.shape.forEach((row, rIndex) => {
		row.forEach((cell, cIndex) => {
			if (cell) {
				context.fillStyle = currentPiece.color;
				context.fillRect((currentPosition.x + cIndex) * BLOCK_SIZE, (currentPosition.y + rIndex) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			}
		});
	});
}

function generateRandomPiece() {
	let randomIndex;
	let count = 0;

	do {
		randomIndex = Math.floor(Math.random() * tetrominos.length);
		count = lastPieces.filter(index => index === randomIndex).length;
	} while (count >= 2);

	lastPieces.push(randomIndex);
	if (lastPieces.length > 3) {
		lastPieces.shift();
	}

	return {
		shape: tetrominos[randomIndex],
		color: COLORS[randomIndex],
	};
}

function spawnPiece() {
    currentPiece = nextPiece; // Use the current 'nextPiece'
    currentPosition = { x: 4, y: 0 };

    // Generate the new 'nextPiece'
    nextPiece = generateRandomPiece();

    // Check for game over
    if (!canMove(0, 0)) {
        gameOver();
    }

    // Update the next piece display
    drawNextPiece();
}

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

function movePiece(dir) {
	if (canMove(dir, 0)) {
		currentPosition.x += dir;
	}
}

function rotatePiece() {
	const rotatedShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map(row => row[index])).reverse();
	const backupShape = currentPiece.shape;
	currentPiece.shape = rotatedShape;
	if (!canMove(0, 0)) {
		currentPiece.shape = backupShape;
	}
}

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
	placeSound.currentTime = 0;
	placeSound.play();
}

function checkForLines() {
	let linesCleared = 0;

	for (let row = ROWS - 1; row >= 0; row--) {
		if (board[row].every(cell => cell)) {
			board.splice(row, 1);
			board.unshift(Array(COLUMNS).fill(null));
			linesCleared++;
			row++;
		}
	}

	if (linesCleared > 0) {
		lineClearSound.currentTime = 0;
		lineClearSound.play();

		score += linesCleared * 100;
		document.getElementById('score').textContent = `Score: ${score}`;
	}
}

function gameOver() {
	isGameOver = true;
	clearInterval(gameInterval);
	showGameOverScreen();

	if (currentMusic) {
		currentMusic.pause();
		currentMusic.currentTime = 0;
	}
}

function showGameOverScreen() {
	gameOverScreen.style.display = 'flex';
	finalScore.textContent = `Score: ${score}`;
	document.getElementById('game-container').style.display = 'none';
}

function showPauseScreen() {
	pauseScreen.style.display = 'flex';
	document.getElementById('game-container').style.display = 'none';
}

function update() {
	if (!isGameOver && !isPaused) {
		moveDown();
		draw();
	}
}

function hardDrop() {
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
    draw();
}
function drawNextPiece() {
    // Clear the next piece canvas
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    // Determine scaling for smaller tetrominos
    const scale = BLOCK_SIZE * 0.8;

    // Center the piece in the canvas
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * scale) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * scale) / 2;

    // Draw the next piece
    nextPiece.shape.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell) {
                nextContext.fillStyle = nextPiece.color;
                nextContext.fillRect(
                    offsetX + cIndex * scale,
                    offsetY + rIndex * scale,
                    scale,
                    scale
                );
            }
        });
    });
}


// ============================
//  Key Listener
// ============================

document.addEventListener('keydown', event => {
    if (event.key === 'e') {
        if (!isGameOver && startScreen.style.display === 'none') {
            isPaused = !isPaused;
            if (isPaused) {
                showPauseScreen();
            } else {
                pauseScreen.style.display = 'none';
                document.getElementById('game-container').style.display = 'block';
            }
        }
        return;
    }

    if (event.key === 'r') {
        location.reload();
        return;
    }
    if (isGameOver || isPaused) return;

    if (event.key === 's') {
        if (!isSKeyPressed) {
            isSKeyPressed = true;
            fastFallInterval = setInterval(() => {
                moveDown();
                draw();
            }, 50);
        }
    } else if (event.key === 'a') {
        if (!isLeftKeyPressed) {
            isLeftKeyPressed = true;
            moveLeftInterval = setInterval(() => {
                movePiece(-1);
                draw();
            }, sideToSideInterval); // Adjust interval for desired speed
        }
    } else if (event.key === 'd') {
        if (!isRightKeyPressed) {
            isRightKeyPressed = true;
            moveRightInterval = setInterval(() => {
                movePiece(1);
                draw();
            }, sideToSideInterval); // Adjust interval for desired speed
        }
    } else if (event.key === 'w') {
        rotatePiece();
        draw();
    } else if (event.key === 'q') {
        hardDrop();
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 's') {
        isSKeyPressed = false;
        clearInterval(fastFallInterval);
    } else if (event.key === 'a') {
        isLeftKeyPressed = false;
        clearInterval(moveLeftInterval);
    } else if (event.key === 'd') {
        isRightKeyPressed = false;
        clearInterval(moveRightInterval);
    }
});

// ============================
//  Event Listeners
// ============================

startBtn.addEventListener('click', () => {
	resetGame();
});
