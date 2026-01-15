'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { User, Mail, Lock, UserCircle, Loader2, ChevronDown } from 'lucide-react';
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
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center pt-28 relative z-10 px-4 pb-8">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-10 shadow-2xl border border-orange-100/60 transform transition-all duration-300 hover:shadow-orange-200/50">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-4 shadow-lg">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            สมัครสมาชิก
          </h1>
          <p className="text-gray-600 text-lg">
            สร้างบัญชีเพื่อเริ่มเรียนรู้
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 p-3 text-sm text-red-800 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ชื่อ
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-gray-200 pl-11 pr-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="ชื่อของคุณ"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              อีเมล
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-gray-200 pl-11 pr-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              รหัสผ่าน
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-gray-200 pl-11 pr-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              บทบาท
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as 'STUDENT' | 'TEACHER')
                }
                className="w-full rounded-xl border-2 border-gray-200 pl-4 pr-10 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-gray-900 hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="STUDENT">นักเรียน</option>
                <option value="TEACHER">ครู</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 hover:shadow-xl hover:shadow-orange-600/40 disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0 duration-200 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors underline-offset-4 hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
