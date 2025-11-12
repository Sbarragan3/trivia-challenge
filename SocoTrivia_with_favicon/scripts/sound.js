// === Sound Manager ===
// Handles background music, sound effects, and mute toggle
// Seafoam + Orange Retro Edition

const soundManager = {
  isMuted: false,
  bgMusic: null,
  correctSound: null,
  wrongSound: null,
  tickSound: null,

  // === Initialize All Sounds ===
  init() {
    this.bgMusic = new Audio('assets/sounds/bg-music.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.4;

    this.correctSound = new Audio('assets/sounds/correct.mp3');
    this.wrongSound = new Audio('assets/sounds/wrong.mp3');
    this.tickSound = new Audio('assets/sounds/tick.mp3');

    const savedMute = localStorage.getItem('isMuted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }

    this.updateMuteState();
  },

  // === Toggle Mute On/Off ===
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('isMuted', this.isMuted);
    this.updateMuteState();
  },

  // === Apply Mute Setting ===
  updateMuteState() {
    const icon = document.getElementById('mute-icon');
    if (this.isMuted) {
      this.bgMusic.pause();
      icon?.classList.replace('fa-volume-up', 'fa-volume-mute');
    } else {
      this.bgMusic.play();
      icon?.classList.replace('fa-volume-mute', 'fa-volume-up');
    }
  },

  // === Play Specific Sound ===
  play(soundType) {
    if (this.isMuted) return;

    switch (soundType) {
      case 'correct':
        this.correctSound.currentTime = 0;
        this.correctSound.play();
        break;
      case 'wrong':
        this.wrongSound.currentTime = 0;
        this.wrongSound.play();
        break;
      case 'tick':
        this.tickSound.currentTime = 0;
        this.tickSound.play();
        break;
    }
  },
};

// === Initialize when page loads ===
window.addEventListener('DOMContentLoaded', () => soundManager.init());