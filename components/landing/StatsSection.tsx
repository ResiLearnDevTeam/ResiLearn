async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stats`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return {
        totalUsers: 0,
        totalLessons: 0,
        successRate: 0,
      };
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalUsers: 0,
      totalLessons: 0,
      successRate: 0,
    };
  }
}

export default async function StatsSection() {
  const stats = await getStats();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Stat 1 */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              {stats.totalUsers.toLocaleString()}+
            </div>
            <div className="text-gray-600 font-medium">นักเรียนทั้งหมด</div>
          </div>

          {/* Stat 2 */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              {stats.totalLessons}+
            </div>
            <div className="text-gray-600 font-medium">หลักสูตร</div>
          </div>

          {/* Stat 3 */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              {stats.successRate}%
            </div>
            <div className="text-gray-600 font-medium">อัตราความสำเร็จ</div>
          </div>

          {/* Stat 4 */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              7
            </div>
            <div className="text-gray-600 font-medium">ระดับการเรียนรู้</div>
          </div>
        </div>
      </div>
    </section>
  );
}

