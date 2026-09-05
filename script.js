function showSection(sectionId) {
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.add('hidden-section');
    sec.classList.remove('active-section');
  });
  document.getElementById(sectionId).classList.add('active-section');
  document.getElementById(sectionId).classList.remove('hidden-section');
}

function selectGame(gameId) {
  document.getElementById('game-selection-menu').classList.add('hidden-section');
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));

  if (gameId === 'tictactoe') {
    document.getElementById('tictactoe-game').classList.remove('hidden-section');
  } else if (gameId === 'guessing') {
    document.getElementById('guessing-game').classList.remove('hidden-section');
  }
}

function backToGameList() {
  document.querySelectorAll('.game-screen').forEach(screen => screen.classList.add('hidden-section'));
  document.getElementById('game-selection-menu').classList.remove('hidden-section');
}

// Firebase Config
const firebaseConfig = {
  databaseURL: "https://assistant-98715-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let currentRoomCode = "love-lounge";
let roomRef = db.ref('rooms/' + currentRoomCode);

// Tic-Tac-Toe State
let myRole = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Number Guessing State
let targetNumber = Math.floor(Math.random() * 100) + 1;
let guessCount = 0;
let guessFeedback = "Waiting for first guess...";

function setRole(role) {
  myRole = role;
  document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
}

function listenToRoom() {
  roomRef.off();
  roomRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      if (data.ticTacToe) {
        boardState = data.ticTacToe.boardState || ['', '', '', '', '', '', '', '', ''];
        currentPlayer = data.ticTacToe.currentPlayer || 'X';
        gameActive = data.ticTacToe.gameActive !== undefined ? data.ticTacToe.gameActive : true;
        updateUI();
        checkResult();
      }

      if (data.numberGame) {
        targetNumber = data.numberGame.targetNumber;
        guessCount = data.numberGame.guessCount || 0;
        guessFeedback = data.numberGame.guessFeedback || "Waiting for first guess...";
        updateGuessingUI();
      }
    }
  });
}

function joinRoom() {
  const inputCode = document.getElementById('room-input').value.trim();
  if (!inputCode) return alert("Please enter a room code!");
  
  currentRoomCode = inputCode;
  roomRef = db.ref('rooms/' + currentRoomCode);
  
  document.getElementById('room-status').innerText = `Connected to room: ${currentRoomCode}`;
  listenToRoom();
}

// Tic-Tac-Toe
function makeMove(index) {
  if (boardState[index] !== '' || !gameActive) return;
  if (currentPlayer !== myRole) return alert(`It's Player ${currentPlayer}'s turn! You are Player ${myRole}.`);

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
    return;
  }

  if (!boardState.includes('')) {
    document.getElementById('status').innerText = "It's a Draw!";
    gameActive = false;
  }
}

function resetGame() {
  roomRef.child('ticTacToe').set({
    boardState: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true
  });
}

// Number Guessing
function submitGuess() {
  const inputEl = document.getElementById('guess-input');
  const val = parseInt(inputEl.value);

  if (isNaN(val) || val < 1 || val > 100) {
    return alert("Please enter a valid number between 1 and 100!");
  }

  guessCount++;
  if (val === targetNumber) {
    guessFeedback = `🎉 Correct! The number was ${targetNumber}!`;
  } else if (val < targetNumber) {
    guessFeedback = `📈 Too Low! (Guessed: ${val})`;
  } else {
    guessFeedback = `📉 Too High! (Guessed: ${val})`;
  }

  inputEl.value = '';

  roomRef.child('numberGame').set({
    targetNumber: targetNumber,
    guessCount: guessCount,
    guessFeedback: guessFeedback
  });
}

function updateGuessingUI() {
  document.getElementById('guess-feedback').innerText = guessFeedback;
  document.getElementById('guess-count').innerText = `Total Guesses: ${guessCount}`;
}

function resetGuessingGame() {
  const newTarget = Math.floor(Math.random() * 100) + 1;
  roomRef.child('numberGame').set({
    targetNumber: newTarget,
    guessCount: 0,
    guessFeedback: "Game Reset! Try to guess the new number (1-100)."
  });
}

listenToRoom();