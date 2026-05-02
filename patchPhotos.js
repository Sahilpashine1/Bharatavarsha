import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\aman2\\.gemini\\antigravity\\brain\\3765701f-ac86-4867-8b03-1df0ca7f8148';
const publicDir = 'e:\\project\\public\\images\\portraits';

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Move files from brain to public and strip timestamp
const files = fs.readdirSync(brainDir);
files.forEach(file => {
    if (file.startsWith('portrait_') && file.endsWith('.png')) {
        // e.g. portrait_vashistha_1772452666599.png -> portrait_vashistha.png
        const base = file.split('_17')[0];
        const newName = `${base}.png`;
        fs.copyFileSync(path.join(brainDir, file), path.join(publicDir, newName));
        console.log(`Copied ${file} -> ${newName}`);
    }
});

// 2. Modify charactersData to point to new images
let content = fs.readFileSync('./src/data/charactersData.js', 'utf8');

const mapping = {
    'Vashistha': '/images/portraits/portrait_vashistha.png',
    'Gargi': '/images/portraits/portrait_gargi.png',
    'Maitreyi': '/images/portraits/portrait_maitreyi.png',
    'Gautama Buddha': '/images/portraits/portrait_gautama_buddha.png',
    'Megasthenes': '/images/portraits/portrait_megasthenes.png',
    'Varahamihira': '/images/portraits/portrait_varahamihira.png',
    'Kalidasa': '/images/portraits/portrait_kalidasa.png',
    'Rajendra Chola I': '/images/portraits/portrait_rajendra_chola_i.png',
    'Razia Sultan': '/images/portraits/portrait_razia_sultan.png',
    'Balban': '/images/portraits/portrait_balban.png',
    'Malik Kafur': '/images/portraits/portrait_malik_kafur.png',
    'Ibrahim Lodi': '/images/portraits/portrait_ibrahim_lodi.png',
    'Abul Fazl': '/images/portraits/portrait_abul_fazl.png',
    'Bajirao I': '/images/portraits/portrait_bajirao_i.png',
    'Nana Saheb': '/images/portraits/portrait_nana_saheb.png',
    'Maulana Azad': '/images/portraits/portrait_maulana_azad.png',
};

for (const [name, imgPath] of Object.entries(mapping)) {
    const searchString = `"name": "${name}"`;
    const index = content.indexOf(searchString);
    if (index !== -1) {
        let blockEnd = content.indexOf('},', index);
        if (blockEnd === -1) blockEnd = content.indexOf('}', index);

        let block = content.substring(index, blockEnd);
        if (block.includes(`"image": null`) || block.includes(`"image": ""`) || !block.includes(`"image":`)) {
            block = block.replace(/"image":\s*null/g, `"image": "${imgPath}"`);
            content = content.substring(0, index) + block + content.substring(blockEnd);
            console.log(`Updated image for ${name}`);
        }
    }
}

fs.writeFileSync('./src/data/charactersData.js', content);
console.log('charactersData.js updated successfully.');
