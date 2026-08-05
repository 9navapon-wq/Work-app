import React from 'react';
import { TaskTypeId, TaskSubmission } from '../types';
import {
  CreditCard,
  Check,
  Megaphone,
  Sparkles,
  PackageCheck,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ListChecks,
  Boxes,
  Receipt,
  Tag,
  Truck,
  QrCode,
} from 'lucide-react';

interface MainGridProps {
  onOpenTask: (type: TaskTypeId) => void;
  submissions: TaskSubmission[];
  ufundBalance: number;
}

export const MainGrid: React.FC<MainGridProps> = ({
  onOpenTask,
  submissions,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const isSubmittedToday = (typeId: TaskTypeId) => {
    return submissions.some((s) => s.date === todayStr && s.taskType === typeId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            เมนูส่งงานหลัก
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            เลือกเมนูด้านล่างเพื่อแนบรูปและกรอกรายงานส่งงานประจำวัน
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: UFund - Vibrant Blue */}
        <div
          onClick={() => onOpenTask('ufund')}
          className="group relative bg-blue-600 hover:bg-blue-650 text-white rounded-3xl p-5 sm:p-5.5 shadow-xl shadow-blue-200/60 dark:shadow-blue-950/30 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-[1.015]"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform relative shrink-0">
                    <CreditCard className="w-5.5 h-5.5 text-blue-600" />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-blue-600">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">
                      UFund
                    </h3>
                  </div>
                </div>

                {isSubmittedToday('ufund') ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-400 text-slate-950 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-amber-300" /> รอการส่ง
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-blue-50 leading-relaxed mb-1">
                เช็กยอดคงเหลือ ประวัติธุรกรรมล่าสุด พร้อมส่งรายงานสลิปประจำวัน
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>กดบันทึกส่งงาน UFund</span>
              <div className="w-8 h-8 rounded-xl bg-white text-blue-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Morning Brief - Energetic Orange */}
        <div
          onClick={() => onOpenTask('morning_brief')}
          className="group relative bg-orange-500 hover:bg-orange-550 text-white rounded-3xl p-5 sm:p-5.5 shadow-xl shadow-orange-200/60 dark:shadow-orange-950/30 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-[1.015]"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <Megaphone className="w-5.5 h-5.5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">
                      Morning Brief
                    </h3>
                  </div>
                </div>

                {isSubmittedToday('morning_brief') ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-400 text-slate-950 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-amber-200" /> รอการส่ง
                  </span>
                )}
              </div>

              {/* Day selection badge pills */}
              <div className="bg-black/15 border border-white/20 rounded-xl p-3 backdrop-blur-md mb-2">
                <span className="text-[11px] font-bold text-orange-100 flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-200" /> วันประชุมประจำสัปดาห์:
                </span>
                <div className="flex items-center gap-1.5">
                  {['จันทร์', 'พุธ', 'ศุกร์'].map((day, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30"
                    >
                      • {day}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                ลงสรุปหัวข้อประชุมยามเช้า เลือกวันงาน (จ/พ/ศ) พร้อมแนบรูปถ่ายทีมงาน
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>กรอก Morning Brief</span>
              <div className="w-8 h-8 rounded-xl bg-white text-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Live Display & Big Cleaning - Rich Emerald */}
        <div
          onClick={() => onOpenTask('live_cleaning')}
          className="group relative bg-emerald-500 hover:bg-emerald-550 text-white rounded-3xl p-5 sm:p-5.5 shadow-xl shadow-emerald-200/60 dark:shadow-emerald-950/30 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-[1.015]"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <Sparkles className="w-5.5 h-5.5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">
                      Live Display & Big Cleaning
                    </h3>
                  </div>
                </div>

                {isSubmittedToday('live_cleaning') ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-white text-emerald-700 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-emerald-200" /> รอการส่ง
                  </span>
                )}
              </div>

              {/* Work types badge pills */}
              <div className="bg-black/15 border border-white/20 rounded-xl p-3 backdrop-blur-md mb-2">
                <span className="text-[11px] font-bold text-emerald-100 flex items-center gap-1.5 mb-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-emerald-200" /> หมวดงานที่รายงาน:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30">
                    🧹 Live Display
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30">
                    ✨ Big Cleaning
                  </span>
                </div>
              </div>

              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                ตรวจเช็กความสะอาดดิสเพลย์หน้าร้านและจุดทำความสะอาดใหญ่ประจำสัปดาห์
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>เลือกประเภทงาน & ส่งรูป</span>
              <div className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: นับสต๊อก It Easy - Deep Indigo */}
        <div
          onClick={() => onOpenTask('stock_count')}
          className="group relative bg-indigo-700 hover:bg-indigo-750 text-white rounded-3xl p-5 sm:p-5.5 shadow-xl shadow-indigo-200/60 dark:shadow-indigo-950/30 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-[1.015]"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-indigo-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <PackageCheck className="w-5.5 h-5.5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">
                      นับสต๊อก It Easy
                    </h3>
                  </div>
                </div>

                {isSubmittedToday('stock_count') ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-400 text-slate-950 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-indigo-200" /> รอการส่ง
                  </span>
                )}
              </div>

              {/* Stock counting preview box */}
              <div className="bg-black/15 border border-white/20 rounded-xl p-3 backdrop-blur-md mb-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-100 mb-0.5">
                  <span className="flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-indigo-200" /> นับสต๊อกสินค้าหน้าร้าน
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">
                    6 หมวดสินค้า
                  </span>
                </div>
                <p className="text-[10px] font-medium text-indigo-100/90">
                  ระบบช่วยเช็กยอดคงเหลือ ตรวจคำนวณส่วนต่าง พร้อมแนบรูปถ่ายพื้นที่จริง
                </p>
              </div>

              <p className="text-xs font-medium text-indigo-50 leading-relaxed">
                กรอกจำนวนนับสต๊อกสินค้าคงเหลือ ตรวจสอบความถูกต้องและส่งสถิติล่าสุด
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>เริ่มนับสต๊อก & ส่งงาน</span>
              <div className="w-8 h-8 rounded-xl bg-white text-indigo-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: แก้ไขบิล (EDIT BILL) - Rich Rose/Red */}
        <div
          onClick={() => onOpenTask('edit_bill')}
          className="group relative bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-650 hover:to-red-650 text-white rounded-3xl p-5 sm:p-5.5 shadow-xl shadow-rose-200/60 dark:shadow-rose-950/30 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-[1.015]"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <Receipt className="w-5.5 h-5.5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">
                      แก้ไขบิล (EDIT BILL)
                    </h3>
                  </div>
                </div>

                {isSubmittedToday('edit_bill') ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-400 text-slate-950 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-rose-200" /> รอการส่ง
                  </span>
                )}
              </div>

              {/* Edit categories preview pills */}
              <div className="bg-black/15 border border-white/20 rounded-xl p-3 backdrop-blur-md mb-2">
                <span className="text-[11px] font-bold text-rose-100 flex items-center gap-1.5 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-200" /> ตัวเลือกประเภทการแก้ไขบิลในระบบ:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30">
                    • edit bill หลัง 20:00
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30">
                    • รับคืนภายใน 7 วัน
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30">
                    • รับคืนเกิน 7 วัน
                  </span>
                </div>
              </div>

              <p className="text-xs font-medium text-rose-50 leading-relaxed">
                รายงานคำขอแก้ไขบิล / รับคืนสินค้า ระบุวันเวลา รายการสินค้า ราคา Phy ID พร้อมเลือกพนักงานผู้ส่งงาน
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>เลือกประเภท & กรอกขอแก้ไขบิล</span>
              <div className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: DHL ส่งงาน / ตรวจรับสินค้า - Amber/Yellow Gradient */}
        <div
          onClick={() => onOpenTask('dhl')}
          className="group relative bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 rounded-3xl p-5 sm:p-5.5 shadow-xl shadow-amber-200/60 dark:shadow-amber-950/30 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white dark:border-slate-800 hover:scale-[1.015]"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none group-hover:bg-white/30 transition-all" />

          <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <Truck className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950 leading-tight">
                      DHL ส่งงาน / ตรวจรับ
                    </h3>
                  </div>
                </div>

                {isSubmittedToday('dhl') ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" /> ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/20 text-slate-950 backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-slate-900" /> รอการส่ง
                  </span>
                )}
              </div>

              {/* DHL Features Preview Box */}
              <div className="bg-slate-950/10 border border-slate-950/20 rounded-xl p-3 backdrop-blur-md mb-2">
                <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <QrCode className="w-3.5 h-3.5 text-slate-950" /> จุดเด่นระบบตรวจรับ DHL:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-amber-300 text-[11px] font-extrabold border border-slate-950/20">
                    📷 สแกน QR / บาร์โค้ด
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-[11px] font-extrabold border border-emerald-800">
                    📊 บันทึกลง Google ชีต
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/10 text-slate-950 text-[11px] font-extrabold border border-slate-950/20">
                    ✍️ เซ็นชื่อ & พิมพ์ PDF
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                สแกน QR Code หรือบาร์โค้ดพัสดุ DHL เพื่อคีย์ข้อมูลลง Google ชีตโดยอัตโนมัติ พร้อมลายมือชื่อผู้เซ็น แนบรูปภาพ และนำออกเป็น PDF
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-950/20 flex items-center justify-between text-xs font-bold text-slate-950">
              <span>สแกน QR / บาร์โค้ดคีย์ข้อมูลลง Google ชีต</span>
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
