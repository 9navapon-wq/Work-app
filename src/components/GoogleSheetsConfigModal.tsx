import React, { useState, useEffect } from 'react';
import {
  GoogleSheetsConfig,
  getStoredGoogleSheetsConfig,
  setStoredGoogleSheetsConfig,
} from '../lib/googleSheetsService';
import { FileSpreadsheet, X, Check, ExternalLink, HelpCircle, AlertCircle, Save, Globe } from 'lucide-react';

interface GoogleSheetsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsConfigModal: React.FC<GoogleSheetsConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<GoogleSheetsConfig>(() => getStoredGoogleSheetsConfig());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredGoogleSheetsConfig());
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredGoogleSheetsConfig(config);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-lg font-black text-2xl flex-shrink-0">
              <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100 bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Integration • Google Sheets
              </span>
              <h2 className="text-xl font-black tracking-tight leading-none">
                ตั้งค่าบันทึก Google ชีต
              </h2>
              <p className="text-xs text-emerald-100 mt-1 font-medium">
                บันทึกการส่งงานประจำวันอัตโนมัติลงใน Google Sheets
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                เปิดใช้งานการบันทึก Google ชีตอัตโนมัติ
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                เมื่อกดส่งงาน จะซิงค์ข้อมูลแถวใหม่ลงตารางทันที
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.isEnabled}
              onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Google Apps Script Webhook URL (แนะนำ)
            </label>
            <input
              type="url"
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              * วางลิงก์ Webhook จาก Apps Script หรือ Zapier/Make เพื่อรับข้อมูลแถวใหม่ (Row Data) เป็น JSON POST
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อแท็บชีต (Sheet Name)
            </label>
            <input
              type="text"
              value={config.sheetName}
              onChange={(e) => setConfig({ ...config, sheetName: e.target.value })}
              placeholder="บันทึกงานประจำวัน"
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>รูปแบบคอลัมน์ที่จะถูกบันทึก (10 คอลัมน์)</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              A: วันเวลาที่ส่ง | B: ประเภทงาน | C: รหัสพนักงาน | D: ชื่อพนักงาน | E: หัวข้อ/หมวดหมู่ | F: จำนวนเงิน/ชิ้น | G: Phy ID | H: รายละเอียด | I: หมายเหตุ | J: ลิงก์รูปภาพ
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> บันทึกเรียบร้อย!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> บันทึกการตั้งค่าชีต
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
