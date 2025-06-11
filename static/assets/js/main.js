/**
 * Green Future Society - Custom JavaScript
 * Replaces Bootstrap functionality for the Green Future Society website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.classList.add('hide-preloader');
        setTimeout(() => {
          preloader.remove();
        }, 500);
      });
    }

      document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (dropdownMenu.style.display === 'flex') {
        dropdownMenu.style.display = 'none';
      } else {
        dropdownMenu.style.display = 'flex';
        dropdownMenu.style.flexDirection = 'column';
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  });
  
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.navmenu');
    
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-nav-active');
        this.classList.toggle('bi-x');
        this.classList.toggle('bi-list');
      });
    }
  
    // Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.toggle-dropdown');
    
    mobileDropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        if (window.innerWidth < 1200) {
          e.preventDefault();
          this.closest('.dropdown').classList.toggle('mobile-dropdown-active');
        }
      });
    });
  
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
      if (navMenu && navMenu.classList.contains('mobile-nav-active') && 
          !e.target.closest('.navmenu') && 
          !e.target.closest('.mobile-nav-toggle')) {
        navMenu.classList.remove('mobile-nav-active');
        if (mobileNavToggle) {
          mobileNavToggle.classList.remove('bi-x');
          mobileNavToggle.classList.add('bi-list');
        }
      }
    });
  
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  
    // Scroll to top button
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollTop.classList.add('active');
        } else {
          scrollTop.classList.remove('active');
        }
      });
  
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  
    // Custom Alert/Message Dismissal
    const alertCloseButtons = document.querySelectorAll('.alert .btn-close');
    alertCloseButtons.forEach(button => {
      button.addEventListener('click', function() {
        const alert = this.closest('.alert');
        alert.style.opacity = '0';
        setTimeout(() => {
          alert.remove();
        }, 300);
      });
    });
  
    // Form Validation
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          
          // Add validation styles
          const invalidInputs = form.querySelectorAll(':invalid');
          invalidInputs.forEach(input => {
            input.classList.add('is-invalid');
            
            // Create feedback message
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = input.validationMessage || 'This field is required';
            
            // Only add if it doesn't exist already
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
              input.insertAdjacentElement('afterend', feedback);
            }
          });
        }
        
        form.classList.add('was-validated');
      }, false);
      
      // Clear validation on input
      form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
          if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
          }
        });
      });
    });
  
    // Animations on scroll with AOS-like functionality
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
        rect.bottom >= 0
      );
    }
    
    function handleScrollAnimations() {
      animatedElements.forEach(element => {
        if (isInViewport(element) && !element.classList.contains('aos-animate')) {
          element.classList.add('aos-animate');
        }
      });
    }
    
    if (animatedElements.length > 0) {
      // Add base styles for AOS elements
      const style = document.createElement('style');
      style.textContent = `
        [data-aos] {
          opacity: 0;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-aos].aos-animate {
          opacity: 1;
          transform: translateZ(0);
        }
        [data-aos="fade-in"] {
          opacity: 0;
        }
        [data-aos="fade-up"] {
          transform: translate3d(0, 20px, 0);
        }
        [data-aos="fade-down"] {
          transform: translate3d(0, -20px, 0);
        }
        [data-aos="fade-left"] {
          transform: translate3d(-20px, 0, 0);
        }
        [data-aos="fade-right"] {
          transform: translate3d(20px, 0, 0);
        }
        [data-aos="zoom-in"] {
          transform: scale3d(0.9, 0.9, 0.9);
        }
      `;
      document.head.appendChild(style);
      
      window.addEventListener('scroll', handleScrollAnimations);
      window.addEventListener('resize', handleScrollAnimations);
      window.addEventListener('orientationchange', handleScrollAnimations);
      document.addEventListener('DOMContentLoaded', handleScrollAnimations);
      setTimeout(handleScrollAnimations, 100);
    }

    document.addEventListener('DOMContentLoaded', function () {
      let currentStep = 1; // Starting at step 1
    
      // Function to update progress
      function updateProgress(step) {
        for (let i = 1; i <= 4; i++) {
          const stepEl = document.getElementById('step' + i);
          if (i < step) {
            stepEl.classList.add('completed');
          } else if (i === step) {
            stepEl.classList.add('active');
          } else {
            stepEl.classList.remove('active', 'completed');
          }
        }
      }
    
      // Initialize the tracker at step 1
      updateProgress(currentStep);
    
      // Example of how steps could change in the app (you can modify this logic to suit your app)
      setInterval(function () {
        if (currentStep < 4) {
          currentStep++;
          updateProgress(currentStep);
        }
      }, 3000); // Move to next step every 3 seconds (for demo purposes)
    });
    

  
    // Light gallery functionality
    const galleryElements = document.querySelectorAll('.glightbox');
    
    if (galleryElements.length > 0) {
      galleryElements.forEach(element => {
        element.addEventListener('click', function(e) {
          e.preventDefault();
          
          const href = this.getAttribute('href');
          const lightbox = document.createElement('div');
          lightbox.className = 'custom-lightbox-overlay';
          lightbox.style.position = 'fixed';
          lightbox.style.top = '0';
          lightbox.style.left = '0';
          lightbox.style.width = '100%';
          lightbox.style.height = '100%';
          lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          lightbox.style.display = 'flex';
          lightbox.style.alignItems = 'center';
          lightbox.style.justifyContent = 'center';
          lightbox.style.zIndex = '9999';
          lightbox.style.opacity = '0';
          lightbox.style.transition = 'opacity 0.3s ease';
          
          const img = document.createElement('img');
          img.src = href;
          img.style.maxWidth = '90%';
          img.style.maxHeight = '90%';
          img.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
          img.style.transform = 'scale(0.9)';
          img.style.transition = 'transform 0.3s ease';
          
          const closeBtn = document.createElement('button');
          closeBtn.innerText = '×';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '20px';
          closeBtn.style.right = '20px';
          closeBtn.style.border = 'none';
          closeBtn.style.background = 'transparent';
          closeBtn.style.color = 'white';
          closeBtn.style.fontSize = '30px';
          closeBtn.style.cursor = 'pointer';
          
          lightbox.appendChild(img);
          lightbox.appendChild(closeBtn);
          document.body.appendChild(lightbox);
          
          // Prevent body scrolling
          document.body.style.overflow = 'hidden';
          
          // Animation
          setTimeout(() => {
            lightbox.style.opacity = '1';
            img.style.transform = 'scale(1)';
          }, 50);
          
          const closeLightbox = () => {
            lightbox.style.opacity = '0';
            img.style.transform = 'scale(0.9)';
            setTimeout(() => {
              document.body.removeChild(lightbox);
              document.body.style.overflow = '';
            }, 300);
          };
          
          closeBtn.addEventListener('click', closeLightbox);
          lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
              closeLightbox();
            }
          });
          
          // Close on ESC key
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              closeLightbox();
            }
          });
        });
      });
    }
  });

  // Add some interactive elements
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
  
  // Add parallax effect to background
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
  
  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('[class*="animate-"]').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});

  // Counter animation
  document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200;
    
    function animateCounters() {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if(count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
      });
    }
    
    // Start animation when section is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.5});
    
    document.querySelectorAll('.counter-value').forEach(counter => {
      observer.observe(counter.closest('section'));
    });
  });

  //floating labels
   document.addEventListener('DOMContentLoaded', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      const randomLeft = Math.floor(Math.random() * 100); // percent
      const randomDelay = Math.random() * 10; // seconds
      particle.style.left = `${randomLeft}%`;
      particle.style.animationDelay = `${randomDelay}s`;
    });
  });


  
  
