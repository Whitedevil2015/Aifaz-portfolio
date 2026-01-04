document.addEventListener('DOMContentLoaded', () => {

    // --- Core UI Elements ---
    const overlay = document.getElementById('portal-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const quoteEl = document.getElementById('daily-quote');
    const authorEl = document.getElementById('quote-author');

    // --- Quranic Verse Data (Spiritual Quotes) ---
    const spiritualVerses = [
        { text: "Indeed, with hardship [will be] ease.", ref: "Surah Ash-Sharh [94:6]" },
        { text: "So remember Me; I will remember you.", ref: "Surah Al-Baqarah [2:152]" },
        { text: "My success is only by Allah.", ref: "Surah Hud [11:88]" },
        { text: "Allah does not burden a soul beyond that it can bear.", ref: "Surah Al-Baqarah [2:286]" },
        { text: "He found you lost and guided you.", ref: "Surah Ad-Duha [93:7]" }
    ];

    function randomizeQuote() {
        const verse = spiritualVerses[Math.floor(Math.random() * spiritualVerses.length)];
        if (quoteEl) quoteEl.textContent = `"${verse.text}"`;
        if (authorEl) authorEl.textContent = `- ${verse.ref}`;
    }

    randomizeQuote();

    // --- Masjid Wallpaper Slider ---
    const mosques = [
        "https://images.unsplash.com/photo-1542332213-31f87348057f?w=1600&q=80", // Blue Mosque
        "https://images.unsplash.com/photo-1590075865003-e482776c5963?w=1600&q=80", // Sheikh Zayed
        "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&q=80", // Medina
        "https://images.unsplash.com/photo-1594470117722-de433777874a?w=1600&q=80", // Quranic aesthetic
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1600&q=80", // Masjid Al-Haram
        "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1600&q=80", // Islamic Arch
        "https://images.unsplash.com/photo-1581491395931-183fab0b31e2?w=1600&q=80"  // Dome of the Rock
    ];
    const sliderContainer = document.getElementById('mosque-slider');
    let currentSlide = 0;

    function initSlider() {
        if (!sliderContainer) return;
        mosques.forEach((m, i) => {
            const div = document.createElement('div');
            div.className = `masjid-slide ${i === 0 ? 'active' : ''}`;
            div.style.backgroundImage = `url('${m}')`;
            sliderContainer.appendChild(div);
        });
        setInterval(nextSlide, 8000);
    }

    function nextSlide() {
        const slides = document.querySelectorAll('.masjid-slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    initSlider();

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            overlay.style.opacity = '0';
            overlay.style.transition = '0.8s';
            setTimeout(() => { overlay.style.display = 'none'; }, 800);
        });
    }

    // --- Language Selection Logic ---
    let currentLang = 'en';
    const langEditions = {
        'en': 'en.sahih',
        'ar': 'ar.arayan',
        'hi': 'hi.hindi',
        'ur': 'ur.jalandhry',
        'pa': 'pa.ahmed'
    };

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.getAttribute('data-lang');
            // If reader is open, reload content
            if (quranModal.style.display === 'flex') {
                const name = readerTitle.textContent.replace('Surah ', '');
                window.loadSurah(currentSurah, name);
            }
        });
    });

    // --- Master Date Display ---
    async function updateMasterDates(date = null) {
        const hDateEl = document.getElementById('hero-hijri-date');
        const gDateEl = document.getElementById('hero-greg-date');
        try {
            let url = 'https://api.aladhan.com/v1/gToH';
            if (date) {
                const dParts = date.split('-');
                url = `https://api.aladhan.com/v1/gToH/${dParts[2]}-${dParts[1]}-${dParts[0]}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.code === 200) {
                const h = data.data.hijri;
                const g = data.data.gregorian;
                if (hDateEl) hDateEl.textContent = `${h.day} ${h.month.en} ${h.year} AH`;
                if (gDateEl) gDateEl.textContent = `${g.day} ${g.month.en} ${g.year}`;
            }
        } catch (e) { console.error("Date fetch failed"); }
    }
    updateMasterDates();

    // --- Dynamic Prayer Times (Aladhan API) ---
    const cityInput = document.getElementById('city-input');
    const countryInput = document.getElementById('country-input');
    const datePicker = document.getElementById('date-picker');
    const updateLocBtn = document.getElementById('update-location-btn');
    const locDisplay = document.getElementById('location-display');
    const currentViewDateEl = document.getElementById('current-view-date');

    // Set today as default in picker
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    if (datePicker) datePicker.value = formattedToday;

    async function fetchPrayers(city = 'Mumbai', country = 'India', date = null) {
        try {
            if (updateLocBtn) updateLocBtn.textContent = '...';
            // Use provided date or today
            let dateStr = date || formattedToday;
            // API expects DD-MM-YYYY
            const dParts = dateStr.split('-');
            const apiDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`;

            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${apiDate}?city=${city}&country=${country}&method=2`);
            const data = await res.json();
            if (data.code === 200) {
                const clock = data.data.timings;
                document.getElementById('time-fajr').textContent = clock.Fajr;
                document.getElementById('time-dhuhr').textContent = clock.Dhuhr;
                document.getElementById('time-asr').textContent = clock.Asr;
                document.getElementById('time-maghrib').textContent = clock.Maghrib;
                document.getElementById('time-isha').textContent = clock.Isha;

                if (locDisplay) locDisplay.innerHTML = `Currently viewing: <strong style="color:var(--gold);">${city}, ${country}</strong> | <span style="color:var(--accent)">${apiDate}</span>`;
            }
        } catch (e) { console.error("Prayer fetch failed", e); }
        finally { if (updateLocBtn) updateLocBtn.textContent = 'Update View'; }
    }

    updateLocBtn?.addEventListener('click', () => {
        const c = cityInput.value.trim() || 'Mumbai';
        const co = countryInput.value.trim() || 'India';
        const d = datePicker.value;
        fetchPrayers(c, co, d);
        // Also update calendar and master dates if needed
        updateMasterDates(d);
    });

    fetchPrayers(); // Initial run

    // --- Quran Reader Master Logic ---
    const quranModal = document.getElementById('quran-modal');
    const openReaderBtn = document.getElementById('open-quran-reader');
    const closeReaderBtn = document.getElementById('close-quran-btn');
    const surahListEl = document.getElementById('surah-list');
    const juzListEl = document.getElementById('juz-list');
    const surahContainer = document.getElementById('surah-list-container');
    const juzContainer = document.getElementById('juz-list-container');
    const quranContentEl = document.getElementById('quran-content');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const audioPlayer = document.getElementById('quran-audio');
    const readerTitle = document.getElementById('reader-title');
    const progressSpan = document.getElementById('surah-info');

    const tabSurah = document.getElementById('tab-surah');
    const tabJuz = document.getElementById('tab-juz');

    let currentSurah = 1;
    let currentJuz = 1;
    let viewMode = 'surah';

    // Tab Switching Logic
    tabSurah?.addEventListener('click', () => {
        viewMode = 'surah';
        tabSurah.classList.add('active');
        tabJuz?.classList.remove('active');
        if (surahContainer) surahContainer.style.display = 'block';
        if (juzContainer) juzContainer.style.display = 'none';
        if (surahListEl && surahListEl.children.length === 0) loadSurahList();
    });

    tabJuz?.addEventListener('click', () => {
        viewMode = 'juz';
        tabJuz.classList.add('active');
        tabSurah?.classList.remove('active');
        if (juzContainer) juzContainer.style.display = 'block';
        if (surahContainer) surahContainer.style.display = 'none';
        if (juzListEl && juzListEl.children.length === 0) loadJuzList();
    });

    async function loadSurahList() {
        try {
            const res = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await res.json();
            if (surahListEl) {
                surahListEl.innerHTML = data.data.map(s => `
                    <div class="surah-item ${s.number === currentSurah ? 'active' : ''}" onclick="window.loadSurah(${s.number}, '${s.englishName}')">
                        <span style="opacity:0.5; margin-right:10px;">${s.number}</span>
                        ${s.englishName}
                    </div>
                `).join('');
            }
        } catch (e) { console.log("List load failed", e); }
    }

    function loadJuzList() {
        if (juzListEl) {
            juzListEl.innerHTML = Array.from({ length: 30 }, (_, i) => i + 1).map(j => `
                <div class="surah-item ${j === currentJuz ? 'active' : ''}" onclick="window.loadJuz(${j})">
                    <span style="opacity:0.5; margin-right:10px;">PARA</span>
                    Juz ${j}
                </div>
            `).join('');
        }
    }

    async function fetchContent(endpoint) {
        quranContentEl.innerHTML = '<div style="padding:100px; text-align:center;"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i><p style="margin-top:15px; font-size:0.8rem; opacity:0.6;">Fetching Sacred Verses...</p></div>';
        try {
            const edition = langEditions[currentLang] || 'en.sahih';
            const [arRes, transRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/${endpoint}`),
                fetch(`https://api.alquran.cloud/v1/${endpoint}/${edition}`)
            ]);
            const ar = await arRes.json();
            const trans = await transRes.json();
            const ayahs = ar.data.ayahs;
            const transAyahs = trans.data.ayahs;

            quranContentEl.innerHTML = ayahs.map((ayah, i) => `
                <div class="verse-block">
                    <div class="arabic-txt">${ayah.text}</div>
                    <div class="translation-txt">${transAyahs[i].text}</div>
                </div>
            `).join('');
            progressSpan.textContent = `${ayahs.length} Ayahs | Language: ${currentLang.toUpperCase()}`;
            quranContentEl.scrollTo(0, 0);
        } catch (e) { quranContentEl.innerHTML = "<p style='text-align:center; padding:50px;'>Content loading failed...</p>"; }
    }

    window.loadSurah = async (num, name) => {
        currentSurah = num;
        readerTitle.textContent = `Surah ${name}`;
        fetchContent(`surah/${num}`);

        // Highlight active surah in sidebar
        document.querySelectorAll('#surah-list .surah-item').forEach(i => {
            i.classList.toggle('active', i.textContent.includes(name));
        });

        // Fixed Reciter: Mishary Alafasy
        audioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        audioPlayer.pause();
    };

    window.loadJuz = async (num) => {
        currentJuz = num;
        readerTitle.textContent = `Quran Para (Juz) ${num}`;
        fetchContent(`juz/${num}`);

        // Highlight active juz in sidebar
        document.querySelectorAll('#juz-list .surah-item').forEach(i => {
            i.classList.toggle('active', i.textContent.includes(`Juz ${num}`));
        });

        audioPlayer.src = ""; // Audio for full juz is not available in single file easily
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        audioPlayer.pause();
    };

    openReaderBtn?.addEventListener('click', () => {
        quranModal.style.display = 'flex';
        // Show Quran specific tabs/reciter
        if (surahContainer) surahContainer.style.display = 'block';
        loadSurahList();
        window.loadSurah(1, 'Al-Fatiha');
        // Ensure Surah tab is active by default
        tabSurah?.click();
    });

    closeReaderBtn?.addEventListener('click', () => {
        quranModal.style.display = 'none';
        audioPlayer.pause();
    });

    // --- Islamic Library & Books Logic ---
    const openBookBtns = document.querySelectorAll('.open-book-btn');

    async function loadBookContent(bookName) {
        quranModal.style.display = 'flex';
        readerTitle.textContent = bookName;
        quranContentEl.innerHTML = '<div style="padding:100px; text-align:center;"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i><p style="margin-top:15px; font-size:0.8rem; opacity:0.6;">Opening Sacred Volume...</p></div>';

        // Hide Quran specific tabs/reciter
        if (surahContainer) surahContainer.style.display = 'none';
        if (juzContainer) juzContainer.style.display = 'none';

        try {
            // Fetching a sample of Sahih Bukhari from a public Hadith API repo
            const res = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.json');
            const data = await res.json();

            // Show first 20 hadiths as a preview
            quranContentEl.innerHTML = data.hadiths.slice(0, 50).map((h, i) => `
                <div class="verse-block" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 25px 0;">
                    <div style="color:var(--gold); font-weight:700; margin-bottom:10px;">Hadith #${h.hadithnumber}</div>
                    <div class="translation-txt" style="font-size:1rem; line-height:1.8;">${h.text}</div>
                    <div style="font-size:0.75rem; opacity:0.5; margin-top:10px;">Source: Sahih Bukhari | Book: ${h.reference.book}</div>
                </div>
            `).join('');

            progressSpan.textContent = `Library: Sahih Bukhari (Sample View)`;
            quranContentEl.scrollTo(0, 0);
        } catch (e) {
            quranContentEl.innerHTML = `<div style="padding:50px; text-align:center;"><h3>${bookName}</h3><p>This volume is being prepared for the digital library. Please check back soon.</p></div>`;
        }
    }

    openBookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const book = btn.getAttribute('data-book');
            loadBookContent(book);
        });
    });

    // --- Audio Logic ---
    playPauseBtn?.addEventListener('click', () => {
        if (!audioPlayer.src || audioPlayer.src.includes('undefined')) return;
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    });

    // --- Observer for Animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('reveal-visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-bottom').forEach(el => revealObserver.observe(el));

    // --- Asma-ul-Husna (Allah's names) ---
    async function initAsma() {
        const grid = document.getElementById('asma-grid');
        if (!grid) return;
        try {
            const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
            const data = await res.json();
            if (data.code === 200) {
                grid.innerHTML = data.data.map((name, i) => `
                    <div class="card-glass reveal-bottom" style="transition-delay: ${i * 0.05}s; text-align: center; padding: 25px;">
                        <span style="color: var(--gold); font-size: 0.8rem; font-weight: 700; opacity: 0.6;">${name.number}</span>
                        <h2 style="font-family: 'Amiri', serif; font-size: 2.2rem; color: var(--gold); margin: 10px 0;">${name.name}</h2>
                        <h3 style="font-family: 'Cinzel', serif; font-size: 1.1rem; margin-bottom: 5px;">${name.transliteration}</h3>
                        <p style="font-size: 0.85rem; opacity: 0.7; color: var(--accent); font-weight: 600;">${name.en.meaning}</p>
                    </div>
                `).join('');
                document.querySelectorAll('#asma-grid .reveal-bottom').forEach(el => revealObserver.observe(el));
            }
        } catch (e) { grid.innerHTML = "<p>Failed to load names. Please try again.</p>"; }
    }

    initAsma();

});
