const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function fetchFromStrapi(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
    ...options,
  };

  const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, defaultOptions);

  if (!response.ok) {
    throw new Error(`Strapi API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function enrollInCourse(courseDocumentId: string, userId: number, token: string) {
  const response = await fetch(`${STRAPI_URL}/api/courses/${courseDocumentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        student_enrolled: {
          connect: [userId],
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Enrollment failed. Please check permissions.");
  }

  return response.json();
}