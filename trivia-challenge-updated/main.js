let triviaData = {};
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 10;
let isMuted = false;
let highScore = localStorage.getItem("highScore") || 0;

const yearSelect = document.getElementById("yearSelect");
const startBtn = document.getElementById("startBtn");
const quiz = document.getElementById("quiz");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const feedback = document.getElementById("feedback");
const questionCounter = document.getElementById("questionCounter");
const timeDisplay = document.getElementById("timeLeft");
const results = document.getElementById("results");
const scoreText = document.getElementById("scoreText");

const tickSound = document.getElementById("tickSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

tickSound.volume = 0.3;
correctSound.volume = 0.8;
wrongSound.volume = 0.8;

fetch("./trivia.json")
  .then(res => res.json())
  .then(data => {
    triviaData = data;
    const decades = Object.keys(triviaData).sort();
    decades.forEach(decade => {
      const option = document.createElement("option");
      option.value = decade;
      option.textContent = decade;
      yearSelect.appendChild(option);
    });
  });

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startBtn.addEventListener("click", () => {
  const year = yearSelect.value;
  currentQuestions = [...triviaData[year]];
  shuffle(currentQuestions);
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("setup").classList.add("hidden");
  quiz.classList.remove("hidden");
  feedback.textContent = "";
  showQuestion();
});

function showQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";
  feedback.textContent = "";
  timeLeft = 10;
  timeDisplay.textContent = timeLeft;
  timeDisplay.classList.remove("time-warning");

  if (!isMuted) {
    tickSound.currentTime = 0;
    tickSound.play();
  }

  const labels = ['A', 'B', 'C', 'D'];
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = `${labels[index]}. ${option}`;
    btn.onclick = () => handleAnswer(option, q.answer);
    optionsDiv.appendChild(btn);
  });

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    timeDisplay.classList.toggle("time-warning", timeLeft <= 3);
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      tickSound.pause();
      tickSound.currentTime = 0;
      if (!isMuted) wrongSound.play();
      feedback.textContent = `⏱️ Time's up! Correct answer: ${q.answer}`;
      currentQuestionIndex++;
      setTimeout(() => {
        currentQuestionIndex < currentQuestions.length ? showQuestion() : showResults();
      }, 1000);
    }
  }, 1000);
}

function handleAnswer(option, correctAnswer) {
  clearInterval(timerInterval);
  tickSound.pause();
  tickSound.currentTime = 0;
  if (option === correctAnswer) {
    score++;
    feedback.textContent = "✅ Correct!";
    if (!isMuted) correctSound.play();
  } else {
    feedback.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
    if (!isMuted) wrongSound.play();
  }
  currentQuestionIndex++;
  setTimeout(() => {
    currentQuestionIndex < currentQuestions.length ? showQuestion() : showResults();
  }, 1000);
}

function showResults() {
  quiz.classList.add("hidden");
  results.classList.remove("hidden");

  let emoji = "🎉";
  let message = "Well done!";
  if (score === currentQuestions.length) {
    emoji = "🏆";
    message = "Perfect Score!";
  } else if (score === 0) {
    emoji = "😬";
    message = "Oof. Try again!";
  } else if (score < currentQuestions.length / 2) {
    emoji = "👍";
    message = "Not bad, give it another go!";
  }

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }

  scoreText.innerHTML = `<strong>${emoji} ${message}</strong><br>${score} / ${currentQuestions.length}<br>🏅 High Score: ${highScore}`;

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

document.addEventListener("keydown", (e) => {
  const keyMap = { a: 0, b: 1, c: 2, d: 3 };
  const key = e.key.toLowerCase();
  if (keyMap.hasOwnProperty(key)) {
    const btn = optionsDiv.querySelectorAll("button")[keyMap[key]];
    if (btn) btn.click();
  }
});
