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
import { GroupedBarChartData } from '@/lib/analyticsChartUtils';

import { getSimplifiedLabel } from '@/lib/textUtils';

interface QuestionTypeComparisonChartProps {
  data: GroupedBarChartData[];
  title?: string;
  height?: number;
}

export default function QuestionTypeComparisonChart({
  data,
  title = 'เปรียบเทียบตามแบบคำถาม',
  height = 300
}: QuestionTypeComparisonChartProps) {
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
              height={100}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: getSimplifiedLabel('จำนวน'), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
            <Bar
              dataKey="correct"
              name={getSimplifiedLabel('ถูกต้อง')}
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="incorrect"
              name={getSimplifiedLabel('ผิดพลาด')}
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>เปรียบเทียบจำนวนคำตอบที่ถูกต้องและผิดพลาดในแต่ละประเภทคำถาม</p>
      </div>
    </div>
  );
}

