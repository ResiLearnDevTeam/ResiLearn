'use client';

import { HeatmapData, getUniqueColors, getColorNameThai } from '@/lib/analyticsChartUtils';

interface ColorConfusionHeatmapProps {
  data: HeatmapData[];
  title?: string;
}

export default function ColorConfusionHeatmap({
  data,
  title = 'สีที่จำผิดบ่อย'
}: ColorConfusionHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex h-[300px] items-center justify-center text-gray-400">
          <p>ไม่มีข้อมูลสำหรับแสดง</p>
        </div>
      </div>
    );
  }

  // Get unique colors
  const allColors = new Set<string>();
  data.forEach(item => {
    allColors.add(item.correct);
    allColors.add(item.user);
  });
  const colors = Array.from(allColors).sort();

  // Create matrix
  const matrix: { [correct: string]: { [user: string]: number } } = {};
  colors.forEach(correct => {
    matrix[correct] = {};
    colors.forEach(user => {
      matrix[correct][user] = 0;
    });
  });

  data.forEach(item => {
    if (matrix[item.correct] && matrix[item.correct][item.user] !== undefined) {
      matrix[item.correct][item.user] = item.count;
    }
  });

  // Find max count for normalization
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Color intensity function
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-50';
    const intensity = Math.min(count / maxCount, 1);
    if (intensity > 0.7) return 'bg-red-600';
    if (intensity > 0.5) return 'bg-red-400';
    if (intensity > 0.3) return 'bg-orange-400';
    if (intensity > 0.1) return 'bg-orange-200';
    return 'bg-orange-100';
  };

  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-600">
        แสดงจำนวนครั้งที่จำสีผิด (แถว = สีที่ถูกต้อง, คอลัมน์ = สีที่เลือก)
      </p>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header row */}
          <div className="flex">
            <div className="w-24 flex-shrink-0"></div>
            {colors.map(color => (
              <div
                key={color}
                className="flex-1 min-w-[60px] px-2 py-2 text-center text-xs font-semibold text-gray-700 border-b border-gray-200"
              >
                {getColorNameThai(color)}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {colors.map(correctColor => (
            <div key={correctColor} className="flex border-b border-gray-100">
              <div className="w-24 flex-shrink-0 px-2 py-3 text-xs font-semibold text-gray-700 border-r border-gray-200 flex items-center">
                {getColorNameThai(correctColor)}
              </div>
              {colors.map(userColor => {
                const count = matrix[correctColor]?.[userColor] || 0;
                const isDiagonal = correctColor === userColor;
                return (
                  <div
                    key={`${correctColor}-${userColor}`}
                    className={`flex-1 min-w-[60px] px-2 py-3 text-center text-xs transition-all hover:scale-105 ${
                      isDiagonal
                        ? 'bg-green-100 border-2 border-green-400'
                        : count > 0
                        ? `${getIntensity(count)} text-white font-semibold cursor-pointer`
                        : 'bg-gray-50 text-gray-400'
                    }`}
                    title={
                      isDiagonal
                        ? 'ถูกต้อง'
                        : count > 0
                        ? `จำผิด ${count} ครั้ง: ${getColorNameThai(correctColor)} → ${getColorNameThai(userColor)}`
                        : 'ไม่มีข้อมูล'
                    }
                  >
                    {isDiagonal ? '✓' : count > 0 ? count : '-'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-100 border-2 border-green-400"></div>
          <span className="text-gray-600">ถูกต้อง</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-orange-100"></div>
          <span className="text-gray-600">ผิดน้อย</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-orange-400"></div>
          <span className="text-gray-600">ผิดปานกลาง</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-600"></div>
          <span className="text-gray-600">ผิดมาก</span>
        </div>
      </div>
    </div>
  );
}

