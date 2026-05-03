import type { FC, ChangeEvent } from 'react'
import { formatPace } from '../../utils/formatUtils'

interface Profile {
  value: 'foot-walking' | 'foot-hiking'
  label: string
}

const PROFILES: Profile[] = [
  { value: 'foot-walking', label: '🚶 Walking/Road' },
  { value: 'foot-hiking', label: '🥾 Trail/Hiking' }
]

interface PaceSettingsProps {
  pace: number
  unit: 'km' | 'mi'
  profile: 'foot-walking' | 'foot-hiking'
  onPaceChange: (pace: number) => void
  onProfileChange: (profile: 'foot-walking' | 'foot-hiking') => void
}

const PaceSettings: FC<PaceSettingsProps> = ({
  pace,
  unit,
  profile,
  onPaceChange,
  onProfileChange
}) => {
  const step = 0.5
  const min = 2.5
  const max = 12

  const handleProfileChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'foot-walking' | 'foot-hiking'
    onProfileChange(value)
  }

  return (
    <div className='card'>
      <span className='section-label'>Settings</span>

      <div className='setting-row'>
        <span className='setting-label'>Avg Pace</span>
        <div className='pace-control'>
          <button
            className='pace-btn'
            onClick={() => onPaceChange(Math.max(min, pace - step))}
            aria-label='Decrease pace'
          >
            −
          </button>
          <span className='pace-value'>
            {formatPace(pace, unit)}
            <span className='pace-unit-label'>/{unit}</span>
          </span>
          <button
            className='pace-btn'
            onClick={() => onPaceChange(Math.min(max, pace + step))}
            aria-label='Increase pace'
          >
            +
          </button>
        </div>
      </div>

      <div className='setting-row' style={{ marginTop: 12 }}>
        <span className='setting-label'>Surface</span>
        <div className='profile-select-wrapper'>
          <select
            className='profile-select'
            value={profile}
            onChange={handleProfileChange}
            aria-label='Route surface type'
          >
            {PROFILES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default PaceSettings
