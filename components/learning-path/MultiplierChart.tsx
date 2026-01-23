'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { colorCodes } from '@/lib/resistorUtils';

const multiplierColors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'];
const colorHexMap: { [key: string]: string } = {
  black: '#000000',
  brown: '#8B4513',
  red: '#DC143C',
  orange: '#FF6600',
  yellow: '#FFD700',
  green: '#008000',
  blue: '#0000FF',
  violet: '#8B00FF',
  gray: '#808080',
  white: '#FFFFFF',
  gold: '#FFD700',
  silver: '#C0C0C0',
};

const colorNameMap: { [key: string]: string } = {
  black: 'ดำ',
  brown: 'น้ำตาล',
  red: 'แดง',
  orange: 'ส้ม',
  yellow: 'เหลือง',
  green: 'เขียว',
  blue: 'น้ำเงิน',
  violet: 'ม่วง',
  gray: 'เทา',
  white: 'ขาว',
  gold: 'ทอง',
  silver: 'เงิน',
};

const formatMultiplier = (value: number): string => {
  if (value >= 1000000) return `${value / 1000000}M`;
  if (value >= 1000) return `${value / 1000}k`;
  if (value < 1) return value.toString();
  return value.toString();
};

export default function MultiplierChart() {
  const data = multiplierColors.map((color) => {
    const value = colorCodes.multiplier[color as keyof typeof colorCodes.multiplier] || 0;
    return {
      name: colorNameMap[color] || color,
      value: value,
      logValue: value > 0 ? Math.log10(value) : 0,
      color: colorHexMap[color] || '#CCCCCC',
      isSpecial: color === 'gold' || color === 'silver',
    };
  });

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-900">ค่าตัวคูณ</h4>
        <p className="mt-1 text-sm text-slate-600">Bar Chart แสดงค่าตัวคูณของแต่ละสี (Log Scale)</p>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              label={{ value: 'Log Scale', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number) => [formatMultiplier(value), 'ตัวคูณ']}
            />
            <Bar dataKey="logValue" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isSpecial ? '#f97316' : entry.color}
                  stroke={entry.isSpecial ? '#ea580c' : undefined}
                  strokeWidth={entry.isSpecial ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center text-sm text-orange-700">
        สีทองและสีเงิน (แถบสีส้ม) เป็นตัวหารทศนิยม (×0.1 และ ×0.01)
      </div>
    </div>
  );
}
