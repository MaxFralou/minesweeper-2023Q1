/* eslint-disable no-nested-ternary */
const minesweeper = document.querySelector('.minesweeper');

let numMines = 10;
let numRows = 10;
let numCols = 10;

function renderBoard() {
  const board = [];
  let gameOver = false;
  let numFlaggedMines = 0;
  let clicksCount = 0;
  minesweeper.innerHTML = '';
  board.length = 0;
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
  <div class="head-container">
    <div class="duration-title">Time: <span class="duration">00:00</span></div>
    <div>
      <span>dark mode</span>
      <input type="checkbox" id="color-theme">
    </div>
  </div>
  <div class="container-button">
    <div class="reset">new game</div>
    <div class="diff easy">10x10</div>
    <div class="diff medium">15x15</div>
    <div class="diff hard">25x25</div>
  </div>
  <div class="container-clicks">
    <div class="counter-clicks">Clicks: <span class="clicks">0</span></div>
    <div class="counter-flags">Flags: <span class="clicks-flags">0</span></div>
    <div>
      <input type="range" id="mines" name="mines" min="10" max="99" value="${numMines}" step="1">
      <label for="mines">Mines: <span class="mines">0</span></label>
    </div>
  </div>
`;
  boardHtml += '<div class="container">';
  for (let col = 0; col < board.length; col += 1) {
    boardHtml += `<div class="col ${col}">`;
    for (let row = 0; row < board[col].length; row += 1) {
      const cell = board[col][row];
      const cellContent = cell.isMine ? '💣' : cell.numAdjacentMines === 0 ? '' : cell.numAdjacentMines;
      const cellClass = cell.isMine ? 'mine' : cell.numAdjacentMines > 0 ? `neighbor-${cell.numAdjacentMines}` : '';
      boardHtml += `<div class="cell hidden ${cellClass}" data-row="${row}" data-col="${col}">${cellContent}</div>`;
    }
    boardHtml += '</div>';
  }
  boardHtml += '</div>';
  boardHtml += '</div>';
  minesweeper.innerHTML = boardHtml;

  const gameSizeBoard = document.querySelectorAll('.diff');

  gameSizeBoard.forEach((gameMode, index) => {
    gameMode.addEventListener('click', (e) => {
      if (e.target === gameMode) {
        if (index === 0) {
          numRows = 10;
          numCols = 10;
          renderBoard();
        } else if (index === 1) {
          numRows = 15;
          numCols = 15;
          renderBoard();
        } else if (index === 2) {
          numRows = 25;
          numCols = 25;
          renderBoard();
        }
      }
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

  let numUnrevealedCells;

  const updateUnrevealedCellsCount = () => {
    const revealedCells = document.querySelectorAll('.cell.clicked');
    numUnrevealedCells = numCols * numRows - revealedCells.length;
  };
  updateUnrevealedCellsCount();

  const checkWinCondition = () => {
    if (parseInt(numUnrevealedCells, 10) === parseInt(numMines, 10)) {
      alert(`Hooray! You found all mines in ${timerValue} and ${clicksCount} moves!`);
    }
  };

  const rangeInput = document.getElementById('mines');
  const minesCountSpan = document.querySelector('.mines');

  minesCountSpan.textContent = numMines;

  rangeInput.addEventListener('input', () => {
    numMines = rangeInput.value;
    minesCountSpan.textContent = numMines;
    updateUnrevealedCellsCount();
    renderBoard();
  });

  const reset = document.querySelector('.reset');
  reset.addEventListener('click', () => {
    renderBoard();
    rangeInput.value = numMines;
    updateUnrevealedCellsCount();
  });

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
  };

  const counterFlags = document.querySelector('.clicks-flags');

  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (e.button === 2) {
        e.target.classList.toggle('flag');
        if (e.target.classList.contains('flag')) {
          numFlaggedMines += 1;
          counterFlags.innerText = numFlaggedMines;
        } else {
          numFlaggedMines -= 1;
          counterFlags.innerText = numFlaggedMines;
        }
      }
    });
    cell.addEventListener('click', (e) => {
      const row = parseInt(e.target.dataset.row, 10);
      const col = parseInt(e.target.dataset.col, 10);
      clicksCount += 1;
      document.querySelector('.clicks').innerText = clicksCount;

      if (board[col][row].isMine === true) {
        gameOver = true;
        alert('GAME OVER. Try again and good luck!!!');

        cells.forEach((eCell) => {
          const cellRow = parseInt(eCell.dataset.row, 10);
          const cellCol = parseInt(eCell.dataset.col, 10);
          if (board[cellCol][cellRow].isMine === true) {
            eCell.classList.remove('hidden');
            eCell.classList.add('boom');
          }
        });
        return;
      }
      e.target.classList.remove('hidden');
      e.target.classList.add('clicked');
      revealAdjacentCells(col, row);
      updateUnrevealedCellsCount();
      checkWinCondition();
    });
  });

  const darkMode = document.getElementById('color-theme');
  darkMode.addEventListener('change', () => {
    minesweeper.classList.toggle('dark-theme', darkMode.checked);
  });
}

renderBoard();
