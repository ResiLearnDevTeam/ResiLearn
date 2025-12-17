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
        <h2 className="mb-4 text-xl font-bold text-gray-900">การวิเคราะห์เชิงลึกภาพรวม</h2>
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
        <h2 className="mb-4 text-xl font-bold text-gray-900">การวิเคราะห์เชิงลึกภาพรวม</h2>
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
        <h2 className="mb-4 text-xl font-bold text-gray-900">การวิเคราะห์เชิงลึกภาพรวม</h2>
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
    <div className="space-y-6">
      {/* Overall Stats */}
      {overall && (
        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-gray-900">สถิติภาพรวม</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{overall.totalSessions}</div>
              <div className="text-sm text-gray-600">เซสชันทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{overall.totalQuestions}</div>
              <div className="text-sm text-gray-600">คำถามทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{overall.overallAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">ความแม่นยำโดยรวม</div>
            </div>
          </div>
        </div>
      )}

      {/* Top Weak Areas */}
      {topWeakAreas && topWeakAreas.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-gray-900">จุดอ่อนที่ควรฝึกฝน</h3>
          <div className="space-y-3">
            {topWeakAreas.slice(0, 5).map((area, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{area.description}</div>
                  <div className="text-sm text-gray-600">{area.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600">{area.errorRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">อัตราความผิดพลาด</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview - Radar Chart */}
      {radarData.length > 0 && (
        <DeepAnalyticsRadarChart
          data={radarData}
          title="ภาพรวมความแม่นยำ"
          height={400}
        />
      )}

      {/* Color Confusion Heatmap */}
      {heatmapData.length > 0 && (
        <ColorConfusionHeatmap
          data={heatmapData}
          title="ความสับสนของสี"
        />
      )}

      {/* Error Rate by Position */}
      {barChartData.length > 0 && (
        <ErrorRateBarChart
          data={barChartData}
          title="อัตราความผิดพลาดตามตำแหน่ง"
          height={300}
        />
      )}

      {/* Question Type Comparison */}
      {questionTypeData.length > 0 && (
        <QuestionTypeComparisonChart
          data={questionTypeData}
          title="เปรียบเทียบความแม่นยำตามประเภทคำถาม"
          height={300}
        />
      )}

      {/* Resistor Value Errors */}
      {resistorValueData.length > 0 && (
        <ResistorValueErrorChart
          data={resistorValueData}
          title="ค่าตัวต้านทานที่ทำผิดบ่อย"
          height={300}
        />
      )}

      {/* Tolerance Errors */}
      {pieChartData.length > 0 && (
        <ToleranceErrorPieChart
          data={pieChartData}
          title="สัดส่วนความผิดพลาดของความคลาดเคลื่อน"
          height={300}
        />
      )}
    </div>
  );
}

