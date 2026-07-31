import React, { useState } from 'react';
import { StaffProfile, LiveCleaningSubmission } from '../types';
import { ImageUploader } from './ImageUploader';
import { StaffSelect } from './StaffSelect';
import { StaffMember } from '../data/staffData';
import {
  Sparkles,
  X,
  Calendar,
  Clock,
  User,
  Send,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';

interface LiveCleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  onSubmit: (submission: LiveCleaningSubmission) => void;
}

const CHECKLIST_ITEMS = {
  'Live Display': [
    'จัดเรียงสินค้าบนชั้นโชว์ให้เป็นระเบียบ',
    'เช็ดทำความสะอาดหน้าจอสมาร์ทโฟนตัวโชว์',
    'ตรวจสอบสายชาร์จและไฟ LED ตัวโชว์เปิดทำงาน',
    'ป้ายราคาและรายละเอียดโปรโมชั่นถูกต้อง',
  ],
  'Big Cleaning': [
    'เช็ดกระจกหน้าร้านและตู้โชว์สินค้า',
    'ถูพื้นทำความสะอาดโซนรับรองลูกค้า',
    'จัดเก็บกล่องสินค้าและสต๊อกหลังร้าน',
    'เช็ดทำความสะอาดเคาน์เตอร์แคชเชียร์',
  ],
};

export const LiveCleaningModal: React.FC<LiveCleaningModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSubmit,
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [jobType, setJobType] = useState<'Live Display' | 'Big Cleaning'>('Live Display');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [employeeId, setEmployeeId] = useState(staff.employeeId);
  const [employeeName, setEmployeeName] = useState(staff.employeeName);
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'จัดเรียงสินค้าบนชั้นโชว์ให้เป็นระเบียบ': true,
    'เช็ดทำความสะอาดหน้าจอสมาร์ทโฟนตัวโชว์': true,
  });

  if (!isOpen) return null;

  const handleToggleCheck = (item: string) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      alert('กรุณาอัปโหลดหรือเลือกรูปภาพงาน Live Display / Big Cleaning');
      return;
    }

    const newSubmission: LiveCleaningSubmission = {
      id: `lc-${Date.now()}`,
      taskType: 'live_cleaning',
      jobType,
      date,
      time,
      employeeId,
      employeeName,
      photoUrl,
      notes: notes.trim(),
      checklist,
      submittedAt: new Date().toLocaleString('th-TH'),
    };

    onSubmit(newSubmission);
    onClose();
  };

  const currentChecklist = CHECKLIST_ITEMS[jobType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-teal-200/80 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-teal-700 flex items-center justify-center font-extrabold shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Live Display & Big Cleaning
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                รายงานการจัดดิสเพลย์หน้าร้านและทำความสะอาด
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Job Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                📝 ประเภทงาน <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Live Display', 'Big Cleaning'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setJobType(type);
                    }}
                    className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                      jobType === type
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>• {type}</span>
                    {jobType === type && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-teal-50/60 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-teal-100 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <ListChecks className="w-3.5 h-3.5 text-teal-600" /> รายการเช็กความพร้อม ({jobType})
              </label>
              <div className="space-y-2">
                {currentChecklist.map((item, idx) => {
                  const isChecked = !!checklist[item];
                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer p-1.5 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheck(item)}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className={isChecked ? 'line-through text-slate-400' : ''}>
                        {item}
                      </span>
                    </label>
                  );
                })}
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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
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
              accentColor="teal"
            />

            {/* Image Uploader */}
            <ImageUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label={`📷 รูปถ่ายผลงาน ${jobType}`}
              taskPresetType="live_cleaning"
            />

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                📝 รายละเอียดเพิ่มเติม / หมายเหตุ
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="ระบุจุดที่ดูแลเป็นพิเศษ หรือจุดที่ต้องปรับปรุงเพิ่มเติม..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              />
            </div>

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
                className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" /> ส่งงาน {jobType}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
