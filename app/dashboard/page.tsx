'use client';

import { useState } from 'react';
import { QueryInput } from '../components/QueryInput';
import { ReportViewer } from '../components/ReportViewer';
import { BarChart3, Activity, ArrowLeft, Terminal, Sparkles, Database } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(''); 
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (question: string) => {
    setLoading(true);
    setError(null);
    setReport(null);
    setStatus('Thinking (Generating SQL)...');

    try {
      // Step 1: Generate SQL
      const req1 = await fetch('/api/stage1-generate-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const res1 = await req1.json();
      if (!req1.ok) throw new Error(res1.error);
      const sqlQueries = res1.sqlQueries;
      
      setStatus(`Executing ${sqlQueries.length} Query(ies)...`);

      // Step 2: Execute SQL
      const req2 = await fetch('/api/stage2-execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQueries }),
      });
      const res2 = await req2.json();
      if (!req2.ok) throw new Error(res2.error);
      const results = res2.results;

      setStatus('Analyzing Data...');

      // Step 3: Analyze Result
      const req3 = await fetch('/api/stage3-analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, results }),
      });
      const res3 = await req3.json();
      if (!req3.ok) throw new Error(res3.error);

      // Combine
      setReport({
        ...res3,
        results: results
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-white selection:bg-indigo-500/30 font-sans">
      
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                <BarChart3 size={20} />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 mt-12 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Ask your data anything</h2>
            <p className="text-slate-400">Natural language to SQL, instant visualization.</p>
          </div>

          <QueryInput onSearch={handleSearch} loading={loading} />
          
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex justify-center items-center gap-3 text-indigo-400 font-medium font-mono text-sm"
              >
                <Activity size={16} className="animate-spin" />
                <span>{status}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!report && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mt-8"
              >
                 {[
                   "Top 5 films by revenue",
                   "Monthly rental trends 2022",
                   "Active customers by store"
                 ].map((q, i) => (
                   <button 
                     key={q}
                     onClick={() => handleSearch(q)}
                     className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-indigo-600 hover:border-indigo-500 text-slate-300 hover:text-white transition-all duration-300"
                   >
                     <Sparkles size={14} />
                     {q}
                   </button>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>


        </motion.div>

        <ReportViewer report={report} error={error} />
      </main>
    </div>
  );
}
