'use client';

import { motion } from 'framer-motion';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface ActivityChartProps {
    data: any[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
    // Transform data for the chart
    const chartData = data.map((attempt) => ({
        name: new Date(attempt.completedAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
        score: Math.round(attempt.percentage),
        level: attempt.level.name,
    })).reverse();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">แนวโน้มผลการเรียน</h3>
                <p className="text-sm text-gray-500">คะแนนแบบทดสอบล่าสุดของคุณ</p>
            </div>

            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                                cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#f97316"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <p>ทำแบบทดสอบเพื่อดูแนวโน้มความคืบหน้าของคุณ</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
