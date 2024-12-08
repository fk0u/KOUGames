let board = ['', '', '', '', '', '', '', '', '']; // State board
let currentPlayer = 'X'; // Player X starts
let gameOver = false;
let gameMode = 'player-vs-player'; // Default mode

// Elemen UI
const squares = document.querySelectorAll('.square');
const gameStatus = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const modeButtons = document.querySelectorAll('#player-vs-player, #player-vs-bot');

// Event Listener untuk memilih mode
modeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        gameMode = e.target.id === 'player-vs-bot' ? 'player-vs-bot' : 'player-vs-player';
        resetGame();
    });
});

// Event Listener untuk klik kotak
squares.forEach(square => {
    square.addEventListener('click', () => {
        const index = square.getAttribute('data-index');
        if (board[index] === '' && !gameOver) {
            makeMove(index);
        }
    });
});

// Restart Game
restartBtn.addEventListener('click', resetGame);

// Fungsi utama untuk memulai ulang permainan
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    gameStatus.textContent = "Player X's turn";
    squares.forEach(square => {
        square.textContent = '';
        square.classList.remove('pulse');
        gsap.to(square, { opacity: 1, scale: 1 }); // Reset animation with GSAP
    });
}

// Fungsi untuk membuat gerakan
function makeMove(index) {
    if (board[index] !== '' || gameOver) return;

    board[index] = currentPlayer;
    squares[index].textContent = currentPlayer;
    squares[index].classList.add('pulse');

    gsap.fromTo(squares[index], { scale: 0.5, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.3 }); // Animation on move

    if (checkWin()) {
        gameOver = true;
        gameStatus.textContent = `${currentPlayer} Wins!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;

    if (gameMode === 'player-vs-bot' && currentPlayer === 'O' && !gameOver) {
        setTimeout(botMove, 500); // Wait before bot moves
    }
}

// Cek apakah ada yang menang
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// AI Bot Move (Random and Complex)
function botMove() {
    let availableMoves = board.map((el, idx) => el === '' ? idx : -1).filter(idx => idx !== -1);
    let move = randomMove(availableMoves);
    makeMove(move);
}

// Function to generate a complex random move
function randomMove(moves) {
    let move = moves[Math.floor(Math.random() * moves.length)];

    // Add some randomness to ensure the bot is unpredictable
    return move + Math.floor(Math.random() * 3) % moves.length;
}
