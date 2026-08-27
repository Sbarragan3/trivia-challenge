// === Leaderboard API Client ===
// Talks to the /.netlify/functions/leaderboard endpoint (backed by Netlify Database)

const api = {
  async fetchLeaderboard() {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Failed to load leaderboard');
    return response.json();
  },

  async submitScore(name, score) {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });
    if (!response.ok) throw new Error('Failed to save score');
    return response.json();
  },
};
