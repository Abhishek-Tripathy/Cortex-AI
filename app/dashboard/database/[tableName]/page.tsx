'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Database, Table as TableIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function SimpleTable({ data, customClass }: { data: any[], customClass?: string }) {
  if (!data || data.length === 0) return <div className="text-slate-500 text-center py-8">No data found</div>;
  
  const columns = Object.keys(data[0]);

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-800 shadow-sm ${customClass}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800">
            {columns.map((col) => (
              <th key={col} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-950/50 divide-y divide-slate-800">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-900/50 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                  {row[col]?.toString() || <span className="text-slate-600 italic">null</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TableDetail({ params }: { params: Promise<{ tableName: string }> }) {
  const unwrappedParams = use(params);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/database/tables/${unwrappedParams.tableName}`);
      if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error('Failed to fetch table data');
      }
      const json = await res.json();
      setData(json.rows);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans pb-20">
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/database" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                <Database size={20} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                  {unwrappedParams.tableName}
                </h1>
                <span className="text-xs text-slate-500 font-mono mt-1">public schema</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8 max-w-7xl">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-indigo-400">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            Error: {error}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TableIcon size={16} />
                <span>Showing first 30 records (Preview)</span>
              </div>
            </div>
            
            <SimpleTable data={data} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
