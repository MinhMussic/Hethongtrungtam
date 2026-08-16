import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { 
  Music, 
  Lock, 
  Mail, 
  Sparkles, 
  Shield, 
  GraduationCap, 
  Users, 
  UserCheck, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff, 
  UserPlus, 
  KeyRound, 
  AlertCircle,
  Clock,
  HeartHandshake
} from 'lucide-react';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login, switchRoleForTesting } = useAuth();
  const { branding } = useData();
  const { isDark, toggleTheme } = useTheme();

  const [identifier, setIdentifier] = useState('admin@minhmusic.vn');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Color scheme toggle (Fresh Green by default)
  const [colorScheme, setColorScheme] = useState<'green' | 'branding' | 'indigo' | 'amber'>('green');

  const themeColors = useMemo(() => {
    switch (colorScheme) {
      case 'green':
        return {
          primary: '#059669', // emerald-600
          primaryLight: '#10b981', // emerald-500
          textAccent: 'text-emerald-600 dark:text-emerald-400',
          btnGradient: 'from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700',
          glowColor: '#10b981'
        };
      case 'indigo':
        return {
          primary: '#4f46e5',
          primaryLight: '#6366f1',
          textAccent: 'text-indigo-600 dark:text-indigo-400',
          btnGradient: 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
          glowColor: '#4f46e5'
        };
      case 'amber':
        return {
          primary: '#d97706',
          primaryLight: '#f59e0b',
          textAccent: 'text-amber-600 dark:text-amber-400',
          btnGradient: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
          glowColor: '#d97706'
        };
      case 'branding':
      default:
        return {
          primary: branding.primaryColor || '#059669',
          primaryLight: branding.secondaryColor || '#10b981',
          textAccent: 'text-emerald-600 dark:text-emerald-400',
          btnGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
          glowColor: branding.primaryColor || '#059669'
        };
    }
  }, [colorScheme, branding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Vui lòng nhập Email hoặc Tên đăng nhập.');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập Mật khẩu.');
      return;
    }

    setIsLoading(true);
    const result = await login(identifier, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Tài khoản hoặc mật khẩu không chính xác.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRoleForTesting(role);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50/50 to-green-100/60 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decorative Ambient Orbs */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ backgroundColor: themeColors.glowColor }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: '#10b981' }}
      />

      {/* Top right Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs">
          <button
            onClick={() => setColorScheme('green')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${colorScheme === 'green' ? 'ring-2 ring-emerald-500 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'}`}
            title="Tone Xanh Lá Cây Tươi Sáng"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500" />
          </button>
          <button
            onClick={() => setColorScheme('amber')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${colorScheme === 'amber' ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'}`}
            title="Tone Vàng Hoàng Gia"
          >
            <div className="w-4 h-4 rounded-full bg-amber-500" />
          </button>
          <button
            onClick={() => setColorScheme('indigo')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${colorScheme === 'indigo' ? 'ring-2 ring-indigo-500 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'}`}
            title="Tone Xanh Indigo Quý Phái"
          >
            <div className="w-4 h-4 rounded-full bg-indigo-500" />
          </button>
        </div>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md transition-colors shadow-xs cursor-pointer"
          title="Chuyển đổi giao diện Sáng / Tối"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Chế độ Tối</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Chế độ Sáng</span>
            </>
          )}
        </button>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryLight})`
            }}
          >
            <Music className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            {branding.centerName || 'MINH MUSIC'} {branding.subName || 'CENTER'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {branding.slogan || 'HỆ THỐNG QUẢN LÝ TRUNG TÂM ÂM NHẠC TOÀN DIỆN'}
          </p>
        </div>

        {/* Admin Quick Credentials Hint Banner */}
        <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Tài khoản Quản trị viên (Admin)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIdentifier('Minh123tho@gmail.com');
                setPassword('admin123');
              }}
              className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 hover:underline cursor-pointer bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md transition-colors"
            >
              Điền tự động
            </button>
          </div>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80">
            Email: <code className="font-bold text-amber-950 dark:text-amber-200 font-mono">Minh123tho@gmail.com</code> (hoặc <code className="font-bold font-mono">admin</code>) • MK: <code className="font-bold font-mono">admin123</code>
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Email hoặc Tên đăng nhập:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@minhmusic.vn hoặc ten_dang_nhap"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Mật khẩu:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer hover:brightness-110 active:scale-98 disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.primaryLight})`
            }}
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Vào Hệ Thống'}
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
            Hoặc Đăng Nhập Nhanh Theo Vai Trò Demo:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-400 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer shadow-xs"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Quản Trị</span>
            </button>

            <button
              onClick={() => handleQuickLogin('TEACHER')}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Giáo Viên</span>
            </button>

            <button
              onClick={() => handleQuickLogin('STUDENT')}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Học Viên</span>
            </button>

            <button
              onClick={() => handleQuickLogin('PARENT')}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-400 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>Phụ Huynh</span>
            </button>
          </div>
        </div>

        {/* Register CTA Link */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Chưa có tài khoản thành viên?{' '}
            <button
              onClick={onSwitchToRegister}
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký tài khoản ngay</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
