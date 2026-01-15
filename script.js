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

    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.testimonial-card, .value-card, .trust-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- 3D Kaba Model (Three.js) ---
    function initThreeJS() {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); // aspect ratio 1 for square container
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 400); // Matches CSS size roughly
        container.insertBefore(renderer.domElement, container.firstChild);

        // Kaba Geometry (Base Cube)
        const geometry = new THREE.BoxGeometry(2, 2.2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111, // Very dark grey/black
            roughness: 0.8
        });
        const kaba = new THREE.Mesh(geometry, material);

        // Gold Stripe Geometry
        const stripeGeo = new THREE.BoxGeometry(2.05, 0.4, 2.05); // Slightly larger
        const stripeMat = new THREE.MeshStandardMaterial({
            color: 0xD4AF37, // Gold
            metalness: 0.8,
            roughness: 0.2
        });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.y = 0.5; // Upper part of Kaba

        // Group them
        const kabaGroup = new THREE.Group();
        kabaGroup.add(kaba);
        kabaGroup.add(stripe);
        scene.add(kabaGroup);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffd700, 0.8);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            kabaGroup.rotation.y += 0.005; // Slow rotation
            kabaGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.05; // Gentle float tilt

            renderer.render(scene, camera);
        }

        animate();
    }

    // Initialize 3D only if element exists
    if (document.getElementById('canvas-container')) {
        initThreeJS();
    }

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

        const isDisplay = grid.classList.contains('surah-grid-display');
        const featuredIDs = [1, 18, 36, 55, 56, 67, 112, 113, 114]; // Fatiha, Kahf, Yaseen, Rahman, Waqia, Mulk, 3 Quls

        try {
            const res = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await res.json();

            if (data.code === 200) {
                let surahs = data.data;
                if (isDisplay) {
                    surahs = surahs.filter(s => featuredIDs.includes(s.number));
                }

                grid.innerHTML = surahs.map((s, i) => `
                    <div class="glass-container reveal-bottom" onclick="openReaderAndLoad(${s.number}, '${s.englishName}')"
                         style="padding: 1.5rem; cursor: pointer; text-align: left; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; transition-delay: ${i > 20 ? 0 : i * 0.05}s; position:relative; overflow:hidden;">
                        
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                            <div>
                                <span style="display:inline-block; font-size: 0.7rem; background:rgba(212,175,55,0.2); color: var(--gold); padding:2px 8px; border-radius:4px; margin-bottom: 5px;">#${s.number}</span>
                                <h4 style="margin: 0; font-size: 1.2rem; color: white; font-family:var(--font-serif);">${s.englishName}</h4>
                                <span style="font-size: 0.8rem; opacity: 0.7;">${s.englishNameTranslation}</span>
                            </div>
                            <div style="text-align:right;">
                                <span style="font-family:var(--font-arabic); font-size:1.4rem; color:var(--gold);">${s.name.replace('سُورَةُ ', '')}</span>
                            </div>
                        </div>
                        
                        <div class="card-info-row">
                            <span>${s.numberOfAyahs} Verses</span>
                            <span>${s.revelationType}</span>
                        </div>
                    </div>
                `).join('');

                // Observe new elements
                document.querySelectorAll('#surah-index-grid .reveal-bottom').forEach(el => revealObserver.observe(el));

                // View All Logic
                const viewAllBtn = document.getElementById('view-all-surahs-btn');
                if (viewAllBtn) {
                    viewAllBtn.onclick = () => {
                        grid.className = 'surah-grid-full';
                        viewAllBtn.style.display = 'none';
                        loadSurahDirectory(); // Re-render full
                    };
                }
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

        // Check if it's the compact preview version
        const isCompact = grid.classList.contains('asma-grid-compact');

        try {
            const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
            const data = await res.json();
            if (data.code === 200) {
                // Render logic based on view type
                const isDisplay = grid.classList.contains('asma-grid-display');
                let namesToShow = data.data;

                if (isDisplay) {
                    // Random 12 names for "Attributes of the Day" feel, or just first 12
                    // Let's do first 12 for consistency
                    namesToShow = data.data.slice(0, 12);
                }

                grid.innerHTML = namesToShow.map((name, i) => `
                    <div class="card-glass asma-card reveal-bottom" style="transition-delay: ${i * 0.05}s;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                             <span class="asma-number" style="font-size:0.8rem; opacity:0.6;">#${name.number}</span>
                             <h2 class="name-3d" style="font-size:1.5rem; margin:0;">${name.name}</h2>
                        </div>
                        <h3 class="trans-3d" style="font-size:1rem; margin-bottom:5px;">${name.transliteration}</h3>
                        <p class="meaning-3d" style="font-size:0.8rem; line-height:1.4;">${name.en.meaning}</p>
                    </div>
                `).join('');
                document.querySelectorAll('#asma-grid .reveal-bottom').forEach(el => revealObserver.observe(el));

                // View All Button Logic
                const viewAllBtn = document.getElementById('view-all-names-btn');
                if (viewAllBtn) {
                    viewAllBtn.onclick = () => {
                        grid.className = 'asma-grid-full'; // Switch class
                        viewAllBtn.style.display = 'none'; // Hide button
                        initAsma(); // Re-render full
                    };
                }
            }
        } catch (e) { grid.innerHTML = "<p>Failed to load names. Please try again.</p>"; }
    }

    // --- Authentic Duas Logic ---
    const duasData = [
        {
            id: 1,
            category: "morning",
            title: "Morning Main Adhkar",
            arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
            transliteration: "Asbahna wa-asbahal-mulku lillah walhamdu lillah la ilaha illal-lah wahdahu la sharika lah, lahul-mulku walahul-hamdu wa-huwa 'ala kulli shay'in qadir.",
            translation: "We have entered a new morning and the dominion belongs to Allah, and all praise is to Allah. There is no deity but Allah alone, He has no partner. His is the dominion and His is the praise, and He is over all things competent.",
            source: "Muslim 4/2088"
        },
        {
            id: 2,
            category: "evening",
            title: "Evening Protection",
            arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ...",
            transliteration: "Amsayna wa-amsal-mulku lillah walhamdu lillah...",
            translation: "We have reached the evening and the dominion belongs to Allah, and all praise is to Allah...",
            source: "Muslim"
        },
        {
            id: 3,
            category: "food",
            title: "Before Eating",
            arabic: "بِسْمِ اللَّهِ",
            transliteration: "Bismillah",
            translation: "In the name of Allah.",
            source: "Al-Bukhari 6/520"
        },
        {
            id: 4,
            category: "food",
            title: "After Eating",
            arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
            transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
            translation: "All praise is due to Allah who fed me this and provided it for me without any might or power on my part.",
            source: "At-Tirmidhi"
        },
        {
            id: 5,
            category: "travel",
            title: "Travelling Dua",
            arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
            transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun.",
            translation: "Glory is to Him Who has subjected this to us, and we were not able [to subdue it] ourselves. And indeed, to our Lord we will return.",
            source: "Surah Az-Zukhruf 43:13-14"
        },
        {
            id: 6,
            category: "home",
            title: "Entering Home",
            arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
            transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna.",
            translation: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we rely.",
            source: "Abu Dawud"
        },
        {
            id: 7,
            category: "home",
            title: "Leaving Home",
            arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
            transliteration: "Bismillahi, tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah.",
            translation: "In the name of Allah, I rely upon Allah, and there is no might or power except with Allah.",
            source: "Abu Dawud 4/325"
        },
        {
            id: 8,
            category: "sleep",
            title: "Before Sleeping",
            arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ...",
            transliteration: "Bismika Rabbi wada'tu janbi, wa bika arfa'uhu...",
            translation: "In Your name my Lord, I lay my side down, and in Your name I raise it...",
            source: "Al-Bukhari 11/126"
        },
        {
            id: 9,
            category: "prayer",
            title: "Dua After Prayer",
            arabic: "أَسْتَغْفِرُ اللَّهَ (3x) اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
            transliteration: "Astaghfirullah (3x). Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.",
            translation: "I seek forgiveness from Allah (3x). O Allah, You are Peace and from You is peace. Blessed are You, O Owner of Majesty and Honor.",
            source: "Muslim 1/414"
        },
        {
            id: 10,
            category: "ablution",
            title: "After Wudhu",
            arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
            transliteration: "Ash-hadu an la ilaha illallahu wahdahu la sharika lahu wa ash-hadu anna Muhammadan 'abduhu wa Rasuluhu.",
            translation: "I testify that there is no deity except Allah alone, with no partner, and I testify that Muhammad is His slave and Messenger.",
            source: "Muslim 1/209"
        },
        {
            id: 11,
            category: "sleep",
            title: "Upon Waking",
            arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
            transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
            translation: "All praise is due to Allah who gave us life after having given us death, and unto Him is the resurrection.",
            source: "Al-Bukhari 11/113"
        },
        {
            id: 12,
            category: "clothing",
            title: "New Clothes",
            arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
            transliteration: "Allahumma lakal-hamdu anta kasawtanihi, as'aluka min khayrihi wa khayri ma suni'a lahu, wa a'udhu bika min sharrihi wa sharri ma suni'a lahu.",
            translation: "O Allah, for You is all praise. You have clothed me with it. I ask You for the good of it and the good for which it was made, and I seek refuge with You from the evil of it and the evil for which it was made.",
            source: "Abu Dawud"
        }
    ];

    function renderDuas(category = 'all') {
        const grid = document.getElementById('duas-grid');
        if (!grid) return;

        const filtered = category === 'all' ? duasData : duasData.filter(d => d.category === category);
        const favorites = JSON.parse(localStorage.getItem('favDuas') || '[]');

        grid.innerHTML = filtered.map(d => {
            const isFav = favorites.includes(d.id);
            return `
            <div class="prayer-card dua-card reveal-bottom">
                <div class="dua-card-content">
                    <div class="dua-header">
                        <span class="dua-category-tag">${d.category}</span>
                        <div class="dua-actions-mini" style="display:flex; gap:5px;">
                             <button class="dua-action-btn favorite ${isFav ? 'active' : ''}" onclick="toggleFaxDua(${d.id})"><i class="${isFav ? 'fas' : 'far'} fa-heart"></i></button>
                        </div>
                    </div>
                    <h3 class="dua-title">${d.title}</h3>
                    <div class="dua-arabic">${d.arabic}</div>
                    <div class="dua-transliteration">"${d.transliteration}"</div>
                    <div class="dua-translation">${d.translation}</div>
                    <div class="dua-source">${d.source}</div>
                    
                    <div class="dua-actions">
                        <button class="dua-action-btn" onclick="copyDuaText('${d.arabic}')"><i class="fas fa-copy"></i> Copy</button>
                        <button class="dua-action-btn" onclick="playGenericAudio()"><i class="fas fa-volume-up"></i> Audio</button>
                        <button class="dua-action-btn" onclick="shareDua('${d.title}', '${d.translation}')"><i class="fas fa-share-alt"></i> Share</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // Re-observe for animations
        document.querySelectorAll('#duas-grid .reveal-bottom').forEach(el => revealObserver.observe(el));
    }

    // Category Buttons Logic
    document.querySelectorAll('.dua-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.dua-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDuas(btn.getAttribute('data-cat'));
        });
    });

    // Helper Functions
    window.toggleFaxDua = (id) => {
        let favorites = JSON.parse(localStorage.getItem('favDuas') || '[]');
        if (favorites.includes(id)) {
            favorites = favorites.filter(f => f !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem('favDuas', JSON.stringify(favorites));
        // Re-render to show state change (or just toggle class for performance)
        const activeBtn = document.querySelector('.dua-cat-btn.active');
        renderDuas(activeBtn ? activeBtn.getAttribute('data-cat') : 'all');
    };

    window.copyDuaText = (text) => {
        navigator.clipboard.writeText(text).then(() => alert('Arabic text copied to clipboard!'));
    };

    window.playGenericAudio = () => {
        alert('Audio recitation coming soon for this Dua.');
    };

    window.shareDua = (title, text) => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `${title}: ${text} - via Noor Islamic Portal`,
                url: window.location.href
            });
        } else {
            alert('Sharing not supported on this device.');
        }
    };

    // Initial Render
    renderDuas();

    initAsma();

    // Bind new Start Reading Button
    const startReadingBtn = document.getElementById('start-reading-btn');
    if (startReadingBtn) {
        startReadingBtn.addEventListener('click', () => {
            const quranModal = document.getElementById('quran-modal');
            if (quranModal) {
                quranModal.style.display = 'flex';
                // Trigger default load if empty
                if (typeof window.loadSurah === 'function') {
                    window.loadSurah(1, 'Al-Fatiha');
                }
            }
        });
    }

});

// --- 3D Tilt Effect Logic (Vanilla JS) ---
class VanillaTilt {
    constructor(element, settings = {}) {
        this.element = element;
        this.settings = Object.assign({
            max: 15, // max tilt rotation (deg)
            perspective: 1000,
            scale: 1.05,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        }, settings);

        this.init();
    }

    init() {
        this.element.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.element.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    }

    onMouseEnter() {
        this.element.style.transition = `none`;
    }

    onMouseMove(event) {
        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xPct = x / rect.width;
        const yPct = y / rect.height;

        const xTilt = (0.5 - yPct) * this.settings.max * 2;
        const yTilt = (xPct - 0.5) * this.settings.max * 2;

        this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(${xTilt}deg) rotateY(${yTilt}deg) scale(${this.settings.scale})`;
    }

    onMouseLeave() {
        this.element.style.transition = `transform ${this.settings.speed}ms cubic-bezier(.03,.98,.52,.99)`;
        this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
}

// Initialize 3D Tilt
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.prayer-card, .asma-card, .glass-container, .value-card, .tilt-card');
    cards.forEach(card => new VanillaTilt(card));
});

// --- Random Hadith Feature ---
const authenticHadiths = [
    {
        arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        english: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.",
        source: "Sahih al-Bukhari 1"
    },
    {
        arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        english: "None of you [truly] believes until he loves for his brother that which he loves for himself.",
        source: "Sahih al-Bukhari 13"
    },
    {
        arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        english: "The best among you (Muslims) are those who learn the Quran and teach it.",
        source: "Sahih al-Bukhari 5027"
    },
    {
        arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
        english: "He who believes in Allah and the Last Day must either speak good or remain silent.",
        source: "Sahih Muslim 47"
    },
    {
        arabic: "الدِّينُ النَّصِيحَةُ",
        english: "Religion is sincerity (or sincere advice).",
        source: "Sahih Muslim 55"
    },
    {
        arabic: "لاَ تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا وَلاَ تُؤْمِنُوا حَتَّى تَحَابُّوا",
        english: "You will not enter Paradise until you believe, and you will not believe until you love one another.",
        source: "Sahih Muslim 54"
    },
    {
        arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
        english: "Fear Allah wherever you are, follow a bad deed with a good deed and it will wipe it out, and behave well towards the people.",
        source: "Tirmidhi 1987"
    },
    {
        arabic: "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ",
        english: "Whoever guides someone to goodness will have a reward like one who did it.",
        source: "Sahih Muslim 1893"
    },
    {
        arabic: "الْبِرُّ حُسْنُ الْخُلُقِ",
        english: "Righteousness is good character.",
        source: "Sahih Muslim 2553"
    }
];

function loadRandomHadith() {
    const arabicEl = document.getElementById('hadith-arabic');
    const englishEl = document.getElementById('hadith-english');
    const sourceEl = document.getElementById('hadith-source');

    if (arabicEl && englishEl) {
        arabicEl.style.opacity = 0;
        englishEl.style.opacity = 0;
        if (sourceEl) sourceEl.style.opacity = 0;

        setTimeout(() => {
            const random = authenticHadiths[Math.floor(Math.random() * authenticHadiths.length)];

            arabicEl.textContent = random.arabic;
            englishEl.textContent = `"${random.english}"`;
            if (sourceEl) sourceEl.textContent = random.source;

            arabicEl.style.opacity = 1;
            englishEl.style.opacity = 1;
            if (sourceEl) sourceEl.style.opacity = 1;
        }, 300);
    }
}

// Initial Load
// Bind button - Move to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const refreshHadithBtn = document.getElementById('refresh-hadith-btn');
    if (refreshHadithBtn) {
        refreshHadithBtn.addEventListener('click', loadRandomHadith);
    }
    loadRandomHadith();
    updateHijriDate();
    initTasbih();
});

// --- Hijri Date Logic ---
function updateHijriDate() {
    const el = document.getElementById('hijri-date-text');
    if (el) {
        // Use Intl API for instant Hijri Date
        const date = new Date();
        const options = { numberingSystem: 'latn', day: 'numeric', month: 'long', year: 'numeric', calendar: 'islamic-umalqura' };
        try {
            const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', options).format(date);
            el.textContent = hijri;
        } catch (e) {
            // Fallback if browser doesn't support Islamic calendar
            el.textContent = "1445 AH";
        }
    }
}

// --- Digital Tasbih Logic ---
function initTasbih() {
    let count = 0;
    const countEl = document.getElementById('tasbih-count');
    const btn = document.getElementById('tasbih-btn');
    const reset = document.getElementById('tasbih-reset');

    if (btn && countEl) {
        btn.addEventListener('click', () => {
            count++;
            countEl.textContent = count;

            // Subtle vibration on mobile?
            if (navigator.vibrate) navigator.vibrate(20);

            // Animation reset
            btn.classList.remove('pulse-effect');
            void btn.offsetWidth; // trigger reflow
            btn.classList.add('pulse-effect');
        });

        reset?.addEventListener('click', () => {
            if (confirm('Reset counter?')) {
                count = 0;
                countEl.textContent = 0;
            }
        });
    }
}

// --- Prayer Times Logic (Auto & Manual) ---
function initPrayerTimes() {
    // Event Listener for Manual Search
    const searchBtn = document.getElementById('prayer-search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const city = document.getElementById('prayer-city').value;
            const country = document.getElementById('prayer-country').value;
            if (city && country) {
                fetchTimesByCity(city, country);
            } else {
                alert("Please enter both City and Country");
            }
        });
    }

    // Default: Auto-Detect
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchTimesByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
                // Fallback to Mecca
                fetchTimesByCoords(21.3891, 39.8579);
            }
        );
    } else {
        fetchTimesByCoords(21.3891, 39.8579);
    }
}

function fetchTimesByCoords(lat, lon) {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);
    fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=2`)
        .then(res => res.json())
        .then(data => renderPrayerTimes(data.data.timings, "Auto-detected Location"))
        .catch(err => console.error(err));
}

function fetchTimesByCity(city, country) {
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`)
        .then(res => res.json())
        .then(data => renderPrayerTimes(data.data.timings, `${city}, ${country}`))
        .catch(err => {
            alert("Could not find prayer times for this location.");
            console.error(err);
        });
}

function renderPrayerTimes(timings, locationLabel) {
    const grid = document.getElementById('prayer-times-grid');
    const subtitle = document.querySelector('#prayer-times .section-subtitle');

    if (subtitle) subtitle.textContent = locationLabel;

    if (grid) {
        grid.innerHTML = `
            ${createPrayerCard('Fajr', timings.Fajr, 'fa-cloud-sun')}
            ${createPrayerCard('Dhuhr', timings.Dhuhr, 'fa-sun')}
            ${createPrayerCard('Asr', timings.Asr, 'fa-cloud-sun-rain')}
            ${createPrayerCard('Maghrib', timings.Maghrib, 'fa-moon')}
            ${createPrayerCard('Isha', timings.Isha, 'fa-star')}
        `;
        highlightNextPrayer(timings);
    }
}

function createPrayerCard(name, time, icon) {
    return `
        <div class="prayer-card-modern" data-name="${name}" data-time="${time}">
            <i class="fas ${icon} prayer-icon"></i>
            <div class="prayer-name">${name}</div>
            <div class="prayer-time-large">${formatTime(time)}</div>
        </div>
    `;
}

function formatTime(timeVal) {
    // AlAdhan returns "HH:MM", convert to 12h
    let [h, m] = timeVal.split(':');
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
}

function highlightNextPrayer(timings) {
    // Simple logic to find next prayer
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let nextPrayer = 'Fajr'; // Default to next day Fajr

    for (let p of prayers) {
        const [h, m] = timings[p].split(':');
        const pMinutes = parseInt(h) * 60 + parseInt(m);

        if (pMinutes > currentMinutes) {
            nextPrayer = p;
            break;
        }
    }

    const cards = document.querySelectorAll('.prayer-card-modern');
    cards.forEach(card => {
        if (card.dataset.name === nextPrayer) {
            card.classList.add('next-prayer');
        }
    });
}


// --- Global Audio Player Logic ---
const audioPlayer = {
    element: null,
    container: null,
    playBtn: null,
    progressBar: null,
    isPlaying: false,

    init() {
        this.element = document.getElementById('main-audio-element');
        this.container = document.getElementById('global-player');
        this.playBtn = document.getElementById('global-play-btn');
        this.progressBar = document.getElementById('audio-progress-filled');

        if (!this.playBtn || !this.element) return;

        this.playBtn.addEventListener('click', () => this.togglePlay());

        this.element.addEventListener('timeupdate', () => {
            if (this.element.duration) {
                const percent = (this.element.currentTime / this.element.duration) * 100;
                if (this.progressBar) this.progressBar.style.width = `${percent}%`;
            }
        });

        document.getElementById('close-player-btn')?.addEventListener('click', () => {
            this.container.classList.remove('active');
            this.element.pause();
            this.isPlaying = false;
            this.updateIcon();
        });
    },

    playTrack(url, title, artist) {
        if (!this.element) return;
        this.element.src = url;

        const titleEl = document.getElementById('player-track-title');
        const artistEl = document.getElementById('player-track-artist');
        if (titleEl) titleEl.textContent = title;
        if (artistEl) artistEl.textContent = artist;

        this.container.classList.add('active');
        this.element.play()
            .then(() => {
                this.isPlaying = true;
                this.updateIcon();
            })
            .catch(e => console.error("Audio Play Error:", e));
    },

    togglePlay() {
        if (!this.element) return;
        if (this.element.paused) {
            this.element.play();
            this.isPlaying = true;
        } else {
            this.element.pause();
            this.isPlaying = false;
        }
        this.updateIcon();
    },

    updateIcon() {
        const icon = this.playBtn.querySelector('i');
        if (!icon) return;
        if (this.isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }
};

// Initialize All
document.addEventListener('DOMContentLoaded', () => {
    // Re-call these if they were already called or call them now
    initPrayerTimes();
    audioPlayer.init();
    initAdminAndEffects();
});

// --- Admin & Proprietary Effects Logic ---
function initAdminAndEffects() {
    // 1. Check for Admin Role (Simulated via URL param ?role=admin)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('role') === 'admin') {
        document.body.classList.add('admin-mode');

        // Add editable hints to cards for admin visualization
        document.querySelectorAll('.kids-card, .prayer-card-modern, .hero-section h1').forEach(el => {
            el.classList.add('editable-hint');
            el.addEventListener('click', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    alert('Admin Mode: Edit Feature Prototype');
                }
            });
        });

        console.log("Admin Mode Activated");
    }

    // 2. Noor Ambient Glow Effect (Mouse Follower)
    const glow = document.getElementById('noor-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                glow.style.left = e.clientX + 'px';
                glow.style.top = e.clientY + 'px';
            });
        });
    }

    // 3. Proprietary Card Effect (Golden Sheen)
    // Add the class to important cards
    document.querySelectorAll('.kids-card, .prayer-card-modern').forEach(card => {
        card.classList.add('proprietary-card-effect');
    });
}
