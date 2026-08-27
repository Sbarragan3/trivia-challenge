// === Local Storage Manager ===
// Handles saving and retrieving player data, scores, and settings
// Seafoam + Orange Retro Edition

const storage = {
  // === Retrieve last score ===
  getLastScore() {
    return Number(localStorage.getItem('lastScore')) || 0;
  },

  // === Retrieve player name ===
  getPlayerName() {
    return localStorage.getItem('playerName') || 'Player';
  },

  // === Save player name ===
  savePlayerName(name) {
    localStorage.setItem('playerName', name);
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