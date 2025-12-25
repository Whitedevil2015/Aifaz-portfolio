document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Cart Logic
    let cartCount = 0;
    const cartBadge = document.querySelector('.cart-count');
    const addButtons = document.querySelectorAll('.btn-add-cart');

    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }

            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.backgroundColor = '#4ade80';
            btn.style.borderColor = '#4ade80';
            btn.style.color = '#050505';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 1000);
        });
    });

    // Smooth Scrolling with Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = [
        '.section-title',
        '.section-subtitle',
        '.product-card',
        '.category-card',
        '.testimonial-card',
        '.trust-item',
        '.contact-info',
        '.contact-form',
        '.hero-content > *',
        '.product-showcase'
    ];

    const elementsToObserve = document.querySelectorAll(animatedElements.join(','));
    elementsToObserve.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Quran Quotes Logic
    const quranQuotes = [
        { text: "Indeed, with hardship [will be] ease.", ref: "Surah Ash-Sharh (94:6)" },
        { text: "And my success is not but through Allah.", ref: "Surah Hud (11:88)" },
        { text: "So remember Me; I will remember you.", ref: "Surah Al-Baqarah (2:152)" },
        { text: "And whoever fears Allah - He will make for him a way out.", ref: "Surah At-Talaq (65:2)" },
        { text: "He is with you wherever you are.", ref: "Surah Al-Hadid (57:4)" },
        { text: "Allah is the best of providers.", ref: "Surah Al-Jumu'ah (62:11)" },
        { text: "And whoever puts his trust in Allah, then He will suffice him.", ref: "Surah At-Talaq (65:3)" }
    ];

    const quoteContainer = document.getElementById('quran-quote');
    if (quoteContainer) {
        const quoteText = quoteContainer.querySelector('.quote-text');
        const quoteRef = quoteContainer.querySelector('.quote-reference');

        const randomIndex = Math.floor(Math.random() * quranQuotes.length);
        const randomQuote = quranQuotes[randomIndex];

        quoteText.textContent = `"${randomQuote.text}"`;
        quoteRef.textContent = `- ${randomQuote.ref}`;
    }
});
