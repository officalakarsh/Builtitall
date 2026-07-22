import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STATUSES = [
  'Analyzing business requirements...',
  'Crafting responsive landing page structure...',
  'Synthesizing SEO-optimized keywords and headers...',
  'Generating category-tailored copy using Gemini...',
  'Designing harmonized premium color palette...',
  'Configuring automated WhatsApp integrations...',
  'Polishing modern UI styles and templates...',
  'Finalizing database mappings & going live...'
];

export default function OrbitPreloader({ isGenerating = true }) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
      {/* Visual Orbiting Structure */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Orbit Ring */}
        <motion.div
          className="absolute w-56 h-56 rounded-full border border-dashed border-indigo-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]" />
        </motion.div>

        {/* Middle Orbit Ring */}
        <motion.div
          className="absolute w-40 h-40 rounded-full border border-double border-pink-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_12px_#ec4899]" />
        </motion.div>

        {/* Inner Orbit Ring */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border border-cyan-500/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
        </motion.div>

        {/* Central Core Glowing Orb */}
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-[0_0_35px_rgba(99,102,241,0.6)] flex items-center justify-center"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </motion.div>
      </div>

      {/* Progress / Status Text Section */}
      <div className="mt-8 text-center max-w-sm h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={statusIndex}
            initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="text-distort font-medium text-lg bg-gradient-to-r from-cyan-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent drop-shadow"
          >
            {LOADING_STATUSES[statusIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2 text-xs text-slate-500 tracking-widest uppercase animate-pulse">
        Gemini AI Generator Active
      </div>
    </div>
  );
}
