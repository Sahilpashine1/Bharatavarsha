import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, X, Menu, ArrowLeft } from 'lucide-react';
import { charactersData } from '../data/charactersData';

const Characters = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCharId, setSelectedCharId] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    // Filter characters
    const filteredChars = charactersData.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.eraId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeChar = filteredChars[activeIndex] || filteredChars[0];
    const selectedChar = charactersData.find(c => c.id === selectedCharId);

    // Parallax background effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedCharId) return; // Disable when detailed view is open
            if (e.key === 'ArrowRight') {
                setActiveIndex(prev => Math.min(prev + 1, filteredChars.length - 1));
            } else if (e.key === 'ArrowLeft') {
                setActiveIndex(prev => Math.max(prev - 1, 0));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredChars.length, selectedCharId]);

    // Handle scroll wheel for carousel
    const handleWheel = (e) => {
        if (selectedCharId || filteredChars.length === 0) return;
        if (e.deltaY > 0) {
            setActiveIndex(prev => Math.min(prev + 1, filteredChars.length - 1));
        } else if (e.deltaY < 0) {
            setActiveIndex(prev => Math.max(prev - 1, 0));
        }
    };

    return (
        <div
            className="h-screen w-full bg-[#05070f] overflow-hidden relative font-sans text-white select-none"
            onWheel={handleWheel}
        >
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                animate={{
                    x: mousePosition.x * -1,
                    y: mousePosition.y * -1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#800000]/10 rounded-full blur-[150px]"></div>
            </motion.div>

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between px-8 py-6 pointer-events-auto">
                <button
                    onClick={() => navigate('/timeline')}
                    className="text-[#a0aabf] hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline font-bold tracking-wider uppercase text-sm">Home</span>
                </button>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f1c40f] to-[#d4af37]"
                >
                    BHARAT
                </motion.h1>
                <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 bg-[#121826] flex items-center justify-center pointer-events-none">
                    <User size={18} className="text-[#d4af37]" />
                </div>
            </header>

            {/* Search Bar (Hidden when character is selected) */}
            <AnimatePresence>
                {!selectedCharId && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-6 pointer-events-auto"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="text-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, role, era..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setActiveIndex(0); // Reset index on search
                                }}
                                className="glass-input w-full text-white rounded-full py-3 pl-12 pr-6 text-sm"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Carousel View */}
            <AnimatePresence>
                {!selectedCharId && filteredChars.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                        {/* Carousel Track */}
                        <div className="relative w-full h-[60vh] flex items-center justify-center mt-12" ref={carouselRef}>
                            {filteredChars.map((char, index) => {
                                const offset = index - activeIndex;
                                const absOffset = Math.abs(offset);
                                const isVisible = absOffset <= 3; // Show 3 items on each side

                                if (!isVisible) return null;

                                // Cinematic Depth of Field Math
                                const scale = absOffset === 0 ? 1.0 : absOffset === 1 ? 0.78 : 0.62;
                                const zIndex = 100 - absOffset;
                                const xPos = offset * 220; // Distance between cards
                                const opacity = 1 - (absOffset * 0.28);
                                const blur = absOffset === 0 ? "blur(0px)" : `blur(${absOffset * 3}px)`;
                                const rotateY = offset * -12; // Slight tilt towards center

                                return (
                                    <motion.div
                                        key={char.id}
                                        layoutId={`card-container-${char.id}`}
                                        className="absolute cursor-pointer flex flex-col items-center group"
                                        style={{ zIndex }}
                                        animate={{
                                            x: xPos,
                                            scale: scale,
                                            opacity: opacity,
                                            rotateY: rotateY,
                                            filter: blur,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 25,
                                            mass: 0.8
                                        }}
                                        onClick={() => {
                                            if (offset === 0) {
                                                setSelectedCharId(char.id);
                                            } else {
                                                setActiveIndex(index);
                                            }
                                        }}
                                    >
                                        {/* Focus Ring & Portrait */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative w-52 h-72 md:w-64 md:h-[22rem] flex items-center justify-center">
                                                {/* Reticle / Focus Ring */}
                                                {offset === 0 && (
                                                    <motion.div
                                                        layoutId="focus-ring"
                                                        className="absolute inset-[-8px] border border-[#d4af37]/40 rounded-xl"
                                                        animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]"></div>
                                                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]"></div>
                                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]"></div>
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]"></div>
                                                    </motion.div>
                                                )}

                                                {/* Floating Idle Animation for Center Card */}
                                                <motion.div
                                                    className="w-full h-full rounded-xl overflow-hidden glass-card border-0 shadow-2xl relative"
                                                    animate={offset === 0 ? { y: [-4, 4, -4] } : { y: 0 }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

                                                    <motion.img
                                                        layoutId={`image-${char.id}`}
                                                        src={char.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                                                        alt={char.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            const parent = e.target.parentElement;
                                                            parent.classList.add('bg-[#111827]', 'flex', 'items-center', 'justify-center');
                                                            const span = document.createElement('span');
                                                            span.className = 'font-cinzel text-6xl font-black text-white/10 select-none';
                                                            span.innerText = char.name.charAt(0);
                                                            parent.appendChild(span);
                                                        }}
                                                    />

                                                    {/* Era badge top-right */}
                                                    <div className="absolute top-2 right-2 z-20">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37] glass-gold px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                                                            {char.eraId}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Name label — always visible for all cards */}
                                            <div className={`text-center transition-all duration-300 ${offset === 0 ? 'opacity-100' : 'opacity-60'}`}>
                                                <p className={`font-bold text-white leading-tight drop-shadow-lg ${offset === 0 ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
                                                    }`}>
                                                    {char.name}
                                                </p>
                                                <p className={`text-[#d4af37] font-semibold uppercase tracking-widest ${offset === 0 ? 'text-[11px] mt-1' : 'text-[9px] mt-0.5'
                                                    }`}>
                                                    {char.role}
                                                </p>
                                                {offset === 0 && char.events && char.events.length > 0 && (
                                                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                                                        {char.events.slice(0, 2).map((ev, i) => (
                                                            <span key={i} className="text-[9px] glass-pill text-[#a0aabf] px-2 py-0.5 rounded-full">
                                                                ⚔ {ev}
                                                            </span>
                                                        ))}
                                                        {char.events.length > 2 && (
                                                            <span className="text-[9px] text-[#a0aabf]/50">+{char.events.length - 2} more</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Compact Scrubber */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
                            <span className="text-[#a0aabf]/70 text-xs tabular-nums font-mono">
                                {(activeIndex + 1).toString().padStart(2, '0')}
                            </span>
                            <div className="w-28 h-0.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#d4af37] rounded-full"
                                    animate={{ width: `${((activeIndex + 1) / filteredChars.length) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <span className="text-[#a0aabf]/30 text-xs tabular-nums font-mono">
                                {filteredChars.length.toString().padStart(2, '0')}
                            </span>
                        </div>
                    </motion.div >
                )}
            </AnimatePresence >

            {/* Empty State */}
            {
                filteredChars.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <p className="text-[#a0aabf] text-lg">No historical figures found.</p>
                    </div>
                )
            }

            {/* Detailed View (Shared Element Transition) */}
            <AnimatePresence>
                {selectedChar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#05070f] overflow-hidden pointer-events-auto"
                    >
                        {/* Left Side: Expanded Image */}
                        <motion.div
                            layoutId={`card-container-${selectedChar.id}`}
                            className="w-full md:w-5/12 h-[45vh] md:h-full relative shrink-0 border-b md:border-b-0 md:border-r border-[#d4af37]/20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20"
                        >
                            <motion.img
                                layoutId={`image-${selectedChar.id}`}
                                src={selectedChar.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                                alt={selectedChar.name}
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#05070f] md:via-[#05070f]/50 to-transparent opacity-80" />

                            <button
                                onClick={() => setSelectedCharId(null)}
                                className="absolute top-6 left-6 md:top-8 md:left-8 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-all group z-30"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Right Side: Information Panel with Staggered Reveal */}
                        <div className="w-full md:w-7/12 h-[55vh] md:h-full overflow-y-auto custom-scrollbar relative z-10 pb-20">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

                            <motion.div
                                className="max-w-3xl px-8 py-10 md:p-16 lg:p-24"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                                    }
                                }}
                            >
                                {/* Header Info */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-[1px] bg-[#d4af37]"></span>
                                        <p className="text-[#d4af37] text-sm font-bold tracking-[0.2em] uppercase">
                                            {selectedChar.period} • {selectedChar.eraId}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                                >
                                    {selectedChar.name}
                                </motion.h1>

                                <motion.div
                                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                                    className="inline-block border border-[#d4af37]/30 bg-[#d4af37]/5 px-5 py-2 rounded-full mb-12 backdrop-blur-sm"
                                >
                                    <span className="text-[#e2e8f0] font-medium tracking-wide">
                                        Historical Role: <span className="text-[#d4af37] font-bold">{selectedChar.role}</span>
                                    </span>
                                </motion.div>

                                {/* Quote */}
                                {selectedChar.quote && (
                                    <motion.blockquote
                                        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                                        className="mb-12 border-l-4 border-[#d4af37] pl-8 py-2 relative"
                                    >
                                        <p className="text-2xl md:text-3xl font-serif italic text-[#cbd5e1] leading-relaxed">
                                            "{selectedChar.quote}"
                                        </p>
                                    </motion.blockquote>
                                )}

                                {/* Early Life */}
                                {selectedChar.earlyLife && (
                                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-12">
                                        <h3 className="text-[#f1c40f] text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#d4af37]" /> Early Life & Origins
                                        </h3>
                                        <p className="text-[#a0aabf] text-lg md:text-xl leading-relaxed">
                                            {selectedChar.earlyLife}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Background (Main Biographical Profile) */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-12">
                                    <h3 className="text-[#f1c40f] text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#d4af37]" /> Main Biography
                                    </h3>
                                    <p className="text-[#a0aabf] text-lg md:text-xl leading-relaxed">
                                        {selectedChar.background}
                                    </p>
                                </motion.div>

                                {/* Death & Legacy */}
                                {selectedChar.deathAndLegacy && (
                                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-16">
                                        <h3 className="text-[#f1c40f] text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#d4af37]" /> Legacy & Later Life
                                        </h3>
                                        <p className="text-[#a0aabf] text-lg md:text-xl leading-relaxed">
                                            {selectedChar.deathAndLegacy}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Major Events / Importance */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-10">
                                    <div className="bg-transparent glass-card rounded-2xl border-0 p-8 shadow-xl">
                                        <h3 className="text-white text-xl font-bold mb-4">Historical Impact</h3>
                                        <p className="text-[#cbd5e1] leading-relaxed italic mb-6">
                                            {selectedChar.importance}
                                        </p>

                                        <h4 className="text-[#a0aabf] text-sm uppercase tracking-widest font-bold mb-4">Associated Events</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedChar.events.map((event, idx) => (
                                                <span key={idx} className="glass-pill px-4 py-2 text-[#e2e8f0] rounded-xl text-sm hover:border-white/25 transition-all cursor-default">
                                                    {event}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default Characters;
