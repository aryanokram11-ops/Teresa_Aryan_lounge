// Theme Manager & Persistence[cite: 8]
function toggleTheme() {
  playSound('click');
  const htmlEl = document.documentElement;
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('lounge_theme', newTheme);
  document.getElementById('theme-toggle-btn').innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('lounge_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle-btn').innerText = savedTheme === 'dark' ? '☀️' : '🌙';

  const heartsBg = document.getElementById('hearts-bg');
  const symbols = ['🐶', '🐾', '💖', '🦴', '✨', '💕', '🐕', '❤️'];
  
  if (heartsBg) {
    for (let i = 0; i < 18; i++) {
      const item = document.createElement('div');
      item.className = 'heart-particle';
      item.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = Math.random() * 100 + 'vw';
      item.style.animationDuration = (6 + Math.random() * 6) + 's';
      item.style.animationDelay = (Math.random() * 5) + 's';
      item.style.fontSize = (16 + Math.random() * 16) + 'px';
      heartsBg.appendChild(item);
    }
  }

  if (myRole) {
    const tttSelect = document.getElementById('ttt-select-box');
    const tttLocked = document.getElementById('ttt-locked-box');
    const roleDisp = document.getElementById('role-display');
    if (tttSelect) tttSelect.classList.add('hidden-section');
    if (tttLocked) tttLocked.classList.remove('hidden-section');
    if (roleDisp) roleDisp.innerText = `You are playing as: ${myRole}`;
  }

  if (myDuelRole) {
    const duelSelect = document.getElementById('duel-select-box');
    const duelLocked = document.getElementById('duel-locked-box');
    const duelId = document.getElementById('duel-identity');
    if (duelSelect) duelSelect.classList.add('hidden-section');
    if (duelLocked) duelLocked.classList.remove('hidden-section');
    if (duelId) duelId.innerText = `You are playing as: ${myDuelRole}`;
  }

  const savedCode = localStorage.getItem('lounge_partner_code');
  if (savedCode) {
    currentPartnerCode = savedCode;
    const roomInput = document.getElementById('room-input');
    if (roomInput) roomInput.value = savedCode;
  }

  joinRoom(true);
  setupTapHeartBurst();
});

// ================= TAP-ANYWHERE HEART BURST =================
const tapHeartSymbols = ['💖', '💕', '💗', '🐾'];

function setupTapHeartBurst() {
  const layer = document.getElementById('tap-heart-layer');
  if (!layer) return;

  document.addEventListener('pointerdown', (event) => {
    const heart = document.createElement('div');
    heart.className = 'tap-heart';
    heart.innerText = tapHeartSymbols[Math.floor(Math.random() * tapHeartSymbols.length)];
    heart.style.left = event.clientX + 'px';
    heart.style.top = event.clientY + 'px';
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  });
}

// Web Audio API Sound Synthesizer[cite: 8]
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  initAudio();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'win') {
    const barkFreqs = [450, 550, 450, 650, 800];
    barkFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.linearRampToValueAtTime(freq + 100, now + idx * 0.08 + 0.05);
      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.07);
    });
  } else if (type === 'wrong') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.35);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }
}

function showSection(sectionId) {
  playSound('click');
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.add('hidden-section');
    sec.classList.remove('active-section');
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active-section');
    targetSection.classList.remove('hidden-section');
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });
}

function selectGame(gameId) {
  playSound('click');
  const menu = document.getElementById('game-selection-menu');
  if (menu) menu.classList.add('hidden-section');
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));

  if (gameId === 'tictactoe') {
    const tttGame = document.getElementById('tictactoe-game');
    if (tttGame) tttGame.classList.remove('hidden-section');
  } else if (gameId === 'guessing') {
    const guessGame = document.getElementById('guessing-game');
    if (guessGame) guessGame.classList.remove('hidden-section');
  } else if (gameId === 'rps') {
    const rpsGame = document.getElementById('rps-game');
    if (rpsGame) rpsGame.classList.remove('hidden-section');
  }
}

function backToGameList() {
  playSound('click');
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));
  const menu = document.getElementById('game-selection-menu');
  if (menu) menu.classList.remove('hidden-section');
}

// ================= YOUTUBE WATCH PARTY SYNC[cite: 8] =================
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag && firstScriptTag.parentNode) {
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let player;
let isRemoteAction = false;
let currentHostId = null;
let lastWatchPartyState = null;
let localPlayerIsPlaying = false;
let heartbeatInterval = null;
let currentLoadedVideoId = null;

function isCurrentHost() {
  return currentHostId === 'BOTH_HOSTS' || currentHostId === myClientId;
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'playsinline': 1,
      'controls': 1,
      'fs': 1,
      'autoplay': 0,
      'enablejsapi': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  console.log("Watch Party Player Ready 📺");
  // Catch late joiners up to whatever's already playing
  if (lastWatchPartyState) {
    applyRemoteWatchPartyState(lastWatchPartyState);
  }
  if (!heartbeatInterval) {
    heartbeatInterval = setInterval(sendHeartbeatSync, 4000);
  }
}

function applyRemoteWatchPartyState(wp) {
  if (!player || typeof player.loadVideoById !== 'function') return;
  if (wp.updatedBy && wp.updatedBy === myClientId) return;

  isRemoteAction = true;
  const networkDelay = Math.max(0, (Date.now() - (wp.timestamp || Date.now())) / 1000);
  const targetTime = Math.max(0, (wp.time || 0) + ((wp.action === 'PLAY' || wp.action === 'SYNC') ? networkDelay : 0));

  if (wp.videoId && wp.videoId !== currentLoadedVideoId) {
    currentLoadedVideoId = wp.videoId;
    player.loadVideoById(wp.videoId, targetTime);
    if (wp.action === 'PAUSE') {
      setTimeout(() => { if (player && player.pauseVideo) player.pauseVideo(); }, 500);
    }
  } else if (player.getCurrentTime && player.getPlayerState) {
    const localTime = player.getCurrentTime();
    if (Math.abs(localTime - targetTime) > 1) {
      player.seekTo(targetTime, true);
    }
    if (wp.action === 'PLAY') {
      player.playVideo();
    } else if (wp.action === 'PAUSE') {
      player.pauseVideo();
    }
  }

  setTimeout(() => { isRemoteAction = false; }, 600);
}

function sendHeartbeatSync() {
  if (!isCurrentHost() || !localPlayerIsPlaying) return;
  if (!player || typeof player.getCurrentTime !== 'function') return;
  if (isRemoteAction) return;

  roomRef.child('watchParty').set({
    action: 'SYNC',
    videoId: currentLoadedVideoId,
    time: player.getCurrentTime(),
    updatedBy: myClientId,
    timestamp: Date.now()
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) localPlayerIsPlaying = true;
  if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) localPlayerIsPlaying = false;

  if (isRemoteAction) return;
  if (!isCurrentHost()) return;
  if (!player || typeof player.getCurrentTime !== 'function') return;

  const currentTime = player.getCurrentTime();
  if (event.data === YT.PlayerState.PLAYING) {
    roomRef.child('watchParty').set({
      action: 'PLAY',
      videoId: currentLoadedVideoId,
      time: currentTime,
      updatedBy: myClientId,
      timestamp: Date.now()
    });
  } else if (event.data === YT.PlayerState.PAUSED) {
    roomRef.child('watchParty').set({
      action: 'PAUSE',
      videoId: currentLoadedVideoId,
      time: currentTime,
      updatedBy: myClientId,
      timestamp: Date.now()
    });
  } else if (event.data === YT.PlayerState.ENDED) {
    playNextInQueue();
  }
}

function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function loadVideoIdNow(videoId) {
  if (currentHostId !== 'BOTH_HOSTS' && currentHostId !== myClientId) {
    alert("Only the current Host can play videos! Click 'Claim Host' to take control 👑");
    return false;
  }
  if (!player || typeof player.loadVideoById !== 'function') return false;

  currentLoadedVideoId = videoId;
  player.loadVideoById(videoId);
  roomRef.child('watchParty').set({
    action: 'LOAD',
    videoId: videoId,
    time: 0,
    updatedBy: myClientId,
    timestamp: Date.now()
  });
  return true;
}

function loadPastedVideo() {
  playSound('click');
  const videoInput = document.getElementById('video-url-input');
  if (!videoInput) return;
  const videoId = extractVideoId(videoInput.value.trim());

  if (!videoId) return alert("Please enter a valid YouTube link! 🥺");
  if (loadVideoIdNow(videoId)) videoInput.value = '';
}

// ================= WATCH QUEUE =================
function addToQueue() {
  playSound('click');
  const videoInput = document.getElementById('video-url-input');
  if (!videoInput) return;
  const videoId = extractVideoId(videoInput.value.trim());
  if (!videoId) return alert("Please enter a valid YouTube link! 🥺");

  queueRef.push({
    videoId: videoId,
    addedBy: myClientId,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  videoInput.value = '';
}

function renderQueue(queue) {
  const list = document.getElementById('queue-list');
  if (!list) return;
  const keys = Object.keys(queue || {});

  if (keys.length === 0) {
    list.innerHTML = '<li class="queue-empty">Queue\'s empty — add a video above! 🐾</li>';
    return;
  }

  list.innerHTML = keys.map(key => {
    const item = queue[key];
    const mine = item.addedBy === myClientId ? 'You' : 'Partner';
    return `
      <li class="queue-item">
        <img src="https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg" alt="Queued video thumbnail">
        <div class="queue-item-info">Added by ${mine}</div>
        <div class="queue-item-actions">
          <button onclick="playQueueItem('${key}')">▶️</button>
          <button class="remove-btn" onclick="removeQueueItem('${key}')">✕</button>
        </div>
      </li>
    `;
  }).join('');
}

function playQueueItem(key) {
  playSound('click');
  const item = queueData[key];
  if (!item) return;
  if (loadVideoIdNow(item.videoId)) {
    queueRef.child(key).remove();
  }
}

function removeQueueItem(key) {
  playSound('click');
  queueRef.child(key).remove();
}

function playNextInQueue() {
  if (!isCurrentHost()) return;
  const keys = Object.keys(queueData || {});
  if (keys.length === 0) return;
  playQueueItem(keys[0]);
}

// ================= LIVE REACTIONS =================
function sendReaction(emoji) {
  playSound('click');
  const ref = reactionsRef.push({ emoji, from: myClientId, timestamp: Date.now() });
  setTimeout(() => ref.remove(), 4000);
}

function spawnFloatingReaction(emoji) {
  const layer = document.getElementById('reactions-layer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'floating-reaction';
  el.innerText = emoji;
  el.style.left = (10 + Math.random() * 75) + '%';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}

// ================= INSTANT HOST CLAIM SYSTEM[cite: 8] =================
function claimHostRole() {
  playSound('click');
  roomRef.child('hostId').set(myClientId);
}

// ================= FIREBASE CONFIG & SYNC[cite: 8] =================
const firebaseConfig = {
  databaseURL: "https://assistant-98715-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let currentPartnerCode = "love-lounge";
let roomRef = db.ref('rooms/' + currentPartnerCode);
let queueRef = db.ref('queues/' + currentPartnerCode);
let albumRef = db.ref('albums/' + currentPartnerCode);
let reactionsRef = db.ref('reactions_live/' + currentPartnerCode);
let myPresenceRef = null;

let myClientId = localStorage.getItem('lounge_client_id');
if (!myClientId) {
  myClientId = 'client_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('lounge_client_id', myClientId);
}

let myRole = localStorage.getItem('lounge_ttt_role') || null;
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
const winningConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

let myDuelRole = localStorage.getItem('lounge_duel_role') || null;
let duelData = { aryanSecret: null, teresaSecret: null, currentTurn: 'Aryan', feedback: 'Set secrets to begin!', winner: null, aryanHistory: [], teresaHistory: [], roles: {} };

let queueData = {};
let albumData = {};
let currentAlbumKey = null;

function setupPresence() {
  if (myPresenceRef) myPresenceRef.remove();
  myPresenceRef = roomRef.child('presence').push();
  myPresenceRef.onDisconnect().remove();
  myPresenceRef.set({ online: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
}

function listenToRoom() {
  roomRef.off();
  roomRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const statusEl = document.getElementById('room-status');
    if (data) {
      const presenceObj = data.presence || {};
      const activeCount = Object.keys(presenceObj).length;

      if (statusEl) {
        if (activeCount >= 2) {
          statusEl.innerText = `Puppy Partner Connected! 🐶🐾`;
          statusEl.style.color = "#2ed573";
          statusEl.classList.add('connected');
        } else {
          statusEl.innerText = `Waiting for puppy partner... ⏳🐕`;
          statusEl.style.color = "var(--primary-pink)";
          statusEl.classList.remove('connected');
        }
      }

      currentHostId = data.hostId || null;
      const hostBadge = document.getElementById('host-badge');
      const nonHostShield = document.getElementById('non-host-shield');

      if (hostBadge && nonHostShield) {
        if (currentHostId === 'BOTH_HOSTS') {
          hostBadge.innerText = "👑 Co-Host: Both of You! 💕";
          nonHostShield.classList.add('hidden-section');
        } else if (currentHostId === myClientId) {
          hostBadge.innerText = "👑 Host: You";
          nonHostShield.classList.add('hidden-section');
        } else if (currentHostId) {
          hostBadge.innerText = "👑 Host: Partner";
          nonHostShield.classList.remove('hidden-section');
        } else {
          hostBadge.innerText = "👑 Host: Not Decided";
          nonHostShield.classList.add('hidden-section');
        }
      }

      if (data.ticTacToe) {
        boardState = data.ticTacToe.boardState || ['', '', '', '', '', '', '', '', ''];
        currentPlayer = data.ticTacToe.currentPlayer || 'X';
        gameActive = data.ticTacToe.gameActive !== undefined ? data.ticTacToe.gameActive : true;
        updateUI();
        checkResult();
      }

      if (data.secretDuel) {
        duelData = data.secretDuel;
        updateDuelUI();
      }

      if (data.interactiveRps) {
        checkInteractiveRpsOutcome(data.interactiveRps);
      }

      if (typeof data.loveMeter === 'number') {
        updateLoveMeterUI(data.loveMeter);
      }

      if (data.hugs) {
        checkForNewHug(data.hugs);
      }

      updateTypingIndicator(data.typing || {});

      if (data.watchParty) {
        lastWatchPartyState = data.watchParty;
        if (player && typeof player.loadVideoById === 'function') {
          applyRemoteWatchPartyState(data.watchParty);
        }
      }
    } else {
      if (statusEl) statusEl.innerText = `Waiting for puppy partner... ⏳🐕`;
    }
  });

  roomRef.child('chatMessages').off();
  roomRef.child('chatMessages').on('child_added', (snapshot) => {
    appendChatMessage(snapshot.val());
  });

  queueRef.off();
  queueRef.on('value', (snapshot) => {
    queueData = snapshot.val() || {};
    renderQueue(queueData);
  });

  albumRef.off();
  albumRef.on('value', (snapshot) => {
    albumData = snapshot.val() || {};
    renderAlbum(albumData);
  });

  reactionsRef.off();
  reactionsRef.on('child_added', (snapshot) => {
    const reaction = snapshot.val();
    if (reaction) spawnFloatingReaction(reaction.emoji);
  });
}

function joinRoom(isAuto = false) {
  if (!isAuto) playSound('click');
  const roomInput = document.getElementById('room-input');
  if (!roomInput) return;
  const inputCode = roomInput.value.trim();
  if (!inputCode) return alert("Please enter a partner code! 🐾");
  
  currentPartnerCode = inputCode;
  localStorage.setItem('lounge_partner_code', currentPartnerCode);
  roomRef = db.ref('rooms/' + currentPartnerCode);
  queueRef = db.ref('queues/' + currentPartnerCode);
  albumRef = db.ref('albums/' + currentPartnerCode);
  reactionsRef = db.ref('reactions_live/' + currentPartnerCode);
  
  const chatContainer = document.getElementById('chat-messages-container');
  if (chatContainer) chatContainer.innerHTML = '';
  const albumGrid = document.getElementById('album-grid');
  if (albumGrid) albumGrid.innerHTML = '<p id="album-empty-msg" class="album-empty">No memories yet — upload your first photo or video together! 💕</p>';
  
  const inputRow = document.getElementById('room-input-row');
  const connectedDisplay = document.getElementById('room-connected-display');
  const codeLabel = document.getElementById('active-code-label');
  
  if (inputRow) inputRow.classList.add('hidden-section');
  if (connectedDisplay) connectedDisplay.classList.remove('hidden-section');
  if (codeLabel) codeLabel.innerText = `Code: ${currentPartnerCode}`;

  setupPresence();
  listenToRoom();
}

function editPartnerCode() {
  playSound('click');
  const inputRow = document.getElementById('room-input-row');
  const connectedDisplay = document.getElementById('room-connected-display');
  if (inputRow) inputRow.classList.remove('hidden-section');
  if (connectedDisplay) connectedDisplay.classList.add('hidden-section');
}

// ================= CHAT & MEDIA SHARING[cite: 8] =================
function handleChatKeyDown(event) {
  if (event.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chat-text-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  roomRef.child('chatMessages').push({
    sender: myClientId,
    text: text,
    type: 'text',
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  input.value = '';
}

function handleMediaUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    roomRef.child('chatMessages').push({
      sender: myClientId,
      mediaUrl: e.target.result,
      type: 'media',
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  };
  reader.readAsDataURL(file);
}

function appendChatMessage(msg) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'chat-msg' + (msg.sender === myClientId ? ' mine' : '');

  if (msg.type === 'media') {
    div.innerHTML = `<img src="${msg.mediaUrl}" alt="Shared image">`;
  } else {
    div.innerText = msg.text;
  }

  div.addEventListener('dblclick', () => {
    const reaction = document.createElement('span');
    reaction.className = 'msg-heart-reaction';
    reaction.innerText = '💖';
    div.appendChild(reaction);
    setTimeout(() => reaction.remove(), 1000);
  });

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ================= LOVE METER =================
let lastKnownLoveCount = null;

function sendLoveTap() {
  playSound('click');
  roomRef.child('loveMeter').transaction((current) => (current || 0) + 1);
}

function updateLoveMeterUI(count) {
  const countEl = document.getElementById('love-meter-count');
  const btn = document.getElementById('love-meter-btn');
  if (countEl) countEl.innerText = count;

  if (btn && lastKnownLoveCount !== null && count > lastKnownLoveCount) {
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 400);
  }
  lastKnownLoveCount = count;
}

// ================= HUG / KISS OVERLAY =================
let lastSeenHugTimestamp = Date.now();

function sendHug() {
  playSound('click');
  const hugPayload = { from: myClientId, timestamp: Date.now() };
  roomRef.child('hugs').set(hugPayload);
  showHugOverlay('You sent a big puppy hug! 🤗💕');
}

function checkForNewHug(hugData) {
  if (!hugData || !hugData.timestamp) return;
  if (hugData.from === myClientId) return;
  if (hugData.timestamp <= lastSeenHugTimestamp) return;

  lastSeenHugTimestamp = hugData.timestamp;
  showHugOverlay('Your puppy partner sent you a hug! 🤗💖');
}

function showHugOverlay(message) {
  const overlay = document.getElementById('hug-overlay');
  const text = document.getElementById('hug-overlay-text');
  if (!overlay) return;
  if (text) text.innerText = message;
  overlay.classList.remove('hidden-section');
  playSound('win');
  setTimeout(() => overlay.classList.add('hidden-section'), 2200);
}

// ================= TYPING INDICATOR =================
let typingTimeout = null;

function notifyTyping() {
  if (!roomRef) return;
  roomRef.child('typing/' + myClientId).set(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    roomRef.child('typing/' + myClientId).remove();
  }, 1500);
}

function updateTypingIndicator(typingData) {
  const indicator = document.getElementById('typing-indicator');
  if (!indicator) return;
  const partnerTyping = Object.keys(typingData).some(id => id !== myClientId && typingData[id]);
  indicator.classList.toggle('hidden-section', !partnerTyping);
}

// ================= MEMORY LANE / SHARED ALBUM =================
const ALBUM_MAX_VIDEO_MB = 15;
const ALBUM_IMAGE_MAX_WIDTH = 1280;

function handleAlbumUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const statusEl = document.getElementById('album-upload-status');
  let remaining = files.length;
  if (statusEl) statusEl.innerText = `Uploading 0/${files.length}...`;

  files.forEach((file) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) { remaining--; return; }

    if (isVideo && file.size > ALBUM_MAX_VIDEO_MB * 1024 * 1024) {
      alert(`"${file.name}" is over ${ALBUM_MAX_VIDEO_MB}MB. Please trim or compress it before uploading. 🎬`);
      remaining--;
      if (statusEl && remaining <= 0) statusEl.innerText = '';
      return;
    }

    const finishOne = (dataUrl) => {
      albumRef.push({
        type: isVideo ? 'video' : 'image',
        dataUrl: dataUrl,
        uploadedBy: myClientId,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
      remaining--;
      if (statusEl) {
        statusEl.innerText = remaining > 0 ? `Uploading ${files.length - remaining}/${files.length}...` : 'All done! 💕';
        if (remaining <= 0) setTimeout(() => { statusEl.innerText = ''; }, 2000);
      }
    };

    if (isImage) {
      compressImageFile(file, ALBUM_IMAGE_MAX_WIDTH, 0.82).then(finishOne).catch(() => remaining--);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => finishOne(e.target.result);
      reader.readAsDataURL(file);
    }
  });

  event.target.value = '';
}

function compressImageFile(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderAlbum(album) {
  const grid = document.getElementById('album-grid');
  if (!grid) return;
  const keys = Object.keys(album || {}).sort((a, b) => (album[a].timestamp || 0) - (album[b].timestamp || 0));

  if (keys.length === 0) {
    grid.innerHTML = '<p id="album-empty-msg" class="album-empty">No memories yet — upload your first photo or video together! 💕</p>';
    return;
  }

  grid.innerHTML = keys.map((key) => {
    const item = album[key];
    const media = item.type === 'video'
      ? `<video src="${item.dataUrl}" muted preload="metadata"></video>`
      : `<img src="${item.dataUrl}" alt="Shared memory">`;
    const dateLabel = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';
    return `
      <div class="album-item" onclick="openAlbumLightbox('${key}')">
        ${media}
        <span class="album-type-badge">${item.type === 'video' ? '🎬' : '🖼️'}</span>
        <span class="album-date-tag">${dateLabel}</span>
      </div>
    `;
  }).reverse().join('');
}

function openAlbumLightbox(key) {
  const item = albumData[key];
  if (!item) return;
  currentAlbumKey = key;

  const lightbox = document.getElementById('album-lightbox');
  const mediaBox = document.getElementById('album-lightbox-media');
  const dateEl = document.getElementById('album-lightbox-date');
  if (!lightbox || !mediaBox) return;

  mediaBox.innerHTML = item.type === 'video'
    ? `<video src="${item.dataUrl}" controls autoplay playsinline></video>`
    : `<img src="${item.dataUrl}" alt="Shared memory">`;
  if (dateEl) dateEl.innerText = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';

  lightbox.classList.remove('hidden-section');
}

function closeAlbumLightbox() {
  const lightbox = document.getElementById('album-lightbox');
  const mediaBox = document.getElementById('album-lightbox-media');
  if (lightbox) lightbox.classList.add('hidden-section');
  if (mediaBox) mediaBox.innerHTML = '';
  currentAlbumKey = null;
}

function deleteCurrentAlbumItem() {
  if (!currentAlbumKey) return;
  albumRef.child(currentAlbumKey).remove();
  closeAlbumLightbox();
}

// ================= GAME FUNCTIONS[cite: 8] =================
function setRole(role) {
  playSound('click');
  myRole = role;
  localStorage.setItem('lounge_ttt_role', role);
  const tttSelect = document.getElementById('ttt-select-box');
  const tttLocked = document.getElementById('ttt-locked-box');
  const roleDisp = document.getElementById('role-display');
  if (tttSelect) tttSelect.classList.add('hidden-section');
  if (tttLocked) tttLocked.classList.remove('hidden-section');
  if (roleDisp) roleDisp.innerText = `You are playing as: ${myRole}`;
}

function resetRoleSelection(gameType) {
  playSound('click');
  if (gameType === 'ttt') {
    localStorage.removeItem('lounge_ttt_role');
    myRole = null;
    const tttSelect = document.getElementById('ttt-select-box');
    const tttLocked = document.getElementById('ttt-locked-box');
    if (tttSelect) tttSelect.classList.remove('hidden-section');
    if (tttLocked) tttLocked.classList.add('hidden-section');
  } else if (gameType === 'duel') {
    localStorage.removeItem('lounge_duel_role');
    myDuelRole = null;
    const duelSelect = document.getElementById('duel-select-box');
    const duelLocked = document.getElementById('duel-locked-box');
    if (duelSelect) duelSelect.classList.remove('hidden-section');
    if (duelLocked) duelLocked.classList.add('hidden-section');
  }
}

function makeMove(index) {
  if (!myRole) return alert("Select Player X or O first! ✨");
  if (boardState[index] !== '' || !gameActive) return;
  if (currentPlayer !== myRole) return alert(`It's Player ${currentPlayer}'s turn!`);

  playSound('click');
  boardState[index] = currentPlayer;
  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
  roomRef.child('ticTacToe').set({ boardState, currentPlayer: nextPlayer, gameActive });
}

function updateUI() {
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < 9 && cells[i]; i++) cells[i].innerText = boardState[i];
  const statusEl = document.getElementById('status');
  if (gameActive && statusEl) statusEl.innerText = `Player ${currentPlayer}'s Turn 🐾`;
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    let [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      roundWon = true; break;
    }
  }
  const statusEl = document.getElementById('status');
  if (roundWon) {
    const winner = currentPlayer === 'X' ? 'O' : 'X';
    if (statusEl) statusEl.innerText = `🎉 Player ${winner} Wins! 🐶💕`;
    gameActive = false;
    playSound('win');
    return;
  }
  if (!boardState.includes('')) {
    if (statusEl) statusEl.innerText = "It's a Puppy Draw! 🤝🐾";
    gameActive = false;
    playSound('wrong');
  }
}

function resetGame() {
  playSound('click');
  roomRef.child('ticTacToe').set({ boardState: ['', '', '', '', '', '', '', '', ''], currentPlayer: 'X', gameActive: true });
}

function setDuelPlayer(role) {
  playSound('click');
  myDuelRole = role;
  localStorage.setItem('lounge_duel_role', role);
  const duelSelect = document.getElementById('duel-select-box');
  const duelLocked = document.getElementById('duel-locked-box');
  const duelId = document.getElementById('duel-identity');
  if (duelSelect) duelSelect.classList.add('hidden-section');
  if (duelLocked) duelLocked.classList.remove('hidden-section');
  if (duelId) duelId.innerText = `You are playing as: ${role}`;
  updateDuelUI();
}

function lockSecretNumber() {
  if (!myDuelRole) return alert("Select identity first! ✨");
  const secretInput = document.getElementById('secret-input');
  if (!secretInput) return;
  const val = parseInt(secretInput.value);
  if (isNaN(val) || val < 1 || val > 100) return alert("Enter valid number 1-100! 🦴");

  playSound('click');
  const updateObj = {};
  if (myDuelRole === 'Aryan') updateObj.aryanSecret = val;
  else updateObj.teresaSecret = val;
  if (!duelData.currentTurn) updateObj.currentTurn = 'Aryan';

  roomRef.child('secretDuel').update(updateObj);
}

function submitDuelGuess() {
  if (!myDuelRole) return alert("Select identity first! ✨");
  const turn = duelData.currentTurn || 'Aryan';
  if (turn !== myDuelRole) return alert(`It's ${turn}'s turn! ⏳`);

  const guessInput = document.getElementById('guess-input');
  if (!guessInput) return;
  const guessVal = parseInt(guessInput.value);
  if (isNaN(guessVal) || guessVal < 1 || guessVal > 100) return alert("Enter valid number 1-100! 🦴");

  const target = myDuelRole === 'Aryan' ? duelData.teresaSecret : duelData.aryanSecret;
  const nextTurn = myDuelRole === 'Aryan' ? 'Teresa' : 'Aryan';
  let feedbackText = "", hint = "", winner = null;

  if (guessVal === target) {
    feedbackText = `🎉 ${myDuelRole} wins by sniffing out ${guessVal}! 🐶💕`;
    hint = "CORRECT 🎉"; winner = myDuelRole; playSound('win');
  } else if (guessVal < target) {
    feedbackText = `${myDuelRole} guessed ${guessVal} — Too Low! 📉`; hint = "Too Low 📉"; playSound('wrong');
  } else {
    feedbackText = `${myDuelRole} guessed ${guessVal} — Too High! 🚀`; hint = "Too High 🚀"; playSound('wrong');
  }

  guessInput.value = '';
  const aryanHistory = duelData.aryanHistory || [];
  const teresaHistory = duelData.teresaHistory || [];
  if (myDuelRole === 'Aryan') aryanHistory.push(`${guessVal} (${hint})`);
  else teresaHistory.push(`${guessVal} (${hint})`);

  roomRef.child('secretDuel').update({
    currentTurn: winner ? turn : nextTurn,
    feedback: feedbackText,
    winner: winner,
    aryanHistory: aryanHistory,
    teresaHistory: teresaHistory
  });
}

function updateDuelUI() {
  const aryanReady = duelData.aryanSecret !== undefined && duelData.aryanSecret !== null;
  const teresaReady = duelData.teresaSecret !== undefined && duelData.teresaSecret !== null;

  const setNumberBox = document.getElementById('set-number-box');
  const guessDuelBox = document.getElementById('guess-duel-box');
  const turnIndicator = document.getElementById('turn-indicator');
  const revealBox = document.getElementById('secret-reveal-box');
  const revealAryan = document.getElementById('reveal-aryan');
  const revealTeresa = document.getElementById('reveal-teresa');
  const guessFeedback = document.getElementById('guess-feedback');
  const aryanHist = document.getElementById('aryan-history');
  const teresaHist = document.getElementById('teresa-history');

  if (aryanReady && teresaReady) {
    if (setNumberBox) setNumberBox.classList.add('hidden-section');
    if (guessDuelBox) guessDuelBox.classList.remove('hidden-section');
    if (duelData.winner) {
      if (turnIndicator) turnIndicator.innerText = `Game Over! 🎉 ${duelData.winner} Wins!`;
      if (revealBox) revealBox.classList.remove('hidden-section');
      if (revealAryan) revealAryan.innerText = duelData.aryanSecret;
      if (revealTeresa) revealTeresa.innerText = duelData.teresaSecret;
    }
  } else {
    if (setNumberBox) setNumberBox.classList.remove('hidden-section');
    if (guessDuelBox) guessDuelBox.classList.add('hidden-section');
  }
  if (guessFeedback) guessFeedback.innerText = duelData.feedback || '';
  if (aryanHist) aryanHist.innerHTML = (duelData.aryanHistory || []).map(i => `<li>${i}</li>`).join('');
  if (teresaHist) teresaHist.innerHTML = (duelData.teresaHistory || []).map(i => `<li>${i}</li>`).join('');
}

function resetDuelGame() {
  playSound('click');
  roomRef.child('secretDuel').update({ aryanSecret: null, teresaSecret: null, currentTurn: 'Aryan', feedback: 'Reset!', winner: null, aryanHistory: [], teresaHistory: [] });
}

// ================= INTERACTIVE PAWS & CLAWS RPS[cite: 8] =================
function submitInteractiveRps(moveChoice) {
  playSound('click');
  const avatarMap = { 'Rock': '🐶✊', 'Paper': '🐕✋', 'Scissors': '🐩✌️' };
  
  const myAvatar = document.getElementById('my-rps-avatar');
  const myChoiceText = document.getElementById('my-rps-choice-text');
  const statusMsg = document.getElementById('rps-status-msg');

  if (myAvatar) myAvatar.innerText = avatarMap[moveChoice];
  if (myChoiceText) myChoiceText.innerText = `Chose ${moveChoice}!`;
  if (statusMsg) statusMsg.innerText = "Locked in! Waiting for partner... ⏳🐾";

  roomRef.child('interactiveRps/' + myClientId).set({
    choice: moveChoice,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

function checkInteractiveRpsOutcome(rpsData) {
  const keys = Object.keys(rpsData);
  const partnerKey = keys.find(k => k !== myClientId);

  const partnerAvatar = document.getElementById('partner-rps-avatar');
  const partnerChoiceText = document.getElementById('partner-rps-choice-text');

  if (partnerKey && rpsData[partnerKey]) {
    const partnerChoice = rpsData[partnerKey].choice;
    const avatarMap = { 'Rock': '🐶✊', 'Paper': '🐕✋', 'Scissors': '🐩✌️' };
    if (partnerAvatar) partnerAvatar.innerText = avatarMap[partnerChoice];
    if (partnerChoiceText) partnerChoiceText.innerText = `Chose ${partnerChoice}!`;
  } else {
    if (partnerAvatar) partnerAvatar.innerText = '🐕❓';
    if (partnerChoiceText) partnerChoiceText.innerText = 'Thinking...';
  }

  if (keys.length < 2) return;

  const p1 = { id: keys[0], choice: rpsData[keys[0]].choice };
  const p2 = { id: keys[1], choice: rpsData[keys[1]].choice };

  const statusMsg = document.getElementById('rps-status-msg');
  const outcomeBanner = document.getElementById('rps-outcome-banner');
  const replayBtn = document.getElementById('rps-replay-btn');

  if (p1.choice === p2.choice) {
    if (statusMsg) statusMsg.innerText = "It's a Doggy Tie! 🤝";
    if (outcomeBanner) {
      outcomeBanner.classList.remove('hidden-section');
      outcomeBanner.innerText = `Both chose ${p1.choice}! Play again! 🐾`;
    }
    playSound('wrong');
    return;
  }

  let winnerId = null;
  if (
    (p1.choice === 'Rock' && p2.choice === 'Scissors') ||
    (p1.choice === 'Paper' && p2.choice === 'Rock') ||
    (p1.choice === 'Scissors' && p2.choice === 'Paper')
  ) {
    winnerId = p1.id;
  } else {
    winnerId = p2.id;
  }

  const isWinner = winnerId === myClientId;
  if (statusMsg) statusMsg.innerText = "Battle Finished! 🎉";
  if (outcomeBanner) {
    outcomeBanner.classList.remove('hidden-section');
    outcomeBanner.innerText = isWinner ? "🎉 You Won the Dog Battle! 🏆🐶" : "😢 Partner Won! Better luck next bark!";
  }
  if (replayBtn) replayBtn.classList.remove('hidden-section');

  if (isWinner) {
    playSound('win');
  } else {
    playSound('wrong');
  }
}

function resetInteractiveRps() {
  playSound('click');
  roomRef.child('interactiveRps').remove();
  
  const myAvatar = document.getElementById('my-rps-avatar');
  const partnerAvatar = document.getElementById('partner-rps-avatar');
  const myChoiceText = document.getElementById('my-rps-choice-text');
  const partnerChoiceText = document.getElementById('partner-rps-choice-text');
  const statusMsg = document.getElementById('rps-status-msg');
  const outcomeBanner = document.getElementById('rps-outcome-banner');
  const replayBtn = document.getElementById('rps-replay-btn');

  if (myAvatar) myAvatar.innerText = '🐶❓';
  if (partnerAvatar) partnerAvatar.innerText = '🐕❓';
  if (myChoiceText) myChoiceText.innerText = 'Not chosen';
  if (partnerChoiceText) partnerChoiceText.innerText = 'Waiting...';
  if (statusMsg) statusMsg.innerText = 'Choose your battle weapon! 🐶';
  if (outcomeBanner) outcomeBanner.classList.add('hidden-section');
  if (replayBtn) replayBtn.classList.add('hidden-section');
}

// ================= WEBRTC & GLOBAL CALL MANAGER[cite: 8] =================
let localStream = null;
let remoteStream = null;
let peerConnection = null;
let isInitiator = false;

const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

async function startCall() {
  playSound('click');
  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const constraints = {
      audio: { echoCancellation: true, noiseSuppression: true },
      video: isMobile ? { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } : { width: { ideal: 1280 }, height: { ideal: 720 } }
    };

    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    const localVideo = document.getElementById('local-video');
    if (localVideo) localVideo.srcObject = localStream;

    createPeerConnection();

    roomRef.child('signals/caller').transaction((current) => current || myClientId, async (err, committed, snap) => {
      if (snap.val() === myClientId) {
        isInitiator = true;
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        roomRef.child('signals/offer').set({ type: offer.type, sdp: offer.sdp });
      } else {
        isInitiator = false;
        roomRef.child('signals/offer').once('value', async (offSnap) => {
          const offer = offSnap.val();
          if (offer && peerConnection && !peerConnection.remoteDescription) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            roomRef.child('signals/answer').set({ type: answer.type, sdp: answer.sdp });
          }
        });
      }
    });

    roomRef.child('signals/answer').on('value', async (snap) => {
      const answer = snap.val();
      if (answer && isInitiator && peerConnection && !peerConnection.currentRemoteDescription) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    roomRef.child('signals/candidates').on('child_added', (snap) => {
      const entry = snap.val();
      if (!entry || entry.sender === myClientId || !peerConnection) return;
      const candidate = JSON.parse(entry.candidate);
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
    });

    renderActiveCallControls();

  } catch (err) {
    alert("Camera/Microphone access error! Check iOS permissions in Settings -> Safari/Chrome 🥺");
  }
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(rtcConfig);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  remoteStream = new MediaStream();
  const remoteVideo = document.getElementById('remote-video');
  if (remoteVideo) remoteVideo.srcObject = remoteStream;

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      roomRef.child('signals/candidates').push({
        sender: myClientId,
        candidate: JSON.stringify(event.candidate)
      });
    }
  };
}

function renderActiveCallControls() {
  const wrapper = document.getElementById('controls-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = `
    <div class="call-controls">
      <button class="audio-btn" onclick="toggleAudio()">🎤 Mute</button>
      <button class="video-btn" onclick="toggleVideo()">📹 Cam Off</button>
      <button class="fs-btn" onclick="toggleRemoteFullscreen()">⛶ Fullscreen</button>
      <button class="disconnect-btn" style="background:#ff4757;" onclick="disconnectCall()">🛑 Disconnect</button>
    </div>
  `;
}

function toggleAudio() {
  if (!localStream) return;
  const track = localStream.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  const audioBtn = document.querySelector('.audio-btn');
  if (audioBtn) audioBtn.innerText = track.enabled ? "🎤 Mute" : "🔇 Unmuted";
}

function toggleVideo() {
  if (!localStream) return;
  const track = localStream.getVideoTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  const videoBtn = document.querySelector('.video-btn');
  if (videoBtn) videoBtn.innerText = track.enabled ? "📹 Cam Off" : "📷 Cam On";
}

function toggleRemoteFullscreen() {
  const container = document.getElementById('remote-video-card');
  if (!container) return;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (container.requestFullscreen) container.requestFullscreen();
    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.exitFullscreen();
  }
}

function disconnectCall() {
  playSound('click');

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
    remoteStream = null;
  }

  if (peerConnection) {
    peerConnection.onicecandidate = null;
    peerConnection.ontrack = null;
    peerConnection.close();
    peerConnection = null;
  }

  const localVideo = document.getElementById('local-video');
  const remoteVideo = document.getElementById('remote-video');
  if (localVideo) localVideo.srcObject = null;
  if (remoteVideo) remoteVideo.srcObject = null;

  if (roomRef) {
    roomRef.child('signals/answer').off();
    roomRef.child('signals/candidates').off();
    roomRef.child('signals/caller').remove();
    roomRef.child('signals/offer').remove();
    roomRef.child('signals/answer').remove();
    roomRef.child('signals/candidates').remove();
  }

  const wrapper = document.getElementById('controls-wrapper');
  if (wrapper) {
    wrapper.innerHTML = `
      <div class="call-controls">
        <button class="call-btn" onclick="startCall()">Connect Call</button>
      </div>
    `;
  }
}