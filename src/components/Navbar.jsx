import React, { useState, useEffect } from 'react';
import { Search, Map, Clock, Users, Sword, Shield, GitMerge, X, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { charactersData } from '../data/charactersData';
import { battlesData } from '../data/battlesData';

const navLinks = [
    { to: '/timeline', icon: Clock, label: 'Timeline' },
    { to: '/maps', icon: Map, label: 'Maps' },
    { to: '/characters', icon: Users, label: 'Characters' },
    { to: '/battles', icon: Sword, label: 'Battles' },
    { to: '/bloodlines', icon: GitMerge, label: 'Bloodlines' },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Prevent scrolling when mobile menu or search is open
    useEffect(() => {
        if (menuOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true);
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [menuOpen, isSearchOpen]);

    // Auto-hide navbar on desktop when cursor leaves top 90px
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Disable auto-hide on mobile devices
            if (window.innerWidth < 768) {
                setIsVisible(true);
                return;
            }
            if (e.clientY <= 90) {
                setIsVisible(true);
            } else {
                if (!menuOpen && !isSearchOpen) {
                    setIsVisible(false);
                }
            }
        };

        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 && window.innerWidth >= 768 && !menuOpen && !isSearchOpen) {
                setIsVisible(false);
            }
        }

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [menuOpen, isSearchOpen]);

    const handleSearchClick = (item, type) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        // To navigate to character/battle explorer. (Assumes they show up there)
        navigate(`/${type}?id=${item.id}`);
    };

    const getSearchResults = () => {
        if (!searchQuery.trim()) return { characters: [], battles: [] };
        const query = searchQuery.toLowerCase();
        return {
            characters: charactersData.filter(c => c.name.toLowerCase().includes(query)).slice(0, 4),
            battles: battlesData.filter(b => b.name.toLowerCase().includes(query)).slice(0, 4)
        };
    };

    const searchResults = getSearchResults();

    return (
        <motion.header
            className="glass-nav fixed top-0 w-full z-50"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : '-100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">

                {/* Logo */}
                <Link to="/timeline" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10">
                        {/* Outer refraction glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4af37]/40 to-[#b8860b]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-10 h-10 rounded-full glass-gold border border-[#d4af37]/40 flex items-center justify-center">
                            <span className="font-cinzel font-bold text-xl text-gold-gradient">भ</span>
                        </div>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-widest uppercase text-gold-gradient">
                        Bharat
                    </h1>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ to, icon: Icon, label }) => {
                        const isActive = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 group
                                    ${isActive
                                        ? 'glass-gold text-[#d4af37]'
                                        : 'text-[#a0aabf] hover:text-white glass-btn'
                                    }`}
                            >
                                <Icon size={14} />
                                {label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute inset-0 rounded-full glass-gold -z-10"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <div className="ml-2 pl-2 border-l border-white/10 flex items-center">
                        <Link
                            to="/admin/login"
                            title="CMS Admin Panel"
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a0aabf] hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-all"
                        >
                            <Shield size={16} />
                        </Link>
                    </div>


                    {/* Search button */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-2 ml-4 px-4 py-2 glass-btn rounded-full text-[#d4af37] text-sm font-semibold tracking-wider border border-[#d4af37]/25 hover:border-[#d4af37]/60 hover:text-[#f1c40f] transition-all cursor-pointer"
                    >
                        <Search size={14} />
                        <span>Search</span>
                    </button>
                </nav>

                {/* Mobile Icons (Search + Hamburger) */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="glass-btn rounded-xl p-2 text-[#d4af37]"
                    >
                        <Search size={18} />
                    </button>
                    <button
                        className="glass-btn rounded-xl p-2 text-[#d4af37]"
                        onClick={() => setMenuOpen(v => !v)}
                    >
                        <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
                            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden glass-modal border-t border-white/5 px-6 py-4 flex flex-col gap-2"
                    >
                        {navLinks.map(({ to, icon: Icon, label }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 glass rounded-xl text-sm font-semibold tracking-wider text-[#f0f0f0] hover:text-[#d4af37] transition-colors"
                            >
                                <Icon size={16} className="text-[#d4af37]" />
                                {label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-24 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative w-full max-w-2xl bg-[#0a0f1a]/90 glass-panel rounded-2xl border border-[#d4af37]/30 shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center gap-4 relative z-10">
                                <Search size={20} className="text-[#d4af37] opacity-60 ml-2" />
                                <input
                                    autoFocus
                                    type="text"
                                    className="flex-1 bg-transparent text-xl font-light text-white outline-none placeholder:text-white/20 placeholder:font-sans font-cinzel"
                                    placeholder="Search characters or battles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button onClick={() => setIsSearchOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {searchQuery.trim() && (
                                <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-6">
                                    {searchResults.characters.length > 0 && (
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-bold mb-3 pl-2">Characters</h3>
                                            <div className="flex flex-col gap-2">
                                                {searchResults.characters.map(char => (
                                                    <button
                                                        key={'char-' + char.id}
                                                        onClick={() => handleSearchClick(char, 'characters')}
                                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group border border-transparent hover:border-white/10"
                                                    >
                                                        <div className="w-10 h-10 rounded bg-[#111827] overflow-hidden flex-shrink-0">
                                                            <img src={char.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'} alt={char.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-cinzel text-white/90 font-bold tracking-wider">{char.name}</h4>
                                                            <p className="text-xs text-white/50">{char.period} • {char.role}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="text-white/20 group-hover:text-[#d4af37] -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {searchResults.battles.length > 0 && (
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3 pl-2">Battles</h3>
                                            <div className="flex flex-col gap-2">
                                                {searchResults.battles.map(battle => (
                                                    <button
                                                        key={'battle-' + battle.id}
                                                        onClick={() => handleSearchClick(battle, 'battles')}
                                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group border border-transparent hover:border-white/10"
                                                    >
                                                        <div className="w-10 h-10 rounded border border-red-500/20 bg-red-500/5 flex items-center justify-center flex-shrink-0">
                                                            <Sword size={16} className="text-red-500/70" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-cinzel text-white/90 font-bold tracking-wider">{battle.name}</h4>
                                                            <p className="text-xs text-white/50">{battle.date} • {battle.location}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="text-white/20 group-hover:text-red-500 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {searchResults.characters.length === 0 && searchResults.battles.length === 0 && (
                                        <div className="text-center py-12 text-white/30 font-light italic">
                                            No historical records found for "{searchQuery}".
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;
