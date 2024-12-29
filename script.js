
const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const playerTurn = document.getElementById('player-turn');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[cellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    
    checkWin();
    checkDraw();
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameActive) {
        playerTurn.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && 
            gameState[a] === gameState[b] && 
            gameState[a] === gameState[c]) {
            gameActive = false;
            playerTurn.textContent = `Player ${currentPlayer} Wins!`;
            return;
        }
    }
}

function checkDraw() {
    if (!gameState.includes('') && gameActive) {
        gameActive = false;
        playerTurn.textContent = "Game Draw!";
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playerTurn.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);