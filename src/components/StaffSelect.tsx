import React from 'react';
import { STORE_STAFF_LIST, StaffMember } from '../data/staffData';
import { UserCheck } from 'lucide-react';

interface StaffSelectProps {
  selectedEmployeeId: string;
  onSelectStaff: (staff: StaffMember) => void;
  label?: string;
  className?: string;
  accentColor?: 'indigo' | 'blue' | 'amber' | 'teal' | 'purple' | 'rose';
}

export const StaffSelect: React.FC<StaffSelectProps> = ({
  selectedEmployeeId,
  onSelectStaff,
  label = 'เลือกพนักงานผู้ส่งงาน (Store Staff)',
  className = '',
  accentColor = 'indigo',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = STORE_STAFF_LIST.find((s) => s.employeeId === selectedId);
    if (found) {
      onSelectStaff(found);
    }
  };

  const currentStaff = STORE_STAFF_LIST.find((s) => s.employeeId === selectedEmployeeId);

  const focusRingColors = {
    indigo: 'focus:ring-indigo-500 focus:border-indigo-500',
    blue: 'focus:ring-blue-500 focus:border-blue-500',
    amber: 'focus:ring-amber-500 focus:border-amber-500',
    teal: 'focus:ring-teal-500 focus:border-teal-500',
    purple: 'focus:ring-purple-500 focus:border-purple-500',
    rose: 'focus:ring-rose-500 focus:border-rose-500',
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {label}
        </label>
        {currentStaff && (
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700">
            ตำแหน่ง: {currentStaff.position}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={selectedEmployeeId}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none shadow-xs transition-all cursor-pointer ${focusRingColors[accentColor]}`}
        >
          {STORE_STAFF_LIST.map((staff) => (
            <option key={staff.employeeId} value={staff.employeeId}>
              {staff.employeeId} - {staff.employeeName} ({staff.nickname}) [{staff.position}]
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
