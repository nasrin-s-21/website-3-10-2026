document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('session-review-form');
  const details = document.getElementById('review-session-details');
  if (!form) return;

  const session = JSON.parse(localStorage.getItem('skillExchangeSessionMeta') || '{}');
  const mentor = window.skillExchangeData.findUserById(session.mentorId);
  if (details) {
    details.textContent = `Your ${session.skill || 'skill exchange'} session with ${mentor ? mentor.name : 'your partner'}`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!mentor) {
      showToast('The session partner could not be found.');
      return;
    }

    const formData = new FormData(form);
    const rating = Number(formData.get('rating'));
    const text = String(formData.get('text') || '').trim();
    const review = { name: window.skillExchangeData.getCurrentUser().name, rating, text };
    mentor.reviews = [...(mentor.reviews || []), review];
    const ratings = mentor.reviews.map((item) => Number(item.rating) || 0);
    mentor.rating = ratings.reduce((total, value) => total + value, 0) / ratings.length;
    const users = window.skillExchangeData.getUsers();
    const mentorIndex = users.findIndex((user) => user.id === mentor.id);
    if (mentorIndex >= 0) {
      users[mentorIndex] = mentor;
      window.skillExchangeData.saveUsers(users);
    }

    showToast('Review submitted. Thank you!');
    setTimeout(() => window.location.href = 'dashboard.html', 700);
  });
});