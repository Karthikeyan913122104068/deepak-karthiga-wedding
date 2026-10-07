import React, { useState, useEffect, useRef } from 'react';
import TopBar from './components/TopBar.jsx';
import SwipeHint from './components/SwipeHint.jsx';
import ParticleCanvas from './components/ParticleCanvas.jsx';
import CalendarModal from './components/CalendarModal.jsx';
import Toast from './components/Toast.jsx';
import AlbumPage from './components/AlbumPage.jsx';

const ambientGradients = [
  'radial-gradient(circle at center, #3A0510 0%, #170205 60%, #060102 100%)', // Cover Page 0
  'radial-gradient(circle at center, #350A11 0%, #150205 60%, #060102 100%)', // Page 1 (Divine)
  'radial-gradient(circle at center, #450810 0%, #1A0205 60%, #060102 100%)', // Page 2 (Reveal)
  'radial-gradient(circle at center, #3C0A14 0%, #160205 60%, #060102 100%)', // Page 3 (Poetry)
  'radial-gradient(circle at center, #421B07 0%, #1A0802 60%, #060102 100%)', // Page 4 (Date)
  'radial-gradient(circle at center, #3F0913 0%, #160205 60%, #060102 100%)', // Page 5 (Venue)
  'radial-gradient(circle at center, #30091C 0%, #12020B 60%, #060102 100%)', // Page 6 (Azhaippu)
  'radial-gradient(circle at center, #381907 0%, #160802 60%, #060102 100%)', // Page 7 (Reception)
  'radial-gradient(circle at center, #28060F 0%, #100205 60%, #060102 100%)'  // Page 8 (Final)
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const isAnimatingRef = useRef(false);
  const viewportRef = useRef(null);

  // Go to page handler
  const goToPage = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= 9) return;
    if (isAnimatingRef.current && targetIndex !== currentIndex) return;

    isAnimatingRef.current = true;
    setCurrentIndex(targetIndex);

    if (targetIndex > 0 && !hasSwiped) {
      setHasSwiped(true);
    }

    // Auto-start music when swiping/navigating to scene 1 (targetIndex >= 1)
    if (targetIndex >= 1) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/bgm.mp3');
        audioRef.current.loop = true;
      }
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch((err) => {
          console.warn('Auto-play music on swipe prevented by browser:', err);
        });
      }
    }

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 950);
  };

  // Toast Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 1. Audio System (Nadhaswaram BGM Track)
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/bgm.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Auto-play attempt on initial user click anywhere on page
    const handleFirstUserGesture = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };

    window.addEventListener('click', handleFirstUserGesture);
    window.addEventListener('touchstart', handleFirstUserGesture);

    return () => {
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/bgm.mp3');
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;
    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
    } else {
      audio.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((e) => {
        console.warn('Audio play request failed:', e);
      });
    }
  };

  // 2. Countdown Engine
  useEffect(() => {
    const targetDate = new Date('2026-11-11T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days: days < 10 ? '0' + days : String(days),
        hours: hours < 10 ? '0' + hours : String(hours),
        minutes: minutes < 10 ? '0' + minutes : String(minutes),
        seconds: seconds < 10 ? '0' + seconds : String(seconds)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Touch Pointer Drag & Keyboard / Wheel Swipe Controller
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let startY = 0;
    let dragDeltaY = 0;
    let isDragging = false;
    let startTime = 0;

    const handlePointerDown = (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.modal-content') || e.target.closest('.side-indicator')) return;
      if (isAnimatingRef.current) return;

      isDragging = true;
      startY = e.clientY;
      dragDeltaY = 0;
      startTime = Date.now();
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      dragDeltaY = e.clientY - startY;
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;

      const duration = Date.now() - startTime;
      const vh = viewport.clientHeight;
      const threshold = vh * 0.12;

      if (Math.abs(dragDeltaY) > threshold || (Math.abs(dragDeltaY) > 30 && duration < 300)) {
        if (dragDeltaY < 0) {
          goToPage(currentIndex + 1);
        } else if (dragDeltaY > 0) {
          goToPage(currentIndex - 1);
        }
      }
    };

    viewport.addEventListener('pointerdown', handlePointerDown);
    viewport.addEventListener('pointermove', handlePointerMove);
    viewport.addEventListener('pointerup', handlePointerUp);
    viewport.addEventListener('pointercancel', handlePointerUp);

    let wheelTimeout;
    const handleWheel = (e) => {
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) > 20) {
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (e.deltaY > 0) {
            goToPage(currentIndex + 1);
          } else {
            goToPage(currentIndex - 1);
          }
        }, 40);
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: true });

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToPage(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPage(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      viewport.removeEventListener('pointerdown', handlePointerDown);
      viewport.removeEventListener('pointermove', handlePointerMove);
      viewport.removeEventListener('pointerup', handlePointerUp);
      viewport.removeEventListener('pointercancel', handlePointerUp);
      viewport.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  // Share Handler
  const handleShare = async () => {
    const shareData = {
      title: 'Wedding Invitation | E. Deepak Kumar & P. Karthiga',
      text: 'You are warmly invited to celebrate the wedding of E. Deepak Kumar & P. Karthiga.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        triggerToast('Invitation Link Copied!');
      } catch (err) {
        triggerToast('Invitation Link: ' + window.location.href);
      }
    }
  };

  // Download .ics handler
  const handleDownloadIcs = () => {
    if (!calendarEvent) return;

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Deepak & Karthiga Wedding//EN
BEGIN:VEVENT
SUMMARY:${calendarEvent.title}
DESCRIPTION:${calendarEvent.desc}
LOCATION:${calendarEvent.location}
DTSTART:${calendarEvent.start.replace(/[-:]/g, '')}T000000Z
DTEND:${calendarEvent.end.replace(/[-:]/g, '')}T000000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${calendarEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Calendar (.ics) Downloaded!');
    setCalendarEvent(null);
  };

  return (
    <>
      <div
        className="desktop-ambient-bg"
        style={{ background: ambientGradients[currentIndex] || ambientGradients[0] }}
      />

      <div className="film-viewport" ref={viewportRef}>
        <TopBar isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />

        <ParticleCanvas />

        <main className="album-stack">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <AlbumPage
              key={index}
              index={index}
              currentIndex={currentIndex}
              onOpenCalendar={(data) => setCalendarEvent(data)}
              onShare={handleShare}
              onReplay={() => goToPage(0)}
              countdownData={countdown}
            />
          ))}
        </main>
      </div>

      <CalendarModal
        isOpen={Boolean(calendarEvent)}
        onClose={() => setCalendarEvent(null)}
        eventData={calendarEvent}
        onDownloadIcs={handleDownloadIcs}
      />

      <Toast message={toastMessage} show={showToast} />
    </>
  );
}
