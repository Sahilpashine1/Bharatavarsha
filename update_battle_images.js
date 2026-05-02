import fs from 'fs';

// Read current battleImages.js
const raw = fs.readFileSync('./src/data/battleImages.js', 'utf8')
    .replace('export const battleImages = ', '')
    .replace(/;\s*$/, '');

const images = JSON.parse(raw);

// Update the 3 AI-generated images to use local public paths
images['chandawar'] = '/battles/battle_chandawar.png';
images['battle_bhima_koregaon'] = '/battles/battle_bhima_koregaon.png';
images['seleucid_mauryan'] = '/battles/battle_seleucid_mauryan.png';

const output = `export const battleImages = ${JSON.stringify(images, null, 2)};\n`;
fs.writeFileSync('./src/data/battleImages.js', output, 'utf8');

const totalWithImages = Object.values(images).filter(v => v !== null).length;
const total = Object.keys(images).length;
console.log(`Done! ${totalWithImages}/${total} battles now have images.`);
