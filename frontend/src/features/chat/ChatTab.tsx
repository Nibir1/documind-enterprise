import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen } from 'lucide-react';
import { sendChatMessage } from '../../api/client';
import { Message } from '../../api/types';

export const ChatTab = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am DocuMind. Ask me anything about your enterprise documents.' }
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(userMsg.content);
      const botMsg: Message = { 
        role: 'assistant', 
        content: data.answer, 
        citations: data.citations 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the AI core." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-accent text-white' : 'bg-slate-300 text-slate-700'}`}>
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'assistant' ? 'bg-slate-100 text-slate-800' : 'bg-primary text-white'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Citations Render */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <BookOpen size={12} /> Sources Verified
                  </p>
                  <div className="space-y-2">
                    {msg.citations.map((cit, cIdx) => (
                      <div key={cIdx} className="bg-white p-2 rounded border border-slate-200 text-xs">
                        <div className="flex justify-between font-semibold text-accent">
                          <span>{cit.filename}</span>
                          <span>p. {cit.page}</span>
                        </div>
                        <p className="text-slate-500 mt-1 italic truncate">"...{cit.text_snippet}..."</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center animate-pulse"><Bot size={18} /></div>
             <div className="bg-slate-100 rounded-2xl p-4 text-slate-500 text-sm">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-white rounded-b-xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query here..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-6 rounded-lg hover:bg-secondary transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};