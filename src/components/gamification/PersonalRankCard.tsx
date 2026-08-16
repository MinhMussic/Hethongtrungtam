import React from 'react';
import { Star, Trophy, Award, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface PersonalRankCardProps {
  studentId: string;
  onOpenLeaderboard?: () => void;
  onOpenCertificate?: () => void;
  className?: string;
}

export const PersonalRankCard: React.FC<PersonalRankCardProps> = ({
  studentId,
  onOpenLeaderboard,
  onOpenCertificate,
  className = ''
}) => {
  const { starLeaderboard, students } = useData();

  const student = students.find(s => s.id === studentId) || students[0];
  const allLeaderboard = starLeaderboard || [];
  
  // Find current student rank
  const studentRankIndex = allLeaderboard.findIndex(item => item.studentId === student?.id);
  const rankNumber = studentRankIndex !== -1 ? studentRankIndex + 1 : 4;
  const totalStudents = Math.max(allLeaderboard.length, 30);
  
  const currentStars = student?.stars ?? student?.totalStars ?? 0;
  
  // Rank 3 threshold
  const rank3Item = allLeaderboard[2];
  const rank3Stars = rank3Item ? (rank3Item.totalStars ?? rank3Item.stars ?? 150) : 150;
  const starsNeededForTop3 = Math.max(0, rank3Stars - currentStars + 5);

  const isTop1 = rankNumber === 1;
  const isTop2 = rankNumber === 2;
  const isTop3 = rankNumber === 3;
  const isTop3Overall = rankNumber <= 3;

  const rankBadgeStyle = isTop1
    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-amber-300'
    : isTop2
    ? 'bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 text-slate-950 border-slate-200'
    : isTop3
    ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-white border-amber-400'
    : 'bg-slate-800 text-amber-300 border-slate-700';

  const rankTitle = isTop1
    ? '🥇 Quán Quân Toàn Trung Tâm'
    : isTop2
    ? '🥈 Á Quân Toàn Trung Tâm'
    : isTop3
    ? '🥉 Top 3 Vinh Danh Sao Vàng'
    : `⭐ Hạng #${rankNumber} Toàn Trung Tâm`;

  return (
    <div className={`rounded-3xl bg-slate-950 text-white p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left: Avatar & Rank info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden ring-3 ring-amber-400/80 shadow-lg bg-slate-900">
              {student?.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 text-white flex items-center justify-center font-black text-xl">
                  {student?.fullName?.charAt(0) || 'H'}
                </div>
              )}
            </div>
            {/* Rank badge */}
            <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-black border shadow ${rankBadgeStyle}`}>
              #{rankNumber}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                XẾP HẠNG CÁ NHÂN CỦA BẠN
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {rankNumber} / {totalStudents} học viên
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white font-heading mt-1 flex items-center gap-2">
              <span>{student?.fullName}</span>
              {isTop3Overall && <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />}
            </h3>

            <p className="text-xs font-bold text-amber-300 mt-0.5">
              {rankTitle}
            </p>
          </div>
        </div>

        {/* Middle: Stars & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
          <div className="p-1">
            <span className="text-[10px] text-amber-200/80 font-bold block">Sao BXH (Tích lũy)</span>
            <div className="flex items-center justify-center gap-1 font-black text-base text-amber-300 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{student?.totalStars ?? student?.stars ?? 0}</span>
            </div>
          </div>

          <div className="p-1 border-x border-slate-800">
            <span className="text-[10px] text-rose-200/80 font-bold block">Điểm Đổi Quà (Ví)</span>
            <span className="font-extrabold text-sm text-rose-400 block mt-0.5">
              {student?.rewardPoints ?? student?.stars ?? 0} đ
            </span>
          </div>

          <div className="p-1 border-r border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">Đã Đi Học</span>
            <span className="font-extrabold text-sm text-emerald-400 block mt-0.5">
              {student?.completedLessons || 12} buổi
            </span>
          </div>

          <div className="p-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-semibold block">Mục Tiêu Kế Tiếp</span>
            {isTop3Overall ? (
              <span className="font-extrabold text-xs text-amber-300 block mt-0.5">
                👑 Đang Trong Top 3
              </span>
            ) : (
              <span className="font-bold text-xs text-orange-400 block mt-0.5">
                +{starsNeededForTop3} ⭐ Top 3
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenCertificate && (
            <button
              onClick={onOpenCertificate}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Giấy Khen</span>
            </button>
          )}

          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 fill-slate-950" />
              <span>Xem Bảng Vinh Danh Pro</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
