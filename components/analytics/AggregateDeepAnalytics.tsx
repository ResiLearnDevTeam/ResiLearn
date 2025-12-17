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
import { translateSectionTitle, translateWeakAreaDescription } from '@/lib/textUtils';
import AnalyticsTabs from './AnalyticsTabs';
import CompactAnalytics from './CompactAnalytics';
import DeepAnalyticsRadarChart from './DeepAnalyticsRadarChart';
import ColorConfusionHeatmap from './ColorConfusionHeatmap';
import ErrorRateBarChart from './ErrorRateBarChart';
import ResistorValueErrorChart from './ResistorValueErrorChart';
import ToleranceErrorPieChart from './ToleranceErrorPieChart';
import QuestionTypeComparisonChart from './QuestionTypeComparisonChart';

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
        // API returns the aggregated analytics with overall and topWeakAreas
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
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{translateSectionTitle('สรุปผลการฝึกฝน')}</h2>
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!deepAnalytics) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{translateSectionTitle('สรุปผลการฝึกฝน')}</h2>
        <div className="flex h-[200px] items-center justify-center text-gray-400">
          <p>ไม่มีข้อมูลสำหรับการวิเคราะห์</p>
        </div>
      </div>
    );
  }

  // Check if there's any data
  const hasData = 
    (deepAnalytics.resistorTypeErrors.FOUR_BAND.correct + deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect > 0) ||
    (deepAnalytics.resistorTypeErrors.FIVE_BAND.correct + deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect > 0) ||
    Object.keys(deepAnalytics.questionTypeErrors).length > 0 ||
    Object.keys(deepAnalytics.colorConfusion).length > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{translateSectionTitle('สรุปผลการฝึกฝน')}</h2>
        <div className="flex h-[200px] items-center justify-center text-gray-400">
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

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{translateSectionTitle('สรุปผลการฝึกฝน')}</h2>
      
      <AnalyticsTabs
        defaultTab="overview"
        overviewContent={
          <CompactAnalytics
            deepAnalytics={deepAnalytics}
            overall={overall}
            topWeakAreas={topWeakAreas}
          />
        }
        weaknessesContent={
          topWeakAreas && topWeakAreas.length > 0 ? (
            <div className="space-y-3">
              {topWeakAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {translateWeakAreaDescription(area.description)}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{area.type}</div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-xl font-bold text-red-600">{area.errorRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">ผิด</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-gray-400">
              <p>ไม่มีจุดอ่อนที่พบ</p>
            </div>
          )
        }
        chartsContent={
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Radar Chart */}
            {radarData.length > 0 && (
              <DeepAnalyticsRadarChart
                data={radarData}
                title={translateSectionTitle('ความแม่นยำโดยรวม')}
                height={250}
              />
            )}

            {/* Question Type Comparison */}
            {questionTypeData.length > 0 && (
              <QuestionTypeComparisonChart
                data={questionTypeData}
                title={translateSectionTitle('เปรียบเทียบตามแบบคำถาม')}
                height={250}
              />
            )}

            {/* Error Rate by Position */}
            {barChartData.length > 0 && (
              <ErrorRateBarChart
                data={barChartData}
                title={translateSectionTitle('ผิดบ่อยที่ตำแหน่งไหน')}
                height={250}
              />
            )}

            {/* Tolerance Errors */}
            {pieChartData.length > 0 && (
              <ToleranceErrorPieChart
                data={pieChartData}
                title={translateSectionTitle('ความคลาดเคลื่อนที่ผิดบ่อย')}
                height={250}
              />
            )}

            {/* Color Confusion Heatmap - Full width */}
            {heatmapData.length > 0 && (
              <div className="lg:col-span-2">
                <ColorConfusionHeatmap
                  data={heatmapData}
                  title={translateSectionTitle('สีที่จำผิดบ่อย')}
                />
              </div>
            )}

            {/* Resistor Value Errors - Full width */}
            {resistorValueData.length > 0 && (
              <div className="lg:col-span-2">
                <ResistorValueErrorChart
                  data={resistorValueData}
                  title={translateSectionTitle('ค่าที่ผิดบ่อย')}
                  height={250}
                />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

