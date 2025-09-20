const COLORS = {
  default: 'green',
  wave1: 'red',
  wave2: 'blue',
};

const WAVE_WIDTH = 3;
const WAVE_SEPARATION = 10; // This will create a gap between waves

export const getPattern = (rows, cols, time) => {
  const pattern = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const waveValue = (r + c + time) % WAVE_SEPARATION;
      let color = COLORS.default;
      if (waveValue < WAVE_WIDTH) {
        color = COLORS.wave1;
      } else if (waveValue >= Math.floor(WAVE_SEPARATION / 2) && waveValue < Math.floor(WAVE_SEPARATION / 2) + WAVE_WIDTH) {
        color = COLORS.wave2;
      }
      row.push(color);
    }
    pattern.push(row);
  }
  return pattern;
};
