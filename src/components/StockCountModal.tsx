import React, { useState, useEffect } from 'react';
import { StaffProfile, StockCountSubmission, StockItemCount } from '../types';
import { ImageUploader } from './ImageUploader';
import { StaffSelect } from './StaffSelect';
import { StaffMember } from '../data/staffData';
import {
  PackageCheck,
  X,
  Calendar,
  Clock,
  User,
  Send,
  Boxes,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileText,
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
  catalog,
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
  const [searchQuery, setSearchQuery] = useState('');

  // Editable actual counts state
  const [items, setItems] = useState<StockItemCount[]>(catalog);

  useEffect(() => {
    if (isOpen) {
      const currentNow = new Date();
      setDate(currentNow.toISOString().split('T')[0]);
      setTime(currentNow.toTimeString().slice(0, 5));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const updated = Math.max(0, item.actualCount + delta);
          return { ...item, actualCount: updated };
        }
        return item;
      })
    );
  };

  const handleDirectQuantityChange = (itemId: string, value: string) => {
    const num = parseInt(value, 10);
    const validNum = isNaN(num) ? 0 : Math.max(0, num);
    setItems((prev) =>
      prev.map((item) => (item.itemId === itemId ? { ...item, actualCount: validNum } : item))
    );
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnitsCounted = items.reduce((sum, item) => sum + item.actualCount, 0);
  const totalSystemUnits = items.reduce((sum, item) => sum + item.systemCount, 0);
  const totalDifference = totalUnitsCounted - totalSystemUnits;

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
      items,
      totalUnitsCounted,
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
          {/* Summary Metric Box */}
          <div className="bg-purple-950/90 border border-purple-800/60 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-purple-200 block">ยอดนับรวมจริง (Actual Total)</span>
              <span className="text-2xl font-extrabold font-mono text-purple-100">
                {totalUnitsCounted} <span className="text-xs font-normal text-purple-300">ชิ้น/เครื่อง</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-purple-200 block">ยอดระบบ (System Expected)</span>
              <span className="text-lg font-bold font-mono text-slate-300">
                {totalSystemUnits} <span className="text-xs font-normal text-purple-300">ชิ้น</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-purple-200 block">ผลต่าง (Difference)</span>
              <span
                className={`text-lg font-bold font-mono flex items-center gap-1 ${
                  totalDifference === 0
                    ? 'text-emerald-400'
                    : totalDifference > 0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {totalDifference === 0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ตรงเป๊ะ (0)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" /> {totalDifference > 0 ? `+${totalDifference}` : totalDifference}
                  </>
                )}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stock Count Table */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-purple-600" /> ตรวจนับรายการสินค้า
                </label>
                {/* Search Box */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อสินค้า / SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900 max-h-64 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">ไม่พบรายการสินค้าที่ค้นหา</p>
                ) : (
                  filteredItems.map((item) => {
                    const diff = item.actualCount - item.systemCount;
                    return (
                      <div
                        key={item.itemId}
                        className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800">
                              {item.itemId}
                            </span>
                            <span className="text-[10px] text-slate-400">({item.category})</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.itemName}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            ยอดระบบ: <strong className="font-mono">{item.systemCount}</strong> {item.unit}
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.itemId, -1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors shadow-2xs"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              value={item.actualCount}
                              onChange={(e) => handleDirectQuantityChange(item.itemId, e.target.value)}
                              className="w-12 text-center text-xs font-bold font-mono bg-transparent outline-none text-slate-900 dark:text-slate-100"
                              min={0}
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.itemId, 1)}
                              className="w-7 h-7 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-bold text-sm transition-colors shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="w-16 text-right">
                            <span
                              className={`text-xs font-mono font-bold ${
                                diff === 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : diff > 0
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {diff === 0 ? 'ตรง' : diff > 0 ? `+${diff}` : diff}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
