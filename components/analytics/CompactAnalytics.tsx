'use client';

import { DeepAnalytics } from '@/lib/analyticsUtils';
import { formatRadarData } from '@/lib/analyticsChartUtils';
import { translateWeakAreaDescription } from '@/lib/textUtils';
import DeepAnalyticsRadarChart from './DeepAnalyticsRadarChart';

interface CompactAnalyticsProps {
  deepAnalytics: DeepAnalytics;
  overall?: {
    totalSessions: number;
    totalQuestions: number;
    overallAccuracy: number;
  };
  topWeakAreas?: Array<{
    type: string;
    description: string;
    errorRate: number;
  }>;
}

export default function CompactAnalytics({
  deepAnalytics,
  overall,
  topWeakAreas
}: CompactAnalyticsProps) {
  const radarData = formatRadarData(deepAnalytics);

  return (
    <div className="space-y-6">
      {/* Compact Stats */}
      {overall && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{overall.totalSessions}</div>
            <div className="mt-1 text-xs text-gray-600">เซสชัน</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{overall.totalQuestions}</div>
            <div className="mt-1 text-xs text-gray-600">คำถาม</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{overall.overallAccuracy.toFixed(1)}%</div>
            <div className="mt-1 text-xs text-gray-600">ความแม่นยำ</div>
          </div>
        </div>
      )}

      {/* Compact Radar Chart */}
      {radarData.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4">
          <DeepAnalyticsRadarChart
            data={radarData}
            title="ความแม่นยำโดยรวม"
            height={300}
          />
        </div>
      )}

      {/* Top 3 Weak Areas */}
      {topWeakAreas && topWeakAreas.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">จุดที่ควรฝึกเพิ่ม (Top 3)</h4>
          {topWeakAreas.slice(0, 3).map((area, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 transition-shadow hover:shadow-md"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {translateWeakAreaDescription(area.description)}
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-lg font-bold text-red-600">{area.errorRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">ผิด</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

