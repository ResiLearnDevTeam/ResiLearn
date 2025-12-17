'use client';

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

interface SessionDeepAnalyticsProps {
  deepAnalytics: DeepAnalytics;
}

export default function SessionDeepAnalytics({ deepAnalytics }: SessionDeepAnalyticsProps) {
  // Check if there's any data
  const hasData = 
    (deepAnalytics.resistorTypeErrors.FOUR_BAND.correct + deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect > 0) ||
    (deepAnalytics.resistorTypeErrors.FIVE_BAND.correct + deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect > 0) ||
    Object.keys(deepAnalytics.questionTypeErrors).length > 0 ||
    Object.keys(deepAnalytics.colorConfusion).length > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">การวิเคราะห์เชิงลึก</h2>
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">การวิเคราะห์เชิงลึก</h2>
        <p className="mt-1 text-sm text-gray-600">
          วิเคราะห์ข้อผิดพลาดและจุดอ่อนในการฝึกฝนของคุณ
        </p>
      </div>

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

