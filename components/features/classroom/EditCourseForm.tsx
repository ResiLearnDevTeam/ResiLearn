'use client'

import { useState, useEffect } from 'react'

interface CoursePageProps {
  courseId: string
}

export default function CoursePage({ courseId }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [openEdit, setOpenEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  // Toggle (ใช้ในหน้าแก้ไขเท่านั้น)
  const Toggle = ({ value, onChange }: any) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-7 w-14 sm:h-8 sm:w-16 rounded-full transition-colors
        ${value ? 'bg-orange-600' : 'bg-gray-300'}`}
    >
      <div
        className={`
          absolute top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white shadow-md transition-transform
          ${value ? 'translate-x-7 sm:translate-x-8' : 'translate-x-1'}
        `}
      ></div>
    </button>
  )

  // โหลดข้อมูลคอร์ส
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/setting`)
        if (!res.ok) throw new Error('Course not found')
        const data = await res.json()

        setCourse({
          code: data.code || 'N/A',
          title: data.name || '',
          description: data.description || '',
          image: data.image || '',
          isPublished: !!data.isPublished,
          isResistorContent: !!data.isResistorContent,
        })
      } catch (err) {
        console.error(err)
        alert('Failed to load course data')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])


  // บันทึกข้อมูลใน Dialog
  const handleSave = async () => {
    if (!course?.title.trim()) return alert('กรุณากรอกชื่อคอร์ส')

    try {
      setSaving(true)
      const res = await fetch(`/api/courses/${courseId}/setting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      })

      if (!res.ok) throw new Error('Failed')

      alert('บันทึกคอร์สเรียบร้อยแล้ว')
      setOpenEdit(false)
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>
  if (!course) return <div className="text-red-500">Course not found</div>

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl border p-6 space-y-6 shadow-md">

      {/* Header */}
      <h1 className="text-2xl font-bold text-orange-600">{course.title}</h1>

      <p className="text-gray-600">
        <span className="font-semibold">Course Code:</span> {course.code}
      </p>

      {/* Description */}
      <p className="text-gray-700">
        {course.description?.trim()
          ? course.description
          : <span className="italic text-gray-400">No description provided.</span>}
      </p>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setOpenEdit(true)}
          className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow"
        >
          แก้ไขคอร์ส
        </button>

        <button
          onClick={async () => {
            if (!confirm("คุณต้องการจบคอร์สนี้ใช่ไหม?")) return

            const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" })
            if (!res.ok) return alert("ไม่สามารถจบคอร์สได้")

            alert("คอร์สถูกจบเรียบร้อยแล้ว")
            window.location.href = "/learn/classroom/teacher"
          }}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
        >
          จบคอร์ส
        </button>
      </div>


      {/* EDIT MODAL */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-6">

            <h2 className="text-xl font-bold">แก้ไขคอร์ส</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-1">Course Title *</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1">Course Description</label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                className="w-full border p-3 rounded-lg h-28 resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold mb-1">Image URL (optional)</label>
              <input
                type="text"
                value={course.image}
                onChange={(e) => setCourse({ ...course, image: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              {course.image && (
                <img src={course.image} className="w-full h-40 object-cover rounded-lg mt-3 border" />
              )}
            </div>

            {/* Toggles – moved to edit dialog */}
            <div className="space-y-6 sm:space-y-7 mt-4">
              <div className="flex items-center gap-7 sm:gap-8">
                <Toggle
                  value={course.isPublished}
                  onChange={(v: boolean) =>
                    setCourse({ ...course, isPublished: v })
                  }
                />
                <span className="text-sm font-semibold text-gray-700">Publish Course</span>
              </div>

              <div className="flex items-center gap-7 sm:gap-8">
                <Toggle
                  value={course.isResistorContent}
                  onChange={(v: boolean) =>
                    setCourse({ ...course, isResistorContent: v })
                  }
                />
                <span className="text-sm font-semibold text-gray-700">Resistor Content</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpenEdit(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
