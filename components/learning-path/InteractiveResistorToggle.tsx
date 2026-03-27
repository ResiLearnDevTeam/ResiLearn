'use client';

import { useState } from 'react';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveResistorToggleProps {
  initialMode?: '4-band' | '5-band';
}

export default function InteractiveResistorToggle({ initialMode = '4-band' }: InteractiveResistorToggleProps) {
  const [mode, setMode] = useState<'4-band' | '5-band'>(initialMode);
  const [bands, setBands] = useState<string[]>(['brown', 'black', 'red', 'gold']);

  const handleToggle = () => {
    const newMode = mode === '4-band' ? '5-band' : '4-band';
    setMode(newMode);
    
    // Update bands based on mode
    if (newMode === '5-band') {
      // Convert 4-band to 5-band: add third digit
      setBands(['brown', 'black', 'black', 'red', 'brown']);
    } else {
      // Convert 5-band to 4-band: remove third digit
      setBands(['brown', 'black', 'red', 'gold']);
    }
  };

  const getBandLabels = () => {
    if (mode === '4-band') {
      return [
        { index: 0, label: 'ตัวเลขหลักที่ 1', role: 'Digit' },
        { index: 1, label: 'ตัวเลขหลักที่ 2', role: 'Digit' },
        { index: 2, label: 'ตัวคูณ', role: 'Multiplier' },
        { index: 3, label: 'ความคลาดเคลื่อน', role: 'Tolerance' },
      ];
    } else {
      return [
        { index: 0, label: 'ตัวเลขหลักที่ 1', role: 'Digit' },
        { index: 1, label: 'ตัวเลขหลักที่ 2', role: 'Digit' },
        { index: 2, label: 'ตัวเลขหลักที่ 3', role: 'Digit', highlight: true },
        { index: 3, label: 'ตัวคูณ', role: 'Multiplier' },
        { index: 4, label: 'ความคลาดเคลื่อน', role: 'Tolerance' },
      ];
    }
  };

  const bandLabels = getBandLabels();

  return (
    <div className="w-full space-y-6 md:space-y-8 my-6">
      {/* Toggle Switch */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <span className={`text-base md:text-lg font-medium ${mode === '4-band' ? 'text-orange-600' : 'text-slate-500'}`}>
          4 แถบ
        </span>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            mode === '5-band' ? 'bg-orange-500' : 'bg-slate-300'
          }`}
          aria-label={`Switch to ${mode === '4-band' ? '5-band' : '4-band'} mode`}
        >
          <motion.span
            layout
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform`}
            animate={{
              x: mode === '5-band' ? 32 : 4,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        </button>
        <span className={`text-base md:text-lg font-medium ${mode === '5-band' ? 'text-orange-600' : 'text-slate-500'}`}>
          5 แถบ
        </span>
      </div>

      {/* Resistor Display */}
      <div className="flex flex-col items-center space-y-6 md:space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ResistorDisplay
              bands={bands}
              type={mode === '4-band' ? '4-band' : '5-band'}
              highlightBand={mode === '5-band' ? 2 : undefined}
            />
          </motion.div>
        </AnimatePresence>

        {/* Band Labels */}
        <div className="w-full max-w-3xl">
          <div className={`grid gap-3 md:gap-4 ${mode === '4-band' ? 'grid-cols-4' : 'grid-cols-5'}`}>
            {bandLabels.map((band, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg border-2 p-4 md:p-5 text-center transition-all ${
                  band.highlight
                    ? 'border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-200'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {band.role}
                </div>
                <div className={`text-sm md:text-base font-medium leading-relaxed ${
                  band.highlight ? 'text-orange-700' : 'text-slate-700'
                }`}>
                  {band.label}
                </div>
                {band.highlight && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 text-xs md:text-sm text-orange-600 font-semibold"
                  >
                    ⭐ จุดต่างสำคัญ!
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
