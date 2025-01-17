import {
    storyData
} from './storyline.js'

const storyText = document.getElementById('story');
const optionsContainer = document.getElementById('options');

let currentStep = 0;

function updateGame() {
    const currentData = storyData[currentStep];
    storyText.textContent = currentData.text;

    optionsContainer.innerHTML = ''; // Clear previous options
    currentData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => {
            currentStep = option.nextStep;
            updateGame();
        };
        optionsContainer.appendChild(button);
    });
}

// Initialize the game
updateGame();
