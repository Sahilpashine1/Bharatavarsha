import fs from 'fs';

let content = fs.readFileSync('./src/data/historyData.js', 'utf8');

// We will use regex to find sections and add Chapter numbers.
// However, writing a reliable regex for this is tricky.
// Let's just do a string replacement for the specific headings.

const replacements = [
    // Earth
    ["heading: 'Geological Beginnings (The Hadean Eon)'", "heading: 'Chapter 1: Birth - Geological Beginnings (The Hadean Eon)'"],
    ["heading: 'Cooling, Crust Formation, and the First Oceans'", "heading: 'Chapter 2: Maturation - Cooling, Crust Formation, and the First Oceans'"],

    // Life
    ["heading: 'The Primordial Soup and Abiogenesis'", "heading: 'Chapter 1: Birth - The Primordial Soup and Abiogenesis'"],
    ["heading: 'The Great Oxidation Event'", "heading: 'Chapter 2: Evolution - The Great Oxidation Event'"],

    // Prehistoric
    ["heading: 'Paleolithic to Mesolithic (The Hunter-Gatherer Phase)'", "heading: 'Chapter 1: The Dawn - Paleolithic to Mesolithic Hunters'"],
    ["heading: 'The Neolithic Revolution (The Agrarian Shift)'", "heading: 'Chapter 2: The Shift - The Neolithic Agricultural Revolution'"],
    ["heading: 'Chalcolithic Cultures (The Dawn of Metallurgy)'", "heading: 'Chapter 3: The End of Stone - Chalcolithic Cultures and Metallurgy'"],

    // IVC
    ["heading: 'Mastery of Urban Planning and Civic Architecture'", "heading: 'Chapter 1: The Rise - Mastery of Urban Planning and Civic Architecture'"],
    ["heading: 'A Flourishing Economy Organized by Trade'", "heading: 'Chapter 2: The Zenith - A Flourishing Economy Organized by Trade'"],
    ["heading: 'Enigmatic Society and Religion'", "heading: 'Chapter 3: The Decline - Enigmatic Society, Religion, and the Fall'"],

    // Vedic
    ["heading: 'Early Vedic (Rigvedic) Period: The Pastoral Tribes'", "heading: 'Chapter 1: The Genesis - Early Vedic (Rigvedic) Pastoral Tribes'"],
    ["heading: 'Later Vedic Period: The Iron Age Expansion'", "heading: 'Chapter 2: The Expansion - Later Vedic Period and the Iron Age'"],
    ["heading: 'Philosophical Revolt: The Upanishads'", "heading: 'Chapter 3: The Culmination - Philosophical Revolt and the Upanishads'"],

    // Mahajanapadas
    ["heading: 'The Political Landscape and the Rise of Magadha'", "heading: 'Chapter 1: The Birth of Empires - The Political Landscape and Magadha'"],
    ["heading: 'The Second Urbanization & Economic Boom'", "heading: 'Chapter 2: The Golden Age - Second Urbanization & Economic Boom'"],
    ["heading: 'The Sramana Movement: Buddhism and Jainism'", "heading: 'Chapter 3: The Spiritual Awakening - Buddhism and Jainism'"],

    // Mauryan
    ["heading: 'Foundation, Consolidation, and Expansion'", "heading: 'Chapter 1: The Birth of an Empire - Foundation and Expansion'"],
    ["heading: 'Ashoka The Great and the Policy of Dhamma'", "heading: 'Chapter 2: The Zenith - Ashoka The Great and the Policy of Dhamma'"],
    ["heading: 'The Stifling Bureaucracy and State Control'", "heading: 'Chapter 3: The Death of the Mauryas - Bureaucracy, Control, and Collapse'"],

    // Gupta
    ["heading: 'Political Consolidation: From Vassals to Emperors'", "heading: 'Chapter 1: The Rise - Political Consolidation and the Early Emperors'"],
    ["heading: 'The Epoch of Science, Literature, and Learning'", "heading: 'Chapter 2: The Golden Zenith - Science, Literature, and Classical Learning'"],
    ["heading: 'The Crystallization of Classical Art and Architecture'", "heading: 'Chapter 3: The Twilight - Classical Art, Architecture, and the Hunnic Invasions'"],

    // Delhi
    ["heading: 'The Tumultuous Succession of Dynasties'", "heading: 'Chapter 1: The Birth of the Sultanate - Tumultuous Succession of Dynasties'"],
    ["heading: 'The Powerful Iqta System'", "heading: 'Chapter 2: The Administrative Zenith - The Powerful Iqta System'"],
    ["heading: 'Indo-Islamic Architectural Marvels'", "heading: 'Chapter 3: The Death Throes - Indo-Islamic Architectural Marvels and Fracture'"],

    // Mughal
    ["heading: 'Establishment and The Great Consolidation'", "heading: 'Chapter 1: The Birth - Establishment and The Great Consolidation'"],
    ["heading: 'The Zenith of Administration and Economy'", "heading: 'Chapter 2: The Peak - The Zenith of Administration and Economy'"],
    ["heading: 'Golden Age of Art and Eventual Collapse'", "heading: 'Chapter 3: The Death - Golden Age of Art and Eventual Collapse'"],

    // Maratha
    ["heading: 'Swarajya under Shivaji'", "heading: 'Chapter 1: The Birth - Swarajya under Chhatrapati Shivaji'"],
    ["heading: 'The Peshwa Era and Pan-Indian Expansion'", "heading: 'Chapter 2: The Imperial Zenith - The Peshwa Era and Pan-Indian Expansion'"],
    ["heading: 'Decline and Fall'", "heading: 'Chapter 3: The Death - Internal Fractures, Panipat, and the Fall'"],

    // British
    ["heading: 'Company Rule and Systematic Economic Devastation'", "heading: 'Chapter 1: The Birth of the Raj - Company Rule and Economic Devastation'"],
    ["heading: 'The Great Rebellion of 1857'", "heading: 'Chapter 2: The Boiling Point - The Great Rebellion of 1857'"],
    ["heading: 'Infrastructure, Modernization, and the Renaissance'", "heading: 'Chapter 3: The Final Decades - Infrastructure, Modernization, and the Renaissance'"],

    // Freedom
    ["heading: 'Early Nationalism, Extremism, and the Revolutionaries'", "heading: 'Chapter 1: The Birth of a Nation - Early Nationalism and Revolutionaries'"],
    ["heading: 'The Gandhian Era and Mass Mobilization'", "heading: 'Chapter 2: The Climax - The Gandhian Era and Mass Mobilization'"],
    ["heading: 'The Tragic Triumph: Freedom and Partition'", "heading: 'Chapter 3: The Culmination - The Tragic Triumph of Freedom and Partition'"]
];

for (const [oldStr, newStr] of replacements) {
    content = content.replace(oldStr, newStr);
}

fs.writeFileSync('./src/data/historyData.js', content, 'utf8');
console.log('Successfully updated historyData.js to Chapter style.');
