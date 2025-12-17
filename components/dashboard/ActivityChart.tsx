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
    data: any[]; // Practice sessions
}

export default function ActivityChart({ data }: ActivityChartProps) {
    // Filter and transform practice sessions for the chart
    const validData = Array.isArray(data) ? data.filter((session) => 
        session && 
        session.completedAt && 
        (session.accuracy !== null && session.accuracy !== undefined)
    ) : [];
    
    // Sort by completedAt ascending for trend calculation
    const sortedData = [...validData].sort((a, b) => 
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    
    // Calculate trend line (simple moving average for prediction)
    const chartData = sortedData.map((session, index) => {
        // Calculate moving average of last 3 sessions for trend prediction
        const windowSize = Math.min(3, index + 1);
        const recentSessions = sortedData.slice(Math.max(0, index - windowSize + 1), index + 1);
        const avgAccuracy = recentSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / recentSessions.length;
        
        return {
            name: new Date(session.completedAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
            accuracy: Math.round(session.accuracy || 0),
            trend: Math.round(avgAccuracy), // Predicted trend
            sessionName: session.presetName || 'ฝึกด่วน',
        };
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">แนวโน้มผลการเรียน</h3>
                <p className="text-sm text-gray-500">แนวโน้มความแม่นยำจากเซสชันการฝึกฝน</p>
            </div>

            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                                formatter={(value: number, name: string, props: any) => {
                                    if (name === 'accuracy') {
                                        return [`${value}%`, 'ความแม่นยำ'];
                                    } else if (name === 'trend') {
                                        return [`${value}%`, 'แนวโน้ม'];
                                    }
                                    return [value, name];
                                }}
                                labelFormatter={(label) => `วันที่: ${label}`}
                                cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="accuracy"
                                name="ความแม่นยำ"
                                stroke="#f97316"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAccuracy)"
                            />
                            <Area
                                type="monotone"
                                dataKey="trend"
                                name="แนวโน้ม"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={0}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <p>เริ่มฝึกฝนเพื่อดูแนวโน้มความคืบหน้าของคุณ</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
