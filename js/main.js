/* =============================================
   SKASKA BRANDY - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize custom cursor
  initCustomCursor();

  // Initialize age verification first
  initAgeVerification();

  // Initialize all components
  initPreloader();
  initNavigation();
  initScrollAnimations();
  initVideoPlayers();
  initGallery();
  initImageLightbox();
  initCarousels();
  initSplitText();
  initSoundToggle();
  initMedalModal();
  initVideoModal();

  // New features
  initGoldenParticles();
  initScrollToTop();
  initPageTransitions();
  initCursorTrail();
  initCardTilt();
});

/* =============================================
   AGE VERIFICATION
   ============================================= */
function initAgeVerification() {
  var modal = document.getElementById('ageModal');
  if (!modal) return;

  var yesBtn = document.getElementById('ageYes');
  var noBtn = document.getElementById('ageNo');

  // Check if already verified
  if (localStorage.getItem('skaska-age-verified') === 'true') {
    modal.classList.add('hidden');
    document.body.classList.add('age-verified');
    document.body.style.overflow = '';
    return;
  }

  // Block scrolling while modal is open
  document.body.style.overflow = 'hidden';

  // JS fallback: force critical inline styles for iOS Safari
  // Guarantees rendering even if CSS fails to apply correctly
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.zIndex = '99999';
  modal.style.background = 'rgba(10, 8, 5, 0.9)';
  modal.style.overflowY = 'auto';

  var content = modal.querySelector('.age-modal-content');
  if (content) {
    content.style.background = '#F4EFE4';
    content.style.position = 'relative';
    content.style.maxWidth = '750px';
    content.style.width = '90%';
    content.style.margin = '10vh auto';
    content.style.boxShadow = '2px 8px 23px 3px rgba(0,0,0,0.2)';
    content.style.boxSizing = 'border-box';
  }

  // Yes button - verify and allow access
  if (yesBtn) {
    yesBtn.addEventListener('click', function() {
      localStorage.setItem('skaska-age-verified', 'true');
      modal.classList.add('hidden');
      document.body.classList.add('age-verified');
      document.body.style.overflow = '';
    });
  }

  // No button - show denied message
  if (noBtn) {
    noBtn.addEventListener('click', function() {
      modal.classList.add('denied');
    });
  }
}

/* =============================================
   PRELOADER
   ============================================= */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const counter = document.querySelector('.preloader-counter');

  if (!preloader) return;

  // Start playing pouring sound when preloader starts
  playPouringSound();

  // Check if page is already loaded
  const checkLoaded = () => {
    if (document.readyState === 'complete') {
      // Page is loaded, animate quickly
      let count = 0;
      const interval = setInterval(() => {
        count += 5; // Jump by 5% for faster animation
        if (count > 100) count = 100;
        if (counter) counter.textContent = count;

        if (count >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            stopPouringSound();
            // Dispatch custom event when preloader is hidden
            window.dispatchEvent(new CustomEvent('preloaderHidden'));
          }, 200);
        }
      }, 10); // 10ms interval = faster animation
    } else {
      // Page still loading, wait a bit then animate
      window.addEventListener('load', () => {
        let count = 0;
        const interval = setInterval(() => {
          count += 5;
          if (count > 100) count = 100;
          if (counter) counter.textContent = count;

          if (count >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              preloader.classList.add('hidden');
              document.body.style.overflow = 'auto';
              stopPouringSound();
              // Dispatch custom event when preloader is hidden
              window.dispatchEvent(new CustomEvent('preloaderHidden'));
            }, 200);
          }
        }, 10);
      });
    }
  };

  checkLoaded();
}

/* =============================================
   POURING SOUND EFFECT
   ============================================= */
let pouringSoundElement = null;

function playPouringSound() {
  const pouringSound = document.getElementById('pouringSound');
  if (!pouringSound) return;
  
  pouringSoundElement = pouringSound;
  
  // Play the sound
  pouringSound.volume = 0.5; // Set volume to 50%
  pouringSound.play().catch(() => {
    // Handle autoplay restrictions silently
    // Modern browsers require user interaction before playing audio
  });
}

function stopPouringSound() {
  if (pouringSoundElement) {
    pouringSoundElement.pause();
    pouringSoundElement.currentTime = 0;
  }
}

/* =============================================
   NAVIGATION
   ============================================= */
function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-menu a');

  // Set hero-distillery.jpg as background for nav overlay
  if (navOverlay) {
    // Determine correct path based on current page location
    const isSrPage = window.location.pathname.includes('/sr/');
    const imagePath = isSrPage ? '../images/hero/hero-distillery.jpg' : 'images/hero/hero-distillery.jpg';
    navOverlay.style.backgroundImage = `url('${imagePath}')`;
  }

  // Header scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (!menuToggle || !navOverlay) return;

  // Toggle menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : 'auto';
    menuToggle.setAttribute('aria-expanded', navOverlay.classList.contains('active'));
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Highlight current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const heroTitles = document.querySelectorAll('.hero-title');
  const heroIntros = document.querySelectorAll('.hero-intro');

  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) || (
      rect.top < window.innerHeight && 
      rect.bottom > 0 && 
      rect.left < window.innerWidth && 
      rect.right > 0
    );
  }

  // Function to trigger animation if element is already visible
  function triggerIfVisible(elements) {
    elements.forEach(el => {
      if (isInViewport(el)) {
        el.classList.add('visible');
      }
    });
  }

  // Track which hero titles have already been animated to prevent re-triggering
  const animatedHeroTitles = new Set();
  const animatedHeroIntros = new Set();

  // Function to trigger hero title animation
  function triggerHeroTitleAnimation() {
    heroTitles.forEach(el => {
      if (!animatedHeroTitles.has(el)) {
        el.classList.add('visible');
        animatedHeroTitles.add(el);
      }
    });
    heroIntros.forEach(el => {
      if (!animatedHeroIntros.has(el)) {
        el.classList.add('visible');
        animatedHeroIntros.add(el);
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // For hero titles and intros, trigger animation
        if (entry.target.classList.contains('hero-title')) {
          // Remove and re-add to trigger animation again
          entry.target.classList.remove('visible');
          // Force reflow to reset animation
          void entry.target.offsetWidth;
          entry.target.classList.add('visible');
        } else if (entry.target.classList.contains('hero-intro')) {
          entry.target.classList.remove('visible');
          void entry.target.offsetWidth;
          entry.target.classList.add('visible');
        } else {
          // For other animated elements, allow re-triggering on scroll
          entry.target.classList.add('visible');
        }
      } else {
        // Remove visible class when element leaves viewport to allow re-triggering
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '100px 0px 0px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
  heroTitles.forEach(el => observer.observe(el));
  heroIntros.forEach(el => observer.observe(el));
  
  // Function to check and trigger hero animations
  function checkAndTriggerHeroAnimations() {
    heroTitles.forEach(el => {
      if (!animatedHeroTitles.has(el) && isInViewport(el)) {
        el.classList.add('visible');
        animatedHeroTitles.add(el);
      }
    });
    heroIntros.forEach(el => {
      if (!animatedHeroIntros.has(el) && isInViewport(el)) {
        el.classList.add('visible');
        animatedHeroIntros.add(el);
      }
    });
  }
  
  // Listen for preloader hidden event
  window.addEventListener('preloaderHidden', () => {
    setTimeout(() => {
      checkAndTriggerHeroAnimations();
    }, 400);
  });
  
  // Check if preloader is already hidden
  const preloader = document.querySelector('.preloader');
  if (!preloader || preloader.classList.contains('hidden')) {
    setTimeout(() => {
      checkAndTriggerHeroAnimations();
    }, 500);
  }
  
  // Also trigger on window load as backup
  window.addEventListener('load', () => {
    setTimeout(() => {
      checkAndTriggerHeroAnimations();
    }, 600);
  });
  
  // Immediate check after a short delay (in case everything is already loaded)
  setTimeout(() => {
    checkAndTriggerHeroAnimations();
  }, 800);

  // Safari fallback: force visible for elements in viewport that aren't visible yet
  // Handles cases where IntersectionObserver doesn't fire on Safari
  setTimeout(function() {
    document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }, 2500);
}

/* =============================================
   VIDEO PLAYERS
   ============================================= */
function initVideoPlayers() {
  // HERO VIDEO – fixed background video
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // Video MORA biti muted za autoplay
    heroVideo.muted = true;
    heroVideo.play().catch(() => {});
  }

  // OSTALI VIDEO PLEJERI (u .video-container)
  const videoContainers = document.querySelectorAll('.video-container');

  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.video-overlay');

    if (!video) return;

    // Preskoči hero video ako je slučajno u containeru
    if (video.id === 'heroVideo') {
      return;
    }

    // OSTALI VIDEO PLEJERI (npr. dole u .video-section)
    const isDistilleryVideo = video.id === 'distilleryVideoElement';

    // Overlay logika za klik (play/pause)
    if (overlay && !isDistilleryVideo) {
      overlay.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          overlay.classList.add('hidden');
        }
      });

      video.addEventListener('pause', () => overlay.classList.remove('hidden'));
      video.addEventListener('ended', () => overlay.classList.remove('hidden'));
      video.addEventListener('click', () => {
        if (!video.paused) video.pause();
      });
    }

    // Auto-play/pause SAMO za distillery video kada ulazi/izlazi iz viewport-a
    if (isDistilleryVideo) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(error => {
              // Autoplay blocked silently
            });
          } else {
            video.pause();
          }
        });
      }, {
        threshold: 0.3,
        rootMargin: '0px'
      });

      observer.observe(video);
    }
  });
}

/* =============================================
   GALLERY & LIGHTBOX
   ============================================= */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Navigation
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });
}

/* =============================================
   IMAGE LIGHTBOX (for all images)
   ============================================= */
function initImageLightbox() {
  // Kreiraj lightbox ako ne postoji
  let lightbox = document.querySelector('.image-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <div class="lightbox-content">
        <img src="" alt="Enlarged image">
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Pronađi sve slike (osim onih u galeriji i video thumbnail-ima)
  const allImages = document.querySelectorAll('img:not(.gallery-item img):not(.video-thumbnail img):not(.logo-icon):not(.logo-text):not(.medal-hover-trigger):not(.age-modal-logo):not(.footer-logo-image img):not(.news-card-image img[style*="pointer-events"])');
  
  allImages.forEach(img => {
    // Preskoči slike koje su već u lightbox-u ili su deo drugih komponenti
    if (img.closest('.lightbox') || img.closest('.video-thumbnail') || img.closest('.logo')) {
      return;
    }

    // Preskoči slike sa pointer-events: none (npr. Sputnik vest)
    if (img.style.pointerEvents === 'none' || window.getComputedStyle(img).pointerEvents === 'none') {
      return;
    }

    // Dodaj cursor pointer i klik handler
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Enlarged image';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
  });

  // Poseban handler za vest "Skaska je osvojila još jednu nagradu" - prikazuje IMG_0978.jpg
  // Pronađi vest po data-i18n atributu ili po tekstu
  const allNewsCards = document.querySelectorAll('.news-card');
  allNewsCards.forEach(card => {
    const title = card.querySelector('h3[data-i18n="news-berlin-award"]');
    const titleText = card.querySelector('h3');
    const isBerlinAward = title || (titleText && (
      titleText.textContent.includes('osvojila još jednu nagradu') || 
      titleText.textContent.includes('won another award') ||
      titleText.textContent.includes('Skaska je osvojila još jednu nagradu')
    ));
    
    if (isBerlinAward) {
      const newsImage = card.querySelector('.news-card-image img');
      if (newsImage) {
        // Dodaj poseban handler koji će override-ovati default ponašanje
        newsImage.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // Odredi putanju na osnovu trenutne lokacije
          const isInSrFolder = window.location.pathname.includes('/sr/');
          const imgPath = isInSrFolder ? '../images/awards/IMG_0978.jpg' : 'images/awards/IMG_0978.jpg';
          lightboxImg.src = imgPath;
          lightboxImg.alt = 'Skaska Award';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, true); // Koristi capture phase da se izvrši pre default handlera
      }
    }
  });
}

/* =============================================
   CAROUSELS
   ============================================= */
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (!track || !slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      currentSlide = index;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      if (currentSlide >= totalSlides) currentSlide = 0;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-advance (optional)
    // setInterval(() => goToSlide(currentSlide + 1), 5000);
  });
}

/* =============================================
   SPLIT TEXT ANIMATION
   ============================================= */
function initSplitText() {
  const splitTextElements = document.querySelectorAll('.split-text');

  splitTextElements.forEach(element => {
    const text = element.textContent;
    element.innerHTML = '';

    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${index * 0.03}s`;
      element.appendChild(span);
    });
  });

  // Trigger animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.5 });

  splitTextElements.forEach(el => observer.observe(el));
}

/* =============================================
   SMOOTH SCROLL (for anchor links)
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* =============================================
   SOUND TOGGLE FOR HERO VIDEO
   ============================================= */
function initSoundToggle() {
  const soundToggle = document.getElementById('soundToggle');
  const heroVideo = document.getElementById('heroVideo');

  if (!soundToggle || !heroVideo) return;

  // Video je MUTED na početku - dugme u centru
  heroVideo.muted = true;
  soundToggle.classList.add('muted');

  let hasMoved = false;

  // Funkcija za pomeranje dugmeta dole
  const moveButtonDown = () => {
    if (!hasMoved) {
      soundToggle.classList.add('moved');
      hasMoved = true;
    }
  };

  // Funkcija za unmute
  const unmuteSound = () => {
    heroVideo.muted = false;
    soundToggle.classList.remove('muted');
    moveButtonDown();
  };

  // Funkcija za mute
  const muteSound = () => {
    heroVideo.muted = true;
    soundToggle.classList.add('muted');
  };

  // Klik na dugme uključuje/isključuje zvuk i pomera dole
  soundToggle.addEventListener('click', () => {
    if (heroVideo.muted) {
      unmuteSound();
    } else {
      muteSound();
    }
    moveButtonDown();
  });

  // Scroll pomera dugme dole
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    moveButtonDown();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Ne vraćaj dugme nazad, ostaje dole
    }, 100);
  }, { passive: true });

  // Osiguraj da video nikad ne stane - provera svakih 2 sekunde
  setInterval(() => {
    if (heroVideo.paused) {
      heroVideo.play().catch(() => {});
    }
  }, 2000);
}

/* =============================================
   VIDEO MODAL
   ============================================= */
function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalClose = document.querySelector('.video-modal-close');
  const videoThumbnails = document.querySelectorAll('.video-thumbnail');

  if (!videoModal || !modalVideo) return;

  videoThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function(e) {
      var target = e.currentTarget;
      var videoSrc = target && target.dataset && target.dataset.videoSrc;
      if (videoSrc) {
        modalVideo.src = videoSrc;
        modalVideo.load();
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalVideo.play().catch(() => {});
      }
    });
  });

  // Close modal
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalVideo.pause();
      modalVideo.src = '';
      videoModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal on background click
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      modalVideo.pause();
      modalVideo.src = '';
      videoModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      modalVideo.pause();
      modalVideo.src = '';
      videoModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

/* =============================================
   MEDAL MODAL
   ============================================= */
function initMedalModal() {
  const medalModal = document.getElementById('medalModal');
  const medal3 = document.querySelector('.medal-hover-trigger[data-medal="3"]');
  const medal4 = document.querySelector('.medal-hover-trigger[data-medal="4"]');
  const modalClose = document.querySelector('.medal-modal-close');
  const modalImg = medalModal ? medalModal.querySelector('.medal-modal-content img') : null;
  const medalWrappers = document.querySelectorAll('.medal-wrapper');
  const isMobile = window.innerWidth <= 768;

  // Default images for medals
  const medalImages = {
    '3': 'images/awards/IMG_0978.jpg',
    '4': 'images/awards/Balkan Spirits Gold.jpg'
  };

  if (!medalModal) return;

  // Open modal with specific image
  const openModal = (e, medalId) => {
    e.preventDefault();
    if (modalImg && medalImages[medalId]) {
      // Handle relative path for SR pages
      const isInSrFolder = window.location.pathname.includes('/sr/');
      const imgPath = isInSrFolder ? '../' + medalImages[medalId] : medalImages[medalId];
      modalImg.src = imgPath;
    }
    medalModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Medal 3
  if (medal3) {
    // medal3 click intentionally does nothing (no modal)
  }
  
  const medal3Link = document.querySelector('.medal-3-link');
  if (medal3Link) {
    // medal3 link click intentionally does nothing (no modal)
  }

  // Medal 4 (Balkan Competition)
  if (medal4) {
    // medal4 click intentionally does nothing (no modal)
  }
  
  const medal4Link = document.querySelector('.medal-4-link');
  if (medal4Link) {
    // medal4 link click intentionally does nothing (no modal)
  }

  // Close modal
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      medalModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal on background click
  medalModal.addEventListener('click', (e) => {
    if (e.target === medalModal) {
      medalModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && medalModal.classList.contains('active')) {
      medalModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Mobile: Handle medal menu clicks
  if (isMobile) {
    medalWrappers.forEach(wrapper => {
      const medal = wrapper.querySelector('.medal-hover-trigger');
      const submenu = wrapper.querySelector('.medal-submenu');
      
      if (medal && submenu && medal.dataset.medal !== '3') {
        medal.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other open menus
          medalWrappers.forEach(w => {
            if (w !== wrapper) {
              w.classList.remove('active');
            }
          });
          
          // Toggle current menu
          wrapper.classList.toggle('active');
        });
      }
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.medal-wrapper')) {
        medalWrappers.forEach(w => w.classList.remove('active'));
      }
    });
  }
}

/* =============================================
   FORM HANDLING
   ============================================= */
// Form handling je sada u contact.html sa EmailJS integracijom
// Ovaj kod je onemogućen da ne bi interferirao sa EmailJS handler-om
/*
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Here you would typically send to a server
    // For now, just log and show success
    // Form data ready for submission

    // Show success message
    alert('Thank you for your message. We will get back to you soon!');
    this.reset();
  });
}
*/

/* =============================================
   LANGUAGE SWITCHER (i18n)
   ============================================= */
const translations = {
  en: {
    // === AGE VERIFICATION ===
    'age-text': 'You must be of legal purchase age to enter this website.',
    'age-yes': 'yes',
    'age-no': 'no',
    'age-disclaimer': 'By pressing "YES" and entering this site I agree to the Terms & Conditions and Privacy Policy.',
    'age-denied-title': 'Access Denied',
    'age-denied-text': 'You must be of legal drinking age to enter this website.',

    // === COMMON (all pages) ===
    'scroll': 'Scroll',
    'nav-home': 'Skaska',
    'nav-group-brand': 'Brand',
    'nav-group-experience': 'Experience',
    'nav-group-contact': 'Contact',
    'nav-why': 'Why',
    'nav-why-sub': 'Why',
    'nav-what': 'What & How',
    'nav-what-sub': 'What & How',
    'nav-where-link': 'Where',
    'nav-where-sub': 'Where',
    'nav-commitment': 'Commitment',
    'nav-gallery': 'Gallery',
    'nav-distillery': 'Distillery',
    'nav-news': 'News',
    'nav-awards': 'Awards',
    'nav-where': 'Find Skaska',
    'nav-about': 'Tale of Plum',
    'nav-contact': 'Contact',
    'copyright': '© 2026 Skaska Distillery Ltd. All rights reserved.',
    
    // About page
    'about-hero-title': 'Tale of Plum',
    'about-craftsmanship': 'Craftsmanship',
    'about-craftsmanship-p1': 'Co-founder and 4th generation master distiller, Zoran Jevtović is responsible for Skaska’s character. His experience and refined sensory approach guide the carefully controlled double distillation, shaping the spirit’s elegant and balanced profile.',
    'about-idea': 'Heritage',
    'about-idea-p1': 'Co-founder Andreja Bošković brings a deep connection to the land and the belief that exceptional brandy begins with exceptional fruit. His philosophy is rooted in respect for nature and the patience that artisanal plum brandy demands.',
    'about-vision': 'Vision',
    'about-vision-p1': 'Founder and driving force behind the brand, Marko Popović defined Skaska’s direction from the start — uncompromising quality. His vision brings together family heritage, modern standards, and a strong brand identity.',
    'about-process': 'Process',
    'about-process-p1': 'Skaska is crafted in Bare in Shumadia, from carefully grown Stanley plums cultivated in our orchards across three distinct locations: Brdo, Aleksića and Kovionica, under the expert supervision of agricultural engineer Aleksandar Urošević. Following the late September harvest, the fruit is gently crushed and left to its own spontaneous fermentation in stainless steel tanks, with nothing added and nothing taken away. When the process naturally comes to an end, the plum puree makes its way to double distillation in artisanal copper pot stills. The spirit then matures for a minimum of five years in French oak barrique barrels, where it develops depth, smoothness, and aromatic complexity. The union of nature, knowledge and time gives Skaska its distinctive character.',
    'btn-find': 'Find Skaska Near You',
    'btn-gallery': 'View Gallery',
    'btn-learn': 'Learn More',
    'btn-discover': 'Discover More',
    'btn-visit': 'Visit Our Distillery',

    // === INDEX PAGE ===
    'title':  'Skaska – Mellowdy of Bonhomie',
    'meta-desc': 'Skaska – an oral story with elements of fantasy that was passed down from generation to generation. Premium Serbian brandy from Šumadija.',
    'hero-title': 'Mellowdy of Bonhomie',
    'main-text': 'Once we wished to encapsulate the spirit and colors, the unmatched beauty of Shumadia in one special feature, we chose: MELLOWNESS. And as if these landscapes made an effort and did everything to parent people who absorbed that mellowness.',
    'main-text-2': 'Skaska is just a story about that unique trait being transformed into kindness and cordiality. Skaska is a tale of a plum, a symbol of welcome and hospitality.',
    'spotlight-eyebrow': 'Skaska',
    'spotlight-title': 'A tale poured into a glass',
    'spotlight-text': 'Born in our orchards in Bare, double distilled in copper stills and patiently matured — until mellowness becomes a flavor. One village, one orchard, one tale.',
    'spotlight-cta-find': 'Find Skaska',
    'spotlight-cta-story': 'Tale of Plum',
    'awards-strip-title': 'Awarded around the world',
    'award-points': 'points',
    'award-points-2': 'points',
    'award-top5': 'finalist',
    'award-silver': 'Silver',
    'award-medal': 'medal',
    'footer-definition': 'Skaska (ref. Dictionary) – an oral story with elements of fantasy passed down from generation to generation',

    // === DISTILLERY PAGE ===
    'distillery-hero-title': 'Distillery',
    'distillery-hero-desc': 'Along the paths of our ancestors',
    'distillery-intro-title': 'Skaska, brandy that creates a fairy tale',
    'distillery-intro-text': 'Tradition is usually perceived as something out-dated, as a witness to the past that everyone understands in their own way. Some with wistfulness, others with indifference, but the majority still – with pride! Because, whether we want to admit it or not, tradition is the art of living! No matter how much it is disputed or forgotten, it persists; it is passed down from generation to generation, as the greatest treasure or a family secret. Tradition is the oath of the Serbian host. The most important legacy for his son. An oath to be the best, only not for others, but for himself. An oath to take care of his home and his neighbours, because the Serbian host knows that this is the greatest wealth! The real wealth is to celebrate work, but also to rest and enjoy. And when the Serbian host welcomes guests, he traditionally does it the best! So that he can be proud! And pride for the Serbian host is unimaginable without traditional Serbian plum brandy. Because plum brandy is not just a brandy – it is a tale about the best, bluest plum orchards, about work, about calloused hands of hosts, about dreams and untold stories…',
    'process-main-title': 'The Production Process',
    'process-main-desc': 'From hand-picked plums to aged perfection, discover the step-by-step journey of creating Skaska.',
    'process-step1': 'Step 1',
    'process-step1-title': 'Plum Harvest',
    'process-step1-p1': 'The journey begins in late summer, when plums reach perfect ripeness. Our team hand-picks only the finest plums from ancient varieties – red ranka, požegača, and other traditional Serbian types. We select plums that are fully ripe, free from rot or mold, ensuring the highest sugar content and optimal flavor profile.',
    'process-step1-p2': 'Timing is crucial: too early and the plums lack sweetness; too late and they begin to ferment on the tree. Our experienced harvesters know exactly when to pick, using generations of knowledge passed down through families.',
    'process-step2': 'Step 2',
    'process-step2-title': 'Natural Fermentation',
    'process-step2-p1': 'The selected plums are carefully crushed and placed in fermentation vessels. We use only natural yeasts present on the fruit\'s skin – no commercial yeasts are added. This traditional method allows for a slower, more complex fermentation that develops richer flavors.',
    'process-step2-p2': 'Fermentation takes place over several weeks, during which we carefully monitor temperature and progress. The natural sugars convert to alcohol, creating the base for our brandy. This process cannot be rushed – patience is essential for quality.',
    'process-step3': 'Step 3',
    'process-step3-title': 'Copper Still Distillation',
    'process-step3-p1': 'The fermented mash is distilled in traditional copper stills – a method that has been used for centuries. Copper plays a crucial role: it removes unwanted sulfur compounds and helps create a smoother, cleaner spirit.',
    'process-step3-p2': 'Our master distiller carefully monitors the process, separating the "heart" of the distillate from the "heads" and "tails". Only the purest middle portion is collected – typically around 60-70% alcohol by volume. This requires experience, skill, and an understanding of how the spirit develops during distillation.',
    'process-step4': 'Step 4',
    'process-step4-title': 'Aging in Oak Barrels — 5+ Years',
    'process-step4-p1': 'The clear distillate is transferred to oak barrels, where it will age for a minimum of five years. This extended aging period is what distinguishes Skaska from ordinary brandies. Our barrels are carefully selected – some are new, imparting strong vanilla and spice notes, while others are older, providing subtle complexity.',
    'process-step4-p2': 'During this extended aging, the brandy undergoes a remarkable transformation. It extracts compounds from the oak – tannins, vanillin, and other flavor compounds that create our signature bourbon-like taste profile. The alcohol content gradually decreases as water evaporates through the porous wood (the "angel\'s share"), while the remaining spirit becomes richer, smoother, and more complex with each passing year.',
    'process-step5': 'Step 5',
    'process-step5-title': 'Bottling & Labeling',
    'process-step5-p1': 'When the master distiller determines the brandy has reached optimal maturity, it\'s carefully bottled by hand. Each bottle is filled, sealed, and labeled with attention to detail. We use premium glass bottles that protect the spirit from light and preserve its quality.',
    'process-step5-p2': 'Our labels tell the story – the year, the batch number, and the care that went into each bottle. Every label is applied by hand, ensuring perfection in presentation to match the quality of the spirit inside.',
    'process-step6': 'Step 6',
    'process-step6-title': 'Quality Control',
    'process-step6-p1': 'Before any bottle leaves our distillery, it undergoes rigorous quality control. We test for alcohol content, clarity, aroma, and taste. Our quality standards are uncompromising – only bottles that meet our exacting criteria are released.',
    'process-step6-p2': 'This final step ensures that every bottle of Skaska delivers the exceptional experience our customers expect. It\'s our promise of quality, consistency, and excellence in every drop.',

    // === DISTILLERY PAGE - PHILOSOPHY SECTIONS ===
    'folklore-text': 'Plum brandy is the folklore of the Serbian tradition. Everything starts and ends with it. We are born with it, we rejoice, build, grieve, bury… we welcome people and see them off with it. It identifies us and characterizes us. It is always the same, but also completely different. Each new host crafts it specific, his own. Each host tried to craft his plum brandy the best, because it represented both him and his home. It has become part of identity and recognition of generations. Experience and love for crafting plum brandy has become an art. And art is not created overnight! Our art of crafting plum brandy is based on the tradition of generations that have carefully and patiently studied where the best plums grow. These generations taught us to pick the most beautiful, clean and ripe plums for brandy. Not rotten and mouldy ones! Because gold is to be made! Gold that will remain silent for years in barrels. And then … it will tell the most beautiful tale. The tale of the Serbian host, of everything that he kept silent about while he was dreaming by the pot still – about the wedding for his first-born son, about his grandchildren, about the oath, about the most sacred Serbian heritage – to welcome and see people off, to quench their thirst and feed them, to refresh everyone\'s soul – and all that is, for the Serbian host, unimaginable without plum brandy!',
    'distillery-secret-title': 'Distillery',
    'ancestors-secret': 'Our Skaska plum brandy holds the secret of our ancestors, their hopes and desires, everything that they taught us, but also the most important thing – plum brandy is them, and it is us! Our Skaska plum brandy celebrates life, celebrates tradition, preserves what is the best – a hard-working Serbian host who creates everything with pride and dignity! When we say that we craft plum brandy in the traditional way – we mean tradition in this sense.',
    'skaska-tells': 'That is why Skaska will tell you what other brandies cannot…',
    'ognjen-quote': '"In Skaska, there is pain. The pain of every unfortunate soul who has held a plum in the palm of their hand, bathed in the raindrops of Saint Elijah\'s storm. In Skaska, there is a grimace. A grimace on the face that gazes toward the heavens, praying to the Old Gods and the New God to preserve the delicate petal in March, shyly budding like a young maiden between two village gatherings. In Skaska, there is devotion. A devotion of friends, bound by a vow to reach the nectar of perfection. In Skaska, there is love. Love at the first drop, from a dewy glass. Cheers."',
    'ognjen-title': 'The author of Vineyard of Mehmed-beg and Walker in the place',
    'paths-title': 'Along the paths of our ancestors',
    'paths-text': '"On the slopes of Rudnik mountain, a village in Shumadia. As the day comes to an end, the villagers return from the meadows. Pleasantly tired from work, grandpa Djordje pauses, enchanted by the scent of the ripe plum orchard. The rays of the setting sun illuminate the landscape. He sits under the plum tree to rest, mesmerised by pageantry of his beautiful land. It\'s been a bountiful year, everything is good. Before him lies the timeless beauty of nature. A moment he returns to throughout his life whenever he wishes to recollect serenity and happiness. We have woven that moment into every drop of Skaska, and it awaits you to experience it."',

    // === ABOUT PAGE ===
    'about-hero-title': 'Tale of Plum',
    'about-hero-desc': 'Skaska is the shared vision of people brought together by their origins, their craft and a lasting love for Serbian plum brandy.',
    'about-story-subtitle': 'Our Story',
    'about-story-title': 'From Šumadija to the World',
    'about-story-p1': 'Skaska was born from a passion for preserving Serbian tradition and a dedication to excellence. What began as a dream to create world-class plum brandy has evolved into an award-winning craft distillery nestled in the heart of Šumadija.',
    'about-story-p2': 'The name "Skaska" comes from the Old Slavic word for "fairy tale" – an oral story with elements of fantasy passed down from generation to generation. Just like these timeless tales, our brandy carries the spirit, wisdom, and traditions of our ancestors.',
    'about-quote': '"We spent years studying literature and oral traditions to rediscover the authentic recipe for Serbian šljivovica. When we won silver at London Spirits Competition – missing gold by just one point among 1,800 spirits worldwide – we knew we had found it."',
    'about-stat-founded': 'Founded',
    'about-stat-aging': 'Years matured',
    'about-stat-trees': 'Plum Trees',
    'about-stat-bottles': 'Bottles annually',
    'about-founder-label': 'Founder & CEO',
    'about-marko-p1': 'Before discovering his passion for brandy making, Marko Popović had an international career as a professional basketball player. Born in Sarajevo and raised in Kragujevac, he played for Serbian clubs Vojvodina, Sloga, and Ergonoma, before taking his talents abroad to Greece, Poland, Georgia, Spain, Tunisia, and Iran.',
    'about-marko-p2': 'After retiring from basketball, Marko channeled the same discipline, dedication, and pursuit of excellence that defined his athletic career into building Skaska. His vision was clear: to create a premium Serbian brandy that honors tradition while achieving international recognition.',
    'about-marko-p3': 'Today, as CEO of Tribalija DOO, Marko oversees every aspect of production – from the plum orchards in Bare to the final bottle. His athletic background taught him that greatness requires patience, precision, and an unwavering commitment to quality.',
    'about-team-title': 'The Team',
    'about-team-desc': 'Behind every bottle of Skaska is a team of passionate individuals who share a common goal: to create the finest plum brandy Serbia has ever produced.',
    'about-role-ceo': 'Founder & CEO',
    'about-role-distiller': 'Master Distiller',
    'about-role-cofounder': 'Co-Founder',
    'about-marko-short': 'Former professional basketball player turned entrepreneur. Brings international experience and athletic discipline to building a world-class brandy brand.',
    'about-zoran-desc': 'Fourth-generation master distiller carrying decades of family knowledge. His expertise in traditional copper pot distillation ensures every batch meets the highest standards.',
    'about-andrej-desc': 'Owner of the historic estate in Bare where Skaska Distillery now operates. His deep roots in Šumadija and connection to the land bring authenticity to every bottle.',
    'about-journey-title': 'Our Journey',
    'about-journey-desc': 'From the first plum tree to international recognition – the milestones that shaped Skaska.',
    'about-timeline-2017-title': 'The Beginning',
    'about-timeline-2017-desc': 'Reconstruction begins on the historic estate in Bare, Šumadija. Old buildings are transformed into a modern distillery while preserving their authentic character.',
    'about-timeline-2018-title': 'First Harvest',
    'about-timeline-2018-desc': 'Our plum orchards across three locations (2.5 hectares, 1,100 trees) produce their first significant harvest. The Stanley plums are hand-picked at peak ripeness.',
    'about-timeline-2019-title': 'First Distillation',
    'about-timeline-2019-desc': 'Under Zoran Jevtović\'s guidance, the first batches undergo double distillation in our copper pot stills. The precious spirit is transferred to French oak barrels.',
    'about-timeline-2021-title': 'International Recognition',
    'about-timeline-2021-desc': 'Skaska wins Silver Medal at the London Spirits Competition, competing against 1,800 spirits from around the world – missing gold by just one point.',
    'about-timeline-2024-title': 'Growing Legacy',
    'about-timeline-2024-desc': 'With production capacity of 10,000 bottles annually and distribution expanding, Skaska continues its mission to share the best of Serbian tradition with the world.',
    'about-company-title': 'Company Information',
    'about-company-name': 'Company:',
    'about-company-address': 'Office:',
    'about-company-distillery': 'Distillery:',
    'about-company-phone': 'Phone:',

    // === GALLERY PAGE ===
    'gallery-hero-title': 'Gallery',
    'gallery-intro-title': 'It\'s not so hard to capture and preserve the beauties of nature once you are driven by true values of tradition : honesty and devotion.',
    'gallery-sumadija-title': 'Shumadia',
    'gallery-sumadija-subtitle': 'Treasure of enchantments',
    'gallery-mellowdy-title': 'Mellowdy of Bonhomie',
    'gallery-mellowdy-subtitle': 'Magic of nature and people',
    'gallery-mellowdy-desc': 'Plum brandy distilled by honoring a tradition that underlines the culture of welcoming wayfarer with kindness and bonhomie.',
    'gallery-hero-desc': 'Discover the beauty of our craft and the enchanting Šumadija region.',

    // === AWARDS PAGE ===
    'awards-hero-title': 'Awards & Recognition',
    'awards-hero-desc': 'Celebrating excellence in premium brandy craftsmanship',

    // === NEWS PAGE ===
    'news-hero-title': 'News',
    'news-hero-desc': 'Latest updates and events from Skaska Distillery',
    'news-gast-expo-2026': 'Skaska at GAST EXPO 2026 in Ljubljana',
    'news-london-2025': 'Skaska claims big recognition in London',
    'news-warsaw-expo': 'Skaska at Warsaw Wine Expo',
    'news-jao-mile': 'Basketball and Brandy on Jao Mile Podcast',
    'news-london-video': 'Skaska in London',
    'news-usa-silver': 'Skaska won a silver medal',
    'news-usa-silver-desc': '"Plum brandy with aromatic notes of dried apricots and honey, leading to flavors of dried fruit and raisins on the finish."',
    'news-rakijapod': 'Skaska on Rakijapod Podcast',
    'news-berlin-award': 'Skaska won another award',
    'news-sputnik': 'Our Skaska Story on Sputnik Serbia',
    'news-lsc-2021': 'Skaska in TOP5 in 2021',
    'news-lsc-2021-desc': '"Notes of dark molasses, burnt sugar and tropical fruit. Warm taste of chili and cloves."',
    'read-more': 'Read More',
    'watch-video': 'Watch Video',
    'usa-spirits-ratings': 'USA Spirits Ratings',
    'london-spirits-competition': 'London Spirits Competition',

    // === WHERE TO BUY PAGE ===
    'where-to-buy-hero-title': 'Find Skaska',
    'where-to-buy-hero-desc': 'Find Skaska',
    'where-page-title': 'Find Skaska - Skaska',
    'where-choose-title': 'Choose How to Buy',
    'where-choose-desc': 'Purchase Skaska online or visit our partner stores.',
    'where-buy-online': 'Buy Online',
    'where-visit-store': 'Visit Store',
    'where-stores-title': 'Where to Buy',
    'where-stores-desc': 'Visit our retail partners and select your bottle of Skaska in person.',
    'where-buy-title': 'Skaska awaits you at carefully selected locations. Order online or visit the nearest wine & spirit shop.',
    'where-type': 'Type:',
    'where-type-spirits': 'Premium Spirits Store',
    'where-type-wine': 'Wine & Spirits Shop',
    'where-address': 'Address:',
    'where-rakija-address': '2 locations',
    'where-box-address': '4 locations',
    'where-phone': 'Phone:',
    'where-show-map': 'Show on Map',
    'where-partner-title': 'Become a Partner',
    'where-partner-desc': 'For distribution and partnership inquiries, please contact us directly.',
    'where-partner-btn': 'Contact Us',

    // === CONTACT PAGE ===
    'contact-hero-title': 'Contact',
    'contact-hero-desc': 'We\'d love to hear from you.',
    'contact-label-email': 'Email',
    'contact-label-phone': 'Phone',
    'contact-label-company': 'Company',
    'contact-label-office': 'Office Location',
    'contact-label-distillery': 'Distillery',
    'contact-label-follow': 'Follow Us',
    'contact-view-map': 'View on Google Maps',
    'contact-form-name': 'Your Name',
    'contact-form-email': 'Email Address',
    'contact-form-subject': 'Subject',
    'contact-form-message': 'Your Message',
    'contact-form-send': 'Send',
    'contact-form-sending': 'Sending...',
    'contact-form-success': 'Message sent successfully! We will get back to you soon.',
    'contact-form-error': 'Error sending message. Please try again or contact us directly at marko@skaskabrandy.com',
    'contact-company-name': 'Skaska',
    'contact-company-name-full': 'Skaska Distillery Ltd',
    'contact-office-street': 'Lasla Gala 17/36',
    'contact-office-city': '21000 Novi Sad',
    'contact-distillery-location': 'Bare, Shumadia, Serbia',

    // === COMMITMENT PAGE ===
    'commitment-hero-title': 'Commitment',
    'commitment-hero-desc': 'The real tradition is not about historical facts nor customs but all about true values passed on.',
    'commitment-definition': 'Skaska (ref. Dictionary) – an oral story with elements of fantasy that was passed down from generation to generation',
    'commitment-main-title': 'The real tradition is not about historical facts nor customs but all about true values passed on.',
    'commitment-where-title': 'Where',
    'commitment-where-text': 'Manufactured in the heart of Serbia, called Shumadia and famous for an authentic plum brandy, widely acclaimed for the mellowness of its landscapes and its people.',
    'commitment-what-title': 'What & How',
    'commitment-what-text': 'Plum brandy distilled by honoring a tradition that underlines the culture of welcoming wayfarer with kindness and bonhomie.',
    'commitment-why-title': 'Why',
    'commitment-why-text': 'There are so much pride and dignity in our people\'s way to honor new friendships with carefully distilled plum brandy, permeated with the lore of true values: honesty and devotion. We take pride in following this culture in the process of crafting Skaska plum brandy.',
    'commitment-video-long-title': 'Longer version',
    'commitment-video-short-title': 'Shorter version',
    'page-title': 'Commitment - Skaska',
    'intro-title': 'Skaska – A Fairy Tale That You Drink',
    'intro-quote': '"In Skaska there is pain. The pain of every unfortunate one, who held in his palm a plum soaked in the drops of rain of St. Elijah. In Skaska there is a spasm. A spasm on the face that looks to the heavens and prays to the old Gods and the New God..."',
    'intro-author': '— Ognjen Avlijaš, Author',
    'origin-title': 'Origin – Šumadija, Rudnik, Ancient Plum Varieties',
    'origin-p1': 'In the heart of Serbia, called Šumadija, where tradition and heritage have been preserved for generations. On the slopes of Mount Rudnik, where the air is pure and the soil rich, grow the finest plum orchards. Here, we select only the ripest plums from ancient varieties – red ranka, požegača, and other traditional Serbian plum types that have been cultivated for centuries.',
    'origin-p2': 'The terroir of Šumadija, with its unique climate and soil composition, imparts distinctive characteristics to our plums. The combination of altitude, temperature variations, and traditional farming methods creates fruit with exceptional sugar content and complex flavor profiles – the foundation of exceptional brandy.',
    'family-title': 'Family & Tradition',
    'family-p1': 'Skaska is more than a brandy – it\'s a family legacy. Our story begins with generations of master distillers who passed down not just techniques, but values: honesty, devotion, and an uncompromising commitment to quality. Each bottle carries the wisdom of ancestors who understood that true tradition is not about historical facts, but about the values we preserve and pass forward.',
    'family-p2': 'In old photographs, you can see the weathered hands of our forefathers, the copper stills that have been used for decades, and the oak barrels that have aged countless batches. These images tell a story of continuity, of a craft perfected over time, and of a family\'s dedication to creating something truly exceptional.',
    'philosophy-p1': 'In an era of mass production, we choose a different path. We work in small batches, by hand, with meticulous attention to every detail. Why? Because excellence cannot be rushed, and quality cannot be compromised.',
    'philosophy-p2': 'We believe that true premium brandy is not created in factories, but in the careful hands of craftsmen who understand that each step matters. From selecting the perfect plums to monitoring the fermentation, from the precise moment of distillation to the patient aging in oak barrels – every decision is made with care, experience, and respect for tradition.',
    'philosophy-p3': 'We make less, but we make it better. This philosophy means that not everyone will have Skaska, but those who do will experience something truly special – a brandy that tells a story, that carries emotion, that represents the best of Serbian craftsmanship.',
    'process-p1': 'Our production process is a carefully choreographed dance between tradition and precision. It begins with hand-picking the finest plums at peak ripeness, continues through natural fermentation, traditional copper still distillation, and culminates in patient aging in oak barrels.',
    'process-p2': 'Each step is guided by generations of knowledge, but also by modern understanding of chemistry and quality control. We honor the old ways while ensuring consistency and excellence in every batch.',
    'btn-process': 'Explore the Full Process',
    'emotion-title': 'Skaska as Emotion – What It Represents',
    'emotion-desc': 'Skaska is not just a drink – it\'s an emotion, a memory, a connection to something deeper. For those who drink it, Skaska represents:',
    'emotion-heritage': 'Heritage',
    'emotion-heritage-desc': 'A link to Serbian tradition and the values of our ancestors',
    'emotion-quality': 'Quality',
    'emotion-quality-desc': 'The pursuit of excellence in every aspect of production',
    'emotion-connection': 'Connection',
    'emotion-connection-desc': 'A way to bring people together, to celebrate, to share stories',
    'emotion-pride': 'Pride',
    'emotion-pride-desc': 'Pride in Serbian craftsmanship and the ability to create something world-class',

    // === INDEX PAGE - KEY FACTS ===
    'keyfacts-subtitle': 'Crafted with Pride',
    'keyfacts-title': 'Premium Serbian Brandy',
    'keyfacts-founded': 'Founded',
    'keyfacts-aging': 'Years Oak Aging',
    'keyfacts-trees': 'Plum Trees',
    'keyfacts-top5': 'World Brandies',
    'keyfacts-award-comp': 'London Spirits Competition 2021',
    'keyfacts-award-medal': 'Silver Medal',
    'keyfacts-award-desc': 'Competing against 1,800 spirits worldwide, Skaska missed the Gold Medal by just one point.',
    'keyfacts-btn': 'View All Awards',
    'awards-desc-updated': 'Silver Medal at London Spirits Competition 2021, competing against 1,800 spirits worldwide. Missing gold by just one point—ranked in the Top 5 brandies.',

    // === DISTILLERY PAGE - OUR ESTATE ===
    'estate-title': 'Our Estate in Bare',
    'estate-desc': 'Nestled in the heart of Šumadija, Serbia\'s plum-growing heartland, our estate in Bare village produces premium plum brandy using time-honored methods passed down through generations.',
    'estate-hectares': 'Hectares',
    'estate-orchards': 'Plum Orchards',
    'estate-trees': 'Plum Trees',
    'estate-variety': 'Stanley Variety',
    'estate-years': 'Years',
    'estate-aging': 'Oak Barrel Aging',
    'estate-bottles': 'Bottles',
    'estate-production': 'Annual Production',
    'estate-plums-title': 'Premium Stanley Plums',
    'estate-plums-p1': 'Our estate cultivates 1,100 Stanley plum trees across 2.5 hectares of carefully maintained orchards. The Stanley variety, known for its exceptional sweetness and deep purple color, is ideally suited for premium brandy production.',
    'estate-plums-p2': 'The unique microclimate of Šumadija, combined with the region\'s rich soil, creates perfect conditions for growing plums with high sugar content and complex flavor profiles. Each tree is hand-tended throughout the year, ensuring optimal fruit quality.',
    'distillery-aging-title': 'Aging in Oak Barrels — 5+ Years',
    'distillery-aging-p1': 'The clear distillate is transferred to oak barrels, where it will age for a minimum of five years. This extended aging period is what distinguishes Skaska from ordinary brandies. Our barrels are carefully selected – some are new, imparting strong vanilla and spice notes, while others are older, providing subtle complexity.',
    'distillery-aging-p2': 'During this extended aging, the brandy undergoes a remarkable transformation. It extracts compounds from the oak – tannins, vanillin, and other flavor compounds that create our signature bourbon-like taste profile. The alcohol content gradually decreases as water evaporates through the porous wood (the "angel\'s share"), while the remaining spirit becomes richer, smoother, and more complex with each passing year.',

    // === COMMITMENT PAGE - TASTING NOTES ===
    'tasting-subtitle': 'Tasting Profile',
    'tasting-title': 'The Art of Savoring Skaska',
    'tasting-appearance': 'Appearance',
    'tasting-appearance-desc': 'Deep amber gold with honey highlights. The extended 5+ years of oak aging creates a rich, inviting color that hints at the complexity within.',
    'tasting-nose': 'Nose',
    'tasting-nose-desc': 'Opens with notes of dried plum and ripe stone fruit, followed by warm vanilla and toasted oak. Subtle hints of caramel and spice emerge as it breathes.',
    'tasting-palate': 'Palate',
    'tasting-palate-desc': 'Remarkably smooth with a bourbon-like character praised by international juries. Rich notes of vanilla, dried fruit, and gentle oak create a sophisticated flavor profile. The extended aging delivers exceptional roundness and depth.',
    'tasting-finish': 'Finish',
    'tasting-finish-desc': 'Long and warming with lingering notes of plum, vanilla, and subtle spice. A gentle oak presence stays with you, inviting the next sip.',
    'tasting-details': 'Product Details',
    'tasting-type': 'Type',
    'tasting-type-value': 'Plum Brandy (Šljivovica)',
    'tasting-alcohol': 'Alcohol',
    'tasting-aging': 'Aging',
    'tasting-aging-value': '5+ Years in Oak',
    'tasting-plum': 'Plum Variety',
    'tasting-origin': 'Origin',
    'tasting-origin-value': 'Bare, Šumadija, Serbia',
    'tasting-enjoy-title': 'How to Enjoy',
    'tasting-neat': 'Neat',
    'tasting-neat-desc': 'Best enjoyed at room temperature in a tulip glass to fully appreciate the complex aromas and flavors.',
    'tasting-food': 'With Food',
    'tasting-food-desc': 'Pairs beautifully with Serbian cuisine, aged cheeses, dark chocolate, and dried fruits.',
    'tasting-celebration': 'Celebration',
    'tasting-celebration-desc': 'Perfect for special occasions—weddings, holidays, and gatherings with family and friends.',

    // === AWARDS PAGE ===
    'awards-intro-title': 'Our Journey of Excellence',
    'awards-intro-desc': 'Since our founding in 2017, Skaska has earned recognition from prestigious international spirits competitions. Competing against thousands of spirits worldwide, our traditional Šumadija plum brandy has proven that Serbian craftsmanship stands among the world\'s finest.',
    'awards-2021-comp': 'London Spirits Competition',
    'awards-2021-medal': 'Silver Medal',
    'awards-2021-p1': 'Skaska Plum Brandy achieved an outstanding Silver Medal at the prestigious London Spirits Competition 2021, competing against 1,800 spirits from around the world. In a remarkable showing, Skaska missed the Gold Medal by just one point—a testament to the exceptional quality of our premium Serbian brandy.',
    'awards-2021-p2': 'This achievement placed Skaska among the Top 5 brandies in the competition, validating our commitment to traditional craftsmanship and premium quality.',
    'awards-2021-quote': '"An outstanding example of premium Serbian plum brandy. The sophisticated notes of dried fruit, vanilla, and oak demonstrate exceptional craftsmanship. Skaska represents the pinnacle of traditional Šumadija brandy-making excellence."',
    'awards-2023-comp': 'USA Spirits Ratings',
    'awards-2023-medal': 'Silver Medal',
    'awards-2023-desc': 'Our Skaska Plum Brandy was honored with a Silver Medal at USA Spirits Ratings 2023. The competition recognized the exceptional quality of our brandy, particularly noting the complex notes of dried fruit and wood that characterize our premium product.',
    'awards-2023-quote': '"Exceptional notes of dried fruit and wood create a sophisticated flavor profile. This premium Serbian brandy showcases the perfect marriage of traditional methods and exceptional quality."',
    'awards-cert-title': 'Certifications & Standards',
    'awards-cert-desc': 'Skaska meets and exceeds international quality standards. Our production process is certified and follows strict quality control measures to ensure every bottle delivers the exceptional taste and experience our customers expect.',

    // === ABOUT PAGE ===
    'about-story-subtitle': 'Our Story',
    'about-story-title': 'From Šumadija to the World',
    'about-story-p1': 'Skaska was born in 2017 from a deep love for Serbian tradition and the art of brandy making. Founded by Marko Popović, our distillery is located in the village of Bare, in the heart of Šumadija—Serbia\'s legendary plum-growing region.',
    'about-story-p2': 'The name "Skaska" (Скаска) comes from an old Serbian word meaning "a fairy tale passed down through generations." This perfectly captures our mission: to create a brandy that tells a story, that carries the wisdom of our ancestors, and that represents the very best of Serbian craftsmanship.',
    'about-story-p3': 'What started as a passion project has grown into an internationally recognized brand. In 2021, Skaska earned a Silver Medal at the London Spirits Competition, missing gold by just one point among 1,800 entries—placing us among the world\'s top 5 brandies.',
    'about-quote': '"When we started Skaska, we had one goal: to create a brandy that would make Serbia proud. Missing gold at the London Spirits Competition by just one point showed us we\'re on the right path. But we\'re not done yet."',
    'about-quote-author': '— Marko Popović, Founder & CEO',
    'about-stats-founded': 'Founded',
    'about-stats-aging': 'Years Aging',
    'about-stats-trees': 'Plum Trees',
    'about-stats-bottles': 'Bottles/Year',
    'about-founder-subtitle': 'The Founder',
    'about-founder-title': 'Marko Popović',
    'about-founder-role': 'Founder & CEO',
    'about-founder-p1': 'Born in Sarajevo and raised in Kragujevac since 1992, Marko Popović brings an unexpected background to the world of premium spirits. Before founding Skaska, Marko had a successful career as a professional basketball player, competing for clubs across Serbia and internationally in Greece, Poland, Georgia, Spain, Tunisia, and Iran.',
    'about-founder-p2': 'This athletic career taught him discipline, persistence, and the pursuit of excellence—qualities that now define Skaska\'s approach to brandy making. After retiring from basketball, Marko channeled his passion into creating something that would represent the best of Serbian tradition.',
    'about-founder-p3': 'Today, as CEO of Tribalija DOO (Skaska\'s parent company), Marko oversees every aspect of production, from the plum orchards to the final bottle. His hands-on approach and unwavering commitment to quality have made Skaska an internationally recognized brand.',
    'about-team-subtitle': 'Our Team',
    'about-team-title': 'The People Behind Skaska',
    'about-team-marko-role': 'Founder & CEO',
    'about-team-marko-desc': 'Former professional basketball player turned entrepreneur, leading Skaska\'s vision for premium Serbian brandy.',
    'about-team-zoran': 'Zoran Jevtović',
    'about-team-zoran-role': 'Master Distiller',
    'about-team-zoran-desc': 'Fourth-generation distiller carrying on the family tradition of crafting exceptional šljivovica.',
    'about-team-andrej': 'Andrej Bošković',
    'about-team-andrej-role': 'Co-Founder & Estate Owner',
    'about-team-andrej-desc': 'Owner of the Bare estate where our plum orchards and distillery are located.',
    'about-timeline-subtitle': 'Our Journey',
    'about-timeline-title': 'Milestones',
    'about-timeline-2017': 'Skaska founded in Bare, Šumadija. First plum trees planted.',
    'about-timeline-2020': 'First batch of Skaska released after 3+ years of aging.',
    'about-timeline-2021': 'Silver Medal at London Spirits Competition. Top 5 brandy worldwide.',
    'about-timeline-2023': 'Silver Medal at USA Spirits Ratings. International distribution begins.',
    'about-timeline-2024': 'Expanded production capacity. New retail partnerships established.',
    'about-company-subtitle': 'Company Info',
    'about-company-title': 'Tribalija DOO',
    'about-company-label': 'Company:',
    'about-company-address-label': 'Address:',
    'about-company-director-label': 'Director:',
    'about-company-founded-label': 'Founded:',
    'about-company-activity-label': 'Activity:'
  },
  sr: {
    // === AGE VERIFICATION ===
    'age-text': 'Morate biti punoletni da biste pristupili ovom sajtu.',
    'age-yes': 'da',
    'age-no': 'ne',
    'age-disclaimer': 'Pritiskom na "DA" i ulaskom na ovaj sajt, slažem se sa Uslovima korišćenja i Politikom privatnosti.',
    'age-denied-title': 'Pristup odbijen',
    'age-denied-text': 'Morate biti punoletni da biste pristupili ovom sajtu.',

    // === COMMON (all pages) ===
    'scroll': 'Skroluj',
    'nav-home': 'Skaska',
    'nav-group-brand': 'Brend',
    'nav-group-experience': 'Doživljaj',
    'nav-group-contact': 'Kontakt',
    'nav-why': 'Zašto',
    'nav-why-sub': 'Why',
    'nav-what': 'Šta i Kako',
    'nav-what-sub': 'What & How',
    'nav-where-link': 'Gde',
    'nav-where-sub': 'Where',
    'nav-commitment': 'Posvećenost',
    'nav-gallery': 'Galerija',
    'nav-distillery': 'Destilerija',
    'nav-about': 'Bajka o šljivi',
    'nav-news': 'Vesti',
    'nav-awards': 'Nagrade',
    'nav-where': 'Pronađi Skasku',
    'nav-contact': 'Kontakt',
    'copyright': '© 2026 Skaska destilerija doo. Sva prava zadržana.',
    
    // About page
    'about-hero-title': 'Bajka o šljivi',
    'about-craftsmanship': 'Umetnost zanata',
    'about-craftsmanship-p1': 'Jedan od osnivača brenda i četvrta generacija majstora destilacije, Zoran Jevtović je odgovoran za karakter Skaske. Njegovo iskustvo i filigranska senzorika vode pažljivo kontrolisanu dvostruku destilaciju i stvaranje prepoznatljivog, elegantnog profila rakije.',
    'about-idea': 'Nasleđe',
    'about-idea-p1': 'Jedan od osnivača, Andreja Bošković donosi duboku povezanost sa zemljom i razumevanje da vrhunska rakija počinje od vrhunskog ploda. Njegov pristup oslanja se na poštovanje prirode i strpljenje koje autentična srpska šljivovica zahteva.',
    'about-vision': 'Vizija',
    'about-vision-p1': 'Jedan od osnivača i pokretača brenda, Marko Popović postavio je jasan pravac razvoja Skaske – vrhunski kvalitet bez kompromisa. Njegova vizija spaja porodično nasleđe, savremene standarde i snažan identitet brenda.',
    'about-process': 'Proces',
    'about-process-p1': 'Skaska nastaje u selu Bare u Šumadiji, od pažljivo negovane sorte šljive Stanley, koja se uzgaja u našim voćnjacima na tri specifične mikro lokacije: Brdo, Aleksića i Kovionica, pod stručnim nadzorom Aleksandra Uroševića, diplomiranog agronoma. Nakon kasne septembarske berbe, plod se pažljivo pasira i prepušta sopstvenoj spontanoj fermentaciji u prohromskim tankovima, bez ičega dodatog i bez ičega oduzetog. Kada se proces prirodno privede kraju, kljuk ide na dvostruku destilaciju u zanatski izrađenim bakarnim kazanima. Destilat zatim sazreva najmanje pet godina u francuskim hrastovim barik buradima, gde razvija punoću, mekoću i složen aromatski profil. Spoj prirode, znanja i vremena daje Skaski njen prepoznatljiv karakter.',
    'btn-find': 'Pronađi Skasku',
    'btn-gallery': 'Pogledaj galeriju',
    'btn-learn': 'Saznaj više',
    'btn-discover': 'Saznaj više',
    'btn-visit': 'Poseti destileriju',

    // === INDEX PAGE ===
    'title': 'Skaska – Čarolija pitome Šumadije',
    'meta-desc': 'Skaska – usmena priča sa elementima fantazije koja se prenosila sa kolena na koleno. Premium srpska rakija iz Šumadije.',
    'hero-title': 'Čarolija pitome Šumadije',
    'main-text': 'Kada smo poželeli da duh i kolorit, neuporedivu lepotu Šumadije svedemo na jednu posebnost, izabrali smo: PITOMOST. I kao da su se ovi predeli potrudili i učinili sve da iznedre ljude koji su tu pitomost i upili.',
    'main-text-2': 'Skaska je priča o toj jedinstvenoj osobini pretočenoj u dobrodušnost i srdačnost. Skaska je bajka o šljivi, simbolu dobrodošlice i gostoprimstva.',
    'spotlight-eyebrow': 'Skaska',
    'spotlight-title': 'Bajka pretočena u čašu',
    'spotlight-text': 'Rođena u našim voćnjacima u Barama, dvostruko destilisana u bakarnim kazanima i strpljivo sazrevana — dok pitomost ne postane ukus. Jedno selo, jedan voćnjak, jedna priča.',
    'spotlight-cta-find': 'Pronađi Skasku',
    'spotlight-cta-story': 'Bajka o šljivi',
    'awards-strip-title': 'Nagrađivana širom sveta',
    'award-points': 'poena',
    'award-points-2': 'poena',
    'award-top5': 'finalista',
    'award-silver': 'Srebro',
    'award-medal': 'medalja',
    'footer-definition': 'Skaska (ref. Rečnik) – usmena pripovetka sa elementima fantastike koja se prenosi sa kolena na koleno',
    'mellow-title': 'Mekoća',
    'mellow-desc': 'Kada smo poželeli da obuhvatimo duh i boje, nenadmašnu lepotu Šumadije u jednoj posebnoj osobini, izabrali smo: MEKOĆU.',
    'treasure-title': 'Šumadijsko blago',
    'treasure-desc': 'Rakija rođena iz tradicije: poštenja i predanosti. Blago čarolija iz srca Srbije.',
    'cta-title': 'Doživite Skasku',
    'cta-desc': 'Posetite našu destileriju i otkrijte strast iza svake flaše. Ili pronađite Skasku u našim partnerskim prodavnicama i restoranima.',
    'btn-explore': 'Istraži proces',
    'btn-awards': 'Pogledaj nagrade',

    // === DISTILLERY PAGE ===
    'distillery-hero-title': 'Destilerija',
    'distillery-hero-desc': 'Stazama naših predaka',
    'distillery-intro-title': 'Skaska, rakija koja stvara bajku',
    'distillery-intro-text': 'Tradicija se, obično, doživljava kao nešto zastarelo, kao svedok prošlosti koju svako poima na svoj način. Jedni sa setom, drugi ravnodušno, ali, ipak, najviše – s ponosom! Jer, tradicija je, hteli mi to priznati ili ne – umetnost življenja! Koliko god je osporavali ili zaboravljali, ona opstaje; prenosi se iz generacije u generaciju, kao najveće blago ili porodična tajna. Tradicija je zavet srpskog domaćina. Najvažnije nasleđe za njegovog sina. Zavet da se bude najbolji, ali ne zbog drugih, već radi sebe. Zavet da brineš o svojoj kući i komšijama, jer srpski domaćin zna da je to najveće bogastvo! Bogatsvo je slaviti rad, ali i odmoriti i ugostiti. A srpski domaćin kad ugosti, on to tradicionalno uradi najbolje! Da bude na ponos! A ponos je za srpskog domaćina nezamisliv bez šljivovice. Jer šljivovica nije samo rakija – to je bajka o najboljim, najplavetnijim šljivicima, o radu, o žuljevitim domaćinskim rukama, o snovima i neispričanim pričama…',
    'process-main-title': 'Proces proizvodnje',
    'process-main-desc': 'Od ručno branih šljiva do savršenstva odležavanja, otkrijte korak-po-korak put stvaranja Skaske.',
    'process-step1': 'Korak 1',
    'process-step1-title': 'Berba šljiva',
    'process-step1-p1': 'Putovanje počinje krajem leta, kada šljive dostignu savršenu zrelost. Naš tim ručno bere samo najfinije šljive starih sorti – crvena ranka, požegača i druge tradicionalne srpske sorte. Biramo šljive koje su potpuno zrele, bez truljenja ili plesni, osiguravajući najviši sadržaj šećera i optimalan profil ukusa.',
    'process-step1-p2': 'Tajming je ključan: prerano i šljivama nedostaje slatkoće; prekasno i počinju da fermentiraju na stablu. Naši iskusni berači tačno znaju kada treba brati, koristeći generacijsko znanje prenošeno kroz porodice.',
    'process-step2': 'Korak 2',
    'process-step2-title': 'Prirodna fermentacija',
    'process-step2-p1': 'Odabrane šljive se pažljivo gnječe i stavljaju u posude za fermentaciju. Koristimo samo prirodne kvasce prisutne na kožici voća – bez komercijalnih kvasaca. Ova tradicionalna metoda omogućava sporiju, složeniju fermentaciju koja razvija bogatije ukuse.',
    'process-step2-p2': 'Fermentacija traje nekoliko nedelja, tokom kojih pažljivo pratimo temperaturu i napredak. Prirodni šećeri se pretvaraju u alkohol, stvarajući bazu za našu rakiju. Ovaj proces se ne može požurivati – strpljenje je esencijalno za kvalitet.',
    'process-step3': 'Korak 3',
    'process-step3-title': 'Destilacija u bakrenim kazanima',
    'process-step3-p1': 'Fermentisana kaša se destiluje u tradicionalnim bakrenim kazanima – metoda koja se koristi vekovima. Bakar igra ključnu ulogu: uklanja neželjene sumporne spojeve i pomaže u stvaranju glatkijeg, čistijeg destilata.',
    'process-step3-p2': 'Naš majstor destiler pažljivo prati proces, odvajajući "srce" destilata od "glave" i "repa". Sakuplja se samo najčistiji srednji deo – obično oko 60-70% alkohola po zapremini. Ovo zahteva iskustvo, veštinu i razumevanje kako se destilat razvija tokom destilacije.',
    'process-step4': 'Korak 4',
    'process-step4-title': 'Odležavanje u hrastovim buradima — 5+ godina',
    'process-step4-p1': 'Čist destilat se prenosi u hrastova burad, gde će odležavati minimum pet godina. Ovaj produženi period odležavanja je ono što razlikuje Skasku od običnih rakija. Naša burad su pažljivo odabrana – neka su nova, dajući snažne note vanile i začina, dok su druga starija, pružajući suptilnu složenost.',
    'process-step4-p2': 'Tokom ovog produženog odležavanja, rakija prolazi kroz izuzetnu transformaciju. Izvlači jedinjenja iz hrasta – tanine, vanilin i druga aromatična jedinjenja koja stvaraju naš prepoznatljiv profil ukusa nalik burbonu. Sadržaj alkohola postepeno opada dok voda isparava kroz porozno drvo ("anđeoski udeo"), dok preostali destilat postaje bogatiji, glatkiji i složeniji sa svakom godinom.',
    'process-step5': 'Korak 5',
    'process-step5-title': 'Flaširenje i etiketiranje',
    'process-step5-p1': 'Kada majstor destiler proceni da je rakija dostigla optimalnu zrelost, pažljivo se ručno flašira. Svaka flaša se puni, zatvara i etiketira sa pažnjom na detalje. Koristimo premium staklene flaše koje štite destilat od svetlosti i čuvaju njegov kvalitet.',
    'process-step5-p2': 'Naše etikete pričaju priču – godina, broj serije i briga uložena u svaku flašu. Svaka etiketa se stavlja ručno, osiguravajući savršenstvo prezentacije koja odgovara kvalitetu destilata unutra.',
    'process-step6': 'Korak 6',
    'process-step6-title': 'Kontrola kvaliteta',
    'process-step6-p1': 'Pre nego što bilo koja flaša napusti našu destileriju, prolazi rigoroznu kontrolu kvaliteta. Testiramo sadržaj alkohola, bistroću, aromu i ukus. Naši standardi kvaliteta su beskompromisni – puštaju se samo flaše koje ispunjavaju naše stroge kriterijume.',
    'process-step6-p2': 'Ovaj finalni korak osigurava da svaka flaša Skaske pruža izuzetno iskustvo koje naši kupci očekuju. To je naše obećanje kvaliteta, doslednosti i izvrsnosti u svakoj kapi.',

    // === DISTILLERY PAGE - PHILOSOPHY SECTIONS ===
    'folklore-text': 'Šljivovica je folklor srpske tradicije. S njom sve počinje i završava. S njom se rađamo, veselimo, gradimo, tugujemo, sahranjujemo… dočekujemo i ispraćamo. Ona nas identifikuje i karakteriše. Tako ista, ali potpuno drugačija. Kod svakog domaćina – specifična, svoja. Svaki domaćin se trudio da baš njegova šljivovica bude najbolja, jer je predstavljala i njega i njegovu kuću. Postala je deo generacijskog identiteta i prepoznavanja. Iskustvo i ljubav prema stvaranju rakije, postala je umetnost. A umetnost se ne stvara preko noći! Naša umetnost o stvaranju rakije, utemeljena je na tradiciji generacija koje su brižno i strpljivo pratile gde rađaju najbolje šljive. Generacije koje su nas naučile da se za rakiju potkupljaju najlepše, čiste i zrele šljive. Nema trulih i plesnjivih! Jer, pravi se zlato! Zlato koje će u buriće, da ćuti nekoliko godina. A onda… da ispriča najlepšu priču. Priču o srpskom domaćinu, o svemu onom što je ćutao dok je uz kazan snevao – o svadbi za sina prvenca, o unucima, o zavetu, o najsvetijem srpskom nasleđu – da dočekaš i ispratiš, da napojiš i nahraniš, da svakom dušu okrepiš – a sve je to za srpskog domaćina, nezamislivo bez šljivovice!',
    'distillery-secret-title': 'Destilerija',
    'ancestors-secret': 'U našoj šljivovici je tajna naših predaka, njihova nadanja i htenja, sve ono čemu su nas učili, ali i ono najvažnije – šljivovica to su oni, to smo mi! Naša Skaska slavi život, slavi tradiciju, čuva ono najbolje – vrednog srpskog domaćina koji sve stvara s ponosom i na ponos! Kada kažemo da proizvodimo rakiju na tradicionalan način – mi mislimo na ovaj smisao tradicije.',
    'skaska-tells': 'Zato će vam Skaska ispričati ono što druge rakije ne mogu…',
    'ognjen-quote': '"U Skaski je bol. Bol svakog onog nesrećnika, što je na dlanu držao šljivu okupanu kapima kiše Svetog Ilije. U Skaski je grč. Grč na licu koje gleda ka nebesima i moli se starim Bogovima i Novom Bogu, da u martu sačuva laticu, stidljivo propupjelu kao djevojčurak između dva godišnja seoska prela. U Skaski je odanost. Odanost prijatelja zavjetovana da dostignu nektar savršenosti. U Skaski je ljubav. Ljubav na prvu kap, iz orošene čaše. U zdravlje."',
    'ognjen-title': 'Pisac romana Vinograd Mehmed-bega i Šetač u stroju',
    'paths-title': 'Stazama predaka',
    'paths-text': '"Na obroncima planine Rudnik, šumadijsko selo. U smiraj dana vraćaju se seljani iz polja. Prijatno umoran od rada zastaje deda Đorđe opčinjen mirisom zrelog šljivika. Zraci zalazećeg sunca obasjavaju predeo. Seda ispod šljive da odmori opčinjen raskoši njegove prelepe zemlje. Godina je rodna, sve je dobro. Pred njim neprolazna lepota prirode. Trenutak u koji se celog života vraća kada poželi da se seti spokoja i sreće. Taj trenutak smo utkali u svaku kapljicu Skaske i on čeka da ga doživite."',

    // === ABOUT PAGE ===
    'about-hero-title': 'Bajka o šljivi',
    'about-hero-desc': 'Skaska je zajednička vizija ljudi koje povezuju poreklo, znanje i ljubav prema srpskoj šljivovici.',
    'about-story-subtitle': 'Naša priča',
    'about-story-title': 'Iz Šumadije u svet',
    'about-story-p1': 'Skaska je rođena iz strasti za očuvanjem srpske tradicije i posvećenosti izvrsnosti. Ono što je počelo kao san o stvaranju šljivovice svetske klase preraslo je u nagrađivanu zanatsku destileriju u srcu Šumadije.',
    'about-story-p2': 'Ime "Skaska" potiče od staroslovenske reči za "bajku" – usmenu priču sa elementima fantazije koja se prenosi sa kolena na koleno. Baš kao ove vanvremenske priče, naša rakija nosi duh, mudrost i tradiciju naših predaka.',
    'about-quote': '"Godinama smo proučavali literaturu i usmenu tradiciju da bismo ponovo otkrili autentičan recept za srpsku šljivovicu. Kada smo osvojili srebro na London Spirits Competition – propustivši zlato za samo jedan poen među 1.800 pića širom sveta – znali smo da smo ga pronašli."',
    'about-stat-founded': 'Osnovano',
    'about-stat-aging': 'Godina odležavanja',
    'about-stat-trees': 'Stabala šljiva',
    'about-stat-bottles': 'Flaša godišnje',
    'about-founder-label': 'Osnivač i CEO',
    'about-marko-p1': 'Pre nego što je otkrio svoju strast za pravljenjem rakije, Marko Popović je imao međunarodnu karijeru profesionalnog košarkaša. Rođen u Sarajevu i odrastao u Kragujevcu, igrao je za srpske klubove Vojvodina, Sloga i Ergonoma, pre nego što je svoje talente odneo u Grčku, Poljsku, Gruziju, Španiju, Tunis i Iran.',
    'about-marko-p2': 'Nakon povlačenja iz košarke, Marko je usmerio istu disciplinu, predanost i težnju ka izvrsnosti koja je definisala njegovu sportsku karijeru u izgradnju Skaske. Njegova vizija je bila jasna: stvoriti premium srpsku rakiju koja poštuje tradiciju dok postiže međunarodno priznanje.',
    'about-marko-p3': 'Danas, kao CEO Tribalije DOO, Marko nadgleda svaki aspekt proizvodnje – od voćnjaka šljiva u Barama do finalne flaše. Njegovo sportsko iskustvo ga je naučilo da veličina zahteva strpljenje, preciznost i nepokolebljivu posvećenost kvalitetu.',
    'about-team-title': 'Tim',
    'about-team-desc': 'Iza svake flaše Skaske stoji tim strastvenih pojedinaca koji dele zajednički cilj: stvoriti najbolju šljivovicu koju je Srbija ikada proizvela.',
    'about-role-ceo': 'Osnivač i CEO',
    'about-role-distiller': 'Majstor destiler',
    'about-role-cofounder': 'Suosnivač',
    'about-marko-short': 'Bivši profesionalni košarkaš koji je postao preduzetnik. Donosi međunarodno iskustvo i sportsku disciplinu u izgradnju brenda rakije svetske klase.',
    'about-zoran-desc': 'Majstor destiler u četvrtoj generaciji koji nosi decenijsko porodično znanje. Njegova stručnost u tradicionalnoj destilaciji u bakrenim kazanima osigurava da svaka serija ispunjava najviše standarde.',
    'about-andrej-desc': 'Vlasnik istorijskog imanja u Barama gde danas radi Skaska Destilerija. Njegove duboke korene u Šumadiji i veza sa zemljom donose autentičnost svakoj flaši.',
    'about-journey-title': 'Naš put',
    'about-journey-desc': 'Od prvog stabla šljive do međunarodnog priznanja – prekretnice koje su oblikovale Skasku.',
    'about-timeline-2017-title': 'Početak',
    'about-timeline-2017-desc': 'Počinje rekonstrukcija istorijskog imanja u Barama, Šumadija. Stare zgrade se transformišu u modernu destileriju uz očuvanje njihovog autentičnog karaktera.',
    'about-timeline-2018-title': 'Prva berba',
    'about-timeline-2018-desc': 'Naši voćnjaci šljiva na tri lokacije (2,5 hektara, 1.100 stabala) proizvode prvu značajnu berbu. Stanley šljive se ručno beru u trenutku pune zrelosti.',
    'about-timeline-2019-title': 'Prva destilacija',
    'about-timeline-2019-desc': 'Pod vođstvom Zorana Jevtovića, prve serije prolaze dvostruku destilaciju u našim bakrenim kazanima. Dragoceni destilat se prenosi u francuska hrastova burad.',
    'about-timeline-2021-title': 'Međunarodno priznanje',
    'about-timeline-2021-desc': 'Skaska osvaja srebrnu medalju na London Spirits Competition, takmičeći se sa 1.800 žestokih pića iz celog sveta – propustivši zlato za samo jedan poen.',
    'about-timeline-2024-title': 'Rastući legat',
    'about-timeline-2024-desc': 'Sa proizvodnim kapacitetom od 10.000 flaša godišnje i širenjem distribucije, Skaska nastavlja svoju misiju da podeli najbolje od srpske tradicije sa svetom.',
    'about-company-title': 'Podaci o kompaniji',
    'about-company-name': 'Kompanija:',
    'about-company-address': 'Kancelarija:',
    'about-company-distillery': 'Destilerija:',
    'about-company-phone': 'Telefon:',

    // === GALLERY PAGE ===
    'gallery-hero-title': 'Galerija',
    'gallery-intro-title': 'Nije toliko teško uhvatiti i sačuvati sve lepote prirode i tradicije, dok god si vođen vrednostima čestitosti i predanosti.',
    'gallery-sumadija-title': 'Šumadija',
    'gallery-sumadija-subtitle': 'Riznica čarolija',
    'gallery-mellowdy-title': 'Mellowdy of Bonhomie',
    'gallery-mellowdy-subtitle': 'Čarolije prirode i ljudi',
    'gallery-mellowdy-desc': 'Rakija od šljive, proizvedena uz poštovanje tradicije koja neguje kulturu dobrodošlice prema putniku namerniku kroz neskrivenu radost domaćina.',
    'gallery-hero-desc': 'Otkrijte lepotu našeg zanata i čarobnog Šumadijskog regiona.',

    // === AWARDS PAGE ===
    'awards-hero-title': 'Nagrade i Priznanja',
    'awards-hero-desc': 'Proslavljamo izvrsnost u premium proizvodnji rakije',

    // === NEWS PAGE ===
    'news-hero-title': 'Vesti',
    'news-hero-desc': 'Najnovije vesti i događaji iz Skaska Destilerije',
    'news-gast-expo-2026': 'Skaska na GAST EXPO 2026 u Ljubljani',
    'news-london-2025': 'Skaska dobija veliko priznanje u Londonu',
    'news-warsaw-expo': 'Skaska na sajmu u Varšavi',
    'news-jao-mile': 'Košarka i Rakija u podkastu Jao Mile',
    'news-london-video': 'Skaska u Londonu',
    'news-usa-silver': 'Skaska je osvojila srebrnu medalju',
    'news-usa-silver-desc': '"Rakija od šljive sa mirisnom notom suvih kajsija i meda, vodeći ka ukusima suvog voća i grozđica na završetku."',
    'news-rakijapod': 'Skaska u Rakijapod-u',
    'news-berlin-award': 'Skaska je osvojila još jednu nagradu',
    'news-sputnik': 'Priča o našoj Skaski na Sputnik Srbija portalu',
    'news-lsc-2021': 'Skaska u TOP5 u 2021',
    'news-lsc-2021-desc': '"Note tamne melase, nagorelog šećera i tropskog voća. Topli ukus čilija i karanfilića."',
    'read-more': 'Pročitaj više',
    'watch-video': 'Pogledaj video',
    'usa-spirits-ratings': 'USA Spirits Ratings',
    'london-spirits-competition': 'London Spirits Competition',

    // === WHERE TO BUY PAGE ===
    'where-to-buy-hero-title': 'Pronađi Skasku',
    'where-to-buy-hero-desc': 'Pronađite Skasku',
    'where-page-title': 'Pronađi Skasku - Skaska',
    'where-choose-title': 'Izaberite način kupovine',
    'where-choose-desc': 'Kupite Skasku online ili posetite naše partnerske prodavnice.',
    'where-buy-online': 'Kupi Online',
    'where-visit-store': 'Poseti Prodavnicu',
    'where-buy-title': 'Skaska vas čeka na pažljivo odabranim mestima. Kupite online ili posetite najbližu vinoteku.',
    'where-stores-title': 'Gde kupiti Skasku',
    'where-stores-desc': 'Posetite naše partnere i odaberite vašu Skasku lično.',
    'where-type': 'Tip:',
    'where-type-spirits': 'Premium prodavnica pića',
    'where-type-wine': 'Vinoteka',
    'where-address': 'Adresa:',
    'where-rakija-address': '2 lokacije',
    'where-box-address': '4 lokacije',
    'where-phone': 'Telefon:',
    'where-show-map': 'Prikaži na mapi',
    'where-partner-title': 'Postanite Partner',
    'where-partner-desc': 'Za distribuciju i saradnju, kontaktirajte nas direktno.',
    'where-partner-btn': 'Kontaktirajte Nas',

    // === CONTACT PAGE ===
    'contact-hero-title': 'Kontakt',
    'contact-hero-desc': 'Rado ćemo čuti od vas.',
    'contact-label-email': 'Email',
    'contact-label-phone': 'Telefon',
    'contact-label-company': 'Kompanija',
    'contact-label-office': 'Adresa kancelarije',
    'contact-label-distillery': 'Destilerija',
    'contact-label-follow': 'Pratite nas',
    'contact-view-map': 'Pogledaj na Google Maps',
    'contact-form-name': 'Vaše ime',
    'contact-form-email': 'Email adresa',
    'contact-form-subject': 'Naslov',
    'contact-form-message': 'Vaša poruka',
    'contact-form-send': 'Pošalji',
    'contact-form-sending': 'Šalje se...',
    'contact-form-success': 'Poruka je uspešno poslata! Odgovorićemo vam uskoro.',
    'contact-form-error': 'Greška pri slanju poruke. Molimo pokušajte ponovo ili nas kontaktirajte direktno na marko@skaskabrandy.com',
    'contact-company-name': 'Skaska',
    'contact-company-name-full': 'Skaska destilerija doo',
    'contact-office-street': 'Lasla Gala 17/36',
    'contact-office-city': '21000 Novi Sad',
    'contact-distillery-location': 'Bare, Šumadija, Srbija',

    // === COMMITMENT PAGE ===
    'commitment-hero-title': 'Posvećenost',
    'commitment-hero-desc': 'Prava tradicija nije u istorijskim činjenicama niti običajima već u pravim vrednostima koje se prenose.',
    'commitment-definition': 'Skaska (ref. Rečnik) – usmena pripovetka sa elementima fantastike koja se prenosi sa kolena na koleno',
    'commitment-main-title': 'Dragocenost istinske tradicije ne krije se u istorijskim činjenicama ili običajima, već u vrednostima koje se prenose sa kolena na koleno.',
    'commitment-where-title': 'Gde',
    'commitment-where-text': 'Rakija proizvedena u srcu Srbije, u Šumadiji, poznatoj po izvornoj šljivovici i pitomim predelima. Po ljudima, po gostoprimstvu i srdačnosti.',
    'commitment-what-title': 'Šta i Kako',
    'commitment-what-text': 'Rakija od šljive, proizvedena uz poštovanje tradicije koja neguje kulturu dobrodošlice prema putniku namerniku kroz neskrivenu radost domaćina da je u prilici ponuditi sve najbolje što ima.',
    'commitment-why-title': 'Zašto',
    'commitment-why-text': 'Ima toliko ponosa i dostojanstva u činu kojim naši ljudi slave nova prijateljstva, nazdravljajući rakijom prožetom predanjem o vrhunskim vrednostima, o čestitosti i predanosti. Sa ponosom slavimo ovo nasledje kroz proces proizvodnje srpske šljivovice Skaske.',
    'commitment-video-long-title': 'Duža verzija',
    'commitment-video-short-title': 'Kraća verzija',
    'page-title': 'Posvećenost - Skaska',
    'intro-title': 'Skaska – Bajka koju piješ',
    'intro-quote': '"U Skaski je bol. Bol svakog onog nesrećnika, što je na dlanu držao šljivu okupanu kapima kiše Svetog Ilije. U Skaski je grč. Grč na licu koje gleda ka nebesima i moli se starim Bogovima i Novom Bogu..."',
    'intro-author': '— Ognjen Avlijaš, Pisac',
    'origin-title': 'Poreklo – Šumadija, Rudnik, Stare sorte šljiva',
    'origin-p1': 'U srcu Srbije, zvanom Šumadija, gde su tradicija i nasleđe čuvani generacijama. Na obroncima planine Rudnik, gde je vazduh čist a zemlja bogata, rastu najfiniji voćnjaci šljiva. Ovde biramo samo najzrelije šljive starih sorti – crvena ranka, požegača i druge tradicionalne srpske sorte koje se gaje vekovima.',
    'origin-p2': 'Teroar Šumadije, sa svojom jedinstvenom klimom i sastavom tla, daje posebne karakteristike našim šljivama. Kombinacija nadmorske visine, temperaturnih varijacija i tradicionalnih metoda uzgoja stvara voće sa izuzetnim sadržajem šećera i složenim profilima ukusa – temelj izuzetne rakije.',
    'family-title': 'Porodica i tradicija',
    'family-p1': 'Skaska je više od rakije – to je porodično nasleđe. Naša priča počinje sa generacijama majstora destilera koji su prenosili ne samo tehnike, već vrednosti: poštenje, predanost i beskompromisnu posvećenost kvalitetu. Svaka flaša nosi mudrost predaka koji su razumeli da prava tradicija nije u istorijskim činjenicama, već u vrednostima koje čuvamo i prenosimo dalje.',
    'family-p2': 'Na starim fotografijama možete videti izborane ruke naših pradedova, bakrene kazane koji se koriste decenijama i hrastove buriće koji su odležali bezbroj serija. Ove slike pričaju priču o kontinuitetu, o zanatu usavršenom kroz vreme i o posvećenosti porodice stvaranju nečeg zaista izuzetnog.',
    'philosophy-p1': 'U eri masovne proizvodnje, mi biramo drugačiji put. Radimo u malim serijama, ručno, sa pedantnom pažnjom na svaki detalj. Zašto? Zato što se izvrsnost ne može požurivati, a kvalitet ne može biti kompromitovan.',
    'philosophy-p2': 'Verujemo da se prava premium rakija ne stvara u fabrikama, već u pažljivim rukama zanatlija koji razumeju da je svaki korak važan. Od biranja savršenih šljiva do praćenja fermentacije, od preciznog trenutka destilacije do strpljivog odležavanja u hrastovim buradima – svaka odluka se donosi sa brigom, iskustvom i poštovanjem tradicije.',
    'philosophy-p3': 'Pravimo manje, ali pravimo bolje. Ova filozofija znači da neće svi imati Skasku, ali oni koji je imaju doživećete nešto zaista posebno – rakiju koja priča priču, koja nosi emociju, koja predstavlja najbolje od srpskog zanatstva.',
    'process-p1': 'Naš proces proizvodnje je pažljivo koreografisan ples između tradicije i preciznosti. Počinje ručnim branjem najfinijih šljiva u vrhuncu zrelosti, nastavlja se kroz prirodnu fermentaciju, tradicionalnu destilaciju u bakrenim kazanima i kulminira strpljivim odležavanjem u hrastovim buradima.',
    'process-p2': 'Svaki korak je vođen generacijama znanja, ali i modernim razumevanjem hemije i kontrole kvaliteta. Poštujemo stare načine dok osiguravamo doslednost i izvrsnost u svakoj seriji.',
    'btn-process': 'Istraži ceo proces',
    'emotion-title': 'Skaska kao emocija – Šta predstavlja',
    'emotion-desc': 'Skaska nije samo piće – to je emocija, sećanje, veza sa nečim dubljim. Za one koji je piju, Skaska predstavlja:',
    'emotion-heritage': 'Nasleđe',
    'emotion-heritage-desc': 'Veza sa srpskom tradicijom i vrednostima naših predaka',
    'emotion-quality': 'Kvalitet',
    'emotion-quality-desc': 'Težnja ka izvrsnosti u svakom aspektu proizvodnje',
    'emotion-connection': 'Povezanost',
    'emotion-connection-desc': 'Način da se ljudi okupe, proslave, podele priče',
    'emotion-pride': 'Ponos',
    'emotion-pride-desc': 'Ponos na srpsko zanatstvo i sposobnost stvaranja nečeg svetske klase',

    // === INDEX PAGE - KEY FACTS ===
    'keyfacts-subtitle': 'Napravljeno sa ponosom',
    'keyfacts-title': 'Premium srpska rakija',
    'keyfacts-founded': 'Osnovano',
    'keyfacts-aging': 'Godina u hrastu',
    'keyfacts-trees': 'Stabala šljiva',
    'keyfacts-top5': 'Svetske rakije',
    'keyfacts-award-comp': 'London Spirits Competition 2021',
    'keyfacts-award-medal': 'Srebrna medalja',
    'keyfacts-award-desc': 'Takmičeći se sa 1.800 žestokih pića širom sveta, Skaska je propustila zlatnu medalju za samo jedan poen.',
    'keyfacts-btn': 'Pogledaj sve nagrade',
    'awards-desc-updated': 'Srebrna medalja na London Spirits Competition 2021, takmičeći se sa 1.800 žestokih pića. Propustili zlato za samo jedan poen—rangirani u Top 5 rakija.',

    // === DISTILLERY PAGE - OUR ESTATE ===
    'estate-title': 'Naše imanje u Barama',
    'estate-desc': 'U srcu Šumadije, srpskog centra za uzgoj šljiva, naše imanje u selu Bare proizvodi premium šljivovicu koristeći tradicionalne metode koje se prenose generacijama.',
    'estate-hectares': 'Hektara',
    'estate-orchards': 'Voćnjaka šljiva',
    'estate-trees': 'Stabala šljiva',
    'estate-variety': 'Sorta Stanley',
    'estate-years': 'Godina',
    'estate-aging': 'Odležavanje u hrastu',
    'estate-bottles': 'Flaša',
    'estate-production': 'Godišnja proizvodnja',
    'estate-plums-title': 'Premium Stanley šljive',
    'estate-plums-p1': 'Naše imanje uzgaja 1.100 stabala Stanley šljiva na 2,5 hektara pažljivo održavanih voćnjaka. Sorta Stanley, poznata po izuzetnoj slatkoći i dubokoj ljubičastoj boji, idealno je pogodna za proizvodnju premium rakije.',
    'estate-plums-p2': 'Jedinstvena mikroklima Šumadije, u kombinaciji sa bogatim tlom regiona, stvara savršene uslove za uzgoj šljiva sa visokim sadržajem šećera i složenim profilima ukusa. Svako stablo se ručno neguje tokom cele godine, osiguravajući optimalan kvalitet voća.',
    'distillery-aging-title': 'Odležavanje u hrastovim buradima — 5+ godina',
    'distillery-aging-p1': 'Čist destilat se prenosi u hrastova burad, gde će odležavati minimum pet godina. Ovaj produženi period odležavanja je ono što razlikuje Skasku od običnih rakija. Naša burad su pažljivo odabrana – neka su nova, dajući snažne note vanile i začina, dok su druga starija, pružajući suptilnu složenost.',
    'distillery-aging-p2': 'Tokom ovog produženog odležavanja, rakija prolazi kroz izuzetnu transformaciju. Izvlači jedinjenja iz hrasta – tanine, vanilin i druga aromatična jedinjenja koja stvaraju naš prepoznatljiv profil ukusa nalik burbonu. Sadržaj alkohola postepeno opada dok voda isparava kroz porozno drvo ("anđeoski udeo"), dok preostali destilat postaje bogatiji, glatkiji i složeniji sa svakom godinom.',

    // === COMMITMENT PAGE - TASTING NOTES ===
    'tasting-subtitle': 'Profil ukusa',
    'tasting-title': 'Umetnost uživanja u Skaski',
    'tasting-appearance': 'Izgled',
    'tasting-appearance-desc': 'Duboko ćilibarska zlatna sa mednim odsjajima. Produženo odležavanje od 5+ godina u hrastu stvara bogatu, primamljivu boju koja nagoveštava složenost unutra.',
    'tasting-nose': 'Miris',
    'tasting-nose-desc': 'Otvara se notama suve šljive i zrelog koštičavog voća, praćeno toplom vanilom i prepečenim hrastom. Suptilni nagoveštaji karamele i začina se pojavljuju dok diše.',
    'tasting-palate': 'Nepce',
    'tasting-palate-desc': 'Izuzetno glatka sa karakterom nalik burbonu koji su pohvalili međunarodni žiriji. Bogate note vanile, suvog voća i nežnog hrasta stvaraju sofisticiran profil ukusa. Produženo odležavanje pruža izuzetnu zaobljenost i dubinu.',
    'tasting-finish': 'Završnica',
    'tasting-finish-desc': 'Duga i topla sa zadržavajućim notama šljive, vanile i suptilnog začina. Nežno prisustvo hrasta ostaje sa vama, pozivajući na sledeći gutljaj.',
    'tasting-details': 'Detalji proizvoda',
    'tasting-type': 'Tip',
    'tasting-type-value': 'Šljivovica',
    'tasting-alcohol': 'Alkohol',
    'tasting-aging': 'Odležavanje',
    'tasting-aging-value': '5+ godina u hrastu',
    'tasting-plum': 'Sorta šljive',
    'tasting-origin': 'Poreklo',
    'tasting-origin-value': 'Bare, Šumadija, Srbija',
    'tasting-enjoy-title': 'Kako uživati',
    'tasting-neat': 'Čista',
    'tasting-neat-desc': 'Najbolje se uživa na sobnoj temperaturi u čaši u obliku lale kako bi se u potpunosti cenile složene arome i ukusi.',
    'tasting-food': 'Uz hranu',
    'tasting-food-desc': 'Savršeno se slaže sa srpskom kuhinjom, zrelim sirevima, tamnom čokoladom i suvim voćem.',
    'tasting-celebration': 'Proslava',
    'tasting-celebration-desc': 'Savršena za posebne prilike—svadbe, praznike i okupljanja sa porodicom i prijateljima.',

    // === AWARDS PAGE ===
    'awards-intro-title': 'Naš put ka izvrsnosti',
    'awards-intro-desc': 'Od našeg osnivanja 2017. godine, Skaska je dobila priznanja od prestižnih međunarodnih takmičenja. Takmičeći se sa hiljadama žestokih pića širom sveta, naša tradicionalna šumadijska šljivovica je dokazala da srpsko zanatstvo stoji među najboljima na svetu.',
    'awards-2021-comp': 'London Spirits Competition',
    'awards-2021-medal': 'Srebrna medalja',
    'awards-2021-p1': 'Skaska Šljivovica je osvojila izvanrednu srebrnu medalju na prestižnom London Spirits Competition 2021, takmičeći se sa 1.800 žestokih pića iz celog sveta. U izuzetnom nastupu, Skaska je propustila zlatnu medalju za samo jedan poen—svedočanstvo izuzetnog kvaliteta naše premium srpske rakije.',
    'awards-2021-p2': 'Ovo dostignuće je svrstalo Skasku među Top 5 rakija na takmičenju, potvrđujući našu posvećenost tradicionalnom zanatstvu i premium kvalitetu.',
    'awards-2021-quote': '"Izvanredan primer premium srpske šljivovice. Sofisticirane note suvog voća, vanile i hrasta demonstriraju izuzetno zanatstvo. Skaska predstavlja vrhunac tradicije pravljenja šljivovice u Šumadiji."',
    'awards-2023-comp': 'USA Spirits Ratings',
    'awards-2023-medal': 'Srebrna medalja',
    'awards-2023-desc': 'Naša Skaska Šljivovica je nagrađena srebrnom medaljom na USA Spirits Ratings 2023. Takmičenje je prepoznalo izuzetan kvalitet naše rakije, posebno ističući složene note suvog voća i drveta koje karakterišu naš premium proizvod.',
    'awards-2023-quote': '"Izuzetne note suvog voća i drveta stvaraju sofisticiran profil ukusa. Ova premium srpska rakija pokazuje savršen spoj tradicionalnih metoda i izuzetnog kvaliteta."',
    'awards-cert-title': 'Sertifikati i standardi',
    'awards-cert-desc': 'Skaska ispunjava i prevazilazi međunarodne standarde kvaliteta. Naš proces proizvodnje je sertifikovan i prati stroge mere kontrole kvaliteta kako bi se osiguralo da svaka flaša pruža izuzetan ukus i iskustvo koje naši kupci očekuju.',

    // === ABOUT PAGE ===
    'about-story-subtitle': 'Naša priča',
    'about-story-title': 'Iz Šumadije u svet',
    'about-story-p1': 'Skaska je rođena 2017. godine iz duboke ljubavi prema srpskoj tradiciji i umetnosti pravljenja rakije. Osnovana od strane Marka Popovića, naša destilerija se nalazi u selu Bare, u srcu Šumadije—legendarnog srpskog regiona za uzgoj šljiva.',
    'about-story-p2': 'Ime "Skaska" (Скаска) potiče od stare srpske reči koja znači "bajka koja se prenosi sa kolena na koleno." Ovo savršeno opisuje našu misiju: stvoriti rakiju koja priča priču, koja nosi mudrost naših predaka i koja predstavlja najbolje od srpskog zanatstva.',
    'about-story-p3': 'Ono što je počelo kao projekat iz strasti preraslo je u međunarodno priznati brend. 2021. godine, Skaska je osvojila srebrnu medalju na London Spirits Competition, propustivši zlato za samo jedan poen među 1.800 prijava—svrstali smo se među top 5 rakija na svetu.',
    'about-quote': '"Kada smo pokrenuli Skasku, imali smo jedan cilj: stvoriti rakiju koja će učiniti Srbiju ponosnom. Propuštanje zlata na London Spirits Competition za samo jedan poen pokazalo nam je da smo na pravom putu. Ali nismo gotovi."',
    'about-quote-author': '— Marko Popović, Osnivač i CEO',
    'about-stats-founded': 'Osnovano',
    'about-stats-aging': 'Godina odležavanja',
    'about-stats-trees': 'Stabala šljiva',
    'about-stats-bottles': 'Flaša/godišnje',
    'about-founder-subtitle': 'Osnivač',
    'about-founder-title': 'Marko Popović',
    'about-founder-role': 'Osnivač i CEO',
    'about-founder-p1': 'Rođen u Sarajevu i odrastao u Kragujevcu od 1992. godine, Marko Popović donosi neočekivanu pozadinu u svet premium žestokih pića. Pre osnivanja Skaske, Marko je imao uspešnu karijeru profesionalnog košarkaša, igrajući za klubove širom Srbije i međunarodno u Grčkoj, Poljskoj, Gruziji, Španiji, Tunisu i Iranu.',
    'about-founder-p2': 'Ova sportska karijera ga je naučila disciplini, upornosti i težnji ka izvrsnosti—kvalitetima koji sada definišu Skaskin pristup pravljenju rakije. Nakon povlačenja iz košarke, Marko je usmerio svoju strast u stvaranje nečega što bi predstavljalo najbolje od srpske tradicije.',
    'about-founder-p3': 'Danas, kao CEO Tribalije DOO (matične kompanije Skaske), Marko nadgleda svaki aspekt proizvodnje, od voćnjaka šljiva do finalne flaše. Njegov praktični pristup i nepokolebljiva posvećenost kvalitetu učinili su Skasku međunarodno priznatim brendom.',
    'about-team-subtitle': 'Naš tim',
    'about-team-title': 'Ljudi iza Skaske',
    'about-team-marko-role': 'Osnivač i CEO',
    'about-team-marko-desc': 'Bivši profesionalni košarkaš koji je postao preduzetnik, vodi Skaskinu viziju za premium srpsku rakiju.',
    'about-team-zoran': 'Zoran Jevtović',
    'about-team-zoran-role': 'Majstor destiler',
    'about-team-zoran-desc': 'Destiler u četvrtoj generaciji koji nastavlja porodičnu tradiciju pravljenja izuzetne šljivovice.',
    'about-team-andrej': 'Andrej Bošković',
    'about-team-andrej-role': 'Suosnivač i vlasnik imanja',
    'about-team-andrej-desc': 'Vlasnik imanja u Barama gde se nalaze naši voćnjaci šljiva i destilerija.',
    'about-timeline-subtitle': 'Naš put',
    'about-timeline-title': 'Prekretnice',
    'about-timeline-2017': 'Skaska osnovana u Barama, Šumadija. Prva stabla šljiva zasađena.',
    'about-timeline-2020': 'Prva serija Skaske puštena u prodaju nakon 3+ godine odležavanja.',
    'about-timeline-2021': 'Srebrna medalja na London Spirits Competition. Top 5 rakija u svetu.',
    'about-timeline-2023': 'Srebrna medalja na USA Spirits Ratings. Počinje međunarodna distribucija.',
    'about-timeline-2024': 'Prošireni proizvodni kapaciteti. Uspostavljenja nova maloprodajna partnerstva.',
    'about-company-subtitle': 'Podaci o kompaniji',
    'about-company-title': 'Tribalija DOO',
    'about-company-label': 'Kompanija:',
    'about-company-address-label': 'Adresa:',
    'about-company-director-label': 'Direktor:',
    'about-company-founded-label': 'Osnovano:',
    'about-company-activity-label': 'Delatnost:'
  }
};

let currentLang = localStorage.getItem('skaska-lang') || 'en';

function initLanguageSwitcher() {
  const langLinks = document.querySelectorAll('.lang-toggle a[data-lang]');

  if (!langLinks.length) return;

  // Postavi početni jezik
  setLanguage(currentLang, false);

  // Klik na jezik
  langLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = link.dataset.lang;
      if (newLang !== currentLang) {
        setLanguage(newLang, true);
      }
    });
  });
}

function setLanguage(lang, animate = true) {
  const elements = document.querySelectorAll('[data-i18n]');
  const langLinks = document.querySelectorAll('.lang-toggle a[data-lang]');
  const page = document.body.dataset.page || 'index';

  // Update active class na linkovima
  langLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.lang === lang);
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Helper: traži page-specific ključ, pa fallback na generički
  function getTranslation(key) {
    const pageKey = `${page}-${key}`;
    if (translations[lang][pageKey]) {
      return translations[lang][pageKey];
    }
    return translations[lang][key] || null;
  }

  if (animate) {
    // 1. Fade out - svi elementi odjednom
    elements.forEach(el => {
      el.classList.add('lang-changing');
    });

    // 2. Posle fade out (400ms), promeni tekst
    setTimeout(() => {
      elements.forEach(el => {
        const key = el.dataset.i18n;
        const translation = getTranslation(key);
        if (translation) {
          if (el.tagName === 'META') {
            el.content = translation;
          } else if (el.tagName === 'TITLE') {
            el.textContent = translation;
            document.title = translation;
          } else {
            el.textContent = translation;
          }
        }
        // Zameni href ako postoji data-href-{lang}
        const langHref = el.getAttribute('data-href-' + lang);
        if (langHref) el.href = langHref;
      });

      // 3. Fade in - ukloni klasu
      requestAnimationFrame(() => {
        elements.forEach(el => {
          el.classList.remove('lang-changing');
        });
      });
    }, 400);
  } else {
    // Bez animacije (početno učitavanje)
    elements.forEach(el => {
      const key = el.dataset.i18n;
      const translation = getTranslation(key);
      if (translation) {
        if (el.tagName === 'META') {
          el.content = translation;
        } else if (el.tagName === 'TITLE') {
          el.textContent = translation;
          document.title = translation;
        } else {
          el.textContent = translation;
        }
      }
      // Zameni href ako postoji data-href-{lang}
      const langHref = el.getAttribute('data-href-' + lang);
      if (langHref) el.href = langHref;
    });
  }

  currentLang = lang;
  localStorage.setItem('skaska-lang', lang);
}

// Inicijalizuj language switcher
document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

/* =============================================
   CUSTOM CURSOR
   ============================================= */
function initCustomCursor() {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  
  // Get base path from current script location
  const scripts = document.getElementsByTagName('script');
  let basePath = '';
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('main.js')) {
      basePath = scripts[i].src.replace('js/main.js', '');
      break;
    }
  }
  
  const logoPath = basePath + 'images/logo/s-logo-gold.png';
  cursor.innerHTML = '<img src="' + logoPath + '" alt="" onerror="this.style.display=\'none\'">';
  document.body.appendChild(cursor);
  
  // Klikabilni selektori – nad njima logo kursor malo veći (klasa pointer-zone)
  var clickableSelector = 'a, button, .btn, .menu-toggle, .lang-toggle a, .video-thumbnail, .gallery-item, .carousel-nav, .play-button, .age-modal-btn, .store-card a, [onclick], input[type="submit"], [role="button"]';

  // Update cursor position i pointer-zone (veći logo nad klikabilnim)
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    var overClickable = e.target && e.target.closest && e.target.closest(clickableSelector);
    cursor.classList.toggle('pointer-zone', !!overClickable);
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = '1';
  });
}

/* =============================================
   GOLDEN PARTICLES - Ambient luxury effect
   ============================================= */
function initGoldenParticles() {
  // Only on pages with hero video background
  if (!document.querySelector('.video-background-fixed')) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var maxParticles = window.innerWidth < 768 ? 25 : 50;
  var animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.fadeSpeed = Math.random() * 0.003 + 0.001;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
  };

  Particle.prototype.update = function() {
    this.y += this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.opacity -= this.fadeSpeed;

    if (this.opacity <= 0 || this.y < -20) {
      this.reset();
    }
  };

  Particle.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#BC8B0B';
    ctx.shadowColor = '#BC8B0B';
    ctx.shadowBlur = this.size * 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Create particles
  for (var i = 0; i < maxParticles; i++) {
    var p = new Particle();
    p.y = Math.random() * canvas.height; // Spread initially
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(animate);
  }

  // Only animate when page is visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  animate();
}

/* =============================================
   SCROLL TO TOP BUTTON with progress ring
   ============================================= */
function initScrollToTop() {
  // Create the button
  var btn = document.createElement('button');
  btn.className = 'scroll-to-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = [
    '<svg class="scroll-progress-ring" viewBox="0 0 52 52">',
    '  <circle cx="26" cy="26" r="24"></circle>',
    '</svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '  <path d="M18 15l-6-6-6 6"></path>',
    '</svg>'
  ].join('');
  document.body.appendChild(btn);

  var progressCircle = btn.querySelector('.scroll-progress-ring circle');
  var circumference = 2 * Math.PI * 24; // r=24
  progressCircle.style.strokeDasharray = circumference;

  // Show/hide and update progress
  function updateButton() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    // Show after 300px of scroll
    if (scrollTop > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }

    // Update progress ring
    var offset = circumference - (scrollPercent * circumference);
    progressCircle.style.strokeDashoffset = offset;
  }

  window.addEventListener('scroll', updateButton, { passive: true });

  // Scroll to top on click
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateButton();
}

/* =============================================
   PAGE TRANSITIONS - Elegant curtain effect
   ============================================= */
function initPageTransitions() {
  // Create transition overlay
  var overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';

  // Get base path for logo
  var scripts = document.getElementsByTagName('script');
  var basePath = '';
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('main.js')) {
      basePath = scripts[i].src.replace('js/main.js', '');
      break;
    }
  }

  overlay.innerHTML = [
    '<div class="transition-curtain"></div>',
    '<img src="' + basePath + 'images/logo/s-logo-gold.png" alt="" class="transition-logo">'
  ].join('');
  document.body.appendChild(overlay);

  // Entrance animation (page just loaded)
  overlay.classList.add('entering');
  setTimeout(function() {
    overlay.classList.remove('entering');
  }, 600);

  // Intercept internal link clicks
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, and special links
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || link.target === '_blank' || link.hasAttribute('download')) {
      return;
    }

    // Skip if same page
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (href === currentPage) return;

    e.preventDefault();

    // Trigger leaving animation
    overlay.classList.remove('entering');
    overlay.classList.add('leaving');

    setTimeout(function() {
      window.location.href = href;
    }, 500);
  });
}

/* =============================================
   CURSOR TRAIL - Golden sparkle trail
   ============================================= */
function initCursorTrail() {
  // Skip on mobile/touch devices
  if (window.innerWidth <= 768 || 'ontouchstart' in window) return;

  var trailDots = [];
  var trailLength = 12;
  var mouseX = 0, mouseY = 0;
  var lastX = 0, lastY = 0;
  var isMoving = false;
  var moveTimer;

  // Create trail dots
  for (var i = 0; i < trailLength; i++) {
    var dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    document.body.appendChild(dot);
    trailDots.push({
      el: dot,
      x: 0,
      y: 0,
      scale: 1 - (i / trailLength),
      opacity: 0.5 - (i / trailLength) * 0.4
    });
  }

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function() {
      isMoving = false;
    }, 100);
  });

  function animateTrail() {
    var prevX = mouseX;
    var prevY = mouseY;

    for (var i = 0; i < trailDots.length; i++) {
      var dot = trailDots[i];
      // Eased following
      var ease = 0.3 - (i * 0.015);
      dot.x += (prevX - dot.x) * ease;
      dot.y += (prevY - dot.y) * ease;

      dot.el.style.left = dot.x + 'px';
      dot.el.style.top = dot.y + 'px';

      if (isMoving) {
        dot.el.style.opacity = dot.opacity;
        dot.el.style.transform = 'translate(-50%, -50%) scale(' + dot.scale + ')';
      } else {
        dot.el.style.opacity = '0';
        dot.el.style.transform = 'translate(-50%, -50%) scale(0)';
      }

      prevX = dot.x;
      prevY = dot.y;
    }

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
}

/* =============================================
   CARD TILT - 3D parallax tilt on nav cards
   ============================================= */
function initCardTilt() {
  var cards = document.querySelectorAll('.nav-card');
  if (!cards.length) return;

  // Skip on mobile
  if (window.innerWidth <= 768 || 'ontouchstart' in window) return;

  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -8;
      var rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(function() {
        card.style.transition = 'transform 0.15s ease';
      }, 500);
    });

    card.addEventListener('mouseenter', function() {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}
