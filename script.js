
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
//add a function to find the best move for the AI
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Add helper function to implement minimax algorithm
function minimax(gameState, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return result === 'O' ? 1 : result === 'X' ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, depth + 1, false);
                gameState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'X';
                let score = minimax(gameState, depth + 1, true);
                gameState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
// Add helper function to check winner for minimax
function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    return gameState.includes('') ? null : 'tie';
}


// with the support of Amazon Q handleCellClick function
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[cellIndex] !== '' || !gameActive) {
        return;
    }

    // Player's move
    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkWin();
    checkDraw();

    if (gameActive) {
        currentPlayer = 'O';
        playerTurn.textContent = "AI's Turn";

        // Add slight delay for AI move
        setTimeout(() => {
            // AI's move
            const aiMove = findBestMove();
            gameState[aiMove] = currentPlayer;
            cells[aiMove].textContent = currentPlayer;

            checkWin();
            checkDraw();

            currentPlayer = 'X';
            if (gameActive) {
                playerTurn.textContent = "Player X's Turn";
            }
        }, 500);
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
