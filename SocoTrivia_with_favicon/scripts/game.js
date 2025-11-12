// === Trivia Game Core Logic ===
// Author: SocoTrivia
// Theme: Seafoam + Orange Retro Edition

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedLanguage = 'english'; // default language
let totalQuestions = 10; // adjust as desired

// === Load Questions ===
async function loadQuestions(language = 'english') {
  try {
    const response = await fetch(`data/${language}/part1.json`);
    if (!response.ok) throw new Error(`Failed to load questions for ${language}`);
    const data = await response.json();
    questions = shuffleArray(data).slice(0, totalQuestions);
    startGame();
  } catch (error) {
    console.error('Error loading questions:', error);
    document.getElementById('question').innerText = 'Error loading questions.';
  }
}

// === Start Game ===
function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

// === Display Question ===
function showQuestion() {
  const questionContainer = document.getElementById('question');
  const optionsContainer = document.getElementById('options');
  const progress = document.getElementById('progress');

  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }

  const q = questions[currentQuestionIndex];
  questionContainer.innerText = q.question;
  optionsContainer.innerHTML = '';

  q.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('option-btn');
    button.onclick = () => selectAnswer(i, q.answer);
    optionsContainer.appendChild(button);
  });

  progress.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

// === Handle Answer Selection ===
function selectAnswer(selectedIndex, correctIndex) {
  if (selectedIndex === correctIndex) {
    score++;
  }

  currentQuestionIndex++;
  showQuestion();
}

// === End Game ===
function endGame() {
  localStorage.setItem('lastScore', score);
  window.location.href = 'results.html';
}

// === Shuffle Helper ===
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// === Initialize Game ===
window.onload = () => {
  // Retrieve selected language from settings (if available)
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) selectedLanguage = savedLang;

  loadQuestions(selectedLanguage);
};