function getWordList() {
    const words = [
        'sesquipedalian', 'defenestrate', 'ostracise', 'ubiquitous',
        'serendipitous', 'absquatulate', 'cacophony', 'collywobbles',
        'blatherskite', 'abecedarian', 'raconteur', 'autotomy',
        'logorrhea', 'callipygian', 'discombobulate', 'hemidemisemiquaver',
        'bibliopole', 'velleity', 'flibbertigibbet', 'mellifluous',
        'hobbledehoy', 'callithumpian', 'gubbins', 'crapulous',
        'cantankerous', 'farrago', 'skedaddle', 'taradiddle',
        'verisimilitude', 'zephyr', 'defalcate', 'ephemeral',
        'fugacious', 'halcyon', 'insouciant', 'jejune',
        'lachrymose', 'malapropism', 'obfuscate', 'parsimonious',
        'quixotic', 'recalcitrant', 'tintinnabulation', 'uxorious',
        'vendetta', 'weltanschauung', 'yammer', 'zaftig',
        'anomie', 'brouhaha', 'debauchery', 'fantods',
        'gallimaufry', 'harangue', 'iconoclast', 'juggernaut',
        'kerfuffle', 'legerdemain', 'noisome', 'obstreperous',
        'palimpsest', 'quandary', 'rumbustious', 'skullduggery',
        'tatterdemalion', 'ululate', 'vapid', 'wizened',
        'yokel', 'apocryphal', 'cynosure', 'emollient',
        'flummox', 'gossamer', 'infelicitous', 'jocular',
        'kowtow', 'nugatory', 'persiflage', 'rambunctious',
        'machiavellian'
    ];
    return words;
}

function getWordOfTheDay() {
    const index = getDaysSinceStartIndex() - 1 % getWordList().length;
    return getWordList()[index];
}



updateDay();

function updateDay() {
    const word = getWordOfTheDay();
    document.getElementById("word").textContent = `Day ${getDaysSinceStartIndex()}: ${word}`;
    getWordData(word).then(data => {
        document.getElementById("definition").textContent = `Definition: ${data.definition}`;
        document.getElementById("example").textContent = `${data.example}`;
        document.getElementById("pronunciation").textContent = `${data.pronunciation}`;
    }).catch(err => {
        console.error("Error fetching word data:", err);
    });
}


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

    countApiCall();
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
        example: (
            data.results?.map(r => r.examples?.[0]).find(e => e) || ""
        ),
        pronunciation: data.pronunciation?.all || ""
    };

    // Save to cache
    localStorage.setItem(`word-${word.toLowerCase()}`, JSON.stringify(wordData));

    console.log(`Fetched "${word}" from API and cached`);
    return wordData;
}

/*days are days since start of 2025*/
/*retrieve start date from localStorage or set it to today if not found*/
function getStartDate() {
    const date = localStorage.getItem("startDate");
    if (date) {
        return date;
    } else {
        const now = localStorage.setItem("startDate", getCurrentDay());
        return now;
    }
}

function resetStartDate() {
    const now = new Date();
    const date = Math.floor((now - new Date(2025)) / (1000 * 60 * 60 * 24));
    localStorage.setItem("startDate", getCurrentDay());
    localStorage.setItem("daysSkipped", 0);
    console.log("Start date reset to today:", date, ". Days skipped reset to 0.");
    updateDay();
}

/*number of days since start date + 1*/
function getDaysSinceStartIndex() {
    return getCurrentDay() - getStartDate() + 1 + parseInt(localStorage.getItem("daysSkipped") || "0");
}

/*number of days since 2025*/
function getCurrentDay() {
    const now = new Date();
    const date = Math.floor((now - new Date(2025)) / (1000 * 60 * 60 * 24));
    return date;
}

function incrementDaysSkipped() {
    localStorage.setItem("daysSkipped", parseInt(localStorage.getItem("daysSkipped") || "0") + 1);
    console.log("Incremented days skipped. Current count:", localStorage.getItem("daysSkipped"));
    updateDay();
}



function countApiCall() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const usage = JSON.parse(localStorage.getItem("dailyUsage") || "{}");

    if (usage.date !== today) {
        usage.date = today;
        usage.count = 0;
    }

    usage.count += 1;
    localStorage.setItem("dailyUsage", JSON.stringify(usage));

    console.log(`API calls today: ${usage.count}/2500`);
}

async function isInDictionary(word) {
    countApiCall();
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "0734dd73b8msh6fbed3f491620a5p18fdacjsn973e21be5855",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    });

    if (!response.ok) return false;

    const data = await response.json();
    return Array.isArray(data.results) && data.results.length > 0 && !!data.results[0].definition;
}

async function filterValidWords(wordList) {
    const validWords = [];

    for (const word of wordList) {
        try {
            const isValid = await isInDictionary(word);
            if (isValid) {
                console.log(`✅ ${word} is valid`);
                validWords.push(word);
            } else {
                console.log(`❌ ${word} not found`);
            }
        } catch (err) {
            console.error(`⚠️ Error checking ${word}:`, err.message);
        }

        // Avoid hammering the API too fast
        await new Promise(r => setTimeout(r, 300));
    }

    console.log("Valid words:", validWords);
    return validWords;
}