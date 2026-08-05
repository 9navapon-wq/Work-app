import React, { useState, useRef, useEffect } from 'react';
import { StaffProfile, DhlSubmission } from '../types';
import { StaffSelect } from './StaffSelect';
import { STORE_STAFF_LIST, StaffMember } from '../data/staffData';
import {
  Truck,
  X,
  Camera,
  Trash2,
  Send,
  Printer,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  User,
  FileText,
  RotateCcw,
  Eye,
} from 'lucide-react';

interface DhlModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile;
  onSubmit: (submission: DhlSubmission) => void;
}

export const DhlModal: React.FC<DhlModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSubmit,
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);

  // Staff selector state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(staff.employeeId);
  const [selectedStaffName, setSelectedStaffName] = useState(staff.employeeName);

  // DHL form state
  const [dhlTopic, setDhlTopic] = useState('รับ/ส่งมอบสินค้า DHL');
  const [images, setImages] = useState<string[]>([]);
  const [signerName, setSignerName] = useState('');
  const [notes, setNotes] = useState('');

  // PDF Preview State
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // Canvas Signature state & refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      const curr = new Date();
      setDate(curr.toISOString().split('T')[0]);
      setTime(curr.toTimeString().slice(0, 5));
      setSelectedEmployeeId(staff.employeeId);
      setSelectedStaffName(staff.employeeName);
      setImages([]);
      setSignerName('');
      setNotes('');
      setDhlTopic('รับ/ส่งมอบสินค้า DHL');
      setHasSignature(false);
      setSignatureDataUrl(undefined);
      setShowPdfPreview(false);
    }
  }, [isOpen, staff]);

  // Setup Canvas
  useEffect(() => {
    if (isOpen && !showPdfPreview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, showPdfPreview]);

  if (!isOpen) return null;

  // Compress image before adding to state to prevent browser memory & localStorage crash
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.65));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Handle Multi-Photo Upload (max 50 photos)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 50 - images.length;
    if (remainingSlots <= 0) {
      alert('ถ่ายรูป/อัปโหลดครบสูงสุด 50 ภาพแล้วครับ');
      return;
    }

    const filesToLoad = Array.from(files).slice(0, remainingSlots);

    try {
      const compressedResults = await Promise.all(
        filesToLoad.map((file) => compressImage(file))
      );
      const validResults = compressedResults.filter((res) => res && res.length > 0);
      setImages((prev) => {
        const next = [...prev, ...validResults];
        return next.slice(0, 50);
      });
    } catch (err) {
      console.error('Error compressing uploaded photos:', err);
    }

    // Reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Canvas Touch/Mouse drawing helpers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches) {
      const touch = e.touches[0] || (e as React.TouchEvent).changedTouches?.[0];
      if (!touch) return { x: 0, y: 0 };
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      setSignatureDataUrl(undefined);
    }
  };

  const handlePrintPdf = () => {
    // Save latest canvas signature before print
    if (canvasRef.current && hasSignature) {
      setSignatureDataUrl(canvasRef.current.toDataURL('image/png'));
    }
    setShowPdfPreview(true);
  };

  const executePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) {
      alert('กรุณาระบุชื่อผู้เซ็นรับ/ส่งงาน DHL');
      return;
    }

    // Capture latest signature from canvas if present
    let sigUrl = signatureDataUrl;
    if (canvasRef.current && hasSignature) {
      sigUrl = canvasRef.current.toDataURL('image/png');
    }

    const submission: DhlSubmission = {
      id: `dhl-${Date.now()}`,
      taskType: 'dhl',
      date,
      time,
      employeeId: selectedEmployeeId,
      employeeName: selectedStaffName,
      staffEmployeeId: selectedEmployeeId,
      staffEmployeeName: selectedStaffName,
      images,
      imageCount: images.length,
      signatureDataUrl: sigUrl,
      signerName: signerName.trim(),
      dhlTopic: dhlTopic.trim(),
      notes: notes.trim(),
      photoUrl: images.length > 0 ? images[0] : undefined,
      submittedAt: new Date().toLocaleString('th-TH'),
    };

    onSubmit(submission);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static">
        {/* PDF Export Preview Modal / Printable Document Area */}
        {showPdfPreview ? (
          <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none">
            {/* Header control buttons (Hidden when printing) */}
            <div className="bg-amber-500 text-slate-950 p-4 flex items-center justify-between font-bold print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                <span>ตัวอย่างเอกสารส่งงาน DHL พร้อมพิมพ์ PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={executePrint}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> บันทึกเป็นไฟล์ PDF / พิมพ์
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfPreview(false)}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> ปิดตัวอย่าง
                </button>
              </div>
            </div>

            {/* Printable Document Content */}
            <div className="p-8 space-y-6 print:p-6 print:space-y-4">
              <div className="border-b-2 border-amber-500 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      DHL
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        ใบรายงานส่งมอบ / ตรวจรับสินค้า DHL
                      </h1>
                      <p className="text-xs text-slate-500">
                        OFFICIAL DHL DAILY TRANSACTION & INSPECTION REPORT
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-slate-800">วันที่: {date}</p>
                  <p className="font-medium text-slate-500">เวลา: {time} น.</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">หัวข้อ / เลขที่งาน DHL:</span>
                  <span className="font-bold text-slate-900">{dhlTopic || 'รับ/ส่งมอบสินค้า DHL'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">พนักงานผู้ส่งงาน:</span>
                  <span className="font-bold text-slate-900">
                    {selectedStaffName} ({selectedEmployeeId})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">จำนวนภาพถ่ายที่นับได้:</span>
                  <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                    {images.length} / 50 ภาพ
                  </span>
                </div>
              </div>

              {notes && (
                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">📝 หมายเหตุเพิ่มเติม:</span>
                  <p className="text-slate-600">{notes}</p>
                </div>
              )}

              {/* Signer Signature Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="border border-slate-300 rounded-2xl p-4 bg-white text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-2">
                    ✍️ ลายมือชื่อผู้เซ็นรับ / ส่งงาน
                  </span>
                  <div className="h-28 flex items-center justify-center border-b border-dashed border-slate-200 mb-2">
                    {signatureDataUrl ? (
                      <img
                        src={signatureDataUrl}
                        alt="Signature"
                        className="max-h-24 max-w-full object-contain mx-auto"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">ไม่มีลายเซ็น</span>
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    ({signerName || 'ไม่ระบุชื่อผู้เซ็น'})
                  </p>
                  <span className="text-[11px] text-slate-500">ผู้รับ/ผู้ส่งมอบงาน DHL</span>
                </div>

                <div className="border border-slate-300 rounded-2xl p-4 bg-white text-center flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-2">
                      👥 เจ้าหน้าที่ผู้บันทึกรายงานหน้าร้าน
                    </span>
                    <div className="h-28 flex items-center justify-center">
                      <div className="text-center">
                        <User className="w-10 h-10 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs font-bold text-slate-700">{selectedStaffName}</p>
                        <p className="text-[11px] text-slate-400">รหัส: {selectedEmployeeId}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 border-t pt-2">
                    บันทึกเข้าระบบ WORK HUB โดยอัตโนมัติ
                  </p>
                </div>
              </div>

              {/* Photo Grid (Max 50 images) */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    ภาพถ่ายแนบประกอบการส่งมอบ/ตรวจรับ ({images.length} ภาพ)
                  </h3>
                </div>

                {images.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 border border-dashed rounded-2xl">
                    ไม่มีภาพถ่ายประกอบ
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square"
                      >
                        <img
                          src={img}
                          alt={`DHL ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Normal DHL Report Form Modal */
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-amber-200/80 dark:border-slate-800 my-8 overflow-hidden print:hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-600 text-slate-950 p-6 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shadow-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                    DHL ส่งงาน / ตรวจรับสินค้า
                  </h2>
                  <p className="text-xs font-semibold text-slate-900/80 mt-0.5">
                    ถ่ายรูปสูงสุด 50 ภาพ • นับจำนวนภาพอัตโนมัติ • เซ็นชื่อและพิมพ์ PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Row 1: Date, Time & Staff Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    📅 วันที่ส่งงาน
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ⏰ เวลา
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <StaffSelect
                  selectedEmployeeId={selectedEmployeeId}
                  onSelectStaff={(s: StaffMember) => {
                    setSelectedEmployeeId(s.employeeId);
                    setSelectedStaffName(s.employeeName);
                  }}
                  label="👤 เลือกพนักงานผู้ส่งงาน"
                  accentColor="amber"
                />
              </div>

              {/* DHL Topic / Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  หัวข้อ / รายการตรวจรับ DHL
                </label>
                <input
                  type="text"
                  value={dhlTopic}
                  onChange={(e) => setDhlTopic(e.target.value)}
                  placeholder="เช่น รับมอบกล่องสินค้า DHL ขาเข้า / ส่งมอบพัสดุประจำวัน..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Photo Upload Box (Up to 50 Images) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                        ภาพถ่ายประกอบการส่งงาน (ถ่ายได้สูงสุด 50 ภาพ)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        นับจำนวนภาพที่ถ่ายและอัปโหลดโดยอัตโนมัติ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black font-mono px-3 py-1 rounded-full border ${
                        images.length > 0
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300'
                      }`}
                    >
                      📸 จำนวนภาพ: {images.length} / 50 ภาพ
                    </span>
                  </div>
                </div>

                {/* Upload Button */}
                {images.length < 50 && (
                  <div>
                    <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-amber-400/70 hover:border-amber-500 dark:border-amber-600/50 rounded-2xl cursor-pointer bg-amber-50/50 hover:bg-amber-100/50 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 transition-colors">
                      <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                        + กดเพื่อถ่ายรูป หรือเลือกภาพถ่าย (เลือกได้หลายรูป / สูงสุด 50 ภาพ)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-2xs"
                      >
                        <img
                          src={img}
                          alt={`DHL ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setSelectedPhotoModal(img)}
                            className="p-1.5 bg-white text-slate-800 rounded-lg hover:scale-110 transition-transform"
                            title="ดูรูปใหญ่"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="p-1.5 bg-rose-600 text-white rounded-lg hover:scale-110 transition-transform"
                            title="ลบรูปนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Signer Name Input (พิมพ์ชื่อคนเซ็น) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    ✍️ พิมพ์ชื่อผู้เซ็นรับ / ส่งงาน (คนเซ็น) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="ระบุชื่อ-นามสกุล คนเซ็น / ผู้รับสินค้า..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    📝 หมายเหตุ (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="รายละเอียดเพิ่มเติม หรือหมายเหตุ..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Signature Canvas (มีให้เซ็นด้วยลายมือ) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-amber-500" />
                    เซ็นลายมือชื่อผู้ส่งงาน / ผู้รับสินค้า (เซ็นด้วยมือหรือเมาส์)
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> ล้างลายเซ็น
                  </button>
                </div>

                <div className="border-2 border-slate-300 dark:border-slate-700 rounded-2xl bg-white overflow-hidden relative">
                  <canvas
                    ref={canvasRef}
                    width={650}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-40 cursor-crosshair touch-none"
                  />
                  {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                      ✍️ ใช้นิ้วหรือเมาส์วาดเซ็นชื่อในกรอบนี้ได้เลย
                    </div>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 rounded-xl transition-all flex items-center gap-2 border border-amber-300 dark:border-amber-800 shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ดูตัวอย่าง & นำออกเป็นไฟล์ PDF
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> บันทึกส่งงาน DHL
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Large Photo Preview Modal */}
        {selectedPhotoModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn print:hidden">
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-700 hover:bg-rose-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedPhotoModal}
                alt="DHL Full Preview"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
