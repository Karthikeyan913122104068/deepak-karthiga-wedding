import React from 'react';

export default function SideIndicator({ currentIndex, totalPages = 9, onSelectPage }) {
  const dots = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav className="side-indicator">
      <div className="indicator-header">00</div>
      <div className="indicator-track">
        <span className="ind-line"></span>
        {dots.map((index) => (
          <div
            key={index}
            className={`ind-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPage(index);
            }}
          />
        ))}
      </div>
      <div className="page-counter">0{currentIndex} / 08</div>
    </nav>
  );
}
