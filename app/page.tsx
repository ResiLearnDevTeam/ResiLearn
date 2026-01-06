'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">ResiLearn</h1>
        <Link 
          href="/login" 
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}
