/* ==========================================================================
   LUXURY CINEMATIC WEDDING E-INVITATION — PHYSICAL PAGE SWIPE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Core Element References ---
  const viewport = document.getElementById('viewport');
  const albumStack = document.getElementById('albumStack');
  const pages = Array.from(document.querySelectorAll('.album-page'));
  const indDots = Array.from(document.querySelectorAll('.ind-dot'));
  const pageCounter = document.getElementById('pageCounter');
  const swipeHint = document.getElementById('swipeHint');
  const ambientBg = document.getElementById('ambientBg');
  const musicBtn = document.getElementById('musicBtn');
  const musicStatusText = document.getElementById('musicStatusText');
  
  // Modal & Interactive Elements
  const calendarModal = document.getElementById('calendarModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalEventTitle = document.getElementById('modalEventTitle');
  const gcalLink = document.getElementById('gcalLink');
  const icsBtn = document.getElementById('icsBtn');
  const toast = document.getElementById('toast');
  const shareBtn = document.getElementById('shareBtn');
  const finalCalendarBtn = document.getElementById('finalCalendarBtn');
  const replayBtn = document.getElementById('replayBtn');

  let currentIndex = 0;
  let isAnimating = false;
  let hasSwiped = false;
  let activeEventData = null;

  // Ambient Desktop Background Gradients
  const ambientGradients = [
    'radial-gradient(circle at center, #350A11 0%, #150205 60%, #060102 100%)', // Page 1
    'radial-gradient(circle at center, #450810 0%, #1A0205 60%, #060102 100%)', // Page 2
    'radial-gradient(circle at center, #3C0A14 0%, #160205 60%, #060102 100%)', // Page 3
    'radial-gradient(circle at center, #421B07 0%, #1A0802 60%, #060102 100%)', // Page 4
    'radial-gradient(circle at center, #3F0913 0%, #160205 60%, #060102 100%)', // Page 5
    'radial-gradient(circle at center, #30091C 0%, #12020B 60%, #060102 100%)', // Page 6
    'radial-gradient(circle at center, #381907 0%, #160802 60%, #060102 100%)', // Page 7
    'radial-gradient(circle at center, #28060F 0%, #100205 60%, #060102 100%)'  // Page 8
  ];

  // ==========================================================================
  // 1. PAGE TRANSITION & VIDEO PLAYBACK ENGINE
  // ==========================================================================

  function goToPage(targetIndex, customDuration = 950) {
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    if (isAnimating && targetIndex !== currentIndex) return;

    isAnimating = true;
    currentIndex = targetIndex;

    // Hide swipe hint after first interaction
    if (currentIndex > 0 && !hasSwiped) {
      hasSwiped = true;
      if (swipeHint) swipeHint.style.opacity = '0';
    }

    pages.forEach((page, idx) => {
      // Remove any temporary drag classes
      page.classList.remove('is-dragging');
      page.style.transform = '';
      page.style.opacity = '';
      page.style.filter = '';
      page.style.scale = '';

      const video = page.querySelector('.scene-video');

      if (idx === currentIndex) {
        page.className = 'album-page active';
        if (video) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => console.log('Autoplay handled:', err));
          }
        }
      } else if (idx < currentIndex) {
        page.className = 'album-page prev';
        if (video) video.pause();
      } else {
        page.className = 'album-page next';
        if (video) video.pause();
      }
    });

    // Update Navigation UI
    updateIndicatorUI(currentIndex);

    // Update Ambient Desktop Backdrop
    if (ambientBg) {
      ambientBg.style.background = ambientGradients[currentIndex] || ambientGradients[0];
    }

    setTimeout(() => {
      isAnimating = false;
    }, customDuration);
  }

  function updateIndicatorUI(index) {
    indDots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    pageCounter.textContent = `0${index + 1} / 08`;
  }

  // Indicator Dot Clicks
  indDots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPage(idx);
    });
  });

  // ==========================================================================
  // 2. REAL-TIME PHYSICAL TOUCH DRAG & SWIPE CONTROLLER
  // ==========================================================================

  let startY = 0;
  let currentY = 0;
  let dragDeltaY = 0;
  let isDragging = false;
  let startTime = 0;

  viewport.addEventListener('pointerdown', (e) => {
    // Ignore drag on interactive buttons or modal
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.modal-content') || e.target.closest('.side-indicator')) return;
    if (isAnimating) return;

    isDragging = true;
    startY = e.clientY;
    currentY = e.clientY;
    dragDeltaY = 0;
    startTime = Date.now();

    const activePage = pages[currentIndex];
    const prevPage = pages[currentIndex - 1];
    const nextPage = pages[currentIndex + 1];

    if (activePage) activePage.classList.add('is-dragging');
    if (prevPage) prevPage.classList.add('is-dragging');
    if (nextPage) nextPage.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    currentY = e.clientY;
    dragDeltaY = currentY - startY;

    const vh = viewport.clientHeight;
    const activePage = pages[currentIndex];

    if (dragDeltaY < 0 && currentIndex < pages.length - 1) {
      // Dragging UP -> Candidate Next Page enters from bottom
      const nextPage = pages[currentIndex + 1];
      const progress = Math.min(Math.abs(dragDeltaY) / vh, 1);

      // Active Page moves up & scales down
      activePage.style.transform = `translate3d(0, ${dragDeltaY * 0.3}px, 0) scale(${1 - progress * 0.04})`;
      activePage.style.opacity = `${1 - progress * 0.65}`;

      // Next Page comes from bottom
      nextPage.style.transform = `translate3d(0, ${vh + dragDeltaY}px, 0) scale(${1.04 - progress * 0.04})`;
      nextPage.style.opacity = `${0.35 + progress * 0.65}`;

    } else if (dragDeltaY > 0 && currentIndex > 0) {
      // Dragging DOWN -> Candidate Prev Page enters from top
      const prevPage = pages[currentIndex - 1];
      const progress = Math.min(dragDeltaY / vh, 1);

      // Active Page moves down & fades
      activePage.style.transform = `translate3d(0, ${dragDeltaY * 0.3}px, 0) scale(${1 - progress * 0.04})`;
      activePage.style.opacity = `${1 - progress * 0.65}`;

      // Prev Page comes from top
      prevPage.style.transform = `translate3d(0, ${-vh * 0.08 + dragDeltaY}px, 0) scale(${0.96 + progress * 0.04})`;
      prevPage.style.opacity = `${0.35 + progress * 0.65}`;
    }
  });

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const duration = Date.now() - startTime;
    const vh = viewport.clientHeight;
    const threshold = vh * 0.12; // 12% height threshold for swipe

    // Fast flick or deep drag triggers scene transition
    if (Math.abs(dragDeltaY) > threshold || (Math.abs(dragDeltaY) > 30 && duration < 300)) {
      if (dragDeltaY < 0 && currentIndex < pages.length - 1) {
        goToPage(currentIndex + 1);
      } else if (dragDeltaY > 0 && currentIndex > 0) {
        goToPage(currentIndex - 1);
      } else {
        goToPage(currentIndex);
      }
    } else {
      // Snap back to current page
      goToPage(currentIndex);
    }
  }

  viewport.addEventListener('pointerup', handleDragEnd);
  viewport.addEventListener('pointercancel', handleDragEnd);

  // ==========================================================================
  // 3. DESKTOP MOUSE WHEEL & KEYBOARD NAVIGATION
  // ==========================================================================

  let wheelTimer = null;
  viewport.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    if (Math.abs(e.deltaY) > 20) {
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        if (e.deltaY > 0) {
          goToPage(currentIndex + 1);
        } else {
          goToPage(currentIndex - 1);
        }
      }, 40);
    }
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToPage(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToPage(currentIndex - 1);
    }
  });

  // Initial Page Trigger
  goToPage(0);

  // ==========================================================================
  // 4. AUDIO SYSTEM (Synthesized Devotional Carnatic Drone / Music Toggle)
  // ==========================================================================

  let audioCtx = null;
  let isMusicPlaying = false;
  let gainNode = null;
  let oscNodes = [];

  function initDevotionalAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.connect(audioCtx.destination);

      const freqs = [138.59, 207.65, 277.18, 554.37];
      
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.12 / (idx + 1), audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(gainNode);

        osc.start();
        oscNodes.push(osc);
      });

    } catch (e) {
      console.warn('Web Audio API initialized:', e);
    }
  }

  function toggleMusic() {
    if (!audioCtx) {
      initDevotionalAudio();
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
      musicBtn.classList.add('playing');
      musicStatusText.textContent = 'MUSIC ON';
      if (gainNode && audioCtx) {
        gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 1.5);
      }
    } else {
      musicBtn.classList.remove('playing');
      musicStatusText.textContent = 'MUSIC OFF';
      if (gainNode && audioCtx) {
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
      }
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  // ==========================================================================
  // 5. DYNAMIC COUNTDOWN TIMER (Page 07)
  // Target: 11 November 2026, 09:00:00 AM IST
  // ==========================================================================

  const targetDate = new Date('2026-11-11T09:00:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================================================
  // 6. FLOATING GOLD DUST & ROSE PETALS CANVAS
  // ==========================================================================

  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = 26;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.type = Math.random() > 0.75 ? 'petal' : 'gold';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.02) * 0.3;
      this.rotation += this.rotSpeed;

      if (this.y > canvas.height + 10) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'gold') {
        ctx.fillStyle = '#D4AF37';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#FFF2C6';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#A31C2D';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 2, this.size * 3.2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ==========================================================================
  // 7. CALENDAR INTEGRATION & MODAL
  // ==========================================================================

  const calendarTriggers = document.querySelectorAll('.calendar-trigger');

  calendarTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeEventData = {
        title: btn.dataset.title,
        desc: btn.dataset.desc,
        location: btn.dataset.location,
        start: btn.dataset.start,
        end: btn.dataset.end
      };

      openCalendarModal(activeEventData);
    });
  });

  if (finalCalendarBtn) {
    finalCalendarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeEventData = {
        title: "Wedding of Deepak & Karthiga",
        desc: "Wedding Muhurtham of E. Deepak Kumar & P. Karthiga",
        location: "Arulmigu Subramaniya Swamy Thirukoil, Thiruparankundram, Madurai",
        start: "2026-11-11T09:00:00",
        end: "2026-11-11T10:30:00"
      };
      openCalendarModal(activeEventData);
    });
  }

  function openCalendarModal(data) {
    modalEventTitle.textContent = data.title;
    
    const gStart = data.start.replace(/[-:]/g, '') + 'Z';
    const gEnd = data.end.replace(/[-:]/g, '') + 'Z';
    const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data.title)}&details=${encodeURIComponent(data.desc)}&location=${encodeURIComponent(data.location)}&dates=${gStart}/${gEnd}`;
    gcalLink.href = gUrl;

    calendarModal.classList.add('active');
  }

  closeModalBtn.addEventListener('click', () => {
    calendarModal.classList.remove('active');
  });

  calendarModal.addEventListener('click', (e) => {
    if (e.target === calendarModal) {
      calendarModal.classList.remove('active');
    }
  });

  icsBtn.addEventListener('click', () => {
    if (!activeEventData) return;
    
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Deepak & Karthiga Wedding//EN
BEGIN:VEVENT
SUMMARY:${activeEventData.title}
DESCRIPTION:${activeEventData.desc}
LOCATION:${activeEventData.location}
DTSTART:${activeEventData.start.replace(/[-:]/g, '')}T000000Z
DTEND:${activeEventData.end.replace(/[-:]/g, '')}T000000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${activeEventData.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Calendar (.ics) Downloaded!');
    calendarModal.classList.remove('active');
  });

  // ==========================================================================
  // 8. SHARE & REPLAY
  // ==========================================================================

  if (shareBtn) {
    shareBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
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
          showToast('Invitation Link Copied!');
        } catch (err) {
          showToast('Invitation Link: ' + window.location.href);
        }
      }
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPage(0);
    });
  }

});
