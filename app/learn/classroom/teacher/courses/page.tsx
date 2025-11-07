'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LeftSidebar from '@/components/layout/LeftSidebar'

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 🔹 โหลดคอร์สของอาจารย์ที่ล็อกอินอยู่
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('Failed to load courses')
        const data = await res.json()
        setCourses(data)
      } catch (err) {
        console.error('❌ Error fetching courses:', err)
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          👩‍🏫 Teacher Dashboard
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          View and manage the courses you’ve created.
        </p>

        {isLoading ? (
          <div className="text-gray-500 animate-pulse">Loading courses...</div>
        ) : courses.length > 0 ? (
          <div>
            {/* 🟢 ส่วนหัว + ปุ่มสร้างคอร์ส */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                📚 Your Courses
              </h2>
              <button
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm"
                onClick={() =>
                  router.push('/learn/classroom/teacher/courses/create')
                }
              >
                ➕ Create Course
              </button>
            </div>

            {/* 🔹 แสดงคอร์สทั้งหมด */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() =>
                    router.push(`/learn/classroom/teacher/courses/${course.id}`)
                  }
                  className="cursor-pointer rounded-2xl bg-white p-5 shadow-md border border-blue-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  {/* รูปภาพ */}
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg mb-4 text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  {/* ชื่อคอร์ส */}
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {course.name}
                  </h3>

                  {/* รหัสคอร์ส */}
                  <p className="text-gray-500 text-sm mb-2">
                    Code: <span className="font-mono">{course.code}</span>
                  </p>

                  {/* วันเริ่มและวันสิ้นสุด */}
                  <p className="text-gray-400 text-sm">
                    {course.startDate
                      ? new Date(course.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}{' '}
                    –{' '}
                    {course.endDate
                      ? new Date(course.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg mb-6">
              You don’t have any courses yet.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
                onClick={() =>
                  router.push('/learn/classroom/teacher/courses/create')
                }
              >
                ➕ Create Course
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all shadow-md"
                onClick={() => alert('Join feature is not available yet')}
              >
                🔗 Join Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
