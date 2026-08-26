import Link from "next/link";
import { fetchFromStrapi } from "@/lib/strapi";

interface Course {
  id: number;
  documentId: string;
  title: string;
  description: string;
}

export default async function HomePage() {
  let courses: Course[] = [];
  let errorMsg = "";

  try {
    const data = await fetchFromStrapi("courses");
    courses = data.data || [];
  } catch (error) {
    errorMsg = "Failed to load courses from Strapi backend.";
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          LMS Learning Platform
        </h1>

        {errorMsg && (
          <p className="p-4 bg-red-100 text-red-600 rounded-md mb-4">
            {errorMsg}
          </p>
        )}

        <h2 className="text-xl font-semibold mb-4">Available Courses:</h2>

        {courses.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id || course.documentId}
                href={`/courses/${course.documentId || course.id}`}
                className="p-5 border rounded-lg shadow-sm bg-white hover:shadow-md transition block cursor-pointer"
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {course.description || "No description provided."}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}