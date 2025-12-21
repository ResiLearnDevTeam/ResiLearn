import ClassroomLeftSidebar from "@/components/layout/ClassroomLeftSidebar";
import StudentList from "@/components/features/classroom/StudentList";


export default async function StudentSettingPage({ params }: any) {
  const resolved = await params;
  const { courseId } = resolved;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      <ClassroomLeftSidebar />

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">

          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Classmates
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              all Classmates enrolled in this course.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <StudentList courseId={courseId} />
          </div>

        </main>
      </div>

    </div>
  );
}
