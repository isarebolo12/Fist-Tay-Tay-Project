const eras = {
  debut: {
    name: "Debut",
    year: "2006",
    description: "Country-pop beginnings, guitar-first storytelling, and a first public version with enough personality to remember.",
    colors: ["#5d8c61", "#f5dfb6", "#ffffff", "#2f5f37"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Taylor_Swift_2009.jpg/500px-Taylor_Swift_2009.jpg",
    alt: "Taylor Swift at the 2010 Academy of Country Music Awards",
    credit: "Keith Hinkle / Wikimedia Commons"
  },
  fearless: {
    name: "Fearless",
    year: "2008",
    description: "Gold tones, big hooks, and the kind of confidence that makes a small app feel polished instead of temporary.",
    colors: ["#d9b861", "#fff3c4", "#8a6f22", "#ffffff"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Taylor_Swift_in_Pittsburgh_2009.JPG/960px-Taylor_Swift_in_Pittsburgh_2009.JPG",
    alt: "Taylor Swift performing in Pittsburgh in 2009",
    credit: "gilliganfanatic / Wikimedia Commons"
  },
  red: {
    name: "Red",
    year: "2012",
    description: "Bold contrast, sharp choices, and a reminder that a demo can be simple while still having strong visual taste.",
    colors: ["#be3450", "#7d1f32", "#f3d5d8", "#211f1f"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Taylor_Swift_%2852792050696%29.jpg/960px-Taylor_Swift_%2852792050696%29.jpg",
    alt: "Taylor Swift performing on the Eras Tour in Arlington, Texas",
    credit: "Ronald Woan / Wikimedia Commons"
  },
  folklore: {
    name: "Folklore",
    year: "2020",
    description: "Quiet structure, muted colors, and an interface that makes each user choice feel intentional and readable.",
    colors: ["#6f7772", "#d7d2c8", "#f8f5f1", "#3d413e"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Taylor_Swift_Eras_Tour_-_Arlington%2C_TX_-_Tolerate_It.jpg/960px-Taylor_Swift_Eras_Tour_-_Arlington%2C_TX_-_Tolerate_It.jpg",
    alt: "Taylor Swift performing during the Eras Tour",
    credit: "Ronald Woan / Wikimedia Commons"
  },
  midnights: {
    name: "Midnights",
    year: "2022",
    description: "Deep contrast, late-night polish, and a little dashboard sparkle without turning the project into a gimmick.",
    colors: ["#365f84", "#151c2c", "#c9d8e8", "#f4cf6a"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Taylor_Swift_%2852791470537%29_%28cropped%29.jpg/640px-Taylor_Swift_%2852791470537%29_%28cropped%29.jpg",
    alt: "Taylor Swift singing into a microphone on the Eras Tour",
    credit: "Ronald Woan / Wikimedia Commons"
  }
};

const lyricQuestions = [
  { fragment: "It's me, hi", answer: "Anti-Hero", choices: ["Anti-Hero", "Cardigan", "Love Story"] },
  { fragment: "long story short", answer: "long story short", choices: ["Enchanted", "long story short", "Red"] },
  { fragment: "we never go out of style", answer: "Style", choices: ["Style", "Delicate", "Cruel Summer"] },
  { fragment: "I remember it all", answer: "All Too Well", choices: ["All Too Well", "The Archer", "Lover"] },
  { fragment: "rainy proposal energy", answer: "Love Story", choices: ["Love Story", "Lavender Haze", "Mirrorball"] },
  { fragment: "woodland piano mood", answer: "Cardigan", choices: ["Cardigan", "Bejeweled", "Fearless"] },
  { fragment: "city lights comeback", answer: "Welcome to New York", choices: ["Welcome to New York", "Maroon", "August"] }
];

const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero__image");
const eraList = document.querySelector("#era-list");
const eraCount = document.querySelector("#era-count");
const eraImage = document.querySelector("#era-image");
const eraYear = document.querySelector("#era-year");
const eraName = document.querySelector("#era-name");
const eraDescription = document.querySelector("#era-description");
const imageCredit = document.querySelector("#image-credit");
const swatches = document.querySelector("#swatches");
const saveEraButton = document.querySelector("#save-era");
const randomEraButton = document.querySelector("#random-era");
const score = document.querySelector("#score");
const questionProgress = document.querySelector("#question-progress");
const progressBar = document.querySelector("#progress-bar");
const lyricFragment = document.querySelector("#lyric-fragment");
const answers = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const streak = document.querySelector("#streak");
const nextQuestionButton = document.querySelector("#next-question");
const resetQuizButton = document.querySelector("#reset-quiz");
const savedList = document.querySelector("#saved-list");
const clearSavedButton = document.querySelector("#clear-saved");
const vaultCard = document.querySelector("#vault-card");
const copyVaultButton = document.querySelector("#copy-vault");
const featurePanel = document.querySelector(".feature-panel");
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23f7f2ec'/%3E%3Ccircle cx='600' cy='310' r='130' fill='%23ded7cf'/%3E%3Ctext x='600' y='510' text-anchor='middle' font-family='Arial' font-size='48' font-weight='700' fill='%236d6562'%3EImage unavailable%3C/text%3E%3C/svg%3E";

let selectedEra = "debut";
let questionIndex = 0;
let correctAnswers = Number(localStorage.getItem("quizScore") || "0");
let currentStreak = 0;
let bestStreak = Number(localStorage.getItem("bestStreak") || "0");
let savedEras = JSON.parse(localStorage.getItem("savedEras") || "[]");

function saveState() {
  localStorage.setItem("savedEras", JSON.stringify(savedEras));
  localStorage.setItem("quizScore", String(correctAnswers));
}

function renderEraButtons() {
  eraList.innerHTML = "";
  Object.entries(eras).forEach(([key, era], index) => {
    const button = document.createElement("button");
    button.className = "era-choice";
    button.type = "button";
    button.textContent = era.name;
    button.classList.toggle("is-active", key === selectedEra);
    button.addEventListener("click", () => renderEra(key));
    eraList.append(button);

    if (key === selectedEra) {
      eraCount.textContent = `${index + 1} / ${Object.keys(eras).length}`;
    }
  });
}

function renderEra(eraKey) {
  const era = eras[eraKey];
  selectedEra = eraKey;
  document.documentElement.style.setProperty("--accent", era.colors[0]);
  document.documentElement.style.setProperty("--accent-strong", era.colors[3]);
  featurePanel.classList.remove("is-image-fallback");
  eraImage.src = era.image;
  eraImage.alt = era.alt;
  eraYear.textContent = era.year;
  eraName.textContent = era.name;
  eraDescription.textContent = era.description;
  imageCredit.textContent = `Photo: ${era.credit}`;
  swatches.innerHTML = "";

  era.colors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;
    swatch.title = color;
    swatch.setAttribute("aria-label", color);
    swatches.append(swatch);
  });

  renderEraButtons();
  renderVaultCard();
}

function renderQuestion() {
  const question = lyricQuestions[questionIndex];
  const progress = ((questionIndex + 1) / lyricQuestions.length) * 100;
  lyricFragment.textContent = `"${question.fragment}"`;
  questionProgress.textContent = `Question ${questionIndex + 1} of ${lyricQuestions.length}`;
  progressBar.style.width = `${progress}%`;
  answers.innerHTML = "";
  feedback.textContent = "Choose the matching song title.";

  question.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => checkAnswer(button, choice));
    answers.append(button);
  });
}

function checkAnswer(button, choice) {
  const question = lyricQuestions[questionIndex];
  const allAnswers = answers.querySelectorAll(".answer");
  allAnswers.forEach((answer) => {
    answer.disabled = true;
    answer.classList.toggle("is-correct", answer.textContent === question.answer);
  });

  if (choice === question.answer) {
    correctAnswers += 1;
    currentStreak += 1;
    bestStreak = Math.max(bestStreak, currentStreak);
    localStorage.setItem("bestStreak", String(bestStreak));
    saveState();
    score.textContent = correctAnswers;
    feedback.textContent = "Correct. Saved to your vault score.";
  } else {
    currentStreak = 0;
    button.classList.add("is-wrong");
    feedback.textContent = `Not quite. The answer is ${question.answer}.`;
  }

  streak.textContent = `Current streak: ${currentStreak} | Best: ${bestStreak}`;

  renderVaultCard();
}

function nextQuestion() {
  questionIndex = (questionIndex + 1) % lyricQuestions.length;
  renderQuestion();
}

function resetQuiz() {
  questionIndex = 0;
  correctAnswers = 0;
  currentStreak = 0;
  saveState();
  score.textContent = correctAnswers;
  streak.textContent = `Current streak: ${currentStreak} | Best: ${bestStreak}`;
  renderQuestion();
  renderVaultCard();
}

function chooseRandomEra() {
  const keys = Object.keys(eras).filter((key) => key !== selectedEra);
  const nextKey = keys[Math.floor(Math.random() * keys.length)];
  renderEra(nextKey);
}

function saveEra() {
  if (!savedEras.includes(selectedEra)) {
    savedEras.push(selectedEra);
    saveState();
    renderSaved();
    renderVaultCard();
  }
}

function renderSaved() {
  savedList.innerHTML = "";
  if (savedEras.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No eras saved yet.";
    savedList.append(empty);
    return;
  }

  savedEras.forEach((key) => {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    const remove = document.createElement("button");
    label.textContent = `${eras[key].name} (${eras[key].year})`;
    remove.className = "mini-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeSavedEra(key));
    item.append(label, remove);
    savedList.append(item);
  });
}

function renderVaultCard() {
  const savedNames = savedEras.map((key) => eras[key].name).join(", ") || "none yet";
  vaultCard.textContent = `Current era: ${eras[selectedEra].name}. Saved eras: ${savedNames}. Quiz score: ${correctAnswers}. Best streak: ${bestStreak}.`;
}

async function copyVaultCard() {
  await navigator.clipboard.writeText(vaultCard.textContent);
  copyVaultButton.textContent = "Copied";
  setTimeout(() => {
    copyVaultButton.textContent = "Copy vault card";
  }, 1200);
}

function removeSavedEra(key) {
  savedEras = savedEras.filter((savedKey) => savedKey !== key);
  saveState();
  renderSaved();
  renderVaultCard();
}

function clearSaved() {
  savedEras = [];
  saveState();
  renderSaved();
  renderVaultCard();
}

saveEraButton.addEventListener("click", saveEra);
randomEraButton.addEventListener("click", chooseRandomEra);
nextQuestionButton.addEventListener("click", nextQuestion);
resetQuizButton.addEventListener("click", resetQuiz);
clearSavedButton.addEventListener("click", clearSaved);
copyVaultButton.addEventListener("click", copyVaultCard);
heroImage.addEventListener("error", () => {
  hero.classList.add("is-image-fallback");
  heroImage.src = fallbackImage;
  heroImage.alt = "Hero image unavailable";
});
eraImage.addEventListener("error", () => {
  featurePanel.classList.add("is-image-fallback");
  eraImage.src = fallbackImage;
  eraImage.alt = "Image unavailable";
  imageCredit.textContent = `Photo unavailable. Credit: ${eras[selectedEra].credit}`;
});

document.addEventListener("keydown", (event) => {
  const keys = Object.keys(eras);
  const currentIndex = keys.indexOf(selectedEra);

  if (event.key === "ArrowRight") {
    renderEra(keys[(currentIndex + 1) % keys.length]);
  }

  if (event.key === "ArrowLeft") {
    renderEra(keys[(currentIndex - 1 + keys.length) % keys.length]);
  }
});

score.textContent = correctAnswers;
streak.textContent = `Current streak: ${currentStreak} | Best: ${bestStreak}`;
renderEra(selectedEra);
renderQuestion();
renderSaved();
