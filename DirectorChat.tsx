const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    try {
      // Calling your Python Brain (main.py)
      const res = await fetch('http://localhost:8000/api/director-upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.upscaledPrompt }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Shield Active: Using local presets." }]);
    }
    setInput('');
  };
