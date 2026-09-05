// Dynamic Floating Background Hearts & Paws Generator
window.addEventListener('DOMContentLoaded', () => {
  const heartsBg = document.getElementById('hearts-bg');
  const symbols = ['🐶', '🐾', '💖', '🦴', '✨', '💕', '🐕', '❤️'];
  
  for (let i = 0; i < 20; i++) {
    const item = document.createElement('div');
    item.className = 'heart-particle';
    item.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.animationDuration = (6 + Math.random() * 6) + 's';
    item.style.animationDelay = (Math.random() * 5) + 's';
    item.style.fontSize = (18 + Math.random() * 18) + 'px';
    heartsBg.appendChild(item);
  }

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

  const savedCode = localStorage.getItem('lounge_partner_code');
  if (savedCode) {
    currentPartnerCode = savedCode;
    document.getElementById('room-input').value = savedCode;
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
    gain.gain.setValueAtTime(0.25, now);
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
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
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
    gain.gain.setValueAtTime(0.3, now);
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
  targetSection.classList.add('active-section');
  targetSection.classList.remove('hidden-section');
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

// ================= YOUTUBE & HOST STATE (NO DEFAULT VIDEO LOADED) =================
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
  console.log("YouTube Player Ready. Waiting for user to load a video.");
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
  const urlInput = document.getElementById('video-url-input').value.trim();
  const videoId = extractVideoId(urlInput);
  
  if (videoId) {
    player.loadVideoById(videoId);
    document.getElementById('video-url-input').value = '';

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

// ================= ROCK PAPER SCISSORS HOST BATTLE & FIXED MODAL =================
function openRpsModal() {
  playSound('click');
  document.getElementById('rps-modal').classList.remove('hidden-section');
  document.getElementById('rps-result-display').innerText = "Make your choice to settle who hosts!";
}

function closeRpsModal() {
  playSound('click');
  document.getElementById('rps-modal').classList.add('hidden-section');
}

function playRps(myChoice) {
  playSound('click');
  roomRef.child(`rps/${myClientId}`).set({
    choice: myChoice,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  document.getElementById('rps-result-display').innerText = `You chose ${myChoice}. Waiting for partner... ⏳`;
}

function checkRpsOutcome(rpsData) {
  const keys = Object.keys(rpsData);
  if (keys.length < 2) return;

  const players = keys.map(k => ({ id: k, choice: rpsData[k].choice }));
  const p1 = players[0];
  const p2 = players[1];

  if (p1.choice === p2.choice) {
    document.getElementById('rps-result-display').innerText = `Both chose ${p1.choice}! It's a tie, play again! 🤝`;
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
  document.getElementById('rps-result-display').innerText = resultMsg;
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

// Game states
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
    if (data) {
      const presenceObj = data.presence || {};
      const activeCount = Object.keys(presenceObj).length;
      const statusEl = document.getElementById('room-status');

      if (activeCount >= 2) {
        statusEl.innerText = `Puppy Partner Connected! 🐶🐾`;
        statusEl.style.color = "#2ed573";
      } else {
        statusEl.innerText = `Waiting for puppy partner to join... ⏳🐕`;
        statusEl.style.color = "#ff6b81";
      }

      currentHostId = data.hostId || null;
      const hostBadge = document.getElementById('host-badge');
      const nonHostShield = document.getElementById('non-host-shield');

      if (currentHostId === myClientId) {
        hostBadge.innerText = "👑 Host: You (You control video!)";
        nonHostShield.classList.add('hidden-section');
      } else if (currentHostId) {
        hostBadge.innerText = "👑 Host: Partner";
        nonHostShield.classList.remove('hidden-section');
      } else {
        hostBadge.innerText = "👑 Host: Not Decided (Play RPS!)";
        nonHostShield.classList.add('hidden-section');
      }

      if (data.rps) {
        checkRpsOutcome(data.rps);
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

            if (wp.action === 'PLAY') {
              player.playVideo();
            } else if (wp.action === 'PAUSE') {
              player.pauseVideo();
            }
          }

          setTimeout(() => { isSyncingFromRemote = false; }, 400);
        }
      }
    } else {
      document.getElementById('room-status').innerText = `Waiting for puppy partner to join... ⏳🐕`;
    }
  });

  roomRef.child('chatMessages').off();
  roomRef.child('chatMessages').on('child_added', (snapshot) => {
    const msg = snapshot.val();
    appendChatMessage(msg);
  });
}

function joinRoom(isAuto = false) {
  if (!isAuto) playSound('click');
  const inputCode = document.getElementById('room-input').value.trim();
  if (!inputCode) return alert("Please enter a partner code! 🐾");
  
  currentPartnerCode = inputCode;
  localStorage.setItem('lounge_partner_code', currentPartnerCode);
  roomRef = db.ref('rooms/' + currentPartnerCode);
  
  // RESET CHAT BOX ON ROOM SWITCH
  const chatContainer = document.getElementById('chat-messages-container');
  if (chatContainer) {
    chatContainer.innerHTML = '';
  }
  
  document.getElementById('room-input-row').classList.add('hidden-section');
  document.getElementById('room-connected-display').classList.remove('hidden-section');
  document.getElementById('active-code-label').innerText = `Code: ${currentPartnerCode}`;

  setupPresence();
  listenToRoom();
}

function editPartnerCode() {
  playSound('click');
  document.getElementById('room-input-row').classList.remove('hidden-section');
  document.getElementById('room-connected-display').classList.add('hidden-section');
}

// ================= CHAT & MEDIA SHARING =================
function handleChatKeyDown(event) {
  if (event.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chat-text-input');
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
    const base64Data = e.target.result;
    roomRef.child('chatMessages').push({
      sender: myClientId,
      mediaUrl: base64Data,
      type: 'media',
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  };
  reader.readAsDataURL(file);
}

function appendChatMessage(msg) {
  const container = document.getElementById('chat-messages-container');
  const div = document.createElement('div');
  div.className = 'chat-msg' + (msg.sender === myClientId ? ' mine' : '');

  if (msg.type === 'media') {
    div.innerHTML = `<img src="${msg.mediaUrl}" alt="Shared image/gif">`;
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
  document.getElementById('ttt-select-box').classList.add('hidden-section');
  document.getElementById('ttt-locked-box').classList.remove('hidden-section');
  document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
}

function resetRoleSelection(gameType) {
  playSound('click');
  if (gameType === 'ttt') {
    localStorage.removeItem('lounge_ttt_role');
    myRole = null;
    document.getElementById('ttt-select-box').classList.remove('hidden-section');
    document.getElementById('ttt-locked-box').classList.add('hidden-section');
  } else if (gameType === 'duel') {
    localStorage.removeItem('lounge_duel_role');
    myDuelRole = null;
    document.getElementById('duel-select-box').classList.remove('hidden-section');
    document.getElementById('duel-locked-box').classList.add('hidden-section');
  }
}

function makeMove(index) {
  if (!myRole) return alert("Select Player X or O first! ✨");
  if (boardState[index] !== '' || !gameActive) return;
  if (currentPlayer !== myRole) return alert(`It's Player ${currentPlayer}'s turn!`);

  playSound('click');
  boardState[index] = currentPlayer;
  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

  roomRef.child('ticTacToe').set({ boardState, currentPlayer, gameActive });
}

function updateUI() {
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < 9; i++) cells[i].innerText = boardState[i];
  if (gameActive) document.getElementById('status').innerText = `Player ${currentPlayer}'s Turn 🐾`;
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    let [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      roundWon = true; break;
    }
  }
  if (roundWon) {
    const winner = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').innerText = `🎉 Player ${winner} Wins! 🐶💕`;
    gameActive = false;
    playSound('win');
    return;
  }
  if (!boardState.includes('')) {
    document.getElementById('status').innerText = "It's a Puppy Draw! 🤝🐾";
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
  document.getElementById('duel-select-box').classList.add('hidden-section');
  document.getElementById('duel-locked-box').classList.remove('hidden-section');
  document.getElementById('duel-identity').innerText = `You are playing as: ${role}`;
  updateDuelUI();
}

function lockSecretNumber() {
  if (!myDuelRole) return alert("Select identity first! ✨");
  const val = parseInt(document.getElementById('secret-input').value);
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

  const guessVal = parseInt(document.getElementById('guess-input').value);
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
  const aryanReady = duelData.aryanSecret !== undefined && duelData.aryanSecret !== null;
  const teresaReady = duelData.teresaSecret !== undefined && duelData.teresaSecret !== null;

  if (aryanReady && teresaReady) {
    document.getElementById('set-number-box').classList.add('hidden-section');
    document.getElementById('guess-duel-box').classList.remove('hidden-section');
    if (duelData.winner) {
      document.getElementById('turn-indicator').innerText = `Game Over! 🎉 ${duelData.winner} Wins!`;
      document.getElementById('secret-reveal-box').classList.remove('hidden-section');
      document.getElementById('reveal-aryan').innerText = duelData.aryanSecret;
      document.getElementById('reveal-teresa').innerText = duelData.teresaSecret;
    }
  } else {
    document.getElementById('set-number-box').classList.remove('hidden-section');
    document.getElementById('guess-duel-box').classList.add('hidden-section');
  }
  document.getElementById('guess-feedback').innerText = duelData.feedback || '';
  document.getElementById('aryan-history').innerHTML = (duelData.aryanHistory || []).map(i => `<li>${i}</li>`).join('');
  document.getElementById('teresa-history').innerHTML = (duelData.teresaHistory || []).map(i => `<li>${i}</li>`).join('');
}

function resetDuelGame() {
  playSound('click');
  roomRef.child('secretDuel').update({ aryanSecret: null, teresaSecret: null, currentTurn: 'Aryan', feedback: 'Reset!', winner: null, aryanHistory: [], teresaHistory: [] });
}

// ================= WEBRTC VIDEO CALLS =================
let localStream;
let remoteStream;
let peerConnection;
let isInitiator = false;

const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

async function startCall() {
  playSound('click');
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('wp-local-video').srcObject = localStream;

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
          if (offer && !peerConnection.remoteDescription) {
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
      if (answer && isInitiator && !peerConnection.currentRemoteDescription) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    roomRef.child('signals/candidates').on('child_added', (snap) => {
      const candidate = JSON.parse(snap.val());
      if (snap.key !== myClientId && peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      }
    });
  } catch (err) {
    alert("Camera/Microphone access error! Check permissions 🥺");
  }
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(rtcConfig);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  remoteStream = new MediaStream();
  document.getElementById('wp-remote-video').srcObject = remoteStream;

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) roomRef.child('signals/candidates').push(JSON.stringify(event.candidate));
  };
}

function toggleAudio() {
  if (!localStream) return;
  const track = localStream.getAudioTracks()[0];
  track.enabled = !track.enabled;
  document.querySelector('.audio-btn').innerText = track.enabled ? "🎤 Mute" : "🔇 Unmuted";
}

function toggleVideo() {
  if (!localStream) return;
  const track = localStream.getVideoTracks()[0];
  track.enabled = !track.enabled;
  document.querySelector('.video-btn').innerText = track.enabled ? "📹 Cam Off" : "📷 Cam On";
}