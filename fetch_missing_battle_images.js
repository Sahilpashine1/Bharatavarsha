import fs from 'fs';

// Enhanced search: For battles whose images are null, try multiple alternate Wikipedia pages
const nullBattles = [
    { id: 'seleucid_mauryan', alts: ['Chandragupta_Maurya', 'Seleucid%E2%80%93Mauryan_war', 'Bindusara'] },
    { id: 'chalukya_pallava', alts: ['Pulakesi_II', 'Narasimhavarman_I', 'Chalukya_dynasty'] },
    { id: 'tarain_first', alts: ['Prithviraj_Chauhan', 'Muhammad_of_Ghor', 'Battle_of_Tarain'] },
    { id: 'chandawar', alts: ['Ghuri_dynasty', 'Jaichand', 'Qutb_al-Din_Aibak'] },
    { id: 'mongol_delhi', alts: ['Alauddin_Khalji', 'Mongol_invasions_of_India', 'Zafar_Khan_(general)'] },
    { id: 'warangal', alts: ['Kakatiya_dynasty', 'Rudrama_Devi', 'Malik_Kafur'] },
    { id: 'purandar', alts: ['Shivaji', 'Treaty_of_Purandar_(1665)', 'Mirza_Raja_Jai_Singh_I'] },
    { id: 'pratapgad', alts: ['Battle_of_Pratapgad', 'Afzal_Khan_(general)', 'Pratapgad'] },
    { id: 'kolhapur_battles', alts: ['Kolhapur', 'Shivaji', 'Adilshahi'] },
    { id: 'bhopal_battle', alts: ['Battle_of_Bhopal_(1737)', 'Bajirao', 'Nizam_of_Hyderabad'] },
    { id: 'pollilur', alts: ['Battle_of_Pollilur', 'Hyder_Ali', 'Tipu_Sultan'] },
    { id: 'meerut_uprising', alts: ['Indian_Rebellion_of_1857', 'Mangal_Pandey', 'Sepoy_mutiny'] },
    { id: 'ghazni_somnath', alts: ['Mahmud_of_Ghazni', 'Somnath_temple', 'Ghaznavid_dynasty'] },
    { id: 'battle_bhima_koregaon', alts: ['Battle_of_Bhima_Koregaon', 'Bahut_Maha', 'Mahar_people'] },
    { id: 'battle_palkhed', alts: ['Battle_of_Palkhed', 'Bajirao', 'Peshwa'] },
    { id: 'chittor_siege_1568', alts: ['Siege_of_Chittorgarh_(1567%E2%80%9368)', 'Akbar', 'Jaimal_and_Patta'] },
    { id: 'battle_chausa', alts: ['Battle_of_Chausa', 'Sher_Shah_Suri', 'Humayun'] },
    { id: 'nadir_shah_delhi', alts: ['Nader_Shah', 'Sack_of_Delhi_(1739)', 'Battle_of_Karnal_(1739)'] },
    { id: 'battle_palkhed', alts: ['Bajirao', 'Maratha_Empire', 'Peshwa'] },
    { id: 'battle_buxar', alts: ['Battle_of_Buxar', 'Hector_Munro', 'East_India_Company'] },
    { id: 'battle_assaye', alts: ['Battle_of_Assaye', 'Arthur_Wellesley,_1st_Duke_of_Wellington', 'Second_Anglo-Maratha_War'] },
];

async function fetchBestImage(alts) {
    for (const title of alts) {
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=800&titles=${title}&format=json&origin=*`;
            const res = await fetch(url);
            const data = await res.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const thumb = pages[pageId]?.thumbnail?.source;
            if (thumb) return thumb;
            await new Promise(r => setTimeout(r, 100));
        } catch (e) { /* continue */ }
    }
    return null;
}

async function main() {
    // Read existing images
    const existing = JSON.parse(
        fs.readFileSync('./src/data/battleImages.js', 'utf8')
            .replace('export const battleImages = ', '')
            .replace(/;\s*$/, '')
    );

    let updated = 0;
    for (const { id, alts } of nullBattles) {
        if (existing[id]) {
            console.log(`  [skip] ${id} already has image`);
            continue;
        }
        console.log(`Searching for: ${id}...`);
        const img = await fetchBestImage(alts);
        if (img) {
            existing[id] = img;
            console.log(`  ✓ Found: ${img.substring(0, 70)}`);
            updated++;
        } else {
            console.log(`  ✗ No image found for ${id}`);
        }
        await new Promise(r => setTimeout(r, 200));
    }

    const output = `export const battleImages = ${JSON.stringify(existing, null, 2)};\n`;
    fs.writeFileSync('./src/data/battleImages.js', output, 'utf8');
    console.log(`\nDone! Updated ${updated} battle images.`);
}

main();
