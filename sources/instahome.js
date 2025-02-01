document.addEventListener('keydown', event => {
    try {
        if (event.key === 'h') {
            location.href = '../../games.html'
        }

    } catch (error) {
        console.error(`Error handling key press: ${error.message}`);
    }
});