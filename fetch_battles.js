import fs from 'fs';

// Wikipedia article titles mapped to battle IDs for image fetching
const battlesList = [
    { id: 'hydaspes', wiki: 'Battle_of_the_Hydaspes' },
    { id: 'kalinga', wiki: 'Kalinga_War' },
    { id: 'seleucid_mauryan', wiki: 'Seleucid%E2%80%93Mauryan_war' },
    { id: 'samudragupta_campaigns', wiki: 'Samudragupta' },
    { id: 'chalukya_pallava', wiki: 'Chalukya%E2%80%93Pallava_Wars' },
    { id: 'tarain_first', wiki: 'First_Battle_of_Tarain' },
    { id: 'tarain_second', wiki: 'Second_Battle_of_Tarain' },
    { id: 'chandawar', wiki: 'Battle_of_Chandawar' },
    { id: 'mongol_delhi', wiki: 'Mongol_invasions_of_India' },
    { id: 'warangal', wiki: 'Siege_of_Warangal_(1309)' },
    { id: 'talikota', wiki: 'Battle_of_Talikota' },
    { id: 'panipat_first', wiki: 'First_Battle_of_Panipat' },
    { id: 'khanwa', wiki: 'Battle_of_Khanwa' },
    { id: 'panipat_second', wiki: 'Second_Battle_of_Panipat' },
    { id: 'haldighati', wiki: 'Battle_of_Haldighati' },
    { id: 'saraighat', wiki: 'Battle_of_Saraighat' },
    { id: 'purandar', wiki: 'Treaty_of_Purandar' },
    { id: 'pratapgad', wiki: 'Battle_of_Pratapgad' },
    { id: 'kolhapur_battles', wiki: 'Battle_of_Kolhapur' },
    { id: 'panipat_third', wiki: 'Third_Battle_of_Panipat' },
    { id: 'bhopal_battle', wiki: 'Battle_of_Bhopal_(1737)' },
    { id: 'pollilur', wiki: 'Battle_of_Pollilur' },
    { id: 'seringapatam', wiki: 'Siege_of_Seringapatam_(1799)' },
    { id: 'sobraon', wiki: 'Battle_of_Sobraon' },
    { id: 'gujrat_1849', wiki: 'Battle_of_Gujrat' },
    { id: 'meerut_uprising', wiki: 'Meerut_revolt' },
    { id: 'siege_lucknow', wiki: 'Siege_of_Lucknow' },
    { id: 'jhansi_1858', wiki: 'Siege_of_Jhansi' },
    { id: 'haifa_1918', wiki: 'Battle_of_Haifa_(1918)' },
    { id: 'kohima_imphal', wiki: 'Battle_of_Kohima' },
    { id: 'naval_mutiny_1946', wiki: 'Royal_Indian_Navy_mutiny' },
    // New battles
    { id: 'ghazni_somnath', wiki: 'Raids_on_Somnath' },
    { id: 'battle_buxar', wiki: 'Battle_of_Buxar' },
    { id: 'third_mysore', wiki: 'Third_Anglo-Mysore_War' },
    { id: 'assaye', wiki: 'Battle_of_Assaye' },
    { id: 'chillianwala', wiki: 'Battle_of_Chillianwala' },
    { id: 'bhima_koregaon', wiki: 'Battle_of_Bhima_Koregaon' },
    { id: 'aliwal', wiki: 'Battle_of_Aliwal' },
    { id: 'wandiwash', wiki: 'Battle_of_Wandiwash' },
    { id: 'ahmednagar', wiki: 'Siege_of_Ahmednagar_(1600)' },
    { id: 'battle_palkhed', wiki: 'Battle_of_Palkhed' },
    { id: 'battle_ambur', wiki: 'Battle_of_Ambur' },
    { id: 'battle_adyar', wiki: 'Battle_of_Adyar' },
    { id: 'battle_delhi_1738', wiki: 'Nadir_Shah%27s_invasion_of_India' },
    { id: 'battle_basra', wiki: 'Mysore_Rockets' },
    { id: 'chittor_siege_1303', wiki: 'Siege_of_Chittorgarh_(1303)' },
    { id: 'chittor_siege_1568', wiki: 'Siege_of_Chittorgarh_(1567%E2%80%9368)' },
    { id: 'battle_chausa', wiki: 'Battle_of_Chausa' },
    { id: 'battle_kannauj', wiki: 'Battle_of_Kannauj' },
];

async function fetchBattleImages() {
    const imageMap = {};

    for (let i = 0; i < battlesList.length; i++) {
        const { id, wiki } = battlesList[i];
        console.log(`Fetching image ${i + 1}/${battlesList.length}: ${wiki}`);
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=800&titles=${wiki}&format=json&origin=*`;
            const res = await fetch(url);
            const data = await res.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];
            const image = (page && page.thumbnail) ? page.thumbnail.source : null;
            imageMap[id] = image;
            if (image) console.log(`  ✓ Got image: ${image.substring(0, 60)}...`);
            else console.log(`  ✗ No image found`);
            await new Promise(r => setTimeout(r, 150));
        } catch (e) {
            console.log(`  Error: ${e.message}`);
            imageMap[id] = null;
        }
    }

    const output = `export const battleImages = ${JSON.stringify(imageMap, null, 2)};\n`;
    fs.writeFileSync('./src/data/battleImages.js', output, 'utf8');
    console.log('\nDone! Generated src/data/battleImages.js');
}

fetchBattleImages();
