import React from 'react';
import Cell from './Cell';

const Grid = ({ rows, cols, pattern }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 50px)`,
    margin: '20px auto',
  };

  const gridCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellNumber = r * cols + c + 11;
      const color = pattern[r] && pattern[r][c] ? pattern[r][c] : 'green';
      gridCells.push(
        <Cell key={`${r}-${c}`} number={cellNumber} color={color} />
      );
    }
  }

  return (
    <div style={gridStyle}>
      {gridCells}
    </div>
  );
};

export default Grid;
