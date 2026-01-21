// Component loader utility
class ComponentLoader {
    static async loadComponent(componentPath, targetSelector) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath} (${response.status})`);
            }
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) {
                throw new Error(`Target element not found: ${targetSelector}`);
            }
            targetElement.innerHTML = html;
            const event = new CustomEvent('componentLoaded', { 
                detail: { componentPath, targetSelector } 
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    static async loadComponents(components) {
        const promises = components.map(component => 
            this.loadComponent(component.path, component.target)
        );
        await Promise.all(promises);
    }
}

// Load header and footer when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await ComponentLoader.loadComponents([
        { path: './Header/header.html', target: '#header-placeholder' },
        { path: './Footer/footer.html', target: '#footer-placeholder' }
    ]);
    initializeMenus();
});

function initializeMenus() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (navMenu && !e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        }
    });
    
    // Navigation links - only prevent default for same-page anchors
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Only handle pure anchor links on same page (# without .html)
        if (href && href.startsWith('#') && !href.includes('.html')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        // Close mobile menu after any nav click
        if (link.closest('.nav-menu')) {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        }
    });
}