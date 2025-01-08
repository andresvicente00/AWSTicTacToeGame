'use strict';

class TicTacToe {
    constructor() {
        this.isAIThinking = false;
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.scores = { X: 0, O: 0 };
        this.playerNames = { X: 'Player X', O: 'AI' };

        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initializeElements();
        this.addEventListeners();
        this.loadGameState();
    }

    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.playerTurn = document.getElementById('player-turn');
        this.resetButton = document.getElementById('reset-button');
        this.newGameButton = document.getElementById('new-game-button');
        this.startButton = document.getElementById('start-game');
        this.playerForm = document.getElementById('player-form');
        this.xScoreElement = document.getElementById('x-score');
        this.oScoreElement = document.getElementById('o-score');
        this.xScoreLabel = document.getElementById('x-score-label');
        this.oScoreLabel = document.getElementById('o-score-label');
    }

    addEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
            cell.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCellClick(cell);
                }
            });
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.newGameButton.addEventListener('click', () => this.fullReset());

        this.playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startGame();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
        });
    }

    startGame() {
        const playerXName = document.getElementById('player-x').value.trim();
        const playerOName = document.getElementById('player-o').value.trim();

        if (playerXName && playerOName) {
            this.playerNames.X = playerXName;
            this.playerNames.O = playerOName;
            this.xScoreLabel.textContent = playerXName;
            this.oScoreLabel.textContent = playerOName;
            this.gameActive = true;
            this.resetGame();
            this.playerForm.style.display = 'none';
        }
    }

    handleCellClick(cell) {
        if (!this.gameActive || this.isAIThinking) return;
        if (this.currentPlayer === 'O' && this.playerNames.O === 'AI') return;

        const index = parseInt(cell.dataset.index);
        if (this.board[index] !== '') return;

        this.makeMove(index);
    }

    makeMove(index) {
        try {
            this.validateMove(index);
            this.board[index] = this.currentPlayer;
            this.cells[index].textContent = this.currentPlayer;

            const winningCombo = this.checkWin();
            if (winningCombo) {
                this.handleWin(winningCombo);
            } else if (this.checkDraw()) {
                this.handleDraw();
            } else {
                this.switchPlayer();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    validateMove(index) {
        if (index < 0 || index > 8) {
            throw new Error('Invalid cell index');
        }
        if (this.board[index] !== '') {
            throw new Error('Cell already occupied');
        }
        if (!this.gameActive) {
            throw new Error('Game is not active');
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();

        if (this.currentPlayer === 'O' && this.playerNames.O === 'AI' && this.gameActive) {
            this.makeAIMove();
        }
    }

    makeAIMove() {
        if (this.isAIThinking) return;
        this.isAIThinking = true;

        const emptyCells = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            setTimeout(() => {
                if (this.gameActive) {
                    this.makeMove(randomIndex);
                }
                this.isAIThinking = false;
            }, 500);
        }
    }

    checkWin() {
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                return combination;
            }
        }
        return null;
    }

    highlightWinningCombination(combination) {
        const directions = {
            '012': 'horizontal',
            '345': 'horizontal',
            '678': 'horizontal',
            '036': 'vertical',
            '147': 'vertical',
            '258': 'vertical',
            '048': 'diagonal-1',
            '246': 'diagonal-2'
        };

        const combinationString = combination.join('');
        const direction = directions[combinationString] || 'horizontal';

        combination.forEach(index => {
            const cell = this.cells[index];
            cell.classList.add('winner');
            cell.dataset.winDirection = direction;
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin(winningCombo) {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.highlightWinningCombination(winningCombo);
        this.playerTurn.textContent = `${this.playerNames[this.currentPlayer]} wins!`;
        this.saveGameState();
    }

    handleDraw() {
        this.gameActive = false;
        this.playerTurn.textContent = "It's a draw!";
        this.saveGameState();
    }

    handleError(error) {
        console.error('Game Error:', error);
        this.playerTurn.textContent = 'An error occurred. Please reset the game.';
        this.gameActive = false;
    }

    updateStatus() {
        if (this.gameActive) {
            this.playerTurn.textContent = `${this.playerNames[this.currentPlayer]}'s Turn`;
        }
    }

    updateScores() {
        this.xScoreElement.textContent = this.scores.X;
        this.oScoreElement.textContent = this.scores.O;
    }

    saveGameState() {
        const gameState = {
            scores: this.scores,
            playerNames: this.playerNames
        };
        localStorage.setItem('tictactoeState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('tictactoeState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.scores = state.scores;
            this.playerNames = state.playerNames;
            this.updateScores();
            this.xScoreLabel.textContent = this.playerNames.X;
            this.oScoreLabel.textContent = this.playerNames.O;
        }
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
            delete cell.dataset.winDirection;
        });
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isAIThinking = false;
        this.updateStatus();
    }

    fullReset() {
        this.scores = { X: 0, O: 0 };
        this.playerNames = { X: 'Player X', O: 'AI' };
        localStorage.removeItem('tictactoeState');
        this.updateScores();
        this.xScoreLabel.textContent = this.playerNames.X;
        this.oScoreLabel.textContent = this.playerNames.O;
        this.playerForm.style.display = 'block';
        this.playerForm.reset();
        this.resetGame();
        this.gameActive = false;
        this.playerTurn.textContent = 'Enter player names to start';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
document.addEventListener('DOMContentLoaded', function() {
    const playerForm = document.getElementById('player-form');
    const gameBoard = document.querySelector('.game-board');
    const resetButton = document.getElementById('reset-button');
    const newGameButton = document.getElementById('new-game-button');
    const gameInfo = document.querySelector('.game-info');

    // Initially hide game elements
    gameBoard.style.display = 'none';
    resetButton.style.display = 'none';
    newGameButton.style.display = 'none';
    gameInfo.style.display = 'none';

    // Show game board and buttons  when form is submitted
    playerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        gameBoard.style.display = 'grid';
        // Show the control buttons
        resetButton.style.display = 'block';
        newGameButton.style.display = 'block';
        //show game info
        gameInfo.style.display = 'block';
    });

    // Hide game board when New Game button is clicked
    newGameButton.addEventListener('click', function() {
        gameBoard.style.display = 'none';
       
        // Hide the control buttons
        resetButton.style.display = 'none';
        newGameButton.style.display = 'none';
        gameInfo.style.display = 'none';

        // Optional: Reset the form and show it again
        playerForm.reset();
        playerForm.style.display = 'block';
        
        // Optional: Reset the player turn message
        document.getElementById('player-turn').textContent = 'Start game or enter names';
    });
});



