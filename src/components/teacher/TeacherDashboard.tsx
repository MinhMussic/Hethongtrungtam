import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AttendanceStatus, Assignment, Submission } from '../../types';
import { UserProfileModal } from '../profile/UserProfileModal';
import { IndividualAssignmentModal } from '../gamification/IndividualAssignmentModal';
import { GradeSubmissionModal } from '../gamification/GradeSubmissionModal';
import {
  CalendarDays,
  School,
  CheckSquare,
  FileText,
  Clock,
  Music,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  Plus,
  Star,
  Gauge,
  Video,
  UserCheck
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    classes, 
    students, 
    assignments, 
    submissions, 
    markAttendance, 
    attendanceRecords, 
    makeupSessions, 
    getTodayBirthdays 
  } = useData();

  // Find classes taught by this teacher (or all classes for demo)
  const myClasses = classes || [];
  const [selectedClassId, setSelectedClassId] = useState<string>(myClasses[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Modals for individual assignments & grading
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedStudentForAssignment, setSelectedStudentForAssignment] = useState<string | undefined>(undefined);
  const [submissionToGrade, setSubmissionToGrade] = useState<Submission | null>(null);

  const todayBirthdays = getTodayBirthdays ? getTodayBirthdays() : [];
  const selectedClass = myClasses.find(c => c.id === selectedClassId) || myClasses[0] || {
    id: 'sample-class',
    code: 'LH001',
    name: 'Piano Cơ Bản 01',
    subject: 'Piano',
    room: 'Phòng 01 (Piano Upright)',
    scheduleText: 'Thứ 2 - Thứ 4 (17:30 - 19:00)',
    teacherId: 'GV001',
    teacherName: 'Thầy Hoàng Minh',
    studentIds: ['std-01', 'std-02', 'std-03'],
    maxStudents: 6,
    currentStudents: 3,
    status: 'active' as const
  };
  const todayDate = new Date().toISOString().split('T')[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAttendance = (studentId: string, status: AttendanceStatus) => {
    markAttendance({
      studentId,
      classId: selectedClass.id,
      date: todayDate,
      status,
      sessionNumber: 4,
      markedBy: currentUser?.displayName || 'Giáo viên'
    });
    showToast(`Đã ghi nhận điểm danh: ${status}`);
  };

  const handleOpenAssignModalForStudent = (studentId?: string) => {
    setSelectedStudentForAssignment(studentId);
    setIsAssignmentModalOpen(true);
  };

  // Get class students
  const classStudents = students.filter(s => selectedClass.studentIds?.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase">
            CỔNG GIẢNG VIÊN • MINH MUSIC
          </span>
          <h1 className="text-2xl font-black mt-2 font-heading">
            Xin chào, {currentUser?.displayName || 'Thầy/Cô'}!
          </h1>
          <p className="text-blue-100 text-xs mt-1">
            Điểm danh trực tiếp, giao bài tập cá nhân hóa 1-1 theo trình độ và chấm video thực hành của từng học viên.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleOpenAssignModalForStudent(classStudents[0]?.id)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Giao Bài Theo Học Viên</span>
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl border border-white/30 text-white transition-all cursor-pointer flex flex-col items-center gap-1 text-xs font-bold"
            title="Xem hồ sơ & đổi mật khẩu"
          >
            <UserCheck className="w-5 h-5" />
            <span>Hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-700 text-xs">Lớp đang giảng dạy:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-900"
          >
            {myClasses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.subject}) - {c.scheduleText}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
          <span>Phòng: <strong className="text-slate-800">{selectedClass.room || 'Phòng 01'}</strong></span>
          <span>Sĩ số: <strong className="text-blue-700">{classStudents.length} học viên</strong></span>
        </div>
      </div>

      {/* Main Grid: 2 Cols Left (Students & Individual Tasks), 1 Col Right (Submissions to Grade & Makeup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Danh Sách Học Viên Trong Lớp & Điểm Danh / Giao Bài Cá Nhân */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Học Viên Trong Lớp ({classStudents.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">Hôm nay: {todayDate}</span>
            </div>

            <div className="space-y-3">
              {classStudents.map((st) => {
                const rec = attendanceRecords?.find(
                  r => r.studentId === st.id && r.classId === selectedClass.id && r.date === todayDate
                );
                const currentStatus = rec?.status;

                // Find active assignments for this specific student
                const studentAssignments = assignments.filter(
                  a => a.studentId === st.id || a.targetStudentIds?.includes(st.id)
                );

                return (
                  <div 
                    key={st.id} 
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={st.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-amber-300 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm">{st.fullName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                              {st.level || 'Cơ bản'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            ⭐ {st.totalStars ?? st.stars ?? 0} Sao BXH • 🎁 {st.rewardPoints ?? 0} đ thưởng • {st.phone || '0901234567'}
                          </p>
                        </div>
                      </div>

                      {/* Attendance Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleMarkAttendance(st.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'present' 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                          }`}
                        >
                          Có mặt
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(st.id, 'absent_excused')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'absent_excused' 
                              ? 'bg-amber-500 text-white shadow-xs' 
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
                          }`}
                        >
                          Nghỉ phép
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(st.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'late' 
                              ? 'bg-purple-600 text-white shadow-xs' 
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-purple-50'
                          }`}
                        >
                          Muộn
                        </button>
                        <button
                          onClick={() => handleOpenAssignModalForStudent(st.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer flex items-center gap-1"
                          title="Giao bài tập riêng cho học viên này"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Giao bài riêng</span>
                        </button>
                      </div>
                    </div>

                    {/* Assigned Tasks for this specific student */}
                    {studentAssignments.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-200/70 space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Music className="w-3 h-3 text-blue-600" /> Bài tập riêng đã giao cho {st.fullName}:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {studentAssignments.map(asg => (
                            <div key={asg.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                              <p className="font-bold text-slate-900 truncate">{asg.title}</p>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                                <span>{asg.targetBpm ? `${asg.targetBpm} BPM` : 'Hạn: ' + asg.dueDate}</span>
                                <span className="text-amber-600 font-bold">+{asg.bonusStars || 5} ⭐</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Bài Tập & Video Cần Chấm + Lịch Dạy Bù */}
        <div className="space-y-4">
          {/* Submissions & Tasks to Grade */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                Bài Tập Cần Chấm & Nhận Xét
              </h3>
              <span className="text-xs font-bold text-blue-600">{submissions.length} bài</span>
            </div>
            
            <div className="space-y-2.5">
              {submissions.map(sub => {
                const asg = assignments.find(a => a.id === sub.assignmentId);
                return (
                  <div key={sub.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{sub.studentName || 'Học viên'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        sub.status === 'graded' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status === 'graded' ? 'Đã chấm' : 'Chờ chấm'}
                      </span>
                    </div>

                    <p className="text-slate-700 font-semibold truncate">
                      {asg?.title || 'Bài tập thực hành'}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Nộp: {sub.submittedAt}</span>
                      <button
                        onClick={() => setSubmissionToGrade(sub)}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>{sub.status === 'graded' ? 'Xem lại' : 'Chấm ngay'} →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Makeup Sessions */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Lịch Dạy Bù Sắp Tới
              </h3>
            </div>

            <div className="space-y-2">
              {makeupSessions.map(mk => (
                <div key={mk.id} className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs">
                  <div className="flex justify-between font-bold text-indigo-950">
                    <span>{mk.studentName}</span>
                    <span className="text-indigo-600">{mk.makeupDate}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">Giờ: {mk.makeupTime} • {mk.room}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Giao Bài Tập Cá Nhân Modal */}
      <IndividualAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        defaultStudentId={selectedStudentForAssignment}
      />

      {/* Chấm Điểm & Nhận Xét Modal */}
      {submissionToGrade && (
        <GradeSubmissionModal
          isOpen={!!submissionToGrade}
          onClose={() => setSubmissionToGrade(null)}
          submission={submissionToGrade}
          assignment={assignments.find(a => a.id === submissionToGrade.assignmentId)}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};
