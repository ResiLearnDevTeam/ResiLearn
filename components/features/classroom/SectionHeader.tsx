'use client';

interface SectionHeaderProps {
  number: number;
  title: string;
}

export default function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
  );
}
