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
  }
}

function backToGameList() {
  playSound('click');
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));
  const menu = document.getElementById('game-selection-menu');
  if (menu) menu.classList.remove('hidden-section');
}

// ================= YOUTUBE & HOST STATE =================
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag && firstScriptTag.parentNode) {
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let player;
let isSyncingFromRemote = false;
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
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log("YouTube Player Ready.");
}

function onPlayerStateChange(event) {
  if (isSyncingFromRemote) return;
  if (currentHostId !== myClientId) return;
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
  if (currentHostId !== myClientId) {
    return alert("Only the current Host can load new videos! Win RPS to become host 👑");
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
        if (currentHostId === myClientId) {
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

      if (data.watchParty && player && typeof player.loadVideoById === 'function') {
        const wp = data.watchParty;
        if (wp.updatedBy && wp.updatedBy !== myClientId) {
          isSyncingFromRemote = true;

          if (wp.action === 'LOAD' && wp.videoId) {
            player.loadVideoById(wp.videoId);
          } else if (player.getCurrentTime) {
            const localTime = player.getCurrentTime();
            const networkDelay = (Date.now() - (wp.timestamp || Date.now())) / 1000;
            const targetTime = (wp.time || 0) + (wp.action === 'PLAY' ? networkDelay : 0);

            if (Math.abs(localTime - targetTime) > 0.8) {
              player.seekTo(targetTime, true);
            }

            if (wp.action === 'PLAY') player.playVideo();
            else if (wp.action === 'PAUSE') player.pauseVideo();
          }

          setTimeout(() => { isSyncingFromRemote = false; }, 400);
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
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
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

// ================= WEBRTC & FULLSCREEN CALL MANAGER =================
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

  console.log("Video and voice calls completely disconnected. Hardware streams released.");
}