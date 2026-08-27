// === Results Page ===
document.addEventListener('DOMContentLoaded', () => {
  const score = storage.getLastScore();
  ui.updateScore(score);
  ui.showMessage(
    score >= 8 ? 'Amazing job! 🎉' : score >= 5 ? 'Nice work!' : 'Keep practicing!',
    5000
  );

  const nameInput = document.getElementById('player-name');
  nameInput.value = storage.getPlayerName() === 'Player' ? '' : storage.getPlayerName();

  document.getElementById('save-score-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameInput.value.trim() || 'Player';
    storage.savePlayerName(name);

    const submitButton = event.target.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';

    try {
      await api.submitScore(name, score);
      submitButton.textContent = 'Saved!';
    } catch (error) {
      console.error('Error saving score:', error);
      submitButton.textContent = 'Save failed - try again';
      submitButton.disabled = false;
    }
  });
});
