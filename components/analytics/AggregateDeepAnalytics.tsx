'use client';

import { useState, useEffect } from 'react';
import { DeepAnalytics } from '@/lib/analyticsUtils';
import {
  formatRadarData,
  formatHeatmapData,
  formatBarChartData,
  formatPieChartData,
  getTopResistorValueErrors,
  formatQuestionTypeComparisonData
} from '@/lib/analyticsChartUtils';
import { translateSectionTitle, translateWeakAreaDescription, translateWeakAreaType } from '@/lib/textUtils';
import AnalyticsTabs from './AnalyticsTabs';
import CompactAnalytics from './CompactAnalytics';
import DeepAnalyticsRadarChart from './DeepAnalyticsRadarChart';
import ColorConfusionHeatmap from './ColorConfusionHeatmap';
import ErrorRateBarChart from './ErrorRateBarChart';
import ResistorValueErrorChart from './ResistorValueErrorChart';
import ToleranceErrorPieChart from './ToleranceErrorPieChart';
import QuestionTypeComparisonChart from './QuestionTypeComparisonChart';
import { BarChart3, AlertTriangle, Lightbulb, TrendingDown } from 'lucide-react';

interface AggregateDeepAnalyticsProps {
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

export default function AggregateDeepAnalytics({ overall: propOverall, topWeakAreas: propTopWeakAreas }: AggregateDeepAnalyticsProps) {
  const [deepAnalytics, setDeepAnalytics] = useState<DeepAnalytics | null>(null);
  const [overall, setOverall] = useState(propOverall);
  const [topWeakAreas, setTopWeakAreas] = useState(propTopWeakAreas);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAggregateAnalytics();
  }, []);

  const fetchAggregateAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/practice');
      if (response.ok) {
        const data = await response.json();
        setDeepAnalytics(data);
        if (data.overall) {
          setOverall(data.overall);
        }
        if (data.topWeakAreas) {
          setTopWeakAreas(data.topWeakAreas);
        }
      }
    } catch (error) {
      console.error('Error fetching aggregate analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">สรุปผลการฝึกฝน</h2>
        </div>
        <div className="flex h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!deepAnalytics) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">สรุปผลการฝึกฝน</h2>
        </div>
        <div className="flex h-[150px] items-center justify-center text-gray-400">
          <p>ไม่มีข้อมูลสำหรับการวิเคราะห์</p>
        </div>
      </div>
    );
  }

  const hasData = 
    (deepAnalytics.resistorTypeErrors.FOUR_BAND.correct + deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect > 0) ||
    (deepAnalytics.resistorTypeErrors.FIVE_BAND.correct + deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect > 0) ||
    Object.keys(deepAnalytics.questionTypeErrors).length > 0 ||
    Object.keys(deepAnalytics.colorConfusion).length > 0;

  if (!hasData) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">สรุปผลการฝึกฝน</h2>
        </div>
        <div className="flex h-[150px] items-center justify-center text-gray-400">
          <p>ไม่มีข้อมูลสำหรับการวิเคราะห์เชิงลึก</p>
        </div>
      </div>
    );
  }

  // Format data for charts
  const radarData = formatRadarData(deepAnalytics);
  const heatmapData = formatHeatmapData(deepAnalytics.colorConfusion);
  const barChartData = formatBarChartData(deepAnalytics.digitPositionErrors);
  const pieChartData = formatPieChartData(deepAnalytics.toleranceErrors);
  const resistorValueData = getTopResistorValueErrors(deepAnalytics.resistorValueErrors, 10);
  const questionTypeData = formatQuestionTypeComparisonData(deepAnalytics.questionTypeErrors);

  // Group weak areas by type
  const groupedWeakAreas = topWeakAreas?.reduce((acc, area) => {
    const type = area.type || 'อื่นๆ';
    if (!acc[type]) acc[type] = [];
    acc[type].push(area);
    return acc;
  }, {} as Record<string, typeof topWeakAreas>);

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
          <BarChart3 className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">สรุปผลการฝึกฝน</h2>
          <p className="text-sm text-gray-500">วิเคราะห์จุดแข็งและจุดอ่อนของคุณ</p>
        </div>
      </div>
      
      <AnalyticsTabs
        defaultTab="overview"
        overviewContent={
          <div className="space-y-6">
            <CompactAnalytics
              deepAnalytics={deepAnalytics}
              overall={overall}
              topWeakAreas={topWeakAreas}
            />
            
            {/* Additional Charts */}
            {questionTypeData.length > 0 && (
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 w-full overflow-hidden">
                <h4 className="text-sm font-bold text-gray-700 mb-3">เปรียบเทียบตามประเภทคำถาม</h4>
                <div className="w-full">
                  <QuestionTypeComparisonChart
                    data={questionTypeData}
                    title=""
                    height={280}
                  />
                </div>
              </div>
            )}
          </div>
        }
        weaknessesContent={
          topWeakAreas && topWeakAreas.length > 0 ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-semibold text-red-700">จุดอ่อนที่พบ</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600">{topWeakAreas.length}</div>
                  <div className="text-xs text-red-500">รายการ</div>
                </div>
                <div className="rounded-xl bg-orange-50 p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700">อัตราผิดสูงสุด</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">
                    {topWeakAreas[0]?.errorRate.toFixed(0) || 0}%
                  </div>
                  <div className="text-xs text-orange-500">ต้องปรับปรุงเร่งด่วน</div>
                </div>
              </div>

              {/* Weak Areas List */}
              <div className="space-y-4">
                {Object.entries(groupedWeakAreas || {}).map(([type, areas]) => (
                  <div key={type} className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-600">
                        {areas?.length || 0}
                      </span>
                      {translateWeakAreaType(type)}
                    </h4>
                    <div className="space-y-2">
                      {areas?.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-100 hover:border-red-200 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">
                              {translateWeakAreaDescription(area.description)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  area.errorRate >= 50 ? 'bg-red-500' :
                                  area.errorRate >= 30 ? 'bg-orange-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(area.errorRate, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold w-14 text-right ${
                              area.errorRate >= 50 ? 'text-red-600' :
                              area.errorRate >= 30 ? 'text-orange-600' :
                              'text-yellow-600'
                            }`}>
                              {area.errorRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-700 mb-1">คำแนะนำ</h4>
                    <p className="text-sm text-blue-600">
                      ควรฝึกฝนจุดอ่อนที่มีเปอร์เซ็นต์สูงก่อน เพื่อเพิ่มความแม่นยำโดยรวม 
                      ลองฝึกแบบ "กำหนดเอง" เพื่อเน้นเฉพาะส่วนที่ต้องปรับปรุง
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts related to weaknesses */}
              <div className="space-y-4">
                {barChartData.length > 0 && (
                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 w-full overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">อัตราผิดตามตำแหน่งแถบสี</h4>
                    <div className="w-full">
                      <ErrorRateBarChart
                        data={barChartData}
                        title=""
                        height={280}
                      />
                    </div>
                  </div>
                )}

                {pieChartData.length > 0 && (
                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 w-full overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">ความคลาดเคลื่อนที่ผิดบ่อย</h4>
                    <div className="w-full">
                      <ToleranceErrorPieChart
                        data={pieChartData}
                        title=""
                        height={280}
                      />
                    </div>
                  </div>
                )}

                {resistorValueData.length > 0 && (
                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 w-full overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">ค่าความต้านทานที่ผิดบ่อย</h4>
                    <div className="w-full">
                      <ResistorValueErrorChart
                        data={resistorValueData}
                        title=""
                        height={280}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <AlertTriangle className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">ยังไม่พบจุดอ่อน</p>
              <p className="text-sm">ฝึกฝนเพิ่มเติมเพื่อให้ระบบวิเคราะห์ได้แม่นยำขึ้น</p>
            </div>
          )
        }
      />
    </div>
  );
}
