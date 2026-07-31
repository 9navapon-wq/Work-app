import React, { useState, useEffect } from 'react';
import { StaffProfile, EditBillSubmission, EditBillCategory } from '../types';
import { ImageUploader } from './ImageUploader';
import { StaffSelect } from './StaffSelect';
import { StaffMember } from '../data/staffData';
import {
  Receipt,
  X,
  Calendar,
  Clock,
  Send,
  Tag,
  DollarSign,
  FileText,
  Hash,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

interface EditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  onSubmit: (submission: EditBillSubmission) => void;
}

export const EditBillModal: React.FC<EditBillModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSubmit,
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [editCategory, setEditCategory] = useState<EditBillCategory>('🔴 edit bill หลัง 20:00');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [phyId, setPhyId] = useState('');
  const [reason, setReason] = useState('');
  const [employeeId, setEmployeeId] = useState(staff.employeeId);
  const [employeeName, setEmployeeName] = useState(staff.employeeName);
  const [photoUrl, setPhotoUrl] = useState('');

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

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      alert('กรุณาระบุราคาสินค้าเป็นตัวเลขที่ถูกต้อง');
      return;
    }

    if (!productName.trim() || !phyId.trim() || !reason.trim()) {
      alert('กรุณากรอกข้อมูลสินค้า Phy ID และเหตุผลที่ขอแก้ไขให้ครบถ้วน');
      return;
    }

    const newSubmission: EditBillSubmission = {
      id: `eb-${Date.now()}`,
      taskType: 'edit_bill',
      editCategory,
      date,
      time,
      dateTime: `${date} ${time}`,
      productName: productName.trim(),
      price: numericPrice,
      phyId: phyId.trim(),
      reason: reason.trim(),
      employeeId,
      employeeName,
      photoUrl: photoUrl || undefined,
      notes: `[${editCategory}] สินค้า: ${productName.trim()} | ราคา: ${numericPrice.toLocaleString('th-TH')} บาท | Phy ID: ${phyId.trim()} | เหตุผล: ${reason.trim()}`,
      submittedAt: `${date} ${time}`,
    };

    onSubmit(newSubmission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-lg font-black text-2xl flex-shrink-0">
              <Receipt className="w-7 h-7 text-rose-600" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-100 bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                การ์ดเมนูที่ 5 • ขอแก้ไขบิลหน้าร้าน
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-none">
                แก้ไขบิล (EDIT BILL)
              </h2>
              <p className="text-xs text-rose-100 mt-1 font-medium">
                รายงานการขอแก้ไขบิล / รับคืนสินค้า พร้อมระบุเหตุผลและ Phy ID
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Dropdown: editCategory */}
          <div className="bg-rose-50/70 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60">
            <label className="block text-xs font-bold text-rose-900 dark:text-rose-200 mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              ประเภทการแก้ไขบิล / รับคืนสินค้า (เลือกรายการ) *
            </label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as EditBillCategory)}
              className="w-full px-4 py-3 text-sm font-black rounded-xl border-2 border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-rose-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none cursor-pointer shadow-xs"
            >
              <option value="🔴 edit bill หลัง 20:00">🔴 edit bill หลัง 20:00</option>
              <option value="🟢 รับคืนสินค้าภายใน 7 วัน">🟢 รับคืนสินค้าภายใน 7 วัน</option>
              <option value="🟠 รับคืนสินค้าเกิน 7 วัน">🟠 รับคืนสินค้าเกิน 7 วัน</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-600" /> วันที่เกิดรายการ *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" /> เวลาที่เกิดรายการ *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Product Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" /> ชื่อสินค้า / รายการ *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="ระบุชื่อสินค้า หรือรายการในบิล"
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-600" /> ราคา (บาท) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Phy ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-rose-600" /> Phy ID (รหัสบิล / เลขใบเสร็จ / เลขอ้างอิง) *
            </label>
            <input
              type="text"
              value={phyId}
              onChange={(e) => setPhyId(e.target.value)}
              placeholder="ระบุรหัส Phy ID เช่น PHY-2026-00891 หรือเลขบิลหน้าร้าน"
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-600" /> เหตุผลที่ขอแก้ไข / ขอรับคืน *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="อธิบายเหตุผล เช่น ลูกค้าขอเปลี่ยนไซซ์สินค้า, คีย์ราคาบิลผิดพลาด, ลูกค้าขอยกเลิกรายการหลัง 20:00 เป็นต้น..."
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              required
            />
          </div>

          {/* Employee selection (using StaffSelect dropdown) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <StaffSelect
              selectedEmployeeId={employeeId}
              onSelectStaff={(s: StaffMember) => {
                setEmployeeId(s.employeeId);
                setEmployeeName(s.employeeName);
              }}
              label="👤 พนักงานผู้ขอแก้ไขบิล (ไอดีชื่อพนักงาน)"
              accentColor="rose"
            />
          </div>

          {/* Slip/Receipt Image (Optional) */}
          <div className="pt-2">
            <ImageUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label="📸 รูปถ่ายบิล / สลิปสินค้าที่ขอแก้ไข (ถ้ามี)"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" /> บันทึกและส่งคำขอแก้ไขบิล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
