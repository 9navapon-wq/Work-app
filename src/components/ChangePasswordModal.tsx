import React, { useState } from 'react';
import { StaffProfile } from '../types';
import { getEmployeePassword, setEmployeePassword } from '../lib/authService';
import { KeyRound, Lock, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  onSuccess: (msg: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const actualCurrent = getEmployeePassword(staff.employeeId);

    if (currentPassword !== actualCurrent) {
      setErrorMessage('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // Save new password
    setEmployeePassword(staff.employeeId, newPassword);
    onSuccess('เปลี่ยนรหัสผ่านใหม่สำเร็จแล้ว รหัสผ่านของคุณถูกอัปเดตเรียบร้อย');
    
    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-lg font-black text-2xl flex-shrink-0">
              <KeyRound className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-100 bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Security • ความปลอดภัย
              </span>
              <h2 className="text-xl font-black tracking-tight leading-none">
                ตั้งรหัสผ่านใหม่
              </h2>
              <p className="text-xs text-indigo-100 mt-1 font-medium">
                พนักงาน: {staff.employeeName} ({staff.employeeId})
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              รหัสผ่านปัจจุบัน * (เริ่มต้นคือรหัสพนักงานของคุณ)
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="ป้อนรหัสผ่านปัจจุบัน หรือรหัสพนักงาน"
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              รหัสผ่านใหม่ * (อย่างน้อย 4 ตัวอักษร)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="ตั้งรหัสผ่านใหม่ที่จดจำได้ง่าย"
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ยืนยันรหัสผ่านใหม่ *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="ป้อนรหัสผ่านใหม่อีกครั้งให้ตรงกัน"
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
              เมื่อเปลี่ยนรหัสผ่านแล้ว ครั้งต่อไปที่เข้าสู่ระบบกรุณาใช้รหัสผ่านใหม่นี้ในการลงชื่อเข้าใช้
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> บันทึกรหัสผ่านใหม่
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
