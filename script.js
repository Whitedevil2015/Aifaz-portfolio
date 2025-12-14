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

    const observer = new IntersectionObserver((entries, observer) => {
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
        '.about-text',
        '.expertise-card',
        '.contact-info',
        '.contact-form',
        '.hero-content > *',
        '.image-wrapper'
    ];

    // Select and observe elements

    const elementsToObserve = document.querySelectorAll(animatedElements.join(','));
    elementsToObserve.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Quran Quotes Logic
    const quranQuotes = [
        { text: "Indeed, with hardship [will be] ease.", ref: "Surah Ash-Sharh (94:6)" },
        { text: "For indeed, with hardship [will be] ease.", ref: "Surah Ash-Sharh (94:5)" },
        { text: "And my success is not but through Allah.", ref: "Surah Hud (11:88)" },
        { text: "So remember Me; I will remember you.", ref: "Surah Al-Baqarah (2:152)" },
        { text: "Indeed, Allah will not change the condition of a people until they change what is in themselves.", ref: "Surah Ar-Ra'd (13:11)" },
        { text: "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect.", ref: "Surah At-Talaq (65:2-3)" },
        { text: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.", ref: "Surah An-Naml (27:19)" },
        { text: "He is with you wherever you are.", ref: "Surah Al-Hadid (57:4)" },
        { text: "Indeed, my Lord is the Hearer of supplication.", ref: "Surah Ibrahim (14:39)" },
        { text: "And seek help through patience and prayer.", ref: "Surah Al-Baqarah (2:45)" },
        { text: "Allah does not burden a soul beyond that it can bear.", ref: "Surah Al-Baqarah (2:286)" },
        { text: "And that there is not for man except that [good] for which he strives.", ref: "Surah An-Najm (53:39)" },
        { text: "Successful indeed are the believers.", ref: "Surah Al-Mu'minun (23:1)" },
        { text: "And put your trust in Allah, for Allah is sufficient as a Trustee of Affairs.", ref: "Surah Al-Ahzab (33:3)" },
        { text: "Call upon Me; I will respond to you.", ref: "Surah Ghafir (40:60)" },
        { text: "If you are grateful, I will surely increase you [in favor].", ref: "Surah Ibrahim (14:7)" },
        { text: "And He found you lost and guided [you].", ref: "Surah Ad-Duhaa (93:7)" },
        { text: "So be patient. Indeed, the promise of Allah is truth.", ref: "Surah Ar-Rum (30:60)" },
        { text: "Say, 'Nothing will happen to us except what Allah has decreed for us: He is our protector.'", ref: "Surah At-Tawbah (9:51)" },
        { text: "Allah is the best of providers.", ref: "Surah Al-Jumu'ah (62:11)" },
        { text: "And whoever puts his trust in Allah, then He will suffice him.", ref: "Surah At-Talaq (65:3)" },
        { text: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.", ref: "Surah Al-Baqarah (2:153)" },
        { text: "Our Lord, and burden us not with that which we have no ability to bear.", ref: "Surah Al-Baqarah (2:286)" },
        { text: "My success can only come from Allah. In Him I trust, and unto Him I look.", ref: "Surah Hud (11:88)" },
        { text: "And rely upon the Ever-Living who does not die.", ref: "Surah Al-Furqan (25:58)" },
        { text: "Indeed, Allah is with those who fear Him and those who are doers of good.", ref: "Surah An-Nahl (16:128)" }
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
