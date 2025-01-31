// Get the canvas element and its context
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Create the left paddle (player-controlled)
const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

// Create the right paddle (AI-controlled or player-controlled)
const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4 // Computer speed, will be used only in 1-player mode
};

// Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speedX: 5,
    speedY: 5,
    dx: 5,
    dy: 5
};

// Score variables
let leftScore = 0;
let rightScore = 0;

// Control paddles using keys
const keys = {
    up: 38,
    down: 40,
    w: 87,
    s: 83,
    q: 81,  // Key for pause (Q)
    e: 69,  // Key for switching game mode (E)
    r: 82,  // Key for resetting the game (R)
    space: 32 // Key for continuing after a score (SPACE)
};

// Game state
let isPaused = false;
let isOnePlayerMode = true;  // Default is 1-player mode
let waitingForSpace = false; // Flag to wait for Space key after a score

// Draw the paddles
function drawPaddle(paddle) {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw the ball
function drawBall() {
    ctx.fillStyle = 'white';
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

// Draw the score
function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Player: ' + leftScore, 50, 50);
    // If in 2-player mode, label Player 2 instead of Computer
    if (isOnePlayerMode) {
        ctx.fillText('Computer: ' + rightScore, canvas.width - 200, 50);  // Change 'AI' to 'Computer'
    } else {
        ctx.fillText('Player 2: ' + rightScore, canvas.width - 200, 50);  // Change 'AI' to 'Player 2'
    }
}

// Draw the paused screen
function drawPausedScreen() {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('PAUSED', canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Q to Resume', canvas.width / 2 - 90, canvas.height / 2 + 40);
    ctx.fillText('Press E to Change Mode', canvas.width / 2 - 100, canvas.height / 2 + 80);
    ctx.fillText('Press R to Reset Game', canvas.width / 2 - 100, canvas.height / 2 + 120); // New message
}

// Draw the "Press SPACE to Continue" prompt
function drawSpacePrompt() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Press SPACE to Continue', canvas.width / 2 - 160, canvas.height / 2);
}

// Draw the game mode
function drawGameMode() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    if (isOnePlayerMode) {
        ctx.fillText('1-Player Mode', canvas.width / 2 - 80, 30);
    } else {
        ctx.fillText('2-Player Mode', canvas.width / 2 - 80, 30);
    }
}

// Move paddles
function movePaddles() {
    // Move left paddle (player-controlled)
    leftPaddle.y += leftPaddle.dy;

    // Move right paddle (Computer-controlled in 1-player mode, player-controlled in 2-player mode)
    if (isOnePlayerMode) {
        // Simple Computer AI: Move towards the ball
        if (rightPaddle.y + rightPaddle.height / 2 < ball.y) {
            rightPaddle.y += rightPaddle.speed;
        } else if (rightPaddle.y + rightPaddle.height / 2 > ball.y) {
            rightPaddle.y -= rightPaddle.speed;
        }
    } else {
        // In 2-player mode, right paddle is controlled by the second player
        rightPaddle.y += rightPaddle.dy;
    }

    // Prevent paddles from going out of bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;

    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collision with left paddle
    if (
        ball.x < leftPaddle.x + leftPaddle.width && 
        ball.y + ball.size > leftPaddle.y && 
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.dx = -ball.dx;

        // Add random angle to the ball's direction after hitting left paddle
        ball.dy += (Math.random() - 0.5) * 5;  // Randomize vertical speed within a range
    }

    // Ball collision with right paddle
    if (
        ball.x + ball.size > rightPaddle.x && 
        ball.y + ball.size > rightPaddle.y && 
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.dx = -ball.dx;

        // Add random angle to the ball's direction after hitting right paddle
        ball.dy += (Math.random() - 0.5) * 5;  // Randomize vertical speed within a range
    }

    // Ball out of bounds (score)
    if (ball.x < 0) {
        // Computer scores in 1-player mode
        rightScore++;
        resetBall();
        waitingForSpace = true;  // Wait for Space to continue
    }

    if (ball.x + ball.size > canvas.width) {
        // Player scores
        leftScore++;
        resetBall();
        waitingForSpace = true;  // Wait for Space to continue
    }
}
// Reset ball to center after a point
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5;
    ball.dy = 5;
}

// Update game elements
function update() {
    if (!isPaused && !waitingForSpace) {
        movePaddles();
        moveBall();
    }
}

// Draw all game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (isPaused) {
        drawPausedScreen(); // Show paused screen
    } else {
        drawPaddle(leftPaddle);
        drawPaddle(rightPaddle);
        drawBall();
        drawScore();
        drawGameMode();  // Display the current game mode
        if (waitingForSpace) {
            drawSpacePrompt(); // Display space prompt
        }
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.keyCode === keys.w) leftPaddle.dy = -leftPaddle.speed;
    if (e.keyCode === keys.s) leftPaddle.dy = leftPaddle.speed;
    if (e.keyCode === keys.up) rightPaddle.dy = -rightPaddle.speed;
    if (e.keyCode === keys.down) rightPaddle.dy = rightPaddle.speed;
    if (e.keyCode === keys.q) togglePause(); // Pause on 'Q'
    if (e.keyCode === keys.e && isPaused) toggleGameMode(); // Switch game mode only when paused
    if (e.keyCode === keys.r && (isPaused || waitingForSpace)) resetGame(); // Reset game on 'R' when paused or waiting for space
    if (e.keyCode === keys.space && waitingForSpace) {
        waitingForSpace = false; // Continue after pressing SPACE
    }
});

document.addEventListener('keyup', (e) => {
    if (e.keyCode === keys.w || e.keyCode === keys.s) leftPaddle.dy = 0;
    if (e.keyCode === keys.up || e.keyCode === keys.down) rightPaddle.dy = 0;
});

// Toggle the pause state
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) waitingForSpace = false; // Ensure the game doesn't wait for space while paused
}

// Toggle game mode between 1-player and 2-player
function toggleGameMode() {
    isOnePlayerMode = !isOnePlayerMode;
    resetGame(); // Reset the game when changing modes
}

// Reset the game (scores, ball position)
function resetGame() {
    leftScore = 0;
    rightScore = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5;
    ball.dy = 5;
    if (isOnePlayerMode) {
        rightPaddle.y = canvas.height / 2 - paddleHeight / 2; // Reset Computer position
    } else {
        rightPaddle.y = canvas.height / 2 - paddleHeight / 2; // Reset 2-player right paddle
    }
    waitingForSpace = false;  // Stop waiting for space after reset
}

// Start the game
gameLoop();
