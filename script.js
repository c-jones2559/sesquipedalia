const words = [
  'sanctiloquent',  'defenestrate',    'limerence',
  'kakorrhaphiophobia', 'collywobbles',  'quomodocunquize',
  'psithurism',     'blatherskite',    'scacchic',
  'apricity',       'susurrus',        'mumpsimus',
  'gobbledygook',   'philoprogenitive','clinomania',
  'fudgel',         'absquatulate',    'yonderly',
  'serendipity',    'abecedarian',     'wabbit',
  'raconteur',      'infandous',       'squizzy',
  'zettzwang',      'lamprophony',     'pauciloquent',
  'tyrotoxism',     'autotomy',        'epicaricacy',
  'nefelibata',     'xanthic',         'collywobbles',
  'limerence',      'logorrhea',       'nudiustertian',
  'callipygian',    'tittynope',       'recumbentibus',
  'discombobulate', 'jentacular',      'zugzwang',
  'hemidemisemiquaver', 'agelast',      'absquatulate',
  'bibliopole',     'petrichor',       'kakorrhaphiophobia',
  'sonder',         'velleity',        'infandous'
]

function getWordOfTheDay() {
    const index = getDaysSinceStartIndex() - 1 % words.length;
    return words[index];
}


updateDay();

function updateDay() {
    const word = getWordOfTheDay();
    document.getElementById("word").textContent = `Day ${getDaysSinceStartIndex()}: ${word}`;
    getWordData(word).then(data => {
        document.getElementById("definition").textContent = `Definition: ${data.definition}`;
        document.getElementById("example").textContent = `Example: ${data.example}`;
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