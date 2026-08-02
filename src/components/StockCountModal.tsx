import React, { useState, useEffect } from 'react';
import { StaffProfile, StockCountSubmission, StockItemCount } from '../types';
import { ImageUploader } from './ImageUploader';
import { StaffSelect } from './StaffSelect';
import { StaffMember } from '../data/staffData';
import {
  PackageCheck,
  X,
  Send,
} from 'lucide-react';

interface StockCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  catalog: StockItemCount[];
  onSubmit: (submission: StockCountSubmission) => void;
}

export const StockCountModal: React.FC<StockCountModalProps> = ({
  isOpen,
  onClose,
  staff,
  catalog: _catalog,
  onSubmit,
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [employeeId, setEmployeeId] = useState(staff.employeeId);
  const [employeeName, setEmployeeName] = useState(staff.employeeName);
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

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
      alert('กรุณาอัปโหลดหรือเลือกรูปถ่ายพื้นที่จัดเก็บสต๊อกเพื่อยืนยัน');
      return;
    }

    const newSubmission: StockCountSubmission = {
      id: `stock-${Date.now()}`,
      taskType: 'stock_count',
      date,
      time,
      employeeId,
      employeeName,
      photoUrl,
      notes: notes.trim(),
      items: [],
      totalUnitsCounted: 0,
      submittedAt: new Date().toLocaleString('th-TH'),
    };

    onSubmit(newSubmission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-purple-200/80 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-purple-800 flex items-center justify-center font-extrabold shadow-lg">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">นับสต๊อก It Easy</h2>
              <p className="text-xs text-purple-200 mt-0.5">
                ตรวจนับสินค้าหน้าร้าน เปรียบเทียบกับยอดในระบบ
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
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
              accentColor="purple"
            />

            {/* Image Uploader */}
            <ImageUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label="📷 รูปถ่ายชั้นวาง / คลังสินค้าที่ตรวจนับ"
              taskPresetType="stock_count"
            />

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                📝 หมายเหตุการนับสต๊อก
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="หมายเหตุเพิ่มเติม เช่น สินค้าชำรุด หรือ สินค้าตัวโชว์ไม่ได้นับรวม..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
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
                className="px-6 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" /> ส่งงาน นับสต๊อก It Easy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
