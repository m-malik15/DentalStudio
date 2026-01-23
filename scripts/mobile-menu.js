// Mobile Menu Handler - Simple and Reliable
(function() {
    'use strict';
    
    function initializeMobileMenu() {
        console.log('=== Initializing Mobile Menu ===');
        
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navSocialContainer = document.querySelector('.nav-social-container');
        const navMenu = document.querySelector('.nav-menu');
        
        console.log('Mobile Toggle Button:', mobileMenuToggle);
        console.log('Hamburger Button:', hamburgerMenu);
        console.log('Nav Container:', navSocialContainer);
        console.log('Nav Menu:', navMenu);
        
        if (!navSocialContainer) {
            console.error('Nav container not found!');
            return;
        }
        
        // Function to toggle menu
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            console.log('Toggle menu clicked!');
            const isActive = navSocialContainer.classList.contains('active');
            console.log('Current state:', isActive ? 'open' : 'closed');
            
            navSocialContainer.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.toggle('active');
            }
            if (hamburgerMenu) {
                hamburgerMenu.classList.toggle('active');
            }
            
            console.log('New state:', navSocialContainer.classList.contains('active') ? 'open' : 'closed');
        }
        
        // Attach click handlers
        if (mobileMenuToggle) {
            console.log('Attaching mobile toggle handler');
            mobileMenuToggle.addEventListener('click', toggleMenu);
        }
        
        if (hamburgerMenu) {
            console.log('Attaching hamburger handler');
            hamburgerMenu.addEventListener('click', toggleMenu);
        }
        
        // Handle submenu clicks on mobile
        if (navMenu) {
            const submenuItems = navMenu.querySelectorAll('.has-submenu > a');
            console.log('Found submenu items:', submenuItems.length);
            
            submenuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    // Only prevent default on mobile
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const parentLi = this.parentElement;
                        
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
            if (navSocialContainer.classList.contains('active')) {
                if (!e.target.closest('.navbar') && !e.target.closest('.mobile-menu-toggle') && !e.target.closest('.hamburger-menu')) {
                    console.log('Closing menu - clicked outside');
                    navSocialContainer.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
                }
            }
        });
        
        // Close menu when clicking on a regular link (not submenu parent)
        if (navMenu) {
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Only close if not a submenu parent or if on mobile and clicking a final link
                    const isSubmenuParent = this.parentElement.classList.contains('has-submenu');
                    
                    if (window.innerWidth <= 1024 && !isSubmenuParent) {
                        console.log('Closing menu - link clicked');
                        navSocialContainer.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                        if (hamburgerMenu) hamburgerMenu.classList.remove('active');
                    }
                });
            });
        }
        
        console.log('=== Mobile Menu Initialized ===');
    }
    
    // Wait for components to load
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    function waitForHeader() {
        attempts++;
        const header = document.querySelector('.header');
        
        if (header) {
            console.log('Header found, initializing mobile menu');
            initializeMobileMenu();
        } else if (attempts < maxAttempts) {
            console.log('Waiting for header... attempt', attempts);
            setTimeout(waitForHeader, 100);
        } else {
            console.error('Header not found after maximum attempts');
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForHeader);
    } else {
        waitForHeader();
    }
    
    // Also listen for component loaded events
    document.addEventListener('componentLoaded', function(e) {
        if (e.detail && e.detail.targetSelector === '#header-placeholder') {
            console.log('Header component loaded event received');
            setTimeout(initializeMobileMenu, 100);
        }
    });
    
})();