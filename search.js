document.addEventListener('DOMContentLoaded', () => {
  renderSearchPage();
});

function renderSearchPage() {
  const searchInput = document.getElementById('search-input');
  const form = document.getElementById('search-form');
  const clearButton = document.getElementById('clear-filters');

  const params = new URLSearchParams(window.location.search);
  const initialSkill = params.get('skill') || '';

  if (searchInput) {
    searchInput.value = initialSkill;
  }

  const updateResults = () => {
    const query = (searchInput ? searchInput.value : '').trim();
    const matches = filterUsers(query);
    renderSearchResults(matches, query);
  };

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = (searchInput ? searchInput.value : '').trim();
      if (value) {
        window.location.href = `search.html?skill=${encodeURIComponent(value)}`;
      }
      updateResults();
    });
  }

  ['filterExperience', 'filterAvailability', 'filterCertification', 'filterRating', 'filterSkillLevel'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateResults);
    }
  });

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      ['filterExperience', 'filterAvailability', 'filterCertification', 'filterRating', 'filterSkillLevel'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = id === 'filterRating' ? '0' : 'all';
      });
      renderSearchResults(filterUsers(''), '');
    });
  }

  updateResults();
}

function filterUsers(query) {
  const users = window.skillExchangeData.getUsers();
  const currentUser = getCurrentUser();

  const experience = document.getElementById('filterExperience')?.value || 'all';
  const availability = document.getElementById('filterAvailability')?.value || 'all';
  const certificationValue = document.getElementById('filterCertification')?.value || 'all';
  const ratingValue = Number(document.getElementById('filterRating')?.value || 0);
  const skillLevel = document.getElementById('filterSkillLevel')?.value || 'all';

  return users.filter((user) => {
    if (user.id === currentUser.id) return false;

    const meetsQuery = !query || anyUserMatchesSkill(query, user);
    const meetsExperience = experience === 'all' || user.experience === experience;
    const meetsAvailability = availability === 'all' || user.availability === availability;
    const meetsCertification = certificationValue === 'all' || (certificationValue === 'certified' && (user.certifications || []).length > 0);
    const meetsRating = ratingValue === 0 || user.rating >= ratingValue;
    const meetsSkillLevel = skillLevel === 'all' || user.experience === skillLevel;

    return meetsQuery && meetsExperience && meetsAvailability && meetsCertification && meetsRating && meetsSkillLevel;
  });
}

function renderSearchResults(matches, query) {
  const resultsContainer = document.getElementById('search-results');
  const resultsTitle = document.getElementById('search-results-title');
  const resultsCount = document.getElementById('results-count');

  if (!resultsContainer) return;

  if (!matches.length) {
    resultsContainer.innerHTML = `
      <div class="profile-card empty-state">
        <h3>No matching people found</h3>
        <p>Try searching for another skill such as Java, Python, UI/UX or Machine Learning.</p>
      </div>
    `;

    if (resultsTitle) resultsTitle.textContent = 'Search Results';
    if (resultsCount) resultsCount.textContent = '0 People Found';
    return;
  }

  const countLabel = query ? `People Found for “${query}”` : 'People Found';

  if (resultsTitle) resultsTitle.textContent = formatSkillSearchTitle(query);
  if (resultsCount) resultsCount.textContent = `${matches.length} ${countLabel.includes('People') ? 'People Found' : 'People Found'}`;

  resultsContainer.innerHTML = matches.map((user) => {
    const mutualMatch = calculateMutualMatch(getCurrentUser(), user);
    const skills = user.skills.slice(0, 3).map((skill) => `<span class="skill-badge">${escapeHTML(skill)}</span>`).join('');

    return `
      <article class="profile-card">
        <div class="profile-card-header">
          <img src="${escapeHTML(getUserAvatar(user))}" alt="${escapeHTML(user.name)}" class="profile-photo" />
          <div>
            <h3>${escapeHTML(user.name)}</h3>
            <p class="title">${escapeHTML(user.title)}</p>
          </div>
        </div>

        <div class="star-row">⭐ ${user.rating.toFixed(1)}</div>

        <div class="badge-list">
          ${skills}
        </div>

        <div class="profile-meta">
          <span>Experience: ${escapeHTML(user.experience)}</span>
          <span>${(user.certifications || []).length} Certifications</span>
        </div>

        <div class="profile-meta">
          <span>Projects: ${(user.projects || []).length}</span>
          <span>${escapeHTML(user.availability)}</span>
        </div>

        ${mutualMatch ? '<div class="mutual-badge">Perfect Skill Exchange Match</div>' : ''}

        <div class="card-actions">
          <button class="secondary-btn view-profile-button" data-user-id="${escapeHTML(user.id)}">View Profile</button>
          <button class="primary-btn connect-button" data-user-id="${escapeHTML(user.id)}">Connect</button>
          <button class="secondary-btn call-button" data-user-id="${escapeHTML(user.id)}" data-skill="${escapeHTML(user.skillsToLearn[0] || user.skills[0] || 'Skill exchange')}" type="button">Call</button>
        </div>
      </article>
    `;
  }).join('');

  bindProfileActionButtons();
}

function bindProfileActionButtons() {
  document.querySelectorAll('.view-profile-button').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      localStorage.setItem('skillExchangeSelectedProfile', userId);
      window.location.href = `profile.html?user=${encodeURIComponent(userId)}`;
    });
  });

  document.querySelectorAll('.connect-button').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      localStorage.setItem('skillExchangeSelectedProfile', userId);
      window.location.href = `profile.html?user=${encodeURIComponent(userId)}`;
    });
  });

  document.querySelectorAll('.call-button').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      const skill = button.getAttribute('data-skill');
      localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ mentorId: userId, skill }));
      window.location.href = `video-session.html?mentorId=${encodeURIComponent(userId)}&skill=${encodeURIComponent(skill)}`;
    });
  });
}
