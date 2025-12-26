'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Table as TableIcon, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DatabaseExplorer() {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/database/tables');
      if (!res.ok) throw new Error('Failed to fetch tables');
      const data = await res.json();
      setTables(data.tables);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-500/20">
                <Database size={20} />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">Database Explorer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-12 max-w-7xl">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Schema Overview</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            This is the <strong className="text-indigo-400">Pagila</strong> database (a PostgreSQL port of Sakila), representing a fully functional <strong>DVD Rental Store</strong> business. 
            It connects <strong>films, actors, and categories</strong> with <strong>customer rentals, payments, and inventory</strong>, making it perfect for demonstrating complex SQL queries and business logic.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 text-indigo-400">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table, i) => (
              <Link key={table} href={`/dashboard/database/${table}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all hover:bg-slate-800/60 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                        <TableIcon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                          {table}
                        </h3>
                        <p className="text-sm text-slate-500 group-hover:text-slate-400">
                          Public Table
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
