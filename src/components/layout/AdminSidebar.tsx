import React from 'react';
import { AdminMenuTab } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Star,
  Users,
  GraduationCap,
  HeartHandshake,
  Cake,
  ShieldCheck,
  Music,
  BookOpen,
  School,
  CalendarDays,
  CheckSquare,
  RefreshCw,
  Clock,
  Sparkles,
  FileText,
  TrendingUp,
  Award,
  Gift,
  Trophy,
  CreditCard,
  Bell,
  BarChart3,
  FileSpreadsheet,
  MapPin,
  Settings,
  Palette,
  ChevronRight,
  User,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onSelectTab }) => {
  const { getTodayBirthdays } = useData();
  const { accounts } = useAuth();
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  
  const todayBirthdaysCount = getTodayBirthdays().length;
  const pendingAccountsCount = accounts.filter(a => a.status === 'pending').length;

  const menuSections = [
    {
      groupTitle: 'TỔNG QUAN',
      items: [
        { id: 'dashboard' as AdminMenuTab, label: 'Tổng quan', icon: LayoutDashboard },
        { id: 'star_ranking' as AdminMenuTab, label: 'Bảng Xếp Hạng Sao', icon: Star, badge: 'Hot' }
      ]
    },
    {
      groupTitle: 'NHÂN SỰ & HỌC VIÊN',
      items: [
        { id: 'students' as AdminMenuTab, label: 'Học viên', icon: GraduationCap },
        { id: 'teachers' as AdminMenuTab, label: 'Giáo viên', icon: Users },
        { id: 'guardians' as AdminMenuTab, label: 'Phụ huynh & Người giám hộ', icon: HeartHandshake },
        { 
          id: 'birthdays' as AdminMenuTab, 
          label: 'Sinh nhật', 
          icon: Cake, 
          badge: todayBirthdaysCount > 0 ? `${todayBirthdaysCount} hôm nay` : undefined,
          badgeColor: 'bg-rose-500 text-white animate-pulse'
        },
        { 
          id: 'accounts' as AdminMenuTab, 
          label: 'Tài khoản & Phân quyền', 
          icon: ShieldCheck,
          badge: pendingAccountsCount > 0 ? `${pendingAccountsCount} chờ duyệt` : undefined,
          badgeColor: 'bg-amber-500 text-white'
        }
      ]
    },
    {
      groupTitle: 'ĐÀO TẠO',
      items: [
        { id: 'subjects' as AdminMenuTab, label: 'Môn học', icon: Music },
        { id: 'courses' as AdminMenuTab, label: 'Khóa học', icon: BookOpen },
        { id: 'classes' as AdminMenuTab, label: 'Lớp học', icon: School },
        { id: 'schedules' as AdminMenuTab, label: 'Lịch học', icon: CalendarDays },
        { id: 'attendance' as AdminMenuTab, label: 'Điểm danh', icon: CheckSquare },
        { id: 'makeup' as AdminMenuTab, label: 'Học bù', icon: RefreshCw },
        { id: 'reservations' as AdminMenuTab, label: 'Bảo lưu', icon: Clock },
        { id: 'trial' as AdminMenuTab, label: 'Học thử', icon: Sparkles }
      ]
    },
    {
      groupTitle: 'HỌC TẬP',
      items: [
        { id: 'assignments' as AdminMenuTab, label: 'Bài tập', icon: FileText },
        { id: 'progress' as AdminMenuTab, label: 'Tiến độ', icon: TrendingUp },
        { id: 'star_ranking' as AdminMenuTab, label: 'Bảng vinh danh Pro', icon: Trophy, badge: 'Top 3 👑', badgeColor: 'bg-amber-400 text-slate-950 font-black' },
        { id: 'rewards' as AdminMenuTab, label: 'Đổi quà', icon: Gift },
        { id: 'achievements' as AdminMenuTab, label: 'Thành tích', icon: Award }
      ]
    },
    {
      groupTitle: 'TÀI CHÍNH & HỆ THỐNG',
      items: [
        { id: 'tuition' as AdminMenuTab, label: 'Học phí & QR', icon: CreditCard },
        { id: 'notifications' as AdminMenuTab, label: 'Thông báo', icon: Bell },
        { id: 'reports' as AdminMenuTab, label: 'Báo cáo', icon: BarChart3 },
        { id: 'sheets_sync' as AdminMenuTab, label: 'Đồng bộ Google Sheets', icon: FileSpreadsheet },
        { id: 'branding' as AdminMenuTab, label: 'Cấu hình Thương hiệu & Màu sắc', icon: Palette, badge: 'Đa cơ sở', badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'branches_map' as AdminMenuTab, label: 'Bản đồ cơ sở & Vị trí', icon: MapPin },
        { id: 'profile' as AdminMenuTab, label: 'Hồ sơ cá nhân của tôi', icon: User, badge: 'Hồ sơ', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'settings' as AdminMenuTab, label: 'Cài đặt & Chia sẻ', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800 flex flex-col justify-between select-none">
      <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-heading">
              {section.groupTitle}
            </h3>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-item-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${item.badgeColor || 'bg-amber-500/20 text-amber-300'}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Mode Selector & Footer info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-[11px]">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md transition-all font-semibold cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ Sáng"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Sáng</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md transition-all font-semibold cursor-pointer ${
              theme === 'dark'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ Ban đêm (Dark Mode)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Tối</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md transition-all font-semibold cursor-pointer ${
              theme === 'system'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tự động theo thiết bị"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Tự động</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span className="truncate">Minh Music v2.5</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
