import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToOptimize = [
    'src/pages/StartJourney.jsx',
    'src/pages/Home.jsx',
    'src/pages/Maps.jsx',
    'src/pages/Characters.jsx',
    'src/pages/Battles.jsx',
    'src/pages/Bloodlines.jsx',
    'src/components/TimelineSlider.jsx',
    'src/components/FeatureTeasers.jsx',
    'src/components/Navbar.jsx'
];

filesToOptimize.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Speed up durations globally
    content = content.replace(/duration:\s*1(?!\d)/g, 'duration: 0.4');
    content = content.replace(/duration:\s*0\.8/g, 'duration: 0.3');
    content = content.replace(/duration:\s*0\.5/g, 'duration: 0.3');
    content = content.replace(/duration:\s*0\.6/g, 'duration: 0.3');
    // Stiffen spring animations
    content = content.replace(/stiffness:\s*50/g, 'stiffness: 300');

    fs.writeFileSync(filePath, content);
    console.log('Optimized', file);
});
