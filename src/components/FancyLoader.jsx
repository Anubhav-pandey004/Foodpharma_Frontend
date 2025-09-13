import React from 'react';
import './FancyLoader.css';

export default function FancyLoader({ show, label = 'Processing...', inline = false }) {
  if (!show) return null;
  return (
    <div className= {inline ? 'fp-loader-overlay fp-inline' : 'fp-loader-overlay fp-fullscreen'} role="status" aria-live="polite">
      <div className="fp-roller">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
      <div className="fp-loader-text">{label}</div>
    </div>
  );
}

