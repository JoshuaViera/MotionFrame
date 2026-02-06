import React, { useState, useEffect } from 'react';

const DirectorChat = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'SYSTEM READY: Antigravity Engine initialized. Awaiting creative input...' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true); // Start the "Wireframe" scan animation
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      const res = await fetch('http://localhost:8000/api/director-upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'bot', content: data.upscaledPrompt }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "SHIELD ACTIVE: Using local aesthetic presets." }]);
    } finally {
      setIsAnalyzing(false); // Stop scan
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-black border-2 border-emerald-500/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      {/* Top Status Bar */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/30 p-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest animate-pulse">
          ● Neural Link Active
        </span>
        <span className="text-[10px] font-mono text-emerald-500/50">NV-DRIVE V.2.0</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-sm text-xs ${
              m.role === 'user' 
                ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/50' 
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
            }`}>
              <span className="opacity-50 mr-2">{m.role === 'user' ? '>' : '#'}</span>
              {m.content}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="text-emerald-500 text-[10px] animate-bounce">
            SCANNING WIREFRAME...
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="ENTER VISION PROMPT..."
            className="flex-1 bg-black border border-emerald-500/20 text-emerald-500 p-2 text-xs font-mono focus:outline-none focus:border-emerald-500/60 transition-all placeholder:text-emerald-900"
          />
          <button 
            onClick={handleSend}
            className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[10px] px-4 py-2 uppercase tracking-tighter transition-all"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectorChat;
