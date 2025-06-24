// Your legendary list of obscure words
const words = [
    "defenestrate",
    "ostracise",
    "sonder",
    "salubrious",
    "snollygoster",
    "absquatulate",
    "sesquipedalian",
    "exacerbate",
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
getWordData(word).then(data => {
    document.getElementById("definition").textContent = `Definition: ${data.definition}`;
    document.getElementById("example").textContent = `Example: ${data.example}`;
    document.getElementById("pronunciation").textContent = `${data.pronunciation}`;
}).catch(err => {
    console.error("Error fetching word data:", err);
});


// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
}

async function getWordData(word) {
    const cached = localStorage.getItem(`word-${word.toLowerCase()}`);
    if (cached) {
        console.log(`Loaded "${word}" from cache`);
        return JSON.parse(cached);
    }

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

    const wordData = {
        definition: data.results?.[0]?.definition || "No definition found.",
        example: data.results?.[0]?.examples?.[0] || "No usage example found.",
        pronunciation: data.pronunciation?.all || "No pronunciation found."
    };

    // Save to cache
    localStorage.setItem(`word-${word.toLowerCase()}`, JSON.stringify(wordData));

    console.log(`Fetched "${word}" from API and cached`);
    return wordData;
}