'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ClassroomLeftSidebar from '@/components/layout/ClassroomLeftSidebar'

export default function StudentCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('Failed to load courses')
        const data = await res.json()
        setCourses(data || [])
      } catch (err) {
        console.error('Error loading courses:', err)
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

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">

          {/* ============= HEADER ============= */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              My Courses
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Courses you have enrolled in.
            </p>
          </div>

          {/* ============= LOADING ============= */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-r-transparent" />
                <p className="text-gray-600">Loading courses...</p>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <>
              {/* ============= TOP BAR ============= */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Enrolled Courses
                </h2>

                <button
                  className="
                    w-full sm:w-auto px-6 py-3 rounded-xl 
                    bg-orange-500 text-white font-medium 
                    hover:bg-orange-600 transition-all shadow-md
                    text-sm sm:text-base
                  "
                  onClick={() =>
                    router.push('/learn/classroom/courses/enroll')
                  }
                >
                  🔑 Join Course
                </button>
              </div>

              {/* ============= COURSE GRID ============= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() =>
                      router.push(`/learn/classroom/courses/${course.id}`)
                    }
                    className="
                      cursor-pointer rounded-2xl bg-white p-4 sm:p-5
                      shadow-md border border-orange-200
                      hover:shadow-xl hover:border-orange-400 hover:bg-orange-50
                      transition-all duration-200 hover:-translate-y-1
                    "
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      {course.name}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm mb-2">
                      Code: <span className="font-mono">{course.code}</span>
                    </p>

                    <p className="text-gray-500 text-xs sm:text-sm">
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
            </>
          ) : (
            /* ============= NO COURSES ============= */
            <div className="text-center mt-16">
              <p className="text-gray-600 text-lg mb-6">
                You haven’t joined any courses yet.
              </p>

              <button
                className="
                  w-full sm:w-auto px-6 py-3 rounded-xl 
                  bg-orange-500 text-white font-medium 
                  hover:bg-orange-600 transition-all shadow-md
                  text-sm sm:text-base
                "
                onClick={() =>
                  router.push('/learn/classroom/courses/enroll')
                }
              >
                🔑 Join Course
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
