document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'login') {
    setupLoginForm();
    if (localStorage.getItem('skillExchangeAuthenticated') === 'true') {
      window.location.replace(isProfileComplete() ? 'index.html' : 'profile.html?setup=true');
    }
    return;
  }

  if (localStorage.getItem('skillExchangeAuthenticated') !== 'true') {
    window.location.replace('login.html');
    return;
  }

  if (!isProfileComplete() && page !== 'profile') {
    window.location.replace('profile.html?setup=true');
    return;
  }

  setupNavigation();
  setupHomeSearch();
  setupPopularSkillButtons();
  setupGenericButtons();
});

function isProfileComplete() {
  const user = window.skillExchangeData.getCurrentUser();
  return localStorage.getItem(`skillExchangeProfileComplete:${user.id}`) === 'true';
}

function setupLoginForm() {
  const form = document.getElementById('auth-form');
  const nameField = document.getElementById('auth-name-field');
  const submitButton = document.getElementById('auth-submit');
  const modeButtons = document.querySelectorAll('[data-auth-mode]');
  let mode = 'create';

  const setMode = (nextMode) => {
    mode = nextMode;
    const creating = mode === 'create';
    if (nameField) nameField.hidden = !creating;
    const nameInput = document.getElementById('auth-name');
    if (nameInput) nameInput.required = creating;
    if (submitButton) submitButton.textContent = creating ? 'Create account' : 'Sign in';
    modeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.authMode === mode);
      button.setAttribute('aria-pressed', String(button.dataset.authMode === mode));
    });
  };

  modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.authMode)));
  setMode(mode);
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const accounts = JSON.parse(localStorage.getItem('skillExchangeAccounts') || '[]');
    let account;

    if (mode === 'create') {
      if (accounts.some((item) => item.email === email)) {
        showAuthError('This email already has an account. Sign in instead.');
        return;
      }
      const user = {
        id: `member-${Date.now()}`, name, email, title: '', bio: '', location: '', education: '',
        experience: 'Beginner', availability: 'Available', rating: 0, skills: [], skillsToLearn: [],
        certifications: [], projects: [], achievements: [], experienceHistory: [], reviews: [], photo: ''
      };
      account = { email, password, userId: user.id };
      accounts.push(account);
      window.skillExchangeData.setCurrentUser(user);
      localStorage.setItem('skillExchangeAccounts', JSON.stringify(accounts));
      const users = window.skillExchangeData.getUsers();
      users.push(user);
      window.skillExchangeData.saveUsers(users);
      localStorage.setItem('skillExchangeAuthenticated', 'true');
      window.location.href = 'profile.html?setup=true';
      return;
    }

    account = accounts.find((item) => item.email === email && item.password === password);
    if (!account) {
      showAuthError('Email or password is incorrect.');
      return;
    }
    const user = window.skillExchangeData.findUserById(account.userId);
    if (!user) {
      showAuthError('Could not load this profile. Create a new account to continue.');
      return;
    }
    window.skillExchangeData.setCurrentUser(user);
    localStorage.setItem('skillExchangeAuthenticated', 'true');
    window.location.href = isProfileComplete() ? 'index.html' : 'profile.html?setup=true';
  });
}

function showAuthError(message) {
  const error = document.getElementById('auth-error');
  if (error) error.textContent = message;
}

function setupNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  if (nav && !nav.querySelector('[data-sign-out]')) {
    const signOut = document.createElement('a');
    signOut.href = '#';
    signOut.dataset.signOut = 'true';
    signOut.textContent = 'Sign out';
    signOut.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('skillExchangeAuthenticated');
      window.location.href = 'login.html';
    });
    nav.append(signOut);
  }
}

function setupHomeSearch() {
  const form = document.getElementById('home-search-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('home-search-input');
    const skill = (input.value || '').trim();

    if (!skill) {
      showToast('Please enter a skill to search.');
      return;
    }

    window.location.href = `search.html?skill=${encodeURIComponent(skill)}`;
  });
}

function setupPopularSkillButtons() {
  const skillButtons = document.querySelectorAll('[data-skill]');

  skillButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const skill = button.getAttribute('data-skill');
      if (skill) {
        window.location.href = `search.html?skill=${encodeURIComponent(skill)}`;
      }
    });
  });
}

function setupGenericButtons() {
  const certificateButtons = document.querySelectorAll('.view-certificate');
  certificateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showToast('Demo certificate opened for review.');
    });
  });

  const projectButtons = document.querySelectorAll('.view-project');
  projectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showToast('Project preview loaded.');
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function createSkillBadges(skills) {
  return (skills || [])
    .slice(0, 6)
    .map((skill) => `<span class="skill-badge">${escapeHTML(skill)}</span>`)
    .join('');
}

function createChips(items) {
  return (items || [])
    .map((item) => `<span class="chip">${escapeHTML(item)}</span>`)
    .join('');
}

function escapeHTML(value) {
  const text = String(value ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function calculateMutualMatch(userA, userB) {
  if (!userA || !userB) return false;

  const aKnows = new Set((userA.skills || []).map((skill) => skill.toLowerCase()));
  const aWants = new Set((userA.skillsToLearn || []).map((skill) => skill.toLowerCase()));
  const bKnows = new Set((userB.skills || []).map((skill) => skill.toLowerCase()));
  const bWants = new Set((userB.skillsToLearn || []).map((skill) => skill.toLowerCase()));

  const hasMutualInterest = [...aKnows].some((skill) => bWants.has(skill)) && [...bKnows].some((skill) => aWants.has(skill));

  return hasMutualInterest;
}

function getStoredRequests() {
  return JSON.parse(localStorage.getItem('skillExchangeRequests') || '[]');
}

function getStoredConnections() {
  return JSON.parse(localStorage.getItem('skillExchangeConnections') || '[]');
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('skillExchangeCurrentUser') || JSON.stringify(window.skillExchangeData.defaultUsers[0]));
}

function setSelectedProfile(userId) {
  localStorage.setItem('skillExchangeSelectedProfile', userId);
}

function getSelectedProfileId() {
  return localStorage.getItem('skillExchangeSelectedProfile') || getCurrentUser().id;
}

function currentUserRequestExists(targetUserId) {
  const requests = getStoredRequests();
  const currentUser = getCurrentUser();

  return requests.some((request) => {
    const isSameRequest = request.fromUserId === currentUser.id && request.toUserId === targetUserId;
    const isPending = request.status === 'pending' || request.status === 'accepted';
    return isSameRequest && isPending;
  });
}

function anyUserMatchesSkill(skillTerm, user) {
  const term = (skillTerm || '').trim().toLowerCase();
  if (!term) return true;

  const userSkills = [...(user.skills || []), ...(user.skillsToLearn || [])];
  return userSkills.some((skill) => skill.toLowerCase().includes(term));
}

function formatSkillSearchTitle(skillTerm) {
  if (!skillTerm) return 'Search Results';
  return `People Found for “${skillTerm}”`;
}

function getUserAvatar(user) {
  return user.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=80';
}
