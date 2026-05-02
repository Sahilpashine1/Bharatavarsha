import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from './AdminDashboard';
import { Search, Edit2, Check, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import our hardcoded original mock databases
import { battlesData } from '../data/battlesData';
import { charactersData } from '../data/charactersData';
import { ERAS } from './Maps'; // Exposing ERAS from Maps roughly or duplicating a mock list

const MOCK_MAPS_DB = [
    { id: 'indus', name: 'Indus Valley', year: '2500 BCE' },
    { id: 'maurya', name: 'Mauryan Empire', year: '260 BCE' },
    { id: 'gupta', name: 'Gupta Empire', year: '380 CE' },
    { id: 'mughal', name: 'Mughal Empire', year: '1700 CE' },
    { id: 'british', name: 'British Raj', year: '1858 CE' },
];

export const AdminContent = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('characters');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);

    // Editor State
    const [editingItem, setEditingItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    // Determine active database based on URL
    useEffect(() => {
        if (location.pathname.includes('characters')) setActiveTab('characters');
        else if (location.pathname.includes('battles')) setActiveTab('battles');
        else if (location.pathname.includes('eras')) setActiveTab('eras');
    }, [location]);

    // Load Data
    useEffect(() => {
        // In a real app, this would be an API fetch. Here we load from localStorage OR fallback to hardcoded JS
        const loadDB = (key, fallback) => {
            const stored = localStorage.getItem(`db_${key}`);
            return stored ? JSON.parse(stored) : fallback;
        };

        if (activeTab === 'characters') setData(loadDB('characters', charactersData));
        else if (activeTab === 'battles') setData(loadDB('battles', battlesData));
        else if (activeTab === 'eras') setData(loadDB('eras', MOCK_MAPS_DB)); // Mock maps list for prototype
    }, [activeTab]);

    const handleEditClick = (item) => {
        setEditingItem({ ...item }); // Clone for editing
    };

    const handleSave = () => {
        setIsSaving(true);

        // Simulate network delay
        setTimeout(() => {
            const updatedData = data.map(item =>
                (item.id === editingItem.id || item.name === editingItem.name) ? editingItem : item
            );

            setData(updatedData);
            localStorage.setItem(`db_${activeTab}`, JSON.stringify(updatedData));

            setIsSaving(false);
            setEditingItem(null);

            setSavedMessage('Data successfully updated to live server.');
            setTimeout(() => setSavedMessage(''), 3000);
        }, 800);
    };

    const filteredData = data.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.role?.toLowerCase().includes(search.toLowerCase()) ||
        item.era?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white capitalize">{activeTab} Database</h1>
                    <p className="text-[#a0aabf] mt-1 text-sm">Manage live website content. Edits are immediate.</p>
                </div>

                {/* Search */}
                <div className="relative mt-4 md:mt-0 w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0aabf]" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder-[#a0aabf]/50"
                    />
                </div>
            </div>

            {savedMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
                >
                    <Check size={16} /> {savedMessage}
                </motion.div>
            )}

            {/* DATA TABLE */}
            <div className="glass-modal rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-[#a0aabf] uppercase tracking-wider">Name / ID</th>
                                <th className="p-4 text-xs font-bold text-[#a0aabf] uppercase tracking-wider">Sub-text / Role</th>
                                <th className="p-4 text-xs font-bold text-[#a0aabf] uppercase tracking-wider">Era / Date</th>
                                <th className="p-4 text-xs font-bold text-[#a0aabf] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredData.slice(0, 15).map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 font-bold text-white whitespace-nowrap">
                                        {item.name}
                                    </td>
                                    <td className="p-4 text-sm text-[#a0aabf] truncate max-w-[200px]">
                                        {item.role || item.location || '—'}
                                    </td>
                                    <td className="p-4 flex items-center gap-2">
                                        <span className="glass-pill px-2.5 py-1 text-xs text-[#d4af37] border-[#d4af37]/20 whitespace-nowrap">
                                            {item.era || item.date || item.year || '—'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 text-[#a0aabf] hover:text-white hover:bg-[#d4af37]/20 border border-transparent hover:border-[#d4af37]/30 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredData.length > 15 && (
                        <div className="p-4 text-center border-t border-white/5 text-xs text-[#a0aabf]">
                            Showing 15 of {filteredData.length} records. Use search to find specific items.
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {editingItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl glass shadow-2xl rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                                <h2 className="text-xl font-black text-white">Edit Record</h2>
                                <button
                                    onClick={() => setEditingItem(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-[#a0aabf] transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form Body */}
                            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#a0aabf] mb-2 ml-1">Primary Name</label>
                                    <input
                                        type="text"
                                        value={editingItem.name || ''}
                                        onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                        className="w-full glass-input px-4 py-3 rounded-xl text-white font-bold focus:border-[#d4af37]/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-[#a0aabf] mb-2 ml-1">
                                            {activeTab === 'characters' ? 'Role/Title' : 'Location'}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingItem.role || editingItem.location || ''}
                                            onChange={e => setEditingItem({ ...editingItem, [activeTab === 'characters' ? 'role' : 'location']: e.target.value })}
                                            className="w-full glass-input px-4 py-3 rounded-xl text-white focus:border-[#d4af37]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-[#a0aabf] mb-2 ml-1">
                                            {activeTab === 'eras' ? 'Year' : 'Era/Date'}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingItem.era || editingItem.date || editingItem.year || ''}
                                            onChange={e => setEditingItem({ ...editingItem, [activeTab === 'eras' ? 'year' : (activeTab === 'characters' ? 'era' : 'date')]: e.target.value })}
                                            className="w-full glass-input px-4 py-3 rounded-xl text-[#d4af37] focus:border-[#d4af37]/50 font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#a0aabf] mb-2 ml-1">Main Description/Details</label>
                                    <textarea
                                        rows={4}
                                        value={editingItem.details || editingItem.background || ''}
                                        onChange={e => setEditingItem({ ...editingItem, [activeTab === 'characters' ? 'background' : 'details']: e.target.value })}
                                        className="w-full glass-input px-4 py-3 rounded-xl text-white focus:border-[#d4af37]/50 custom-scrollbar resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Image URl Field if applies */}
                                {editingItem.image && (
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-[#a0aabf] mb-2 ml-1">Media URL</label>
                                        <input
                                            type="text"
                                            value={editingItem.image || ''}
                                            onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                                            className="w-full glass-input px-4 py-3 rounded-xl text-blue-400 font-mono text-xs focus:border-[#d4af37]/50"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/5 shrink-0 flex items-center justify-end gap-3 bg-black/20">
                                <button
                                    onClick={() => setEditingItem(null)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-[#a0aabf] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="glass-gold px-8 py-2.5 rounded-xl font-bold text-sm text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-all flex items-center gap-2 min-w-[140px] justify-center"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Check size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AdminLayout>
    );
};

export default AdminContent;
