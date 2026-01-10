// Authentic Duas Data
const duas = [
    {
        id: 1,
        category: "Morning",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا ، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahna wa bika amsayna, wa bika nahya wa bika namootu wa ilaykan-nushoor.",
        translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
        ref: "Tirmidhi"
    },
    {
        id: 2,
        category: "Food",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        ref: "Bukhari"
    },
    {
        id: 3,
        category: "Travel",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon.",
        translation: "Glory to Him purely who has subjected this to us, and we were not able to do it. And surely to our Lord we are returning.",
        ref: "Quran 43:13-14"
    },
    {
        id: 4,
        category: "Sleep",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amootu wa ahya.",
        translation: "In Your Name, O Allah, I die and I live.",
        ref: "Bukhari"
    },
    {
        id: 5,
        category: "Home",
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
        transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna.",
        translation: "In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we depend.",
        ref: "Abu Dawud"
    },
    {
        id: 6,
        category: "Evening",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
        transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallah wahdahu la shareeka lah.",
        translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
        ref: "Muslim"
    },
    {
        id: 7,
        category: "Prayer",
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلاَةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاء",
        transliteration: "Rabbi j'alnee muqeemas-salati wa min dhurriyyatee rabbana wa taqabbal du'a.",
        translation: "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.",
        ref: "Quran 14:40"
    },
    {
        id: 8,
        category: "Ablution",
        arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration: "Ash-hadu an la ilaha illallah wahdahu la shareeka lahu wa ash-hadu anna Muhammadan 'abduhu wa Rasooluh.",
        translation: "I testify that there is no deity except Allah, alone, without partner, and I testify that Muhammad is His Servant and Messenger.",
        ref: "Muslim"
    },
    {
        id: 9,
        category: "Clothing",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Alhamdu lillahil-ladhee kasaanee hadha (ath-thawba) wa razaqaneehi min ghayri hawlin minnee wa la quwwah.",
        translation: "Praise be to Allah Who has clothed me with this (garment) and provided it for me, though I was powerless myself and incapable.",
        ref: "Abu Dawud"
    },
    {
        id: 10,
        category: "Sleep",
        arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ",
        transliteration: "Allahumma aslamtu nafsee ilayk, wa fawwadtu amree ilayk, wa wajjahtu wajhee ilayk.",
        translation: "O Allah, I submit my soul unto You, and I entrust my affair unto You, and I turn my face towards You.",
        ref: "Bukhari"
    },
    {
        id: 11,
        category: "Morning",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdihi.",
        translation: "Glory is to Allah and praise is to Him.",
        ref: "Bukhari"
    },
    {
        id: 12,
        category: "Prayer",
        arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
        transliteration: "Allahumma antas-salam wa minkas-salam tabarakta ya dhal-jalali wal-ikram.",
        translation: "O Allah, You are As-Salam (The One Who is free from all defects and deficiencies), and from You is all peace, blessed are You, O Possessor of majesty and honor.",
        ref: "Muslim"
    }
];

let currentFilter = 'all';
let favorites = JSON.parse(localStorage.getItem('favDuas') || '[]');
let showOnlyFavorites = false;

document.addEventListener('DOMContentLoaded', () => {
    renderDuas();
    setupFilters();
    setupSearch();
    setupFavoritesToggle();
});

function renderDuas() {
    const container = document.getElementById('duas-container');
    container.innerHTML = '';

    let filtered = duas;

    // 1. Filter by Category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(d => d.category === currentFilter);
    }

    // 2. Filter by Favorites
    if (showOnlyFavorites) {
        filtered = filtered.filter(d => favorites.includes(d.id));
    }

    // 3. Search Filter
    const query = document.getElementById('search-duas').value.toLowerCase();
    if (query) {
        filtered = filtered.filter(d =>
            d.translation.toLowerCase().includes(query) ||
            d.transliteration.toLowerCase().includes(query) ||
            d.category.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:rgba(255,255,255,0.5);">No duas found.</div>';
        return;
    }

    filtered.forEach(d => {
        const isFav = favorites.includes(d.id);
        const card = document.createElement('div');
        card.className = 'dua-card';
        card.innerHTML = `
            <div class="dua-meta">
                <span class="badge">${d.category}</span>
                <span class="badge" style="background:rgba(255,255,255,0.05); color:#94a3b8;">Ref: ${d.ref}</span>
            </div>
            <div class="arabic-text">${d.arabic}</div>
            <div class="transliteration">${d.transliteration}</div>
            <div class="translation">"${d.translation}"</div>
            <div class="card-actions">
                <button class="action-btn" onclick="copyDua('${d.translation}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="action-btn" onclick="shareDua('${d.translation}')">
                    <i class="fas fa-share-alt"></i> Share
                </button>
                <button class="action-btn ${isFav ? 'active-heart' : ''}" onclick="toggleLike(${d.id})">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i> ${isFav ? 'Saved' : 'Save'}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filters
function setupFilters() {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            currentFilter = btn.dataset.cat;
            // Reset searches/favs logic if needed, but here we stack them
            renderDuas();

            // Update Title
            document.getElementById('feed-title').innerText = currentFilter === 'all' ? 'All Duas' : currentFilter + ' Duas';
        });
    });
}

function setupSearch() {
    document.getElementById('search-duas').addEventListener('input', renderDuas);
}

function setupFavoritesToggle() {
    const btn = document.getElementById('toggle-favorites');
    btn.addEventListener('click', () => {
        showOnlyFavorites = !showOnlyFavorites;
        btn.style.background = showOnlyFavorites ? 'var(--accent)' : 'transparent';
        btn.style.color = showOnlyFavorites ? 'white' : 'var(--secondary)';
        btn.style.borderColor = showOnlyFavorites ? 'var(--accent)' : 'var(--border)';

        document.getElementById('feed-title').innerText = showOnlyFavorites ? 'Your Favorites' : 'All Duas';
        renderDuas();
    });
}

// Actions
window.copyDua = (text) => {
    navigator.clipboard.writeText(text);
    showToast();
};

window.shareDua = (text) => {
    if (navigator.share) {
        navigator.share({
            title: 'Authentic Dua',
            text: text,
            url: window.location.href
        });
    } else {
        copyDua(text);
    }
};

window.toggleLike = (id) => {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favDuas', JSON.stringify(favorites));
    renderDuas();
};

function showToast() {
    const t = document.getElementById('toast');
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 2000);
}
