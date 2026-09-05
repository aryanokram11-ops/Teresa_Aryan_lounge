function showSection(sectionId) {
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.add('hidden-section');
    sec.classList.remove('active-section');
  });
  document.getElementById(sectionId).classList.remove('hidden-section');
  document.getElementById(sectionId).classList.add('active-section');
}

// PeerJS Setup
let peer = new Peer();
let conn = null;
let myRole = 'X'; // Default role

let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

peer.on('open', (id) => {
  document.getElementById('my-id').innerText = id;
});

peer.on('connection', (connection) => {
  conn = connection;
  setupConnection();
});

function setRole(role) {
  myRole = role;
  document.getElementById('role-display').innerText = `You are playing as: ${myRole}`;
}

function connectToPartner() {
  const partnerId = document.getElementById('partner-id').value.trim();
  if (!partnerId) return;
  conn = peer.connect(partnerId);
  setupConnection();
}

function setupConnection() {
  document.getElementById('connection-status').innerText = "Status: Connected ❤️";
  
  conn.on('data', (data) => {
    if (data.type === 'sync') {
      boardState = data.boardState;
      currentPlayer = data.currentPlayer;
      gameActive = data.gameActive;
      updateUI();
      checkResult();
    }
  });
}

function makeMove(index) {
  if (boardState[index] !== '' || !gameActive) return;
  
  if (conn && currentPlayer !== myRole) {
    alert(`It's Player ${currentPlayer}'s turn! You are Player ${myRole}.`);
    return;
  }

  boardState[index] = currentPlayer;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  updateUI();
  checkResult();
  sendSync();
}

function sendSync() {
  if (conn) {
    conn.send({
      type: 'sync',
      boardState: boardState,
      currentPlayer: currentPlayer,
      gameActive: gameActive
    });
  }
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
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  updateUI();
  document.getElementById('status').innerText = "Game Restarted! Player X's Turn";
  sendSync();
}