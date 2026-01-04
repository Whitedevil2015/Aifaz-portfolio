// --- 40 Hadith Nawawi Data (Embedded for Demo) ---
const hadithNawawi = [
    {
        id: 1,
        arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: \" إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ \".",
        english: "Amir al-Mu'minin, Abu Hafs 'Umar bin al-Khattab (ra) said: I heard the Messenger of Allah (ﷺ) saying: \"Actions are according to intentions, and everyone will get what was intended. Whoever migrates with an intention for Allah and His Messenger, the migration will be for the sake of Allah and His Messenger. And whoever migrates for worldly gain or to marry a woman, then his migration will be for the sake of whatever he migrated for.\"",
        grade: "Sahih"
    },
    {
        id: 2,
        arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه وسلم ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعْرِ، لَا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلَا يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صلى الله عليه وسلم ...",
        english: "Also on the authority of Umar, who said: One day while we were sitting with the Messenger of Allah (ﷺ) there appeared before us a man whose clothes were exceedingly white and whose hair was exceedingly black; no signs of travel were to be seen on him and none of us knew him...",
        grade: "Sahih"
    }
    // ... Would populate more in real app
];

// --- Core Logic ---
const collectionsDiv = document.getElementById('collections');
const readerView = document.getElementById('reader-view');
const readerContent = document.getElementById('reader-content');
const readerHeading = document.getElementById('reader-heading');

function closeReader() {
    readerView.style.display = 'none';
    collectionsDiv.style.display = 'block';
    window.scrollTo(0, 0);
}

// --- Quran Logic (Adapted to Sunnah Style) ---
async function openQuranReader() {
    collectionsDiv.style.display = 'none';
    readerView.style.display = 'block';
    readerHeading.textContent = "The Noble Quran - Surah Al-Fatiha";
    readerContent.innerHTML = '<div style="padding:50px; text-align:center;">Loading...</div>';

    try {
        // Fetch Al-Fatiha for demo
        const [arRes, enRes] = await Promise.all([
            fetch('https://api.alquran.cloud/v1/surah/1/quran-uthmani'),
            fetch('https://api.alquran.cloud/v1/surah/1/en.sahih')
        ]);
        const ar = await arRes.json();
        const en = await enRes.json();

        const arAyahs = ar.data.ayahs;
        const enAyahs = en.data.ayahs;

        readerContent.innerHTML = arAyahs.map((ayah, i) => `
            <div class="hadith-entry">
                <div class="hadith-arabic">
                    ${ayah.text}
                    <span style="font-size:1rem; border:1px solid #ccc; border-radius:50%; width:25px; height:25px; display:inline-flex; align-items:center; justify-content:center; margin-right:10px;">${ayah.numberInSurah}</span>
                </div>
                <div class="hadith-english">
                    ${enAyahs[i].text}
                </div>
                <div class="hadith-meta">
                    Reference: Surah ${ar.data.englishName}, Verse ${ayah.numberInSurah}
                </div>
            </div>
        `).join('');
    } catch (e) {
        readerContent.innerHTML = "Error loading content.";
    }
}

// --- Hadith Logic ---
function openHadithCollection(name) {
    if (name === 'nawawi') {
        collectionsDiv.style.display = 'none';
        readerView.style.display = 'block';
        readerHeading.textContent = "40 Hadith Nawawi";

        readerContent.innerHTML = hadithNawawi.map(h => `
            <div class="hadith-entry">
                <div class="hadith-arabic">${h.arabic}</div>
                <div class="hadith-english">${h.english}</div>
                <div class="hadith-meta">
                    <span class="grade-tag">${h.grade}</span>
                    Hadith ${h.id}
                </div>
            </div>
        `).join('');
    }
}
