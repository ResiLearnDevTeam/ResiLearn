'use client';

import { Check, LucideIcon } from 'lucide-react';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
  badgeColor?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
  compact?: boolean;
}

export default function SelectionCard({
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
  badge,
  badgeColor = 'orange',
  compact = false,
}: SelectionCardProps) {
  const badgeColors = {
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full flex items-center gap-4 rounded-xl border-2 text-left transition-all duration-200
        ${compact ? 'p-4' : 'p-5'}
        ${isSelected 
          ? 'border-orange-500 bg-orange-50 shadow-lg scale-[1.01]' 
          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
        }
      `}
    >
      {badge && (
        <span className={`absolute -top-2.5 right-4 px-3 py-1 rounded-full text-xs font-bold border ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
      )}
      
      <div className={`
        flex shrink-0 items-center justify-center rounded-xl transition-all
        ${compact ? 'h-10 w-10' : 'h-12 w-12'}
        ${isSelected 
          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md' 
          : 'bg-gray-100 text-gray-500'
        }
      `}>
        <Icon className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${isSelected ? 'text-orange-900' : 'text-gray-900'}`}>
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>

      {isSelected && (
        <div className={`flex shrink-0 items-center justify-center rounded-full bg-green-500 shadow ${compact ? 'h-6 w-6' : 'h-8 w-8'}`}>
          <Check className={compact ? 'h-4 w-4 text-white' : 'h-5 w-5 text-white'} />
        </div>
      )}
    </button>
  );
}
