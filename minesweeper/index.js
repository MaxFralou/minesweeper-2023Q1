const minesweeper = document.querySelector('.minesweeper');

const numMines = 10;
const numRows = 10;
const numCols = 10;
const board = [];
let clicksCount = 0;

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
  let boardHtml = '<div class="info"><div class="duration-title">Duration: <span class="duration">00:00</span></div><div class="counter-clicks">Clicks: <span class="clicks">0</span></div></div></div>';
  boardHtml += '<div class="container">';
  for (let col = 0; col < board.length; col += 1) {
    boardHtml += `<div class="col ${col}">`;
    for (let row = 0; row < board[col].length; row += 1) {
      const cell = board[col][row];
      // eslint-disable-next-line no-nested-ternary
      boardHtml += `<div class="cell" data-row="${row}" data-col="${col}"> ${cell.isMine ? '💣' : cell.numAdjacentMines}</div>`;
    }
    boardHtml += '</div>';
  }
  boardHtml += '</div>';
  minesweeper.innerHTML = boardHtml;
}

renderBoard();

const cells = document.querySelectorAll('.cell');

cells.forEach((cell) => {
  cell.addEventListener('click', (e) => {
    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    clicksCount += 1;
    document.querySelector('.clicks').innerText = clicksCount;
    console.log(row, col);
  });
});

let seconds = 0;
setInterval(() => {
  seconds += 1;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  document.querySelector('.duration').innerText = `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}, 1000);
