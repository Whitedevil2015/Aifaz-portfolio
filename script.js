// --- 40 Hadith Nawawi Data ---
const hadithNawawi = [
    {
        id: 1,
        arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: \" إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ \".",
        english: "Amir al-Mu'minin, Abu Hafs 'Umar bin al-Khattab (ra) said: I heard the Messenger of Allah (ﷺ) saying: \"Actions are according to intentions, and everyone will get what was intended. Whoever migrates with an intention for Allah and His Messenger, the migration will be for the sake of Allah and His Messenger. And whoever migrates for worldly gain or to marry a woman, then his migration will be for the sake of whatever he migrated for.\"",
        ref: "Bukhari & Muslim"
    },
    {
        id: 2,
        arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه وسلم ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعْرِ، لَا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلَا يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صلى الله عليه وسلم ...",
        english: "Also on the authority of Umar, who said: One day while we were sitting with the Messenger of Allah (ﷺ) there appeared before us a man whose clothes were exceedingly white and whose hair was exceedingly black; no signs of travel were to be seen on him and none of us knew him...",
        ref: "Muslim"
    },
    {
        id: 3,
        arabic: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: \" بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ \".",
        english: "On the authority of Abu 'Abd ar-Rahman 'Abdullah bin 'Umar bin al-Khattab (ra) who said: I heard the Messenger of Allah (ﷺ) say: \"Islam is built upon five [pillars]: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing the prayer, giving the Zakah, making the pilgrimage to the House, and fasting in Ramadan.\"",
        ref: "Bukhari & Muslim"
    }
];

document.addEventListener('DOMContentLoaded', () => {

    // --- Hadith Integation ---
    window.openHadith = (collection) => {
        const modal = document.getElementById('quran-modal');
        const title = document.getElementById('reader-title');
        const info = document.getElementById('surah-info');
        const content = document.getElementById('quran-content');

        // Hide specific Quran elements
        document.querySelector('.reader-controls-center').style.opacity = '0'; // Hide lang toggle
        document.querySelector('.audio-player-box').style.display = 'none';
        document.querySelector('.surah-sidebar').style.display = 'none';
        document.querySelector('.verse-view').style.width = '100%'; // Full width
        document.querySelector('.verse-view').style.padding = '40px';

        modal.style.display = 'flex';

        if (collection === 'nawawi') {
            title.textContent = "40 Hadith Nawawi";
            info.textContent = "Imam An-Nawawi | 42 Authentic Hadith";

            content.innerHTML = hadithNawawi.map(h => `
                <div class="verse-block">
                     <div class="verse-header" style="justify-content:center; border-bottom:none;">
                        <span class="verse-num" style="width:auto; padding:0 15px; border-radius:15px;">Hadith ${h.id}</span>
                     </div>
                     <div class="arabic-txt" style="font-size:2rem; line-height:2;">${h.arabic}</div>
                     <div class="translation-txt" style="text-align:center; max-width:900px;">
                        ${h.english}
                        <p style="margin-top:20px; color:var(--gold); font-size:0.9rem; font-weight:700;">Reference: ${h.ref}</p>
                     </div>
                </div>
            `).join('');
        }
    };

    // Reset Modal on Close (to fix Quran layout)
    document.getElementById('close-quran-btn').addEventListener('click', () => {
        document.getElementById('quran-modal').style.display = 'none';
        // Restore Quran defaults
        document.querySelector('.reader-controls-center').style.opacity = '1';
        document.querySelector('.audio-player-box').style.display = 'flex';
        document.querySelector('.surah-sidebar').style.display = 'block';
        document.querySelector('.verse-view').style.width = '';
        document.querySelector('.verse-view').style.padding = '';
    });



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
        'hi': 'hi.farooq',
        'ur': 'ur.jalandhry',
        'pa': 'pa.ahmed'
    };

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual toggle
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Logic
            currentLang = btn.getAttribute('data-lang');
            if (quranModal.style.display !== 'none') {
                // Reload current surah with new language
                const surahNameStr = readerTitle.textContent.replace('Surah ', '');
                window.loadSurah(currentSurah, surahNameStr);
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
    const surahContainer = document.getElementById('surah-list-container');
    const quranContentEl = document.getElementById('quran-content');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const audioPlayer = document.getElementById('quran-audio');
    const readerTitle = document.getElementById('reader-title');
    const progressSpan = document.getElementById('surah-info');

    const tabSurah = document.getElementById('tab-surah');

    let currentSurah = 1;
    let viewMode = 'surah';

    // Tab Switching Logic
    tabSurah?.addEventListener('click', () => {
        viewMode = 'surah';
        tabSurah.classList.add('active');
        if (surahContainer) surahContainer.style.display = 'block';
        if (surahListEl && surahListEl.children.length === 0) loadSurahList();
    });

    async function loadSurahList() {
        try {
            const res = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await res.json();
            if (surahListEl) {
                surahListEl.innerHTML = data.data.map(s => `
                    <div class="surah-item ${s.number === currentSurah ? 'active' : ''}" onclick="window.loadSurah(${s.number}, '${s.englishName}')">
                        <span>${s.number}</span>
                        ${s.englishName}
                    </div>
                `).join('');
            }
        } catch (e) { console.log("List load failed", e); }
    }

    // --- Content Fetching & Rendering ---
    async function fetchContent(endpoint) {
        quranContentEl.innerHTML = '<div style="padding:100px; text-align:center;"><i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color:var(--gold);"></i></div>';
        try {
            const edition = langEditions[currentLang] || 'en.sahih';

            // Fetch Arabic and Translation in parallel
            const [arRes, transRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/${endpoint}/quran-uthmani`),
                fetch(`https://api.alquran.cloud/v1/${endpoint}/${edition}`)
            ]);

            const ar = await arRes.json();
            const trans = await transRes.json();

            if (!ar.data || !trans.data) throw new Error("Invalid Data");

            const ayahs = ar.data.ayahs;
            const transAyahs = trans.data.ayahs;

            // Render Verses
            quranContentEl.innerHTML = ayahs.map((ayah, i) => {
                const verseKey = `note-${currentSurah}-${ayah.numberInSurah}`;
                const existingNote = localStorage.getItem(verseKey) || '';

                return `
                <div class="verse-block">
                    <div class="verse-header">
                        <span class="verse-num">${ayah.numberInSurah}</span>
                        <div class="verse-actions">
                           <button class="verse-btn" onclick="toggleNoteBox('${verseKey}')"><i class="far fa-comment-alt"></i> Reflection</button>
                        </div>
                    </div>
                    
                    <!-- Arabic Text -->
                    <div class="arabic-txt">${ayah.text}</div>
                    
                    <!-- Translation Text -->
                    <div class="translation-txt" data-lang="${currentLang}">${transAyahs[i].text}</div>
                    
                    <!-- Comment Section -->
                    <div id="box-${verseKey}" class="reflection-box ${existingNote ? 'active' : ''}" style="display:${existingNote ? 'block' : 'none'};">
                        <textarea id="input-${verseKey}" placeholder="Write your reflection here...">${existingNote}</textarea>
                        <button onclick="saveNote('${verseKey}')">Save Note</button>
                    </div>
                </div>
            `}).join('');

            progressSpan.textContent = `${ayahs.length} Ayahs | ${ar.data.englishName}`;
            quranContentEl.scrollTo(0, 0);

        } catch (e) {
            console.error(e);
            quranContentEl.innerHTML = "<p style='text-align:center; padding:50px;'>Content loading failed.</p>";
        }
    }

    // --- Helper for Notes ---
    window.toggleNoteBox = (key) => {
        const box = document.getElementById(`box-${key}`);
        if (box.style.display === 'none') {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    };

    window.saveNote = (key) => {
        const val = document.getElementById(`input-${key}`).value;
        localStorage.setItem(key, val);
        alert('Reflection saved locally.');
    };

    window.loadSurah = async (num, name) => {
        currentSurah = num;
        readerTitle.textContent = `Surah ${name}`;
        fetchContent(`surah/${num}`);

        // Highlight active
        document.querySelectorAll('.surah-item').forEach(i => i.classList.remove('active'));
        // Find by text match logic omitted for brevity, relying on reload for now

        // Audio Setup
        audioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`;
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

    // --- Surah Index (Directory) ---
    async function loadSurahDirectory() {
        const grid = document.getElementById('surah-index-grid');
        if (!grid) return;

        try {
            const res = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await res.json();

            if (data.code === 200) {
                grid.innerHTML = data.data.map((s, i) => `
                    <div class="glass-container reveal-bottom" onclick="openReaderAndLoad(${s.number}, '${s.englishName}')"
                         style="padding: 15px; cursor: pointer; text-align: center; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; transition-delay: ${i > 20 ? 0 : i * 0.05}s;">
                        <span style="display:block; font-size: 0.8rem; color: var(--gold); margin-bottom: 5px;">${s.number}</span>
                        <h4 style="margin: 0; font-size: 1rem; color: white;">${s.englishName}</h4>
                        <span style="font-size: 0.75rem; opacity: 0.6;">${s.englishNameTranslation}</span>
                    </div>
                `).join('');

                // Observe new elements
                document.querySelectorAll('#surah-index-grid .reveal-bottom').forEach(el => revealObserver.observe(el));
            }
        } catch (e) { console.error("Index load failed"); }
    }

    // Helper to open reader from index
    window.openReaderAndLoad = (num, name) => {
        document.getElementById('quran-modal').style.display = 'flex';
        loadSurahList(); // Ensure sidebar list is populated
        window.loadSurah(num, name);
    };

    loadSurahDirectory();

    // --- Azaan Player Logic ---
    const azaanBtn = document.getElementById('play-azaan-btn');
    const azaanAudio = document.getElementById('azaan-audio');

    if (azaanBtn && azaanAudio) {
        azaanBtn.addEventListener('click', () => {
            if (azaanAudio.paused) {
                azaanAudio.play();
                azaanBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Azaan';
                azaanBtn.classList.add('active'); // Add a glowing effect style if needed
            } else {
                azaanAudio.pause();
                azaanAudio.currentTime = 0;
                azaanBtn.innerHTML = '<i class="fa-solid fa-mosque"></i> Play Azaan (Makkah)';
                azaanBtn.classList.remove('active');
            }
        });

        azaanAudio.addEventListener('ended', () => {
            azaanBtn.innerHTML = '<i class="fa-solid fa-mosque"></i> Play Azaan (Makkah)';
            azaanBtn.classList.remove('active');
        });
    }

    // --- Asma-ul-Husna (Allah's names) ---
    async function initAsma() {
        const grid = document.getElementById('asma-grid');
        if (!grid) return;
        try {
            const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
            const data = await res.json();
            if (data.code === 200) {
                grid.innerHTML = data.data.map((name, i) => `
                    <div class="card-glass asma-card reveal-bottom" style="transition-delay: ${i * 0.05}s;">
                        <span class="asma-number">${name.number}</span>
                        <div class="name-container-3d">
                            <h2 class="name-3d">${name.name}</h2>
                        </div>
                        <h3 class="trans-3d">${name.transliteration}</h3>
                        <p class="meaning-3d">${name.en.meaning}</p>
                    </div>
                `).join('');
                document.querySelectorAll('#asma-grid .reveal-bottom').forEach(el => revealObserver.observe(el));
            }
        } catch (e) { grid.innerHTML = "<p>Failed to load names. Please try again.</p>"; }
    }

    initAsma();

});
