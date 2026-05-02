import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, Eye, EyeOff, Lock } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulated network delay
        setTimeout(() => {
            // Hardcoded prototype password
            if (password === 'bhoomi2024') {
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin/dashboard');
            } else {
                setError('Invalid admin credentials');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#05070f] relative flex items-center justify-center overflow-hidden font-sans text-white">
            {/* Ambient background glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#2d3748]/40 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-8 sm:p-12 glass shadow-2xl rounded-3xl border border-white/10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative group">
                        <Shield className="w-8 h-8 text-[#d4af37]" />
                        <div className="absolute inset-0 border border-[#d4af37]/30 rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h1 className="text-3xl font-black tracking-widest text-gold-gradient mb-2">BHOOMI CMS</h1>
                    <p className="text-[#a0aabf] text-sm">Authorised Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[#a0aabf] mb-2 ml-1">Admin Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Key className="w-4 h-4 text-[#a0aabf]" />
                            </div>
                            <input
                                type={showPwd ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#a0aabf]/50 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/10 transition-all font-mono"
                                placeholder="Enter password"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#a0aabf] hover:text-white transition-colors"
                            >
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {error && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-3 flex items-center gap-1.5 ml-1">
                                <Lock className="w-3 h-3" /> {error}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full relative group overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 py-3.5 transition-all hover:bg-[#d4af37]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 font-bold uppercase tracking-widest text-sm text-[#d4af37]">
                            {isLoading ? 'Authenticating...' : 'Access Systems'}
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => navigate('/timeline')} className="text-xs text-[#a0aabf] hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
                        Return to Public Website
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
