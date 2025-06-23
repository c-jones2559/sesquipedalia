// Your legendary list of obscure words
const words = [
  {
    word: "defenestrate",
    definition: "To throw someone out of a window.",
    example: "After that comment, I was tempted to defenestrate him."
  },
  {
    word: "callipygian",
    definition: "Having well-shaped buttocks.",
    example: "The statue was admired for its callipygian beauty."
  },
  {
    word: "ultracrepidarian",
    definition: "Someone who gives opinions beyond their knowledge.",
    example: "He gave ultracrepidarian advice about rocket science despite being a barista."
  },
  {
    word: "snollygoster",
    definition: "A shrewd but unprincipled person.",
    example: "Politics is full of snollygosters these days."
  },
  {
    word: "absquatulate",
    definition: "To leave abruptly or without saying goodbye.",
    example: "She absquatulated before the bill arrived."
  },
  {
    word: "sesquipedalian",
    definition: "Characterised by long words; long-winded.",
    example: "His sesquipedalian ramblings were impressive but baffling."
  },
];

// Same logic: consistent word each day
function getWordOfTheDay() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % words.length;
  return words[index];
}

// Display the bits
const wordObj = getWordOfTheDay();

const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
document.getElementById("word").textContent = `Day ${dayOfYear}: ${wordObj.word}`;
document.getElementById("definition").textContent = `Definition: ${wordObj.definition}`;
document.getElementById("example").textContent = `Example: ${wordObj.example}`;

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}