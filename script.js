// Your legendary list of obscure words
const words = [
    "defenestrate",
    /*"eat",
    "ultracrepidarian",
    "snollygoster",
    "absquatulate",
    "sesquipedalian",*/
];

// Same logic: consistent word each day
function getWordOfTheDay() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % words.length;
    return words[index];
}

// Display the bits
const word = getWordOfTheDay();

const now = new Date();
const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
document.getElementById("word").textContent = `Day ${dayOfYear}: ${word}`;
document.getElementById("definition").textContent = `Definition: ${showDefinition(word)}`;
document.getElementById("example").textContent = `Example: ${showUsageExample(word)}`;

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
}

async function getDefinition(word) {
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "0734dd73b8msh6fbed3f491620a5p18fdacjsn973e21be5855",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Grab the first definition, if available
    const result = data.results?.[0]?.definition;

    if (!result) {
        throw new Error(`No definition found for "${word}"`);
    }

    return result;
}
async function showDefinition(word) {
    try {
        const definition = await getDefinition(word);
        document.getElementById("definition").innerText = definition;
    } catch (err) {
        console.error("Error:", err.message);
        document.getElementById("definition").innerText = "Definition not found.";
    }
}
async function getUsageExample(word) {
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "0734dd73b8msh6fbed3f491620a5p18fdacjsn973e21be5855",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const example = data.results?.[0]?.examples?.[0];

    if (!example) {
        throw new Error(`No usage example found for "${word}"`);
    }

    return example;
}
async function showUsageExample(word) {
    try {
        const definition = await getUsageExample(word);
        document.getElementById("example").innerText = definition;
    } catch (err) {
        console.error("Error:", err.message);
        document.getElementById("example").innerText = "Example not found.";
    }
}
