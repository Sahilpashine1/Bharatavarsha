import fs from 'fs';

let content = fs.readFileSync('./src/data/battlesData.js', 'utf8');

// Verify current battles count
const existingCount = (content.match(/id: "/g) || []).length;
console.log('Existing battles:', existingCount);

// Only append if new battles not already added
if (content.includes('chittor_siege_1303')) {
    console.log('New battles already appended. Skipping.');
    process.exit(0);
}

// Remove closing ];
content = content.trimEnd();
if (content.endsWith('];')) content = content.slice(0, -2);
else if (content.endsWith(']')) content = content.slice(0, -1);

const additions = [
    {
        id: 'chittor_siege_1303', name: 'Siege of Chittorgarh (1303)',
        date: '1303 CE', location: 'Chittorgarh Fort, Rajasthan',
        eraId: 'delhi', era: 'Delhi Sultanate',
        characters: ['Alauddin Khalji', 'Rana Ratan Singh', 'Padmavati (Padmini)', 'Gora and Badal'],
        details: 'Alauddin Khalji besieged the mighty Chittorgarh fort for months against heroic Rajput resistance. When the fort fell, Queen Padmavati and thousands of women performed Jauhar (mass self-immolation) to avoid capture and dishonor. Surviving Rajput warriors donned saffron robes and charged to their deaths in the final suicidal Shaka assault, fighting to the last man.',
        impact: 'Became the defining symbol of Rajput sacrifice, immortalized in Malik Muhammad Jayasi\'s epic Padmavat. Though Alauddin captured the fort, the Rajput spirit of resistance could not be extinguished — Chittor would be retaken and defended heroically multiple times in subsequent centuries.'
    },
    {
        id: 'chittor_siege_1568', name: 'Siege of Chittorgarh (1567-68)',
        date: 'October 1567 to February 1568 CE', location: 'Chittorgarh Fort, Rajasthan',
        eraId: 'mughal', era: 'Mughal Empire',
        characters: ['Emperor Akbar', 'Rana Udai Singh II', 'Jaimal Rathore (defender)', 'Patta Sisodia (defender)'],
        details: 'Akbar besieged Chittorgarh defended heroically by Jaimal and Patta after the Rana evacuated. Akbar reportedly shot Jaimal himself with a musket while Jaimal directed wall repairs at night. When walls were breached, Jauhar was performed again. Akbar ordered a massacre of 30,000 civilians in his rage — an act he later deeply regretted.',
        impact: 'Akbar erected stone statues of the fallen heroes Jaimal and Patta at the gates of Agra Fort — a remarkable gesture of honor toward defeated enemies. The event drove Akbar toward his later famous policies of religious tolerance and Rajput reconciliation.'
    },
    {
        id: 'ghazni_somnath', name: 'Raids on Somnath by Mahmud of Ghazni',
        date: '1025 CE', location: 'Somnath Temple, Gujarat',
        eraId: 'delhi', era: 'Pre-Sultanate Invasions',
        characters: ['Mahmud of Ghazni', 'King Bhimadeva I (Chaulukya)', 'Rai Ganda'],
        details: 'The most infamous of Mahmud of Ghazni\'s seventeen raids into India. The sacred Somnath temple was extraordinarily wealthy, guarded by 50,000 soldiers. After defeating Rajput resistance in open battle, Mahmud stormed the temple, killed thousands of devotees, and looted a treasury reportedly requiring 10,000 camels to carry back to Ghazni. The legendary Shivalinga was destroyed.',
        impact: 'The raid became one of the most enduringly traumatic events in Hindu religious memory. It exposed the political fragmentation of northern India that would enable later Ghurid conquest. Modern historians debate whether Persian chronicles significantly embellished the account to glorify Mahmud as an Islamic champion.'
    },
    {
        id: 'battle_chausa', name: 'Battle of Chausa',
        date: '26 June 1539 CE', location: 'Chausa, Bihar (Ganges)',
        eraId: 'mughal', era: 'Mughal Empire and Sur Era',
        characters: ['Sher Shah Suri', 'Emperor Humayun', 'Bairam Khan'],
        details: 'One of the most humiliating defeats of Mughal Emperor Humayun. Sher Shah Suri lured Humayun\'s army into a trap by feigning months of peace negotiations while the Ganges flooded — trapping the Mughal army. He then launched a devastating pre-dawn surprise attack. Humayun fled across the swollen river, reportedly saved by a water-carrier named Nizam who inflated a leather water-skin as a float.',
        impact: 'Humayun was driven from India entirely and spent fifteen years in exile in Persia. Sher Shah Suri\'s brief rule (1540-1545) produced the Grand Trunk Road, the silver Rupee, and an efficient postal system — reforms the Mughals later adopted upon their triumphant return.'
    },
    {
        id: 'battle_buxar', name: 'Battle of Buxar',
        date: '22 October 1764 CE', location: 'Buxar, Bihar',
        eraId: 'british', era: 'British East India Company',
        characters: ['General Hector Munro (British)', 'Mir Qasim (Bengal)', 'Shuja-ud-Daula (Awadh)', 'Shah Alam II (Mughal Emperor)'],
        details: 'Far more significant than Plassey, Buxar pitted the British EIC against a grand alliance of three major Indian powers — the Nawab of Bengal, the Nawab of Awadh, and the Mughal Emperor — with over 40,000 troops combined. General Hector Munro\'s disciplined 7,000-strong EIC army won decisively in under two hours of intense fighting.',
        impact: 'The Treaty of Allahabad (1765) granted the EIC Diwani rights over Bengal, Bihar, and Orissa — transforming traders into a sovereign territorial power. Robert Clive called it the richest prize ever obtained in any war. It gave Britain the financial engine to conquer the rest of India.'
    },
    {
        id: 'battle_wandiwash', name: 'Battle of Wandiwash',
        date: '22 January 1760 CE', location: 'Wandiwash, Tamil Nadu',
        eraId: 'british', era: 'British East India Company',
        characters: ['Sir Eyre Coote (British)', 'Marquis de Lally (French)'],
        details: 'The decisive battle that ended French imperial ambitions in India forever. British forces under Eyre Coote defeated the French under Comte de Lally in the Carnatic region. A magazine explosion destroyed French artillery at a critical moment. Pondicherry was subsequently captured and razed to prevent any future French foothold.',
        impact: 'Permanently ended French military presence in India, leaving Britain the sole European power on the subcontinent. A key dimension of the global Seven Years\' War, this victory established British global supremacy in the East.'
    },
    {
        id: 'battle_assaye', name: 'Battle of Assaye',
        date: '23 September 1803 CE', location: 'Assaye, Maharashtra',
        eraId: 'british', era: 'Second Anglo-Maratha War',
        characters: ['General Arthur Wellesley (Duke of Wellington)', 'Daulat Rao Scindia', 'Raghuji II Bhonsle'],
        details: 'Wellesley called it the bloodiest battle for the numbers engaged he ever fought. His 10,000 troops attacked 40,000 entrenched Marathas with 100 artillery guns. He crossed an unguarded ford for a flanking surprise attack and had two horses shot from under him, suffering nearly 30% casualties before winning a hard-fought victory.',
        impact: 'Broke the Maratha confederacy\'s military resistance in the Deccan. Wellesley considered Assaye his finest military achievement — even above his more famous victory over Napoleon at Waterloo in 1815.'
    },
    {
        id: 'battle_palkhed', name: 'Battle of Palkhed',
        date: '28 February 1728 CE', location: 'Palkhed, Maharashtra',
        eraId: 'maratha', era: 'Maratha Empire',
        characters: ['Peshwa Baji Rao I', 'Nizam-ul-Mulk Asaf Jah I'],
        details: 'Considered the finest example of Maratha strategic maneuver warfare. Baji Rao outmaneuvered the Nizam\'s vastly larger army through lightning cavalry movements — severing supply lines, capturing food depots, and completely encircling the enemy force in open terrain without a major pitched battle. The Nizam, starving and helpless, signed the humiliating Treaty of Mungi Shegaon.',
        impact: 'Confirmed Maratha supremacy over the Deccan. Studied in military academies as a masterclass in mobile encirclement strategy, often compared to Napoleon\'s brilliant Ulm campaign (1805) where an Austrian army was similarly surrounded and forced to surrender without a major battle.'
    },
    {
        id: 'battle_bhima_koregaon', name: 'Battle of Bhima-Koregaon',
        date: '1 January 1818 CE', location: 'Bhima-Koregaon, Pune, Maharashtra',
        eraId: 'british', era: 'Third Anglo-Maratha War',
        characters: ['Captain Francis Staunton (British-Mahar force)', 'Peshwa Baji Rao II', 'Ganpat Rao'],
        details: 'A small British force of 834 soldiers — mostly Mahar community soldiers who were oppressed under the Peshwa\'s caste hierarchy — withstood relentless attacks from 28,000 Peshwa forces for 12 desperate hours at Koregaon, repelling repeated cavalry charges through ferocious musket-fire before the Peshwa forces withdrew with massive casualties.',
        impact: 'Holds profound social significance: for Dr. B.R. Ambedkar and the Dalit community, it represents courage against caste oppression. Every January 1st, millions of Dalits pilgrimage to the Koregaon victory pillar — one of the most politically charged commemorations in modern India.'
    },
    {
        id: 'nadir_shah_delhi', name: 'Sack of Delhi by Nadir Shah',
        date: 'March 1739 CE', location: 'Delhi, Mughal Empire',
        eraId: 'mughal', era: 'Decline of Mughal Empire',
        characters: ['Nadir Shah (Persian Emperor)', 'Muhammad Shah Rangila (Mughal Emperor)', 'Nizam-ul-Mulk'],
        details: 'The most catastrophic plunder of a city in Indian history. After defeating the Mughal army at Karnal, Nadir Shah marched to Delhi. A street brawl triggered the Qatl-e-Aam (general massacre order) killing an estimated 20,000-30,000 Delhi residents in a single day. The city was stripped for weeks. Nadir Shah took the Peacock Throne, the Koh-i-Noor diamond, and an estimated 100 million Rupees in treasure.',
        impact: 'The looted wealth was so vast Nadir Shah suspended Persian taxation for three full years. The raid destroyed the Mughal state\'s financial credibility and is considered the decisive event marking the formal end of the Mughal Empire as a major power — creating the vacuum the Marathas and later the British would fill.'
    }
];

let newContent = '\n\n    // ─── ADDITIONAL BATTLES ─────────────────────────────────────────────────\n';

for (const b of additions) {
    const chars = JSON.stringify(b.characters);
    newContent += `    {\n`;
    newContent += `        id: "${b.id}",\n`;
    newContent += `        name: "${b.name}",\n`;
    newContent += `        date: "${b.date}",\n`;
    newContent += `        location: "${b.location}",\n`;
    newContent += `        eraId: "${b.eraId}",\n`;
    newContent += `        era: "${b.era}",\n`;
    newContent += `        characters: ${chars},\n`;
    newContent += `        details: ${JSON.stringify(b.details)},\n`;
    newContent += `        impact: ${JSON.stringify(b.impact)}\n`;
    newContent += `    },\n`;
}

// Remove trailing comma from last entry
newContent = newContent.trimEnd();
if (newContent.endsWith(',')) newContent = newContent.slice(0, -1);

content = content + newContent + '\n];\n';
fs.writeFileSync('./src/data/battlesData.js', content, 'utf8');

const finalCount = (content.match(/id: "/g) || []).length;
console.log('Done! Total battles:', finalCount);
