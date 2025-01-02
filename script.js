let currentPlayer = 'X'; // X is human, O is AI
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = {
    X: 0,
    O: 0
};

const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';

const cells = document.querySelectorAll('.cell');
const playerTurn = document.getElementById('player-turn');
const resetButton = document.getElementById('reset-button');

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[index] !== '' || !gameActive || currentPlayer !== HUMAN_PLAYER) return;

    // Human move
    makeMove(index);

    // AI move
    if (gameActive) {
        currentPlayer = AI_PLAYER;
        playerTurn.textContent = "AI is thinking...";

        // Add delay to make AI move feel more natural
        setTimeout(() => {
            const bestMove = findBestMove();
            makeMove(bestMove);
            if (gameActive) {
                currentPlayer = HUMAN_PLAYER;
                playerTurn.textContent = "Your turn";
            }
        }, 500);
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    if (checkWin()) {
        gameActive = false;
        const winner = currentPlayer === HUMAN_PLAYER ? "You win!" : "AI wins!";
        playerTurn.textContent = winner;
        highlightWinningCells();
        updateScore();
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        playerTurn.textContent = "It's a Draw!";
        return;
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = AI_PLAYER;
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    let result = checkGameState();

    if (result !== null) {
        return result === AI_PLAYER ? 1 :
            result === HUMAN_PLAYER ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = AI_PLAYER;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = HUMAN_PLAYER;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkGameState() {
    for (let combination of winningCombinations) {
        if (gameBoard[combination[0]] &&
            gameBoard[combination[0]] === gameBoard[combination[1]] &&
            gameBoard[combination[0]] === gameBoard[combination[2]]) {
            return gameBoard[combination[0]];
        }
    }
    return gameBoard.includes('') ? null : 'tie';
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => gameBoard[index] === currentPlayer)) {
            combination.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
        }
    });
}

function updateScore() {
    scores[currentPlayer]++;
    document.getElementById(`${currentPlayer.toLowerCase()}-score`).textContent = scores[currentPlayer];
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = HUMAN_PLAYER;
    playerTurn.textContent = "Your turn";

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initialize game
resetGame();
