'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const bandData = [
  { band: 'แถบที่ 1', '4-Band': 'ตัวเลข', '5-Band': 'ตัวเลข', same: true },
  { band: 'แถบที่ 2', '4-Band': 'ตัวเลข', '5-Band': 'ตัวเลข', same: true },
  { band: 'แถบที่ 3', '4-Band': 'ตัวคูณ', '5-Band': 'ตัวเลข', same: false },
  { band: 'แถบที่ 4', '4-Band': 'Tolerance', '5-Band': 'ตัวคูณ', same: false },
  { band: 'แถบที่ 5', '4-Band': '-', '5-Band': 'Tolerance', same: false },
];

export default function BandComparisonChart() {
  const data = bandData.map((item, index) => ({
    band: item.band,
    '4-Band': item['4-Band'] === '-' ? 0 : item['4-Band'] === 'ตัวเลข' ? 1 : item['4-Band'] === 'ตัวคูณ' ? 2 : 3,
    '5-Band': item['5-Band'] === '-' ? 0 : item['5-Band'] === 'ตัวเลข' ? 1 : item['5-Band'] === 'ตัวคูณ' ? 2 : 3,
    same: item.same,
  }));

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-900">เปรียบเทียบ 4-Band vs 5-Band</h4>
        <p className="mt-1 text-sm text-slate-600">Side-by-side comparison ของหน้าที่แต่ละแถบ</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="band"
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[0, 3]}
              tickFormatter={(value) => {
                const labels = ['-', 'ตัวเลข', 'ตัวคูณ', 'Tolerance'];
                return labels[value] || '';
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number) => {
                const labels = ['-', 'ตัวเลข', 'ตัวคูณ', 'Tolerance'];
                return [labels[value] || '', 'หน้าที่'];
              }}
            />
            <Legend />
            <Bar dataKey="4-Band" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="5-Band" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-700">
        แถบที่ 3 คือจุดต่างสำคัญ: 4-Band ใช้เป็นตัวคูณ, 5-Band ใช้เป็นตัวเลขหลักที่ 3
      </div>
    </div>
  );
}
