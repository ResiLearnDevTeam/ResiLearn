'use client'

import { useState, useEffect } from 'react'

interface EditCourseFormProps {
  courseId: string
}

export default function EditCourseForm({ courseId }: EditCourseFormProps) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/setting`)
        if (!res.ok) throw new Error('Course not found')
        const data = await res.json()
        setCourse({
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

  const handleChange = (field: string, value: any) => {
    setCourse((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!course?.title.trim()) return alert('กรุณากรอกชื่อคอร์ส')

    try {
      setSaving(true)
      const res = await fetch(`/api/courses/${courseId}/setting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      })

      if (!res.ok) throw new Error('Failed to update course')
      alert('บันทึกคอร์สเรียบร้อยแล้ว')

      // ✅ redirect ไปหน้า course page หลังบันทึก
      window.location.href = `/learn/classroom/teacher/courses/${courseId}`
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการบันทึกคอร์ส')
    } finally {
      setSaving(false)
    }
  }


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

  if (loading) return <div className="text-gray-500 animate-pulse">Loading...</div>
  if (!course) return <div className="text-red-500">Course not found</div>

  return (
    <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl bg-white border-2 border-orange-100 rounded-2xl shadow-lg p-5 sm:p-7 lg:p-8">
      <div className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title *</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Resistor Basics"
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Course Description</label>
          <textarea
            value={course.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the course content..."
            className="w-full border-2 border-gray-200 rounded-lg p-3 h-28 sm:h-32 text-sm sm:text-base resize-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL (optional)</label>
          <input
            type="text"
            value={course.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-orange-400"
          />
          {course.image && (
            <div className="mt-4">
              <img src={course.image} alt="preview" className="w-full max-h-52 object-cover rounded-lg border shadow" />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="space-y-6 sm:space-y-7 mt-6">
          <div className="flex items-center gap-7 sm:gap-8">
            <Toggle value={course.isPublished} onChange={(v) => handleChange('isPublished', v)} />
            <span className="text-sm sm:text-base font-semibold text-gray-700 select-none">Publish Course</span>
          </div>

          <div className="flex items-center gap-7 sm:gap-8">
            <Toggle value={course.isResistorContent} onChange={(v) => handleChange('isResistorContent', v)} />
            <span className="text-sm sm:text-base font-semibold text-gray-700 select-none">Resistor Content</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-3 rounded-lg text-white shadow-md text-sm sm:text-base
              ${saving ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Delete / End Course Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={async () => {
              if (!confirm("คุณต้องการยุติคอร์สนี้ใช่ไหม?")) return;

              const res = await fetch(`/api/courses/${courseId}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                alert("ไม่สามารถยุติคอร์สได้");
                return;
              }

              alert("คอร์สถูกยุติเรียบร้อยแล้ว");
              window.location.href = "/learn/classroom/teacher";
            }}
            className="px-5 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 text-sm sm:text-base"
          >
            End Course
          </button>
        </div>

      </div>
    </div>
  )
}
