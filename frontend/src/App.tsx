import { useState } from 'react';
import { Upload, MessageSquare, Hexagon, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { UploadTab } from './features/dashboard/UploadTab';
import { ChatTab } from './features/chat/ChatTab';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'chat'>('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-4 md:p-8">
      
      {/* Main Container - Glassmorphism Card */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row h-[85vh]">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col p-6 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-600 rounded-full opacity-20 blur-3xl"></div>
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 relative z-10">
            <div className="bg-brand-500 p-2 rounded-xl shadow-lg shadow-brand-500/30">
              <Hexagon className="h-6 w-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DocuMind</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider">ENTERPRISE</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-2 relative z-10">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === 'upload' 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard size={20} className={activeTab === 'upload' ? 'animate-pulse-slow' : ''} />
              <span className="font-medium">Ingestion Hub</span>
            </button>

            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === 'chat' 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <MessageSquare size={20} className={activeTab === 'chat' ? 'animate-pulse-slow' : ''} />
              <span className="font-medium">Agent Chat</span>
            </button>
          </nav>

          {/* Footer Status */}
          <div className="mt-auto pt-6 border-t border-slate-800 relative z-10">
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
              <p className="text-xs text-slate-400">System Operational</p>
            </div>
            <div className="flex items-center gap-2 mt-3 px-2 text-xs text-slate-500">
              <ShieldCheck size={12} />
              <span>Azure AD Protected</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-50/50 relative overflow-hidden flex flex-col">
          {/* Header for Mobile */}
          <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
             <h1 className="font-bold text-slate-800">DocuMind</h1>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto h-full flex flex-col animate-fade-in">
              {activeTab === 'upload' ? <UploadTab /> : <ChatTab />}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;