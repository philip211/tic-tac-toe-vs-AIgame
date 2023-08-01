// Создаем пустое игровое поле
let board = ["", "", "", "", "", "", "", "", ""];

// Массив возможных выигрышных комбинаций
const winCombinations = [
  // горизонтальные
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // вертикальные
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // диагональные
  [0, 4, 8],
  [2, 4, 6]
];

// Функция проверки победы
function checkWin(player) {
  for (const combination of winCombinations) {
    let isWinningCombination = true;
    for (const index of combination) {
      if (board[index] !== player) {
        isWinningCombination = false;
        break;
      }
    }
    if (isWinningCombination) {
      return true;
    }
  }
  return false;
}

// Функция проверки ничьей
function checkDraw() {
  return board.every(cell => cell !== "");
}

// Функция проверки победы AI
function checkWinAI() {
  const AI_SYMBOL = "O";
  return winCombinations.some(combination =>
    combination.every(index => board[index] === AI_SYMBOL)
  );
}

// Функция для совершения хода
function makeMove(index) {
  if (board[index] === "" && !checkWin("X") && !checkWin("O") && !checkDraw()) {
    board[index] = "X";
    renderBoard();
    if (!checkWinAI() && !checkDraw()) {
      setTimeout(() => makeAIMove(), 500); // Задержка, чтобы было заметно, что AI делает ход
    }
  }
}

// Функция для хода AI с использованием минимакса и альфа-бета отсечения
function makeAIMove() {
  const AI_SYMBOL = "O";
  let bestMove;
  let bestEval = -Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = AI_SYMBOL;
      const eval = minimaxAlphaBeta(board, 5, false, -Infinity, Infinity); // Глубина поиска - 5 (можно настроить)
      board[i] = ""; // Отменяем ход

      if (eval > bestEval) {
        bestEval = eval;
        bestMove = i;
      }
    }
  }

  board[bestMove] = AI_SYMBOL;
  renderBoard();
}

// Функция для оценки текущего состояния игры
function evaluate(board) {
  if (checkWin("X")) {
    return -1; // Возвращаем -1, если победили "X" (игрок)
  } else if (checkWin("O")) {
    return 1; // Возвращаем 1, если победил "O" (AI)
  } else if (checkDraw()) {
    return 0; // Возвращаем 0 в случае ничьей
  }

  // Если игра не завершена, продолжаем оценивать
  return null;
}

// Функция для поиска лучшего хода с использованием минимакса и альфа-бета отсечения
function minimaxAlphaBeta(board, depth, isMaximizingPlayer, alpha, beta) {
  const evaluation = evaluate(board);

  if (depth === 0 || evaluation !== null) {
    return evaluation;
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        const eval = minimaxAlphaBeta(board, depth - 1, false, alpha, beta);
        board[i] = ""; // Отменяем ход

        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) {
          break; // Альфа-бета отсечение
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        const eval = minimaxAlphaBeta(board, depth - 1, true, alpha, beta);
        board[i] = ""; // Отменяем ход

        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) {
          break; // Альфа-бета отсечение
        }
      }
    }
    return minEval;
  }
}

// Функция для отрисовки игрового поля
function renderBoard() {
  const cells = document.querySelectorAll(".cell");
  for (let i = 0; i < board.length; i++) {
    cells[i].textContent = board[i];
  }

  if (checkWin("X")) {
    alert("Поздравляю! Вы победили!");
    resetBoard();
  } else if (checkWin("O")) {
    alert("AI победил! Попробуйте еще раз.");
    resetBoard();
  } else if (checkDraw()) {
    alert("Ничья!");
    resetBoard();
  }
}

// Функция для сброса игрового поля
function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  renderBoard();
}
