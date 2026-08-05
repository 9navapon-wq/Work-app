import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json({ limit: '15mb' }));

  // API Route: Check Telegram configuration status
  app.get('/api/telegram-config', (req, res) => {
    const hasEnvToken = Boolean(process.env.TELEGRAM_BOT_TOKEN);
    const hasEnvChatId = Boolean(process.env.TELEGRAM_CHAT_ID);
    res.json({
      configuredInEnv: hasEnvToken && hasEnvChatId,
      botTokenSet: hasEnvToken,
      chatIdSet: hasEnvChatId,
    });
  });

  // API Route: Send Telegram Notification
  app.post('/api/telegram-notify', async (req, res) => {
    try {
      const { botToken, chatId, message, photoUrl } = req.body;

      const activeToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
      const activeChatId = chatId || process.env.TELEGRAM_CHAT_ID;

      if (!activeToken || !activeChatId) {
        return res.status(400).json({
          success: false,
          error: 'กรุณากรอก Telegram Bot Token และ Chat ID ก่อนใช้งาน (สามารถตั้งค่าใน UI หรือใน .env ได้)',
        });
      }

      // If photo is present (base64 or HTTP URL)
      if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim().length > 0) {
        if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
          const photoEndpoint = `https://api.telegram.org/bot${activeToken}/sendPhoto`;
          const photoResponse = await fetch(photoEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: activeChatId,
              photo: photoUrl,
              caption: message,
              parse_mode: 'HTML',
            }),
          });

          const photoData = await photoResponse.json();
          if (photoData.ok) {
            return res.json({ success: true, result: photoData.result });
          }
        } else if (photoUrl.startsWith('data:image/')) {
          try {
            const matches = photoUrl.match(/^data:(image\/\w+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');
              const blob = new Blob([buffer], { type: mimeType });

              const formData = new FormData();
              formData.append('chat_id', activeChatId);
              formData.append('photo', blob, 'photo.jpg');
              formData.append('caption', message);
              formData.append('parse_mode', 'HTML');

              const photoEndpoint = `https://api.telegram.org/bot${activeToken}/sendPhoto`;
              const photoResponse = await fetch(photoEndpoint, {
                method: 'POST',
                body: formData,
              });

              const photoData = await photoResponse.json();
              if (photoData.ok) {
                return res.json({ success: true, result: photoData.result });
              } else {
                console.warn('Telegram sendPhoto base64 error:', photoData.description);
              }
            }
          } catch (photoErr) {
            console.error('Failed to parse or send base64 photo to Telegram:', photoErr);
          }
        }
      }

      // Default text message fallback
      const textEndpoint = `https://api.telegram.org/bot${activeToken}/sendMessage`;
      const response = await fetch(textEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: activeChatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        return res.status(400).json({
          success: false,
          error: data.description || 'เกิดข้อผิดพลาดในการส่งข้อความผ่าน Telegram Bot API',
        });
      }

      return res.json({ success: true, result: data.result });
    } catch (err: any) {
      console.error('Telegram API error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Telegram API',
      });
    }
  });

  // Google Sheets Webhook proxy
  app.post('/api/google-sheets/record', async (req, res) => {
    try {
      const { webhookUrl, sheetName, rowData, submission } = req.body;

      const activeWebhookUrl = webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

      if (!activeWebhookUrl) {
        // Return ok with local sync mode if no webhook URL configured yet
        return res.json({ success: true, mode: 'local' });
      }

      const response = await fetch(activeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName: sheetName || 'บันทึกงานประจำวัน',
          values: rowData,
          submission,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        return res.json({ success: true, mode: 'webhook' });
      } else {
        const errText = await response.text();
        return res.status(400).json({ success: false, error: errText });
      }
    } catch (err: any) {
      console.error('Google Sheets record error:', err);
      // Still succeed gracefully so workflow isn't blocked
      return res.json({ success: true, mode: 'fallback' });
    }
  });

  // Vite middleware for dev or Static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WORK HUB Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
