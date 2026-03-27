'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { colorCodes } from '@/lib/resistorUtils';

const standardColors = ['gold', 'silver'];
const precisionColors = ['brown', 'red', 'green', 'blue', 'violet', 'gray'];

const colorHexMap: { [key: string]: string } = {
  brown: '#8B4513',
  red: '#DC143C',
  green: '#008000',
  blue: '#0000FF',
  violet: '#8B00FF',
  gray: '#808080',
  gold: '#FFD700',
  silver: '#C0C0C0',
};

const colorNameMap: { [key: string]: string } = {
  brown: 'น้ำตาล',
  red: 'แดง',
  green: 'เขียว',
  blue: 'น้ำเงิน',
  violet: 'ม่วง',
  gray: 'เทา',
  gold: 'ทอง',
  silver: 'เงิน',
};

const getToleranceValue = (tolerance: string): number => {
  const match = tolerance.match(/±([\d.]+)%/);
  return match ? parseFloat(match[1]) : 0;
};

export default function ToleranceChart() {
  const standardData = standardColors.map((color) => {
    const tolerance = colorCodes.tolerance[color as keyof typeof colorCodes.tolerance] || '±5%';
    return {
      name: colorNameMap[color] || color,
      value: getToleranceValue(tolerance),
      tolerance,
      category: 'มาตรฐาน',
      color: colorHexMap[color] || '#CCCCCC',
    };
  });

  const precisionData = precisionColors.map((color) => {
    const tolerance = colorCodes.tolerance[color as keyof typeof colorCodes.tolerance] || '±1%';
    return {
      name: colorNameMap[color] || color,
      value: getToleranceValue(tolerance),
      tolerance,
      category: 'ความละเอียดสูง',
      color: colorHexMap[color] || '#CCCCCC',
    };
  });

  const allData = [...standardData, ...precisionData].sort((a, b) => a.value - b.value);

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-900">ค่าความคลาดเคลื่อน</h4>
        <p className="mt-1 text-sm text-slate-600">Bar Chart เปรียบเทียบ Standard vs Precision</p>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={allData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              label={{ value: 'ค่าความคลาดเคลื่อน (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number, payload: any) => [
                `${value}%`,
                payload?.payload?.tolerance || '',
              ]}
            />
            <Legend />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {allData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.category === 'มาตรฐาน' ? '#f97316' : entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
          <div className="text-sm font-semibold text-orange-700">กลุ่มมาตรฐาน</div>
          <div className="mt-1 text-xs text-orange-600">Gold ±5%, Silver ±10%</div>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="text-sm font-semibold text-blue-700">กลุ่มความละเอียดสูง</div>
          <div className="mt-1 text-xs text-blue-600">Brown ±1% ถึง Gray ±0.05%</div>
        </div>
      </div>
    </div>
  );
}
