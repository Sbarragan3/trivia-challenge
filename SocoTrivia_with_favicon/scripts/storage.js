// === Local Storage Manager ===
// Handles saving and retrieving player data, scores, and settings
// Seafoam + Orange Retro Edition

const storage = {
  // === Save the latest score ===
  saveScore(name, score) {
    const leaderboard = this.getLeaderboard();
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // highest first
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10))); // keep top 10
    localStorage.setItem('lastScore', score);
    localStorage.setItem('playerName', name);
  },

  // === Retrieve leaderboard ===
  getLeaderboard() {
    const data = localStorage.getItem('leaderboard');
    return data ? JSON.parse(data) : [];
  },

  // === Retrieve last score ===
  getLastScore() {
    return Number(localStorage.getItem('lastScore')) || 0;
  },

  // === Retrieve player name ===
  getPlayerName() {
    return localStorage.getItem('playerName') || 'Player';
  },

  // === Save language setting ===
  saveLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
  },

  // === Retrieve language setting ===
  getLanguage() {
    return localStorage.getItem('selectedLanguage') || 'english';
  },

  // === Save mute preference ===
  saveMute(isMuted) {
    localStorage.setItem('isMuted', isMuted);
  },

  // === Retrieve mute preference ===
  getMute() {
    return localStorage.getItem('isMuted') === 'true';
  },

  // === Clear all data (optional) ===
  clearAll() {
    localStorage.clear();
  },
};