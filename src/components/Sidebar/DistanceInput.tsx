import type { FC, ChangeEvent } from 'react';

const PRESETS_KM = [3, 5, 10, 21, 42];
const PRESETS_MI = [2, 3, 6, 13, 26];

interface DistanceInputProps {
  distance: number;
  unit: 'km' | 'mi';
  onChange: (distance: number) => void;
  onUnitChange: (unit: 'km' | 'mi') => void;
}

const DistanceInput: FC<DistanceInputProps> = ({
  distance,
  unit,
  onChange,
  onUnitChange,
}) => {
  const presets = unit === 'km' ? PRESETS_KM : PRESETS_MI;
  const max = unit === 'km' ? 42 : 26;
  const min = unit === 'km' ? 1 : 0.5;

  const handleSlider = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(parseFloat(e.target.value));
  const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= min && val <= max) onChange(val);
  };

  return (
    <div className="card">
      <div className="card-top-row">
        <span className="section-label">Distance</span>
        <div className="unit-toggle">
          <button
            className={`unit-btn${unit === 'km' ? ' active' : ''}`}
            onClick={() => onUnitChange('km')}
          >
            km
          </button>
          <button
            className={`unit-btn${unit === 'mi' ? ' active' : ''}`}
            onClick={() => onUnitChange('mi')}
          >
            mi
          </button>
        </div>
      </div>

      <div className="distance-display">
        <input
          type="number"
          className="distance-value-input"
          value={distance}
          min={min}
          max={max}
          step={unit === 'km' ? 0.5 : 0.5}
          onChange={handleNumber}
          aria-label="Distance value"
        />
        <span className="distance-unit">{unit}</span>
      </div>

      <div className="slider-wrapper">
        <input
          type="range"
          id="distance-slider"
          min={min}
          max={max}
          step={0.5}
          value={distance}
          onChange={handleSlider}
          aria-label="Distance slider"
          style={{ '--pct': `${((distance - min) / (max - min)) * 100}%` } as React.CSSProperties}
        />
      </div>

      <div className="presets">
        {presets.map((p) => (
          <button
            key={p}
            className={`preset-btn${distance === p ? ' active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
            {unit}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DistanceInput;

