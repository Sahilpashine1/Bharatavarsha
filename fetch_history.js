import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map our internal era IDs to the exact Wikipedia article titles
const eraWikiMapping = {
    'earth': { title: 'History of Earth', period: 'c. 4.5 Billion BCE' },
    'life': { title: 'Abiogenesis', period: 'c. 3.5 Billion BCE' },
    'prehistoric': { title: 'South Asian Stone Age', period: 'c. 2 Million BCE - 2500 BCE' },
    'ivc': { title: 'Indus Valley Civilisation', period: 'c. 2500 - 1750 BCE' },
    'vedic': { title: 'Vedic period', period: 'c. 1500 - 500 BCE' },
    'mahajanapadas': { title: 'Mahajanapadas', period: 'c. 600 BCE' },
    'mauryan': { title: 'Maurya Empire', period: 'c. 322 BCE' },
    'gupta': { title: 'Gupta Empire', period: 'c. 320 CE' },
    'harsha': { title: 'Harsha', period: 'c. 606 CE' },
    'delhi': { title: 'Delhi Sultanate', period: 'c. 1206 CE' },
    'mughal': { title: 'Mughal Empire', period: 'c. 1526 CE' },
    'maratha': { title: 'Maratha Empire', period: 'c. 1674 CE' },
    'british': { title: 'British Raj', period: '1858 - 1947 CE' },
    'freedom': { title: 'Indian independence movement', period: '1885 - 1947 CE' },
};

async function fetchWikipediaExtract(title) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(title)}&format=json`;
    console.log(`[Fetching] ${title}...`);
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === '-1') {
            console.error(`Error: Article '${title}' not found on Wikipedia.`);
            return null;
        }

        return pages[pageId].extract;
    } catch (e) {
        console.error(`Network error fetching '${title}':`, e);
        return null;
    }
}

function parseWikipediaText(text, maxSections = 6) {
    // Wikipedia extracts look like:
    // Intro paragraph...
    //
    // == Heading 1 ==
    // Content...
    //
    // === Subheading ===
    // More content...

    const lines = text.split('\n');
    let intro = '';
    const sections = [];
    let currentHeading = null;
    let currentContent = [];

    // Simple heuristic: read until the first '==' line to get the intro.
    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        if (line.startsWith('==') && line.endsWith('==') && !line.startsWith('===')) {
            break; // First major heading found
        }
        if (line.length > 0) {
            intro += line + ' ';
        }
        i++;
    }

    // Now parse major headings (== Heading ==)
    while (i < lines.length) {
        let line = lines[i].trim();

        // Ignore structural/meta sections at the bottom
        if (line === '== See also ==' || line === '== References ==' || line === '== Further reading ==' || line === '== External links ==') {
            break;
        }

        if (line.startsWith('==') && line.endsWith('==') && !line.startsWith('===')) {
            // Found a new major heading. Save the previous one if it exists.
            if (currentHeading && currentContent.length > 0) {
                // Ignore empty or very short sections
                const contentStr = currentContent.join(' ').trim();
                // Filter out useless empty headings or single-line junk
                if (contentStr.length > 50) {
                    sections.push({
                        heading: currentHeading,
                        content: contentStr,
                        evidence: [] // Can't reliably pull this from raw text, leave empty for UI
                    });
                }
            }

            // Start new section
            // Remove '== ' and ' =='
            currentHeading = line.replace(/^==\s*|\s*==$/g, '');
            currentContent = [];
        } else if (line.startsWith('===') && line.endsWith('===')) {
            // Treat subheadings as bold text inside the current section content
            const subTitle = line.replace(/^===\s*|\s*===$/g, '');
            if (currentHeading) {
                // Append it as a bold indicator in text
                currentContent.push(`\n[ ${subTitle.toUpperCase()} ]\n`);
            }
        } else if (line.length > 10) {
            // Only add substantial lines, ignore whitespace
            if (currentHeading) {
                currentContent.push(line);
            }
        }

        i++;
    }

    // Push the final section
    if (currentHeading && currentContent.length > 0) {
        const contentStr = currentContent.join(' ').trim();
        if (contentStr.length > 50) {
            sections.push({
                heading: currentHeading,
                content: contentStr,
                evidence: []
            });
        }
    }

    // Clean up intro
    intro = intro.trim();
    // If intro is massive, truncate it slightly for the UI so it doesn't break layout
    if (intro.length > 800) {
        intro = intro.substring(0, 800) + '...';
    } else if (intro.length === 0) {
        intro = 'Extracted comprehensive historical archives regarding this era.';
    }

    // Slice the number of sections so the UI doesn't lag rendering 50 chapters
    return {
        intro,
        sections: sections.slice(0, maxSections)
    };
}

async function main() {
    console.log('Generating massive history encyclopedia from Wikipedia...\n');
    let generatedData = `// AUTO-GENERATED WIKIPEDIA HISTORY ARCHIVE\nexport const erasData = {\n`;

    for (const [id, meta] of Object.entries(eraWikiMapping)) {
        const rawText = await fetchWikipediaExtract(meta.title);

        let intro = '';
        let sections = [];

        if (rawText) {
            const parsed = parseWikipediaText(rawText);
            intro = parsed.intro;
            sections = parsed.sections;
            console.log(` -> Parsed ${sections.length} chapters for '${meta.title}'.`);
        } else {
            console.log(` -> Failed to parse '${meta.title}', falling back to empty template.`);
        }

        // Generate JSON structure for this era
        const eraObject = {
            title: meta.title,
            period: meta.period,
            intro: intro.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' '),
            sections: sections.map((s, idx) => ({
                heading: `Chapter ${idx + 1}: ${s.heading.replace(/"/g, '\\"')}`,
                // Need to carefully escape quotes and newlines for the JS output file
                content: s.content.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'),
                evidence: []
            })),
            references: [`Wikipedia: ${meta.title}`]
        };

        // If it's the IVC or Vedic era, preserve the map string from prior code
        if (id === 'ivc' || id === 'vedic') {
            eraObject.mapImage = '/assets/ancient_map.png';
        }

        // Stringify the object and append it
        // We use JSON.stringify but strip the outer brackets for our manual formatting
        generatedData += `    '${id}': ${JSON.stringify(eraObject, null, 4)},\n`;

        // Anti-rate-limit sleep
        await new Promise(r => setTimeout(r, 1000));
    }

    generatedData += `};\n\n`;
    generatedData += `// Fallback for undefined eras
export const getEraData = (id) => {
    if (erasData[id]) return erasData[id];
    return {
        title: 'Historical Era',
        period: 'Time Period Unknown',
        intro: \`Detailed historical records for \${id} are currently being archived and compiled by our historians.\`,
        sections: [],
        references: []
    }
};\n`;

    const outputPath = path.join(__dirname, 'src', 'data', 'historyData.js');
    fs.writeFileSync(outputPath, generatedData, 'utf-8');
    console.log(`\nSuccess! Wrote massive Wikipedia history dataset to ${outputPath}`);
}

main().catch(console.error);
