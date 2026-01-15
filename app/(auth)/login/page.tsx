'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/learning-mode';
  
  // Validate callbackUrl to prevent open redirect vulnerability
  // Only allow relative paths (starting with /) but reject protocol-relative URLs (//)
  const callbackUrl = rawCallbackUrl.startsWith('/') && !rawCallbackUrl.startsWith('//') 
    ? rawCallbackUrl 
    : '/learning-mode';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center pt-28 relative z-10 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-10 shadow-2xl border border-orange-100/60 transform transition-all duration-300 hover:shadow-orange-200/50">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            ยินดีต้อนรับกลับ
          </h1>
          <p className="text-gray-600 text-lg">เข้าสู่ระบบเพื่อเริ่มเรียนรู้</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 p-4 text-sm text-red-800 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 hover:shadow-xl hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 duration-200 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors underline-offset-4 hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 border-2 border-orange-200/60 p-5 shadow-inner">
          <p className="text-sm font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            บัญชีทดสอบ:
          </p>
          <div className="space-y-2.5 text-xs text-orange-800">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
              <span className="font-medium text-orange-900">Admin:</span>
              <span className="font-mono">1@1.com / 1@1.com</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
              <span className="font-medium text-orange-900">Teacher:</span>
              <span className="font-mono">2@2.com / 2@2.com</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
              <span className="font-medium text-orange-900">Student:</span>
              <span className="font-mono">3@3.com / 3@3.com</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
              <span className="font-medium text-orange-900">Student:</span>
              <span className="font-mono">4@4.com / 4@4.com</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
