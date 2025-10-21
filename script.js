// FAQ
document.addEventListener('DOMContentLoaded', function () {
    const faqButtons = document.querySelectorAll('.faq-button');
    faqButtons.forEach(button => {
      button.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const icon = this.querySelector('.faq-icon');
        content.classList.toggle('hidden');
        if (!content.classList.contains('hidden')) {
          icon.classList.replace('ri-add-line', 'ri-subtract-line');
        } else {
          icon.classList.replace('ri-subtract-line', 'ri-add-line');
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
  
  // Modal
  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('orderModal');
    const closeModalBtn = document.getElementById('closeModal');
  
    function openModal() {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  
    function closeModalFunc() {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  
    document.querySelectorAll('button').forEach(button => {
      if (
        button.textContent.includes('Получить консультацию') ||
        button.textContent.includes('Запросить детали')
      ) {
        button.addEventListener('click', openModal);
      }
    });
  
    closeModalBtn.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModalFunc();
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
  