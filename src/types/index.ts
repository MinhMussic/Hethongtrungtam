export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'GUARDIAN';

export type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export type Gender = 'Nam' | 'Nữ' | 'Khác';

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  username?: string; // Tên đăng nhập
  nickname?: string; // Tên gọi / Biệt danh
  phone?: string;
  role: UserRole; // Current/primary role for backward compatibility
  roles: UserRole[]; // Multi-role support: e.g. ['ADMIN', 'TEACHER']
  primaryRole: UserRole; // Default role upon login
  activeRole?: UserRole; // Active operational mode in UI without logging out
  status: AccountStatus;
  profileId?: string; // Links to Student, Teacher, or Guardian
  studentProfileId?: string;
  teacherProfileId?: string;
  guardianProfileId?: string;
  profileCode?: string;
  profileName?: string;
  avatarUrl?: string;
  gender?: Gender;
  birthDate?: string;
  nationality?: string; // Quốc tịch
  ethnicity?: string; // Dân tộc
  address?: string;
  guardianName?: string; // Họ tên phụ huynh/người giám hộ
  guardianPhone?: string; // SĐT phụ huynh
  guardianRelation?: string; // Mối quan hệ
  guardianBirthYear?: string; // Năm sinh phụ huynh
  isUnder16?: boolean;
  bio?: string;
  specialties?: string[];
  createdAt: string;
  lastLoginAt?: string;
  note?: string;
}

export interface RegisterPayload {
  role: UserRole;
  displayName: string;
  nickname?: string;
  birthDate?: string;
  nationality?: string;
  ethnicity?: string;
  address?: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  guardianBirthYear?: string;
  isUnder16?: boolean;
  specialties?: string[];
  note?: string;
}

export type GuardianRelation = 
  | 'Cha' 
  | 'Mẹ' 
  | 'Ông' 
  | 'Bà' 
  | 'Anh' 
  | 'Chị' 
  | 'Cô' 
  | 'Dì' 
  | 'Chú' 
  | 'Bác' 
  | 'Người giám hộ' 
  | 'Khác';

export interface StudentGuardianLink {
  id: string;
  studentId: string;
  guardianId: string;
  studentName?: string;
  guardianName?: string;
  relationship: GuardianRelation;
  canViewLearning: boolean;
  canViewPayments: boolean;
  canSubmitPayments: boolean;
  canRequestScheduleChange: boolean;
  canRequestReservation: boolean;
  canRegisterCourses: boolean;
  canRedeemRewards: boolean;
  receiveNotifications: boolean;
  isPrimary: boolean;
  status: 'active' | 'pending' | 'inactive';
  createdAt?: string;
  notes?: string;
}

export interface Guardian {
  id: string;
  code: string; // e.g. PH001
  fullName: string;
  relation: GuardianRelation;
  phone: string;
  email: string;
  address: string;
  linkedStudentIds: string[];
  isPrimaryContact: boolean;
  isNotificationReceiver: boolean;
  isTuitionResponsible: boolean;
  hasUserAccount: boolean;
  userId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  notes?: string;
}

export interface Student {
  id: string;
  code: string; // e.g. HV001
  fullName: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  phone?: string;
  email?: string;
  avatar?: string;
  address?: string;
  enrolledSubjects: string[];
  enrolledClassIds?: string[];
  totalLessons?: number;
  completedLessons?: number;
  remainingLessons?: number;
  stars?: number;
  totalStars?: number; // ⭐ Điểm sao vinh danh tích lũy trọn đời / BXH (Không bị trừ khi đổi quà)
  rewardPoints?: number; // 🎁 Điểm thưởng đổi quà khả dụng (Bị trừ khi đổi quà)
  status: 'active' | 'reserved' | 'completed' | 'trial';
  userId?: string;
  linkedGuardianIds?: string[];
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  joinDate?: string;
  notes?: string;
}

export interface Teacher {
  id: string;
  code: string; // e.g. GV001
  fullName: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  phone: string;
  email: string;
  specialties: string[]; // ['Piano', 'Guitar', 'Thanh nhạc']
  bio?: string;
  avatar?: string;
  hourlyRate?: number;
  status: 'active' | 'on_leave';
  userId?: string;
  joinDate: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  totalCourses?: number;
  totalClasses?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  subjectId?: string;
  subject?: string;
  subjectName?: string;
  level?: 'Cơ bản' | 'Nâng cao' | 'Luyện thi' | 'Thiếu nhi' | 'Đệm hát' | 'Chuyên sâu' | string;
  totalLessons?: number;
  fee?: number | string;
  durationMonths?: number;
  description?: string;
}

export type ClassTeacherRole = 'lead' | 'assistant' | 'substitute' | 'specialist';

export interface ClassTeacher {
  id: string;
  classId: string;
  teacherId: string;
  teacherName?: string;
  teacherCode?: string;
  roleInClass: ClassTeacherRole; // 'lead' (GV Chính), 'assistant' (GV Phụ), 'substitute' (GV Thay thế), 'specialist' (Trợ giảng)
  roleTitle?: string; // Tên hiển thị: 'Giáo viên chính', 'Giáo viên phụ', 'Trợ giảng', 'GV Thay thế'
  subjects?: string[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive';
}

export interface MusicClass {
  id: string;
  code: string;
  name: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  courseId?: string;
  courseName?: string;
  teacherId: string; // Primary lead teacher (for backward compatibility)
  teacherName?: string;
  teacherIds?: string[]; // All assigned teacher IDs (many-to-many)
  teachers?: ClassTeacher[]; // Rich relation records for many-to-many
  schedule?: string;
  scheduleText?: string;
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
  room: string;
  maxStudents: number;
  currentStudents?: number;
  studentIds?: string[];
  status: 'active' | 'upcoming' | 'finished';
}

export type ClassItem = MusicClass;

export type AttendanceStatus = 'present' | 'absent_excused' | 'absent_unexcused' | 'late' | 'makeup' | 'absent_with_leave' | 'absent_no_leave';

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  evaluation?: string;
  starsAwarded?: number;
  recordedBy?: string;
}

export interface MakeupSession {
  id: string;
  studentId: string;
  studentName?: string;
  originalClassId?: string;
  originalDate: string;
  targetClassId?: string;
  targetDate?: string;
  makeupDate?: string;
  makeupTime?: string;
  teacherId?: string;
  teacherName?: string;
  room?: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'approved' | 'rejected';
  note?: string;
  createdAt?: string;
}

export type MakeupRequest = MakeupSession;

export interface ReservationRequest {
  id: string;
  studentId: string;
  studentName?: string;
  classId?: string;
  className?: string;
  subjectName?: string;
  startDate: string;
  endDate: string;
  sessionsRemaining?: number;
  remainingLessonsHeld?: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'ended';
  approvedDate?: string;
  notes?: string;
  createdAt?: string;
}

export type ReservationRecord = ReservationRequest;

export interface TrialLesson {
  id: string;
  studentId?: string;
  studentCode?: string;
  studentName: string;
  phone: string;
  email?: string;
  subjectId: string;
  subjectName?: string;
  preferredDate: string;
  preferredTime?: string;
  teacherId?: string;
  teacherName?: string;
  status: 'scheduled' | 'attended' | 'converted' | 'cancelled';
  notes?: string;
  guardianName?: string;
  guardianPhone?: string;
  convertedDate?: string;
  createdAt: string;
}

export interface BirthdayItem {
  id: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'GUARDIAN';
  birthDate: string; // YYYY-MM-DD
  age: number;
  phone?: string;
  avatar?: string;
  classNameOrSubject?: string;
  daysUntilBirthday: number;
  category: 'today' | 'tomorrow' | '7days' | 'this_month';
}

export interface BirthdayTemplate {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'STUDENT' | 'TEACHER';
  isDefault?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId?: string; // Optional class tag
  className?: string;
  studentId?: string; // Primary target student
  studentName?: string;
  targetStudentIds?: string[]; // Multiple specific students if assigned to a group of individuals
  studentLevel?: 'Vỡ lòng' | 'Cơ bản (Grade 1-2)' | 'Trung cấp (Grade 3-4)' | 'Nâng cao (Grade 5+)' | 'Luyện thi / Chuyên sâu' | string;
  subjectName?: string; // e.g. Piano, Guitar, Thanh nhạc, Violin, Trống
  targetBpm?: number; // Metronome practice speed (e.g. 72, 80, 96, 120 bpm)
  customNotes?: string; // Specific instructions based on student's weaknesses/strengths
  dueDate: string;
  maxScore?: number;
  bonusStars?: number; // Honor stars for leaderboard upon completion (+5, +10 ⭐)
  rewardPoints?: number; // Reward points for gift redemption (+15 pts)
  attachments?: string[];
  sheetMusicUrl?: string; // Sheet music PDF/Image link
  audioUrl?: string; // Demo audio/beat/video link
  teacherId?: string;
  teacherName?: string;
  createdAt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  submittedAt: string;
  mediaUrl?: string; // Video or Audio recording link
  notes?: string; // Student notes / practice difficulties
  teacherFeedback?: string; // Teacher feedback & coaching advice
  grade?: string; // e.g. 9.5/10, A+, Xuất sắc, Đạt yêu cầu
  score?: number;
  starsAwarded?: number; // Honor stars awarded (added to totalStars)
  rewardPointsAwarded?: number; // Reward points awarded (added to rewardPoints)
  status: 'pending' | 'graded';
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  requiredPoints?: number;
  pointsRequired?: number;
  imageUrl?: string;
  image?: string;
  category: 'accessories' | 'books' | 'gifts' | 'Giáo trình' | 'Nhạc cụ & Phụ kiện' | 'Quà lưu niệm' | 'Voucher' | string;
  stock: number;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  description: string;
  date: string;
  badgeIcon: string;
  points: number;
}

export interface StarLeaderboardItem {
  studentId: string;
  code: string;
  studentName: string;
  avatar?: string;
  stars: number;
  totalStars?: number; // ⭐ Điểm sao tích lũy vinh danh BXH
  rewardPoints?: number; // 🎁 Điểm thưởng đổi quà khả dụng
  totalLessons?: number;
  completedLessons?: number;
  subject?: string;
  classNameOrSubject?: string;
  rank?: number;
  rankTitle?: string;
  recentBadges?: string[];
  badges?: string[];
}

export interface BankAccountConfig {
  bankId: string; // e.g. 'MBBank' | 'Vietcombank' | 'Techcombank' | 'ACB' | 'BIDV' | 'VietinBank' | 'TPBank' | 'VPBank' | 'Sacombank'
  bankCode: string; // BIN e.g. '970422' (MB), '970436' (VCB), '970407' (Techcombank), '970416' (ACB), '970418' (BIDV), '970415' (VietinBank), '970423' (TPBank), '970432' (VPBank), '970403' (Sacombank)
  accountNumber: string;
  accountHolder: string;
  branchName?: string;
  customQrUrl?: string;
  useCustomQr: boolean;
  memoFormat: 'CODE_SUBJECT_MONTH' | 'NAME_SUBJECT_MONTH'; // e.g. "HV001 - Piano - Thang 03" vs "Nguyen Minh Anh - Piano - Thang 03"
}

export interface TuitionPayment {
  id: string;
  code?: string;
  studentId: string;
  studentCode?: string;
  studentName?: string;
  guardianId?: string;
  guardianName?: string;
  courseId?: string;
  courseName?: string;
  subjectName?: string;
  amount: number;
  discountAmount?: number;
  paidAmount?: number;
  billingMonth?: string;
  sessionsCount?: number;
  paymentDate?: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue' | 'paid';
  paymentMethod?: 'vietqr' | 'cash' | 'transfer' | 'VietQR' | 'Chuyển khoản' | 'Tiền mặt' | 'Thẻ' | string;
  invoiceNote?: string;
  qrString?: string;
  transferSyntax?: string;
  receiptProofUrl?: string;
  receiptSubmittedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  targetAudience?: 'ALL' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'GUARDIAN';
  targetRoles?: UserRole[];
  targetUserIds?: string[];
  recipientId?: string;
  type: 'general' | 'tuition' | 'event' | 'schedule' | 'birthday' | 'attendance' | 'assignment' | 'system' | string;
  createdAt: string;
  isRead?: boolean;
}

export interface TenantBranding {
  id: string;
  tenantCode: string;
  centerName: string;
  subName: string;
  slogan: string;
  logoType: 'icon' | 'image';
  logoUrl?: string;
  logoIcon: 'Music' | 'Sparkles' | 'GraduationCap' | 'Award' | 'Building' | 'Headphones' | 'Mic' | 'Radio';
  primaryColor: string; // Hex color (e.g. #d97706)
  secondaryColor: string; // Hex color (e.g. #e11d48)
  accentColor: string; // Hex color (e.g. #4f46e5)
  headerGradientFrom: string; // Hex color
  headerGradientTo: string; // Hex color
  brandTagBg: string;
  brandTagText: string;
  syncToAllTenants: boolean;
  hotline: string;
  supportEmail: string;
  address: string;
  website: string;
  updatedAt?: string;
  bankAccount?: BankAccountConfig;
}

export interface TenantBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  branding?: Partial<TenantBranding>;
  googleMapsUrl?: string; // Link Google Maps / Link chia sẻ vị trí
  mapEmbedUrl?: string; // Link nhúng bản đồ / Iframe src
  latitude?: number; // Vĩ độ GPS
  longitude?: number; // Kinh độ GPS
  openingHours?: string; // Giờ mở cửa đón tiếp
  managerName?: string; // Quản lý cơ sở
  managerPhone?: string;
  facilities?: string[]; // Tiện ích & Cơ sở vật chất
  imageUrl?: string; // Ảnh thực tế cơ sở
  googleMapsApiKey?: string; // API Key nếu có
  notes?: string;
}

export type AdminMenuTab =
  // TỔNG QUAN
  | 'dashboard'
  | 'star_ranking'
  // NHÂN SỰ & HỌC VIÊN
  | 'students'
  | 'teachers'
  | 'guardians'
  | 'birthdays'
  | 'accounts'
  // ĐÀO TẠO
  | 'subjects'
  | 'courses'
  | 'classes'
  | 'schedules'
  | 'attendance'
  | 'makeup'
  | 'reservations'
  | 'trial'
  // HỌC TẬP
  | 'assignments'
  | 'progress'
  | 'reward_points'
  | 'rewards'
  | 'achievements'
  // TÀI CHÍNH & HỆ THỐNG
  | 'tuition'
  | 'notifications'
  | 'reports'
  | 'sheets_sync'
  | 'branding'
  | 'branches_map'
  | 'profile'
  | 'settings';

export type TeacherMenuTab =
  // TỔNG QUAN
  | 'teacher_dashboard'
  // GIẢNG DẠY
  | 'teacher_schedules'
  | 'teacher_subjects'
  | 'teacher_classes'
  | 'teacher_students'
  | 'teacher_attendance'
  | 'teacher_assignments'
  | 'teacher_progress'
  | 'teacher_rewards'
  // CÁ NHÂN
  | 'teacher_notifications'
  | 'teacher_contact_admin'
  | 'teacher_profile';

export type StudentMenuTab =
  // TỔNG QUAN
  | 'student_dashboard'
  | 'student_leaderboard'
  // KHÁM PHÁ
  | 'student_subjects'
  | 'student_packages'
  | 'student_courses'
  | 'student_open_classes'
  // HỌC TẬP CỦA TÔI
  | 'student_my_classes'
  | 'student_my_schedule'
  | 'student_my_assignments'
  | 'student_my_progress'
  | 'student_my_rewards'
  | 'student_my_achievements'
  | 'student_redeem_gifts'
  // YÊU CẦU
  | 'student_request_registration'
  | 'student_request_makeup'
  | 'student_request_schedule_change'
  | 'student_request_reservation'
  | 'student_my_tuition'
  // HỖ TRỢ
  | 'student_branches'
  | 'student_contact_admin'
  | 'student_notifications'
  | 'student_profile';

export type ParentMenuTab =
  // TRANG CHỦ
  | 'parent_dashboard'
  | 'parent_my_students'
  // HỌC TẬP
  | 'parent_schedules'
  | 'parent_classes'
  | 'parent_subjects'
  | 'parent_courses'
  | 'parent_assignments'
  | 'parent_progress'
  | 'parent_rewards'
  | 'parent_achievements'
  // DỊCH VỤ
  | 'parent_register_learning'
  | 'parent_tuition'
  | 'parent_makeup'
  | 'parent_schedule_change'
  | 'parent_reservation'
  | 'parent_redeem_rewards'
  // HỖ TRỢ
  | 'parent_notifications'
  | 'parent_branches'
  | 'parent_contact_admin'
  | 'parent_profile';

export interface UserDataScope {
  role: UserRole;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParentOrGuardian: boolean;
  teacherProfileId?: string;
  studentProfileId?: string;
  guardianProfileId?: string;
  assignedClassIds: string[];
  assignedStudentIds: string[];
  assignedSubjectIds: string[];
  assignedScheduleIds: string[];
  linkedStudentIds: string[];
  guardianPermissions?: Record<string, StudentGuardianLink>; // studentId -> permission link
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface RegistrationRequest {
  id: string;
  type: 'SUBJECT' | 'PACKAGE' | 'COURSE' | 'CLASS';
  targetId: string;
  targetName: string;
  studentId: string;
  studentName?: string;
  guardianId?: string;
  guardianName?: string;
  requestedDate: string;
  note?: string;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  adminResponse?: string;
}

export interface ScheduleChangeRequest {
  id: string;
  studentId: string;
  studentName?: string;
  currentClassId: string;
  currentClassName?: string;
  currentScheduleDate?: string;
  targetClassId?: string;
  targetClassName?: string;
  desiredScheduleDate?: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminResponse?: string;
}

export interface PaymentSubmission {
  id: string;
  tuitionPaymentId?: string;
  studentId: string;
  studentName?: string;
  amount: number;
  transferSyntax: string;
  receiptProofUrl?: string;
  notes?: string;
  submittedAt: string;
  status: RequestStatus;
  confirmedBy?: string;
  confirmedAt?: string;
}

