import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Pattern Logic (formerly in pattern.js) ---

/**
 * Initializes a grid with a specified number of rows and columns.
 * All cells are initially set to an "off" state (0).
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid.
 * @returns {number[][]} A 2D array representing the initial grid state.
 */
const initPattern = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

/**
 * Computes the next state of the grid based on a simple animation rule.
 * This example implements a "ripple" effect originating from the top-left corner.
 * The state of a cell toggles based on its distance from the origin and the current animation tick.
 * @param {number[][]} grid - The current grid state.
 * @param {number} tick - The current animation frame count.
 * @returns {number[][]} A new 2D array representing the next grid state.
 */
const stepPattern = (grid, tick) => {
  const newGrid = initPattern(grid.length, grid[0]?.length || 0); // Start with a fresh grid
  const rows = newGrid.length;
  if (rows === 0) return [];
  const cols = newGrid[0].length;

  // Make the snake length relative to the grid size for a nice effect
  const snakeLength = Math.max(5, Math.floor(Math.min(rows, cols) * 0.8));

  // Loop backwards to draw each segment of the snake's body
  for (let i = 0; i < snakeLength; i++) {
    const segmentTick = tick - i;
    if (segmentTick < 0) continue; // Don't draw segments from before time 0

    // Calculate the total number of cells to determine when the pattern should loop
    const totalCells = rows * cols;
    const effectiveTick = segmentTick % totalCells;

    // Determine the current row for this segment
    const snakeRow = Math.floor(effectiveTick / cols);

    let snakeCol;
    // Determine column based on whether the row is even or odd to create the zig-zag
    if (snakeRow % 2 === 0) {
      // On even rows (0, 2, ...), the snake moves from left to right
      snakeCol = effectiveTick % cols;
    } else {
      // On odd rows (1, 3, ...), the snake moves from right to left
      snakeCol = cols - 1 - (effectiveTick % cols);
    }

    // Light up the cell for this segment if it's within the grid bounds
    if (snakeRow < rows && snakeCol >= 0 && snakeCol < cols) {
      // Assign the segment's tick value to the cell for dynamic coloring
      // Newer segments (closer to the head) will have a higher tick value
      newGrid[snakeRow][snakeCol] = segmentTick;
    }
  }

  return newGrid;
};


// --- Helper Components ---

const IconPlay = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconPause = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


// --- Main App Component ---

export default function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState(() => initPattern(20, 10));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // ms
  const [tick, setTick] = useState(0);

  const animationIntervalRef = useRef(null);

  // --- Animation Logic ---

  const runStep = useCallback(() => {
    setGrid(g => stepPattern(g, tick));
    setTick(t => t + 1);
  }, [tick]);

  useEffect(() => {
    if (isRunning) {
      animationIntervalRef.current = setInterval(runStep, speed);
    } else {
      clearInterval(animationIntervalRef.current);
    }
    return () => clearInterval(animationIntervalRef.current);
  }, [isRunning, speed, runStep]);

  // --- User Interaction Handlers ---

  const handleCellClick = (r, c) => {
    if (isRunning) return; // Prevent editing while running for simplicity
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] ? 0 : 1;
    setGrid(newGrid);
  };

  const handleRowsChange = (e) => {
    const newRows = Math.max(5, parseInt(e.target.value, 10) || 5);
    setRows(newRows);
    setGrid(initPattern(newRows, cols));
    setTick(0);
  };

  const handleColsChange = (e) => {
    const newCols = Math.max(5, parseInt(e.target.value, 10) || 5);
    setCols(newCols);
    setGrid(initPattern(rows, newCols));
    setTick(0);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value, 10));
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleClear = () => {
    setIsRunning(false);
    setGrid(initPattern(rows, cols));
    setTick(0);
  };

  // --- Render ---

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-cyan-400">Generative Grid Animator</h1>

        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Row/Col Inputs */}
          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-400">Rows</label>
            <input type="number" id="rows" value={rows} onChange={handleRowsChange} min="5" className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
          <div>
            <label htmlFor="cols" className="block text-sm font-medium text-gray-400">Columns</label>
            <input type="number" id="cols" value={cols} onChange={handleColsChange} min="5" className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>

          {/* Speed Slider */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="speed" className="block text-sm font-medium text-gray-400">Speed ({speed}ms)</label>
            <input type="range" id="speed" min="20" max="500" step="10" value={speed} onChange={handleSpeedChange} className="mt-1 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 md:col-span-1 flex items-center justify-center space-x-2">
              <button onClick={handleStartStop} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors duration-200 shadow-lg">
                {isRunning ? <IconPause /> : <IconPlay />}
                <span className="ml-2">{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button onClick={handleClear} className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors duration-200 shadow-lg">
                Clear
              </button>
          </div>
        </div>

        {/* Grid Display */}
        <div className="bg-gray-900 p-2 rounded-lg border-2 border-gray-700 overflow-hidden">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gap: '2px',
              aspectRatio: `${cols} / ${rows}`
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  style={cell > 0 ? { backgroundColor: `hsl(${(cell * 10) % 360}, 100%, 60%)` } : {}}
                  className={`w-full h-full rounded transition-colors duration-100 ${
                    cell > 0 ? '' : 'bg-gray-700 hover:bg-gray-600'
                  } ${!isRunning ? 'cursor-pointer' : ''}`}
                />
              ))
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Click cells to toggle their state when the animation is paused.
        </p>
      </div>
    </div>
  );
}
