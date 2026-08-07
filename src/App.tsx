/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  StaffProfile,
  TaskSubmission,
  TaskTypeId,
  UFundTransaction,
  StockItemCount,
  UFundSubmission,
  MorningBriefSubmission,
  LiveCleaningSubmission,
  StockCountSubmission,
  EditBillSubmission,
} from './types';
import {
  defaultStaffProfile,
  initialUFundAccount,
  initialStockCatalog,
  sampleSubmissions,
} from './data/mockData';
import { StaffMember } from './data/staffData';
import { StaffHeaderBar } from './components/StaffHeaderBar';
import { TaskSummaryBar } from './components/TaskSummaryBar';
import { MainGrid } from './components/MainGrid';
import { LoginScreen } from './components/LoginScreen';
import { TelegramConfigModal } from './components/TelegramConfigModal';
import { sendTelegramNotification } from './lib/telegramService';
import { UFundModal } from './components/UFundModal';
import { MorningBriefModal } from './components/MorningBriefModal';
import { LiveCleaningModal } from './components/LiveCleaningModal';
import { StockCountModal } from './components/StockCountModal';
import { EditBillModal } from './components/EditBillModal';
import { DhlModal } from './components/DhlModal';
import { SubmissionHistoryModal } from './components/SubmissionHistoryModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { GoogleSheetsConfigModal } from './components/GoogleSheetsConfigModal';
import { sendToGoogleSheets } from './lib/googleSheetsService';
import { QrScannerModal } from './components/QrScannerModal';
import { GoogleScriptModal } from './components/GoogleScriptModal';
import {
  CheckCircle2,
  History,
  Sparkles,
  Layers,
  Bell,
  RotateCcw,
  ShieldCheck,
  Award,
  LogOut,
  Send,
  FileSpreadsheet,
  QrCode,
  FileCode,
} from 'lucide-react';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('workhub_is_authenticated') === 'true';
  });

  // Modal states
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isGoogleScriptOpen, setIsGoogleScriptOpen] = useState(false);

  // Staff Profile state with localStorage persistence
  const [staff, setStaff] = useState<StaffProfile>(() => {
    const saved = localStorage.getItem('workhub_staff');
    return saved ? JSON.parse(saved) : defaultStaffProfile;
  });

  // Submissions state
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('workhub_submissions');
    return saved ? JSON.parse(saved) : sampleSubmissions;
  });

  // UFund balance state
  const [ufundBalance, setUfundBalance] = useState<number>(() => {
    const saved = localStorage.getItem('workhub_ufund_balance');
    return saved ? parseFloat(saved) : initialUFundAccount.balance;
  });

  // UFund transactions
  const [ufundTransactions, setUfundTransactions] = useState<UFundTransaction[]>(() => {
    const saved = localStorage.getItem('workhub_ufund_txs');
    return saved ? JSON.parse(saved) : initialUFundAccount.recentTransactions;
  });

  // Stock catalog state
  const [stockCatalog, setStockCatalog] = useState<StockItemCount[]>(() => {
    const saved = localStorage.getItem('workhub_stock_catalog');
    return saved ? JSON.parse(saved) : initialStockCatalog;
  });

  // Modal active states
  const [activeModal, setActiveModal] = useState<TaskTypeId | 'history' | null>(null);

  // Success Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save authentication & staff to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('workhub_is_authenticated', isAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error('Failed saving auth to localStorage:', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('workhub_staff', JSON.stringify(staff));
    } catch (e) {
      console.error('Failed saving staff to localStorage:', e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem('workhub_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.warn('QuotaExceededError when saving submissions to localStorage. Saving optimized version:', e);
      try {
        // Strip heavy image payloads from older submissions for localStorage persistence backup
        const optimized = submissions.map((sub, idx) => {
          if (idx > 2) {
            return {
              ...sub,
              images: sub.images ? sub.images.slice(0, 1) : [],
              photoUrl: sub.photoUrl ? sub.photoUrl.slice(0, 200) : undefined,
              signatureDataUrl: sub.signatureDataUrl ? sub.signatureDataUrl.slice(0, 200) : undefined,
            };
          }
          return sub;
        });
        localStorage.setItem('workhub_submissions', JSON.stringify(optimized));
      } catch (err2) {
        console.error('Could not save submissions to localStorage:', err2);
      }
    }
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('workhub_ufund_balance', ufundBalance.toString());
  }, [ufundBalance]);

  useEffect(() => {
    localStorage.setItem('workhub_ufund_txs', JSON.stringify(ufundTransactions));
  }, [ufundTransactions]);

  useEffect(() => {
    localStorage.setItem('workhub_stock_catalog', JSON.stringify(stockCatalog));
  }, [stockCatalog]);

  // Handle Login Success
  const handleLoginSuccess = (staffMember: StaffMember) => {
    const newProfile: StaffProfile = {
      employeeId: staffMember.employeeId,
      employeeName: staffMember.employeeName,
      nickname: staffMember.nickname,
      position: staffMember.position,
    };
    setStaff(newProfile);
    setIsAuthenticated(true);
    triggerToast(`ยินดีต้อนรับ คุณ${staffMember.nickname} (${staffMember.employeeName}) เข้าสู่ระบบ`);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    triggerToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // If not authenticated, display Employee Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Add submission handlers
  const handleAddSubmission = async (submission: TaskSubmission) => {
    setSubmissions((prev) => [submission, ...prev]);
    const taskNameMap: Record<TaskTypeId, string> = {
      ufund: 'UFund',
      morning_brief: 'Morning Brief',
      live_cleaning: 'Live Display & Big Cleaning',
      stock_count: 'นับสต๊อก It Easy',
      edit_bill: 'แก้ไขบิล (EDIT BILL)',
      dhl: 'DHL ส่งงาน / ตรวจรับสินค้า',
    };

    triggerToast(`ส่งงาน "${taskNameMap[submission.taskType]}" เรียบร้อยแล้ว!`);

    // Trigger Google Sheets record
    try {
      const sheetRes = await sendToGoogleSheets(submission);
      if (sheetRes.success) {
        triggerToast(`📊 บันทึกงาน "${taskNameMap[submission.taskType]}" ลง Google ชีตสำเร็จ!`);
      }
    } catch (err) {
      console.error('Failed sending to Google Sheets:', err);
    }

    // Trigger Telegram notification
    try {
      const res = await sendTelegramNotification(submission);
      if (res.success) {
        triggerToast(`📲 ส่งงาน "${taskNameMap[submission.taskType]}" สำเร็จ & แจ้งเตือนไปยัง Telegram แล้ว!`);
      } else {
        console.warn('Telegram Notification error:', res.error);
        triggerToast(`⚠️ ส่งงานสำเร็จ แต่ Telegram แจ้งเตือนไม่สำเร็จ: ${res.error || 'กรุณากรอก Telegram Bot Token และ Chat ID'}`);
      }
    } catch (err: any) {
      console.error('Failed sending Telegram alert:', err);
      triggerToast(`⚠️ ส่งงานสำเร็จ แต่เกิดข้อผิดพลาดในการเชื่อมต่อ Telegram`);
    }
  };

  const handleAddUFundTx = (newTx: UFundTransaction) => {
    setUfundTransactions((prev) => [newTx, ...prev]);
    setUfundBalance((prev) => prev + newTx.amount);
    triggerToast(`บันทึกรายการธุรกรรม UFund (${newTx.amount > 0 ? '+' : ''}${newTx.amount} บาท) สำเร็จ`);
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSubmissions = () => {
    setSubmissions([]);
    triggerToast('ล้างประวัติการส่งงานทั้งหมดเรียบร้อย');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200 pb-12">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-200 dark:shadow-none">
              W
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                WORK HUB
              </h1>
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                ส่งงานประจำวัน
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsQrScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-900 dark:text-teal-200 font-extrabold text-xs transition-all border border-teal-200 dark:border-slate-700 shadow-2xs cursor-pointer"
              title="สแกน QR Code / อ่านข้อมูลรูปภาพ"
            >
              <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">สแกน QR Code</span>
            </button>

            <button
              onClick={() => setIsGoogleScriptOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 font-extrabold text-xs transition-all border border-amber-200 dark:border-slate-700 shadow-2xs cursor-pointer"
              title="ตัวอย่าง Google Apps Script บันทึกลง Google Sheets & Drive"
            >
              <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Google Script</span>
            </button>

            <button
              onClick={() => setIsGoogleSheetsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs transition-all border border-emerald-200 dark:border-slate-700 shadow-2xs cursor-pointer"
              title="ตั้งค่าบันทึก Google ชีต"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">ตั้งค่า Google ชีต</span>
            </button>

            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-900 dark:text-sky-200 font-extrabold text-xs transition-all border border-sky-200 dark:border-slate-700 shadow-2xs cursor-pointer"
              title="ตั้งค่า Telegram Bot แจ้งเตือน"
            >
              <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">ตั้งค่า Telegram</span>
            </button>

            <button
              onClick={() => setActiveModal('history')}
              className="relative flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-900 dark:text-indigo-200 font-black text-xs transition-all border border-indigo-200 dark:border-slate-700 shadow-sm cursor-pointer"
            >
              <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">ประวัติส่งงาน</span>
              {submissions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                  {submissions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Employee Header Bar */}
        <StaffHeaderBar
          staff={staff}
          onUpdateStaff={setStaff}
          onLogout={handleLogout}
          onChangePassword={() => setIsChangePasswordOpen(true)}
        />

        {/* 🔔 งานวันนี้ (5 รายการ) Summary Status Bar - เห็นเฉพาะ 16286 และ 2609 */}
        {(staff.employeeId === '16286' || staff.employeeId === '2609') && (
          <TaskSummaryBar
            submissions={submissions}
            onOpenTask={(type) => setActiveModal(type)}
          />
        )}

        {/* 4 Main Cards Grid */}
        <MainGrid
          onOpenTask={(type) => setActiveModal(type)}
          submissions={submissions}
          ufundBalance={ufundBalance}
        />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            WORK HUB — ระบบส่งงานประจำวันสำหรับพนักงานหน้าร้าน
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> ระบบบันทึกงานสมบูรณ์
            </span>
          </div>
        </div>
      </footer>

      {/* Task Modals */}
      <UFundModal
        isOpen={activeModal === 'ufund'}
        onClose={() => setActiveModal(null)}
        staff={staff}
        currentBalance={ufundBalance}
        creditLimit={initialUFundAccount.limit}
        recentTransactions={ufundTransactions}
        onSubmit={(sub) => handleAddSubmission(sub)}
        onAddTransaction={handleAddUFundTx}
      />

      <MorningBriefModal
        isOpen={activeModal === 'morning_brief'}
        onClose={() => setActiveModal(null)}
        staff={staff}
        onSubmit={(sub) => handleAddSubmission(sub)}
      />

      <LiveCleaningModal
        isOpen={activeModal === 'live_cleaning'}
        onClose={() => setActiveModal(null)}
        staff={staff}
        onSubmit={(sub) => handleAddSubmission(sub)}
      />

      <StockCountModal
        isOpen={activeModal === 'stock_count'}
        onClose={() => setActiveModal(null)}
        staff={staff}
        catalog={stockCatalog}
        onSubmit={(sub) => handleAddSubmission(sub)}
      />

      <EditBillModal
        isOpen={activeModal === 'edit_bill'}
        onClose={() => setActiveModal(null)}
        staff={staff}
        onSubmit={(sub) => handleAddSubmission(sub)}
      />

      <DhlModal
        isOpen={activeModal === 'dhl'}
        onClose={() => setActiveModal(null)}
        staff={staff}
        onSubmit={(sub) => handleAddSubmission(sub)}
      />

      <SubmissionHistoryModal
        isOpen={activeModal === 'history'}
        onClose={() => setActiveModal(null)}
        submissions={submissions}
        onDeleteSubmission={handleDeleteSubmission}
        onClearAll={handleClearAllSubmissions}
      />

      <TelegramConfigModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      <GoogleSheetsConfigModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        staff={staff}
        onSuccess={(msg) => triggerToast(msg)}
      />

      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanResult={(data) => triggerToast(`สแกน QR Code สำเร็จ: ${data.slice(0, 30)}...`)}
      />

      <GoogleScriptModal
        isOpen={isGoogleScriptOpen}
        onClose={() => setIsGoogleScriptOpen(false)}
      />
    </div>
  );
}
