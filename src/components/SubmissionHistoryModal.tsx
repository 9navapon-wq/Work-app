import React, { useState } from 'react';
import { TaskSubmission, TaskTypeId } from '../types';
import { TASK_CONFIG } from './TaskSummaryBar';
import {
  History,
  X,
  Search,
  Calendar,
  Clock,
  User,
  Trash2,
  FileText,
  Eye,
  Download,
  Filter,
  CheckCircle2,
  Printer,
  Truck,
  Image as ImageIcon,
} from 'lucide-react';

interface SubmissionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: TaskSubmission[];
  onDeleteSubmission: (id: string) => void;
  onClearAll: () => void;
}

export const SubmissionHistoryModal: React.FC<SubmissionHistoryModalProps> = ({
  isOpen,
  onClose,
  submissions,
  onDeleteSubmission,
  onClearAll,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedDhlPdf, setSelectedDhlPdf] = useState<any | null>(null);

  if (!isOpen) return null;

  const filteredSubmissions = submissions.filter((item) => {
    const matchesType = filterType === 'all' || item.taskType === filterType;
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `workhub-submissions-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-900 p-6 text-white relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">ประวัติการส่งงานประจำวัน</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  รวม {submissions.length} รายการที่ถูกบันทึกในระบบ
                </p>
              </div>
            </div>

            {submissions.length > 0 && (
              <button
                onClick={handleExportJSON}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" /> ส่งออกไฟล์ JSON
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด ({submissions.length})
              </button>
              {(Object.keys(TASK_CONFIG) as TaskTypeId[]).map((typeId) => {
                const config = TASK_CONFIG[typeId];
                const count = submissions.filter((s) => s.taskType === typeId).length;
                return (
                  <button
                    key={typeId}
                    onClick={() => setFilterType(typeId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                      filterType === typeId
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{config.title}</span>
                    <span className="text-[10px] opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ/รหัส..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                ยังไม่มีรายการประวัติการส่งงาน
              </p>
              <p className="text-xs text-slate-400 mt-1">
                เมื่อท่านทำรายการจากเมนูหลัก ข้อมูลจะมาปรากฏอยู่ในหน้านี้
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((item) => {
                const config = TASK_CONFIG[item.taskType];
                const Icon = config.icon;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 justify-between items-start"
                  >
                    <div className="flex gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${config.accentGradient} text-white flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {config.title}
                          </span>

                          {/* Specific badges */}
                          {item.taskType === 'morning_brief' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200">
                              วัน{item.workDay}
                            </span>
                          )}

                          {item.taskType === 'live_cleaning' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200">
                              {item.jobType}
                            </span>
                          )}

                          {item.taskType === 'edit_bill' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200">
                              🏷️ {(item as any).editCategory}
                            </span>
                          )}

                          {item.taskType === 'dhl' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200">
                              🚚 DHL ({ (item as any).imageCount || 0 } ภาพ)
                            </span>
                          )}

                          <span className="text-[11px] font-medium text-slate-400">
                            บันทึกเมื่อ {item.submittedAt}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            📅 {item.date}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            ⏰ {item.time} น.
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                            👤 {item.employeeName} ({item.employeeId})
                          </span>
                        </div>

                        {item.taskType === 'dhl' ? (
                          <div className="bg-amber-50/80 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 mt-2 text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span><strong>🚚 หัวข้อ:</strong> {(item as any).dhlTopic || 'รับ/ส่งมอบสินค้า DHL'}</span>
                              <span><strong>✍️ ผู้เซ็น:</strong> <span className="font-bold text-amber-700 dark:text-amber-400">{(item as any).signerName || '-'}</span></span>
                              <span><strong>📸 จำนวนภาพ:</strong> {(item as any).imageCount || 0} ภาพ (สูงสุด 50 ภาพ)</span>
                            </div>
                            {(item as any).notes && (
                              <div>
                                <span><strong>📝 หมายเหตุ:</strong> {(item as any).notes}</span>
                              </div>
                            )}
                          </div>
                        ) : item.taskType === 'edit_bill' ? (
                          <div className="bg-rose-50/80 dark:bg-rose-950/30 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/50 mt-2 text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span><strong>🕒 วันเวลา:</strong> {(item as any).dateTime || `${item.date} ${item.time}`}</span>
                              <span><strong>📦 สินค้า:</strong> {(item as any).productName}</span>
                              <span><strong>💰 ราคา:</strong> {Number((item as any).price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span><strong>🔢 Phy ID:</strong> <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800 font-mono font-bold">{(item as any).phyId}</code></span>
                              <span><strong>❓ เหตุผล:</strong> {(item as any).reason}</span>
                            </div>
                          </div>
                        ) : item.notes ? (
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl mt-2 border border-slate-100 dark:border-slate-700/60">
                            📝 {item.notes}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Right action & Image Thumbnail */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {item.photoUrl && (
                        <button
                          onClick={() => setSelectedPhoto(item.photoUrl || null)}
                          className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-2xs hover:scale-105 transition-all"
                          title="ดูรูปภาพขนาดใหญ่"
                        >
                          <img
                            src={item.photoUrl}
                            alt="Attached"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Eye className="w-4 h-4" />
                          </div>
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteSubmission(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {submissions.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                แสดงผล {filteredSubmissions.length} จาก {submissions.length} รายการ
              </span>
              <button
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการส่งงานทั้งหมด?')) {
                    onClearAll();
                  }
                }}
                className="text-rose-600 hover:text-rose-800 font-semibold"
              >
                ล้างประวัติทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Photo Viewer Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full z-10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Enlarged proof"
              className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
