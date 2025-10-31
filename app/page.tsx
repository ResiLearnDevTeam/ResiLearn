import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Welcome to ResiLearn
          </h1>
        <p className="mb-8 text-xl text-gray-600">
          Master resistor reading skills through progressive learning
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/learn"
            className="rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
          >
            Start Learning
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
