'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { PieChartData } from '@/lib/analyticsChartUtils';

interface ToleranceErrorPieChartProps {
  data: PieChartData[];
  title?: string;
  height?: number;
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4'  // cyan
];

export default function ToleranceErrorPieChart({
  data,
  title = 'สัดส่วนความผิดพลาดของความคลาดเคลื่อน',
  height = 300
}: ToleranceErrorPieChartProps) {
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

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value} ครั้ง`, 'จำนวนครั้งที่ผิด']}
            />
            <Legend
              formatter={(value) => {
                const item = data.find(d => d.name === value);
                const percentage = item ? ((item.value / total) * 100).toFixed(1) : '0';
                return `${value} (${percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>แสดงสัดส่วนของความคลาดเคลื่อนที่ทำผิดบ่อย</p>
      </div>
    </div>
  );
}

