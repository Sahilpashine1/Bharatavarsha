import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const StartJourney = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-b from-[#0a0e17] to-[#121826] overflow-hidden"
            >
                {/* Background glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 p-8 max-w-4xl mx-auto flex flex-col items-center">
                    <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="text-[#d4af37] tracking-[0.3em] text-sm md:text-base font-semibold mb-6 uppercase"
                    >
                        An Interactive Epic
                    </motion.span>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-6xl md:text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0f0f0] to-[#a0aabf] leading-tight flex flex-col items-center"
                    >
                        <span className="mb-2">Complete</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">History of India</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        className="text-lg md:text-2xl text-[#a0aabf] max-w-3xl mb-16 leading-relaxed"
                    >
                        Every empire rises and falls. Every epoch leaves its mark. <br />
                        Step into a continuous cinematic journey from the volcanic birth of the Earth to the dawn of an independent nation.
                    </motion.p>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                        onClick={() => navigate('/timeline')}
                        className="group relative px-12 py-5 bg-[#d4af37]/10 border border-[#d4af37] overflow-hidden rounded-full text-[#d4af37] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    >
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-3">
                            Start Journey
                            <span className="text-xl inline-block group-hover:translate-x-2 transition-transform">→</span>
                        </span>
                        <div className="absolute inset-0 bg-[#d4af37] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </motion.button>
                </div>
            </motion.div>
        </Layout>
    );
};

export default StartJourney;
