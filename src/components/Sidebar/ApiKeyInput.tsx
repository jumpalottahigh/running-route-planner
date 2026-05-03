import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

const ApiKeyInput: FC<ApiKeyInputProps> = ({ apiKey, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey || '');

  const handleSave = () => {
    onChange(localKey.trim());
    localStorage.setItem('ors_api_key', localKey.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalKey(e.target.value);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="card api-key-card">
      <span className="section-label">🔑 API Key</span>
      <p className="api-hint">
        Free key from{' '}
        <a
          href="https://openrouteservice.org/dev/#/signup"
          target="_blank"
          rel="noopener noreferrer"
        >
          openrouteservice.org
        </a>
      </p>
      <div className="api-input-row">
        <input
          type={visible ? 'text' : 'password'}
          className="api-input"
          placeholder="Paste your API key…"
          value={localKey}
          onChange={handleChange}
          aria-label="API key input"
        />
        <button
          className="icon-btn"
          onClick={toggleVisibility}
          aria-label={visible ? 'Hide key' : 'Show key'}
          title={visible ? 'Hide' : 'Show'}
        >
          {visible ? '🙈' : '👁️'}
        </button>
      </div>
      <button className="btn btn-sm" onClick={handleSave}>
        Save Key
      </button>
    </div>
  );
};

export default ApiKeyInput;

