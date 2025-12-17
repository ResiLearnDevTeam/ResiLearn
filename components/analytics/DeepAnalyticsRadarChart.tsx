'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { RadarChartData } from '@/lib/analyticsChartUtils';
import { getSimplifiedLabel } from '@/lib/textUtils';

interface DeepAnalyticsRadarChartProps {
  data: RadarChartData[];
  title?: string;
  height?: number;
}

export default function DeepAnalyticsRadarChart({
  data,
  title = 'ความแม่นยำโดยรวม',
  height = 400
}: DeepAnalyticsRadarChartProps) {
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

  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name={getSimplifiedLabel('ความแม่นยำ')}
              dataKey="value"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, getSimplifiedLabel('ความแม่นยำ')]}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>แสดงความแม่นยำในแต่ละมิติ (0-100%)</p>
      </div>
    </div>
  );
}

