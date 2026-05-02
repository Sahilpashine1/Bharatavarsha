import fs from 'fs';

let content = fs.readFileSync('./src/data/battlesData.js', 'utf8');
const existingIds = (content.match(/id: "([^"]+)"/g) || []).map(s => s.replace('id: "', '').replace('"', ''));
console.log('Existing battles:', existingIds.length);

// Close the array properly
content = content.trimEnd();
if (content.endsWith('];')) content = content.slice(0, -2);
else if (content.endsWith(']')) content = content.slice(0, -1);

const moreBattles = [
    // ── ANCIENT / LEGENDARY ──────────────────────────────────────────────────
    {
        id: 'battle_ten_kings', name: 'Battle of the Ten Kings (Dasarajna)',
        date: 'c. 1400–1200 BCE', location: 'Ravi River (Parushni), Punjab',
        eraId: 'vedic', era: 'Vedic Period',
        characters: ['King Sudas', 'Bharata Tribe', 'Vishwamitra', 'Vasishtha'],
        details: 'The earliest military battle recorded in Indian literature, described in the Rigveda (Book 7, hymns 18, 33, 83). King Sudas of the Bharata tribe, advised by the sage Vasishtha, faced a confederation of ten kings and tribes including the Purus, Yadus, and others, previously allied with him but now in revolt under the guidance of the rival sage Vishwamitra. It was fought on the banks of the Ravi river (Parushni) in Punjab. Sudas, though vastly outnumbered, crossed the river at a strategic ford and won a decisive victory.',
        impact: 'The battle is cited as one of the earliest instances of a smaller force using strategic river-crossing to defeat a larger coalition. The Bharata tribe\'s dominance following this battle gave the name "Bharata" to the entire Indian subcontinent. The rivalry between the sages Vishwamitra and Vasishtha, the spiritual commanders of opposing sides, became one of the most famous feuds in all Hindu mythology.'
    },
    {
        id: 'alexander_indus', name: 'Alexander\'s Indus Campaign',
        date: '327–325 BCE', location: 'Gandara, Sindh and Punjab',
        eraId: 'mahajanapadas', era: 'Mahajanapadas',
        characters: ['Alexander the Great', 'Ambhi (Taxila)', 'Assakenoi tribes', 'Seleucus Nicator'],
        details: 'Before the famous Battle of Hydaspes, Alexander crossed the Hindu Kush and fought a series of fierce engagements through modern-day Afghanistan and Pakistan. The most intense was the four-month siege of the Assakenoi city of Massaga, where a female ruler reportedly commanded the defense after her husband was killed. Alexander massacred the garrison after they tried to retreat, an act that shocked even his own historians. The siege of the Rock of Aornos (Pir-Sar) was another legendary feat — capturing an 8,000-foot summit fortress in winter.',
        impact: 'Alexander\'s campaigns in the northwest opened lasting trade and cultural connections between Greece and India. His victory at Taxila (Ambhi surrendered peacefully) demonstrated that Indian rulers could be pragmatic allies. The Greek presence in Gandhara persisted for 200 years, creating the magnificent Gandhara artistic tradition — a fusion of Greek and Buddhist iconography that influenced Buddhist art across Asia.'
    },
    // ── GUPTA / EARLY MEDIEVAL ───────────────────────────────────────────────
    {
        id: 'battle_sone_river', name: 'Gupta-Vakataka War',
        date: 'c. 350 CE', location: 'Deccan frontier, Vidarbha',
        eraId: 'gupta', era: 'Gupta Empire',
        characters: ['Chandragupta II', 'Rudrasena II (Vakataka)', 'Prabhavati Gupta'],
        details: 'Rather than a direct military confrontation, the Gupta emperor Chandragupta II used a brilliant diplomatic-military strategy: he gave his daughter Prabhavati Gupta in marriage to the Vakataka king Rudrasena II. When Rudrasena died young, Prabhavati became regent — effectively a Gupta proxy ruling the Vakataka heartland. This allowed Chandragupta to then focus on defeating the Saka (Western Kshatrapa) rulers of Ujjain without fear of a Deccan flank.',
        impact: 'The marriage alliance and subsequent regency gave the Guptas an indirect control over the Deccan without a bloody frontier war. Chandragupta earned the title Vikramaditya (Sun of Valor) after defeating the Sakas of Ujjain and incorporating Gujarat and Malwa into the empire — giving the Gupta Empire its greatest extent and securing western India\'s port-based trade networks with the Roman Empire.'
    },
    {
        id: 'battle_hunas', name: 'Skanda Gupta vs the White Huns (Hunas)',
        date: 'c. 455–456 CE', location: 'Northwestern India',
        eraId: 'gupta', era: 'Gupta Empire',
        characters: ['Emperor Skanda Gupta', 'Toramana (Huna chief)'],
        details: 'The White Huns (Alchon Huns, known in India as Hunas) were a Central Asian nomadic people who had devastated Persia and Bactria before turning their attention to India. Around 455 CE, Emperor Skanda Gupta launched personally what his Bhitari Pillar Inscription calls an "extremely difficult, enormous battle" against the Hunas — reportedly fighting so fiercely that he was reduced to sleeping on the bare earth and survived only through personal valor.',
        impact: 'Skanda Gupta\'s victory temporarily halted the Huna advances, buying the Gupta Empire perhaps two to three decades. However, the immense military expenditure drained the imperial treasury permanently. After Skanda Gupta\'s death, the Huna king Toramana and then his more ferocious son Mihirakula swept through northern India with extraordinary brutality, smashing the Gupta Empire\'s administrative structure and destroying thousands of Buddhist monasteries and temples described by the Chinese pilgrim Xuanzang.'
    },
    {
        id: 'battle_chalukya_arab', name: 'Battle of Rajasthan (Arab Invasion Repelled)',
        date: '738 CE', location: 'Rajasthan, India',
        eraId: 'gupta', era: 'Early Medieval',
        characters: ['Nagabhata I (Gurjara-Pratihara)', 'Pulakesi (Chalukya of Gujarat)', 'Junaid ibn Abd al-Rahman al-Murri (Arab Caliph\'s governor)'],
        details: 'Following their conquest of Sindh in 712 CE under Muhammad bin Qasim, the Umayyad Caliphate\'s forces under various governors repeatedly attempted to push further into India. In 738 CE, multiple Arab expeditions were decisively defeated in Rajasthan by a coalition of Indian kingdoms — primarily the Gurjara-Pratihara king Nagabhata I and the Chalukya king Pulakesi of Gujarat fighting in coordination. Several Arab commanders were killed and their armies routed.',
        impact: 'The Arab defeat in 738 CE halted Islamic expansion into the Indian heartland for nearly three centuries. Nagabhata I earned the title "Mihira" for his victories. Unlike in Sindh where the Arab conquest held, the Rajasthan repulsion ensured that the core of Indian civilization — the Gangetic plains and the heartland of Hinduism and Buddhism — remained free from Arab conquest. This is considered one of the pivotal battles that shaped the religious character of modern India.'
    },
    {
        id: 'battle_rashtrakuta_gurjara', name: 'Rashtrakuta-Gurjara-Pratihara Wars',
        date: 'c. 800–915 CE', location: 'Malwa, Gujarat, Northern India',
        eraId: 'gupta', era: 'Early Medieval',
        characters: ['Govinda III (Rashtrakuta)', 'Nagabhata II (Gurjara)', 'Dhruva (Rashtrakuta)'],
        details: 'The so-called "Tripartite Struggle" was the defining conflict of the early medieval period — a century-long three-way war between the Rashtrakutas of the Deccan, the Gurjara-Pratiharas of the north, and the Palas of Bengal for control of the symbolic city of Kannauj, the most prestigious royal capital in northern India. Rashtrakuta king Govinda III swept north and captured Kannauj from the Gurjaras. Nagabhata II recovered it. Successive generations fought over the city in an exhausting cycle of invasions and counter-invasions.',
        impact: 'The Tripartite Struggle left all three dynasties weakened by centuries of warfare, making them vulnerable to later Turkish invasions. The wars determined that no single Indian power would emerge to unify the subcontinent before the Ghurid conquest. The Rashtrakutas at their height were the most powerful dynasty in India, impressing Arab geographer al-Masudi who called their king "the greatest king of India."'
    },
    // ── CHOLA EMPIRE ─────────────────────────────────────────────────────────
    {
        id: 'battle_takkolam', name: 'Battle of Takkolam',
        date: '949 CE', location: 'Takkolam, Tamil Nadu',
        eraId: 'gupta', era: 'Chola Empire',
        characters: ['Rajaditya (Chola)', 'Krishna III (Rashtrakuta)'],
        details: 'The Battle of Takkolam was one of the most catastrophic defeats in Chola history. King Rajaditya, the crown prince of the Chola Empire and son of emperor Parantaka I, led the Chola army against the Rashtrakuta king Krishna III. Rajaditya fought from atop a battle elephant and was killed during the engagement — an enormous blow to Chola prestige as the prince never dismounted. The Cholas lost the battle decisively and the Rashtrakutas occupied the northern Chola territories.',
        impact: 'The defeat at Takkolam pushed the Chola Empire into a long period of decline and humiliation. The Rashtrakutas captured Tanjore, the Chola capital. The Chola dynasty would not recover for another 40 years until the ascension of the brilliant rulers Parantaka II and then the legendary Rajaraja Chola I, who transformed the Chola Empire into one of the greatest naval empires in Asia.'
    },
    {
        id: 'battle_mahinda', name: 'Chola Conquest of Ceylon (Battle of Mahinda)',
        date: '993–1017 CE', location: 'Sri Lanka (Ceylon)',
        eraId: 'gupta', era: 'Chola Empire',
        characters: ['Rajaraja Chola I', 'King Mahinda V (Ceylon)', 'Rajendra Chola I'],
        details: 'Rajaraja the Great, the most powerful Chola emperor, launched a series of naval and amphibious invasions of Ceylon. His admiral Krishnan Raman swept the Sinhalese navy aside and the Chola army marched deep into Ceylon, capturing the Sinhalese capital Anuradhapura and taking the Sinhalese queen and royal regalia back to Tanjore as trophies. King Mahinda V fled to the jungle. Rajendra Chola I later captured him personally, took him prisoner to India where he died in captivity.',
        impact: 'The conquest of Ceylon made the Chola Empire the supreme naval power of the Indian Ocean. The Cholas held Ceylon for 77 years. This and the subsequent naval expedition of Rajendra Chola I against the Srivijaya Empire in Southeast Asia made the Cholas the only medieval Indian dynasty to project naval power thousands of miles away — directly comparable to the great maritime empires of Europe centuries later.'
    },
    {
        id: 'battle_srivijaya', name: 'Chola Naval Expedition Against Srivijaya',
        date: '1025 CE', location: 'Malay Peninsula, Sumatra, Southeast Asia',
        eraId: 'gupta', era: 'Chola Empire',
        characters: ['Rajendra Chola I', 'Sangrama Vijayatunggavarman (Srivijaya)'],
        details: 'The most extraordinary overseas military expedition in ancient Indian history. Chola Emperor Rajendra Chola I launched a massive naval campaign that sailed thousands of miles across the Bay of Bengal and struck the powerful Srivijaya Empire (modern-day Sumatra, Malay Peninsula, and surrounding islands). Multiple Srivijayan ports and cities were captured, and enormous treasure was brought back. The expedition targeted the Srivijayan stranglehold over the lucrative Southeast Asian trade routes between India, China, and the spice islands.',
        impact: 'The Chola raid on Srivijaya was unprecedented in Indian maritime history. It dramatically shifted the balance of power in Southeast Asian trade, opening direct connections between Indian merchants and Chinese markets. The Srivijaya Empire never recovered its dominant commercial position. Rajendra Chola I\'s title "Gangaikonda" (He who conquered the Ganga) was already legendary. This expedition made him one of the greatest conquerors in Indian history.'
    },
    // ── MORE DELHI SULTANATE ─────────────────────────────────────────────────
    {
        id: 'battle_ranthambore', name: 'Siege of Ranthambore',
        date: '1301 CE', location: 'Ranthambore Fort, Rajasthan',
        eraId: 'delhi', era: 'Delhi Sultanate',
        characters: ['Alauddin Khalji', 'Hammiradeva (Chahamana)', 'Malik Kafur'],
        details: 'After Chittor, Alauddin Khalji turned his attention to the nearly impregnable Ranthambore Fort, then held by the Chahamana Rajput king Hammiradeva. The fort sat on a 700-foot rock and was considered virtually unconquerable. Hammiradeva had made the fatal mistake of giving refuge to Muhammadi, a rebel Mongol commander who had converted from Islam to Hinduism — which Alauddin used as a pretext for war. The siegemaster Nusrat Khan was killed during the siege by a trebuchet stone. Alauddin himself arrived and prosecuted the siege relentlessly for months.',
        impact: 'When the fort finally fell, Hammiradeva died in a final suicidal sortie. His wives performed Jauhar. The fall of Ranthambore, coming after Chittor, effectively broke organized Rajput political resistance in Rajasthan. Interestingly, Hammiradeva\'s refusal to surrender a refugee guest (even a Mongol Muslim) became celebrated in Rajput cultural memory as the pinnacle of aristocratic honor (Vachan-Palan). The Amir Khusrow wrote the Khaza\'in-ul-Futuh celebrating Alauddin\'s campaigns.'
    },
    {
        id: 'battle_mewar_sultanate', name: 'Battle of Singholi (Rana Kumbha vs Malwa)',
        date: '1446 CE', location: 'Rajasthan',
        eraId: 'delhi', era: 'Medieval Rajputana',
        characters: ['Rana Kumbha (Mewar)', 'Sultan Mahmud Khalji (Malwa)', 'Rana Chunda'],
        details: 'Maharana Kumbha of Mewar crushed the combined armies of the Malwa Sultanate led by Sultan Mahmud Khalji and the Gujarat Sultanate in a spectacular double victory. Rana Kumbha had earlier defeated and captured the Sultan of Malwa and kept him prisoner for six months. To commemorate these victories, he commenced the construction of the Vijay Stambha (Tower of Victory) at Chittorgarh — one of the most stunning medieval monuments in India.',
        impact: 'Kumbha\'s victories established him as the supreme Rajput power of the age. The 37-meter Vijay Stambha he built still stands at Chittorgarh and is carved with 40 tiers of sculptures depicting Hindu deities and scenes from the Ramayana and Mahabharata. Kumbha was also a composer, composer of Sangita Raja — the greatest medieval Sanskrit work on music. He built 32 forts and is considered the greatest Mewar ruler before Maharana Pratap.'
    },
    // ── MORE MUGHAL ──────────────────────────────────────────────────────────
    {
        id: 'battle_gogunda', name: 'Battle of Gogunda',
        date: '1576 CE', location: 'Gogunda, Rajasthan',
        eraId: 'mughal', era: 'Mughal Empire',
        characters: ['Akbar the Great', 'Maharana Pratap', 'Shahbaz Khan Kamboh'],
        details: 'The battle that immediately preceded and directly caused the Battle of Haldighati. Akbar\'s generals pursued Maharana Pratap of Mewar relentlessly. The Battle of Gogunda was a pre-engagement in the broader Mewar campaign during which the town of Gogunda was occupied by Mughal forces, cutting off Pratap\'s forward base. It was at this campaign\'s context that Akbar sent Man Singh I to deliver the decisive blow at Haldighati.',
        impact: 'The progressive loss of Gogunda and surrounding territories pushed Maharana Pratap into the mountains, leading directly to the famous Battle of Haldighati. The relentless Mughal pressure also demonstrated the fundamental Mughal strategic doctrine: destroy the enemy\'s supply network and territory systematically before forcing the decisive battle.'
    },
    {
        id: 'battle_tukaroi', name: 'Battle of Tukaroi',
        date: '3 March 1575 CE', location: 'Tukaroi, Odisha',
        eraId: 'mughal', era: 'Mughal Empire',
        characters: ['Khan-i-Khanan Munim Khan (Mughal)', 'Daud Khan Karrani (Bengal)', 'Raja Todar Mal'],
        details: 'The decisive battle that incorporated Bengal and Bihar permanently into the Mughal Empire. The last Afghan Karrani ruler Daud Khan Karrani had held out in Bengal and Bihar after the Sur dynasty\'s defeat. At Tukaroi in Odisha, the elderly Mughal commander Munim Khan (assisted by the brilliant administrator Raja Todar Mal) won a decisive victory, capturing Daud Khan. He was sent to Akbar in chains. Later escaping and returning to war, Daud Khan was caught again and executed in 1576.',
        impact: 'The final incorporation of Bengal through the Battle of Tukaroi removed the last major Afghan power in India. Bengal — the wealthiest province in all of India due to its trade, textiles, and agriculture — became a crucial Mughal revenue source. The battle is also significant for demonstrating Raja Todar Mal\'s administrative genius: he immediately reorganized the Bengal revenue system after the military victory, creating the Todar Mal Bandobast land survey that became the template for revenue administration across India.'
    },
    {
        id: 'battle_khurram_revolt', name: 'Prince Khurram\'s Revolt Against Jahangir',
        date: '1623–1625 CE', location: 'Deccan and Rajputana',
        eraId: 'mughal', era: 'Mughal Empire',
        characters: ['Prince Khurram (future Shah Jahan)', 'Emperor Jahangir', 'Mahabat Khan', 'Nur Jahan'],
        details: 'Prince Khurram (the future Emperor Shah Jahan) rebelled against his father Emperor Jahangir in 1623, largely at the instigation of the powerful Empress Nur Jahan who feared Khurram\'s growing influence. Khurram marched with his army into revolt but was defeated in engagements in the Deccan and Rajputana. He was eventually forced to submit, sending his sons Dara Shikoh and Aurangzeb as hostages to the Mughal court, where they were treated with honor.',
        impact: 'The revolt hardened Khurram\'s political ambitions and character. When Jahangir died in 1627, Khurram moved swiftly — executing his elder brothers and nephews to eliminate rivals — and ascended the throne as Shah Jahan. His experience of rebellion also made him deeply suspicious of his own sons, ironically setting the stage for his own overthrow by his son Aurangzeb in 1658.'
    },
    {
        id: 'battle_samugarh', name: 'Battle of Samugarh',
        date: '29 May 1658 CE', location: 'Samugarh (near Agra)',
        eraId: 'mughal', era: 'Mughal Empire',
        characters: ['Aurangzeb', 'Prince Dara Shikoh', 'Murad Bakhsh', 'Shah Jahan'],
        details: 'The decisive battle in the Mughal War of Succession following Emperor Shah Jahan\'s illness in 1657. Prince Dara Shikoh, the eldest son and Shah Jahan\'s chosen heir, faced the combined armies of his brothers Aurangzeb (commanding from the south) and Murad (from Gujarat). Dara had a larger army with superior artillery, but his battlefield commanding decisions were poor. Crucially, when he dismounted his elephant to transfer to a horse mid-battle, his soldiers thought he had been killed and the army panicked and broke.',
        impact: 'The Battle of Samugarh sealed the fate of three men simultaneously: Dara Shikoh was eventually captured and executed as a religious heretic (his Sufi inclinations and syncretic writings enraged orthodox Muslims), Shah Jahan was imprisoned in Agra Fort where he spent his final eight years gazing at the Taj Mahal, and Murad Bakhsh was lured to dinner by Aurangzeb and imprisoned. Aurangzeb then ruled for 49 years as the last great Mughal emperor.'
    },
    // ── MORE MARATHA ─────────────────────────────────────────────────────────
    {
        id: 'battle_sinhagad', name: 'Battle of Sinhagad (Kondana)',
        date: '4 February 1670 CE', location: 'Sinhagad Fort (Kondana), Pune',
        eraId: 'maratha', era: 'Maratha Empire',
        characters: ['Tanaji Malusare', 'Udaybhan Rathore (Mughal)', 'Shivaji Maharaj', 'Shelar Mama'],
        details: 'One of the most celebrated night attacks in Indian military history and a legendary example of Maratha valor. Tanaji Malusare, one of Shivaji\'s most trusted generals and closest friends, volunteered to recapture the vital Kondana fort even though it was the night of his son\'s wedding. He led 342 warriors in a near-vertical night-time assault up the cliff face using ropes and a trained monitor lizard (ghorpad) to anchor their ropes. In pitch darkness, they overwhelmed and slaughtered the Mughal garrison. Tanaji died in personal combat with the fort commander Udaybhan Rathore but the fort was taken.',
        impact: 'Shivaji, on hearing that the fort was won but Tanaji had died, reportedly said "Gad aala, pan Sinha gela" (The fort is taken, but the lion is gone) — giving the fort its new permanent name: Sinhagad (Fort of the Lion). The Battle of Sinhagad is as famous in Maharashtra as Thermopylae in the West. It represents the Maratha ideal of total sacrifice for the motherland. Tanaji Malusare\'s sacrifice has been celebrated in countless Maratha poems, plays, and films for three and a half centuries.'
    },
    {
        id: 'battle_udgir', name: 'Battle of Udgir',
        date: '3 February 1760 CE', location: 'Udgir (Bidar district), Karnataka',
        eraId: 'maratha', era: 'Maratha Empire',
        characters: ['Vishwasrao Bhau', 'Madhavrao I (Peshwa)', 'Nizam Ali Khan (Hyderabad)'],
        details: 'One of the most decisive Maratha victories against the Nizam of Hyderabad, coming just one year before the catastrophic Third Battle of Panipat. The Maratha army under Vishwasrao Bhau (the same commander who would die at Panipat) decisively defeated the Nizam\'s forces at Udgir, forcing the Nizam to sign one of the most humiliating treaties in his history — ceding enormous territories and a crushing war indemnity.',
        impact: 'The Battle of Udgir demonstrated the extraordinary height of Maratha power in the Deccan just months before Panipat. The massive indemnity paid by the Nizam temporarily enriched the Peshwa\'s treasury. However, the very success at Udgir led the Maratha leadership to overestimate their capabilities and march north to Panipat with excessive confidence — contributing to the strategic miscalculations that led to the catastrophic defeat.'
    },
    {
        id: 'battle_kharda', name: 'Battle of Kharda',
        date: '11 March 1795 CE', location: 'Kharda, Maharashtra',
        eraId: 'maratha', era: 'Maratha Empire',
        characters: ['Peshwa Madhavrao II', 'Nana Fadnavis', 'Nizam Ali Khan of Hyderabad'],
        details: 'The last great Maratha military victory before their final defeats at British hands. The Maratha Confederacy under the direction of the brilliant statesman Nana Fadnavis, fighting under the nominal command of the young Peshwa, decisively defeated the Nizam of Hyderabad. The Nizam\'s army was shattered in open battle, and he was forced to surrender enormous territories and pay a massive war indemnity of 30 million rupees.',
        impact: 'Kharda was the last time the Marathas demonstrated unified and successful pan-India military power. The victory proved hollow: within months, Nana Fadnavis\'s health was declining, Peshwa Madhavrao II died in mysterious circumstances (allegedly suicide), and the Maratha Confederation exploded into its final destructive civil wars among the chiefs — creating precisely the fragmented weakness that allowed the British to destroy them piece by piece in the three Anglo-Maratha Wars.'
    },
    // ── MORE BRITISH ERA ─────────────────────────────────────────────────────
    {
        id: 'battle_plassey', name: 'Battle of Plassey',
        date: '23 June 1757 CE', location: 'Palashi, Bengal',
        eraId: 'british', era: 'British East India Company',
        characters: ['Robert Clive (British)', 'Siraj-ud-Daulah (Nawab)', 'Mir Jafar (traitor)', 'Yar Latif Khan'],
        details: 'The battle that is conventionally regarded as the beginning of British rule in India. Nawab Siraj-ud-Daulah\'s army of 50,000 (with French artillery support) faced Robert Clive\'s 3,200 mixed British-Indian force. The battle was almost entirely pre-decided: Mir Jafar, the Nawab\'s commander-in-chief, had signed a secret treaty with Clive. When Siraj-ud-Daulah opened battle, a rainstorm drenched the Bengali artillery\'s powder. Mir Jafar\'s massive division — 45,000 men — never engaged, simply standing aside. The Nawab\'s smaller engaged force was routed in hours.',
        impact: 'Plassey is often called "the battle that won India for Britain" though Buxar better deserved that title. Mir Jafar was installed as the new Nawab and paid 3 million rupees to Robert Clive personally, making Clive one of the wealthiest men in Britain. When Clive was later asked by Parliament how he amassed such a fortune from a presumably honest military campaign, he reportedly replied: "I am astonished at my own moderation." Plassey opened the door; Buxar drove through it.'
    },
    {
        id: 'battle_first_mysore', name: 'First Anglo-Mysore War',
        date: '1767–1769 CE', location: 'Karnataka, Tamil Nadu',
        eraId: 'british', era: 'British & Mysore Wars',
        characters: ['Hyder Ali', 'Colonel Joseph Smith (British)', 'Nawab of Hyderabad'],
        details: 'The First Anglo-Mysore War began after Hyder Ali observed the British systematically destroying rival Indian powers. Hyder Ali formed a triple alliance with the Nizam of Hyderabad and the Marathas against the British, but both allies were bribed to switch sides. Despite fighting alone, Hyder Ali demonstrated remarkable military genius — his mobile cavalry penetrated to within 5 miles of Madras (Chennai), causing a near-panic in the British settlement. Hyder marched his army to the walls of Madras itself, forcing the British to sue for peace.',
        impact: 'The Treaty of Madras (1769) was deeply humbling for the British — they agreed to mutual assistance in case of attack, essentially recognizing Hyder Ali as an equal sovereign. The war revealed Hyder Ali\'s exceptional military talent and Western-style army reforms (he employed French officers). It established Mysore as the most dangerous adversary the British faced in India, setting the stage for three more increasingly brutal wars.'
    },
    {
        id: 'battle_second_mysore', name: 'Second Anglo-Mysore War',
        date: '1780–1784 CE', location: 'South India',
        eraId: 'british', era: 'British & Mysore Wars',
        characters: ['Hyder Ali', 'Tipu Sultan', 'Sir Eyre Coote (British)', 'Warren Hastings'],
        details: 'When the British attacked Hyder Ali\'s French-allied territory despite the treaty, Hyder Ali responded with decisive fury — invading the Carnatic with 90,000 troops and systematically burning and depopulating the region around Madras to within 40 miles of the city. He won the Battle of Pollilur (the greatest British defeat in India). Only the death of Hyder Ali from cancer in December 1782, as the war continued, gave the British relief. His son Tipu Sultan continued fighting with great skill.',
        impact: 'The Second War demonstrated that Mysore under Hyder Ali and Tipu Sultan was a genuine threat to British survival in India. Parliament in London was in uproar. The Treaty of Mangalore (1784) was again favorable to Mysore — Tipu Sultan signed as a victor. The war also revealed British vulnerability to coalition warfare, pushing Governor-General Warren Hastings to begin the deliberate policy of permanently eliminating all rivals before they could combine against the British.'
    },
    {
        id: 'battle_third_mysore', name: 'Third Anglo-Mysore War',
        date: '1790–1792 CE', location: 'South India, Seringapatam',
        eraId: 'british', era: 'British & Mysore Wars',
        characters: ['Tipu Sultan', 'Lord Cornwallis (British)', 'Marathas', 'Nizam of Hyderabad'],
        details: 'Lord Cornwallis personally led a massive British force combined with Maratha and Nizam\'s armies against Tipu Sultan. Despite a brilliant initial defense that inflicted severe losses on Cornwallis during the siege of Seringapatam in 1791, Tipu was ultimately surrounded and forced to negotiate. The Treaty of Seringapatam (1792) was devastating: Tipu surrendered half his territory, paid a massive ransom, and — most humiliatingly — gave his two young sons as hostages to Cornwallis, who later returned them.',
        impact: 'The Third Mysore War permanently halved Tipu Sultan\'s kingdom and removed his ability to project offensive military power. Contemporary accounts describe Tipu weeping as his sons were taken as hostages. He reportedly told them: "Hazaar maa baap ke liye ek shahenshah banna behtar hai, tum shahenshah nahi, tum sheikh ki aulad ho" (For thousands of mothers and fathers, it is better to be one emperor). He spent the remaining years preparing for a final showdown that ended at Seringapatam in 1799.'
    },
    {
        id: 'battle_laswari', name: 'Battle of Laswari',
        date: '1 November 1803 CE', location: 'Laswari, Rajasthan',
        eraId: 'british', era: 'Second Anglo-Maratha War',
        characters: ['General Gerard Lake (British)', 'Ambaji Inglia (Scindia)', 'Doublat Rao Scindia'],
        details: 'The bloodiest single battle of the Second Anglo-Maratha War, fought the same day as the more famous Battle of Assaye in the Deccan. General Lake attacked the retreating Scindia forces at Laswari with such urgency that his cavalry outran his infantry entirely. The four Scindia infantry battalions, trained by the infamous French general Perron and armed with superior artillery, held their position and inflicted catastrophic casualties on the British cavalry before the infantry finally arrived. The British suffered 800 killed and wounded — their heaviest losses of the war.',
        impact: 'Despite the terrible cost, Lake\'s victory at Laswari, combined with Wellesley\'s at Assaye, ended the Second Anglo-Maratha War. Delhi fell to the British, and the Mughal Emperor Shah Alam II came under British "protection" — completing the symbolic transfer of Mughal authority to British oversight. Laswari was Lord Lake\'s most costly but most dramatic personal victory.'
    },
    {
        id: 'battle_delhi_1857', name: 'Siege of Delhi (1857)',
        date: 'May–September 1857 CE', location: 'Delhi',
        eraId: 'british', era: 'Great Rebellion / Sepoy Mutiny',
        characters: ['Bahadur Shah Zafar (Mughal)', 'General John Nicholson (British)', 'Bakht Khan', 'Mirza Mughal'],
        details: 'The most critical battlefield of the 1857 Rebellion — the recapture of the symbolic Mughal capital Delhi. After the rebel sepoys declared Bahadur Shah Zafar emperor, the British laid siege to Delhi for four months with a force smaller than the defenders. The turning point was the arrival of General John Nicholson with a siege train. The British assault began in September through multiple breaches. The fighting was of the most ferocious urban kind, with sepoys contesting every street and building. Nicholson himself was mortally wounded at the Lahori Gate. The British captured Delhi after a week of close-quarters fighting.',
        impact: 'The fall of Delhi crushed the symbolic heart of the 1857 Rebellion. Bahadur Shah Zafar was captured in the tomb of the Mughal emperor Humayun, tried, and exiled to Rangoon (Burma) where the last Mughal emperor died in 1862. His sons were shot on the spot by the British officer William Hodson. The recapture of Delhi allowed the British to systematically suppress the rebellion across northern India with extreme brutality over the following year.'
    },
    {
        id: 'battle_cawnpore', name: 'Battle of Cawnpore & the Massacre',
        date: 'June–December 1857 CE', location: 'Kanpur (Cawnpore), Uttar Pradesh',
        eraId: 'british', era: 'Great Rebellion / Sepoy Mutiny',
        characters: ['Nana Saheb (Dhondu Pant)', 'General Wheeler (British)', 'General Colin Campbell (British)', 'Tantia Tope'],
        details: 'General Wheeler\'s British garrison of 400 soldiers and 300 civilians (including many women and children) was besieged by Nana Saheb\'s forces at Kanpur. After three weeks of brutal defense under artillery fire, Wheeler negotiated surrender with safe passage guaranteed — a surrender he felt he had no choice but to accept as his force was decimated. As the British boarded boats on the Ganges, violence erupted and the entire garrison was killed or captured. The surviving women and children were held for weeks and then massacred on the eve of the British relief column\'s arrival.',
        impact: 'The Kanpur Massacre was the single most effective propaganda event for the British throughout the entire Rebellion. News of "The Bibighar Massacre" (named for the building where women were killed) sent shock waves through Britain and inflamed public opinion beyond measure, leading Parliament to authorize massive resources for suppression. The British response, often indiscriminate in its fury, set a pattern of exemplary vengeance across the rebellion zone.'
    },
    {
        id: 'battle_gwalior_1858', name: 'Battle of Gwalior (Kotah-ki-Serai) 1858',
        date: '17–20 June 1858 CE', location: 'Gwalior, Madhya Pradesh',
        eraId: 'british', era: 'Great Rebellion / Sepoy Mutiny',
        characters: ['Rani Lakshmibai (Jhansi)', 'Tantia Tope', 'Sir Hugh Rose', 'Jayajirao Scindia'],
        details: 'The final major battle of the 1857 Rebellion. After the fall of Jhansi, Rani Lakshmibai and Tantia Tope retreated to Gwalior, where rebel forces seized the Gwalior fort and Jayajirao Scindia fled to British protection. The British siege was rapid. Rani Lakshmibai, dressed in the uniform of a cavalry trooper, personally led the defense at Kotah-ki-Serai on 17 June 1858. In the ensuing cavalry skirmish, she was shot and mortally wounded, reportedly dying with a sword in her hand.',
        impact: 'The death of Rani Lakshmibai at Gwalior ended the last organized resistance of the 1857 Rebellion. Tantia Tope fled into the jungle, conducting guerrilla warfare until he was betrayed and captured in 1859. General Hugh Rose paid his enemies the ultimate compliment: he called Lakshmibai "the most dangerous of all rebel leaders." The fall of Gwalior marked the official end of the First War of Indian Independence. The British formally dissolved the Mughal dynasty and declared Queen Victoria Empress of India.'
    },
    // ── COLONIAL RESISTANCE ──────────────────────────────────────────────────
    {
        id: 'battle_sangli_revolt', name: 'Vellore Mutiny',
        date: '10 July 1806 CE', location: 'Vellore Fort, Tamil Nadu',
        eraId: 'british', era: 'British East India Company',
        characters: ['Tipu Sultan\'s sons (incitement)', 'Colonel Fancourt (killed)', 'Sepoy Sheik Adam'],
        details: 'The first major sepoy mutiny of British India, fifty years before 1857, and a chilling preview of what was to come. Sepoys of the Madras Army at Vellore Fort — enraged by new British regulations requiring them to trim their beards, stop wearing caste or religious marks, and adopt a new hat that resembled a hat used in Christian ceremonies — rose in revolt at 3 AM, murdering 14 British officers and 115 British soldiers in their sleep. The sons of Tipu Sultan, imprisoned in Vellore, were suspected of organizing the revolt.',
        impact: 'The British immediately sent cavalry from a neighboring garrison who stormed the fort and killed over 100 mutineers with a cannon blast into their crowded ranks. Tipu\'s sons were deported to Calcutta for safety. The Vellore Mutiny caused the British to reverse all the offending regulations and to be far more careful about interfering with the religious practices of Indian soldiers. The lesson was only temporarily learned: the same issue of cow-and-pig greased cartridges resurfaced in 1857 with far more catastrophic consequences.'
    },
    {
        id: 'battle_paika_rebellion', name: 'Paika Rebellion of Odisha',
        date: '1817 CE', location: 'Odisha',
        eraId: 'british', era: 'British East India Company',
        characters: ['Bakshi Jagabandhu', 'Mukunda Deva II (Khurda)', 'Colonel Adams (British)'],
        details: 'The Paika Rebellion preceded the 1857 Rebellion by 40 years and was one of the most significant armed uprisings against British colonial rule in India. The Paikas were warrior landholders who had traditionally served the kings of Odisha. When the British abolished their land rights and imposed new taxation, Bakshi Jagabandhu Bidyadhar led a massive uprising that began in Khurda and swept across Odisha. Villages were burned, British supply lines attacked, and several British officers killed.',
        impact: 'The Paika Rebellion was ultimately suppressed, and Jagabandhu spent years as a fugitive before surrendering and dying in prison. In 2017, the Indian government officially recognized the Paika Rebellion as the "First War of Independence," predating the 1857 Rebellion by 40 years. Jagabandhu is now celebrated as a national hero. The rebellion demonstrated that indigenous resistance to British rule was never extinguished between 1757 and 1947.'
    },
    {
        id: 'battle_sanyasi_rebellion', name: 'Sanyasi and Fakir Rebellion',
        date: '1763–1800 CE', location: 'Bengal',
        eraId: 'british', era: 'British East India Company',
        characters: ['Majnu Shah (Fakir)', 'Bhabani Pathak', 'Devi Chaudhurani (female leader)', 'Warren Hastings'],
        details: 'One of the longest sustained armed resistances against the British East India Company, lasting nearly 40 years. Hindu sanyasis (wandering ascetics) and Muslim faqirs combined forces to launch repeated attacks on EIC revenue collectors, warehouses, and supply lines across Bengal and Bihar. The resistance was rooted in economic desperation — the EIC\'s extreme extraction had caused the Bengal Famine of 1770 that killed 10 million people. Female leader Devi Chaudhurani commanded her own river pirate fleet and led raids against EIC shipping.',
        impact: 'Although eventually suppressed, the Sanyasi-Fakir rebellion inspired Bengal\'s greatest writer, Bankim Chandra Chattopadhyay, to write his famous novel "Anandamath" (1882) which featured the rebellion and introduced the powerful nationalist anthem "Vande Mataram." This song became the rallying cry of the Indian nationalist movement and was eventually adopted as India\'s national song, making the forgotten Sanyasi rebellion one of the most culturally consequential revolts of the colonial era.'
    },
    // ── WORLD WARS ───────────────────────────────────────────────────────────
    {
        id: 'battle_gallipoli_india', name: 'Indian Corps at Gallipoli & Western Front',
        date: '1914–1915 CE', location: 'France, Flanders, Turkey',
        eraId: 'british', era: 'World War I',
        characters: ['General Pratap Singh (Indian Corps)', 'Field Marshal French', 'Jemadar Mir Dast (VC)', 'Risaldar Badlu Singh (VC)'],
        details: 'Over 1.5 million Indian soldiers served in World War I — the largest volunteer army in world history at the time. The Indian Corps was among the first to fight on the Western Front in France and Belgium in the autumn of 1914, plugging the line when the British Expeditionary Force was at its most desperate. Indian soldiers fought in the mud of Flanders before they had winter uniforms. Sepoys from tropical India faced poison gas, air bombardment, and artillery on a scale unprecedented in military history. Eleven Indians received the Victoria Cross.',
        impact: 'The scale of Indian contribution to World War I fundamentally shaped British promises to India. The Montagu-Chelmsford Reforms (1919) and ultimately the Government of India Act (1935) were direct consequences of the political debt Britain owed India for 1.5 million soldiers and 72,000 dead. However, the Jallianwala Bagh massacre occurred in 1919 — the very year of the post-war reforms — poisoning political goodwill and accelerating Gandhi\'s transformation into a mass nationalist leader.'
    },
    {
        id: 'battle_mesopotamia_kut', name: 'Siege of Kut (Mesopotamia Campaign)',
        date: 'December 1915 – April 1916 CE', location: 'Kut-al-Amara, Iraq (Mesopotamia)',
        eraId: 'british', era: 'World War I',
        characters: ['General Charles Townshend (British)', 'Major General Charles Melliss (Indian Army)', 'Khalil Pasha (Ottoman)'],
        details: 'One of the most humiliating British military disasters of World War I, involving primarily Indian Army troops. General Townshend\'s force of 13,000 men (mostly Indian) was besieged at Kut-al-Amara in Mesopotamia (modern Iraq) by Ottoman forces for 147 days. Despite four relief attempts costing 23,000 more casualties, the position was untenable. Townshend surrendered in April 1916. The Indian soldiers endured the brutal conditions of Ottoman captivity — thousands died from disease, starvation, and mistreatment on the forced march to Anatolia.',
        impact: 'The Fall of Kut was described in the British press as one of the greatest disasters since Cornwallis surrendered at Yorktown. The Indian soldiers\' suffering in Ottoman captivity was severe — a 1917 report estimated 70% of Indian prisoners died in captivity. The disaster prompted a complete reorganization of the Mesopotamia campaign\'s supply and command structure. Eventually, after the reorganization, Indian and British forces under General Allenby\'s overall command won the entire Mesopotamia and Palestine campaigns decisively.'
    }
];

// Filter out any battles that already exist
const newOnes = moreBattles.filter(b => !existingIds.includes(b.id));
console.log(`Adding ${newOnes.length} new battles (${moreBattles.length - newOnes.length} already exist)`);

let addition = '\n\n    // ─── EXPANDED BATTLES ────────────────────────────────────────────\n';
for (const b of newOnes) {
    const chars = JSON.stringify(b.characters);
    addition += `    {\n`;
    addition += `        id: ${JSON.stringify(b.id)},\n`;
    addition += `        name: ${JSON.stringify(b.name)},\n`;
    addition += `        date: ${JSON.stringify(b.date)},\n`;
    addition += `        location: ${JSON.stringify(b.location)},\n`;
    addition += `        eraId: ${JSON.stringify(b.eraId)},\n`;
    addition += `        era: ${JSON.stringify(b.era)},\n`;
    addition += `        characters: ${chars},\n`;
    addition += `        details: ${JSON.stringify(b.details)},\n`;
    addition += `        impact: ${JSON.stringify(b.impact)}\n`;
    addition += `    },\n`;
}
// Remove trailing comma
addition = addition.trimEnd().replace(/,$/, '');

const final = content + addition + '\n];\n';
fs.writeFileSync('./src/data/battlesData.js', final, 'utf8');

const totalCount = (final.match(/id: "/g) || []).length;
console.log(`Done! Total battles: ${totalCount}`);
