// Navigation Switcher
function showSection(sectionId) {
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.add('hidden-section');
    sec.classList.remove('active-section');
  });
  document.getElementById(sectionId).classList.remove('hidden-section');
  document.getElementById(sectionId).classList.add('active-section');
}

// Tic-Tac-Toe Game Logic
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

  boardState[index] = currentPlayer;
  document.getElementsByClassName('cell')[index].innerText = currentPlayer;

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
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  document.getElementById('status').innerText = "Player X's Turn";
  Array.from(document.getElementsByClassName('cell')).forEach(cell => cell.innerText = '');
}