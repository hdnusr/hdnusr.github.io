// Function to set a cookie with a long expiration date
function setCookie(name, value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10); // Expire in 10 years
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Initialize dark mode based on cookie
const darkModeToggle = document.getElementById('darkModeToggle');
const isDarkMode = getCookie('darkMode') === 'enabled';

if (isDarkMode) {
    document.body.classList.add('dark');
    document.querySelector('.settings-page').classList.add('dark');
    darkModeToggle.checked = true;
}

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark');
        document.querySelector('.settings-page').classList.add('dark');
        setCookie('darkMode', 'enabled'); // Save preference
    } else {
        document.body.classList.remove('dark');
        document.querySelector('.settings-page').classList.remove('dark');
        setCookie('darkMode', 'disabled');
    }
});