// Handles all game UI updates and interactions
class UI {
  constructor() {
    this.scoreElement = document.getElementById("score");
    this.livesElement = document.getElementById("lives");
    this.messageElement = document.getElementById("message");
    this.startButton = document.getElementById("startButton");
    this.restartButton = document.getElementById("restartButton");
  }

  updateScore(score) {
    if (this.scoreElement) {
      this.scoreElement.textContent = `Score: ${score}`;
    }
  }

  updateLives(lives) {
    if (this.livesElement) {
      this.livesElement.textContent = `Lives: ${lives}`;
    }
  }

  showMessage(text, duration = 2000) {
    if (this.messageElement) {
      this.messageElement.textContent = text;
      this.messageElement.style.opacity = 1;
      setTimeout(() => {
        this.messageElement.style.opacity = 0;
      }, duration);
    }
  }

  toggleStartButton(show) {
    if (this.startButton) {
      this.startButton.style.display = show ? "block" : "none";
    }
  }

  toggleRestartButton(show) {
    if (this.restartButton) {
      this.restartButton.style.display = show ? "block" : "none";
    }
  }
}

// Export UI instance
const ui = new UI();
export default ui;