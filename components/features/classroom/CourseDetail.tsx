'use client'

import { useEffect, useState } from 'react'

interface CourseDetailProps {
  courseId: string
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const [course, setCourse] = useState<any>(null)
  const [teacherName, setTeacherName] = useState<string>('Unknown Teacher')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // โหลดข้อมูลคอร์ส
        const courseRes = await fetch(`/api/courses/${courseId}`)
        const courseData = await courseRes.json()
        setCourse(courseData)

        if (courseData.teacher?.name) {
          setTeacherName(courseData.teacher.name)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  if (loading)
    return <div className="text-gray-500 animate-pulse">Loading...</div>

  if (!course)
    return <div className="text-red-500">Course not found.</div>

  return (
    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-orange-200">

      {course.image && (
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-56 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {course.name}
      </h1>

      <p className="text-gray-600 text-lg mb-4">
        {course.description || 'No description provided.'}
      </p>

      <div className="mb-4 text-gray-700">
        <p>
          <span className="font-semibold">Course Code:</span>{' '}
          {course.code}
        </p>
      </div>

      <div className="mb-4 text-gray-700">
        <p>
          <span className="font-semibold">Teacher :</span>{' '}
          {teacherName}
        </p>
      </div>

    </div>
  )
}
