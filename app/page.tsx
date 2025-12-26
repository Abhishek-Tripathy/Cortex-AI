'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Database, BarChart2, Zap, Shield, Sparkles, ChevronRight, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6 mb-8 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-900 border border-slate-800 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Cortex<span className="text-indigo-400">AI</span>
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-8 text-sm font-medium"
          >
            {['Features', 'Documentation', 'Pricing'].map((item) => (
              <a key={item} href="#" className="text-slate-400 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full" />
              </a>
            ))}
            <Link 
              href="/dashboard"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Log in
            </Link>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto mb-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Next-Gen Database Intelligence
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400"
          >
            Talk to your data <br />
            <span className="text-indigo-400 inline-block filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              like a human.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed text-balance"
          >
            Transform plain English into optimized SQL queries instantly. 
            Visualize complex datasets without writing a single line of code.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/dashboard"
              className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              href="/dashboard/database"
              className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5" />
              Explore Database
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
          {[
            {
              icon: <Database className="w-6 h-6" />,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              title: "Secure Connection",
              desc: "Read-only access ensures your data remains safe and immutable while we analyze it."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              title: "Lightning Fast",
              desc: "Powered by advanced LLMs that understand context (and potential typos) instantly."
            },
            {
              icon: <BarChart2 className="w-6 h-6" />,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              title: "Auto-Visualization",
              desc: "Smart algorithms automatically select the best charts to represent your query results."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              onHoverStart={() => setIsHovered(i)}
              onHoverEnd={() => setIsHovered(null)}
              className="relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 ${isHovered === i ? 'opacity-100' : ''}`} />
              
              <div className={`mb-6 p-3 rounded-2xl w-fit ${feature.bg} ${feature.color} ring-1 ring-inset ring-white/5`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                {feature.title}
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isHovered === i ? 'translate-x-1 text-slate-300' : ''}`} />
              </h3>
              
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
