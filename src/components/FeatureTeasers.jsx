import React from 'react';
import { Users, Swords } from 'lucide-react';

const FeatureTeasers = () => {
    return (
        <section className="py-24 bg-[#05070a] px-6 relative border-t border-[#d4af37]/20">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Deep Dives</h3>
                    <p className="text-[#a0aabf] max-w-2xl mx-auto">Explore the individuals who shaped the subcontinent and the conflicts that redrew its maps.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Character Explorer */}
                    <div className="group relative overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#0a0e17] p-8 hover:border-[#d4af37] transition-all duration-500 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#121826] border border-[#d4af37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Users className="text-[#d4af37]" size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">Character Explorer</h4>
                            <p className="text-[#a0aabf] mb-8">
                                From Ashoka to Akbar, Gandhi to Bose. Dive into the lives of the rulers, thinkers, and revolutionaries of India.
                            </p>
                            <button className="text-[#d4af37] font-bold uppercase tracking-widest text-sm flex items-center gap-2 group-hover:text-[#f1c40f]">
                                Explore Personalities
                                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Battle Explorer */}
                    <div className="group relative overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#0a0e17] p-8 hover:border-[#d4af37] transition-all duration-500 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#121826] border border-red-500/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Swords className="text-red-400" size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">Battle Explorer</h4>
                            <p className="text-[#a0aabf] mb-8">
                                Interactive maps of Kalinga, Panipat, Plassey, and more. Understand the strategies and outcomes of major conflicts.
                            </p>
                            <button className="text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 group-hover:text-red-300">
                                Explore Battles
                                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureTeasers;
