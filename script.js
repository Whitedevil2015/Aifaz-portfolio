// Script for Noor Islamic Portal

// 1. Tasbeeh Functionality
let count = 0;
function incrementTasbeeh() {
    count++;
    const el = document.getElementById('tasbeeh-count');
    if (el) {
        el.innerText = count;
        // Simple animation
        el.style.transform = "scale(1.2)";
        setTimeout(() => el.style.transform = "scale(1)", 100);
    }
}

// 2. Dummy Next Prayer Logic (Visual Only)
function updatePrayerTimer() {
    // In a real app, this would calculate time remaining
    // For demo: just static placeholder
    const timer = document.getElementById('next-prayer-timer');
    const name = document.getElementById('next-prayer-name');
    
    if (timer && name) {
        name.innerText = "Asr";
        timer.innerText = "-01:15:22";
    }
}

// 3. Daily Content Loader
document.addEventListener('DOMContentLoaded', () => {
    updatePrayerTimer();
    
    // Simulate fetching daily verse
    const preview = document.querySelector('.arabic-preview');
    if(preview) {
        setTimeout(() => {
            preview.innerText = "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ";
            preview.style.opacity = 1;
        }, 500);
    }
});
