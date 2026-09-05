// Web Audio API Synthesized Meme Sound Generator
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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'win') {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.25);
    });
  } else if (type === 'wrong') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

function showSection(sectionId) {
  playSound('click');
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.add('hidden-section');
    sec.classList.remove('active-section');
  });
  document.getElementById(sectionId).classList.add('active-section');
  document.getElementById(sectionId).classList.remove('hidden-section');
}

function selectGame(gameId) {
  playSound('click');
  document.getElementById('game-selection-menu').classList.add('hidden-section');
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));

  if (gameId === 'tictactoe') {
    document.getElementById('tictactoe-game').classList.remove('hidden-section');
  } else if (gameId === 'guessing') {
    document.getElementById('guessing-game').classList.remove('hidden-section');
  }
}

function backToGameList() {
  playSound('click');
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));
  document.getElementById('game-selection-menu').classList.remove('hidden-section');
}

// Firebase Configuration
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

// Unique Client ID for exclusive role locking
let myClientId = localStorage.getItem('lounge_client_id');
if (!myClientId) {
  myClientId = 'client_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('lounge_client_id', myClientId);
}

// Tic-Tac-Toe State
let myRole = localStorage.getItem('lounge_ttt_role') || null;
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Secret Number Duel State
let myDuelRole = localStorage.getItem('lounge_duel_role') || null;
let duelData = {
  aryanSecret: null,
  teresaSecret: null,
  currentTurn: 'Aryan',
  feedback: 'Set your secret numbers to begin!',
  winner: null,
  aryanHistory: [],
  teresaHistory: [],
  roles: {}
};

// Initialize role UI states on load
window.addEventListener('DOMContentLoaded', () => {
  if (myRole) {
    document.getElementById('ttt-select-box').classList.add('hidden-section');
    document.getElementById('ttt-locked-box').classList.remove('hidden-section');
    document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
  }

  if (myDuelRole) {
    document.getElementById('duel-select-box').classList.add('hidden-section');
    document.getElementById('duel-locked-box').classList.remove('hidden-section');
    document.getElementById('duel-identity').innerText = `You are playing as: ${myDuelRole}`;
  }

  joinRoom();
});

function setRole(role) {
  playSound('click');
  myRole = role;
  localStorage.setItem('lounge_ttt_role', role);
  
  document.getElementById('ttt-select-box').classList.add('hidden-section');
  document.getElementById('ttt-locked-box').classList.remove('hidden-section');
  document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
}

function setDuelPlayer(role) {
  playSound('click');
  const rolesRef = roomRef.child('secretDuel/roles');
  
  rolesRef.once('value', (snapshot) => {
    const roles = snapshot.val() || {};
    const currentHolder = roles[role];

    if (currentHolder && currentHolder !== myClientId) {
      alert(`${role} is already taken by your partner!`);
      return;
    }

    const updates = {};
    if (roles.Aryan === myClientId) updates.Aryan = null;
    if (roles.Teresa === myClientId) updates.Teresa = null;
    updates[role] = myClientId;

    rolesRef.update(updates).then(() => {
      myDuelRole = role;
      localStorage.setItem('lounge_duel_role', role);

      document.getElementById('duel-select-box').classList.add('hidden-section');
      document.getElementById('duel-locked-box').classList.remove('hidden-section');
      document.getElementById('duel-identity').innerText = `You are playing as: ${role}`;
      updateDuelUI();
    });
  });
}

function resetRoleSelection(gameType) {
  playSound('click');
  if (gameType === 'ttt') {
    localStorage.removeItem('lounge_ttt_role');
    myRole = null;
    document.getElementById('ttt-select-box').classList.remove('hidden-section');
    document.getElementById('ttt-locked-box').classList.add('hidden-section');
  } else if (gameType === 'duel') {
    if (myDuelRole) {
      roomRef.child('secretDuel/roles').once('value', (snapshot) => {
        const roles = snapshot.val() || {};
        const updates = {};
        if (roles.Aryan === myClientId) updates.Aryan = null;
        if (roles.Teresa === myClientId) updates.Teresa = null;
        roomRef.child('secretDuel/roles').update(updates);
      });
    }
    localStorage.removeItem('lounge_duel_role');
    myDuelRole = null;
    document.getElementById('duel-select-box').classList.remove('hidden-section');
    document.getElementById('duel-locked-box').classList.add('hidden-section');
  }
}

function setupPresence() {
  if (myPresenceRef) {
    myPresenceRef.remove();
  }
  myPresenceRef = roomRef.child('presence').push();
  myPresenceRef.onDisconnect().remove();
  myPresenceRef.set({ online: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
}

function listenToRoom() {
  roomRef.off();
  roomRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const presenceObj = data.presence || {};
      const activeCount = Object.keys(presenceObj).length;
      const statusEl = document.getElementById('room-status');

      if (activeCount >= 2) {
        statusEl.innerText = `Connected to partner code: ${currentPartnerCode} — Partner Connected ❤️`;
        statusEl.style.color = "#2ed573";
      } else {
        statusEl.innerText = `Connected to partner code: ${currentPartnerCode} — Waiting for partner to join... ⏳`;
        statusEl.style.color = "#ff6b81";
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
    } else {
      document.getElementById('room-status').innerText = `Connected to partner code: ${currentPartnerCode} — Waiting for partner to join... ⏳`;
      document.getElementById('room-status').style.color = "#ff6b81";
    }
  });
}

function joinRoom() {
  playSound('click');
  const inputCode = document.getElementById('room-input').value.trim();
  if (!inputCode) return alert("Please enter a partner code!");
  
  currentPartnerCode = inputCode;
  roomRef = db.ref('rooms/' + currentPartnerCode);
  
  setupPresence();
  listenToRoom();
}

// Tic-Tac-Toe Functions
function makeMove(index) {
  if (!myRole) return alert("Please select whether you are Player X or O first!");
  if (boardState[index] !== '' || !gameActive) return;
  if (currentPlayer !== myRole) return alert(`It's Player ${currentPlayer}'s turn! You are Player ${myRole}.`);

  playSound('click');
  boardState[index] = currentPlayer;
  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

  roomRef.child('ticTacToe').set({
    boardState: boardState,
    currentPlayer: nextPlayer,
    gameActive: gameActive
  });
}

function updateUI() {
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < 9; i++) {
    cells[i].innerText = boardState[i];
  }
  if (gameActive) {
    document.getElementById('status').innerText = `Player ${currentPlayer}'s Turn`;
  }
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    let [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    const winner = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').innerText = `Player ${winner} Wins! 💕`;
    gameActive = false;
    playSound('win');
    return;
  }

  if (!boardState.includes('')) {
    document.getElementById('status').innerText = "It's a Draw!";
    gameActive = false;
    playSound('wrong');
  }
}

function resetGame() {
  playSound('click');
  roomRef.child('ticTacToe').set({
    boardState: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true
  });
}

// Wholesome, Cute, & Short Roasts for Secret Number Duel
const lowRoasts = [
  "Way too low! Even a sleepy little kitten jumps higher than that! 🐾",
  "Too low, cutie! My hugs are warmer than that guess! 🤗",
  "Way too low! Did you drop your glasses or just your standards? 😉"
];

const highRoasts = [
  "Way too high! Calm down, astronaut, we haven't built the rocket yet! 🚀",
  "Too high! You're reaching almost as high as my love for you 💕",
  "Way too high! Dial it back down to cozy mode, cutie! 🥰"
];

const closeRoasts = [
  "Ooooh! So ridiculously close I can almost taste the victory! 🔥",
  "So close! My heart skipped a beat thinking you got it! 💓"
];

// Secret Number Duel Functions
function lockSecretNumber() {
  if (!myDuelRole) return alert("Please select whether you are Aryan or Teresa first!");
  const val = parseInt(document.getElementById('secret-input').value);
  if (isNaN(val) || val < 1 || val > 100) return alert("Enter a valid number between 1 and 100!");

  playSound('click');
  const updateObj = {};
  if (myDuelRole === 'Aryan') updateObj.aryanSecret = val;
  else updateObj.teresaSecret = val;

  if (!duelData.currentTurn) updateObj.currentTurn = 'Aryan';

  roomRef.child('secretDuel').update(updateObj);
  document.getElementById('secret-status').innerText = "Status: Secret number locked! Waiting for partner...";
}

function submitDuelGuess() {
  if (!myDuelRole) return alert("Please select your identity first!");
  const turn = duelData.currentTurn || 'Aryan';

  if (duelData.winner) return alert("The game is over! Reset to play again.");
  if (turn !== myDuelRole) return alert(`It's ${turn}'s turn to guess!`);

  const guessVal = parseInt(document.getElementById('guess-input').value);
  if (isNaN(guessVal) || guessVal < 1 || guessVal > 100) return alert("Enter a valid number between 1 and 100!");

  const target = myDuelRole === 'Aryan' ? duelData.teresaSecret : duelData.aryanSecret;
  const nextTurn = myDuelRole === 'Aryan' ? 'Teresa' : 'Aryan';
  let feedbackText = "", hint = "", winner = null;
  const difference = Math.abs(guessVal - target);

  if (guessVal === target) {
    feedbackText = `🎉 ${myDuelRole} guessed ${guessVal} perfectly and WINS! So proud of you! 💕`;
    hint = "CORRECT 🎉";
    winner = myDuelRole;
    playSound('win');
  } else if (difference <= 5) {
    const randomClose = closeRoasts[Math.floor(Math.random() * closeRoasts.length)];
    const direction = guessVal < target ? "Higher 📈" : "Lower 📉";
    feedbackText = `${myDuelRole} guessed ${guessVal} — ${randomClose} (Go ${direction})`;
    hint = `So Close! (${direction})`;
    playSound('wrong');
  } else if (guessVal < target) {
    feedbackText = `${myDuelRole} guessed ${guessVal} — ${lowRoasts[Math.floor(Math.random() * lowRoasts.length)]}`;
    hint = "Too Low 📉";
    playSound('wrong');
  } else {
    feedbackText = `${myDuelRole} guessed ${guessVal} — ${highRoasts[Math.floor(Math.random() * highRoasts.length)]}`;
    hint = "Too High 🚀";
    playSound('wrong');
  }

  document.getElementById('guess-input').value = '';
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
  const roles = duelData.roles || {};
  const aryanBtn = document.getElementById('aryan-btn');
  const teresaBtn = document.getElementById('teresa-btn');

  if (aryanBtn && teresaBtn && !myDuelRole) {
    if (roles.Aryan && roles.Aryan !== myClientId) {
      aryanBtn.disabled = true;
      aryanBtn.innerText = "Aryan (Taken)";
      aryanBtn.style.opacity = "0.6";
    } else {
      aryanBtn.disabled = false;
      aryanBtn.innerText = "Aryan";
      aryanBtn.style.opacity = "1";
    }

    if (roles.Teresa && roles.Teresa !== myClientId) {
      teresaBtn.disabled = true;
      teresaBtn.innerText = "Teresa (Taken)";
      teresaBtn.style.opacity = "0.6";
    } else {
      teresaBtn.disabled = false;
      teresaBtn.innerText = "Teresa";
      teresaBtn.style.opacity = "1";
    }
  }

  const aryanReady = duelData.aryanSecret !== undefined && duelData.aryanSecret !== null;
  const teresaReady = duelData.teresaSecret !== undefined && duelData.teresaSecret !== null;
  const turn = duelData.currentTurn || 'Aryan';

  if (aryanReady && teresaReady) {
    document.getElementById('set-number-box').classList.add('hidden-section');
    document.getElementById('guess-duel-box').classList.remove('hidden-section');

    if (duelData.winner) {
      document.getElementById('turn-indicator').innerText = `Game Over! 🎉 ${duelData.winner} Wins!`;
      document.getElementById('secret-reveal-box').classList.remove('hidden-section');
      document.getElementById('reveal-aryan').innerText = duelData.aryanSecret;
      document.getElementById('reveal-teresa').innerText = duelData.teresaSecret;
    } else {
      document.getElementById('secret-reveal-box').classList.add('hidden-section');
      if (turn === myDuelRole) {
        document.getElementById('turn-indicator').innerText = `Make your guess!`;
      } else {
        document.getElementById('turn-indicator').innerText = `Waiting for ${turn} to guess...`;
      }
    }
  } else {
    document.getElementById('set-number-box').classList.remove('hidden-section');
    document.getElementById('guess-duel-box').classList.add('hidden-section');
    document.getElementById('secret-reveal-box').classList.add('hidden-section');

    const myLocked = (myDuelRole === 'Aryan' && aryanReady) || (myDuelRole === 'Teresa' && teresaReady);
    if (myLocked) {
      document.getElementById('secret-status').innerText = "Status: Secret number locked! Waiting for partner...";
    } else {
      document.getElementById('secret-status').innerText = `Aryan Ready: ${aryanReady ? '✅' : '❌'} | Teresa Ready: ${teresaReady ? '✅' : '❌'}`;
    }
  }

  document.getElementById('guess-feedback').innerText = duelData.feedback || 'No guesses made yet.';

  const aryanList = document.getElementById('aryan-history');
  const teresaList = document.getElementById('teresa-history');

  aryanList.innerHTML = (duelData.aryanHistory || []).map(item => `<li>${item}</li>`).join('');
  teresaList.innerHTML = (duelData.teresaHistory || []).map(item => `<li>${item}</li>`).join('');
}

function resetDuelGame() {
  playSound('click');
  roomRef.child('secretDuel').update({
    aryanSecret: null,
    teresaSecret: null,
    currentTurn: 'Aryan',
    feedback: 'Game Reset! Lock in your secret numbers.',
    winner: null,
    aryanHistory: [],
    teresaHistory: []
  });
  document.getElementById('secret-input').value = '';
}

// WebRTC Peer Connection Configuration for Video/Voice Chat
let localStream;
let remoteStream;
let peerConnection;

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

async function startCall() {
  playSound('click');
  document.getElementById('call-btn').innerText = "Connecting...";
  
  try {
    // 1. Get local audio and video
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('local-video').srcObject = localStream;

    peerConnection = new RTCPeerConnection(rtcConfig);

    // 2. Add local tracks to peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // 3. Receive remote tracks
    remoteStream = new MediaStream();
    document.getElementById('remote-video').srcObject = remoteStream;
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

    // 4. Handle ICE candidates via Firebase Signaling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        roomRef.child('signals/candidates').push(JSON.stringify(event.candidate));
      }
    };

    // Check if we are caller or callee based on client ID or room setup
    const callRef = roomRef.child('signals/offer');
    callRef.once('value', async (snapshot) => {
      const offer = snapshot.val();
      if (!offer) {
        // We are the Caller (Initiator)
        const offerDescription = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offerDescription);
        roomRef.child('signals/offer').set({
          type: offerDescription.type,
          sdp: offerDescription.sdp
        });
        document.getElementById('call-btn').innerText = "Waiting...";
      } else {
        // We are the Callee (Receiver)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answerDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDescription);
        roomRef.child('signals/answer').set({
          type: answerDescription.type,
          sdp: answerDescription.sdp
        });
        document.getElementById('call-btn').innerText = "Connected! 💖";
      }
    });

    // Listen for answer if we created the offer
    roomRef.child('signals/answer').on('value', async (snapshot) => {
      const answer = snapshot.val();
      if (answer && !peerConnection.currentRemoteDescription && peerConnection.signalingState === "have-local-offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        document.getElementById('call-btn').innerText = "Connected! 💖";
      }
    });

    // Listen for incoming ICE candidates
    roomRef.child('signals/candidates').on('child_added', (snapshot) => {
      const candidateData = JSON.parse(snapshot.val());
      if (peerConnection && peerConnection.remoteDescription) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidateData)).catch(e => console.error(e));
      }
    });

  } catch (error) {
    console.error("Error accessing media devices.", error);
    alert("Could not access camera or microphone. Please check permissions!");
    document.getElementById('call-btn').innerText = "Connect";
  }
}

// Toggle Mic Mute / Unmute
function toggleAudio() {
  if (!localStream) return;
  const audioTrack = localStream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    document.getElementById('audio-btn').innerText = audioTrack.enabled ? "🎤 Mute" : "🔇 Unmuted";
  }
}

// Toggle Camera On / Off
function toggleVideo() {
  if (!localStream) return;
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;
    document.getElementById('video-btn').innerText = videoTrack.enabled ? "📹 Cam Off" : "📷 Cam On";
  }
}