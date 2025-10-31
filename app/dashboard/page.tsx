export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mb-4 text-gray-600">
        Dashboard page will display progress and statistics
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Levels Completed</h2>
          <p className="text-3xl font-bold">0 / 7</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Overall Progress</h2>
          <p className="text-3xl font-bold">0%</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Total Practice Time</h2>
          <p className="text-3xl font-bold">0h</p>
        </div>
      </div>
    </div>
  );
}

