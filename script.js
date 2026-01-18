
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE VARIABLES ---
    let coordinates = { lat: 18.5204, lng: 73.8567 }; // Default: Pune
    let prayerTimesRaw = {};
    let nextPrayerName = '';
    let isAzaanPlaying = false;
    let allHadiths = []; // For search

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
                l.classList.remove('active', 'bg-white/10', 'border-[#d4af37]');
                l.classList.add('border-transparent');
                l.querySelector('i').classList.remove('text-[#d4af37]');
                l.querySelector('i').classList.add('text-[#d4af37]/80');
            });
            link.classList.add('active', 'bg-white/10', 'border-[#d4af37]');
            link.classList.remove('border-transparent');
            link.querySelector('i').classList.add('text-[#d4af37]');
            link.querySelector('i').classList.remove('text-[#d4af37]/80');

            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => sec.classList.add('hidden'));
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.remove('hidden');

            if (targetId === 'view-library') loadLibrary();
            if (targetId === 'view-qibla') initQibla();
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
        if (headerDate) headerDate.innerHTML = `<span style="color:#5D770F">${now.toLocaleDateString('en-US', { weekday: 'long' })}</span>, ${now.toLocaleDateString()}`;

        try {
            const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
            const data = await res.json();
            if (data.code === 200) {
                const h = data.data.hijri;
                const g = data.data.gregorian;
                if (hDateEl) hDateEl.innerHTML = `<span class="text-2xl font-bold text-[#d4af37]">${h.day}</span> ${h.month.en} ${h.year} AH`;
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

    async function fetchPrayers(lat = null, lng = null, city = null) {
        let url = '';
        if (lat && lng) {
            url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1`;
            coordinates = { lat, lng };
            fetchAtmosphere(lat, lng); // Trigger Weather
            document.getElementById('portal-location-label').textContent = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        } else {
            const c = city || "Pune";
            url = `https://api.aladhan.com/v1/timingsByCity?city=${c}&country=India&method=1`;
            document.getElementById('portal-location-label').textContent = `${c}, India`;
            // For city search, we'll need coordinates from the response (handled below)
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            // If city search, get lat/lng from response for weather
            if (!lat && data.data && data.data.meta) {
                fetchAtmosphere(data.data.meta.latitude, data.data.meta.longitude);
            }

            if (data.code === 200) {
                prayerTimesRaw = data.data.timings;
                renderPrayerGrid(prayerTimesRaw);
                updateNextPrayer();
            }
        } catch (e) { console.error("Prayer fetch failed", e); }
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
        const prayers = [
            { id: 'Fajr', icon: 'fa-cloud-sun' },
            { id: 'Sunrise', icon: 'fa-sun' },
            { id: 'Dhuhr', icon: 'fa-sun' },
            { id: 'Asr', icon: 'fa-cloud-sun-rain' },
            { id: 'Maghrib', icon: 'fa-moon' },
            { id: 'Isha', icon: 'fa-star' }
        ];
        grid.innerHTML = prayers.map(p => `
            <div class="bg-white border-2 border-transparent hover:border-[#5D770F]/20 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all group hover-card-3d relative overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <div class="absolute -right-4 -top-4 opacity-5 text-6xl text-[#5D770F]"><i class="fas ${p.icon}"></i></div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">${p.id}</p>
                <div class="my-3 text-3xl text-[#5D770F] group-hover:scale-110 transition-transform">
                    <i class="fas ${p.icon}"></i>
                </div>
                <p class="text-xl font-bold text-gray-800 font-mono dark:text-white">${formatTo12Hour(timings[p.id])}</p>
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

        setInterval(() => {
            const now = new Date();
            let next = 'Fajr';
            let nextTimeStr = timings.Fajr;
            let minDiff = Infinity;

            // Logic to find next prayer considering current time
            // Simple approach: Convert all to minutes from midnight and compare
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
            // If none found, it's Fajr tomorrow
            if (!found) {
                next = 'Fajr';
                nextTimeStr = timings.Fajr;
            }

            document.getElementById('next-prayer-name').textContent = next;

            // Parse target
            const [th, tm] = nextTimeStr.split(':');
            const target = new Date();
            target.setHours(th, tm, 0);
            if (!found) target.setDate(target.getDate() + 1);

            const diff = target - now;

            // ADHAN TRIGGER
            if (diff <= 1000 && diff > 0 && !isAzaanPlaying) {
                playAzaan();
            }

            // Format Countdown
            if (diff > 0) {
                const hrs = Math.floor(diff / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                document.getElementById('countdown').textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }

        }, 1000);
    }

    function playAzaan() {
        if (!window.adhanAudio) window.changeAzanVoice();

        if (window.adhanAudio) {
            isAzaanPlaying = true;
            window.adhanAudio.play().catch(e => console.log("Audio play failed", e));

            // Show Notification
            if (Notification.permission === "granted") {
                new Notification("Prayer Time", { body: "It is time for " + document.getElementById('next-prayer-name').textContent });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
            // Reset flag after 5 mins
            setTimeout(() => isAzaanPlaying = false, 300000);
        }
    }


    // --- QIBLA LOGIC ---
    function initQibla() {
        const needle = document.getElementById('qibla-needle');
        const degDisplay = document.getElementById('qibla-deg');
        if (!needle) return;

        // Kaaba Coords
        const kaabaLat = 21.4225;
        const kaabaLng = 39.8262;

        const phi1 = coordinates.lat * Math.PI / 180;
        const phi2 = kaabaLat * Math.PI / 180;
        const dLam = (kaabaLng - coordinates.lng) * Math.PI / 180;

        const y = Math.sin(dLam) * Math.cos(phi2);
        const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLam);
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        bearing = (bearing + 360) % 360;

        degDisplay.innerText = bearing.toFixed(0) + '°';

        // On desktop, just point the needle to the calculated bearing assuming North is Up (0deg)
        // Ideally we need device orientation for true north relative to device
        needle.style.transform = `rotate(${bearing}deg)`;

        // Mobile Device Orientation
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function (event) {
                // alpha: rotation around z-axis
                const loop = event.alpha;
                if (loop !== null) {
                    // Compass heading = 360 - alpha;
                    // We want needle to point to qibla not just North
                    // Qibla Relative = Bearing - Heading
                    const heading = 360 - loop; // Approx magnetic north
                    const relativeDir = bearing - heading;
                    needle.style.transform = `rotate(${relativeDir}deg)`;
                }
            }, true);
        }
    }


    // --- LIBRARY & SEARCH ---
    async function loadLibrary() {
        const view = document.getElementById('library-content');
        if (allHadiths.length > 0) return; // Already loaded

        view.innerHTML = '<div class="text-center py-20"><i class="fas fa-circle-notch fa-spin text-4xl text-[#d4af37]"></i> <p class="mt-4">Loading Knowledge Base...</p></div>';

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
                    <div class="bg-[#fffbf0] p-8 rounded-tr-3xl rounded-bl-3xl shadow-md border border-[#d4af37]/20 hover:shadow-lg transition-all relative dark:bg-gray-800 dark:border-gray-700">
                        <i class="fas fa-quote-right absolute top-4 right-4 text-[#d4af37]/20 text-4xl"></i>
                        <h4 class="font-bold text-[#1a472a] mb-4 uppercase tracking-widest text-xs dark:text-[#d4af37]">Hadith #${h.id}</h4>
                        <p class="text-xl font-serif text-gray-800 leading-relaxed mb-4 dark:text-gray-200">"${h.text}"</p>
                        <div class="text-sm font-bold text-[#d4af37] border-t border-[#d4af37]/20 pt-4 flex justify-between items-center">
                            <span>Reference: ${h.ref}</span>
                            <button class="text-gray-400 hover:text-[#1a472a]"><i class="fas fa-share-alt"></i></button>
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
            <div class="bg-white rounded-2xl max-w-lg w-full p-10 text-center relative transform scale-90 transition-transform duration-500 shadow-2xl border-4 border-[#d4af37]/30 dark:bg-gray-900 border-gray-700">
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500"><i class="fas fa-times text-xl"></i></button>
                <div class="w-16 h-1 bg-[#d4af37] mx-auto mb-6 rounded-full"></div>
                <h3 class="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4 dark:text-gray-400">Verse of the Moment</h3>
                <p class="text-3xl font-[Cormorant_Garamond] font-bold text-[#1a472a] mb-6 leading-tight dark:text-white">"${verse.t}"</p>
                <p class="text-[#d4af37] font-semibold font-serif italic">— ${verse.r}</p>
                <button onclick="this.closest('.fixed').remove()" class="mt-8 px-8 py-3 bg-[#1a472a] text-white rounded-full font-bold hover:bg-[#5D770F] transition-colors shadow-lg">Bismillah</button>
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

    async function loadSurahDirectory() {
        const grid = document.getElementById('surah-index-grid');
        if (!grid) return;
        try {
            const res = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await res.json();
            grid.innerHTML = data.data.map(s => `
                <div class="glass-container p-6 rounded-xl cursor-pointer hover:bg-white/50 transition-all hover-card-3d border border-transparent hover:border-[#d4af37]/30 dark:bg-gray-800 dark:border-gray-700" onclick="openReader(${s.number}, '${s.englishName}')">
                     <div class="flex justify-between items-start">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a472a] to-[#5D770F] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-lg">${s.number}</div>
                        <div class="text-right text-[#1a472a] font-serif text-2xl drop-shadow-sm dark:text-[#d4af37]">${s.name.replace('سُورَةُ ', '')}</div>
                     </div>
                     <h3 class="font-bold text-xl text-gray-800 dark:text-white">${s.englishName}</h3>
                     <p class="text-sm text-gray-500 dark:text-gray-400">${s.englishNameTranslation}</p>
                </div>
            `).join('');
            // Populate Sidebar List
            const list = document.getElementById('surah-list');
            if (list) list.innerHTML = data.data.map(s => `<div class="cursor-pointer p-2 hover:bg-white/10 text-xs text-gray-300 hover:text-white" onclick="openReader(${s.number}, '${s.englishName}')">${s.number}. ${s.englishName}</div>`).join('');
        } catch (e) { }
    }

    window.openReader = function (num, name) {
        if (quranModal) quranModal.style.display = 'flex';
        document.getElementById('reader-title').textContent = `Surah ${name}`;
        fetchSurahContent(num);
    }

    async function fetchSurahContent(num) {
        quranContentEl.innerHTML = '<div class="text-center mt-20"><i class="fas fa-circle-notch fa-spin text-4xl text-[#d4af37]"></i></div>';
        try {
            const [arRes, enRes] = await Promise.all([fetch(`https://api.alquran.cloud/v1/surah/${num}`), fetch(`https://api.alquran.cloud/v1/surah/${num}/en.sahih`)]);
            const arData = await arRes.json();
            const enData = await enRes.json();
            quranContentEl.innerHTML = arData.data.ayahs.map((a, i) => `
                <div class="mb-8 border-b border-white/5 pb-8 group hover:bg-white/5 p-4 rounded-lg transition-colors">
                    <div class="flex justify-between items-center mb-4">
                        <span class="w-8 h-8 rounded-full border border-[#d4af37] text-[#d4af37] flex items-center justify-center text-xs ml-4 font-mono">${a.numberInSurah}</span>
                        <div class="text-right font-[Amiri] text-3xl leading-relaxed text-white drop-shadow-md" style="direction:rtl;">${a.text}</div>
                    </div>
                    <div class="text-gray-400 text-lg leading-relaxed">${enData.data.ayahs[i].text}</div>
                </div>
            `).join('');
            if (audioPlayer) audioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`;
        } catch (e) { }
    }
    // Standard listeners
    document.getElementById('close-quran-btn')?.addEventListener('click', () => { if (quranModal) quranModal.style.display = 'none'; if (audioPlayer) audioPlayer.pause(); });
    document.getElementById('play-pause-btn')?.addEventListener('click', () => { if (audioPlayer.paused) audioPlayer.play(); else audioPlayer.pause(); });

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
                <div class="bg-white p-6 rounded-xl shadow-sm text-center border-t-4 hover:-translate-y-1 transition-transform relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700" style="border-color:hsl(${hue}, 60%, 40%)">
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
        { cat: 'morning', title: 'Start of Day', ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', en: 'We have entered a new morning...' },
        { cat: 'evening', title: 'End of Day', ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', en: 'We have reached the evening...' },
        { cat: 'food', title: 'Before Eating', ar: 'بِسْمِ اللَّهِ', en: 'In the name of Allah.' },
        { cat: 'travel', title: 'Vehicle/Travel', ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا', en: 'Glory to Him who has brought this vehicle under our control.' },
        { cat: 'prayer', title: 'After Wudu', ar: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ', en: 'I testify that there is no deity except Allah.' }
    ];
    function renderDuas(cat = 'all') {
        const grid = document.getElementById('duas-grid');
        if (!grid) return;
        const filtered = cat === 'all' ? duas : duas.filter(d => d.cat === cat);
        grid.innerHTML = filtered.map(d => `
            <div class="bg-white p-6 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow border-l-4 dark:bg-gray-800 dark:border-gray-700" style="border-left-color:#5D770F">
                 <div class="absolute top-0 right-0 p-2 bg-gray-500 rounded-bl-xl text-xs font-bold text-white uppercase shadow-sm">${d.cat}</div>
                 <h3 class="font-bold text-lg mb-4 text-[#1a472a] dark:text-[#d4af37]">${d.title}</h3>
                 <div class="text-right font-[Amiri] text-2xl mb-4 text-gray-700 leading-loose dark:text-gray-200">${d.ar}</div>
                 <div class="text-gray-500 text-sm italic border-t border-gray-100 pt-3 dark:border-gray-700 dark:text-gray-400">"${d.en}"</div>
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
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8, roughness: 0.2 });
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
        glow.style.cssText = 'position:fixed; pointer-events:none; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(255,255,255,0) 70%); transform:translate(-50%, -50%); z-index:9999; mix-blend-mode:screen;';
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
    loadSurahDirectory();
    loadNames();
    renderDuas();
    if (window.THREE) initThree();
    initEffects();
    setTimeout(showDailyVerse, 1000);

    const azaanBtn = document.getElementById('play-azaan-btn');
    const azaanAudio = document.getElementById('azaan-audio');
    if (azaanBtn && azaanAudio) azaanBtn.addEventListener('click', () => { if (azaanAudio.paused) azaanAudio.play(); else azaanAudio.pause(); });

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

// --- AZAN VOICE LOGIC ---
window.adhanAudio = null;

/* --- ROBUST AUDIO ENGINE --- */
if (!window.adhanAudio) window.adhanAudio = new Audio();

window.updateAzanSource = function () {
    const selector = document.getElementById('azan-selector');
    if (selector && window.adhanAudio) {
        window.adhanAudio.src = selector.value;
        window.adhanAudio.load();
    }
}
// Compatibility Alias
window.changeAzanVoice = window.updateAzanSource;

window.unlockAndClose = function () {
    if (window.adhanAudio) {
        window.adhanAudio.play().then(() => {
            window.adhanAudio.pause();
            window.adhanAudio.currentTime = 0;
        }).catch(e => console.log("Unlock pending"));
    }
    const modal = document.getElementById('audio-modal');
    if (modal) modal.classList.add('hidden');
}

window.playPreview = function () {
    const selector = document.getElementById('azan-selector');
    if (!selector) return;

    window.updateAzanSource();

    if (window.adhanAudio) {
        window.adhanAudio.play()
            .then(() => {
                setTimeout(() => {
                    window.adhanAudio.pause();
                    window.adhanAudio.currentTime = 0;
                }, 10000);
            })
            .catch(error => {
                console.error("Playback failed:", error);
                const modal = document.getElementById('audio-modal');
                if (modal) modal.classList.remove('hidden');
                else alert("Please click anywhere to enable audio.");
            });
    }
}

// --- AZAN VOLUME & CONTROLS ---
let isMuted = false;
let lastVolume = 0.5;

window.updateVolume = function (val) {
    lastVolume = val;
    if (window.adhanAudio) window.adhanAudio.volume = val;

    const icon = document.getElementById('mute-icon');
    if (icon) {
        if (val == 0) icon.innerText = '🔇';
        else if (val < 0.5) icon.innerText = '🔉';
        else icon.innerText = '🔊';
    }
}

window.toggleMute = function () {
    isMuted = !isMuted;
    if (window.adhanAudio) window.adhanAudio.muted = isMuted;

    const icon = document.getElementById('mute-icon');
    const slider = document.getElementById('volume-slider');

    if (isMuted) {
        if (icon) icon.innerText = '🔇';
        if (slider) slider.style.opacity = "0.5";
    } else {
        window.updateVolume(lastVolume);
        if (slider) slider.style.opacity = "1";
    }
}

window.stopAzan = function () {
    if (window.adhanAudio) {
        window.adhanAudio.pause();
        window.adhanAudio.currentTime = 0;
    }
}

// Function to unlock audio on first click
document.addEventListener('click', () => {
    // This plays a silent 0.1s clip to "prime" the audio engine
    if (window.adhanAudio) {
        window.adhanAudio.play().then(() => {
            window.adhanAudio.pause();
            window.adhanAudio.currentTime = 0;
            console.log("Audio Engine Unlocked");
        }).catch(error => console.log("Unlock failed", error));
    } else {
        window.changeAzanVoice(); // Init logic
    }
}, { once: true });

// --- RAMADAN 2026 FEATURE ---
let ramadanInterval;

window.getRamadanTimes = async function () {
    const cityInput = document.getElementById('ramadan-city');
    let rawCity = cityInput ? cityInput.value : '';

    // Default or Parse
    if (!rawCity) rawCity = "Mecca, SA";

    let city = rawCity;
    let country = "Saudi Arabia"; // Default

    if (rawCity.includes(',')) {
        const parts = rawCity.split(',');
        city = parts[0].trim();
        country = parts[1].trim();
    }

    const cityLabel = document.getElementById('cityLabel');
    if (cityLabel) cityLabel.innerText = city;

    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 200) {
            const timings = data.data.timings;

            // Populate View Elements
            const saheriEl = document.getElementById('saheriVal');
            const iftarEl = document.getElementById('iftarVal');

            if (saheriEl) saheriEl.innerText = timings.Fajr;
            if (iftarEl) iftarEl.innerText = timings.Maghrib;

            // Start Countdown
            startRamadanCountdown(timings.Fajr, timings.Maghrib);
        } else {
            alert("Could not load timings. Check city name.");
        }
    } catch (e) {
        console.error("Ramadan API Error", e);
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
    if (hour >= 17 && hour < 19) section.style.backgroundColor = "#022c22"; // Sunset Deep Green
    else if (hour >= 19 || hour < 5) section.style.backgroundColor = "#011a14"; // Night Dark 
    else section.style.backgroundColor = "#064e3b"; // Day Bright Green
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
