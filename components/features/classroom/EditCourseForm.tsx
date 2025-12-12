'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CoursePageProps {
  courseId: string
}

interface Course {
  code?: string
  title: string
  description: string
  image: string
  isPublished: boolean
  isResistorContent: boolean
}

export default function EditCourseForm({ courseId }: CoursePageProps) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [openEdit, setOpenEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)

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

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/setting`)
        if (!res.ok) throw new Error('Failed to fetch course')
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
    loadCourse()
  }, [courseId])

  const openEditModal = () => {
    if (!course) return
    setEditCourse({ ...course })
    setOpenEdit(true)
  }

  const handleSave = async () => {
    if (!editCourse?.title.trim()) return alert('กรุณากรอกชื่อคอร์ส')
    try {
      setSaving(true)
      const res = await fetch(`/api/courses/${courseId}/setting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCourse),
      })
      if (!res.ok) throw new Error('Failed to update course')
      alert('บันทึกคอร์สเรียบร้อยแล้ว')
      setOpenEdit(false)
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('คุณต้องการจบคอร์สนี้ใช่ไหม?')) return
    try {
      const res = await fetch(`/api/courses/${courseId}/setting`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete course')
      alert('คอร์สถูกจบเรียบร้อยแล้ว')
      router.push('/learn/classroom/teacher')
    } catch (err) {
      console.error(err)
      alert('ไม่สามารถจบคอร์สได้')
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>
  if (!course) return <div className="text-red-500">Course not found</div>

  return (
    <div className="flex justify-center w-full py-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-xl border shadow-lg p-10">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-700 mt-3 text-base">
          <span className="font-semibold">Course Code:</span> {course.code}
        </p>

        {/* Description */}
        <p className="text-gray-800 mt-5 text-base leading-relaxed">
          {course.description?.trim() || <span className="italic text-gray-400">No description provided.</span>}
        </p>

        {/* Info Section */}
        <div className="mt-7 space-y-3 text-gray-700 text-sm">
          <p>{course.isPublished ? "คอร์สนี้เข้าร่วมได้เฉพาะการเพิ่มนักเรียนโดยครูเท่านั้น ไม่สามารถเข้าร่วมผ่านรหัสคอร์สได้" : "นักเรียนสามารถเข้าร่วมคอร์สได้โดยการกรอกรหัสคอร์ส"}</p>
          <p>{course.isResistorContent ? "คอร์สนี้มีบทเรียนเริ่มต้นมาพร้อมใช้งาน" : "คอร์สนี้ไม่มีบทเรียนเริ่มต้น"}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-7">
          <button
            onClick={openEditModal}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow text-sm sm:text-base"
          >
            แก้ไขคอร์ส
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow text-sm sm:text-base"
          >
            จบคอร์ส
          </button>
        </div>

        {/* Edit Modal */}
        {openEdit && editCourse && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6 sm:px-8">
            <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-xl space-y-6">

              <h2 className="text-2xl font-bold">แก้ไขคอร์ส</h2>

              <div>
                <label className="block text-sm font-semibold mb-1">Course Title *</label>
                <input
                  type="text"
                  value={editCourse.title}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Course Description</label>
                <textarea
                  value={editCourse.description}
                  onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                  className="w-full border p-3 rounded-lg h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={editCourse.image}
                  onChange={(e) => setEditCourse({ ...editCourse, image: e.target.value })}
                  className="w-full border p-3 rounded-lg"
                />
                {editCourse.image && (
                  <img
                    src={editCourse.image}
                    className="w-full h-48 object-cover rounded-lg mt-3 border"
                  />
                )}
              </div>

              <div className="space-y-6 mt-5">
                <div className="flex items-center gap-7">
                  <Toggle value={editCourse.isPublished} onChange={(v) => setEditCourse({ ...editCourse, isPublished: v })} />
                  <span className="text-sm font-semibold text-gray-700">Publish Course</span>
                </div>

                <div className="flex items-center gap-7">
                  <Toggle value={editCourse.isResistorContent} onChange={(v) => setEditCourse({ ...editCourse, isResistorContent: v })} />
                  <span className="text-sm font-semibold text-gray-700">Resistor Content</span>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-5">
                <button onClick={() => setOpenEdit(false)} className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">{saving ? "Saving..." : "Save Changes"}</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
