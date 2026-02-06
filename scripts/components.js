// components.js - Simplified version
// Works across all pages, uses service worker cache for instant loading

class ComponentLoader {
    static async loadComponent(componentPath, targetSelector) {
        try {
            // Fetch component (service worker will serve from cache if available)
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

            // Dispatch event for other scripts (like mobile-menu.js)
            const event = new CustomEvent('componentLoaded', {
                detail: { componentPath, targetSelector }
            });
            document.dispatchEvent(event);

        } catch (error) {
            // Silence errors or handle them silently
        }
    }

    static async loadComponents(components) {
        // Load all components in parallel
        const promises = components.map(component =>
            this.loadComponent(component.path, component.target)
        );
        await Promise.all(promises);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await ComponentLoader.loadComponents([
        { path: './Header/header.html', target: '#header-placeholder' },
        { path: './Footer/footer.html', target: '#footer-placeholder' }
    ]);

    // Reveals the body by matching the CSS class "components-loaded"
    document.body.classList.add('components-loaded');

    // Dispatch event that all components are loaded
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
});


function toggleReadMore(button) {
    const container = button.closest('.service-text-container');
    const isCollapsed = container.classList.contains('collapsed');
    
    if (isCollapsed) {
        container.classList.remove('collapsed');
        container.classList.add('expanded');
        button.querySelector('.read-more-text').textContent = 'Read less';
    } else {
        container.classList.add('collapsed');
        container.classList.remove('expanded');
        button.querySelector('.read-more-text').textContent = 'Read more';
    }
}

// More sophisticated version with special handling for treatment pages
function highlightActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const checkHeader = setInterval(() => {
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu) {
            clearInterval(checkHeader);
            
            const navLinks = navMenu.querySelectorAll('a');
            
            // Treatment pages that should highlight "TREATMENTS"
            const treatmentPages = [
                'generaldentistry.html',
                'cosmeticdentistry.html',
                'orthodontics.html',
                'advancedcare.html',
                'facialaesthetics.html'
            ];
            
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                
                // Direct match
                if (linkHref === currentPage) {
                    link.classList.add('active');
                    
                    // Highlight parent if in submenu
                    const parentSubmenu = link.closest('.has-submenu');
                    if (parentSubmenu) {
                        const parentLink = parentSubmenu.querySelector(':scope > a');
                        if (parentLink) {
                            parentLink.classList.add('active-parent');
                        }
                    }
                }
                
                // Special case: highlight TREATMENTS parent for treatment pages
                if (treatmentPages.includes(currentPage) && 
                    link.textContent.trim() === 'TREATMENTS' && 
                    link.parentElement.classList.contains('has-submenu')) {
                    link.classList.add('active-parent');
                }
            });
        }
    }, 50);
}

document.addEventListener('allComponentsLoaded', () => {
    highlightActiveMenuItem();
});