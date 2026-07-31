import React, { useState, useEffect } from 'react';
import { StaffProfile, MorningBriefSubmission } from '../types';
import { ImageUploader } from './ImageUploader';
import { StaffSelect } from './StaffSelect';
import { StaffMember } from '../data/staffData';
import {
  Megaphone,
  X,
  Calendar,
  Clock,
  User,
  Send,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface MorningBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  onSubmit: (submission: MorningBriefSubmission) => void;
}

export const MorningBriefModal: React.FC<MorningBriefModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSubmit,
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [workDay, setWorkDay] = useState<'จันทร์' | 'พุธ' | 'ศุกร์'>('จันทร์');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [employeeId, setEmployeeId] = useState(staff.employeeId);
  const [employeeName, setEmployeeName] = useState(staff.employeeName);
  const [photoUrl, setPhotoUrl] = useState('');
  const [briefTopic, setBriefTopic] = useState('');

  useEffect(() => {
    if (isOpen) {
      const currentNow = new Date();
      setDate(currentNow.toISOString().split('T')[0]);
      setTime(currentNow.toTimeString().slice(0, 5));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      alert('กรุณาอัปโหลดหรือเลือกรูปภาพบรรยากาศ Morning Brief');
      return;
    }

    const newSubmission: MorningBriefSubmission = {
      id: `mb-${Date.now()}`,
      taskType: 'morning_brief',
      workDay,
      date,
      time,
      employeeId,
      employeeName,
      photoUrl,
      notes: briefTopic.trim(),
      briefTopic: briefTopic.trim(),
      submittedAt: new Date().toLocaleString('th-TH'),
    };

    onSubmit(newSubmission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-amber-200/80 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-extrabold shadow-lg">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Morning Brief</h2>
              <p className="text-xs text-amber-100 mt-0.5">
                ส่งงานบันทึกการประชุม Morning Brief ประจำวัน
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Day selection (จันทร์ / พุธ / ศุกร์) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                วันงาน <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['จันทร์', 'พุธ', 'ศุกร์'] as const).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setWorkDay(day)}
                    className={`py-2.5 px-3 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                      workDay === day
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>• {day}</span>
                    {workDay === day && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  📅 วันที่
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  ⏰ เวลา
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Employee Selection Dropdown */}
            <StaffSelect
              selectedEmployeeId={employeeId}
              onSelectStaff={(s: StaffMember) => {
                setEmployeeId(s.employeeId);
                setEmployeeName(s.employeeName);
              }}
              label="👤 พนักงานผู้ส่งงาน (เลือกจากรายชื่อหน้าร้าน)"
              accentColor="amber"
            />

            {/* Brief Topic / Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                📝 หัวข้อการสรุปประชุม Morning Brief
              </label>
              <textarea
                value={briefTopic}
                onChange={(e) => setBriefTopic(e.target.value)}
                rows={2}
                placeholder="เช่น เป้าหมายยอดขายประจำวัน, แจ้งโปรโมชั่นใหม่, การดูแลลูกค้า..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>

            {/* Image Uploader */}
            <ImageUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label="📷 รูปภาพการประชุม Morning Brief"
              taskPresetType="morning_brief"
            />

            {/* Actions */}
            <div className="pt-4 border-t flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" /> ส่งงาน Morning Brief
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
