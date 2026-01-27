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