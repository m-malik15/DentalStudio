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
    
    // Dispatch event that all components are loaded
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
});