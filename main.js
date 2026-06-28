/* ==========================================================================
   NAILEDIT.FRR - INTERACTIVE UNIVERSE FRONT-END LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  function initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  initIcons();

  // Sticky Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Drawer Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================
     UNIVERSE STATE ENGINE
     ========================================== */
  let activeUniverse = 'default';

  function setUniverse(universe) {
    activeUniverse = universe;
    
    // 1. Apply theme class to body
    document.body.className = '';
    if (universe !== 'default') {
      document.body.classList.add(`theme-${universe}`);
    } else {
      document.body.classList.add('welcome-active');
    }

    // 2. Update Header theme text
    const themeNameMap = {
      'default': 'Default Vibe',
      'indian': 'Traditional Indian',
      'kawaii': 'Kawaii / Cutesy',
      'anime': 'Anime Art',
      'custom': 'Custom Creator'
    };
    document.getElementById('current-theme-name').textContent = themeNameMap[universe] || 'Default';
    document.getElementById('gallery-active-universe-name').textContent = themeNameMap[universe] || 'Default';

    // 3. Switch Hero texts & images
    const textContainers = document.querySelectorAll('.theme-text-container');
    textContainers.forEach(container => container.classList.remove('active'));
    
    const targetText = document.getElementById(`hero-text-${universe}`);
    if (targetText) targetText.classList.add('active');

    const heroImages = document.querySelectorAll('.hero-img');
    heroImages.forEach(img => img.classList.remove('active'));
    
    const targetImg = document.getElementById(`hero-img-${universe}`);
    if (targetImg) targetImg.classList.add('active');

    // 4. Update Before/After Slider Image based on theme
    const afterSliderImg = document.getElementById('after-slider-img');
    if (afterSliderImg) {
      const nailImagesMap = {
        'default': 'assets/kawaii_nails.png',
        'indian': 'assets/indian_nails.png',
        'kawaii': 'assets/kawaii_nails.png',
        'anime': 'assets/anime_nails.png',
        'custom': 'assets/custom_nails.png'
      };
      afterSliderImg.src = nailImagesMap[universe] || 'assets/kawaii_nails.png';
    }

    // 5. Pre-select dropdown value in Booking Form
    const universeSelect = document.getElementById('booking-universe');
    if (universeSelect) {
      const selectValCheck = {
        'indian': 'Traditional Indian',
        'kawaii': 'Kawaii / Cutesy',
        'anime': 'Anime Universe',
        'custom': 'Custom Design'
      };
      if (selectValCheck[universe]) {
        universeSelect.value = selectValCheck[universe];
      }
    }

    // 6. Generate Ambient Background Particles
    generateThemeDecorations(universe);

    // 7. Filter Inspiration Gallery
    filterGallery(universe);

    // Re-trigger Icons
    initIcons();
  }

  // Welcome selection card click listeners
  const selectionCards = document.querySelectorAll('.universe-card');
  selectionCards.forEach(card => {
    card.addEventListener('click', () => {
      const universe = card.getAttribute('data-universe');
      document.body.classList.remove('welcome-active');
      setUniverse(universe);
      
      // Scroll smoothly down to hero content
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Re-open welcome portal switcher
  const universeSwitchBtn = document.getElementById('universe-switch-btn');
  const galleryResetBtn = document.getElementById('gallery-reset-theme-btn');

  function openUniverseSelector() {
    document.body.classList.add('welcome-active');
    // reset class and scroll up
    document.body.className = 'welcome-active';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (universeSwitchBtn) universeSwitchBtn.addEventListener('click', openUniverseSelector);
  if (galleryResetBtn) galleryResetBtn.addEventListener('click', openUniverseSelector);

  // Footer navigation links to switch universe
  const footerUniverseBtns = document.querySelectorAll('.nav-set-universe');
  footerUniverseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const universe = btn.getAttribute('data-universe');
      document.body.classList.remove('welcome-active');
      setUniverse(universe);
      document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ==========================================
     AMBIENT PARTICLES DECORATOR
     ========================================== */
  const particlesContainer = document.getElementById('theme-particles');
  let decorationInterval = null;

  function generateThemeDecorations(universe) {
    // Clear old elements and intervals
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
    }
    if (decorationInterval) {
      clearInterval(decorationInterval);
      decorationInterval = null;
    }

    if (!particlesContainer) return;

    if (universe === 'anime') {
      const sakuraColors = ['#ff2a85', '#d946ef', '#00f0ff', '#ab99ff', '#ffffff'];
      const sparkleIcons = ['✦', '☆', '★', '🌸', '✧'];

      const spawnAnimeDecor = () => {
        const decor = document.createElement('div');
        const isSparkle = Math.random() > 0.45;

        if (isSparkle) {
          decor.classList.add('anime-sparkle');
          decor.innerHTML = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
          const color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
          decor.style.color = color;
          decor.style.textShadow = `0 0 10px ${color}`;
          decor.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
        } else {
          decor.classList.add('sakura-petal');
          const color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
          decor.style.backgroundColor = color;
          decor.style.width = `${8 + Math.random() * 10}px`;
          decor.style.height = `${8 + Math.random() * 10}px`;
          decor.style.boxShadow = `0 0 6px ${color}66`;
        }

        decor.style.left = `${Math.random() * 100}vw`;

        const scale = 0.5 + Math.random() * 0.7;
        const duration = 6 + Math.random() * 6;
        decor.style.transform = `scale(${scale})`;
        decor.style.animationDuration = `${duration}s`;
        decor.style.animationDelay = `${Math.random() * 2}s`;

        particlesContainer.appendChild(decor);
        setTimeout(() => decor.remove(), (duration + 2) * 1000);
      };

      for (let i = 0; i < 25; i++) {
        setTimeout(spawnAnimeDecor, Math.random() * 3000);
      }
      decorationInterval = setInterval(spawnAnimeDecor, 600);
    } else if (universe === 'kawaii') {
      // Generate Floating Hearts
      const spawnHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('heart-float');
        heart.innerHTML = Math.random() > 0.5 ? '🎀' : '💖';
        heart.style.left = `${Math.random() * 100}vw`;
        
        const scale = 0.6 + Math.random() * 0.8;
        const duration = 4 + Math.random() * 4;
        heart.style.transform = `scale(${scale})`;
        heart.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
      };

      for (let i = 0; i < 10; i++) {
        setTimeout(spawnHeart, Math.random() * 3000);
      }
      decorationInterval = setInterval(spawnHeart, 1000);

    } else if (universe === 'indian') {
      // Generate Gold Dust particles
      const spawnGold = () => {
        const gold = document.createElement('div');
        gold.classList.add('gold-dust');
        gold.style.left = `${Math.random() * 100}vw`;
        
        const scale = 0.5 + Math.random() * 1.5;
        const duration = 3 + Math.random() * 4;
        gold.style.transform = `scale(${scale})`;
        gold.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(gold);
        setTimeout(() => gold.remove(), duration * 1000);
      };

      for (let i = 0; i < 20; i++) {
        setTimeout(spawnGold, Math.random() * 2000);
      }
      decorationInterval = setInterval(spawnGold, 500);
    }
  }

  /* ==========================================
     INTERACTIVE CUSTOM NAIL CREATOR
     ========================================== */
  const shapeBtns = document.querySelectorAll('.shape-btn');
  const lengthBtns = document.querySelectorAll('.length-btn');
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const nailShapePlate = document.getElementById('nail-shape-plate');
  const nailColorPlate = document.getElementById('nail-color-plate');
  
  const specShape = document.getElementById('spec-shape');
  const specLength = document.getElementById('spec-length');
  const specColorName = document.getElementById('spec-color-name');
  const specColorDot = document.getElementById('spec-color-dot');
  
  let selectedShape = 'almond';
  let selectedLength = 'medium';
  let selectedColor = '#FFD1DC';
  let selectedColorName = 'Baby Pink';

  // Shape clicks
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shapeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedShape = btn.getAttribute('data-shape');
      specShape.textContent = btn.textContent;
      
      // Update preview classes
      nailShapePlate.className = 'nail-plate';
      nailShapePlate.classList.add(`shape-${selectedShape}`);
    });
  });

  // Length clicks
  lengthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lengthBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedLength = btn.getAttribute('data-length');
      specLength.textContent = btn.textContent;
    });
  });

  // Swatch clicks
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedColor = btn.getAttribute('data-color');
      selectedColorName = btn.getAttribute('data-name');
      
      specColorName.textContent = selectedColorName;
      specColorDot.style.background = selectedColor;
      nailColorPlate.style.backgroundColor = selectedColor;
    });
  });

  // Custom File Uploader Thumbnail preview
  const fileInput = document.getElementById('custom-file-upload');
  const uploadPreviewBox = document.getElementById('upload-preview-box');

  if (fileInput && uploadPreviewBox) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadPreviewBox.innerHTML = `
            <div class="upload-preview-item">
              <img src="${event.target.result}" alt="Inspo Upload Preview">
              <span>${file.name} (Ready)</span>
            </div>
          `;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Apply custom builder design to Booking Form
  const applyCustomBtn = document.getElementById('apply-custom-to-form');
  if (applyCustomBtn) {
    applyCustomBtn.addEventListener('click', () => {
      // 1. Pre-select shape/length radio values in booking
      const lengthRadios = document.getElementsByName('nail-length');
      lengthRadios.forEach(radio => {
        if (radio.value.toLowerCase() === selectedLength.toLowerCase() || 
           (selectedLength === 'xl' && radio.value === 'XL') ||
           (selectedLength === 'short' && radio.value === 'Short') ||
           (selectedLength === 'medium' && radio.value === 'Medium') ||
           (selectedLength === 'long' && radio.value === 'Long')) {
          radio.checked = true;
        }
      });

      // 2. Compile notes text
      const notesArea = document.getElementById('booking-notes');
      const inspoText = document.getElementById('custom-inspo-text').value.trim();
      
      let bookingNotesStr = `Custom Custom Creator Set details:
- Shape: ${selectedShape.toUpperCase()}
- Length: ${selectedLength.toUpperCase()}
- Color palette: ${selectedColorName} (${selectedColor})
${inspoText ? `- Reference details: ${inspoText}` : ''}`;

      notesArea.value = bookingNotesStr;

      // 3. Pre-fill Dropdown
      document.getElementById('booking-universe').value = 'Custom Design';

      // Blast brief success banner
      alert("Design specifications applied to booking form! Scroll down to complete booking. 💖💅");
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================
     AI NAIL RECOMMENDATION ENGINE
     ========================================== */
  const outfitBtns = document.querySelectorAll('#rec-outfit .rec-btn');
  const moodBtns = document.querySelectorAll('#rec-mood .rec-btn');
  const runRecBtn = document.getElementById('run-ai-rec-btn');
  const recResultBox = document.getElementById('recommender-result-box');
  const applyRecBtn = document.getElementById('apply-rec-to-booking');

  let selectedOutfit = 'traditional';
  let selectedMood = 'chill';
  let recommendedSet = null;

  outfitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      outfitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOutfit = btn.getAttribute('data-value');
    });
  });

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMood = btn.getAttribute('data-value');
    });
  });

  if (runRecBtn) {
    runRecBtn.addEventListener('click', () => {
      // Spinner preview
      recResultBox.innerHTML = `
        <div class="rec-result-empty">
          <i data-lucide="loader-2" class="spinning-sparkle" style="animation: fall-swirl 1.5s linear infinite;"></i>
          <p>Analyzing aesthetic energy...</p>
        </div>
      `;
      initIcons();

      setTimeout(() => {
        // Recommendations Mapping
        let resultUniverse = 'Kawaii Universe';
        let resultTitle = 'Teddy Sweetheart Set';
        let resultDesc = 'A dreamy soft jelly design decorated with mini 3D teddy bears, perfect for sweet dates.';
        let resultLength = 'Medium';
        let resultShape = 'Almond';

        if (activeUniverse === 'indian') {
          resultUniverse = 'Traditional Indian';
          if (selectedOutfit === 'traditional' || selectedOutfit === 'glam') {
            if (selectedMood === 'romantic') {
              resultTitle = 'Bridal Luxury Set';
              resultDesc = 'Royal crimson bases layered with gold mandalas, dangling pearl chains, and gems.';
              resultLength = 'Long';
              resultShape = 'Coffin';
            } else if (selectedMood === 'energetic') {
              resultTitle = 'Royal Maharani Velvet Set';
              resultDesc = 'Majestic peacock motifs in gold, teal, and navy velvet chrome finishes.';
              resultLength = 'Long';
              resultShape = 'Almond';
            } else if (selectedMood === 'mysterious') {
              resultTitle = 'Festival Glow Emerald Set';
              resultDesc = 'Emerald green bases with mirror foil and shimmering gold leaf outlines.';
              resultLength = 'Medium';
              resultShape = 'Almond';
            } else { // chill
              resultTitle = 'Roka & Engagement Glazed Tips';
              resultDesc = 'Glazed champagne glitter tips and delicate white floral relief work.';
              resultLength = 'Medium';
              resultShape = 'Round';
            }
          } else { // cozy or cyber outfit
            if (selectedMood === 'energetic') {
              resultTitle = 'Punjabi Phulkari Folk Set';
              resultDesc = 'Multi-color folk pattern stitches and shiny rhinestone accents.';
              resultLength = 'Medium';
              resultShape = 'Square';
            } else {
              resultTitle = 'Mehndi Harmony Henna Set';
              resultDesc = 'Henna pattern details over nude bases, matching traditional hand ornaments.';
              resultLength = 'Short';
              resultShape = 'Round';
            }
          }
        } else if (selectedOutfit === 'traditional') {
          resultUniverse = 'Traditional Indian';
          resultTitle = 'Royal Maharani Gold Accent Set';
          resultDesc = 'Heavy bridal crimson overlay with mirror foil accents and hand-painted peacock feathers.';
          resultLength = 'Long';
          resultShape = 'Coffin';
        } else if (selectedOutfit === 'cyber') {
          resultUniverse = 'Anime Universe';
          resultTitle = 'Neon Cyberpunk Shonen Set';
          resultDesc = 'Electric neon pink and deep black gradients complete with custom anime sword symbols.';
          resultLength = 'XL';
          resultShape = 'Stiletto';
        } else if (selectedOutfit === 'glam') {
          resultUniverse = 'Custom Universe';
          resultTitle = 'Glazed Donut Chrome Swirls';
          resultDesc = 'Pinterest-inspired chrome dust swirls on minimalist nude gel overlays.';
          resultLength = 'Medium';
          resultShape = 'Almond';
        } else {
          // Cozy Outfit
          if (selectedMood === 'mysterious') {
            resultUniverse = 'Anime Universe';
            resultTitle = 'Studio Ghibli Soot Sprite Set';
            resultDesc = 'Whimsical watercolor skies and cute hand-painted forest sprites.';
            resultLength = 'Short';
            resultShape = 'Round';
          }
        }

        recommendedSet = {
          universe: resultUniverse,
          title: resultTitle,
          desc: resultDesc,
          length: resultLength,
          shape: resultShape
        };

        // Render result HTML
        recResultBox.innerHTML = `
          <div class="rec-result-content">
            <div class="rec-badge">${resultUniverse} Match</div>
            <h4>${resultTitle}</h4>
            <p>${resultDesc}</p>
            <div class="rec-result-spec">
              <span>Shape: <strong>${resultShape}</strong></span>
              <span>Length: <strong>${resultLength}</strong></span>
            </div>
            <button class="btn btn-primary" id="apply-rec-to-booking">Book This Recommended Set</button>
          </div>
        `;
        initIcons();

        // Bind booking listener to new button
        const newApplyBtn = document.getElementById('apply-rec-to-booking');
        newApplyBtn.addEventListener('click', applyRecommendationToForm);

      }, 1200);
    });
  }

  function applyRecommendationToForm() {
    if (!recommendedSet) return;
    
    // 1. Pre-select dropdown universe
    const universeDropdown = document.getElementById('booking-universe');
    if (recommendedSet.universe.includes('Indian')) {
      universeDropdown.value = 'Traditional Indian';
    } else if (recommendedSet.universe.includes('Kawaii')) {
      universeDropdown.value = 'Kawaii / Cutesy';
    } else if (recommendedSet.universe.includes('Anime')) {
      universeDropdown.value = 'Anime Universe';
    } else {
      universeDropdown.value = 'Custom Design';
    }

    // 2. Select length radio
    const lengthRadios = document.getElementsByName('nail-length');
    lengthRadios.forEach(radio => {
      if (radio.value.toLowerCase() === recommendedSet.length.toLowerCase()) {
        radio.checked = true;
      }
    });

    // 3. Populate special notes
    document.getElementById('booking-notes').value = `Recommended set match:
- Style: ${recommendedSet.title}
- Details: ${recommendedSet.desc}
- Recommended Shape: ${recommendedSet.shape}`;

    alert("AI Recommendation matched and copied to booking form! 💖✨");
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  }

  /* ==========================================
     BEFORE / AFTER DRAG COMPARISON SLIDER
     ========================================== */
  const sliderBar = document.getElementById('slider-bar');
  const sliderContainer = document.getElementById('before-after-slider');
  const afterImageOverlay = document.getElementById('after-image-overlay');

  if (sliderBar && sliderContainer && afterImageOverlay) {
    let isDragging = false;

    function moveSlider(clientX) {
      const rect = sliderContainer.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      
      // Clamp values
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      
      const percent = (offsetX / rect.width) * 100;
      sliderBar.style.left = `${percent}%`;
      afterImageOverlay.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    }

    // Mouse events
    sliderBar.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    
    sliderContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch events for mobile support
    sliderBar.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    
    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        moveSlider(e.touches[0].clientX);
      }
    });
  }

  /* ==========================================
     SMART GALLERY MASONRY (FILTER & LIGHTBOX)
     ========================================== */
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  function filterGallery(universe) {
    const galleryItems = document.querySelectorAll('.gallery-card-masonry');
    
    galleryItems.forEach(item => {
      const itemUniverse = item.getAttribute('data-universe');
      
      if (universe === 'default' || itemUniverse === universe) {
        item.style.display = 'inline-block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  // Lightbox view
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card-masonry');
      if (card && !e.target.closest('.btn-like-gallery')) {
        const imgSrc = card.querySelector('img').src;
        const imgTitle = card.querySelector('h4').textContent;
        
        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = imgTitle;
        lightbox.classList.add('active');
      }
    });
  }

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  /* ==========================================
     WISHLIST DRAWER & SYSTEM (LOCALSTORAGE)
     ========================================== */
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistOverlay = document.getElementById('wishlist-drawer-overlay');
  const wishlistToggleBtn = document.getElementById('wishlist-toggle-btn');
  const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
  const wishlistContainer = document.getElementById('wishlist-items-container');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const wishlistFooter = document.getElementById('wishlist-footer');
  const bookWishlistBtn = document.getElementById('book-wishlist-designs');

  let wishlist = JSON.parse(localStorage.getItem('nailedit_wishlist')) || [];
  updateWishlistUI();

  // Toggle drawer open
  if (wishlistToggleBtn && wishlistDrawer && wishlistOverlay) {
    wishlistToggleBtn.addEventListener('click', () => {
      wishlistDrawer.classList.add('active');
      wishlistOverlay.classList.add('active');
    });
  }

  // Close drawer
  const closeWishlist = () => {
    wishlistDrawer.classList.remove('active');
    wishlistOverlay.classList.remove('active');
  };
  if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlist);
  if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlist);

  // Gallery cards heart button listeners
  const likeButtons = document.querySelectorAll('.btn-like-gallery');
  likeButtons.forEach(btn => {
    const id = btn.getAttribute('data-id');
    
    // Set initial active state based on stored wishlist
    if (wishlist.some(item => item.id === id)) {
      btn.classList.add('liked');
      btn.innerHTML = '<i data-lucide="heart" fill="currentColor"></i>';
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop lightbox opening
      btn.classList.toggle('liked');

      const card = btn.closest('.gallery-card-masonry');
      const img = card.querySelector('img').src;
      const title = card.querySelector('h4').textContent;
      const universeName = card.querySelector('span').textContent;

      if (btn.classList.contains('liked')) {
        // Add item
        wishlist.push({ id, img, title, universe: universeName });
        btn.innerHTML = '<i data-lucide="heart" fill="currentColor"></i>';
      } else {
        // Remove item
        wishlist = wishlist.filter(item => item.id !== id);
        btn.innerHTML = '<i data-lucide="heart"></i>';
      }

      localStorage.setItem('nailedit_wishlist', JSON.stringify(wishlist));
      updateWishlistUI();
      initIcons();
    });
  });

  function updateWishlistUI() {
    // Update badge counter
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlist.length;
    }

    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `<p class="wishlist-empty">Your wishlist is empty. Tap the 💖 on gallery cards to save inspiration designs!</p>`;
      if (wishlistFooter) wishlistFooter.style.display = 'none';
    } else {
      let itemsHtml = '';
      wishlist.forEach(item => {
        itemsHtml += `
          <div class="wishlist-item">
            <img src="${item.img}" alt="${item.title}">
            <div class="wishlist-item-info">
              <h5>${item.title}</h5>
              <span>${item.universe}</span>
            </div>
            <button class="btn-remove-wishlist" data-id="${item.id}" title="Remove Item">&times;</button>
          </div>
        `;
      });
      wishlistContainer.innerHTML = itemsHtml;
      if (wishlistFooter) wishlistFooter.style.display = 'block';

      // Bind remove buttons inside drawer
      const removeButtons = wishlistContainer.querySelectorAll('.btn-remove-wishlist');
      removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          wishlist = wishlist.filter(item => item.id !== id);
          localStorage.setItem('nailedit_wishlist', JSON.stringify(wishlist));
          
          // Untoggle matching gallery button
          const matchingGallBtn = document.querySelector(`.btn-like-gallery[data-id="${id}"]`);
          if (matchingGallBtn) {
            matchingGallBtn.classList.remove('liked');
            matchingGallBtn.innerHTML = '<i data-lucide="heart"></i>';
          }

          updateWishlistUI();
          initIcons();
        });
      });
    }
  }

  // Copy wishlist contents to Booking Form requests
  if (bookWishlistBtn) {
    bookWishlistBtn.addEventListener('click', () => {
      if (wishlist.length === 0) return;

      const wishlistNames = wishlist.map(item => item.title).join(', ');
      const notesArea = document.getElementById('booking-notes');
      
      notesArea.value = `Applied from my saved Wishlist: [ ${wishlistNames} ]`;
      
      closeWishlist();
      alert("Wishlist sets applied to booking form! Scroll down to pick your date/time. 💖");
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- REDESIGNED ANIME COLLECTIONS LOGIC ---
  
  // 1. Anime Collections Card Click to Book
  const animeCollCards = document.querySelectorAll('.anime-coll-card');
  animeCollCards.forEach(card => {
    card.addEventListener('click', () => {
      const categoryName = card.getAttribute('data-category');
      const universeDropdown = document.getElementById('booking-universe');
      const notesArea = document.getElementById('booking-notes');

      if (universeDropdown) {
        universeDropdown.value = 'Anime Universe';
      }
      if (notesArea) {
        notesArea.value = `Booking Anime Collection set: [ ${categoryName} ]\n(Inspired by the Explore Anime Worlds section)`;
      }

      alert(`Selected "${categoryName}" set! Applied to booking form. 💖✨`);
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 2. AI Suggestion Button Click
  const aiSuggestBtn = document.getElementById('anime-ai-suggest-btn');
  if (aiSuggestBtn) {
    aiSuggestBtn.addEventListener('click', () => {
      const recommenderSection = document.getElementById('ai-recommender');
      if (recommenderSection) {
        recommenderSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add a temporary subtle glow to highlight it
        recommenderSection.classList.add('glow-highlight');
        setTimeout(() => {
          recommenderSection.classList.remove('glow-highlight');
        }, 2000);
      }
    });
  }

  /* ==========================================
     PERSONALITY QUIZ SYSTEM
     ========================================== */
  const quizModal = document.getElementById('quiz-modal');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const quizCloseBtn = document.getElementById('quiz-close-btn');
  const quizStartRealBtn = document.getElementById('quiz-start-real-btn');
  
  const stateIntro = document.getElementById('quiz-state-intro');
  const stateQuestion = document.getElementById('quiz-state-question');
  const stateResult = document.getElementById('quiz-state-result');
  
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizQNumText = document.getElementById('quiz-q-num');
  const quizQText = document.getElementById('quiz-q-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizResultDisplay = document.getElementById('quiz-result-display');
  const quizApplyThemeBtn = document.getElementById('quiz-apply-theme-btn');

  // Quiz Questions Data
  const quizQuestions = [
    {
      q: "What's your dream weekend plans?",
      options: [
        { text: "🌸 Family Celebration / Elegant Dinner", value: "indian" },
        { text: "🎀 Cute Café Date & Shopping", value: "kawaii" },
        { text: "🌙 Anime Marathon & Gaming", value: "anime" },
        { text: "✨ Creating DIY Art or Fashion Look", value: "custom" }
      ]
    },
    {
      q: "Choose your favorite color palette.",
      options: [
        { text: "❤️ Deep Crimson & Gold Foil", value: "indian" },
        { text: "🩷 Baby Pink & Cream Pastels", value: "kawaii" },
        { text: "💜 Neon Pinks & Magical Purples", value: "anime" },
        { text: "🌈 Minimalist Nude & Chrome Silver", value: "custom" }
      ]
    },
    {
      q: "Pick your dream aesthetic outfit.",
      options: [
        { text: "👰 Traditional Anarkali or Lehenga", value: "indian" },
        { text: "🎀 Oversized Hoodie & Bow Skirt", value: "kawaii" },
        { text: "🌙 Harajuku Streetwear or Cosplay", value: "anime" },
        { text: "✨ Sleek Minimalist Blazer & Pants", value: "custom" }
      ]
    },
    {
      q: "What would you save on Pinterest first?",
      options: [
        { text: "🌺 Bridal Henna & Jewelry Ideas", value: "indian" },
        { text: "🎀 Aesthetic Korean Room Decor", value: "kawaii" },
        { text: "🌙 Anime Art Print Boards", value: "anime" },
        { text: "✨ Geometric Architecture & Doodles", value: "custom" }
      ]
    },
    {
      q: "Your inner core personality is:",
      options: [
        { text: "👑 Elegant & Graceful", value: "indian" },
        { text: "🧸 Sweet & Adorable", value: "kawaii" },
        { text: "🌙 Creative & Expressive", value: "anime" },
        { text: "✨ Unique & One-of-a-Kind", value: "custom" }
      ]
    },
    {
      q: "What should your nail extensions say about you?",
      options: [
        { text: "🌸 Classy, rich and timeless", value: "indian" },
        { text: "🎀 Cute, sparkly and sweet", value: "kawaii" },
        { text: "🌙 Bold, magical and gamer-inspired", value: "anime" },
        { text: "✨ Minimalist, trendy and clean", value: "custom" }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  let scoreTracker = { indian: 0, kawaii: 0, anime: 0, custom: 0 };
  let quizResultWinner = 'kawaii';

  // Toggle quiz open
  if (startQuizBtn && quizModal) {
    startQuizBtn.addEventListener('click', () => {
      quizModal.classList.add('active');
      // Reset state
      stateIntro.style.display = 'block';
      stateQuestion.style.display = 'none';
      stateResult.style.display = 'none';
      currentQuestionIndex = 0;
      scoreTracker = { indian: 0, kawaii: 0, anime: 0, custom: 0 };
    });
  }

  // Close quiz
  if (quizCloseBtn) {
    quizCloseBtn.addEventListener('click', () => {
      quizModal.classList.remove('active');
    });
  }

  // Start Quiz
  if (quizStartRealBtn) {
    quizStartRealBtn.addEventListener('click', () => {
      stateIntro.style.display = 'none';
      stateQuestion.style.display = 'block';
      renderQuizQuestion();
    });
  }

  function renderQuizQuestion() {
    const qData = quizQuestions[currentQuestionIndex];
    
    // Progress
    const progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
    quizProgressFill.style.width = `${progressPercent}%`;
    
    quizQNumText.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    quizQText.textContent = qData.q;
    
    // Options
    quizOptionsContainer.innerHTML = '';
    qData.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('quiz-option-btn');
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        scoreTracker[opt.value]++;
        
        // Go to next or finish
        if (currentQuestionIndex < quizQuestions.length - 1) {
          currentQuestionIndex++;
          renderQuizQuestion();
        } else {
          showQuizResults();
        }
      });
      quizOptionsContainer.appendChild(btn);
    });
  }

  function showQuizResults() {
    quizProgressFill.style.width = '100%';
    stateQuestion.style.display = 'none';
    stateResult.style.display = 'block';

    // Find highest score
    let maxScore = -1;
    let winner = 'kawaii';
    
    for (let key in scoreTracker) {
      if (scoreTracker[key] > maxScore) {
        maxScore = scoreTracker[key];
        winner = key;
      }
    }
    
    quizResultWinner = winner;

    // Display winner
    const themeNameMap = {
      'indian': '🌸 Traditional Indian Universe 🌸',
      'kawaii': '🎀 Kawaii / Cutesy Universe 🎀',
      'anime': '🌙 Anime Art Universe 🌙',
      'custom': '✨ Custom Nail Universe ✨'
    };

    quizResultDisplay.textContent = themeNameMap[winner] || themeNameMap['kawaii'];
    initIcons();
  }

  // Apply winning quiz theme and close
  if (quizApplyThemeBtn) {
    quizApplyThemeBtn.addEventListener('click', () => {
      quizModal.classList.remove('active');
      document.body.classList.remove('welcome-active');
      setUniverse(quizResultWinner);
      
      // Blast Confetti on Quiz win!
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================
     REVIEWS TESTIMONIALS CAROUSEL
     ========================================== */
  const reviewSlider = document.getElementById('review-slider');
  const reviewSlides = document.querySelectorAll('.review-slide');
  const reviewDotsContainer = document.getElementById('review-dots');
  let currentReviewSlide = 0;

  if (reviewSlider && reviewSlides.length > 0) {
    reviewSlides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToReviewSlide(idx);
      });
      reviewDotsContainer.appendChild(dot);
    });

    const dots = reviewDotsContainer.querySelectorAll('.slider-dot');

    function goToReviewSlide(index) {
      reviewSlider.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
      currentReviewSlide = index;
    }

    // Auto rotate review slides
    setInterval(() => {
      let nextSlide = (currentReviewSlide + 1) % reviewSlides.length;
      goToReviewSlide(nextSlide);
    }, 6000);
  }

  /* ==========================================
     SPECIAL OFFERS & ADMIN DASHBOARD CONFIG
     ========================================== */
  const offersListContainer = document.getElementById('offers-list');

  // Render Offers dynamically
  function renderSpecialOffers() {
    if (!offersListContainer) return;

    // Default to true for all 4 offers
    const firstVisitActive = true;
    const birthdayActive = true;
    const friendActive = true;
    const diwaliActive = true;
    const diwaliExpired = false;

    let html = '';

    // 1. First Visit
    if (firstVisitActive) {
      html += `
        <div class="offer-card">
          <div class="offer-discount-tag">15% OFF</div>
          <span class="offer-emoji">✨</span>
          <h3>First Visit Discount</h3>
          <p>Get a flat 15% discount on your first Gel Extension set booked. Quote code: FIRSTGLAM.</p>
          <div class="offer-card-footer">
            <span class="offer-badge">Permanent Offer</span>
          </div>
        </div>
      `;
    }

    // 2. Birthday Special
    if (birthdayActive) {
      html += `
        <div class="offer-card">
          <div class="offer-discount-tag">FREE ART</div>
          <span class="offer-emoji">🎂</span>
          <h3>Birthday Special</h3>
          <p>Celebrate your birthday month with us! Get free custom 3D resin charms & glitter overlay.</p>
          <div class="offer-card-footer">
            <span class="offer-badge">Permanent Offer</span>
          </div>
        </div>
      `;
    }

    // 3. Bring a Friend
    if (friendActive) {
      html += `
        <div class="offer-card">
          <div class="offer-discount-tag">20% OFF</div>
          <span class="offer-emoji">👭</span>
          <h3>Bring a Friend Offer</h3>
          <p>Book side-by-side sets with your bestie and get 20% discount on both services.</p>
          <div class="offer-card-footer">
            <span class="offer-badge">Permanent Offer</span>
          </div>
        </div>
      `;
    }

    // 4. Festive Season Offer (formerly Diwali)
    if (diwaliActive && !diwaliExpired) {
      html += `
        <div class="offer-card seasonal-deal">
          <div class="offer-discount-tag">10% OFF</div>
          <span class="offer-emoji">🪔</span>
          <h3>Festive Season Offer</h3>
          <p>Celebrate the festive seasons with 10% discount on any premium extension set. Quote: FESTIVE10.</p>
          <div class="offer-card-footer">
            <span class="offer-badge">Seasonal Offer</span>
            <span class="offer-expiry">Expires: Festive Season</span>
          </div>
        </div>
      `;
    }

    offersListContainer.innerHTML = html;
  }

  // Run initial render
  renderSpecialOffers();

  /* ==========================================
     BOOKING SYSTEM WITH DOUBLE-BOOKING CHECK
     ========================================== */
  const bookingForm = document.getElementById('appointment-form');
  const bookingDateInput = document.getElementById('booking-date');
  const bookingTimeSelect = document.getElementById('booking-time');
  const slotAvailText = document.getElementById('slot-avail-text');
  
  const bookingOverlay = document.getElementById('booking-modal-overlay');
  const bookingCloseBtn = document.getElementById('modal-close-btn');
  const bookingSendWABtn = document.getElementById('modal-send-wa');

  // Prevent selecting dates in the past
  if (bookingDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Check availability when date or time changes
  function checkSlotAvailability() {
    const dateVal = bookingDateInput.value;
    const timeVal = bookingTimeSelect.value;
    
    if (!dateVal) {
      slotAvailText.textContent = 'Please choose a date first.';
      slotAvailText.className = 'slot-availability-indicator';
      return;
    }

    if (!timeVal) {
      slotAvailText.textContent = 'Choose a time slot to check availability.';
      slotAvailText.className = 'slot-availability-indicator';
      return;
    }

    // Check localStorage bookings
    const existingBookings = JSON.parse(localStorage.getItem('nailedit_bookings')) || [];
    const isTaken = existingBookings.some(booking => booking.date === dateVal && booking.time === timeVal);

    if (isTaken) {
      slotAvailText.textContent = 'Slot Already Taken! ❌ Please pick another time.';
      slotAvailText.className = 'slot-availability-indicator taken';
      document.getElementById('booking-submit-btn').disabled = true;
      document.getElementById('booking-submit-btn').style.opacity = '0.5';
    } else {
      slotAvailText.textContent = 'Slot Available! ✨';
      slotAvailText.className = 'slot-availability-indicator avail';
      document.getElementById('booking-submit-btn').disabled = false;
      document.getElementById('booking-submit-btn').style.opacity = '1';
    }
  }

  if (bookingDateInput) bookingDateInput.addEventListener('change', checkSlotAvailability);
  if (bookingTimeSelect) bookingTimeSelect.addEventListener('change', checkSlotAvailability);

  // Validate form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('booking-name').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const insta = document.getElementById('booking-insta').value.trim();
      const universe = document.getElementById('booking-universe').value;
      const date = bookingDateInput.value;
      const time = bookingTimeSelect.value;
      
      let length = 'Medium';
      const lengthRadios = document.getElementsByName('nail-length');
      lengthRadios.forEach(radio => {
        if (radio.checked) length = radio.value;
      });
      const notes = document.getElementById('booking-notes').value.trim();

      if (!name || !phone || !universe || !date || !time) {
        alert("Please fill out all required fields! 💖");
        return;
      }

      // Check double booking one more time
      const existingBookings = JSON.parse(localStorage.getItem('nailedit_bookings')) || [];
      const isTaken = existingBookings.some(booking => booking.date === date && booking.time === time);

      if (isTaken) {
        alert("Oh no! That slot is already booked. Please choose another date or time. 💖");
        return;
      }

      // Save Booking to prevent double-booking
      existingBookings.push({ date, time });
      localStorage.setItem('nailedit_bookings', JSON.stringify(existingBookings));

      // Display Confetti Celebration
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }

      // Render Receipt modal HTML
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = new Date(date).toLocaleDateString('en-US', options);

      const receiptDetails = document.getElementById('booking-receipt-details');
      receiptDetails.innerHTML = `
        <div class="modal-detail-row">
          <span>Client Bestie:</span>
          <strong>${name}</strong>
        </div>
        <div class="modal-detail-row">
          <span>Phone (WhatsApp):</span>
          <strong>${phone}</strong>
        </div>
        <div class="modal-detail-row">
          <span>Nail Universe:</span>
          <strong>${universe}</strong>
        </div>
        <div class="modal-detail-row">
          <span>Nail Length:</span>
          <strong>${length}</strong>
        </div>
        <div class="modal-detail-row">
          <span>Preferred Time:</span>
          <strong>${formattedDate} @ ${time}</strong>
        </div>
      `;

      // WhatsApp Message Formulation
      const waMessage = `Coucou NailEdit.frr Ludhiana! 💅 I'd love to book a nail appointment:

✨ *Name:* ${name}
📞 *Phone:* ${phone}
📸 *Instagram:* ${insta ? insta : 'None'}
🔮 *Nail Universe:* ${universe}
📏 *Nail Length:* ${length}
📅 *Preferred Slot:* ${formattedDate} at ${time}
💭 *Special Notes:* ${notes ? notes : 'None'}`;

      const encodedMsg = encodeURIComponent(waMessage);
      // Link to WhatsApp (919779047374 - Ludhiana Studio phone)
      bookingSendWABtn.href = `https://wa.me/919779047374?text=${encodedMsg}`;

      // Show overlay modal
      bookingOverlay.classList.add('active');
      
      // Reset checks
      checkSlotAvailability();
    });
  }

  // Close receipt modal
  if (bookingCloseBtn && bookingOverlay) {
    bookingCloseBtn.addEventListener('click', () => {
      bookingOverlay.classList.remove('active');
    });
  }

  /* ==========================================
     CINEMATIC ANIME HERO INTERACTIONS
     ========================================== */
  
  // 1. Booking button in Anime Hero section
  const animeHeroBookBtn = document.querySelector('.anime-book-btn-special');
  if (animeHeroBookBtn) {
    animeHeroBookBtn.addEventListener('click', () => {
      const universeDropdown = document.getElementById('booking-universe');
      const notesArea = document.getElementById('booking-notes');
      
      if (universeDropdown) {
        universeDropdown.value = 'Anime Universe';
      }
      if (notesArea) {
        notesArea.value = "Booking my custom Anime Vibe nail extension set!\n(Inspired by the cinematic Anime Hero Section)";
      }

      alert("Aesthetic applied to booking form! Scroll down to complete booking. 💖💅");
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 2. Parallax mousemove effect for Anime Hero Side Characters
  const animeHeroContainer = document.querySelector('.anime-hero-fullscreen');
  const leftCharSpecial = document.querySelector('.anime-hero-char-left-special');
  const rightCharSpecial = document.querySelector('.anime-hero-char-right-special');

  if (animeHeroContainer && leftCharSpecial && rightCharSpecial) {
    animeHeroContainer.addEventListener('mousemove', (e) => {
      // Only run if Anime theme is active
      if (!document.body.classList.contains('theme-anime')) return;

      const rect = animeHeroContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      // Parallax depths (left and right characters move in opposite directions slightly)
      const leftDepthX = 20;
      const leftDepthY = 15;
      const rightDepthX = -25;
      const rightDepthY = -20;

      const lx = (mouseX / rect.width) * leftDepthX;
      const ly = (mouseY / rect.height) * leftDepthY;
      const rx = (mouseX / rect.width) * rightDepthX;
      const ry = (mouseY / rect.height) * rightDepthY;

      leftCharSpecial.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      rightCharSpecial.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    });

    animeHeroContainer.addEventListener('mouseleave', () => {
      leftCharSpecial.style.transform = `translate3d(0, 0, 0)`;
      rightCharSpecial.style.transform = `translate3d(0, 0, 0)`;
    });
  }
});
