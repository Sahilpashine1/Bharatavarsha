import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Swords, MapPin, Calendar, Users, Globe, Shield } from 'lucide-react';
import { battlesData } from '../data/battlesData';
import { battleImages } from '../data/battleImages';

const PLACEHOLDER = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Mughal_battle_scene.jpg/640px-Mughal_battle_scene.jpg';

const Battles = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedBattleId, setSelectedBattleId] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [imgErrors, setImgErrors] = useState({});
    const navigate = useNavigate();

    const filteredBattles = battlesData.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.era || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.characters.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const selectedBattle = battlesData.find(b => b.id === selectedBattleId);

    const getBattleImg = (id) => {
        if (imgErrors[id]) return PLACEHOLDER;
        return battleImages[id] || PLACEHOLDER;
    };

    // Parallax bg on mouse move
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
            if (selectedBattleId) return;
            if (e.key === 'ArrowRight') setActiveIndex(prev => Math.min(prev + 1, filteredBattles.length - 1));
            else if (e.key === 'ArrowLeft') setActiveIndex(prev => Math.max(prev - 1, 0));
            else if (e.key === 'Escape') setSelectedBattleId(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredBattles.length, selectedBattleId]);

    // Scroll wheel navigation
    const handleWheel = (e) => {
        if (selectedBattleId || filteredBattles.length === 0) return;
        if (e.deltaY > 0) setActiveIndex(prev => Math.min(prev + 1, filteredBattles.length - 1));
        else if (e.deltaY < 0) setActiveIndex(prev => Math.max(prev - 1, 0));
    };

    return (
        <div
            className="h-screen w-full bg-[#05070f] overflow-hidden relative font-sans text-white select-none"
            onWheel={handleWheel}
        >
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-red-900/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900/10 rounded-full blur-[150px]" />
            </motion.div>

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between px-8 py-5 pointer-events-auto">
                <button
                    onClick={() => navigate('/timeline')}
                    className="text-[#a0aabf] hover:text-red-400 transition-colors flex items-center gap-2 group"
                >
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline font-bold tracking-wider uppercase text-sm">Timeline</span>
                </button>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-500"
                >
                    YUDDHA
                </motion.h1>
                <div className="w-10 h-10 rounded-full border border-red-500/30 glass-red flex items-center justify-center">
                    <Swords size={16} className="text-red-400" />
                </div>
            </header>

            {/* Search Bar */}
            <AnimatePresence>
                {!selectedBattleId && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-6 pointer-events-auto"
                    >
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400/50 group-hover:text-red-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search battles, commanders, eras..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setActiveIndex(0); }}
                                className="glass-input w-full text-white rounded-full py-2.5 pl-11 pr-5 text-sm"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── 3D CAROUSEL ── */}
            <AnimatePresence>
                {!selectedBattleId && filteredBattles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                        <div className="relative w-full h-[65vh] flex items-center justify-center mt-10">
                            {filteredBattles.map((battle, index) => {
                                const offset = index - activeIndex;
                                const absOffset = Math.abs(offset);
                                if (absOffset > 3) return null;

                                const scale = absOffset === 0 ? 1.0 : absOffset === 1 ? 0.78 : 0.62;
                                const xPos = offset * 220;
                                const opacity = 1 - absOffset * 0.28;
                                const blur = absOffset === 0 ? 'blur(0px)' : `blur(${absOffset * 3}px)`;
                                const rotateY = offset * -12;
                                const zIndex = 100 - absOffset;
                                const img = getBattleImg(battle.id);

                                return (
                                    <motion.div
                                        key={battle.id}
                                        layoutId={`card-container-${battle.id}`}
                                        className="absolute cursor-pointer flex flex-col items-center group"
                                        style={{ zIndex }}
                                        animate={{ x: xPos, scale, opacity, rotateY, filter: blur }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.8 }}
                                        onClick={() => {
                                            if (offset === 0) setSelectedBattleId(battle.id);
                                            else setActiveIndex(index);
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Portrait */}
                                            <div className="relative w-52 h-72 md:w-64 md:h-[22rem] flex items-center justify-center">
                                                {/* Focus Reticle */}
                                                {offset === 0 && (
                                                    <motion.div
                                                        layoutId="focus-ring"
                                                        className="absolute inset-[-8px] border border-red-500/40 rounded-xl"
                                                        animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.9, 0.5] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                    >
                                                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
                                                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
                                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />
                                                    </motion.div>
                                                )}

                                                {/* Card */}
                                                <motion.div
                                                    className="w-full h-full rounded-xl overflow-hidden glass-card shadow-2xl relative"
                                                    animate={offset === 0 ? { y: [-4, 4, -4] } : { y: 0 }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                                                    <motion.img
                                                        layoutId={`image-${battle.id}`}
                                                        src={img}
                                                        alt={battle.name}
                                                        loading="lazy"
                                                        onError={() => setImgErrors(prev => ({ ...prev, [battle.id]: true }))}
                                                        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                    {/* Era badge */}
                                                    <div className="absolute top-2 right-2 z-20">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-red-300 glass-red px-2 py-0.5 rounded-full border border-red-500/30">
                                                            {battle.date}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Name label under card — visible for ALL cards */}
                                            <div className={`text-center transition-all duration-300 ${offset === 0 ? 'opacity-100' : 'opacity-55'}`}>
                                                <p className={`font-bold text-white leading-tight drop-shadow-lg ${offset === 0 ? 'text-lg md:text-xl' : 'text-xs md:text-sm'
                                                    }`}>
                                                    {battle.name}
                                                </p>
                                                <p className={`text-red-400 font-semibold uppercase tracking-widest ${offset === 0 ? 'text-[10px] mt-1' : 'text-[8px] mt-0.5'
                                                    }`}>
                                                    {battle.era}
                                                </p>
                                                {/* Key commanders for center card */}
                                                {offset === 0 && battle.characters && battle.characters.length > 0 && (
                                                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                                                        {battle.characters.slice(0, 2).map((c, i) => (
                                                            <span key={i} className="text-[9px] glass-pill text-[#a0aabf] px-2 py-0.5 rounded-full">
                                                                ⚔ {c.split('(')[0].trim()}
                                                            </span>
                                                        ))}
                                                        {battle.characters.length > 2 && (
                                                            <span className="text-[9px] text-[#a0aabf]/40">+{battle.characters.length - 2}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Minimal scrubber */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
                            <span className="text-[#a0aabf]/70 text-xs tabular-nums font-mono">
                                {(activeIndex + 1).toString().padStart(2, '0')}
                            </span>
                            <div className="w-28 h-0.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
                                    animate={{ width: `${((activeIndex + 1) / filteredBattles.length) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <span className="text-[#a0aabf]/30 text-xs tabular-nums font-mono">
                                {filteredBattles.length.toString().padStart(2, '0')}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state */}
            {filteredBattles.length === 0 && !selectedBattleId && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <p className="text-[#a0aabf]">No battles found.</p>
                </div>
            )}

            {/* ── DETAIL VIEW (Shared Element Transition, mirrors Characters page) ── */}
            <AnimatePresence>
                {selectedBattle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#05070f] overflow-hidden pointer-events-auto"
                    >
                        {/* Left: Battle Image */}
                        <motion.div
                            layoutId={`card-container-${selectedBattle.id}`}
                            className="w-full md:w-5/12 h-[45vh] md:h-full relative shrink-0 border-b md:border-b-0 md:border-r border-white/8 shadow-[20px_0_60px_rgba(0,0,0,0.7)] z-20"
                        >
                            <motion.img
                                layoutId={`image-${selectedBattle.id}`}
                                src={getBattleImg(selectedBattle.id)}
                                alt={selectedBattle.name}
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#05070f] md:via-[#05070f]/40 to-transparent opacity-80" />

                            {/* Back */}
                            <button
                                onClick={() => setSelectedBattleId(null)}
                                className="absolute top-6 left-6 md:top-8 md:left-8 px-5 py-2.5 bg-black/80 backdrop-blur-md rounded-full border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center text-white hover:border-red-400 hover:text-red-400 hover:bg-black transition-all group z-30 font-bold tracking-widest text-sm"
                            >
                                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                BACK
                            </button>
                        </motion.div>

                        {/* Right: Info Panel */}
                        <div className="w-full md:w-7/12 h-[55vh] md:h-full overflow-y-auto custom-scrollbar relative z-10 pb-20">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />

                            <motion.div
                                className="max-w-3xl px-8 py-10 md:p-16 lg:p-20"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                                }}
                            >
                                {/* Era + Date */}
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="mb-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-[1px] bg-red-500" />
                                        <p className="text-red-400 text-sm font-bold tracking-[0.2em] uppercase">
                                            {selectedBattle.era} • {selectedBattle.date}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Battle Name */}
                                <motion.h1
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
                                >
                                    {selectedBattle.name}
                                </motion.h1>

                                {/* Location pill */}
                                <motion.div
                                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                                    className="inline-flex items-center gap-2 glass-red border border-red-500/25 px-5 py-2 rounded-full mb-12"
                                >
                                    <MapPin size={13} className="text-red-400" />
                                    <span className="text-[#e2e8f0] font-medium tracking-wide text-sm">
                                        {selectedBattle.location}
                                    </span>
                                </motion.div>

                                {/* Battle Narrative */}
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="mb-12"
                                >
                                    <h3 className="text-red-400 text-xs uppercase tracking-widest font-black mb-5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        Battle Narrative
                                    </h3>
                                    <p className="text-[#a0aabf] text-lg md:text-xl leading-relaxed">
                                        {selectedBattle.details}
                                    </p>
                                </motion.div>

                                {/* Impact quote */}
                                <motion.blockquote
                                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                                    className="mb-12 border-l-4 border-red-600 pl-8 py-2"
                                >
                                    <h3 className="text-red-400 text-xs uppercase tracking-widest font-black mb-3 flex items-center gap-2">
                                        <Globe size={12} /> Historical Impact & Legacy
                                    </h3>
                                    <p className="text-xl md:text-2xl font-serif italic text-[#cbd5e1] leading-relaxed">
                                        "{selectedBattle.impact}"
                                    </p>
                                </motion.blockquote>

                                {/* Key Figures box */}
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="mb-10"
                                >
                                    <div className="glass-card rounded-2xl p-8">
                                        <h3 className="text-white text-lg font-bold mb-5 flex items-center gap-2">
                                            <Users size={16} className="text-red-400" /> Key Figures
                                        </h3>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {selectedBattle.characters.map((char, idx) => (
                                                <span key={idx} className="glass-pill px-4 py-2 text-[#e2e8f0] rounded-xl text-sm">
                                                    {char}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pt-5 border-t border-red-500/10 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[#a0aabf] text-xs uppercase tracking-widest mb-1">Date</p>
                                                <p className="text-white font-semibold flex items-center gap-1.5 text-sm">
                                                    <Calendar size={12} className="text-red-400" /> {selectedBattle.date}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[#a0aabf] text-xs uppercase tracking-widest mb-1">Era</p>
                                                <p className="text-white font-semibold text-sm">{selectedBattle.era}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Battles;
