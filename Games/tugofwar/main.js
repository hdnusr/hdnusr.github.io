let player1Position = 50;  // Player 1 starts on the left
let player2Position = 750; // Player 2 starts on the right
let player1Score = 0;
let player2Score = 0;
let gameWidth = 800;
let ropeCenter = gameWidth / 2;

const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const player1ScoreElem = document.getElementById("player1-score");
const player2ScoreElem = document.getElementById("player2-score");

let keyPressed = { ArrowRight: false, a: false }; // To track whether a key is being held
let lastMoveTime = { ArrowRight: 0, a: 0 }; // Track the last time a move was made for each key
let moveCooldown = 300;

function updatePositions() {
    player1.style.left = `${player1Position}px`;
    player2.style.left = `${player2Position}px`;
}

function movePlayer1() {
    let currentTime = Date.now();
    if (currentTime - lastMoveTime["ArrowRight"] >= moveCooldown) {
        if (player1Position < ropeCenter - 50) {
            player1Position += 5;
            updatePositions();
        }
        if (player1Position >= ropeCenter - 50) {
            player1Score++;
            player1ScoreElem.textContent = `Player 1: ${player1Score}`;
            resetPositions();
        }
        lastMoveTime["ArrowRight"] = currentTime; // Update last move time for Player 1
    }
}

function movePlayer2() {
    let currentTime = Date.now();
    if (currentTime - lastMoveTime["a"] >= moveCooldown) {
        if (player2Position > ropeCenter + 50) {
            player2Position -= 5;
            updatePositions();
        }
        if (player2Position <= ropeCenter + 50) {
            player2Score++;
            player2ScoreElem.textContent = `Player 2: ${player2Score}`;
            resetPositions();
        }
        lastMoveTime["a"] = currentTime; // Update last move time for Player 2
    }
}

function resetPositions() {
    // Smoothly reset player positions after a score
    setTimeout(() => {
        player1Position = 50;
        player2Position = 750;
        updatePositions();
    }, 200);
}

document.addEventListener("keydown", (event) => {
    if (!keyPressed[event.key]) { // Only respond if the key isn't already being held
        if (event.key === "ArrowRight") {
            movePlayer1();
            keyPressed["ArrowRight"] = true; // Mark that this key is being held
        }
        if (event.key === "a") {
            movePlayer2();
            keyPressed["a"] = true; // Mark that this key is being held
        }
    }
});

document.addEventListener("keyup", (event) => {
    // When the key is released, reset the tracking
    if (event.key === "ArrowRight") {
        keyPressed["ArrowRight"] = false;
    }
    if (event.key === "a") {
        keyPressed["a"] = false;
    }
});

updatePositions();
