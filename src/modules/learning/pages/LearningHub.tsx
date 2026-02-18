import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, ScrollText, Trophy, Clock, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const LearningHub: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12 font-sans selection:bg-pink-500/30">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4"
                    >
                        <BrainCircuit size={48} className="text-indigo-400" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    >
                        Amazing Learning
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        Choose your path. Master the knowledge through gamified challenges or rigorous simulation.
                    </motion.p>
                </div>

                {/* Mode Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch">

                    {/* Arcade Mode */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-pink-500/50 transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => navigate('/learning/game')}>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-colors">
                                    <Gamepad2 className="text-pink-400" size={28} />
                                </div>
                                <CardTitle className="text-2xl text-slate-100">Agile Arcade</CardTitle>
                                <CardDescription className="text-slate-400">The classic "Show do Milhão" experience.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Trophy size={16} className="text-yellow-500" />
                                        <span>Earn virtual cash & climb the ladder</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BrainCircuit size={16} className="text-pink-400" />
                                        <span>Use lifelines to help you learn</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock size={16} className="text-green-400" />
                                        <span>Forgiving time limits</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0">
                                    Play Arcade
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Simulator Mode */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => navigate('/learning/exam')}>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                                    <ScrollText className="text-indigo-400" size={28} />
                                </div>
                                <CardTitle className="text-2xl text-slate-100">Certification Sim</CardTitle>
                                <CardDescription className="text-slate-400">Professional Scrum Master (PSM I) simulation.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Clock size={16} className="text-slate-400" />
                                        <span>60 minutes strict time limit</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ScrollText size={16} className="text-indigo-400" />
                                        <span>80 questions (Random pool)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BrainCircuit size={16} className="text-red-400" />
                                        <span>No lifelines • 85% to pass</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200">
                                    Start Exam
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};
