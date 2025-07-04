// File: src/app/management/page.js
import Link from 'next/link';

export default function ManagementPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-700">Management Area</h1>
        <p className="mt-4 text-gray-600">
          This page is only visible to users with the &apos;Management&apos; role.
        </p>
        <div className="mt-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
