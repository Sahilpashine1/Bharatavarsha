import fs from 'fs';

const input = `
Vashistha|vedic|Vedic Period|Sage|Vashistha
Vishwamitra|vedic|Vedic Period|Sage|Vishvamitra
Yajnavalkya|vedic|Later Vedic|Philosopher|Yajnavalkya
Gargi|vedic|Later Vedic|Philosopher|Gargi Vachaknavi
Maitreyi|vedic|Later Vedic|Philosopher|Maitreyi
Panini|mahajanapadas|5th–4th BCE|Grammarian|Pāṇini
Patanjali|mahajanapadas|2nd BCE|Scholar|Patanjali
Charaka|gupta|Ancient|Physician|Charaka
Sushruta|gupta|Ancient|Surgeon|Sushruta
Kapila|vedic|Ancient|Philosopher|Kapila
Gautama Buddha|mahajanapadas|6th BCE|Religious Founder|Gautama Buddha
Mahavira|mahajanapadas|6th BCE|Religious Founder|Mahavira
Bimbisara|mahajanapadas|Magadha|King|Bimbisara
Ajatashatru|mahajanapadas|Magadha|King|Ajatashatru
Prasenajit|mahajanapadas|Kosala|King|Pasenadi
Alexander|mahajanapadas|4th BCE|Invader|Alexander the Great
Seleucus Nicator|mahajanapadas|4th BCE|Greek Ruler|Seleucus I Nicator
Chandragupta Maurya|mauryan|Mauryan|Emperor|Chandragupta Maurya
Chanakya|mauryan|Mauryan|Minister|Chanakya
Bindusara|mauryan|Mauryan|Emperor|Bindusara
Ashoka|mauryan|Mauryan|Emperor|Ashoka
Megasthenes|mauryan|Mauryan|Ambassador|Megasthenes
Pushyamitra Shunga|mauryan|Shunga|King|Pushyamitra Shunga
Gautamiputra Satakarni|mauryan|Satavahana|King|Gautamiputra Satakarni
Menander|mauryan|Indo-Greek|King|Menander I
Kanishka|gupta|Kushan|Emperor|Kanishka
Rudradaman I|gupta|Western Kshatrapa|King|Rudradaman I
Chandragupta I|gupta|Gupta|King|Chandragupta I
Samudragupta|gupta|Gupta|Emperor|Samudragupta
Chandragupta II|gupta|Gupta|Emperor|Chandragupta II
Aryabhata|gupta|Gupta|Scientist|Aryabhata
Varahamihira|gupta|Gupta|Astronomer|Varāhamihira
Kalidasa|gupta|Gupta|Poet|Kālidāsa
Faxian|gupta|Gupta|Traveller|Faxian
Harshavardhana|gupta|7th CE|King|Harsha
Pulakeshin II|gupta|Chalukya|King|Pulakeshin II
Rajaraja Chola I|delhi|Chola|King|Rajaraja I
Rajendra Chola I|delhi|Chola|King|Rajendra Chola I
Krishnadevaraya|delhi|Vijayanagara|King|Krishnadevaraya
Adi Shankaracharya|gupta|8th CE|Philosopher|Adi Shankara
Ramanujacharya|delhi|Medieval|Philosopher|Ramanuja
Basavanna|delhi|12th CE|Reformer|Basava
Prithviraj Chauhan|delhi|Rajput|King|Prithviraj Chauhan
Qutb-ud-din Aibak|delhi|Slave Dynasty|Sultan|Qutb ud-Din Aibak
Iltutmish|delhi|Slave Dynasty|Sultan|Iltutmish
Razia Sultan|delhi|Slave Dynasty|Sultan|Razia Sultana
Balban|delhi|Slave Dynasty|Sultan|Ghiyas ud din Balban
Alauddin Khilji|delhi|Khilji|Sultan|Alauddin Khalji
Malik Kafur|delhi|Khilji|General|Malik Kafur
Muhammad bin Tughlaq|delhi|Tughlaq|Sultan|Muhammad bin Tughluq
Firoz Shah Tughlaq|delhi|Tughlaq|Sultan|Firuz Shah Tughlaq
Ibrahim Lodi|delhi|Lodi|Sultan|Ibrahim Lodi
Sher Shah Suri|mughal|Sur Empire|Ruler|Sher Shah Suri
Babur|mughal|Mughal|Founder|Babur
Humayun|mughal|Mughal|Emperor|Humayun
Akbar|mughal|Mughal|Emperor|Akbar
Birbal|mughal|Mughal|Courtier|Birbal
Abul Fazl|mughal|Mughal|Historian|Abu'l-Fazl ibn Mubarak
Todar Mal|mughal|Mughal|Finance Minister|Todar Mal
Jahangir|mughal|Mughal|Emperor|Jahangir
Nur Jahan|mughal|Mughal|Influencer|Nur Jahan
Shah Jahan|mughal|Mughal|Emperor|Shah Jahan
Aurangzeb|mughal|Mughal|Emperor|Aurangzeb
Dara Shikoh|mughal|Mughal|Prince|Dara Shikoh
Bahadur Shah Zafar|british|Mughal|Last Emperor|Bahadur Shah Zafar
Shivaji Maharaj|maratha|Maratha|Founder|Shivaji
Sambhaji|maratha|Maratha|King|Sambhaji
Tarabai|maratha|Maratha|Queen|Tarabai
Bajirao I|maratha|Maratha|Peshwa|Baji Rao I
Madhavrao Peshwa|maratha|Maratha|Peshwa|Madhavrao I
Nana Phadnavis|maratha|Maratha|Statesman|Nana Fadnavis
Guru Nanak|mughal|Sikh|Founder|Guru Nanak
Guru Gobind Singh|mughal|Sikh|Leader|Guru Gobind Singh
Ranjit Singh|british|Sikh Empire|Maharaja|Ranjit Singh
Lachit Borphukan|mughal|Ahom|Commander|Lachit Borphukan
Hyder Ali|british|Mysore|Ruler|Hyder Ali
Tipu Sultan|british|Mysore|Ruler|Tipu Sultan
Robert Clive|british|British|Governor|Robert Clive
Warren Hastings|british|British|Governor General|Warren Hastings
Lord Cornwallis|british|British|Administrator|Charles Cornwallis, 1st Marquess Cornwallis
Lord Wellesley|british|British|Governor General|Richard Wellesley, 1st Marquess Wellesley
Lord Dalhousie|british|British|Governor General|James Broun-Ramsay, 1st Marquess of Dalhousie
Lord Canning|british|British|Governor General|Charles Canning, 1st Earl Canning
Mangal Pandey|british|1857|Revolutionary|Mangal Pandey
Rani Lakshmibai|british|1857|Leader|Rani of Jhansi
Nana Saheb|british|1857|Leader|Nana Saheb
Tantia Tope|british|1857|General|Tatya Tope
Kunwar Singh|british|1857|Leader|Kunwar Singh
Begum Hazrat Mahal|british|1857|Leader|Begum Hazrat Mahal
Dadabhai Naoroji|freedom|INC Moderate|Leader|Dadabhai Naoroji
Gopal Krishna Gokhale|freedom|INC Moderate|Leader|Gopal Krishna Gokhale
Surendranath Banerjee|freedom|INC Moderate|Leader|Surendranath Banerjee
Bal Gangadhar Tilak|freedom|INC Extremist|Leader|Bal Gangadhar Tilak
Lala Lajpat Rai|freedom|INC Extremist|Leader|Lala Lajpat Rai
Bipin Chandra Pal|freedom|INC Extremist|Leader|Bipin Chandra Pal
Bhagat Singh|freedom|Revolutionary|HSRA|Bhagat Singh
Chandra Shekhar Azad|freedom|Revolutionary|HSRA|Chandra Shekhar Azad
Ram Prasad Bismil|freedom|Revolutionary|Kakori|Ram Prasad Bismil
Ashfaqulla Khan|freedom|Revolutionary|Kakori|Ashfaqulla Khan
Khudiram Bose|freedom|Revolutionary|Activist|Khudiram Bose
Mahatma Gandhi|freedom|Congress|Leader|Mahatma Gandhi
Jawaharlal Nehru|freedom|Congress|Leader|Jawaharlal Nehru
Sardar Patel|freedom|Congress|Leader|Vallabhbhai Patel
Rajendra Prasad|freedom|Congress|Leader|Rajendra Prasad
Sarojini Naidu|freedom|Congress|Leader|Sarojini Naidu
Maulana Azad|freedom|Congress|Leader|Abul Kalam Azad
Dr. B.R. Ambedkar|freedom|Social Reformer|Constitution|B. R. Ambedkar
Subhas Chandra Bose|freedom|INA|Leader|Subhas Chandra Bose
Rash Behari Bose|freedom|INA|Founder|Rash Behari Bose
Captain Lakshmi Sahgal|freedom|INA|Officer|Lakshmi Sahgal
Mohammad Ali Jinnah|freedom|Muslim League|Leader|Muhammad Ali Jinnah
Liaquat Ali Khan|freedom|Muslim League|Leader|Liaquat Ali Khan
`;

async function fetchWiki() {
    const lines = input.trim().split('\n').filter(Boolean);
    const chars = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split('|');
        if (parts.length < 5) continue;
        const [name, eraId, period, role, wikiTitle] = parts;

        console.log("Fetching " + (i + 1) + "/" + lines.length + ": " + wikiTitle);
        try {
            const url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&explaintext&pithumbsize=600&titles=" + encodeURIComponent(wikiTitle.trim()) + "&format=json";
            const res = await fetch(url);
            const data = await res.json();

            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];

            const image = (page && page.thumbnail) ? page.thumbnail.source : null;

            let intro = "A prominent historical figure of the Indian Subcontinent.";
            let earlyLife = "";
            let deathAndLegacy = "";
            let fullText = "";

            if (page && page.extract) {
                fullText = page.extract;
                // Intro is everything before the first "=="
                intro = fullText.split('\n== ')[0].trim();
                // We keep intro relatively concise but longer than before
                if (intro.length > 800) {
                    intro = intro.substring(0, 800) + '...';
                }

                // Extract Early life using regex grabbing content under == Early life == or == Early life and background ==
                const earlyLifeMatch = fullText.match(/==\s*Early life.*?\s*==\n([\s\S]*?)(?=\n==\s*|$)/i);
                if (earlyLifeMatch && earlyLifeMatch[1].trim().length > 20) {
                    earlyLife = earlyLifeMatch[1].trim().substring(0, 1000);
                    if (earlyLifeMatch[1].trim().length > 1000) earlyLife += '...';
                } else {
                    earlyLife = "Detailed biographical records regarding the very early life and origins of " + name.trim() + " remain scarce or are heavily intertwined with traditional oral legends of the " + eraId.toUpperCase() + " era.";
                }

                // Extract Death / Legacy
                const deathMatch = fullText.match(/==\s*(Death|Assassination|Legacy|Later life.*).*?\s*==\n([\s\S]*?)(?=\n==\s*|$)/i);
                if (deathMatch && deathMatch[2].trim().length > 20) {
                    deathAndLegacy = deathMatch[2].trim().substring(0, 1000);
                    if (deathMatch[2].trim().length > 1000) deathAndLegacy += '...';
                } else {
                    deathAndLegacy = name.trim() + " left an absolutely indelible, long-lasting mark on the history of the Indian subcontinent, their legacy echoing through subsequent generations.";
                }
            }

            chars.push({
                id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                name: name.trim(),
                role: role.trim(),
                period: period.trim(),
                eraId: eraId.trim(),
                image: image,
                eraElement: "Symbol of the " + eraId.toUpperCase() + " Era",
                quote: "History remembers those who shape it.",
                background: intro,
                earlyLife: earlyLife,
                deathAndLegacy: deathAndLegacy,
                importance: "Played a critical and central role during the " + period.trim() + " in shaping the political and historical landscape as a " + role.trim() + ".",
                events: ["Prominent events of " + period.trim()]
            });

            // Add slight delay to respect Wikipedia API limits
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {
            console.log("Error fetching " + wikiTitle + ":", e);
        }
    }

    const output = "export const charactersData = " + JSON.stringify(chars, null, 4) + ";\n";
    fs.writeFileSync('./src/data/charactersData.js', output, 'utf8');
    console.log("Successfully generated src/data/charactersData.js");
}

fetchWiki();
