import React from 'react';

export default function TopBar({ isMusicPlaying, toggleMusic }) {
  return (
    <header class="top-bar">
      <div className="couple-badge">D & K</div>
      <button 
        className={`music-btn ${isMusicPlaying ? 'playing' : ''}`} 
        onClick={toggleMusic} 
        aria-label="Toggle Audio"
      >
        <span className="music-ring"></span>
        <span className="music-icon">
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar3"></span>
        </span>
        <span className="music-label">{isMusicPlaying ? 'MUSIC ON' : 'MUSIC OFF'}</span>
      </button>
    </header>
  );
}
