'use client';

import { useState, useEffect } from 'react';
import AggregateDeepAnalytics from '@/components/analytics/AggregateDeepAnalytics';

interface CourseAnalyticsProps {
  courseId: string;
}

export default function CourseAnalytics({ courseId }: CourseAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourseAnalytics();
  }, [courseId]);

  const fetchCourseAnalytics = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching course analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">การวิเคราะห์ผลการเรียน</h2>
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">การวิเคราะห์ผลการเรียน</h2>
        <div className="flex h-[200px] items-center justify-center text-gray-400">
          <p>ไม่มีข้อมูลสำหรับการวิเคราะห์</p>
        </div>
      </div>
    );
  }

  return (
    <AggregateDeepAnalytics
      overall={analyticsData.overall}
      topWeakAreas={analyticsData.topWeakAreas}
    />
  );
}

