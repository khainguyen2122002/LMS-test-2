"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { getCurrentUser } from '@/lib/user-service'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message, {
          className: 'bg-error-container text-on-error-container rounded-full editorial-shadow border-none'
        })
        return
      }

      // Success Path
      toast.success('Đăng nhập thành công! Đang chuyển hướng...', {
        className: 'bg-secondary-container text-on-secondary-container rounded-full editorial-shadow border-none'
      })
      
      const profile = await getCurrentUser()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'instructor') {
        router.push('/admin')
      } else if (profile?.role === 'learner') {
        router.push('/student/dashboard')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.', {
        className: 'bg-error-container text-on-error-container rounded-full editorial-shadow border-none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      })
      if (error) throw error
    } catch (err: any) {
      toast.error('Lỗi đăng nhập Google: ' + err.message, {
        className: 'bg-error-container text-on-error-container rounded-full editorial-shadow border-none'
      })
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface font-body text-on-surface antialiased">
      {/* Left Side: Visual Narrative */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 xl:w-2/3 items-end p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover grayscale-[0.2] brightness-[0.85]" 
            alt="diverse group of professionals collaborating" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8is3_6DtL4I-wiDpVBTus_I30HsjWkkanwEBZp3B3hhb1XTVnn-MKoIabFGUfwxQo7ELR3d3-v6QcQuIu25DMGJUOsdW6WDHSbfg5PDtn9-klHWn_OqyOWBLC3iQJZal3TMO9KFu3Rk2JHHbZFQ2uDF4JTYiUFA3GLcbngh-n1N15hwz4pQBxhXQw20oXsC6tw4H_mcc1Swzh08uQeZM1EM4UsmztzFUm6bJhiCWnwD8FOk9AsvtF0x9vDt4wvVvNVC8bNVTMMbw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00361a]/80 via-[#00361a]/20 to-transparent"></div>
        </div>
        
        {/* Glassmorphism Branding Overlay */}
        <div className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-white/10 p-8 rounded-[0.75rem] border border-white/20 shadow-[0px_12px_32px_rgba(25,28,25,0.06)]">
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#f0a01b] font-bold mb-4 block">Inspiring HR LMS</span>
          <h1 className="text-white text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-4">
            The Art of <br/>Human Potential.
          </h1>
          <p className="text-[#e1e3de] text-lg leading-relaxed max-w-md opacity-90">
            Hãy khám phá thư viện khóa học phát triển nhân sự cao cấp và thay đổi văn hóa tổ chức thông qua những trải nghiệm học tập chuẩn mực.
          </p>
        </div>
      </section>

      {/* Right Side: Interaction Canvas */}
      <section className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 relative">
        {/* Logo Header */}
        <div className="absolute top-12 left-8 md:left-12 lg:left-16">
          <span className="text-2xl font-black text-[#1b4d2e] tracking-tighter">Inspiring HR</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <header className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#191c19] tracking-tight mb-2">Chào mừng trở lại</h2>
            <p className="text-[#414942] text-sm">Vui lòng nhập thông tin để truy cập cổng học tập của bạn.</p>
          </header>

          {/* Auth Provider */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#f3f4ef] hover:bg-[#e7e9e4] transition-colors rounded-[0.5rem] border border-[#c1c9bf]/20 text-[#191c19] font-medium mb-8"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Tiếp tục với Google
          </button>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-[#c1c9bf]/30"></div>
            <span className="flex-shrink mx-4 text-[#717971] text-[10px] uppercase tracking-widest font-bold">Hoặc Email</span>
            <div className="flex-grow border-t border-[#c1c9bf]/30"></div>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#414942] mb-2" htmlFor="email">Địa chỉ Email</label>
              <input 
                className="w-full bg-[#f3f4ef] border-0 border-b-2 border-[#717971]/20 focus:border-[#422800] focus:ring-0 px-4 py-4 rounded-t-[0.25rem] transition-all text-[#191c19] placeholder:text-[#717971]/50" 
                id="email" 
                name="email" 
                placeholder="name@company.com" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#414942]" htmlFor="password">Mật khẩu</label>
                <a className="text-[10px] font-bold text-[#f0a01b] hover:underline tracking-tight transition-all" href="#">Quên mật khẩu?</a>
              </div>
              <input 
                className="w-full bg-[#f3f4ef] border-0 border-b-2 border-[#717971]/20 focus:border-[#422800] focus:ring-0 px-4 py-4 rounded-t-[0.25rem] transition-all text-[#191c19] placeholder:text-[#717971]/50" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <button 
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#00361a] to-[#1b4d2e] text-white font-bold py-4 rounded-[0.5rem] shadow-[0px_12px_32px_rgba(25,28,25,0.06)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2" 
                type="submit"
              >
                <span>{loading ? 'Đang xử lý...' : 'Đăng nhập vào Hệ thống'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-[#414942] text-sm">
              Mới tham gia Inspiring HR? 
              <a className="text-[#1b4d2e] font-bold hover:underline ml-1" href="#">Liên hệ Quản trị viên</a>
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}
