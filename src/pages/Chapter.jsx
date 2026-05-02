import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, useTexture } from '@react-three/drei';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { getEraData } from '../data/historyData';

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

const Chapter = () => {
    const { id } = useParams();
    const [isReading, setIsReading] = useState(false);
    const [eraData, setEraData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setEraData(getEraData(id));
        // Reset reading state if user navigates to a different era directly
        setIsReading(false);
    }, [id]);

    if (!eraData) return null;

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative min-h-[90vh] bg-[#0a0e17]"
            >
                {!isReading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                        <button onClick={() => navigate(-1)} className="absolute top-10 left-10 text-[#a0aabf] hover:text-[#d4af37] z-50 transition-colors flex items-center gap-2">
                            ← Back to Timeline
                        </button>
                        <h2 className="text-[#d4af37] text-2xl tracking-[0.3em] uppercase mb-8 opacity-80 animate-pulse text-center px-4">
                            Click the Archive to Open
                        </h2>
                        <div className="w-full h-[60vh]">
                            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                                <ambientLight intensity={0.5} />
                                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#d4af37" />
                                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4b6584" />
                                <Suspense fallback={null}>
                                    <BookModel onOpen={() => setTimeout(() => setIsReading(true), 500)} title={eraData.title} />
                                </Suspense>
                                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
                            </Canvas>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto py-20 px-6"
                    >
                        <button onClick={() => navigate(-1)} className="text-[#a0aabf] hover:text-[#d4af37] mb-8 transition-colors flex items-center gap-2">
                            ← Back to Timeline
                        </button>
                        <h1 className="text-5xl md:text-7xl font-bold text-[#d4af37] mb-6">{eraData.title}</h1>
                        <p className="text-[#a0aabf] uppercase tracking-widest text-sm mb-12">{eraData.period}</p>

                        <div className="prose prose-invert prose-lg text-[#f0f0f0] max-w-none">
                            <h3 className="text-3xl text-white mb-6 font-bold border-b border-[#d4af37]/30 pb-4 inline-block">Introduction</h3>
                            <p className="text-[#cbd5e1] mb-10 leading-relaxed text-xl">
                                {eraData.intro}
                            </p>

                            {eraData.mapImage && (
                                <div className="mb-14 overflow-hidden rounded-xl border border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/20 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                                    <div className="absolute top-4 right-4 bg-[#0a0e17]/80 backdrop-blur-sm border border-[#d4af37]/50 px-4 py-2 rounded-full z-20">
                                        <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Historical Map</span>
                                    </div>
                                    <img src={eraData.mapImage} alt={`${eraData.title} Map`} className="w-full max-h-[500px] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                </div>
                            )}

                            {eraData.sections.map((section, idx) => (
                                <div key={idx} className="mb-14">
                                    <h3 className="text-3xl text-white mb-6 font-bold border-b border-[#d4af37]/30 pb-4 inline-block">{section.heading}</h3>
                                    <p className="text-[#cbd5e1] mb-10 leading-relaxed text-xl">
                                        {section.content}
                                    </p>

                                    {section.evidence && section.evidence.length > 0 && (
                                        <div className="p-10 border border-[#d4af37]/40 rounded-xl bg-[#121826] shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-bl-full pointer-events-none" />
                                            <h4 className="text-[#f1c40f] text-2xl mb-6 font-bold">Historical Evidence</h4>
                                            <ul className="text-[#cbd5e1] space-y-4 list-disc list-inside text-lg">
                                                {section.evidence.map((item, i) => (
                                                    <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/^([^:]+):/, '<strong class="text-white">$1:</strong>') }} />
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-24 pt-10 border-t border-[#d4af37]/20 flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-[#a0aabf] px-4 bg-[#05070a]/50 p-6 rounded-xl gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="font-bold text-[#d4af37] uppercase tracking-widest text-xs">Primary References:</span>
                                {eraData.references && eraData.references.length > 0 ? (
                                    <ul className="space-y-1 opacity-80 list-disc list-inside">
                                        {eraData.references.map((ref, idx) => (
                                            <li key={idx}>{ref}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="opacity-80">General References: NCERT, Archaeological Survey, National Archives</span>
                                )}
                            </div>
                            <button className="text-[#d4af37] font-bold uppercase tracking-widest hover:text-[#f1c40f] transition-colors flex items-center gap-2 mt-4 md:mt-0">
                                Back to Timeline <span className="text-xl">↑</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </Layout>
    );
};

export default Chapter;
