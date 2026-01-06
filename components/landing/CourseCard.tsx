import ImagePlaceholder from './ImagePlaceholder';
import Link from 'next/link';
import { Clock, BookOpen, Users } from 'lucide-react';

interface CourseCardProps {
  id: string;
  name: string;
  description: string | null;
  teacher: {
    name: string | null;
  } | null;
  enrollmentCount: number;
  image: string | null;
}

export default function CourseCard({
  id,
  name,
  description,
  teacher,
  enrollmentCount,
  image,
}: CourseCardProps) {
  return (
    <Link
      href={`/learn/classroom/courses/${id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
    >
      {/* Course Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImagePlaceholder
            aspectRatio="aspect-video"
            description="Course Image"
            className="rounded-none"
          />
        )}
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-lg">
            หลักสูตร
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Course Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{enrollmentCount} นักเรียน</span>
          </div>
          {teacher?.name && (
            <div className="flex items-center gap-1">
              <span>โดย {teacher.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

