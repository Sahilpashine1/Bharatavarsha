export const familyTreesData = [
    {
        id: "mauryan_empire",
        name: "The Mauryan Empire",
        era: "Ancient India",
        founderId: "chandragupta_maurya",
        tree: {
            id: "chandragupta_maurya",
            spouse: "Durdhara",
            children: [
                {
                    id: "bindusara",
                    spouse: "Subhadrangi",
                    children: [
                        { id: "susima" },
                        {
                            id: "ashoka",
                            spouse: "Mahadevi",
                            children: [
                                { id: "mahendra" },
                                { id: "sanghamitra" },
                                { id: "kunala" }
                            ]
                        },
                        { id: "vitashoka" }
                    ]
                }
            ]
        }
    },
    {
        id: "mughal_empire",
        name: "The Mughal Empire",
        era: "Medieval India",
        founderId: "babur",
        tree: {
            id: "babur",
            spouse: "Maham Begum",
            children: [
                {
                    id: "humayun",
                    spouse: "Hamida Banu Begum",
                    children: [
                        {
                            id: "akbar",
                            spouse: "Ruqaiya Sultan Begum",
                            children: [
                                {
                                    id: "jahangir",
                                    spouse: "Nur Jahan",
                                    children: [
                                        {
                                            id: "shah_jahan",
                                            spouse: "Mumtaz Mahal",
                                            children: [
                                                { id: "dara_shikoh" },
                                                { id: "aurangzeb" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        id: "maratha_empire",
        name: "The Maratha Empire",
        era: "Early Modern India",
        founderId: "shivaji",
        tree: {
            id: "shivaji",
            spouse: "Saibai",
            children: [
                {
                    id: "sambhaji",
                    spouse: "Yesubai",
                    children: [
                        { id: "shahu_i" }
                    ]
                },
                {
                    id: "rajaram",
                    spouse: "Tarabai",
                    children: [
                        { id: "shivaji_ii" }
                    ]
                }
            ]
        }
    },
    {
        id: "gupta_empire",
        name: "The Gupta Empire",
        era: "Classical India",
        founderId: "sri_gupta",
        tree: {
            id: "sri_gupta",
            spouse: "Unknown",
            children: [
                {
                    id: "ghatotkacha",
                    spouse: "Unknown",
                    children: [
                        {
                            id: "chandragupta_i",
                            spouse: "Kumaradevi",
                            children: [
                                {
                                    id: "samudragupta",
                                    spouse: "Dattadevi",
                                    children: [
                                        {
                                            id: "chandragupta_ii",
                                            spouse: "Dhruvadevi",
                                            children: [
                                                { id: "kumaragupta_i" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        id: "delhi_sultanate",
        name: "The Delhi Sultanate (Mamluk & Khilji)",
        era: "Medieval India",
        founderId: "qutb_ud_din_aibak",
        tree: {
            id: "qutb_ud_din_aibak",
            spouse: "Unknown",
            children: [
                { id: "aram_shah" },
                {
                    id: "iltutmish",
                    spouse: "Shah Turkan",
                    children: [
                        { id: "rukuddin_firuz" },
                        {
                            id: "razia_sultan",
                            spouse: "Malik Altunia",
                            children: []
                        },
                        { id: "muiz_ud_din_bahram" }
                    ]
                }
            ]
        }
    },
    {
        id: "chola_dynasty",
        name: "The Chola Dynasty",
        era: "Medieval South India",
        founderId: "vijayalaya_chola",
        tree: {
            id: "vijayalaya_chola",
            spouse: "Unknown",
            children: [
                {
                    id: "aditya_i",
                    spouse: "Ilangon Pichchi",
                    children: [
                        {
                            id: "parantaka_i",
                            spouse: "Kokilan Adigal",
                            children: [
                                {
                                    id: "rajaraja_i",
                                    spouse: "Lokamahadevi",
                                    children: [
                                        {
                                            id: "rajendra_chola_i",
                                            spouse: "Tribhuvana Mahadevi",
                                            children: [
                                                { id: "rajadhiraja_chola" },
                                                { id: "rajendra_chola_ii" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
];
