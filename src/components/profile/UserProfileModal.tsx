import React from 'react';
import { UserProfileView } from './UserProfileView';
import { X } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'info' | 'avatar' | 'related' | 'security' | 'audio';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, initialTab }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-heading">
              Hồ sơ cá nhân & Cài đặt tài khoản
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <UserProfileView onClose={onClose} initialTab={initialTab} />
        </div>
      </div>
    </div>
  );
};
