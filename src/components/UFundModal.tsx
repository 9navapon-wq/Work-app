import React, { useState } from 'react';
import { StaffProfile, UFundSubmission, UFundTransaction } from '../types';
import { ImageUploader } from './ImageUploader';
import { StaffSelect } from './StaffSelect';
import { StaffMember } from '../data/staffData';
import {
  CreditCard,
  Check,
  X,
  Calendar,
  Clock,
  User,
  FileText,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  History,
  Send,
  Sparkles,
} from 'lucide-react';

interface UFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  currentBalance: number;
  creditLimit: number;
  recentTransactions: UFundTransaction[];
  onSubmit: (submission: UFundSubmission) => void;
  onAddTransaction?: (tx: UFundTransaction) => void;
}

export const UFundModal: React.FC<UFundModalProps> = ({
  isOpen,
  onClose,
  staff,
  currentBalance,
  creditLimit,
  recentTransactions,
  onSubmit,
  onAddTransaction,
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

  // Quick transaction simulator
  const [showAddTx, setShowAddTx] = useState(false);
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'payment' | 'deposit'>('payment');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      alert('กรุณาอัปโหลดหรือเลือกรูปภาพยืนยันการทำรายการ');
      return;
    }

    const newSubmission: UFundSubmission = {
      id: `ufund-${Date.now()}`,
      taskType: 'ufund',
      date,
      time,
      employeeId,
      employeeName,
      photoUrl,
      notes: notes.trim(),
      currentBalance,
      creditLimit,
      submittedAt: new Date().toLocaleString('th-TH'),
    };

    onSubmit(newSubmission);
    onClose();
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (!txTitle || isNaN(amountNum) || amountNum <= 0) return;

    const newTx: UFundTransaction = {
      id: `tx-${Date.now()}`,
      type: txType,
      title: txTitle,
      amount: txType === 'payment' ? -amountNum : amountNum,
      date: 'วันนี้ ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };

    if (onAddTransaction) {
      onAddTransaction(newTx);
    }

    setTxTitle('');
    setTxAmount('');
    setShowAddTx(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-blue-200/80 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {/* Minimalist Logo: Credit card + Checkmark icon */}
            <div className="w-12 h-12 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-extrabold shadow-lg relative">
              <CreditCard className="w-6 h-6 text-blue-700" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-blue-800">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">UFund</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> มินิมอล
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                รายงานยอดคงเหลือและส่งสลิปรายการ UFund ประจำวัน
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* UFund Credit Card & Balance Display Widget */}
          <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-5 text-white border border-blue-800/50 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-blue-200 tracking-wider">
                  UFUND CARD MEMBER
                </span>
              </div>
              <span className="font-mono text-xs text-blue-300 bg-blue-900/60 px-2.5 py-1 rounded-lg border border-blue-700/50">
                •••• •••• •••• 4821
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-blue-300 block">ยอดคงเหลือ (Balance)</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">
                  ฿{currentBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-xs text-blue-300 block">วงเงินบัตรคงเหลือ (Credit Limit)</span>
                <span className="text-lg font-bold font-mono text-blue-100">
                  ฿{creditLimit.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Recent Transaction History Section */}
            <div className="mt-4 pt-4 border-t border-blue-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-200 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-blue-400" /> ประวัติการทำรายการล่าสุด
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTx(!showAddTx)}
                  className="text-[11px] font-semibold text-blue-300 hover:text-white flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {showAddTx ? 'ยกเลิก' : 'จำลองรายการใหม่'}
                </button>
              </div>

              {/* Add Tx Inline Form */}
              {showAddTx && (
                <form onSubmit={handleCreateTx} className="bg-blue-900/80 p-3 rounded-xl border border-blue-700 mb-3 space-y-2 animate-fadeIn">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="รายการธุรกรรม เช่น ค่าสินค้า"
                      value={txTitle}
                      onChange={(e) => setTxTitle(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-blue-700 text-white outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="จำนวนเงิน"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-24 px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-blue-700 text-white outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="txType"
                          checked={txType === 'payment'}
                          onChange={() => setTxType('payment')}
                          className="accent-rose-500"
                        />
                        ชำระออก (-)
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="txType"
                          checked={txType === 'deposit'}
                          onChange={() => setTxType('deposit')}
                          className="accent-emerald-500"
                        />
                        เติมเงิน (+)
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                    >
                      เพิ่มธุรกรรม
                    </button>
                  </div>
                </form>
              )}

              {/* List of Transactions */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-blue-900/40 border border-blue-800/40 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          tx.amount > 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-100 truncate">{tx.title}</p>
                        <span className="text-[10px] text-blue-300">{tx.date}</span>
                      </div>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        tx.amount > 0 ? 'text-emerald-400' : 'text-rose-300'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 border-b pb-2">
              <FileText className="w-4 h-4 text-blue-600" /> แบบฟอร์มส่งงาน UFund ประจำวัน
            </h3>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  📅 วันที่
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  ⏰ เวลา
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
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
              accentColor="blue"
            />

            {/* Image Uploader */}
            <ImageUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label="📷 อัปโหลดรูปสลิป / หลักฐานการส่งงาน UFund"
              taskPresetType="ufund"
            />

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                📝 หมายเหตุ (ถ้ามี)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น สรุปยอดโอนรวมประจำวัน..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" /> ยืนยันส่งงาน UFund
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
