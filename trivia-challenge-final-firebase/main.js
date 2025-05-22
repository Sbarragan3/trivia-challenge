import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCBXVwyuOohAlTcbFcwqVmrDlwxgoX2PVA",
  authDomain: "triviachallenge-8d493.firebaseapp.com",
  projectId: "triviachallenge-8d493",
  storageBucket: "triviachallenge-8d493.firebasestorage.app",
  messagingSenderId: "505265364782",
  appId: "1:505265364782:web:5942cf1232862b216624bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const yearSelect = document.getElementById("yearSelect");
const playerNameInput = document.getElementById("playerName");
const questionCountSelect = document.getElementById("questionCount");
const startBtn = document.getElementById("startBtn");
const quiz = document.getElementById("quiz");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const feedback = document.getElementById("feedback");
const questionCounter = document.getElementById("questionCounter");
const timeDisplay = document.getElementById("timeLeft");
const results = document.getElementById("results");
const scoreText = document.getElementById("scoreText");
const leaderboardEl = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");

const tickSound = document.getElementById("tickSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// Settings
tickSound.volume = 0.3;
correctSound.volume = 0.8;
wrongSound.volume = 0.8;
let isMuted = false;
let triviaData = {};
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 10;
let highScore = localStorage.getItem("highScore") || 0;

// Load and populate decades from trivia.json
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
  })
  .catch(err => {
    console.error("Failed to load trivia.json:", err);
  });

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  const count = parseInt(questionCountSelect.value);
  const year = yearSelect.value;

  if (!name || !year) {
    alert("Please enter your name and choose a decade.");
    return;
  }

  currentQuestions = [...triviaData[year]];
  shuffle(currentQuestions);
  currentQuestions = currentQuestions.slice(0, count);
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
  const correct = option === correctAnswer;
  if (correct) {
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

async function showResults() {
  quiz.classList.add("hidden");
  results.classList.remove("hidden");

  const name = playerNameInput.value.trim();
  const emoji = score === currentQuestions.length ? "🏆" : score === 0 ? "😬" : "🎉";
  const message = score === currentQuestions.length
    ? "Perfect Score!" : score === 0
    ? "Oof. Try again!" : score < currentQuestions.length / 2
    ? "Not bad, give it another go!" : "Well done!";

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }

  scoreText.innerHTML = `<strong>${emoji} ${message}</strong><br>${score} / ${currentQuestions.length}<br>🏅 High Score: ${highScore}`;

  try {
    await addDoc(collection(db, "leaderboard"), {
      name,
      score,
      date: new Date()
    });
  } catch (e) {
    console.error("Error writing to leaderboard:", e);
  }

  loadLeaderboard();
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

async function loadLeaderboard() {
  leaderboardEl.classList.remove("hidden");
  leaderboardList.innerHTML = "";
  const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    const { name, score } = doc.data();
    leaderboardList.innerHTML += `<li>${name}: ${score}</li>`;
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
