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

// --- V3.5 Dashboard Logic ---

// 1. Daily Verse (Randomized)
const verses = [
    { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", ref: "Al-Fatiha 1:1" },
    { ar: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence.", ref: "Ayatul Kursi (2:255)" },
    { ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", en: "Say, 'He is Allah, [who is] One.'", ref: "Al-Ikhlas 112:1" },
    { ar: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ", en: "And whoever relies upon Allah - then He is sufficient for him.", ref: "At-Talaq 65:3" }
];

function loadDailyVerse() {
    const v = verses[Math.floor(Math.random() * verses.length)];
    const arEl = document.getElementById('daily-verse-ar');
    const enEl = document.getElementById('daily-verse-en');
    const refEl = document.getElementById('daily-ref');

    if (arEl && enEl) {
        arEl.classList.remove('skeleton', 'skeleton-block');
        enEl.classList.remove('skeleton', 'skeleton-text');

        arEl.textContent = v.ar;
        enEl.textContent = v.en;
        if (refEl) refEl.textContent = v.ref;
    }
}
setTimeout(loadDailyVerse, 1000); // Simulate load

// 2. Habit Tracker Toggle
window.toggleHabit = (el) => {
    el.classList.toggle('completed');
    // Optional: Save to localStorage
};

// 3. Simple Tasbeeh
window.incrementWidgetTasbeeh = () => {
    const countEl = document.getElementById('dhikr-1-count');
    if (countEl) {
        let c = parseInt(countEl.textContent || '0');
        countEl.textContent = c + 1;
    }
};

// 4. Asma Grid Populator (if empty)
async function initAsmaDashboard() {
    const grid = document.getElementById('asma-grid');
    if (!grid || grid.children.length > 1) return; // Already loaded

    try {
        const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
        const data = await res.json();
        if (data.code === 200) {
            grid.innerHTML = data.data.map((name, i) => `
                    <div class="asma-card-small" style="animation: fadeInUp 0.5s ease backwards ${i * 0.02}s;">
                        <span style="color:var(--gold); font-size:0.7rem;">${name.number}</span>
                        <h3 style="font-family:'Amiri', serif; font-size:1.5rem; margin:5px 0; color:white;">${name.name}</h3>
                        <p style="font-size:0.75rem; color:#94a3b8;">${name.transliteration}</p>
                    </div>
                `).join('');
        }
    } catch (e) { console.log('Asma load error', e); }
}

// Trigger sections on scroll
const observerOptions = { threshold: 0.1 };
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'asma-ul-husna') {
            initAsmaDashboard();
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const asmaSection = document.getElementById('asma-ul-husna');
if (asmaSection) sectionObserver.observe(asmaSection);



// --- Configuration / Default State ---
const DEFAULT_STATE = {
    header: {
        location: "Istanbul",
        hijriDate: "14 Ramadan 1447",
        gregorianDate: "March 3, 2026"
    },
    prayerTimes: {
        fajr: "05:12",
        sunrise: "06:45",
        dhuhr: "12:30",
        asr: "15:45",
        maghrib: "18:15",
        isha: "19:45"
    },
    dailyContent: {
        type: "Ayah",
        content_ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        content_en: "Indeed, with hardship comes ease.",
        reference: "Surah Ash-Sharh 94:6"
    }
};

// --- Hadith Integration ---
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

// --- 3D Kaba Model (Removed) ---
// User requested removal of 3D Kaba animation.


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
    // Use Mock Data for current "Demo" state
    const hDateEl = document.getElementById('hero-hijri-date');
    const gDateEl = document.getElementById('hero-greg-date');
    const bentoHijri = document.getElementById('bento-hijri');
    const bentoGreg = document.getElementById('bento-greg');

    // Populate from DEFAULT_STATE (Istanbul/Ramadan Context)
    if (hDateEl) hDateEl.textContent = DEFAULT_STATE.header.hijriDate;
    if (gDateEl) gDateEl.textContent = DEFAULT_STATE.header.gregorianDate;
    if (bentoHijri) bentoHijri.textContent = DEFAULT_STATE.header.hijriDate;
    if (bentoGreg) bentoGreg.textContent = DEFAULT_STATE.header.gregorianDate;
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

async function fetchPrayers(city = null, country = null, date = null) {
    try {
        if (updateLocBtn) updateLocBtn.textContent = '...';

        // If no args provided, use DEFAULT_STATE (Simulation Mode)
        let clock;
        let displayCity = city || DEFAULT_STATE.header.location;
        let displayCountry = country || ""; // Specific country not in JSON, implied or generic

        if (!city && !date) {
            // Use Mock Data
            clock = {
                Fajr: DEFAULT_STATE.prayerTimes.fajr,
                Sunrise: DEFAULT_STATE.prayerTimes.sunrise, // Approximation/Passthrough
                Dhuhr: DEFAULT_STATE.prayerTimes.dhuhr,
                Asr: DEFAULT_STATE.prayerTimes.asr,
                Maghrib: DEFAULT_STATE.prayerTimes.maghrib,
                Isha: DEFAULT_STATE.prayerTimes.isha
            };
        } else {
            // Real API Fetch for user overrides
            let dateStr = date || formattedToday;
            const dParts = dateStr.split('-');
            const apiDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`;
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${apiDate}?city=${city}&country=${country}&method=2`);
            const data = await res.json();
            clock = data.data.timings;
        }

        // Update UI
        document.getElementById('time-fajr').textContent = clock.Fajr;
        document.getElementById('time-dhuhr').textContent = clock.Dhuhr;
        document.getElementById('time-asr').textContent = clock.Asr;
        document.getElementById('time-maghrib').textContent = clock.Maghrib;
        document.getElementById('time-isha').textContent = clock.Isha;

        // Save for Atmosphere Logic
        window.todayPrayers = {
            Fajr: clock.Fajr,
            Sunrise: clock.Sunrise || "06:45", // Fallback for mock
            Dhuhr: clock.Dhuhr,
            Asr: clock.Asr,
            Maghrib: clock.Maghrib,
            Isha: clock.Isha
        };
        updateAtmosphere(); // Force update

        if (locDisplay) locDisplay.innerHTML = `Currently viewing: <strong style="color:var(--text-main);">${displayCity}</strong>`;
    } catch (e) {
        console.error("Prayer fetch failed", e);
    } finally {
        if (updateLocBtn) updateLocBtn.textContent = 'Update View';
    }
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
            // Store data globally for search filtering
            window.allSurahs = data.data;
            renderSurahList(window.allSurahs);
        }
    } catch (e) { console.log("List load failed", e); }
}

function renderSurahList(surahs) {
    if (!surahListEl) return;
    surahListEl.innerHTML = surahs.map(s => `
            <div class="surah-item ${s.number === currentSurah ? 'active' : ''}" 
                 onclick="window.loadSurah(${s.number}, '${s.englishName}')"
                 data-number="${s.number}">
                <div style="display:flex; gap:10px; align-items:center;">
                    <span style="display:inline-block; width:25px; height:25px; background:rgba(212,175,55,0.2); border-radius:50%; text-align:center; line-height:25px; font-size:0.8rem; color:#D4AF37;">${s.number}</span>
                    <span style="font-weight:500;">${s.englishName}</span>
                </div>
                <span style="font-size:0.8rem; opacity:0.6;">${s.englishNameTranslation}</span>
            </div>
        `).join('');
}

// Search Functionality
const searchInput = document.getElementById('research-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (!window.allSurahs) return;
        const filtered = window.allSurahs.filter(s =>
            s.englishName.toLowerCase().includes(term) ||
            s.englishNameTranslation.toLowerCase().includes(term) ||
            String(s.number).includes(term)
        );
        renderSurahList(filtered);
    });
}



// --- DOM Elements & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Hydrate Header Location
    const headerLoc = document.getElementById('header-location');
    if (headerLoc) headerLoc.textContent = DEFAULT_STATE.header.location;

    // Hydrate Daily Ayah Card
    const ayahAr = document.getElementById('ayah-arabic');
    const ayahEn = document.getElementById('ayah-translation');
    const ayahInfo = document.getElementById('ayah-info');

    if (ayahAr) ayahAr.textContent = DEFAULT_STATE.dailyContent.content_ar;
    if (ayahEn) ayahEn.textContent = DEFAULT_STATE.dailyContent.content_en;
    if (ayahInfo) ayahInfo.textContent = DEFAULT_STATE.dailyContent.reference;

    const ayahPlayBtn = document.getElementById('ayah-play-btn');
    if (ayahPlayBtn) {
        ayahPlayBtn.addEventListener('click', () => {
            alert("Audio recitation for " + DEFAULT_STATE.dailyContent.reference + " would play here.");
        });
    }

    // Animate elements on scroll
});

// --- Content Fetching & Rendering ---
async function fetchContent(endpoint) {
    // Clear both panes
    const arabicPane = document.querySelector('.pane-arabic-view');
    const englishPane = document.querySelector('.pane-english-view');

    if (arabicPane) arabicPane.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
    if (englishPane) englishPane.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';

    try {
        const edition = langEditions[currentLang] || 'en.sahih';

        const [arRes, transRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/${endpoint}/quran-uthmani`),
            fetch(`https://api.alquran.cloud/v1/${endpoint}/${edition}`)
        ]);

        const ar = await arRes.json();
        const trans = await transRes.json();

        if (!ar.data || !trans.data) throw new Error("Invalid Data");

        const ayahs = ar.data.ayahs;
        const transAyahs = trans.data.ayahs;

        // 1. Render Right Pane (Arabic - RTL)
        if (arabicPane) {
            arabicPane.innerHTML = ayahs.map(ayah => `
                    <div class="arabic-verse-text">
                        ${ayah.text} <span style="color:#D4AF37; font-size:1.5rem;">(${ayah.numberInSurah})</span>
                    </div>
                `).join('');
        }

        // 2. Render Left Pane (Translation - LTR)
        if (englishPane) {
            englishPane.innerHTML = transAyahs.map(ayah => `
                    <div class="english-verse-text">
                        <span style="color:#D4AF37; font-weight:bold; margin-right:10px;">${ayah.numberInSurah}.</span>
                        ${ayah.text}
                    </div>
                `).join('');
        }

        // Sync Scroll (Simple Proportional Sync)
        if (arabicPane && englishPane) {
            let isScrolling = false;

            arabicPane.onscroll = () => {
                if (isScrolling) return;
                isScrolling = true;
                const percentage = arabicPane.scrollTop / (arabicPane.scrollHeight - arabicPane.clientHeight);
                englishPane.scrollTop = percentage * (englishPane.scrollHeight - englishPane.clientHeight);
                setTimeout(() => isScrolling = false, 50);
            };

            englishPane.onscroll = () => {
                if (isScrolling) return;
                isScrolling = true;
                const percentage = englishPane.scrollTop / (englishPane.scrollHeight - englishPane.clientHeight);
                arabicPane.scrollTop = percentage * (arabicPane.scrollHeight - arabicPane.clientHeight);
                setTimeout(() => isScrolling = false, 50);
            };
        }

        // Update Progress
        if (progressSpan) progressSpan.textContent = `${ayahs.length} Ayahs | ${ar.data.englishName}`;

    } catch (e) {
        console.error(e);
        if (arabicPane) arabicPane.innerHTML = "<p style='padding:20px;'>Failed to load.</p>";
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

    // Add skeleton state to daily verse if this is the daily surah (optional logic, but keeping safe)
    const dailyAr = document.getElementById('daily-verse-ar');
    const dailyEn = document.getElementById('daily-verse-en');
    if (dailyAr && dailyEn && dailyAr.innerHTML === '') {
        dailyAr.classList.add('skeleton', 'skeleton-block');
        dailyEn.classList.add('skeleton', 'skeleton-text');
    }

    // Update Active Class in Sidebar
    document.querySelectorAll('.surah-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`.surah-item[data-number="${num}"]`);
    if (activeItem) activeItem.classList.add('active');

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

// --- Flight Bar Logic (Next Prayer Countdown) ---
function updateFlightBar() {
    if (!window.todayPrayers) return;

    const now = new Date();
    const next = calculateNextPrayer(window.todayPrayers);

    if (next) {
        const diff = next.time - now;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const timerStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        const nameEl = document.getElementById('flight-next-name');
        const timerEl = document.getElementById('flight-countdown');

        if (nameEl) nameEl.textContent = next.name;
        if (timerEl) timerEl.textContent = timerStr;

        // Header Update (Spiritual Dashboard)
        const headerTimer = document.getElementById('header-countdown');
        const headerName = document.getElementById('header-next-name');
        if (headerTimer) {
            headerTimer.textContent = timerStr;
            headerTimer.classList.remove('skeleton', 'skeleton-text');
            headerTimer.style.width = ''; headerTimer.style.height = '';
        }
        if (headerName) {
            headerName.textContent = next.name;
            headerName.classList.remove('skeleton', 'skeleton-text');
            headerName.style.width = '';
        }

        // Legacy/Portal widgets (if present)
        const widgetTimer = document.getElementById('flight-countdown-widget');
        const widgetName = document.getElementById('flight-next-name-widget');
        if (widgetTimer) widgetTimer.textContent = timerStr;
        if (widgetName) widgetName.textContent = next.name;
    }
}

function calculateNextPrayer(prayers) {
    const now = new Date();
    const prayerList = [
        { name: 'Fajr', time: prayers.Fajr },
        { name: 'Dhuhr', time: prayers.Dhuhr },
        { name: 'Asr', time: prayers.Asr },
        { name: 'Maghrib', time: prayers.Maghrib },
        { name: 'Isha', time: prayers.Isha }
    ];

    for (let p of prayerList) {
        const pTime = new Date();
        const [h, m] = p.time.split(':').map(Number);
        pTime.setHours(h, m, 0);

        if (pTime > now) {
            return { name: p.name, time: pTime };
        }
    }

    // If all passed, next is Fajr tomorrow (Handle simple case)
    const tomorrowFajr = new Date();
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    const [h, m] = prayers.Fajr.split(':').map(Number);
    tomorrowFajr.setHours(h, m, 0);
    return { name: 'Fajr', time: tomorrowFajr };
}

// Run Updates
setInterval(() => {
    updateHeroTime();
    updateAtmosphere();
    updateFlightBar();
    // Quote refresh can be less frequent or static
}, 1000);

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

// --- Tasbeeh Logic ---
let tasbeehCount = 0;

// New Widget Function (Dhikr 1)
window.incrementWidgetTasbeeh = () => {
    tasbeehCount++;
    // Haptic feedback (if supported)
    if (navigator.vibrate) navigator.vibrate(10);

    const dhikr1 = document.getElementById('dhikr-1-count');
    if (dhikr1) dhikr1.textContent = tasbeehCount;

    // Legacy
    const widgetDisplay = document.getElementById('widget-tasbeeh-count');
    if (widgetDisplay) widgetDisplay.textContent = tasbeehCount;
};

// Legacy support (if elements exist)
const tasbeehBtn = document.getElementById('tasbeeh-btn');
const tasbeehDisplay = document.getElementById('tasbeeh-count');

if (tasbeehBtn && tasbeehDisplay) {
    tasbeehBtn.addEventListener('click', () => {
        tasbeehCount++;
        tasbeehDisplay.textContent = tasbeehCount;
        // Pulse animation
        tasbeehDisplay.style.transform = "scale(1.2)";
        setTimeout(() => tasbeehDisplay.style.transform = "scale(1)", 100);

        // Sync widget
        const widgetDisplay = document.getElementById('widget-tasbeeh-count');
        if (widgetDisplay) widgetDisplay.textContent = tasbeehCount;
    });
}

window.resetTasbeeh = () => {
    tasbeehCount = 0;
    if (tasbeehDisplay) tasbeehDisplay.textContent = 0;
    const widgetDisplay = document.getElementById('widget-tasbeeh-count');
    if (widgetDisplay) widgetDisplay.textContent = 0;
};

// --- Qibla Mock Logic (Compass) ---
// Update both compasses if they exist
const arrow = document.getElementById('qibla-arrow');
const widgetArrow = document.getElementById('widget-qibla-arrow');

const setQibla = (deg) => {
    if (arrow) arrow.style.transform = `translateX(-50%) rotate(${deg}deg)`;
    if (widgetArrow) widgetArrow.style.transform = `translateX(-50%) rotate(${deg}deg)`;
};

setQibla(45); // Init


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
    const cards = document.querySelectorAll('.prayer-card, .asma-card, .glass-container, .value-card');
    cards.forEach(card => new VanillaTilt(card));
});

/* --- Dynamic Hero Logic (Bento Grid) --- */
function updateHeroTime() {
    const now = new Date();
    const hours = now.getHours();
    const isNight = hours < 6 || hours > 18;

    // Toggle Mode Class on Body
    if (isNight) {
        document.body.classList.add('night-mode');
        document.body.classList.remove('morning-mode');
    } else {
        document.body.classList.remove('night-mode');
        document.body.classList.add('morning-mode');
    }

    // Update Time Text
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeEl = document.getElementById('current-time-display');
    if (timeEl) timeEl.textContent = timeStr;

    // Update Next Prayer logic (Simplified for demo)
    const timerEl = document.getElementById('next-prayer-timer');
    if (timerEl) {
        // Mock countdown logic
        const nextPrayer = new Date();
        nextPrayer.setHours(hours + 1);
        nextPrayer.setMinutes(0);
        const diff = nextPrayer - now;
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        timerEl.textContent = `00:${m < 10 ? '0' + m : m}`;
    }
}

// Initial call
updateHeroTime();
