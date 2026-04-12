document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL STATE ---
    window.coordinates = { lat: 17.3850, lng: 78.4867 }; // Default: Hyderabad
    window.ramadanLat = 17.3850;
    window.ramadanLng = 78.4867;
    window.prayerTimesRaw = {};
    window.nextPrayerName = '';
    window.isAzaanPlaying = false;

    // Ramadan State
    window.ramadanUseCoords = false;
    window.globalCity = "Hyderabad";
    window.globalCountry = "India";
    let countdownInterval = null;

    // --- DOM ELEMENTS ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');
    const cityInput = document.getElementById('prayer-city-input');
    const countryInput = document.getElementById('prayer-country-input');
    const searchBtn = document.getElementById('portal-search-btn');
    const autoLocBtn = document.getElementById('update-location-btn');
    const searchInput = document.getElementById('hadith-search');
    const themeBtn = document.getElementById('theme-toggle');
    const quranModal = document.getElementById('quran-modal');
    const quranContentEl = document.getElementById('quran-content');
    const audioPlayer = document.getElementById('quran-audio');

    // --- COUNTRY AND CITY DATA (All Countries) ---
    const locationData = {
        // ═══════════ SOUTH ASIA ═══════════
        "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Surat", "Nagpur", "Bhopal", "Patna", "Indore", "Coimbatore", "Kochi", "Visakhapatnam", "Chandigarh", "Guwahati"],
        "Pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"],
        "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Rangpur", "Comilla"],
        "Sri Lanka": ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo"],
        "Nepal": ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Birgunj"],
        "Bhutan": ["Thimphu", "Paro", "Punakha"],
        "Maldives": ["Male", "Addu City", "Fuvahmulah"],
        "Afghanistan": ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Jalalabad"],

        // ═══════════ MIDDLE EAST ═══════════
        "Saudi Arabia": ["Mecca", "Medina", "Riyadh", "Jeddah", "Dammam", "Khobar", "Tabuk", "Abha"],
        "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Al Ain"],
        "Kuwait": ["Kuwait City", "Hawalli", "Salmiya", "Farwaniya"],
        "Qatar": ["Doha", "Al Wakrah", "Al Rayyan", "Al Khor"],
        "Bahrain": ["Manama", "Riffa", "Muharraq", "Hamad Town"],
        "Oman": ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
        "Yemen": ["Sanaa", "Aden", "Taiz", "Hodeidah", "Mukalla"],
        "Iraq": ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Karbala", "Sulaymaniyah"],
        "Iran": ["Tehran", "Mashhad", "Isfahan", "Shiraz", "Tabriz", "Ahvaz", "Qom"],
        "Jordan": ["Amman", "Zarqa", "Irbid", "Aqaba", "Madaba"],
        "Lebanon": ["Beirut", "Tripoli", "Sidon", "Tyre", "Byblos"],
        "Syria": ["Damascus", "Aleppo", "Homs", "Latakia", "Hama"],
        "Palestine": ["Gaza", "Ramallah", "Hebron", "Nablus", "Bethlehem", "Jerusalem"],
        "Israel": ["Jerusalem", "Tel Aviv", "Haifa", "Nazareth", "Beer Sheva"],

        // ═══════════ CENTRAL ASIA ═══════════
        "Uzbekistan": ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Fergana"],
        "Kazakhstan": ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe"],
        "Azerbaijan": ["Baku", "Ganja", "Sumqayit", "Lankaran"],
        "Tajikistan": ["Dushanbe", "Khujand", "Kulob", "Bokhtar"],
        "Turkmenistan": ["Ashgabat", "Turkmenabat", "Dasoguz", "Mary"],
        "Kyrgyzstan": ["Bishkek", "Osh", "Jalal-Abad", "Karakol"],
        "Georgia": ["Tbilisi", "Batumi", "Kutaisi", "Rustavi"],
        "Armenia": ["Yerevan", "Gyumri", "Vanadzor"],
        "Mongolia": ["Ulaanbaatar", "Erdenet", "Darkhan"],

        // ═══════════ EAST ASIA ═══════════
        "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Hangzhou", "Xi'an", "Nanjing"],
        "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Kobe", "Fukuoka"],
        "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju"],
        "North Korea": ["Pyongyang", "Hamhung", "Chongjin"],
        "Taiwan": ["Taipei", "Kaohsiung", "Taichung", "Tainan"],

        // ═══════════ SOUTHEAST ASIA ═══════════
        "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Yogyakarta", "Palembang"],
        "Malaysia": ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Johor Bahru", "Kota Kinabalu", "Kuching"],
        "Thailand": ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Hat Yai", "Nakhon Ratchasima"],
        "Philippines": ["Manila", "Quezon City", "Davao", "Cebu", "Zamboanga", "Cagayan de Oro"],
        "Vietnam": ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hai Phong", "Can Tho"],
        "Myanmar": ["Yangon", "Mandalay", "Naypyidaw", "Mawlamyine"],
        "Cambodia": ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville"],
        "Laos": ["Vientiane", "Luang Prabang", "Savannakhet"],
        "Singapore": ["Singapore"],
        "Brunei": ["Bandar Seri Begawan", "Seria", "Tutong"],
        "Timor-Leste": ["Dili", "Baucau", "Maliana"],

        // ═══════════ NORTH AMERICA ═══════════
        "USA": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "Dallas", "San Francisco", "Seattle", "Miami", "Atlanta", "Denver", "Boston", "Detroit", "Minneapolis"],
        "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Halifax"],
        "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Cancun", "Tijuana", "Merida", "Leon"],

        // ═══════════ CENTRAL AMERICA & CARIBBEAN ═══════════
        "Guatemala": ["Guatemala City", "Quetzaltenango", "Escuintla"],
        "Honduras": ["Tegucigalpa", "San Pedro Sula", "Choloma"],
        "El Salvador": ["San Salvador", "Santa Ana", "San Miguel"],
        "Nicaragua": ["Managua", "Leon", "Masaya"],
        "Costa Rica": ["San Jose", "Limon", "Alajuela"],
        "Panama": ["Panama City", "Colon", "David"],
        "Belize": ["Belize City", "Belmopan", "San Ignacio"],
        "Cuba": ["Havana", "Santiago de Cuba", "Camaguey"],
        "Jamaica": ["Kingston", "Montego Bay", "Spanish Town"],
        "Haiti": ["Port-au-Prince", "Cap-Haitien", "Gonaives"],
        "Dominican Republic": ["Santo Domingo", "Santiago", "San Pedro de Macoris"],
        "Trinidad and Tobago": ["Port of Spain", "San Fernando", "Chaguanas"],
        "Barbados": ["Bridgetown"],
        "Bahamas": ["Nassau", "Freeport"],
        "Grenada": ["St. George's"],
        "Antigua and Barbuda": ["St. John's"],
        "Saint Lucia": ["Castries"],
        "Dominica": ["Roseau"],
        "Saint Kitts and Nevis": ["Basseterre"],
        "Saint Vincent and the Grenadines": ["Kingstown"],
        "Suriname": ["Paramaribo"],
        "Guyana": ["Georgetown"],

        // ═══════════ SOUTH AMERICA ═══════════
        "Brazil": ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba"],
        "Argentina": ["Buenos Aires", "Cordoba", "Rosario", "Mendoza", "Tucuman"],
        "Colombia": ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"],
        "Peru": ["Lima", "Arequipa", "Cusco", "Trujillo", "Chiclayo"],
        "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"],
        "Chile": ["Santiago", "Valparaiso", "Concepcion", "Antofagasta"],
        "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Manta"],
        "Bolivia": ["La Paz", "Santa Cruz", "Cochabamba", "Sucre"],
        "Paraguay": ["Asuncion", "Ciudad del Este", "San Lorenzo"],
        "Uruguay": ["Montevideo", "Salto", "Paysandu"],

        // ═══════════ WESTERN EUROPE ═══════════
        "UK": ["London", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Edinburgh", "Glasgow", "Bristol", "Cardiff"],
        "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux", "Lille"],
        "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Dusseldorf", "Dortmund", "Essen", "Leipzig"],
        "Italy": ["Rome", "Milan", "Naples", "Turin", "Florence", "Bologna", "Genoa", "Venice", "Palermo"],
        "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga", "Bilbao", "Granada"],
        "Portugal": ["Lisbon", "Porto", "Braga", "Coimbra", "Faro"],
        "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
        "Belgium": ["Brussels", "Antwerp", "Ghent", "Bruges", "Liege"],
        "Luxembourg": ["Luxembourg City", "Esch-sur-Alzette"],
        "Switzerland": ["Zurich", "Geneva", "Basel", "Bern", "Lausanne"],
        "Austria": ["Vienna", "Salzburg", "Innsbruck", "Graz", "Linz"],
        "Ireland": ["Dublin", "Cork", "Galway", "Limerick"],
        "Iceland": ["Reykjavik", "Akureyri"],

        // ═══════════ NORTHERN EUROPE ═══════════
        "Sweden": ["Stockholm", "Gothenburg", "Malmo", "Uppsala"],
        "Norway": ["Oslo", "Bergen", "Trondheim", "Stavanger"],
        "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg"],
        "Finland": ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu"],
        "Estonia": ["Tallinn", "Tartu"],
        "Latvia": ["Riga", "Daugavpils"],
        "Lithuania": ["Vilnius", "Kaunas", "Klaipeda"],

        // ═══════════ EASTERN EUROPE ═══════════
        "Russia": ["Moscow", "Saint Petersburg", "Kazan", "Novosibirsk", "Yekaterinburg", "Chelyabinsk", "Samara", "Ufa", "Grozny"],
        "Poland": ["Warsaw", "Krakow", "Lodz", "Wroclaw", "Poznan", "Gdansk"],
        "Ukraine": ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Lviv"],
        "Romania": ["Bucharest", "Cluj-Napoca", "Timisoara", "Iasi", "Constanta"],
        "Czech Republic": ["Prague", "Brno", "Ostrava"],
        "Hungary": ["Budapest", "Debrecen", "Szeged", "Pecs"],
        "Slovakia": ["Bratislava", "Kosice", "Presov"],
        "Bulgaria": ["Sofia", "Plovdiv", "Varna", "Burgas"],
        "Croatia": ["Zagreb", "Split", "Rijeka", "Dubrovnik"],
        "Serbia": ["Belgrade", "Novi Sad", "Nis"],
        "Slovenia": ["Ljubljana", "Maribor"],
        "Bosnia": ["Sarajevo", "Banja Luka", "Tuzla", "Mostar"],
        "Montenegro": ["Podgorica", "Budva", "Niksic"],
        "North Macedonia": ["Skopje", "Bitola", "Ohrid"],
        "Albania": ["Tirana", "Durres", "Vlore", "Shkoder"],
        "Kosovo": ["Pristina", "Prizren", "Peja", "Mitrovica"],
        "Moldova": ["Chisinau", "Tiraspol", "Balti"],
        "Belarus": ["Minsk", "Gomel", "Mogilev", "Vitebsk"],

        // ═══════════ SOUTHERN EUROPE / MEDITERRANEAN ═══════════
        "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Rhodes"],
        "Cyprus": ["Nicosia", "Limassol", "Larnaca", "Paphos"],
        "Malta": ["Valletta", "Birkirkara", "Sliema"],
        "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya"],
        "Andorra": ["Andorra la Vella"],
        "Monaco": ["Monaco"],
        "San Marino": ["San Marino"],
        "Vatican City": ["Vatican City"],
        "Liechtenstein": ["Vaduz"],

        // ═══════════ NORTH AFRICA ═══════════
        "Egypt": ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Port Said", "Suez", "Hurghada"],
        "Morocco": ["Casablanca", "Rabat", "Fez", "Marrakech", "Tangier", "Agadir", "Meknes"],
        "Algeria": ["Algiers", "Oran", "Constantine", "Annaba", "Setif"],
        "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan"],
        "Libya": ["Tripoli", "Benghazi", "Misrata", "Sabha"],
        "Sudan": ["Khartoum", "Omdurman", "Port Sudan", "Kassala"],
        "South Sudan": ["Juba", "Wau", "Malakal"],
        "Mauritania": ["Nouakchott", "Nouadhibou"],

        // ═══════════ WEST AFRICA ═══════════
        "Nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Benin City", "Maiduguri"],
        "Ghana": ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi"],
        "Senegal": ["Dakar", "Touba", "Pikine", "Saint-Louis"],
        "Ivory Coast": ["Abidjan", "Yamoussoukro", "Bouake"],
        "Mali": ["Bamako", "Sikasso", "Mopti", "Timbuktu"],
        "Burkina Faso": ["Ouagadougou", "Bobo-Dioulasso"],
        "Niger": ["Niamey", "Zinder", "Maradi"],
        "Guinea": ["Conakry", "Nzerekore", "Kankan"],
        "Sierra Leone": ["Freetown", "Bo", "Kenema"],
        "Liberia": ["Monrovia", "Gbarnga"],
        "Togo": ["Lome", "Sokode"],
        "Benin": ["Cotonou", "Porto-Novo", "Parakou"],
        "Gambia": ["Banjul", "Serekunda"],
        "Guinea-Bissau": ["Bissau"],
        "Cape Verde": ["Praia", "Mindelo"],

        // ═══════════ CENTRAL AFRICA ═══════════
        "Cameroon": ["Douala", "Yaounde", "Bamenda", "Garoua"],
        "Chad": ["N'Djamena", "Moundou", "Sarh"],
        "Central African Republic": ["Bangui"],
        "Republic of the Congo": ["Brazzaville", "Pointe-Noire"],
        "DR Congo": ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Goma", "Kisangani"],
        "Gabon": ["Libreville", "Port-Gentil"],
        "Equatorial Guinea": ["Malabo", "Bata"],
        "Sao Tome and Principe": ["Sao Tome"],

        // ═══════════ EAST AFRICA ═══════════
        "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
        "Tanzania": ["Dar es Salaam", "Dodoma", "Mwanza", "Arusha", "Zanzibar"],
        "Ethiopia": ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Harar"],
        "Uganda": ["Kampala", "Entebbe", "Gulu", "Jinja"],
        "Rwanda": ["Kigali", "Butare", "Gisenyi"],
        "Burundi": ["Bujumbura", "Gitega"],
        "Somalia": ["Mogadishu", "Hargeisa", "Bosaso", "Kismayo"],
        "Djibouti": ["Djibouti City"],
        "Eritrea": ["Asmara", "Keren", "Massawa"],
        "Madagascar": ["Antananarivo", "Toamasina", "Antsirabe"],
        "Mauritius": ["Port Louis", "Curepipe"],
        "Seychelles": ["Victoria"],
        "Comoros": ["Moroni"],

        // ═══════════ SOUTHERN AFRICA ═══════════
        "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
        "Mozambique": ["Maputo", "Beira", "Nampula"],
        "Zimbabwe": ["Harare", "Bulawayo", "Mutare"],
        "Zambia": ["Lusaka", "Kitwe", "Ndola", "Livingstone"],
        "Malawi": ["Lilongwe", "Blantyre", "Mzuzu"],
        "Angola": ["Luanda", "Huambo", "Lobito"],
        "Namibia": ["Windhoek", "Walvis Bay", "Rundu"],
        "Botswana": ["Gaborone", "Francistown", "Maun"],
        "Lesotho": ["Maseru", "Teyateyaneng"],
        "Eswatini": ["Mbabane", "Manzini"],

        // ═══════════ OCEANIA ═══════════
        "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Gold Coast", "Hobart", "Darwin"],
        "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin"],
        "Papua New Guinea": ["Port Moresby", "Lae"],
        "Fiji": ["Suva", "Nadi", "Lautoka"],
        "Samoa": ["Apia"],
        "Tonga": ["Nukualofa"],
        "Vanuatu": ["Port Vila"],
        "Solomon Islands": ["Honiara"],
        "Kiribati": ["Tarawa"],
        "Micronesia": ["Palikir"],
        "Marshall Islands": ["Majuro"],
        "Palau": ["Ngerulmud"],
        "Nauru": ["Yaren"],
        "Tuvalu": ["Funafuti"]
    };

    // Initialize Country Dropdown
    function initLocationDropdowns() {
        const countries = Object.keys(locationData).sort();

        // Populate country dropdown
        countryInput.innerHTML = '<option value="">Select Country</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryInput.appendChild(option);
        });

        // Set default to India and populate cities
        countryInput.value = "India";
        updateCityDropdown("India");
        cityInput.value = "Hyderabad";
    }

    // Update City Dropdown based on selected country
    function updateCityDropdown(country) {
        const cities = locationData[country] || [];
        cityInput.innerHTML = '<option value="">Select City</option>';

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityInput.appendChild(option);
        });
    }

    // Country change listener
    countryInput?.addEventListener('change', (e) => {
        const selectedCountry = e.target.value;
        updateCityDropdown(selectedCountry);
    });

    // Initialize on page load
    initLocationDropdowns();

    // --- THEME TOGGLE (Day / Night Mode) ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    // Sync button icon on initial load
    function syncThemeButton() {
        const isDark = document.body.classList.contains('dark');
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = isDark
                ? '<i class="fas fa-sun text-yellow-400"></i><span class="hidden md:inline ml-2 text-yellow-400 font-bold text-xs">Day</span>'
                : '<i class="fas fa-moon text-emerald-500"></i><span class="hidden md:inline ml-2 text-emerald-600 font-bold text-xs">Night</span>';
            toggleBtn.title = isDark ? 'Switch to Day Mode' : 'Switch to Night Mode';
        }
    }
    syncThemeButton();

    window.toggleTheme = function () {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        syncThemeButton();
    };


    // --- NAVIGATION & MODAL LOGIC ---
    let currentView = 'view-dashboard';

    window.navigateToView = function (targetId, updateHistory = true) {
        if (!targetId) return;
        const oldView = currentView;
        currentView = targetId;

        const performUpdate = () => {
            // Target Section logic
            sections.forEach(sec => sec.classList.add('hidden'));
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.remove('hidden');

            // Scroll to top of main area
            const mainScroll = document.getElementById('main-scroll-area');
            if (mainScroll) mainScroll.scrollTop = 0;

            // Close any lingering modals when navigating views
            closeAllModals(false);

            // Update nav links styling for both Desktop Sidebar and Mobile Bottom Nav
            navLinks.forEach(l => {
                const linkTarget = l.getAttribute('data-target');
                const icon = l.querySelector('i');
                const isMatch = linkTarget === targetId;

                if (isMatch) {
                    l.classList.add('active', 'scale-105');
                    l.classList.remove('text-white/50', 'text-[#af944d]/80');
                    if (icon) icon.classList.add('text-[#af944d]');
                } else {
                    l.classList.remove('active', 'scale-105');
                    if (icon) icon.classList.remove('text-[#af944d]');
                }
            });

            // Specific view callbacks
            if (targetId === 'view-names') loadNames();
            if (targetId === 'view-quran') loadDirectory();
            if (targetId === 'view-duas') renderDuas();
            if (targetId === 'view-ramadan') getRamadanTimes();
            if (targetId === 'view-nafil') renderPrayerGuide(window.prayerTimesRaw);
        };

        // Use View Transitions API if supported
        if (document.startViewTransition) {
            document.startViewTransition(() => performUpdate());
        } else {
            performUpdate();
        }

        // Manage Browser History
        if (updateHistory) {
            history.pushState({ targetId, modalId: null }, "", `#${targetId}`);
        }
    }

    function closeAllModals(updateHistory = true) {
        const modals = ['fazilat-modal', 'quran-modal'];
        modals.forEach(id => {
            const m = document.getElementById(id);
            if (m) {
                m.classList.add('hidden');
                m.classList.remove('flex');
                if (id === 'quran-modal') m.style.display = 'none';
            }
        });
        if (updateHistory && history.state && history.state.modalId) {
            history.back();
        }
    }

    // Exported for use in inline HTML
    window.closePortalModal = closeAllModals;

    // CLICK HANDLERS
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navigateToView(targetId);
        });
    });

    // BACK/FORWARD NAVIGATION HANDLER
    window.addEventListener('popstate', (e) => {
        if (e.state) {
            if (e.state.modalId) {
                // Should show modal
                if (e.state.modalId === 'fazilat-modal') {
                    // Note: opening without state push to avoid loops
                    const m = document.getElementById('fazilat-modal');
                    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
                } else if (e.state.modalId === 'quran-modal') {
                    if (quranModal) quranModal.style.display = 'flex';
                }
            } else {
                // No modal in this state, close all
                closeAllModals(false);
            }

            if (e.state.targetId) {
                navigateToView(e.state.targetId, false);
            }
        } else {
            // Default to dashboard if no state (e.g. back to start)
            navigateToView('view-dashboard', false);
        }
    });

    // INITIAL STATE HANDLING
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        navigateToView(hash, false);
    } else {
        // Record initial state for back button to work correctly
        history.replaceState({ targetId: 'view-dashboard', modalId: null }, "", "#view-dashboard");
    }

    // --- ATMOSPHERIC WEATHER ---
    async function fetchAtmosphere(lat, lng) {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
            const data = await res.json();
            const code = data.current_weather.weathercode;

            document.body.classList.remove('weather-clear', 'weather-clouds', 'weather-rain', 'weather-snow');

            let theme = 'weather-clear';
            let icon = '☀️';

            if (code <= 3) { theme = 'weather-clear'; icon = '☀️'; }
            else if (code <= 48) { theme = 'weather-clouds'; icon = '☁️'; }
            else if (code <= 67 || code >= 80) { theme = 'weather-rain'; icon = '🌧️'; }
            else if (code >= 71) { theme = 'weather-snow'; icon = '❄️'; }

            document.body.classList.add(theme);

            const locLabel = document.getElementById('portal-location-label');
            if (locLabel) {
                const currentText = locLabel.textContent.split(' • ')[0];
                locLabel.innerHTML = `${currentText} • <span class="text-sm font-normal">${icon} ${theme.replace('weather-', '').toUpperCase()}</span>`;
            }
        } catch (e) {
            console.warn("Atmosphere update failed", e);
            document.body.classList.add('weather-clear');
        }
    }

    // --- PRAYER FETCHING ---
    window.fetchPrayers = async function (lat = null, lng = null, city = null, country = null) {
        let url = '';
        if (lat && lng) {
            url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1&tune=0,-8,0,0,0,8,8,0,0&adjustment=-1`;
            window.coordinates = { lat, lng };
            window.ramadanLat = lat;
            window.ramadanLng = lng;
            window.ramadanUseCoords = true;

            // Cache location
            localStorage.setItem('portal_lat', lat);
            localStorage.setItem('portal_lng', lng);
            localStorage.removeItem('portal_city');

            fetchAtmosphere(lat, lng);
            const locLabel = document.getElementById('portal-location-label');
            if (locLabel) {
                // Prioritize City Name if we have it from Reverse Geo
                if (window.globalCity) {
                    locLabel.innerHTML = `<i class="fas fa-location-dot mr-1"></i> ${window.globalCity}`;
                } else {
                    locLabel.textContent = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
                }
            }
        } else {
            const c = city || "Hyderabad";
            const co = country || "India";
            url = `https://api.aladhan.com/v1/timingsByCity?city=${c}&country=${co}&method=1&tune=0,-8,0,0,0,8,8,0,0&adjustment=-1`;

            // Cache city
            localStorage.setItem('portal_city', c);
            localStorage.removeItem('portal_lat');
            localStorage.removeItem('portal_lng');

            // Update UI
            const locLabel = document.getElementById('portal-location-label');
            if (locLabel) locLabel.textContent = `${c}, ${co}`;

            // Update input fields
            const cityInput = document.getElementById('prayer-city-input');
            const countryInput = document.getElementById('prayer-country-input');
            if (cityInput) cityInput.value = c;
            if (countryInput) countryInput.value = co;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (!lat && data.data && data.data.meta) {
                window.coordinates = { lat: data.data.meta.latitude, lng: data.data.meta.longitude };
                fetchAtmosphere(window.coordinates.lat, window.coordinates.lng);
                if (typeof initQibla === 'function') initQibla();
            }

            if (data.code === 200) {
                window.prayerTimesRaw = data.data.timings;
                renderPrayerGrid(window.prayerTimesRaw);
                renderPrayerGuide(window.prayerTimesRaw);
                updateNextPrayer();

                const dateInfo = data.data.date;
                document.querySelectorAll('[id="hero-greg-date"]').forEach(gregEl => {
                    gregEl.textContent = `${dateInfo.gregorian.day} ${dateInfo.gregorian.month.en} ${dateInfo.gregorian.year}`;
                });

                const hijriDay = parseInt(dateInfo.hijri.day);
                const isRamadan = parseInt(dateInfo.hijri.month.number) === 9;
                const isLastDay = isRamadan && hijriDay === 30;

                document.querySelectorAll('[id="hero-hijri-date"]').forEach(hijriEl => {
                    hijriEl.innerHTML = isRamadan
                        ? `${hijriDay} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year} <span class="block text-sm text-[#af944d] mt-1 font-bold">☪ ${isLastDay ? 'LAST DAY OF FASTING' : 'Day ' + hijriDay + ' of Fasting'}</span>`
                        : `${hijriDay} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year} AH`;
                });

                // Also update Ramadan Day Status if we are in Ramadan view
                const ramDayStatus = document.getElementById('ramadan-day-status');
                if (ramDayStatus && isRamadan) {
                    ramDayStatus.innerText = hijriDay;
                }
            }
        } catch (e) { console.error("Prayer fetch failed", e); }
    }

    function updateMasterDates() {
        // Fallback for initial load before API returns
        const now = new Date();
        document.querySelectorAll('[id="hero-greg-date"]').forEach(gregEl => {
            if (gregEl.textContent.trim() === "Loading..." || gregEl.textContent.trim() === "SYSTEM ONLINE" || gregEl.textContent.trim() === "10 MARCH 2026") {
                gregEl.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        });
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

        // History API
        history.pushState({ targetId: currentView, modalId: 'fazilat-modal' }, "", "#fazilat");
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
        farzGrid.innerHTML = farzData.map((d, i) => {
            const hue = (i * 40) % 360;
            return `
            <div class="bg-[#fcfdfd] p-8 rounded-[40px] shadow-sm text-center border-t-4 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group dark:bg-gray-800 dark:border-gray-700" 
                style="border-color:hsl(${hue}, 50%, 40%)" onclick="openFazilat('${d.name}')">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner" style="background:hsl(${hue}, 50%, 95%); color:hsl(${hue}, 50%, 30%)">
                    <i class="fas ${d.icon} text-2xl"></i>
                </div>
                <h3 class="text-3xl font-black mb-1 font-[Cormorant_Garamond]" style="color:hsl(${hue}, 50%, 25%)">${d.name}</h3>
                <p class="text-[10px] uppercase font-black tracking-widest opacity-40 mb-4">Obligatory Prayer</p>
                <div class="text-2xl font-black text-gray-800 mb-6 dark:text-white">${d.time}</div>
                <div class="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                     <p class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Structure</p>
                     <p class="text-sm font-bold text-gray-700 dark:text-gray-200 italic">"${d.rakat}"</p>
                </div>
            </div>
        `}).join('');

        // RENDER NAFIL
        nafilGrid.innerHTML = nafilData.map((d, i) => {
            const hue = (i * 60 + 180) % 360;
            return `
            <div class="bg-[#fcfdfd] p-8 rounded-[40px] shadow-sm text-center border-t-4 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group dark:bg-gray-800 dark:border-gray-700" 
                style="border-color:hsl(${hue}, 40%, 50%)" onclick="openFazilat('${d.name}')">
                ${d.badge ? `<div class="absolute top-0 right-10 bg-gray-800 text-white text-[8px] font-black px-3 py-1 rounded-b-xl uppercase tracking-widest shadow-lg z-10">${d.badge}</div>` : ''}
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner" style="background:hsl(${hue}, 40%, 95%); color:hsl(${hue}, 40%, 30%)">
                    <i class="fas ${d.icon} text-2xl"></i>
                </div>
                <h3 class="text-3xl font-black mb-1 font-[Cormorant_Garamond]" style="color:hsl(${hue}, 40%, 30%)">${d.name}</h3>
                <p class="text-[10px] uppercase font-black tracking-widest opacity-40 mb-4">Voluntary Prayer</p>
                <div class="text-2xl font-black text-gray-800 mb-6 dark:text-white">${d.time}</div>
                <div class="mb-4">
                    <span class="px-4 py-1.5 bg-gray-50 dark:bg-black/20 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100 dark:border-white/5">Rakats: ${d.rakat}</span>
                </div>
                <p class="text-xs text-gray-500 italic leading-relaxed pt-4 border-t border-gray-50 dark:border-white/5">"${d.desc}"</p>
            </div>
        `}).join('');
    }

    // Robust Auto Location Handler
    window.detectAndSyncLocation = function (source = 'dashboard') {
        // Target the NEW icon button in the Hero Section
        const heroBtn = document.querySelector('#portal-location-label button');
        const icon = heroBtn?.querySelector('i');

        // Helper to reset button state
        const resetBtn = () => {
            if (icon) {
                icon.className = "fas fa-location-arrow group-hover:animate-pulse text-sm";
                heroBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        };

        // Visual Feedback
        if (icon) {
            icon.className = "fas fa-spinner fa-spin";
            heroBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            resetBtn();
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Sync all global coordinates
            window.coordinates = { lat, lng };
            window.ramadanLat = lat;
            window.ramadanLng = lng;
            window.ramadanUseCoords = true;

            try {
                // 1. Trigger Prayer Times Fetch (based on coords)
                await window.fetchPrayers(lat, lng);

                // 2. Reverse Geocoding (Get City Name for UI)
                const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                const geoData = await geoRes.json();

                const detectedCity = geoData.city || geoData.locality || "Detected Location";
                const detectedCountry = geoData.countryName || "";

                // Update Global State
                window.globalCity = detectedCity;
                window.globalCountry = detectedCountry;

                // Update UI Labels
                const ramadanLabel = document.getElementById('cityLabel');
                if (ramadanLabel) ramadanLabel.innerText = `${detectedCity}, ${detectedCountry}`;

                console.log(`Location Locked: ${detectedCity}`);

                // 3. Ramadan Data Fetch
                if (source === 'ramadan' || !document.getElementById('view-ramadan').classList.contains('hidden')) {
                    await window.getRamadanTimes();
                }

                alert(`Location successfully updated to: ${detectedCity}, ${detectedCountry}`);

            } catch (e) {
                console.error("Sync failed", e);
                alert("Coordinates locked, but city name could not be fetched.");
            } finally {
                resetBtn();
            }

        }, (err) => {
            console.error("Geo Error:", err);
            alert("Could not access location. Please enable permissions.");
            resetBtn();
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    // Auto Location Logic (Dashboard Hook)
    autoLocBtn?.addEventListener('click', () => {
        window.detectAndSyncLocation('dashboard');
    });

    // Manual Search with Dropdowns
    searchBtn?.addEventListener('click', () => {
        const city = cityInput.value;
        const country = countryInput.value;

        if (city && country) {
            fetchPrayers(null, null, city, country);
        } else {
            alert('Please select both Country and City');
        }
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
            banner.className = 'col-span-full bg-gradient-to-r from-[#064e3b] to-[#042f24] p-6 rounded-[40px] shadow-xl border border-[#af944d]/30 mb-6 text-white relative overflow-hidden animate-fade-in-up';
            banner.innerHTML = `
                <div class="absolute top-0 right-0 w-64 h-64 bg-[#af944d] opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div class="text-center md:text-left">
                        <h2 class="text-3xl font-[Cormorant_Garamond] font-bold text-[#af944d] mb-2">Jumu'ah Mubarak!</h2>
                        <p class="text-sm opacity-90 mb-4 font-light">Don't forget the Sunnah acts of this blessed day.</p>
                        <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span class="px-3 py-1 bg-[#f5f2eb]/10 rounded-full text-xs border border-[#af944d]/30 flex items-center gap-2 backdrop-blur-md"><i class="fas fa-book-open text-[#af944d]"></i> Surah Al-Kahf</span>
                            <span class="px-3 py-1 bg-[#f5f2eb]/10 rounded-full text-xs border border-[#af944d]/30 flex items-center gap-2 backdrop-blur-md"><i class="fas fa-comment-dots text-[#af944d]"></i> Durood</span>
                            <span class="px-3 py-1 bg-[#f5f2eb]/10 rounded-full text-xs border border-[#af944d]/30 flex items-center gap-2 backdrop-blur-md"><i class="fas fa-hands-praying text-[#af944d]"></i> Dua (Hour of Acceptance)</span>
                        </div>
                    </div>
                    <div class="text-center shrink-0">
                         <a href="#" onclick="document.querySelector('[data-target=view-quran]').click(); setTimeout(() => openReader(18, 'Al-Kahf', 'surah'), 500);" class="inline-flex items-center px-6 py-2 bg-[#af944d] text-[#042f24] font-bold rounded-full hover:bg-[#f5f2eb] transition-all shadow-lg shadow-[#af944d]/20 transform hover:-translate-y-1">
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

        grid.innerHTML = prayers.map((p, i) => {
            const hue = (i * 45) % 360;
            const isEnabled = localStorage.getItem(`azaan_${p.id}`) === 'true';
            const hideAzaan = p.id === 'Sunrise'; // No azaan for sunrise

            return `
            <div id="card-${p.id}" class="anime-card bg-[#fcfdfd] p-6 rounded-[40px] shadow-sm text-center border-t-4 cursor-pointer group dark:bg-gray-800 dark:border-gray-700 relative" 
                style="border-color:hsl(${hue}, 60%, 40%)" onclick="openFazilat('${p.id}')">
                
                <div class="absolute -right-4 -top-4 opacity-[0.03] text-7xl" style="color:hsl(${hue}, 60%, 40%)"><i class="fas ${p.icon}"></i></div>
                
                <div class="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner" style="background:hsl(${hue}, 60%, 95%); color:hsl(${hue}, 60%, 40%)">
                    <i class="fas ${p.icon} text-xl"></i>
                </div>
                
                <p class="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40">${p.label || p.id}</p>
                <p class="text-2xl font-black text-gray-800 dark:text-white" style="color:hsl(${hue}, 60%, 25%)">${window.formatTo12Hour ? window.formatTo12Hour(timings[p.id]) : timings[p.id]}</p>
                
                ${!hideAzaan ? `
                <div class="mt-4 flex justify-center items-center gap-2 pt-4 border-t border-gray-50 dark:border-white/5">
                    <button onclick="event.stopPropagation(); window.toggleAzaan('${p.id}')" 
                        id="azaan-btn-${p.id}"
                        class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isEnabled ? 'bg-[#064e3b] text-white shadow-lg' : 'bg-gray-100 text-gray-400 dark:bg-black/20'}">
                        <i class="fas ${isEnabled ? 'fa-volume-up' : 'fa-volume-mute'}"></i>
                        <span>Azaan ${isEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                </div>
                ` : '<div class="mt-4 h-8 invisible"></div>'}
            </div>
        `}).join('');
    }

    window.toggleAzaan = function (id) {
        const current = localStorage.getItem(`azaan_${id}`) === 'true';
        const newState = !current;
        localStorage.setItem(`azaan_${id}`, newState);

        // Update UI
        const btn = document.getElementById(`azaan-btn-${id}`);
        if (btn) {
            btn.className = `px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${newState ? 'bg-[#064e3b] text-white shadow-lg' : 'bg-gray-100 text-gray-400 dark:bg-black/20'}`;
            btn.innerHTML = `<i class="fas ${newState ? 'fa-volume-up' : 'fa-volume-mute'}"></i><span>Azaan ${newState ? 'ON' : 'OFF'}</span>`;
        }

        if (newState) {
            // Test Play
            window.playAzaan(id, true); // brief test
        }
    }

    const azaanAudio = new Audio('https://www.islamcan.com/audio/adhan/azan1.mp3');

    window.playAzaan = function (id, isTest = false) {
        azaanAudio.pause();
        azaanAudio.currentTime = 0;

        // Use Fajr Azaan if Fajr
        if (id === 'Fajr') {
            azaanAudio.src = 'https://www.islamcan.com/audio/adhan/azan2.mp3'; // Usually a specific Fajr azaan
        } else {
            azaanAudio.src = 'https://www.islamcan.com/audio/adhan/azan1.mp3';
        }

        azaanAudio.play().catch(e => console.warn("Azaan play blocked by browser", e));

        if (isTest) {
            setTimeout(() => { azaanAudio.pause(); azaanAudio.currentTime = 0; }, 5000);
        }
    }

    function formatTo12Hour(time24) {
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours);
        const suffix = h >= 12 ? 'PM' : 'AM';
        const h12 = ((h + 11) % 12 + 1);
        return `${h12}:${minutes} ${suffix}`;
    }

    function updateNextPrayer() {
        const timings = window.prayerTimesRaw;
        if (!timings || !timings.Fajr) return;

        // Cleanup previous interval
        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            const now = new Date();
            const curMins = now.getHours() * 60 + now.getMinutes();

            const parseTime = (str) => {
                const [h, m] = str.split(':').map(Number);
                return h * 60 + m;
            };

            const prayers = [
                { name: 'Fajr', start: timings.Fajr, end: timings.Sunrise },
                { name: 'Dhuhr', start: timings.Dhuhr, end: timings.Asr },
                { name: 'Asr', start: timings.Asr, end: timings.Maghrib },
                { name: 'Maghrib', start: timings.Maghrib, end: timings.Isha },
                { name: 'Isha', start: timings.Isha, end: timings.Fajr, crossMidnight: true }
            ];

            let active = null;
            let next = null;

            // 1. Check if we are currently IN a prayer
            for (let i = 0; i < prayers.length; i++) {
                const p = prayers[i];
                const s = parseTime(p.start);
                const e = parseTime(p.end);

                if (p.crossMidnight) {
                    // Isha logic: Current time >= Isha start OR current time < Fajr start
                    if (curMins >= s || curMins < e) {
                        active = p;
                        break;
                    }
                } else {
                    if (curMins >= s && curMins < e) {
                        active = p;
                        break;
                    }
                }
            }

            // 2. If not in a prayer, find the next one
            if (!active) {
                for (let i = 0; i < prayers.length; i++) {
                    const p = prayers[i];
                    const s = parseTime(p.start);
                    if (s > curMins) {
                        next = p;
                        break;
                    }
                }
                // If nothing today, it's Fajr tomorrow
                if (!next) next = prayers[0];
            }

            // UI Update Logic
            const statusLabel = document.getElementById('prayer-status-label');
            const nameEl = document.getElementById('next-prayer-name');
            const intervalEl = document.getElementById('prayer-interval-range');
            const countdownLabel = document.getElementById('countdown-label');
            const countdownEl = document.getElementById('countdown');

            let targetTimeStr = "";
            let displayTitle = "";

            if (active) {
                displayTitle = active.name;
                targetTimeStr = active.end;
                if (statusLabel) {
                    statusLabel.textContent = "Current Prayer Active";
                    statusLabel.classList.remove('text-[#af944d]');
                    statusLabel.classList.add('text-emerald-400', 'animate-pulse');
                }
                if (countdownLabel) countdownLabel.textContent = "Time Left to Pray";
                if (intervalEl) intervalEl.textContent = `${formatTo12Hour(active.start)} — Ends at ${formatTo12Hour(active.end)}`;
            } else {
                displayTitle = next.name;
                targetTimeStr = next.start;
                if (statusLabel) {
                    statusLabel.textContent = "Upcoming Prayer";
                    statusLabel.classList.remove('text-emerald-400', 'animate-pulse');
                    statusLabel.classList.add('text-[#af944d]');
                }
                if (countdownLabel) countdownLabel.textContent = "Countdown to Start";
                if (intervalEl) intervalEl.textContent = `Starts at ${formatTo12Hour(next.start)}`;
            }

            if (nameEl) nameEl.textContent = displayTitle;

            // Highlight in card grid
            document.querySelectorAll('[id^="card-"]').forEach(el => {
                el.classList.remove('ring-4', 'ring-[#af944d]/30', 'scale-105', 'bg-white/95');
                if (el.id === `card-${displayTitle}`) {
                    el.classList.add('ring-4', 'ring-[#af944d]/30', 'scale-105', 'bg-white/95');
                }
            });

            // Countdown Calculation
            const [thStr, tmStr] = targetTimeStr.split(':');
            const targetDate = new Date();
            targetDate.setHours(parseInt(thStr), parseInt(tmStr), 0, 0);

            // If it's Isha end (Fajr tomorrow) or Next Fajr tomorrow
            if ((active && active.crossMidnight && curMins >= parseTime(active.start)) || (!active && next === prayers[0] && curMins >= parseTime(prayers[prayers.length - 1].start))) {
                if (targetDate <= now) targetDate.setDate(targetDate.getDate() + 1);
            } else if (!active && next === prayers[0] && curMins > parseTime(prayers[prayers.length - 1].end)) {
                // Between Isha end and Midnight
                // already handled by crossMidnight logic mostly
            }

            // Simple robust check: if target is in the past, it's definitely tomorrow
            if (targetDate <= now) targetDate.setDate(targetDate.getDate() + 1);

            const diff = targetDate - now;
            const hrs = Math.floor(diff / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            if (countdownEl) {
                countdownEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }

            // Azaan Trigger for Next Prayer Start
            if (!active && hrs === 0 && mins === 0 && secs === 0) {
                const isEnabled = localStorage.getItem(`azaan_${next.name}`) === 'true';
                if (isEnabled) window.playAzaan(next.name);
            }

        }, 1000);
    }








    // --- LIBRARY & SEARCH ---
    let fullHadithCache = [];
    let displayedCount = 50;

    async function loadLibrary() {
        const view = document.getElementById('library-content');
        // If we have data, just ensure we are rendering it
        if (fullHadithCache.length > 0) {
            renderHadiths(fullHadithCache.slice(0, displayedCount));
            return;
        }

        view.innerHTML = `
            <div class="text-center py-20 animate-pulse">
                <i class="fas fa-hand-holding-heart fa-spin text-5xl text-[#af944d] mb-6"></i> 
                <h3 class="text-2xl font-bold text-[#064e3b] dark:text-[#af944d]">Loading Durood Collection...</h3>
                <p class="mt-4 text-gray-500">Preparing authentic blessings and salutations...</p>
            </div>
        `;

        try {
            // Fetch Arabic and Urdu datasets in parallel
            const [araRes, urdRes] = await Promise.all([
                fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.min.json'),
                fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-bukhari.min.json')
            ]);

            if (!araRes.ok || !urdRes.ok) throw new Error("Failed to fetch library");

            const araData = await araRes.json();
            const urdData = await urdRes.json();

            // Defer processing to avoid UI freeze
            setTimeout(() => {
                const araMap = new Map(araData.hadiths.map(h => [h.hadithnumber, h.text]));

                fullHadithCache = urdData.hadiths.map(h => ({
                    id: h.hadithnumber,
                    arabic: araMap.get(h.hadithnumber) || "النص العربي غير متوفر حاليا",
                    urdu: h.text,
                    ref: `Sahih Bukhari ${h.hadithnumber}`
                }));

                // Initial Render
                renderHadiths(fullHadithCache.slice(0, displayedCount));

                // Init Search
                setupSearch();
            }, 50);

        } catch (err) {
            console.error("Library Error:", err);
            // Fallback to static authentic set if API fails
            loadStaticFallback(view);
        }
    }

    function setupSearch() {
        const searchInput = document.getElementById('hadith-search');
        searchInput?.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (!term) {
                renderHadiths(fullHadithCache.slice(0, displayedCount));
                return;
            }
            // Search entire cache
            const filtered = fullHadithCache.filter(h =>
                h.urdu.includes(term) ||
                String(h.id).includes(term) ||
                h.arabic.includes(term)
            ).slice(0, 100); // Limit search results to 100 for perf
            renderHadiths(filtered, true); // true = isSearchResult
        });
    }

    function loadStaticFallback(view) {
        const fallback = [
            { id: 1, arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ", urd: "تمام اعمال کا دارومدار نیت پر ہے۔", ref: "Sahih Bukhari 1" },
            { id: 5027, arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", urd: "تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔", ref: "Sahih Bukhari 5027" }
        ];
        fullHadithCache = fallback.map(h => ({ ...h, urdu: h.urd })); // normalize key
        renderHadiths(fullHadithCache);
    }

    // Voice Synthesis - Dual Language Sequence
    let currentUtterance = null;
    window.playHadithAudio = function (btnId, arabic, urdu) {
        const btn = document.getElementById(btnId);

        // Stop if playing
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            resetAllAudioBtns();
            return;
        }

        resetAllAudioBtns();
        if (btn) btn.innerHTML = '<i class="fas fa-stop text-red-400"></i> <span class="text-red-400">Stop</span>';

        // 1. Arabic Utterance
        const u1 = new SpeechSynthesisUtterance(arabic);
        u1.lang = 'ar-SA';
        u1.rate = 0.9;

        // 2. Urdu Utterance
        const u2 = new SpeechSynthesisUtterance(urdu);
        u2.lang = 'ur-PK';
        u2.rate = 0.95;

        u1.onend = () => {
            window.speechSynthesis.speak(u2);
        };

        u2.onend = () => {
            resetAllAudioBtns();
        };

        window.speechSynthesis.speak(u1);
    };

    function resetAllAudioBtns() {
        document.querySelectorAll('.hadith-audio-btn').forEach(b => {
            b.innerHTML = '<i class="fas fa-play"></i> <span>Listen</span>';
        });
    }

    function renderHadiths(list, isSearch = false) {
        const view = document.getElementById('library-content');
        if (list.length === 0) {
            view.innerHTML = '<div class="text-center py-10 opacity-50">No Hadiths found.</div>';
            return;
        }

        const cardsHtml = list.map((h, i) => {
            const hue = (i * 30) % 360;
            return `
                    <div class="bg-[#fcfdfd] p-8 rounded-[40px] shadow-sm text-center border-t-4 hover:-translate-y-1 transition-all relative group dark:bg-gray-800 dark:border-gray-700" style="border-color:hsl(${hue}, 50%, 45%)">
                        <i class="fas fa-quote-right absolute top-6 right-6 opacity-5 text-4xl" style="color:hsl(${hue}, 50%, 45%)"></i>
                        
                        <div class="mb-6 mt-2">
                             <p class="text-2xl font-bold font-amiri leading-loose text-[#064e3b] dark:text-[#af944d] drop-shadow-sm select-all" dir="rtl">${h.arabic}</p>
                        </div>

                         <div class="relative py-4 mb-4">
                             <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                <div class="w-full border-t border-gray-100 dark:border-gray-700"></div>
                             </div>
                             <div class="relative flex justify-center">
                                <span class="bg-[#fcfdfd] dark:bg-gray-800 px-3 text-xs text-gray-400 uppercase tracking-widest">Translation</span>
                             </div>
                        </div>

                        <p class="text-lg font-medium text-gray-600 leading-relaxed mb-6 dark:text-gray-300 font-urdu" dir="rtl">${h.urdu}</p>
                        
                        <div class="text-[11px] font-black border-t border-gray-50 dark:border-white/5 pt-4 flex justify-between items-center uppercase tracking-widest" style="color:hsl(${hue}, 50%, 40%)">
                            <span class="bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">REF: ${h.ref}</span>
                            <div class="flex gap-2">
                                <button id="btn-audio-${i}" onclick="window.playHadithAudio('btn-audio-${i}', '${h.arabic.replace(/'/g, "\\'")}', '${h.urdu.replace(/'/g, "\\'")}')" 
                                    class="hadith-audio-btn flex items-center gap-2 bg-[#fcfdfd] dark:bg-white/5 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all text-[10px] font-bold">
                                    <i class="fas fa-play"></i> <span>Listen</span>
                                </button>
                                <button class="opacity-30 hover:opacity-100 transition-opacity p-2"><i class="fas fa-bookmark"></i></button>
                            </div>
                        </div>
                    </div>
                `}).join('');

        let loadMoreHtml = '';
        if (!isSearch && fullHadithCache.length > displayedCount) {
            loadMoreHtml = `
                <div class="col-span-full text-center mt-8">
                    <button onclick="loadMoreHadiths()" class="px-8 py-3 bg-[#af944d] text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                        Load More from Library (+50)
                    </button>
                </div>
             `;
        }

        view.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                ${cardsHtml}
                ${loadMoreHtml}
            </div>
        `;
    }

    window.loadMoreHadiths = function () {
        displayedCount += 50;
        renderHadiths(fullHadithCache.slice(0, displayedCount));
    };

    // --- DAILY VERSE MODAL ---
    async function showDailyVerse() {
        try {
            // Fetch a random verse explicitly by ID to bypass browser cache
            const randomVerseId = Math.floor(Math.random() * 6236) + 1;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const quranRes = await fetch(`https://api.alquran.cloud/v1/ayah/${randomVerseId}/editions/quran-uthmani,en.asad`, { signal: controller.signal });
            clearTimeout(timeout);
            const data = await quranRes.json();

            if (data.code === 200) {
                const arAyah = data.data[0];
                const enAyah = data.data[1];

                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-700 p-4';
                modal.innerHTML = `
                    <div class="bg-[#fcfdfd] rounded-[40px] max-w-2xl w-full p-8 md:p-12 text-center relative transform scale-90 transition-transform duration-500 shadow-2xl border-2 border-[#af944d]/20 dark:bg-gray-950 dark:border-white/10 overflow-hidden">
                        <!-- Decorative Background -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                        
                        <button onclick="this.closest('.fixed').remove()" class="absolute top-6 right-6 text-gray-400 hover:text-[#af944d] transition-colors"><i class="fas fa-times text-xl"></i></button>
                        
                        <div class="relative z-10">
                            <div class="w-12 h-1 bg-gradient-to-r from-transparent via-[#af944d] to-transparent mx-auto mb-8 rounded-full"></div>
                            
                            <h3 class="text-[#af944d] uppercase tracking-[0.4em] text-[10px] font-black mb-8">Verse of the Moment</h3>
                            
                            <div class="space-y-8">
                                <p class="text-3xl md:text-4xl lg:text-5xl font-[Amiri] leading-relaxed text-[#064e3b] dark:text-emerald-100 mb-6 drop-shadow-sm" style="direction:rtl;">
                                    ${arAyah.text}
                                </p>
                                
                                <div class="w-8 h-px bg-gray-200 mx-auto dark:bg-white/10"></div>
                                
                                <p class="text-lg md:text-xl font-serif italic text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
                                    "${enAyah.text}"
                                </p>
                                
                                <div class="pt-6">
                                    <p class="text-[#af944d] font-bold uppercase tracking-widest text-[11px]">
                                        — Surah ${arAyah.surah.englishName} • Ayah ${arAyah.numberInSurah}
                                    </p>
                                </div>
                            </div>
                            
                            <button onclick="this.closest('.fixed').remove()" class="mt-12 px-10 py-4 bg-[#064e3b] text-white rounded-full font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl hover:-translate-y-1">
                                SubhanAllah
                            </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0');
                    modal.querySelector('div').classList.remove('scale-90');
                    modal.querySelector('div').classList.add('scale-100');
                });
            }
        } catch (e) {
            console.error("Error fetching random verse:", e);
        }
    }

    // --- OTHER LOGIC (QURAN, NAMES, DUAS) ---
    // (Preserved from previous, just re-rendering to ensure scope)
    let currentPlaylist = [];
    let currentAudioIndex = 0;

    // ─── Islamic Calendar View ───────────────────────────────────────────────
    const HIJRI_MONTHS = [
        { num: 1, name: 'Muharram', desc: 'First month, sacred month' },
        { num: 2, name: 'Safar', desc: 'Second month' },
        { num: 3, name: "Rabi' al-Awwal", desc: 'Birth of Prophet Muhammad ﷺ' },
        { num: 4, name: "Rabi' al-Thani", desc: 'Fourth month' },
        { num: 5, name: 'Jumada al-Awwal', desc: 'Fifth month' },
        { num: 6, name: 'Jumada al-Thani', desc: 'Sixth month' },
        { num: 7, name: 'Rajab', desc: 'Sacred month, Night Journey' },
        { num: 8, name: "Sha'ban", desc: 'Month before Ramadan' },
        { num: 9, name: 'Ramadan', desc: 'Month of fasting, Revelation of Quran' },
        { num: 10, name: 'Shawwal', desc: 'Eid al-Fitr' },
        { num: 11, name: "Dhul-Qi'dah", desc: 'Sacred month' },
        { num: 12, name: 'Dhul-Hijjah', desc: 'Sacred month, Hajj, Eid al-Adha' },
    ];

    async function initCalendarView() {
        const grid = document.getElementById('hijri-months-grid');
        if (!grid) return;

        // Fetch today's Hijri date
        let currentHijriMonth = 9; // default Ramadan
        let hijriDay = '--';
        let hijriMonthName = 'Ramadan';
        let hijriYear = '----';
        let gregorianStr = '';

        try {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const res = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}?adjustment=-1`);
            const json = await res.json();
            if (json.code === 200) {
                const h = json.data.hijri;
                currentHijriMonth = parseInt(h.month.number);
                hijriDay = h.day;
                hijriMonthName = h.month.en;
                hijriYear = h.year;
                gregorianStr = `${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
            }
        } catch (_) { }

        // Populate hero
        const elDayMonth = document.getElementById('cal-hijri-daymonth');
        const elYear = document.getElementById('cal-hijri-year');
        const elGreg = document.getElementById('cal-gregorian');

        const isLastDay = currentHijriMonth === 9 && parseInt(hijriDay) === 30;

        if (elDayMonth) {
            elDayMonth.innerHTML = isLastDay
                ? `${hijriDay} ${hijriMonthName} <span class="block text-sm md:text-xl font-bold text-amber-300 mt-2 animate-pulse tracking-[0.2em] uppercase">Last Day of Blessed Ramadan</span>`
                : `${hijriDay} ${hijriMonthName}`;
        }
        if (elYear) elYear.textContent = `${hijriYear} AH`;
        if (elGreg) elGreg.textContent = `Corresponding to ${gregorianStr}`;

        // Populate Fast Timings (Sehri/Iftar)
        const sehriEl = document.getElementById('cal-sehri-time');
        const iftarEl = document.getElementById('cal-iftar-time');
        const fastContainer = document.getElementById('calendar-fast-timings');

        if (window.prayerTimesRaw && window.prayerTimesRaw.Imsak && window.prayerTimesRaw.Maghrib) {
            if (sehriEl) sehriEl.innerText = window.prayerTimesRaw.Imsak;
            if (iftarEl) iftarEl.innerText = window.prayerTimesRaw.Maghrib;
            if (fastContainer) fastContainer.classList.remove('hidden');
        }

        // Populate months grid
        grid.innerHTML = HIJRI_MONTHS.map(m => {
            const isCurrent = m.num === currentHijriMonth;
            return `
            <div class="bg-white dark:bg-gray-800 rounded-2xl border ${isCurrent ? 'border-[#10b981]' : 'border-gray-100 dark:border-gray-700'} p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all anime-card group ${isCurrent ? 'ring-2 ring-[#10b981]' : ''}">
                <div class="flex-1 min-w-0 pr-3">
                    <div class="flex items-center gap-2 mb-0.5">
                        <p class="font-bold text-gray-800 dark:text-white">${m.name}</p>
                        ${isCurrent ? '<span class="text-[10px] font-black uppercase tracking-widest bg-[#10b981] text-white px-2 py-0.5 rounded-full">Current</span>' : ''}
                    </div>
                    <p class="text-gray-400 text-sm">${m.desc}</p>
                </div>
                <div class="w-10 h-10 rounded-xl ${isCurrent ? 'bg-[#10b981]' : 'bg-[#064e3b]'} flex items-center justify-center text-white font-black text-sm flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    ${m.num}
                </div>
            </div>`;
        }).join('');
    }

    // Hook into navigateToView to init calendar when shown
    const _origNav = window.navigateToView;
    window.navigateToView = function (target) {
        if (_origNav) _origNav(target);
        if (target === 'view-calendar') setTimeout(initCalendarView, 100);
    };

    // Quran Directory Logic
    let currentDirType = 'surah';

    window.switchQuranTab = function (type) {
        currentDirType = type;
        const tabs = ['tab-surah-btn', 'tab-para-btn', 'tab-featured-btn'];
        const activeClass = 'quran-tab px-6 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-700 text-[#064e3b] dark:text-white shadow-sm transition-all';
        const inactiveClass = 'quran-tab px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#064e3b] transition-all';
        tabs.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.className = inactiveClass;
        });
        const activeId = type === 'surah' ? 'tab-surah-btn' : type === 'para' ? 'tab-para-btn' : 'tab-featured-btn';
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) activeBtn.className = activeClass;

        // Show/hide popular surahs
        const pop = document.getElementById('popular-surahs-section');
        if (pop) pop.style.display = (type === 'surah') ? '' : 'none';

        if (type === 'featured') {
            showFeaturedVerses();
        } else {
            loadDirectory(type);
        }
    }

    window.filterSurahCards = function (query) {
        const cards = document.querySelectorAll('#surah-index-grid [data-surah-name]');
        const q = query.toLowerCase();
        cards.forEach(card => {
            const name = card.dataset.surahName.toLowerCase();
            card.style.display = name.includes(q) ? '' : 'none';
        });
    }

    function showFeaturedVerses() {
        const grid = document.getElementById('surah-index-grid');
        const heading = document.getElementById('surah-grid-heading');
        if (heading) heading.textContent = 'Featured Verses';
        if (!grid) return;
        const featured = [
            { ref: 'Al-Baqarah 2:255', name: 'Ayat ul-Kursi', arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.' },
            { ref: 'Al-Ikhlas 112:1', name: 'Surah Al-Ikhlas', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Say, "He is Allah, [who is] One"' },
            { ref: 'Al-Fath 48:1', name: 'Inna Fatahna', arabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا', translation: 'Indeed, We have given you a clear victory.' },
            { ref: 'Al-Baqarah 2:286', name: 'Laa Yukallif', arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translation: 'Allah does not burden a soul beyond that it can bear.' },
            { ref: 'Al-Inshirah 94:5', name: 'Inna Maal Usri', arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'For indeed, with hardship will be ease.' },
            { ref: 'Al-Duha 93:5', name: 'Wa Lasawfa', arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', translation: 'And your Lord is going to give you, and you will be satisfied.' },
        ];
        grid.innerHTML = featured.map(v => `
            <div class="anime-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-all">
                <p class="text-xs font-black uppercase tracking-widest text-[#10b981] mb-2">${v.ref}</p>
                <p class="font-bold text-gray-800 dark:text-white text-lg mb-3">${v.name}</p>
                <p class="text-2xl font-[Amiri] text-right text-gray-700 dark:text-gray-300 mb-3 leading-loose" style="direction:rtl;">${v.arabic}</p>
                <p class="text-sm italic text-gray-500 dark:text-gray-400">${v.translation}</p>
            </div>
        `).join('');
    }

    async function loadDirectory(type = 'surah') {
        const grid = document.getElementById('surah-index-grid');
        const heading = document.getElementById('surah-grid-heading');
        if (!grid) return;

        grid.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-circle-notch fa-spin text-[#10b981] text-2xl"></i><p class="mt-3 text-gray-400 text-sm font-medium">Loading...</p></div>';

        if (type === 'surah') {
            if (heading) heading.textContent = 'All Surahs';
            try {
                const res = await fetch('https://api.alquran.cloud/v1/surah');
                const data = await res.json();
                const surahList = document.getElementById('surah-list');
                if (surahList) surahList.innerHTML = data.data.map(s => `<div class="cursor-pointer p-4 rounded-xl mb-1 hover:bg-[#af944d]/10 text-xs font-bold text-gray-400 hover:text-[#af944d] transition-all border border-transparent hover:border-[#af944d]/20" onclick="openReader(${s.number}, '${s.englishName}', 'surah')">${s.number}. ${s.englishName}</div>`).join('');

                grid.innerHTML = data.data.map((s) => {
                    return `
                    <div class="anime-card bg-white dark:bg-gray-800 rounded-2xl border border-emerald-500/20 p-5 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all group"
                        data-surah-name="${s.englishName.toLowerCase()} ${s.englishNameTranslation.toLowerCase()}"
                        onclick="openReader(${s.number}, '${s.englishName}', 'surah')">
                        <div class="flex-1 min-w-0 pr-4">
                            <p class="font-black text-gray-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">${s.number}. ${s.englishName}</p>
                            <p class="text-emerald-700 dark:text-emerald-400 text-sm font-semibold">${s.englishNameTranslation}</p>
                            <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">${s.numberOfAyahs} verses · ${s.revelationType}</p>
                        </div>
                        <div class="flex flex-col items-end gap-2 flex-shrink-0">
                            <div class="w-11 h-11 rounded-xl bg-[#10b981] flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform shadow-md shadow-emerald-200 dark:shadow-none">${s.number}</div>
                            <p class="text-2xl font-[Amiri] text-emerald-700 dark:text-[#af944d]">${s.name.replace('سُورَةُ ', '')}</p>
                        </div>
                    </div>
                `}).join('');
            } catch (e) { grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-400 font-bold">Error loading surahs. Please try again.</div>'; }
        } else {
            // PARA / JUZ (1-30)
            if (heading) heading.textContent = 'Juz (Para)';
            const paras = Array.from({ length: 30 }, (_, i) => i + 1);
            grid.innerHTML = paras.map(p => `
                <div class="anime-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all group" onclick="openReader(${p}, 'Juz ${p}', 'juz')">
                    <div>
                        <p class="font-bold text-gray-800 dark:text-white text-lg">Juz ${p}</p>
                        <p class="text-gray-400 text-sm">Para ${p}</p>
                        <p class="text-gray-400 text-xs mt-1">~20 pages</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <div class="w-11 h-11 rounded-xl bg-[#064e3b] flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform shadow-md shadow-emerald-900/20">${p}</div>
                        <p class="text-xl font-[Amiri] text-[#064e3b] dark:text-[#af944d]">جزء ${p}</p>
                    </div>
                </div>
            `).join('');
            const surahList = document.getElementById('surah-list');
            if (surahList) surahList.innerHTML = paras.map(p => `<div class="cursor-pointer p-2 hover:bg-[#f5f2eb]/10 text-xs text-gray-300 hover:text-white" onclick="openReader(${p}, 'Juz ${p}', 'juz')">Para ${p}</div>`).join('');
        }
    }

    window.openReader = function (num, name, type = 'surah') {
        if (quranModal) quranModal.style.display = 'flex';
        document.getElementById('reader-title').textContent = type === 'surah' ? `Surah ${name}` : `${name}`;
        fetchQuranContent(num, type);
        // History API
        history.pushState({ targetId: currentView, modalId: 'quran-modal' }, "", "#reader");
    }

    const surahCache = new Map();

    async function fetchQuranContent(num, type = 'surah') {
        const quranContentEl = document.getElementById('quran-content');
        quranContentEl.innerHTML = '<div class="text-center mt-32"><i class="fas fa-circle-notch fa-spin text-5xl text-[#af944d]"></i><p class="mt-4 text-emerald-400 font-bold uppercase tracking-widest animate-pulse">Summoning Wisdom...</p></div>';

        const cacheKey = `${type}-${num}`;

        try {
            let arData, enData, trData, urData, hiData;

            if (surahCache.has(cacheKey)) {
                console.log("Using Cached Surah Data");
                const cached = surahCache.get(cacheKey);
                ({ arData, enData, trData, urData, hiData } = cached);
            } else {
                const endpoint = type === 'juz' ? `juz/${num}` : `surah/${num}`;
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

                arData = await arRes.json();
                enData = await enRes.json();
                trData = await trRes.json();
                urData = await urRes.json();
                hiData = await hiRes.json();

                // Cache the Full Result
                surahCache.set(cacheKey, { arData, enData, trData, urData, hiData });
            }

            let lastRuku = -1;
            let lastJuz = -1;
            let lastManzil = -1;

            const fazail = SURAH_FAZAIL[arData.data.number] || null;
            const fazailHtml = fazail ? `
                <div class="col-span-full mb-10 p-10 rounded-[50px] bg-[#af944d]/10 border border-[#af944d]/30 relative overflow-hidden group">
                    <div class="absolute -right-10 -bottom-10 text-[10rem] opacity-5 text-[#af944d] group-hover:rotate-12 transition-transform duration-1000"><i class="fas fa-scroll"></i></div>
                    <div class="flex items-center gap-4 mb-6">
                        <div class="px-4 py-1 bg-[#064e3b] text-white rounded-full text-[9px] font-black uppercase tracking-widest">Sahih Reference</div>
                        <div class="text-[10px] font-black underline uppercase tracking-widest text-[#af944d]">Verified by Jamia Nizamia Scholars</div>
                    </div>
                    <h5 class="text-2xl font-[Cormorant_Garamond] font-bold text-[#064e3b] mb-3">Virtue of Surah ${arData.data.englishName}</h5>
                    <p class="text-xl italic font-serif text-gray-700 leading-relaxed">"${fazail.t}"</p>
                    <p class="text-[10px] font-black uppercase tracking-widest mt-6 opacity-40">— SOURCE: ${fazail.r}</p>
                </div>
            ` : `
                <div class="col-span-full mb-10 p-6 rounded-[30px] bg-gray-50 border border-gray-100 text-center opacity-40">
                    <p class="text-[9px] font-black uppercase tracking-widest">Islamic Center Academic Layout • Reference: Bukhari Sharif & Jamia Nizamia</p>
                </div>
            `;

            quranContentEl.innerHTML = `
                <div class="quran-split-layout">
                    ${fazailHtml}
                    ${arData.data.ayahs.map((a, i) => {
                let markers = '';
                if (a.juz !== lastJuz) {
                    markers += `<div class="col-span-full section-divider-ornamental"><div></div><span class="text-[10px] font-black text-[#af944d] uppercase tracking-[0.4em]">Start of Juz ${a.juz}</span><div></div></div>`;
                    lastJuz = a.juz;
                }

                const rukuMarker = (a.ruku !== lastRuku && i !== 0) ? `<span class="ruku-marker" title="End of Ruku ${lastRuku}">${lastRuku}</span>` : '';
                lastRuku = a.ruku;

                const isSajdah = a.sajdah && a.sajdah !== false;
                const sajdahMarker = isSajdah ? `<span class="sajdah-marker"><i class="fas fa-star mr-1"></i> Sajdah</span>` : '';

                return `
                        ${markers}
                        <div class="col-span-full grid grid-cols-1 md:grid-cols-2 group hover:bg-white/5 transition-all border-b border-white/5" id="ayah-row-${i}" onclick="playVerse(${i})">
                            <!-- Left: High Contrast Arabic Pane -->
                            <div class="arabic-pane border-r border-[#af944d]/10">
                                <div class="flex items-start gap-6">
                                    <div class="flex flex-col gap-2 pt-4">
                                        <span class="w-10 h-10 rounded-full bg-[#af944d]/10 border border-[#af944d]/30 text-[#af944d] flex items-center justify-center text-sm font-black shadow-inner">${a.numberInSurah}</span>
                                        ${rukuMarker}
                                        ${sajdahMarker}
                                    </div>
                                    <div class="arabic-text-sharp flex-1 quran-arabic-text" data-verse-index="${i}">
                                        ${a.text.split(' ').map((word, wordIdx) =>
                    `<span class="quran-word" data-verse="${i}" data-word="${wordIdx}">${word}</span>`
                ).join(' ')}
                                    </div>
                                </div>
                            </div>
                            <!-- Right: Glassmorphic Translation Pane -->
                            <div class="translation-pane">
                                <div class="space-y-6 translation-block">
                                    <div class="quran-transliteration text-sm italic font-black border-l-2 border-[#af944d]/50 pl-4 uppercase tracking-widest">${trData.data.ayahs[i].text}</div>
                                    <div class="quran-translation text-lg font-bold leading-relaxed">${enData.data.ayahs[i].text}</div>
                                    <div class="quran-hinglish text-lg italic p-5 rounded-2xl border border-emerald-500/20">"${hiData.chapter[i]?.text || ''}"</div>
                                    <div class="quran-urdu text-3xl font-[Amiri] leading-[2.2] text-right" style="direction:rtl;">${urData.data.ayahs[i].text}</div>
                                </div>
                            </div>
                        </div>
                        `}).join('')}
                </div>
            `;

            // Update Floating Meta
            const firstAyah = arData.data.ayahs[0];
            if (document.getElementById('meta-juz')) document.getElementById('meta-juz').innerText = firstAyah.juz;
            if (document.getElementById('meta-manzil')) document.getElementById('meta-manzil').innerText = firstAyah.manzil;

            // Perform Hurf Analysis
            performHurfAnalysis(arData.data.ayahs);

            // Sync Mobile Play Button
            const mobPlayBtn = document.getElementById('play-pause-btn-mob');
            if (mobPlayBtn) mobPlayBtn.onclick = () => document.getElementById('play-pause-btn').click();

            window.currentSurahData = arData; // Global Store

            // --- AUDIO PLAYLIST GENERATION ---
            const hideTranslations = localStorage.getItem('hide_translations') === 'true';
            currentPlaylist = [];
            currentAudioIndex = 0;

            // Helper for MP3 Quran ID
            const pad3 = n => String(n).padStart(3, '0');

            const surahNum = arData.data.number || 1;
            const surahName = arData.data.englishName;
            const isSurahMode = (type === 'surah'); // juz mode must use verses

            // SEAMLESS MODE:
            // Disabled to ensure Highlighting/Scrolling works (Verse-by-Verse events needed)
            // const useSeamless = (hideTranslations && isSurahMode);
            const useSeamless = false; // Forced Verse Mode for visual sync

            // Show Player Bar
            const playerBar = document.getElementById('quran-player-bar');
            if (playerBar) playerBar.classList.remove('translate-y-full');

            if (useSeamless) {
                // Single File from Mishary Rashid (Gapless)
                currentPlaylist.push(`https://server8.mp3quran.net/afs/${pad3(surahNum)}.mp3`);
                document.getElementById('player-sub').innerText = "Seamless Recitation (Mishary Alafasy)";

                // Disable Verse Highlighting/Seeking logic for now in this mode
                // or we could implementing complex timestamp mapping later
            } else {
                // Verse by Verse (Study Mode / Dual Audio)
                const hasPreamble = (surahNum !== 1 && surahNum !== 9);
                if (hasPreamble) {
                    currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3`);
                }
                arData.data.ayahs.forEach(a => {
                    currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
                    if (!hideTranslations) {
                        currentPlaylist.push(`https://cdn.islamic.network/quran/audio/64/ur.khan/${a.number}.mp3`);
                    }
                });
                document.getElementById('player-sub').innerText = "Verse-by-Verse (Study Mode)";
            }

            // AUDIO PLAYER LOGIC
            // ------------------
            if (audioPlayer) {
                audioPlayer.src = currentPlaylist[0];
                updatePlayerInfo(0);

                // Double Buffer Strategy (Only for Verse Mode)
                if (!useSeamless && currentPlaylist.length > 1) {
                    new Audio(currentPlaylist[1]).load();
                }

                audioPlayer.ontimeupdate = () => {
                    const seek = document.getElementById('player-seek');
                    const curr = document.getElementById('time-current');
                    const tot = document.getElementById('time-total');
                    if (audioPlayer.duration) {
                        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                        if (seek) seek.value = pct;
                        if (curr) curr.innerText = fmtTime(audioPlayer.currentTime);
                        if (tot) tot.innerText = fmtTime(audioPlayer.duration);

                        // Word-by-word highlighting
                        updateWordHighlight(audioPlayer.currentTime, audioPlayer.duration);
                    }
                };

                audioPlayer.onended = () => {
                    // COMMON END LOIGC
                    // Check if we reached the end of the "Recitation Unit" (Surah or Juz)

                    const isEndSeamless = useSeamless;
                    const isEndVerseMode = (!useSeamless && currentAudioIndex >= currentPlaylist.length - 1);

                    if (isEndSeamless || isEndVerseMode) {
                        // End of Surah reached
                        if (window.repeatMode) {
                            // REPEAT CURRENT
                            currentAudioIndex = 0;
                            audioPlayer.src = currentPlaylist[0];
                            audioPlayer.play();
                            updatePlayerInfo(0);
                            return;
                        } else {
                            // AUTO NEXT SURAH
                            updatePlayerUI(false);
                            // Slight delay for UX
                            setTimeout(() => window.autoNextSurah(), 1000);
                            return;
                        }
                    }

                    // Verse Mode: Continue to Next Verse
                    currentAudioIndex++;
                    if (currentAudioIndex < currentPlaylist.length) {
                        const nextUrl = currentPlaylist[currentAudioIndex];
                        audioPlayer.src = nextUrl;
                        audioPlayer.play().catch(console.warn);

                        updatePlayerUI(true);
                        updatePlayerInfo(currentAudioIndex);

                        // Buffer Next
                        if (currentAudioIndex + 1 < currentPlaylist.length) {
                            new Audio(currentPlaylist[currentAudioIndex + 1]).load();
                        }

                        // Highlight Logic - Calculate correct verse index
                        const surahNum = arData.data.number || 1;
                        const hasPreamble = (surahNum !== 1 && surahNum !== 9);
                        let verseIdx = currentAudioIndex;

                        // Adjust for Bismillah preamble
                        if (hasPreamble && verseIdx > 0) {
                            verseIdx--;
                        }

                        // Adjust for dual audio (Arabic + Translation)
                        if (!hideTranslations) {
                            verseIdx = Math.floor(verseIdx / 2);
                        }

                        highlightVerse(verseIdx);
                    }
                };
            }
        } catch (e) { console.error(e); }
    }

    // --- PLAYER CONTROLS ---
    function fmtTime(s) {
        if (isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    }

    window.togglePlay = function () {
        const p = document.getElementById('quran-audio');
        if (p.paused) {
            p.play();
            updatePlayerUI(true);
        } else {
            p.pause();
            updatePlayerUI(false);
        }
    };

    window.changeTrack = function (delta) {
        const p = document.getElementById('quran-audio');
        const newIdx = currentAudioIndex + delta;
        if (newIdx >= 0 && newIdx < currentPlaylist.length) {
            currentAudioIndex = newIdx;
            p.src = currentPlaylist[newIdx];
            p.play();
            updatePlayerUI(true);
            updatePlayerInfo(newIdx);
        }
    };

    window.seekAudio = function (val) {
        const p = document.getElementById('quran-audio');
        if (p.duration) {
            p.currentTime = (val / 100) * p.duration;
        }
    };

    function updatePlayerUI(isPlaying) {
        const btn = document.getElementById('player-play-btn');
        if (btn) btn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play pl-1"></i>';
    }

    function updatePlayerInfo(idx) {
        // Sync Title with current Surah
        const titleEl = document.getElementById('player-title');
        if (titleEl && window.currentSurahData) {
            titleEl.innerText = window.currentSurahData.data.englishName || "Quran Recitation";
        }

        // Update Track Status
        const subEl = document.getElementById('player-sub');
        if (subEl) {
            const isSeamless = (currentPlaylist.length === 1);
            if (isSeamless) {
                subEl.innerText = "Seamless Recitation (Mishary Alafasy)";
            } else {
                subEl.innerText = `Verse ${idx + 1} / ${Math.floor(currentPlaylist.length / 2)}`;
            }
        }
    }

    // Word-by-word highlighting system
    let currentVerseIndex = -1;
    let verseWords = [];

    function updateWordHighlight(currentTime, duration) {
        if (!window.currentSurahData || currentAudioIndex < 0) return;

        // Determine which verse is playing (accounting for preamble)
        const hideTranslations = localStorage.getItem('hide_translations') === 'true';
        let effectiveIndex = currentAudioIndex;

        const surahNum = window.currentSurahData.data.number;
        const hasPreamble = (surahNum && surahNum !== 1 && surahNum !== 9);
        if (hasPreamble && effectiveIndex > 0) effectiveIndex--;

        const verseIdx = hideTranslations ? effectiveIndex : Math.floor(effectiveIndex / 2);

        // Safety check - don't highlight if playing Bismillah or invalid index
        if (verseIdx < 0) return;

        // If changed to new verse, update word list
        if (verseIdx !== currentVerseIndex) {
            currentVerseIndex = verseIdx;
            verseWords = document.querySelectorAll(`[data-verse="${verseIdx}"]`);

            // Clear all previous word highlights
            document.querySelectorAll('.quran-word.active-word').forEach(w =>
                w.classList.remove('active-word')
            );
        }

        if (verseWords.length === 0) return;

        // Calculate which word should be highlighted based on time
        const progress = currentTime / duration;
        const wordIndex = Math.floor(progress * verseWords.length);

        // Clear previous highlights and set new one
        verseWords.forEach((word, idx) => {
            if (idx === wordIndex) {
                word.classList.add('active-word');
            } else {
                word.classList.remove('active-word');
            }
        });
    }

    // Playback Helpers
    window.highlightVerse = function (index) {
        const verses = document.querySelectorAll('[id^="ayah-row-"]');
        verses.forEach(d => d.classList.remove('active-verse-row'));

        if (verses[index]) {
            verses[index].classList.add('active-verse-row');
            verses[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    window.playSurahAudio = function (lang) {
        if (!window.currentSurahData) return;
        const data = window.currentSurahData.data.ayahs;
        const surahNum = window.currentSurahData.data.number;
        const hideTranslations = localStorage.getItem('hide_translations') === 'true';

        currentPlaylist = [];

        // Add Bismillah preamble if not Surah Fatiha (1) or Surah Tawbah (9)
        if (surahNum && surahNum !== 1 && surahNum !== 9) {
            currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3`);
        }

        data.forEach(a => {
            currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
            if (!hideTranslations) {
                if (lang === 'ur') currentPlaylist.push(`https://cdn.islamic.network/quran/audio/64/ur.khan/${a.number}.mp3`);
                else if (lang === 'en') currentPlaylist.push(`https://cdn.islamic.network/quran/audio/192/en.walk/${a.number}.mp3`);
            }
        });

        currentAudioIndex = 0;
        const player = document.getElementById('quran-audio');
        if (player) {
            player.src = currentPlaylist[0];
            player.play().catch(e => console.warn("Audio play blocked", e));
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

    // Updated Play Verse to handle Seamless Toggle
    window.playVerse = function (index) {
        if (!currentPlaylist || currentPlaylist.length === 0) return;

        const player = document.getElementById('quran-audio');
        const hideTranslations = localStorage.getItem('hide_translations') === 'true';
        const isSurahMode = (window.currentDirType !== 'juz'); // inferred from context or check global

        // Seamless Mode Check based on Playlist
        if (currentPlaylist.length === 1 && hideTranslations) {
            // Seamless Mode active: Just play from start
            // (Seeking would require timestamps we don't have yet)
            console.log("Seamless Mode: Restarting Surah");
            player.currentTime = 0;
            player.play();
            updatePlayerUI(true);
            return;
        }

        // Verse Mode Logic
        // Calculate Index
        // Base: if preamble, start at 1. Else 0.
        // We need to know if there's a preamble. 
        // We can infer it from the playlist length vs data length?
        // Or re-check surah number.
        const surahNum = window.currentSurahData?.data?.number;
        const hasPreamble = (surahNum && surahNum !== 1 && surahNum !== 9);

        let targetIndex = hasPreamble ? 1 : 0;

        if (hideTranslations) {
            targetIndex += index;
        } else {
            targetIndex += (index * 2);
        }

        if (targetIndex < currentPlaylist.length) {
            currentAudioIndex = targetIndex;
            player.src = currentPlaylist[currentAudioIndex];
            player.play();
            updatePlayerUI(true);

            // Buffer Next
            if (currentAudioIndex + 1 < currentPlaylist.length) {
                new Audio(currentPlaylist[currentAudioIndex + 1]).load();
            }
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
                <div class="bg-[#f5f2eb] p-6 rounded-[40px] shadow-sm text-center border-t-4 hover:-translate-y-1 transition-transform relative overflow-hidden group dark:bg-gray-800 dark:border-gray-700" style="border-color:hsl(${hue}, 60%, 40%)">
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
            ar: 'بِاسْمِ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
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

    function renderDuas(cat = 'all', searchTerm = '') {
        const grid = document.getElementById('duas-grid');
        if (!grid) return;

        // Update active button state (only if we're not just searching)
        if (!searchTerm) {
            document.querySelectorAll('.dua-cat-btn').forEach(btn => {
                if (btn.dataset.cat === cat) {
                    btn.classList.add('bg-[#064e3b]', 'text-white', 'shadow-lg');
                    btn.classList.remove('bg-[#f5f2eb]', 'text-gray-700');
                } else {
                    btn.classList.remove('bg-[#064e3b]', 'text-white', 'shadow-lg');
                    btn.classList.add('bg-[#f5f2eb]', 'text-gray-700');
                }
            });
        }

        let filtered = cat === 'all' ? duas : duas.filter(d => d.cat === cat);

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = duas.filter(d =>
                d.title.toLowerCase().includes(term) ||
                d.en.toLowerCase().includes(term) ||
                d.cat.toLowerCase().includes(term)
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-20 opacity-40">
                    <i class="fas fa-search-minus text-6xl mb-4"></i>
                    <p class="text-xl font-bold">No Duas found matching "${searchTerm}"</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map((d, i) => {
            const hue = (i * 20) % 360;
            return `
            <div class="bg-[#fcfdfd] p-10 rounded-[40px] shadow-lg text-center border-t-4 hover:-translate-y-2 transition-all duration-500 relative group dark:bg-gray-800 dark:border-[#af944d]" style="border-color:hsl(${hue}, 50%, 40%)">
                 <div class="absolute top-0 right-0 p-3 bg-gray-50 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">${d.cat}</div>
                 <h3 class="font-black text-xl mb-6 border-b border-gray-50 dark:border-white/5 pb-4" style="color:hsl(${hue}, 50%, 30%)">${d.title}</h3>
                 <div class="font-[Amiri] text-4xl mb-8 leading-relaxed drop-shadow-sm text-gray-800 dark:text-gray-100" style="direction:rtl;">${d.ar}</div>
                 
                 <div class="space-y-4">
                    <div class="font-bold italic text-base font-serif opacity-70 border-l-2 pl-4 text-left" style="border-color:hsl(${hue}, 50%, 40%)">${d.tr}</div>
                    <div class="text-gray-600 text-lg leading-relaxed dark:text-gray-300 font-light text-left">"${d.en}"</div>
                    <div class="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] text-right mt-6 group-hover:opacity-60 transition-opacity">— SOURCE: ${d.ref}</div>
                 </div>
            </div>
        `}).join('');
    }

    // Attach click listeners
    document.querySelectorAll('.dua-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('dua-keyword-search').value = ''; // Reset search on cat change
            renderDuas(btn.dataset.cat);
            document.getElementById('dua-categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Handle Search Bar
    document.getElementById('dua-keyword-search')?.addEventListener('input', (e) => {
        renderDuas('all', e.target.value);
    });

    // 3D & Mouse
    function initThree() {
        const cont = document.getElementById('canvas-container');
        if (!cont) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 6;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 400);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        cont.appendChild(renderer.domElement);

        const geo = new THREE.BoxGeometry(2, 2.2, 2);
        const mat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.1, metalness: 0.5 }); // Emerald base
        const cube = new THREE.Mesh(geo, mat);

        const goldGeo = new THREE.BoxGeometry(2.05, 0.4, 2.05);
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xaf944d, metalness: 1.0, roughness: 0.1 }); // Polished Gold
        const band = new THREE.Mesh(goldGeo, goldMat);
        band.position.y = 0.5;

        const group = new THREE.Group();
        group.add(cube);
        group.add(band);
        scene.add(group);

        const light = new THREE.DirectionalLight(0xffffff, 0.8); light.position.set(5, 5, 5); scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        function animate() {
            requestAnimationFrame(animate);
            // Skip rendering if canvas is not visible (performance)
            if (!cont || !cont.offsetParent) return;
            group.rotation.y += 0.003;
            group.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;
            renderer.render(scene, camera);
        }
        animate();
    }
    function initEffects() {
        // Throttled 3D card parallax effect (max 60fps)
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                document.querySelectorAll('.hover-card-3d').forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                        card.style.transform = `perspective(1000px) rotateX(${((y - rect.height / 2) / (rect.height / 2)) * -2}deg) rotateY(${((x - rect.width / 2) / (rect.width / 2)) * 2}deg) scale(1.01)`;
                    } else card.style.transform = 'perspective(1000px) scale(1)';
                });
                ticking = false;
            });
        });
    }

    // --- BOOTSTRAP ---
    const startPortal = async () => {
        // ── Splash loader helpers ──
        const loaderBar = document.getElementById('loader-bar');
        const loaderStatus = document.getElementById('loader-status');
        const setProgress = (pct, text) => {
            if (loaderBar) loaderBar.style.width = pct + '%';
            if (loaderStatus) loaderStatus.textContent = text;
        };

        // Safety: Force dismiss loader after 5s if anything hangs
        const safetyTimeout = setTimeout(() => {
            const loader = document.getElementById('portal-loader');
            if (loader && !loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
                console.warn("Portal loader dismissed by safety timeout.");
            }
        }, 5000);

        // Stage 1: Locating
        setProgress(15, 'Locating your position…');

        // Force Hyderabad, India as the startup default
        window.globalCity = "Hyderabad";
        window.globalCountry = "India";
        window.ramadanUseCoords = false;

        // Stage 2: Fetch Prayer + Ramadan data in PARALLEL
        setProgress(40, 'Fetching prayer times…');
        const prayerPromise = window.fetchPrayers(null, null, "Hyderabad", "India");
        const ramadanPromise = typeof window.getRamadanTimes === 'function'
            ? window.getRamadanTimes() : Promise.resolve();
        await Promise.all([prayerPromise, ramadanPromise]);

        // Stage 3: Rendering Basic UI
        setProgress(70, 'Initializing interface…');
        updateMasterDates();
        renderDuas();

        // Stage 4: Done — dismiss loader immediately for best UX
        setProgress(100, 'Assalamu Alaikum ☪');
        clearTimeout(safetyTimeout);

        await new Promise(r => setTimeout(r, 400));
        const loader = document.getElementById('portal-loader');
        if (loader) loader.classList.add('fade-out');

        // Stage 5: Defer heavy 3D/Effects until AFTER loader is gone
        setTimeout(() => {
            try {
                if (window.THREE) initThree();
                initEffects();
                showDailyVerse();
            } catch (e) {
                console.error("Secondary initialization failed:", e);
            }
        }, 600);
    };        // Apply persisted translation and view state on loads
    const hide = localStorage.getItem('hide_translations') === 'true';
    if (hide) {
        const content = document.getElementById('quran-content');
        const btn = document.getElementById('translation-toggle');
        if (content) content.classList.add('translations-hidden');
        if (btn) {
            btn.innerText = 'TRANSLATIONS: OFF';
            btn.classList.remove('text-emerald-400');
            btn.classList.add('text-red-400');
        }
    }

    const isMushaf = localStorage.getItem('mushaf_mode') === 'true';
    if (isMushaf) {
        const content = document.getElementById('quran-content');
        const btn = document.getElementById('mushaf-toggle');
        if (content) content.classList.add('mushaf-mode');
        if (btn) btn.innerText = 'MODE: BOOK';
    }

    startPortal();
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
        window.ramadanUseCoords = false;
    }

    // Force Default to Hyderabad, IN if empty
    if (!rawCity && !window.ramadanUseCoords) {
        rawCity = "Hyderabad, IN";
        window.globalCity = "Hyderabad";
        window.globalCountry = "India";
    }

    let url = '';

    if (window.ramadanUseCoords) {
        url = `https://api.aladhan.com/v1/timings?latitude=${window.ramadanLat}&longitude=${window.ramadanLng}&method=1&school=1&adjustment=-1&tune=0,-8,0,0,0,8,8,0,0`;

        // Use detected global city if available
        if (document.getElementById('cityLabel')) {
            document.getElementById('cityLabel').innerText = window.globalCity || "My Location";
        }
    } else {
        if (rawCity.includes(',')) {
            const parts = rawCity.split(',');
            window.globalCity = parts[0].trim();
            window.globalCountry = parts[1].trim();
        } else {
            if (rawCity !== "My Location") window.globalCity = rawCity;
            // Auto-assign India for Hyderabad default
            if (window.globalCity.toLowerCase() === 'hyderabad') window.globalCountry = 'India';
        }

        const cityLabel = document.getElementById('cityLabel');
        if (cityLabel) cityLabel.innerText = window.globalCity;

        url = `https://api.aladhan.com/v1/timingsByCity?city=${window.globalCity}&country=${window.globalCountry}&method=1&school=1&adjustment=-1&tune=0,-8,0,0,0,8,8,0,0`;
    }

    // Reset Calendar to today
    calendarCurrentDate = new Date();
    fetchMonthlyCalendar();

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            const hijriDate = data.data.date.hijri;

            // Populate View Elements
            if (document.getElementById('saheriVal')) document.getElementById('saheriVal').innerText = timings.Fajr;
            if (document.getElementById('iftarVal')) document.getElementById('iftarVal').innerText = timings.Maghrib;

            // Updated Status Bar
            const dayStatus = document.getElementById('ramadan-day-status');
            const dateStatus = document.getElementById('ramadan-date-status');

            if (dayStatus) dayStatus.innerText = parseInt(hijriDate.day) - 1;
            if (dateStatus) dateStatus.innerText = `${data.data.date.gregorian.day} ${data.data.date.gregorian.month.en} • ${hijriDate.month.en} ${hijriDate.year}`;

            const locSync = document.getElementById('ramadan-loc-sync');
            if (locSync) locSync.innerText = `${window.globalCity}, ${window.globalCountry}`;



            // Update Ramadan Day
            const dayNumEl = document.querySelector('#view-ramadan .text-4xl.font-black.text-gray-800');
            if (dayNumEl && hijriDate.month.number === 9) {
                dayNumEl.innerText = parseInt(hijriDate.day) - 1;
            }

            startRamadanCountdown(timings.Fajr, timings.Maghrib);
            // updateAshraTracker(hijriDate.day); // Removed - Ashra section no longer in UI

            // Sync Quran Journey - Removed since section was deleted
            // if (document.getElementById('juz-num-label')) {
            //     document.getElementById('juz-num-label').innerText = `Juz ${hijriDate.day}`;
            // }
            // initQuranProgress();
        }
    } catch (e) { console.error("API Error", e); }
}

window.openJuzOfTheDay = function () {
    const dayLabel = document.getElementById('juz-num-label')?.innerText || "Juz 1";
    const juzNum = parseInt(dayLabel.replace('Juz ', '')) || 1;
    // Assuming navigateToView and openReader are available
    if (typeof navigateToView === 'function') navigateToView('view-quran');
    setTimeout(() => {
        if (typeof openReader === 'function') openReader(juzNum, `Juz ${juzNum}`, 'juz');
    }, 500);
}

window.updateQuranProgress = function (delta) {
    let currentJuz = parseInt(localStorage.getItem('quran_juz_completed')) || 0;
    currentJuz = Math.max(0, Math.min(30, currentJuz + delta));
    localStorage.setItem('quran_juz_completed', currentJuz);
    renderQuranProgress(currentJuz);
}

function initQuranProgress() {
    const juz = parseInt(localStorage.getItem('quran_juz_completed')) || 0;
    renderQuranProgress(juz);
}

function renderQuranProgress(completedJuz) {
    const percent = Math.round((completedJuz / 30) * 100);
    const valEl = document.getElementById('quran-progress-val');
    const barEl = document.getElementById('quran-progress-bar');
    if (valEl) valEl.innerText = `${percent}%`;
    if (barEl) barEl.style.width = `${percent}%`;
}

function updateAshraTracker(day) {
    const dayInt = parseInt(day);
    const ashras = document.querySelectorAll('#view-ramadan .grid.grid-cols-1.md\\:grid-cols-3.gap-6.mb-16 > div');
    ashras.forEach((a, i) => {
        a.classList.remove('scale-105', 'z-10', 'outline', 'ring-8', 'opacity-50', 'grayscale');
        a.querySelector('.bg-\\[\\#af944d\\]\\/10')?.remove(); // Remove "Active Phase" badge if exists

        const currentAshra = Math.floor((dayInt - 1) / 10);
        if (i === currentAshra) {
            a.classList.add('scale-105', 'z-10', 'outline', 'outline-4', 'outline-[#af944d]/20', 'ring-8', 'ring-[#af944d]/5');
            const badge = document.createElement('div');
            badge.className = "mt-4 px-3 py-1 bg-[#af944d]/10 text-[#af944d] rounded-full text-[10px] font-black inline-block uppercase tracking-widest";
            badge.innerText = "Active Phase";
            a.appendChild(badge);
        } else if (i < currentAshra) {
            a.classList.add('opacity-40');
        } else {
            a.classList.add('opacity-50', 'grayscale');
        }
    });
}

window.autoDetectRamadanContent = function () {
    window.detectAndSyncLocation('ramadan');
}

// Updated Repeat & Auto-Next Logic
window.repeatMode = false; // false = Auto-Next, true = Repeat Current

window.toggleRepeat = function () {
    window.repeatMode = !window.repeatMode;
    const btn = document.getElementById('player-repeat-btn');
    if (btn) {
        btn.className = window.repeatMode
            ? "text-[#af944d] transition-colors text-sm shadow-inner bg-[#af944d]/10 px-2 py-1 rounded-full"
            : "text-white/40 hover:text-[#af944d] transition-colors text-sm";
        btn.innerHTML = window.repeatMode ? '<i class="fas fa-repeat"></i> <span>1</span>' : '<i class="fas fa-repeat"></i>';
    }
};

window.autoNextSurah = function () {
    if (!window.currentSurahData) return;
    const currentNum = window.currentSurahData.data.number;
    if (currentNum < 114) {
        openReader(currentNum + 1, 'Loading...', 'surah');
    } else {
        console.log("Quran Completed");
        updatePlayerUI(false);
    }
};


window.changeCalendarMonth = function (delta) {
    // Adjust month safely handling year rollover
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + delta);
    fetchMonthlyCalendar();
};

window.changeCalendarYear = function (delta) {
    // Navigate by year (±100 year range)
    const newYear = calendarCurrentDate.getFullYear() + delta;
    if (newYear >= 1926 && newYear <= 2126) {
        calendarCurrentDate.setFullYear(newYear);
        fetchMonthlyCalendar();
    }
};

window.jumpToYear = function (year) {
    // Jump to specific year from input
    const targetYear = parseInt(year);
    if (!isNaN(targetYear) && targetYear >= 1926 && targetYear <= 2126) {
        calendarCurrentDate.setFullYear(targetYear);
        fetchMonthlyCalendar();
    } else {
        alert('Please enter a year between 1926 and 2126');
        // Reset input to current year
        const input = document.getElementById('calendar-year-input');
        if (input) input.value = calendarCurrentDate.getFullYear();
    }
};


window.fetchMonthlyCalendar = async function () {
    const month = calendarCurrentDate.getMonth() + 1;
    const year = calendarCurrentDate.getFullYear();
    const label = document.getElementById('calendar-month-label');
    const tbody = document.getElementById('monthly-calendar-body');

    if (label) label.innerText = "Loading...";

    // Sync year input field
    const yearInput = document.getElementById('calendar-year-input');
    if (yearInput) yearInput.value = year;


    let url = '';
    if (window.ramadanUseCoords) {
        url = `https://api.aladhan.com/v1/calendar?latitude=${window.ramadanLat}&longitude=${window.ramadanLng}&method=1&school=1&month=${month}&year=${year}&adjustment=-1&tune=0,-8,0,0,0,8,8,0,0`;
    } else {
        url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${window.globalCity}&country=${window.globalCountry}&method=1&school=1&adjustment=-1&tune=0,-8,0,0,0,8,8,0,0`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 200 && tbody) {
            const hijriName = data.data[0]?.date.hijri.month.en || "";
            const yearHijri = data.data[0]?.date.hijri.year || "";
            const results = data.data;

            if (label) label.innerText = `${calendarCurrentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} / ${hijriName} ${yearHijri}`;

            // Filter for current date onwards if current month
            let displayResults = results;
            const now = new Date();
            if ((month === now.getMonth() + 1) && (year === now.getFullYear())) {
                const todayNum = now.getDate();
                displayResults = results.filter(d => parseInt(d.date.gregorian.day) >= todayNum);
            }

            tbody.innerHTML = displayResults.map(day => {
                const isRamadanMonth = day.date.hijri.month.number === 9;
                const hijriDayAdjusted = isRamadanMonth ? parseInt(day.date.hijri.day) - 1 : parseInt(day.date.hijri.day);

                // If it's Ramadan month but the adjusted day is 0, it means it's the day before Ramadan start for user
                if (isRamadanMonth && hijriDayAdjusted <= 0) return '';

                return `
                <tr class="hover:bg-[#064e3b]/5 transition-colors ${isRamadanMonth ? 'bg-[#064e3b]/10' : ''}">
                    <td class="px-6 py-5">
                        <span class="font-black text-[#064e3b]">${day.date.gregorian.day}</span>
                        <span class="text-[9px] opacity-40 block uppercase font-bold tracking-widest">${day.date.gregorian.weekday.en}</span>
                    </td>
                    <td class="px-6 py-5">
                        <span class="text-[#af944d] font-black">${hijriDayAdjusted}</span>
                        <span class="text-[9px] opacity-40 uppercase font-bold ml-1">${isRamadanMonth ? 'Ramadan' : day.date.hijri.month.en}</span>
                    </td>
                    <td class="px-6 py-5 text-center font-mono text-lg font-bold text-gray-700">
                        ${day.timings.Fajr.split(' ')[0]}
                    </td>
                    <td class="px-6 py-5 text-center font-mono text-lg font-bold text-[#af944d]">
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
    if (!section) return;

    const layer = section.querySelector('.absolute.inset-0.z-0.opacity-20');
    if (!layer) return;

    // Apply high-end atmospheric gradients
    if (hour >= 17 && hour < 19) {
        // Maghrib/Sunset: Deep Orange to Purple
        layer.style.background = "linear-gradient(135deg, #f59e0b 0%, #059669 50%, #064e3b 100%)";
    } else if (hour >= 19 || hour < 4) {
        // Isha/Tahajjud: Midnight Indigo to Emerald
        layer.style.background = "radial-gradient(circle at 50% 0%, #0b1a16 0%, #020617 70%, #064e3b 100%)";
    } else {
        // Fajr/Morning: Dawn Teal to Gold
        layer.style.background = "linear-gradient(to bottom, #064e3b 0%, #042f24 100%)";
    }
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
            d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return d;
        };

        const fajrTime = getTodayTime(fajr);
        const maghribTime = getTodayTime(maghrib);
        let target, label;

        if (now < fajrTime) {
            // Before Fajr → countdown to Sehri end
            target = fajrTime;
            label = "Time until Sehri Ends";
        } else if (now < maghribTime) {
            // During fast → countdown to Iftar
            target = maghribTime;
            label = "Time until Iftar";
        } else {
            // After Iftar → countdown to tomorrow's Sehri
            target = getTodayTime(fajr);
            target.setDate(target.getDate() + 1);
            label = "Time until Sehri";
        }

        const diff = target - now;
        if (diff < 0) return;

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        // Update Label
        const labelEl = document.getElementById('ramadan-timer-label');
        if (labelEl) labelEl.innerText = label.toUpperCase();

        const timerEl = document.getElementById('timer');
        if (timerEl) timerEl.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

const SURAH_FAZAIL = {
    1: { t: "Prophet (ﷺ) said: 'The Seven Oft-Repeated Verses is Al-Fatiha.'", r: "Bukhari Sharif" },
    18: { t: "Protection from Dajjal and light until the next Jumu'ah.", r: "Jamia Nizamia / Muslim" },
    36: { t: "The Heart of the Quran. Intercedes for his reciter.", r: "Tirmidhi / Nizamia Core" },
    55: { t: "The Adornment of the Quran (Uroosu-l-Quran).", r: "Baihaqi" },
    56: { t: "Protects from poverty if recited every night.", r: "Jamia Nizamia / Baihaqi" },
    67: { t: "Shield from the punishment of the grave.", r: "Bukhari Sharif / Abu Dawud" },
    112: { t: "Equal to one-third of the whole Quran.", r: "Bukhari Sharif" }
};

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

    if (arEl) {
        arEl.innerText = selectedDua.arabic;
    }
    if (trEl) trEl.innerText = `"${selectedDua.translation}"`;
    if (refEl) refEl.innerText = `— ${selectedDua.ref}`;
}

window.voiceDua = function () {
    const arEl = document.getElementById('duaArabic');
    if (!arEl || !arEl.innerText || arEl.innerText === '--') return;

    const msg = new SpeechSynthesisUtterance();
    msg.text = arEl.innerText;
    msg.lang = 'ar-SA';
    msg.rate = 0.8;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arVoice) msg.voice = arVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

// Initialize Dua on Load
setTimeout(displayRandomDua, 1000);

// --- RAMADAN UTILITIES ---
window.printRamadanTable = function () {
    const table = document.getElementById('monthly-calendar-body').closest('table').cloneNode(true);
    const label = document.getElementById('calendar-month-label').innerText;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        <html><head><title>Ramadan Timetable</title>
        <style>
            body { font-family: sans-serif; padding: 40px; color: #064e3b; }
            h1 { text-align: center; border-bottom: 2px solid #af944d; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
            th { background: #f8f9fa; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .hijri { color: #af944d; font-weight: bold; }
        </style></head>
        <body><h1>${label}</h1>`);
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Alarm States
document.getElementById('alarm-suhoor')?.addEventListener('change', (e) => {
    localStorage.setItem('alarm_suhoor', e.target.checked);
    if (e.target.checked) alert("Suhoor alarm set based on your local time.");
});
document.getElementById('alarm-taraweeh')?.addEventListener('change', (e) => {
    localStorage.setItem('alarm_taraweeh', e.target.checked);
    if (e.target.checked) alert("Taraweeh reminder set for 15 minutes after Isha.");
});

// Load Alarm States
window.addEventListener('load', () => {
    const s = localStorage.getItem('alarm_suhoor') === 'true';
    const t = localStorage.getItem('alarm_taraweeh') === 'true';

    // Alarms UI removed for simplicity, safe checking if elements exist
    const sEl = document.getElementById('alarm-suhoor');
    if (sEl) sEl.checked = s;
    const tEl = document.getElementById('alarm-taraweeh');
    if (tEl) tEl.checked = t;
});

function performHurfAnalysis(ayahs) {
    const fullText = ayahs.map(a => a.text).join(' ');
    // Common letters in Muqatta'at or significant ones
    const chars = ['ا', 'ل', 'م', 'ر', 'ك', 'ه', 'ي', 'ع', 'ص', 'ط', 'ق', 'ن'];
    const names = ['Alif', 'Lam', 'Meem', 'Ra', 'Kaf', 'Ha', 'Ya', 'Ain', 'Sad', 'Ta', 'Qaf', 'Nun'];
    const container = document.getElementById('meta-hurf-list');
    if (!container) return;

    container.innerHTML = '';
    chars.forEach((char, idx) => {
        const count = (fullText.split(char).length - 1);
        if (count > 0) {
            const chip = document.createElement('div');
            chip.className = 'hurf-chip';
            chip.innerHTML = `<span class="opacity-40 mr-1 text-[8px] tracking-tight">${names[idx]}</span> <span class="font-[Amiri] text-sm">${char}</span> <span class="ml-1 text-white font-black">${count}</span>`;
            container.appendChild(chip);
        }
    });
}

window.toggleTranslations = function () {
    const content = document.getElementById('quran-content');
    const btn = document.getElementById('translation-toggle');
    if (!content) return;
    const isHidden = content.classList.toggle('translations-hidden');

    if (btn) {
        btn.innerText = isHidden ? 'TRANSLATIONS: OFF' : 'TRANSLATIONS: ON';
        btn.classList.toggle('text-emerald-400', !isHidden);
        btn.classList.toggle('text-red-400', isHidden);
    }

    localStorage.setItem('hide_translations', isHidden);

    // Rebuild Playlist dynamically
    if (window.currentSurahData) {
        const arData = window.currentSurahData;
        const hideTranslations = isHidden;
        const surahNum = arData.data.number || 1;
        const pad3 = n => String(n).padStart(3, '0');
        const isSurahMode = (window.currentDirType !== 'juz'); // Ensure this var is accessible

        currentPlaylist = [];
        currentAudioIndex = 0;

        const useSeamless = (hideTranslations && isSurahMode);

        if (useSeamless) {
            // Seamless Mode
            currentPlaylist.push(`https://server8.mp3quran.net/afs/${pad3(surahNum)}.mp3`);
            document.getElementById('player-sub').innerText = "Seamless Recitation (Mishary Alafasy)";
        } else {
            // Verse Mode
            const hasPreamble = (surahNum !== 1 && surahNum !== 9);
            if (hasPreamble) {
                currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3`);
            }
            arData.data.ayahs.forEach(a => {
                currentPlaylist.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
                if (!hideTranslations) {
                    currentPlaylist.push(`https://cdn.islamic.network/quran/audio/64/ur.khan/${a.number}.mp3`);
                }
            });
            document.getElementById('player-sub').innerText = "Verse-by-Verse (Study Mode)";
        }

        // Reset Player
        const player = document.getElementById('quran-audio');
        if (player) {
            player.pause();
            player.src = currentPlaylist[0];
            updatePlayerUI(false);
            updatePlayerInfo(0);
        }

        // Notify User
        const mode = useSeamless ? "Seamless Recitation" : "Study Mode (Dual Audio)";
        console.log(`Switched to ${mode}`);
    }
}



window.toggleMushafMode = function () {
    const content = document.getElementById('quran-content');
    const btn = document.getElementById('mushaf-toggle');
    if (!content) return;

    const isMushaf = content.classList.toggle('mushaf-mode');
    if (btn) btn.innerText = isMushaf ? 'MODE: BOOK' : 'MODE: VERSE';
    localStorage.setItem('mushaf_mode', isMushaf);
}

// Update Local Time Card
setInterval(() => {
    const timeCard = document.getElementById('hero-local-time');
    if (timeCard) {
        timeCard.innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
}, 1000);

// Update Local Time (Cyber-Noor High Precision)
setInterval(() => {
    const timeEl = document.getElementById('hero-local-time');
    if (timeEl) {
        timeEl.innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
}, 1000);

