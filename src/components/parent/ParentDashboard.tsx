import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserProfileModal } from '../profile/UserProfileModal';
import { TopThreeHonorPodium } from '../gamification/TopThreeHonorPodium';
import { PersonalRankCard } from '../gamification/PersonalRankCard';
import { Assignment, Submission, TuitionPayment, RegistrationRequest, MakeupRequest, ReservationRecord } from '../../types';
import confetti from 'canvas-confetti';
import {
  Users,
  GraduationCap,
  CalendarDays,
  CheckSquare,
  CreditCard,
  QrCode,
  Clock,
  RefreshCw,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Camera,
  UserCheck,
  Copy,
  Check,
  X,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Trophy,
  Star,
  Music,
  Gauge,
  Link as LinkIcon,
  Award,
  ExternalLink,
  BookOpen,
  CalendarCheck,
  Bell,
  Building2,
  Settings,
  PlusCircle,
  Video,
  Upload,
  Send,
  Image as ImageIcon,
  Gift,
  MapPin,
  Phone
} from 'lucide-react';

type ParentTab = 
  | 'overview' 
  | 'subjects' 
  | 'attendance' 
  | 'makeup_reservation' 
  | 'honor_rewards' 
  | 'tuition' 
  | 'notifications' 
  | 'branches';

export const ParentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    students,
    guardians,
    studentGuardianLinks,
    subjects,
    courses,
    classes,
    assignments,
    submissions,
    submitAssignment,
    rewards,
    redeemReward,
    attendance,
    tuitionPayments,
    makeupRequests,
    requestMakeup,
    reservations,
    requestReservation,
    registrationRequests,
    submitRegistrationRequest,
    paymentSubmissions,
    submitPaymentReceipt,
    notifications,
    markNotificationRead,
    branches,
    branding,
    generateQrUrlForPayment,
    formatTransferContent
  } = useData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<ParentTab>('overview');

  // Find guardian profile
  const currentGuardian = guardians.find(
    g => g.id === currentUser?.guardianProfileId || g.email?.toLowerCase() === currentUser?.email?.toLowerCase()
  ) || guardians[0];

  // Linked children
  const linkedLinks = studentGuardianLinks.filter(l => l.guardianId === currentGuardian?.id && l.status === 'active');
  const linkedStudentIds = linkedLinks.map(l => l.studentId);
  const myChildren = students.filter(s => 
    linkedStudentIds.includes(s.id) || 
    currentGuardian?.studentIds?.includes(s.id) ||
    s.parentPhone === currentUser?.phone
  );

  const fallbackChildren = (students || []).slice(0, 2);
  const activeChildrenList = myChildren.length > 0 ? myChildren : fallbackChildren;

  // Selected child switcher state
  const [selectedChildId, setSelectedChildId] = useState<string>(activeChildrenList[0]?.id || 'std-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Homework submission modal (Parent submitting on behalf of child)
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Course registration modal for child
  const [isRegisterCourseModalOpen, setIsRegisterCourseModalOpen] = useState(false);
  const [selectedRegType, setSelectedRegType] = useState<'SUBJECT' | 'COURSE' | 'CLASS'>('COURSE');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [regNote, setRegNote] = useState('');

  // Makeup request modal for child
  const [isMakeupModalOpen, setIsMakeupModalOpen] = useState(false);
  const [makeupClassId, setMakeupClassId] = useState('');
  const [makeupMissedDate, setMakeupMissedDate] = useState('2025-03-24');
  const [makeupDesiredDate, setMakeupDesiredDate] = useState('2025-03-29');
  const [makeupReason, setMakeupReason] = useState('Bé bị sốt và bận lịch thi tại trường tiểu học');

  // Reservation request modal for child
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationCourseName, setReservationCourseName] = useState('Khóa Học Piano Nền Tảng K24');
  const [reservationStartDate, setReservationStartDate] = useState('2025-04-01');
  const [reservationEndDate, setReservationEndDate] = useState('2025-05-01');
  const [reservationReason, setReservationReason] = useState('Gia đình có chuyến công tác/nghỉ hè');

  // Payment proof modal
  const [isPaymentProofModalOpen, setIsPaymentProofModalOpen] = useState(false);
  const [selectedTuitionId, setSelectedTuitionId] = useState('');
  const [proofAmount, setProofAmount] = useState(1800000);
  const [proofSyntax, setProofSyntax] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');

  const currentChild = activeChildrenList.find(c => c.id === selectedChildId) || activeChildrenList[0] || {
    id: 'std-01',
    code: 'HV001',
    fullName: 'Nguyễn Gia Hân',
    gender: 'Nữ' as const,
    birthDate: '2016-05-15',
    enrolledSubjects: ['Piano', 'Thanh nhạc'],
    totalLessons: 24,
    completedLessons: 8,
    remainingLessons: 16,
    stars: 25,
    totalStars: 25,
    rewardPoints: 45,
    status: 'active' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Đã sao chép ${fieldName}!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Child specific data
  const childAssignments = assignments.filter(
    asg => asg.studentId === currentChild.id || 
           asg.targetStudentIds?.includes(currentChild.id) ||
           (!asg.studentId && !asg.targetStudentIds)
  );

  const childAttendance = attendance.filter(a => a.studentId === currentChild.id);
  const childTuitions = tuitionPayments.filter(t => t.studentId === currentChild.id);
  const childMakeupRequests = makeupRequests.filter(m => m.studentId === currentChild.id);
  const childReservations = reservations.filter(r => r.studentId === currentChild.id);
  const childRegistrationRequests = registrationRequests.filter(r => r.studentId === currentChild.id);
  const childPaymentSubmissions = paymentSubmissions.filter(p => p.studentId === currentChild.id);

  // Homework submit handler on behalf of child
  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    if (!mediaUrl.trim() && !notes.trim()) {
      alert('Vui lòng cung cấp link video thực hành hoặc ghi chú báo cáo kết quả tập luyện!');
      return;
    }

    submitAssignment({
      assignmentId: submittingAssignment.id,
      studentId: currentChild.id,
      studentName: currentChild.fullName,
      mediaUrl,
      notes: `(Phụ huynh gửi thay): ${notes}`,
      status: 'pending'
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmittingAssignment(null);
    setMediaUrl('');
    setNotes('');
    showToast(`🎉 Đã nộp bài tập thành công cho bé ${currentChild.fullName}! Thầy cô sẽ sớm nhận xét.`);
  };

  // Course registration request handler for child
  const handleRegisterCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let targetName = 'Khóa học âm nhạc';
    if (selectedRegType === 'COURSE') {
      const found = courses.find(c => c.id === selectedTargetId) || courses[0];
      targetName = found ? found.name : 'Khóa học';
    } else if (selectedRegType === 'SUBJECT') {
      const found = subjects.find(s => s.id === selectedTargetId) || subjects[0];
      targetName = found ? found.name : 'Môn học';
    } else {
      const found = classes.find(c => c.id === selectedTargetId) || classes[0];
      targetName = found ? found.name : 'Lớp học';
    }

    submitRegistrationRequest({
      type: selectedRegType,
      targetId: selectedTargetId || 'item-01',
      targetName,
      studentId: currentChild.id,
      studentName: currentChild.fullName,
      note: `(Phụ huynh ${currentUser?.displayName || 'Phụ huynh'} đăng ký cho bé): ${regNote}`
    });

    setIsRegisterCourseModalOpen(false);
    setSelectedTargetId('');
    setRegNote('');
    showToast(`Đã gửi yêu cầu đăng ký "${targetName}" cho bé ${currentChild.fullName}!`);
  };

  // Makeup request handler for child
  const handleMakeupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find(c => c.id === makeupClassId) || classes[0];
    requestMakeup({
      studentId: currentChild.id,
      studentName: currentChild.fullName,
      classId: cls ? cls.id : 'cls-01',
      className: cls ? cls.name : 'Lớp học',
      missedDate: makeupMissedDate,
      makeupDate: makeupDesiredDate,
      timeSlot: cls ? cls.scheduleTime : '18:00 - 19:30',
      reason: `(Phụ huynh gửi): ${makeupReason}`
    });

    setIsMakeupModalOpen(false);
    showToast(`Đã gửi đơn đăng ký học bù cho bé ${currentChild.fullName}!`);
  };

  // Reservation request handler for child
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestReservation({
      studentId: currentChild.id,
      studentName: currentChild.fullName,
      courseId: 'crs-01',
      courseName: reservationCourseName,
      startDate: reservationStartDate,
      endDate: reservationEndDate,
      reason: `(Phụ huynh gửi): ${reservationReason}`,
      notes: `Phụ huynh ${currentUser?.displayName || ''} liên hệ bảo lưu`,
      remainingLessons: currentChild.remainingLessons || 12
    });

    setIsReservationModalOpen(false);
    showToast(`Đã gửi đơn xin bảo lưu khóa học cho bé ${currentChild.fullName}!`);
  };

  // Payment proof submit handler
  const handlePaymentProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl.trim() && !proofNotes.trim()) {
      alert('Vui lòng dán link ảnh biên lai/chuyển khoản hoặc ghi chú mã giao dịch ngân hàng!');
      return;
    }

    submitPaymentReceipt({
      tuitionPaymentId: selectedTuitionId || undefined,
      studentId: currentChild.id,
      studentName: currentChild.fullName,
      amount: proofAmount,
      transferSyntax: proofSyntax || `HV${currentChild.code || '001'} ${currentChild.fullName} HP`,
      receiptProofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      notes: `(Phụ huynh gửi): ${proofNotes}`
    });

    setIsPaymentProofModalOpen(false);
    setProofUrl('');
    setProofNotes('');
    showToast(`🎉 Đã gửi xác nhận nộp học phí cho bé ${currentChild.fullName}! Kế toán sẽ duyệt sớm.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Child Switcher Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
              CỔNG THÔNG TIN PHỤ HUYNH • MINH MUSIC
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 text-[10px] font-black">
              Giám hộ chính
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mt-1.5 font-heading">
            Xin chào, Phụ huynh {currentUser?.displayName || 'Phụ huynh'}!
          </h1>
          <p className="text-amber-100 text-xs mt-0.5">
            Đồng hành cùng con: Theo dõi chuyên cần, tiến độ rèn luyện, đăng ký môn học và thanh toán học phí tiện lợi.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Multi-child Switcher Pills */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-1 flex items-center gap-1 border border-white/30">
            {activeChildrenList.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  selectedChildId === child.id
                    ? 'bg-white text-slate-900 shadow-md scale-102'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <span>👶</span>
                <span>{child.fullName}</span>
                <span className="text-[10px] opacity-75 font-mono">({child.code || 'HV001'})</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl border border-white/30 text-white transition-all cursor-pointer flex flex-col items-center gap-1 text-xs font-bold shadow-xs"
            title="Cài đặt tài khoản phụ huynh & Đổi ảnh"
          >
            <Settings className="w-5 h-5" />
            <span>Cài đặt</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar for Parent */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'overview', label: `Tổng Quan & Bài Tập (${currentChild.fullName})`, icon: FileText },
          { id: 'subjects', label: 'Môn Học & Đăng Ký', icon: BookOpen },
          { id: 'attendance', label: 'Lịch Sử Điểm Danh', icon: CalendarCheck },
          { id: 'makeup_reservation', label: 'Học Bù & Bảo Lưu', icon: RefreshCw },
          { id: 'honor_rewards', label: 'Vinh Danh & Đổi Quà', icon: Trophy },
          { id: 'tuition', label: 'Học Phí & Nộp VietQR', icon: CreditCard },
          { id: 'notifications', label: 'Thông Báo', icon: Bell, count: notifications.length },
          { id: 'branches', label: 'Cơ Sở Trung Tâm', icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ParentTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & HOMEWORK FOR CHILD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Child summary & homework */}
            <div className="lg:col-span-2 space-y-6">
              {/* Child Profile Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentChild.avatarUrl || currentChild.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
                      alt={currentChild.fullName}
                      className="w-16 h-16 rounded-2xl object-cover ring-3 ring-amber-400 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-black">
                          {currentChild.code || 'HV001'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          {currentChild.level || 'Grade 2'}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 font-heading mt-1">
                        Học viên: {currentChild.fullName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Sinh ngày: {currentChild.birthDate || '2016-05-15'} • Bộ môn: {currentChild.enrolledSubjects?.join(', ') || 'Piano'}
                      </p>
                    </div>
                  </div>

                  {/* Stars & Points Display (Read-Only) */}
                  <div className="flex items-center gap-3">
                    <div className="text-center bg-amber-50 border border-amber-200 p-2.5 rounded-2xl min-w-[80px]">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">Sao Vinh Danh</span>
                      <div className="flex items-center justify-center gap-1 font-black text-base text-amber-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{currentChild.totalStars ?? currentChild.stars ?? 0}</span>
                      </div>
                    </div>

                    <div className="text-center bg-rose-50 border border-rose-200 p-2.5 rounded-2xl min-w-[80px]">
                      <span className="text-[10px] font-bold text-rose-800 uppercase block">Điểm Đổi Quà</span>
                      <div className="flex items-center justify-center gap-1 font-black text-base text-rose-600">
                        <Gift className="w-4 h-4 text-rose-500" />
                        <span>{currentChild.rewardPoints ?? currentChild.stars ?? 0} đ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Số buổi đã học: {currentChild.completedLessons || 8} / {currentChild.totalLessons || 24} buổi</span>
                    <span className="text-emerald-600">Số buổi còn lại: {currentChild.remainingLessons || 16} buổi</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, ((currentChild.completedLessons || 8) / (currentChild.totalLessons || 24)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Homework List for Child */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-extrabold text-slate-900 font-heading">
                      Bài Tập Thực Hành Của Bé ({childAssignments.length})
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Phụ huynh có thể hỗ trợ quay video nộp bài thay con
                  </span>
                </div>

                <div className="space-y-4">
                  {childAssignments.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                      <Music className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-bold text-xs">Hiện tại bé chưa có bài tập mới nào cần nộp.</p>
                    </div>
                  ) : (
                    childAssignments.map(asg => {
                      const submission = submissions.find(
                        s => s.assignmentId === asg.id && s.studentId === currentChild.id
                      );

                      return (
                        <div key={asg.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                                  {asg.subjectName || 'Piano'}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                                  {asg.studentLevel || 'Cơ bản'}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-base text-slate-900 font-heading mt-1">
                                {asg.title}
                              </h4>
                            </div>

                            <span className="text-[11px] px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200 w-fit">
                              ⏰ Hạn nộp: {asg.dueDate}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600">{asg.description}</p>

                          {asg.customNotes && (
                            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs">
                              <p className="font-bold text-blue-800 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Lời dặn của thầy/cô dành cho phụ huynh & học viên:
                              </p>
                              <p className="italic text-[11px] mt-1">"{asg.customNotes}"</p>
                            </div>
                          )}

                          {submission && (
                            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">Trạng thái bài nộp của bé:</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                  submission.status === 'graded' 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                  {submission.status === 'graded' ? '✓ Giáo viên đã chấm điểm' : '⏳ Đã nộp - Đang chờ giáo viên xem'}
                                </span>
                              </div>

                              {submission.teacherFeedback && (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                                    <Award className="w-4 h-4 text-emerald-600" />
                                    Đánh giá: <strong>{submission.grade || 'Tốt'}</strong>
                                  </p>
                                  <p className="text-[11px] italic mt-1 text-emerald-900">"{submission.teacherFeedback}"</p>
                                  <div className="flex items-center gap-3 mt-2 font-bold text-emerald-700 text-[11px]">
                                    <span>⭐ +{submission.starsAwarded || 5} Sao Vinh Danh</span>
                                    <span>🎁 +{submission.rewardPointsAwarded || 15} Điểm Đổi Quà</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                              <span>+{asg.bonusStars || 5} Sao BXH & +{asg.rewardPoints || 15} Điểm đổi quà</span>
                            </div>

                            <button
                              onClick={() => setSubmittingAssignment(asg)}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Upload className="w-4 h-4" />
                              <span>{submission ? 'Cập Nhật / Nộp Lại Video Cho Bé' : 'Nộp Video Bài Tập Cho Bé'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Rank & Quick shortcuts */}
            <div className="space-y-6">
              {/* Personal Rank Card for Child */}
              <PersonalRankCard studentId={currentChild.id} />

              {/* Quick Actions */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                  Thao Tác Phụ Huynh Nhanh
                </h3>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { setActiveTab('subjects'); setIsRegisterCourseModalOpen(true); }}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      Đăng ký thêm môn / khóa học cho con
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('makeup_reservation'); setIsMakeupModalOpen(true); }}
                    className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl border border-amber-200 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-amber-600" />
                      Xin nghỉ / Đăng ký học bù cho con
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('makeup_reservation'); setIsReservationModalOpen(true); }}
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-2xl border border-indigo-200 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Gửi đơn xin bảo lưu khóa học cho con
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('tuition')}
                    className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-2xl border border-rose-200 text-xs font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-rose-600" />
                      Quét VietQR đóng học phí cho con
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS & REGISTRATION */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-heading">
                Môn Học Của Bé {currentChild.fullName} & Đăng Ký Thêm
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Phụ huynh có thể đăng ký bổ sung các môn năng khiếu khác (Vocal, Guitar, Violin, Vẽ tranh...).
              </p>
            </div>

            <button
              onClick={() => setIsRegisterCourseModalOpen(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Ký Môn / Khóa Mới Cho Con</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 font-heading">Các Môn Bé Đang Theo Học</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentChild.enrolledSubjects || ['Piano']).map((sub, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-black">
                      {sub}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Đang học
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Lớp Năng Khiếu {sub} Trẻ Em
                  </h4>
                  <p className="text-xs text-slate-500">
                    Lịch học: Thứ 2 - Thứ 4 (17:30 - 19:00) • Giáo viên phụ trách: Thầy Minh
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-800 font-heading">Tất Cả Khóa Học & Lớp Năng Khiếu Tại Trung Tâm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black">
                        {course.subjectName || 'Âm nhạc'}
                      </span>
                      <span className="text-xs font-black text-rose-600">
                        {course.fee?.toLocaleString()} đ
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{course.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRegType('COURSE');
                      setSelectedTargetId(course.id);
                      setIsRegisterCourseModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Đăng Ký Khóa Này Cho Bé
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-emerald-600" />
                  <span>Sổ Điểm Danh & Nhật Ký Học Tập Của Bé {currentChild.fullName}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chi tiết từng buổi học, giờ đến lớp và đánh giá trực tiếp từ giáo viên đứng lớp.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Chuyên cần: 100% (Đúng giờ)</span>
              </div>
            </div>

            {childAttendance.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                <CalendarDays className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-xs">Chưa có lịch sử điểm danh nào của bé.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                      <th className="p-3">Ngày học</th>
                      <th className="p-3">Lớp học</th>
                      <th className="p-3">Trạng thái điểm danh</th>
                      <th className="p-3">Sao khen thưởng</th>
                      <th className="p-3">Nhận xét của thầy cô giáo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {childAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-800">{rec.date}</td>
                        <td className="p-3 font-semibold text-slate-900">{rec.className || 'Piano Thiếu Nhi'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            rec.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                            rec.status === 'late' ? 'bg-amber-100 text-amber-800' :
                            rec.status === 'excused' ? 'bg-blue-100 text-blue-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {rec.status === 'present' ? 'Có mặt đúng giờ' :
                             rec.status === 'late' ? 'Đi muộn' :
                             rec.status === 'excused' ? 'Nghỉ có phép' : 'Vắng'}
                          </span>
                        </td>
                        <td className="p-3">
                          {rec.starsAwarded ? (
                            <span className="font-black text-amber-600 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              +{rec.starsAwarded} Sao
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-700">
                          {rec.note || rec.evaluation || 'Bé tập trung, tiếp thu bài nhanh và chăm chỉ luyện ngón.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE & MAKEUP & RESERVATION */}
      {activeTab === 'makeup_reservation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Makeup Request Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-heading">
                      Xin Nghỉ & Đăng Ký Học Bù Cho Con
                    </h3>
                    <p className="text-xs text-slate-500">
                      Gửi đơn xin nghỉ trước để trung tâm sắp xếp lịch học bù miễn phí cho bé.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trung tâm cam kết dạy bù đầy đủ 100% số buổi cho học viên khi có đơn xin nghỉ hợp lệ từ phụ huynh.
                </p>
              </div>

              <button
                onClick={() => setIsMakeupModalOpen(true)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Gửi Đơn Xin Nghỉ & Học Bù</span>
              </button>
            </div>

            {/* Reservation Request Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-heading">
                      Bảo Lưu Khóa Học Cho Con
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bảo lưu học phí và số buổi còn lại khi gia đình có việc bận kéo dài.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hỗ trợ bảo lưu tới 3 tháng. Khi bé đi học trở lại, trung tâm sẽ kích hoạt lại lớp học nguyên trạng.
                </p>
              </div>

              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Gửi Đơn Xin Bảo Lưu</span>
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 font-heading">
              Lịch Sử Đơn Nghỉ / Học Bù & Bảo Lưu Của Bé
            </h3>
            {childMakeupRequests.length === 0 && childReservations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có đơn xin nghỉ hay bảo lưu nào.</p>
            ) : (
              <div className="space-y-2">
                {childMakeupRequests.map(m => (
                  <div key={m.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">[Học bù] {m.className} • Buổi nghỉ: {m.missedDate}</p>
                      <p className="text-[11px] text-slate-500">Lịch bù mong muốn: {m.makeupDate} ({m.timeSlot}) • Lý do: {m.reason}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                      {m.status === 'approved' ? 'Đã duyệt' : 'Đang xếp lịch'}
                    </span>
                  </div>
                ))}

                {childReservations.map(r => (
                  <div key={r.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">[Bảo lưu] {r.courseName} (Còn {r.remainingLessons || 12} buổi)</p>
                      <p className="text-[11px] text-slate-500">Thời gian: {r.startDate} đến {r.endDate} • Lý do: {r.reason}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                      {r.status === 'active' || r.status === 'approved' ? 'Đang bảo lưu' : 'Đang xử lý'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: HONOR PODIUM & REWARDS */}
      {activeTab === 'honor_rewards' && (
        <div className="space-y-6">
          <TopThreeHonorPodium
            title="Bảng Vàng Vinh Danh Toàn Trung Tâm"
            subtitle="Cùng xem thứ hạng rèn luyện và động viên bé cố gắng đạt thành tích tốt nhất!"
            showFilters={false}
            showFullLeaderboardBelow={true}
          />

          {/* Reward Catalog */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Kho Quà Tặng Đổi Thưởng Cho Bé
                  </h3>
                  <p className="text-xs text-slate-500">
                    Điểm thưởng tích lũy của bé: <strong className="text-rose-600">{currentChild.rewardPoints ?? currentChild.stars ?? 0} Điểm</strong>
                  </p>
                </div>
              </div>

              <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl">
                💡 Đổi quà sẽ không làm giảm điểm Sao Bảng Vàng của bé!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map(r => {
                const pts = r.pointsRequired ?? r.requiredPoints ?? 50;
                const img = r.imageUrl || r.image || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400';
                const userPoints = currentChild.rewardPoints ?? currentChild.stars ?? 0;
                const canAfford = userPoints >= pts;

                return (
                  <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={img} alt={r.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-xs text-slate-900 line-clamp-2">{r.name}</p>
                        <p className="text-xs font-black text-rose-600 mt-1">{pts} Điểm Thưởng 🎁</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const res = redeemReward(currentChild.id, r.id);
                        if (res.success) {
                          showToast(`🎉 Phụ huynh đã đổi thành công "${r.name}" cho bé ${currentChild.fullName}! Nhận quà tại quầy lễ tân.`);
                        } else {
                          alert(res.error || 'Bé chưa đủ điểm thưởng.');
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        canAfford 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Đổi Quà Này Cho Con' : `Còn thiếu ${pts - userPoints} điểm`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TUITION & VIETQR PAYMENT */}
      {activeTab === 'tuition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Tuition list & payment proof */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-rose-600" />
                    <span>Khoản Học Phí Của Bé {currentChild.fullName}</span>
                  </h3>

                  <button
                    onClick={() => {
                      setProofAmount(childTuitions[0]?.amount || 1800000);
                      setSelectedTuitionId(childTuitions[0]?.id || '');
                      setIsPaymentProofModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nộp Biên Lai Chuyển Khoản</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {childTuitions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Bé không có khoản học phí nào chưa đóng.</p>
                  ) : (
                    childTuitions.map(t => (
                      <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-extrabold text-sm text-slate-900">{t.subjectName || 'Khóa học âm nhạc'}</span>
                          <p className="text-xs text-slate-500 mt-0.5">Kỳ học phí: {t.billingMonth || 'Tháng 03/2025'} • Hạn đóng: {t.dueDate || '2025-03-25'}</p>
                          <p className="text-sm font-black text-rose-600 mt-1">{t.amount?.toLocaleString()} VNĐ</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            t.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {t.status === 'paid' ? '✓ Đã Đóng' : 'Chưa Đóng'}
                          </span>

                          {t.status !== 'paid' && (
                            <button
                              onClick={() => {
                                setSelectedTuitionId(t.id);
                                setProofAmount(t.amount);
                                setIsPaymentProofModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Gửi Bill
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submissions History */}
              {childPaymentSubmissions.length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                    Lịch Sử Nộp Biên Lai Đóng Học Phí
                  </h3>
                  <div className="space-y-2">
                    {childPaymentSubmissions.map(p => (
                      <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">Số tiền: {p.amount?.toLocaleString()} VNĐ • Cú pháp: {p.transferSyntax}</p>
                          <p className="text-[11px] text-slate-500">Thời gian gửi: {p.submittedAt} • Ghi chú: {p.notes || 'Không'}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status === 'approved' ? 'Kế toán đã duyệt' : p.status === 'rejected' ? 'Từ chối' : 'Chờ kế toán duyệt'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: VietQR */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-heading font-black text-sm">
                  <QrCode className="w-5 h-5" />
                  <span>Mã VietQR Đóng Học Phí</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <img
                    src={generateQrUrlForPayment(childTuitions[0] || { amount: 1800000 }, 1800000, `HV${currentChild.code || '001'} ${currentChild.fullName} HP T3`)}
                    alt="VietQR"
                    className="w-48 h-48 mx-auto rounded-xl shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500 font-mono mt-2">Quét mã QR qua mọi ứng dụng ngân hàng</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <span className="font-bold text-slate-800">{branding?.bankAccount?.bankName || 'MB Bank'}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-slate-900">{branding?.bankAccount?.accountNumber || '0988776655'}</span>
                      <button
                        onClick={() => copyToClipboard(branding?.bankAccount?.accountNumber || '0988776655', 'Số tài khoản')}
                        className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                        title="Sao chép"
                      >
                        {copiedField === 'Số tài khoản' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500">Chủ TK:</span>
                    <span className="font-bold text-slate-800">{branding?.bankAccount?.accountHolder || 'TRUNG TAM MINH MUSIC'}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500">Cú pháp CK:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-rose-600 truncate max-w-[140px]">
                        HV{currentChild.code || '001'} {currentChild.fullName} HP T3
                      </span>
                      <button
                        onClick={() => copyToClipboard(`HV${currentChild.code || '001'} ${currentChild.fullName} HP T3`, 'Cú pháp')}
                        className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                        title="Sao chép"
                      >
                        {copiedField === 'Cú pháp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-black text-slate-900 font-heading">
                Thông Báo & Tin Tức Từ Trung Tâm ({notifications.length})
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read ? 'bg-slate-50/70 border-slate-200' : 'bg-amber-50/50 border-amber-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                      {notif.type || 'Trung tâm'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400">{notif.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{notif.message}</p>
                {!notif.read && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
                  >
                    Đánh dấu đã đọc ✓
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h2 className="text-lg font-black text-slate-900 font-heading flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Hệ Thống Cơ Sở & Chi Nhánh Minh Music</span>
            </h2>
            <p className="text-xs text-slate-500">
              Phụ huynh có thể đưa đón con hoặc liên hệ trực tiếp lễ tân cơ sở.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map(branch => (
              <div key={branch.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                <img
                  src={branch.imageUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'}
                  alt={branch.name}
                  className="w-full h-44 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-base text-slate-900 font-heading">{branch.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Hotline: {branch.phone || '0988.776.655'}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Quản lý: {branch.managerName || 'Thầy Minh'}</span>
                    <span className="font-bold text-amber-600">Mở cửa: 08:00 - 21:30</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Submit Homework for child */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading">
                    Nộp Bài Tập / Video Cho Bé {currentChild.fullName}
                  </h3>
                  <p className="text-amber-100 text-xs mt-0.5 line-clamp-1">
                    {submittingAssignment.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSubmittingAssignment(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHomework} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Link Video / Ghi Âm thực hành của bé (YouTube / Google Drive / TikTok):</span>
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?... hoặc link Google Drive"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>Ghi chú của phụ huynh gửi thầy cô:</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Bé Hân đã luyện tập đoạn điệp khúc 15 phút mỗi ngày..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-amber-500 resize-none text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gửi Bài Nộp Cho Thầy Cô</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Register Course / Subject / Class for child */}
      {isRegisterCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading">
                    Đăng Ký Môn / Khóa Mới Cho Bé
                  </h3>
                  <p className="text-amber-100 text-xs mt-0.5">
                    Học viên: {currentChild.fullName} ({currentChild.code})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRegisterCourseModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCourseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Loại đăng ký:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'COURSE', label: 'Khóa học' },
                    { id: 'SUBJECT', label: 'Môn học' },
                    { id: 'CLASS', label: 'Lớp học' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedRegType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        selectedRegType === t.id
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Chọn Khóa/Môn:</label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                  required
                >
                  <option value="">-- Chọn mục đăng ký --</option>
                  {selectedRegType === 'COURSE' && courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.fee?.toLocaleString()} đ)</option>
                  ))}
                  {selectedRegType === 'SUBJECT' && subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                  {selectedRegType === 'CLASS' && classes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.name} ({cl.scheduleTime})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Ghi chú của phụ huynh & Khung giờ mong muốn:</label>
                <textarea
                  rows={3}
                  value={regNote}
                  onChange={(e) => setRegNote(e.target.value)}
                  placeholder="Ví dụ: Mong muốn cho bé học vào chiều Thứ 7 hoặc Chủ Nhật..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRegisterCourseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Cho Trung Tâm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Makeup Request for child */}
      {isMakeupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading">
                    Đơn Xin Nghỉ & Đăng Ký Học Bù
                  </h3>
                  <p className="text-amber-100 text-xs mt-0.5">
                    Học viên: {currentChild.fullName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMakeupModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMakeupSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Lớp học cần bù:</label>
                <select
                  value={makeupClassId}
                  onChange={(e) => setMakeupClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                >
                  {classes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.name} ({cl.subjectName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Ngày xin nghỉ:</label>
                  <input
                    type="date"
                    value={makeupMissedDate}
                    onChange={(e) => setMakeupMissedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Ngày mong muốn học bù:</label>
                  <input
                    type="date"
                    value={makeupDesiredDate}
                    onChange={(e) => setMakeupDesiredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Lý do xin nghỉ:</label>
                <textarea
                  rows={2}
                  value={makeupReason}
                  onChange={(e) => setMakeupReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium resize-none text-xs"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMakeupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Đơn Xin Bù Lịch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Reservation Request for child */}
      {isReservationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading">
                    Gửi Đơn Bảo Lưu Cho Bé
                  </h3>
                  <p className="text-indigo-100 text-xs mt-0.5">
                    Học viên: {currentChild.fullName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReservationModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Khóa học xin bảo lưu:</label>
                <input
                  type="text"
                  value={reservationCourseName}
                  onChange={(e) => setReservationCourseName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Bắt đầu từ:</label>
                  <input
                    type="date"
                    value={reservationStartDate}
                    onChange={(e) => setReservationStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Dự kiến học lại:</label>
                  <input
                    type="date"
                    value={reservationEndDate}
                    onChange={(e) => setReservationEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Lý do bảo lưu:</label>
                <textarea
                  rows={2}
                  value={reservationReason}
                  onChange={(e) => setReservationReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium resize-none text-xs"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReservationModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Đơn Bảo Lưu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Payment Proof Submission */}
      {isPaymentProofModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-rose-600 to-pink-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading">
                    Nộp Biên Lai Đóng Học Phí Cho Bé
                  </h3>
                  <p className="text-rose-100 text-xs mt-0.5">
                    Học viên: {currentChild.fullName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentProofModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentProofSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Số tiền đã chuyển (VNĐ):</label>
                  <input
                    type="number"
                    value={proofAmount}
                    onChange={(e) => setProofAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nội dung chuyển khoản:</label>
                  <input
                    type="text"
                    value={proofSyntax || `HV${currentChild.code || '001'} ${currentChild.fullName} HP`}
                    onChange={(e) => setProofSyntax(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-rose-600" />
                  <span>Link ảnh biên lai chuyển khoản (Drive, Bill ảnh...):</span>
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://drive.google.com/... hoặc link ảnh"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Ghi chú thêm:</label>
                <textarea
                  rows={2}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Ví dụ: Phụ huynh chuyển qua Internet Banking MB..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-500 resize-none text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPaymentProofModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đã Chuyển Khoản</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};
