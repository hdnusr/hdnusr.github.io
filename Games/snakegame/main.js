const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

const CELL_SIZE = 20;
let snake = [{ x: 300, y: 300 }];
let direction = { x: 0, y: 0 };
let food = getValidFoodPosition();
let score = 0;
let gameOver = false;

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * canvas.width / CELL_SIZE) * CELL_SIZE,
        y: Math.floor(Math.random() * canvas.height / CELL_SIZE) * CELL_SIZE
    };
}

function getValidFoodPosition() {
    let position;
    do {
        position = getRandomPosition();
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
}

function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return;

    const newHead = {
        x: snake[0].x + direction.x * CELL_SIZE,
        y: snake[0].y + direction.y * CELL_SIZE
    };

    if (checkCollision(newHead)) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        if (snake.length === (canvas.width / CELL_SIZE) * (canvas.height / CELL_SIZE)) {
            winGame();
            return;
        }
        food = getValidFoodPosition();
    } else {
        snake.pop();
    }
}

function checkCollision(newHead) {
    return (
        newHead.x < 0 || newHead.x >= canvas.width ||
        newHead.y < 0 || newHead.y >= canvas.height ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    );
}

function endGame() {
    gameOver = true;
    finalScore.textContent = `Final Score: ${score}`;
    gameOverScreen.style.display = "block";
}

function winGame() {
    gameOver = true;
    finalScore.textContent = `You Win! Final Score: ${score}`;
    gameOverScreen.style.display = "block";
}

function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    moveSnake();
    drawSnake();
}

function restartGame() {
    location.reload();
}

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

setInterval(gameLoop, 100);
