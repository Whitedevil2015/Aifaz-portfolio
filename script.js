/* ==========================================================================
   STATE & DATA
   ========================================================================== */
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  city: 'Mecca',
  currentView: 'dashboard',
  streak: parseInt(localStorage.getItem('streak')) || 0,
  versesRead: parseInt(localStorage.getItem('versesRead')) || 0,
  bookmarks: parseInt(localStorage.getItem('bookmarks')) || 0,
  quizScore: parseInt(localStorage.getItem('quizScore')) || 0,
  quranProgress: parseInt(localStorage.getItem('quranProgress')) || 0,
  namesProgress: parseInt(localStorage.getItem('namesProgress')) || 0,
  currentSurah: 1,
  audioPlaying: false,
  showTranslation: true,
  // Audio Sync Queue State
  audioQueue: [],
  currentVersePlayingIndex: -1,
  audioPlayingPhase: 'none', // 'none', 'arabic', 'translation'
  repeatMode: 'none' // 'none', 'verse', 'surah'
};

// Audio Player (Note: audioPlayer removed to support dual arabic/translation player)


/* --- DATA MOCKS (For standalone functionality) --- */
const MOCK_PROPHETS = [
  { name: 'Adam', arabic: 'آدَم', title: 'The Chosen One', desc: 'The first human and prophet of Allah. Created from clay, he was taught the names of all things. His story teaches us about repentance and Allah\'s immense mercy.' },
  { name: 'Nuh (Noah)', arabic: 'نُوح', title: 'The Grateful Servant', desc: 'Preached for 950 years. Built the ark to save believers from the great flood. A symbol of immense patience and steadfastness in the face of mockery.' },
  { name: 'Ibrahim (Abraham)', arabic: 'إِبْرَاهِيم', title: 'Friend of Allah', desc: 'The patriarch of monotheism. Rebuilt the Kaaba with his son Ismail. His willingness to sacrifice his son showed ultimate submission to Allah.' },
  { name: 'Musa (Moses)', arabic: 'مُوسَىٰ', title: 'He Who Spoke to Allah', desc: 'Freed the Israelites from Pharaoh. Received the Torah on Mount Sinai. His story is the most frequently mentioned in the Quran, highlighting justice and reliance on Allah.' },
  { name: 'Isa (Jesus)', arabic: 'عِيسَىٰ', title: 'The Spirit of Allah', desc: 'Born miraculously to Maryam. Performed miracles by Allah\'s permission. Will return near the end of times. A mighty messenger of love and spirituality.' },
  { name: 'Muhammad', arabic: 'مُحَمَّد', title: 'Seal of the Prophets', desc: 'The final messenger sent to all of humanity. Received the Noble Quran. His life (Seerah) is the ultimate practical example of Islam.' }
];

const MOCK_NAMES = [
  { num: 1, arabic: 'الرَّحْمَٰنُ', trans: 'Ar-Rahman', meaning: 'The Most Gracious' },
  { num: 2, arabic: 'الرَّحِيمُ', trans: 'Ar-Raheem', meaning: 'The Most Merciful' },
  { num: 3, arabic: 'الْمَلِكُ', trans: 'Al-Malik', meaning: 'The King, The Sovereign' },
  { num: 4, arabic: 'الْقُدُّوسُ', trans: 'Al-Quddus', meaning: 'The Most Holy' },
  { num: 5, arabic: 'السَّلَامُ', trans: 'As-Salam', meaning: 'The Source of Peace' },
  { num: 6, arabic: 'الْمُؤْمِنُ', trans: 'Al-Mu\'min', meaning: 'The Guardian of Faith' },
  { num: 7, arabic: 'الْعَزِيزُ', trans: 'Al-Aziz', meaning: 'The Almighty' },
  { num: 8, arabic: 'الْغَفَّارُ', trans: 'Al-Ghaffar', meaning: 'The Oft-Forgiving' },
  { num: 9, arabic: 'الْخَالِقُ', trans: 'Al-Khaliq', meaning: 'The Creator' },
  { num: 10, arabic: 'الرَّزَّاقُ', trans: 'Ar-Razzaq', meaning: 'The Sustainer' }
];

const MOCK_DUAS = [
  { type: 'morning', title: 'Waking Up', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', trans: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilaihin-nushur.', meaning: 'All praise is due to Allah who gave us life after causing us to die, and to Him is the resurrection.' },
  { type: 'evening', title: 'Before Sleep', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', trans: 'Bismika Allahumma amutu wa ahya.', meaning: 'In Your name, O Allah, I die and I live.' },
  { type: 'occasions', title: 'Leaving Home', arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', trans: 'Bismillahi, tawakkaltu \'alal-lahi, wa la hawla wa la quwwata illa billah.', meaning: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.' },
  { type: 'morning', title: 'Morning Protection', arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', trans: 'Bismillahil-ladhi la yadurru ma\'as-mihi shai\'un fil-ardi wa la fis-sama\'i, wa Huwas-Sami\'ul-\'Alim.', meaning: 'In the Name of Allah with Whose Name there is protection against every kind of harm in the earth or in the heaven, and He is the All-Hearing and All-Knowing.' }
];

const MOCK_HADITH = [
  { source: 'Sahih Bukhari 1', text: 'Actions are judged by intentions, so each man will have what he intended.' },
  { source: 'Sahih Muslim 2699', text: 'He who traverses a path in search of knowledge, Allah will make easy for him the path to Paradise.' },
  { source: 'Sunan Ibn Majah 224', text: 'Seeking knowledge is a duty upon every Muslim.' },
  { source: 'Sahih Bukhari 6011', text: 'The strong man is not the good wrestler; the strong man is only the one who controls himself when he is angry.' }
];

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();

  // 2. Hide Splash Screen
  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('app').classList.remove('hidden');

      // Post-load initialization
      initDashboard();
      initNavigation();
      loadPrayerTimes();
      loadSurahList();
      loadNames();
      loadDuas('morning');
      loadProphets();
      loadHadith();

    }, 800);
  }, 2000); // 2 second splash

  // 3. Event Listeners
  setupEventListeners();
});

/* ==========================================================================
   CORE FUNCTIONS
   ========================================================================== */
function setupEventListeners() {
  // Theme Toggles
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('header-theme-toggle').addEventListener('click', toggleTheme);

  // Dua Tabs
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      loadDuas(e.target.dataset.tab);
    });
  });
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
  updateThemeIcon();
  showToast(`${state.theme.charAt(0).toUpperCase() + state.theme.slice(1)} Mode Enabled`);
}

function updateThemeIcon() {
  const iconClass = state.theme === 'dark' ? 'fa-sun' : 'fa-moon';
  document.getElementById('theme-icon').className = `fas ${iconClass}`;
  document.querySelector('#header-theme-toggle i').className = `fas ${iconClass}`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* --- NAVIGATION --- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mn-item');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Get target view
      const targetView = link.dataset.view;
      if (!targetView) return;

      navigateTo(targetView);

      // Close mobile sidebar if open
      closeSidebar();
    });
  });
}

function navigateTo(viewId) {
  // Update State
  state.currentView = viewId;

  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show target view
  const targetEl = document.getElementById(`view-${viewId}`);
  if (targetEl) targetEl.classList.add('active');

  // Update active state on nav links
  document.querySelectorAll('.nav-link, .mn-item').forEach(link => {
    if (link.dataset.view === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update Page Title
  const titleMap = {
    dashboard: 'Dashboard',
    quran: 'Noble Quran',
    names: '99 Names of Allah',
    prayer: 'Prayer Times',
    hadith: 'Hadith Collection',
    duas: 'Duas & Azkar',
    quiz: 'Islamic Quiz',
    prophets: 'Prophet Stories'
  };
  document.getElementById('page-title').textContent = titleMap[viewId] || 'Portal';

  // Scroll to top
  document.getElementById('views-container').scrollTop = 0;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
function initDashboard() {
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('streak-badge').textContent = `${state.streak}🔥`;
  document.getElementById('stat-verses').textContent = state.versesRead;
  document.getElementById('stat-bookmarks').textContent = state.bookmarks;
  document.getElementById('stat-quiz').textContent = `${state.quizScore}%`;

  document.getElementById('prog-quran').style.width = `${state.quranProgress}%`;
  document.getElementById('prog-quran-pct').textContent = `${state.quranProgress}%`;

  document.getElementById('prog-names').style.width = `${state.namesProgress}%`;
  document.getElementById('prog-names-pct').textContent = `${state.namesProgress}%`;

  loadDailyVerse();
  document.getElementById('d-refresh-verse')?.addEventListener('click', loadDailyVerse);
}

async function loadDailyVerse() {
  const arabicEl = document.getElementById('d-verse-arabic');
  const romanEl = document.getElementById('d-verse-roman');
  const transEl = document.getElementById('d-verse-translation');
  const refEl = document.getElementById('d-verse-ref');

  arabicEl.textContent = '...';
  if(romanEl) romanEl.textContent = 'Loading...';
  transEl.textContent = 'Loading daily inspiration...';

  try {
    // Get a random verse (1 to 6236)
    const randomAyah = Math.floor(Math.random() * 6236) + 1;
    const [arRes, enRes, romanRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}`),
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/en.walk`),
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/en.transliteration`)
    ]);

    const arData = await arRes.json();
    const enData = await enRes.json();
    const romanData = await romanRes.json();

    if (arData.code === 200) {
      const v = arData.data;
      arabicEl.textContent = v.text;
      if(romanEl) romanEl.textContent = romanData.data.text;
      transEl.textContent = enData.data.text;
      refEl.textContent = `Surah ${v.surah.englishName} (${v.surah.number}:${v.numberInSurah})`;
    }
  } catch (e) {
    console.error('Error loading daily verse:', e);
  }
}

/* ==========================================================================
   PRAYER TIMES (Aladhan API)
   ========================================================================== */
async function loadPrayers() {
  const inputCity = document.getElementById('prayer-city').value || state.city;
  state.city = inputCity;
  document.getElementById('city-name').textContent = state.city;
  document.getElementById('p-city').textContent = state.city;

  loadPrayerTimes();
}

async function loadPrayerTimes() {
  try {
    // Using standard Aladhan API endpoint
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${state.city}&country=&method=2`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      renderPrayerTimes(data.data);
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    showToast('Could not load prayer times. Working offline.');
  }
}

function renderPrayerTimes(data) {
  const timings = data.timings;
  const date = data.date;

  // Update Hijri Dates
  const hijriStr = `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`;
  document.getElementById('d-hijri').textContent = hijriStr;
  document.getElementById('p-hijri').textContent = `${hijriStr} AH`;
  document.getElementById('d-gregorian').textContent = date.readable;

  // Prayers we care about
  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  // Render Dashboard Mini List
  let dListHtml = '';
  // Render Main Prayer Cards
  let pCardsHtml = '';

  // Find next prayer
  let nextPrayer = null;
  let nextPrayerTimeStr = '';
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  prayers.forEach(name => {
    const time = timings[name];
    const [hours, mins] = time.split(':').map(Number);
    const prayerMins = hours * 60 + mins;

    let isNext = false;
    if (!nextPrayer && prayerMins > currentMins) {
      nextPrayer = name;
      nextPrayerTimeStr = time;
      isNext = true;
    }

    // Formatting time to 12h
    const h12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const time12 = `${h12}:${mins.toString().padStart(2, '0')} ${ampm}`;

    // Mini List HTML
    if (name !== 'Sunrise') {
      dListHtml += `
          <div class="mini-prayer-item ${isNext ? 'next' : ''}">
            <span>${name}</span>
            <span>${time12}</span>
          </div>
        `;
    }

    // Cards HTML
    const icons = {
      'Fajr': 'fa-cloud-moon',
      'Sunrise': 'fa-sun',
      'Dhuhr': 'fa-sun',
      'Asr': 'fa-cloud-sun',
      'Maghrib': 'fa-moon',
      'Isha': 'fa-star'
    };

    pCardsHtml += `
        <div class="pc-card ${isNext ? 'next' : ''}">
          <div class="pc-icon"><i class="fas ${icons[name]}"></i></div>
          <div class="pc-name">${name}</div>
          <div class="pc-time">${time12}</div>
        </div>
      `;
  });

  // If no next prayer today, it's Fajr tomorrow
  if (!nextPrayer) {
    nextPrayer = 'Fajr';
    nextPrayerTimeStr = timings['Fajr'];
  }

  document.getElementById('d-prayer-list').innerHTML = dListHtml;
  document.getElementById('prayer-cards-grid').innerHTML = pCardsHtml;

  document.getElementById('d-next-name').textContent = nextPrayer;
  document.getElementById('d-next-time').textContent = nextPrayerTimeStr;
  document.getElementById('p-next-name').textContent = nextPrayer;

  startPrayerCountdown(nextPrayerTimeStr);
}

let countdownInterval;
function startPrayerCountdown(targetTimeStr) {
  if (countdownInterval) clearInterval(countdownInterval);

  const [tH, tM] = targetTimeStr.split(':').map(Number);

  countdownInterval = setInterval(() => {
    const now = new Date();
    let target = new Date();
    target.setHours(tH, tM, 0, 0);

    if (target < now) {
      target.setDate(target.getDate() + 1); // Next day
    }

    const diff = target - now;
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const timeStr = `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    document.getElementById('d-countdown').textContent = timeStr;
    document.getElementById('p-countdown').textContent = timeStr;
  }, 1000);
}

state.quranDisplayMode = 'full';
state.showTranslit = true;

/* ==========================================================================
   QURAN (Alquran.cloud API) - ADVANCED MODULE
   ========================================================================== */

const PARAS = [
  {n:1,  name:"Alif Lam Mim",        ar:"الم",             start:{s:1,v:1},  end:{s:2,v:141}},
  {n:2,  name:"Sayaqool",            ar:"سَيَقُولُ",        start:{s:2,v:142},end:{s:2,v:252}},
  {n:3,  name:"Tilkar Rusul",        ar:"تِلْكَ الرُّسُلُ",start:{s:2,v:253},end:{s:3,v:92}},
  {n:4,  name:"Lan Tanaloo",         ar:"لَنْ تَنَالُوا",  start:{s:3,v:93}, end:{s:4,v:23}},
  {n:5,  name:"Wal Mohsanaat",       ar:"وَالْمُحْصَنَاتُ",start:{s:4,v:24}, end:{s:4,v:147}},
  {n:6,  name:"La Yuhibbullah",      ar:"لَا يُحِبُّ اللَّهُ",start:{s:4,v:148},end:{s:5,v:81}},
  {n:7,  name:"Wa Iza Samiu",        ar:"وَإِذَا سَمِعُوا",start:{s:5,v:82}, end:{s:6,v:110}},
  {n:8,  name:"Wa Lau Annana",       ar:"وَلَوْ أَنَّنَا", start:{s:6,v:111},end:{s:7,v:87}},
  {n:9,  name:"Qalal Malao",         ar:"قَالَ الْمَلَأُ", start:{s:7,v:88}, end:{s:8,v:40}},
  {n:10, name:"Wa Alamu",            ar:"وَاعْلَمُوا",     start:{s:8,v:41}, end:{s:9,v:92}},
  {n:11, name:"Yatazeroon",          ar:"يَعْتَذِرُونَ",   start:{s:9,v:93}, end:{s:11,v:5}},
  {n:12, name:"Wa Ma Min Dabbah",    ar:"وَمَا مِن دَابَّة",start:{s:11,v:6},end:{s:12,v:52}},
  {n:13, name:"Wa Ma Ubarrio",       ar:"وَمَا أُبَرِّئُ",start:{s:12,v:53},end:{s:14,v:52}},
  {n:14, name:"Rubama",              ar:"رُبَمَا",         start:{s:15,v:1}, end:{s:16,v:128}},
  {n:15, name:"Subhanallazi",        ar:"سُبْحَانَ الَّذِي",start:{s:17,v:1},end:{s:18,v:74}},
  {n:16, name:"Qal Alam",            ar:"قَالَ أَلَمْ",    start:{s:18,v:75},end:{s:20,v:135}},
  {n:17, name:"Aqtarabo",            ar:"اقْتَرَبَ",       start:{s:21,v:1}, end:{s:22,v:78}},
  {n:18, name:"Qad Aflaha",          ar:"قَدْ أَفْلَحَ",   start:{s:23,v:1}, end:{s:25,v:20}},
  {n:19, name:"Wa Qalallazina",      ar:"وَالْمُؤْمِنُونَ",start:{s:25,v:21},end:{s:27,v:55}},
  {n:20, name:"Amman Khalaq",        ar:"أَمَّنْ خَلَقَ",  start:{s:27,v:56},end:{s:29,v:45}},
  {n:21, name:"Utlu Ma Oohi",        ar:"اتْلُ مَا أُوحِيَ",start:{s:29,v:46},end:{s:33,v:30}},
  {n:22, name:"Wa Manyaqnut",        ar:"وَمَن يَقْنُتْ",  start:{s:33,v:31},end:{s:36,v:27}},
  {n:23, name:"Wa Mali",             ar:"وَمَا لِيَ",      start:{s:36,v:28},end:{s:39,v:31}},
  {n:24, name:"Faman Azlam",         ar:"فَمَنْ أَظْلَمُ", start:{s:39,v:32},end:{s:41,v:46}},
  {n:25, name:"Elahe Yuruddo",       ar:"إِلَيْهِ يُرَدُّ",start:{s:41,v:47},end:{s:45,v:37}},
  {n:26, name:"Ha Meem",             ar:"حم",              start:{s:46,v:1}, end:{s:51,v:30}},
  {n:27, name:"Qala Fama Khatbukum", ar:"قَالَ فَمَا خَطْبُكُمْ",start:{s:51,v:31},end:{s:57,v:29}},
  {n:28, name:"Qad Sami Allah",      ar:"قَدْ سَمِعَ اللَّهُ",start:{s:58,v:1},end:{s:66,v:12}},
  {n:29, name:"Tabarakallazi",       ar:"تَبَارَكَ الَّذِي",start:{s:67,v:1},end:{s:77,v:50}},
  {n:30, name:"Amma",                ar:"عَمَّ",           start:{s:78,v:1}, end:{s:114,v:6}}
];

let currentQuranTab = 'para';

async function loadSurahList() {
    try {
        const res = await fetch('https://api.alquran.cloud/v1/meta');
        const data = await res.json();
        if (data.code === 200) {
            window.allSurahs = data.data.surahs.references;
            renderQuranNav();
        }
    } catch (e) { showToast('Error loading Quran list.'); }
    setupQuranListeners();
}

function renderQuranNav() {
    const list = document.getElementById('quran-nav-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (currentQuranTab === 'para') {
        PARAS.forEach(p => {
            const li = document.createElement('li');
            li.className = 'qs-item';
            li.innerHTML = `
                <div class="qs-num">${p.n}</div>
                <div class="qs-text">
                    <div class="qs-name">${p.name}</div>
                    <div class="qs-meta">Juz ${p.n}</div>
                </div>
                <div class="qs-arabic">${p.ar}</div>
            `;
            li.onclick = () => openJuzReader(p.n);
            list.appendChild(li);
        });
    } else {
        if (!window.allSurahs) return;
        window.allSurahs.forEach(s => {
            const li = document.createElement('li');
            li.className = 'qs-item';
            li.innerHTML = `
                <div class="qs-num">${s.number}</div>
                <div class="qs-text">
                    <div class="qs-name">${s.englishName}</div>
                    <div class="qs-meta">${s.numberOfAyahs} Verses</div>
                </div>
                <div class="qs-arabic">${s.name}</div>
            `;
            li.onclick = () => openReader(s.number, s.englishName, s.revelationType, s.numberOfAyahs);
            list.appendChild(li);
        });
    }
}

function setupQuranListeners() {
    document.querySelectorAll('.qs-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.qs-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentQuranTab = e.target.dataset.tab;
            renderQuranNav();
        });
    });

    const searchEl = document.getElementById('quran-search');
    if (searchEl) {
        searchEl.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.qs-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(q) ? 'flex' : 'none';
            });
        });
    }

    document.querySelectorAll('.rd-mode').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.rd-mode').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.quranDisplayMode = e.target.dataset.mode;
            applyDisplayMode();
        });
    });
}

function applyDisplayMode() {
    const mode = state.quranDisplayMode;
    document.querySelectorAll('.verse-row').forEach(v => {
        const transEl = v.querySelector('.v-translation');
        const romanEl = v.querySelector('.v-translit');
        if (mode === 'arabic') { transEl.style.display = 'none'; romanEl.style.display = 'none'; }
        else if (mode === 'arabic-roman') { transEl.style.display = 'none'; romanEl.style.display = 'block'; }
        else if (mode === 'arabic-translation') { transEl.style.display = 'block'; romanEl.style.display = 'none'; }
        else { transEl.style.display = 'block'; romanEl.style.display = 'block'; }
    });
}

function openQuranSettings() { document.getElementById('quran-settings-modal').classList.remove('hidden'); }
function closeQuranSettings() { document.getElementById('quran-settings-modal').classList.add('hidden'); }

function closeReader() {
    document.getElementById('surah-reader-panel').classList.add('hidden');
    document.getElementById('quran-welcome').classList.remove('hidden');
    document.getElementById('quran-player-bar').classList.remove('active');
    stopAllAudio();
}

function stopAllAudio() {
    const ar = document.getElementById('quran-audio-arabic');
    const en = document.getElementById('quran-audio-translation');
    ar.pause(); en.pause();
    document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-play"></i>';
}

async function openReader(number, enName, type, ayahsCount) {
    document.getElementById('quran-welcome').classList.add('hidden');
    document.getElementById('surah-reader-panel').classList.remove('hidden');
    document.getElementById('reader-surah-name').textContent = enName;
    document.getElementById('reader-surah-info').textContent = `${type} • ${ayahsCount} Verses`;
    document.getElementById('qp-surah-name').textContent = enName;
    document.getElementById('qp-verse-info').textContent = `Verse 1/${ayahsCount}`;
    document.getElementById('bismillah-header').style.display = (number === 1 || number === 9) ? 'none' : 'block';
    
    const container = document.getElementById('verses-container');
    container.innerHTML = '<div class="reader-placeholder"><i class="fas fa-circle-notch fa-spin"></i><p>Loading Surah...</p></div>';

    try {
        const reciter = 'ar.alafasy';
        const [arRes, enRes, romanRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${number}/${reciter}`),
            fetch(`https://api.alquran.cloud/v1/surah/${number}/en.walk`),
            fetch(`https://api.alquran.cloud/v1/surah/${number}/en.transliteration`)
        ]);
        const arData = await arRes.json();
        const enData = await enRes.json();
        const romanData = await romanRes.json();

        if (arData.code === 200) {
            state.audioQueue = [];
            state.currentVersePlayingIndex = -1;
            let html = '';
            arData.data.ayahs.forEach((v, i) => {
                let text = v.text;
                if (number !== 1 && i === 0 && text.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ')) {
                    text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
                }
                state.audioQueue.push({ arabicUrl: v.audio, transUrl: enData.data.ayahs[i].audio, number: v.numberInSurah });
                html += `<div class="verse-row" id="v-${v.numberInSurah}" onclick="playVerseIndex(${i})">
                    <div class="v-arabic">${text} ۝</div>
                    <div class="v-translit">${romanData.data.ayahs[i].text}</div>
                    <div class="v-translation">${enData.data.ayahs[i].text}</div>
                    <div class="v-controls">
                        <div class="v-num">${v.numberInSurah}</div>
                        <div class="v-play-btn" onclick="event.stopPropagation(); playVerseIndex(${i})"><i class="fas fa-play"></i></div>
                    </div>
                </div>`;
            });
            container.innerHTML = html;
            container.scrollTop = 0;
            applyDisplayMode();
            setTimeout(() => document.getElementById('quran-player-bar').classList.add('active'), 100);
            initAudioListeners();
        }
    } catch (e) { container.innerHTML = '<div class="reader-placeholder">Error loading Surah.</div>'; }
}

async function openJuzReader(number) {
    document.getElementById('quran-welcome').classList.add('hidden');
    document.getElementById('surah-reader-panel').classList.remove('hidden');
    document.getElementById('reader-surah-name').textContent = `Juz ${number}`;
    document.getElementById('reader-surah-info').textContent = `Para / Juz ${number}`;
    document.getElementById('qp-surah-name').textContent = `Juz ${number}`;
    document.getElementById('bismillah-header').style.display = 'none';

    const container = document.getElementById('verses-container');
    container.innerHTML = '<div class="reader-placeholder"><i class="fas fa-circle-notch fa-spin"></i><p>Loading Juz...</p></div>';

    try {
        const reciter = 'ar.alafasy';
        const [arRes, enRes, romanRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/juz/${number}/${reciter}`),
            fetch(`https://api.alquran.cloud/v1/juz/${number}/en.walk`),
            fetch(`https://api.alquran.cloud/v1/juz/${number}/en.transliteration`)
        ]);
        const arData = await arRes.json();
        const enData = await enRes.json();
        const romanData = await romanRes.json();

        if (arData.code === 200) {
            state.audioQueue = [];
            state.currentVersePlayingIndex = -1;
            let html = '';
            arData.data.ayahs.forEach((v, i) => {
                state.audioQueue.push({ arabicUrl: v.audio, transUrl: enData.data.ayahs[i].audio, number: v.number });
                const ref = `${v.surah.englishName} : ${v.numberInSurah}`;
                html += `<div class="verse-row" id="v-${v.number}" onclick="playVerseIndex(${i})">
                    <div class="v-arabic">${v.text} ۝</div>
                    <div class="v-translit">${romanData.data.ayahs[i].text}</div>
                    <div class="v-translation">${enData.data.ayahs[i].text}</div>
                    <div class="v-controls">
                        <div class="v-num">${ref}</div>
                        <div class="v-play-btn" onclick="event.stopPropagation(); playVerseIndex(${i})"><i class="fas fa-play"></i></div>
                    </div>
                </div>`;
            });
            container.innerHTML = html;
            applyDisplayMode();
            document.getElementById('qp-verse-info').textContent = `Verse 1/${arData.data.ayahs.length}`;
            setTimeout(() => document.getElementById('quran-player-bar').classList.add('active'), 100);
            initAudioListeners();
        }
    } catch (e) { container.innerHTML = '<div class="reader-placeholder">Error loading Juz.</div>'; }
}

let audioListenersAdded = false;
function initAudioListeners() {
    if (audioListenersAdded) return;
    const ar = document.getElementById('quran-audio-arabic');
    const en = document.getElementById('quran-audio-translation');
    ar.onended = () => {
        if (state.quranDisplayMode === 'arabic-translation' || state.quranDisplayMode === 'full') setTimeout(() => playTranslationPhase(), 500);
        else setTimeout(() => advanceToNextVerse(), 500);
    };
    en.onended = () => setTimeout(() => advanceToNextVerse(), 500);
    ar.addEventListener('timeupdate', updateProgressBar);
    en.addEventListener('timeupdate', updateProgressBar);
    audioListenersAdded = true;
}

function playVerseIndex(index) {
    if (index < 0 || index >= state.audioQueue.length) return;
    document.querySelectorAll('.verse-row').forEach(el => el.classList.remove('playing-arabic', 'playing-translation'));
    
    if (state.currentVersePlayingIndex !== -1) {
        const prev = document.getElementById(`v-${state.audioQueue[state.currentVersePlayingIndex].number}`);
        if (prev) prev.classList.add('completed');
    }

    state.currentVersePlayingIndex = index;
    const verse = state.audioQueue[index];
    const el = document.getElementById(`v-${verse.number}`);
    document.getElementById('qp-verse-info').textContent = `Verse ${index + 1}/${state.audioQueue.length}`;
    document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-pause"></i>';
    state.audioPlaying = true;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playArabicPhase();
}

function playArabicPhase() {
    state.audioPlayingPhase = 'arabic';
    const verse = state.audioQueue[state.currentVersePlayingIndex];
    const el = document.getElementById(`v-${verse.number}`);
    const ar = document.getElementById('quran-audio-arabic');
    const en = document.getElementById('quran-audio-translation');
    if (el) { el.classList.remove('playing-translation'); el.classList.add('playing-arabic'); }
    en.pause(); ar.src = verse.arabicUrl; ar.play();
}

function playTranslationPhase() {
    const verse = state.audioQueue[state.currentVersePlayingIndex];
    if (!verse.transUrl || state.quranDisplayMode === 'arabic' || state.quranDisplayMode === 'arabic-roman') { advanceToNextVerse(); return; }
    state.audioPlayingPhase = 'translation';
    const el = document.getElementById(`v-${verse.number}`);
    const ar = document.getElementById('quran-audio-arabic');
    const en = document.getElementById('quran-audio-translation');
    if (el) { el.classList.remove('playing-arabic'); el.classList.add('playing-translation'); }
    ar.pause(); en.src = verse.transUrl; en.play();
}

function advanceToNextVerse() {
    if (state.repeatMode === 'verse') playVerseIndex(state.currentVersePlayingIndex);
    else if (state.currentVersePlayingIndex + 1 < state.audioQueue.length) playVerseIndex(state.currentVersePlayingIndex + 1);
    else {
        if (state.repeatMode === 'surah') playVerseIndex(0);
        else { stopAllAudio(); showToast('Completed. MashaAllah!'); }
    }
}

function toggleAdvancedAudio() {
    const ar = document.getElementById('quran-audio-arabic');
    const en = document.getElementById('quran-audio-translation');
    if (!state.audioPlaying) {
        if (state.currentVersePlayingIndex === -1) playVerseIndex(0);
        else {
            state.audioPlaying = true;
            document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-pause"></i>';
            if (state.audioPlayingPhase === 'arabic') ar.play(); else en.play();
        }
    } else {
        state.audioPlaying = false;
        document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-play"></i>';
        ar.pause(); en.pause();
    }
}

function playNextVerse() { if (state.currentVersePlayingIndex + 1 < state.audioQueue.length) playVerseIndex(state.currentVersePlayingIndex + 1); }
function playPrevVerse() { if (state.currentVersePlayingIndex > 0) playVerseIndex(state.currentVersePlayingIndex - 1); }
function playFirstVerse() { playVerseIndex(0); }
function playLastVerse() { playVerseIndex(state.audioQueue.length - 1); }

function toggleRepeatMode() {
    const btn = document.getElementById('qp-repeat-btn');
    if (state.repeatMode === 'none') { state.repeatMode = 'verse'; btn.style.color = 'var(--primary-color)'; showToast('Repeat: Verse'); }
    else if (state.repeatMode === 'verse') { state.repeatMode = 'surah'; btn.style.color = '#3b82f6'; showToast('Repeat: All'); }
    else { state.repeatMode = 'none'; btn.style.color = 'white'; showToast('Repeat: Off'); }
}

function updateProgressBar(e) {
    const audio = e.target;
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('qp-progress-fill').style.width = `${pct}%`;
    const fmt = (t) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
    document.getElementById('qp-time-current').textContent = fmt(audio.currentTime);
    document.getElementById('qp-time-total').textContent = fmt(audio.duration);
}

function toggleFullAudio() {
    stopAllAudio();
}

function copyVerse() {
  const ar = document.getElementById('d-verse-arabic').textContent;
  const en = document.getElementById('d-verse-translation').textContent;
  const ref = document.getElementById('d-verse-ref').textContent;
  const text = `${ar}\n"${en}"\n- ${ref}`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Verse copied to clipboard');
  });
}

function copySpecificVerse(ar, en) {
  navigator.clipboard.writeText(`${ar}\n"${en}"`).then(() => {
    showToast('Verse copied');
  });
}

/* ==========================================================================
   NAMES, DUAS, PROPHETS (Mock Data Renders)
   ========================================================================== */
async function loadNames() {
  let names = MOCK_NAMES;
  try {
    const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
    const data = await res.json();
    if (data.code === 200) {
      names = data.data.map(n => ({
        num: n.number,
        arabic: n.name,
        trans: n.transliteration,
        meaning: n.en.meaning
      }));
    }
  } catch (e) {
    console.warn('Could not fetch 99 names, using fallback', e);
  }

  const banner = document.getElementById('daily-name-banner');
  const day = new Date().getDate() % names.length;
  const dName = names[day];

  if (dName) {
    banner.innerHTML = `
        <div class="dn-info">
          <h3>Name of the Day</h3>
          <div class="dn-trans">${dName.trans}</div>
          <div class="dn-meaning">${dName.meaning}</div>
        </div>
        <div class="dn-arabic">${dName.arabic}</div>
      `;
  }

  let html = '';
  names.forEach(n => {
    html += `
        <div class="name-card">
          <div class="nc-num">${n.num}</div>
          <div class="nc-arabic">${n.arabic}</div>
          <div class="nc-trans">${n.trans}</div>
          <div class="nc-meaning">${n.meaning}</div>
        </div>
      `;
  });
  document.getElementById('names-grid').innerHTML = html;
}

function loadDuas(type) {
  const container = document.getElementById('duas-container');
  let filtered = type === 'favorites' ? MOCK_DUAS : MOCK_DUAS.filter(d => d.type === type);

  if (filtered.length === 0) filtered = MOCK_DUAS; // Fallback

  let html = '';
  filtered.forEach(d => {
    html += `
        <div class="dua-card">
          <div class="dc-title">
            <span>${d.title}</span>
            <button class="action-btn" style="width:30px;height:30px;font-size:0.8rem;"><i class="fas fa-heart"></i></button>
          </div>
          <div class="dc-arabic">${d.arabic}</div>
          <div class="dc-translit">${d.trans}</div>
          <div class="dc-meaning">"${d.meaning}"</div>
          <div class="dc-actions">
            <button class="action-btn" onclick="copySpecificVerse('${d.arabic}', '${d.meaning}')" aria-label="Copy dua"><i class="fas fa-copy"></i></button>
          </div>
        </div>
      `;
  });
  container.innerHTML = html;
}

function loadProphets() {
  const grid = document.getElementById('prophets-grid');
  let html = '';

  MOCK_PROPHETS.forEach((p, i) => {
    html += `
        <div class="prophet-card" onclick="openProphetModal(${i})">
          <div class="pc-arabic">${p.arabic}</div>
          <div class="pc-name-en">Prophet ${p.name}</div>
          <div class="pc-title">${p.title}</div>
        </div>
      `;
  });
  grid.innerHTML = html;
}

function openProphetModal(index) {
  const p = MOCK_PROPHETS[index];
  document.getElementById('pm-arabic').textContent = p.arabic;
  document.getElementById('pm-name').textContent = `Prophet ${p.name} (AS)`;
  document.getElementById('pm-title').textContent = p.title;
  document.getElementById('pm-body').innerHTML = `<p>${p.desc}</p><br><p><em>Peace be upon him. His complete story is found across various Surahs in the Noble Quran.</em></p>`;

  document.getElementById('prophet-modal').classList.remove('hidden');
}

function closeProphetModal() {
  document.getElementById('prophet-modal').classList.add('hidden');
}

function loadHadith() {
  const featured = document.getElementById('hadith-featured');
  const day = new Date().getDate() % 4;
  const hDaily = MOCK_HADITH[day];

  featured.innerHTML = `
      <div class="hf-text">"${hDaily.text}"</div>
      <div class="hf-source">
        <span>— ${hDaily.source}</span>
        <button class="btn-secondary" onclick="copySpecificVerse('${hDaily.text}', '${hDaily.source}')"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

  const list = document.getElementById('hadith-list');
  let html = '';
  MOCK_HADITH.forEach(h => {
    if (h.source !== hDaily.source) {
      html += `
          <div class="hadith-card">
            <div class="hc-text">"${h.text}"</div>
            <div class="hc-bottom">
              <span class="hc-source">${h.source}</span>
              <button class="icon-btn" style="width:30px;height:30px;" onclick="copySpecificVerse('${h.text}', '${h.source}')"><i class="fas fa-copy"></i></button>
            </div>
          </div>
        `;
    }
  });
  list.innerHTML = html;
}

/* ==========================================================================
   QUIZ LOGIC
   ========================================================================== */
let quizState = { active: false, level: 'beginner', score: 0, qIndex: 0 };
const QUIZ_QUESTIONS = [
  { q: "Which Surah is considered the 'Heart of the Quran'?", options: ["Surah Al-Mulk", "Surah Yaseen", "Surah Al-Kahf", "Surah Ar-Rahman"], answer: 1 },
  { q: "How many obligatory daily prayers are there in Islam?", options: ["3", "4", "5", "6"], answer: 2 },
  { q: "Which Prophet built the Kaaba with his son?", options: ["Prophet Nuh", "Prophet Musa", "Prophet Ibrahim", "Prophet Muhammad"], answer: 2 },
  { q: "What is the meaning of the name 'Al-Khaliq'?", options: ["The Merciful", "The Creator", "The Sustainer", "The King"], answer: 1 }
];

function selectLevel(level) {
  quizState.level = level;
  document.querySelectorAll('.level-card').forEach(el => el.classList.remove('active'));
  document.querySelector(`.level-card[data-level="${level}"]`).classList.add('active');
}

function startQuiz() {
  quizState.active = true;
  quizState.score = 0;
  quizState.qIndex = 0;

  document.getElementById('quiz-setup').classList.add('hidden');
  document.getElementById('quiz-active').classList.remove('hidden');

  document.getElementById('q-total').textContent = QUIZ_QUESTIONS.length;
  renderQuestion();
}

function renderQuestion() {
  const qData = QUIZ_QUESTIONS[quizState.qIndex];
  document.getElementById('q-current').textContent = quizState.qIndex + 1;
  document.getElementById('q-text').textContent = qData.q;

  const prog = ((quizState.qIndex) / QUIZ_QUESTIONS.length) * 100;
  document.getElementById('quiz-progress-bar').style.width = `${prog}%`;
  document.getElementById('q-score').textContent = quizState.score;

  let optionsHtml = '';
  qData.options.forEach((opt, i) => {
    optionsHtml += `<button class="option-btn" onclick="submitAnswer(${i}, this)">${opt}</button>`;
  });
  document.getElementById('q-options').innerHTML = optionsHtml;
}

function submitAnswer(selectedIndex, btnEl) {
  const correctIndex = QUIZ_QUESTIONS[quizState.qIndex].answer;
  const btns = document.querySelectorAll('.option-btn');

  // Disable all buttons
  btns.forEach(b => b.style.pointerEvents = 'none');

  if (selectedIndex === correctIndex) {
    btnEl.classList.add('correct');
    quizState.score++;
    document.getElementById('q-score').textContent = quizState.score;
  } else {
    btnEl.classList.add('wrong');
    btns[correctIndex].classList.add('correct');
  }

  setTimeout(() => {
    quizState.qIndex++;
    if (quizState.qIndex < QUIZ_QUESTIONS.length) {
      renderQuestion();
    } else {
      endQuiz();
    }
  }, 1500);
}

function endQuiz() {
  document.getElementById('quiz-active').classList.add('hidden');
  document.getElementById('quiz-results').classList.remove('hidden');

  const pct = Math.round((quizState.score / QUIZ_QUESTIONS.length) * 100);
  document.getElementById('results-score').textContent = `${quizState.score}/${QUIZ_QUESTIONS.length}`;
  document.getElementById('results-pct').textContent = `${pct}% Accuracy`;

  let emoji = '🎉';
  let msg = 'Excellent MashAllah!';
  if (pct < 50) { emoji = '📚'; msg = 'Keep learning and try again!'; }
  else if (pct < 100) { emoji = '⭐'; msg = 'Great job!'; }

  document.getElementById('results-emoji').textContent = emoji;
  document.getElementById('results-msg').textContent = msg;

  // Save state
  state.quizScore = Math.max(state.quizScore, pct);
  localStorage.setItem('quizScore', state.quizScore);
  if (document.getElementById('stat-quiz')) {
    document.getElementById('stat-quiz').textContent = `${state.quizScore}%`;
  }
}

function restartQuiz() {
  document.getElementById('quiz-results').classList.add('hidden');
  document.getElementById('quiz-setup').classList.remove('hidden');
}
