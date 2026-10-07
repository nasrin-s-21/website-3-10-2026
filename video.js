document.addEventListener('DOMContentLoaded', () => {
  initializeVideoSession();
});

function initializeVideoSession() {
  const params = new URLSearchParams(window.location.search);
  const mentorId = params.get('mentorId') || 'arun-kumar';
  const skill = params.get('skill') || 'Python';
  const mentor = findUserById(mentorId) || findUserById('arun-kumar');
  const currentUser = getCurrentUser();
  const currentName = currentUser.name || 'You';

  const sessionSkill = document.getElementById('session-skill');
  const sessionMentor = document.getElementById('session-mentor');
  const mentorPersonName = document.getElementById('mentor-person-name');
  const localPersonName = document.getElementById('local-user-name');

  if (sessionSkill) sessionSkill.textContent = skill;
  if (sessionMentor) sessionMentor.textContent = mentor ? mentor.name : 'Arun Kumar';
  if (mentorPersonName) mentorPersonName.textContent = mentor ? mentor.name : 'Arun Kumar';
  if (localPersonName) localPersonName.textContent = currentName;

  localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ mentorId, skill }));

  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendChatButton = document.getElementById('send-chat');

  const defaultMessages = [
    { sender: mentor ? mentor.name.split(' ')[0] : 'Mentor', text: `Let's start with ${skill} and work through a practical example.` },
    { sender: currentName.split(' ')[0], text: `I would like to practice ${skill}.` }
  ];

  function renderChat(messages) {
    if (!chatMessages) return;
    chatMessages.innerHTML = messages.map((message) => `
      <div class="chat-bubble ${message.sender === 'Keerthana' ? 'self' : 'other'}">
        <strong>${message.sender}</strong>
        <span>${message.text}</span>
      </div>
    `).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  renderChat(defaultMessages);

  const sendMessage = () => {
    const text = (chatInput ? chatInput.value : '').trim();
    if (!text) return;

    const messages = JSON.parse(localStorage.getItem('skillExchangeChatMessages') || '[]');
    messages.push({ sender: currentName.split(' ')[0], text });
    messages.push({ sender: mentor ? mentor.name.split(' ')[0] : 'Arun', text: 'Absolutely! Let’s work through it step by step.' });
    localStorage.setItem('skillExchangeChatMessages', JSON.stringify(messages));

    renderChat(messages);
    if (chatInput) chatInput.value = '';
  };

  sendChatButton?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  const localVideo = document.getElementById('local-video');
  const mentorVideo = document.getElementById('mentor-video');

  const micToggle = document.querySelector('[data-control="mic"]');
  const cameraToggle = document.querySelector('[data-control="camera"]');
  const screenToggle = document.querySelector('[data-control="screen"]');
  const chatToggle = document.querySelector('[data-control="chat"]');
  const endSession = document.querySelector('[data-control="end"]');

  let micOn = true;
  let cameraOn = true;
  let screenSharing = false;
  let stream = null;

  const showPermissionMessage = () => {
    const msg = 'Camera and microphone access are not available in this browser, so this is a frontend prototype only.';
    showToast(msg);
    if (chatMessages) {
      chatMessages.insertAdjacentHTML('beforeend', `<div class="chat-bubble other"><strong>System</strong><span>${msg}</span></div>`);
    }
  };

  async function activateUserMedia() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showPermissionMessage();
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideo) {
        localVideo.srcObject = stream;
      }
    } catch (error) {
      showPermissionMessage();
    }
  }

  micToggle?.addEventListener('click', () => {
    micOn = !micOn;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = micOn;
      });
    }
    showToast(micOn ? 'Microphone on.' : 'Microphone off.');
  });

  cameraToggle?.addEventListener('click', () => {
    cameraOn = !cameraOn;
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = cameraOn;
      });
    }
    showToast(cameraOn ? 'Camera on.' : 'Camera off.');
  });

  screenToggle?.addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      showToast('Screen sharing is not available in this browser.');
      return;
    }

    screenSharing = !screenSharing;
    if (screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (mentorVideo) {
          mentorVideo.srcObject = screenStream;
        }
        showToast('Screen sharing started.');
      } catch (error) {
        showToast('Screen share permissions were not granted.');
      }
    } else {
      if (mentorVideo) {
        mentorVideo.srcObject = null;
      }
      showToast('Screen sharing stopped.');
    }
  });

  chatToggle?.addEventListener('click', () => {
    const panel = document.querySelector('.chat-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    showToast('Chat opened.');
  });

  endSession?.addEventListener('click', () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    localStorage.setItem('skillExchangeSessionMeta', JSON.stringify({ mentorId, skill, endedAt: new Date().toISOString() }));
    window.location.href = 'review.html';
  });

  if (localVideo) {
    activateUserMedia();
  }

  if (mentorVideo) {
    mentorVideo.poster = mentor ? mentor.photo : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80';
  }
}
