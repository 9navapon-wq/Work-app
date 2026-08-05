import { TaskSubmission } from '../types';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export const getStoredTelegramConfig = (): TelegramConfig => {
  const token = localStorage.getItem('workhub_telegram_bot_token') || '';
  const chatId = localStorage.getItem('workhub_telegram_chat_id') || '';
  return { botToken: token, chatId };
};

export const setStoredTelegramConfig = (config: TelegramConfig) => {
  localStorage.setItem('workhub_telegram_bot_token', config.botToken.trim());
  localStorage.setItem('workhub_telegram_chat_id', config.chatId.trim());
};

export const formatTelegramMessage = (submission: TaskSubmission): string => {
  const { taskType, employeeName, employeeId, submittedAt, date, time } = submission;

  const dateStr = submittedAt || `${date} ${time} น.`;
  const staffName = employeeName || 'ไม่ระบุ';
  const empId = employeeId || '-';

  let header = '';
  let details = '';

  switch (taskType) {
    case 'ufund': {
      const sub = submission as any;
      const amountText = `<b>${Number(sub.currentBalance || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</b>`;
      header = '💳 <b>[รายงานส่งงาน] UFund สลิปประจำวัน</b>';
      details = `
• <b>ยอดคงเหลือปัจจุบัน:</b> ${amountText}
• <b>หมายเหตุ/ธุรกรรม:</b> ${sub.transactionNote || sub.notes || '-'}
`;
      break;
    }
    case 'morning_brief': {
      const sub = submission as any;
      header = '📣 <b>[รายงานส่งงาน] Morning Brief ประจำวัน</b>';
      details = `
• <b>วันประชุม:</b> วัน${sub.workDay || '-'}
• <b>หัวข้อบรีฟ:</b> ${sub.briefTopic || '-'}
• <b>รายละเอียด/บันทึก:</b> ${sub.notes || '-'}
`;
      break;
    }
    case 'live_cleaning': {
      const sub = submission as any;
      header = '✨ <b>[รายงานส่งงาน] Live Display & Big Cleaning</b>';
      details = `
• <b>ประเภทงาน:</b> ${sub.jobType || '-'}
• <b>บันทึกเพิ่มเติม:</b> ${sub.notes || '-'}
`;
      break;
    }
    case 'stock_count': {
      const sub = submission as any;
      const itemsCount = sub.items ? sub.items.length : 0;
      const itemsList = sub.items
        ? sub.items.map((i: any) => `  - ${i.itemName}: <b>${i.actualCount}</b> ${i.unit}`).join('\n')
        : '-';
      header = '📦 <b>[รายงานส่งงาน] Stock Count ตรวจนับสินค้า</b>';
      details = `
• <b>รายการสินค้าทั้งหมด:</b> ${itemsCount} รายการ
• <b>รวมจำนวนนับจริง:</b> ${sub.totalUnitsCounted || 0} ชิ้น
• <b>รายละเอียดการนับ:</b>
${itemsList}
• <b>หมายเหตุ:</b> ${sub.notes || '-'}
`;
      break;
    }
    case 'edit_bill': {
      const sub = submission as any;
      const priceText = `<b>${Number(sub.price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท</b>`;
      header = '📝 <b>[รายงานส่งงาน] แก้ไขบิล (EDIT BILL)</b>';
      details = `
• <b>ตัวเลือก/ประเภท:</b> ${sub.editCategory || '-'}
• <b>วันเวลาที่เกิดรายการ:</b> ${sub.dateTime || `${sub.date} ${sub.time}`}
• <b>สินค้า:</b> ${sub.productName || '-'}
• <b>ราคา:</b> ${priceText}
• <b>Phy ID:</b> <code>${sub.phyId || '-'}</code>
• <b>เหตุผลที่ขอแก้ไข:</b> ${sub.reason || sub.notes || '-'}
`;
      break;
    }
    case 'dhl': {
      const sub = submission as any;
      header = '🚚 <b>[รายงานส่งงาน] DHL ส่งงาน / ตรวจรับสินค้า</b>';
      details = `
• <b>หัวข้อ/รายการ DHL:</b> ${sub.dhlTopic || 'รับ/ส่งมอบสินค้า DHL'}
• <b>พนักงานผู้ส่งงาน:</b> ${sub.staffEmployeeName || sub.employeeName} (${sub.staffEmployeeId || sub.employeeId})
• <b>ผู้เซ็นรับ/ส่งงาน:</b> <b>${sub.signerName || 'ไม่ระบุ'}</b>
• <b>จำนวนภาพถ่ายที่นับได้:</b> <b>${sub.imageCount || 0} ภาพ</b> (สูงสุด 50 ภาพ)
• <b>หมายเหตุ:</b> ${sub.notes || '-'}
`;
      break;
    }
    default:
      header = '📌 <b>[รายงานส่งงาน] รายงานใหม่</b>';
      details = '• ส่งรายงานสำเร็จ';
  }

  return `
${header}
━━━━━━━━━━━━━━━━━━
👤 <b>ผู้ส่งงาน:</b> ${staffName}
🆔 <b>รหัสพนักงาน:</b> <code>${empId}</code>
🕒 <b>เวลาส่ง:</b> ${dateStr}
━━━━━━━━━━━━━━━━━━
${details.trim()}
✅ <i>สถานะ: บันทึกรายงานเข้าสู่ระบบ WORK HUB เรียบร้อย</i>
  `.trim();
};

export const extractSubmissionPhoto = (submission: any): string | undefined => {
  if (submission.photoUrl && typeof submission.photoUrl === 'string') return submission.photoUrl;
  if (submission.imageUrl && typeof submission.imageUrl === 'string') return submission.imageUrl;
  if (submission.slipImageUrl && typeof submission.slipImageUrl === 'string') return submission.slipImageUrl;
  if (submission.billPhotoUrl && typeof submission.billPhotoUrl === 'string') return submission.billPhotoUrl;
  if (Array.isArray(submission.images) && submission.images.length > 0 && typeof submission.images[0] === 'string') {
    return submission.images[0];
  }
  if (Array.isArray(submission.photos) && submission.photos.length > 0 && typeof submission.photos[0] === 'string') {
    return submission.photos[0];
  }
  if (submission.signatureDataUrl && typeof submission.signatureDataUrl === 'string') return submission.signatureDataUrl;
  return undefined;
};

export const sendTelegramNotification = async (submission: TaskSubmission): Promise<{ success: boolean; error?: string }> => {
  const config = getStoredTelegramConfig();
  const message = formatTelegramMessage(submission);
  const photoUrl = extractSubmissionPhoto(submission as any);

  try {
    const res = await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        botToken: config.botToken || undefined,
        chatId: config.chatId || undefined,
        message,
        photoUrl,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'ไม่สามารถส่งการแจ้งเตือน Telegram ได้' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' };
  }
};

export const sendTestTelegramNotification = async (botToken: string, chatId: string): Promise<{ success: boolean; error?: string }> => {
  const testMessage = `
🔔 <b>ทดสอบการเชื่อมต่อ Telegram Bot</b>
━━━━━━━━━━━━━━━━━━
WORK HUB Applet สามารถส่งการแจ้งเตือนผ่าน Telegram ได้อย่างสมบูรณ์แล้ว! 🎉
🕒 เวลาทดสอบ: ${new Date().toLocaleString('th-TH')}
  `.trim();

  try {
    const res = await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        botToken,
        chatId,
        message: testMessage,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'ไม่สามารถส่งข้อความทดสอบได้' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการส่งข้อความทดสอบ' };
  }
};
