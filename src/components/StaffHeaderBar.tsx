import React from 'react';
import { StaffProfile } from '../types';
import { STORE_STAFF_LIST, StaffMember } from '../data/staffData';
import { UserCheck, Calendar, ShieldCheck, User, LogOut, KeyRound } from 'lucide-react';

interface StaffHeaderBarProps {
  staff: StaffProfile;
  onUpdateStaff: (updated: StaffProfile) => void;
  onLogout?: () => void;
  onChangePassword?: () => void;
}

export const StaffHeaderBar: React.FC<StaffHeaderBarProps> = ({
  staff,
  onUpdateStaff,
  onLogout,
  onChangePassword,
}) => {
  const currentStaffObj = STORE_STAFF_LIST.find((s) => s.employeeId === staff.employeeId) || {
    employeeId: staff.employeeId,
    employeeName: staff.employeeName,
    nickname: staff.nickname || '',
    position: staff.position || 'STAFF',
  };

  const handleSelectStaff = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = STORE_STAFF_LIST.find((s) => s.employeeId === selectedId);
    if (found) {
      onUpdateStaff({
        employeeId: found.employeeId,
        employeeName: found.employeeName,
        nickname: found.nickname,
        position: found.position,
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 rounded-[2rem] p-5 shadow-xl shadow-indigo-100/60 dark:shadow-none mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Current Active Staff Avatar & Details */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex-shrink-0">
            {staff.employeeName.charAt(0) || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-slate-900 dark:text-slate-100 text-lg truncate">
                {staff.employeeName}
              </span>
              {currentStaffObj.nickname && (
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                  ({currentStaffObj.nickname})
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                รหัส: {staff.employeeId}
              </span>
              {currentStaffObj.position && (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {currentStaffObj.position}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> พนักงานปฏิบัติการหน้าร้านประจำวัน
            </p>
          </div>
        </div>

        {/* Right: Staff Dropdown Switcher & Date */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-indigo-50/90 dark:bg-slate-800 p-1.5 rounded-2xl border border-indigo-100 dark:border-slate-700">
            <User className="w-4 h-4 text-indigo-600 ml-2 flex-shrink-0" />
            <select
              value={staff.employeeId}
              onChange={handleSelectStaff}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-black py-2 px-3 rounded-xl border border-indigo-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs min-w-[240px]"
            >
              {STORE_STAFF_LIST.map((item) => (
                <option key={item.employeeId} value={item.employeeId}>
                  {item.employeeId} - {item.employeeName} ({item.nickname}) [{item.position}]
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50/80 dark:bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-indigo-100 dark:border-slate-700 text-xs font-black text-indigo-900 dark:text-indigo-200 whitespace-nowrap">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{currentDate}</span>
          </div>

          {onChangePassword && (
            <button
              type="button"
              onClick={onChangePassword}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 font-extrabold text-xs border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="ตั้งรหัสผ่านใหม่"
            >
              <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>เปลี่ยนรหัสผ่าน</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 font-extrabold text-xs border border-rose-200 dark:border-rose-800 transition-all cursor-pointer shadow-2xs"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>ออกจากระบบ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
