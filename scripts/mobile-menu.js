// Mobile Menu Handler - FINAL FIX (Checks for links before closing)
(function() {
    'use strict';
    
    function initializeMobileMenu() {
        // 1. SELECTORS
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navLinksContainer = document.querySelector('.nav-links');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navLinksContainer || !hamburgerMenu) {
            return;
        }
        
        // 2. TOGGLE FUNCTION
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            navLinksContainer.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            hamburgerMenu.classList.toggle('active');
        }
        
        // 3. CLOSE MENU FUNCTION
        function closeMenu() {
            navLinksContainer.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburgerMenu.classList.remove('active');
            
            // Close all submenus
            if (navMenu) {
                navMenu.querySelectorAll('.has-submenu').forEach(li => {
                    li.classList.remove('submenu-open');
                });
            }
        }
        
        // 4. HAMBURGER BUTTON CLICK
        hamburgerMenu.addEventListener('click', toggleMenu);
        
        // 5. SUBMENU LOGIC (Mobile Only)
        if (navMenu) {
            const submenuItems = navMenu.querySelectorAll('.has-submenu > a');
            
            submenuItems.forEach((item) => {
                item.addEventListener('click', function(e) {
                    if (window.innerWidth <= 1024) {
                        // Prevent default for submenu parents to toggle them
                        e.preventDefault();
                        
                        const parentLi = this.parentElement;
                        
                        // Close other open submenus at the same level
                        const parentUl = parentLi.parentElement;
                        parentUl.querySelectorAll(':scope > .has-submenu').forEach(li => {
                            if (li !== parentLi) li.classList.remove('submenu-open');
                        });
                        
                        // Toggle current submenu
                        parentLi.classList.toggle('submenu-open');
                    }
                });
            });

            // Handle ALL link clicks
            const allLinks = navMenu.querySelectorAll('a');
            
            allLinks.forEach((link) => {
                const isSubmenuParent = link.parentElement.classList.contains('has-submenu');
                
                // Only mark regular links with a data attribute
                if (!isSubmenuParent) {
                    link.setAttribute('data-regular-link', 'true');
                }
            });
        }
        
        // 6. CLICK HANDLER ON NAV CONTAINER
        navLinksContainer.addEventListener('click', (e) => {
            // Find if click was on a link or inside a link
            const clickedLink = e.target.closest('a');
            
            if (clickedLink) {
                const isSubmenuParent = clickedLink.parentElement.classList.contains('has-submenu');
                
                if (window.innerWidth <= 1024 && !isSubmenuParent) {
                    // Close the menu
                    closeMenu();
                }
            }
        });
        
        // 7. CLICK OUTSIDE TO CLOSE
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active')) {
                // Check if click is inside nav OR on hamburger
                const isInsideNav = navLinksContainer.contains(e.target);
                const isHamburger = e.target.closest('.hamburger-menu');
                
                // Only close if click is truly outside
                if (!isInsideNav && !isHamburger) {
                    closeMenu();
                }
            }
        });
        
        // 8. CLOSE MENU ON WINDOW RESIZE TO DESKTOP
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && navLinksContainer.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // STARTUP LOGIC: Listen for componentLoaded event from components.js
    document.addEventListener('componentLoaded', function(e) {
        if (e.detail && e.detail.targetSelector === '#header-placeholder') {
            setTimeout(initializeMobileMenu, 50);
        }
    });

    // BACKUP: If header is already in DOM (for static pages)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.querySelector('.header')) {
                initializeMobileMenu();
            }
        });
    } else {
        if (document.querySelector('.header')) {
            initializeMobileMenu();
        }
    }
})();