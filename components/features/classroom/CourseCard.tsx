'use client'

import { useRouter } from 'next/navigation'

interface CourseCardProps {
  course: any
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() =>
        router.push(`/learn/classroom/teacher/courses/${course.id}`)
      }
      className="
        cursor-pointer rounded-2xl bg-white p-4 sm:p-5 
        shadow-md border border-orange-200
        hover:shadow-xl hover:border-orange-400 hover:bg-orange-50
        transition-all duration-200 hover:-translate-y-1
      "
    >
      {/* รูปภาพ */}
      {course.image ? (
        <img
          src={course.image}
          alt={course.name}
          className="
            w-full h-36 sm:h-40 md:h-48 
            object-cover rounded-lg mb-4
          "
        />
      ) : (
        <div
          className="
            w-full h-36 sm:h-40 md:h-48 
            flex items-center justify-center 
            bg-gray-100 rounded-lg mb-4 
            text-gray-400 text-sm
          "
        >
          No Image
        </div>
      )}

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
  )
}
