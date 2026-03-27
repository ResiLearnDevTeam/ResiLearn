'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { colorCodes } from '@/lib/resistorUtils';

const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'];
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
};

export default function ColorCodeChart() {
  const data = colors.map((color) => ({
    name: colorNameMap[color] || color,
    value: colorCodes.digit[color as keyof typeof colorCodes.digit] || 0,
    color: colorHexMap[color] || '#CCCCCC',
  }));

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-900">ค่าสี 0-9</h4>
        <p className="mt-1 text-sm text-slate-600">Bar Chart แสดงค่าตัวเลขของแต่ละสี</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[0, 9]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number) => [value, 'ค่า']}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
