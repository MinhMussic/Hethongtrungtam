import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useSound, AMBIENT_TRACKS, SoundTheme } from '../../context/SoundContext';
import { TuitionPayment, NotificationItem, BankAccountConfig } from '../../types';
import { BrandingConfigPanel } from './BrandingConfigPanel';
import { BranchesAndMapManagement } from './BranchesAndMapManagement';
import {
  CreditCard,
  Bell,
  BarChart3,
  FileSpreadsheet,
  MapPin,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  QrCode,
  Share2,
  Sparkles,
  ExternalLink,
  Send,
  Building,
  RefreshCw,
  Palette,
  Sun,
  Moon,
  Monitor,
  Eye,
  Copy,
  Download,
  Upload,
  Check,
  AlertCircle,
  FileText,
  DollarSign,
  HelpCircle,
  X,
  Music,
  MousePointerClick,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Disc3
} from 'lucide-react';

interface FinanceAndSettingsProps {
  initialSubTab?: 'tuition' | 'bank_qr_config' | 'notifications' | 'reports' | 'sheets_sync' | 'branding' | 'branches_map' | 'settings';
}

export const FinanceAndSettings: React.FC<FinanceAndSettingsProps> = ({ initialSubTab = 'tuition' }) => {
  const {
    tuitionPayments,
    addTuitionPayment,
    updateTuitionStatus,
    notifications,
    addNotification,
    students,
    subjects,
    courses,
    branding,
    updateBankAccount,
    generateQrUrlForPayment,
    formatTransferContent
  } = useData();
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  const {
    isSoundEnabled,
    toggleSound,
    soundVolume,
    setSoundVolume,
    soundTheme,
    setSoundTheme,
    playSuccessSound,
    isMusicPlaying,
    toggleMusic,
    musicVolume,
    setMusicVolume,
    currentTrackId,
    setCurrentTrackId,
    currentTrack,
    allTracks
  } = useSound();

  const [activeTab, setActiveTab] = useState<'tuition' | 'bank_qr_config' | 'notifications' | 'reports' | 'sheets_sync' | 'branding' | 'branches_map' | 'settings'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Search & Filter for Tuition
  const [tuitionSearch, setTuitionSearch] = useState('');
  const [tuitionStatusFilter, setTuitionStatusFilter] = useState<'ALL' | 'pending' | 'paid' | 'overdue'>('ALL');

  // QR Modal State
  const [selectedPaymentForQR, setSelectedPaymentForQR] = useState<TuitionPayment | null>(null);

  // Bank & QR Config Draft State
  const bankConfig = branding.bankAccount || {
    bankId: 'MBBank',
    bankName: 'MBBank - Ngân hàng Quân Đội',
    accountNumber: '0901888999',
    accountHolder: 'TRUNG TAM AM NHAC MINH MUSIC',
    memoFormat: 'CODE_SUBJECT_MONTH',
    useCustomQr: false
  };

  const [bankId, setBankId] = useState(bankConfig.bankId || 'MBBank');
  const [accountNumber, setAccountNumber] = useState(bankConfig.accountNumber || '0901888999');
  const [accountHolder, setAccountHolder] = useState(bankConfig.accountHolder || 'TRUNG TAM AM NHAC MINH MUSIC');
  const [memoFormat, setMemoFormat] = useState<'CODE_SUBJECT_MONTH' | 'NAME_SUBJECT_MONTH'>(bankConfig.memoFormat || 'CODE_SUBJECT_MONTH');
  const [useCustomQr, setUseCustomQr] = useState(bankConfig.useCustomQr || false);
  const [customQrUrl, setCustomQrUrl] = useState(bankConfig.customQrUrl || '');
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Create Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || 'Piano');
  const [courseName, setCourseName] = useState(courses[0]?.name || 'Khóa học chính thức');
  const [amount, setAmount] = useState<number>(3600000);
  const [billingMonth, setBillingMonth] = useState(`Tháng ${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`);
  const [sessionsCount, setSessionsCount] = useState<number>(12);
  const [invoiceNote, setInvoiceNote] = useState('');

  // Create Notification Modal State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifContent, setNotifContent] = useState('');
  const [notifAudience, setNotifAudience] = useState<'ALL' | 'TEACHER' | 'STUDENT' | 'PARENT'>('ALL');
  const [notifType, setNotifType] = useState<'general' | 'tuition' | 'event' | 'schedule'>('general');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Đã sao chép ${fieldName}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveBankConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const bankListMap: Record<string, string> = {
      'MBBank': 'MBBank - Ngân hàng Quân Đội',
      'VCB': 'Vietcombank - Ngân hàng Ngoại thương Việt Nam',
      'TCB': 'Techcombank - Ngân hàng Kỹ thương Việt Nam',
      'VPB': 'VPBank - Ngân hàng Việt Nam Thịnh Vượng',
      'ACB': 'ACB - Ngân hàng Á Châu',
      'BIDV': 'BIDV - Ngân hàng Đầu tư & Phát triển Việt Nam',
      'CTG': 'VietinBank - Ngân hàng Công thương Việt Nam',
      'TPB': 'TPBank - Ngân hàng Tiên Phong',
      'VIB': 'VIB - Ngân hàng Quốc tế',
      'STB': 'Sacombank - Ngân hàng Sài Gòn Thương Tín'
    };

    updateBankAccount({
      bankId,
      bankName: bankListMap[bankId] || bankId,
      accountNumber,
      accountHolder: accountHolder.toUpperCase(),
      memoFormat,
      useCustomQr,
      customQrUrl
    });
    showToast('Đã lưu cấu hình tài khoản ngân hàng & QR chuyển khoản thành công!');
  };

  const handleCustomQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomQrUrl(reader.result);
        setUseCustomQr(true);
        showToast('Đã tải lên mã QR ngân hàng của trung tâm thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const studentCodeOrName = memoFormat === 'NAME_SUBJECT_MONTH' ? student.fullName : (student.code || student.fullName);
    const syntax = formatTransferContent(studentCodeOrName, subjectName, billingMonth);

    addTuitionPayment({
      code: `HP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      studentId,
      studentCode: student.code,
      studentName: student.fullName,
      subjectName,
      courseName,
      amount,
      paidAmount: 0,
      billingMonth,
      sessionsCount,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: 'VietQR',
      transferSyntax: syntax,
      invoiceNote: invoiceNote || `Học phí môn ${subjectName} ${billingMonth}`
    });

    setIsPaymentModalOpen(false);
    showToast(`Đã tạo hóa đơn học phí cho học viên ${student.fullName} (Cú pháp: ${syntax})`);
  };

  const handleSendNotification = () => {
    if (!notifTitle.trim() || !notifContent.trim()) {
      showToast('Vui lòng nhập Tiêu đề và Nội dung thông báo!');
      return;
    }

    addNotification({
      title: notifTitle,
      content: notifContent,
      targetAudience: notifAudience,
      type: notifType
    });

    setIsNotifModalOpen(false);
    setNotifTitle('');
    setNotifContent('');
    showToast('Đã phát thông báo toàn hệ thống thành công!');
  };

  const filteredPayments = tuitionPayments.filter(p => {
    if (tuitionStatusFilter !== 'ALL' && p.status !== tuitionStatusFilter) return false;
    if (tuitionSearch.trim() !== '') {
      const q = tuitionSearch.toLowerCase();
      return (
        (p.studentName || '').toLowerCase().includes(q) ||
        (p.studentCode || '').toLowerCase().includes(q) ||
        (p.subjectName || '').toLowerCase().includes(q) ||
        (p.billingMonth || '').toLowerCase().includes(q) ||
        (p.transferSyntax || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalTuitionRevenue = tuitionPayments
    .filter(p => p.status === 'paid')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  const pendingTuitionRevenue = tuitionPayments
    .filter(p => p.status === 'pending')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-md shadow-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-heading">
                Tài Chính, Thu Phí VietQR & Hệ Thống
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Quản lý hóa đơn học phí, cấu hình mã QR chuyển khoản chuẩn cú pháp, phát tin thông báo và chia sẻ phân quyền.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('bank_qr_config')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-600" />
            <span>CẤU HÌNH NGÂN HÀNG & QR</span>
          </button>

          {activeTab === 'tuition' ? (
            <button
              onClick={() => {
                const s = students[0];
                if (s) {
                  setStudentId(s.id);
                  setSubjectName(s.enrolledSubjects?.[0] || subjects[0]?.name || 'Piano');
                }
                setIsPaymentModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ TẠO HÓA ĐƠN HỌC PHÍ</span>
            </button>
          ) : activeTab === 'notifications' ? (
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>GỬI THÔNG BÁO MỚI</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('tuition')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'tuition' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-600" />
          <span>Học Phí & VietQR ({tuitionPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bank_qr_config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'bank_qr_config' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4 text-indigo-600" />
          <span>Tài Khoản Ngân Hàng / Úp Mã QR</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-purple-600" />
          <span>Thông Báo ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Báo Cáo Tài Chính</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'branding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4 text-rose-600" />
          <span>Thương Hiệu & Màu Sắc</span>
        </button>

        <button
          onClick={() => setActiveTab('branches_map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'branches_map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Bản Đồ Cơ Sở & Vị Trí</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SUBTAB 1: HỌC PHÍ & VIETQR */}
      {/* ============================================================ */}
      {activeTab === 'tuition' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500">Đã thu học phí</p>
              <p className="text-xl font-black text-emerald-700 font-heading mt-1">
                {totalTuitionRevenue.toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">
                ✓ {tuitionPayments.filter(p => p.status === 'paid').length} hóa đơn đã tất toán
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500">Chờ phụ huynh nộp</p>
              <p className="text-xl font-black text-amber-700 font-heading mt-1">
                {pendingTuitionRevenue.toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-amber-600 mt-1">
                ⏳ {tuitionPayments.filter(p => p.status === 'pending').length} hóa đơn đang mở QR
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">Cú pháp chuyển khoản chuẩn</p>
                <p className="text-xs font-mono font-bold text-indigo-900 mt-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                  {bankConfig.memoFormat === 'NAME_SUBJECT_MONTH' ? '[Họ và tên] - [Môn] - [Tháng]' : '[Mã HV] - [Môn] - [Tháng]'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">VD: HV001 - Piano - Thang 03</p>
              </div>
              <QrCode className="w-8 h-8 text-amber-500 shrink-0" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Tìm theo mã HV, tên học viên, môn học, kỳ thu..."
                  value={tuitionSearch}
                  onChange={(e) => setTuitionSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={tuitionStatusFilter}
                  onChange={(e) => setTuitionStatusFilter(e.target.value as any)}
                  className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="pending">Chưa thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                    <th className="py-3 px-3">Hóa Đơn & Học Viên</th>
                    <th className="py-3 px-3">Môn & Kỳ Thu</th>
                    <th className="py-3 px-3">Số Buổi</th>
                    <th className="py-3 px-3">Số Tiền (VNĐ)</th>
                    <th className="py-3 px-3">Cú Pháp Chuyển Khoản</th>
                    <th className="py-3 px-3">Hạn Nộp</th>
                    <th className="py-3 px-3">Trạng Thái</th>
                    <th className="py-3 px-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => {
                    const memo = p.transferSyntax || formatTransferContent(p.studentCode || p.studentName, p.subjectName || 'Piano', p.billingMonth);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div>
                            <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] border border-amber-200 mr-1.5">
                              {p.code || 'HP'}
                            </span>
                            <strong className="text-slate-900">{p.studentName}</strong>
                            {p.studentCode && <span className="text-slate-400 text-[10px] ml-1">({p.studentCode})</span>}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div>
                            <span className="font-bold text-slate-800">{p.subjectName || 'Âm nhạc'}</span>
                            <p className="text-[10px] text-slate-500">{p.billingMonth}</p>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {p.sessionsCount} buổi
                        </td>

                        <td className="py-3 px-3 font-black text-amber-700 text-sm">
                          {p.amount.toLocaleString('vi-VN')} đ
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleCopyText(memo, 'Nội dung chuyển khoản')}
                            className="font-mono font-bold text-[11px] text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                            title="Bấm để sao chép cú pháp chuyển khoản"
                          >
                            <span>{memo}</span>
                            <Copy className="w-3 h-3 text-indigo-600" />
                          </button>
                        </td>

                        <td className="py-3 px-3 text-slate-500">{p.dueDate}</td>

                        <td className="py-3 px-3">
                          {p.status === 'paid' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Đã nộp
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                              Chờ thanh toán
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedPaymentForQR(p)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Xem QR</span>
                            </button>

                            {p.status === 'pending' && (
                              <button
                                onClick={() => {
                                  updateTuitionStatus(p.id, 'paid', p.amount);
                                  showToast(`Đã xác nhận thanh toán học phí thành công cho ${p.studentName}!`);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Xác nhận thu
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 2: CẤU HÌNH TÀI KHOẢN NGÂN HÀNG & ÚP MÃ QR */}
      {/* ============================================================ */}
      {activeTab === 'bank_qr_config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Cấu Hình Tài Khoản Ngân Hàng Nhận Học Phí & Mã QR
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Thiết lập ngân hàng thụ hưởng của trung tâm để phụ huynh và học viên quét mã QR chuyển khoản nộp học phí nhanh chóng.
              </p>
            </div>

            <form onSubmit={handleSaveBankConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngân hàng thụ hưởng (*):</label>
                  <select
                    value={bankId}
                    onChange={(e) => setBankId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  >
                    <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
                    <option value="VCB">Vietcombank (Ngoại thương)</option>
                    <option value="TCB">Techcombank (Kỹ thương)</option>
                    <option value="VPB">VPBank (Việt Nam Thịnh Vượng)</option>
                    <option value="ACB">ACB (Á Châu)</option>
                    <option value="BIDV">BIDV (Đầu tư & Phát triển)</option>
                    <option value="CTG">VietinBank (Công thương)</option>
                    <option value="TPB">TPBank (Tiên Phong)</option>
                    <option value="VIB">VIB (Quốc Tế)</option>
                    <option value="STB">Sacombank (Sài Gòn Thương Tín)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số tài khoản (*):</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="0901888999"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-extrabold text-amber-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chủ tài khoản (In hoa không dấu) (*):</label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                  placeholder="TRUNG TAM AM NHAC MINH MUSIC"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Định dạng cú pháp nội dung chuyển khoản (*):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <label
                    onClick={() => setMemoFormat('CODE_SUBJECT_MONTH')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      memoFormat === 'CODE_SUBJECT_MONTH'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="memoFormat"
                      checked={memoFormat === 'CODE_SUBJECT_MONTH'}
                      onChange={() => setMemoFormat('CODE_SUBJECT_MONTH')}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <p className="font-extrabold text-xs">Mã HV - Môn - Tháng</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">HV001 - Piano - Thang 03</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setMemoFormat('NAME_SUBJECT_MONTH')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      memoFormat === 'NAME_SUBJECT_MONTH'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="memoFormat"
                      checked={memoFormat === 'NAME_SUBJECT_MONTH'}
                      onChange={() => setMemoFormat('NAME_SUBJECT_MONTH')}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <p className="font-extrabold text-xs">Họ và tên - Môn - Tháng</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">Nguyen Minh Anh - Piano - Thang 03</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tùy chọn úp mã QR */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900">Tải lên ảnh Mã QR riêng của trung tâm</h4>
                    <p className="text-slate-500 text-[11px]">
                      Nếu bạn có sẵn ảnh mã QR được in từ ngân hàng, bạn có thể úp trực tiếp lên hệ thống.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustomQr}
                      onChange={(e) => setUseCustomQr(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {useCustomQr && (
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                    <input
                      type="file"
                      ref={qrFileInputRef}
                      onChange={handleCustomQrUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => qrFileInputRef.current?.click()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Chọn file ảnh QR từ thiết bị</span>
                    </button>
                    {customQrUrl && (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã tải lên ảnh QR thành công</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Lưu Cấu Hình Ngân Hàng
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Xem Trước Mã QR Học Phí
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Napas 247 Live
              </span>
            </div>

            <div className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 p-5 rounded-2xl border border-amber-200 text-center space-y-3">
              <p className="text-xs font-extrabold text-slate-800">QUÉT MÃ QR NỘP HỌC PHÍ</p>
              
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 inline-block">
                {useCustomQr && customQrUrl ? (
                  <img
                    src={customQrUrl}
                    alt="Custom Bank QR"
                    className="w-52 h-52 object-contain mx-auto rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img
                    src={`https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.png?amount=3600000&addInfo=${encodeURIComponent(memoFormat === 'NAME_SUBJECT_MONTH' ? 'Nguyen Minh Anh - Piano - Thang 03' : 'HV001 - Piano - Thang 03')}&accountName=${encodeURIComponent(accountHolder)}`}
                    alt="VietQR Live Preview"
                    className="w-52 h-52 object-contain mx-auto rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              <div className="text-left text-xs space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <strong className="text-slate-900">{bankId}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <strong className="text-amber-800 font-mono text-sm">{accountNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <strong className="text-slate-900 font-mono text-[11px]">{accountHolder}</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Nội dung mẫu:</span>
                  <span className="font-mono font-bold text-indigo-900 text-[11px]">
                    {memoFormat === 'NAME_SUBJECT_MONTH' ? 'Nguyen Minh Anh - Piano - Thang 03' : 'HV001 - Piano - Thang 03'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 3: THÔNG BÁO */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {n.targetAudience === 'ALL' ? 'Toàn bộ trung tâm' : n.targetAudience}
                  </span>
                  <span className="text-xs text-slate-400">{n.createdAt}</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 font-heading">{n.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 4: BÁO CÁO TÀI CHÍNH */}
      {/* ============================================================ */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-bold">Tổng doanh thu lũy kế</p>
            <h3 className="text-2xl font-black text-slate-900 font-heading mt-1">
              {(totalTuitionRevenue + 12000000).toLocaleString('vi-VN')} đ
            </h3>
            <p className="text-xs text-emerald-600 mt-2">↑ +18% so với tháng trước</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-bold">Tỷ lệ duy trì học viên (Retention)</p>
            <h3 className="text-2xl font-black text-slate-900 font-heading mt-1">94.2%</h3>
            <p className="text-xs text-emerald-600 mt-2">Xuất sắc trong ngành đào tạo âm nhạc</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-bold">Công suất phòng tập & lớp</p>
            <h3 className="text-2xl font-black text-slate-900 font-heading mt-1">85%</h3>
            <p className="text-xs text-blue-600 mt-2">Hoạt động tối ưu các khung giờ vàng</p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 5: THƯƠNG HIỆU */}
      {/* ============================================================ */}
      {activeTab === 'branding' && (
        <BrandingConfigPanel />
      )}

      {/* ============================================================ */}
      {/* SUBTAB 6: BẢN ĐỒ CƠ SỞ & VỊ TRÍ */}
      {/* ============================================================ */}
      {activeTab === 'branches_map' && (
        <BranchesAndMapManagement />
      )}

      {/* ============================================================ */}
      {/* SUBTAB 7: CÀI ĐẶT HỆ THỐNG & ÂM THANH / NHẠC NỀN */}
      {/* ============================================================ */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* 1. ÂM THANH & NHẠC NỀN TRUNG TÂM (AUDIO STUDIO SETTINGS) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">
                    Cấu Hình Âm Thanh & Nhạc Nền Studio
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tùy chỉnh hiệu ứng nốt nhạc khi tương tác click chuột và nhạc nền thư giãn cho trung tâm
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full">
                Web Audio Studio
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cài đặt âm thanh click chuột */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      <MousePointerClick className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 font-heading">
                        Âm Thanh Click Chuột
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Phát âm thanh nốt nhạc khi bấm các nút và danh mục
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleSound}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isSoundEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    aria-label="Bật tắt âm thanh click"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                        isSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {isSoundEnabled && (
                  <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Chọn Bộ Âm Sắc Tương Tác:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'piano', label: 'Piano Classic', desc: 'Đàn Piano ấm áp' },
                          { id: 'marimba', label: 'Mộc Cầm', desc: 'Gõ gỗ Marimba' },
                          { id: 'modern_pop', label: 'Modern Pop', desc: 'Bong bóng hiện đại' },
                          { id: 'gentle_chime', label: 'Chuông Ngân', desc: 'Chuông bạc êm dịu' }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setSoundTheme(theme.id as SoundTheme);
                              playSuccessSound();
                            }}
                            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                              soundTheme === theme.id
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <p className="font-extrabold text-xs">{theme.label}</p>
                            <p className={`text-[10px] mt-0.5 ${soundTheme === theme.id ? 'text-amber-100' : 'text-slate-400'}`}>
                              {theme.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span>Âm lượng hiệu ứng click:</span>
                        <span className="font-mono text-amber-600 dark:text-amber-400">{Math.round(soundVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={soundVolume}
                        onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cài đặt nhạc nền trung tâm */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      <Disc3 className={`w-5 h-5 ${isMusicPlaying ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 font-heading">
                        Nhạc Nền Không Gian Studio
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isMusicPlaying ? `Đang phát: ${currentTrack.title}` : 'Giai điệu thư giãn giảm căng thẳng'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleMusic}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                      isMusicPlaying
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20'
                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    }`}
                  >
                    {isMusicPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isMusicPlaying ? 'Tạm Dừng' : 'Bật Nhạc Nền'}</span>
                  </button>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Chọn Giai Điệu Nền:
                    </label>
                    <div className="space-y-1.5">
                      {AMBIENT_TRACKS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setCurrentTrackId(t.id);
                            if (!isMusicPlaying) toggleMusic();
                          }}
                          className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                            currentTrackId === t.id
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 ring-1 ring-amber-400'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <p className="font-extrabold">{t.title}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{t.genre} • {t.tempoBpm} BPM</p>
                          </div>
                          {currentTrackId === t.id && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500 text-white">
                              {isMusicPlaying ? 'Đang phát ♫' : 'Đang chọn'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Âm lượng nhạc nền:</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CÀI ĐẶT GIAO DIỆN SÁNG / TỐI */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">
                    Chế Độ Giao Diện (Theme Mode)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tùy chọn tông màu hiển thị ngày và đêm cho hệ thống
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Ban ngày (Light)</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Ban đêm (Dark)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: XEM MÃ QR HỌC PHÍ CHI TIẾT */}
      {/* ============================================================ */}
      {selectedPaymentForQR && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Mã QR Nộp Học Phí VietQR
              </h3>
              <button
                onClick={() => setSelectedPaymentForQR(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic VietQR Image */}
            <div className="p-3 bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-2xl border border-amber-200">
              <img
                src={generateQrUrlForPayment(selectedPaymentForQR)}
                alt="VietQR Payment Code"
                className="w-56 h-56 mx-auto rounded-xl shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bank details & Copy triggers */}
            <div className="text-xs text-left space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ngân hàng:</span>
                <strong className="text-slate-900">{bankConfig.bankId || 'MBBank'}</strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số tài khoản:</span>
                <button
                  onClick={() => handleCopyText(bankConfig.accountNumber || '0901888999', 'Số tài khoản')}
                  className="font-mono font-extrabold text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{bankConfig.accountNumber || '0901888999'}</span>
                  <Copy className="w-3 h-3 text-amber-600" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">
                  {bankConfig.accountHolder || 'TRUNG TAM AM NHAC MINH MUSIC'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số tiền nộp:</span>
                <strong className="text-amber-800 text-sm font-black">
                  {selectedPaymentForQR.amount.toLocaleString('vi-VN')} đ
                </strong>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Nội dung chuyển khoản chuẩn:</span>
                <button
                  onClick={() => {
                    const idOrName = bankConfig.memoFormat === 'NAME_SUBJECT_MONTH'
                      ? (selectedPaymentForQR.studentName || selectedPaymentForQR.studentCode || 'HV')
                      : (selectedPaymentForQR.studentCode || selectedPaymentForQR.studentName || 'HV');
                    const memo = selectedPaymentForQR.transferSyntax || formatTransferContent(idOrName, selectedPaymentForQR.subjectName || 'Piano', selectedPaymentForQR.billingMonth);
                    handleCopyText(memo, 'Nội dung chuyển khoản');
                  }}
                  className="w-full p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl font-mono font-bold text-xs flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="truncate mr-1">
                    {selectedPaymentForQR.transferSyntax || formatTransferContent(selectedPaymentForQR.studentCode || selectedPaymentForQR.studentName, selectedPaymentForQR.subjectName || 'Piano', selectedPaymentForQR.billingMonth)}
                  </span>
                  <Copy className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedPaymentForQR.status === 'pending' && (
                <button
                  onClick={() => {
                    updateTuitionStatus(selectedPaymentForQR.id, 'paid', selectedPaymentForQR.amount);
                    showToast('Đã ghi nhận thanh toán học phí thành công!');
                    setSelectedPaymentForQR(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  ✓ Xác Nhận Đã Thu
                </button>
              )}
              <button
                onClick={() => setSelectedPaymentForQR(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: TẠO HÓA ĐƠN HỌC PHÍ MỚI */}
      {/* ============================================================ */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Tạo Hóa Đơn Học Phí Mới
                </h3>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn học viên (*):</label>
                <select
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    const st = students.find(s => s.id === e.target.value);
                    if (st && st.enrolledSubjects?.[0]) {
                      setSubjectName(st.enrolledSubjects[0]);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.code}) - {s.enrolledSubjects?.join(', ') || 'Âm nhạc'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bộ môn (*):</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kỳ thu (*):</label>
                  <input
                    type="text"
                    required
                    value={billingMonth}
                    onChange={(e) => setBillingMonth(e.target.value)}
                    placeholder="Tháng 03/2025"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số tiền học phí (VNĐ):</label>
                  <input
                    type="number"
                    step={100000}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-amber-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số buổi học:</label>
                  <input
                    type="number"
                    value={sessionsCount}
                    onChange={(e) => setSessionsCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              {/* Preview Transfer Syntax */}
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 text-[11px] space-y-1">
                <p className="font-bold">Cú pháp chuyển khoản sẽ sinh tự động:</p>
                <p className="font-mono font-bold text-slate-900 bg-white p-1.5 rounded border border-indigo-200">
                  {formatTransferContent(
                    students.find(s => s.id === studentId)?.code || students.find(s => s.id === studentId)?.fullName || 'HV',
                    subjectName,
                    billingMonth
                  )}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú phiếu thu:</label>
                <input
                  type="text"
                  value={invoiceNote}
                  onChange={(e) => setInvoiceNote(e.target.value)}
                  placeholder="Ví dụ: Học phí khóa cơ bản kỳ 1"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Tạo Hóa Đơn & Sinh Mã QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: PHÁT THÔNG BÁO MỚI */}
      {/* ============================================================ */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Phát Thông Báo Toàn Hệ Thống
              </h3>
              <button onClick={() => setIsNotifModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo (*):</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Ví dụ: Thông báo lịch học bù và nộp học phí tháng mới..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gửi tới đối tượng:</label>
                <select
                  value={notifAudience}
                  onChange={(e) => setNotifAudience(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="ALL">Toàn bộ trung tâm (Tất cả)</option>
                  <option value="TEACHER">Chỉ Giáo viên</option>
                  <option value="STUDENT">Chỉ Học viên</option>
                  <option value="PARENT">Chỉ Phụ huynh & Giám hộ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết (*):</label>
                <textarea
                  rows={4}
                  value={notifContent}
                  onChange={(e) => setNotifContent(e.target.value)}
                  placeholder="Nhập nội dung thông báo..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNotifModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSendNotification}
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm cursor-pointer"
              >
                Phát Thông Báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
