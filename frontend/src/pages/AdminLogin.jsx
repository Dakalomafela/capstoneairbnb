import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('user', JSON.stringify({ 
          email, 
          role: 'admin',
          token: data.token 
        }));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=1200&fit=crop" 
          alt="Luxury interior" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 22c-1.5-2-2.8-4-3.8-6-.8-1.6-1.2-3-1.2-4.2 0-2.2.7-4 2-5.4C13.8 5.2 15.3 4.5 16 4.5c.7 0 2.2.7 3 1.9 1.3 1.4 2 3.2 2 5.4 0 1.2-.4 2.6-1.2 4.2-1 2-2.3 4-3.8 6zm0-15c-.5 0-1.2.5-1.8 1.2-.8.9-1.2 2-1.2 3.4 0 .8.3 1.8.8 3 .7 1.4 1.5 2.8 2.2 4 .7-1.2 1.5-2.6 2.2-4 .5-1.2.8-2.2.8-3 0-1.4-.4-2.5-1.2-3.4-.6-.7-1.3-1.2-1.8-1.2z"/>
              </svg>
              <span className="font-bold text-2xl">airbnb</span>
            </Link>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome back,<br/>Administrator</h2>
            <p className="text-white/80 text-lg">Manage listings, monitor bookings, and keep everything running smoothly.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <ShieldCheck size={16} />
            <span>Secure admin portal</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <svg className="w-8 h-8 text-[#FF5A5F]" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 22c-1.5-2-2.8-4-3.8-6-.8-1.6-1.2-3-1.2-4.2 0-2.2.7-4 2-5.4C13.8 5.2 15.3 4.5 16 4.5c.7 0 2.2.7 3 1.9 1.3 1.4 2 3.2 2 5.4 0 1.2-.4 2.6-1.2 4.2-1 2-2.3 4-3.8 6zm0-15c-.5 0-1.2.5-1.8 1.2-.8.9-1.2 2-1.2 3.4 0 .8.3 1.8.8 3 .7 1.4 1.5 2.8 2.2 4 .7-1.2 1.5-2.6 2.2-4 .5-1.2.8-2.2.8-3 0-1.4-.4-2.5-1.2-3.4-.6-.7-1.3-1.2-1.8-1.2z"/>
            </svg>
            <span className="font-bold text-2xl text-[#FF5A5F]">airbnb</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-500">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@airbnb.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FF5A5F] focus:ring-[#FF5A5F]" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-[#FF5A5F] font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FF5A5F] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#e04e53] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/admin/signup" className="text-[#FF5A5F] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full mt-6 border border-gray-200 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}