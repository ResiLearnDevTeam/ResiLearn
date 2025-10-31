export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Login</h1>
        <p className="mb-4 text-gray-600">
          Login page will be implemented with NextAuth.js
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

