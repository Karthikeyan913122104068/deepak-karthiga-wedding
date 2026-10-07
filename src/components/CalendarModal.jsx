import React from 'react';

export default function CalendarModal({ isOpen, onClose, eventData, onDownloadIcs }) {
  if (!isOpen || !eventData) return null;

  const gStart = eventData.start.replace(/[-:]/g, '') + 'Z';
  const gEnd = eventData.end.replace(/[-:]/g, '') + 'Z';
  const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventData.title
  )}&details=${encodeURIComponent(eventData.desc)}&location=${encodeURIComponent(
    eventData.location
  )}&dates=${gStart}/${gEnd}`;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title goldish-font">Add to Calendar</h3>
        <p className="modal-subtitle">{eventData.title}</p>

        <div className="calendar-options">
          <a href={gUrl} target="_blank" rel="noopener noreferrer" className="calendar-opt-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
            </svg>
            Google Calendar
          </a>
          <button className="calendar-opt-btn" onClick={onDownloadIcs}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Apple / Outlook (.ics)
          </button>
        </div>
      </div>
    </div>
  );
}
