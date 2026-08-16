import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Teacher,
  Guardian,
  StudentGuardianLink,
  Subject,
  Course,
  ClassItem,
  ClassTeacher,
  ClassTeacherRole,
  AttendanceRecord,
  AttendanceStatus,
  TuitionPayment,
  BirthdayItem,
  BirthdayTemplate,
  Assignment,
  Submission,
  RewardItem,
  NotificationItem,
  MakeupRequest,
  ReservationRecord,
  TrialLesson,
  StarLeaderboardItem,
  TenantBranding,
  TenantBranch,
  BankAccountConfig,
  RegistrationRequest,
  ScheduleChangeRequest,
  PaymentSubmission,
  UserAccount,
  UserRole
} from '../types';
import {
  initialStudents,
  initialTeachers,
  initialGuardians,
  initialStudentGuardianLinks,
  initialSubjects,
  initialCourses,
  initialClasses,
  initialTuitionPayments,
  initialBirthdayTemplates,
  initialAssignments,
  initialSubmissions,
  initialRewards,
  initialNotifications,
  initialBranding,
  initialBranches,
  initialReservations,
  initialTrialLessons,
  initialRegistrationRequests,
  initialScheduleChangeRequests,
  initialPaymentSubmissions
} from '../data/initialData';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  guardians: Guardian[];
  studentGuardianLinks: StudentGuardianLink[];
  subjects: Subject[];
  courses: Course[];
  classes: ClassItem[];
  attendance: AttendanceRecord[];
  attendanceRecords: AttendanceRecord[];
  tuitionPayments: TuitionPayment[];
  birthdayTemplates: BirthdayTemplate[];
  assignments: Assignment[];
  submissions: Submission[];
  rewards: RewardItem[];
  notifications: NotificationItem[];
  makeupRequests: MakeupRequest[];
  makeupSessions: MakeupRequest[];
  reservations: ReservationRecord[];
  reservationRequests: ReservationRecord[];
  trialLessons: TrialLesson[];
  registrationRequests: RegistrationRequest[];
  scheduleChangeRequests: ScheduleChangeRequest[];
  paymentSubmissions: PaymentSubmission[];
  starLeaderboard: StarLeaderboardItem[];
  branding: TenantBranding;
  branches: TenantBranch[];
  activeBranchId: string;

  // Multi-Teacher Class Assignment (Many-to-Many)
  assignTeacherToClass: (
    classId: string,
    teacherId: string,
    roleInClass: ClassTeacherRole,
    subjects?: string[],
    startDate?: string,
    endDate?: string
  ) => { success: boolean; conflictWarning?: string; error?: string };
  removeTeacherFromClass: (classId: string, teacherId: string) => void;
  updateTeacherInClass: (classId: string, teacherId: string, updates: Partial<ClassTeacher>) => void;

  // Student-Guardian Link Scoping
  addStudentGuardianLink: (link: Omit<StudentGuardianLink, 'id' | 'createdAt'>) => void;
  updateStudentGuardianLink: (id: string, updates: Partial<StudentGuardianLink>) => void;
  deleteStudentGuardianLink: (id: string) => void;

  // User Requests Workflow (Student & Parent requests -> Pending -> Admin approval)
  submitRegistrationRequest: (req: Omit<RegistrationRequest, 'id' | 'requestedDate' | 'status'>) => void;
  approveRegistrationRequest: (requestId: string, adminNote?: string) => void;
  rejectRegistrationRequest: (requestId: string, reason?: string) => void;

  submitScheduleChangeRequest: (req: Omit<ScheduleChangeRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveScheduleChangeRequest: (requestId: string, adminResponse?: string) => void;
  rejectScheduleChangeRequest: (requestId: string, reason?: string) => void;

  submitPaymentReceipt: (sub: Omit<PaymentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  approvePaymentSubmission: (submissionId: string) => void;
  rejectPaymentSubmission: (submissionId: string) => void;

  // Scoped Data Retriever
  getScopedDataForUser: (user: UserAccount | null, activeRole: UserRole) => {
    scopedClasses: ClassItem[];
    scopedStudents: Student[];
    scopedTeachers: Teacher[];
    scopedAssignments: Assignment[];
    scopedSubmissions: Submission[];
    scopedAttendance: AttendanceRecord[];
    scopedTuition: TuitionPayment[];
    scopedMakeupRequests: MakeupRequest[];
    scopedGuardianLinks: StudentGuardianLink[];
    activeGuardianPermissions?: Record<string, StudentGuardianLink>;
  };

  // Branding & Multi-tenant & Bank
  updateBranding: (updates: Partial<TenantBranding>) => void;
  resetBranding: () => void;
  updateBankAccount: (config: Partial<BankAccountConfig>) => void;
  setActiveBranchId: (id: string) => void;
  addBranch: (branch: Omit<TenantBranch, 'id'>) => void;
  updateBranch: (id: string, updates: Partial<TenantBranch>) => void;
  deleteBranch: (id: string) => void;

  // Birthday Helpers
  getAllBirthdays: () => BirthdayItem[];
  getTodayBirthdays: () => BirthdayItem[];
  getTomorrowBirthdays: () => BirthdayItem[];
  get7DaysBirthdays: () => BirthdayItem[];
  getMonthBirthdays: (month?: number) => BirthdayItem[];
  sendBirthdayWish: (item: BirthdayItem, messageText?: string) => Promise<{ success: boolean; message: string }>;

  // Guardians (Phụ huynh & Người giám hộ) CRUD
  addGuardian: (guardian: Omit<Guardian, 'id' | 'createdAt'>) => void;
  updateGuardian: (id: string, updates: Partial<Guardian>) => void;
  deleteGuardian: (id: string) => void;
  linkGuardianToStudent: (guardianId: string, studentId: string) => void;

  // Students CRUD & Status Operations (Bảo lưu & Học thử)
  addStudent: (student: Omit<Student, 'id' | 'joinDate' | 'stars' | 'completedLessons'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  awardStars: (studentId: string, amount: number, reason?: string) => void;
  reserveStudentAccount: (studentId: string, startDate: string, endDate: string, reason: string, notes?: string) => void;
  reactivateStudentAccount: (studentId: string, targetClassId?: string) => void;
  convertTrialToOfficial: (
    trialStudentId: string,
    targetCourseId: string,
    targetClassId: string,
    totalLessons?: number,
    tuitionAmount?: number,
    officialCode?: string
  ) => { success: boolean; student?: Student; error?: string };

  // Teachers CRUD
  addTeacher: (teacher: Omit<Teacher, 'id' | 'joinDate'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Courses & Classes CRUD
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addClass: (cls: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;

  // Attendance
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  batchRecordAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  markAttendance: (classId: string, studentId: string, date: string, status: AttendanceStatus, note?: string, evaluation?: string, starsAwarded?: number) => void;

  // Tuition & QR Code Generation
  addTuitionPayment: (payment: Omit<TuitionPayment, 'id'>) => void;
  updateTuitionStatus: (id: string, status: 'paid' | 'pending' | 'overdue' | 'completed', paidAmount?: number) => void;
  updatePaymentStatus: (id: string, status: 'paid' | 'pending' | 'overdue' | 'completed', paidAmount?: number) => void;
  formatTransferContent: (studentCodeOrName: string, subjectName: string, billingMonth: string) => string;
  generateQrUrlForPayment: (payment: Partial<TuitionPayment>, customAmount?: number, customMemo?: string) => string;

  // Birthday Templates
  addBirthdayTemplate: (tpl: Omit<BirthdayTemplate, 'id'>) => void;
  updateBirthdayTemplate: (id: string, updates: Partial<BirthdayTemplate>) => void;
  deleteBirthdayTemplate: (id: string) => void;

  // Assignments & Rewards
  addAssignment: (asn: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (sub: Omit<Submission, 'id' | 'submittedAt'>) => void;
  gradeSubmission: (
    submissionId: string,
    gradeData: {
      grade: string;
      score?: number;
      teacherFeedback: string;
      starsAwarded: number;
      rewardPointsAwarded: number;
    }
  ) => void;
  redeemReward: (studentId: string, rewardId: string) => { success: boolean; error?: string };
  addReward: (reward: Omit<RewardItem, 'id'>) => void;
  updateReward: (id: string, updates: Partial<RewardItem>) => void;
  deleteReward: (id: string) => void;

  // Notifications
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;

  // Makeup & Reservations & Trial Lessons
  requestMakeup: (req: Omit<MakeupRequest, 'id' | 'createdAt' | 'status'>) => void;
  addMakeupSession: (req: Omit<MakeupRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateMakeupStatus: (id: string, status: 'approved' | 'rejected' | 'completed') => void;
  requestReservation: (req: Omit<ReservationRecord, 'id' | 'createdAt' | 'status'>) => void;
  addReservationRequest: (req: Omit<ReservationRecord, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (id: string, status: 'approved' | 'ended' | 'rejected' | 'active') => void;
  cancelReservation: (id: string) => void;
  addTrialLesson: (trial: Omit<TrialLesson, 'id' | 'createdAt'>) => void;
  updateTrialLesson: (id: string, updates: Partial<TrialLesson>) => void;
  deleteTrialLesson: (id: string) => void;

  // Reset to initial seed
  resetDataToDefault: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PREFIX = 'minhmusic_data_';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadInitial = <T,>(key: string, fallback: T): T => {
    const item = localStorage.getItem(PREFIX + key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`Error parsing ${key}`, e);
      }
    }
    return fallback;
  };

  const [students, setStudents] = useState<Student[]>(() => {
    const loaded = loadInitial('students', initialStudents);
    return (loaded || []).map(s => ({
      ...s,
      totalStars: s.totalStars !== undefined ? s.totalStars : (s.stars || 0),
      rewardPoints: s.rewardPoints !== undefined ? s.rewardPoints : (s.stars || 0),
      stars: s.totalStars !== undefined ? s.totalStars : (s.stars || 0)
    }));
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadInitial('teachers', initialTeachers));
  const [guardians, setGuardians] = useState<Guardian[]>(() => loadInitial('guardians', initialGuardians));
  const [studentGuardianLinks, setStudentGuardianLinks] = useState<StudentGuardianLink[]>(() => loadInitial('student_guardian_links', initialStudentGuardianLinks));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadInitial('subjects', initialSubjects));
  const [courses, setCourses] = useState<Course[]>(() => loadInitial('courses', initialCourses));
  const [classes, setClasses] = useState<ClassItem[]>(() => loadInitial('classes', initialClasses));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadInitial('attendance', []));
  const [tuitionPayments, setTuitionPayments] = useState<TuitionPayment[]>(() => loadInitial('tuition', initialTuitionPayments));
  const [birthdayTemplates, setBirthdayTemplates] = useState<BirthdayTemplate[]>(() => loadInitial('bdt_templates', initialBirthdayTemplates));
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const loaded = loadInitial('assignments', initialAssignments);
    if (!loaded || !Array.isArray(loaded) || loaded.length === 0) return initialAssignments;
    return loaded;
  });
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const loaded = loadInitial('submissions', initialSubmissions);
    if (!loaded || !Array.isArray(loaded) || loaded.length === 0) return initialSubmissions;
    return loaded;
  });
  const [rewards, setRewards] = useState<RewardItem[]>(() => loadInitial('rewards', initialRewards));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', initialNotifications));
  const [makeupRequests, setMakeupRequests] = useState<MakeupRequest[]>(() => loadInitial('makeup_reqs', []));
  const [reservations, setReservations] = useState<ReservationRecord[]>(() => loadInitial('reservations', initialReservations));
  const [trialLessons, setTrialLessons] = useState<TrialLesson[]>(() => loadInitial('trials', initialTrialLessons));
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(() => loadInitial('reg_requests', initialRegistrationRequests));
  const [scheduleChangeRequests, setScheduleChangeRequests] = useState<ScheduleChangeRequest[]>(() => loadInitial('sch_change_reqs', initialScheduleChangeRequests));
  const [paymentSubmissions, setPaymentSubmissions] = useState<PaymentSubmission[]>(() => loadInitial('payment_submissions', initialPaymentSubmissions));
  const [branding, setBranding] = useState<TenantBranding>(() => loadInitial('branding', initialBranding));
  const [branches, setBranches] = useState<TenantBranch[]>(() => {
    const loaded = loadInitial('branches', initialBranches);
    if (!loaded || !Array.isArray(loaded) || loaded.length === 0) return initialBranches;
    // Merge any missing fields like googleMapsUrl from initialBranches
    return loaded.map(b => {
      const def = initialBranches.find(ib => ib.id === b.id);
      return {
        ...def,
        ...b,
        googleMapsUrl: b.googleMapsUrl || def?.googleMapsUrl || 'https://maps.app.goo.gl/cCs2t8VuaE9JBNMD9?g_st=ac'
      };
    });
  });
  const [activeBranchId, setActiveBranchId] = useState<string>(() => loadInitial('active_branch_id', initialBranches[0]?.id || 'branch-01'));

  // Sync to local storage
  useEffect(() => { localStorage.setItem(PREFIX + 'students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(PREFIX + 'teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem(PREFIX + 'guardians', JSON.stringify(guardians)); }, [guardians]);
  useEffect(() => { localStorage.setItem(PREFIX + 'student_guardian_links', JSON.stringify(studentGuardianLinks)); }, [studentGuardianLinks]);
  useEffect(() => { localStorage.setItem(PREFIX + 'subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem(PREFIX + 'courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem(PREFIX + 'classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem(PREFIX + 'attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem(PREFIX + 'tuition', JSON.stringify(tuitionPayments)); }, [tuitionPayments]);
  useEffect(() => { localStorage.setItem(PREFIX + 'bdt_templates', JSON.stringify(birthdayTemplates)); }, [birthdayTemplates]);
  useEffect(() => { localStorage.setItem(PREFIX + 'assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem(PREFIX + 'submissions', JSON.stringify(submissions)); }, [submissions]);
  useEffect(() => { localStorage.setItem(PREFIX + 'rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem(PREFIX + 'notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(PREFIX + 'reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem(PREFIX + 'trials', JSON.stringify(trialLessons)); }, [trialLessons]);
  useEffect(() => { localStorage.setItem(PREFIX + 'reg_requests', JSON.stringify(registrationRequests)); }, [registrationRequests]);
  useEffect(() => { localStorage.setItem(PREFIX + 'sch_change_reqs', JSON.stringify(scheduleChangeRequests)); }, [scheduleChangeRequests]);
  useEffect(() => { localStorage.setItem(PREFIX + 'payment_submissions', JSON.stringify(paymentSubmissions)); }, [paymentSubmissions]);
  useEffect(() => { localStorage.setItem(PREFIX + 'branding', JSON.stringify(branding)); }, [branding]);
  useEffect(() => { localStorage.setItem(PREFIX + 'branches', JSON.stringify(branches)); }, [branches]);
  useEffect(() => { localStorage.setItem(PREFIX + 'active_branch_id', JSON.stringify(activeBranchId)); }, [activeBranchId]);

  // Birthday calculation engine
  const calculateBirthdayInfo = (
    id: string,
    name: string,
    role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'GUARDIAN',
    birthDateStr: string,
    phone?: string,
    avatar?: string,
    classNameOrSubject?: string
  ): BirthdayItem | null => {
    if (!birthDateStr) return null;
    const parts = birthDateStr.split('-');
    if (parts.length < 3) return null;
    const bMonth = parseInt(parts[1], 10);
    const bDay = parseInt(parts[2], 10);
    const bYear = parseInt(parts[0], 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    const currentDay = now.getDate();

    // Birthday this year
    let nextBday = new Date(currentYear, bMonth - 1, bDay);
    const todayZero = new Date(currentYear, currentMonth - 1, currentDay);
    
    // Difference in days
    const diffTime = nextBday.getTime() - todayZero.getTime();
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // Birthday already passed this year, calculate for next year
      nextBday = new Date(currentYear + 1, bMonth - 1, bDay);
      diffDays = Math.ceil((nextBday.getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24));
    }

    let category: 'today' | 'tomorrow' | '7days' | 'this_month' = 'this_month';
    if (diffDays === 0) {
      category = 'today';
    } else if (diffDays === 1) {
      category = 'tomorrow';
    } else if (diffDays <= 7) {
      category = '7days';
    } else if (bMonth === currentMonth) {
      category = 'this_month';
    }

    const turningAge = (currentYear - bYear) + (diffDays < 0 ? 1 : 0);

    return {
      id,
      name,
      role,
      birthDate: birthDateStr,
      age: turningAge > 0 ? turningAge : 0,
      phone,
      avatar,
      classNameOrSubject,
      daysUntilBirthday: diffDays,
      category
    };
  };

  const getAllBirthdays = (): BirthdayItem[] => {
    const list: BirthdayItem[] = [];
    
    // Students
    (students || []).forEach(s => {
      const cls = (classes || []).find(c => s.enrolledClassIds?.includes(c.id));
      const subjText = (s.enrolledSubjects || []).join(', ') || 'Âm nhạc';
      const info = calculateBirthdayInfo(
        s.id, 
        s.fullName, 
        'STUDENT', 
        s.birthDate, 
        s.phone, 
        s.avatar, 
        cls ? `${subjText} • ${cls.name}` : subjText
      );
      if (info) list.push(info);
    });

    // Teachers
    (teachers || []).forEach(t => {
      const specsText = (t.specialties || []).join(', ') || 'Giáo viên';
      const info = calculateBirthdayInfo(
        t.id, 
        t.fullName, 
        'TEACHER', 
        t.birthDate, 
        t.phone, 
        t.avatar, 
        `Giảng viên ${specsText}`
      );
      if (info) list.push(info);
    });

    // Sort by days until birthday
    return list.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
  };

  const getTodayBirthdays = (): BirthdayItem[] => {
    return getAllBirthdays().filter(b => b.category === 'today' || b.daysUntilBirthday === 0);
  };

  const getTomorrowBirthdays = (): BirthdayItem[] => {
    return getAllBirthdays().filter(b => b.daysUntilBirthday === 1);
  };

  const get7DaysBirthdays = (): BirthdayItem[] => {
    return getAllBirthdays().filter(b => b.daysUntilBirthday >= 0 && b.daysUntilBirthday <= 7);
  };

  const getMonthBirthdays = (month?: number): BirthdayItem[] => {
    const targetMonth = month || (new Date().getMonth() + 1);
    return getAllBirthdays().filter(b => {
      const parts = b.birthDate.split('-');
      return parseInt(parts[1], 10) === targetMonth;
    });
  };

  const sendBirthdayWish = async (item: BirthdayItem, messageText?: string): Promise<{ success: boolean; message: string }> => {
    // Fire festive confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }

    const defaultMsg = `Chúc mừng sinh nhật ${item.name}! Chúc bạn thêm một tuổi mới luôn tràn đầy cảm hứng âm nhạc và hạnh phúc! 🎂🎶✨`;
    const finalMsg = messageText || defaultMsg;

    // Add targeted birthday congratulation notification
    const targetRoles: UserRole[] = item.role === 'STUDENT' 
      ? ['STUDENT', 'PARENT', 'ADMIN', 'TEACHER'] 
      : [item.role, 'ADMIN', 'TEACHER'];

    const newNotif: NotificationItem = {
      id: 'notif-bday-' + Date.now(),
      title: `🎉 Chúc mừng sinh nhật ${item.name}! 🎂`,
      content: finalMsg,
      type: 'birthday',
      targetRoles,
      recipientId: item.id,
      createdAt: 'Vừa xong',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return {
      success: true,
      message: `Đã tạo thiệp và gửi lời chúc mừng sinh nhật thành công tới ${item.name}!`
    };
  };

  // Guardian CRUD
  const addGuardian = (guardianData: Omit<Guardian, 'id' | 'createdAt'>) => {
    const code = `PH${String(guardians.length + 1).padStart(3, '0')}`;
    const newGuardian: Guardian = {
      ...guardianData,
      id: 'grd-' + Date.now(),
      code: guardianData.code || code,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGuardians(prev => [newGuardian, ...prev]);
  };

  const updateGuardian = (id: string, updates: Partial<Guardian>) => {
    setGuardians(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGuardian = (id: string) => {
    setGuardians(prev => prev.filter(g => g.id !== id));
  };

  const linkGuardianToStudent = (guardianId: string, studentId: string) => {
    setGuardians(prev => prev.map(g => {
      if (g.id === guardianId && !g.linkedStudentIds.includes(studentId)) {
        return { ...g, linkedStudentIds: [...g.linkedStudentIds, studentId] };
      }
      return g;
    }));

    setStudents(prev => prev.map(s => {
      if (s.id === studentId && !s.linkedGuardianIds?.includes(guardianId)) {
        return { ...s, linkedGuardianIds: [...(s.linkedGuardianIds || []), guardianId] };
      }
      return s;
    }));
  };

  // Students CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'joinDate' | 'stars' | 'completedLessons'>) => {
    const code = `HV${String(students.length + 1).padStart(3, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: 'stu-' + Date.now(),
      code: studentData.code || code,
      completedLessons: 0,
      stars: 20, // Welcome star bonus
      totalStars: 20, // Điểm sao vinh danh tích lũy BXH
      rewardPoints: 20, // Điểm thưởng đổi quà khả dụng
      joinDate: new Date().toISOString().split('T')[0]
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const awardStars = (studentId: string, amount: number, _reason?: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentTotal = s.totalStars !== undefined ? s.totalStars : (s.stars || 0);
        const currentReward = s.rewardPoints !== undefined ? s.rewardPoints : (s.stars || 0);
        const newTotal = Math.max(0, currentTotal + amount);
        const newReward = Math.max(0, currentReward + amount);
        return {
          ...s,
          stars: newTotal,
          totalStars: newTotal,
          rewardPoints: newReward
        };
      }
      return s;
    }));
  };

  // Teachers CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'joinDate'>) => {
    const code = `GV${String(teachers.length + 1).padStart(3, '0')}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: 'tch-' + Date.now(),
      code: teacherData.code || code,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Subjects & Courses & Classes
  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSub: Subject = {
      ...subjectData,
      id: 'sub-' + Date.now()
    };
    setSubjects(prev => [...prev, newSub]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCrs: Course = {
      ...courseData,
      id: 'crs-' + Date.now()
    };
    setCourses(prev => [...prev, newCrs]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const addClass = (classData: Omit<ClassItem, 'id'>) => {
    const newCls: ClassItem = {
      ...classData,
      id: 'cls-' + Date.now()
    };
    setClasses(prev => [...prev, newCls]);
  };

  const updateClass = (id: string, updates: Partial<ClassItem>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Student reservation (Bảo lưu tài khoản)
  const reserveStudentAccount = (
    studentId: string,
    startDate: string,
    endDate: string,
    reason: string,
    notes?: string
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const firstClass = classes.find(c => student.enrolledClassIds?.includes(c.id));

    // Update student status
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status: 'reserved',
          notes: notes ? `${s.notes ? s.notes + ' | ' : ''}Bảo lưu từ ${startDate} đến ${endDate}: ${reason}` : s.notes
        };
      }
      return s;
    }));

    // Create reservation record
    const newReservation: ReservationRecord = {
      id: `res-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      classId: firstClass?.id,
      className: firstClass?.name,
      subjectName: student.enrolledSubjects?.join(', ') || 'Âm nhạc',
      startDate,
      endDate,
      sessionsRemaining: student.remainingLessons || 0,
      remainingLessonsHeld: student.remainingLessons || 0,
      reason,
      status: 'active',
      approvedDate: new Date().toISOString().split('T')[0],
      notes: notes || `Bảo toàn ${student.remainingLessons || 0} buổi học và ${student.stars || 0} sao.`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReservations(prev => [newReservation, ...prev]);

    // Send notification
    addNotification({
      title: '⏸️ Xác nhận bảo lưu học viên',
      content: `Học viên ${student.fullName} (${student.code}) đã được bảo lưu từ ${startDate} đến ${endDate}. Bảo toàn ${student.remainingLessons || 0} buổi học.`,
      type: 'system',
      targetRoles: ['ADMIN', 'TEACHER', 'PARENT']
    });
  };

  // Reactivate student account (Khôi phục học viên đi học lại)
  const reactivateStudentAccount = (studentId: string, targetClassId?: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        let updatedClasses = s.enrolledClassIds || [];
        if (targetClassId && !updatedClasses.includes(targetClassId)) {
          updatedClasses = [...updatedClasses, targetClassId];
        }
        return {
          ...s,
          status: 'active',
          enrolledClassIds: updatedClasses
        };
      }
      return s;
    }));

    // Mark current active reservations for this student as ended
    setReservations(prev => prev.map(r => {
      if (r.studentId === studentId && (r.status === 'active' || r.status === 'pending')) {
        return { ...r, status: 'ended' };
      }
      return r;
    }));

    addNotification({
      title: '🎉 Chào mừng học viên quay trở lại học tập!',
      content: `Học viên ${student.fullName} (${student.code}) đã khôi phục trạng thái Đang học. Chúc em có những giờ học âm nhạc tuyệt vời!`,
      type: 'system',
      targetRoles: ['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']
    });
  };

  // Convert Trial to Official Student (Chuyển học viên học thử sang chính thức)
  const convertTrialToOfficial = (
    trialStudentId: string,
    targetCourseId: string,
    targetClassId: string,
    totalLessons: number = 24,
    tuitionAmount: number = 4800000,
    customOfficialCode?: string
  ): { success: boolean; student?: Student; error?: string } => {
    const student = students.find(s => s.id === trialStudentId);
    if (!student) {
      return { success: false, error: 'Không tìm thấy học viên học thử.' };
    }

    const course = courses.find(c => c.id === targetCourseId);
    const cls = classes.find(c => c.id === targetClassId);

    // Generate next official student code if not provided
    let newCode = customOfficialCode;
    if (!newCode || newCode.startsWith('HT')) {
      const existingOfficialNums = students
        .filter(s => s.code && s.code.startsWith('HV'))
        .map(s => parseInt(s.code.replace('HV', ''), 10))
        .filter(n => !isNaN(n));
      const maxNum = existingOfficialNums.length > 0 ? Math.max(...existingOfficialNums) : 6;
      newCode = `HV${String(maxNum + 1).padStart(3, '0')}`;
    }

    const currentMonth = `Tháng ${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`;
    const subjectName = course?.subject || (course?.subjectId ? subjects.find(s => s.id === course.subjectId)?.name : '') || student.enrolledSubjects?.[0] || 'Âm nhạc';

    // Update student
    const currentStars = student.totalStars !== undefined ? student.totalStars : (student.stars || 0);
    const currentRewards = student.rewardPoints !== undefined ? student.rewardPoints : (student.stars || 0);
    const updatedStudent: Student = {
      ...student,
      code: newCode,
      status: 'active',
      enrolledSubjects: [subjectName],
      enrolledClassIds: targetClassId ? [targetClassId] : [],
      totalLessons: totalLessons || 24,
      completedLessons: 0,
      remainingLessons: totalLessons || 24,
      stars: currentStars + 20, // +20 welcome stars!
      totalStars: currentStars + 20,
      rewardPoints: currentRewards + 20,
      notes: `${student.notes ? student.notes + ' | ' : ''}Chính thức nhập học khóa ${course?.name || 'mới'} ngày ${new Date().toLocaleDateString('vi-VN')}`
    };

    setStudents(prev => prev.map(s => s.id === trialStudentId ? updatedStudent : s));

    // Update class studentIds if class selected
    if (targetClassId) {
      setClasses(prev => prev.map(c => {
        if (c.id === targetClassId) {
          const sIds = c.studentIds || [];
          if (!sIds.includes(trialStudentId)) {
            return { ...c, studentIds: [...sIds, trialStudentId], currentStudents: (c.currentStudents || 0) + 1 };
          }
        }
        return c;
      }));
    }

    // Mark trial lessons as converted
    setTrialLessons(prev => prev.map(t => {
      if (t.studentId === trialStudentId || t.studentName === student.fullName) {
        return { ...t, status: 'converted', convertedDate: new Date().toISOString().split('T')[0] };
      }
      return t;
    }));

    // Create Initial Tuition Payment with format [Code] - [Subject] - [Month]
    const transferMemo = formatTransferContent(newCode, subjectName, currentMonth);
    const newTuition: TuitionPayment = {
      id: `tui-${Date.now()}`,
      code: `HP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      studentId: student.id,
      studentCode: newCode,
      studentName: student.fullName,
      courseId: targetCourseId,
      courseName: course?.name || 'Khóa học chính thức',
      subjectName,
      billingMonth: currentMonth,
      sessionsCount: totalLessons,
      amount: tuitionAmount,
      paidAmount: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: 'VietQR',
      transferSyntax: transferMemo,
      invoiceNote: `Học phí nhập học chính thức khóa ${course?.name || 'mới'}. Nhận ưu đãi 20 ⭐ sao thưởng chào mừng!`
    };
    setTuitionPayments(prev => [newTuition, ...prev]);

    // Send congratulation notification
    addNotification({
      title: '🎉 Chúc mừng học viên chính thức mới!',
      content: `Học viên ${student.fullName} đã chính thức nhập học môn ${subjectName} (Mã HV: ${newCode}). Tặng 20 ⭐ sao chào mừng!`,
      type: 'system',
      targetRoles: ['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']
    });

    return { success: true, student: updatedStudent };
  };

  // Trial Lessons CRUD
  const addTrialLesson = (trialData: Omit<TrialLesson, 'id' | 'createdAt'>) => {
    const newTrial: TrialLesson = {
      ...trialData,
      id: `trial-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTrialLessons(prev => [newTrial, ...prev]);
  };

  const updateTrialLesson = (id: string, updates: Partial<TrialLesson>) => {
    setTrialLessons(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTrialLesson = (id: string) => {
    setTrialLessons(prev => prev.filter(t => t.id !== id));
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  // Attendance
  const recordAttendance = (rec: Omit<AttendanceRecord, 'id'>) => {
    const newRec: AttendanceRecord = {
       ...rec,
       id: 'att-' + Date.now()
    };
    setAttendance(prev => [newRec, ...prev]);

    // If present, increase student completed lessons and deduct remaining
    if (rec.status === 'present' || rec.status === 'makeup') {
      const starsGained = rec.starsAwarded || 5;
      setStudents(prev => prev.map(s => {
        if (s.id === rec.studentId) {
          const comp = (s.completedLessons || 0) + 1;
          const rem = Math.max(0, (s.remainingLessons || 0) - 1);
          const currentTotal = s.totalStars !== undefined ? s.totalStars : (s.stars || 0);
          const currentReward = s.rewardPoints !== undefined ? s.rewardPoints : (s.stars || 0);
          return {
            ...s,
            completedLessons: comp,
            remainingLessons: rem,
            stars: currentTotal + starsGained,
            totalStars: currentTotal + starsGained,
            rewardPoints: currentReward + starsGained
          };
        }
        return s;
      }));
    }
  };

  const batchRecordAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`
    }));
    setAttendance(prev => [...newRecords, ...prev]);

    // Update students
    records.forEach(rec => {
      if (rec.status === 'present' || rec.status === 'makeup') {
        const starsGained = rec.starsAwarded || 5;
        setStudents(prev => prev.map(s => {
          if (s.id === rec.studentId) {
            const comp = (s.completedLessons || 0) + 1;
            const rem = Math.max(0, (s.remainingLessons || 0) - 1);
            const currentTotal = s.totalStars !== undefined ? s.totalStars : (s.stars || 0);
            const currentReward = s.rewardPoints !== undefined ? s.rewardPoints : (s.stars || 0);
            return {
              ...s,
              completedLessons: comp,
              remainingLessons: rem,
              stars: currentTotal + starsGained,
              totalStars: currentTotal + starsGained,
              rewardPoints: currentReward + starsGained
            };
          }
          return s;
        }));
      }
    });
  };

  // Tuition
  const addTuitionPayment = (paymentData: Omit<TuitionPayment, 'id'>) => {
    const newPayment: TuitionPayment = {
      ...paymentData,
      id: 'tui-' + Date.now()
    };
    setTuitionPayments(prev => [newPayment, ...prev]);
  };

  const updateTuitionStatus = (id: string, status: 'paid' | 'pending' | 'overdue', paidAmount?: number) => {
    setTuitionPayments(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          paidAmount: paidAmount !== undefined ? paidAmount : t.paidAmount
        };
      }
      return t;
    }));
  };

  // Birthday Templates
  const addBirthdayTemplate = (tpl: Omit<BirthdayTemplate, 'id'>) => {
    const newTpl: BirthdayTemplate = {
      ...tpl,
      id: 'bdt-' + Date.now()
    };
    setBirthdayTemplates(prev => [...prev, newTpl]);
  };

  const updateBirthdayTemplate = (id: string, updates: Partial<BirthdayTemplate>) => {
    setBirthdayTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteBirthdayTemplate = (id: string) => {
    setBirthdayTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Assignments
  const addAssignment = (asnData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsn: Assignment = {
      ...asnData,
      id: 'asn-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAsn, ...prev]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const submitAssignment = (subData: Omit<Submission, 'id' | 'submittedAt'>) => {
    const newSub: Submission = {
      ...subData,
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setSubmissions(prev => [newSub, ...prev]);
  };

  const gradeSubmission = (
    submissionId: string,
    gradeData: {
      grade: string;
      score?: number;
      teacherFeedback: string;
      starsAwarded: number;
      rewardPointsAwarded: number;
    }
  ) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          grade: gradeData.grade,
          score: gradeData.score,
          teacherFeedback: gradeData.teacherFeedback,
          starsAwarded: gradeData.starsAwarded,
          rewardPointsAwarded: gradeData.rewardPointsAwarded,
          status: 'graded'
        };
      }
      return sub;
    }));

    // Find student to award stars and reward points
    const sub = submissions.find(s => s.id === submissionId);
    if (sub && (gradeData.starsAwarded > 0 || gradeData.rewardPointsAwarded > 0)) {
      setStudents(prev => prev.map(st => {
        if (st.id === sub.studentId) {
          const currentStars = st.totalStars !== undefined ? st.totalStars : (st.stars || 0);
          const currentPoints = st.rewardPoints !== undefined ? st.rewardPoints : (st.stars || 0);
          return {
            ...st,
            stars: currentStars + gradeData.starsAwarded,
            totalStars: currentStars + gradeData.starsAwarded,
            rewardPoints: currentPoints + gradeData.rewardPointsAwarded
          };
        }
        return st;
      }));

      addNotification({
        title: '⭐ Bài tập thực hành đã được chấm điểm!',
        content: `Học viên ${sub.studentName} được xếp loại "${gradeData.grade}" và nhận thêm +${gradeData.starsAwarded} Sao BXH và +${gradeData.rewardPointsAwarded} Điểm đổi quà!`,
        type: 'system',
        targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
      });
    }
  };

  const redeemReward = (studentId: string, rewardId: string): { success: boolean; error?: string } => {
    const student = students.find(s => s.id === studentId);
    const reward = rewards.find(r => r.id === rewardId);

    if (!student || !reward) {
      return { success: false, error: 'Không tìm thấy thông tin quà hoặc học viên.' };
    }

    const pts = reward.pointsRequired || reward.requiredPoints || 50;
    const availableRewardPoints = student.rewardPoints !== undefined ? student.rewardPoints : (student.stars || 0);
    const honorStars = student.totalStars !== undefined ? student.totalStars : (student.stars || 0);

    if (availableRewardPoints < pts) {
      return {
        success: false,
        error: `Bạn cần ${pts} Điểm thưởng đổi quà (hiện có ${availableRewardPoints} điểm). Điểm sao vinh danh tích lũy BXH (${honorStars} ⭐) của bạn luôn được bảo toàn!`
      };
    }

    if (reward.stock <= 0) {
      return { success: false, error: 'Phần quà này tạm thời hết hàng trong kho.' };
    }

    // Deduct rewardPoints ONLY & decrease stock.
    // CRITICAL: student.totalStars (and leaderboard stars) remain 100% untouched!
    const newRewardPoints = Math.max(0, availableRewardPoints - pts);
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          rewardPoints: newRewardPoints
        };
      }
      return s;
    }));
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r));

    addNotification({
      title: '🎁 Đổi quà thưởng thành công!',
      content: `Học viên ${student.fullName} đã dùng ${pts} điểm thưởng để đổi "${reward.name}". Số dư điểm đổi quà còn: ${newRewardPoints} điểm. Điểm sao vinh danh BXH (${honorStars} ⭐) được bảo toàn nguyên vẹn!`,
      type: 'system',
      targetRoles: ['ADMIN', 'STUDENT', 'PARENT']
    });

    try {
      confetti({ particleCount: 90, spread: 70 });
    } catch (e) {}

    return { success: true };
  };

  const addReward = (rewardData: Omit<RewardItem, 'id'>) => {
    const newRwd: RewardItem = {
      ...rewardData,
      id: 'rwd-' + Date.now(),
      pointsRequired: rewardData.pointsRequired || rewardData.requiredPoints || 50,
      requiredPoints: rewardData.pointsRequired || rewardData.requiredPoints || 50,
      stock: rewardData.stock !== undefined ? Number(rewardData.stock) : 10
    };
    setRewards(prev => [newRwd, ...prev]);
  };

  const updateReward = (id: string, updates: Partial<RewardItem>) => {
    setRewards(prev => prev.map(r => {
      if (r.id === id) {
        const pts = updates.pointsRequired ?? updates.requiredPoints ?? r.pointsRequired ?? r.requiredPoints ?? 50;
        return {
          ...r,
          ...updates,
          pointsRequired: pts,
          requiredPoints: pts
        };
      }
      return r;
    }));
  };

  const deleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  // Notifications
  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    const newN: NotificationItem = {
      ...notifData,
      id: 'notif-' + Date.now(),
      createdAt: 'Vừa xong'
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Makeup & Reservations
  const requestMakeup = (reqData: Omit<MakeupRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: MakeupRequest = {
      ...reqData,
      id: 'mk-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMakeupRequests(prev => [newReq, ...prev]);
  };

  const updateMakeupStatus = (id: string, status: 'approved' | 'rejected' | 'completed') => {
    setMakeupRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const requestReservation = (reqData: Omit<ReservationRecord, 'id' | 'createdAt' | 'status'>) => {
    const newRes: ReservationRecord = {
      ...reqData,
      id: 'res-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReservations(prev => [newRes, ...prev]);
  };

  const updateReservationStatus = (id: string, status: 'approved' | 'ended') => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const markAttendance = (
    classId: string, 
    studentId: string, 
    date: string, 
    status: AttendanceStatus, 
    note?: string, 
    evaluation?: string, 
    starsAwarded: number = 5
  ) => {
    recordAttendance({
      classId,
      studentId,
      date,
      status,
      note,
      evaluation,
      starsAwarded
    });
  };

  // Compute Star Leaderboard (Dựa trên Tổng Sao Tích Lũy Vinh Danh, Không bị ảnh hưởng khi đổi quà)
  const starLeaderboard: StarLeaderboardItem[] = [...(students || [])]
    .sort((a, b) => {
      const starsA = a.totalStars !== undefined ? a.totalStars : (a.stars || 0);
      const starsB = b.totalStars !== undefined ? b.totalStars : (b.stars || 0);
      return starsB - starsA;
    })
    .map((s, index) => {
      const cls = (classes || []).find(c => s.enrolledClassIds?.includes(c.id));
      const honorStars = s.totalStars !== undefined ? s.totalStars : (s.stars || 0);
      const redeemPoints = s.rewardPoints !== undefined ? s.rewardPoints : (s.stars || 0);
      const rankTitle = index === 0 ? '🏆 Quán Quân Sao' : index === 1 ? '🥈 Á Quân Sao' : index === 2 ? '🥉 Top 3 Sao Vàng' : '🌟 Ngôi Sao Cần Cù';
      const subjText = (s.enrolledSubjects || []).join(', ') || 'Âm nhạc';
      return {
        studentId: s.id,
        code: s.code,
        studentName: s.fullName,
        avatar: s.avatar,
        stars: honorStars,
        totalStars: honorStars,
        rewardPoints: redeemPoints,
        rankTitle,
        totalLessons: s.totalLessons || 24,
        completedLessons: s.completedLessons || 0,
        subject: subjText,
        classNameOrSubject: cls ? `${subjText} • ${cls.name}` : (subjText || 'Lớp nhạc'),
        rank: index + 1,
        badges: ['Chuyên cần', 'Đúng giờ'],
        recentBadges: ['Chuyên cần', 'Đúng giờ', 'Biểu diễn tự tin']
      };
    });

  const updateBankAccount = (bankConfig: Partial<BankAccountConfig>) => {
    setBranding(prev => ({
      ...prev,
      bankAccount: {
        ...(prev.bankAccount || initialBranding.bankAccount!),
        ...bankConfig
      }
    }));
  };

  // Format VietQR transfer content strictly as requested:
  // "họ và tên hoặc mã hv - môn - tháng" (e.g. "HV001 - Piano - Thang 03" or "Nguyen Minh Anh - Piano - Thang 03")
  const formatTransferContent = (
    studentCodeOrName: string,
    subjectName: string,
    billingMonth: string
  ): string => {
    const cleanSubj = (subjectName || 'AmNhac')
      .replace(/&/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Clean month (e.g. "Tháng 03/2025" -> "Thang 03" or "T03")
    let monthClean = billingMonth || `Thang ${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    monthClean = monthClean.replace(/[\/\.]\d{4}/g, '').replace('Tháng', 'Thang').trim();

    const cleanCodeOrName = studentCodeOrName || 'HV';
    return `${cleanCodeOrName} - ${cleanSubj} - ${monthClean}`;
  };

  // Generate VietQR URL with Napas247 standard URL
  const generateQrUrlForPayment = (
    payment: Partial<TuitionPayment>,
    customAmount?: number,
    customMemo?: string
  ): string => {
    const bank = branding.bankAccount || initialBranding.bankAccount!;

    // If custom uploaded QR image is selected
    if (bank.useCustomQr && bank.customQrUrl) {
      return bank.customQrUrl;
    }

    const bankCode = bank.bankId || 'MBBank';
    const accNumber = bank.accountNumber || '0901888999';
    const amount = customAmount !== undefined ? customAmount : (payment.amount || 0);

    let memo = customMemo;
    if (!memo) {
      const idOrName = bank.memoFormat === 'NAME_SUBJECT_MONTH'
        ? (payment.studentName || payment.studentCode || 'HV')
        : (payment.studentCode || payment.studentName || 'HV');
      memo = formatTransferContent(idOrName, payment.subjectName || 'AmNhac', payment.billingMonth || `Thang ${new Date().getMonth() + 1}`);
    }

    // vietqr.io url format: https://img.vietqr.io/image/<BANK_CODE>-<ACCOUNT_NO>-compact2.jpg?amount=<AMOUNT>&addInfo=<MEMO>&accountName=<NAME>
    const encodedMemo = encodeURIComponent(memo);
    const encodedName = encodeURIComponent(bank.accountHolder || 'TRUNG TAM AM NHAC MINH MUSIC');
    return `https://img.vietqr.io/image/${bankCode}-${accNumber}-compact2.png?amount=${amount}&addInfo=${encodedMemo}&accountName=${encodedName}`;
  };

  const updateBranding = (updates: Partial<TenantBranding>) => {
    setBranding(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    }));
  };

  const resetBranding = () => {
    setBranding(initialBranding);
  };

  const addBranch = (branch: Omit<TenantBranch, 'id'>) => {
    const newBranch: TenantBranch = {
      ...branch,
      id: `branch-${Date.now()}`
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = (id: string, updates: Partial<TenantBranch>) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => {
      const remaining = prev.filter(b => b.id !== id);
      if (remaining.length === 0) return prev; // Cannot delete all
      if (activeBranchId === id) {
        setActiveBranchId(remaining[0].id);
      }
      return remaining;
    });
  };

  const resetDataToDefault = () => {
    localStorage.clear();
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setGuardians(initialGuardians);
    setStudentGuardianLinks(initialStudentGuardianLinks);
    setSubjects(initialSubjects);
    setCourses(initialCourses);
    setClasses(initialClasses);
    setTuitionPayments(initialTuitionPayments);
    setBirthdayTemplates(initialBirthdayTemplates);
    setAssignments(initialAssignments);
    setRewards(initialRewards);
    setNotifications(initialNotifications);
    setReservations(initialReservations);
    setTrialLessons(initialTrialLessons);
    setRegistrationRequests(initialRegistrationRequests);
    setScheduleChangeRequests(initialScheduleChangeRequests);
    setPaymentSubmissions(initialPaymentSubmissions);
    setBranding(initialBranding);
    setBranches(initialBranches);
    setActiveBranchId(initialBranches[0]?.id || 'branch-01');
  };

  // Multi-Teacher Class Assignment logic with conflict detection
  const assignTeacherToClass = (
    classId: string,
    teacherId: string,
    roleInClass: ClassTeacherRole,
    subjectsList?: string[],
    startDate?: string,
    endDate?: string
  ): { success: boolean; conflictWarning?: string; error?: string } => {
    const cls = classes.find(c => c.id === classId);
    const tch = teachers.find(t => t.id === teacherId);
    if (!cls || !tch) {
      return { success: false, error: 'Không tìm thấy thông tin Lớp học hoặc Giáo viên.' };
    }

    // Check for schedule collision across other active classes taught by this teacher
    let conflictWarning: string | undefined;
    const existingClassesForTeacher = classes.filter(c => {
      if (c.id === classId) return false;
      const isAssigned = c.teacherId === teacherId 
        || c.teachers?.some(t => t.teacherId === teacherId) 
        || c.teacherIds?.includes(teacherId);
      return isAssigned && c.status === 'active';
    });

    for (const otherClass of existingClassesForTeacher) {
      // Check schedule overlaps (e.g. same dayOfWeek and matching time)
      if (otherClass.scheduleDayOfWeek && cls.scheduleDayOfWeek) {
        const overlapDays = cls.scheduleDayOfWeek.some(day => otherClass.scheduleDayOfWeek?.includes(day));
        if (overlapDays && otherClass.scheduleTime === cls.scheduleTime) {
          conflictWarning = `CẢNH BÁO: Giáo viên ${tch.fullName} đang có lịch dạy trùng ở lớp "${otherClass.name}" (${otherClass.scheduleTime} - ${otherClass.scheduleDayOfWeek.join(', ')})!`;
          break;
        }
      }
    }

    const newTeacherEntry: ClassTeacher = {
      id: `ct-${Date.now()}`,
      classId,
      teacherId,
      teacherName: tch.fullName,
      teacherCode: tch.code || tch.id,
      roleInClass,
      roleTitle: roleInClass === 'lead' ? 'Giáo viên chính' : roleInClass === 'assistant' ? 'Giáo viên phụ' : roleInClass === 'substitute' ? 'GV Thay thế' : 'Trợ giảng',
      subjects: subjectsList && subjectsList.length > 0 ? subjectsList : [cls.subjectName || 'Âm nhạc'],
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate,
      status: 'active'
    };

    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        const currentTeachers = c.teachers || [];
        const filtered = currentTeachers.filter(t => t.teacherId !== teacherId);
        const updatedTeachers = [...filtered, newTeacherEntry];
        const updatedTeacherIds = Array.from(new Set([...(c.teacherIds || []), teacherId]));
        
        // If lead, set as main teacher for backwards compatibility
        const isPrimary = roleInClass === 'lead' || !c.teacherId;
        return {
          ...c,
          teacherId: isPrimary ? teacherId : c.teacherId,
          teacherName: isPrimary ? tch.fullName : c.teacherName,
          teacherIds: updatedTeacherIds,
          teachers: updatedTeachers
        };
      }
      return c;
    }));

    return { success: true, conflictWarning };
  };

  const removeTeacherFromClass = (classId: string, teacherId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        const updatedTeachers = (c.teachers || []).filter(t => t.teacherId !== teacherId);
        const updatedTeacherIds = (c.teacherIds || []).filter(id => id !== teacherId);
        const newPrimary = updatedTeachers.find(t => t.roleInClass === 'PRIMARY') || updatedTeachers[0];
        return {
          ...c,
          teachers: updatedTeachers,
          teacherIds: updatedTeacherIds,
          teacherId: newPrimary ? newPrimary.teacherId : '',
          teacherName: newPrimary ? newPrimary.teacherName : 'Chưa phân công'
        };
      }
      return c;
    }));
  };

  const updateTeacherInClass = (classId: string, teacherId: string, updates: Partial<ClassTeacher>) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        const updatedTeachers = (c.teachers || []).map(t => {
          if (t.teacherId === teacherId) {
            return { ...t, ...updates };
          }
          return t;
        });
        return { ...c, teachers: updatedTeachers };
      }
      return c;
    }));
  };

  // Student-Guardian Link CRUD
  const addStudentGuardianLink = (link: Omit<StudentGuardianLink, 'id' | 'createdAt'>) => {
    const newLink: StudentGuardianLink = {
      ...link,
      id: `sgl-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudentGuardianLinks(prev => [newLink, ...prev]);
  };

  const updateStudentGuardianLink = (id: string, updates: Partial<StudentGuardianLink>) => {
    setStudentGuardianLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteStudentGuardianLink = (id: string) => {
    setStudentGuardianLinks(prev => prev.filter(l => l.id !== id));
  };

  // User Request Workflows
  const submitRegistrationRequest = (req: Omit<RegistrationRequest, 'id' | 'requestedDate' | 'status'>) => {
    const newReq: RegistrationRequest = {
      ...req,
      id: `reg-req-${Date.now()}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setRegistrationRequests(prev => [newReq, ...prev]);
  };

  const approveRegistrationRequest = (requestId: string, adminNote?: string) => {
    setRegistrationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'approved',
          reviewedBy: 'Admin',
          reviewedAt: new Date().toISOString().split('T')[0],
          note: adminNote ? `${r.note || ''} (Admin: ${adminNote})` : r.note
        };
      }
      return r;
    }));
  };

  const rejectRegistrationRequest = (requestId: string, reason?: string) => {
    setRegistrationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected',
          reviewedBy: 'Admin',
          reviewedAt: new Date().toISOString().split('T')[0],
          note: reason ? `${r.note || ''} (Lý do từ chối: ${reason})` : r.note
        };
      }
      return r;
    }));
  };

  const submitScheduleChangeRequest = (req: Omit<ScheduleChangeRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ScheduleChangeRequest = {
      ...req,
      id: `scr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setScheduleChangeRequests(prev => [newReq, ...prev]);
  };

  const approveScheduleChangeRequest = (requestId: string, adminResponse?: string) => {
    setScheduleChangeRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'approved',
          adminResponse
        };
      }
      return r;
    }));
  };

  const rejectScheduleChangeRequest = (requestId: string, reason?: string) => {
    setScheduleChangeRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected',
          adminResponse: reason
        };
      }
      return r;
    }));
  };

  const submitPaymentReceipt = (sub: Omit<PaymentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: PaymentSubmission = {
      ...sub,
      id: `ps-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    setPaymentSubmissions(prev => [newSub, ...prev]);
  };

  const approvePaymentSubmission = (submissionId: string) => {
    const sub = paymentSubmissions.find(p => p.id === submissionId);
    if (sub) {
      setPaymentSubmissions(prev => prev.map(p => p.id === submissionId ? { ...p, status: 'approved' } : p));
      if (sub.tuitionPaymentId) {
        updateTuitionStatus(sub.tuitionPaymentId, 'paid', sub.amount);
      }
    }
  };

  const rejectPaymentSubmission = (submissionId: string) => {
    setPaymentSubmissions(prev => prev.map(p => p.id === submissionId ? { ...p, status: 'rejected' } : p));
  };

  // Scoped Data Retriever Engine according to Business Scope Rules
  const getScopedDataForUser = (user: UserAccount | null, currentActiveRole: UserRole) => {
    if (!user) {
      return {
        scopedClasses: [],
        scopedStudents: [],
        scopedTeachers: [],
        scopedAssignments: [],
        scopedSubmissions: [],
        scopedAttendance: [],
        scopedTuition: [],
        scopedMakeupRequests: [],
        scopedGuardianLinks: []
      };
    }

    if (currentActiveRole === 'ADMIN') {
      return {
        scopedClasses: classes,
        scopedStudents: students,
        scopedTeachers: teachers,
        scopedAssignments: assignments,
        scopedSubmissions: submissions,
        scopedAttendance: attendance,
        scopedTuition: tuitionPayments,
        scopedMakeupRequests: makeupRequests,
        scopedGuardianLinks: studentGuardianLinks
      };
    }

    if (currentActiveRole === 'TEACHER') {
      // Find matching teacher profile
      const teacherProfile = teachers.find(t => 
        t.id === user.teacherProfileId || 
        t.id === user.profileId || 
        t.email?.toLowerCase() === user.email?.toLowerCase() ||
        t.fullName?.toLowerCase() === user.displayName?.toLowerCase()
      ) || teachers[0]; // fallback to first teacher in demo

      const teacherId = teacherProfile?.id;

      // Filter classes assigned to this teacher (either as primary teacher, in teacherIds, or in teachers array)
      const myClasses = classes.filter(c => 
        c.teacherId === teacherId ||
        c.teacherIds?.includes(teacherId) ||
        c.teachers?.some(t => t.teacherId === teacherId)
      );
      const myClassIds = myClasses.map(c => c.id);

      // Students enrolled in teacher's classes
      const studentIdSet = new Set<string>();
      myClasses.forEach(c => (c.studentIds || []).forEach(sid => studentIdSet.add(sid)));
      const myStudents = students.filter(s => 
        studentIdSet.has(s.id) || 
        s.enrolledClassIds?.some(cid => myClassIds.includes(cid)) ||
        s.teacherId === teacherId
      );

      // Assignments for teacher's classes or created by this teacher
      const myAssignments = assignments.filter(a => 
        a.teacherId === teacherId || 
        (a.classId && myClassIds.includes(a.classId))
      );
      const myAssignmentIds = myAssignments.map(a => a.id);

      const mySubmissions = submissions.filter(s => myAssignmentIds.includes(s.assignmentId));
      const myAttendance = attendance.filter(a => myClassIds.includes(a.classId));
      const myMakeup = makeupRequests.filter(m => m.teacherId === teacherId || myClassIds.includes(m.classId));

      return {
        scopedClasses: myClasses,
        scopedStudents: myStudents,
        scopedTeachers: teacherProfile ? [teacherProfile] : teachers,
        scopedAssignments: myAssignments,
        scopedSubmissions: mySubmissions,
        scopedAttendance: myAttendance,
        scopedTuition: [], // Teachers do not have access to tuition financial data
        scopedMakeupRequests: myMakeup,
        scopedGuardianLinks: []
      };
    }

    if (currentActiveRole === 'STUDENT') {
      const studentProfile = students.find(s => 
        s.id === user.studentProfileId || 
        s.id === user.profileId || 
        s.email?.toLowerCase() === user.email?.toLowerCase() ||
        s.code?.toLowerCase() === user.profileCode?.toLowerCase() ||
        s.fullName?.toLowerCase() === user.displayName?.toLowerCase()
      ) || students[0]; // fallback to first student

      const studentId = studentProfile?.id;
      const myClasses = classes.filter(c => c.studentIds?.includes(studentId) || studentProfile?.enrolledClassIds?.includes(c.id));
      const myClassIds = myClasses.map(c => c.id);

      const myAssignments = assignments.filter(a => 
        (a.classId && myClassIds.includes(a.classId)) || 
        a.targetStudentId === studentId ||
        (!a.classId && !a.targetStudentId)
      );
      const mySubmissions = submissions.filter(s => s.studentId === studentId);
      const myAttendance = attendance.filter(a => a.studentId === studentId);
      const myTuition = tuitionPayments.filter(t => t.studentId === studentId);
      const myMakeup = makeupRequests.filter(m => m.studentId === studentId);

      return {
        scopedClasses: myClasses,
        scopedStudents: studentProfile ? [studentProfile] : [],
        scopedTeachers: teachers,
        scopedAssignments: myAssignments,
        scopedSubmissions: mySubmissions,
        scopedAttendance: myAttendance,
        scopedTuition: myTuition,
        scopedMakeupRequests: myMakeup,
        scopedGuardianLinks: []
      };
    }

    if (currentActiveRole === 'PARENT' || currentActiveRole === 'GUARDIAN') {
      // Find matching guardian profile or links
      const guardianProfile = guardians.find(g => 
        g.id === user.guardianProfileId || 
        g.id === user.profileId || 
        g.email?.toLowerCase() === user.email?.toLowerCase() ||
        g.phone === user.phone
      ) || guardians[0];

      const guardianId = guardianProfile?.id || 'grd-01';
      const myLinks = studentGuardianLinks.filter(l => l.guardianId === guardianId && l.status === 'active');
      const linkedStudentIds = myLinks.map(l => l.studentId);
      const linkedStudents = students.filter(s => linkedStudentIds.includes(s.id) || guardianProfile?.studentIds?.includes(s.id));

      const linkedClassIds = new Set<string>();
      linkedStudents.forEach(s => (s.enrolledClassIds || []).forEach(cid => linkedClassIds.add(cid)));
      const linkedClasses = classes.filter(c => linkedClassIds.has(c.id));

      const linkedAssignments = assignments.filter(a => a.classId && linkedClassIds.has(a.classId));
      const linkedSubmissions = submissions.filter(s => linkedStudentIds.includes(s.studentId));
      const linkedAttendance = attendance.filter(a => linkedStudentIds.includes(a.studentId));
      const linkedTuition = tuitionPayments.filter(t => linkedStudentIds.includes(t.studentId));
      const linkedMakeup = makeupRequests.filter(m => linkedStudentIds.includes(m.studentId));

      const permissionsMap: Record<string, StudentGuardianLink> = {};
      myLinks.forEach(l => { permissionsMap[l.studentId] = l; });

      return {
        scopedClasses: linkedClasses,
        scopedStudents: linkedStudents,
        scopedTeachers: teachers,
        scopedAssignments: linkedAssignments,
        scopedSubmissions: linkedSubmissions,
        scopedAttendance: linkedAttendance,
        scopedTuition: linkedTuition,
        scopedMakeupRequests: linkedMakeup,
        scopedGuardianLinks: myLinks,
        activeGuardianPermissions: permissionsMap
      };
    }

    // Default fallback
    return {
      scopedClasses: classes,
      scopedStudents: students,
      scopedTeachers: teachers,
      scopedAssignments: assignments,
      scopedSubmissions: submissions,
      scopedAttendance: attendance,
      scopedTuition: tuitionPayments,
      scopedMakeupRequests: makeupRequests,
      scopedGuardianLinks: studentGuardianLinks
    };
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        guardians,
        studentGuardianLinks,
        subjects,
        courses,
        classes,
        attendance,
        attendanceRecords: attendance,
        tuitionPayments,
        birthdayTemplates,
        assignments,
        submissions,
        rewards,
        notifications,
        makeupRequests,
        makeupSessions: makeupRequests,
        reservations,
        reservationRequests: reservations,
        trialLessons,
        registrationRequests,
        scheduleChangeRequests,
        paymentSubmissions,
        starLeaderboard,
        branding,
        branches,
        activeBranchId,
        assignTeacherToClass,
        removeTeacherFromClass,
        updateTeacherInClass,
        addStudentGuardianLink,
        updateStudentGuardianLink,
        deleteStudentGuardianLink,
        submitRegistrationRequest,
        approveRegistrationRequest,
        rejectRegistrationRequest,
        submitScheduleChangeRequest,
        approveScheduleChangeRequest,
        rejectScheduleChangeRequest,
        submitPaymentReceipt,
        approvePaymentSubmission,
        rejectPaymentSubmission,
        getScopedDataForUser,
        updateBranding,
        resetBranding,
        updateBankAccount,
        setActiveBranchId,
        addBranch,
        updateBranch,
        deleteBranch,
        getAllBirthdays,
        getTodayBirthdays,
        getTomorrowBirthdays,
        get7DaysBirthdays,
        getMonthBirthdays,
        sendBirthdayWish,
        addGuardian,
        updateGuardian,
        deleteGuardian,
        linkGuardianToStudent,
        addStudent,
        updateStudent,
        deleteStudent,
        awardStars,
        reserveStudentAccount,
        reactivateStudentAccount,
        convertTrialToOfficial,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addSubject,
        updateSubject,
        deleteSubject,
        addCourse,
        updateCourse,
        deleteCourse,
        addClass,
        updateClass,
        deleteClass,
        recordAttendance,
        batchRecordAttendance,
        markAttendance,
        addTuitionPayment,
        updateTuitionStatus,
        updatePaymentStatus: updateTuitionStatus,
        formatTransferContent,
        generateQrUrlForPayment,
        addBirthdayTemplate,
        updateBirthdayTemplate,
        deleteBirthdayTemplate,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,
        redeemReward,
        addReward,
        updateReward,
        deleteReward,
        addNotification,
        markNotificationRead,
        requestMakeup,
        addMakeupSession: requestMakeup,
        updateMakeupStatus,
        requestReservation,
        addReservationRequest: requestReservation,
        updateReservationStatus,
        cancelReservation,
        addTrialLesson,
        updateTrialLesson,
        deleteTrialLesson,
        resetDataToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
