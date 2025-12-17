'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsTabsProps {
  overviewContent: React.ReactNode;
  weaknessesContent: React.ReactNode;
  chartsContent: React.ReactNode;
  defaultTab?: 'overview' | 'weaknesses' | 'charts';
}

export default function AnalyticsTabs({ 
  overviewContent, 
  weaknessesContent, 
  chartsContent,
  defaultTab = 'overview' 
}: AnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'weaknesses' | 'charts'>(defaultTab);

  const tabs = [
    { id: 'overview' as const, label: 'ภาพรวม' },
    { id: 'weaknesses' as const, label: 'จุดอ่อน' },
    { id: 'charts' as const, label: 'กราฟทั้งหมด' }
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'overview':
        return overviewContent;
      case 'weaknesses':
        return weaknessesContent;
      case 'charts':
        return chartsContent;
      default:
        return overviewContent;
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 px-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-2 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {getContent()}
        </motion.div>
      </div>
    </div>
  );
}

