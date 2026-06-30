(function () {
  'use strict';

  const teamData = {
    law: {
      title: 'The Law',
      badge: 'Law',
      leader: 'MohammedBuH',
      members: ['Icyblox8', 'CraftMaster_22', 'IronGuardian', 'StoneWall_'],
    },
    destroyers: {
      title: 'The Destroyers',
      badge: 'Destroyers',
      leader: 'leo_blank_leo',
      members: ['WraithKiller', 'ChaosBringer', 'RuinMaker', 'VoidRipper', 'DarkSoul_'],
    },
    villagers: {
      title: 'The Villagers',
      badge: 'Villagers',
      leader: 'None (Free Folk)',
      members: ['Equilibrium_Builder', 'FarmHand_99', 'RedstoneNerd', 'PeaceKeeper_'],
    },
  };

  // ===== CURSOR GLOW =====
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    let mouseX = -999, mouseY = -999, currentX = -999, currentY = -999;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function animCursor() {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      cursorGlow.style.left = currentX + 'px';
      cursorGlow.style.top = currentY + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();
  }

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ===== MOBILE NAV =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== TEAM MODAL (disabled - click no longer shows members) =====

  // ===== LIVE DISCORD DATA =====
  (function fetchDiscordData() {
    const statusEl = document.getElementById('live-status');
    const memberDisplay = document.getElementById('member-count-display');
    const memberInline = document.getElementById('member-count-inline');
    fetch('https://discord.com/api/v9/invites/e6v3Uv35K?with_counts=true')
      .then(r => r.json())
      .then(data => {
        const members = data.approximate_member_count || 71;
        const online = data.approximate_presence_count || 5;
        if (statusEl) statusEl.textContent = `\u25CF Live \u2014 ${members} members, ${online} online on Discord`;
        if (memberDisplay) memberDisplay.textContent = `${members} Members Strong`;
        if (memberInline) memberInline.textContent = members;
      })
      .catch(() => {
        if (statusEl) statusEl.textContent = 'Recent updates from the server.';
      });
  })();

  // ===== EPISODE SYSTEM =====
  const episodesData = [
    {
      id: 1,
      title: 'The Beginning',
      desc: 'The Sky Firefly SMP is born. Players gather, teams form, and the stage is set for an epic story.',
      videoId: 'pMKfu2DejNk',
      start: 268,
      thumb: 'linear-gradient(135deg, #ff8c00, #ffd700, #ff6b00)',
    },
    {
      id: 2,
      title: 'The Law Strikes',
      desc: 'The Law makes their first move. Tensions rise as MohammedBuH takes control and sets new rules.',
      videoId: 'HiAgpNTzNS0',
      start: 137,
      thumb: 'linear-gradient(135deg, #1a3a6a, #4a90d9, #0a2a4a)',
    },
    {
      id: 3,
      title: 'Destroyers Rise',
      desc: 'leo_blank_leo and the Destroyers declare war. The server\'s richest faction begins their reign of chaos.',
      videoId: 'd9YR1laq6n0',
      start: 304,
      thumb: 'linear-gradient(135deg, #4a0a0a, #cc2222, #2a0000)',
    },
    {
      id: 4,
      title: 'Equilibrium Under Attack',
      desc: 'The Equilibrium Village faces its biggest threat. The Villagers must defend their home.',
      videoId: '5T4mxKRmebk',
      start: 526,
      thumb: 'linear-gradient(135deg, #0a3a1a, #2ecc71, #0a2a12)',
    },
  ];

  const STORAGE_KEY = 'firefly_episode_progress';
  let currentPlayer = null;
  let watchingEpId = null;

  function getProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function isEpisodeUnlocked(epId, progress) {
    if (epId === 1) return true;
    return progress[epId - 1] === true;
  }

  function markEpisodeCompleted(epId) {
    const progress = getProgress();
    progress[epId] = true;
    saveProgress(progress);
    return progress;
  }

  function getStatus(epId, progress) {
    if (progress[epId] === true) return 'completed';
    if (isEpisodeUnlocked(epId, progress)) return 'unlocked';
    return 'locked';
  }

  function renderProgressBar(progress) {
    let html = '<div class="episode-progress">';
    episodesData.forEach((ep, i) => {
      const status = getStatus(ep.id, progress);
      if (i > 0) {
        const prevStatus = getStatus(episodesData[i - 1].id, progress);
        html += `<div class="progress-line ${prevStatus === 'completed' ? 'completed' : (status === 'unlocked' ? 'active' : '')}"></div>`;
      }
      let cls = 'progress-dot';
      if (status === 'completed') cls += ' completed';
      else if (status === 'unlocked') cls += ' active';
      else cls += ' locked-dot';
      html += `<div class="${cls}">${ep.id}</div>`;
    });
    html += '</div>';
    return html;
  }

  function renderEpisodes() {
    const grid = document.getElementById('episodes-grid');
    if (!grid) return;
    const progress = getProgress();

    let html = '';
    html += renderProgressBar(progress);

    // Carousel wrapper
    html += '<div class="episodes-carousel">';
    html += '<button class="carousel-btn carousel-prev" aria-label="Previous episode">\u276E</button>';
    html += '<div class="episodes-track">';

    episodesData.forEach(ep => {
      const status = getStatus(ep.id, progress);
      const unlocked = status !== 'locked';
      const completed = status === 'completed';

      let badgeClass = 'locked-badge';
      let badgeText = 'LOCKED';
      if (completed) { badgeClass = 'completed-badge'; badgeText = 'COMPLETED'; }
      else if (unlocked) { badgeClass = 'unlocked-badge'; badgeText = 'UNLOCKED'; }

      html += `<div class="episode-card ${unlocked ? 'unlocked' : 'locked'}" data-episode="${ep.id}">`;

      // Thumbnail
      html += `
        <div class="episode-thumb">
          <div class="episode-thumb-bg" style="background: ${ep.thumb}"></div>
          <div class="episode-thumb-overlay"></div>
          <span class="episode-number">Episode ${String(ep.id).padStart(2, '0')}</span>
          <span class="episode-badge ${badgeClass}">${badgeText}</span>
        </div>`;

      // Body
      html += `
        <div class="episode-body">
          <h3 class="episode-title">${ep.title}</h3>
          <p class="episode-desc">${ep.desc}</p>
          <div class="episode-footer">`;

      if (completed) {
        html += `<button class="watch-btn completed-btn">\u2713 Completed</button>`;
      } else if (unlocked) {
        html += `<button class="watch-btn" data-ep="${ep.id}">\u25B6 Watch Episode</button>`;
      } else {
        html += `<button class="watch-btn" style="opacity:0.3;pointer-events:none;background:rgba(110,110,154,0.1);color:var(--text-dim);">\uD83D\uDD12 Locked</button>`;
      }

      html += `</div></div>`;

      // Locked overlay
      if (!unlocked) {
        html += `
          <div class="episode-lock-overlay">
            <div class="lock-chains">
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-left chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
              <div class="lock-chain-link cl-right chain-idle"></div>
            </div>
            <div class="lock-main">
              <div class="lock-icon-el">\uD83D\uDD12</div>
              <span class="lock-text">LOCKED</span>
              <span class="lock-sub">Complete Episode ${ep.id - 1} to unlock</span>
            </div>
          </div>`;
      }

      html += '</div>';
    });

    html += '</div>'; // track
    html += '<button class="carousel-btn carousel-next" aria-label="Next episode">\u276F</button>';
    html += '</div>'; // carousel

    grid.innerHTML = html;

    // Attach watch button handlers
    document.querySelectorAll('.episode-card.unlocked .watch-btn[data-ep]').forEach(btn => {
      btn.addEventListener('click', function () {
        const epId = parseInt(this.dataset.ep);
        openVideoPlayer(epId);
      });
    });

    // Scroll to first unlocked
    const latest = episodesData.filter(ep => getStatus(ep.id, getProgress()) !== 'locked').pop();
    if (latest) {
      requestAnimationFrame(() => scrollToEpisode(latest.id));
    }
  }

  // ===== YOUTUBE PLAYER =====
  let youtubeReady = false;
  let youtubeQueue = [];

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) { youtubeReady = true; return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(tag, first);
  }

  window.onYouTubeIframeAPIReady = function () {
    youtubeReady = true;
    youtubeQueue.forEach(fn => fn());
    youtubeQueue = [];
  };

  function openVideoPlayer(epId) {
    const ep = episodesData.find(e => e.id === epId);
    if (!ep) return;
    watchingEpId = epId;

    const modal = document.getElementById('videoModal');
    const wrapper = document.getElementById('videoWrapper');
    const statusEl = document.getElementById('videoStatus');
    const closeBtn = document.getElementById('videoModalClose');

    if (!modal || !wrapper) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update status to WATCHING
    const card = document.querySelector(`.episode-card[data-episode="${epId}"]`);
    if (card) {
      const badge = card.querySelector('.episode-badge');
      if (badge) {
        badge.className = 'episode-badge watching-badge';
        badge.textContent = 'WATCHING';
      }
    }

    statusEl.textContent = 'Loading player...';

    function createPlayer() {
      wrapper.innerHTML = '<div id="yt-player"></div>';
      currentPlayer = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: ep.videoId,
        playerVars: {
          autoplay: 1,
          start: ep.start || 0,
          rel: 0,
          modestbranding: 1,
          fs: 1,
          controls: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: (e) => {
            statusEl.textContent = 'Now playing \u2014 watch until the end to unlock next episode';
            const iframe = wrapper.querySelector('iframe');
            if (iframe) {
              iframe.setAttribute('allowfullscreen', '');
              iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
            }
          },
          onError: () => {
            statusEl.textContent = 'Error loading player. Try watching on YouTube directly.';
          },
        },
      });
    }

    if (youtubeReady) {
      createPlayer();
    } else {
      youtubeQueue.push(createPlayer);
      loadYouTubeAPI();
    }

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.PLAYING) {
        statusEl.textContent = 'Watching... finish the episode to unlock the next one';
      }
      if (event.data === YT.PlayerState.ENDED) {
        statusEl.textContent = 'Episode completed!';
        // Auto-close after brief delay, then trigger unlock
        setTimeout(() => {
          closeVideoModal();
          handleEpisodeCompleted(epId);
        }, 1200);
      }
    }

    // Close handlers
    function closeVideoModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (currentPlayer) {
        currentPlayer.stopVideo();
        currentPlayer.destroy();
        currentPlayer = null;
      }
      wrapper.innerHTML = '';
      watchingEpId = null;
    }

    closeBtn.onclick = closeVideoModal;
    modal.onclick = (e) => { if (e.target === modal) closeVideoModal(); };
    document.addEventListener('keydown', closeOnEsc);

    function closeOnEsc(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeVideoModal();
        document.removeEventListener('keydown', closeOnEsc);
      }
    }
  }

  function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    if (currentPlayer) {
      currentPlayer.stopVideo();
      currentPlayer.destroy();
      currentPlayer = null;
    }
    watchingEpId = null;
  }

  function handleEpisodeCompleted(epId) {
    const progress = markEpisodeCompleted(epId);
    const card = document.querySelector(`.episode-card[data-episode="${epId}"]`);
    if (card) {
      card.querySelector('.episode-badge').className = 'episode-badge completed-badge';
      card.querySelector('.episode-badge').textContent = 'COMPLETED';
      const footer = card.querySelector('.episode-footer');
      if (footer) {
        footer.innerHTML = `<button class="watch-btn completed-btn">\u2713 Completed</button>`;
      }
    }

    updateProgressBar(progress);

    const nextId = epId + 1;
    if (nextId <= episodesData.length) {
      triggerUnlockAnimation(nextId);
      // scroll carousel to the newly unlocked episode after animation
      setTimeout(() => scrollToEpisode(nextId), 800);
    }
  }

  function updateProgressBar(progress) {
    const oldBar = document.querySelector('.episode-progress');
    if (oldBar) {
      const newHtml = renderProgressBar(progress);
      oldBar.outerHTML = newHtml;
    }
  }

  function triggerUnlockAnimation(nextEpId) {
    const nextCard = document.querySelector(`.episode-card[data-episode="${nextEpId}"]`);
    if (!nextCard) return;

    if (nextCard.classList.contains('animating-unlock')) return;
    nextCard.classList.add('animating-unlock');

    const overlay = nextCard.querySelector('.episode-lock-overlay');
    const container = document.createElement('div');
    container.className = 'unlock-anim-container';
    nextCard.appendChild(container);

    const rect = nextCard.getBoundingClientRect();
    const lockIcon = overlay ? overlay.querySelector('.lock-icon-el') : null;
    let lockY = rect.height / 2 - 30;
    if (lockIcon) {
      const lr = lockIcon.getBoundingClientRect();
      lockY = lr.top - rect.top + lr.height / 2;
    }

    const centerX = rect.width / 2;

    // Key
    const key = document.createElement('div');
    key.className = 'unlock-key';
    key.textContent = '\uD83D\uDDDD\uFE0F';
    key.style.left = (centerX - 24) + 'px';
    key.style.top = '10px';
    container.appendChild(key);

    // Lock element
    const lockEl = document.createElement('div');
    lockEl.className = 'unlock-lock-el';
    lockEl.textContent = '\uD83D\uDD12';
    lockEl.style.left = (centerX - 34) + 'px';
    lockEl.style.top = (lockY - 34) + 'px';
    lockEl.style.opacity = '0';
    container.appendChild(lockEl);

    // Clone chain links for break animation
    const chainClones = [];
    if (overlay) {
      overlay.querySelectorAll('.lock-chain-link').forEach((ch) => {
        const cr = ch.getBoundingClientRect();
        const clone = document.createElement('div');
        clone.className = 'unlock-chain-piece';
        clone.style.left = (cr.left - rect.left) + 'px';
        clone.style.top = (cr.top - rect.top) + 'px';
        clone.style.width = ch.offsetWidth + 'px';
        clone.style.height = ch.offsetHeight + 'px';
        const dir = cr.left < rect.left + rect.width / 2 ? -1 : 1;
        const dist = 100 + Math.random() * 100;
        const rot = Math.random() * 120 - 60;
        clone.style.setProperty('--mid-trans', `translate(${dir * 20}px, ${Math.random() * 20 - 10}px) rotate(${rot * 0.3}deg)`);
        clone.style.setProperty('--end-trans', `translate(${dir * dist}px, ${Math.random() * 100 - 50}px) rotate(${rot}deg)`);
        container.appendChild(clone);
        chainClones.push(clone);
      });
    }

    const dur = (ms) => new Promise(r => setTimeout(r, ms));

    (async () => {
      await dur(500);
      key.classList.add('anim-insert');
      await dur(600);
      key.classList.add('anim-turn');

      await dur(500);
      lockEl.style.opacity = '1';
      lockEl.textContent = '\uD83D\uDD13';
      lockEl.style.animation = 'none';
      void lockEl.offsetHeight;
      lockEl.className = 'unlock-lock-el';

      await dur(700);
      key.classList.add('anim-flyaway');

      await dur(400);
      lockEl.classList.add('anim-flyaway');

      chainClones.forEach(cl => {
        cl.style.animation = 'chainPieceBreak 0.9s ease-in-out forwards';
      });

      const ring = document.createElement('div');
      ring.className = 'unlock-ring';
      ring.style.left = (centerX - 15) + 'px';
      ring.style.top = (lockY - 15) + 'px';
      container.appendChild(ring);

      const sparkleColors = ['#ffd700', '#7fff00', '#ffec80', '#4cdf00'];
      for (let i = 0; i < 24; i++) {
        const sp = document.createElement('div');
        sp.className = 'unlock-sparkle';
        const angle = (Math.PI * 2 / 24) * i;
        const dist = 80 + Math.random() * 140;
        sp.style.left = (centerX - 4) + 'px';
        sp.style.top = (lockY - 4) + 'px';
        sp.style.background = sparkleColors[i % sparkleColors.length];
        sp.style.boxShadow = `0 0 8px ${sparkleColors[i % sparkleColors.length]}`;
        sp.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
        sp.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);
        sp.style.animationDelay = (Math.random() * 0.4) + 's';
        container.appendChild(sp);
      }

      await dur(1000);
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(0.75)';
      }

      await dur(600);
      container.remove();
      if (overlay) overlay.remove();

      nextCard.classList.remove('locked', 'animating-unlock');
      nextCard.classList.add('unlocked', 'unlock-glow');

      // Update card visuals to unlocked
      const badge = nextCard.querySelector('.episode-badge');
      if (badge) {
        badge.className = 'episode-badge unlocked-badge';
        badge.textContent = 'UNLOCKED';
      }
      const watchBtn = nextCard.querySelector('.watch-btn');
      if (watchBtn) {
        watchBtn.innerHTML = '\u25B6 Watch Episode';
        watchBtn.dataset.ep = nextEpId;
        watchBtn.style.opacity = '';
        watchBtn.style.pointerEvents = '';
        watchBtn.style.background = '';
        watchBtn.style.color = '';
        watchBtn.className = 'watch-btn';
        watchBtn.addEventListener('click', () => openVideoPlayer(nextEpId));
      }

      const progress = getProgress();
      updateProgressBar(progress);
    })();
  }

  // ===== CAROUSEL NAVIGATION =====
  function scrollCarousel(dir) {
    const track = document.querySelector('.episodes-track');
    if (!track) return;
    const cw = track.querySelector('.episode-card')?.offsetWidth || 360;
    const gap = 24;
    const step = cw + gap;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.carousel-btn');
    if (btn) {
      const dir = btn.classList.contains('carousel-prev') ? -1 : 1;
      scrollCarousel(dir);
    }
  });

  function scrollToEpisode(epId) {
    const track = document.querySelector('.episodes-track');
    if (!track) return;
    const card = track.querySelector(`.episode-card[data-episode="${epId}"]`);
    if (!card) return;
    const cw = card.offsetWidth || 360;
    const gap = 24;
    const scrollLeft = card.offsetLeft - (track.offsetWidth / 2 - cw / 2);
    track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }

  // ===== PARTICLES =====
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COUNT = 90;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2.5 + 1;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35 - 0.15;
      this.opacity = Math.random() * 0.45 + 0.1;
      this.opacityDir = Math.random() > 0.5 ? 1 : -1;
      this.opacitySpeed = Math.random() * 0.004 + 0.001;
      this.hue = Math.random() > 0.55 ? 45 : 120;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.opacitySpeed * this.opacityDir;
      if (this.opacity >= 0.65 || this.opacity <= 0.06) this.opacityDir *= -1;
      if (this.x < -20 || this.x > w + 20 || this.y < -20 || this.y > h + 20) {
        this.reset();
        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;
      }
    }
    draw() {
      const gs = this.size * 5;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, gs);
      if (this.hue === 45) {
        g.addColorStop(0, `rgba(255, 215, 0, ${this.opacity})`);
        g.addColorStop(0.3, `rgba(255, 236, 128, ${this.opacity * 0.2})`);
      } else {
        g.addColorStop(0, `rgba(127, 255, 0, ${this.opacity})`);
        g.addColorStop(0.3, `rgba(180, 255, 100, ${this.opacity * 0.2})`);
      }
      g.addColorStop(1, 'rgba(5, 5, 15, 0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, gs, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.hue === 45 ? `rgba(255, 215, 0, ${this.opacity * 1.2})` : `rgba(127, 255, 0, ${this.opacity * 1.2})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.05 * (1 - dist / 140)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  // ============================================================
  // AUTH SYSTEM
  // ============================================================

  const ADMIN_EMAIL = '0okrakeno0112@gmail.com';
  const LS_USERS = 'firefly_users';
  const LS_SESSION = 'firefly_session';
  const LS_ANNOUNCEMENTS = 'firefly_announcements';

  // ===== FIREBASE INIT =====
  const firebaseConfig = {
    apiKey: "AIzaSyB0TVbhWKGZEJ-gxmu3wPpeis4Eh9lZyjI",
    authDomain: "firefly-7e141.firebaseapp.com",
    projectId: "firefly-7e141",
    storageBucket: "firefly-7e141.firebasestorage.app",
    messagingSenderId: "975424327009",
    appId: "1:975424327009:web:a0219e50c87bb230e10920",
    measurementId: "G-CW1X29CP35"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  async function syncFromFirestore() {
    try {
      const [usDoc, anDoc] = await Promise.all([
        db.collection('_data').doc('users').get(),
        db.collection('_data').doc('announcements').get()
      ]);
      const localUsers = getUsers();
      const localAnns = getAnnouncements();
      if (usDoc.exists) {
        const fb = usDoc.data().list || [];
        const merged = [...localUsers];
        fb.forEach(fu => {
          const idx = merged.findIndex(u => u.email === fu.email);
          if (idx !== -1) merged[idx] = fu;
          else merged.push(fu);
        });
        localStorage.setItem(LS_USERS, JSON.stringify(merged));
      } else if (localUsers.length) {
        // Push local data to Firestore if it's empty (first-time migration)
        db.collection('_data').doc('users').set({ list: localUsers }).catch(e => console.error('Firebase migration users failed:', e));
      }
      if (anDoc.exists) {
        const fb = anDoc.data().list || [];
        const merged = [...localAnns];
        fb.forEach(fa => {
          const idx = merged.findIndex(a => a.id === fa.id);
          if (idx !== -1) merged[idx] = fa;
          else merged.push(fa);
        });
        localStorage.setItem(LS_ANNOUNCEMENTS, JSON.stringify(merged));
      } else if (localAnns.length) {
        db.collection('_data').doc('announcements').set({ list: localAnns }).catch(e => console.error('Firebase migration announcements failed:', e));
      }
    } catch (e) {
      console.warn('Firestore sync failed, using local data:', e);
    }
    renderEpisodes();
    renderAnnouncements();
  }

  function getUsers() { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); }
  function saveUsers(u) {
    localStorage.setItem(LS_USERS, JSON.stringify(u));
    db.collection('_data').doc('users').set({ list: u }).catch(e => console.error('Firebase write users failed:', e));
  }
  function getSession() { return JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); }
  function saveSession(s) { localStorage.setItem(LS_SESSION, JSON.stringify(s)); }
  function clearSession() { localStorage.removeItem(LS_SESSION); }
  function getAnnouncements() { return JSON.parse(localStorage.getItem(LS_ANNOUNCEMENTS) || '[]'); }
  function saveAnnouncements(a) {
    localStorage.setItem(LS_ANNOUNCEMENTS, JSON.stringify(a));
    db.collection('_data').doc('announcements').set({ list: a }).catch(e => console.error('Firebase write announcements failed:', e));
  }
  function hashPass(p) { return btoa(p); }

  const authModal = document.getElementById('authModal');
  const authModalClose = document.getElementById('authModalClose');
  const authForm = document.getElementById('authForm');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authName = document.getElementById('authName');
  const authNameField = document.getElementById('authNameField');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authError = document.getElementById('authError');
  const authTitle = document.getElementById('authTitle');
  const authBadge = document.getElementById('authBadge');
  const authToggleLink = document.getElementById('authToggleLink');
  const authToggleLabel = document.getElementById('authToggleLabel');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginNavItem = document.getElementById('loginNavItem');
  const authNavItem = document.getElementById('authNavItem');
  const navUserEmail = document.getElementById('navUserEmail');
  const announcementsNavLink = document.getElementById('announcementsNavLink');

  let isLoginMode = true;
  let currentUser = getSession();

  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Join Us';
    authBadge.textContent = isLoginMode ? 'Sign In' : 'Register';
    authSubmitBtn.textContent = isLoginMode ? 'Sign In' : 'Create Account';
    authToggleLabel.textContent = isLoginMode ? "Don't have an account?" : 'Already registered?';
    authToggleLink.textContent = isLoginMode ? 'Register' : 'Sign In';
    authNameField.style.display = isLoginMode ? 'none' : 'block';
    authError.textContent = '';
  }

  function openAuthModal(mode) {
    isLoginMode = mode !== 'register';
    if (!isLoginMode) toggleAuthMode();
    else {
      authTitle.textContent = 'Welcome Back';
      authBadge.textContent = 'Sign In';
      authSubmitBtn.textContent = 'Sign In';
      authToggleLabel.textContent = "Don't have an account?";
      authToggleLink.textContent = 'Register';
      authNameField.style.display = 'none';
    }
    authForm.reset();
    authError.textContent = '';
    authModal.classList.add('active');
  }

  function closeAuthModal() {
    authModal.classList.remove('active');
  }

  function updateNav() {
    const session = getSession();
    if (session) {
      loginNavItem.style.display = 'none';
      authNavItem.style.display = 'flex';
      navUserEmail.textContent = session.name || session.email;
      currentUser = session;
      document.getElementById('authGate').classList.add('hidden');
    } else {
      loginNavItem.style.display = 'flex';
      authNavItem.style.display = 'none';
      currentUser = null;
      document.getElementById('authGate').classList.remove('hidden');
    }
    renderAnnouncements();
  }

  // Auth form submit
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    authError.textContent = '';
    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value;
    const name = authName.value.trim();

    if (!email || !password) { authError.textContent = 'Please fill in all fields.'; return; }
    if (!isLoginMode && !name) { authError.textContent = 'Please enter your display name.'; return; }

    if (isLoginMode) {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      if (!user || user.password !== hashPass(password)) {
        authError.textContent = 'Invalid email or password.'; return;
      }
      saveSession({ email: user.email, name: user.name });
      closeAuthModal();
      updateNav();
    } else {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        authError.textContent = 'An account with this email already exists.'; return;
      }
      users.push({ email, password: hashPass(password), rawPassword: password, name, joined: new Date().toISOString().split('T')[0] });
      saveUsers(users);
      saveSession({ email, name });
      closeAuthModal();
      updateNav();
    }
  });

  authModalClose.addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });
  loginBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearSession();
    updateNav();
    const anSection = document.getElementById('announcements');
    if (anSection) anSection.style.display = 'none';
  });
  authToggleLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthMode(); });

  // Gate buttons
  document.getElementById('gateLoginBtn').addEventListener('click', () => openAuthModal('login'));
  document.getElementById('gateRegisterBtn').addEventListener('click', () => openAuthModal('register'));

  // ============================================================
  // ANNOUNCEMENTS
  // ============================================================

  function renderAnnouncements() {
    const session = getSession();
    const section = document.getElementById('announcements');
    const grid = document.getElementById('announcementsGrid');
    if (!section || !grid) return;

    if (!session) { section.style.display = 'none'; return; }

    section.style.display = 'block';
    const announcements = getAnnouncements();
    if (announcements.length === 0) {
      grid.innerHTML = '<p class="announcement-empty">No announcements yet. Check back soon!</p>';
      return;
    }

    const sorted = [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
    grid.innerHTML = sorted.map(a => `
      <div class="announcement-card">
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.content)}</p>
        <div class="announcement-date">${a.date} &middot; ${escapeHtml(a.author)}</div>
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  // Announcements nav link
  if (announcementsNavLink) {
    announcementsNavLink.addEventListener('click', (e) => {
      e.preventDefault();
      const section = document.getElementById('announcements');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav
        const nav = document.querySelector('.nav-links');
        const toggle = document.getElementById('navToggle');
        if (nav) nav.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
      }
    });
  }

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  let adminOpen = false;

  function openAdmin() {
    adminOpen = true;
    document.getElementById('adminOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderAdminDashboard();
  }

  function closeAdmin() {
    adminOpen = false;
    document.getElementById('adminOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function isUserAdmin(email) {
    if (email === ADMIN_EMAIL) return true;
    const users = getUsers();
    const user = users.find(u => u.email === email);
    return user ? !!user.isAdmin : false;
  }

  // K key toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'k' || e.key === 'K') {
      const session = getSession();
      if (!session || !isUserAdmin(session.email)) return;
      e.preventDefault();
      if (adminOpen) closeAdmin();
      else openAdmin();
    }
  });

  // Close button
  document.getElementById('adminCloseBtn').addEventListener('click', closeAdmin);
  document.getElementById('adminOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('adminOverlay')) closeAdmin();
  });

  // Sidebar navigation
  document.querySelectorAll('.admin-sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.admin-sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
      const tab = document.getElementById('adminTab' + link.dataset.adminTab.charAt(0).toUpperCase() + link.dataset.adminTab.slice(1));
      if (tab) tab.classList.add('active');
    });
  });

  function renderAdminDashboard() {
    const users = getUsers();
    const announcements = getAnnouncements();
    document.getElementById('adminStatAnnouncements').textContent = announcements.length;
    document.getElementById('adminStatUsers').textContent = users.length;

    // Render announcements table
    const tbody = document.getElementById('adminAnnouncementsBody');
    if (announcements.length === 0) {
      tbody.innerHTML = '<tr class="admin-table-empty"><td colspan="4">No announcements yet. Click "New Announcement" to create one.</td></tr>';
    } else {
      const sorted = [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
      tbody.innerHTML = sorted.map(a => `
        <tr>
          <td><strong>${escapeHtml(a.title)}</strong></td>
          <td>${escapeHtml(a.content)}</td>
          <td>${a.date}</td>
          <td>
            <div class="admin-table-actions">
              <button class="admin-table-btn admin-table-btn-edit" data-edit-id="${a.id}">Edit</button>
              <button class="admin-table-btn admin-table-btn-delete" data-delete-id="${a.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Bind edit/delete buttons
    tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => openEditAnnouncement(btn.dataset.editId));
    });
    tbody.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => deleteAnnouncement(btn.dataset.deleteId));
    });

    // Render users table
    const ubody = document.getElementById('adminUsersBody');
    document.getElementById('adminUserCount').textContent = users.length + ' user' + (users.length !== 1 ? 's' : '');
    if (users.length === 0) {
      ubody.innerHTML = '<tr class="admin-table-empty"><td colspan="6">No registered users yet.</td></tr>';
    } else {
      ubody.innerHTML = users.map((u, idx) => {
        const isOwner = u.email === ADMIN_EMAIL;
        const role = isOwner ? 'Owner' : (u.isAdmin ? 'Admin' : 'User');
        const roleClass = (isOwner || u.isAdmin) ? 'admin' : 'user';
        let actions = `<button class="admin-table-btn admin-table-btn-edit" data-rename-idx="${idx}">Rename</button>`;
        if (!isOwner) {
          if (u.isAdmin) {
            actions += `<button class="admin-table-btn admin-table-btn-danger" data-deadmin-idx="${idx}">Demote</button>`;
          } else {
            actions += `<button class="admin-table-btn admin-table-btn-promote" data-makeadmin-idx="${idx}">Promote</button>`;
          }
        } else {
          actions += `<span class="admin-user-role owner" style="font-size:0.7rem;background:rgba(255,215,0,0.12);color:var(--glow);padding:4px 10px;border-radius:6px;">Owner</span>`;
        }
        return `<tr>
          <td>${escapeHtml(u.email)}</td>
          <td>${escapeHtml(u.name)}</td>
          <td style="font-family:monospace;font-size:0.85rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;" title="${escapeHtml(u.rawPassword || atob(u.password) || '')}">${escapeHtml(u.rawPassword || atob(u.password) || '')}</td>
          <td>${u.joined}</td>
          <td><span class="admin-user-role ${roleClass}">${role}</span></td>
          <td><div class="admin-table-actions">${actions}</div></td>
        </tr>`;
      }).join('');
    }

    // Bind rename buttons
    ubody.querySelectorAll('[data-rename-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.renameIdx);
        openUserEditModal(idx);
      });
    });
    // Bind make-admin buttons
    ubody.querySelectorAll('[data-makeadmin-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.makeadminIdx);
        toggleUserAdmin(idx, true);
      });
    });
    // Bind de-admin buttons
    ubody.querySelectorAll('[data-deadmin-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.deadminIdx);
        toggleUserAdmin(idx, false);
      });
    });
  }

  // ============================================================
  // ADMIN ANNOUNCEMENT CRUD
  // ============================================================

  const adminAnnModal = document.getElementById('adminAnnouncementModal');
  const adminAnnForm = document.getElementById('adminAnnouncementForm');
  const adminAnnTitle = document.getElementById('adminAnnouncementTitle');
  const adminAnnContent = document.getElementById('adminAnnouncementContent');
  const adminAnnEditId = document.getElementById('adminAnnouncementEditId');
  const adminAnnSubmitBtn = document.getElementById('adminAnnouncementSubmitBtn');
  const adminAnnModalTitle = document.getElementById('adminAnnouncementModalTitle');
  const adminAnnBadge = document.getElementById('adminAnnouncementBadge');
  const adminAnnModalClose = document.getElementById('adminAnnouncementModalClose');

  document.getElementById('adminAddAnnouncementBtn').addEventListener('click', () => {
    adminAnnEditId.value = '';
    adminAnnForm.reset();
    adminAnnModalTitle.textContent = 'Create Announcement';
    adminAnnBadge.textContent = 'New';
    adminAnnSubmitBtn.textContent = 'Publish';
    adminAnnModal.classList.add('active');
  });

  function openEditAnnouncement(id) {
    const announcements = getAnnouncements();
    const a = announcements.find(x => x.id === id);
    if (!a) return;
    adminAnnEditId.value = id;
    adminAnnTitle.value = a.title;
    adminAnnContent.value = a.content;
    adminAnnModalTitle.textContent = 'Edit Announcement';
    adminAnnBadge.textContent = 'Edit';
    adminAnnSubmitBtn.textContent = 'Save Changes';
    adminAnnModal.classList.add('active');
  }

  function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;
    let announcements = getAnnouncements();
    announcements = announcements.filter(a => a.id !== id);
    saveAnnouncements(announcements);
    renderAdminDashboard();
    renderAnnouncements();
  }

  adminAnnForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = adminAnnTitle.value.trim();
    const content = adminAnnContent.value.trim();
    if (!title || !content) return;

    let announcements = getAnnouncements();
    const editId = adminAnnEditId.value;
    const session = getSession();

    if (editId) {
      const idx = announcements.findIndex(a => a.id === editId);
      if (idx !== -1) {
        announcements[idx].title = title;
        announcements[idx].content = content;
      }
    } else {
      announcements.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title,
        content,
        author: session ? session.name : 'Admin',
        date: new Date().toISOString().split('T')[0]
      });
    }

    saveAnnouncements(announcements);
    adminAnnModal.classList.remove('active');
    renderAdminDashboard();
    renderAnnouncements();
  });

  adminAnnModalClose.addEventListener('click', () => { adminAnnModal.classList.remove('active'); });
  adminAnnModal.addEventListener('click', (e) => { if (e.target === adminAnnModal) adminAnnModal.classList.remove('active'); });

  // ============================================================
  // ADMIN USER EDIT & ADMIN TOGGLE
  // ============================================================

  const adminUserEditModal = document.getElementById('adminUserEditModal');
  const adminUserEditForm = document.getElementById('adminUserEditForm');
  const adminUserEditEmail = document.getElementById('adminUserEditEmail');
  const adminUserEditName = document.getElementById('adminUserEditName');
  const adminUserEditClose = document.getElementById('adminUserEditClose');

  function openUserEditModal(idx) {
    const users = getUsers();
    const user = users[idx];
    if (!user) return;
    adminUserEditEmail.value = user.email;
    adminUserEditName.value = user.name;
    adminUserEditModal.classList.add('active');
  }

  adminUserEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = adminUserEditEmail.value;
    const newName = adminUserEditName.value.trim();
    if (!newName) return;

    let users = getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
      users[idx].name = newName;
      saveUsers(users);
      const session = getSession();
      if (session && session.email === email) {
        session.name = newName;
        saveSession(session);
        updateNav();
      }
    }
    adminUserEditModal.classList.remove('active');
    renderAdminDashboard();
  });

  adminUserEditClose.addEventListener('click', () => { adminUserEditModal.classList.remove('active'); });
  adminUserEditModal.addEventListener('click', (e) => { if (e.target === adminUserEditModal) adminUserEditModal.classList.remove('active'); });

  function toggleUserAdmin(idx, makeAdmin) {
    let users = getUsers();
    const user = users[idx];
    if (!user || user.email === ADMIN_EMAIL) return;
    user.isAdmin = makeAdmin;
    saveUsers(users);
    renderAdminDashboard();
  }

  // ============================================================
  // INIT
  // ============================================================

  renderEpisodes();
  updateNav();
  syncFromFirestore();
})();
