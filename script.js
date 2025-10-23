// FAQ
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');
      
      question.addEventListener('click', function () {
        // Закрыть все другие FAQ
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('.faq-icon');
            otherAnswer.classList.add('hidden');
            otherIcon.classList.remove('minus');
          }
        });
        
        // Переключить текущий FAQ
        item.classList.toggle('active');
        answer.classList.toggle('hidden');
        
        if (item.classList.contains('active')) {
          icon.classList.add('minus');
        } else {
          icon.classList.remove('minus');
        }
      });
    });
  });
  
  // Dropdown
  document.addEventListener('DOMContentLoaded', function () {
    const modelSelects = document.querySelectorAll('.model-select');
    modelSelects.forEach(select => {
      const dropdown = select.nextElementSibling;
      const selected = select.querySelector('.selected-model');
      select.addEventListener('click', () => dropdown.classList.toggle('hidden'));
      dropdown.querySelectorAll('.model-option').forEach(option => {
        option.addEventListener('click', () => {
          selected.textContent = option.textContent;
          selected.classList.remove('text-gray-400');
          selected.classList.add('text-accent');
          dropdown.classList.add('hidden');
        });
      });
      document.addEventListener('click', e => {
        if (!select.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });
    });
  });
  
  // Radio buttons
  document.addEventListener('DOMContentLoaded', function () {
    const timelineRadios = document.querySelectorAll('.timeline-radio');
    timelineRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        document.querySelectorAll('.radio-dot').forEach(dot => dot.classList.add('hidden'));
        document.querySelectorAll('.radio-custom').forEach(custom => {
          custom.classList.remove('border-primary');
          custom.classList.add('border-gray-600');
        });
        if (this.checked) {
          const dot = this.parentElement.querySelector('.radio-dot');
          const custom = this.parentElement.querySelector('.radio-custom');
          dot.classList.remove('hidden');
          custom.classList.replace('border-gray-600', 'border-primary');
        }
      });
    });
  });
  
  // Global modal functions
  function openModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }
  
  // Make functions globally available
  window.openModal = openModal;
  window.closeModal = closeModal;

  // Modal
  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('orderModal');
    const closeModalBtn = document.getElementById('closeModal');
  
    // Open modal buttons
    document.querySelectorAll('button').forEach(button => {
      if (
        button.textContent.includes('Получить консультацию') ||
        button.textContent.includes('Запросить детали') ||
        button.textContent.includes('Получить расчет')
      ) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          openModal();
        });
      }
    });
  
    // Close modal button - multiple approaches for reliability
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }
    
    // Event delegation for close button
    document.addEventListener('click', function(e) {
      if (e.target && (e.target.id === 'closeModal' || e.target.closest('#closeModal'))) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    });
    
    // Close modal on background click
    if (modal) {
      modal.addEventListener('click', function(e) {
        // Only close if clicking on the modal background, not on the modal content
        if (e.target === modal) {
          e.stopPropagation();
          closeModal();
        }
      });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  });
  
  // Burger menu
  document.addEventListener('DOMContentLoaded', function () {
    const burgerToggle = document.getElementById('burgerToggle');
    const mobileNav = document.getElementById('mobileNav');
  
    burgerToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      burgerToggle.classList.toggle('open');
    });
  
    document.addEventListener('click', function (e) {
      if (!burgerToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        burgerToggle.classList.remove('open');
      }
    });
  });
  
// Scroll animation
document.addEventListener('DOMContentLoaded', function () {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );
  elements.forEach(element => observer.observe(element));
});

// Catalog Slider
document.addEventListener('DOMContentLoaded', function () {
  const sliderContainer = document.querySelector('.catalog-slider-container');
  const prevBtn = document.getElementById('catalogPrevBtn');
  const nextBtn = document.getElementById('catalogNextBtn');
  const cards = document.querySelectorAll('.catalog-card');
  const indicators = document.querySelectorAll('.catalog-indicator');
  
  if (sliderContainer && prevBtn && nextBtn && cards.length > 0) {
    // Add smooth scrolling
    sliderContainer.style.scrollBehavior = 'smooth';
    
    // Calculate scroll amount based on card width + gap
    function getScrollAmount() {
      const card = cards[0];
      const cardWidth = card.offsetWidth;
      const gap = 32; // 2rem = 32px
      return cardWidth + gap;
    }
    
    // Update active indicator based on scroll position
    function updateIndicators() {
      const scrollAmount = getScrollAmount();
      const currentIndex = Math.round(sliderContainer.scrollLeft / scrollAmount);
      
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
    
    // Next button click
    nextBtn.addEventListener('click', () => {
      const scrollAmount = getScrollAmount();
      sliderContainer.scrollLeft += scrollAmount;
    });
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
      const scrollAmount = getScrollAmount();
      sliderContainer.scrollLeft -= scrollAmount;
    });
    
    // Indicator click navigation
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        sliderContainer.scrollLeft = scrollAmount * index;
      });
    });
    
    // Update button visibility based on scroll position
    function updateButtons() {
      const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
      
      // Hide/show prev button
      if (sliderContainer.scrollLeft <= 0) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.pointerEvents = 'none';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
      }
      
      // Hide/show next button
      if (sliderContainer.scrollLeft >= maxScroll - 5) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.pointerEvents = 'none';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
      }
    }
    
    // Listen to scroll events
    sliderContainer.addEventListener('scroll', () => {
      updateButtons();
      updateIndicators();
    });
    
    // Initial state
    updateButtons();
    updateIndicators();
    
    // Update on window resize
    window.addEventListener('resize', () => {
      updateButtons();
      updateIndicators();
    });
    
    // Drag-to-scroll functionality for desktop
    let isDown = false;
    let startX;
    let scrollLeft;

    sliderContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      sliderContainer.style.cursor = 'grabbing';
      startX = e.pageX - sliderContainer.offsetLeft;
      scrollLeft = sliderContainer.scrollLeft;
    });

    sliderContainer.addEventListener('mouseleave', () => {
      isDown = false;
      sliderContainer.style.cursor = 'grab';
    });

    sliderContainer.addEventListener('mouseup', () => {
      isDown = false;
      sliderContainer.style.cursor = 'grab';
    });

    sliderContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderContainer.offsetLeft;
      const walk = (x - startX) * 2;
      sliderContainer.scrollLeft = scrollLeft - walk;
    });
    
    // Set initial cursor
    sliderContainer.style.cursor = 'grab';
    
    // Touch events for mobile swipe
    let startTouchX = 0;
    let startScrollLeft = 0;
    let isScrolling = false;

    sliderContainer.addEventListener('touchstart', (e) => {
      startTouchX = e.touches[0].pageX;
      startScrollLeft = sliderContainer.scrollLeft;
      isScrolling = true;
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isScrolling) return;
      e.preventDefault();
      const touchX = e.touches[0].pageX;
      const walk = (startTouchX - touchX) * 2;
      sliderContainer.scrollLeft = startScrollLeft + walk;
    }, { passive: false });

    sliderContainer.addEventListener('touchend', () => {
      isScrolling = false;
    }, { passive: true });
  }
});

// Fixed Image for Why Choose Us Section
document.addEventListener('DOMContentLoaded', function() {
  const parallaxImage = document.querySelector('.parallax-image');
  
  if (parallaxImage) {
    console.log('Fixed image found, initializing...');
    
    // Handle image load success
    parallaxImage.addEventListener('load', function() {
      console.log('Image loaded successfully!');
      this.style.background = 'none';
    });
    
    // Handle image load error
    parallaxImage.addEventListener('error', function() {
      console.log('Image failed to load, using fallback');
      this.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.color = '#000';
      this.style.fontSize = '1.5rem';
      this.style.fontWeight = 'bold';
    });
    
    // Force image reload if needed
    setTimeout(() => {
      if (!parallaxImage.complete || parallaxImage.naturalHeight === 0) {
        console.log('Image not loaded, forcing reload...');
        const src = parallaxImage.src;
        parallaxImage.src = '';
        setTimeout(() => {
          parallaxImage.src = src;
        }, 100);
      }
    }, 1000);
  } else {
    console.log('Fixed image not found!');
  }
});
  