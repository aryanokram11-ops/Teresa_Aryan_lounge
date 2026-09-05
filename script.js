function showSection(sectionId) {
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.add('hidden-section');
    sec.classList.remove('active-section');
  });
  document.getElementById(sectionId).classList.remove('hidden-section');
  document.getElementById(sectionId).classList.add('active-section');
}

// PeerJS Logic
let peer = new Peer();
let conn = null;
let myRole = ''; // 'X' or 'O'

peer.on('open', (id) => {
  document.getElementById('my-id').innerText = id;
});

peer.on('connection', (connection) => {
  conn = connection;
  myRole = 'O'; // Receiver becomes Player O
  setupConnection();
  document.getElementById('status').innerText = "Connected! Player X goes first.";
});

function connectToPartner() {
  const partnerId = document.getElementById('partner-id').value;
  if (!partnerId) return;
  conn = peer.connect(partnerId);
  myRole = 'X'; // Creator becomes Player X
  setupConnection();
  document.getElementById('status').innerText = "Connected! Your turn (Player X).";
}

function setupConnection() {
  document.getElementById('connection-status').innerText = "Status: Connected ❤️";
  conn.on('data', (data) => {
    if (data.type === 'move') {
      applyMove(data.index, data.player);
    } else if (data.type === 'reset') {
      localReset();
    }
  });
}

// Game Logic
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function makeMove(index) {
  if (boardState[index] !== '' || !gameActive) return;
  if (conn && currentPlayer !== myRole) {
    alert("It's not your turn!");
    return;
  }

  applyMove(index, currentPlayer);

  if (conn) {
    conn.send({ type: 'move', index: index, player: currentPlayer });
  }
}

function applyMove(index, player) {
  boardState[index] = player;
  document.getElementsByClassName('cell')[index].innerText = player;
  checkResult();
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
    document.getElementById('status').innerText = `Player ${currentPlayer} Wins! 💕`;
    gameActive = false;
    return;
  }

  if (!boardState.includes('')) {
    document.getElementById('status').innerText = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('status').innerText = `Player ${currentPlayer}'s Turn`;
}

function resetGame() {
  localReset();
  if (conn) {
    conn.send({ type: 'reset' });
  }
}

function localReset() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  document.getElementById('status').innerText = "Player X's Turn";
  Array.from(document.getElementsByClassName('cell')).forEach(cell => cell.innerText = '');
}