// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
  mobileMenuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Submenu Toggle for Mobile
const hasSubmenuItems = document.querySelectorAll('.has-submenu');
hasSubmenuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        e.preventDefault();
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
      }
    }
  });
});

// Swiper Card Slider Initialization
new Swiper('.card-wrapper', {  
  loop: true,  
  speed: 700,  
  spaceBetween: 30,  
  // Pagination
  pagination: {  
    el: '.swiper-pagination',  
    clickable: true,  
    dynamicBullets: true,  
  },  
  // Navigation arrows  
  navigation: {  
    nextEl: '.swiper-button-next',  
    prevEl: '.swiper-button-prev',  
  },  
  // Responsive breakpoints
  breakpoints: { 
    0: {  
      slidesPerView: 1  
    },  
    768: {  
      slidesPerView: 2  
    },  
    1024: {  
      slidesPerView: 3  
    },  
  }  
});

// Active Nav Link on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-menu li a');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Smooth Scroll (fallback for browsers that don't support CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Fade In Animation on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for fade-in animation
const fadeElements = document.querySelectorAll('.stat-item, .grid-item, .info-block, .welcome-text, .welcome-video');
fadeElements.forEach(el => observer.observe(el));

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.classList.remove('scroll-up');
    return;
  }
  
  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    // Scroll Down
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    // Scroll Up
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }
  
  lastScroll = currentScroll;
});

// Add shadow to header on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  }
});

// Book Appointment Button Click Handler
const bookButtons = document.querySelectorAll('.btn-primary');
bookButtons.forEach(button => {
  button.addEventListener('click', () => {
    alert('Booking functionality would be integrated here. This would typically connect to a booking system or open a contact form.');
  });
});

// Lazy Loading for Images (if using real images)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => imageObserver.observe(img));
}

// Add loading state to forms (if you add forms later)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitButton = this.querySelector('button[type="submit"]');
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Simulate form submission
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
        alert('Form submitted successfully!');
      }, 2000);
    }
  });
});

// Console welcome message (optional but nice touch)
console.log('%c Welcome to The Dental Studios ', 'background: #0099DD; color: white; font-size: 16px; padding: 10px;');
console.log('%c Website built with modern web technologies ', 'background: #88C449; color: white; font-size: 12px; padding: 5px;');