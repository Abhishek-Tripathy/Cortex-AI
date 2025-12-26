'use client';

import { motion } from 'framer-motion';
import { ReportChart } from './ReportChart';
import { Terminal, Brain, TrendingUp, Table2, BarChart3, PieChart as PieChartIcon, DollarSign, Users, Film, Clock, Activity } from 'lucide-react';

interface Visualization {
  type: 'table' | 'bar' | 'line' | 'pie' | 'singleValue';
  title: string;
  xKey?: string;
  yKey?: string;
  columns?: string[];
  data?: any[];
  value?: string | number;
  label?: string;
}

interface ReportData {
  explanation: string;
  visualizations?: Visualization[];
  results?: any[];
}

interface ReportViewerProps {
  report: ReportData | null;
  error: string | null;
}

function parseDataForChart(data: any[]): any[] {
  if (!data || data.length === 0) return [];
  return data.map(item => {
    const newItem: any = { ...item };
    Object.keys(newItem).forEach(key => {
      const val = newItem[key];
      if (typeof val === 'string') {
        const cleaned = val.replace(/[$,]/g, '');
        if (!isNaN(Number(cleaned)) && cleaned.trim() !== '') {
          newItem[key] = Number(cleaned);
        }
      }
    });
    return newItem;
  });
}

// Simple Tailwind Table Component with Theme Compatibility
function SimpleTable({ data, columns }: { data: any[]; columns?: string[] }) {
  if (!data || data.length === 0)
    return <div className="text-[var(--text-secondary)] text-center py-8">No data</div>;

  const cols = columns || Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm">
      <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
            {cols.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap"
              >
                {col.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--surface)]">
          {data.map((row, rIdx) => (
            <tr
              key={rIdx}
              className="group hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {cols.map((col) => (
                <td
                  key={col}
                  className="px-4 py-3 text-sm text-[var(--text-primary)] border-b border-[var(--border)] group-last:border-0 whitespace-nowrap"
                >
                  {row[col] ?? <span className="text-[var(--text-secondary)] opacity-50">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// KPI Card for single values
function KPICard({ title, value, label, icon: Icon, color }: { title: string; value: string | number; label?: string; icon: any; color: string }) {
  return (
    <div className="bg-[var(--surface)] dark:bg-gray-800 rounded-2xl p-6 border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{value}</div>
      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-bold">{label || title}</div>
    </div>
  );
}

const KPI_COLORS = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-purple-500 to-purple-700',
  'from-amber-500 to-amber-700',
  'from-pink-500 to-pink-700',
  'from-cyan-500 to-cyan-700',
];

const KPI_ICONS = [Users, Film, DollarSign, Clock, BarChart3, TrendingUp];

export function ReportViewer({ report, error }: ReportViewerProps) {
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="mt-8 p-6 rounded-2xl border-2 border-red-500/50 bg-red-100 dark:bg-red-900/10 text-red-600 dark:text-red-400"
      >
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5" /> Error Generating Report
        </h3>
        <p>{error}</p>
      </motion.div>
    );
  }

  if (!report) return null;

  const { explanation, visualizations = [] } = report;
  
  // Separate KPIs from charts/tables
  const kpis = visualizations.filter(v => v.type === 'singleValue');
  const charts = visualizations.filter(v => v.type === 'bar' || v.type === 'line' || v.type === 'pie');
  const tables = visualizations.filter(v => v.type === 'table');

  return (
    <motion.div 
      className="mt-8 space-y-8 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Executive Summary</h2>
        </div>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
          {explanation}
        </p>
      </motion.div>

      {/* KPI Cards Grid */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <KPICard
                title={kpi.title}
                value={kpi.value || '—'}
                label={kpi.label}
                icon={KPI_ICONS[idx % KPI_ICONS.length]}
                color={KPI_COLORS[idx % KPI_COLORS.length]}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      {charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chart, idx) => {
            const chartData = parseDataForChart(chart.data || []);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                    {chart.type === 'bar' && <BarChart3 className="w-5 h-5" />}
                    {chart.type === 'line' && <TrendingUp className="w-5 h-5" />}
                    {chart.type === 'pie' && <PieChartIcon className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)]">{chart.title}</h3>
                </div>
                <div className="p-6 h-[350px]">
                  {chartData.length > 0 ? (
                    <ReportChart
                      type={chart.type}
                      data={chartData}
                      xKey={chart.xKey}
                      yKey={chart.yKey}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                      No chart data
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tables Section */}
      {tables.length > 0 && (
        <div className="space-y-8">
          {tables.map((table, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm"
            >
              <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Table2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">{table.title}</h3>
                </div>
                <span className="text-xs bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-1 rounded-full text-[var(--text-secondary)]">
                  {table.data?.length || 0} rows
                </span>
              </div>
              <div className="p-6">
                <SimpleTable data={table.data || []} columns={table.columns} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* SQL Queries */}
      {report.results && report.results.length > 0 && (
        <details className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <summary className="px-6 py-4 cursor-pointer bg-[var(--bg-secondary)] hover:bg-[var(--border)] transition-colors flex items-center justify-between group">
            <span className="flex items-center gap-2 text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)]">
              <Terminal className="w-5 h-5" />
              View SQL Queries ({report.results.length})
            </span>
            <span className="text-[var(--text-secondary)] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-4 bg-gray-950 text-gray-300 max-h-[400px] overflow-auto">
            {report.results.map((r: any, i: number) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">-- Query {i + 1}</div>
                <pre className="text-sm font-mono bg-gray-900 p-4 rounded-lg border border-gray-800 overflow-x-auto whitespace-pre-wrap">{r.query}</pre>
              </div>
            ))}
          </div>
        </details>
      )}
    </motion.div>
  );
}
