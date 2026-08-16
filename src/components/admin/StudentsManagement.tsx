import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Student, Gender, ReservationRecord, TrialLesson } from '../../types';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Phone,
  Cake,
  Star,
  Edit2,
  Trash2,
  Sparkles,
  Music,
  CheckCircle2,
  XCircle,
  HeartHandshake,
  PauseCircle,
  PlayCircle,
  UserCheck,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  DollarSign,
  QrCode,
  X
} from 'lucide-react';

export const StudentsManagement: React.FC = () => {
  const {
    students,
    subjects,
    courses,
    classes,
    teachers,
    reservations,
    trialLessons,
    addStudent,
    updateStudent,
    deleteStudent,
    awardStars,
    reserveStudentAccount,
    reactivateStudentAccount,
    convertTrialToOfficial,
    cancelReservation,
    addTrialLesson,
    updateTrialLesson
  } = useData();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'trial' | 'reserved' | 'history_reservations'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Modals ---
  // 1. Add/Edit Student Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Piano']);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [totalLessons, setTotalLessons] = useState<number>(24);
  const [status, setStatus] = useState<'active' | 'inactive' | 'reserved' | 'trial'>('active');

  // 2. Award Stars Modal
  const [starStudent, setStarStudent] = useState<Student | null>(null);
  const [starCount, setStarCount] = useState<number>(5);
  const [starReason, setStarReason] = useState<string>('Hoàn thành xuất sắc bài luyện tập');

  // 3. Reserve Account Modal (Bảo lưu)
  const [reserveModalStudent, setReserveModalStudent] = useState<Student | null>(null);
  const [reserveStartDate, setReserveStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reserveEndDate, setReserveEndDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [reserveReason, setReserveReason] = useState('Bận lịch học văn hóa tại trường / Ôn thi');
  const [reserveNotes, setReserveNotes] = useState('');

  // 4. Reactivate Account Modal (Khôi phục đi học lại)
  const [reactivateModalStudent, setReactivateModalStudent] = useState<Student | null>(null);
  const [reactivateClassId, setReactivateClassId] = useState('');

  // 5. Convert Trial To Official Modal (Chuyển học thử sang chính thức)
  const [convertModalStudent, setConvertModalStudent] = useState<Student | null>(null);
  const [targetCourseId, setTargetCourseId] = useState('');
  const [targetClassId, setTargetClassId] = useState('');
  const [targetLessons, setTargetLessons] = useState(24);
  const [targetTuition, setTargetTuition] = useState(4800000);
  const [targetOfficialCode, setTargetOfficialCode] = useState('');

  // 6. Quick Create Trial Modal (Tạo tài khoản học thử)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialGuardian, setTrialGuardian] = useState('');
  const [trialSubject, setTrialSubject] = useState('Piano');
  const [trialDate, setTrialDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [trialTime, setTrialTime] = useState('18:00');
  const [trialTeacherId, setTrialTeacherId] = useState('');
  const [trialNotes, setTrialNotes] = useState('Học thử trải nghiệm đánh giá cảm thụ âm nhạc');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Counts
  const activeCount = students.filter(s => s.status === 'active').length;
  const trialCount = students.filter(s => s.status === 'trial').length;
  const reservedCount = students.filter(s => s.status === 'reserved').length;

  const filteredStudents = students.filter(s => {
    if (activeTab === 'active' && s.status !== 'active') return false;
    if (activeTab === 'trial' && s.status !== 'trial') return false;
    if (activeTab === 'reserved' && s.status !== 'reserved') return false;
    if (subjectFilter !== 'ALL' && !s.enrolledSubjects?.includes(subjectFilter)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        (s.guardianName && s.guardianName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Open Standard Student Modal
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setCode(`HV${String(students.length + 1).padStart(3, '0')}`);
    setFullName('');
    setBirthDate('2015-05-20');
    setGender('female');
    setPhone('');
    setEmail('');
    setAddress('');
    setSelectedSubjects([subjects[0]?.name || 'Piano']);
    setSelectedClassId(classes[0]?.id || '');
    setGuardianName('');
    setGuardianPhone('');
    setTotalLessons(24);
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setCode(s.code);
    setFullName(s.fullName);
    setBirthDate(s.birthDate);
    setGender(s.gender);
    setPhone(s.phone || '');
    setEmail(s.email || '');
    setAddress(s.address || '');
    setSelectedSubjects(s.enrolledSubjects || []);
    setSelectedClassId(s.enrolledClassIds?.[0] || '');
    setGuardianName(s.guardianName || '');
    setGuardianPhone(s.guardianPhone || '');
    setTotalLessons(s.totalLessons || 24);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !birthDate) {
      showToast('Vui lòng nhập đầy đủ Họ tên và Ngày sinh!');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        code,
        fullName,
        birthDate,
        gender,
        phone,
        email,
        address,
        enrolledSubjects: selectedSubjects,
        enrolledClassIds: selectedClassId ? [selectedClassId] : [],
        guardianName,
        guardianPhone,
        totalLessons,
        status
      });
      showToast(`Đã cập nhật hồ sơ học viên ${fullName}`);
    } else {
      addStudent({
        code,
        fullName,
        birthDate,
        gender,
        phone,
        email,
        address,
        enrolledSubjects: selectedSubjects,
        enrolledClassIds: selectedClassId ? [selectedClassId] : [],
        guardianName,
        guardianPhone,
        totalStars: 10,
        stars: 10,
        rewardPoints: 10,
        totalLessons,
        completedLessons: 0,
        remainingLessons: totalLessons,
        status,
        joinedDate: new Date().toISOString().split('T')[0]
      });
      showToast(`Đã thêm mới học viên ${fullName}`);
    }

    setIsModalOpen(false);
  };

  // Open Reserve Modal
  const handleOpenReserve = (s: Student) => {
    setReserveModalStudent(s);
    setReserveStartDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    setReserveEndDate(d.toISOString().split('T')[0]);
    setReserveReason('Bận lịch học văn hóa tại trường / Ôn thi');
    setReserveNotes(`Giữ nguyên ${s.remainingLessons || 0} buổi học và ${s.stars || 0} sao thưởng.`);
  };

  const handleConfirmReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveModalStudent) return;
    reserveStudentAccount(
      reserveModalStudent.id,
      reserveStartDate,
      reserveEndDate,
      reserveReason,
      reserveNotes
    );
    showToast(`Đã bảo lưu tài khoản học viên ${reserveModalStudent.fullName} thành công!`);
    setReserveModalStudent(null);
  };

  // Open Reactivate Modal
  const handleOpenReactivate = (s: Student) => {
    setReactivateModalStudent(s);
    setReactivateClassId(classes[0]?.id || '');
  };

  const handleConfirmReactivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reactivateModalStudent) return;
    reactivateStudentAccount(reactivateModalStudent.id, reactivateClassId);
    showToast(`Học viên ${reactivateModalStudent.fullName} đã tiếp tục học tập!`);
    setReactivateModalStudent(null);
  };

  // Open Convert Trial Modal
  const handleOpenConvertTrial = (s: Student) => {
    setConvertModalStudent(s);
    setTargetCourseId(courses[0]?.id || '');
    setTargetClassId(classes[0]?.id || '');
    setTargetLessons(24);
    const firstCourse = courses[0];
    const initialFee = firstCourse ? (typeof firstCourse.fee === 'number' ? firstCourse.fee : 4800000) : 4800000;
    setTargetTuition(initialFee);
    // Generate next official code
    const existingOfficialNums = students
      .filter(st => st.code && st.code.startsWith('HV'))
      .map(st => parseInt(st.code.replace('HV', ''), 10))
      .filter(n => !isNaN(n));
    const maxNum = existingOfficialNums.length > 0 ? Math.max(...existingOfficialNums) : 6;
    setTargetOfficialCode(`HV${String(maxNum + 1).padStart(3, '0')}`);
  };

  const handleConfirmConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertModalStudent) return;
    const res = convertTrialToOfficial(
      convertModalStudent.id,
      targetCourseId,
      targetClassId,
      targetLessons,
      targetTuition,
      targetOfficialCode
    );
    if (res.success) {
      showToast(`🎉 Đã chuyển học viên ${convertModalStudent.fullName} sang CHÍNH THỨC (${targetOfficialCode}) & sinh hóa đơn học phí!`);
    } else {
      showToast(res.error || 'Có lỗi xảy ra khi chuyển học viên');
    }
    setConvertModalStudent(null);
  };

  // Create Trial Student
  const handleCreateTrialStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialName.trim()) {
      showToast('Vui lòng nhập họ tên học viên học thử!');
      return;
    }

    const trialCode = `HT${String(Date.now()).slice(-3)}`;
    const selTeacher = teachers.find(t => t.id === trialTeacherId) || teachers[0];

    // 1. Add student as trial
    addStudent({
      code: trialCode,
      fullName: trialName,
      birthDate: '2016-01-01',
      gender: 'male',
      phone: trialPhone,
      email: '',
      address: '',
      enrolledSubjects: [trialSubject],
      guardianName: trialGuardian || trialName,
      guardianPhone: trialPhone,
      totalStars: 5,
      stars: 5,
      rewardPoints: 5,
      totalLessons: 1,
      completedLessons: 0,
      remainingLessons: 1,
      status: 'trial',
      joinedDate: new Date().toISOString().split('T')[0],
      notes: `Học thử môn ${trialSubject} ngày ${trialDate} lúc ${trialTime}. ${trialNotes}`
    });

    // 2. Add trial lesson record
    addTrialLesson({
      studentName: trialName,
      parentName: trialGuardian || trialName,
      parentPhone: trialPhone,
      subject: trialSubject,
      preferredDate: trialDate,
      timeSlot: trialTime,
      teacherId: selTeacher?.id,
      teacherName: selTeacher?.fullName,
      status: 'scheduled',
      notes: trialNotes
    });

    showToast(`Đã tạo tài khoản học thử cho em ${trialName} (${trialCode})!`);
    setIsTrialModalOpen(false);
    setTrialName('');
    setTrialPhone('');
    setTrialGuardian('');
  };

  const handleConfirmAwardStars = () => {
    if (!starStudent) return;
    awardStars(starStudent.id, starCount, starReason);
    setStarStudent(null);
    showToast(`Đã tặng ${starCount} sao ⭐ cho học viên ${starStudent.fullName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-md shadow-emerald-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-heading">
                Quản Lý Học Viên & Học Thử / Bảo Lưu
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Quản lý hồ sơ học viên chính thức, bảo lưu tài khoản khi nghỉ tạm thời, và chuyển đổi học viên học thử.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="btn-add-trial"
            onClick={() => {
              setTrialTeacherId(teachers[0]?.id || '');
              setIsTrialModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>+ TẠO TÀI KHOẢN HỌC THỬ</span>
          </button>

          <button
            id="btn-add-student"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ THÊM HỌC VIÊN CHÍNH THỨC</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tất cả ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
          <span>Đang học ({activeCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('trial')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'trial' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-300"></span>
          <span>Học thử ({trialCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('reserved')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'reserved' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PauseCircle className="w-3.5 h-3.5" />
          <span>Đang bảo lưu ({reservedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('history_reservations')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'history_reservations' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Lịch sử bảo lưu ({reservations.length})</span>
        </button>
      </div>

      {/* Main Table Content */}
      {activeTab !== 'history_reservations' ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm theo mã HV, họ tên, phụ huynh, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">Tất cả môn học</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3.5 px-3">Mã & Học Viên</th>
                  <th className="py-3.5 px-3">Môn & Lớp</th>
                  <th className="py-3.5 px-3">Phụ Huynh</th>
                  <th className="py-3.5 px-3">Số Buổi Học</th>
                  <th className="py-3.5 px-3">Sao Thưởng ⭐</th>
                  <th className="py-3.5 px-3">Trạng Thái</th>
                  <th className="py-3.5 px-3 text-right">Hành Động Chuyên Biệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 italic">
                      Không tìm thấy học viên nào phù hợp bộ lọc
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const birth = new Date(s.birthDate);
                    const age = isNaN(birth.getTime()) ? '' : ` • ${new Date().getFullYear() - birth.getFullYear()}t`;
                    const currentClass = classes.find(c => s.enrolledClassIds?.includes(c.id));

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Học viên */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            {s.avatar ? (
                              <img src={s.avatar} alt={s.fullName} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" referrerPolicy="no-referrer" />
                            ) : (
                              <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-extrabold text-xs shadow-xs ${
                                s.status === 'trial' ? 'bg-blue-600' : s.status === 'reserved' ? 'bg-amber-600' : 'bg-emerald-700'
                              }`}>
                                {s.fullName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] border ${
                                  s.status === 'trial'
                                    ? 'bg-blue-100 text-blue-900 border-blue-200'
                                    : s.status === 'reserved'
                                    ? 'bg-amber-100 text-amber-900 border-amber-200'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                                }`}>
                                  {s.code}
                                </span>
                                <span className="font-extrabold text-slate-900">{s.fullName}</span>
                                <span className="text-[10px] text-slate-400">{age}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">{s.phone || 'Chưa có SĐT'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Môn & Lớp */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap gap-1">
                              {s.enrolledSubjects?.map(sub => (
                                <span key={sub} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                                  {sub}
                                </span>
                              ))}
                            </div>
                            {currentClass && (
                              <p className="text-[10px] text-slate-500 font-medium">{currentClass.name}</p>
                            )}
                          </div>
                        </td>

                        {/* Phụ huynh */}
                        <td className="py-3 px-3">
                          {s.guardianName ? (
                            <div>
                              <p className="font-bold text-slate-800 flex items-center gap-1">
                                <HeartHandshake className="w-3 h-3 text-amber-600" />
                                <span>{s.guardianName}</span>
                              </p>
                              <p className="text-[11px] text-slate-500">{s.guardianPhone}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Chưa liên kết</span>
                          )}
                        </td>

                        {/* Buổi học */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800">
                              {s.remainingLessons !== undefined ? `${s.remainingLessons}/${s.totalLessons || 24}` : `${s.totalLessons || 24}`} buổi
                            </span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{
                                  width: `${Math.min(100, (((s.completedLessons || 0) / (s.totalLessons || 24)) * 100))}%`
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Sao thưởng & Điểm đổi quà */}
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1 font-black text-amber-600 text-xs" title="Sao tích lũy Vinh Danh BXH (Bảo toàn trọn đời)">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>{s.totalStars ?? s.stars ?? 0} ⭐</span>
                              </div>
                              <button
                                onClick={() => setStarStudent(s)}
                                className="px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-[10px] font-bold border border-amber-200 cursor-pointer"
                                title="Tặng sao thưởng & điểm đổi quà"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1" title="Điểm khả dụng dùng để đổi quà trong kho">
                              <span>🎁 Ví: {s.rewardPoints ?? s.stars ?? 0} điểm</span>
                            </div>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3 px-3">
                          {s.status === 'active' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Đang học
                            </span>
                          )}
                          {s.status === 'trial' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 w-fit">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span>Học thử</span>
                            </span>
                          )}
                          {s.status === 'reserved' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 w-fit">
                              <PauseCircle className="w-3 h-3 text-amber-600" />
                              <span>Đang bảo lưu</span>
                            </span>
                          )}
                          {s.status === 'inactive' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">
                              Đã nghỉ
                            </span>
                          )}
                        </td>

                        {/* Hành động */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút đặc biệt 1: Chuyển chính thức nếu là học thử */}
                            {s.status === 'trial' && (
                              <button
                                onClick={() => handleOpenConvertTrial(s)}
                                className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-extrabold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                                title="Chuyển học viên học thử sang học chính thức"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Chuyển Chính Thức</span>
                              </button>
                            )}

                            {/* Nút đặc biệt 2: Bảo lưu nếu đang học */}
                            {s.status === 'active' && (
                              <button
                                onClick={() => handleOpenReserve(s)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                                title="Bảo lưu tài khoản học viên khi nghỉ tạm thời"
                              >
                                <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Bảo lưu</span>
                              </button>
                            )}

                            {/* Nút đặc biệt 3: Khôi phục nếu đang bảo lưu */}
                            {s.status === 'reserved' && (
                              <button
                                onClick={() => handleOpenReactivate(s)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                                title="Khôi phục trạng thái Đang học cho học viên"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Đi học lại</span>
                              </button>
                            )}

                            {/* Sửa / Xóa chuẩn */}
                            <button
                              onClick={() => handleOpenEdit(s)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                              title="Sửa học viên"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn xóa học viên ${s.fullName}?`)) {
                                  deleteStudent(s.id);
                                  showToast(`Đã xóa học viên ${s.fullName}`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Xóa học viên"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Lịch sử bảo lưu tài khoản */
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Sổ Theo Dõi & Lịch Sử Bảo Lưu Học Viên
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ dữ liệu ngày bắt đầu, ngày kết thúc và số buổi học bảo toàn cho học viên.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
              {reservations.length} Bản ghi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 px-3">Học Viên</th>
                  <th className="py-3 px-3">Môn & Lớp</th>
                  <th className="py-3 px-3">Thời Gian Bảo Lưu</th>
                  <th className="py-3 px-3">Số Buổi Bảo Toàn</th>
                  <th className="py-3 px-3">Lý Do</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      Chưa có hồ sơ bảo lưu nào
                    </td>
                  </tr>
                ) : (
                  reservations.map((r) => {
                    const st = students.find(s => s.id === r.studentId);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-extrabold text-slate-900">
                          {r.studentName} {st ? `(${st.code})` : ''}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {r.subjectName || r.className || 'Âm nhạc'}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{r.startDate} ➔ {r.endDate}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-extrabold text-emerald-700">
                          {r.sessionsRemaining || r.remainingLessonsHeld || 0} buổi
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs">
                          {r.reason}
                        </td>
                        <td className="py-3 px-3">
                          {r.status === 'active' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Đang bảo lưu
                            </span>
                          ) : r.status === 'ended' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Đã đi học lại
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Đã hủy
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {r.status === 'active' && (
                            <button
                              onClick={() => {
                                if (st) handleOpenReactivate(st);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-emerald-700"
                            >
                              Khôi phục học
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: BẢO LƯU TÀI KHOẢN HỌC VIÊN */}
      {/* ============================================================ */}
      {reserveModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <PauseCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Bảo Lưu Tài Khoản Học Viên
                </h3>
              </div>
              <button onClick={() => setReserveModalStudent(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReserve} className="py-4 space-y-3.5 text-xs">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-1">
                <p className="font-extrabold text-sm">
                  {reserveModalStudent.fullName} ({reserveModalStudent.code})
                </p>
                <p className="text-[11px] text-amber-800">
                  Số buổi học còn lại được bảo toàn: <strong>{reserveModalStudent.remainingLessons || 0} buổi</strong>
                </p>
                <p className="text-[11px] text-amber-800">
                  Số sao thưởng tích lũy giữ nguyên: <strong>{reserveModalStudent.stars || 0} ⭐</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu bảo lưu:</label>
                  <input
                    type="date"
                    required
                    value={reserveStartDate}
                    onChange={(e) => setReserveStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dự kiến đi học lại:</label>
                  <input
                    type="date"
                    required
                    value={reserveEndDate}
                    onChange={(e) => setReserveEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lý do bảo lưu (*):</label>
                <input
                  type="text"
                  required
                  value={reserveReason}
                  onChange={(e) => setReserveReason(e.target.value)}
                  placeholder="Ví dụ: Nghỉ hè về quê, bận ôn thi chuyển cấp, lý do sức khỏe..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú thêm:</label>
                <textarea
                  rows={2}
                  value={reserveNotes}
                  onChange={(e) => setReserveNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReserveModalStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Xác Nhận Bảo Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: KHÔI PHỤC ĐI HỌC LẠI */}
      {/* ============================================================ */}
      {reactivateModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Khôi Phục Học Tập
                </h3>
              </div>
              <button onClick={() => setReactivateModalStudent(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReactivate} className="py-4 space-y-3.5 text-xs">
              <p className="text-slate-700">
                Chào đón học viên <strong>{reactivateModalStudent.fullName} ({reactivateModalStudent.code})</strong> quay trở lại trung tâm.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xếp vào lớp học:</label>
                <select
                  value={reactivateClassId}
                  onChange={(e) => setReactivateClassId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.scheduleText || c.schedule} (GV: {c.teacherName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                Số buổi học tiếp tục: <strong>{reactivateModalStudent.remainingLessons || 0} buổi</strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReactivateModalStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Xác Nhận Đi Học Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CHUYỂN HỌC THỬ SANG CHÍNH THỨC */}
      {/* ============================================================ */}
      {convertModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Chuyển Sang Học Viên Chính Thức
                </h3>
              </div>
              <button onClick={() => setConvertModalStudent(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmConvert} className="py-4 space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 space-y-1">
                <p className="font-extrabold text-sm">
                  {convertModalStudent.fullName} (Mã học thử: {convertModalStudent.code})
                </p>
                <p className="text-[11px] text-blue-800">
                  Phụ huynh: {convertModalStudent.guardianName || '—'} • SĐT: {convertModalStudent.guardianPhone || convertModalStudent.phone || '—'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã HV chính thức mới (*):</label>
                  <input
                    type="text"
                    required
                    value={targetOfficialCode}
                    onChange={(e) => setTargetOfficialCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khóa học đăng ký (*):</label>
                  <select
                    value={targetCourseId}
                    onChange={(e) => {
                      setTargetCourseId(e.target.value);
                      const sel = courses.find(c => c.id === e.target.value);
                      if (sel) {
                        const f = typeof sel.fee === 'number' ? sel.fee : parseInt(String(sel.fee).replace(/\D/g, ''), 10) || 4800000;
                        setTargetTuition(f);
                        setTargetLessons(sel.totalLessons || 24);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lớp học xếp vào:</label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.scheduleText || c.schedule})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số buổi đào tạo:</label>
                  <input
                    type="number"
                    value={targetLessons}
                    onChange={(e) => setTargetLessons(parseInt(e.target.value, 10) || 24)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức học phí nhập học (VNĐ):</label>
                <input
                  type="number"
                  step={100000}
                  value={targetTuition}
                  onChange={(e) => setTargetTuition(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-amber-800 text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tự động sinh hóa đơn học phí với cú pháp chuẩn:</span>
                </p>
                <p className="font-mono font-bold bg-white p-1.5 rounded border border-emerald-300 text-slate-900">
                  {targetOfficialCode} - {convertModalStudent.enrolledSubjects?.[0] || 'Piano'} - Thang {new Date().getMonth() + 1}
                </p>
                <p className="text-emerald-700">Tặng ngay +20 ⭐ sao thưởng chào mừng học viên chính thức!</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConvertModalStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Xác Nhận Nhập Học Chính Thức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: TẠO TÀI KHOẢN HỌC THỬ (TRIAL ACCOUNT) */}
      {/* ============================================================ */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Tạo Tài Khoản Học Thử Mới
                </h3>
              </div>
              <button onClick={() => setIsTrialModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrialStudent} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ tên học viên (*):</label>
                <input
                  type="text"
                  required
                  value={trialName}
                  onChange={(e) => setTrialName(e.target.value)}
                  placeholder="Bé Hoàng Nam"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ tên Phụ huynh:</label>
                  <input
                    type="text"
                    value={trialGuardian}
                    onChange={(e) => setTrialGuardian(e.target.value)}
                    placeholder="Anh Hoàng"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ (*):</label>
                  <input
                    type="tel"
                    required
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Môn học thử (*):</label>
                  <select
                    value={trialSubject}
                    onChange={(e) => setTrialSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giáo viên phụ trách:</label>
                  <select
                    value={trialTeacherId}
                    onChange={(e) => setTrialTeacherId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày học thử:</label>
                  <input
                    type="date"
                    value={trialDate}
                    onChange={(e) => setTrialDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giờ học thử:</label>
                  <input
                    type="time"
                    value={trialTime}
                    onChange={(e) => setTrialTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú & Yêu cầu đặc biệt:</label>
                <textarea
                  rows={2}
                  value={trialNotes}
                  onChange={(e) => setTrialNotes(e.target.value)}
                  placeholder="Ghi chú đánh giá cảm thụ âm nhạc, kiểm tra năng khiếu..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTrialModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Tạo Tài Khoản Học Thử
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: THÊM / SỬA HỌC VIÊN CHUẨN */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                {editingStudent ? 'Sửa Thông Tin Học Viên' : 'Thêm Mới Học Viên Chính Thức'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã học viên (*):</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên (*):</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Minh Anh"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Ngày sinh (*):</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giới tính:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bộ môn đăng ký học:</label>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map(sub => {
                    const isSelected = selectedSubjects.includes(sub.name);
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => {
                          if (isSelected) setSelectedSubjects(selectedSubjects.filter(s => s !== sub.name));
                          else setSelectedSubjects([...selectedSubjects, sub.name]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lớp học ban đầu:</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="">-- Chưa gán lớp --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổng số buổi đăng ký:</label>
                  <input
                    type="number"
                    value={totalLessons}
                    onChange={(e) => setTotalLessons(parseInt(e.target.value, 10) || 24)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ tên Phụ huynh:</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Chị Lan"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại Phụ huynh:</label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {editingStudent ? 'Lưu Thay Đổi' : 'Tạo Học Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: TẶNG SAO THƯỞNG */}
      {starStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Tặng Sao Thưởng Cho Học Viên
                </h3>
              </div>
              <button onClick={() => setStarStudent(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-700">Học viên: <strong>{starStudent.fullName} ({starStudent.code})</strong></p>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <span>⭐ Sao Vinh Danh BXH:</span>
                  <span className="text-amber-700">{starStudent.totalStars ?? starStudent.stars ?? 0} ⭐</span>
                </p>
                <p className="font-bold flex items-center gap-1">
                  <span>🎁 Điểm Đổi Quà (Ví):</span>
                  <span className="text-rose-700">{starStudent.rewardPoints ?? starStudent.stars ?? 0} điểm</span>
                </p>
                <p className="text-[10px] text-slate-500 pt-1 border-t border-amber-200/60">
                  * Tặng sao sẽ đồng thời cộng thêm vào cả Sao Vinh Danh BXH và Điểm thưởng đổi quà.
                </p>
              </div>
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số sao thưởng:</label>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 10, 20].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setStarCount(cnt)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                        starCount === cnt ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      +{cnt} ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lý do thưởng:</label>
                <input
                  type="text"
                  value={starReason}
                  onChange={(e) => setStarReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setStarStudent(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
                Hủy
              </button>
              <button
                onClick={handleConfirmAwardStars}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Xác Nhận Tặng Sao</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
