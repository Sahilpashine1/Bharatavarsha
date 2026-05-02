import React, { useRef, useLayoutEffect, useState, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Brain } from 'lucide-react';
import TranslateWidget from './TranslateWidget';
import { erasData } from '../data/historyData';

gsap.registerPlugin(ScrollTrigger);

const eras = [
    { id: 'earth', year: '4.5 Billion BCE', title: 'Formation of Earth', desc: 'The violent birth of our planet.' },
    { id: 'life', year: '3.5 Billion BCE', title: 'Origin of Life', desc: 'First single-celled organisms.' },
    { id: 'prehistoric', year: '2 Million BCE', title: 'Prehistoric Age', desc: 'Stone tools and early humans.' },
    { id: 'ivc', year: '2500 BCE', title: 'Indus Valley', desc: 'First major urbanization.' },
    { id: 'vedic', year: '1500 BCE', title: 'Vedic Period', desc: 'Composition of the Vedas.' },
    { id: 'mahajanapadas', year: '600 BCE', title: 'Mahajanapadas', desc: 'Rise of republics and kingdoms.' },
    { id: 'mauryan', year: '322 BCE', title: 'Mauryan Empire', desc: 'Ashoka spreads Buddhism.' },
    { id: 'gupta', year: '320 CE', title: 'Gupta Empire', desc: 'The Golden Age of India.' },
    { id: 'harsha', year: '606 CE', title: 'Harsha Period', desc: 'Consolidation of North India.' },
    { id: 'delhi', year: '1206 CE', title: 'Delhi Sultanate', desc: 'Turkic and Afghan rule.' },
    { id: 'mughal', year: '1526 CE', title: 'Mughal Empire', desc: 'Grand architecture and integration.' },
    { id: 'maratha', year: '1674 CE', title: 'Maratha Empire', desc: 'Rise of Shivaji and Hindu rule.' },
    { id: 'british', year: '1858 CE', title: 'British Crown Rule', desc: 'India under the British Raj.' },
    { id: 'freedom', year: '1947 CE', title: 'Independence', desc: 'A new nation is born.' },
];

// Simple Book Model representing the Chapter Cover
const BookModel = ({ onOpen, title }) => {
    const bookRef = useRef();
    const [hovered, setHover] = useState(false);
    const [opened, setOpened] = useState(false);
    const coverTexture = useTexture('/assets/book_cover.png');

    useFrame((state, delta) => {
        if (!opened) {
            bookRef.current.rotation.y += delta * 0.2;
        } else {
            // Animate opening
            if (bookRef.current.rotation.y > -Math.PI / 2) {
                bookRef.current.rotation.y -= delta * 2;
            }
            if (bookRef.current.position.z < 3) {
                bookRef.current.position.z += delta * 5;
            } else {
                onOpen(); // Transition to actual chapter view once zoomed
            }
        }
    });

    const handleClick = () => {
        setOpened(true);
    };

    return (
        <group ref={bookRef} onClick={handleClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {/* Book Cover */}
            <RoundedBox args={[3, 4, 0.5]} radius={0.05} scale={hovered && !opened ? 1.05 : 1}>
                <meshStandardMaterial map={coverTexture} roughness={0.8} metalness={0.1} color="#e0c070" />
            </RoundedBox>
            <Text position={[0, 0, 0.26]} fontSize={title.length > 15 ? 0.2 : 0.3} color="#0a0e17" maxWidth={2} textAlign="center" anchorX="center" anchorY="middle">
                {title}
            </Text>
            {/* Pages edge */}
            <mesh position={[1.45, 0, 0]}>
                <boxGeometry args={[0.05, 3.8, 0.4]} />
                <meshStandardMaterial color="#fdf6e3" />
            </mesh>
        </group>
    );
};

const TimelineSlider = () => {
    const containerRef = useRef(null);
    const sliderRef = useRef(null);
    const [selectedEra, setSelectedEra] = useState(null);
    const [isReading, setIsReading] = useState(false);
    const [isBookView, setIsBookView] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let ctx = gsap.context(() => {
            const slider = sliderRef.current;
            const totalScroll = slider.scrollWidth - window.innerWidth;

            gsap.to(slider, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    end: () => `+= ${totalScroll} `,
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="h-screen bg-[#0a0e17] overflow-hidden flex items-center relative border-t border-[#d4af37]/20">
            <div className="absolute top-10 left-10 z-10">
                <h3 className="text-3xl font-bold text-[#d4af37] tracking-widest uppercase mb-2">The Timeline</h3>
                <p className="text-[#a0aabf]">Scroll down to travel through time.</p>
            </div>

            <div ref={sliderRef} className="flex h-[60vh] pl-[10vw] pr-[20vw] items-center gap-20">
                {/* Timeline Line */}
                <div className="absolute top-1/2 left-0 w-[500%] h-0.5 bg-gradient-to-r from-[#121826] via-[#d4af37] to-[#121826] -translate-y-1/2 -z-10" />

                {eras.map((era, index) => (
                    <div key={era.id} className="w-[300px] flex-shrink-0 relative group perspective-1000">
                        {/* Timeline node */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#d4af37] shadow-[0_0_15px_#d4af37] group-hover:scale-150 transition-transform duration-300 z-10" />

                        {/* Content Card */}
                        <div className={`p-6 border border-[#d4af37]/30 bg-[#121826]/80 backdrop-blur-sm rounded-lg shadow-xl transition-all duration-500 group-hover:border-[#d4af37] group-hover:-translate-y-2 relative ${index % 2 === 0 ? 'mb-[200px]' : 'mt-[200px]'}`}>
                            <span className="text-sm font-bold text-[#f1c40f] tracking-widest mb-2 block">{era.year}</span>
                            <h4 className="text-xl font-bold text-white mb-2">{era.title}</h4>
                            <p className="text-[#a0aabf] text-sm mb-4 leading-relaxed">{era.desc}</p>

                            <button
                                onClick={() => { setSelectedEra(erasData[era.id]); setIsReading(false); }}
                                className="inline-block mt-auto text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:text-[#f1c40f] border-b border-transparent hover:border-[#f1c40f] transition-all pb-1 cursor-pointer"
                            >
                                Read History →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Era Detail Modal */}
            <AnimatePresence>
                {selectedEra && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setSelectedEra(null); setIsReading(false); }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                        />

                        {!isReading ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative z-10 w-full max-w-4xl h-[85vh] flex flex-col items-center justify-center pointer-events-none"
                            >
                                <h2 className="text-[#d4af37] text-2xl tracking-[0.3em] uppercase mb-8 opacity-80 animate-pulse text-center">
                                    Click the Archive to Open
                                </h2>
                                <div className="w-full h-[60vh] pointer-events-auto">
                                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                                        <ambientLight intensity={0.5} />
                                        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#d4af37" />
                                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4b6584" />
                                        <Suspense fallback={null}>
                                            <BookModel onOpen={() => setTimeout(() => setIsReading(true), 500)} title={selectedEra.title} />
                                        </Suspense>
                                        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
                                    </Canvas>
                                </div>
                                <button
                                    onClick={() => { setSelectedEra(null); setIsReading(false); }}
                                    className="absolute top-0 right-0 p-4 pointer-events-auto text-white/50 hover:text-white"
                                >
                                    <X size={30} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="relative w-[98vw] md:w-[96vw] max-w-none h-[98vh] bg-[#0a0f1a]/98 glass-panel rounded-2xl border border-[#d4af37]/30 shadow-2xl flex flex-col overflow-hidden"
                            >
                                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full h-full">

                                    {/* Header Section (Now scrolls with content) */}
                                    <div className="flex-shrink-0 p-6 pt-16 md:p-12 md:pt-24 border-b border-white/10 flex justify-between items-start w-full mx-auto md:w-[96%] lg:w-[92%] relative z-10 mb-8 mt-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <button onClick={() => setIsReading(false)} className="text-[#a0aabf] hover:text-[#d4af37] text-xs font-bold uppercase tracking-widest mr-4 flex items-center gap-1 transition-colors">
                                                    ← Back to Cover
                                                </button>
                                                <button
                                                    onClick={() => setIsBookView(!isBookView)}
                                                    className={`w-8 h-8 rounded-full border ${isBookView ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[0_0_15px_#d4af37]' : 'border-[#d4af37]/30 glass-gold text-[#d4af37]'} flex items-center justify-center hover:bg-[#d4af37]/80 hover:text-black transition-all`}
                                                    title="Toggle Book View"
                                                >
                                                    <BookOpen size={14} className={isBookView ? 'text-black' : 'text-[#d4af37]'} />
                                                </button>
                                                <span className="text-[#d4af37] font-mono text-sm tracking-widest uppercase mr-4">{selectedEra.period}</span>

                                                <div className="flex items-center gap-3">
                                                    <TranslateWidget />
                                                    <button
                                                        onClick={() => navigate(`/quiz/${selectedEra.id}`)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
                                                    >
                                                        <Brain size={14} />
                                                        Take Quiz
                                                    </button>
                                                </div>
                                            </div>
                                            <h2 className="text-4xl md:text-7xl font-cinzel font-bold text-white tracking-wider glow-text mb-6">
                                                {selectedEra.title}
                                            </h2>
                                            <p className="text-[#a0aabf] text-lg md:text-xl leading-relaxed w-full md:w-[90%]">
                                                {selectedEra.intro}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content Scroll Area */}
                                    <div className={`p-6 md:p-12 relative z-10 w-full mx-auto md:w-[96%] lg:w-[92%] transition-all duration-500
                                        ${isBookView ? 'columns-1 lg:columns-2 gap-20 space-y-0 book-layout' : 'space-y-16'}`}>
                                        {selectedEra.sections && selectedEra.sections.map((section, idx) => (
                                            <div key={idx} className={`w-full ${isBookView ? 'break-inside-avoid mb-10' : 'space-y-6'}`}>
                                                <h3 className={`font-bold text-[#f1c40f] tracking-wide border-b border-white/10 ${isBookView ? 'text-2xl pb-2 mb-6' : 'text-3xl md:text-4xl pb-4'}`}>
                                                    {section.heading}
                                                </h3>
                                                <p className={`text-white/90 font-light ${isBookView ? 'text-lg md:text-xl leading-[2.2] text-justify' : 'leading-[2.4] text-xl md:text-2xl'}`}>
                                                    {section.content}
                                                </p>

                                                {section.evidence && section.evidence.length > 0 && (
                                                    <div className={`border-[#d4af37]/40 bg-[#d4af37]/5 rounded-r-xl ${isBookView ? 'mt-6 p-4 border-l-2 text-justify' : 'mt-6 p-5 border-l-2 text-lg'}`}>
                                                        <h4 className={`font-bold uppercase tracking-widest text-[#d4af37] mb-3 ${isBookView ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>Historical Evidence</h4>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {section.evidence.map((item, idxi) => (
                                                                <li key={idxi} className={`text-[#a0aabf] ${isBookView ? 'text-sm md:text-base leading-relaxed' : 'text-base md:text-lg leading-relaxed'}`}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {selectedEra.references && (
                                            <div className={`border-t border-white/10 ${isBookView ? 'pt-6 mt-10 mb-10 break-inside-avoid' : 'pt-10 mt-16 mb-16'}`}>
                                                <h4 className={`font-bold uppercase tracking-widest text-[#a0aabf] mb-4 ${isBookView ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>Scholarly References</h4>
                                                <ul className="space-y-3">
                                                    {selectedEra.references.map((ref, idx) => (
                                                        <li key={idx} className={`text-white/40 italic ${isBookView ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>Cite: {ref}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TimelineSlider;
