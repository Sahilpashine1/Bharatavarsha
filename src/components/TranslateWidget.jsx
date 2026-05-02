import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ur', name: 'Urdu (اردو)' },
];

const TranslateWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        setCurrentLang(langCode);
        setIsOpen(false);

        // Find the hidden Google Translate select element
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
            selectElement.value = langCode;
            // Dispatch a native change event so Google's script notices the value changed programmatically
            selectElement.dispatchEvent(new Event('change'));
        }
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* The trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-full hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 transition-all text-[#d4af37] text-sm tracking-wide"
                title="Translate History"
            >
                <Languages size={16} />
                <span className="font-semibold uppercase tracking-widest hidden sm:inline-block">
                    {languages.find(l => l.code === currentLang)?.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* The dropdown strictly styled with our glassmorphism theme */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-[#0a0f1a]/95 backdrop-blur-xl border border-[#d4af37]/40 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`text-left px-4 py-3 rounded-lg text-sm transition-colors ${currentLang === lang.code
                                            ? 'bg-[#d4af37]/20 text-[#f1c40f] font-bold border border-[#d4af37]/50'
                                            : 'text-[#a0aabf] hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TranslateWidget;
