// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Phone validation (optional but if filled should be valid)
            if (phone && !/^[\d\s\+\-\(\)]+$/.test(phone)) {
                showNotification('Please enter a valid phone number.', 'error');
                return;
            }
            
            // Disable submit button to prevent double submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Here you would typically send the form data to a server
            // For now, we'll simulate an API call with setTimeout
            setTimeout(() => {
                console.log('Form submitted:', { name, email, phone, subject, message });
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you as soon as possible.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }, 1500);
        });
        
        // Add input validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Validation on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Remove error styling on focus
            input.addEventListener('focus', function() {
                this.style.borderColor = '#009FE3';
                this.style.boxShadow = '0 0 0 4px rgba(0, 159, 227, 0.1)';
            });
            
            // Remove error styling on input
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#e0e0e0';
                }
            });
        });
    }
});

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    // Reset styles
    field.style.boxShadow = 'none';
    
    // Required field validation
    if (isRequired && !value) {
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        if (!/^[\d\s\+\-\(\)]+$/.test(value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    // Valid field
    field.style.borderColor = '#27ae60';
    return true;
}

// Notification function
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 120px;
            right: 30px;
            background: #ffffff;
            padding: 20px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
            max-width: 400px;
        }
        
        .notification-success {
            border-left-color: #27ae60;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content i {
            font-size: 20px;
        }
        
        .notification-success i {
            color: #27ae60;
        }
        
        .notification-error i {
            color: #e74c3c;
        }
        
        .notification-content span {
            color: #2c3e50;
            font-size: 14px;
            line-height: 1.4;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 90px;
                right: 20px;
                left: 20px;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', '');
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Mobile menu initialization function
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navSocialContainer = document.querySelector('.nav-social-container');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    if (mobileMenuToggle && navSocialContainer) {
        mobileMenuToggle.addEventListener('click', function() {
            navSocialContainer.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    if (hamburgerMenu && navSocialContainer) {
        hamburgerMenu.addEventListener('click', function() {
            navSocialContainer.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }
    
    // Handle submenu clicks on mobile
    if (navMenu) {
        const submenuItems = navMenu.querySelectorAll('.has-submenu > a');
        
        submenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Only prevent default on mobile
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    
                    const parentLi = this.parentElement;
                    const isOpen = parentLi.classList.contains('submenu-open');
                    
                    // Close all other submenus at the same level
                    const siblings = Array.from(parentLi.parentElement.children);
                    siblings.forEach(sibling => {
                        if (sibling !== parentLi) {
                            sibling.classList.remove('submenu-open');
                        }
                    });
                    
                    // Toggle current submenu
                    parentLi.classList.toggle('submenu-open');
                }
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navSocialContainer && !e.target.closest('.navbar')) {
            navSocialContainer.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        }
    });
    
    // Close menu when clicking on a link (non-submenu)
    if (navMenu) {
        const navLinks = navMenu.querySelectorAll('a:not(.has-submenu > a)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    navSocialContainer.classList.remove('active');
                    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
                }
            });
        });
    }
}