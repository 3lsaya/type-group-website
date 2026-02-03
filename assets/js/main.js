// ========================================
// TYPE GROUP - MAIN JAVASCRIPT
// Interactive Elements & Animations
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // === STICKY HEADER WITH SHADOW ===
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // === FADE-IN ANIMATIONS ON SCROLL ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === FORM HANDLING (INTEGRATED WITH n8n) ===
    const forms = document.querySelectorAll('form');
    // REMPLAZAR ESTA URL CON TU WEBHOOK REAL DE n8n
    const N8N_WEBHOOK_URL = 'https://n8n.3lsaya.com/webhook/typegroup-contact';

    forms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Añadir metadata útil
            data.source_page = window.location.pathname;
            data.timestamp = new Date().toISOString();
            data.form_id = this.id || 'generic_form';

            console.log('Sending data to n8n:', data);

            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="inline-flex items-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </span>
                `;

                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error('Error en el servidor');

                // Success
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
                form.reset();
            } catch (error) {
                console.error('Error submitting form:', error);

                // Fallback a WhatsApp si el webhook falla
                if (confirm('Hubo un problema técnico al enviar el formulario. ¿Deseas enviarlo por WhatsApp para atención inmediata?')) {
                    const text = `Hola, traté de enviar un formulario desde la web:\n\nNombre: ${data.nombre}\nInterés: ${data.producto || data.modelo || 'General'}\nMotivo: Error en Webhook`;
                    window.open(`https://wa.me/573053270131?text=${encodeURIComponent(text)}`, '_blank');
                }
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    });

    // === MOBILE MENU TOGGLE (IF NEEDED) ===
    const mobileMenuButton = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-content]');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // === LAZY LOADING IMAGES ===
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // === WHATSAPP BUTTON PULSE ANIMATION ===
    const whatsappButton = document.querySelector('a[href*="wa.me"]');
    if (whatsappButton) {
        setInterval(() => {
            whatsappButton.style.transform = 'scale(1.1)';
            setTimeout(() => {
                whatsappButton.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }

    console.log('Type Group website initialized ✓');
});

// === UTILITY FUNCTIONS ===

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Track WhatsApp clicks (optional analytics)
function trackWhatsAppClick(product = 'general') {
    console.log(`WhatsApp click: ${product}`);
    // TODO: Integrate with your analytics
    // gtag('event', 'whatsapp_click', { product: product });
}
