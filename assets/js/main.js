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

    // === FORM HANDLING (PLACEHOLDER - INTEGRATE WITH YOUR n8n) ===
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            console.log('Form submitted:', data);

            // TODO: Send to n8n webhook
            // fetch('YOUR_N8N_WEBHOOK_URL', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     alert('¡Mensaje enviado! Nos contactaremos pronto.');
            //     form.reset();
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('Hubo un error. Por favor intente por WhatsApp.');
            // });

            // Temporary: Show success message and redirect to WhatsApp
            alert('¡Gracias por su interés! Lo redirigiremos a WhatsApp para atención inmediata.');
            window.open('https://wa.me/573053270131?text=Hola,%20envié%20el%20formulario%20de%20contacto', '_blank');
            form.reset();
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
