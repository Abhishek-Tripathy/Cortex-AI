'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface QueryInputProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export function QueryInput({ onSearch, loading }: QueryInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative shadow-2xl rounded-2xl">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask a question about your data..."
            className="w-full bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/50 rounded-2xl pl-6 pr-32 py-5 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-xl"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Search size={18} />
            )}
            <span>Ask</span>
          </button>
        </div>
      </div>
    </form>
  );
}
