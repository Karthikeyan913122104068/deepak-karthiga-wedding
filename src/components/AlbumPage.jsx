import React, { useRef, useEffect } from 'react';

export default function AlbumPage({
  index,
  currentIndex,
  dragProgress,
  onOpenCalendar,
  onShare,
  onReplay,
  countdownData
}) {
  const videoRef = useRef(null);

  const isActive = index === currentIndex;
  const isPrev = index < currentIndex;
  const isNext = index > currentIndex;

  let pageStateClass = 'next';
  if (isActive) pageStateClass = 'active';
  else if (isPrev) pageStateClass = 'prev';

  // Video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video.playbackRate = 0.85; // Smooth video speed matching text pacing
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.log('Autoplay handled:', err));
      }
    } else {
      video.pause();
    }
  }, [isActive]);

  const videoSources = [
    '/scence2.mp4', // Cover Page 0: Landing Cover with Rose Petals & Sparkles
    '/scence1.mp4', // Page 1: Divine Blessing (Temple Sanctum Oil Lamps)
    '/scence2.mp4', // Page 2: Invitation Reveal (Rose Petals & Gold Sparkles)
    '/scence3.mp4', // Page 3: Emotional Poetry (Bride playing Veena under Mandap)
    '/scence4.mp4', // Page 4: Wedding Date (Aerial Temple Sunrise View)
    '/scence7.mp4', // Page 5: Sacred Temple Venue (Thiruparankundram Temple Gopuram & Sunrise)
    '/scence5.mp4', // Page 6: Manamakkal Azhaippu (Jayasudha Mahal Entrance with Marigold & Banana Trees)
    '/scence9.mp4', // Page 7: Reception (Firm's Banquet Hall Modern Chandelier Decor)
    '/scence8.mp4'  // Page 8: Final Blessing (Bride & Groom in Silk Attire facing Temple)
  ];

  return (
    <section className={`album-page ${pageStateClass}`} data-index={index}>
      <div className="video-layer">
        <video
          ref={videoRef}
          key={videoSources[index]}
          className="scene-video"
          preload="auto"
          loop
          muted
          playsInline
        >
          <source src={videoSources[index]} type="video/mp4" />
        </video>
        <div
          className={`video-overlay ${
            index === 0
              ? 'vignette-center-dark'
              : index === 1
              ? 'vignette-editorial'
              : index === 2
              ? 'vignette-editorial'
              : index === 3
              ? 'vignette-editorial'
              : index === 8
              ? 'gradient-bottom-dark'
              : 'gradient-bottom-editorial'
          }`}
        />
      </div>

      <div className={`typography-layer page-content-${index}`}>
        {/* COVER PAGE 0: LANDING & TUTORIAL SWIPE HINT */}
        {index === 0 && (
          <div className="cover-landing-box">
            <span className="eyebrow-text reveal-eyebrow">WEDDING INVITATION</span>
            <h1 className="cover-couple-title reveal-title goldish-font">
              E. DEEPAK KUMAR <span className="script-and">&</span> P. KARTHIGA
            </h1>
            <div className="gold-divider-line reveal-divider"></div>
            <div className="swipe-hint-minimal reveal-action">
              <div className="swipe-icon-wrapper">
                <svg width="22" height="28" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 26V6" strokeLinecap="round" />
                  <path d="M6 12L12 6L18 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="hint-text goldish-font">SWIPE UP TO EXPLORE</span>
            </div>
          </div>
        )}

        {/* PAGE 1: DIVINE BLESSING */}
        {index === 1 && (
          <>
            <div className="editorial-top">
              <span className="eyebrow-text reveal-eyebrow">OM MURUGAN THUNAI</span>
              <h1 className="tamil-divine reveal-title goldish-font">ஓம் முருகன் துணை</h1>
              <div className="gold-divider-line reveal-divider"></div>
            </div>
            <div className="editorial-bottom">
              <p className="subtitle-editorial reveal-text goldish-font">A BEAUTIFUL BEGINNING</p>
            </div>
          </>
        )}

        {/* PAGE 2: INVITATION REVEAL */}
        {index === 2 && (
          <>
            <span className="eyebrow-text reveal-eyebrow">WITH THE BLESSINGS OF THE ALMIGHTY</span>
            <div className="title-editorial-wrapper reveal-title">
              <h2 className="serif-title-light">WEDDING</h2>
              <h2 className="serif-title-bold goldish-font">INVITATION</h2>
            </div>
            <div className="gold-divider-line reveal-divider"></div>
            <div className="couple-editorial-composition reveal-text">
              <div className="name-block">
                <span className="name-main goldish-font">E. DEEPAK KUMAR</span>
                <span className="degree-tag">B.E.</span>
              </div>
              <div className="script-with">with</div>
              <div className="name-block">
                <span className="name-main goldish-font">P. KARTHIGA</span>
                <span className="degree-tag">MCA.</span>
              </div>
            </div>
          </>
        )}

        {/* PAGE 3: EMOTIONAL POETRY */}
        {index === 3 && (
          <div className="floating-poetry-stack">
            <span className="poetry-phrase phrase-1 reveal-eyebrow goldish-font">TWO HEARTS</span>
            <span className="tiny-gold-heart reveal-divider">♡</span>
            <h2 className="poetry-phrase phrase-2 reveal-title goldish-font">ONE BEAUTIFUL JOURNEY</h2>
            <span className="poetry-phrase phrase-3 reveal-text goldish-font">A LIFETIME TOGETHER</span>
          </div>
        )}

        {/* PAGE 4: WEDDING DATE */}
        {index === 4 && (
          <div className="date-editorial-container">
            <span className="eyebrow-text reveal-eyebrow">THE WEDDING</span>
            <div className="big-anchor-num reveal-title goldish-font">11</div>
            <div className="month-year-group reveal-text">
              <span className="month-title goldish-font">NOVEMBER</span>
              <span className="year-title goldish-font">2026</span>
            </div>
            <span className="day-subtitle reveal-text">WEDNESDAY</span>
            <div className="gold-divider-line reveal-divider"></div>
            <span className="time-slot-editorial reveal-action goldish-font">09:00 AM — 10:30 AM</span>
          </div>
        )}

        {/* PAGE 5: VENUE (THIRUMANAM NADAKKUM IDAM) */}
        {index === 5 && (
          <div className="venue-editorial-box">
            <h1 className="tamil-heading reveal-eyebrow goldish-font">திருமணம் நடக்கும் இடம்</h1>
            <span className="sub-english-eyebrow reveal-eyebrow goldish-font">WEDDING VENUE</span>
            <h2 className="venue-editorial-title reveal-title goldish-font">
              ARULMIGU<br />
              SUBRAMANIYA SWAMY<br />
              THIRUKOIL
            </h2>
            <p className="venue-editorial-location reveal-text">THIRUPARANKUNDRAM · MADURAI</p>
            <div className="gold-divider-line reveal-divider"></div>
            <div className="action-buttons-minimal reveal-action">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Arulmigu+Subramaniya+Swamy+Thirukoil+Thiruparankundram+Madurai"
                target="_blank"
                rel="noopener noreferrer"
                className="minimal-gold-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                VIEW LOCATION
              </a>
              <button
                className="minimal-gold-btn btn-sec"
                onClick={() =>
                  onOpenCalendar({
                    title: 'Wedding: Deepak & Karthiga',
                    desc: 'Wedding Ceremony of E. Deepak Kumar & P. Karthiga',
                    location: 'Arulmigu Subramaniya Swamy Thirukoil, Thiruparankundram, Madurai',
                    start: '2026-11-11T09:00:00',
                    end: '2026-11-11T10:30:00'
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                ADD TO CALENDAR
              </button>
            </div>
          </div>
        )}

        {/* PAGE 6: MANAMAKKAL AZHAIPPU */}
        {index === 6 && (
          <div className="azhaippu-editorial-box">
            <h1 className="tamil-heading reveal-eyebrow goldish-font">மணமக்கள் அழைப்பு</h1>
            <span className="sub-english-eyebrow reveal-title goldish-font">MANAMAKKAL AZHAIPPU</span>
            <div className="azhaippu-date-row reveal-text">
              <span className="date-num goldish-font">10</span>
              <div className="date-details">
                <span className="m-title goldish-font">NOVEMBER 2026</span>
                <span className="d-title">TUESDAY · 6:00 PM ONWARDS</span>
              </div>
            </div>
            <div className="gold-divider-line reveal-divider"></div>
            <div className="hall-info reveal-text">
              <h3 className="hall-name goldish-font">JAYASUDHA MAHAL</h3>
              <p className="hall-address">
                Sikkanthar Savadi<br />
                Koodal Nagar · Madurai – 625018
              </p>
            </div>
            <div className="action-buttons-minimal reveal-action">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jayasudha+Mahal+Sikkanthar+Savadi+Koodal+Nagar+Madurai+625018"
                target="_blank"
                rel="noopener noreferrer"
                className="minimal-gold-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                VIEW LOCATION
              </a>
              <button
                className="minimal-gold-btn btn-sec"
                onClick={() =>
                  onOpenCalendar({
                    title: 'Manamakkal Azhaippu: Deepak & Karthiga',
                    desc: 'Manamakkal Azhaippu function for E. Deepak Kumar & P. Karthiga',
                    location: 'Jayasudha Mahal, Sikkanthar Savadi, Koodal Nagar, Madurai – 625018',
                    start: '2026-11-10T18:00:00',
                    end: '2026-11-10T21:00:00'
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                ADD TO CALENDAR
              </button>
            </div>
          </div>
        )}

        {/* PAGE 7: RECEPTION */}
        {index === 7 && (
          <div className="reception-editorial-box">
            <span className="eyebrow-text reveal-eyebrow">THE CELEBRATION CONTINUES</span>
            <h2 className="serif-title-bold reveal-title goldish-font">RECEPTION</h2>
            <div className="azhaippu-date-row reveal-text">
              <span className="date-num goldish-font">15</span>
              <div className="date-details">
                <span className="m-title goldish-font">NOVEMBER 2026</span>
                <span className="d-title">SUNDAY · 6:00 PM ONWARDS</span>
              </div>
            </div>
            <div className="hall-info reveal-text">
              <h3 className="hall-name goldish-font">FIRM'S BANQUET HALL</h3>
              <p className="hall-sub-tag">— FB HALL —</p>
              <p className="hall-address">
                3rd Avenue · Anna Nagar<br />
                Chennai – 600040
              </p>
            </div>

            <div className="countdown-editorial-pill reveal-divider">
              <span className="cd-tag">COUNTDOWN TO MUHURTHAM</span>
              <div className="cd-timer-row">
                <div className="cd-unit">
                  <span className="goldish-font">{countdownData.days}</span>
                  <label>DAYS</label>
                </div>
                <div className="cd-sep">:</div>
                <div className="cd-unit">
                  <span className="goldish-font">{countdownData.hours}</span>
                  <label>HRS</label>
                </div>
                <div className="cd-sep">:</div>
                <div className="cd-unit">
                  <span className="goldish-font">{countdownData.minutes}</span>
                  <label>MIN</label>
                </div>
                <div className="cd-sep">:</div>
                <div className="cd-unit">
                  <span className="goldish-font">{countdownData.seconds}</span>
                  <label>SEC</label>
                </div>
              </div>
            </div>

            <div className="action-buttons-minimal reveal-action">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Firm's+Banquet+Hall+FB+Hall+3rd+Avenue+Anna+Nagar+Chennai+600040"
                target="_blank"
                rel="noopener noreferrer"
                className="minimal-gold-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                VIEW LOCATION
              </a>
              <button
                className="minimal-gold-btn btn-sec"
                onClick={() =>
                  onOpenCalendar({
                    title: 'Wedding Reception: Deepak & Karthiga',
                    desc: 'Wedding Reception of E. Deepak Kumar & P. Karthiga',
                    location: "Firm's Banquet Hall - FB Hall, 3rd Avenue, Anna Nagar, Chennai – 600040",
                    start: '2026-11-15T18:00:00',
                    end: '2026-11-15T22:00:00'
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                ADD TO CALENDAR
              </button>
            </div>
          </div>
        )}

        {/* PAGE 8: FINAL COUPLE */}
        {index === 8 && (
          <div className="final-cinematic-box">
            <span className="eyebrow-text reveal-eyebrow">A BEAUTIFUL BEGINNING</span>
            <h2 className="presence-headline reveal-title">
              YOUR PRESENCE<br />
              <span className="gold-accent goldish-font">IS OUR GREATEST GIFT</span>
            </h2>
            <div className="final-couple-names reveal-text">
              <span className="c-name goldish-font">E. DEEPAK KUMAR</span>
              <span className="c-heart">♡</span>
              <span className="c-name goldish-font">P. KARTHIGA</span>
            </div>
            <div className="final-date-badge reveal-divider goldish-font">11 · 11 · 2026</div>
            <p className="final-sub-note reveal-text">WE CAN'T WAIT TO CELEBRATE WITH YOU</p>
            <div className="action-buttons-minimal final-actions reveal-action">
              <button className="minimal-gold-btn" onClick={onShare}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                SHARE INVITATION
              </button>
              <button
                className="minimal-gold-btn btn-sec"
                onClick={() =>
                  onOpenCalendar({
                    title: 'Wedding of Deepak & Karthiga',
                    desc: 'Wedding Muhurtham of E. Deepak Kumar & P. Karthiga',
                    location: 'Arulmigu Subramaniya Swamy Thirukoil, Thiruparankundram, Madurai',
                    start: '2026-11-11T09:00:00',
                    end: '2026-11-11T10:30:00'
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                SAVE ALL DATES
              </button>
            </div>
            <button className="replay-link reveal-action" onClick={onReplay}>
              ↻ Replay Invitation
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
