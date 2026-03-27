'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { RadarChartData } from '@/lib/analyticsChartUtils';

interface DeepAnalyticsRadarChartProps {
  data: RadarChartData[];
  title?: string;
  height?: number;
}

export default function DeepAnalyticsRadarChart({
  data,
  title = 'ความแม่นยำโดยรวม',
  height = 300
}: DeepAnalyticsRadarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-400" style={{ height: `${height}px` }}>
        <p className="text-sm">ไม่มีข้อมูลสำหรับแสดง</p>
      </div>
    );
  }

  // Custom tick renderer for better label display
  const renderPolarAngleAxisTick = (props: any) => {
    const { x, y, payload, cx, cy } = props;
    const radius = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const angle = Math.atan2(y - cy, x - cx);
    
    // Offset the label outward
    const offset = 15;
    const newX = cx + (radius + offset) * Math.cos(angle);
    const newY = cy + (radius + offset) * Math.sin(angle);
    
    return (
      <text
        x={newX}
        y={newY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium fill-gray-600"
        style={{ fontSize: '11px' }}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div>
      {title && (
        <h3 className="mb-2 text-base font-bold text-gray-800">{title}</h3>
      )}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            data={data} 
            margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
          >
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <PolarGrid 
              stroke="#e5e7eb" 
              strokeWidth={1}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="category"
              tick={renderPolarAngleAxisTick}
              tickLine={false}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickCount={5}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Radar
              name="ความแม่นยำ"
              dataKey="value"
              stroke="#f97316"
              fill="url(#radarGradient)"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: '#f97316',
                stroke: '#fff',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#ea580c',
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                padding: '12px 16px',
              }}
              formatter={(value: number) => [
                <span key="value" className="font-bold text-orange-600">{value.toFixed(1)}%</span>,
                <span key="label" className="text-gray-600">ความแม่นยำ</span>
              ]}
              labelFormatter={(label) => (
                <span className="font-semibold text-gray-800">{label}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
