import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#05070f] text-[#f0f0f0] font-sans relative overflow-x-hidden">

            {/* ── Ambient Background Orbs ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top-left gold orb */}
                <div
                    className="liquid-orb absolute -top-32 -left-32 w-[500px] h-[500px]"
                    style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
                />
                {/* Bottom-right burgundy orb */}
                <div
                    className="liquid-orb absolute -bottom-40 -right-40 w-[600px] h-[600px]"
                    style={{ background: 'radial-gradient(circle, rgba(128,0,0,0.10) 0%, transparent 70%)', animationDelay: '4s' }}
                />
                {/* Center subtle blue orb */}
                <div
                    className="liquid-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
                    style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.06) 0%, transparent 70%)', animationDelay: '2s', animationDuration: '12s' }}
                />
            </div>

            {/* Noise grain overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '200px 200px' }}
            />

            <Navbar />

            <main className="relative z-10 pt-20">
                {children}
            </main>

            {/* Liquid glass footer */}
            <footer className="relative z-10 mt-20 glass-nav border-t border-white/5 py-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/60" />
                        <span className="text-[#d4af37] font-black tracking-[0.3em] uppercase text-xs">Bharat</span>
                        <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/60" />
                    </div>
                    <p className="text-[#a0aabf]/60 text-xs tracking-widest">
                        © {new Date().getFullYear()} History of India Interactive Platform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
