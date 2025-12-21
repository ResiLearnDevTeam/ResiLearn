'use client';

interface JoinCourseProps {
  code: string;
  setCode: (value: string) => void;
  loading: boolean;
  handleEnroll: (e: React.FormEvent) => void;
}

export default function JoinCourse({
  code,
  setCode,
  loading,
  handleEnroll,
}: JoinCourseProps) {
  return (
    <form
      onSubmit={handleEnroll}
      className="
        w-full
        max-w-lg sm:max-w-xl lg:max-w-2xl
        bg-white border-2 border-orange-100
        rounded-2xl shadow-lg
        p-5 sm:p-7 lg:p-8
      "
    >
      <div className="space-y-6">

        {/* Course Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Code *
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => {
              const inputValue = e.target.value;
              const filtered = inputValue.replace(/[^a-zA-Z0-9]/g, '');
              setCode(filtered);
            }}
            placeholder="e.g. ABC123"
            className="
              w-full border-2 border-gray-200 rounded-lg
              p-3 text-sm sm:text-base
              focus:ring-2 focus:ring-orange-400
            "
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`
              px-6 py-3 rounded-lg text-white shadow-md
              text-sm sm:text-base
              ${loading
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'}
            `}
          >
            {loading ? 'Joining...' : 'Join Course'}
          </button>
        </div>

      </div>
    </form>
  );
}
