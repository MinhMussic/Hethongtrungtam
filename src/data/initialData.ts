import { 
  Student, 
  Teacher, 
  Guardian, 
  Subject, 
  Course, 
  ClassItem, 
  AttendanceRecord, 
  TuitionPayment, 
  BirthdayTemplate, 
  Assignment, 
  Submission,
  RewardItem, 
  UserAccount,
  NotificationItem
} from '../types';

// Helper to format date relative to today
const getRelativeDate = (offsetDays: number, yearOffset: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (yearOffset !== 0) {
    d.setFullYear(d.getFullYear() + yearOffset);
  }
  return d.toISOString().split('T')[0];
};

// Initial Subjects
export const initialSubjects: Subject[] = [
  {
    id: 'sub-piano',
    code: 'MH-PIANO',
    name: 'Piano & Keyboard',
    color: 'from-amber-500 to-amber-700',
    icon: 'Music',
    description: 'Chương trình đào tạo Piano cổ điển, hiện đại và đệm hát theo chuẩn quốc tế Trinity/LCM.'
  },
  {
    id: 'sub-guitar',
    code: 'MH-GUITAR',
    name: 'Guitar & Ukulele',
    color: 'from-orange-500 to-red-600',
    icon: 'Radio',
    description: 'Guitar đệm hát, cổ điển, fingerstyle và ukulele cho mọi lứa tuổi.'
  },
  {
    id: 'sub-vocal',
    code: 'MH-VOCAL',
    name: 'Thanh Nhạc',
    color: 'from-purple-500 to-indigo-600',
    icon: 'Mic2',
    description: 'Kỹ thuật lấy hơi, mở khẩu hình, phát triển quãng giọng và làm chủ sân khấu.'
  },
  {
    id: 'sub-violin',
    code: 'MH-VIOLIN',
    name: 'Violin',
    color: 'from-rose-500 to-pink-600',
    icon: 'Sparkles',
    description: 'Nghệ thuật đàn vĩ cầm tinh tế, rèn luyện thính giác và tư thế chuẩn mực.'
  },
  {
    id: 'sub-drum',
    code: 'MH-DRUM',
    name: 'Trống & Bộ Gõ',
    color: 'from-blue-600 to-cyan-600',
    icon: 'Activity',
    description: 'Rèn luyện nhịp phách, sự tập trung và giải phóng năng lượng mạnh mẽ.'
  },
  {
    id: 'sub-kids',
    code: 'MH-KIDS',
    name: 'Cảm Thụ Âm Nhạc',
    color: 'from-emerald-500 to-teal-600',
    icon: 'Smile',
    description: 'Dành cho bé từ 3.5 - 6 tuổi làm quen với tiết tấu, nốt nhạc qua trò chơi và vận động.'
  }
];

// Initial Courses
export const initialCourses: Course[] = [
  {
    id: 'crs-piano-cb',
    code: 'KH-PIA01',
    name: 'Piano Cơ Bản Toàn Diện',
    subjectId: 'sub-piano',
    level: 'Cơ bản',
    totalLessons: 24,
    fee: 4800000,
    durationMonths: 3
  },
  {
    id: 'crs-piano-nc',
    code: 'KH-PIA02',
    name: 'Piano Cổ Điển Nâng Cao (Trinity Grade 1-3)',
    subjectId: 'sub-piano',
    level: 'Nâng cao',
    totalLessons: 36,
    fee: 7200000,
    durationMonths: 4
  },
  {
    id: 'crs-guitar-dh',
    code: 'KH-GUI01',
    name: 'Guitar Đệm Hát Thực Chiến',
    subjectId: 'sub-guitar',
    level: 'Đệm hát',
    totalLessons: 24,
    fee: 3900000,
    durationMonths: 3
  },
  {
    id: 'crs-vocal-pro',
    code: 'KH-VOC01',
    name: 'Thanh Nhạc Biểu Diễn Chuyên Sâu',
    subjectId: 'sub-vocal',
    level: 'Chuyên sâu',
    totalLessons: 24,
    fee: 5500000,
    durationMonths: 3
  },
  {
    id: 'crs-violin-kid',
    code: 'KH-VIO01',
    name: 'Violin Nhí Khám Phá',
    subjectId: 'sub-violin',
    level: 'Thiếu nhi',
    totalLessons: 24,
    fee: 4800000,
    durationMonths: 3
  },
  {
    id: 'crs-drum-pop',
    code: 'KH-DRU01',
    name: 'Trống Jazz & Rock Cơ Bản',
    subjectId: 'sub-drum',
    level: 'Cơ bản',
    totalLessons: 20,
    fee: 4200000,
    durationMonths: 2.5
  }
];

// Initial Teachers
export const initialTeachers: Teacher[] = [
  {
    id: 'tch-01',
    code: 'GV001',
    fullName: 'Thầy Nguyễn Văn Minh',
    gender: 'Nam',
    birthDate: '1988-10-15',
    phone: '0908151088',
    email: 'minhmusic1510@gmail.com',
    specialties: ['Piano', 'Nhạc Lý', 'Hòa Âm'],
    bio: 'Giám đốc Trung tâm Minh Music. Tốt nghiệp Nhạc viện TP.HCM, hơn 12 năm kinh nghiệm giảng dạy Piano và đào tạo chứng chỉ quốc tế.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinDate: '2018-05-10',
    userId: 'usr-admin-1'
  },
  {
    id: 'tch-02',
    code: 'GV002',
    fullName: 'Cô Trần Thị Mai Hương',
    gender: 'Nữ',
    birthDate: getRelativeDate(0, -26), // Today is birthday! 🎉
    phone: '0912345678',
    email: 'huong.tran@minhmusic.vn',
    specialties: ['Thanh Nhạc', 'Piano Thiếu Nhi'],
    bio: 'Giảng viên Thanh nhạc tài năng, Á quân Tiếng Hát Truyền Hình, phong cách sư phạm dịu dàng, nhiệt huyết.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinDate: '2020-03-15',
    userId: 'usr-teacher-1'
  },
  {
    id: 'tch-03',
    code: 'GV003',
    fullName: 'Thầy Lê Quốc Bảo',
    gender: 'Nam',
    birthDate: getRelativeDate(1, -29), // Tomorrow is birthday! 🎉
    phone: '0933988776',
    email: 'bao.le@minhmusic.vn',
    specialties: ['Guitar', 'Ukulele', 'Fingerstyle'],
    bio: 'Guitarist chuyên nghiệp với hơn 8 năm biểu diễn và hướng dẫn học viên tham gia các ban nhạc acoustic.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinDate: '2021-08-20',
    userId: 'usr-teacher-2'
  },
  {
    id: 'tch-04',
    code: 'GV004',
    fullName: 'Cô Phạm Thu Hà',
    gender: 'Nữ',
    birthDate: getRelativeDate(4, -27), // In 4 days
    phone: '0978654321',
    email: 'ha.pham@minhmusic.vn',
    specialties: ['Violin', 'Cảm Thụ Âm Nhạc'],
    bio: 'Cử nhân biểu diễn Vĩ Cầm, thành viên Dàn nhạc Giao hưởng, phương pháp Suzuki độc đáo.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinDate: '2022-01-10'
  },
  {
    id: 'tch-05',
    code: 'GV005',
    fullName: 'Thầy Hoàng Đức Thịnh',
    gender: 'Nam',
    birthDate: '1995-11-20',
    phone: '0988112233',
    email: 'thinh.hoang@minhmusic.vn',
    specialties: ['Trống & Bộ Gõ', 'Cajon'],
    bio: 'Trưởng ban nhạc Rock Indie, phong cách giảng dạy tràn đầy năng lượng và sáng tạo.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinDate: '2022-09-01'
  }
];

// Initial Students
export const initialStudents: Student[] = [
  {
    id: 'stu-01',
    code: 'HV001',
    fullName: 'Nguyễn Minh Anh',
    gender: 'Nữ',
    birthDate: getRelativeDate(0, -10), // Today is birthday! 🎉 (10 yrs old)
    phone: '0909112233',
    email: 'minhanh.student@minhmusic.vn',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    address: '128 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 18,
    remainingLessons: 6,
    stars: 145,
    status: 'active',
    userId: 'usr-student-1',
    linkedGuardianIds: ['grd-01'],
    joinDate: '2024-02-15',
    notes: 'Học viên chăm chỉ, tiếp thu tiết tấu rất nhanh, đang tập tác phẩm Für Elise.'
  },
  {
    id: 'stu-02',
    code: 'HV002',
    fullName: 'Trần Bảo Nam',
    gender: 'Nam',
    birthDate: getRelativeDate(1, -12), // Tomorrow is birthday! 🎉 (12 yrs old)
    phone: '0934567890',
    email: 'baonam@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    address: '45 Lê Văn Sỹ, Phường 13, Quận 3, TP.HCM',
    enrolledSubjects: ['Guitar & Ukulele'],
    enrolledClassIds: ['cls-02'],
    totalLessons: 24,
    completedLessons: 12,
    remainingLessons: 12,
    stars: 90,
    status: 'active',
    userId: 'usr-student-2',
    linkedGuardianIds: ['grd-02'],
    joinDate: '2024-04-10',
    notes: 'Rất mê phong cách đệm hát fingerstyle, đang tập chuyển hợp âm F chặn.'
  },
  {
    id: 'stu-03',
    code: 'HV003',
    fullName: 'Lê Phương Linh',
    gender: 'Nữ',
    birthDate: getRelativeDate(3, -9), // In 3 days (9 yrs old)
    phone: '0918765432',
    email: 'phuonglinh.music@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '89 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    enrolledSubjects: ['Thanh Nhạc', 'Piano & Keyboard'],
    enrolledClassIds: ['cls-03', 'cls-01'],
    totalLessons: 48,
    completedLessons: 30,
    remainingLessons: 18,
    stars: 210,
    status: 'active',
    linkedGuardianIds: ['grd-03'],
    joinDate: '2023-10-05',
    notes: 'Giọng hát trong trẻo, biểu cảm sân khấu tự tin.'
  },
  {
    id: 'stu-04',
    code: 'HV004',
    fullName: 'Đỗ Gia Huy',
    gender: 'Nam',
    birthDate: getRelativeDate(5, -11), // In 5 days
    phone: '0987123456',
    email: 'giahuy.drum@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    address: '15 Hoàng Hoa Thám, Bình Thạnh, TP.HCM',
    enrolledSubjects: ['Trống & Bộ Gõ'],
    enrolledClassIds: ['cls-04'],
    totalLessons: 20,
    completedLessons: 8,
    remainingLessons: 12,
    stars: 75,
    status: 'active',
    linkedGuardianIds: ['grd-04'],
    joinDate: '2024-06-01'
  },
  {
    id: 'stu-05',
    code: 'HV005',
    fullName: 'Phạm Ngọc Hân',
    gender: 'Nữ',
    birthDate: getRelativeDate(12, -8), // This month
    phone: '0977889900',
    email: 'ngochan.violin@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    address: '202 Hai Bà Trưng, Quận 3, TP.HCM',
    enrolledSubjects: ['Violin'],
    enrolledClassIds: ['cls-05'],
    totalLessons: 24,
    completedLessons: 20,
    remainingLessons: 4,
    stars: 160,
    status: 'active',
    linkedGuardianIds: ['grd-05'],
    joinDate: '2024-01-12'
  },
  {
    id: 'stu-06',
    code: 'HV006',
    fullName: 'Vũ Tuấn Kiệt',
    gender: 'Nam',
    birthDate: '2011-09-25',
    phone: '0912998877',
    email: 'tuankiet.vu@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '33 Phan Xích Long, Phú Nhuận, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 4,
    remainingLessons: 20,
    stars: 40,
    status: 'active',
    linkedGuardianIds: ['grd-01'],
    joinDate: '2024-07-20'
  },
  {
    id: 'stu-07',
    code: 'HV007',
    fullName: 'Hoàng Đức Anh',
    gender: 'Nam',
    birthDate: '2014-11-18',
    phone: '0907113355',
    email: 'ducanh.hoang@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '56 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    enrolledSubjects: ['Guitar & Ukulele'],
    enrolledClassIds: ['cls-02'],
    totalLessons: 24,
    completedLessons: 10,
    remainingLessons: 14,
    stars: 65,
    status: 'reserved',
    linkedGuardianIds: ['grd-02'],
    joinDate: '2024-03-01',
    notes: 'Đang bảo lưu tài khoản 2 tháng do gia đình chuyển công tác ngắn hạn.'
  },
  {
    id: 'stu-08',
    code: 'HV008',
    fullName: 'Bùi Mai Chi',
    gender: 'Nữ',
    birthDate: '2017-08-12',
    phone: '0919228833',
    email: 'maichi.parent@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '77 Võ Thị Sáu, Quận 3, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 16,
    remainingLessons: 8,
    stars: 130,
    status: 'active',
    guardianName: 'Chị Bùi Thanh Trúc',
    guardianPhone: '0919228833',
    joinDate: '2024-01-20',
    notes: 'Học viên chăm chỉ, yêu thích các bản nhạc thiếu nhi.'
  },
  {
    id: 'stu-09',
    code: 'HV009',
    fullName: 'Trịnh Khánh Linh',
    gender: 'Nữ',
    birthDate: '2013-05-14',
    phone: '0938123789',
    email: 'khanhlinh.trinh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '102 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 15,
    remainingLessons: 9,
    stars: 125,
    status: 'active',
    joinDate: '2024-02-10'
  },
  {
    id: 'stu-10',
    code: 'HV010',
    fullName: 'Ngô Thanh Tùng',
    gender: 'Nam',
    birthDate: '2012-09-08',
    phone: '0978112244',
    email: 'thanhtung.ngo@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: '14 Bến Vân Đồn, Quận 4, TP.HCM',
    enrolledSubjects: ['Guitar & Ukulele'],
    enrolledClassIds: ['cls-02'],
    totalLessons: 24,
    completedLessons: 14,
    remainingLessons: 10,
    stars: 115,
    status: 'active',
    joinDate: '2024-03-05'
  },
  {
    id: 'stu-11',
    code: 'HV011',
    fullName: 'Dương Mỹ Uyên',
    gender: 'Nữ',
    birthDate: '2015-12-03',
    phone: '0908776655',
    email: 'myuyen.duong@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '88 Pastuer, Bến Nghé, Quận 1, TP.HCM',
    enrolledSubjects: ['Thanh Nhạc'],
    enrolledClassIds: ['cls-03'],
    totalLessons: 24,
    completedLessons: 13,
    remainingLessons: 11,
    stars: 105,
    status: 'active',
    joinDate: '2024-03-12'
  },
  {
    id: 'stu-12',
    code: 'HV012',
    fullName: 'Lâm Hoàng Nam',
    gender: 'Nam',
    birthDate: '2011-04-22',
    phone: '0912445566',
    email: 'hoangnam.lam@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    address: '25 Lê Thánh Tôn, Quận 1, TP.HCM',
    enrolledSubjects: ['Trống & Bộ Gõ'],
    enrolledClassIds: ['cls-04'],
    totalLessons: 20,
    completedLessons: 11,
    remainingLessons: 9,
    stars: 98,
    status: 'active',
    joinDate: '2024-04-01'
  },
  {
    id: 'stu-13',
    code: 'HV013',
    fullName: 'Huỳnh Gia Bảo',
    gender: 'Nam',
    birthDate: '2016-01-19',
    phone: '0933556677',
    email: 'giabao.huynh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    address: '39 Nguyễn Huệ, Quận 1, TP.HCM',
    enrolledSubjects: ['Violin'],
    enrolledClassIds: ['cls-05'],
    totalLessons: 24,
    completedLessons: 12,
    remainingLessons: 12,
    stars: 95,
    status: 'active',
    joinDate: '2024-04-15'
  },
  {
    id: 'stu-14',
    code: 'HV014',
    fullName: 'Trương Thục Quyên',
    gender: 'Nữ',
    birthDate: '2014-06-30',
    phone: '0966778899',
    email: 'thucquyen.truong@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    address: '112 Trương Định, Quận 3, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 11,
    remainingLessons: 13,
    stars: 88,
    status: 'active',
    joinDate: '2024-05-02'
  },
  {
    id: 'stu-15',
    code: 'HV015',
    fullName: 'Đặng Tuấn Minh',
    gender: 'Nam',
    birthDate: '2013-10-10',
    phone: '0988223311',
    email: 'tuanminh.dang@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '76 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    enrolledSubjects: ['Guitar & Ukulele'],
    enrolledClassIds: ['cls-02'],
    totalLessons: 24,
    completedLessons: 10,
    remainingLessons: 14,
    stars: 82,
    status: 'active',
    joinDate: '2024-05-10'
  },
  {
    id: 'stu-16',
    code: 'HV016',
    fullName: 'Cao Thảo My',
    gender: 'Nữ',
    birthDate: '2015-03-25',
    phone: '0917654321',
    email: 'thaomy.cao@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '54 Đồng Khởi, Quận 1, TP.HCM',
    enrolledSubjects: ['Thanh Nhạc'],
    enrolledClassIds: ['cls-03'],
    totalLessons: 24,
    completedLessons: 9,
    remainingLessons: 15,
    stars: 78,
    status: 'active',
    joinDate: '2024-05-20'
  },
  {
    id: 'stu-17',
    code: 'HV017',
    fullName: 'Phan Quốc Huy',
    gender: 'Nam',
    birthDate: '2012-07-17',
    phone: '0903112233',
    email: 'quochuy.phan@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: '90 Hoàng Diệu, Quận 4, TP.HCM',
    enrolledSubjects: ['Trống & Bộ Gõ'],
    enrolledClassIds: ['cls-04'],
    totalLessons: 20,
    completedLessons: 8,
    remainingLessons: 12,
    stars: 72,
    status: 'active',
    joinDate: '2024-06-01'
  },
  {
    id: 'stu-18',
    code: 'HV018',
    fullName: 'Vương Bảo Trâm',
    gender: 'Nữ',
    birthDate: '2016-11-05',
    phone: '0937889900',
    email: 'baotram.vuong@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    address: '23 Phan Đăng Lưu, Bình Thạnh, TP.HCM',
    enrolledSubjects: ['Violin'],
    enrolledClassIds: ['cls-05'],
    totalLessons: 24,
    completedLessons: 8,
    remainingLessons: 16,
    stars: 68,
    status: 'active',
    joinDate: '2024-06-10'
  },
  {
    id: 'stu-19',
    code: 'HV019',
    fullName: 'Đoàn Nhật Quang',
    gender: 'Nam',
    birthDate: '2014-02-14',
    phone: '0979334455',
    email: 'nhatquang.doan@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    address: '150 Lê Quang Định, Bình Thạnh, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 7,
    remainingLessons: 17,
    stars: 62,
    status: 'active',
    joinDate: '2024-06-18'
  },
  {
    id: 'stu-20',
    code: 'HV020',
    fullName: 'Lương Hoài An',
    gender: 'Nữ',
    birthDate: '2017-09-09',
    phone: '0981223344',
    email: 'hoaian.luong@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    address: '67 Nơ Trang Long, Bình Thạnh, TP.HCM',
    enrolledSubjects: ['Cảm Thụ Âm Nhạc'],
    enrolledClassIds: [],
    totalLessons: 16,
    completedLessons: 7,
    remainingLessons: 9,
    stars: 58,
    status: 'active',
    joinDate: '2024-07-01'
  },
  {
    id: 'stu-21',
    code: 'HV021',
    fullName: 'Tạ Minh Khang',
    gender: 'Nam',
    birthDate: '2013-08-20',
    phone: '0904556677',
    email: 'minhkhang.ta@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    address: '42 Trần Hưng Đạo, Quận 1, TP.HCM',
    enrolledSubjects: ['Guitar & Ukulele'],
    enrolledClassIds: ['cls-02'],
    totalLessons: 24,
    completedLessons: 6,
    remainingLessons: 18,
    stars: 54,
    status: 'active',
    joinDate: '2024-07-10'
  },
  {
    id: 'stu-22',
    code: 'HV022',
    fullName: 'Phùng Hải Yến',
    gender: 'Nữ',
    birthDate: '2015-04-18',
    phone: '0919334411',
    email: 'haiyen.phung@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '18 Nguyễn Trãi, Quận 1, TP.HCM',
    enrolledSubjects: ['Thanh Nhạc'],
    enrolledClassIds: ['cls-03'],
    totalLessons: 24,
    completedLessons: 6,
    remainingLessons: 18,
    stars: 50,
    status: 'active',
    joinDate: '2024-07-15'
  },
  {
    id: 'stu-23',
    code: 'HV023',
    fullName: 'Mai Đức Trọng',
    gender: 'Nam',
    birthDate: '2011-12-12',
    phone: '0938221199',
    email: 'ductrong.mai@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '83 Lý Tự Trọng, Quận 1, TP.HCM',
    enrolledSubjects: ['Trống & Bộ Gõ'],
    enrolledClassIds: ['cls-04'],
    totalLessons: 20,
    completedLessons: 5,
    remainingLessons: 15,
    stars: 45,
    status: 'active',
    joinDate: '2024-07-25'
  },
  {
    id: 'stu-24',
    code: 'HV024',
    fullName: 'Đinh Diễm Quỳnh',
    gender: 'Nữ',
    birthDate: '2016-05-06',
    phone: '0977665544',
    email: 'diemquynh.dinh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '95 Trần Quang Khải, Quận 1, TP.HCM',
    enrolledSubjects: ['Violin'],
    enrolledClassIds: ['cls-05'],
    totalLessons: 24,
    completedLessons: 5,
    remainingLessons: 19,
    stars: 42,
    status: 'active',
    joinDate: '2024-08-01'
  },
  {
    id: 'stu-25',
    code: 'HV025',
    fullName: 'Chu Đình Phong',
    gender: 'Nam',
    birthDate: '2014-09-15',
    phone: '0908119922',
    email: 'dinhphong.chu@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: '12 Võ Văn Tần, Quận 3, TP.HCM',
    enrolledSubjects: ['Piano & Keyboard'],
    enrolledClassIds: ['cls-01'],
    totalLessons: 24,
    completedLessons: 4,
    remainingLessons: 20,
    stars: 38,
    status: 'active',
    joinDate: '2024-08-05'
  },
  {
    id: 'stu-26',
    code: 'HV026',
    fullName: 'Nghiêm Ánh Tuyết',
    gender: 'Nữ',
    birthDate: '2017-02-28',
    phone: '0931223344',
    email: 'anhtuyet.nghiem@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    address: '34 Lê Ngô Cát, Quận 3, TP.HCM',
    enrolledSubjects: ['Cảm Thụ Âm Nhạc'],
    enrolledClassIds: [],
    totalLessons: 16,
    completedLessons: 4,
    remainingLessons: 12,
    stars: 34,
    status: 'active',
    joinDate: '2024-08-10'
  },
  {
    id: 'stu-27',
    code: 'HV027',
    fullName: 'Hà Vĩnh Thụy',
    gender: 'Nam',
    birthDate: '2013-01-11',
    phone: '0961889900',
    email: 'vinhthuy.ha@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    address: '15 Kỳ Đồng, Quận 3, TP.HCM',
    enrolledSubjects: ['Guitar & Ukulele'],
    enrolledClassIds: ['cls-02'],
    totalLessons: 24,
    completedLessons: 3,
    remainingLessons: 21,
    stars: 30,
    status: 'active',
    joinDate: '2024-08-15'
  },
  {
    id: 'stu-28',
    code: 'HV028',
    fullName: 'Trịnh Ngọc Thảo',
    gender: 'Nữ',
    birthDate: '2015-10-04',
    phone: '0989223344',
    email: 'ngocthao.trinh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    address: '78 Bà Huyện Thanh Quan, Quận 3, TP.HCM',
    enrolledSubjects: ['Thanh Nhạc'],
    enrolledClassIds: ['cls-03'],
    totalLessons: 24,
    completedLessons: 3,
    remainingLessons: 21,
    stars: 25,
    status: 'active',
    joinDate: '2024-08-20'
  },
  {
    id: 'stu-29',
    code: 'HV029',
    fullName: 'Quách Tuấn Du',
    gender: 'Nam',
    birthDate: '2012-06-16',
    phone: '0909445566',
    email: 'tuandu.quach@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    address: '50 Phạm Ngọc Thạch, Quận 3, TP.HCM',
    enrolledSubjects: ['Trống & Bộ Gõ'],
    enrolledClassIds: ['cls-04'],
    totalLessons: 20,
    completedLessons: 2,
    remainingLessons: 18,
    stars: 20,
    status: 'active',
    joinDate: '2024-08-25'
  },
  {
    id: 'stu-30',
    code: 'HV030',
    fullName: 'Tô Hồng Ngọc',
    gender: 'Nữ',
    birthDate: '2016-08-08',
    phone: '0918556677',
    email: 'hongngoc.to@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '22 Tú Xương, Quận 3, TP.HCM',
    enrolledSubjects: ['Violin'],
    enrolledClassIds: ['cls-05'],
    totalLessons: 24,
    completedLessons: 2,
    remainingLessons: 22,
    stars: 18,
    status: 'active',
    joinDate: '2024-09-01'
  }
];

// Initial Guardians (PHỤ HUYNH & NGƯỜI GIÁM HỘ)
export const initialGuardians: Guardian[] = [
  {
    id: 'grd-01',
    code: 'PH001',
    fullName: 'Nguyễn Văn Hùng',
    relation: 'Cha',
    phone: '0903889977',
    email: 'phuhuynh.minhanh@gmail.com',
    address: '128 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM',
    linkedStudentIds: ['stu-01', 'stu-06'],
    isPrimaryContact: true,
    isNotificationReceiver: true,
    isTuitionResponsible: true,
    hasUserAccount: true,
    userId: 'usr-parent-1',
    status: 'active',
    createdAt: '2024-02-15',
    notes: 'Phụ huynh của em Minh Anh và Tuấn Kiệt. Rất quan tâm đến tiến độ học tập.'
  },
  {
    id: 'grd-02',
    code: 'PH002',
    fullName: 'Trần Thị Thu Thảo',
    relation: 'Mẹ',
    phone: '0918223344',
    email: 'thuthao.tran@gmail.com',
    address: '45 Lê Văn Sỹ, Phường 13, Quận 3, TP.HCM',
    linkedStudentIds: ['stu-02'],
    isPrimaryContact: true,
    isNotificationReceiver: true,
    isTuitionResponsible: true,
    hasUserAccount: true,
    userId: 'usr-guardian-1',
    status: 'active',
    createdAt: '2024-04-10',
    notes: 'Mẹ của Bảo Nam, đóng học phí qua chuyển khoản QR đúng hạn.'
  },
  {
    id: 'grd-03',
    code: 'PH003',
    fullName: 'Lê Minh Trí',
    relation: 'Cha',
    phone: '0988776655',
    email: 'tri.le@fpt.com.vn',
    address: '89 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    linkedStudentIds: ['stu-03'],
    isPrimaryContact: true,
    isNotificationReceiver: true,
    isTuitionResponsible: true,
    hasUserAccount: false,
    status: 'active',
    createdAt: '2023-10-05'
  },
  {
    id: 'grd-04',
    code: 'PH004',
    fullName: 'Bà Nguyễn Thị Mai',
    relation: 'Bà',
    phone: '0909554433',
    email: 'bamainguyen@gmail.com',
    address: '15 Hoàng Hoa Thám, Bình Thạnh, TP.HCM',
    linkedStudentIds: ['stu-04'],
    isPrimaryContact: true,
    isNotificationReceiver: true,
    isTuitionResponsible: false,
    hasUserAccount: false,
    status: 'active',
    createdAt: '2024-06-01',
    notes: 'Người đưa đón bé Huy đi học mỗi buổi chiều.'
  },
  {
    id: 'grd-05',
    code: 'PH005',
    fullName: 'Phạm Hải Đăng',
    relation: 'Chú',
    phone: '0933112244',
    email: 'haidang.pham@gmail.com',
    address: '202 Hai Bà Trưng, Quận 3, TP.HCM',
    linkedStudentIds: ['stu-05'],
    isPrimaryContact: true,
    isNotificationReceiver: true,
    isTuitionResponsible: true,
    hasUserAccount: false,
    status: 'active',
    createdAt: '2024-01-12'
  }
];

// Initial Classes
export const initialClasses: ClassItem[] = [
  {
    id: 'cls-01',
    code: 'L-PIA02',
    name: 'Lớp Piano Thiếu Nhi 02',
    courseId: 'crs-piano-cb',
    subjectId: 'sub-piano',
    teacherId: 'tch-01',
    teacherName: 'Thầy Nguyễn Văn Minh',
    teacherIds: ['tch-01', 'tch-02'],
    teachers: [
      {
        id: 'ct-01',
        classId: 'cls-01',
        teacherId: 'tch-01',
        teacherName: 'Thầy Nguyễn Văn Minh',
        teacherCode: 'GV001',
        roleInClass: 'lead',
        roleTitle: 'Giáo viên chính',
        subjects: ['Piano & Keyboard'],
        startDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 'ct-02',
        classId: 'cls-01',
        teacherId: 'tch-02',
        teacherName: 'Cô Trần Thị Mai Hương',
        teacherCode: 'GV002',
        roleInClass: 'assistant',
        roleTitle: 'Giáo viên phụ',
        subjects: ['Piano & Keyboard'],
        startDate: '2024-02-01',
        status: 'active'
      }
    ],
    room: 'Phòng Grand Piano A1',
    scheduleText: 'Thứ 2 & Thứ 4 (17:30 - 19:00)',
    daysOfWeek: [1, 3],
    startTime: '17:30',
    endTime: '19:00',
    studentIds: ['stu-01', 'stu-03', 'stu-06'],
    maxStudents: 4,
    status: 'active'
  },
  {
    id: 'cls-02',
    code: 'L-GUI12',
    name: 'Lớp Guitar Đệm Hát K12',
    courseId: 'crs-guitar-dh',
    subjectId: 'sub-guitar',
    teacherId: 'tch-03',
    teacherName: 'Thầy Lê Quốc Bảo',
    teacherIds: ['tch-03'],
    teachers: [
      {
        id: 'ct-03',
        classId: 'cls-02',
        teacherId: 'tch-03',
        teacherName: 'Thầy Lê Quốc Bảo',
        teacherCode: 'GV003',
        roleInClass: 'lead',
        roleTitle: 'Giáo viên chính',
        subjects: ['Guitar & Ukulele'],
        startDate: '2024-01-15',
        status: 'active'
      }
    ],
    room: 'Phòng Acoustic Studio B2',
    scheduleText: 'Thứ 3 & Thứ 5 (18:30 - 20:00)',
    daysOfWeek: [2, 4],
    startTime: '18:30',
    endTime: '20:00',
    studentIds: ['stu-02'],
    maxStudents: 6,
    status: 'active'
  },
  {
    id: 'cls-03',
    code: 'L-VOC04',
    name: 'Lớp Thanh Nhạc Cơ Bản V04',
    courseId: 'crs-vocal-pro',
    subjectId: 'sub-vocal',
    teacherId: 'tch-02',
    teacherName: 'Cô Trần Thị Mai Hương',
    teacherIds: ['tch-02', 'tch-01'],
    teachers: [
      {
        id: 'ct-04',
        classId: 'cls-03',
        teacherId: 'tch-02',
        teacherName: 'Cô Trần Thị Mai Hương',
        teacherCode: 'GV002',
        roleInClass: 'lead',
        roleTitle: 'Giáo viên chính',
        subjects: ['Thanh Nhạc'],
        startDate: '2024-02-01',
        status: 'active'
      },
      {
        id: 'ct-05',
        classId: 'cls-03',
        teacherId: 'tch-01',
        teacherName: 'Thầy Nguyễn Văn Minh',
        teacherCode: 'GV001',
        roleInClass: 'specialist',
        roleTitle: 'Cố vấn chuyên môn',
        subjects: ['Thanh Nhạc'],
        startDate: '2024-02-01',
        status: 'active'
      }
    ],
    room: 'Phòng Cách Âm Vocal C1',
    scheduleText: 'Thứ 7 & Chủ Nhật (09:00 - 10:30)',
    daysOfWeek: [6, 7],
    startTime: '09:00',
    endTime: '10:30',
    studentIds: ['stu-03'],
    maxStudents: 3,
    status: 'active'
  },
  {
    id: 'cls-04',
    code: 'L-DRU02',
    name: 'Lớp Trống Jazz D02',
    courseId: 'crs-drum-pop',
    subjectId: 'sub-drum',
    teacherId: 'tch-05',
    teacherName: 'Thầy Hoàng Trọng Nam',
    teacherIds: ['tch-05'],
    teachers: [
      {
        id: 'ct-06',
        classId: 'cls-04',
        teacherId: 'tch-05',
        teacherName: 'Thầy Hoàng Trọng Nam',
        teacherCode: 'GV005',
        roleInClass: 'lead',
        roleTitle: 'Giáo viên chính',
        subjects: ['Trống & Bộ Gõ'],
        startDate: '2024-03-01',
        status: 'active'
      }
    ],
    room: 'Phòng Trống Studio D1',
    scheduleText: 'Thứ 6 (18:00 - 19:30)',
    daysOfWeek: [5],
    startTime: '18:00',
    endTime: '19:30',
    studentIds: ['stu-04'],
    maxStudents: 2,
    status: 'active'
  },
  {
    id: 'cls-05',
    code: 'L-VIO01',
    name: 'Lớp Violin Nhí 01',
    courseId: 'crs-violin-kid',
    subjectId: 'sub-violin',
    teacherId: 'tch-04',
    teacherName: 'Cô Phạm Ngọc Linh',
    teacherIds: ['tch-04'],
    teachers: [
      {
        id: 'ct-07',
        classId: 'cls-05',
        teacherId: 'tch-04',
        teacherName: 'Cô Phạm Ngọc Linh',
        teacherCode: 'GV004',
        roleInClass: 'lead',
        roleTitle: 'Giáo viên chính',
        subjects: ['Violin'],
        startDate: '2024-03-10',
        status: 'active'
      }
    ],
    room: 'Phòng Hòa Tấu Vĩ Cầm A2',
    scheduleText: 'Thứ Bảy (15:00 - 16:30)',
    daysOfWeek: [6],
    startTime: '15:00',
    endTime: '16:30',
    studentIds: ['stu-05'],
    maxStudents: 4,
    status: 'active'
  }
];

// Initial User Accounts with Multi-Role Architecture
export const initialUserAccounts: UserAccount[] = [
  {
    uid: 'usr-admin-1',
    email: 'minhmusic1510@gmail.com',
    displayName: 'Thầy Nguyễn Văn Minh',
    phone: '0908151088',
    role: 'ADMIN',
    roles: ['ADMIN', 'TEACHER'],
    primaryRole: 'ADMIN',
    status: 'active',
    profileId: 'tch-01',
    teacherProfileId: 'tch-01',
    profileCode: 'GV001',
    profileName: 'Thầy Nguyễn Văn Minh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-01',
    lastLoginAt: 'Vừa xong',
    note: 'Tài khoản Đa vai trò (ADMIN + TEACHER). Thầy Minh có thể chuyển đổi linh hoạt giữa chế độ Quản trị và Giảng dạy.'
  },
  {
    uid: 'usr-teacher-1',
    email: 'huong.tran@minhmusic.vn',
    displayName: 'Cô Mai Hương',
    phone: '0912345678',
    role: 'TEACHER',
    roles: ['TEACHER'],
    primaryRole: 'TEACHER',
    status: 'active',
    profileId: 'tch-02',
    teacherProfileId: 'tch-02',
    profileCode: 'GV002',
    profileName: 'Cô Trần Thị Mai Hương',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-10',
    lastLoginAt: '2 giờ trước',
    note: 'Giáo viên bộ môn Thanh nhạc & Piano.'
  },
  {
    uid: 'usr-teacher-2',
    email: 'bao.le@minhmusic.vn',
    displayName: 'Thầy Quốc Bảo',
    phone: '0933988776',
    role: 'TEACHER',
    roles: ['TEACHER'],
    primaryRole: 'TEACHER',
    status: 'active',
    profileId: 'tch-03',
    teacherProfileId: 'tch-03',
    profileCode: 'GV003',
    profileName: 'Thầy Lê Quốc Bảo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15',
    lastLoginAt: 'Hôm qua'
  },
  {
    uid: 'usr-student-1',
    email: 'minhanh.student@minhmusic.vn',
    displayName: 'Nguyễn Minh Anh',
    phone: '0909112233',
    role: 'STUDENT',
    roles: ['STUDENT'],
    primaryRole: 'STUDENT',
    status: 'active',
    profileId: 'stu-01',
    studentProfileId: 'stu-01',
    profileCode: 'HV001',
    profileName: 'Nguyễn Minh Anh',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-15',
    lastLoginAt: 'Hôm nay lúc 08:30'
  },
  {
    uid: 'usr-student-2',
    email: 'baonam@gmail.com',
    displayName: 'Trần Bảo Nam',
    phone: '0934567890',
    role: 'STUDENT',
    roles: ['STUDENT'],
    primaryRole: 'STUDENT',
    status: 'active',
    profileId: 'stu-02',
    studentProfileId: 'stu-02',
    profileCode: 'HV002',
    profileName: 'Trần Bảo Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-04-10',
    lastLoginAt: '3 ngày trước'
  },
  {
    uid: 'usr-parent-1',
    email: 'phuhuynh.minhanh@gmail.com',
    displayName: 'Nguyễn Văn Hùng (PH)',
    phone: '0903889977',
    role: 'PARENT',
    roles: ['PARENT'],
    primaryRole: 'PARENT',
    status: 'active',
    profileId: 'grd-01',
    guardianProfileId: 'grd-01',
    profileCode: 'PH001',
    profileName: 'Nguyễn Văn Hùng',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-16',
    lastLoginAt: 'Hôm qua',
    note: 'Phụ huynh của em Minh Anh & Tuấn Kiệt.'
  },
  {
    uid: 'usr-guardian-1',
    email: 'thuthao.tran@gmail.com',
    displayName: 'Trần Thị Thu Thảo (Giám hộ)',
    phone: '0918223344',
    role: 'GUARDIAN',
    roles: ['GUARDIAN'],
    primaryRole: 'GUARDIAN',
    status: 'active',
    profileId: 'grd-02',
    guardianProfileId: 'grd-02',
    profileCode: 'PH002',
    profileName: 'Trần Thị Thu Thảo',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-04-12',
    lastLoginAt: '5 ngày trước'
  },
  {
    uid: 'usr-pending-1',
    email: 'lethanhtam.guest@gmail.com',
    displayName: 'Lê Thanh Tâm',
    phone: '0945678123',
    role: 'PARENT',
    roles: ['PARENT'],
    primaryRole: 'PARENT',
    status: 'pending',
    createdAt: '2024-08-14',
    note: 'Đăng ký trực tuyến từ cổng /register, đang chờ Admin duyệt và gán hồ sơ học viên.'
  }
];

// Initial Birthday Templates
export const initialBirthdayTemplates: BirthdayTemplate[] = [
  {
    id: 'bdt-01',
    title: 'Chúc Mừng Sinh Nhật Học Viên Nhí (Piano & Âm Nhạc)',
    content: '🎉 Chúc mừng sinh nhật {name}! Chúc em tuổi mới luôn vui vẻ, rạng rỡ và bay bổng cùng những giai điệu tuyệt vời tại Minh Music Center nhé! 🎂🎹✨',
    targetAudience: 'STUDENT',
    isDefault: true
  },
  {
    id: 'bdt-02',
    title: 'Chúc Mừng Sinh Nhật Học Viên Guitar / Trống',
    content: '🎸 Rock on {name}! Chúc mừng sinh nhật tuổi {age} thật rực rỡ! Chúc em luôn giữ vững ngọn lửa đam mê âm nhạc và chinh phục thêm nhiều bài hát đỉnh cao! 🎶🔥',
    targetAudience: 'STUDENT'
  },
  {
    id: 'bdt-03',
    title: 'Chúc Mừng Sinh Nhật Thầy Cô Giáo Viên',
    content: '💐 Minh Music Center thân chúc {name} một ngày sinh nhật thật ấm áp và tràn đầy niềm vui! Cảm ơn Thầy/Cô đã luôn tận tâm truyền cảm hứng âm nhạc cho các thế hệ học viên! 🎂🎼❤️',
    targetAudience: 'TEACHER',
    isDefault: true
  },
  {
    id: 'bdt-04',
    title: 'Chúc Mừng Sinh Nhật Phụ Huynh',
    content: '🌸 Kính chúc Quý Phụ huynh {name} sinh nhật ngập tràn hạnh phúc, an khang và nhiều niềm vui bên gia đình cùng các con! Cảm ơn Quý Phụ huynh đã luôn đồng hành cùng Minh Music! 🎁🍰',
    targetAudience: 'ALL'
  }
];

// Initial Assignments (Phân theo từng học viên & trình độ cá nhân)
export const initialAssignments: Assignment[] = [
  {
    id: 'asn-01',
    studentId: 'std-01',
    studentName: 'Nguyễn Gia Hân',
    studentLevel: 'Trung cấp (Grade 3-4)',
    subjectName: 'Piano Cổ Điển',
    teacherId: 'tch-01',
    teacherName: 'Thầy Hoàng Minh',
    classId: 'cls-01',
    className: 'Piano Cơ Bản A1',
    title: 'Luyện ngón Hanon No.1 & Tiểu phẩm Sonatina Op.36 No.1',
    description: 'Tập trung thế tay cong tròn ngón cái & ngón út, giữ nhịp Metronome đều đặn. Quay video 1-2 phút góc quay rõ bàn tay gửi lên hệ thống trước buổi học.',
    targetBpm: 76,
    customNotes: 'Gia Hân cần chú ý không gãy đốt ngón tay trỏ tay trái khi bấm hợp âm rải ở ô nhịp 8.',
    sheetMusicUrl: 'https://example.com/sheets/sonatina-clementi-op36.pdf',
    audioUrl: 'https://example.com/audio/sonatina-op36-demo.mp3',
    bonusStars: 5,
    rewardPoints: 15,
    maxScore: 10,
    dueDate: getRelativeDate(3),
    createdAt: getRelativeDate(-2)
  },
  {
    id: 'asn-02',
    studentId: 'std-02',
    studentName: 'Trần Bảo Nam',
    studentLevel: 'Cơ bản (Grade 1-2)',
    subjectName: 'Acoustic Guitar',
    teacherId: 'tch-03',
    teacherName: 'Thầy Quang Huy',
    classId: 'cls-02',
    className: 'Guitar Đệm Hát K2',
    title: 'Chuyển hợp âm C - Am - F - G7 kết hợp điệu Ballad 4/4',
    description: 'Tập quạt chả điệu Ballad chậm rãi, chuyển thế ngón chặn F Major dứt khoát không bị rè dây.',
    targetBpm: 68,
    customNotes: 'Bảo Nam cần tì ngón tay cái phía sau lưng cần đàn thấp hơn để bấm thế F dễ hơn.',
    bonusStars: 5,
    rewardPoints: 10,
    maxScore: 10,
    dueDate: getRelativeDate(2),
    createdAt: getRelativeDate(-3)
  },
  {
    id: 'asn-03',
    studentId: 'std-03',
    studentName: 'Lê Minh Khôi',
    studentLevel: 'Vỡ lòng',
    subjectName: 'Piano Mầm Non',
    teacherId: 'tch-02',
    teacherName: 'Cô Thu Hương',
    title: 'Nhận diện nốt Đồ - Rê - Mi khóa Sol & Bài hát Con Cào Cào',
    description: 'Đọc to tên nốt nhạc theo nhịp vỗ tay và đàn bằng tay phải 5 ngón độc lập.',
    targetBpm: 60,
    customNotes: 'Minh Khôi nhớ ngồi thẳng lưng và điều chỉnh khoảng cách ghế vừa tầm tay.',
    bonusStars: 5,
    rewardPoints: 15,
    maxScore: 10,
    dueDate: getRelativeDate(4),
    createdAt: getRelativeDate(-1)
  },
  {
    id: 'asn-04',
    studentId: 'std-04',
    studentName: 'Phạm Quỳnh Anh',
    studentLevel: 'Nâng cao (Grade 5+)',
    subjectName: 'Thanh Nhạc',
    teacherId: 'tch-04',
    teacherName: 'Cô Khánh Linh',
    title: 'Luyện mở khẩu hình vòm họng & Bài luyện thanh Arpeggio Nữ Cao',
    description: 'Tập bài tập lấy hơi bụng (cơ hoành), thả lỏng hàm dưới và phát âm nguyên âm A - E - I tròn vành rõ chữ.',
    customNotes: 'Quỳnh Anh hạn chế gồng cổ khi lên các nốt cao từ Sol 4 trở lên.',
    bonusStars: 8,
    rewardPoints: 20,
    maxScore: 10,
    dueDate: getRelativeDate(5),
    createdAt: getRelativeDate(-1)
  }
];

// Initial Submissions (Bài nộp của học viên)
export const initialSubmissions: Submission[] = [
  {
    id: 'sub-01',
    assignmentId: 'asn-01',
    studentId: 'std-01',
    studentName: 'Nguyễn Gia Hân',
    submittedAt: getRelativeDate(-1) + ' 19:30',
    mediaUrl: 'https://youtube.com/shorts/sample-piano-practice',
    notes: 'Con đã tập được bài Sonatina tốc độ 76 theo nhịp Metronome. Đoạn cuối con bấm còn hơi vấp một chút.',
    teacherFeedback: 'Thế tay của Gia Hân rất đẹp và thả lỏng tốt. Cần chú ý giữ đều nhịp ở ô nhịp số 8. Thầy thưởng con 5 Sao và 15 Điểm thưởng!',
    grade: '9.5/10 (Xuất sắc)',
    score: 9.5,
    starsAwarded: 5,
    rewardPointsAwarded: 15,
    status: 'graded'
  },
  {
    id: 'sub-02',
    assignmentId: 'asn-02',
    studentId: 'std-02',
    studentName: 'Trần Bảo Nam',
    submittedAt: getRelativeDate(0) + ' 14:15',
    mediaUrl: 'https://drive.google.com/file/d/sample-guitar-recording',
    notes: 'Thầy xem giúp em đoạn chuyển từ Am sang F ngón trỏ có bị cong quá không ạ.',
    status: 'pending'
  }
];

// Initial Reward Items (Đổi Quà)
export const initialRewards: RewardItem[] = [
  {
    id: 'rwd-01',
    name: 'Giáo trình Alfred Basic Piano Level 1A',
    pointsRequired: 80,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=80',
    description: 'Giáo trình Piano tiêu chuẩn quốc tế có đĩa CD audio đi kèm.',
    category: 'Giáo trình'
  },
  {
    id: 'rwd-02',
    name: 'Kẹp Capo Hợp Kim Cao Cấp Alice A007',
    pointsRequired: 50,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&auto=format&fit=crop&q=80',
    description: 'Capo đệm mút silicone bảo vệ cần đàn guitar tuyệt đối.',
    category: 'Nhạc cụ & Phụ kiện'
  },
  {
    id: 'rwd-03',
    name: 'Áo Phông Đồng Phục Minh Music (Chất Cotton 100%)',
    pointsRequired: 120,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
    description: 'Áo thun năng động in logo Minh Music cao cấp, đủ size cho học viên.',
    category: 'Quà lưu niệm'
  },
  {
    id: 'rwd-04',
    name: 'Voucher Học Phí 500.000 VNĐ Khóa Tiếp Theo',
    pointsRequired: 300,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1556742049-0a67e557b6aa?w=300&auto=format&fit=crop&q=80',
    description: 'Áp dụng trừ trực tiếp vào học phí gia hạn khóa học bất kỳ.',
    category: 'Voucher'
  }
];

// Initial Tuition Payments
export const initialTuitionPayments: TuitionPayment[] = [
  {
    id: 'tui-01',
    code: 'HP-2025-001',
    studentId: 'stu-01',
    studentCode: 'HV001',
    studentName: 'Nguyễn Minh Anh',
    guardianId: 'grd-01',
    guardianName: 'Nguyễn Văn Hùng',
    courseId: 'crs-piano-cb',
    courseName: 'Piano Cơ Bản Toàn Diện',
    subjectName: 'Piano & Keyboard',
    billingMonth: 'Tháng 03/2025',
    sessionsCount: 24,
    amount: 4800000,
    paidAmount: 4800000,
    paymentDate: '2025-03-01',
    dueDate: '2025-03-05',
    paymentMethod: 'VietQR',
    status: 'paid',
    transferSyntax: 'HV001 - Piano - Thang 03',
    invoiceNote: 'Đã thanh toán đủ học phí khóa Piano Cơ Bản 24 buổi.'
  },
  {
    id: 'tui-02',
    code: 'HP-2025-002',
    studentId: 'stu-02',
    studentCode: 'HV002',
    studentName: 'Trần Bảo Nam',
    guardianId: 'grd-02',
    guardianName: 'Trần Thị Thu Thảo',
    courseId: 'crs-guitar-dh',
    courseName: 'Guitar Đệm Hát Thực Chiến',
    subjectName: 'Guitar & Ukulele',
    billingMonth: 'Tháng 03/2025',
    sessionsCount: 24,
    amount: 3900000,
    paidAmount: 3900000,
    paymentDate: '2025-03-05',
    dueDate: '2025-03-10',
    paymentMethod: 'Chuyển khoản',
    status: 'paid',
    transferSyntax: 'HV002 - Guitar - Thang 03',
    invoiceNote: 'Học phí Guitar Đệm Hát K12.'
  },
  {
    id: 'tui-03',
    code: 'HP-2025-003',
    studentId: 'stu-05',
    studentCode: 'HV005',
    studentName: 'Phạm Ngọc Hân',
    guardianId: 'grd-05',
    guardianName: 'Phạm Hải Đăng',
    courseId: 'crs-violin-kid',
    courseName: 'Violin Nhí Khám Phá',
    subjectName: 'Violin',
    billingMonth: 'Tháng 03/2025',
    sessionsCount: 24,
    amount: 4800000,
    paidAmount: 2400000,
    paymentDate: '2025-03-08',
    dueDate: '2025-03-25',
    paymentMethod: 'VietQR',
    status: 'pending',
    transferSyntax: 'HV005 - Violin - Thang 03',
    invoiceNote: 'Học phí đợt 2: 2.400.000 VNĐ cần nộp trước 25/03.'
  },
  {
    id: 'tui-04',
    code: 'HP-2025-004',
    studentId: 'stu-03',
    studentCode: 'HV003',
    studentName: 'Lê Phương Linh',
    guardianId: 'grd-03',
    guardianName: 'Lê Minh Trí',
    courseId: 'crs-vocal-pro',
    courseName: 'Thanh Nhạc Biểu Diễn Chuyên Sâu',
    subjectName: 'Thanh Nhạc',
    billingMonth: 'Tháng 03/2025',
    sessionsCount: 24,
    amount: 5500000,
    paidAmount: 0,
    dueDate: '2025-03-28',
    paymentMethod: 'VietQR',
    status: 'pending',
    transferSyntax: 'HV003 - Thanh Nhac - Thang 03',
    invoiceNote: 'Học phí khóa Thanh nhạc nâng cao kỳ mới.'
  }
];

// Initial Reservations (Hồ sơ bảo lưu)
export const initialReservations: import('../types').ReservationRecord[] = [
  {
    id: 'res-01',
    studentId: 'stu-07',
    studentName: 'Hoàng Đức Anh',
    classId: 'cls-02',
    className: 'Lớp Guitar Đệm Hát K12',
    subjectName: 'Guitar & Ukulele',
    startDate: '2025-03-01',
    endDate: '2025-05-01',
    sessionsRemaining: 14,
    remainingLessonsHeld: 14,
    reason: 'Gia đình chuyển công tác ngắn hạn 2 tháng ra Hà Nội',
    status: 'active',
    approvedDate: '2025-02-28',
    notes: 'Đã bảo toàn 14 buổi học và 65 sao thưởng cho học viên.',
    createdAt: '2025-02-27'
  }
];

// Initial Trial Lessons (Lịch học thử & Học viên học thử)
export const initialTrialLessons: import('../types').TrialLesson[] = [
  {
    id: 'trial-01',
    studentId: 'stu-08',
    studentCode: 'HT001',
    studentName: 'Bùi Mai Chi',
    phone: '0919228833',
    email: 'maichi.parent@gmail.com',
    subjectId: 'sub-piano',
    subjectName: 'Piano & Keyboard',
    preferredDate: '2025-03-22',
    preferredTime: '09:00 - 10:00',
    teacherId: 'tch-01',
    teacherName: 'Thầy Nguyễn Văn Minh',
    guardianName: 'Chị Bùi Thanh Trúc',
    guardianPhone: '0919228833',
    status: 'scheduled',
    notes: 'Bé 7.5 tuổi, phụ huynh muốn test năng khiếu và làm quen phím đàn.',
    createdAt: '2025-03-15'
  }
];

// Initial Notifications
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    title: '🎂 Nhắc nhở sinh nhật hôm nay (Nội bộ BQL & Giáo viên)',
    content: 'Hôm nay là sinh nhật của học viên Nguyễn Minh Anh (Lớp Piano 02) và Cô Mai Hương. Hãy gửi thiệp chúc mừng tạo bất ngờ nhé!',
    type: 'birthday',
    targetRoles: ['ADMIN', 'TEACHER'],
    createdAt: 'Hôm nay 07:00',
    isRead: false
  },
  {
    id: 'notif-02',
    title: '🎼 Lịch biểu diễn báo cáo cuối khóa Hè',
    content: 'Trung tâm Minh Music trân trọng thông báo buổi hòa nhạc báo cáo tài năng sẽ diễn ra vào cuối tháng.',
    type: 'system',
    targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'GUARDIAN'],
    createdAt: 'Hôm qua',
    isRead: false
  }
];

export const initialBranding: import('../types').TenantBranding = {
  id: 'tenant-main',
  tenantCode: 'MINH-MUSIC-HQ',
  centerName: 'MINH MUSIC',
  subName: 'CENTER',
  slogan: 'Hệ thống Quản lý Trung tâm Âm nhạc Toàn diện',
  logoType: 'icon',
  logoIcon: 'Music',
  logoUrl: '',
  primaryColor: '#d97706', // amber-600
  secondaryColor: '#e11d48', // rose-600
  accentColor: '#4338ca', // indigo-700
  headerGradientFrom: '#d97706',
  headerGradientTo: '#4338ca',
  brandTagBg: '#fef3c7',
  brandTagText: '#92400e',
  syncToAllTenants: true,
  hotline: '0901.888.999',
  supportEmail: 'contact@minhmusic.vn',
  address: '123 Đường Âm Nhạc, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  website: 'https://minhmusic.vn',
  updatedAt: '2025-03-01',
  bankAccount: {
    bankId: 'MBBank',
    bankCode: '970422',
    accountNumber: '0901888999',
    accountHolder: 'TRUNG TAM AM NHAC MINH MUSIC',
    branchName: 'Chi nhánh Sài Gòn - TP.HCM',
    customQrUrl: '',
    useCustomQr: false,
    memoFormat: 'CODE_SUBJECT_MONTH'
  }
};

export const initialBranches: import('../types').TenantBranch[] = [
  {
    id: 'branch-01',
    code: 'MM-Q1',
    name: 'Trụ Sở Chính - Minh Music Center',
    address: '123 Đường Âm Nhạc, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    phone: '0901.888.999',
    email: 'contact@minhmusic.vn',
    isMainBranch: true,
    googleMapsUrl: 'https://maps.app.goo.gl/cCs2t8VuaE9JBNMD9?g_st=ac',
    latitude: 10.7769,
    longitude: 106.7009,
    openingHours: '08:00 - 21:30 (Thứ 2 - Chủ Nhật)',
    managerName: 'Thầy Lê Quang Minh',
    managerPhone: '0901.888.999',
    facilities: ['Phòng Grand Piano Kawai', 'Phòng Organ/Keyboard', 'Phòng Thu âm & Acoustic', 'Bãi đỗ ô tô & xe máy', 'Máy lạnh 24/7', 'Wifi tốc độ cao'],
    imageUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=800&auto=format&fit=crop&q=80',
    notes: 'Trụ sở trung tâm điều hành chính với 6 phòng học đạt chuẩn âm học'
  },
  {
    id: 'branch-02',
    code: 'MM-TD',
    name: 'Cơ Sở 2 - Minh Music Studio Thảo Điền',
    address: '456 Đường Giai Điệu, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
    phone: '0902.777.888',
    email: 'cso2@minhmusic.vn',
    isMainBranch: false,
    googleMapsUrl: 'https://maps.google.com/?q=Thao+Dien+Thu+Duc+Ho+Chi+Minh',
    latitude: 10.8033,
    longitude: 106.7321,
    openingHours: '08:30 - 21:00 (Thứ 2 - Thứ 7)',
    managerName: 'Cô Nguyễn Thu Hà',
    managerPhone: '0902.777.888',
    facilities: ['Phòng Piano Upright Yamaha', 'Phòng Guitar & Ukulele', 'Không gian Cafe âm nhạc sân vườn', 'Bãi đỗ xe rộng rãi'],
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    notes: 'Chi nhánh phong cách studio sáng tạo dành cho học viên khu vực Đông Sài Gòn'
  },
  {
    id: 'branch-03',
    code: 'MM-BT',
    name: 'Cơ Sở 3 - Minh Music Academy Bình Thạnh',
    address: '789 Đường Hòa Âm, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    phone: '0903.666.555',
    email: 'cso3@minhmusic.vn',
    isMainBranch: false,
    googleMapsUrl: 'https://maps.google.com/?q=Binh+Thanh+Ho+Chi+Minh',
    latitude: 10.8015,
    longitude: 106.7118,
    openingHours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
    managerName: 'Thầy Trần Đức Anh',
    managerPhone: '0903.666.555',
    facilities: ['Phòng Thanh Nhạc Chuyên Sâu', 'Phòng Piano Trẻ Em', 'Khu chờ phụ huynh thoáng mát'],
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    notes: 'Trung tâm đào tạo thanh nhạc và piano nền tảng cho mọi lứa tuổi'
  }
];

export interface BrandingPreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerGradientFrom: string;
  headerGradientTo: string;
  brandTagBg: string;
  brandTagText: string;
  logoIcon: import('../types').TenantBranding['logoIcon'];
}

export const BRANDING_PRESETS: BrandingPreset[] = [
  {
    id: 'amber-gold',
    name: 'Minh Music Vàng Hoàng Gia (Mặc định)',
    description: 'Tone Vàng Hổ Phách & Tím Chàm sang trọng, ấm áp',
    primaryColor: '#d97706',
    secondaryColor: '#e11d48',
    accentColor: '#4338ca',
    headerGradientFrom: '#d97706',
    headerGradientTo: '#4338ca',
    brandTagBg: '#fef3c7',
    brandTagText: '#92400e',
    logoIcon: 'Music'
  },
  {
    id: 'royal-indigo',
    name: 'Học Viện Indigo Quý Phái',
    description: 'Tone Xanh Chàm & Hồng Thạch Lựu hiện đại, chuyên nghiệp',
    primaryColor: '#4f46e5',
    secondaryColor: '#ec4899',
    accentColor: '#0284c7',
    headerGradientFrom: '#4f46e5',
    headerGradientTo: '#ec4899',
    brandTagBg: '#e0e7ff',
    brandTagText: '#3730a3',
    logoIcon: 'Sparkles'
  },
  {
    id: 'emerald-academy',
    name: 'Nhạc Viện Ngọc Lục Bảo (Emerald)',
    description: 'Tone Xanh Ngọc & Vàng Gold nghệ thuật, tươi mới',
    primaryColor: '#059669',
    secondaryColor: '#d97706',
    accentColor: '#0f766e',
    headerGradientFrom: '#059669',
    headerGradientTo: '#0f766e',
    brandTagBg: '#d1fae5',
    brandTagText: '#065f46',
    logoIcon: 'GraduationCap'
  },
  {
    id: 'crimson-ruby',
    name: 'Hòa Nhạc Ruby & Rose Velvet',
    description: 'Tone Đỏ Rượu Vang & Cam Lửa nhiệt huyết, rực rỡ',
    primaryColor: '#dc2626',
    secondaryColor: '#ea580c',
    accentColor: '#9333ea',
    headerGradientFrom: '#dc2626',
    headerGradientTo: '#ea580c',
    brandTagBg: '#fee2e2',
    brandTagText: '#991b1b',
    logoIcon: 'Award'
  },
  {
    id: 'midnight-violet',
    name: 'Không Gian Âm Nhạc Violet Huyền Bí',
    description: 'Tone Tím Mộng Mơ & Xanh Biển sâu lắng, truyền cảm hứng',
    primaryColor: '#7c3aed',
    secondaryColor: '#2563eb',
    accentColor: '#db2777',
    headerGradientFrom: '#7c3aed',
    headerGradientTo: '#2563eb',
    brandTagBg: '#ede9fe',
    brandTagText: '#5b21b6',
    logoIcon: 'Headphones'
  },
  {
    id: 'ocean-cyan',
    name: 'Giai Điệu Đại Dương (Ocean Symphony)',
    description: 'Tone Xanh Dương Sâu & Lam Ngọc trong trẻo',
    primaryColor: '#0284c7',
    secondaryColor: '#0d9488',
    accentColor: '#6366f1',
    headerGradientFrom: '#0284c7',
    headerGradientTo: '#0d9488',
    brandTagBg: '#e0f2fe',
    brandTagText: '#075985',
    logoIcon: 'Radio'
  }
];

// Initial Student-Guardian Links with granular permission scoping
export const initialStudentGuardianLinks: import('../types').StudentGuardianLink[] = [
  {
    id: 'sgl-01',
    studentId: 'stu-01',
    studentName: 'Nguyễn Minh Anh',
    guardianId: 'grd-01',
    guardianName: 'Nguyễn Văn Hùng',
    relationship: 'Cha',
    canViewLearning: true,
    canViewPayments: true,
    canSubmitPayments: true,
    canRequestScheduleChange: true,
    canRequestReservation: true,
    canRegisterCourses: true,
    canRedeemRewards: true,
    receiveNotifications: true,
    isPrimary: true,
    status: 'active',
    createdAt: '2024-02-16',
    notes: 'Phụ huynh trực tiếp giám hộ toàn quyền'
  },
  {
    id: 'sgl-02',
    studentId: 'stu-06',
    studentName: 'Vũ Tuấn Kiệt',
    guardianId: 'grd-01',
    guardianName: 'Nguyễn Văn Hùng',
    relationship: 'Bác',
    canViewLearning: true,
    canViewPayments: true,
    canSubmitPayments: true,
    canRequestScheduleChange: true,
    canRequestReservation: true,
    canRegisterCourses: true,
    canRedeemRewards: false,
    receiveNotifications: true,
    isPrimary: false,
    status: 'active',
    createdAt: '2024-03-01',
    notes: 'Người giám hộ kiêm người thanh toán học phí'
  },
  {
    id: 'sgl-03',
    studentId: 'stu-02',
    studentName: 'Trần Bảo Nam',
    guardianId: 'grd-02',
    guardianName: 'Trần Thị Thu Thảo',
    relationship: 'Mẹ',
    canViewLearning: true,
    canViewPayments: true,
    canSubmitPayments: true,
    canRequestScheduleChange: true,
    canRequestReservation: true,
    canRegisterCourses: true,
    canRedeemRewards: true,
    receiveNotifications: true,
    isPrimary: true,
    status: 'active',
    createdAt: '2024-04-12'
  }
];

// Initial Registration Requests (Subject/Package/Course/Class)
export const initialRegistrationRequests: import('../types').RegistrationRequest[] = [
  {
    id: 'reg-req-01',
    type: 'COURSE',
    targetId: 'crs-piano-cb',
    targetName: 'Khóa Học Piano Nền Tảng K24',
    studentId: 'stu-01',
    studentName: 'Nguyễn Minh Anh',
    guardianId: 'grd-01',
    guardianName: 'Nguyễn Văn Hùng',
    requestedDate: '2025-03-20',
    note: 'Học viên muốn học nâng cao thêm vào cuối tuần',
    status: 'pending'
  },
  {
    id: 'reg-req-02',
    type: 'CLASS',
    targetId: 'cls-03',
    targetName: 'Lớp Thanh Nhạc Cơ Bản V04',
    studentId: 'stu-02',
    studentName: 'Trần Bảo Nam',
    guardianId: 'grd-02',
    guardianName: 'Trần Thị Thu Thảo',
    requestedDate: '2025-03-22',
    note: 'Đăng ký lớp Thanh nhạc cho bé Nam vào cuối tuần',
    status: 'approved',
    reviewedBy: 'Admin Minh',
    reviewedAt: '2025-03-23'
  }
];

// Initial Schedule Change Requests
export const initialScheduleChangeRequests: import('../types').ScheduleChangeRequest[] = [
  {
    id: 'scr-01',
    studentId: 'stu-01',
    studentName: 'Nguyễn Minh Anh',
    currentClassId: 'cls-01',
    currentClassName: 'Lớp Piano Thiếu Nhi 02',
    currentScheduleDate: 'Thứ 2 & Thứ 4 (17:30 - 19:00)',
    targetClassId: 'cls-03',
    targetClassName: 'Lớp Thanh Nhạc Cơ Bản V04',
    desiredScheduleDate: 'Thứ 7 & Chủ Nhật (09:00 - 10:30)',
    reason: 'Do học viên bận học thêm văn hóa buổi chiều thứ 2',
    status: 'pending',
    createdAt: '2025-03-22'
  }
];

// Initial Payment Submissions (VietQR confirmation slips)
export const initialPaymentSubmissions: import('../types').PaymentSubmission[] = [
  {
    id: 'ps-01',
    tuitionPaymentId: 'pay-01',
    studentId: 'stu-01',
    studentName: 'Nguyễn Minh Anh',
    amount: 1800000,
    transferSyntax: 'HV001 NGUYEN MINH ANH HP THANG 03',
    receiptProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    notes: 'Đã chuyển khoản qua app Vietcombank lúc 10h15',
    submittedAt: '2025-03-22 10:15',
    status: 'pending'
  }
];


