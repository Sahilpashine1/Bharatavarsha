import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { charactersData } from '../data/charactersData';
import { familyTreesData } from '../data/familyTreesData';
import { Users, ChevronRight, Share2, ZoomIn, ZoomOut, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Bloodlines = () => {
    const navigate = useNavigate();
    const [selectedTreeId, setSelectedTreeId] = useState(familyTreesData[0].id);
    const [zoom, setZoom] = useState(1);
    const [selectedChar, setSelectedChar] = useState(null);

    // Look up full character object by ID
    const getCharacter = (id) => charactersData.find(c => c.id === id) || { name: id };

    // Current active tree
    const activeTree = useMemo(() => {
        return familyTreesData.find(t => t.id === selectedTreeId);
    }, [selectedTreeId]);

    // Recursive component to render tree nodes & SVG connector lines
    const TreeNode = ({ node, isRoot = false }) => {
        const char = getCharacter(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className="flex flex-col items-center">
                {/* Connection Line from Parent */}
                {!isRoot && (
                    <div className="w-[2px] h-8 bg-gradient-to-b from-[#d4af37]/80 to-[#d4af37]/20 glow-line-vertical"></div>
                )}

                {/* The Character Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative group flex flex-col items-center z-10 cursor-pointer"
                    onClick={() => setSelectedChar(char)}
                >
                    <div className="w-32 h-40 rounded-xl overflow-hidden glass-card p-1 shadow-2xl shadow-black/80 border border-white/5 group-hover:border-[#d4af37]/50 transition-colors">
                        <div className="w-full h-24 relative overflow-hidden rounded-t-lg bg-black/40">
                            <img
                                src={char.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                                alt={char.name}
                                className="w-full h-full object-cover object-top grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                    e.target.parentElement.innerHTML = `<span class="font-cinzel text-4xl font-black text-white/10 glow-text">${char.name.charAt(0)}</span>`;
                                }}
                            />
                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#111827] to-transparent"></div>
                        </div>
                        <div className="p-2 text-center bg-[#111827]">
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider truncate glow-text">{char.name}</h4>
                            {node.spouse && (
                                <p className="text-[9px] text-[#a0aabf] italic mt-0.5 truncate border-t border-white/10 pt-0.5">m. {node.spouse}</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Connection Line to Children array */}
                {hasChildren && (
                    <div className="flex flex-col items-center">
                        <div className="w-[2px] h-6 bg-gradient-to-b from-[#d4af37]/80 to-[#d4af37]/20 relative z-0 glow-line-vertical"></div>

                        {/* Horizontal Bracket if multiple children */}
                        {node.children.length > 1 && (
                            <div className="flex justify-between relative mt-[-1px] z-0 glow-line-horizontal"
                                style={{
                                    width: `calc(100% - ${100 / node.children.length}%)`,
                                    height: '2px',
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.8) 5%, rgba(212,175,55,0.8) 95%, transparent 100%)'
                                }}>
                            </div>
                        )}

                        {/* Render Children Row */}
                        <div className="flex justify-center gap-12 pt-0 items-start relative z-10">
                            {node.children.map((child, idx) => (
                                <div key={child.id} className="relative flex flex-col items-center">
                                    {/* The top little stub connecting the horizontal line to the child */}
                                    {node.children.length > 1 && (
                                        <div className="w-[2px] h-4 bg-gradient-to-b from-[#d4af37]/80 to-[#d4af37]/20 glow-line-vertical"></div>
                                    )}
                                    <TreeNode node={child} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-app-bg text-white pt-24 pb-12 relative overflow-hidden flex font-sans">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-40 w-10 h-10 rounded-full glass-btn flex items-center justify-center text-[#d4af37]/80 hover:text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all hover:-translate-x-1"
                title="Go Back"
            >
                <ArrowLeft size={18} />
            </button>

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-[-20%] w-[800px] h-[800px] bg-gradient-to-tl from-[#1a2333]/40 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            {/* Sidebar Data Selection */}
            <div className="w-80 border-r border-white/5 flex flex-col px-6 h-[calc(100vh-6rem)] relative z-20 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full glass-gold flex items-center justify-center">
                        <Share2 size={18} className="text-[#f1c40f]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-cinzel font-bold text-white tracking-wider glow-text uppercase">Bloodlines</h2>
                        <p className="text-xs text-[#a0aabf] font-light">Dynastic Family Trees</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {familyTreesData.map((tree) => (
                        <button
                            key={tree.id}
                            onClick={() => setSelectedTreeId(tree.id)}
                            className={`flex flex-col items-start px-5 py-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                             ${selectedTreeId === tree.id
                                    ? 'glass-card border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/5'
                                    : 'glass-btn border-white/5 hover:border-white/20'}`}
                        >
                            {selectedTreeId === tree.id && (
                                <motion.div
                                    layoutId="active-tree-indicator"
                                    className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent -z-10"
                                />
                            )}
                            <div className="flex justify-between w-full items-center">
                                <span className={`text-sm tracking-widest uppercase font-bold text-left ${selectedTreeId === tree.id ? 'text-[#d4af37] glow-text' : 'text-[#e2e8f0]'}`}>
                                    {tree.name}
                                </span>
                                <ChevronRight size={14} className={`transition-transform duration-300 ${selectedTreeId === tree.id ? 'text-[#d4af37] translate-x-1' : 'text-white/20'}`} />
                            </div>
                            <span className="text-[10px] text-[#a0aabf] mt-1 font-mono uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                                {tree.era}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 overflow-hidden relative glass-panel ml-6 mr-6 rounded-3xl border border-white/5 flex flex-col">
                {/* Canvas Controls */}
                <div className="absolute top-6 right-6 z-30 flex gap-2">
                    <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} className="w-10 h-10 rounded-full glass-btn flex items-center justify-center text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-all">
                        <ZoomOut size={16} />
                    </button>
                    <button onClick={() => setZoom(1)} className="px-4 h-10 rounded-full glass-btn flex items-center justify-center text-white/50 hover:text-white text-xs font-bold tracking-wider border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                        RESET
                    </button>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="w-10 h-10 rounded-full glass-btn flex items-center justify-center text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-all">
                        <ZoomIn size={16} />
                    </button>
                </div>

                {/* Draggable Pan-Zoom Canvas Wrapper */}
                <div className="flex-1 w-full h-[80vh] overflow-auto custom-scrollbar flex items-start justify-center pt-24 cursor-grab active:cursor-grabbing">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTree.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            className="pb-32 px-24"
                        >
                            <TreeNode node={activeTree.tree} isRoot={true} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Character Details Modal Overlay */}
                <AnimatePresence>
                    {selectedChar && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedChar(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedChar(null)}
                                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full glass-btn flex items-center justify-center text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-all hover:rotate-90"
                                >
                                    <X size={18} />
                                </button>

                                {/* Left: Big Portrait */}
                                <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-[#0a0f1a]">
                                    <img
                                        src={selectedChar.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                                        alt={selectedChar.name}
                                        className="w-full h-full object-cover object-top filter brightness-[0.8] contrast-125 mix-blend-luminosity"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                            e.target.parentElement.innerHTML = `<span class="font-cinzel text-8xl font-black text-white/5 select-none">${selectedChar.name.charAt(0)}</span>`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111827] via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h2 className="text-3xl md:text-4xl font-cinzel font-black tracking-widest text-[#d4af37] drop-shadow-lg leading-tight uppercase relative z-10 glow-text break-words">
                                            {selectedChar.name.replace(/_/g, ' ')}
                                        </h2>
                                        <p className="text-sm text-[#a0aabf] font-mono tracking-widest uppercase mt-2">{selectedChar.role}</p>
                                    </div>
                                </div>

                                {/* Right: Info Scroll */}
                                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col gap-8 bg-[#111827]/80 backdrop-blur-xl relative z-10 text-left">
                                    {selectedChar.quote && (
                                        <div className="relative pl-6 py-2 border-l-2 border-[#d4af37]/40">
                                            <p className="text-xl md:text-2xl font-cinzel italic text-white/90 drop-shadow-md">"{selectedChar.quote}"</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="glass-card p-4 rounded-xl border border-white/5">
                                            <h3 className="text-xs text-[#a0aabf] font-bold uppercase tracking-widest mb-1">Period</h3>
                                            <p className="text-[#f1c40f] font-cinzel font-semibold">{selectedChar.period}</p>
                                        </div>
                                        <div className="glass-card p-4 rounded-xl border border-white/5">
                                            <h3 className="text-xs text-[#a0aabf] font-bold uppercase tracking-widest mb-1">Significance</h3>
                                            <p className="text-sm text-white/80">{selectedChar.eraElement}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm text-[#d4af37] font-bold uppercase tracking-widest border-b border-white/10 pb-2">Historical Background</h3>
                                        <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
                                            {selectedChar.background}
                                        </p>
                                    </div>

                                    {selectedChar.earlyLife && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm text-[#d4af37] font-bold uppercase tracking-widest border-b border-white/10 pb-2">Early Life</h3>
                                            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
                                                {selectedChar.earlyLife}
                                            </p>
                                        </div>
                                    )}

                                    {selectedChar.deathAndLegacy && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm text-[#d4af37] font-bold uppercase tracking-widest border-b border-white/10 pb-2">Death & Legacy</h3>
                                            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
                                                {selectedChar.deathAndLegacy}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Bloodlines;
