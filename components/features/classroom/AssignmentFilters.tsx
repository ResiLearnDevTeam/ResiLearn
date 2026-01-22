'use client';

import { Search } from 'lucide-react';

interface AssignmentFiltersProps {
  filter: 'all' | 'published' | 'drafts' | 'overdue';
  typeFilter: 'all' | 'practice' | 'exam';
  searchQuery: string;
  onFilterChange: (filter: 'all' | 'published' | 'drafts' | 'overdue') => void;
  onTypeFilterChange: (typeFilter: 'all' | 'practice' | 'exam') => void;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    published: number;
    drafts: number;
    overdue: number;
  };
}

export default function AssignmentFilters({
  filter,
  typeFilter,
  searchQuery,
  onFilterChange,
  onTypeFilterChange,
  onSearchChange,
  counts,
}: AssignmentFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Filters - Combined */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          ทั้งหมด ({counts.all})
        </button>
        <button
          onClick={() => onFilterChange('published')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'published'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          เผยแพร่แล้ว ({counts.published})
        </button>
        <button
          onClick={() => onFilterChange('drafts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'drafts'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Drafts ({counts.drafts})
        </button>
        <button
          onClick={() => onFilterChange('overdue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'overdue'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          เกินกำหนด ({counts.overdue})
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <button
          onClick={() => onTypeFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => onTypeFilterChange('practice')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'practice'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          แบบฝึกหัด
        </button>
        <button
          onClick={() => onTypeFilterChange('exam')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'exam'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          แบบทดสอบ
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหางาน..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>
    </div>
  );
}
