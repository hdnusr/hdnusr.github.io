// ============================
//  Game Settings
// ============================

const paddlespeed = 4;
const ballspeed = 5;
const aiPaddleSpeed = 3.5; // Reduced speed for AI paddle

// ============================
//  Declaring variables
// ============================

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: paddlespeed
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: paddlespeed // Use normal speed for player 2
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speedX: ballspeed,
    speedY: ballspeed,
    dx: ballspeed,
    dy: ballspeed 
};

let leftScore = 0;
let rightScore = 0;

const keys = {
    up: 38,
    down: 40,
    w: 87,
    s: 83,
    q: 81,
    e: 69,
    r: 82,
    space: 32
};

let isPaused = false;
let isOnePlayerMode = true;
let waitingForSpace = false;

// ============================
//  Functions
// ============================

function drawPaddle(paddle) {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = 'white';
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Player: ' + leftScore, 50, 50);
    if (isOnePlayerMode) {
        ctx.fillText('Computer: ' + rightScore, canvas.width - 200, 50);
    } else {
        ctx.fillText('Player 2: ' + rightScore, canvas.width - 200, 50);
    }
}

function drawPausedScreen() {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('PAUSED', canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Q to Resume', canvas.width / 2 - 90, canvas.height / 2 + 40);
    ctx.fillText('Press E to Change Mode', canvas.width / 2 - 100, canvas.height / 2 + 80);
    ctx.fillText('Press R to Reset Game', canvas.width / 2 - 100, canvas.height / 2 + 120);
}

function drawSpacePrompt() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Press SPACE to Continue', canvas.width / 2 - 160, canvas.height / 2);
}

function drawGameMode() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    if (isOnePlayerMode) {
        ctx.fillText('1-Player Mode', canvas.width / 2 - 80, 30);
    } else {
        ctx.fillText('2-Player Mode', canvas.width / 2 - 80, 30);
    }
}

function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    if (isOnePlayerMode) {
        if (rightPaddle.y + rightPaddle.height / 2 < ball.y) {
            rightPaddle.y += aiPaddleSpeed;
        } else if (rightPaddle.y + rightPaddle.height / 2 > ball.y) {
            rightPaddle.y -= aiPaddleSpeed;
        }
    } else {
        rightPaddle.y += rightPaddle.dy;
    }
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.y < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
    }
    if (
        ball.x < leftPaddle.x + leftPaddle.width && 
        ball.y + ball.size > leftPaddle.y && 
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.dy += (Math.random() - 0.5) * 5;
    }
    if (
        ball.x + ball.size > rightPaddle.x && 
        ball.y + ball.size > rightPaddle.y && 
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.dy += (Math.random() - 0.5) * 5;
    }
    if (ball.x < 0) {
        rightScore++;
        resetBall();
        waitingForSpace = true;
    }
    if (ball.x + ball.size > canvas.width) {
        leftScore++;
        resetBall();
        waitingForSpace = true;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballspeed;
    ball.dy = ballspeed;
}

function update() {
    if (!isPaused && !waitingForSpace) {
        movePaddles();
        moveBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isPaused) {
        drawPausedScreen();
    } else {
        drawPaddle(leftPaddle);
        drawPaddle(rightPaddle);
        drawBall();
        drawScore();
        drawGameMode();
        if (waitingForSpace) {
            drawSpacePrompt();
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) waitingForSpace = false;
}

function toggleGameMode() {
    isOnePlayerMode = !isOnePlayerMode;
    resetGame();
}

function resetGame() {
    leftScore = 0;
    rightScore = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballspeed;
    ball.dy = ballspeed; 
    if (isOnePlayerMode) {
        rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
    } else {
        rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
    }
    waitingForSpace = false;
}

// ============================
//  Key Listeners
// ============================

document.addEventListener('keyup', (e) => {
    if (e.keyCode === keys.w || e.keyCode === keys.s) leftPaddle.dy = 0;
    if (e.keyCode === keys.up || e.keyCode === keys.down) rightPaddle.dy = 0;
});

document.addEventListener('keydown', (e) => {
    if (e.keyCode === keys.w) leftPaddle.dy = -leftPaddle.speed;
    if (e.keyCode === keys.s) leftPaddle.dy = leftPaddle.speed;
    if (e.keyCode === keys.up && !isOnePlayerMode) rightPaddle.dy = -rightPaddle.speed;
    if (e.keyCode === keys.down && !isOnePlayerMode) rightPaddle.dy = rightPaddle.speed;
    if (e.keyCode === keys.q) togglePause();
    if (e.keyCode === keys.e && isPaused) toggleGameMode();
    if (e.keyCode === keys.r && (isPaused || waitingForSpace)) resetGame();
    if (e.keyCode === keys.space && waitingForSpace) {
        waitingForSpace = false;
    }
});

// ============================
//  Run Functions
// ============================
gameLoop();
