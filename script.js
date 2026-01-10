// Script for Crystal Quran Reader

const popularSurahs = [
    { num: 1, en: "Al-Fatiha", ar: "الفاتحة", meaning: "The Opener" },
    { num: 18, en: "Al-Kahf", ar: "الكهف", meaning: "The Cave" },
    { num: 36, en: "Ya-Sin", ar: "يس", meaning: "Ya-Sin" },
    { num: 55, en: "Ar-Rahman", ar: "الرحمن", meaning: "The Beneficent" },
    { num: 56, en: "Al-Waqi'ah", ar: "الواقعة", meaning: "The Inevitable" },
    { num: 67, en: "Al-Mulk", ar: "الملك", meaning: "The Sovereignty" },
    { num: 2, en: "Al-Baqarah", ar: "البقرة", meaning: "The Cow" },
    { num: 3, en: "Al-Imran", ar: "آل عمران", meaning: "Family of Imran" },
    { num: 4, en: "An-Nisa", ar: "النساء", meaning: "The Women" },
    { num: 112, en: "Al-Ikhlas", ar: "الإخلاص", meaning: "The Sincerity" },
    { num: 113, en: "Al-Falaq", ar: "الفلق", meaning: "The Daybreak" },
    { num: 114, en: "An-Nas", ar: "الناس", meaning: "The Mankind" },
    { num: 108, en: "Al-Kawthar", ar: "الكوثر", meaning: "The Abundance" },
    { num: 97, en: "Al-Qadr", ar: "القدر", meaning: "The Power" },
    { num: 93, en: "Ad-Duhaa", ar: "الضحى", meaning: "The Morning Hours" },
    { num: 12, en: "Yusuf", ar: "يوسف", meaning: "Joseph" }
];

document.addEventListener('DOMContentLoaded', () => {
    renderSurahList(popularSurahs);
    setupSearch();
    setupAudioControls();
    setupBookmarks();
});

// 1. Render List
function renderSurahList(list) {
    const container = document.getElementById('surah-list-container');
    if (!container) return;

    container.innerHTML = list.map(s => `
        <div class="surah-item ${s.num === 1 ? 'active' : ''}" onclick="selectSurah(this, '${s.en}')">
            <div class="s-num">${s.num}</div>
            <div class="s-details">
                <h4>${s.en}</h4>
                <p>${s.meaning}</p>
            </div>
            <div class="s-arabic">${s.ar}</div>
        </div>
    `).join('');
}

// 2. Mock Selection
window.selectSurah = (el, name) => {
    // Visual update only for demo
    document.querySelectorAll('.surah-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');

    // Update Header
    document.getElementById('current-surah-title').innerText = name;

    // In real app: Fetch and render new verses
    if (name !== "Al-Fatiha") {
        const versesDisplay = document.getElementById('verses-display');
        versesDisplay.style.opacity = '0.5';
        setTimeout(() => versesDisplay.style.opacity = '1', 300);
    }
}

// 3. Search Functionality
function setupSearch() {
    const input = document.getElementById('surah-search');
    if (!input) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = popularSurahs.filter(s =>
            s.en.toLowerCase().includes(query) ||
            s.meaning.toLowerCase().includes(query) ||
            s.num.toString().includes(query)
        );
        renderSurahList(filtered);
    });
}

// 4. Audio Controls
function setupAudioControls() {
    const playBtn = document.querySelector('.play-pause-main');
    let isPlaying = false;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying
                ? '<i class="fas fa-pause-circle"></i>'
                : '<i class="fas fa-play-circle"></i>';
        });
    }

    // Verse play buttons
    document.querySelectorAll('.v-btn .fa-play').forEach(btn => {
        btn.parentElement.addEventListener('click', function () {
            // Reset all others
            document.querySelectorAll('.v-btn i').forEach(i => i.className = 'fas fa-play');
            // Toggle this
            this.querySelector('i').className = 'fas fa-pause';
        });
    });
}

// 5. Bookmarks
function setupBookmarks() {
    document.querySelectorAll('.fa-bookmark, .fa-heart').forEach(btn => {
        btn.parentElement.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon && icon.classList.contains('far')) { // Empty
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--gold)';
            } else if (icon && icon.classList.contains('fas')) { // Filled
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });
}
