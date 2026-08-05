import React, { useState } from 'react';
import { FileCode, Copy, Check, X, FileSpreadsheet, HardDrive, CheckCircle2 } from 'lucide-react';

interface GoogleScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleScriptModal: React.FC<GoogleScriptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `/**
 * Google Apps Script - Web App Receiver
 * บันทึกข้อมูลการส่งงาน, ข้อมูล QR Code และรูปภาพ ลงใน Google Sheets & Google Drive
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // 1. ระบุ ID ของ Google Sheet (หรือใช้ Active Sheet)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // ถ้ายังไม่มีหัวตาราง ให้สร้างอัตโนมัติ
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "วันเวลาที่ส่งงาน", 
        "หัวข้อการส่งงาน", 
        "ชื่อพนักงาน", 
        "รหัสพนักงาน", 
        "ข้อมูลเพิ่มเติม / QR Code", 
        "ลิงก์รูปภาพใน Google Drive"
      ]);
    }

    // 2. จัดการบันทึกรูปภาพลง Google Drive (ถ้ามี)
    var photoUrl = "-";
    if (data.photoUrl && data.photoUrl.indexOf("data:image/") === 0) {
      var folder = DriveApp.getRootFolder(); // หรือระบุ DriveApp.getFolderById("YOUR_FOLDER_ID");
      var base64Data = data.photoUrl.split(",")[1];
      var decodedBlob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/jpeg", "submission_" + new Date().getTime() + ".jpg");
      var file = folder.createFile(decodedBlob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      photoUrl = file.getUrl();
    }

    // 3. บันทึกบรรทัดใหม่ลง Google Sheet
    sheet.appendRow([
      new Date().toLocaleString("th-TH"),
      data.taskType || data.taskName || "-",
      data.employeeName || "-",
      data.employeeId || "-",
      data.qrCodeData || data.notes || "-",
      photoUrl
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success", photoUrl: photoUrl }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Google Apps Script ตัวอย่างสำหรับ Google Sheets</h2>
              <p className="text-xs text-emerald-100">รองรับบันทึกข้อมูล QR Code และรูปภาพลง Google Drive</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Instructions Step by Step */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ขั้นตอนการนำไปติดตั้งใช้งานใน Google Sheets:
            </h3>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <li>เปิด <b>Google Sheets</b> ของคุณขึ้นมา</li>
              <li>ไปที่เมนูด้านบนเลือก <b>ส่วนขยาย (Extensions) &gt; Apps Script</b></li>
              <li>วางโค้ดสคริปต์ด้านล่างนี้ลงในไฟล์ <code>Code.gs</code></li>
              <li>กดปุ่ม <b>ทำให้ใช้งานได้ (Deploy) &gt; การทำให้ใช้งานได้ใหม่ (New deployment)</b></li>
              <li>เลือกประเภทเป็น <b>เว็บแอป (Web app)</b> และตั้งค่า <i>"ผู้ที่มีสิทธิ์เข้าถึง (Who has access)"</i> เป็น <b>"ทุกคน (Anyone)"</b></li>
              <li>คัดลอก Web App URL ที่ได้ นำมาเชื่อมต่อรับส่งข้อมูลได้ทันที!</li>
            </ol>
          </div>

          {/* Script Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-400" /> โค้ด Google Apps Script (Code.gs):
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'คัดลอกโค้ดสำเร็จ!' : 'คัดลอกสคริปต์'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl text-xs font-mono overflow-x-auto max-h-64 leading-relaxed select-all">
              {scriptCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
