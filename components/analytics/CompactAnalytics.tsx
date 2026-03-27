'use client';

import { DeepAnalytics } from '@/lib/analyticsUtils';
import { formatRadarData } from '@/lib/analyticsChartUtils';
import { translateWeakAreaDescription } from '@/lib/textUtils';
import DeepAnalyticsRadarChart from './DeepAnalyticsRadarChart';
import { FileText, HelpCircle, Target, Clock, AlertTriangle } from 'lucide-react';

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

  // Calculate average time per question if available
  const avgTimePerQuestion = overall && overall.totalQuestions > 0 
    ? Math.round((overall.totalSessions * 60) / overall.totalQuestions) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      {overall && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-700">{overall.totalSessions}</div>
                <div className="text-xs font-medium text-orange-600">เซสชันทั้งหมด</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{overall.totalQuestions}</div>
                <div className="text-xs font-medium text-blue-600">คำถามทั้งหมด</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">{overall.overallAccuracy.toFixed(1)}%</div>
                <div className="text-xs font-medium text-green-600">ความแม่นยำเฉลี่ย</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{avgTimePerQuestion}s</div>
                <div className="text-xs font-medium text-purple-600">เวลาเฉลี่ย/ข้อ</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 mb-4">ความแม่นยำตามหมวดหมู่</h4>
            <DeepAnalyticsRadarChart
              data={radarData}
              title=""
              height={280}
            />
          </div>
        )}

        {/* Top Weak Areas */}
        <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-bold text-gray-700">จุดที่ควรฝึกเพิ่ม</h4>
          </div>
          
          {topWeakAreas && topWeakAreas.length > 0 ? (
            <div className="space-y-3">
              {topWeakAreas.slice(0, 5).map((area, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-red-100 text-red-600' :
                      index === 1 ? 'bg-orange-100 text-orange-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {translateWeakAreaDescription(area.description)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          area.errorRate >= 50 ? 'bg-red-500' :
                          area.errorRate >= 30 ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(area.errorRate, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-red-600 w-12 text-right">
                      {area.errorRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Target className="h-10 w-10 mb-2" />
              <p className="text-sm">ยังไม่พบจุดอ่อน</p>
              <p className="text-xs">ฝึกเพิ่มเพื่อดูการวิเคราะห์</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
