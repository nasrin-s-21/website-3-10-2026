document.addEventListener('DOMContentLoaded', () => {
  renderConnectionDashboard();
  renderConnectionPage();
});

function renderConnectionDashboard() {
  const currentUser = getCurrentUser();
  const skillsKnown = document.getElementById('stat-skills-known');
  const skillsLearning = document.getElementById('stat-skills-learning');
  const connectionsCount = document.getElementById('stat-connections');
  const sessionsCount = document.getElementById('stat-sessions');

  const greeting = document.getElementById('dashboard-greeting');
  const knownList = document.getElementById('skills-known-list');
  const learningList = document.getElementById('skills-learning-list');
  const pendingList = document.getElementById('pending-requests-list');
  const myConnectionsList = document.getElementById('my-connections-list');

  if (greeting) {
    greeting.textContent = `Welcome back, ${currentUser.name}!`;
  }

  if (skillsKnown) skillsKnown.textContent = String((currentUser.skills || []).length);
  if (skillsLearning) skillsLearning.textContent = String((currentUser.skillsToLearn || []).length);

  const acceptedConnections = getAcceptedConnections();
  if (connectionsCount) connectionsCount.textContent = String(acceptedConnections.length);
  if (sessionsCount) sessionsCount.textContent = String(Math.max(acceptedConnections.length, 1));

  if (knownList) knownList.innerHTML = createChips(currentUser.skills || []);
  if (learningList) learningList.innerHTML = createChips(currentUser.skillsToLearn || []);

  const incomingRequests = getIncomingRequests();
  if (pendingList) {
    if (!incomingRequests.length) {
      pendingList.innerHTML = '<p class="empty-state-text">No pending requests right now.</p>';
    } else {
      pendingList.innerHTML = incomingRequests.map((request) => {
        const sender = findUserById(request.fromUserId);
        return `
          <div class="request-item">
            <div class="row">
              <strong>${sender ? sender.name : 'Someone'}</strong>
              <span class="badge-status pending">Pending</span>
            </div>
            <p>${request.skill}</p>
            <div class="action-row">
              <button class="small-btn accept-btn" data-request-id="${request.id}" data-action="accept">Accept</button>
              <button class="small-btn reject-btn" data-request-id="${request.id}" data-action="reject">Reject</button>
              <button class="small-btn secondary-btn" data-user-id="${request.fromUserId}">View Profile</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  bindRequestActions();

  if (myConnectionsList) {
    if (!acceptedConnections.length) {
      myConnectionsList.innerHTML = '<p class="empty-state-text">No connections yet.</p>';
      return;
    }

    myConnectionsList.innerHTML = acceptedConnections.map((request) => {
      const user = request.fromUserId === currentUser.id ? findUserById(request.toUserId) : findUserById(request.fromUserId);
      return `
        <div class="connection-item">
          <div class="row">
            <strong>${user ? user.name : 'Connected User'}</strong>
            <span class="badge-status accepted">Connected</span>
          </div>
          <div class="action-row">
            <button class="small-btn secondary-btn" data-user-id="${user ? user.id : ''}">View Profile</button>
            <button class="small-btn primary-btn" data-user-id="${user ? user.id : ''}" data-skill="${request.skill || 'Python'}">Start Session</button>
          </div>
        </div>
      `;
    }).join('');

    myConnectionsList.querySelectorAll('[data-user-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const userId = button.getAttribute('data-user-id');
        const skill = button.getAttribute('data-skill');

        if (button.classList.contains('primary-btn')) {
          if (userId) {
            localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ skill: skill || 'Python', mentorId: userId }));
            window.location.href = `video-session.html?mentorId=${encodeURIComponent(userId)}&skill=${encodeURIComponent(skill || 'Python')}`;
          }
          return;
        }

        if (userId) {
          window.location.href = `profile.html?user=${encodeURIComponent(userId)}`;
        }
      });
    });
  }
}

function renderConnectionPage() {
  const sentList = document.getElementById('sent-requests-list');
  const acceptedList = document.getElementById('accepted-connections-list');

  if (!sentList && !acceptedList) return;

  const currentUser = getCurrentUser();
  const requests = getStoredRequests();

  const sentRequests = requests.filter((request) => request.fromUserId === currentUser.id);
  if (sentList) {
    if (!sentRequests.length) {
      sentList.innerHTML = '<p class="empty-state-text">No sent requests yet.</p>';
    } else {
      sentList.innerHTML = sentRequests.map((request) => {
        const user = findUserById(request.toUserId);
        const label = request.status === 'accepted' ? 'accepted' : request.status === 'rejected' ? 'rejected' : 'pending';
        return `
          <div class="request-item">
            <div class="row">
              <strong>${user ? user.name : 'Requested User'}</strong>
              <span class="badge-status ${label}">${label}</span>
            </div>
            <p>${request.skill}</p>
          </div>
        `;
      }).join('');
    }
  }

  const connections = getAcceptedConnections();
  if (acceptedList) {
    if (!connections.length) {
      acceptedList.innerHTML = '<p class="empty-state-text">No active connections.</p>';
    } else {
      acceptedList.innerHTML = connections.map((request) => {
        const user = request.fromUserId === currentUser.id ? findUserById(request.toUserId) : findUserById(request.fromUserId);
        return `
          <div class="connection-item">
            <div class="row">
              <strong>${user ? user.name : 'Connected user'}</strong>
              <span class="badge-status accepted">Accepted</span>
            </div>
            <div class="action-row">
              <button class="small-btn secondary-btn" data-user-id="${user ? user.id : ''}">View Profile</button>
              <button class="small-btn primary-btn" data-user-id="${user ? user.id : ''}" data-skill="${request.skill || 'Python'}">Start Session</button>
            </div>
          </div>
        `;
      }).join('');

      acceptedList.querySelectorAll('[data-user-id]').forEach((button) => {
        button.addEventListener('click', () => {
          const userId = button.getAttribute('data-user-id');
          const skill = button.getAttribute('data-skill');

          if (button.classList.contains('primary-btn')) {
            if (userId) {
              localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ skill: skill || 'Python', mentorId: userId }));
              window.location.href = `video-session.html?mentorId=${encodeURIComponent(userId)}&skill=${encodeURIComponent(skill || 'Python')}`;
            }
            return;
          }

          if (userId) {
            window.location.href = `profile.html?user=${encodeURIComponent(userId)}`;
          }
        });
      });
    }
  }
}

function getIncomingRequests() {
  const currentUser = getCurrentUser();
  const requests = getStoredRequests();
  return requests.filter((request) => request.toUserId === currentUser.id && request.status === 'pending');
}

function getAcceptedConnections() {
  const currentUser = getCurrentUser();
  const requests = getStoredRequests();
  return requests.filter((request) => {
    const isRelevant = request.status === 'accepted' && (request.fromUserId === currentUser.id || request.toUserId === currentUser.id);
    return isRelevant;
  });
}

function bindRequestActions() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    const action = button.getAttribute('data-action');
    const requestId = button.getAttribute('data-request-id');
    button.addEventListener('click', () => {
      const requests = getStoredRequests();
      const request = requests.find((item) => item.id === requestId);
      if (!request) return;

      if (action === 'accept') {
        request.status = 'accepted';
        localStorage.setItem('skillExchangeRequests', JSON.stringify(requests));
        showToast('Request accepted!');
      }

      if (action === 'reject') {
        request.status = 'rejected';
        localStorage.setItem('skillExchangeRequests', JSON.stringify(requests));
        showToast('Request rejected.');
      }

      window.location.reload();
    });
  });

  document.querySelectorAll('[data-user-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      const skill = button.getAttribute('data-skill');

      if (button.classList.contains('primary-btn') && skill) {
        localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ skill, mentorId: userId }));
        window.location.href = `video-session.html?mentorId=${encodeURIComponent(userId)}&skill=${encodeURIComponent(skill)}`;
        return;
      }

      if (userId) {
        window.location.href = `profile.html?user=${encodeURIComponent(userId)}`;
      }
    });
  });
}
