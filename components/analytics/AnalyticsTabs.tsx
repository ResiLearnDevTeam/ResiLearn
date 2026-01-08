'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertTriangle, PieChart } from 'lucide-react';

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
    { id: 'overview' as const, label: 'ภาพรวม', icon: BarChart3, color: 'orange' },
    { id: 'weaknesses' as const, label: 'จุดอ่อน', icon: AlertTriangle, color: 'red' },
    { id: 'charts' as const, label: 'กราฟทั้งหมด', icon: PieChart, color: 'blue' }
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

  const getTabColors = (tabId: string, isActive: boolean) => {
    if (!isActive) {
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
    switch (tabId) {
      case 'overview':
        return 'bg-orange-500 text-white shadow-lg shadow-orange-500/30';
      case 'weaknesses':
        return 'bg-red-500 text-white shadow-lg shadow-red-500/30';
      case 'charts':
        return 'bg-blue-500 text-white shadow-lg shadow-blue-500/30';
      default:
        return 'bg-orange-500 text-white';
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${getTabColors(tab.id, isActive)}
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
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
