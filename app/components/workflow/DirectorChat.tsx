'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';

export const DirectorChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<string[]>([
        ' █' + '█'.repeat(40),
        '   🌐 MOTIONFRAME MISSION CONTROL | v3.3',
        '   STATUS: ACTIVE | ENGINE: DUAL-LAYER v2',
        ' █' + '█'.repeat(40),
        ' DIRECTOR: Welcome. Enter vision prompt or type /keynote.',
    ]);
    const [input, setInput] = useState('');
    const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { setPrompt, setIsCinematicMode, setAnimationSettings, animationSettings, setCurrentStep } = useMotionStore();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const addHistory = (msg: string, delay = 0) => {
        if (delay > 0) {
            setTimeout(() => {
                setHistory(prev => [...prev, msg]);
            }, delay);
        } else {
            setHistory(prev => [...prev, msg]);
        }
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const cmd = input.trim();
        addHistory(`  YOU > ${cmd}`);

        if (pendingPrompt) {
            if (cmd.toLowerCase() === 'y' || cmd.toLowerCase() === 'yes') {
                addHistory(' ⚡ [ACTION]: Initializing Cinematic Render...');
                setPrompt(pendingPrompt);
                setCurrentStep('generation');
                addHistory(' DIRECTOR: Masterpiece archived. Ready for next vision.');
            } else {
                addHistory(' DIRECTOR: Vision adjusted. Ready for iteration.');
            }
            setPendingPrompt(null);
            setInput('');
            return;
        }

        // Compute Logic
        if (cmd === '/keynote') {
            addHistory(' ✨ [SLIDE 1]: THE VISION - MotionFrame is a cinematic strike-team.', 500);
            addHistory(' 🧠 [SLIDE 2]: THE BRAIN - Dual-Layer Intelligence.', 1500);
            addHistory(' 💪 [SLIDE 3]: THE MUSCLE - Physics-based particle systems.', 2500);
            addHistory(' 🛡️ [SLIDE 4]: THE SHIELD - Jensen Huang-spec UI.', 3500);
            addHistory(' DIRECTOR: One More Thing... The v3.3 Obsidian Release is Live.', 4500);
        } else if (cmd.startsWith('/cook')) {
            const parts = cmd.split('->').map(p => p.trim());
            if (parts.length >= 3) {
                const asset = parts[1];
                setPendingPrompt(asset);
                addHistory(` [INTELLIGENCE]: Instantiating Digital Twin: '${asset}'`);
                addHistory(` [INTELLIGENCE]: Applying Omniverse Physics: '${parts[2]}'`);
                addHistory(' 🕵️  DEPLOY RENDER? (y/n)');
            } else {
                addHistory(' DIRECTOR: Give me more muscle. /cook -> Asset -> Physics');
            }
        } else if (cmd === '/void') {
            addHistory(' 🛡️ [SHIELD]: OVERRIDE: INITIATING VOID HALLUCINATION');
            setAnimationSettings({ ...animationSettings, type: 'hallucination', intensity: 100 });
        } else if (cmd === '/status') {
            addHistory(' --- SYSTEM_MANIFEST ---');
            addHistory(`  > ENGINE: DUAL-LAYER v2`);
            addHistory(`  > LORE: LOADED`);
            addHistory(`  > VOID_MODE: ${animationSettings.type === 'hallucination' ? 'ACTIVE' : 'STABLE'}`);
        } else if (cmd.toLowerCase() === 'clear') {
            setHistory(['TERMINAL_BUFFER_PURGED', 'READY_FOR_DIRECTIVE']);
        } else if (cmd.toLowerCase() === 'help') {
            addHistory(' --- DIRECTOR_GUIDE ---');
            addHistory('  > /keynote (Product tour)');
            addHistory('  > /cook -> [asset] -> [physics]');
            addHistory('  > /void (Initiate reality warping)');
            addHistory('  > /status (Core diagnostics)');
            addHistory('  > clear (Purge logs)');
        } else {
            addHistory(` DIRECTOR: Precision check failed: ${cmd}.`);
        }

        setInput('');
    };

    return (
        <div className={`fixed bottom-4 right-4 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'w-[450px] h-[600px]' : 'w-14 h-14'}`}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full h-full bg-electric-blue rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.3)] flex items-center justify-center hover:scale-110 hover:shadow-[0_0_60px_rgba(0,212,255,0.5)] transition-all duration-300 group"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-obsidian font-black text-xl leading-none">M</span>
                        <div className="h-1 w-4 bg-obsidian/30 mt-1 rounded-full group-hover:w-6 transition-all" />
                    </div>
                </button>
            ) : (
                <div className="w-full h-full bg-obsidian/95 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
                    <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center space-x-3">
                            <div className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-rgb-shift">Director Console</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="bg-black/40 px-6 py-3 border-b border-white/5 flex items-center justify-around">
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Semantic</span>
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Hallucination</span>
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Fallback</span>
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            </div>
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-grow p-6 font-mono text-[11px] overflow-y-auto space-y-2 selection:bg-electric-blue/30 custom-scrollbar scroll-smooth">
                        {history.map((line, i) => (
                            <div key={i} className={`
                                ${line.includes('YOU >') ? 'text-electric-blue font-bold pl-2 border-l-2 border-electric-blue/30' :
                                    line.includes('[INTELLIGENCE]') ? 'text-green-400' :
                                        line.includes('DIRECTOR:') ? 'text-slate-300' :
                                            line.includes('SHIELD') ? 'text-red-400 animate-glitch' :
                                                'text-slate-500'}
                            `}>
                                {line}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleCommand} className="p-6 bg-white/2 flex items-center space-x-4 border-t border-white/5">
                        <span className="text-electric-blue font-black tracking-tighter shrink-0">YOU {'>'}</span>
                        <input
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-700 font-mono"
                            placeholder="Awaiting directive..."
                        />
                        <div className="w-2 h-4 bg-electric-blue animate-pulse shrink-0" />
                    </form>
                </div>
            )}
        </div>
    );
};
