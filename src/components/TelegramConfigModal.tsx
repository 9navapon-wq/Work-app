import React, { useState, useEffect } from 'react';
import {
  Send,
  X,
  Bot,
  Key,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  getStoredTelegramConfig,
  setStoredTelegramConfig,
  sendTestTelegramNotification,
} from '../lib/telegramService';

interface TelegramConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramConfigModal: React.FC<TelegramConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [envConfigured, setEnvConfigured] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredTelegramConfig();
      setBotToken(stored.botToken);
      setChatId(stored.chatId);
      setStatusMessage(null);

      // Check server env configuration
      fetch('/api/telegram-config')
        .then((res) => res.json())
        .then((data) => {
          if (data.configuredInEnv) {
            setEnvConfigured(true);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredTelegramConfig({ botToken, chatId });
    setStatusMessage({
      type: 'success',
      text: 'บันทึกการตั้งค่า Telegram Bot เรียบร้อยแล้ว!',
    });
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    setStatusMessage(null);

    const result = await sendTestTelegramNotification(botToken, chatId);
    setIsTesting(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: '✅ ส่งข้อความทดสอบไปยัง Telegram เรียบร้อยแล้ว! กรุณาเช็กในแอป Telegram ของคุณ',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: `❌ การทดสอบล้มเหลว: ${result.error}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 flex-shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">ตั้งค่าการแจ้งเตือน Telegram</h3>
              <p className="text-xs text-blue-100 mt-0.5 font-medium">
                แจ้งเตือนทันทีเข้ากลุ่ม/แชต Telegram เมื่อมีพนักงานกดส่งรายงาน
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {envConfigured && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>ตรวจพบการตั้งค่า Telegram Bot Token ในระบบ (.env) เรียบร้อยแล้ว</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-blue-600" /> Telegram Bot Token
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="เช่น 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                className="w-full px-4 py-3 text-xs font-mono font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                สร้างได้จาก Telegram โดยพิมพ์ค้นหา @BotFather
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-sky-600" /> Telegram Chat ID / Channel ID
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="เช่น -100123456789 หรือ ID ส่วนตัว"
                className="w-full px-4 py-3 text-xs font-mono font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                รหัสกลุ่มหรือแชตที่ต้องการรับแจ้งเตือน (รับ ID ได้จาก @userinfobot)
              </p>
            </div>

            {statusMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                💾 บันทึกการตั้งค่า
              </button>

              <button
                type="button"
                onClick={handleTestNotification}
                disabled={isTesting}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isTesting ? 'กำลังทดสอบ...' : '⚡ ทดสอบส่งแจ้งเตือน'}
              </button>
            </div>
          </form>

          {/* Quick Guide */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">💡 คำแนะนำสั้นๆ:</p>
            <p>1. ค้นหา <b>@BotFather</b> ใน Telegram แล้วส่งคำสั่ง <code>/newbot</code> เพื่อเอา Bot Token</p>
            <p>2. ดึง Bot เข้ากลุ่มไลน์/แชต Telegram และตั้งค่าเป็น Admin</p>
            <p>3. เอา Chat ID ของกลุ่มมากรอกที่ช่อง Telegram Chat ID ด้านบน</p>
          </div>
        </div>
      </div>
    </div>
  );
};
