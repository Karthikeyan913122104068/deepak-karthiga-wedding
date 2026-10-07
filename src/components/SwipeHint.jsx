import React from 'react';

export default function SwipeHint({ visible }) {
  if (!visible) return null;

  return (
    <div className="swipe-hint-centered" style={{ opacity: visible ? 1 : 0 }}>
      <div className="swipe-hint-minimal">
        <div className="swipe-icon-wrapper">
          <svg width="22" height="28" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 26V6" strokeLinecap="round" />
            <path d="M6 12L12 6L18 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="hint-text goldish-font">SWIPE UP TO EXPLORE</span>
      </div>
    </div>
  );
}
