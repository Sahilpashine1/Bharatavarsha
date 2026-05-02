import fs from 'fs';

let content = fs.readFileSync('./src/data/battlesData.js', 'utf8');

// The bug: after the naval_mutiny_1946 entry that closes with `}` on line 365,
// the next block starts directly on line 368 with `{` — missing a comma.
// Fix: Replace `    }\n\n\n    // ─── ADDITIONAL` with `    },\n\n\n    // ─── ADDITIONAL`
const fixed = content.replace(
    /\}\r?\n\r?\n\r?\n    \/\/ ─── ADDITIONAL BATTLES/,
    '},\n\n\n    // ─── ADDITIONAL BATTLES'
);

if (fixed === content) {
    // Try alternative pattern - just find the missing comma before a blank line + comment
    console.log('Primary pattern not found, trying alternative...');
    // Find the specific spot: closing } followed by blank lines then //
    const fixed2 = content.replace(
        /(\}\s*\n)(\s*\n\s*\/\/ ─── ADDITIONAL BATTLES)/,
        '},\n\n\n    // ─── ADDITIONAL BATTLES'
    );
    if (fixed2 === content) {
        console.log('ERROR: Could not find pattern to fix. Dumping lines 362-372:');
        const lines = content.split('\n');
        for (let i = 361; i <= 371 && i < lines.length; i++) {
            console.log(`${i + 1}: ${JSON.stringify(lines[i])}`);
        }
    } else {
        fs.writeFileSync('./src/data/battlesData.js', fixed2, 'utf8');
        console.log('Fixed with alternative pattern!');
    }
} else {
    fs.writeFileSync('./src/data/battlesData.js', fixed, 'utf8');
    console.log('Fixed successfully!');
}

// Verify by checking for parse errors
try {
    const lines = fs.readFileSync('./src/data/battlesData.js', 'utf8').split('\n');
    console.log('Total lines:', lines.length);
    // Count id: " occurrences to verify battles all present
    const count = (fs.readFileSync('./src/data/battlesData.js', 'utf8').match(/id: "/g) || []).length;
    console.log('Total battle entries:', count);
} catch (e) {
    console.error('Error reading fixed file:', e.message);
}
