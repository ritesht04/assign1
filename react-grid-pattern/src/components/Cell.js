import React from 'react';

const Cell = ({ number, color }) => {
  const style = {
    backgroundColor: color,
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    border: '1px solid #444',
  };

  return (
    <div style={style}>
      {number}
    </div>
  );
};

export default Cell;
