
document.addEventListener('DOMContentLoaded', () => {

    // --- NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Sidebar UI
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

            // View Switching
            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => sec.classList.add('hidden'));
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.remove('hidden');
        });
    });


    // --- PRAYER TIMES & DATE LOGIC ---
    const CITY = "Pune";
    const COUNTRY = "India";

    async function updateMasterDates() {
        const hDateEl = document.getElementById('hero-hijri-date');
        const gDateEl = document.getElementById('hero-greg-date');
        const headerDate = document.getElementById('portal-current-date');

        const now = new Date();
        if (headerDate) headerDate.textContent = now.toDateString();

        try {
            const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
            const data = await res.json();
            if (data.code === 200) {
                const h = data.data.hijri;
                const g = data.data.gregorian;
                if (hDateEl) hDateEl.textContent = `${h.day} ${h.month.en} ${h.year} AH`;
                if (gDateEl) gDateEl.textContent = `${g.day} ${g.month.en} ${g.year}`;
            }
        } catch (e) { console.error("Date fetch failed"); }
    }

    async function fetchPrayers() {
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${CITY}&country=${COUNTRY}&method=1`);
            const data = await res.json();

            if (data.code === 200) {
                const timings = data.data.timings;
                renderPrayerGrid(timings);
                startCountdown(timings);
            }
        } catch (e) { console.error("Prayer fetch failed", e); }
    }

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
            <div class="bg-white border-2 border-transparent hover:border-[#5D770F]/20 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all group">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">${p.id}</p>
                <div class="my-3 text-3xl text-[#5D770F] group-hover:scale-110 transition-transform">
                    <i class="fas ${p.icon}"></i>
                </div>
                <p class="text-xl font-bold text-gray-800 font-mono">${formatTo12Hour(timings[p.id])}</p>
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

    function startCountdown(timings) {
        setInterval(() => {
            const now = new Date();
            // Simple logic: Find next prayer
            // ... (Simplified for brevity, assuming standard logic)
            // Just updating clock for now effectively
            const localTimeEl = document.getElementById('local-time');
            if (localTimeEl) localTimeEl.textContent = now.toLocaleTimeString();
        }, 1000);

        // Trigger specific logic for Next Prayer Name/Countdown if needed
        // Assuming user wants the "Countdown" logic from previous steps:
        updateNextPrayer(timings);
    }

    function updateNextPrayer(timings) {
        // Find next prayer logic
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);
        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let next = 'Fajr';
        let nextTime = timings.Fajr;

        for (let p of prayers) {
            if (timings[p] > timeStr) {
                next = p;
                nextTime = timings[p];
                break;
            }
        }

        document.getElementById('next-prayer-name').textContent = next;

        // Countdown Interval
        setInterval(() => {
            const now = new Date();
            const [h, m] = nextTime.split(':');
            let target = new Date();
            target.setHours(h, m, 0);
            if (now > target) target.setDate(target.getDate() + 1);

            const diff = target - now;
            const hrs = Math.floor(diff / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            const cdEl = document.getElementById('countdown');
            if (cdEl) cdEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    }


    // --- QURAN LOGIC ---
    let currentSurah = 1;
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
                <div class="glass-container p-6 rounded-xl cursor-pointer hover:bg-white/50 transition-all" onclick="openReader(${s.number}, '${s.englishName}')">
                     <div class="flex justify-between items-start">
                        <div class="w-10 h-10 rounded-full bg-[#5D770F]/10 text-[#5D770F] flex items-center justify-center font-bold text-sm mb-3">${s.number}</div>
                        <div class="text-right text-[#5D770F] font-serif text-2xl">${s.name.replace('سُورَةُ ', '')}</div>
                     </div>
                     <h3 class="font-bold text-xl text-gray-800">${s.englishName}</h3>
                     <p class="text-sm text-gray-500">${s.englishNameTranslation}</p>
                     <div class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">${s.numberOfAyahs} VERSES • ${s.revelationType}</div>
                </div>
            `).join('');

            // Populate Sidebar List too
            const list = document.getElementById('surah-list');
            if (list) {
                list.innerHTML = data.data.map(s => `
                    <div class="cursor-pointer p-2 hover:bg-white/10 text-xs text-gray-300 hover:text-white flex justify-between" onclick="openReader(${s.number}, '${s.englishName}')">
                        <span>${s.number}. ${s.englishName}</span>
                    </div>
                `).join('');
            }
        } catch (e) { console.error("Surah Load Failed"); }
    }

    window.openReader = function (num, name) {
        currentSurah = num;
        if (quranModal) quranModal.style.display = 'flex';
        document.getElementById('reader-title').textContent = `Surah ${name}`;
        fetchSurahContent(num);
    }

    async function fetchSurahContent(num) {
        if (!quranContentEl) return;
        quranContentEl.innerHTML = '<div class="text-center mt-20"><i class="fas fa-circle-notch fa-spin text-4xl text-[#d4af37]"></i></div>';

        try {
            const [arRes, enRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/surah/${num}`),
                fetch(`https://api.alquran.cloud/v1/surah/${num}/en.sahih`)
            ]);
            const arData = await arRes.json();
            const enData = await enRes.json();

            const ayahs = arData.data.ayahs;
            const enAyahs = enData.data.ayahs;

            quranContentEl.innerHTML = ayahs.map((a, i) => `
                <div class="mb-8 border-b border-white/5 pb-8">
                    <div class="flex justify-between items-center mb-4">
                        <span class="w-8 h-8 rounded-full border border-[#d4af37] text-[#d4af37] flex items-center justify-center text-xs ml-4">${a.numberInSurah}</span>
                        <div class="text-right font-[Amiri] text-3xl leading-relaxed text-white drop-shadow-md" style="direction:rtl;">${a.text}</div>
                    </div>
                    <div class="text-gray-400 text-lg leading-relaxed">${enAyahs[i].text}</div>
                </div>
            `).join('');

            // Setup Audio
            if (audioPlayer) {
                audioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`;
            }

        } catch (e) { quranContentEl.innerHTML = '<p class="text-red-500 text-center mt-10">Error loading content.</p>'; }
    }

    // Close Modal
    document.getElementById('close-quran-btn')?.addEventListener('click', () => {
        if (quranModal) quranModal.style.display = 'none';
        if (audioPlayer) audioPlayer.pause();
    });

    // Play Pause
    document.getElementById('play-pause-btn')?.addEventListener('click', () => {
        if (audioPlayer.paused) audioPlayer.play();
        else audioPlayer.pause();
    });

    // --- 99 NAMES LOGIC ---
    async function loadNames() {
        const grid = document.getElementById('asma-grid');
        if (!grid) return;
        try {
            const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
            const data = await res.json();
            grid.innerHTML = data.data.map(n => `
                <div class="bg-white p-6 rounded-xl shadow-sm text-center border-t-4 border-[#5D770F] hover:-translate-y-1 transition-transform">
                    <div class="text-xs text-gray-400 mb-2">#${n.number}</div>
                    <h3 class="name-3d text-3xl font-[Amiri] mb-2">${n.name}</h3>
                    <div class="font-bold text-gray-800 text-lg">${n.transliteration}</div>
                    <div class="text-sm text-gray-500 mt-1">${n.en.meaning}</div>
                </div>
            `).join('');
        } catch (e) { }
    }

    // --- DUAS LOGIC ---
    // (Simplified for brevity, using same structure as before)
    const duas = [
        { cat: 'morning', title: 'Morning Adhkar', ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ...', en: 'We have entered a new morning...' },
        { cat: 'evening', title: 'Evening Protection', ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ...', en: 'We have reached the evening...' },
        { cat: 'food', title: 'Before Eating', ar: 'بِسْمِ اللَّهِ', en: 'In the name of Allah' }
    ];

    function renderDuas(cat = 'all') {
        const grid = document.getElementById('duas-grid');
        if (!grid) return;
        const filtered = cat === 'all' ? duas : duas.filter(d => d.cat === cat);
        grid.innerHTML = filtered.map(d => `
            <div class="bg-white p-6 rounded-xl shadow-sm relative overflow-hidden group">
                 <div class="absolute top-0 right-0 p-2 bg-gray-100 rounded-bl-xl text-xs font-bold text-gray-500 uppercase">${d.cat}</div>
                 <h3 class="font-bold text-lg mb-4 text-[#1a472a]">${d.title}</h3>
                 <div class="text-right font-[Amiri] text-2xl mb-4 text-gray-700">${d.ar}</div>
                 <div class="text-gray-500 text-sm italic">"${d.en}"</div>
            </div>
        `).join('');
    }

    document.querySelectorAll('.dua-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.dua-cat-btn').forEach(b => {
                b.classList.remove('active', 'bg-[#5D770F]', 'text-white');
                b.classList.add('bg-white', 'text-gray-800');
            });
            btn.classList.add('active', 'bg-[#5D770F]', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-800');
            renderDuas(btn.dataset.cat);
        });
    });

    // --- 3D KABA ---
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

        const group = new THREE.Group();
        group.add(cube);
        group.add(band);
        scene.add(group);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        function animate() {
            requestAnimationFrame(animate);
            group.rotation.y += 0.005;
            group.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
            renderer.render(scene, camera);
        }
        animate();
    }

    // --- INITIALIZATION ---
    fetchPrayers();
    updateMasterDates();
    loadSurahDirectory();
    loadNames();
    renderDuas();
    if (window.THREE) initThree();

    // Azaan
    // --- MOUSE & TILT EFFECTS ---
    function initEffects() {
        // Noor Glow
        const glow = document.createElement('div');
        glow.id = 'noor-glow';
        glow.style.cssText = 'position:fixed; pointer-events:none; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(255,255,255,0) 70%); transform:translate(-50%, -50%); z-index:9999; mix-blend-mode:screen;';
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });

        // Tilt Effect
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.hover-card-3d').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -5;
                    const rotateY = ((x - centerX) / centerX) * 5;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                } else {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                }
            });
        });
    }
    initEffects();

});
