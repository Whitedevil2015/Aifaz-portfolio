
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE VARIABLES ---
    let coordinates = { lat: 18.5204, lng: 73.8567 }; // Default: Pune
    let prayerTimesRaw = {};
    let nextPrayerName = '';
    let isAzaanPlaying = false;
    let allHadiths = []; // For search
    let countdownInterval = null;
    // Ramadan State
    let ramadanUseCoords = false;
    let ramadanLat = 0;
    let ramadanLng = 0;
    let globalCity = "Hyderabad";
    let globalCountry = "India";

    // --- DOM ELEMENTS ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');
    const cityInput = document.getElementById('prayer-city-input');
    const searchBtn = document.getElementById('portal-search-btn');
    const autoLocBtn = document.getElementById('update-location-btn');
    const searchInput = document.getElementById('hadith-search');
    const themeBtn = document.getElementById('theme-toggle');

    // --- NAVIGATION LOGIC ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active', 'bg-[#fdfaf6]/10', 'border-[#c5a059]');
                l.classList.add('border-transparent');
                l.querySelector('i').classList.remove('text-[#c5a059]');
                l.querySelector('i').classList.add('text-[#c5a059]/80');
            });
            link.classList.add('active', 'bg-[#fdfaf6]/10', 'border-[#c5a059]');
            link.classList.remove('border-transparent');
            link.querySelector('i').classList.add('text-[#c5a059]');
            link.querySelector('i').classList.remove('text-[#c5a059]/80');

            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => sec.classList.add('hidden'));
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.remove('hidden');

            if (targetId === 'view-library') loadLibrary();

        });
    });

    // --- THEME TOGGLE ---
    themeBtn?.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun text-yellow-400"></i>' : '<i class="fas fa-moon"></i>';
    });
    // Init Theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeBtn.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
    }


    // --- PRAYER ENGINE (REAL-TIME) ---
    async function updateMasterDates() {
        const hDateEl = document.getElementById('hero-hijri-date');
        const gDateEl = document.getElementById('hero-greg-date');
        const headerDate = document.getElementById('portal-current-date');
        const localTimeEl = document.getElementById('local-time');

        setInterval(() => {
            if (localTimeEl) localTimeEl.textContent = new Date().toLocaleTimeString();
        }, 1000);

        const now = new Date();
        if (headerDate) headerDate.innerHTML = `<span style="color:#24423a">${now.toLocaleDateString('en-US', { weekday: 'long' })}</span>, ${now.toLocaleDateString()}`;

        try {
            const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
            const data = await res.json();
            if (data.code === 200) {
                const h = data.data.hijri;
                const g = data.data.gregorian;
                if (hDateEl) hDateEl.innerHTML = `<span class="text-2xl font-bold text-[#c5a059]">${h.day}</span> ${h.month.en} ${h.year} AH`;
                if (gDateEl) gDateEl.innerHTML = `<span class="text-2xl font-bold text-blue-600">${g.day}</span> ${g.month.en} ${g.year} AD`;
            }
        } catch (e) { }
    }

    // --- ATMOSPHERIC WEATHER ---
    async function fetchAtmosphere(lat, lng) {
        try {
            console.log(`Fetching weather: ${lat}, ${lng}`);
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
            const data = await res.json();
            const code = data.current_weather.weathercode;
            console.log(`Weather Code: ${code}`);

            document.body.classList.remove('weather-clear', 'weather-clouds', 'weather-rain', 'weather-snow');

            let theme = 'weather-clear'; // Default
            let icon = '☀️';

            if (code <= 3) { theme = 'weather-clear'; icon = '☀️'; }
            else if (code <= 48) { theme = 'weather-clouds'; icon = '☁️'; }
            else if (code <= 67 || code >= 80) { theme = 'weather-rain'; icon = '🌧️'; }
            else if (code >= 71) { theme = 'weather-snow'; icon = '❄️'; }

            document.body.classList.add(theme);

            // Visual Confirmation in UI
            const locLabel = document.getElementById('portal-location-label');
            if (locLabel) {
                const currentText = locLabel.textContent.split(' • ')[0]; // Keep city
                locLabel.innerHTML = `${currentText} • <span class="text-sm font-normal">${icon} ${theme.replace('weather-', '').toUpperCase()}</span>`;
            }

        } catch (e) {
            console.warn("Atmosphere update failed", e);
            // Fallback
            document.body.classList.add('weather-clear');
        }
    }

    async function fetchPrayers(lat = null, lng = null, city = null, country = null) {
        let url = '';
        if (lat && lng) {
            url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1`;
            coordinates = { lat, lng };
            fetchAtmosphere(lat, lng);
            document.getElementById('portal-location-label').textContent = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        } else {
            const c = city || "Delhi";
            const co = country || "India";
            url = `https://api.aladhan.com/v1/timingsByCity?city=${c}&country=${co}&method=1`;
            document.getElementById('portal-location-label').textContent = `${c}, ${co}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            // Coordinate Update for Qibla
            if (!lat && data.data && data.data.meta) {
                coordinates = { lat: data.data.meta.latitude, lng: data.data.meta.longitude };
                fetchAtmosphere(data.data.meta.latitude, data.data.meta.longitude);
                if (typeof initQibla === 'function') initQibla();
            }

            if (data.code === 200) {
                prayerTimesRaw = data.data.timings;
                renderPrayerGrid(prayerTimesRaw);
                renderPrayerGuide(prayerTimesRaw);
                updateNextPrayer();
            }
        } catch (e) { console.error("Prayer fetch failed", e); }
    }

    // Nafil Data & Virtue Logic
    // Prayer Data & Virtue Logic
    window.PRAYER_INFO = {
        // Farz
        'Fajr': {
            hadith: "Whoever prays the dawn prayer (Fajr) is under the protection of Allah.",
            ref: "Sahih Muslim",
            icon: "fa-cloud-sun"
        },
        'Dhuhr': {
            hadith: "This is an hour when the gates of heaven are opened, and I love that a righteous deed should rise up for me in it.",
            ref: "Jami At-Tirmidhi",
            icon: "fa-sun"
        },
        'Asr': {
            hadith: "Whoever prays the two cool prayers (Asr and Fajr) will enter Paradise.",
            ref: "Sahih Al-Bukhari",
            icon: "fa-cloud-sun-rain"
        },
        'Maghrib': {
            hadith: "My Ummah will continue to be upon good (Fitrah) as long as they hasten the Maghrib prayer.",
            ref: "Sunan Abu Dawud",
            icon: "fa-moon"
        },
        'Isha': {
            hadith: "Whoever prays Isha in congregation, it is as if he has spent half the night in prayer.",
            ref: "Sahih Muslim",
            icon: "fa-star"
        },
        // Nafil
        'Tahajjud': {
            hadith: "The best prayer after the obligatory prayers is the night prayer.",
            ref: "Sahih Muslim",
            icon: "fa-cloud-moon"
        },
        'Ishraq': {
            hadith: "Whoever prays Fajr in congregation, then sits remembering Allah until sunrise, then prays two rak'ahs, will get the reward of a complete Hajj and Umrah.",
            ref: "Jami At-Tirmidhi",
            icon: "fa-sun"
        },
        'Chasht (Duha)': {
            hadith: "Charity is due upon every joint of the people for every day upon which the sun rises... and two rak'ahs which one prays in the Duha suffices for that.",
            ref: "Sahih Muslim",
            icon: "fa-sun"
        },
        'Awwabin': {
            hadith: "Whoever prays six rak'ahs after Maghrib without speaking ill between them, it is equivalent to the worship of twelve years.",
            ref: "Jami At-Tirmidhi",
            icon: "fa-moon"
        }
    };

    window.openFazilat = function (name) {
        const info = window.PRAYER_INFO[name];
        if (!info) return;
        document.getElementById('fazilat-title').textContent = name;
        document.getElementById('fazilat-text').textContent = `"${info.hadith}"`;
        document.getElementById('fazilat-ref').textContent = `— ${info.ref}`;

        const iconEl = document.getElementById('fazilat-icon');
        iconEl.className = `fas ${info.icon}`;

        const modal = document.getElementById('fazilat-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    function renderPrayerGuide(timings) {
        const farzGrid = document.getElementById('farz-guide-grid');
        const nafilGrid = document.getElementById('nafil-guide-grid');
        if (!farzGrid) return;

        // Helpers
        const addMins = (t, m) => {
            if (!t) return '--:--';
            const [hh, mm] = t.split(':').map(Number);
            const d = new Date(); d.setHours(hh, mm + m);
            return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        };
        const getMidpoint = (t1, t2) => {
            if (!t1 || !t2) return '--:--';
            const [h1, m1] = t1.split(':').map(Number);
            const [h2, m2] = t2.split(':').map(Number);
            const min1 = h1 * 60 + m1;
            const min2 = h2 * 60 + m2;
            const mid = Math.floor((min1 + min2) / 2);
            const h = Math.floor(mid / 60);
            const m = mid % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };
        const fmt = (t) => t ? formatTo12Hour(t) : '--:--';

        // -- CALCULATIONS --
        // Farz
        const farzData = [
            { name: 'Fajr', time: `${fmt(timings.Fajr)} - ${fmt(timings.Sunrise)}`, rakat: '2 Sunnah, 2 Farz', icon: 'fa-cloud-sun' },
            { name: 'Dhuhr', time: `${fmt(timings.Dhuhr)} - ${fmt(timings.Asr)}`, rakat: '4 Sunnah, 4 Farz, 2 Sunnah, 2 Nafl', icon: 'fa-sun' },
            { name: 'Asr', time: `${fmt(timings.Asr)} - ${fmt(timings.Maghrib)}`, rakat: '4 Sunnah (Ghair Muakkada), 4 Farz', icon: 'fa-cloud-sun-rain' },
            { name: 'Maghrib', time: `${fmt(timings.Maghrib)} - ${addMins(timings.Maghrib, 80)}`, rakat: '3 Farz, 2 Sunnah, 2 Nafl', icon: 'fa-moon' },
            { name: 'Isha', time: `${fmt(timings.Isha)} - ${fmt(timings.Fajr)}`, rakat: '4 Sunnah, 4 Farz, 2 Sunnah, 2 Nafl, 3 Witr, 2 Nafl', icon: 'fa-star' }
        ];

        // Nafil
        const ishraqStart = addMins(timings.Sunrise, 15);
        const chashtStart = addMins(timings.Sunrise, 20);
        const chashtEnd = addMins(timings.Dhuhr, -15);
        const chashtMid = getMidpoint(chashtStart, chashtEnd);

        const awwabinStart = addMins(timings.Maghrib, 20);
        const tahajjudStart = timings.Lastthird || timings.Midnight;
        const tahajjudEnd = timings.Fajr;

        const nafilData = [
            {
                name: 'Tahajjud',
                time: `${fmt(tahajjudStart)} - ${fmt(tahajjudEnd)}`,
                rakat: '2 - 12 (Sets of 2)',
                desc: 'The most virtuous Nafil prayer. Recite Quran extensively.',
                icon: 'fa-cloud-moon',
                badge: 'Best Time'
            },
            {
                name: 'Ishraq',
                time: `Starts ${fmt(ishraqStart)}`,
                rakat: '2 or 4',
                desc: 'Approx 15 mins after Sunrise.',
                icon: 'fa-sun',
                badge: 'Sunrise + 15m'
            },
            {
                name: 'Chasht (Duha)',
                time: `${fmt(chashtStart)} - ${fmt(chashtEnd)}`,
                rakat: '2 - 8 (Sets of 2)',
                desc: `Best time: ~${fmt(chashtMid)} (Midpoint).`,
                icon: 'fa-sun',
                badge: 'Recommended'
            },
            {
                name: 'Awwabin',
                time: `${fmt(awwabinStart)} - ${fmt(timings.Isha)}`,
                rakat: '6 - 20 (Sets of 2)',
                desc: 'After Maghrib Sunnah.',
                icon: 'fa-moon'
            }
        ];

        // RENDER FARZ
        farzGrid.innerHTML = farzData.map(d => `
            <div class="glass p-6 rounded-2xl border-l-4 border-emerald-500 relative overflow-hidden group hover:-translate-y-1 transition-transform dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all" onclick="openFazilat('${d.name}')">
                <div class="absolute -right-4 -top-4 opacity-10 text-8xl text-emerald-500"><i class="fas ${d.icon}"></i></div>
                <h3 class="text-2xl font-bold text-[#24423a] mb-1 font-[Cormorant_Garamond] dark:text-white group-hover:underline decoration-emerald-500/50 underline-offset-4 decoration-2">${d.name} <i class="fas fa-info-circle text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 align-middle"></i></h3>
                <p class="text-sm text-gray-500 font-mono mb-3 dark:text-gray-400">${d.time}</p>
                <div class="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                     <p class="text-xs font-bold text-emerald-700 uppercase mb-1 dark:text-emerald-400">Rakats</p>
                     <p class="text-sm font-medium text-gray-800 dark:text-gray-200">${d.rakat}</p>
                </div>
            </div>
        `).join('');

        // RENDER NAFIL
        nafilGrid.innerHTML = nafilData.map(d => `
            <div class="glass p-6 rounded-2xl border-t-4 border-[#c5a059] bg-[#c5a059]/5 relative overflow-hidden group hover:-translate-y-1 transition-transform dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all" onclick="openFazilat('${d.name}')">
                ${d.badge ? `<div class="absolute top-0 right-0 bg-[#c5a059] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm">${d.badge}</div>` : ''}
                <div class="absolute -right-4 -top-4 opacity-10 text-8xl text-[#c5a059]"><i class="fas ${d.icon}"></i></div>
                <h3 class="text-2xl font-bold text-[#24423a] mb-1 font-[Cormorant_Garamond] dark:text-[#c5a059] group-hover:underline decoration-[#c5a059]/50 underline-offset-4 decoration-2">${d.name} <i class="fas fa-info-circle text-xs text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity ml-2 align-middle"></i></h3>
                <p class="text-xs text-[#c5a059] uppercase tracking-widest font-bold mb-3">Window</p>
                <div class="text-2xl font-mono font-bold text-gray-800 mb-3 dark:text-gray-200">${d.time}</div>
                <div class="mb-3 p-2 bg-[#fdfaf6]/50 rounded border border-[#c5a059]/20 w-fit backdrop-blur-sm dark:bg-black/20">
                    <span class="text-xs font-bold text-[#c5a059] uppercase">Rakat:</span> <span class="text-sm font-bold dark:text-white">${d.rakat}</span>
                </div>
                <p class="text-sm text-gray-600 italic leading-relaxed dark:text-gray-400">${d.desc}</p>
            </div>
        `).join('');
    }

    // Auto Location Logic
    autoLocBtn?.addEventListener('click', () => {
        if (navigator.geolocation) {
            autoLocBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finding...';
            navigator.geolocation.getCurrentPosition(pos => {
                fetchPrayers(pos.coords.latitude, pos.coords.longitude);
                autoLocBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Auto';
            }, () => {
                alert("Location access denied. Using default.");
                autoLocBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Auto';
                fetchPrayers(null, null, "Pune");
            });
        }
    });

    // Manual Search
    searchBtn?.addEventListener('click', () => {
        const val = cityInput.value;
        if (val) fetchPrayers(null, null, val);
    });


    function renderPrayerGrid(timings) {
        const grid = document.getElementById('prayer-times-grid');
        if (!grid) return;

        const isFriday = new Date().getDay() === 5;
        if (isFriday) document.body.classList.add('friday-mode');
        else document.body.classList.remove('friday-mode');

        // Friday Banner Logic
        if (isFriday && !document.getElementById('friday-banner')) {
            const banner = document.createElement('div');
            banner.id = 'friday-banner';
            banner.className = 'col-span-full bg-gradient-to-r from-[#24423a] to-[#0f2b19] p-6 rounded-2xl shadow-xl border border-[#c5a059]/30 mb-6 text-white relative overflow-hidden animate-fade-in-up';
            banner.innerHTML = `
                <div class="absolute top-0 right-0 w-64 h-64 bg-[#c5a059] opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div class="text-center md:text-left">
                        <h2 class="text-3xl font-[Cormorant_Garamond] font-bold text-[#c5a059] mb-2">Jumu'ah Mubarak!</h2>
                        <p class="text-sm opacity-90 mb-4 font-light">Don't forget the Sunnah acts of this blessed day.</p>
                        <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span class="px-3 py-1 bg-[#fdfaf6]/10 rounded-full text-xs border border-[#c5a059]/30 flex items-center gap-2 backdrop-blur-md"><i class="fas fa-book-open text-[#c5a059]"></i> Surah Al-Kahf</span>
                            <span class="px-3 py-1 bg-[#fdfaf6]/10 rounded-full text-xs border border-[#c5a059]/30 flex items-center gap-2 backdrop-blur-md"><i class="fas fa-comment-dots text-[#c5a059]"></i> Durood</span>
                            <span class="px-3 py-1 bg-[#fdfaf6]/10 rounded-full text-xs border border-[#c5a059]/30 flex items-center gap-2 backdrop-blur-md"><i class="fas fa-hands-praying text-[#c5a059]"></i> Dua (Hour of Acceptance)</span>
                        </div>
                    </div>
                    <div class="text-center shrink-0">
                         <a href="#" onclick="document.querySelector('[data-target=view-quran]').click(); setTimeout(() => openReader(18, 'Al-Kahf', 'surah'), 500);" class="inline-flex items-center px-6 py-2 bg-[#c5a059] text-[#0f2b19] font-bold rounded-full hover:bg-[#fdfaf6] transition-all shadow-lg shadow-[#c5a059]/20 transform hover:-translate-y-1">
                             <i class="fas fa-quran mr-2"></i> Read Kahf
                         </a>
                    </div>
                </div>
            `;
            // Insert before grid. Grid might be in a wrapper. 
            // In index.html, grid is inside a div.
            // I'll prepend to the parent of grid?
            // Actually, inserting it simply BEFORE the grid element is safest.
            grid.parentNode.insertBefore(banner, grid);
        }

        const prayers = [
            { id: 'Fajr', icon: 'fa-cloud-sun' },
            { id: 'Sunrise', icon: 'fa-sun' },
            { id: 'Dhuhr', icon: 'fa-sun', label: isFriday ? "Jumu'ah" : "Dhuhr" },
            { id: 'Asr', icon: 'fa-cloud-sun-rain' },
            { id: 'Maghrib', icon: 'fa-moon' },
            { id: 'Isha', icon: 'fa-star' }
        ];

        grid.innerHTML = prayers.map(p => `
            <div id="card-${p.id}" onclick="openFazilat('${p.id}')" class="glass cursor-pointer p-4 rounded-2xl text-center border border-white/20 relative group transition-all duration-500 hover:-translate-y-2 dark:bg-gray-800/40 ${p.label === "Jumu'ah" ? 'border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.15)]' : ''}">
                <div class="absolute -right-6 -top-6 opacity-10 text-7xl text-[#c5a059] group-hover:rotate-12 transition-transform"><i class="fas ${p.icon}"></i></div>
                <div class="w-10 h-10 mx-auto bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                    <i class="fas ${p.icon}"></i>
                </div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 dark:text-gray-400 ${p.label === "Jumu'ah" ? 'text-[#c5a059]' : ''}">${p.label || p.id}</p>
                <p class="text-2xl font-[Amiri] font-bold text-gray-800 dark:text-white group-hover:text-[#c5a059] transition-colors">${formatTo12Hour(timings[p.id])}</p>
            </div>
        `).join('');
    }

    function formatTo12Hour(time24) {
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours);
        const suffix = h >= 12 ? 'PM' : 'AM';
        const h12 = ((h + 11) % 12 + 1);
        return `${h12}:${minutes} ${suffix}`;
    }

    function updateNextPrayer() {
        const timings = prayerTimesRaw;
        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const now = new Date();
            let next = 'Fajr';
            let nextTimeStr = timings.Fajr;
            let minDiff = Infinity;
            const curMins = now.getHours() * 60 + now.getMinutes();
            let found = false;

            for (let p of prayers) {
                const [h, m] = timings[p].split(':');
                const pMins = parseInt(h) * 60 + parseInt(m);
                if (pMins > curMins) {
                    next = p;
                    nextTimeStr = timings[p];
                    found = true;
                    break;
                }
            }
            if (!found) {
                next = 'Fajr';
                nextTimeStr = timings.Fajr;
            }

            // Highlight Logic
            document.querySelectorAll('[id^="card-"]').forEach(el => {
                el.classList.remove('ring-2', 'ring-[#c5a059]', 'neon-glow');
                if (el.id === `card-${next}`) {
                    el.classList.add('ring-2', 'ring-[#c5a059]', 'neon-glow');
                }
            });

            document.getElementById('next-prayer-name').textContent = next;

            const [th, tm] = nextTimeStr.split(':');
            const target = new Date();
            target.setHours(th, tm, 0);
            if (!found) target.setDate(target.getDate() + 1);
            const diff = target - now;

            if (diff > 0) {
                const hrs = Math.floor(diff / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                document.getElementById('countdown').textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
        }, 1000);
    }








    // --- LIBRARY & SEARCH ---
    async function loadLibrary() {
        const view = document.getElementById('library-content');
        if (allHadiths.length > 0) return; // Already loaded

        view.innerHTML = '<div class="text-center py-20"><i class="fas fa-circle-notch fa-spin text-4xl text-[#c5a059]"></i> <p class="mt-4">Loading Knowledge Base...</p></div>';

        // Mock Large Data for Searchability
        // In production, fetch this from the JSON endpoint provided
        const mockData = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            text: `Hadith text sample ${i + 1}. Whoever does good is like the one who guides to it. Example text for search functionality.`,
            ref: `Bukhari ${1000 + i}`
        }));
        // Add some real ones
        mockData.unshift(
            { id: 999, text: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.", ref: "Bukhari 1" },
            { id: 998, text: "A Muslim is the one who avoids harming Muslims with his tongue and hands.", ref: "Bukhari 10" },
            { id: 997, text: "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.", ref: "Bukhari 13" }
        );
        allHadiths = mockData;
        renderHadiths(allHadiths);

        // Init Search Listener
        searchInput?.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allHadiths.filter(h => h.text.toLowerCase().includes(term) || h.ref.toLowerCase().includes(term));
            renderHadiths(filtered);
        });
    }

    function renderHadiths(list) {
        const view = document.getElementById('library-content');
        if (list.length === 0) {
            view.innerHTML = '<div class="text-center py-10 opacity-50">No Hadiths found matching your search.</div>';
            return;
        }
        view.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                ${list.map(h => `
                    <div class="bg-[#fffbf0] p-8 rounded-tr-3xl rounded-bl-3xl shadow-md border border-[#c5a059]/20 hover:shadow-lg transition-all relative dark:bg-gray-800 dark:border-gray-700">
                        <i class="fas fa-quote-right absolute top-4 right-4 text-[#c5a059]/20 text-4xl"></i>
                        <h4 class="font-bold text-[#24423a] mb-4 uppercase tracking-widest text-xs dark:text-[#c5a059]">Hadith #${h.id}</h4>
                        <p class="text-xl font-serif text-gray-800 leading-relaxed mb-4 dark:text-gray-200">"${h.text}"</p>
                        <div class="text-sm font-bold text-[#c5a059] border-t border-[#c5a059]/20 pt-4 flex justify-between items-center">
                            <span>Reference: ${h.ref}</span>
                            <button class="text-gray-400 hover:text-[#24423a]"><i class="fas fa-share-alt"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // --- DAILY VERSE MODAL ---
    const dailyVerses = [
        { t: "Indeed, with hardship [will be] ease.", r: "Surah Ash-Sharh 94:6" },
        { t: "So remember Me; I will remember you.", r: "Surah Al-Baqarah 2:152" },
        { t: "And He is with you wherever you are.", r: "Surah Al-Hadid 57:4" }
    ];
    function showDailyVerse() {
        const verse = dailyVerses[Math.floor(Math.random() * dailyVerses.length)];
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 transition-opacity duration-700';
        modal.innerHTML = `
            <div class="bg-[#fdfaf6] rounded-2xl max-w-lg w-full p-10 text-center relative transform scale-90 transition-transform duration-500 shadow-2xl border-4 border-[#c5a059]/30 dark:bg-gray-900 border-gray-700">
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500"><i class="fas fa-times text-xl"></i></button>
                <div class="w-16 h-1 bg-[#c5a059] mx-auto mb-6 rounded-full"></div>
                <h3 class="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4 dark:text-gray-400">Verse of the Moment</h3>
                <p class="text-3xl font-[Cormorant_Garamond] font-bold text-[#24423a] mb-6 leading-tight dark:text-white">"${verse.t}"</p>
                <p class="text-[#c5a059] font-semibold font-serif italic">— ${verse.r}</p>
                <button onclick="this.closest('.fixed').remove()" class="mt-8 px-8 py-3 bg-[#24423a] text-white rounded-full font-bold hover:bg-[#24423a] transition-colors shadow-lg">Bismillah</button>
            </div>
        `;
        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-90');
            modal.querySelector('div').classList.add('scale-100');
        });
    }

    // --- OTHER LOGIC (QURAN, NAMES, DUAS) ---
    // (Preserved from previous, just re-rendering to ensure scope)
    const quranModal = document.getElementById('quran-modal');
    const quranContentEl = document.getElementById('quran-content');
    const audioPlayer = document.getElementById('quran-audio');
    let currentPlaylist = [];
    let currentAudioIndex = 0;

    // Quran Directory Logic
    let currentDirType = 'surah';

    window.switchQuranTab = function (type) {
        currentDirType = type;
        const btnSurah = document.getElementById('tab-surah-btn');
        const btnPara = document.getElementById('tab-para-btn');
        if (btnSurah) btnSurah.className = type === 'surah' ? "text-lg font-bold px-6 py-2 text-[#24423a] border-b-2 border-[#24423a] transition-all" : "text-lg font-bold px-6 py-2 text-gray-400 hover:text-[#24423a] border-b-2 border-transparent hover:border-[#24423a]/30 transition-all";
        if (btnPara) btnPara.className = type === 'para' ? "text-lg font-bold px-6 py-2 text-[#24423a] border-b-2 border-[#24423a] transition-all" : "text-lg font-bold px-6 py-2 text-gray-400 hover:text-[#24423a] border-b-2 border-transparent hover:border-[#24423a]/30 transition-all";
        loadDirectory(type);
    }

    async function loadDirectory(type = 'surah') {
        const grid = document.getElementById('surah-index-grid');
        if (!grid) return;

        grid.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-circle-notch fa-spin text-[#c5a059] text-2xl"></i></div>';

        if (type === 'surah') {
            try {
                const res = await fetch('https://api.alquran.cloud/v1/surah');
                const data = await res.json();
                grid.innerHTML = data.data.map(s => `
                    <div class="glass-container p-6 rounded-xl cursor-pointer hover:bg-[#fdfaf6]/50 transition-all hover-card-3d border border-transparent hover:border-[#c5a059]/30 dark:bg-gray-800 dark:border-gray-700" onclick="openReader(${s.number}, '${s.englishName}', 'surah')">
                         <div class="flex justify-between items-start">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#24423a] to-[#24423a] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-lg">${s.number}</div>
                            <div class="text-right text-[#24423a] font-serif text-2xl drop-shadow-sm dark:text-[#c5a059]">${s.name.replace('سُورَةُ ', '')}</div>
                         </div>
                         <h3 class="font-bold text-xl text-gray-800 dark:text-white">${s.englishName}</h3>
                         <p class="text-sm text-gray-500 dark:text-gray-400">${s.englishNameTranslation}</p>
                    </div>
                `).join('');
                // Sidebar List Update
                const list = document.getElementById('surah-list');
                if (list) list.innerHTML = data.data.map(s => `<div class="cursor-pointer p-2 hover:bg-[#fdfaf6]/10 text-xs text-gray-300 hover:text-white" onclick="openReader(${s.number}, '${s.englishName}', 'surah')">${s.number}. ${s.englishName}</div>`).join('');
            } catch (e) { grid.innerHTML = 'Error loading.'; }
        } else {
            // PARA / JUZ (1-30)
            const paras = Array.from({ length: 30 }, (_, i) => i + 1);
            grid.innerHTML = paras.map(p => `
                 <div class="glass-container p-6 rounded-xl cursor-pointer hover:bg-[#fdfaf6]/50 transition-all hover-card-3d border border-transparent hover:border-[#c5a059]/30 dark:bg-gray-800 dark:border-gray-700" onclick="openReader(${p}, 'Juz ${p}', 'juz')">
                      <div class="flex justify-between items-start">
                         <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#24423a] to-[#24423a] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-lg">${p}</div>
                         <div class="text-right text-[#24423a] font-serif text-2xl drop-shadow-sm dark:text-[#c5a059]">جزء ${p}</div>
                      </div>
                      <h3 class="font-bold text-xl text-gray-800 dark:text-white">Juz ${p}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Para ${p}</p>
                 </div>
             `).join('');
            // Sidebar List Update for Para? Maybe skip or update.
            const list = document.getElementById('surah-list');
            if (list) list.innerHTML = paras.map(p => `<div class="cursor-pointer p-2 hover:bg-[#fdfaf6]/10 text-xs text-gray-300 hover:text-white" onclick="openReader(${p}, 'Juz ${p}', 'juz')">Para ${p}</div>`).join('');
        }
    }

    window.openReader = function (num, name, type = 'surah') {
        if (quranModal) quranModal.style.display = 'flex';
        document.getElementById('reader-title').textContent = type === 'surah' ? `Surah ${name}` : `${name}`;
        fetchQuranContent(num, type);
    }

    async function fetchQuranContent(num, type = 'surah') {
        const quranContentEl = document.getElementById('quran-content');
        quranContentEl.innerHTML = '<div class="text-center mt-20"><i class="fas fa-circle-notch fa-spin text-4xl text-[#c5a059]"></i></div>';
        try {
            const endpoint = type === 'juz' ? `juz/${num}` : `surah/${num}`;
            // Hinglish only supported for Surah currently
            const fetchHinglish = type === 'surah'
                ? fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-abulaalamaududi-la/${num}.json`)
                : Promise.resolve({ json: () => ({ chapter: [] }) });

            const [arRes, enRes, trRes, urRes, hiRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/${endpoint}`),
                fetch(`https://api.alquran.cloud/v1/${endpoint}/en.sahih`),
                fetch(`https://api.alquran.cloud/v1/${endpoint}/en.transliteration`),
                fetch(`https://api.alquran.cloud/v1/${endpoint}/ur.jalandhry`),
                fetchHinglish
            ]);

            const arData = await arRes.json();
            const enData = await enRes.json();
            const trData = await trRes.json();
            const urData = await urRes.json();
            const hiData = await hiRes.json(); // Might be partial for Juz or empty wrapper

            quranContentEl.innerHTML = arData.data.ayahs.map((a, i) => `
                <div class="mb-8 border-b border-white/5 pb-8 group hover:bg-[#fdfaf6]/5 p-4 rounded-lg transition-colors cursor-pointer" onclick="playVerse(${i})">
                    <div class="flex justify-between items-center mb-4">
                        <span class="w-8 h-8 rounded-full border border-[#c5a059] text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white flex items-center justify-center text-xs ml-4 font-mono transition-colors">${a.numberInSurah}</span>
                        <div class="text-right font-[Amiri] text-3xl leading-relaxed text-white drop-shadow-md" style="direction:rtl;">${a.text}</div>
                    </div>
                    
                    <!-- Roman English (Transliteration) -->
                    <div class="text-[#c5a059] text-sm mb-2 italic font-serif opacity-90 tracking-wide">${trData.data.ayahs[i].text}</div>
                    
                    <!-- English Translation -->
                    <div class="text-gray-300 text-lg leading-relaxed mb-3">${enData.data.ayahs[i].text}</div>

                    <!-- Hinglish Tarjuma (Roman Urdu) -->
                    <div class="text-emerald-300 text-lg mb-2 italic font-medium leading-relaxed" style="font-family: 'Inter', sans-serif;">"${hiData.chapter[i]?.text || ''}"</div>
                    
                    <!-- Urdu Script Tarjuma -->
                    <div class="text-emerald-100/90 text-xl font-[Amiri] leading-loose text-right dir-rtl border-t border-white/5 pt-2 mt-2" style="direction:rtl;">${urData.data.ayahs[i].text}</div>
                </div>
            `).join('');

            window.currentSurahData = arData; // Global Store

            // --- AUDIO PLAYLIST GENERATION ---
            // Default to Urdu
            currentPlaylist = [];
            currentAudioIndex = 0;
            arData.data.ayahs.forEach(a => {
                currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
                currentPlaylist.push(`https://cdn.islamic.network/quran/audio/64/ur.khan/${a.number}.mp3`);
            });

            if (audioPlayer) {
                audioPlayer.src = currentPlaylist[0];
                audioPlayer.onended = () => {
                    currentAudioIndex++;
                    if (currentAudioIndex < currentPlaylist.length) {
                        audioPlayer.src = currentPlaylist[currentAudioIndex];
                        audioPlayer.play();
                        highlightVerse(Math.floor(currentAudioIndex / 2));
                    } else {
                        currentAudioIndex = 0;
                        audioPlayer.src = currentPlaylist[0];
                        updatePlayIcon(false);
                    }
                };
            }
        } catch (e) { console.error(e); }
    }

    // Playback Helpers
    window.highlightVerse = function (index) {
        const verses = document.querySelectorAll('#quran-content > div');
        verses.forEach(d => d.classList.remove('bg-[#fdfaf6]/10', 'border-l-4', 'border-[#c5a059]'));

        if (verses[index]) {
            verses[index].classList.add('bg-[#fdfaf6]/10', 'border-l-4', 'border-[#c5a059]');
            verses[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    window.playSurahAudio = function (lang) {
        if (!window.currentSurahData) return;
        const data = window.currentSurahData.data.ayahs;

        currentPlaylist = [];
        data.forEach(a => {
            currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
            if (lang === 'ur') currentPlaylist.push(`https://cdn.islamic.network/quran/audio/64/ur.khan/${a.number}.mp3`);
            else if (lang === 'en') currentPlaylist.push(`https://cdn.islamic.network/quran/audio/192/en.walk/${a.number}.mp3`);
        });

        currentAudioIndex = 0;
        const player = document.getElementById('quran-audio');
        if (player) {
            player.src = currentPlaylist[0];
            player.play();
            updatePlayIcon(true);
            highlightVerse(0);
        }
    };

    function updatePlayIcon(isPlaying) {
        const icon = document.getElementById('play-icon');
        if (icon) icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play ml-1';
    }
    // Standard listeners
    document.getElementById('close-quran-btn')?.addEventListener('click', () => {
        if (quranModal) quranModal.style.display = 'none';
        if (audioPlayer) { audioPlayer.pause(); updatePlayIcon(false); }
    });

    document.getElementById('play-pause-btn')?.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            updatePlayIcon(true);
        } else {
            audioPlayer.pause();
            updatePlayIcon(false);
        }
    });

    // Play Verse Handler
    window.playVerse = function (index) {
        if (!currentPlaylist || currentPlaylist.length === 0) return;
        currentAudioIndex = index * 2;
        const player = document.getElementById('quran-audio');
        if (player) {
            player.src = currentPlaylist[currentAudioIndex];
            player.play();
        }
    };

    // Names
    async function loadNames() {
        const grid = document.getElementById('asma-grid');
        if (!grid) return;
        try {
            const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
            const data = await res.json();
            grid.innerHTML = data.data.map((n, i) => {
                const hue = (i * 15) % 360;
                return `
                <div class="bg-[#fdfaf6] p-6 rounded-xl shadow-sm text-center border-t-4 hover:-translate-y-1 transition-transform relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700" style="border-color:hsl(${hue}, 60%, 40%)">
                    <div class="text-xs text-gray-400 mb-2">#${n.number}</div>
                    <h3 class="name-3d text-4xl font-[Amiri] mb-2" style="color:hsl(${hue}, 70%, 30%)">${n.name}</h3>
                    <div class="font-bold text-gray-800 text-lg dark:text-white">${n.transliteration}</div>
                    <div class="text-sm text-gray-500 mt-1 dark:text-gray-400">${n.en.meaning}</div>
                </div>
            `}).join('');
        } catch (e) { }
    }

    // Duas
    const duas = [
        // Comprehensive Duas Database - 120+ Authentic Supplications
        // Categories: morning, salah, family, health, studies, food, rabbana


        // ========== MORNING & EVENING (20 Duas) ==========
        {
            cat: 'morning-evening',
            title: 'Morning Protection - Ayatul Kursi',
            ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
            tr: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
            en: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence...',
            ref: 'Al-Baqarah 2:255'
        },
        {
            cat: 'morning-evening',
            title: 'Upon Waking Up',
            ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
            tr: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
            en: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'morning-evening',
            title: 'Morning Gratitude',
            ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
            tr: "Asbahna wa asbahal-mulku lillah, walhamdu lillah",
            en: 'We have entered the morning and the dominion belongs to Allah, and all praise is for Allah.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'morning-evening',
            title: 'Morning Tasbih',
            ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
            tr: "Subhan-Allahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatihi",
            en: 'Glory is to Allah and praise is to Him, by the multitude of His creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Allah\'s Pleasure',
            ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ نَبِيًّا',
            tr: "Raditu billahi Rabban, wa bil-Islami dinan, wa bi-Muhammadin nabiyyan",
            en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'morning-evening',
            title: 'Protection from Evil',
            ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
            tr: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-'Alim",
            en: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Forgiveness',
            ar: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
            tr: "Astaghfirullaha-lladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh",
            en: 'I seek forgiveness from Allah, there is no deity except Him, the Ever-Living, the Sustainer, and I repent to Him.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Knowledge',
            ar: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي',
            tr: "Allahumma anfa'ni bima 'allamtani wa 'allimni ma yanfa'uni",
            en: 'O Allah, benefit me with what You have taught me, and teach me what will benefit me.',
            ref: 'Sunan Ibn Majah'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Barakah',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ',
            tr: "Allahumma inni as'aluka khayra hadhal-yawmi fat-hahu wa nasrahu wa nurahu wa barakatahu wa hudahu",
            en: 'O Allah, I ask You for the good of this day, its triumph, its victory, its light, its blessings and its guidance.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'morning-evening',
            title: 'Protection from Shaytan',
            ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
            tr: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
            en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'morning-evening',
            title: 'Evening Protection',
            ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
            tr: "Amsayna wa amsal-mulku lillah, walhamdu lillah",
            en: 'We have entered the evening and the dominion belongs to Allah, and all praise is for Allah.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'morning-evening',
            title: 'Evening Refuge',
            ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
            tr: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
            en: 'O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the final return.',
            ref: 'Jami At-Tirmidhi'
        },
        {
            cat: 'morning-evening',
            title: 'Before Sleeping',
            ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            tr: "Bismika Allahumma amutu wa ahya",
            en: 'In Your name, O Allah, I die and I live.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'morning-evening',
            title: 'Gratitude for New Day',
            ar: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي',
            tr: "Alhamdu lillahil-ladhi 'afani fi jasadi wa radda 'alayya ruhi",
            en: 'All praise is for Allah who has restored my health and returned my soul to me.',
            ref: 'Jami At-Tirmidhi'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Good Character',
            ar: 'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ',
            tr: "Allahummah-dini li-ahsanil-akhlaqi la yahdi li-ahsaniha illa Anta",
            en: 'O Allah, guide me to the best of characters, for none can guide to the best of them except You.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Provision',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
            tr: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
            en: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
            ref: 'Sunan Ibn Majah'
        },
        {
            cat: 'morning-evening',
            title: 'Protection from Anxiety',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
            tr: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
            en: 'O Allah, I seek refuge in You from worry and grief.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Steadfastness',
            ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
            tr: "Ya Muqallibal-qulubi thabbit qalbi 'ala dinik",
            en: 'O Turner of hearts, make my heart firm upon Your religion.',
            ref: 'Jami At-Tirmidhi'
        },
        {
            cat: 'morning-evening',
            title: 'Entering the Morning with Faith',
            ar: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ',
            tr: "Asbahna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas",
            en: 'We have entered the morning upon the natural religion of Islam and upon the word of sincerity.',
            ref: 'Musnad Ahmad'
        },
        {
            cat: 'morning-evening',
            title: 'Seeking Allah\'s Protection',
            ar: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي',
            tr: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari",
            en: 'O Allah, grant me wellness in my body. O Allah, grant me wellness in my hearing. O Allah, grant me wellness in my sight.',
            ref: 'Sunan Abu Dawud'
        },

        // ========== PRAYER/SALAH (15 Duas) ==========
        {
            cat: 'salah',
            title: 'Opening Dua (Istiftah)',
            ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
            tr: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
            en: 'Glory be to You, O Allah, and praise be to You. Blessed is Your name and exalted is Your majesty. There is no deity except You.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'salah',
            title: 'Dua in Ruku',
            ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
            tr: "Subhana Rabbiyal-'Adhim",
            en: 'Glory be to my Lord, the Most Great.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'salah',
            title: 'Rising from Ruku',
            ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ رَبَّنَا وَلَكَ الْحَمْدُ',
            tr: "Sami'Allahu liman hamidah, Rabbana wa lakal-hamd",
            en: 'Allah hears those who praise Him. Our Lord, to You belongs all praise.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'salah',
            title: 'Dua in Sujud',
            ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
            tr: "Subhana Rabbiyal-A'la",
            en: 'Glory be to my Lord, the Most High.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'salah',
            title: 'Extended Sujud Dua',
            ar: 'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي',
            tr: "Subhanaka Allahumma Rabbana wa bihamdika Allahummaghfir li",
            en: 'Glory be to You, O Allah, our Lord, and praise be to You. O Allah, forgive me.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'salah',
            title: 'Between Two Sajdahs',
            ar: 'رَبِّ اغْفِرْ لِي رَبِّ اغْفِرْ لِي',
            tr: "Rabbighfir li, Rabbighfir li",
            en: 'My Lord, forgive me. My Lord, forgive me.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'salah',
            title: 'Tashahhud (At-Tahiyyat)',
            ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
            tr: "At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh",
            en: 'All greetings, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'salah',
            title: 'Salawat on the Prophet',
            ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
            tr: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid",
            en: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'salah',
            title: 'Dua Before Tasleem',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
            tr: "Allahumma inni a'udhu bika min 'adhabi Jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-Masihid-Dajjal",
            en: 'O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'salah',
            title: 'After Tasleem - Istighfar',
            ar: 'أَسْتَغْفِرُ اللَّهَ أَسْتَغْفِرُ اللَّهَ أَسْتَغْفِرُ اللَّهَ',
            tr: "Astaghfirullah, Astaghfirullah, Astaghfirullah",
            en: 'I seek forgiveness from Allah (3 times).',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'salah',
            title: 'After Salah - Tasbih',
            ar: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ',
            tr: "SubhanAllah, Alhamdulillah, Allahu Akbar (33 times each)",
            en: 'Glory be to Allah, All praise is for Allah, Allah is the Greatest.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'salah',
            title: 'Completing 100 Tasbih',
            ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            tr: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir",
            en: 'There is no deity except Allah alone, with no partner. To Him belongs the dominion and to Him belongs all praise, and He has power over all things.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'salah',
            title: 'Dua for Acceptance',
            ar: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
            tr: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
            en: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'salah',
            title: 'Seeking Jannah',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
            tr: "Allahumma inni as'alukal-Jannah wa a'udhu bika minan-Nar",
            en: 'O Allah, I ask You for Paradise and I seek refuge in You from the Fire.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'salah',
            title: 'Qunut in Witr',
            ar: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ',
            tr: "Allahummah-dini fiman hadayt, wa 'afini fiman 'afayt",
            en: 'O Allah, guide me among those You have guided, and grant me wellness among those You have granted wellness.',
            ref: 'Sunan Abu Dawud'
        },

        // ========== FAMILY & PARENTS (10 Duas) ==========
        {
            cat: 'family',
            title: 'For Parents - Mercy',
            ar: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
            tr: "Rabbir-hamhuma kama rabbayani saghira",
            en: 'My Lord, have mercy upon them as they brought me up when I was small.',
            ref: 'Al-Isra 17:24'
        },
        {
            cat: 'family',
            title: 'For Righteous Spouse',
            ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
            tr: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun",
            en: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes.',
            ref: 'Al-Furqan 25:74'
        },
        {
            cat: 'family',
            title: 'For Righteous Children',
            ar: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ',
            tr: "Rabbi hab li minas-salihin",
            en: 'My Lord, grant me righteous offspring.',
            ref: 'As-Saffat 37:100'
        },
        {
            cat: 'family',
            title: 'Protection for Family',
            ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
            en: 'Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire.',
            ref: 'Al-Baqarah 2:201'
        },
        {
            cat: 'family',
            title: 'For Parents\' Forgiveness',
            ar: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
            tr: "Rabbighfir li wa liwalidayya wa lilmu'minina yawma yaqumal-hisab",
            en: 'My Lord, forgive me and my parents and the believers the Day the account is established.',
            ref: 'Ibrahim 14:41'
        },
        {
            cat: 'family',
            title: 'For Family Unity',
            ar: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ',
            tr: "Rabbanagh-fir lana wa li-ikhwaninal-ladhina sabaquna bil-iman",
            en: 'Our Lord, forgive us and our brothers who preceded us in faith.',
            ref: 'Al-Hashr 59:10'
        },
        {
            cat: 'family',
            title: 'For Grateful Heart',
            ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ',
            tr: "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya",
            en: 'My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.',
            ref: 'Al-Ahqaf 46:15'
        },
        {
            cat: 'family',
            title: 'For Spouse\'s Love',
            ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
            tr: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun waj'alna lil-muttaqina imama",
            en: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.',
            ref: 'Al-Furqan 25:74'
        },
        {
            cat: 'family',
            title: 'For Children\'s Guidance',
            ar: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي',
            tr: "Rabbij-'alni muqimas-salati wa min dhurriyyati",
            en: 'My Lord, make me an establisher of prayer, and from my descendants.',
            ref: 'Ibrahim 14:40'
        },
        {
            cat: 'family',
            title: 'For Family\'s Well-being',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
            tr: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
            en: 'O Allah, I ask You for well-being in this world and the Hereafter.',
            ref: 'Sunan Ibn Majah'
        },

        // ========== DIFFICULTIES & HEALTH (15 Duas) ==========
        {
            cat: 'health',
            title: 'Relief from Anxiety',
            ar: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ',
            tr: "Allahumma inni 'abduka ibnu 'abdika ibnu amatika, nasiyati biyadika, madin fiyya hukmuka, 'adlun fiyya qada'uka",
            en: 'O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed and Your decree over me is just.',
            ref: 'Musnad Ahmad'
        },
        {
            cat: 'health',
            title: 'For Healing',
            ar: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ',
            tr: "Allahumma Rabban-nas, adhhibil-ba's, ishfi Antash-Shafi, la shifa'a illa shifa'uk",
            en: 'O Allah, Lord of mankind, remove the harm and heal, You are the Healer. There is no healing except Your healing.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'health',
            title: 'Relief from Debt',
            ar: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
            tr: "Allahummak-fini bihalalika 'an haramika wa aghnini bifadlika 'amman siwak",
            en: 'O Allah, suffice me with what You have allowed instead of what You have forbidden, and make me independent of all others besides You.',
            ref: 'Jami At-Tirmidhi'
        },
        {
            cat: 'health',
            title: 'In Times of Distress',
            ar: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ',
            tr: "La ilaha illallahul-'Adhimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Adhim",
            en: 'There is no deity except Allah, the Magnificent, the Forbearing. There is no deity except Allah, Lord of the Magnificent Throne.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'health',
            title: 'For Patience',
            ar: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
            tr: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana",
            en: 'Our Lord, pour upon us patience and plant firmly our feet.',
            ref: 'Al-Baqarah 2:250'
        },
        {
            cat: 'health',
            title: 'Protection from Harm',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ',
            tr: "Allahumma inni a'udhu bika minal-barasi wal-jununi wal-judhami wa min sayyi'il-asqam",
            en: 'O Allah, I seek refuge in You from leprosy, madness, elephantiasis, and evil diseases.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'health',
            title: 'For Ease',
            ar: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
            tr: "Allahumma la sahla illa ma ja'altahu sahla, wa Anta taj'alul-hazna idha shi'ta sahla",
            en: 'O Allah, there is no ease except what You make easy, and You make the difficult easy if You wish.',
            ref: 'Sahih Ibn Hibban'
        },
        {
            cat: 'health',
            title: 'For Strength',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
            tr: "Allahumma inni a'udhu bika minal-'ajzi wal-kasal",
            en: 'O Allah, I seek refuge in You from incapacity and laziness.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'health',
            title: 'Relief from Worry',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ',
            tr: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasal",
            en: 'O Allah, I seek refuge in You from worry, grief, incapacity, and laziness.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'health',
            title: 'For Recovery',
            ar: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
            tr: "As'alullaha-l'Adhima Rabbal-'Arshil-'Adhimi an yashfiyak (7 times)",
            en: 'I ask Allah the Magnificent, Lord of the Magnificent Throne, to cure you.',
            ref: 'Jami At-Tirmidhi'
        },
        {
            cat: 'health',
            title: 'For Contentment',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا بَعْدَ الْقَضَاءِ',
            tr: "Allahumma inni as'alukar-rida ba'dal-qada'",
            en: 'O Allah, I ask You for contentment after Your decree.',
            ref: 'Musnad Ahmad'
        },
        {
            cat: 'health',
            title: 'Protection from Evil',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ',
            tr: "Allahumma inni a'udhu bika min sharri ma 'amiltu wa min sharri ma lam a'mal",
            en: 'O Allah, I seek refuge in You from the evil of what I have done and from the evil of what I have not done.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'health',
            title: 'For Relief',
            ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
            tr: "Ya Hayyu Ya Qayyumu birahmatika astagheeth",
            en: 'O Ever-Living, O Sustainer, by Your mercy I seek help.',
            ref: 'Jami At-Tirmidhi'
        },
        {
            cat: 'health',
            title: 'For Cure from Illness',
            ar: 'بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ',
            tr: "Bismillahi arqika min kulli shay'in yu'dhika",
            en: 'In the name of Allah I perform ruqyah for you, from everything that harms you.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'health',
            title: 'For Steadfastness in Trial',
            ar: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
            tr: "Inna lillahi wa inna ilayhi raji'un, Allahumma'jurni fi musibati wa akhlif li khayran minha",
            en: 'To Allah we belong and to Him we shall return. O Allah, reward me in my affliction and replace it with something better.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'academic',
            title: 'For Knowledge',
            ar: 'رَبِّ زِدْنِي عِلْمًا',
            tr: "Rabbi zidni 'ilma",
            en: 'My Lord, increase me in knowledge.',
            ref: 'Ta-Ha 20:114'
        },
        {
            cat: 'academic',
            title: 'Before Studying',
            ar: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا',
            tr: "Allahumma anfa'ni bima 'allamtani wa 'allimni ma yanfa'uni wa zidni 'ilma",
            en: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.',
            ref: 'Sunan Ibn Majah'
        },
        {
            cat: 'academic',
            title: 'For Understanding',
            ar: 'اللَّهُمَّ افْتَحْ عَلَيَّ فُتُوحَ الْعَارِفِينَ',
            tr: "Allahumma-ftah 'alayya futuhal-'arifin",
            en: 'O Allah, open for me the openings of those who know.',
            ref: 'Traditional Islamic Dua'
        },
        {
            cat: 'academic',
            title: 'For Memory',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فَهْمَ النَّبِيِّينَ وَحِفْظَ الْمُرْسَلِينَ',
            tr: "Allahumma inni as'aluka fahman-nabiyyin wa hifzhal-mursalin",
            en: 'O Allah, I ask You for the understanding of the prophets and the memory of the messengers.',
            ref: 'Traditional Islamic Dua'
        },
        {
            cat: 'academic',
            title: 'For Focus',
            ar: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
            tr: "Allahumma la sahla illa ma ja'altahu sahla",
            en: 'O Allah, there is nothing easy except what You make easy.',
            ref: 'Sahih Ibn Hibban'
        },
        {
            cat: 'academic',
            title: 'Before Exam',
            ar: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
            tr: "Allahumma la sahla illa ma ja'altahu sahla, wa Anta taj'alul-hazna idha shi'ta sahla",
            en: 'O Allah, nothing is easy except what You make easy, and You make the difficult easy if You wish.',
            ref: 'Sahih Ibn Hibban'
        },
        {
            cat: 'academic',
            title: 'For Wisdom',
            ar: 'رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ',
            tr: "Rabbi hab li hukman wa alhiqni bis-salihin",
            en: 'My Lord, grant me wisdom and join me with the righteous.',
            ref: 'Ash-Shu\'ara 26:83'
        },
        {
            cat: 'academic',
            title: 'For Clear Speech',
            ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
            tr: "Rabbish-rah li sadri wa yassir li amri wahlul 'uqdatan min lisani yafqahu qawli",
            en: 'My Lord, expand for me my breast and ease for me my task, and untie the knot from my tongue that they may understand my speech.',
            ref: 'Ta-Ha 20:25-28'
        },
        {
            cat: 'academic',
            title: 'For Beneficial Knowledge',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ',
            tr: "Allahumma inni a'udhu bika min 'ilmin la yanfa'",
            en: 'O Allah, I seek refuge in You from knowledge that does not benefit.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'academic',
            title: 'For Success',
            ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
            tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan",
            en: 'Our Lord, give us good in this world and good in the Hereafter.',
            ref: 'Al-Baqarah 2:201'
        },

        // ========== FOOD & TRAVEL (10 Duas) ==========
        {
            cat: 'food-travel',
            title: 'Before Eating',
            ar: 'بِسْمِ اللَّهِ',
            tr: "Bismillah",
            en: 'In the name of Allah.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'food-travel',
            title: 'After Eating',
            ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
            tr: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
            en: 'All praise is for Allah who fed me this and provided it for me without any might nor power from myself.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'food-travel',
            title: 'Before Drinking',
            ar: 'بِسْمِ اللَّهِ',
            tr: "Bismillah",
            en: 'In the name of Allah.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'food-travel',
            title: 'After Drinking',
            ar: 'الْحَمْدُ لِلَّهِ',
            tr: "Alhamdulillah",
            en: 'All praise is for Allah.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'food-travel',
            title: 'Starting a Journey',
            ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
            tr: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
            en: 'Glory to Him who has subjected this to us, and we could never have it by our efforts. Surely, to our Lord we are returning.',
            ref: 'Az-Zukhruf 43:13-14'
        },
        {
            cat: 'food-travel',
            title: 'Entering a City',
            ar: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ وَرَبَّ الْأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ',
            tr: "Allahumma Rabbas-samawatis-sab'i wa ma adhlalna, wa Rabbal-aradinas-sab'i wa ma aqlalna",
            en: 'O Allah, Lord of the seven heavens and all that they cover, Lord of the seven earths and all that they carry.',
            ref: 'Al-Hakim'
        },
        {
            cat: 'food-travel',
            title: 'Entering Home',
            ar: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
            tr: "Bismillahi walajna, wa bismillahi kharajna, wa 'alallahi Rabbina tawakkalna",
            en: 'In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we depend.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'food-travel',
            title: 'Leaving Home',
            ar: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
            tr: "Bismillahi, tawakkaltu 'alallahi, la hawla wa la quwwata illa billah",
            en: 'In the name of Allah, I place my trust in Allah, there is no might and no power except with Allah.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'food-travel',
            title: 'Entering Masjid',
            ar: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            tr: "Allahumma-ftah li abwaba rahmatik",
            en: 'O Allah, open for me the doors of Your mercy.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'food-travel',
            title: 'Leaving Masjid',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
            tr: "Allahumma inni as'aluka min fadlik",
            en: 'O Allah, I ask You from Your bounty.',
            ref: 'Sahih Muslim'
        },

        // ========== RABBANA DUAS (40 Quranic Supplications) ==========
        {
            cat: 'rabbana',
            title: 'Rabbana 1 - For Acceptance',
            ar: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
            tr: "Rabbana taqabbal minna innaka Antas-Sami'ul-'Alim",
            en: 'Our Lord, accept this from us. Indeed, You are the Hearing, the Knowing.',
            ref: 'Al-Baqarah 2:127'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 2 - For Submission',
            ar: 'رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِنْ ذُرِّيَّتِنَا أُمَّةً مُسْلِمَةً لَكَ',
            tr: "Rabbana waj'alna muslimayni laka wa min dhurriyyatina ummatan muslimatan lak",
            en: 'Our Lord, and make us Muslims in submission to You and from our descendants a Muslim nation in submission to You.',
            ref: 'Al-Baqarah 2:128'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 3 - For Guidance',
            ar: 'رَبَّنَا وَابْعَثْ فِيهِمْ رَسُولًا مِنْهُمْ',
            tr: "Rabbana wab'ath fihim rasulan minhum",
            en: 'Our Lord, and send among them a messenger from themselves.',
            ref: 'Al-Baqarah 2:129'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 4 - For This World and Hereafter',
            ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
            en: 'Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire.',
            ref: 'Al-Baqarah 2:201'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 5 - For Patience',
            ar: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
            tr: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
            en: 'Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.',
            ref: 'Al-Baqarah 2:250'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 6 - Against Burden',
            ar: 'رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا',
            tr: "Rabbana la tu'akhidhna in nasina aw akhta'na",
            en: 'Our Lord, do not impose blame upon us if we forget or make a mistake.',
            ref: 'Al-Baqarah 2:286'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 7 - Against Heavy Burden',
            ar: 'رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا',
            tr: "Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina",
            en: 'Our Lord, and lay not upon us a burden like that which You laid upon those before us.',
            ref: 'Al-Baqarah 2:286'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 8 - For Strength',
            ar: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ',
            tr: "Rabbana wa la tuhammilna ma la taqata lana bih",
            en: 'Our Lord, and burden us not with that which we have no ability to bear.',
            ref: 'Al-Baqarah 2:286'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 9 - For Pardon',
            ar: 'رَبَّنَا وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا',
            tr: "Rabbana wa'fu 'anna waghfir lana warhamna",
            en: 'Our Lord, and pardon us, and forgive us, and have mercy upon us.',
            ref: 'Al-Baqarah 2:286'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 10 - For Victory',
            ar: 'رَبَّنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
            tr: "Rabbana Anta mawlana fansurna 'alal-qawmil-kafirin",
            en: 'Our Lord, You are our protector, so give us victory over the disbelieving people.',
            ref: 'Al-Baqarah 2:286'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 11 - Against Deviation',
            ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً',
            tr: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana mil-ladunka rahmah",
            en: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.',
            ref: 'Ali \'Imran 3:8'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 12 - For Gathering',
            ar: 'رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَا رَيْبَ فِيهِ',
            tr: "Rabbana innaka jami'un-nasi li-yawmin la rayba fih",
            en: 'Our Lord, surely You will gather the people for a Day about which there is no doubt.',
            ref: 'Ali \'Imran 3:9'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 13 - For Faith',
            ar: 'رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ',
            tr: "Rabbana innana amanna faghfir lana dhunubana wa qina 'adhaban-nar",
            en: 'Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire.',
            ref: 'Ali \'Imran 3:16'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 14 - For Belief',
            ar: 'رَبَّنَا آمَنَّا بِمَا أَنْزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ',
            tr: "Rabbana amanna bima anzalta wattaba'nar-rasula faktubna ma'ash-shahidin",
            en: 'Our Lord, we have believed in what You revealed and have followed the messenger, so register us among the witnesses.',
            ref: 'Ali \'Imran 3:53'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 15 - For Forgiveness of Sins',
            ar: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا',
            tr: "Rabbanagh-fir lana dhunubana wa israfana fi amrina",
            en: 'Our Lord, forgive us our sins and the excess committed in our affairs.',
            ref: 'Ali \'Imran 3:147'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 16 - For Steadfastness',
            ar: 'رَبَّنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
            tr: "Rabbana wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
            en: 'Our Lord, and make firm our feet and give us victory over the disbelieving people.',
            ref: 'Ali \'Imran 3:147'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 17 - Against Punishment',
            ar: 'رَبَّنَا مَا خَلَقْتَ هَذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ',
            tr: "Rabbana ma khalaqta hadha batilan subhanaka faqina 'adhaban-nar",
            en: 'Our Lord, You did not create this aimlessly; exalted are You, so protect us from the punishment of the Fire.',
            ref: 'Ali \'Imran 3:191'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 18 - For Entry to Fire',
            ar: 'رَبَّنَا إِنَّكَ مَنْ تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ',
            tr: "Rabbana innaka man tudkhilin-nara faqad akhzaytah",
            en: 'Our Lord, indeed whoever You admit to the Fire - You have disgraced him.',
            ref: 'Ali \'Imran 3:192'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 19 - For Hearing the Call',
            ar: 'رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ',
            tr: "Rabbana innana sami'na munadiyan yunadi lil-iman",
            en: 'Our Lord, indeed we have heard a caller calling to faith.',
            ref: 'Ali \'Imran 3:193'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 20 - For Sins Covered',
            ar: 'رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا',
            tr: "Rabbana faghfir lana dhunubana wa kaffir 'anna sayyi'atina",
            en: 'Our Lord, so forgive us our sins and remove from us our misdeeds.',
            ref: 'Ali \'Imran 3:193'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 21 - For Righteous Death',
            ar: 'رَبَّنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ',
            tr: "Rabbana wa tawaffana ma'al-abrar",
            en: 'Our Lord, and cause us to die with the righteous.',
            ref: 'Ali \'Imran 3:193'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 22 - For Promise Fulfillment',
            ar: 'رَبَّنَا وَآتِنَا مَا وَعَدْتَنَا عَلَى رُسُلِكَ',
            tr: "Rabbana wa atina ma wa'adtana 'ala rusulika",
            en: 'Our Lord, and grant us what You promised us through Your messengers.',
            ref: 'Ali \'Imran 3:194'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 23 - Against Disgrace',
            ar: 'رَبَّنَا وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ',
            tr: "Rabbana wa la tukhzina yawmal-qiyamah innaka la tukhliful-mi'ad",
            en: 'Our Lord, and do not disgrace us on the Day of Resurrection. Indeed, You do not fail in Your promise.',
            ref: 'Ali \'Imran 3:194'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 24 - For Mercy',
            ar: 'رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الرَّاحِمِينَ',
            tr: "Rabbana amanna faghfir lana warhamna wa Anta khayru-rahimin",
            en: 'Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.',
            ref: 'Al-Mu\'minun 23:109'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 25 - Against Evil Companions',
            ar: 'رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ إِنَّ عَذَابَهَا كَانَ غَرَامًا',
            tr: "Rabbanasrif 'anna 'adhaba Jahannama inna 'adhabaha kana gharama",
            en: 'Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering.',
            ref: 'Al-Furqan 25:65'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 26 - For Righteous Offspring',
            ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
            tr: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun",
            en: 'Our Lord, grant us from among our wives and offspring comfort to our eyes.',
            ref: 'Al-Furqan 25:74'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 27 - For Leadership',
            ar: 'رَبَّنَا وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
            tr: "Rabbana waj'alna lil-muttaqina imama",
            en: 'Our Lord, and make us an example for the righteous.',
            ref: 'Al-Furqan 25:74'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 28 - For Mercy from Lord',
            ar: 'رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
            tr: "Rabbana atina mil-ladunka rahmatan wa hayyi' lana min amrina rashada",
            en: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.',
            ref: 'Al-Kahf 18:10'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 29 - For Forgiveness',
            ar: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ',
            tr: "Rabbanagh-fir lana wa li-ikhwaninal-ladhina sabaquna bil-iman",
            en: 'Our Lord, forgive us and our brothers who preceded us in faith.',
            ref: 'Al-Hashr 59:10'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 30 - Against Hatred',
            ar: 'رَبَّنَا وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا',
            tr: "Rabbana wa la taj'al fi qulubina ghillan lil-ladhina amanu",
            en: 'Our Lord, and put not in our hearts resentment toward those who have believed.',
            ref: 'Al-Hashr 59:10'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 31 - For Kindness',
            ar: 'رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ',
            tr: "Rabbana innaka Ra'ufur-Rahim",
            en: 'Our Lord, indeed You are Kind and Merciful.',
            ref: 'Al-Hashr 59:10'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 32 - Against Disbelievers',
            ar: 'رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ',
            tr: "Rabbana 'alayka tawakkalna wa ilayka anabna wa ilaykal-masir",
            en: 'Our Lord, upon You we have relied, and to You we have returned, and to You is the destination.',
            ref: 'Al-Mumtahanah 60:4'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 33 - Against Trial',
            ar: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلَّذِينَ كَفَرُوا',
            tr: "Rabbana la taj'alna fitnatan lil-ladhina kafaru",
            en: 'Our Lord, make us not a trial for those who disbelieve.',
            ref: 'Al-Mumtahanah 60:5'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 34 - For Forgiveness',
            ar: 'رَبَّنَا وَاغْفِرْ لَنَا إِنَّكَ أَنْتَ الْعَزِيزُ الْحَكِيمُ',
            tr: "Rabbana waghfir lana innaka Antal-'Azizul-Hakim",
            en: 'Our Lord, and forgive us. Indeed, it is You who is the Exalted in Might, the Wise.',
            ref: 'Al-Mumtahanah 60:5'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 35 - For Completion of Light',
            ar: 'رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا',
            tr: "Rabbana atmim lana nurana waghfir lana",
            en: 'Our Lord, perfect for us our light and forgive us.',
            ref: 'At-Tahrim 66:8'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 36 - For Power',
            ar: 'رَبَّنَا إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            tr: "Rabbana innaka 'ala kulli shay'in Qadir",
            en: 'Our Lord, indeed You are over all things competent.',
            ref: 'At-Tahrim 66:8'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 37 - For Salvation',
            ar: 'رَبَّنَا قِنَا عَذَابَ النَّارِ',
            tr: "Rabbana qina 'adhaban-nar",
            en: 'Our Lord, protect us from the punishment of the Fire.',
            ref: 'Ali \'Imran 3:16'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 38 - For Gratitude',
            ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ',
            tr: "Rabbi awzi'ni an ashkura ni'matak",
            en: 'My Lord, enable me to be grateful for Your favor.',
            ref: 'An-Naml 27:19'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 39 - For Righteous Deeds',
            ar: 'رَبِّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ',
            tr: "Rabbi wa an a'mala salihan tardah",
            en: 'My Lord, and enable me to do righteousness of which You approve.',
            ref: 'An-Naml 27:19'
        },
        {
            cat: 'rabbana',
            title: 'Rabbana 40 - For Righteous Offspring',
            ar: 'رَبِّ وَأَدْخِلْنِي فِي عِبَادِكَ الصَّالِحِينَ',
            tr: "Rabbi wa adkhilni fi 'ibadika-ssalihin",
            en: 'My Lord, and admit me among Your righteous servants.',
            ref: 'An-Naml 27:19'
        }, {
            cat: 'rabbana',
            title: 'Good of Both Worlds',
            ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            tr: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar",
            en: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
            ref: 'Al-Baqarah 2:201'
        },
        {
            cat: 'health',
            title: 'Best Dua for Forgiveness (Sayyidul Istighfar)',
            ar: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ',
            tr: "Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, A'udhu bika min sharri ma sana'tu, Abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li fa-innahu la yaghfiru al-dhunuba illa anta",
            en: 'O Allah, You are my Lord. There is no god but You. You created me and I am Your slave. I am abiding to Your covenant and promise as best as I can. I seek refuge in You from the evil I have committed. I acknowledge Your blessings upon me and I acknowledge my sin. So forgive me, for verily no one forgives sins except You.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'morning-evening',
            title: 'Upon Waking Up',
            ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
            tr: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
            en: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
            ref: 'Sahih Al-Bukhari'
        },
        {
            cat: 'morning-evening',
            title: 'Evening Protection',
            ar: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
            tr: "A'udhu bikalimatillahi at-tammati min sharri ma khalaq",
            en: 'I seek protection in the perfect words of Allah from every evil that He has created.',
            ref: 'Sahih Muslim'
        },
        {
            cat: 'food-travel',
            title: 'Travel Dua',
            ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
            tr: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun",
            en: 'Glory to Him who has brought this [vehicle] under our control, though we were unable to control it ourselves, and indeed, to our Lord we will surely return.',
            ref: 'Az-Zukhruf 43:13-14'
        },
        {
            cat: 'food-travel',
            title: 'Before Eating',
            ar: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
            tr: "Bismillahi wa 'ala barakatillah",
            en: 'In the name of Allah and with the blessings of Allah.',
            ref: 'Sunan Abu Dawud'
        },
        {
            cat: 'food-travel',
            title: 'Leaving Home',
            ar: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
            tr: "Bismillahi tawakkaltu 'alallahi la hawla wala quwwata illa billah",
            en: 'In the name of Allah, I place my trust in Allah; there is no might and no power except by Allah.',
            ref: 'Sunan Abi Dawud'
        }
    ];

    function renderDuas(cat = 'all') {
        const grid = document.getElementById('duas-grid');
        if (!grid) return;
        const filtered = cat === 'all' ? duas : duas.filter(d => d.cat === cat);
        grid.innerHTML = filtered.map(d => `
            <div class="bg-[#fdfaf6] p-6 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow border-l-4 dark:bg-gray-800 dark:border-gray-700" style="border-left-color:#24423a">
                 <div class="absolute top-0 right-0 p-2 bg-gray-500 rounded-bl-xl text-xs font-bold text-white uppercase shadow-sm">${d.cat}</div>
                 <h3 class="font-bold text-lg mb-2 text-[#24423a] dark:text-[#c5a059]">${d.title}</h3>
                 <div class="text-right font-[Amiri] text-2xl mb-3 text-gray-700 leading-loose dark:text-gray-200" style="direction:rtl;">${d.ar}</div>
                 <div class="font-medium text-[#c5a059] mb-2 italic text-sm font-serif opacity-90">${d.tr}</div>
                 <div class="text-gray-500 text-sm italic border-t border-gray-100 pt-3 dark:border-gray-700 dark:text-gray-400">"${d.en}"</div>
                 <div class="text-xs text-gray-400 mt-2 text-right opacity-70">— ${d.ref}</div>
            </div>
        `).join('');
    }
    document.querySelectorAll('.dua-cat-btn').forEach(btn => btn.addEventListener('click', () => { renderDuas(btn.dataset.cat); }));

    // 3D & Mouse
    function initThree() {
        const cont = document.getElementById('canvas-container');
        if (!cont) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 6;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 400);
        cont.appendChild(renderer.domElement);
        const geo = new THREE.BoxGeometry(2, 2.2, 2);
        const mat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
        const cube = new THREE.Mesh(geo, mat);
        const goldGeo = new THREE.BoxGeometry(2.05, 0.4, 2.05);
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.8, roughness: 0.2 });
        const band = new THREE.Mesh(goldGeo, goldMat);
        band.position.y = 0.5;
        const group = new THREE.Group(); group.add(cube); group.add(band); scene.add(group);
        const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 5, 5); scene.add(light); scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        function animate() { requestAnimationFrame(animate); group.rotation.y += 0.005; group.rotation.x = Math.sin(Date.now() * 0.001) * 0.1; renderer.render(scene, camera); }
        animate();
    }
    function initEffects() {
        const glow = document.createElement('div');
        glow.id = 'noor-glow';
        glow.style.cssText = 'position:fixed; pointer-events:none; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(197,160,89,0.15) 0%, rgba(255,255,255,0) 70%); transform:translate(-50%, -50%); z-index:9999; mix-blend-mode:screen;';
        document.body.appendChild(glow);
        document.addEventListener('mousemove', (e) => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.hover-card-3d').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                    card.style.transform = `perspective(1000px) rotateX(${((y - rect.height / 2) / (rect.height / 2)) * -5}deg) rotateY(${((x - rect.width / 2) / (rect.width / 2)) * 5}deg) scale(1.02)`;
                } else card.style.transform = 'perspective(1000px) scale(1)';
            });
        });
    }

    // --- BOOTSTRAP ---
    fetchPrayers();
    updateMasterDates();
    loadDirectory();
    loadNames();
    renderDuas();
    if (window.THREE) initThree();
    initEffects();
    setTimeout(showDailyVerse, 1000);



});

// --- ZAKAT CALCULATOR ---
window.calculateZakat = function () {
    const currency = document.getElementById('zakat-currency')?.value || 'INR';
    const cash = parseFloat(document.getElementById('zakat-cash').value) || 0;
    const gold = parseFloat(document.getElementById('zakat-gold').value) || 0;
    const assets = parseFloat(document.getElementById('zakat-assets').value) || 0;

    const totalWealth = cash + gold + assets;
    const zakatDue = totalWealth * 0.025;

    // Format to 2 decimal places with currency
    const totalEl = document.getElementById('zakat-total');
    if (totalEl) {
        totalEl.innerText = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(zakatDue);
    }
}



// --- RAMADAN 2026 FEATURE ---
let ramadanInterval;

// --- CALENDAR STATE ---
let calendarCurrentDate = new Date();
let globalCity = "Hyderabad"; // User Requested Default
let globalCountry = "India";

window.getRamadanTimes = async function () {
    const cityInput = document.getElementById('ramadan-city');
    let rawCity = cityInput ? cityInput.value : '';

    // If input changed manually, disable coords mode
    if (rawCity && rawCity !== "My Location") {
        ramadanUseCoords = false;
    }

    // Default to Hyderabad if empty & no coords
    if (!rawCity && !ramadanUseCoords) rawCity = "Hyderabad, IN";

    let url = '';

    if (ramadanUseCoords) {
        url = `https://api.aladhan.com/v1/timings?latitude=${ramadanLat}&longitude=${ramadanLng}&method=1&school=1`;
        if (document.getElementById('cityLabel')) document.getElementById('cityLabel').innerText = "My Location";
    } else {
        if (rawCity.includes(',')) {
            const parts = rawCity.split(',');
            globalCity = parts[0].trim();
            globalCountry = parts[1].trim();
        } else {
            if (rawCity !== "My Location") globalCity = rawCity;
            // Auto-assign India for Hyderabad default
            if (globalCity.toLowerCase() === 'hyderabad') globalCountry = 'India';
        }

        const cityLabel = document.getElementById('cityLabel');
        if (cityLabel) cityLabel.innerText = globalCity;

        url = `https://api.aladhan.com/v1/timingsByCity?city=${globalCity}&country=${globalCountry}&method=1&school=1`;
    }

    // Reset Calendar to today
    calendarCurrentDate = new Date();
    fetchMonthlyCalendar();

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            // Populate View Elements
            if (document.getElementById('saheriVal')) document.getElementById('saheriVal').innerText = timings.Fajr;
            if (document.getElementById('iftarVal')) document.getElementById('iftarVal').innerText = timings.Maghrib;

            startRamadanCountdown(timings.Fajr, timings.Maghrib);
        }
    } catch (e) { console.error("API Error", e); }
}

window.autoDetectRamadanContent = function () {
    const btn = document.querySelector('button[onclick="autoDetectRamadanContent()"]');
    const icon = btn.querySelector('i');
    const originalClass = icon.className;
    icon.className = "fas fa-spinner fa-spin";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            ramadanLat = pos.coords.latitude;
            ramadanLng = pos.coords.longitude;
            ramadanUseCoords = true;

            const input = document.getElementById('ramadan-city');
            if (input) input.value = "My Location";

            icon.className = "fas fa-check";
            setTimeout(() => icon.className = "fas fa-location-arrow", 2000);

            await getRamadanTimes();

        }, (err) => {
            alert("Could not get location. Ensure GPS is enabled.");
            icon.className = "fas fa-location-arrow";
        });
    } else {
        alert("Geolocation not supported.");
        icon.className = "fas fa-location-arrow";
    }
}

window.changeCalendarMonth = function (delta) {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + delta);
    fetchMonthlyCalendar();
}

window.fetchMonthlyCalendar = async function () {
    const month = calendarCurrentDate.getMonth() + 1;
    const year = calendarCurrentDate.getFullYear();
    const label = document.getElementById('calendar-month-label');
    const tbody = document.getElementById('monthly-calendar-body');

    if (label) label.innerText = "Loading...";

    let url = '';
    if (ramadanUseCoords) {
        url = `https://api.aladhan.com/v1/calendar?latitude=${ramadanLat}&longitude=${ramadanLng}&method=1&school=1&month=${month}&year=${year}`;
    } else {
        url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${globalCity}&country=${globalCountry}&method=1&school=1`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 200 && tbody) {
            const hijriName = data.data[0]?.date.hijri.month.en || "";
            const yearHijri = data.data[0]?.date.hijri.year || "";
            const results = data.data;

            if (label) label.innerText = `${calendarCurrentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} / ${hijriName} ${yearHijri}`;

            tbody.innerHTML = results.map(day => {
                const isRamadan = day.date.hijri.month.number === 9;
                return `
                <tr class="hover:bg-[#fdfaf6]/5 transition-colors ${isRamadan ? 'bg-emerald-900/30' : ''}">
                    <td class="px-4 py-3 border-r border-[#c5a059]/10">
                        <span class="font-bold text-white">${day.date.gregorian.day}</span>
                        <span class="text-xs opacity-50 block">${day.date.gregorian.weekday.en}</span>
                    </td>
                    <td class="px-4 py-3 border-r border-[#c5a059]/10 font-serif">
                        <span class="text-[#c5a059] font-bold">${day.date.hijri.day}</span> ${day.date.hijri.month.en}
                    </td>
                    <td class="px-4 py-3 text-center border-r border-[#c5a059]/10 font-mono text-emerald-200">
                        ${day.timings.Fajr.split(' ')[0]}
                    </td>
                    <td class="px-4 py-3 text-center font-mono text-amber-200">
                        ${day.timings.Maghrib.split(' ')[0]}
                    </td>
                </tr>
            `}).join('');
        }
    } catch (e) {
        console.error("Calendar Fetch Error", e);
        if (label) label.innerText = "Error Loading Data";
    }
}

window.shareToWhatsApp = function () {
    const city = document.getElementById('cityLabel')?.innerText || 'Unknown Location';
    const saheri = document.getElementById('saheriVal')?.innerText || '--:--';
    const iftar = document.getElementById('iftarVal')?.innerText || '--:--';
    const date = new Date().toDateString();

    const message = `🌙 *Ramadan 1447 Timings*\n📍 Location: ${city}\n📅 Date: ${date}\n\n🥣 *Saheri Ends:* ${saheri}\n🌅 *Iftar Starts:* ${iftar}\n\n_Generated by Qulb Portal_`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
}

window.updateAtmosphere = function () {
    const hour = new Date().getHours();
    const section = document.getElementById('view-ramadan');
    // Only update if section exists
    if (!section) return;

    // Apply background color to the section based on time
    if (hour >= 17 && hour < 19) section.style.backgroundColor = "#1d352f"; // Sunset Deep Pine
    else if (hour >= 19 || hour < 5) section.style.backgroundColor = "#12211d"; // Night Dark Pine
    else section.style.backgroundColor = "#24423a"; // Day Bright Pine
}
// Init Atmosphere
setInterval(window.updateAtmosphere, 60000); // Check every minute
window.updateAtmosphere(); // Run immediately

function startRamadanCountdown(fajr, maghrib) {
    if (ramadanInterval) clearInterval(ramadanInterval);

    ramadanInterval = setInterval(() => {
        const now = new Date();
        const getTodayTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':');
            const d = new Date();
            d.setHours(hours, minutes, 0);
            return d;
        };

        let target = getTodayTime(maghrib);
        let label = "Time until Iftar";

        if (now > target) {
            target = getTodayTime(fajr);
            target.setDate(target.getDate() + 1); // Tomorrow's Sehri
            label = "Time until Sehri";
        } else if (now < getTodayTime(fajr)) {
            target = getTodayTime(fajr);
            label = "Time until Sehri";
        }

        const diff = target - now;
        if (diff < 0) return;

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        // Update Label if it exists
        const labelEl = document.querySelector('.mihrab-arch p.tracking-widest');
        if (labelEl) labelEl.innerText = label;

        const timerEl = document.getElementById('timer');
        if (timerEl) timerEl.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

// --- DUA OF THE DAY ---
const ramadanDuas = [
    {
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        translation: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
        ref: "Sunan Tirmidhi"
    },
    {
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
        translation: "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
        ref: "Dua for breaking fast (Abu Dawud)"
    },
    {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        ref: "Surah Al-Baqarah 2:201"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
        translation: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
        ref: "Ibn Majah"
    }
];

function displayRandomDua() {
    const randomIndex = Math.floor(Math.random() * ramadanDuas.length);
    const selectedDua = ramadanDuas[randomIndex];

    const arEl = document.getElementById('duaArabic');
    const trEl = document.getElementById('duaTranslation');
    const refEl = document.getElementById('duaReference');

    if (arEl) arEl.innerText = selectedDua.arabic;
    if (trEl) trEl.innerText = `"${selectedDua.translation}"`;
    if (refEl) refEl.innerText = `— ${selectedDua.ref}`;
}

// Initialize Dua on Load
setTimeout(displayRandomDua, 1000);
initGlobalSparkles();

// --- GLOBAL SPARKLE BACKGROUND ---
function initGlobalSparkles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'sparkle-bg';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        pointerEvents: 'none'
    });
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = width < 768 ? 40 : 100; // Particle count
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                speedY: Math.random() * 0.4 - 0.2,
                speedX: Math.random() * 0.4 - 0.2,
                opacity: Math.random(),
                fadeSpeed: Math.random() * 0.01 + 0.002,
                color: Math.random() > 0.6 ? '#c5a059' : '#94a3b8' // Gold & Silver
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            p.opacity += p.fadeSpeed;
            if (p.opacity > 1 || p.opacity < 0.1) p.fadeSpeed = -p.fadeSpeed;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}


