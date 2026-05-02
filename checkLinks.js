import fs from 'fs';
import { charactersData } from './src/data/charactersData.js';
import axios from 'axios';

async function checkLinks() {
    console.log(`Checking ${charactersData.length} characters for broken images...`);
    const broken = [];

    for (const char of charactersData) {
        if (char.image && char.image.startsWith('http')) {
            try {
                // Just do an OPTIONS or HEAD request to see if it's 200
                await axios.head(char.image, {
                    timeout: 5000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                });
                process.stdout.write('.');
            } catch (error) {
                // If HEAD fails, try GET just in case HEAD is blocked
                try {
                    await axios.get(char.image, {
                        timeout: 5000,
                        responseType: 'stream',
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                    });
                    process.stdout.write('.');
                } catch (e) {
                    process.stdout.write('X');
                    broken.push({ name: char.name, url: char.image, error: e.message });
                }
            }
        }
    }

    console.log('\n\n--- Broken Images ---');
    console.log(JSON.stringify(broken, null, 2));

    // Save to temp file for easy viewing
    fs.writeFileSync('./broken_images.json', JSON.stringify(broken, null, 2));
}

checkLinks();
