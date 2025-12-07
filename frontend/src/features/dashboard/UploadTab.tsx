import { useState } from 'react';
import { Upload, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDocument } from '../../api/client';
import { DocumentUploadResponse } from '../../api/types';

export const UploadTab = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocumentUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadDocument(file);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition">
        <Upload className="h-12 w-12 text-slate-400 mb-4" />
        
        <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-slate-800 transition">
          Select Document (PDF/TXT)
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        
        {file && (
          <p className="mt-4 text-sm text-slate-600 font-medium">
            Selected: {file.name}
          </p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full mt-6 bg-accent text-white py-3 rounded-lg font-bold shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        {loading ? 'Ingesting...' : 'Start Ingestion Pipeline'}
      </button>

      {/* Success State */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Ingestion Successful</h4>
            <p className="text-sm text-green-700">{result.message}</p>
            <p className="text-xs text-green-600 mt-1">Processed {result.chunks_processed} chunks.</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Ingestion Failed</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};