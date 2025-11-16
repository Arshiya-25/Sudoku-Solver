document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("sudoku-grid");
  const solveBtn = document.getElementById("solve-btn");
  const validateBtn = document.getElementById("validate-btn");
  const clearBtn = document.getElementById("clear-btn");
  const puzzleSelect = document.getElementById("puzzle-select");
  const statusMessage = document.getElementById("status-message");
  const cells = []; 

  const ANIMATION_SPEED = 5;

  const puzzles = {
    easy: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    medium:"000000012000003000004050600050000007000100080000020000000300000200000500000900000",
    hard: "800000000003600000070090200050007000000045700000100030001000068008500010090000400",
    extreme:"000700000100000000000430000000000006000000000300000000000010000000000004000800000",
  };

  function createGrid() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("input");
        cell.type = "number";
        cell.className = "sudoku-cell";
        cell.setAttribute("data-row", r);
        cell.setAttribute("data-col", c);

        // Add input filtering
        cell.addEventListener("input", (e) => {
          if (e.target.value.length > 1) {
            e.target.value = e.target.value.slice(0, 1);
          }
          if (e.target.value === "0") {
            e.target.value = "";
          }
        });

        gridContainer.appendChild(cell);
        cells.push(cell);
      }
    }
  }

  function loadPuzzle(puzzleKey) {
    const puzzleString = puzzles[puzzleKey];
    clearGrid(); // Clear board first

    for (let i = 0; i < 81; i++) {
      const char = puzzleString[i];
      if (char !== "0" && char !== ".") {
        cells[i].value = char;
        cells[i].classList.add("pre-filled");
        cells[i].readOnly = true;
      }
    }
    setStatus(
      "Loaded puzzle: " + puzzleKey.charAt(0).toUpperCase() + puzzleKey.slice(1)
    );
  }

  function clearGrid() {
    for (const cell of cells) {
      cell.value = "";
      cell.readOnly = false;
      cell.classList.remove("pre-filled", "solved-cell", "error-cell");
    }
    setStatus("");
  }

  function setStatus(message) {
    statusMessage.textContent = message;
  }

  function getBoardFromDOM() {
    const board = [];
    for (let r = 0; r < 9; r++) {
      const row = [];
      for (let c = 0; c < 9; c++) {
        const cell = cells[r * 9 + c];
        const val = cell.value === "" ? 0 : parseInt(cell.value);
        row.push(val);
      }
      board.push(row);
    }
    return board;
  }


  function updateCellDOM(r, c, val, cssClass) {
    const cell = cells[r * 9 + c];
    cell.value = val === 0 ? "" : val;
    cell.classList.remove("solved-cell", "error-cell"); 
    if (cssClass) {
      cell.classList.add(cssClass);
    }
  }

 
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  /**
   * Checks if placing 'num' at board[r][c] is valid
   * @param {number[][]} board - The 9x9 board state
   * @param {number} r - The row index
   * @param {number} c - The column index
   * @param {number} num - The number (1-9) to check
   * @param {boolean} checkSelf - If true, checks against the cell itself
   */
  function isValid(board, r, c, num, checkSelf = false) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === num && (checkSelf || i !== c)) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (board[i][c] === num && (checkSelf || i !== r)) {
        return false;
      }
    }

    const boxRowStart = Math.floor(r / 3) * 3;
    const boxColStart = Math.floor(c / 3) * 3;
    for (let i = boxRowStart; i < boxRowStart + 3; i++) {
      for (let j = boxColStart; j < boxColStart + 3; j++) {
        if (board[i][j] === num && (checkSelf || (i !== r && j !== c))) {
          return false;
        }
      }
    }
    return true;
  }

  function validateBoard() {
    setStatus("Validating...");
    const board = getBoardFromDOM();
    let isValidBoard = true;

    for (const cell of cells) {
      cell.classList.remove("error-cell");
    }

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const num = board[r][c];
        if (num !== 0) {
          board[r][c] = 0;
          if (!isValid(board, r, c, num, true)) {
            cells[r * 9 + c].classList.add("error-cell");
            isValidBoard = false;
          }
          board[r][c] = num; 
        }
      }
    }

    setStatus(isValidBoard ? "Board is valid so far!" : "Errors found!");
    return isValidBoard;
  }

  // --- Backtracking Solver Logic ---

  async function solveSudoku() {
    const board = getBoardFromDOM();

    let find = findEmptyCell(board);
    if (!find) {
      return true; 
    }
    let [r, c] = find;

    for (let num = 1; num <= 9; num++) {
      if (isValid(board, r, c, num, true)) {
        board[r][c] = num; 
       
        updateCellDOM(r, c, num, "solved-cell");
        await sleep(ANIMATION_SPEED);

        if (await solveSudoku()) {
          return true; 
        }

        board[r][c] = 0;

        updateCellDOM(r, c, 0);
        await sleep(ANIMATION_SPEED / 2);
      }
    }

    return false; 
  }

  function findEmptyCell(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          return [r, c];
        }
      }
    }
    return null; 
  }

  solveBtn.addEventListener("click", async () => {
    for (let i = 0; i < 81; i++) {
      if (!cells[i].classList.contains("pre-filled")) {
        cells[i].value = "";
        cells[i].classList.remove("solved-cell", "error-cell");
      }
    }

    setStatus("Solving...");
    solveBtn.disabled = true;
    validateBtn.disabled = true;
    clearBtn.disabled = true;
    puzzleSelect.disabled = true;

    const startTime = performance.now();
    const isSolved = await solveSudoku();
    const endTime = performance.now();

    if (isSolved) {
      setStatus(`Solved in ${((endTime - startTime) / 1000).toFixed(2)}s!`);
    } else {
      setStatus("No solution found for this board.");
    }

    solveBtn.disabled = false;
    validateBtn.disabled = false;
    clearBtn.disabled = false;
    puzzleSelect.disabled = false;
  });

  validateBtn.addEventListener("click", validateBoard);
  clearBtn.addEventListener("click", clearGrid);
  puzzleSelect.addEventListener("change", (e) => loadPuzzle(e.target.value));

  createGrid();
  loadPuzzle("easy"); 
});
