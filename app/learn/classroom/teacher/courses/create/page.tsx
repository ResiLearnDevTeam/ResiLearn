'use client'

import LeftSidebar from '@/components/layout/LeftSidebar'
import CreateCourseForm from '@/components/features/classroom/CreateCourseForm'

export default function CreateCoursePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🆕 Create a New Course
          </h1>

          <p className="text-sm sm:text-base text-gray-600">
            Fill out the form below to set up a new course.
          </p>
        </div>

        {/* Form */}
        <div className="flex justify-center">
          <CreateCourseForm />
        </div>
      </div>
    </div>
  )
}
