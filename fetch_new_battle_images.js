import fs from 'fs';

// Read existing images to know which ones need fetching
const raw = fs.readFileSync('./src/data/battleImages.js', 'utf8')
    .replace('export const battleImages = ', '').replace(/;\s*$/, '');
const existing = JSON.parse(raw);

// New battles - try multiple Wikipedia articles for each
const newBattles = [
    { id: 'battle_ten_kings', alts: ['Dasharajna', 'Rigveda', 'Battle_of_the_Ten_Kings'] },
    { id: 'alexander_indus', alts: ['Alexander_the_Great', 'Battle_of_the_Hydaspes', 'Achaemenid_Empire'] },
    { id: 'battle_sone_river', alts: ['Chandragupta_II', 'Gupta_Empire', 'Chandragupta_Vikramaditya'] },
    { id: 'battle_hunas', alts: ['Skandagupta', 'Huna_people', 'Kidarites'] },
    { id: 'battle_chalukya_arab', alts: ['Arab_invasion_of_India', 'Nagabhata_I', 'Gurjara-Pratihara'] },
    { id: 'battle_rashtrakuta_gurjara', alts: ['Rashtrakuta_dynasty', 'Tripartite_struggle', 'Gurjara-Pratihara'] },
    { id: 'battle_takkolam', alts: ['Battle_of_Takkolam', 'Rajaditya_I', 'Chola_dynasty'] },
    { id: 'battle_mahinda', alts: ['Rajaraja_I', 'Chola_conquest_of_Ceylon', 'Mahinda_V'] },
    { id: 'battle_srivijaya', alts: ['Rajendra_I', 'Chola%E2%80%93Srivijaya_war', 'Srivijaya'] },
    { id: 'battle_ranthambore', alts: ['Siege_of_Ranthambore', 'Hammiradeva', 'Alauddin_Khalji'] },
    { id: 'battle_mewar_sultanate', alts: ['Rana_Kumbha', 'Vijay_Stambha', 'Mewar'] },
    { id: 'battle_gogunda', alts: ['Maharana_Pratap', 'Battle_of_Haldighati', 'Akbar'] },
    { id: 'battle_tukaroi', alts: ['Battle_of_Tukaroi', 'Daud_Khan_Karrani', 'Todar_Mal'] },
    { id: 'battle_khurram_revolt', alts: ['Shah_Jahan', 'Nur_Jahan', 'Jahangir'] },
    { id: 'battle_samugarh', alts: ['Battle_of_Samugarh', 'Aurangzeb', 'Dara_Shikoh'] },
    { id: 'battle_sinhagad', alts: ['Battle_of_Sinhagad', 'Tanaji_Malusare', 'Sinhagad'] },
    { id: 'battle_udgir', alts: ['Battle_of_Udgir', 'Madhavrao_I', 'Vishwasrao'] },
    { id: 'battle_kharda', alts: ['Battle_of_Kharda', 'Nana_Fadnavis', 'Third_Anglo-Maratha_War'] },
    { id: 'battle_plassey', alts: ['Battle_of_Plassey', 'Robert_Clive', 'Mir_Jafar'] },
    { id: 'battle_first_mysore', alts: ['First_Anglo-Mysore_War', 'Hyder_Ali', 'Mysore_Kingdom'] },
    { id: 'battle_second_mysore', alts: ['Second_Anglo-Mysore_War', 'Hyder_Ali', 'Battle_of_Pollilur'] },
    { id: 'battle_third_mysore', alts: ['Third_Anglo-Mysore_War', 'Tipu_Sultan', 'Seringapatam'] },
    { id: 'battle_laswari', alts: ['Battle_of_Laswari', 'Gerard_Lake,_1st_Viscount_Lake', 'Second_Anglo-Maratha_War'] },
    { id: 'battle_delhi_1857', alts: ['Siege_of_Delhi', 'Bahadur_Shah_II', 'Indian_Rebellion_of_1857'] },
    { id: 'battle_cawnpore', alts: ['Siege_of_Cawnpore', 'Nana_Sahib', 'Kanpur_massacre'] },
    { id: 'battle_gwalior_1858', alts: ['Battle_of_Gwalior_(1858)', 'Lakshmi_Bai', 'Tantia_Tope'] },
    { id: 'battle_sangli_revolt', alts: ['Vellore_mutiny', 'Tipu_Sultan', 'Vellore_Fort'] },
    { id: 'battle_paika_rebellion', alts: ['Paika_Rebellion', 'Jagabandhu', 'Odisha'] },
    { id: 'battle_sanyasi_rebellion', alts: ['Fakir_and_Sannyasi_Rebellion', 'Anandamath', 'Majnu_Shah'] },
    { id: 'battle_gallipoli_india', alts: ['Indian_Corps_(World_War_I)', 'Western_Front_(World_War_I)', 'Mir_Dast'] },
    { id: 'battle_mesopotamia_kut', alts: ['Siege_of_Kut', 'Charles_Townshend', 'Mesopotamia_campaign'] },
];

async function fetchBest(alts) {
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
        } catch { /* continue */ }
    }
    return null;
}

async function main() {
    let updated = 0;
    for (const { id, alts } of newBattles) {
        if (existing[id]) { console.log(`  [skip] ${id}`); continue; }
        console.log(`Fetching: ${id}...`);
        const img = await fetchBest(alts);
        if (img) {
            existing[id] = img;
            console.log(`  ✓ ${img.slice(0, 70)}`);
            updated++;
        } else {
            console.log(`  ✗ none found`);
            existing[id] = null;
        }
        await new Promise(r => setTimeout(r, 200));
    }

    fs.writeFileSync('./src/data/battleImages.js',
        `export const battleImages = ${JSON.stringify(existing, null, 2)};\n`, 'utf8');
    const total = Object.values(existing).filter(Boolean).length;
    console.log(`\nDone! Updated ${updated} images. ${total}/${Object.keys(existing).length} battles have images.`);
}
main();
