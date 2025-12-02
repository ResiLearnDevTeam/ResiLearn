'use client'

import ClassroomLeftSidebar from '@/components/layout/ClassroomLeftSidebar'
import CreateCourseForm from '@/components/features/classroom/CreateCourseForm'

export default function CreateCoursePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Sidebar */}
      <ClassroomLeftSidebar />

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-10 lg:px-8">

          {/* Page Header */}
          <div className="mb-6 sm:mb-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create a New Course
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Fill out the form below to set up a new course.
            </p>
          </div>

          {/* Form Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <CreateCourseForm />
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
