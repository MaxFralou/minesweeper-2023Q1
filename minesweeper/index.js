const minesweeper = document.querySelector('.minesweeper');

function renderBoard() {
  const size = 10;
  const numMines = 10;
  const board = [];

  for (let i = 0; i < size; i += 1) {
    const row = new Array(size).fill(0);
    board.push(row);
  }

  const bombs = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      bombs.push([row, col]);
    }
  }
  bombs.sort(() => Math.random() - 0.5);
  for (let i = 0; i < numMines; i += 1) {
    const [row, col] = bombs[i];
    board[row][col] = '💣';
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] !== '💣') {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i += 1) {
          for (let j = col - 1; j <= col + 1; j += 1) {
            if (i >= 0 && i < size && j >= 0 && j < size && board[i][j] === '💣') {
              count += 1;
            }
          }
        }
        board[row][col] = count;
      }
    }
  }
  let boardHtml = '<div class="container">';
  for (let row = 0; row < board.length; row += 1) {
    boardHtml += `<div class="row ${row + 1}">`;
    for (let col = 0; col < board[row].length; col += 1) {
      const value = board[row][col];
      if (value === '💣') {
        boardHtml += `<div class="cell bomb">${value}</div>`;
      } else {
        boardHtml += `<div class="cell">${value}</div>`;
      }
    }
    boardHtml += '</div>';
  }
  boardHtml += '</div>';
  minesweeper.innerHTML = boardHtml;
  console.log(board);
}
renderBoard();
