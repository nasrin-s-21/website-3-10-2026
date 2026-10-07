document.addEventListener('DOMContentLoaded', () => {
  renderProfilePage();
  bindProfileModal();
});

function renderProfilePage() {
  const profileRoot = document.getElementById('profile-page-content');
  if (!profileRoot) return;

  const params = new URLSearchParams(window.location.search);
  const isSetup = params.get('setup') === 'true' || localStorage.getItem(`skillExchangeProfileComplete:${getCurrentUser().id}`) !== 'true';
  const isMyProfile = params.get('myProfile') === 'true';
  const selectedId = params.get('user') || localStorage.getItem('skillExchangeSelectedProfile') || getCurrentUser().id;
  const profileUser = isMyProfile ? getCurrentUser() : findUserById(selectedId) || getCurrentUser();

  if (isSetup) {
    profileRoot.innerHTML = renderEditableProfile(profileUser, true);
    bindProfileFormSave(true);
    return;
  }

  if (isMyProfile) {
    profileRoot.innerHTML = renderEditableProfile(profileUser);
    bindProfileFormSave();
    return;
  }

  const canRequest = profileUser.id !== getCurrentUser().id;
  const requestExists = currentUserRequestExists(profileUser.id);

  profileRoot.innerHTML = `
    <article class="profile-header-card card-style">
      <img src="${escapeHTML(getUserAvatar(profileUser))}" alt="${escapeHTML(profileUser.name)}" class="profile-photo" />
      <div class="profile-main">
        <h1>${escapeHTML(profileUser.name)}</h1>
        <p class="title">${escapeHTML(profileUser.title)}</p>
        <p class="bio">“${escapeHTML(profileUser.bio)}”</p>
        <div class="profile-meta-grid">
          <div class="meta-box"><span>Location</span><strong>${escapeHTML(profileUser.location)}</strong></div>
          <div class="meta-box"><span>Education</span><strong>${escapeHTML(profileUser.education)}</strong></div>
          <div class="meta-box"><span>Experience</span><strong>${escapeHTML(profileUser.experience)}</strong></div>
          <div class="meta-box"><span>Availability</span><strong>${escapeHTML(profileUser.availability)}</strong></div>
          <div class="meta-box"><span>Rating</span><strong>⭐ ${profileUser.rating.toFixed(1)}</strong></div>
          <div class="meta-box"><span>Mutual Match</span><strong>${calculateMutualMatch(getCurrentUser(), profileUser) ? 'Yes' : 'No'}</strong></div>
        </div>
      </div>
    </article>

    <section class="profile-section">
      <h3>Skills</h3>
      <div class="badge-list">${createSkillBadges(profileUser.skills)}</div>
    </section>

    <section class="profile-section">
      <h3>Certifications</h3>
      <div class="cert-grid">
        ${(profileUser.certifications || []).map((cert) => `
          <div class="cert-card">
            <h4>${escapeHTML(cert.name)}</h4>
            <p><strong>Issued by:</strong> ${escapeHTML(cert.issuer)}</p>
            <p><strong>Year:</strong> ${escapeHTML(cert.year)}</p>
            <p><strong>Credential ID:</strong> ${escapeHTML(cert.credentialId)}</p>
            <button class="secondary-btn view-certificate" type="button">View Certificate</button>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="profile-section">
      <h3>Projects</h3>
      <div class="project-grid">
        ${(profileUser.projects || []).map((project) => `
          <div class="project-card">
            <div class="project-thumb" style="background-image:url('${project.image}')"></div>
            <h4>${escapeHTML(project.name)}</h4>
            <p>${escapeHTML(project.description)}</p>
            <p><strong>Technologies:</strong> ${escapeHTML(project.technologies)}</p>
            <div class="card-actions">
              <button class="secondary-btn view-project" type="button">View Project</button>
              <a href="${project.github}" class="secondary-btn" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="profile-section">
      <h3>Experience</h3>
      <div class="experience-list">
        ${(profileUser.experienceHistory || []).map((exp) => `
          <div class="experience-card">
            <h4>${escapeHTML(exp.role)}</h4>
            <span class="company">${escapeHTML(exp.company)}</span>
            <p>${escapeHTML(exp.duration)}</p>
            <p>${escapeHTML(exp.summary)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="profile-section">
      <h3>Achievements</h3>
      <div class="achievement-grid">
        ${(profileUser.achievements || []).map((achievement) => `
          <div class="achievement-card">
            <h4>${escapeHTML(achievement.title)}</h4>
            <p>${escapeHTML(achievement.type)} • ${escapeHTML(achievement.year)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="profile-section">
      <h3>Reviews</h3>
      <div class="review-grid">
        ${(profileUser.reviews || []).map((review) => `
          <div class="review-card">
            <div class="review-stars">${'★'.repeat(review.rating)}</div>
            <strong>${escapeHTML(review.name)}</strong>
            <p>“${escapeHTML(review.text)}”</p>
          </div>
        `).join('')}
      </div>
    </section>

    ${canRequest ? `
      <div class="request-action">
        <button class="primary-btn request-button" id="open-request-modal" type="button">
          ${requestExists ? 'Request Sent' : 'Send Connection Request'}
        </button>
        <button class="secondary-btn" id="start-profile-call" type="button">Call now</button>
      </div>
    ` : ''}
  `;

  const requestButton = document.getElementById('open-request-modal');
  if (requestButton && requestExists) {
    requestButton.disabled = true;
    requestButton.style.opacity = '0.75';
  }

  document.getElementById('start-profile-call')?.addEventListener('click', () => {
    const skill = profileUser.skillsToLearn[0] || profileUser.skills[0] || 'Skill exchange';
    localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ mentorId: profileUser.id, skill }));
    window.location.href = `video-session.html?mentorId=${encodeURIComponent(profileUser.id)}&skill=${encodeURIComponent(skill)}`;
  });

  setTimeout(() => setupGenericButtons(), 0);
}

function renderEditableProfile(user, isSetup = false) {
  const skillsText = (user.skills || []).join(', ');
  const learnText = (user.skillsToLearn || []).join(', ');

  return `
    <section class="profile-section">
      <h2>${isSetup ? 'Build your profile' : 'My Profile'}</h2>
      ${isSetup ? '<p>Tell the community what you know and what you would like to learn.</p>' : ''}
      <form id="edit-profile-form" class="edit-profile-form">
        <div class="field-group">
          <label for="edit-name">Name</label>
          <input id="edit-name" name="name" value="${escapeHTML(user.name)}" required />
        </div>

        <div class="field-group">
          <label for="edit-title">Professional Title</label>
          <input id="edit-title" name="title" value="${escapeHTML(user.title)}" required />
        </div>

        <div class="field-group full">
          <label for="edit-bio">Bio</label>
          <textarea id="edit-bio" name="bio" required>${escapeHTML(user.bio)}</textarea>
        </div>

        <div class="field-group">
          <label for="edit-location">Location</label>
          <input id="edit-location" name="location" value="${escapeHTML(user.location)}" />
        </div>

        <div class="field-group">
          <label for="edit-education">Education</label>
          <input id="edit-education" name="education" value="${escapeHTML(user.education)}" />
        </div>

        <div class="field-group">
          <label for="edit-experience">Experience</label>
          <select id="edit-experience" name="experience">
            <option value="Beginner" ${user.experience === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Intermediate" ${user.experience === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="Advanced" ${user.experience === 'Advanced' ? 'selected' : ''}>Advanced</option>
          </select>
        </div>

        <div class="field-group">
          <label for="edit-availability">Availability</label>
          <select id="edit-availability" name="availability">
            <option value="Available" ${user.availability === 'Available' ? 'selected' : ''}>Available</option>
            <option value="Busy" ${user.availability === 'Busy' ? 'selected' : ''}>Busy</option>
          </select>
        </div>

        <div class="field-group full">
          <label for="edit-skills">Skills (comma separated)</label>
          <input id="edit-skills" name="skills" value="${escapeHTML(skillsText)}" placeholder="e.g. JavaScript, Figma" required />
        </div>

        <div class="field-group full">
          <label for="edit-skills-learn">Skills I Want to Learn (comma separated)</label>
          <input id="edit-skills-learn" name="skillsToLearn" value="${escapeHTML(learnText)}" placeholder="e.g. Python, UI/UX" required />
        </div>

        <div class="field-group full">
          <label for="edit-photo">Profile Photo URL</label>
          <input id="edit-photo" name="photo" value="${escapeHTML(user.photo)}" />
        </div>

        <button type="submit" class="primary-btn save-profile-btn">Save Profile</button>
      </form>
    </section>
  `;
}

function bindProfileFormSave(isSetup = false) {
  const form = document.getElementById('edit-profile-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const currentUser = getCurrentUser();
    const nextUser = {
      ...currentUser,
      name: formData.get('name'),
      title: formData.get('title'),
      bio: formData.get('bio'),
      location: formData.get('location'),
      education: formData.get('education'),
      experience: formData.get('experience'),
      availability: formData.get('availability'),
      skills: String(formData.get('skills')).split(',').map((item) => item.trim()).filter(Boolean),
      skillsToLearn: String(formData.get('skillsToLearn')).split(',').map((item) => item.trim()).filter(Boolean),
      photo: formData.get('photo') || currentUser.photo
    };

    const users = window.skillExchangeData.getUsers();
    const userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex >= 0) {
      users[userIndex] = nextUser;
      window.skillExchangeData.saveUsers(users);
      localStorage.setItem('skillExchangeCurrentUser', JSON.stringify(nextUser));
      if (isSetup) {
        localStorage.setItem(`skillExchangeProfileComplete:${nextUser.id}`, 'true');
        window.location.href = 'search.html';
      } else {
        showToast('Profile updated successfully!');
        window.location.reload();
      }
    }
  });
}

function bindProfileModal() {
  const modal = document.getElementById('request-modal');
  const openButton = document.getElementById('open-request-modal');
  const cancelButton = document.getElementById('cancel-request');
  const closeButton = document.querySelector('.close-modal');
  const sendButton = document.getElementById('send-request-btn');

  if (!modal || !openButton) return;

  const profileId = localStorage.getItem('skillExchangeSelectedProfile');
  const targetUser = findUserById(profileId) || getCurrentUser();
  const description = document.getElementById('request-modal-description');

  if (description) {
    description.textContent = `You are requesting to connect with ${targetUser.name} to learn ${targetUser.skills[0] || 'a new skill'}.`;
  }

  openButton.addEventListener('click', () => {
    if (currentUserRequestExists(targetUser.id)) {
      showToast('Request already sent.');
      return;
    }
    modal.classList.remove('hidden');
  });

  const closeModal = () => modal.classList.add('hidden');
  cancelButton?.addEventListener('click', closeModal);
  closeButton?.addEventListener('click', closeModal);

  sendButton?.addEventListener('click', () => {
    const requestMessage = document.getElementById('request-message').value.trim();
    const requests = getStoredRequests();

    if (currentUserRequestExists(targetUser.id)) {
      showToast('Connection request already sent.');
      closeModal();
      return;
    }

    requests.push({
      id: `req-${Date.now()}`,
      fromUserId: getCurrentUser().id,
      toUserId: targetUser.id,
      skill: targetUser.skills[0] || 'general learning',
      status: 'pending',
      message: requestMessage,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem('skillExchangeRequests', JSON.stringify(requests));
    closeModal();
    showToast('Connection request sent successfully!');
    window.location.reload();
  });
}
