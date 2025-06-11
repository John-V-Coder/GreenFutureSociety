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
  
    // Custom Popover Implementation
    class Popover {
      constructor(element, options) {
        this.element = element;
        this.options = {
          placement: options.placement || 'top',
          trigger: options.trigger || 'click',
          content: options.content || '',
          html: options.html || false,
          sanitize: options.sanitize !== false,
          title: options.title || ''
        };
        this.popoverElement = null;
        this.setupEventListeners();
      }
  
      setupEventListeners() {
        if (this.options.trigger === 'click') {
          this.element.addEventListener('click', () => this.toggle());
        } else if (this.options.trigger === 'hover') {
          this.element.addEventListener('mouseenter', () => this.show());
          this.element.addEventListener('mouseleave', () => this.hide());
        }
  
        // Close when clicking outside
        document.addEventListener('click', (e) => {
          if (this.popoverElement && 
              !this.element.contains(e.target) && 
              !this.popoverElement.contains(e.target)) {
            this.hide();
          }
        });
      }
  
      createPopoverElement() {
        const popover = document.createElement('div');
        popover.className = 'custom-popover';
        popover.style.position = 'absolute';
        popover.style.zIndex = '1070';
        popover.style.maxWidth = '276px';
        popover.style.fontFamily = 'var(--font-secondary)';
        popover.style.fontSize = '0.875rem';
        popover.style.borderRadius = 'var(--border-radius-md)';
        popover.style.boxShadow = 'var(--shadow-md)';
        popover.style.backgroundColor = 'var(--color-white)';
        popover.style.border = '1px solid var(--color-gray-300)';
        
        let content = '';
        if (this.options.title) {
          content += `<div class="popover-header" style="padding: 0.5rem 1rem; margin: 0; border-bottom: 1px solid var(--color-gray-200); background-color: var(--color-gray-100); border-top-left-radius: calc(var(--border-radius-md) - 1px); border-top-right-radius: calc(var(--border-radius-md) - 1px);">${this.options.title}</div>`;
        }
        
        const contentToRender = this.options.html ? this.options.content : this.escapeHtml(this.options.content);
        content += `<div class="popover-body" style="padding: 1rem;">${contentToRender}</div>`;
        
        popover.innerHTML = content;
        return popover;
      }
  
      escapeHtml(html) {
        if (!this.options.sanitize) return html;
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
      }
  
      calculatePosition() {
        const rect = this.element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        const top = rect.top + scrollTop;
        const left = rect.left + scrollLeft;
        
        const position = {
          top: 0,
          left: 0
        };
        
        switch (this.options.placement) {
          case 'top':
            position.top = top - this.popoverElement.offsetHeight - 10;
            position.left = left + (rect.width / 2) - (this.popoverElement.offsetWidth / 2);
            break;
          case 'bottom':
            position.top = top + rect.height + 10;
            position.left = left + (rect.width / 2) - (this.popoverElement.offsetWidth / 2);
            break;
          case 'left':
            position.top = top + (rect.height / 2) - (this.popoverElement.offsetHeight / 2);
            position.left = left - this.popoverElement.offsetWidth - 10;
            break;
          case 'right':
            position.top = top + (rect.height / 2) - (this.popoverElement.offsetHeight / 2);
            position.left = left + rect.width + 10;
            break;
        }
  
        // Adjust if popover goes off screen
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (position.left < 0) position.left = 10;
        if (position.left + this.popoverElement.offsetWidth > viewportWidth) {
          position.left = viewportWidth - this.popoverElement.offsetWidth - 10;
        }
        
        if (position.top < 0) position.top = 10;
        if (position.top + this.popoverElement.offsetHeight > viewportHeight + scrollTop) {
          position.top = top - this.popoverElement.offsetHeight - 10;
        }
  
        return position;
      }
  
      show() {
        if (this.popoverElement) return;
  
        this.popoverElement = this.createPopoverElement();
        document.body.appendChild(this.popoverElement);
  
        const position = this.calculatePosition();
        this.popoverElement.style.top = position.top + 'px';
        this.popoverElement.style.left = position.left + 'px';
        
        // Animation
        this.popoverElement.style.opacity = '0';
        this.popoverElement.style.transform = 'translateY(10px)';
        this.popoverElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          this.popoverElement.style.opacity = '1';
          this.popoverElement.style.transform = 'translateY(0)';
        }, 50);
      }
  
      hide() {
        if (!this.popoverElement) return;
        
        this.popoverElement.style.opacity = '0';
        this.popoverElement.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          if (this.popoverElement && this.popoverElement.parentNode) {
            this.popoverElement.parentNode.removeChild(this.popoverElement);
          }
          this.popoverElement = null;
        }, 300);
      }
  
      toggle() {
        if (this.popoverElement) {
          this.hide();
        } else {
          this.show();
        }
      }
  
      setContent(content) {
        this.options.content = content;
        if (this.popoverElement) {
          const popoverBody = this.popoverElement.querySelector('.popover-body');
          if (popoverBody) {
            if (this.options.html) {
              popoverBody.innerHTML = content;
            } else {
              popoverBody.textContent = content;
            }
          }
        }
      }
    }
  
    // Initialize popovers with data-bs-toggle="popover"
    const popoverTriggers = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popovers = {};
    
    popoverTriggers.forEach(element => {
      const options = {
        placement: element.getAttribute('data-bs-placement'),
        trigger: element.getAttribute('data-bs-trigger') || 'click',
        content: element.getAttribute('data-bs-content') || '',
        html: element.getAttribute('data-bs-html') === 'true',
        sanitize: element.getAttribute('data-bs-sanitize') !== 'false',
        title: element.getAttribute('data-bs-title') || ''
      };
      
      popovers[element.id] = new Popover(element, options);
    });
  
    // Global popover access
    window.Popover = {
      getInstance: function(id) {
        return popovers[id];
      }
    };
  
    // Shopping Cart Functionality
    if (document.getElementById('popcart')) {
      initializeCart();
    }
  
    function initializeCart() {
      // Get username if logged in
      const username = document.querySelector('[data-username]')?.getAttribute('data-username') || "guest";
      const cartKey = "cart_" + username;
      let cart = JSON.parse(localStorage.getItem(cartKey)) || {};
  
      const popcartEl = document.getElementById('popcart');
      if (popcartEl) {
        new Popover(popcartEl, {
          html: true,
          sanitize: false,
          content: generatePopoverContent(cart),
          placement: 'bottom',
          trigger: 'click'
        });
      }
  
      function updateCart() {
        let sum = 0;
        for (let item in cart) {
          sum += cart[item][0];
          const div = document.getElementById('divpr' + item);
          if (div) {
            div.innerHTML = `
              <div class="btn-group w-100">
                <button id="${item}" class="btn btn-sm btn-danger minus">-</button>
                <span class="btn btn-sm disabled">${cart[item][0]}</span>
                <button id="plus${item}" class="btn btn-sm btn-success plus">+</button>
              </div>`;
          }
        }
        const count = document.getElementById('cartcount');
        if (count) count.textContent = sum;
        localStorage.setItem(cartKey, JSON.stringify(cart));
  
        if (popcartEl && Popover.getInstance('popcart')) {
          Popover.getInstance('popcart').setContent(generatePopoverContent(cart));
        }
      }
  
      document.addEventListener('click', function (e) {
        if (e.target.classList.contains('cart')) {
          const id = e.target.id.slice(2);
          const name = document.getElementById('namepr' + id)?.textContent || "Unknown Tree";
          const price = parseFloat(document.getElementById('pricepr' + id)?.textContent || 0);
          const image = document.getElementById('img' + id)?.src || "";
  
          cart[id] = cart[id] ? [cart[id][0] + 1, name, price, image] : [1, name, price, image];
          updateCart();
        }
  
        if (e.target.classList.contains('minus')) {
          const id = e.target.id;
          if (cart[id][0] <= 1) {
            delete cart[id];
            document.getElementById('divpr' + id).innerHTML = `<button id="pr${id}" class="btn btn-success w-100 cart">Plant This</button>`;
          } else {
            cart[id][0] -= 1;
          }
          updateCart();
        }
  
        if (e.target.classList.contains('plus')) {
          const id = e.target.id.replace('plus', '');
          cart[id][0] += 1;
          updateCart();
        }
      });
  
      function generatePopoverContent(cart) {
        if (Object.keys(cart).length === 0) {
          return `<div class="p-2">Your cart is empty</div>`;
        }
  
        let html = `<div class="p-2"><h6 class="fw-bold">Your Cart</h6><ul class="list-unstyled mb-2">`;
        let total = 0;
  
        for (const [id, [qty, name, price]] of Object.entries(cart)) {
          html += `<li>${name} × ${qty} — KES ${(price * qty).toFixed(2)}</li>`;
          total += price * qty;
        }
  
        html += `</ul>
          <hr>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Total: KES ${total.toFixed(2)}</strong>
          </div>
          <div class="d-grid gap-2">
            <a href="/checkout" class="btn btn-success btn-sm">Checkout</a>
            <button onclick="window.clearCart()" class="btn btn-danger btn-sm">Clear Cart</button>
          </div>
        </div>`;
  
        return html;
      }
  
      window.clearCart = function () {
        cart = {};
        localStorage.removeItem(cartKey);
        updateCart();
        document.querySelectorAll('.divpr').forEach(div => {
          const id = div.id.replace('divpr', '');
          div.innerHTML = `<button id="pr${id}" class="btn btn-success w-100 cart">Plant This</button>`;
        });
        if (popcartEl && Popover.getInstance('popcart')) {
          Popover.getInstance('popcart').hide();
        }
      };
  
      updateCart();
    }
  
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


  
  
