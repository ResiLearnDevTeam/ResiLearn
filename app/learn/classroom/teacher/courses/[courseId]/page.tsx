import ClassroomLeftSidebar from "@/components/layout/ClassroomLeftSidebar";
import CourseDetail from "@/components/features/classroom/CourseDetail";

export default async function CourseDetailPage({ params }: any) {
  const resolved = await params;
  const { courseId } = resolved;

  console.log("courseId:", courseId);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      {/* ⭐ Sidebar */}
      <ClassroomLeftSidebar/>

      {/* ⭐ Main Content */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8">
        <div className="mx-auto">
          <CourseDetail courseId={courseId} />
        </div>
      </div>

    </div>
  );
}
