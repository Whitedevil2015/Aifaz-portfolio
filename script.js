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
  showTranslation: true
};

// Audio Player
const audioPlayer = document.getElementById('quran-audio');

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

/* ==========================================================================
   QURAN (Alquran.cloud API) - ADVANCED MODULE
   ========================================================================== */

// Advanced State
state.quranDisplayMode = 'full'; // arabic, arabic-roman, arabic-translation, full
state.showTranslit = true;
state.quranAudioFull = null;
state.currentSurahMeta = null;

async function loadSurahList() {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/meta');
    const data = await res.json();

    if (data.code === 200) {
      const surahs = data.data.surahs.references;
      window.allSurahs = surahs; // cache

      renderSurahGrid(surahs);
      renderJuzGrid();
    }
  } catch (e) {
    document.getElementById('surah-grid').innerHTML = '<div style="padding: 2rem; text-align:center">Error loading Surahs. Working offline.</div>';
  }

  setupQuranListeners();
}

function renderSurahGrid(surahs) {
  let html = '';
  surahs.forEach(s => {
    html += `
        <div class="surah-card" onclick="openReader(${s.number}, '${s.englishName}', '${s.revelationType}', ${s.numberOfAyahs})">
          <div class="sc-num">${s.number}</div>
          <div class="sc-info">
            <div class="sc-name-en">${s.englishName}</div>
            <div class="sc-name-trans">${s.englishNameTranslation}</div>
            <div class="sc-meta">
              <span class="sc-badge">${s.revelationType}</span>
              <span class="sc-badge">${s.numberOfAyahs} Verses</span>
            </div>
          </div>
          <div class="sc-name-ar">${s.name}</div>
        </div>
      `;
  });
  document.getElementById('surah-grid').innerHTML = html;
}

function renderJuzGrid() {
  let html = '';
  const juzNames = ['Al Fatiha', 'Al Baqarah', 'Al Imran', 'An Nisa', 'Al Ma\'idah', 'Al An\'am', 'Al A\'raf', 'Al Anfal', 'At Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar Ra\'d', 'Ibrahim', 'Al Hijr', 'An Nahl', 'Al Isra', 'Al Kahf', 'Maryam', 'Ta Ha', 'Al Anbiya', 'Al Hajj', 'Al Mu\'minun', 'An Nur', 'Al Furqan', 'Ash Shu\'ara', 'An Naml', 'Al Qasas', 'Al Ankabut', 'Ar Rum'];

  for (let i = 1; i <= 30; i++) {
    html += `
        <div class="juz-card" onclick="openJuzReader(${i})">
          <div class="jc-header">
            <div class="jc-num">Juz ${i}</div>
            <div class="jc-ar">الجزء ${i}</div>
          </div>
          <div class="jc-info">Starts with: ${juzNames[i - 1] || 'Surah'}</div>
        </div>
      `;
  }
  document.getElementById('juz-grid').innerHTML = html;
}

function setupQuranListeners() {
  // Tabs
  document.querySelectorAll('.quran-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.quran-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const view = e.target.dataset.tab;

      document.querySelectorAll('.quran-grid-container').forEach(c => c.classList.remove('active'));
      if (view === 'surah') document.getElementById('surah-grid-container').classList.add('active');
      if (view === 'juz') document.getElementById('juz-grid-container').classList.add('active');
    });
  });

  // Filters
  document.querySelectorAll('.q-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.q-filter').forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.dataset.filter;
      if (!window.allSurahs) return;

      if (filter === 'all') renderSurahGrid(window.allSurahs);
      else renderSurahGrid(window.allSurahs.filter(s => s.revelationType.toLowerCase() === filter));
    });
  });

  // Search
  const searchEl = document.getElementById('quran-search');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (!window.allSurahs) return;
      const filtered = window.allSurahs.filter(s =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q)
      );
      renderSurahGrid(filtered);
    });
  }

  // Display Modes
  document.querySelectorAll('.rd-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.rd-mode').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.quranDisplayMode = e.target.dataset.mode;
      applyDisplayMode();
    });
  });

  // Settings
  document.getElementById('ar-font-size').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--quran-ar-size', `${e.target.value}px`);
  });
  document.getElementById('en-font-size').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--quran-en-size', `${e.target.value}px`);
  });

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById('verses-container').setAttribute('data-rtheme', e.target.dataset.rtheme);
    });
  });

  document.getElementById('translit-toggle').addEventListener('change', (e) => {
    state.showTranslit = e.target.checked;
    applyDisplayMode();
  });
}

function applyDisplayMode() {
  const verses = document.querySelectorAll('.verse-row');
  const mode = state.quranDisplayMode; // full, arabic, arabic-roman, arabic-translation

  verses.forEach(v => {
    const transEl = v.querySelector('.v-translation');
    const romanEl = v.querySelector('.v-translit');

    if (mode === 'arabic') {
      if (transEl) transEl.style.display = 'none';
      if (romanEl) romanEl.style.display = 'none';
    } else if (mode === 'arabic-roman') {
      if (transEl) transEl.style.display = 'none';
      if (romanEl) romanEl.style.display = state.showTranslit ? 'block' : 'none';
    } else if (mode === 'arabic-translation') {
      if (transEl) transEl.style.display = 'block';
      if (romanEl) romanEl.style.display = 'none';
    } else { // full
      if (transEl) transEl.style.display = 'block';
      if (romanEl) romanEl.style.display = state.showTranslit ? 'block' : 'none';
    }
  });
}

function openQuranSettings() { document.getElementById('quran-settings-modal').classList.remove('hidden'); }
function closeQuranSettings() { document.getElementById('quran-settings-modal').classList.add('hidden'); }
function closeReader() {
  document.getElementById('surah-reader-panel').classList.add('hidden');
  document.getElementById('quran-browse-layout').classList.remove('hidden');
  document.getElementById('quran-player-bar').classList.remove('active');
  
  const audioAr = document.getElementById('quran-audio-arabic');
  const audioEn = document.getElementById('quran-audio-translation');
  if (audioAr) audioAr.pause();
  if (audioEn) audioEn.pause();
  state.audioPlaying = false;
  document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-play"></i>';
}

async function openReader(number, enName, type, ayahsCount) {
  state.currentSurah = number;
  state.currentSurahMeta = { enName, type, ayahsCount };

  document.getElementById('quran-browse-layout').classList.add('hidden');
  document.getElementById('surah-reader-panel').classList.remove('hidden');

  document.getElementById('reader-surah-name').textContent = enName;
  document.getElementById('reader-surah-info').textContent = `${type} • ${ayahsCount} Verses`;
  
  document.getElementById('qp-surah-name').textContent = enName;
  document.getElementById('qp-verse-info').textContent = `Verse 1/${ayahsCount}`;

  if (number === 1 || number === 9) {
    document.getElementById('bismillah-header').style.display = 'none';
  } else {
    document.getElementById('bismillah-header').style.display = 'block';
  }

  const container = document.getElementById('verses-container');
  container.innerHTML = '<div class="reader-placeholder"><i class="fas fa-circle-notch fa-spin"></i><p>Loading verses...</p></div>';

  try {
    const reciter = document.getElementById('reciter-select') ? document.getElementById('reciter-select').value : 'ar.alafasy';

    const [arRes, enRes, romanRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${number}/${reciter}`),
      fetch(`https://api.alquran.cloud/v1/surah/${number}/en.walk`),
      fetch(`https://api.alquran.cloud/v1/surah/${number}/en.transliteration`)
    ]);

    const arData = await arRes.json();
    const enData = await enRes.json();
    const romanData = await romanRes.json();

    if (arData.code === 200) {
      const arVerses = arData.data.ayahs;
      const enVerses = enData.data.ayahs;
      const romanVerses = romanData.data.ayahs;

      state.audioQueue = [];
      state.currentVersePlayingIndex = -1;

      let html = '';
      arVerses.forEach((v, i) => {
        let text = v.text;
        if (number !== 1 && i === 0 && text.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ')) {
          text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
        }

        state.audioQueue.push({
          arabicUrl: v.audio,
          transUrl: enVerses[i].audio || null,
          number: v.number, // absolute number
          text: enVerses[i].text
        });

        html += `
            <div class="verse-row" id="v-${v.number}" onclick="playVerseIndex(${i})">
              <div class="v-arabic">${text} ۝</div>
              <div class="v-translit">${romanVerses[i].text}</div>
              <div class="v-translation">${enVerses[i].text}</div>
              <div class="v-controls">
                <div class="v-num">${v.numberInSurah}</div>
                <div class="v-play-btn" onclick="event.stopPropagation(); playVerseIndex(${i})">
                  <i class="fas fa-play"></i>
                </div>
                <button class="action-btn" style="width:30px;height:30px;font-size:0.8rem;" onclick="event.stopPropagation(); copySpecificVerse('${text}', '${enVerses[i].text}')">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          `;
      });

      container.innerHTML = html;
      container.scrollTop = 0;
      applyDisplayMode();

      setTimeout(() => document.getElementById('quran-player-bar').classList.add('active'), 100);

      state.versesRead += ayahsCount;
      localStorage.setItem('versesRead', state.versesRead);
      if (document.getElementById('stat-verses')) document.getElementById('stat-verses').textContent = state.versesRead;
      
      initAudioListeners();
    }
  } catch (e) {
    container.innerHTML = '<div class="reader-placeholder"><p>Error loading verses.</p></div>';
  }
}

async function openJuzReader(juzNumber) {
  document.getElementById('quran-browse-layout').classList.add('hidden');
  document.getElementById('surah-reader-panel').classList.remove('hidden');

  document.getElementById('reader-surah-name').textContent = `Juz ${juzNumber}`;
  document.getElementById('reader-surah-info').textContent = `الجزء ${juzNumber}`;
  document.getElementById('qp-surah-name').textContent = `Juz ${juzNumber}`;
  document.getElementById('bismillah-header').style.display = 'none';

  const container = document.getElementById('verses-container');
  container.innerHTML = '<div class="reader-placeholder"><i class="fas fa-circle-notch fa-spin"></i><p>Loading Juz...</p></div>';

  try {
    const reciter = document.getElementById('reciter-select') ? document.getElementById('reciter-select').value : 'ar.alafasy';

    const [arRes, enRes, romanRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/${reciter}`),
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/en.walk`),
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/en.transliteration`)
    ]);

    const arData = await arRes.json();
    const enData = await enRes.json();
    const romanData = await romanRes.json();

    if (arData.code === 200) {
      const arVerses = arData.data.ayahs;
      const enVerses = enData.data.ayahs;
      const romanVerses = romanData.data.ayahs;

      document.getElementById('qp-verse-info').textContent = `Verse 1/${arVerses.length}`;

      state.audioQueue = [];
      state.currentVersePlayingIndex = -1;

      let html = '';
      arVerses.forEach((v, i) => {
        let text = v.text;

        state.audioQueue.push({
          arabicUrl: v.audio,
          transUrl: enVerses[i].audio || null,
          number: v.number,
          text: enVerses[i].text
        });

        if (v.numberInSurah === 1) {
          html += `<div style="text-align:center; padding:1.5rem; margin-top:2rem; background:rgba(0,0,0,0.2); border-radius:12px;">
                      <h4 style="color:var(--primary-glow); font-size:1.5rem;">Surah ${v.surah.englishName}</h4>
                   </div>`;
          if (v.surah.number !== 1 && v.surah.number !== 9 && text.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ')) {
            text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
            html += `<div class="bismillah" style="margin:1rem 0;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
          }
        }

        html += `
            <div class="verse-row" id="v-${v.number}" onclick="playVerseIndex(${i})">
              <div class="v-arabic">${text} ۝</div>
              <div class="v-translit">${romanVerses[i].text}</div>
              <div class="v-translation">${enVerses[i].text}</div>
              <div class="v-controls">
                <div class="v-num" style="font-size:0.75rem">${v.surah.englishName} ${v.numberInSurah}</div>
                <div class="v-play-btn" onclick="event.stopPropagation(); playVerseIndex(${i})">
                  <i class="fas fa-play"></i>
                </div>
                <button class="action-btn" style="width:30px;height:30px;font-size:0.8rem;" onclick="event.stopPropagation(); copySpecificVerse('${text}', '${enVerses[i].text}')">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          `;
      });

      container.innerHTML = html;
      container.scrollTop = 0;
      applyDisplayMode();

      setTimeout(() => document.getElementById('quran-player-bar').classList.add('active'), 100);

      state.versesRead += arVerses.length;
      localStorage.setItem('versesRead', state.versesRead);
      if (document.getElementById('stat-verses')) document.getElementById('stat-verses').textContent = state.versesRead;
      
      initAudioListeners();
    }
  } catch (e) {
    container.innerHTML = '<div class="reader-placeholder"><p>Error loading Juz.</p></div>';
  }
}

let audioListenersAdded = false;
function initAudioListeners() {
  if(audioListenersAdded) return;
  const audioAr = document.getElementById('quran-audio-arabic');
  const audioEn = document.getElementById('quran-audio-translation');
  
  if (!audioAr || !audioEn) return;
  
  audioAr.onended = () => {
    if (state.quranDisplayMode === 'arabic-translation' || state.quranDisplayMode === 'full') {
      setTimeout(() => playTranslationPhase(), 500);
    } else {
      setTimeout(() => advanceToNextVerse(), 500);
    }
  };
  
  audioEn.onended = () => {
    setTimeout(() => advanceToNextVerse(), 500);
  };
  
  audioAr.addEventListener('timeupdate', updateProgressBar);
  audioEn.addEventListener('timeupdate', updateProgressBar);
  
  audioListenersAdded = true;
}

function playVerseIndex(index) {
  if (index < 0 || index >= state.audioQueue.length) return;
  
  document.querySelectorAll('.verse-row').forEach(el => {
    el.classList.remove('playing-arabic', 'playing-translation');
  });
  
  if (state.currentVersePlayingIndex !== -1 && state.currentVersePlayingIndex < index) {
    const prevId = `v-${state.audioQueue[state.currentVersePlayingIndex].number}`;
    const prevEl = document.getElementById(prevId);
    if (prevEl) prevEl.classList.add('completed');
  }

  state.currentVersePlayingIndex = index;
  const verseData = state.audioQueue[index];
  const verseEl = document.getElementById(`v-${verseData.number}`);
  
  document.getElementById('qp-verse-info').textContent = `Verse ${index + 1}/${state.audioQueue.length}`;
  document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-pause"></i>';
  state.audioPlaying = true;
  
  if (verseEl) {
    verseEl.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
  
  playArabicPhase();
}

function playArabicPhase() {
  state.audioPlayingPhase = 'arabic';
  const verseData = state.audioQueue[state.currentVersePlayingIndex];
  const verseEl = document.getElementById(`v-${verseData.number}`);
  const audioAr = document.getElementById('quran-audio-arabic');
  const audioEn = document.getElementById('quran-audio-translation');
  
  if(verseEl) {
    verseEl.classList.remove('playing-translation');
    verseEl.classList.add('playing-arabic');
  }
  
  if (audioEn) audioEn.pause();
  if (audioAr) {
    audioAr.src = verseData.arabicUrl;
    audioAr.play();
  }
}

function playTranslationPhase() {
  const verseData = state.audioQueue[state.currentVersePlayingIndex];
  if (!verseData.transUrl || state.quranDisplayMode === 'arabic' || state.quranDisplayMode === 'arabic-roman') {
    advanceToNextVerse();
    return;
  }
  
  state.audioPlayingPhase = 'translation';
  const verseEl = document.getElementById(`v-${verseData.number}`);
  const audioAr = document.getElementById('quran-audio-arabic');
  const audioEn = document.getElementById('quran-audio-translation');
  
  if(verseEl) {
    verseEl.classList.remove('playing-arabic');
    verseEl.classList.add('playing-translation');
  }
  
  if (audioAr) audioAr.pause();
  if (audioEn) {
    audioEn.src = verseData.transUrl;
    audioEn.play();
  }
}

function advanceToNextVerse() {
  const verseData = state.audioQueue[state.currentVersePlayingIndex];
  const verseEl = document.getElementById(`v-${verseData.number}`);
  if (verseEl) {
    verseEl.classList.remove('playing-arabic', 'playing-translation');
    verseEl.classList.add('completed');
  }
  
  if (state.repeatMode === 'verse') {
    playVerseIndex(state.currentVersePlayingIndex);
  } else if (state.currentVersePlayingIndex + 1 < state.audioQueue.length) {
    playVerseIndex(state.currentVersePlayingIndex + 1);
  } else {
    if (state.repeatMode === 'surah') {
      playVerseIndex(0);
    } else {
      document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-play"></i>';
      state.audioPlaying = false;
      state.audioPlayingPhase = 'none';
      showToast('Completed. MashaAllah!');
    }
  }
}

function toggleAdvancedAudio() {
  const audioAr = document.getElementById('quran-audio-arabic');
  const audioEn = document.getElementById('quran-audio-translation');
  
  if (!state.audioPlaying) {
    if (state.currentVersePlayingIndex === -1 && state.audioQueue.length > 0) {
      playVerseIndex(0);
    } else {
      state.audioPlaying = true;
      document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-pause"></i>';
      if (state.audioPlayingPhase === 'arabic' && audioAr) audioAr.play();
      else if (state.audioPlayingPhase === 'translation' && audioEn) audioEn.play();
      else if (audioAr && audioAr.src) audioAr.play();
    }
  } else {
    state.audioPlaying = false;
    document.getElementById('qp-play-btn').innerHTML = '<i class="fas fa-play"></i>';
    if (audioAr) audioAr.pause();
    if (audioEn) audioEn.pause();
  }
}

function playNextVerse() {
  if (state.currentVersePlayingIndex + 1 < state.audioQueue.length) {
    playVerseIndex(state.currentVersePlayingIndex + 1);
  }
}
function playPrevVerse() {
  if (state.currentVersePlayingIndex > 0) {
    playVerseIndex(state.currentVersePlayingIndex - 1);
  }
}
function playFirstVerse() {
  if (state.audioQueue.length > 0) playVerseIndex(0);
}
function playLastVerse() {
  if (state.audioQueue.length > 0) playVerseIndex(state.audioQueue.length - 1);
}

function toggleRepeatMode() {
  const btn = document.getElementById('qp-repeat-btn');
  if (state.repeatMode === 'none') {
    state.repeatMode = 'verse';
    btn.style.color = 'var(--primary-color)';
    showToast('Repeat Mode: Verse');
  } else if (state.repeatMode === 'verse') {
    state.repeatMode = 'surah';
    btn.style.color = '#3b82f6';
    showToast('Repeat Mode: Surah/Juz');
  } else {
    state.repeatMode = 'none';
    btn.style.color = 'white';
    showToast('Repeat Mode: Off');
  }
}

function updateProgressBar(e) {
  const audio = e.target;
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('qp-progress-fill').style.width = `${pct}%`;
  
  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };
  
  document.getElementById('qp-time-current').textContent = formatTime(audio.currentTime);
  document.getElementById('qp-time-total').textContent = formatTime(audio.duration);
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
