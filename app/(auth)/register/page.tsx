'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ✅ validate name
    if (!name.trim()) {
      setError('กรุณากรอกชื่อ');
      setLoading(false);
      return;
    }

    try {
      // ===== 1. Register =====
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'การสมัครสมาชิกล้มเหลว');
      }

      // ===== 2. Auto Login =====
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('สมัครสมาชิกสำเร็จ แต่เข้าสู่ระบบล้มเหลว');
      }

      // ===== 3. Redirect after login =====
      router.replace('/learning-mode');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large outer circle */}
        <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] border-[3px] border-orange-400 rounded-full opacity-30"></div>
        {/* Medium circle */}
        <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[3px] border-orange-400 rounded-full opacity-20"></div>
        {/* Small inner circle */}
        <div className="absolute right-[0px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[2px] border-orange-300 rounded-full opacity-15"></div>
        
        {/* Dots pattern */}
        <div className="absolute left-1/4 top-1/3 grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-orange-300 rounded-full opacity-40"></div>
          ))}
        </div>
        
        {/* Wavy lines */}
        <svg className="absolute top-32 right-1/3 w-12 h-12 text-orange-400 opacity-30" viewBox="0 0 48 48" fill="none">
          <path d="M4 12C8 8 12 16 16 12C20 8 24 16 28 12C32 8 36 16 40 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M4 24C8 20 12 28 16 24C20 20 24 28 28 24C32 20 36 28 40 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>

      <LandingNavbar />
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center pt-20 relative z-10">
      <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl border border-orange-100/50">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            สมัครสมาชิก
          </h1>
          <p className="text-gray-600 text-lg">
            สร้างบัญชีเพื่อเริ่มเรียนรู้
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ชื่อ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 placeholder-gray-400"
              placeholder="ชื่อของคุณ"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 placeholder-gray-400"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              บทบาท
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'STUDENT' | 'TEACHER')
              }
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900"
            >
              <option value="STUDENT">นักเรียน</option>
              <option value="TEACHER">ครู</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-600/40 disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
