'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChartData } from '@/lib/analyticsChartUtils';

interface ErrorRateBarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
}

export default function ErrorRateBarChart({
  data,
  title = 'อัตราความผิดพลาดตามตำแหน่ง',
  height = 300
}: ErrorRateBarChartProps) {
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
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'อัตราความผิดพลาด (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'อัตราความผิดพลาด']}
            />
            <Legend />
            <Bar
              dataKey="value"
              name="อัตราความผิดพลาด"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>แสดงอัตราความผิดพลาดของแต่ละตำแหน่ง (ยิ่งสูง = ผิดบ่อย)</p>
      </div>
    </div>
  );
}

