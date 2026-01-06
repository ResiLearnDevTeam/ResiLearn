import CourseCard from './CourseCard';

async function getCourses() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/courses/public`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function CoursesSection() {
  const courses = await getCourses();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            เลือกหลักสูตร{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-2">
              ยอดนิยม
            </span>
          </h2>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                description={course.description}
                teacher={course.teacher}
                enrollmentCount={course.enrollmentCount}
                image={course.image}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">ยังไม่มีหลักสูตรที่เผยแพร่</p>
          </div>
        )}
      </div>
    </section>
  );
}

