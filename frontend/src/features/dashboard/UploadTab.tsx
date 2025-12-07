import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertOctagon, Loader2, ArrowRight } from 'lucide-react';
import { uploadDocument } from '../../api/client';
import { DocumentUploadResponse } from '../../api/types';

export const UploadTab = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocumentUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadDocument(file);
      setResult(data);
      setFile(null); // Clear file after success
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto animate-fade-in">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Knowledge Ingestion</h2>
        <p className="text-slate-500">Upload PDF documents to expand the RAG knowledge base.</p>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        className={`relative w-full group rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out p-12 text-center cursor-pointer overflow-hidden
          ${dragActive 
            ? 'border-brand-500 bg-brand-50 scale-[1.02] shadow-xl' 
            : 'border-slate-200 bg-white hover:border-brand-400 hover:bg-slate-50 shadow-sm hover:shadow-md'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept=".pdf,.txt,.md"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        
        <div className="relative z-0 flex flex-col items-center pointer-events-none transition-transform group-hover:-translate-y-2 duration-300">
          <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${dragActive || file ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
            {file ? <FileText size={32} /> : <Upload size={32} />}
          </div>
          
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            {file ? file.name : 'Click to upload or drag and drop'}
          </h3>
          <p className="text-sm text-slate-400">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB Ready to process` : 'PDF, TXT, or MD (Max 10MB)'}
          </p>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      </div>

      {/* Action Button */}
      <div className="w-full mt-8">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform
            ${!file || loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:scale-[1.02] hover:shadow-brand-500/25 active:scale-95'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Ingesting Document...
            </>
          ) : (
            <>
              Start Pipeline <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Results Area */}
      <div className="w-full mt-8 space-y-4">
        {result && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 animate-slide-up shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">Success</h4>
              <p className="text-sm text-emerald-700">Vectorized {result.chunks_processed} chunks to Knowledge Graph.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4 animate-slide-up shadow-sm">
            <div className="bg-rose-100 p-2 rounded-full">
              <AlertOctagon className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900">Pipeline Error</h4>
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};