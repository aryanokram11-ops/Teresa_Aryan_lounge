// Theme Manager & Persistence
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
});

// Web Audio API Sound Synthesizer
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
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

// ================= RAVE-STYLE YOUTUBE WATCH PARTY SYNC =================
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag && firstScriptTag.parentNode) {
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let player;
let isRemoteAction = false;
let currentHostId = null;

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
      'onReady': () => console.log("Rave Watch Party Player Ready 📺"),
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (isRemoteAction) return;
  if (currentHostId !== 'BOTH_HOSTS' && currentHostId !== myClientId) return;
  if (!player || typeof player.getCurrentTime !== 'function') return;

  const currentTime = player.getCurrentTime();
  if (event.data === YT.PlayerState.PLAYING) {
    roomRef.child('watchParty').set({
      action: 'PLAY',
      time: currentTime,
      updatedBy: myClientId,
      timestamp: Date.now()
    });
  } else if (event.data === YT.PlayerState.PAUSED) {
    roomRef.child('watchParty').set({
      action: 'PAUSE',
      time: currentTime,
      updatedBy: myClientId,
      timestamp: Date.now()
    });
  }
}

function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function loadPastedVideo() {
  if (currentHostId !== 'BOTH_HOSTS' && currentHostId !== myClientId) {
    return alert("Only the current Host or Co-Host can load new videos! Type 'I love you' 3x in chat to unlock Co-Host 👑💖");
  }
  playSound('click');
  const videoInput = document.getElementById('video-url-input');
  if (!videoInput) return;
  const urlInput = videoInput.value.trim();
  const videoId = extractVideoId(urlInput);
  
  if (videoId && player && typeof player.loadVideoById === 'function') {
    player.loadVideoById(videoId);
    videoInput.value = '';

    roomRef.child('watchParty').set({
      action: 'LOAD',
      videoId: videoId,
      time: 0,
      updatedBy: myClientId,
      timestamp: Date.now()
    });
  } else {
    alert("Please enter a valid YouTube link! 🥺");
  }
}

// ================= ROCK PAPER SCISSORS HOST BATTLE =================
function openRpsModal() {
  playSound('click');
  const modal = document.getElementById('rps-modal');
  const resDisplay = document.getElementById('rps-result-display');
  if (modal) modal.classList.remove('hidden-section');
  if (resDisplay) resDisplay.innerText = "Make your choice to settle who hosts!";
}

function closeRpsModal() {
  playSound('click');
  const modal = document.getElementById('rps-modal');
  if (modal) modal.classList.add('hidden-section');
}

function playRps(myChoice) {
  playSound('click');
  roomRef.child(`rps/${myClientId}`).set({
    choice: myChoice,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  const resDisplay = document.getElementById('rps-result-display');
  if (resDisplay) resDisplay.innerText = `You chose ${myChoice}. Waiting for partner... ⏳`;
}

function checkRpsOutcome(rpsData) {
  const keys = Object.keys(rpsData);
  if (keys.length < 2) return;

  const players = keys.map(k => ({ id: k, choice: rpsData[k].choice }));
  const p1 = players[0];
  const p2 = players[1];

  const resDisplay = document.getElementById('rps-result-display');
  if (p1.choice === p2.choice) {
    if (resDisplay) resDisplay.innerText = `Both chose ${p1.choice}! It's a tie, play again! 🤝`;
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

  roomRef.child('hostId').set(winnerId);
  const resultMsg = winnerId === myClientId ? "🎉 You won RPS and became the Host! 👑" : "😢 Partner won RPS and is the Host.";
  if (resDisplay) resDisplay.innerText = resultMsg;
  playSound('win');

  setTimeout(() => {
    closeRpsModal();
    roomRef.child('rps').remove();
  }, 2000);
}

// ================= FIREBASE CONFIG & SYNC =================
const firebaseConfig = {
  databaseURL: "https://assistant-98715-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let currentPartnerCode = "love-lounge";
let roomRef = db.ref('rooms/' + currentPartnerCode);
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

let loveYouCount = 0;

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
        } else {
          statusEl.innerText = `Waiting for puppy partner... ⏳🐕`;
          statusEl.style.color = "var(--primary-pink)";
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

      if (data.rps) checkRpsOutcome(data.rps);

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

      if (data.watchParty && player && typeof player.loadVideoById === 'function') {
        const wp = data.watchParty;
        if (wp.updatedBy && wp.updatedBy !== myClientId) {
          isRemoteAction = true;

          if (wp.action === 'LOAD' && wp.videoId) {
            player.loadVideoById(wp.videoId);
          } else if (player.getCurrentTime && player.getPlayerState) {
            const localTime = player.getCurrentTime();
            const networkDelay = (Date.now() - (wp.timestamp || Date.now())) / 1000;
            const targetTime = (wp.time || 0) + (wp.action === 'PLAY' ? networkDelay : 0);

            if (Math.abs(localTime - targetTime) > 0.8) {
              player.seekTo(targetTime, true);
            }

            if (wp.action === 'PLAY') {
              player.playVideo();
            } else if (wp.action === 'PAUSE') {
              player.pauseVideo();
            }
          }

          setTimeout(() => { isRemoteAction = false; }, 500);
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
  
  const chatContainer = document.getElementById('chat-messages-container');
  if (chatContainer) chatContainer.innerHTML = '';
  
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

// ================= CHAT & MEDIA SHARING =================
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
    
    if (msg.text && msg.text.toLowerCase().trim() === 'i love you') {
      loveYouCount++;
      if (loveYouCount >= 3) {
        triggerDualHost();
      }
    }
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function triggerDualHost() {
  roomRef.child('hostId').set('BOTH_HOSTS');
  playSound('win');

  const container = document.getElementById('chat-messages-container');
  if (container) {
    const notifyDiv = document.createElement('div');
    notifyDiv.className = 'chat-msg';
    notifyDiv.style.background = 'var(--primary-pink)';
    notifyDiv.style.color = 'white';
    notifyDiv.style.textAlign = 'center';
    notifyDiv.style.fontWeight = 'bold';
    notifyDiv.innerText = '💖 Secret Unlocked! Both of you are now Co-Hosts! 👑👑';
    container.appendChild(notifyDiv);
    container.scrollTop = container.scrollHeight;
  }
}

// ================= NEW FEATURE 1: THE MEMORY ALBUM =================
function openMemoryAlbum() {
  playSound('click');
  const modal = document.getElementById('memory-album-modal');
  if (modal) modal.classList.remove('hidden-section');
  loadMemoryAlbum();
}

function closeMemoryAlbum() {
  playSound('click');
  const modal = document.getElementById('memory-album-modal');
  if (modal) modal.classList.add('hidden-section');
}

function loadMemoryAlbum() {
  roomRef.child('memoryAlbum').on('value', (snapshot) => {
    const memories = snapshot.val();
    const container = document.getElementById('memory-grid-container');
    if (!container) return;
    container.innerHTML = '';
    if (!memories) {
      container.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column: 1/-1;">No memories added yet! Upload your first puppy memory 🐾</p>';
      return;
    }
    Object.keys(memories).forEach(key => {
      const mem = memories[key];
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `
        <img src="${mem.imageUrl}" alt="Memory Photo" style="width:100%; border-radius:12px; object-fit:cover; height:180px;">
        <div class="memory-info" style="padding:10px 0;">
          <h4 style="margin:0 0 5px 0;">${mem.title || 'Our Memory'}</h4>
          <p style="margin:0 0 5px 0; font-size:0.9rem; color:var(--text-muted);">${mem.caption || ''}</p>
          <small style="font-size:0.75rem; opacity:0.7;">${new Date(mem.timestamp).toLocaleDateString()}</small>
        </div>
      `;
      container.appendChild(card);
    });
  });
}

function uploadMemory() {
  const fileInput = document.getElementById('memory-file-input');
  const titleInput = document.getElementById('memory-title-input');
  const captionInput = document.getElementById('memory-caption-input');
  
  if (!fileInput || !fileInput.files[0]) return alert("Please select an image file! 📸");
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    roomRef.child('memoryAlbum').push({
      imageUrl: e.target.result,
      title: titleInput ? titleInput.value.trim() : 'Our Memory',
      caption: captionInput ? captionInput.value.trim() : '',
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      sender: myClientId
    });
    if (titleInput) titleInput.value = '';
    if (captionInput) captionInput.value = '';
    fileInput.value = '';
    playSound('win');
  };
  reader.readAsDataURL(file);
}

// ================= NEW FEATURE 2: INSTAGRAM-STYLE CHAT DRAWING =================
let isDrawing = false;
let drawingCanvas = null;
let drawingCtx = null;
let brushColor = '#ff4757';
let brushSize = 4;

function openDrawingModal() {
  playSound('click');
  const modal = document.getElementById('chat-drawing-modal');
  if (modal) modal.classList.remove('hidden-section');
  initDrawingCanvas();
}

function closeDrawingModal() {
  playSound('click');
  const modal = document.getElementById('chat-drawing-modal');
  if (modal) modal.classList.add('hidden-section');
}

function initDrawingCanvas() {
  drawingCanvas = document.getElementById('chat-sketch-canvas');
  if (!drawingCanvas) return;
  drawingCtx = drawingCanvas.getContext('2d');
  
  drawingCanvas.width = 320;
  drawingCanvas.height = 320;
  
  drawingCtx.lineCap = 'round';
  drawingCtx.lineJoin = 'round';
  drawingCtx.strokeStyle = brushColor;
  drawingCtx.lineWidth = brushSize;

  drawingCtx.fillStyle = '#ffffff';
  drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

  drawingCanvas.onmousedown = startDrawingMouse;
  drawingCanvas.onmousemove = drawMouse;
  drawingCanvas.onmouseup = stopDrawingMouse;
  drawingCanvas.onmouseleave = stopDrawingMouse;

  drawingCanvas.ontouchstart = startDrawingTouch;
  drawingCanvas.ontouchmove = drawTouch;
  drawingCanvas.ontouchend = stopDrawingTouch;
}

function setBrushColor(color) {
  playSound('click');
  brushColor = color;
  if (drawingCtx) drawingCtx.strokeStyle = brushColor;
}

function clearSketchCanvas() {
  playSound('click');
  if (drawingCtx && drawingCanvas) {
    drawingCtx.fillStyle = '#ffffff';
    drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }
}

function startDrawingMouse(e) {
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  drawingCtx.beginPath();
  drawingCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function drawMouse(e) {
  if (!isDrawing) return;
  const rect = drawingCanvas.getBoundingClientRect();
  drawingCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  drawingCtx.stroke();
}

function stopDrawingMouse() {
  isDrawing = false;
}

function startDrawingTouch(e) {
  e.preventDefault();
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  drawingCtx.beginPath();
  drawingCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}

function drawTouch(e) {
  e.preventDefault();
  if (!isDrawing) return;
  const rect = drawingCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  drawingCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  drawingCtx.stroke();
}

function stopDrawingTouch() {
  isDrawing = false;
}

function sendDrawingToChat() {
  if (!drawingCanvas) return;
  const dataUrl = drawingCanvas.toDataURL('image/png');
  
  roomRef.child('chatMessages').push({
    sender: myClientId,
    mediaUrl: dataUrl,
    type: 'media',
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });

  closeDrawingModal();
  playSound('win');
}

// ================= GAME FUNCTIONS =================
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

// ================= INTERACTIVE PAWS & CLAWS RPS =================
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

// ================= FLOATING CALL WIDGET CONTROLS =================
let isCallMinimized = false;

function toggleMinimizeCall() {
  playSound('click');
  isCallMinimized = !isCallMinimized;
  const widget = document.getElementById('floating-call-widget');
  const btn = document.getElementById('minimize-call-btn');
  if (widget && btn) {
    if (isCallMinimized) {
      widget.classList.add('minimized');
      btn.innerText = '🗖';
    } else {
      widget.classList.remove('minimized');
      btn.innerText = '🗕';
    }
  }
}

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startDrag(e) {
  if (e.target.tagName === 'BUTTON') return;
  isDragging = true;
  const widget = document.getElementById('floating-call-widget');
  const rect = widget.getBoundingClientRect();
  
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!isDragging) return;
  const widget = document.getElementById('floating-call-widget');
  
  let newX = window.innerWidth - e.clientX - (widget.offsetWidth - dragOffsetX);
  let newY = window.innerHeight - e.clientY - (widget.offsetHeight - dragOffsetY);

  if (newX < 10) newX = 10;
  if (newY < 10) newY = 10;

  widget.style.right = newX + 'px';
  widget.style.bottom = newY + 'px';
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

// ================= WEBRTC & GLOBAL CALL MANAGER =================
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
      const candidate = JSON.parse(snap.val());
      if (snap.key !== myClientId && peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      }
    });

    renderActiveCallControls();

  } catch (err) {
    alert("Camera/Microphone access error! Check permissions 🥺");
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
    if (event.candidate) roomRef.child('signals/candidates').push(JSON.stringify(event.candidate));
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
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
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

  console.log("Video and voice calls completely disconnected.");
}
