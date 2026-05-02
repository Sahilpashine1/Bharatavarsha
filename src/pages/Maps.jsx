import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Globe, Clock, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Pulsing City Marker (CSS-animated DivIcon) ────────────────────────────────
const makeCityIcon = (color, size = 12) => L.divIcon({
    className: '',
    iconSize: [size * 3, size * 3],
    iconAnchor: [size * 1.5, size * 1.5],
    html: `
    <div style="position:relative;width:${size * 3}px;height:${size * 3}px;display:flex;align-items:center;justify-content:center;">
      <div style="
        position:absolute;width:${size * 2.6}px;height:${size * 2.6}px;
        border-radius:50%;background:${color}18;
        animation:pulse-outer 2.5s ease-in-out infinite;"></div>
      <div style="
        position:absolute;width:${size * 1.6}px;height:${size * 1.6}px;
        border-radius:50%;background:${color}35;
        animation:pulse-inner 2.5s ease-in-out infinite 0.4s;"></div>
      <div style="
        position:absolute;width:${size}px;height:${size}px;
        border-radius:50%;background:${color};
        box-shadow:0 0 ${size * 1.5}px ${color},0 0 ${size * 3}px ${color}66;"></div>
    </div>
  `,
});

const makeCapitalIcon = (color) => makeCityIcon(color, 16);

// ─── ERA DATA ─────────────────────────────────────────────────────────────────
export const ERAS = [
    {
        id: 'indus', year: -2500, label: '2500 BCE',
        name: 'Indus Valley Civilisation',
        accent: '#4fc3f7',
        description: 'One of the world\'s earliest urban civilisations flourished along the Indus river. Major cities like Mohenjo-daro and Harappa had advanced drainage systems, grid streets, and standardised weights.',
        facts: ['Population ~5 million', 'Over 1,400 cities & settlements', 'Trade links with Mesopotamia', 'Sophisticated sewage systems — ahead of medieval Europe'],
        capitals: [
            { name: 'Mohenjo-daro ★', lat: 27.33, lng: 68.13, isCapital: true },
            { name: 'Harappa', lat: 30.63, lng: 72.86 },
            { name: 'Lothal', lat: 22.52, lng: 72.25 },
            { name: 'Dholavira', lat: 23.88, lng: 70.22 },
            { name: 'Rakhigarhi', lat: 29.28, lng: 76.12 },
        ],
        // Indus Valley: covers Balochistan, Sindh (Pakistan), NW India, Punjab plains, Gujarat coast
        territories: [[
            [32, 64], [33, 68], [35, 69], [35, 72], [33, 75], [31, 76], [29, 77], [28, 76], [26, 74],
            [24, 72], [22, 70], [20, 68], [20, 72], [21, 74], [22, 76], [24, 74], [26, 73], [28, 73],
            [30, 72], [31, 74], [32, 72], [34, 70], [33, 67], [31, 65], [29, 63], [26, 62], [25, 64],
            [27, 64], [29, 65], [31, 65], [32, 64]
        ]],
    },
    {
        id: 'vedic', year: -1000, label: '1000 BCE',
        name: 'Vedic Period',
        accent: '#ffd54f',
        description: 'Indo-Aryan tribes spread across the Gangetic plains composing the Vedas. Sixteen Mahajanapadas were forming. The Iron Age enabled forest clearing and new agriculture across North India.',
        facts: ['Rig Veda composed', 'Iron Age technology', 'Varna system emerging', 'Sanskrit language standardised by Panini'],
        capitals: [
            { name: 'Hastinapura ★', lat: 29.17, lng: 78.04, isCapital: true },
            { name: 'Kurukshetra', lat: 29.97, lng: 76.83 },
            { name: 'Ayodhya', lat: 26.79, lng: 82.20 },
            { name: 'Kashi (Varanasi)', lat: 25.32, lng: 83.00 },
        ],
        // Vedic: mostly Gangetic plain from Haryana to Bihar, not deep south
        territories: [[
            [32, 74], [33, 77], [33, 79], [31, 82], [29, 85], [27, 85], [25, 83], [24, 81],
            [24, 78], [25, 76], [27, 74], [28, 73], [30, 73], [31, 73], [32, 74]
        ]],
    },
    {
        id: 'mahajanapadas', year: -500, label: '500 BCE',
        name: 'Mahajanapadas & Buddha',
        accent: '#ce93d8',
        description: 'Sixteen great kingdoms dominated. Magadha rose supreme. Siddhartha Gautama attained enlightenment at Bodh Gaya (528 BCE). Mahavira founded Jainism. Panini codified Sanskrit grammar.',
        facts: ['Buddha attains enlightenment 528 BCE', 'Mahavira founds Jainism', 'Panini writes Ashtadhyayi', 'Magadha controls the Gangetic plain'],
        capitals: [
            { name: 'Rajgir — Magadha ★', lat: 25.03, lng: 85.42, isCapital: true },
            { name: 'Vaishali', lat: 25.98, lng: 85.12 },
            { name: 'Taxila', lat: 33.74, lng: 72.83 },
            { name: 'Bodh Gaya', lat: 24.70, lng: 84.99 },
        ],
        // Mahajanapadas: expanded across N India from NW frontier to Bihar/Bengal, minor southern reach
        territories: [[
            [33, 72], [34, 76], [35, 77], [34, 82], [32, 86], [29, 88], [27, 87], [25, 85],
            [23, 83], [22, 82], [22, 79], [23, 77], [24, 76], [26, 74], [27, 73], [29, 72], [31, 71], [33, 72]
        ]],
    },
    {
        id: 'maurya', year: -260, label: '260 BCE',
        name: 'Mauryan Empire — Ashoka',
        accent: '#ff8a65',
        description: 'Emperor Ashoka, after the bloody Kalinga War, converted to Buddhism. He ruled the largest empire India ever had — 5 million km². His rock edicts proclaimed dharma, religious tolerance, and animal welfare across the subcontinent.',
        facts: ['Largest Indian empire — ~5 million km²', 'Kalinga War: 100,000+ killed', 'Buddhism spread to Sri Lanka & Central Asia', 'Lion Capital — India\'s national emblem'],
        capitals: [
            { name: 'Pataliputra ★', lat: 25.60, lng: 85.10, isCapital: true },
            { name: 'Taxila', lat: 33.74, lng: 72.83 },
            { name: 'Ujjain', lat: 23.18, lng: 75.78 },
            { name: 'Tosali (Kalinga)', lat: 20.25, lng: 85.83 },
            { name: 'Suvarnagiri (South)', lat: 15.34, lng: 76.46 },
        ],
        // Mauryan Empire at peak: almost entire subcontinent + Afghanistan highlands
        territories: [[
            [35, 61], [36, 64], [36, 69], [35, 72], [34, 74], [34, 78], [33, 80],
            [31, 84], [29, 88], [27, 90], [25, 92], [22, 90], [20, 87], [17, 82], [14, 76],
            [12, 76], [10, 77], [8, 77], [8, 79], [10, 80], [12, 80], [14, 79], [16, 81],
            [18, 83], [20, 87], [22, 88], [24, 88], [26, 90], [28, 88], [30, 86], [32, 84],
            [34, 80], [35, 76], [36, 72], [36, 68], [35, 64], [34, 61], [35, 61]
        ]],
    },
    {
        id: 'gupta', year: 380, label: '380 CE',
        name: 'Gupta Empire — Golden Age',
        accent: '#ffd700',
        description: 'The Gupta era is India\'s Golden Age. Aryabhata calculated π and proposed heliocentrism. Kalidasa wrote Abhijnanasakuntalam. The decimal number system and zero were formalised. Nalanda University attracted scholars from across Asia.',
        facts: ['Aryabhata calculates π & proposes zero', 'Kalidasa — greatest Sanskrit playwright', 'Iron Pillar of Delhi (still rust-free)', 'Nalanda University founded (~5th century)'],
        capitals: [
            { name: 'Pataliputra ★', lat: 25.60, lng: 85.10, isCapital: true },
            { name: 'Ujjain', lat: 23.18, lng: 75.78 },
            { name: 'Prayagraj', lat: 25.43, lng: 81.84 },
            { name: 'Nalanda', lat: 25.13, lng: 85.44 },
        ],
        // Gupta Empire: North India, Bengal, parts of Central India — NOT peninsular south
        territories: [[
            [32, 72], [33, 75], [33, 79], [32, 82], [30, 86], [28, 88], [26, 88], [24, 85],
            [23, 83], [22, 80], [21, 78], [21, 76], [22, 74], [24, 73], [26, 72], [28, 71], [30, 71], [32, 72]
        ]],
    },
    {
        id: 'chola', year: 1010, label: '1010 CE',
        name: 'Chola Empire — Naval Supremacy',
        accent: '#ef5350',
        description: 'Rajaraja Chola I and Rajendra Chola I built Asia\'s largest navy. They conquered Ceylon and launched a naval raid on the Srivijaya Empire in Sumatra. Chola bronze Nataraja sculptures remain the pinnacle of Indian art.',
        facts: ['Brihadeeswarar Temple — UNESCO World Heritage', 'Naval raid on Srivijaya (Sumatra)', 'Ceylon conquered & held 77 years', 'Nataraja bronze — greatest Indian sculpture'],
        capitals: [
            { name: 'Thanjavur ★', lat: 10.78, lng: 79.13, isCapital: true },
            { name: 'Gangaikondacholapuram', lat: 11.23, lng: 79.45 },
            { name: 'Kanchipuram', lat: 12.84, lng: 79.70 },
            { name: 'Madurai', lat: 9.93, lng: 78.12 },
        ],
        // Chola Empire: Tamil Nadu coast, lower Andhra, Kerala coast, reached Karnataka
        territories: [[
            [16, 74], [14, 74], [12, 74], [10, 76], [8.5, 77], [8, 77.5], [8, 79],
            [9, 79], [10, 79], [12, 80], [13, 80], [15, 80], [16, 81], [17, 82],
            [16, 82], [14, 82], [13, 80], [14, 78], [15, 77], [16, 76], [16, 74]
        ]],
    },
    {
        id: 'delhi', year: 1320, label: '1320 CE',
        name: 'Delhi Sultanate',
        accent: '#80cbc4',
        description: 'Five dynasties — Slave, Khalji, Tughlaq, Sayyid, Lodi — ruled Delhi for 320 years. Alauddin Khalji repelled Mongol invasions that had destroyed Baghdad. Qutb Minar was built. Ibn Battuta served as court judge.',
        facts: ['Alauddin Khalji repelled 3 major Mongol invasions', 'Qutb Minar — tallest minaret in India', 'Ibn Battuta served as Qadi (judge)', 'Muhammad Tughlaq moved capital to Daulatabad'],
        capitals: [
            { name: 'Delhi ★', lat: 28.61, lng: 77.21, isCapital: true },
            { name: 'Lahore', lat: 31.55, lng: 74.34 },
            { name: 'Daulatabad', lat: 19.94, lng: 75.22 },
            { name: 'Madurai (southern extent)', lat: 9.93, lng: 78.12 },
        ],
        // Delhi Sultanate: Delhi heartland, Punjab, Sindh, Bengal, and southern campaigns to Madurai
        territories: [[
            [33, 71], [34, 74], [35, 75], [34, 80], [32, 82], [30, 85], [28, 88],
            [26, 88], [24, 86], [22, 84], [20, 80], [18, 76], [16, 74], [14, 76],
            [12, 78], [10, 79], [12, 79], [14, 79], [16, 80], [18, 76], [20, 76],
            [22, 74], [24, 73], [26, 72], [28, 71], [30, 71], [31, 71], [32, 70], [33, 71]
        ]],
    },
    {
        id: 'vijayanagara', year: 1500, label: '1500 CE',
        name: 'Vijayanagara Empire',
        accent: '#a5d6a7',
        description: 'The last great Hindu empire of South India. Its capital Hampi was the second-largest city in the world with 500,000 people. The empire controlled the spice trade and was fabulously wealthy — described in awe by Portuguese travellers.',
        facts: ['Hampi — 2nd largest city in the world', 'Population estimated 500,000', 'Portuguese visitor Domingo Paes was astounded', 'Promoted Telugu & Kannada literature'],
        capitals: [
            { name: 'Hampi (Vijayanagara) ★', lat: 15.34, lng: 76.46, isCapital: true },
            { name: 'Penukonda', lat: 14.09, lng: 77.60 },
            { name: 'Tirupati', lat: 13.63, lng: 79.42 },
        ],
        // Vijayanagara: South India from Krishna river southward, NOT covering Maharashtra
        territories: [[
            [16, 74], [15, 74], [14, 73], [12, 74], [10, 76], [8.5, 77],
            [8, 77.5], [8, 79], [9, 79.5], [10, 79], [11, 79.5], [12, 80],
            [14, 80], [15, 80], [16, 81], [17, 81], [18, 80], [18, 78], [17, 76], [16, 74]
        ]],
    },
    {
        id: 'mughal', year: 1700, label: '1700 CE',
        name: 'Mughal Empire — Peak',
        accent: '#7986cb',
        description: 'At its height under Aurangzeb, the Mughal Empire controlled most of the subcontinent — GDP estimated at 25% of world output. The Taj Mahal, Red Fort, and hundreds of magnificent monuments were built. Persian art, music, and cuisine fused with Indian culture.',
        facts: ['GDP = 25% of world output', 'Population ~150 million', 'Taj Mahal built 1632–1653', 'Controlled more territory than any previous Indian ruler'],
        capitals: [
            { name: 'Agra ★', lat: 27.18, lng: 78.02, isCapital: true },
            { name: 'Delhi (Shahjahanabad)', lat: 28.65, lng: 77.23 },
            { name: 'Lahore', lat: 31.55, lng: 74.34 },
            { name: 'Aurangabad', lat: 19.88, lng: 75.34 },
            { name: 'Dhaka', lat: 23.81, lng: 90.41 },
        ],
        // Mughal Empire peak under Aurangzeb: nearly full subcontinent + Kabul region
        territories: [[
            [34, 62], [35, 66], [36, 68], [35, 72], [34, 74], [34, 78], [33, 80],
            [31, 82], [29, 87], [27, 90], [25, 92], [23, 92], [21, 88], [18, 82],
            [15, 76], [12, 76], [10, 77], [8, 77], [8, 79], [10, 80], [12, 80],
            [14, 79], [16, 81], [18, 84], [20, 87], [22, 88], [24, 88], [26, 90],
            [28, 90], [30, 87], [32, 85], [34, 81], [35, 77], [35, 74], [34, 72],
            [33, 70], [31, 67], [29, 64], [27, 62], [27, 64], [29, 65], [31, 65], [33, 64], [34, 62]
        ]],
    },
    {
        id: 'maratha', year: 1760, label: '1760 CE',
        name: 'Maratha Confederacy',
        accent: '#ff7043',
        description: 'The Maratha Empire under the Peshwas expanded to control nearly the entire subcontinent. Their cavalry covered thousands of miles in rapid raids. At their peak, the Marathas collected taxes in Delhi while the Mughal Emperor was their nominal prisoner.',
        facts: ['Controlled 2.8 million km² at peak', 'Cavalry covered 50–100 km per day', 'Peshwa Bajirao I never lost a single battle', 'Destroyed by British in 3 Anglo-Maratha Wars (1775–1818)'],
        capitals: [
            { name: 'Pune (Peshwa) ★', lat: 18.52, lng: 73.86, isCapital: true },
            { name: 'Satara', lat: 17.69, lng: 74.01 },
            { name: 'Nagpur (Bhonsale)', lat: 21.15, lng: 79.08 },
            { name: 'Gwalior (Scindia)', lat: 26.22, lng: 78.18 },
            { name: 'Indore (Holkar)', lat: 22.72, lng: 75.86 },
        ],
        // Maratha Confederacy: Maharashtra + Central India + Northern raids up to Delhi + Deccan
        territories: [[
            [29, 70], [30, 72], [31, 75], [30, 80], [29, 83], [27, 87], [25, 86],
            [23, 84], [21, 82], [19, 80], [17, 78], [15, 76], [12, 78], [14, 76],
            [16, 74], [18, 73], [20, 72], [22, 73], [24, 72], [26, 71], [27, 71],
            [28, 70], [29, 70]
        ]],
    },
    {
        id: 'british', year: 1858, label: '1858 CE',
        name: 'British Raj',
        accent: '#ef9a9a',
        description: 'After 1857\'s Rebellion, Queen Victoria was proclaimed Empress of India. The British Raj covered 4.5 million km². Railways and telegraphs were built — but devastating famines (17–29 million dead 1876–1908), systematic deindustrialisation, and total political subjugation accompanied them.',
        facts: ['67,000 km of railways built', '1876–78 famine: 5.5 million dead', '£45 trillion drained from India (economists\' estimate)', 'Gandhi\'s non-cooperation movement 1920'],
        capitals: [
            { name: 'Calcutta (Kolkata) ★', lat: 22.57, lng: 88.36, isCapital: true },
            { name: 'New Delhi (from 1911)', lat: 28.61, lng: 77.21 },
            { name: 'Simla (Summer Capital)', lat: 31.10, lng: 77.17 },
            { name: 'Bombay (Mumbai)', lat: 18.96, lng: 72.82 },
            { name: 'Madras (Chennai)', lat: 13.08, lng: 80.27 },
        ],
        // British Raj: entire Indian subcontinent (including modern India, Pakistan, Bangladesh)
        territories: [[
            [35, 61], [36, 64], [36, 69], [35, 72], [34, 74], [34, 78], [33, 80],
            [31, 84], [29, 88], [27, 90], [25, 93], [23, 93], [21, 92], [22, 92],
            [22, 91], [22, 89], [21, 87], [20, 87], [18, 84], [16, 81], [14, 79],
            [12, 80], [10, 79], [8, 77], [8, 77.5], [8, 79], [10, 80], [12, 80],
            [14, 79], [16, 81], [18, 84], [20, 87], [22, 89], [22, 91], [23, 91],
            [24, 91], [25, 91], [26, 92], [26, 94], [25, 95], [24, 94], [22, 93],
            [21, 92], [20, 92], [18, 94], [16, 94], [15, 92], [16, 82], [18, 84],
            [20, 87], [22, 89], [24, 90], [26, 90], [28, 90], [30, 88], [32, 85],
            [34, 80], [35, 77], [35, 74], [34, 72], [33, 70], [31, 67], [29, 64],
            [27, 62], [27, 64], [29, 65], [31, 65], [33, 64], [34, 62], [35, 61]
        ]],
    },
    {
        id: 'independence', year: 1947, label: '15 Aug 1947',
        name: 'Independence & Partition',
        accent: '#a5d6a7',
        description: 'On 15 August 1947, India gained independence after 190 years of British rule. The subcontinent was simultaneously partitioned into India and Pakistan — one of history\'s largest forced migrations with 10–20 million displaced. Nehru delivered his iconic "Tryst with Destiny" speech at midnight.',
        facts: ['"Tryst with Destiny" — 15 August midnight', '10–20 million displaced in Partition', 'Gandhi assassinated 30 January 1948', 'Constitution adopted 26 January 1950'],
        capitals: [
            { name: 'New Delhi ★', lat: 28.61, lng: 77.21, isCapital: true },
            { name: 'Bombay', lat: 18.96, lng: 72.82 },
            { name: 'Karachi (Pakistan)', lat: 24.86, lng: 67.01 },
        ],
        // Independent India borders (1947): roughly modern India without Pakistan/Bangladesh
        territories: [[
            [34, 74], [35, 76], [36, 77], [34, 80], [33, 80], [31, 80], [29, 80],
            [28, 84], [28, 87], [27, 88], [26, 91], [25, 92], [24, 92], [23, 92], [22, 92],
            [22, 90], [22, 89], [21, 87], [20, 86], [18, 84], [16, 81], [14, 79],
            [12, 80], [10, 79], [8, 77], [8, 77.5], [9, 78], [10, 79.5], [12, 80],
            [14, 80], [16, 81], [18, 84], [20, 86], [21, 87], [22, 88], [22, 90],
            [23, 90], [24, 90], [25, 91], [26, 90], [27, 88], [28, 87], [28, 84],
            [29, 80], [30, 80], [31, 79], [32, 79], [33, 79], [34, 78], [35, 76], [34, 74]
        ]],
    },
    {
        id: 'modern', year: 2024, label: '2024 CE',
        name: 'Republic of India',
        accent: '#80deea',
        description: 'India is the world\'s largest democracy — 1.4 billion people. A $3.7 trillion economy (5th largest), nuclear power, largest army by personnel. Chandrayaan-3 landed on the Moon\'s south pole in 2023. India leads the world in space exploration cost-efficiency.',
        facts: ['1.4 billion people — world\'s most populous', '$3.7 trillion GDP (5th largest globally)', 'Chandrayaan-3 — Moon south pole 2023', '75+ years of uninterrupted constitutional democracy'],
        capitals: [
            { name: 'New Delhi ★', lat: 28.61, lng: 77.21, isCapital: true },
            { name: 'Mumbai', lat: 18.96, lng: 72.82 },
            { name: 'Bengaluru', lat: 12.97, lng: 77.59 },
            { name: 'Chennai', lat: 13.08, lng: 80.27 },
            { name: 'Kolkata', lat: 22.57, lng: 88.36 },
            { name: 'Hyderabad', lat: 17.38, lng: 78.47 },
        ],
        // Modern Republic of India — accurate border tracing
        territories: [[
            [35, 76.5], [34.5, 78], [33, 79], [32, 79], [30.5, 79.5], [29.5, 80],
            [28.5, 81], [28, 84], [27.5, 87], [27.5, 88], [26.5, 90], [26, 92],
            [25.5, 92], [25, 91], [24, 92], [23, 93], [22.5, 93], [22, 92],
            [22, 91], [22, 89], [21.5, 87], [20.5, 86], [19, 84], [17, 82],
            [15, 80], [13, 80], [11.5, 79.5], [10, 79], [8.5, 77.5], [8.1, 77.2],
            [8.5, 77], [9.5, 78], [11, 79], [12, 80], [13, 80], [15, 80],
            [17, 82], [19, 84], [21, 87], [22, 89], [22, 91], [23, 91],
            [24, 91], [25, 91], [26, 91], [26.5, 90], [27.5, 88], [28, 87],
            [28, 84], [29, 80], [30, 79.5], [31, 79], [32, 79], [33, 79],
            [34.5, 78], [35, 76.5]
        ]],
    },
];

// ─── Fly-to controller ───────────────────────────────────────────────────────
function FlyToEra({ era }) {
    const map = useMap();
    useEffect(() => {
        const cap = era.capitals[0];
        if (cap) {
            map.flyTo([cap.lat + 6, cap.lng], 5, { animate: true, duration: 1.4 });
        }
    }, [era.id]);
    return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────
const Maps = () => {
    const [eraIndex, setEraIndex] = useState(3);
    const [isPlaying, setIsPlaying] = useState(false);
    const [geoData, setGeoData] = useState(null);
    const navigate = useNavigate();
    const era = ERAS[eraIndex];

    useEffect(() => {
        fetch('/erasGeoJSON.json').then(r => r.json()).then(data => setGeoData(data)).catch(e => console.error("GeoJSON error:", e));
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        const t = setInterval(() => {
            setEraIndex(i => {
                if (i >= ERAS.length - 1) { setIsPlaying(false); return i; }
                return i + 1;
            });
        }, 3000);
        return () => clearInterval(t);
    }, [isPlaying]);

    const prev = () => { setEraIndex(i => Math.max(0, i - 1)); setIsPlaying(false); };
    const next = () => { setEraIndex(i => Math.min(ERAS.length - 1, i + 1)); setIsPlaying(false); };

    return (
        <div className="h-screen w-full bg-[#05070f] overflow-hidden relative font-sans text-white flex flex-col">

            {/* CSS for city marker pulse */}
            <style>{`
        @keyframes pulse-outer {
          0%,100%{transform:scale(1);opacity:0.3}
          50%{transform:scale(1.5);opacity:0.1}
        }
        @keyframes pulse-inner {
          0%,100%{transform:scale(1);opacity:0.5}
          50%{transform:scale(1.3);opacity:0.2}
        }
        .leaflet-container { background: #05070f !important; }
        .leaflet-tile { filter: brightness(0.75) saturate(1.1) !important; }
        .leaflet-interactive { transition: fill-opacity 0.8s ease, stroke-opacity 0.8s ease, stroke-width 0.8s ease !important; stroke-linejoin: round; stroke-linecap: round; }
        .era-tooltip {
          background: rgba(5,7,15,0.92) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.6) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 10px !important;
          padding: 5px 10px !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          white-space: nowrap !important;
          color: #fff !important;
        }
        .era-tooltip::before { display:none !important; }
        .leaflet-zoom-animated { transition: none !important; }
      `}</style>

            {/* ─── Header ─── */}
            <header className="relative z-50 flex items-center justify-between px-6 py-4 glass-nav border-b border-white/5 shrink-0">
                <button onClick={() => navigate('/timeline')} className="text-[#a0aabf] hover:text-[#d4af37] flex items-center gap-2 group transition-colors">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline font-bold tracking-wider uppercase text-sm">Timeline</span>
                </button>
                <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[#d4af37]" />
                    <h1 className="text-2xl md:text-3xl font-black tracking-[0.15em] text-gold-gradient">BHOOMI</h1>
                    <Globe size={18} className="text-[#d4af37] scale-x-[-1]" />
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: era.accent }} />
                    <span className="font-black text-sm" style={{ color: era.accent }}>{era.label}</span>
                </div>
            </header>

            {/* ─── Body ─── */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* Left Info Panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={era.id}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="w-full md:w-[340px] lg:w-[380px] glass-modal border-r border-white/5 flex flex-col p-6 overflow-y-auto custom-scrollbar shrink-0 z-20"
                    >
                        {/* Accent line + era label */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-[2px] rounded-full" style={{ background: era.accent }} />
                            <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: era.accent }}>
                                {era.label}
                            </span>
                            {/* Glow dot */}
                            <div className="w-2 h-2 rounded-full ml-auto" style={{ background: era.accent, boxShadow: `0 0 8px ${era.accent}` }} />
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-4">{era.name}</h2>
                        <p className="text-[#a0aabf] text-sm leading-relaxed mb-6">{era.description}</p>

                        {/* Key facts */}
                        <div className="glass rounded-2xl p-5 mb-5" style={{ borderColor: `${era.accent}20`, border: `1px solid ${era.accent}20` }}>
                            <h3 className="text-[10px] uppercase tracking-[0.25em] font-black mb-4" style={{ color: era.accent }}>Key Facts</h3>
                            <ul className="space-y-2.5">
                                {era.facts.map((f, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="flex items-start gap-2.5 text-sm text-[#e2e8f0]"
                                    >
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: era.accent }} />
                                        {f}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Capitals */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.25em] font-black mb-3" style={{ color: era.accent }}>
                                Capitals & Major Cities
                            </h3>
                            <div className="flex flex-col gap-2">
                                {era.capitals.map((c, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.06 }}
                                        className="flex items-center gap-2 glass-pill px-3 py-2.5 rounded-xl text-sm"
                                        style={{ borderColor: c.isCapital ? `${era.accent}40` : 'rgba(255,255,255,0.07)' }}
                                    >
                                        <MapPin size={11} style={{ color: era.accent }} />
                                        <span className={c.isCapital ? 'text-white font-bold' : 'text-[#a0aabf]'}>{c.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Map */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Era ambient colour glow */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={era.id + '-glow'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 z-[5] pointer-events-none"
                            style={{ background: `radial-gradient(ellipse 60% 60% at 65% 35%, ${era.accent}1A 0%, transparent 70%)` }}
                        />
                    </AnimatePresence>

                    <MapContainer
                        center={[22, 80]}
                        zoom={5}
                        style={{ width: '100%', height: '100%' }}
                        zoomControl={true}
                        attributionControl={false}
                        scrollWheelZoom={true}
                    >
                        <FlyToEra era={era} />

                        {/* Dark map tiles */}
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                        {/* Exact GeoJSON boundary overlapping */}
                        {geoData && ERAS.map((e) => {
                            const isActive = e.id === era.id;
                            return (
                                <GeoJSON
                                    key={e.id + (isActive ? '-active' : '') + '-geo'}
                                    data={geoData[e.id]}
                                    style={() => ({
                                        color: e.accent,
                                        fillColor: e.accent,
                                        weight: isActive ? 2.5 : 0,
                                        opacity: isActive ? 0.9 : 0,
                                        fillOpacity: isActive ? 0.22 : 0,
                                    })}
                                />
                            );
                        })}

                        {geoData && ERAS.map((e) => {
                            const isActive = e.id === era.id;
                            return (
                                <GeoJSON
                                    key={e.id + (isActive ? '-active' : '') + '-glow'}
                                    data={geoData[e.id]}
                                    style={() => ({
                                        color: e.accent,
                                        fillColor: 'transparent',
                                        weight: isActive ? 8 : 0,
                                        opacity: isActive ? 0.2 : 0,
                                        fillOpacity: 0,
                                    })}
                                />
                            );
                        })}

                        {/* City markers */}
                        {era.capitals.map((city, i) => (
                            <Marker
                                key={`${era.id}-city-${i}`}
                                position={[city.lat, city.lng]}
                                icon={city.isCapital ? makeCapitalIcon(era.accent) : makeCityIcon(era.accent, 9)}
                            >
                                <Tooltip
                                    permanent={city.isCapital}
                                    direction="top"
                                    offset={[0, city.isCapital ? -22 : -16]}
                                    className="era-tooltip"
                                >
                                    <span style={{ color: era.accent }}>{city.name}</span>
                                </Tooltip>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Era badge on map */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={era.id + '-badge'}
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-4 right-4 z-[1000] glass-card rounded-xl px-4 py-3 flex items-center gap-3 pointer-events-none"
                        >
                            <motion.div
                                className="w-3 h-3 rounded-full"
                                style={{ background: era.accent, boxShadow: `0 0 10px ${era.accent}` }}
                                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div>
                                <p className="text-[10px] text-[#a0aabf] uppercase tracking-widest">Active Era</p>
                                <p className="text-white font-bold text-sm">{era.name}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Era index / total */}
                    <div className="absolute bottom-4 right-4 z-[1000] glass px-3 py-1.5 rounded-full text-xs text-[#a0aabf] font-mono">
                        {eraIndex + 1} / {ERAS.length}
                    </div>
                </div>
            </div>

            {/* ─── Bottom Timeline ─── */}
            <div className="shrink-0 glass-nav border-t border-white/5 px-6 py-4 z-30">
                {/* Era dot row */}
                <div className="flex items-end gap-1.5 mb-4 overflow-x-auto pb-1">
                    {ERAS.map((e, i) => (
                        <button
                            key={e.id}
                            onClick={() => { setEraIndex(i); setIsPlaying(false); }}
                            title={e.name}
                            className="shrink-0 flex flex-col items-center gap-1.5 group"
                        >
                            <motion.div
                                className="rounded-full transition-all duration-300"
                                animate={{
                                    width: i === eraIndex ? 14 : 8,
                                    height: i === eraIndex ? 14 : 8,
                                    backgroundColor: i <= eraIndex ? e.accent : '#1e293b',
                                    boxShadow: i === eraIndex ? `0 0 10px ${e.accent}, 0 0 20px ${e.accent}66` : 'none',
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className={`text-[8px] uppercase tracking-tight whitespace-nowrap transition-all ${i === eraIndex ? 'text-white font-black' : 'text-[#a0aabf]/30 group-hover:text-[#a0aabf]/70'
                                }`}>
                                {e.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button onClick={prev} disabled={eraIndex === 0}
                        className="glass-btn rounded-full p-2 disabled:opacity-25 text-[#a0aabf] hover:text-white">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setIsPlaying(p => !p)}
                        className="glass-gold rounded-full p-2.5 border border-[#d4af37]/30 hover:border-[#d4af37] text-[#d4af37] transition-all">
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={next} disabled={eraIndex === ERAS.length - 1}
                        className="glass-btn rounded-full p-2 disabled:opacity-25 text-[#a0aabf] hover:text-white">
                        <ChevronRight size={18} />
                    </button>

                    {/* Timeline scrubber */}
                    <div className="flex-1 relative h-6 flex items-center">
                        <div className="absolute w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${ERAS[0].accent}88, ${era.accent})` }}
                                animate={{ width: `${(eraIndex / (ERAS.length - 1)) * 100}%` }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                        <input
                            type="range" min={0} max={ERAS.length - 1} value={eraIndex}
                            onChange={e => { setEraIndex(Number(e.target.value)); setIsPlaying(false); }}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <div className="text-right min-w-[90px]">
                        <p className="font-black text-sm" style={{ color: era.accent }}>
                            {era.year < 0 ? `${Math.abs(era.year)} BCE` : `${era.year} CE`}
                        </p>
                        <p className="text-[10px] text-[#a0aabf] uppercase tracking-widest truncate max-w-[90px]">
                            {era.name.split(' ').slice(0, 2).join(' ')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Maps;
