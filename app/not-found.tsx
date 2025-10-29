"use client";
export const dynamic = "force-dynamic";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600">Sorry, we couldn’t find that page.</p>
    </div>
  );
}