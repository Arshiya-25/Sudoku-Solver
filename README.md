# Sudoku Solver & Algorithm Visualizer

A modern, interactive Sudoku Solver that visualizes the entire solving process in real-time. It's built with vanilla JavaScript and styled with Tailwind CSS, providing a clean, responsive, and educational tool for understanding the Recursive Backtracking (DFS) algorithm.

🔗 **Live demo**: 

## Features
- Interactive Grid: A full 9x9 grid where users can input their own puzzles.
- Algorithm Visualization: Watch the backtracking algorithm work! The app animates the "guesses" (placing a number) and "backtracks" (removing a number) in real-time.
- Multiple Difficulties: Load "Easy," "Medium," "Hard," and "Extreme" puzzles with a single click.
- User Validation: A "Validate" button that checks the user's current board for errors (duplicates in rows, columns, or boxes) without solving.
- Fast & Responsive: The UI is built with Tailwind CSS for a modern, mobile-friendly experience.

## Core Concept: The Backtracking Algorithm (DFS)
The solver uses a Recursive Backtracking algorithm, a "smart" guess-and-check method based on Depth-First Search (DFS).
1. Find: Scans the board for the first empty cell.
2. Try: Attempts to place the first valid number (1-9) in that cell. A number is "valid" if it doesn't already exist in the same row, column, or 3x3 box.
3. Recurse:
   - If a valid number is found: It "guesses" the number is correct and recursively calls itself to solve for the next empty cell.
   - If no valid number is found (1-9 all fail): It has hit a dead end.
4. Backtrack: When it hits a dead end, it "backtracks" by erasing its last guess (setting the cell back to 0) and returning to the previous cell, forcing it to try its next number.

The visualization animates this "placing" (guessing) and "erasing" (backtracking) process in real-time.

## Technologies Used
- **HTML5**: For the application's semantic structure and layout.
- **Tailwind CSS & CSS3**: For all styling, responsiveness, and animations.
- **Vanilla JavaScript**: For all DOM manipulation and the core backtracking (DFS) algorithm, including ```async/await``` for the solve animation.

## How to Run This Project Locally
1. Clone the repo
```bash
git clone https://github.com/yourusername/sudoku-visualizer.git
cd sudoku-visualizer
```

2. Run locally
No build tools needed! Just open ```index.html``` in any browser.
