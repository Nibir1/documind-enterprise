import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, Copy, ThumbsUp } from 'lucide-react';
import { sendChatMessage } from '../../api/client';
import { Message } from '../../api/types';

export const ChatTab = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am DocuMind, your secure enterprise assistant.\n\nI have access to the ingested knowledge base. How can I help you today?' }
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the secure core. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3">
        <div className="bg-brand-100 p-2 rounded-lg">
          <Bot className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">AI Research Assistant</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online • GPT-4o Mini
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'assistant' 
                ? 'bg-white border border-slate-100 text-brand-600' 
                : 'bg-brand-600 text-white'
            }`}>
              {msg.role === 'assistant' ? <Sparkles size={18} /> : <User size={18} />}
            </div>

            {/* Content */}
            <div className={`max-w-[85%] space-y-2`}>
              <div className={`rounded-2xl p-5 shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-white border border-slate-100 text-slate-700' 
                  : 'bg-brand-600 text-white'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {msg.content}
                </p>
              </div>

              {/* Citations (Only for Assistant) */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="animate-fade-in mt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1">
                    <BookOpen size={12} /> Verified Sources
                  </p>
                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                    {msg.citations.map((cit, cIdx) => (
                      <div key={cIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-xs text-brand-700 truncate w-[70%]" title={cit.filename}>
                            {cit.filename}
                          </span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                            Pg. {cit.page}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed border-l-2 border-slate-200 pl-2 group-hover:border-brand-400 transition-colors">
                          "{cit.text_snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Bot Actions */}
              {msg.role === 'assistant' && (
                <div className="flex gap-2 ml-1">
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition"><Copy size={14} /></button>
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition"><ThumbsUp size={14} /></button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 animate-fade-in">
             <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Sparkles size={18} className="text-brand-600 animate-pulse" />
             </div>
             <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-inner"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all disabled:opacity-50 disabled:scale-95 shadow-md shadow-brand-500/20"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI generated content can be inaccurate. Please verify important information from sources.
        </p>
      </div>
    </div>
  );
};