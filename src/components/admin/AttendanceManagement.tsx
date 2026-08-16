import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AttendanceRecord, AttendanceStatus, MakeupSession, ReservationRequest } from '../../types';
import {
  CheckSquare,
  RefreshCw,
  Clock,
  Sparkles,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Users,
  School,
  FileText
} from 'lucide-react';

interface AttendanceManagementProps {
  initialSubTab?: 'attendance' | 'makeup' | 'reservations' | 'trial';
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ initialSubTab = 'attendance' }) => {
  const { 
    attendanceRecords, 
    markAttendance, 
    makeupSessions, 
    addMakeupSession, 
    updateMakeupStatus,
    reservationRequests,
    updateReservationStatus,
    students,
    classes,
    teachers
  } = useData();

  const [activeTab, setActiveTab] = useState<'attendance' | 'makeup' | 'reservations' | 'trial'>(initialSubTab);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Makeup session modal
  const [isMakeupModalOpen, setIsMakeupModalOpen] = useState<boolean>(false);
  const [makeupStudentId, setMakeupStudentId] = useState<string>(students[0]?.id || '');
  const [makeupTeacherId, setMakeupTeacherId] = useState<string>(teachers[0]?.id || '');
  const [makeupDate, setMakeupDate] = useState<string>('2025-03-20');
  const [makeupTime, setMakeupTime] = useState<string>('09:00 - 10:30');
  const [makeupRoom, setMakeupRoom] = useState<string>('Phòng Piano 01');
  const [makeupReason, setMakeupReason] = useState<string>('Bù buổi nghỉ ốm');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleSetStudentAttendance = (studentId: string, status: AttendanceStatus) => {
    markAttendance(selectedClassId, studentId, selectedDate, status, '');
    showToast('Đã lưu trạng thái điểm danh');
  };

  const handleSaveMakeup = () => {
    const student = students.find(s => s.id === makeupStudentId);
    const teacher = teachers.find(t => t.id === makeupTeacherId);

    addMakeupSession({
      studentId: makeupStudentId,
      studentName: student?.fullName || 'Học viên',
      originalDate: selectedDate,
      makeupDate,
      makeupTime,
      teacherId: makeupTeacherId,
      teacherName: teacher?.fullName || 'Giáo viên',
      room: makeupRoom,
      reason: makeupReason,
      status: 'scheduled'
    });

    setIsMakeupModalOpen(false);
    showToast('Đã xếp lịch học bù thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
              Điểm Danh, Học Bù & Bảo Lưu
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ghi nhận chuyên cần từng buổi học, xếp lịch học bù linh hoạt và xét duyệt đơn bảo lưu khóa học.
          </p>
        </div>

        {activeTab === 'makeup' && (
          <button
            onClick={() => setIsMakeupModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>XẾP LỊCH HỌC BÙ</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          <span>Điểm danh lớp</span>
        </button>

        <button
          onClick={() => setActiveTab('makeup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'makeup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-indigo-600" />
          <span>Lịch học bù ({makeupSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reservations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Đơn bảo lưu ({reservationRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'trial' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>Học viên học thử</span>
        </button>
      </div>

      {/* SUBTAB: ĐIỂM DANH */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Chọn Lớp Học:</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-800"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.subject} - GV: {c.teacherName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Ngày Điểm Danh:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Lớp: {selectedClass?.room} • {selectedClass?.schedule}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <th className="p-3">Mã & Học Viên</th>
                  <th className="p-3">Bộ Môn</th>
                  <th className="p-3">Trạng Thái Buổi Học</th>
                  <th className="p-3">Ghi Chú Tiến Độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const rec = attendanceRecords.find(r => r.studentId === st.id && r.date === selectedDate);
                  const currentStatus = rec ? rec.status : 'present';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                            {st.code}
                          </span>
                          <span className="font-bold text-slate-900">{st.fullName}</span>
                        </div>
                      </td>

                      <td className="p-3 text-slate-600">
                        {(st.enrolledSubjects || []).join(', ') || 'Âm nhạc'}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSetStudentAttendance(st.id, 'present')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ✓ Có mặt
                          </button>

                          <button
                            onClick={() => handleSetStudentAttendance(st.id, 'absent_excused')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'absent_excused'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Nghỉ phép (Bù)
                          </button>

                          <button
                            onClick={() => handleSetStudentAttendance(st.id, 'absent_unexcused')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'absent_unexcused'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Vắng không phép
                          </button>

                          <button
                            onClick={() => handleSetStudentAttendance(st.id, 'late')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'late'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Đến muộn
                          </button>
                        </div>
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Nhận xét buổi học..."
                          defaultValue={rec?.note || ''}
                          className="w-full text-xs p-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB: HỌC BÙ */}
      {activeTab === 'makeup' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <th className="p-3">Học Viên</th>
                  <th className="p-3">Ngày Nghỉ Gốc</th>
                  <th className="p-3">Lịch Học Bù</th>
                  <th className="p-3">Giáo Viên Phụ Trách</th>
                  <th className="p-3">Phòng Học</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {makeupSessions.length === 0 ? (
                  <tr><td colSpan={7} className="py-6 text-center text-slate-400">Không có lịch học bù nào</td></tr>
                ) : (
                  makeupSessions.map((mk) => (
                    <tr key={mk.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{mk.studentName}</td>
                      <td className="p-3 text-slate-500">{mk.originalDate}</td>
                      <td className="p-3">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {mk.makeupDate} ({mk.makeupTime})
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{mk.teacherName}</td>
                      <td className="p-3 text-slate-600">{mk.room}</td>
                      <td className="p-3">
                        {mk.status === 'completed' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Đã hoàn thành
                          </span>
                        ) : mk.status === 'scheduled' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            Đã lên lịch
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Đã hủy
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {mk.status === 'scheduled' && (
                          <button
                            onClick={() => {
                              updateMakeupStatus(mk.id, 'completed');
                              showToast('Đã hoàn tất buổi học bù');
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                          >
                            Xong
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB: BẢO LƯU */}
      {activeTab === 'reservations' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                  <th className="p-3">Học Viên</th>
                  <th className="p-3">Thời Gian Bảo Lưu</th>
                  <th className="p-3">Số Buổi Bảo Lưu</th>
                  <th className="p-3">Lý Do</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservationRequests.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">{res.studentName}</td>
                    <td className="p-3 text-slate-600">{res.startDate} → {res.endDate}</td>
                    <td className="p-3 font-bold text-amber-700">{res.sessionsRemaining} buổi</td>
                    <td className="p-3 text-slate-600 italic max-w-xs truncate">{res.reason}</td>
                    <td className="p-3">
                      {res.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Đã duyệt
                        </span>
                      ) : res.status === 'pending' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                          Chờ duyệt
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Từ chối
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {res.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              updateReservationStatus(res.id, 'approved');
                              showToast('Đã duyệt đơn bảo lưu');
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              updateReservationStatus(res.id, 'rejected');
                              showToast('Đã từ chối đơn bảo lưu');
                            }}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB: HỌC THỬ */}
      {activeTab === 'trial' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Danh Sách Học Thử Trải Nghiệm Nhạc Cụ Miễn Phí</h3>
          <p className="text-xs text-slate-500">Tiếp nhận đăng ký trải nghiệm 1 buổi miễn phí cho phụ huynh và học sinh mới.</p>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            Hiện có <strong>3 học viên trải nghiệm</strong> trong tuần này. Bộ phận tuyển sinh đã liên hệ sắp xếp phòng tập thử với giáo viên phụ trách.
          </div>
        </div>
      )}

      {/* MODAL: XẾP LỊCH HỌC BÙ */}
      {isMakeupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Xếp Lịch Học Bù Mới
              </h3>
              <button onClick={() => setIsMakeupModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn học viên cần học bù:</label>
                <select
                  value={makeupStudentId}
                  onChange={(e) => setMakeupStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giáo viên phụ trách dạy bù:</label>
                <select
                  value={makeupTeacherId}
                  onChange={(e) => setMakeupTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.fullName} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày học bù:</label>
                  <input
                    type="date"
                    value={makeupDate}
                    onChange={(e) => setMakeupDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khung giờ:</label>
                  <input
                    type="text"
                    value={makeupTime}
                    onChange={(e) => setMakeupTime(e.target.value)}
                    placeholder="09:00 - 10:30"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phòng học:</label>
                <input
                  type="text"
                  value={makeupRoom}
                  onChange={(e) => setMakeupRoom(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lý do:</label>
                <input
                  type="text"
                  value={makeupReason}
                  onChange={(e) => setMakeupReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsMakeupModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveMakeup}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Xác Nhận Xếp Lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
