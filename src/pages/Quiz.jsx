import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, GraduationCap, Crown, User } from 'lucide-react';
import { quizData } from '../data/quizData';
import { erasData } from '../data/historyData';
import Layout from '../components/Layout';

const Quiz = () => {
    const { eraId } = useParams();
    const navigate = useNavigate();

    // Safety check for valid era
    const eraInfo = erasData[eraId] || { title: 'Unknown Era' };
    const questions = quizData[eraId] || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Dynamic Title
    useEffect(() => {
        document.title = `${eraInfo.title} - UPSC Quiz | History of India`;
    }, [eraInfo]);

    const currentQ = questions[currentIndex];

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === currentQ.correctIndex) {
            setScore(prev => prev + 10); // 10 points per correct answer
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsComplete(true);
        }
    };

    const getRank = () => {
        const percent = (score / (questions.length * 10)) * 100;
        if (percent === 100) return { title: "Chakravartin (Universal Emperor)", icon: <Crown className="text-yellow-400 w-16 h-16" /> };
        if (percent >= 60) return { title: "Acharya (Master Scholar)", icon: <GraduationCap className="text-blue-400 w-16 h-16" /> };
        if (percent >= 30) return { title: "Vidyarthi (Dedicated Student)", icon: <User className="text-green-400 w-16 h-16" /> };
        return { title: "Pravasi (Time Traveler)", icon: <User className="text-gray-400 w-16 h-16" /> };
    };

    if (questions.length === 0) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-2xl text-[#d4af37] font-cinzel mb-4">Scholarly Archives Empty</h2>
                    <p className="text-gray-400 mb-8">Our historians are still drafting the UPSC examination for this specific era.</p>
                    <button onClick={() => navigate('/timeline')} className="px-6 py-2 border border-[#d4af37]/30 text-[#d4af37] rounded-full hover:bg-[#d4af37]/10 transition-colors">
                        Return to Timeline
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#05070a] pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-4xl relative z-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <button
                            onClick={() => navigate('/timeline')}
                            className="text-[#a0aabf] hover:text-[#d4af37] flex items-center gap-2 transition-colors self-start md:self-auto uppercase tracking-widest text-xs font-bold"
                        >
                            <ArrowLeft size={16} /> Exit Exam
                        </button>
                        <h1 className="text-2xl md:text-3xl font-cinzel text-[#d4af37] text-center font-bold tracking-wider">
                            {eraInfo.title}
                        </h1>
                        <div className="flex items-center gap-2 bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/30">
                            <Trophy size={16} className="text-[#f1c40f]" />
                            <span className="text-white font-mono font-bold tracking-wider">{score} PTS</span>
                        </div>
                    </div>

                    {!isComplete ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-[#121826]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl"
                        >
                            {/* Progress */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-xs text-[#a0aabf] font-mono whitespace-nowrap">Q {currentIndex + 1} / {questions.length}</span>
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#f1c40f] transition-all duration-500"
                                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <h2 className="text-xl md:text-2xl text-white font-light leading-relaxed mb-8">
                                {currentQ.question}
                            </h2>

                            {/* Options */}
                            <div className="space-y-4 mb-8">
                                {currentQ.options.map((option, idx) => {
                                    let btnStateClasses = "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20";
                                    let Icon = null;

                                    if (isAnswered) {
                                        if (idx === currentQ.correctIndex) {
                                            btnStateClasses = "bg-green-500/10 border-green-500/50 text-green-400";
                                            Icon = <CheckCircle2 className="text-green-400" size={20} />;
                                        } else if (idx === selectedOption) {
                                            btnStateClasses = "bg-red-500/10 border-red-500/50 text-red-400";
                                            Icon = <XCircle className="text-red-400" size={20} />;
                                        } else {
                                            btnStateClasses = "bg-black/20 border-white/5 text-gray-500 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={isAnswered}
                                            onClick={() => handleOptionSelect(idx)}
                                            className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 ${btnStateClasses}`}
                                        >
                                            <div className="mt-0.5">
                                                {Icon || <div className="w-5 h-5 rounded-full border border-current opacity-50" />}
                                            </div>
                                            <span className="flex-1 text-sm md:text-base leading-relaxed">{option}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation Reveal */}
                            <AnimatePresence>
                                {isAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 bg-[#d4af37]/5 border-l-4 border-[#d4af37] rounded-r-xl mb-8">
                                            <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">Historical Context</h4>
                                            <p className="text-white/80 text-sm md:text-base leading-relaxed">{currentQ.explanation}</p>
                                        </div>

                                        <button
                                            onClick={handleNext}
                                            className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                                        >
                                            {currentIndex === questions.length - 1 ? 'View Final Results' : 'Next Question →'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    ) : (
                        /* Results Screen */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#121826]/90 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-10 md:p-16 shadow-2xl text-center"
                        >
                            <div className="flex justify-center mb-6">
                                {getRank().icon}
                            </div>
                            <h2 className="text-4xl font-cinzel text-white mb-2">Examination Complete</h2>
                            <p className="text-[#a0aabf] mb-8">You have completed the historical module for {eraInfo.title}.</p>

                            <div className="inline-block p-1 rounded-2xl bg-gradient-to-br from-[#d4af37] to-transparent mb-10">
                                <div className="bg-[#05070a] rounded-xl px-12 py-8">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f] mb-2 font-mono">
                                        {score}
                                    </div>
                                    <div className="text-xs text-[#a0aabf] uppercase tracking-[0.3em] font-bold">Total Points</div>
                                </div>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-[#d4af37] text-sm uppercase tracking-widest font-bold mb-1">Rank Achieved</h3>
                                <p className="text-2xl text-white font-cinzel">{getRank().title}</p>
                            </div>

                            <button
                                onClick={() => navigate('/timeline')}
                                className="px-8 py-4 border border-[#d4af37]/50 rounded-full text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold tracking-widest uppercase transition-all"
                            >
                                Return to Timeline
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout >
    );
};

export default Quiz;
