// === Leaderboard Page ===
document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('leaderboard-list');
  const status = document.getElementById('leaderboard-status');

  try {
    const scores = await api.fetchLeaderboard();
    if (scores.length === 0) {
      status.textContent = 'No scores yet — be the first!';
      return;
    }

    scores.forEach((entry) => {
      const item = document.createElement('li');
      item.textContent = `${entry.name} — ${entry.score}`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    status.textContent = 'Could not load the leaderboard. Please try again later.';
  }
});
