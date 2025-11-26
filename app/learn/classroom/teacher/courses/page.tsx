'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ClassroomLeftSidebar from '@/components/layout/ClassroomLeftSidebar'
import CourseCard from '@/components/features/classroom/CourseCard'

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('Failed to load courses')
        const data = await res.json()
        setCourses(data)
      } catch {
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Sidebar */}
      <ClassroomLeftSidebar />

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          👩‍🏫 Teacher Dashboard
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
          View and manage the courses you’ve created.
        </p>

        {/* Loading */}
        {isLoading ? (
          <div className="text-gray-500 animate-pulse">Loading courses...</div>
        ) : courses.length > 0 ? (
          <>
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                📚 Your Courses
              </h2>

              <button
                className="
                  w-full sm:w-auto px-5 py-2.5 rounded-xl 
                  bg-orange-500 text-white font-medium 
                  hover:bg-orange-600 transition-all shadow-md
                "
                onClick={() =>
                  router.push('/learn/classroom/teacher/courses/create')
                }
              >
                ➕ Create Course
              </button>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        ) : (
          // No courses
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg mb-6">
              You don’t have any courses yet.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="
                  w-full sm:w-auto px-6 py-3 rounded-xl 
                  bg-orange-500 text-white font-medium 
                  hover:bg-orange-600 transition-all shadow-md
                "
                onClick={() =>
                  router.push('/learn/classroom/teacher/courses/create')
                }
              >
                ➕ Create Course
              </button>

              <button
                className="
                  w-full sm:w-auto px-6 py-3 rounded-xl 
                  bg-gray-200 text-gray-800 font-medium 
                  hover:bg-gray-300 transition-all shadow-md
                "
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
