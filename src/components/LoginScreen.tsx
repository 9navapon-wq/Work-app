import React, { useState } from 'react';
import { STORE_STAFF_LIST, StaffMember } from '../data/staffData';
import { ShieldAlert, LogIn, Lock, UserCheck, KeyRound, HelpCircle } from 'lucide-react';
import { getEmployeePassword } from '../lib/authService';

interface LoginScreenProps {
  onLoginSuccess: (staff: StaffMember) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanedId = employeeIdInput.trim();
    const cleanedPassword = passwordInput.trim();

    if (!cleanedId) {
      setErrorMessage('กรุณากรอกรหัสพนักงาน');
      return;
    }
    if (!cleanedPassword) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    // Search in authorized list
    const foundMember = STORE_STAFF_LIST.find(
      (m) => m.employeeId === cleanedId || m.employeeId === cleanedId.padStart(4, '0')
    );

    if (!foundMember) {
      setErrorMessage(
        '❌ รหัสพนักงานไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าใช้งานระบบ'
      );
      return;
    }

    // Verify Password
    const expectedPassword = getEmployeePassword(foundMember.employeeId);
    if (cleanedPassword !== expectedPassword) {
      setErrorMessage(
        '❌ รหัสผ่านไม่ถูกต้อง (หมายเหตุ: รหัสผ่านเริ่มต้นคือรหัสพนักงานของคุณ)'
      );
      return;
    }

    onLoginSuccess(foundMember);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Blur Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-4xl shadow-2xl shadow-indigo-500/40 border-4 border-white/20 mb-4 animate-bounce">
            W
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            WORK HUB
          </h1>
          <p className="text-xs font-bold text-indigo-200 mt-1 uppercase tracking-widest">
            ระบบลงชื่อเข้าใช้งานสำหรับพนักงานหน้าร้าน
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border-4 border-slate-800 rounded-[2.5rem] p-7 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight">
                เข้าสู่ระบบ (Staff Authentication)
              </h2>
              <p className="text-xs text-slate-400">
                กรอกรหัสพนักงานและรหัสผ่านเพื่อยืนยันตัวตน
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-400" /> รหัสพนักงาน (Employee ID)
              </label>
              <input
                type="text"
                value={employeeIdInput}
                onChange={(e) => {
                  setEmployeeIdInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="ป้อนรหัสพนักงาน เช่น 8180376"
                className="w-full px-4 py-3 text-sm font-mono font-bold rounded-2xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-400" /> รหัสผ่าน (Password)
                </span>
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="ป้อนรหัสผ่านของคุณ"
                className="w-full px-4 py-3 text-sm font-mono font-bold rounded-2xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                required
              />
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-indigo-300 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>รหัสผ่านเริ่มต้นคือ <strong>รหัสพนักงานของคุณ</strong> (สามารถตั้งรหัสผ่านใหม่ได้หลังเข้าใช้งาน)</span>
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-start gap-2.5 animate-pulse">
                <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-5 h-5" /> เข้าสู่ระบบ WORK HUB
            </button>
          </form>
        </div>

        {/* Security Footer Notice */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-medium">
          🔒 ระบบจำกัดสิทธิ์เข้าใช้งานเฉพาะพนักงานปฏิบัติการหน้าร้านที่ได้รับอนุญาตเท่านั้น
        </p>
      </div>
    </div>
  );
};
