function showSection(sectionId) {
  const moviesSection = document.getElementById('movies');
  const gamesSection = document.getElementById('games');

  if (sectionId === 'movies') {
    moviesSection.classList.add('active-section');
    moviesSection.classList.remove('hidden-section');
    gamesSection.classList.add('hidden-section');
    gamesSection.classList.remove('active-section');
  } else if (sectionId === 'games') {
    gamesSection.classList.add('active-section');
    gamesSection.classList.remove('hidden-section');
    moviesSection.classList.add('hidden-section');
    moviesSection.classList.remove('active-section');
  }
}

// Database Config
const firebaseConfig = {
  databaseURL: "https://assistant-98715-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let currentRoomCode = "love-lounge";
let roomRef = db.ref('rooms/' + currentRoomCode);

let myRole = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function setRole(role) {
  myRole = role;
  document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
}

function listenToRoom() {
  roomRef.off();
  roomRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      boardState = data.boardState || ['', '', '', '', '', '', '', '', ''];
      currentPlayer = data.currentPlayer || 'X';
      gameActive = data.gameActive !== undefined ? data.gameActive : true;
      updateUI();
      checkResult();
    }
  });
}

function joinRoom() {
  const inputCode = document.getElementById('room-input').value.trim();
  if (!inputCode) {
    alert("Please enter a room code!");
    return;
  }
  
  currentRoomCode = inputCode;
  roomRef = db.ref('rooms/' + currentRoomCode);
  
  document.getElementById('room-status').innerText = `Connected to room: ${currentRoomCode}`;
  listenToRoom();
}

function makeMove(index) {
  if (boardState[index] !== '' || !gameActive) return;
  
  if (currentPlayer !== myRole) {
    alert(`It's Player ${currentPlayer}'s turn! You are Player ${myRole}.`);
    return;
  }

  boardState[index] = currentPlayer;
  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

  roomRef.set({
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
    return;
  }

  if (!boardState.includes('')) {
    document.getElementById('status').innerText = "It's a Draw!";
    gameActive = false;
    return;
  }
}

function resetGame() {
  roomRef.set({
    boardState: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true
  });
}

// Attach default room on boot
listenToRoom();