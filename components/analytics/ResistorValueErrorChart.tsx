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

interface ResistorValueErrorChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
}

export default function ResistorValueErrorChart({
  data,
  title = 'ค่าตัวต้านทานที่ทำผิดบ่อย',
  height = 300
}: ResistorValueErrorChartProps) {
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
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} ครั้ง (ความแม่นยำ: ${props.payload.accuracy?.toFixed(1) || 0}%)`,
                'จำนวนครั้งที่ผิด'
              ]}
            />
            <Legend />
            <Bar
              dataKey="value"
              name="จำนวนครั้งที่ผิด"
              fill="#f97316"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>แสดงค่าตัวต้านทานที่ทำผิดบ่อยที่สุด (Top {data.length})</p>
      </div>
    </div>
  );
}

