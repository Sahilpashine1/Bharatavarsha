import fs from 'fs';

let content = fs.readFileSync('./src/data/battlesData.js', 'utf8');

// Find all instances where a closing object brace } is NOT followed by comma or ] 
// Specifically: `}\n\n    // ─── EXPANDED` needs to be `},\n\n    // ─── EXPANDED`
const fixed = content
    .replace(/\}\r?\n(\r?\n\s*\/\/ ─── EXPANDED BATTLES)/, '},\n$1')
    .replace(/\}\r?\n(\r?\n\s*\/\/ ─── ADDITIONAL BATTLES)/, '},\n$1');

if (fixed === content) {
    console.log('Pattern not matched. Checking raw bytes around separation point...');
    // More aggressive: find every } before an EXPANDED comment
    const lines = content.split('\n');
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// ─── EXPANDED BATTLES') || lines[i].includes('// ─── ADDITIONAL BATTLES')) {
            // Find the last non-empty line before this
            let j = i - 1;
            while (j >= 0 && lines[j].trim() === '') j--;
            if (lines[j].trim() === '}') {
                console.log(`Found missing comma at line ${j + 1}: "${lines[j]}"`);
                lines[j] = lines[j].replace(/}(\s*)$/, '},$1');
                found = true;
            }
        }
    }
    if (found) {
        const result = lines.join('\n');
        fs.writeFileSync('./src/data/battlesData.js', result, 'utf8');
        console.log('Fixed!');
    } else {
        console.log('Could not find the issue automatically.');
    }
} else {
    fs.writeFileSync('./src/data/battlesData.js', fixed, 'utf8');
    console.log('Fixed with regex!');
}

// Count battles
const cnt = (fs.readFileSync('./src/data/battlesData.js', 'utf8').match(/id: "/g) || []).length;
console.log('Total battles:', cnt);
