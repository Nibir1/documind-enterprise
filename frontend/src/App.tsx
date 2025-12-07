import { useState } from 'react';
import { Upload, MessageSquare, Activity } from 'lucide-react';
import { UploadTab } from './features/dashboard/UploadTab';
import { ChatTab } from './features/chat/ChatTab';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'chat'>('upload');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-1.5 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DocuMind Enterprise</h1>
              <p className="text-xs text-slate-400 font-medium">Secure RAG Environment</p>
            </div>
          </div>
          <nav className="flex gap-2 bg-secondary/50 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'upload' ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Upload size={16} /> Ingestion
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'chat' ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <MessageSquare size={16} /> Chat Agent
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
          {activeTab === 'upload' ? <UploadTab /> : <ChatTab />}
        </div>
      </main>
    </div>
  );
}

export default App;