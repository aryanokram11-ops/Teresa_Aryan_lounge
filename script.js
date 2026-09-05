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

// Firebase Configuration
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

// Secret Number Duel State
let myDuelRole = 'Aryan';
let duelData = {
  aryanSecret: null,
  teresaSecret: null,
  currentTurn: 'Aryan',
  feedback: 'Set your secret numbers to begin!',
  winner: null
};

function setRole(role) {
  myRole = role;
  document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
}

function setDuelPlayer(role) {
  myDuelRole = role;
  document.getElementById('duel-identity').innerText = `You are playing as: ${role}`;
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

      if (data.secretDuel) {
        duelData = data.secretDuel;
        updateDuelUI();
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

// Tic-Tac-Toe Functions
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

// Secret Number Duel Functions
function lockSecretNumber() {
  const val = parseInt(document.getElementById('secret-input').value);
  if (isNaN(val) || val < 1 || val > 100) return alert("Enter a valid number between 1 and 100!");

  const updateObj = {};
  if (myDuelRole === 'Aryan') updateObj.aryanSecret = val;
  else updateObj.teresaSecret = val;

  roomRef.child('secretDuel').update(updateObj);
  document.getElementById('secret-status').innerText = "Status: Secret number locked! Waiting for partner...";
}

function submitDuelGuess() {
  if (duelData.winner) return alert("The game is over! Reset to play again.");
  if (duelData.currentTurn !== myDuelRole) return alert(`It's ${duelData.currentTurn}'s turn to guess!`);

  const guessVal = parseInt(document.getElementById('guess-input').value);
  if (isNaN(guessVal) || guessVal < 1 || guessVal > 100) return alert("Enter a valid number between 1 and 100!");

  const target = myDuelRole === 'Aryan' ? duelData.teresaSecret : duelData.aryanSecret;
  const nextTurn = myDuelRole === 'Aryan' ? 'Teresa' : 'Aryan';
  let feedbackText = "";
  let winner = null;

  if (guessVal === target) {
    feedbackText = `🎉 ${myDuelRole} guessed ${guessVal} correctly and WINS! 💕`;
    winner = myDuelRole;
  } else if (guessVal < target) {
    feedbackText = `${myDuelRole} guessed ${guessVal} — Too Low!`;
  } else {
    feedbackText = `${myDuelRole} guessed ${guessVal} — Too High!`;
  }

  document.getElementById('guess-input').value = '';

  roomRef.child('secretDuel').update({
    currentTurn: winner ? duelData.currentTurn : nextTurn,
    feedback: feedbackText,
    winner: winner
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
    } else {
      document.getElementById('turn-indicator').innerText = `Turn: ${duelData.currentTurn}'s turn to guess!`;
    }
  } else {
    document.getElementById('set-number-box').classList.remove('hidden-section');
    document.getElementById('guess-duel-box').classList.add('hidden-section');
    document.getElementById('secret-status').innerText = `Aryan Ready: ${aryanReady ? '✅' : '❌'} | Teresa Ready: ${teresaReady ? '✅' : '❌'}`;
  }

  document.getElementById('guess-feedback').innerText = duelData.feedback || 'No guesses made yet.';
}

function resetDuelGame() {
  roomRef.child('secretDuel').set({
    aryanSecret: null,
    teresaSecret: null,
    currentTurn: 'Aryan',
    feedback: 'Game Reset! Lock in your secret numbers.',
    winner: null
  });
  document.getElementById('secret-input').value = '';
}

listenToRoom();