'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LeftSidebar from '@/components/layout/LeftSidebar'

export default function CreateCoursePage() {
  const router = useRouter()

  // 🧠 ฟอร์ม state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  // 📅 คำนวณวันที่วันนี้ (ภาษาอังกฤษ, ISO string)
  const today = new Date().toISOString().split('T')[0]

  // ⚙️ ฟังก์ชันส่งข้อมูล
  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a course title')
      return
    }

    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be earlier than start date')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, image, startDate, endDate }),
      })

      if (!res.ok) throw new Error('Failed to create course')

      alert('✅ Course created successfully!')
      router.push('/learn/classroom/teacher/courses')
    } catch (err) {
      console.error(err)
      alert('❌ An error occurred while creating the course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🆕 Create New Course</h1>
        <p className="text-gray-600 mb-8">
          Use this form to create a new course in the Classroom system.
        </p>

        <div className="rounded-xl bg-white p-8 shadow-lg border border-blue-100 max-w-2xl">
          <div className="space-y-6">
            {/* title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Resistor Basics"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the course content briefly..."
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Course preview"
                    className="w-full max-h-60 object-cover rounded-lg shadow-sm border"
                  />
                </div>
              )}
            </div>

            {/* ✅ start & end date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  min={today} // ✅ ห้ามเลือกก่อนวันนี้
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    if (endDate && new Date(e.target.value) > new Date(endDate)) {
                      setEndDate('') // reset endDate ถ้า startDate ใหม่เกิน endDate เดิม
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  min={startDate || today} // ✅ ห้ามเลือกก่อนวันเริ่มต้น
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={!startDate} // ❌ ถ้ายังไม่เลือก startDate จะปิด
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => router.push('/learn/classroom/teacher/courses')}
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                ⬅ Back
              </button>

              <button
                onClick={handleCreate}
                disabled={loading}
                className={`px-6 py-3 rounded-lg text-white font-medium transition shadow-md ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating...' : '✅ Create Course'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
