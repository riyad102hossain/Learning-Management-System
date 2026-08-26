"use client";

import { useEffect, useState, use } from "react";
import { fetchFromStrapi, enrollInCourse } from "@/lib/strapi";
import Link from "next/link";

interface Lesson {
  id: number;
  documentId: string;
  title: string;
  order: number;
}

interface CourseDetails {
  id: number;
  documentId: string;
  title: string;
  description: string;
  lessons?: Lesson[];
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await fetchFromStrapi(`courses/${courseId}?populate=*`);
        setCourse(data.data);
      } catch (err) {
        setMessage("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      setMessage("Please log in to enroll in this course.");
      return;
    }

    const user = JSON.parse(userStr);
    setEnrolling(true);
    setMessage("");

    try {
      await enrollInCourse(courseId, user.id, token);
      setMessage("Successfully enrolled!");
    } catch (err: any) {
      setMessage(err.message || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
      <p className="text-gray-700 text-lg mb-6">{course.description}</p>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md">
          {message}
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 mb-8"
      >
        {enrolling ? "Enrolling..." : "Enroll Now"}
      </button>

      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Course Lessons</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <ul className="space-y-3">
            {course.lessons.map((lesson) => (
              <li
                key={lesson.id || lesson.documentId}
                className="p-4 border rounded-md flex justify-between items-center bg-white"
              >
                <span className="font-medium text-gray-800">
                  {lesson.order ? `${lesson.order}. ` : ""}{lesson.title}
                </span>
                <Link
                  href={`/lessons/${lesson.documentId}`}
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  View Lesson
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No lessons available for this course yet.</p>
        )}
      </div>
    </div>
  );
}