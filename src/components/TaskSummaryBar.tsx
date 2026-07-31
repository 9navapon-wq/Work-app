import React from 'react';
import { TaskSubmission, TaskTypeId } from '../types';
import { Bell, CheckCircle2, Clock, CreditCard, Megaphone, Sparkles, PackageCheck, Receipt, ArrowRight } from 'lucide-react';

interface TaskSummaryBarProps {
  submissions: TaskSubmission[];
  onOpenTask: (type: TaskTypeId) => void;
}

export const TASK_CONFIG: Record<TaskTypeId, {
  id: TaskTypeId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  accentGradient: string;
}> = {
  ufund: {
    id: 'ufund',
    title: 'UFund',
    subtitle: 'เช็กยอด & ประวัติธุรกรรมล่าสุด',
    icon: CreditCard,
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accentGradient: 'from-blue-600 to-indigo-600',
  },
  morning_brief: {
    id: 'morning_brief',
    title: 'Morning Brief',
    subtitle: 'ลงงานประชุมยามเช้า (จ/พ/ศ)',
    icon: Megaphone,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentGradient: 'from-amber-500 to-orange-600',
  },
  live_cleaning: {
    id: 'live_cleaning',
    title: 'Live Display & Big Cleaning',
    subtitle: 'ตรวจความสะอาด & ดิสเพลย์',
    icon: Sparkles,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentGradient: 'from-emerald-500 to-teal-600',
  },
  stock_count: {
    id: 'stock_count',
    title: 'นับสต๊อก It Easy',
    subtitle: 'ตรวจนับยอดคงเหลือสินค้า',
    icon: PackageCheck,
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    accentGradient: 'from-purple-600 to-indigo-600',
  },
  edit_bill: {
    id: 'edit_bill',
    title: 'แก้ไขบิล (EDIT BILL)',
    subtitle: 'ขอแก้ไขบิล & รับคืนสินค้า',
    icon: Receipt,
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accentGradient: 'from-rose-600 to-pink-600',
  },
};

export const TaskSummaryBar: React.FC<TaskSummaryBarProps> = ({
  submissions,
  onOpenTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySubmissions = submissions.filter((s) => s.date === todayStr);

  const isTaskSubmittedToday = (typeId: TaskTypeId) => {
    return todaySubmissions.some((s) => s.taskType === typeId);
  };

  const completedCount = Object.keys(TASK_CONFIG).filter((key) =>
    isTaskSubmittedToday(key as TaskTypeId)
  ).length;

  const totalTasks = Object.keys(TASK_CONFIG).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-indigo-200/80 dark:shadow-none mb-8 border-4 border-white dark:border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-lg font-black text-xl">
              <Bell className="w-6 h-6 text-indigo-600 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  🔔 งานวันนี้
                </h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white border border-white/30">
                  {totalTasks} รายการ
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-100 mt-0.5">
                ติดตามสถานะการส่งงานประจำวันของพนักงานหน้าร้าน
              </p>
            </div>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center gap-3.5 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <span className="text-[11px] font-bold text-indigo-100 block">ความคืบหน้ารวม</span>
              <span className="text-sm font-black text-white">
                {completedCount} / {totalTasks} สำเร็จ
              </span>
            </div>
            <div className="bg-white text-indigo-700 px-4 py-1.5 rounded-xl font-black text-lg shadow-md font-mono">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden mb-6 p-0.5 border border-white/10">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Task Mini Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(Object.keys(TASK_CONFIG) as TaskTypeId[]).map((typeId) => {
            const config = TASK_CONFIG[typeId];
            const Icon = config.icon;
            const isDone = isTaskSubmittedToday(typeId);

            return (
              <button
                key={typeId}
                onClick={() => onOpenTask(typeId)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 group ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-400/50 hover:bg-emerald-500/30 text-white'
                    : 'bg-white/15 border-white/20 hover:bg-white/25 text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                      isDone
                        ? 'bg-emerald-400 text-slate-950 font-bold'
                        : 'bg-white text-indigo-700 font-bold'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black truncate text-white">
                      {config.title}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold mt-0.5 ${
                        isDone ? 'text-emerald-300' : 'text-indigo-100'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> ส่งแล้ววันนี้
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-300" /> ยังไม่ได้ส่ง
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
