async function getInstructors() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/courses/public`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }
    
    const courses = await res.json();
    
    // Extract unique teachers from courses
    const teachersMap = new Map();
    courses.forEach((course: any) => {
      if (course.teacher && !teachersMap.has(course.teacher.id)) {
        teachersMap.set(course.teacher.id, course.teacher);
      }
    });
    
    return Array.from(teachersMap.values()).slice(0, 4);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }
}

export default async function InstructorsSection() {
  const instructors = await getInstructors();

  // If no instructors from courses, show placeholder instructors
  const displayInstructors = instructors.length > 0 
    ? instructors 
    : [
        { id: '1', name: 'อาจารย์สมชาย', email: 'teacher1@example.com' },
        { id: '2', name: 'อาจารย์สมหญิง', email: 'teacher2@example.com' },
        { id: '3', name: 'อาจารย์วิชัย', email: 'teacher3@example.com' },
        { id: '4', name: 'อาจารย์มาลี', email: 'teacher4@example.com' },
      ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ผู้สอน{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-2">
              ผู้เชี่ยวชาญ
            </span>
            {' '}ของเรา
          </h2>
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayInstructors.map((instructor: any, index: number) => (
            <div
              key={instructor.id || index}
              className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                {instructor.name ? instructor.name.charAt(0) : 'T'}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {instructor.name || 'ผู้สอน'}
              </h3>

              {/* Title */}
              <p className="text-gray-600 mb-4">ผู้สอนหลักสูตร</p>

              {/* Social Icons */}
              <div className="flex justify-center gap-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-xs text-gray-600">f</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="Twitter"
                >
                  <span className="text-xs text-gray-600">t</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="LinkedIn"
                >
                  <span className="text-xs text-gray-600">in</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

