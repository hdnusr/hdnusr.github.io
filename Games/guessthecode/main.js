// Function to generate a random 4-digit combination (0-9)
function generateCombination() {
  let combo = [];
  for (let i = 0; i < 4; i++) {
    combo.push(Math.floor(Math.random() * 10));  // Random number between 0 and 9
  }
  console.log(combo)
  return combo;
}

// Generate a random combination for the lock
const combination = generateCombination();
let currentCombination = [];  // This will store the current attempt

// Cache elements
const statusDiv = document.getElementById('status');
const buttons = document.querySelectorAll('.btn');
const dials = document.querySelectorAll('.dial');

// Function to update the status message
function updateStatus(message) {
  statusDiv.textContent = message;
}

// Event listener for the number buttons
buttons.forEach(button => {
  button.addEventListener('click', function () {
    const number = parseInt(this.dataset.number);
    
    // Add the number to the current combination
    currentCombination.push(number);
    
    // Update the lock display
    const dial = currentCombination.length - 1;
    dials[dial].textContent = number;
    
    // Check if the combination is complete
    if (currentCombination.length === combination.length) {
      checkCombination();
    }
  });
});

// Function to check if the combination is correct
function checkCombination() {
  if (JSON.stringify(currentCombination) === JSON.stringify(combination)) {
    updateStatus('Congrats! You unlocked the lock!');
    resetGame();
  } else {
    updateStatus('Incorrect! Try again.');
    resetGame();
  }
}

// Function to reset the game
function resetGame() {
  currentCombination = [];
  dials.forEach(dial => dial.textContent = '');
}
