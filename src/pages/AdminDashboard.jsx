import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Swords, Map, LogOut,
    TrendingUp, Activity, Globe, Clock, Shield
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

// --- MOCK DATA FOR ANALYTICS ---
const trafficData = [
    { name: 'Mon', visitors: 4000, pageViews: 8400, sessionLength: 2.4 },
    { name: 'Tue', visitors: 3000, pageViews: 6398, sessionLength: 2.1 },
    { name: 'Wed', visitors: 2000, pageViews: 5800, sessionLength: 1.8 },
    { name: 'Thu', visitors: 2780, pageViews: 7908, sessionLength: 2.5 },
    { name: 'Fri', visitors: 1890, pageViews: 4800, sessionLength: 1.5 },
    { name: 'Sat', visitors: 5390, pageViews: 9800, sessionLength: 3.2 },
    { name: 'Sun', visitors: 6490, pageViews: 11300, sessionLength: 3.8 },
];

const deviceData = [
    { name: 'Mobile', value: 65, fill: '#4fc3f7' },
    { name: 'Desktop', value: 30, fill: '#d4af37' },
    { name: 'Tablet', value: 5, fill: '#ce93d8' },
];

// --- ADMIN LAYOUT WRAPPER ---
export const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Basic Auth Check
        if (!localStorage.getItem('adminAuth')) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'characters', label: 'Characters DB', icon: Users, path: '/admin/content/characters' },
        { id: 'battles', label: 'Battles DB', icon: Swords, path: '/admin/content/battles' },
        { id: 'eras', label: 'Eras & Maps DB', icon: Map, path: '/admin/content/eras' },
    ];

    return (
        <div className="flex h-screen bg-[#05070f] text-white font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-[#05070f]/80 backdrop-blur-xl flex flex-col z-20 shrink-0">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                        <h2 className="font-black text-gold-gradient tracking-widest text-lg leading-none">BHOOMI</h2>
                        <span className="text-[10px] text-[#a0aabf] tracking-[0.2em] uppercase">Control Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#a0aabf]/50 mb-4 mt-2">Systems</p>
                    {navItems.map(item => {
                        const isActive = location.pathname.includes(item.path);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                                        : 'text-[#a0aabf] hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        Secure Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 relative overflow-y-auto custom-scrollbar">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

                <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

// --- DASHBOARD VIEW ---
const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">System Logs & Analytics</h1>
                    <p className="text-[#a0aabf] mt-1 text-sm">Real-time metrics for Bhoomi servers.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-mono text-[#a0aabf]">
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Operational
                </div>
            </div>

            {/* TOP METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Page Views', value: '54.2K', trend: '+12.5%', icon: Activity, color: '#4fc3f7' },
                    { label: 'Unique Visitors', value: '18.9K', trend: '+5.2%', icon: Users, color: '#ce93d8' },
                    { label: 'Avg Session (Min)', value: '08:45', trend: '+1.1%', icon: Clock, color: '#a5d6a7' },
                    { label: 'Global Reach', value: '42', subtitle: 'Countries', icon: Globe, color: '#ffb74d' },
                ].map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex flex-col justify-between"
                        style={{ borderTop: `2px solid ${card.color}40` }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                                <card.icon size={20} style={{ color: card.color }} />
                            </div>
                            {card.trend && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                                    {card.trend}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white">{card.value}</h3>
                            <p className="text-[#a0aabf] text-sm mt-1">{card.subtitle || card.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Main Traffic Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-modal p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp size={18} className="text-[#d4af37]" />
                            Traffic Overview (7 Days)
                        </h3>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#a0aabf" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a0aabf" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(5,7,15,0.9)', borderColor: 'rgba(212,175,55,0.2)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Device Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-modal p-6 flex flex-col"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Device Breakdown</h3>
                    <div className="flex-1 min-h-[300px] w-full flex flex-col justify-center gap-6">
                        {deviceData.map((device, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[#a0aabf] font-medium">{device.name}</span>
                                    <span className="text-white font-bold">{device.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${device.value}%` }}
                                        transition={{ duration: 1, delay: 0.8 + (idx * 0.2) }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: device.fill }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#a0aabf] leading-relaxed">
                            <strong className="text-white">Note:</strong> Mobile traffic dominates due to Instagram marketing campaigns. Ensure UI changes inside the CMS are tested on mobile viewport constraints.
                        </div>
                    </div>
                </motion.div>

            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
