export default function LearningPathPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Learning Path</h1>
      <p className="mb-4 text-gray-600">
        Learning Path page will display all 7 levels
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7].map((level) => (
          <div
            key={level}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-2 text-xl font-semibold">Level {level}</h2>
            <p className="text-gray-600">
              Level {level} description will be shown here
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

