'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCourseForm() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const [isPublished, setIsPublished] = useState(false)
  const [isResistorContent, setIsResistorContent] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return alert('กรุณากรอกชื่อคอร์ส')

    try {
      setLoading(true)

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          image,
          isPublished,
          isResistorContent,
        }),
      })

      // ⭐ อ่าน response ก่อน
      const result = await res.json()

      if (!res.ok) {
        // ⭐ ใช้ error จาก backend
        throw new Error(result.error || 'เกิดข้อผิดพลาดในการสร้างคอร์ส')
      }

      router.push('/learn/classroom/teacher/courses')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'เกิดข้อผิดพลาดในการสร้างคอร์ส')
    } finally {
      setLoading(false)
    }
  }


  // 🔘 Compact Toggle Component
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

  return (
    <div
      className="
        w-full 
        max-w-lg sm:max-w-xl lg:max-w-2xl 
        bg-white border-2 border-orange-100 
        rounded-2xl shadow-lg 
        p-5 sm:p-7 lg:p-8
      "
    >
      <div className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Resistor Basics"
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the course content..."
            className="w-full border-2 border-gray-200 rounded-lg p-3 h-28 sm:h-32 text-sm sm:text-base resize-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-orange-400"
          />

          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="preview"
                className="w-full max-h-52 object-cover rounded-lg border shadow"
              />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="space-y-6 sm:space-y-7 mt-6">

          {/* Publish Toggle */}
          <div className="flex items-center gap-7 sm:gap-8">
            <Toggle value={isPublished} onChange={setIsPublished} />
            <span className="text-sm sm:text-base font-semibold text-gray-700 select-none">
              Publish Course
            </span>
          </div>

          {/* Resistor Content Toggle */}
          <div className="flex items-center gap-7 sm:gap-8">
            <Toggle value={isResistorContent} onChange={setIsResistorContent} />
            <span className="text-sm sm:text-base font-semibold text-gray-700 select-none">
              Resistor Content
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <button
            onClick={() => router.push('/learn/classroom/teacher/courses')}
            className="px-5 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
          >
            ⬅ Back
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className={`
              px-5 py-3 rounded-lg text-white shadow-md text-sm sm:text-base
              ${loading
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'}
            `}
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>

      </div>
    </div>
  )
}
