'use client';

import { Search } from 'lucide-react';

interface AssignmentFiltersProps {
  filter: 'all' | 'published' | 'drafts' | 'overdue';
  typeFilter: 'all' | 'level-based' | 'custom-quiz' | 'fixed-questions';
  searchQuery: string;
  onFilterChange: (filter: 'all' | 'published' | 'drafts' | 'overdue') => void;
  onTypeFilterChange: (typeFilter: 'all' | 'level-based' | 'custom-quiz' | 'fixed-questions') => void;
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
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex flex-col gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ทั้งหมด ({counts.all})
          </button>
          <button
            onClick={() => onFilterChange('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'published'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            เผยแพร่แล้ว ({counts.published})
          </button>
          <button
            onClick={() => onFilterChange('drafts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'drafts'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts ({counts.drafts})
          </button>
          <button
            onClick={() => onFilterChange('overdue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'overdue'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            เกินกำหนด ({counts.overdue})
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">ประเภท:</span>
          <button
            onClick={() => onTypeFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => onTypeFilterChange('level-based')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === 'level-based'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Level-based
          </button>
          <button
            onClick={() => onTypeFilterChange('custom-quiz')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === 'custom-quiz'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Quiz
          </button>
          <button
            onClick={() => onTypeFilterChange('fixed-questions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              typeFilter === 'fixed-questions'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fixed Questions
          </button>
        </div>

        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหางาน..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
