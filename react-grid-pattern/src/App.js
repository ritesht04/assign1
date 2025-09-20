import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import { getPattern } from './pattern';
import './App.css';

function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [pattern, setPattern] = useState([]);

  useEffect(() => {
    const newPattern = getPattern(rows, cols, time);
    setPattern(newPattern);
  }, [rows, cols, time]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 100); // Animation speed
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 5) {
      setRows(value);
    }
  };

  const handleColsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 5) {
      setCols(value);
    }
  };

  return (
    <div className="App">
      <h1>React Grid Pattern</h1>
      <Controls
        isRunning={isRunning}
        onStartStop={handleStartStop}
        rows={rows}
        cols={cols}
        onRowsChange={handleRowsChange}
        onColsChange={handleColsChange}
      />
      <Grid rows={rows} cols={cols} pattern={pattern} />
    </div>
  );
}

export default App;
