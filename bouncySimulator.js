import { board } from './exampleInput.js';

// const boardElement = document.getElementById('board');

// Определение начального направления мяча (диагональное)
let direction = { x: 1, y: 1 }; // Начальное направление мяча

// Функция для получения случайного диагонального направления, отличного от текущего
function getRandomDirection(currentDirection) {
    const directions = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
    ];
    let newDirection = directions[Math.floor(Math.random() * directions.length)];
    while (newDirection.x === currentDirection.x && newDirection.y === currentDirection.y) {
        newDirection = directions[Math.floor(Math.random() * directions.length)];
    }
    return newDirection;
}

// Функция для получения случайной позиции на доске, которая не является стеной
function getRandomPosition() {
	let x, y;
	do {
		 x = Math.floor(Math.random() * (board.length - 2)) + 1;
		 y = Math.floor(Math.random() * (board[0].length - 2)) + 1;
	} while (board[x][y] !== '0');
	return { x, y };
}

// Инициализация доски, установка начальной позиции мяча и элементов Y
let ballPosition = getRandomPosition(); // Инициализация позиции мяча

function initializeBoard() {
	// Очистка предыдущих позиций
	board.forEach((row, rowIndex) => {
		 row.forEach((cell, colIndex) => {
			  if (cell === '1' || cell === 'Y') {
					board[rowIndex][colIndex] = '0';
			  }
		 });
	});

	// Установка позиции мяча
	ballPosition = getRandomPosition();
	board[ballPosition.x][ballPosition.y] = '1';

	// Установка позиций Y
	for (let i = 0; i < 2; i++) {
		 const yPos = getRandomPosition();
		 board[yPos.x][yPos.y] = 'Y';
	}
}


// Рендеринг доски
function renderBoard() {
	const boardElement = document.getElementById('board');
	boardElement.innerHTML = '';
	board.forEach((row) => {
		 row.forEach((cell) => {
			  const div = document.createElement('div');
			  div.className = 'cell';
			  if (cell === 'X') div.classList.add('wall');
			  if (cell === 'Y') div.classList.add('redirect');
			  if (cell === '1') div.classList.add('ball');
			  boardElement.appendChild(div);
		 });
	});
}

// Обновление позиции мяча
function updateBallPosition() {
	const nextX = ballPosition.x + direction.x;
	const nextY = ballPosition.y + direction.y;

	if (board[nextX][nextY] === 'X') {
		 // Collision with wall
		 if (board[ballPosition.x][nextY] === '0') {
			  // Vertical wall collision
			  direction.x = -direction.x; // Reverse horizontal direction
		 } else {
			  // Horizontal wall collision
			  direction.y = -direction.y; // Reverse vertical direction
		 }
	} else if (board[nextX][nextY] === 'Y') {
		 // Collision with Y
		 direction = getRandomDirection(direction);
		 board[nextX][nextY] = '0'; // Y turns into 0

		 // Find a random '0' position on the board and turn it into 'Y'
		 let randomX, randomY;
		 do {
			  randomX = Math.floor(Math.random() * board.length);
			  randomY = Math.floor(Math.random() * board[0].length);
		 } while (board[randomX][randomY] !== '0');

		 board[randomX][randomY] = 'Y';
	}

	// Move the ball
	if (board[nextX][nextY] !== 'X') {
		 board[ballPosition.x][ballPosition.y] = '0';
		 ballPosition.x = nextX;
		 ballPosition.y = nextY;
		 board[ballPosition.x][ballPosition.y] = '1';
	}
}


// Запуск симуляции
function startSimulation() {
    initializeBoard();
    renderBoard();
    setInterval(() => {
        updateBallPosition();
        renderBoard();
    }, 200);
}

startSimulation();