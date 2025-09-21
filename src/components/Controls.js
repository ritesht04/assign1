import React from 'react';

const Controls = ({
  isRunning,
  onStartStop,
  rows,
  cols,
  onRowsChange,
  onColsChange,
}) => {
  return (
    <div className="Controls">
      <button onClick={onStartStop}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <label>
        Rows:
        <input
          type="number"
          value={rows}
          onChange={onRowsChange}
          min="5"
        />
      </label>
      <label>
        Columns:
        <input
          type="number"
          value={cols}
          onChange={onColsChange}
          min="5"
        />
      </label>
    </div>
  );
};

export default Controls;
