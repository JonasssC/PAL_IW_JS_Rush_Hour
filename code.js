let board;

const DIRECTIONS = {
  'top': [-1, 0],
  'bottom': [1, 0],
  'left': [0, -1],
  'right': [0, 1],
};

class Board {
  #field = [
    [0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 2, 0],
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 4],
    [0, 3, 3, 3, 0, 4],
    [0, 0, 0, 0, 0, 0],
  ];
  
  last_move_id = 0;
  last_move_dir = '';
  
  constructor(field) {
    this.#field = JSON.parse(JSON.stringify(field));
    this.draw();
  }
  
  draw() {
    document.getElementById("board_container").innerHTML = this.html;
  }
  
  get html() {
    return `<table>${this.#field.map((row, row_index) => this.#row_to_html(row_index)).join('')}</table>`;
  }
  
  #row_to_html(row) {
    return `<tr ${this.#field[row].includes(1) ? 'class="end_row"' : ''}>${this.#field[row].map((id, col) => this.#cell_to_html(row, col)).join('')}</tr>`;
  }
  
  #cell_to_html(row, col) {
    return `<td class="${this.#get_animated_cell_classes(row, col)}" data-id="${this.#field[row][col]}" onclick="board.on_click(this)"></td>`;
  }
  
  #get_cell_classes(row, col) {
    if (this.#field[row][col] === 0)
      return '';
    else if (this.#cells_equal(row, col, row, col-1) && this.#cells_equal(row, col, row, col+1))
      return 'hor mid';
    else if (this.#cells_equal(row, col, row, col-1))
      return 'hor right';
    else if (this.#cells_equal(row, col, row, col+1))
      return 'hor left';
    else if (this.#cells_equal(row, col, row-1, col) && this.#cells_equal(row, col, row+1, col))
      return 'ver mid';
    else if (this.#cells_equal(row, col, row-1, col))
      return 'ver bottom';
    else if (this.#cells_equal(row, col, row+1, col))
      return 'ver top';
    
    return '';
  }
  
  #get_animated_cell_classes(row, col) {
    return `${this.#get_cell_classes(row, col)}${this.#field[row][col] === this.last_move_id ? ` move_${this.last_move_dir}` : ''}`;
  }
  
  #cells_equal(row1, col1, row2, col2) {
    if (!this.#is_in_field(row1, col1) || !this.#is_in_field(row2, col2))
      return false;
    
    return this.#field[row1][col1] === this.#field[row2][col2];
  }
  
  #is_in_field(row, col) {
    return row >= 0 && row < this.#field.length
        && col >= 0 && col < this.#field[row].length;
  }
  
  #is_winning_move(row, col, dir) {
    return dir === 'right'
      && this.#field[row][col] === 1
      && this.#field[row].length === col+1;
  }
  
  #is_valid_move(row, col, move) {
    return this.#is_in_field(row + move[0], col + move[1]) && this.#field[row + move[0]][col + move[1]] === 0;
  }
  
  #move(row, col, move) {
    this.#field[row + move[0]][col + move[1]] = this.#field[row][col];
    this.#field[row][col] = 0;
    if(this.#cells_equal(row + move[0], col + move[1], row - move[0], col - move[1]))
      this.#move(row - move[0], col - move[1], move);
  }
  
  on_click(cell) {
    let row = cell.parentNode.rowIndex;
    let col = cell.cellIndex;
    let dir = cell.classList.item(1);
    if(!(dir in DIRECTIONS)) return;
    let move = DIRECTIONS[dir];
    
    if (this.#is_winning_move(row, col, dir)) {
      alert("WIN");
      return;
    }
    
    if (!this.#is_valid_move(row, col, move)) return;
  
    this.last_move_id = this.#field[row][col];
    this.#move(row, col, move);
    this.last_move_dir = dir;
    
    this.draw();
  }
}

window.onload = async () => {
  board = new Board(LEVELS.intermediate);
}

const LEVELS = {
  "intermediate": [
    [ 3,  3,  7,  9,  0,  0],
    [ 2,  2,  7,  9,  0,  0],
    [ 8,  1,  1,  9,  0,  0],
    [ 8,  4,  4,  4,  0,  0],
    [ 8,  5,  5,  0,  0,  0],
    [ 6,  6,  6,  0,  0,  0],
  ],
  "advanced": [
    [ 0,  4,  0,  7,  7,  7],
    [ 2,  4,  0,  8, 10,  0],
    [ 2,  1,  1,  8, 10, 11],
    [ 3,  5,  5,  5, 10, 11],
    [ 3,  0,  6,  0,  0, 12],
    [ 0,  0,  6,  9,  9, 12],
  ],
  "expert": [
    [ 2,  0,  0,  6,  6,  6],
    [ 2,  3,  3,  7,  0,  0],
    [ 1,  1,  4,  7,  0, 11],
    [ 0,  0,  4,  8,  8, 11],
    [ 0,  0,  5,  9,  9, 11],
    [ 0,  0,  5, 10, 10, 10],
  ],
  "grand master": [
    [ 2,  2,  6,  0,  9,  9],
    [ 3,  3,  6,  0, 10,  0],
    [ 4,  0,  1,  1, 10,  0],
    [ 4,  7,  7,  7, 10, 11],
    [ 4,  0,  0,  8,  0, 11],
    [ 5,  5,  0,  8, 12, 12],
  ],
};