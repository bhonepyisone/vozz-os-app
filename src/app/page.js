// File: src/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Welcome to Vozz OS</h1>
        <p className="mt-4 text-lg text-gray-600">
          The all-in-one solution for your business.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Login or Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
