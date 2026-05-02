import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FeatureTeasers from '../components/FeatureTeasers';

const Home = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <section className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative overflow-hidden flex-grow">
                    {/* Background glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 text-center flex flex-col items-center mt-[-5vh]">
                        <span className="text-[#d4af37] tracking-[0.2em] text-sm md:text-base font-semibold mb-6 uppercase">Interactive Educational Platform</span>
                        <h2 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0f0f0] to-[#8a8d98] leading-tight flex flex-col items-center">
                            <span className="mb-2">Bharatavarsha</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-4xl md:text-6xl mt-2">An Interactive History</span>
                        </h2>
                        <p className="text-lg md:text-xl text-[#a0aabf] max-w-2xl mb-12 leading-relaxed">
                            Journey through time from the formation of the Earth to 1946. Explore our continuous cinematic story mode and interactive timeline.
                        </p>
                        <button
                            onClick={() => navigate('/timeline')}
                            className="group relative px-10 py-5 bg-[#121826] border border-[#d4af37]/50 overflow-hidden rounded text-[#d4af37] font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-[#d4af37]"
                        >
                            <span className="relative z-10 group-hover:text-[#0a0e17] transition-colors duration-300">Start Journey</span>
                            <div className="absolute inset-0 bg-[#d4af37] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                        </button>
                    </div>
                </section>


                {/* Feature Teasers Section */}
                <FeatureTeasers />
            </motion.div>
        </Layout>
    );
};

export default Home;
