import ClassroomLeftSidebar from "@/components/layout/ClassroomLeftSidebar";
import StudentList from "@/components/features/classroom/StudentList";

export default async function StudentSettingPage({ params }: any) {
  const resolved = await params;
  const { courseId } = resolved;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      {/* Sidebar */}
      <ClassroomLeftSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold text-orange-700 mb-6">
            Student Settings
          </h1>

          <StudentList courseId={courseId} />
        </div>
      </main>

    </div>
  );
}
