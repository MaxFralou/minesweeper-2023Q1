const minesweeper = document.querySelector('.minesweeper');

const numMines = 10;
const numRows = 10;
const numCols = 10;
const board = [];
let gameOver = false;
let clicksCount = 0;
let numUnrevealedCells;

const updateUnrevealedCellsCount = () => {
  const revealedCells = document.querySelectorAll('.cell.clicked');
  numUnrevealedCells = numCols * numRows - revealedCells.length;
};

function renderBoard() {
  for (let col = 0; col < numCols; col += 1) {
    const rowArray = [];
    for (let row = 0; row < numRows; row += 1) {
      rowArray.push({
        isMine: false,
        revealed: false,
        numAdjacentMines: 0,
      });
    }
    board.push(rowArray);
  }
  let minesAdded = 0;
  while (minesAdded < numMines) {
    const row = Math.floor(Math.random() * numRows);
    const col = Math.floor(Math.random() * numCols);
    if (!board[col][row].isMine) {
      board[col][row].isMine = true;
      minesAdded += 1;

      for (let i = col - 1; i <= col + 1; i += 1) {
        for (let j = row - 1; j <= row + 1; j += 1) {
          if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
            board[i][j].numAdjacentMines += 1;
          }
        }
      }
    }
  }
  let boardHtml = `
  <div class="wrapper">
    <div class="duration-title">Time: <span class="duration">00:00</span></div>
    <div class="container-button">
      <div class="reset">RESET</div>
      <div class="diff easy">10x10</div>
      <div class="diff medium">15x15</div>
      <div class="diff hard">25x25</div>
    </div>
    <div class="container-clicks">
      <div class="counter-clicks">Clicks: <span class="clicks">0</span></div>
      <div class="counter-flags">Flags: <span class="clicks-flags">0</span></div>
      <div>
        <input type="range" id="mines" name="mines" min="10" max="99" value="10" step="1">
        <label for="mines">Mines: <span class="mines">0</span></label>
      </div>
    </div>
`;
  boardHtml += '<div class="container">';
  for (let col = 0; col < board.length; col += 1) {
    boardHtml += `<div class="col ${col}">`;
    for (let row = 0; row < board[col].length; row += 1) {
      const cell = board[col][row];
      // eslint-disable-next-line no-nested-ternary
      const cellContent = cell.isMine ? '💣' : cell.numAdjacentMines === 0 ? '' : cell.numAdjacentMines;
      // eslint-disable-next-line no-nested-ternary
      const cellClass = cell.isMine ? 'mine' : cell.numAdjacentMines > 0 ? `neighbor-${cell.numAdjacentMines}` : '';
      boardHtml += `<div class="cell hidden ${cellClass}" data-row="${row}" data-col="${col}">${cellContent}</div>`;
    }
    boardHtml += '</div>';
  }
  boardHtml += '</div>';
  boardHtml += '</div>';
  minesweeper.innerHTML = boardHtml;
  updateUnrevealedCellsCount();
}

renderBoard();

const cells = document.querySelectorAll('.cell');

const getAdjacentCells = (col, row) => {
  const adjacentCells = [];
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      const adjacentRow = row + i;
      const adjacentCol = col + j;
      const isSameCell = i === 0 && j === 0;
      const isRowInRange = adjacentRow >= 0 && adjacentRow < numRows;
      const isColInRange = adjacentCol >= 0 && adjacentCol < numCols;
      if (!isSameCell && isRowInRange && isColInRange) {
        const adjacentCell = document.querySelector(`.cell[data-row="${adjacentRow}"][data-col="${adjacentCol}"]`);
        if (adjacentCell) {
          adjacentCells.push(adjacentCell);
        }
      }
    }
  }
  return adjacentCells;
};

const revealAdjacentCells = (col, row) => {
  if (board[col][row].numAdjacentMines === 0) {
    const adjacentCells = getAdjacentCells(col, row);
    adjacentCells.forEach((cell) => {
      const cellRow = parseInt(cell.dataset.row, 10);
      const cellCol = parseInt(cell.dataset.col, 10);
      if (!cell.classList.contains('clicked')) {
        cell.classList.remove('hidden');
        cell.classList.add('clicked');
        revealAdjacentCells(cellCol, cellRow);
      }
    });
  } else {
    numUnrevealedCells -= 1;
  }

  updateUnrevealedCellsCount();
  // eslint-disable-next-line no-use-before-define
  checkWinCondition();
};

cells.forEach((cell) => {
  cell.addEventListener('click', (e) => {
    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    clicksCount += 1;
    document.querySelector('.clicks').innerText = clicksCount;

    if (board[col][row].isMine === true) {
      gameOver = true;
      // eslint-disable-next-line no-alert
      alert('GAME OVER');
      // eslint-disable-next-line no-shadow
      cells.forEach((cell) => {
        const cellRow = parseInt(cell.dataset.row, 10);
        const cellCol = parseInt(cell.dataset.col, 10);
        if (board[cellCol][cellRow].isMine === true) {
          cell.classList.remove('hidden');
          cell.classList.add('boom');
        }
      });
      return;
    }
    e.target.classList.remove('hidden');
    e.target.classList.add('clicked');
    revealAdjacentCells(col, row);
    updateUnrevealedCellsCount();
  });
});

let seconds = 0;
let timerValue = '';

const timer = document.querySelector('.duration');
const intervalId = setInterval(() => {
  seconds += 1;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerValue = `${minutes < 10 ? '0' : ''}${minutes} min : ${remainingSeconds < 10 ? '0' : ''} ${remainingSeconds} sec`;
  timer.innerText = timerValue;
  if (gameOver === true) {
    clearInterval(intervalId);
  }
}, 1000);

const checkWinCondition = () => {
  if (numUnrevealedCells === numMines) {
    alert(`Congratulations, you win! It took you ${timerValue} and ${clicksCount} moves, try again and good luck!!!`);
  }
};
