import type { Inquiry } from "@shared/schema";

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: string;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;
  private apiUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  private isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  private formatInquiryMessage(inquiry: Inquiry): string {
    const date = inquiry.createdAt 
      ? new Date(inquiry.createdAt).toLocaleString('ru-RU', {
          timeZone: 'Asia/Almaty',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      : new Date().toLocaleString('ru-RU');

    return `🚗 *Новая заявка с сайта TPMS*

👤 *Имя:* ${inquiry.name}
📞 *Телефон:* ${inquiry.phone}
${inquiry.email ? `📧 *Email:* ${inquiry.email}\n` : ''}${inquiry.carModel ? `🚙 *Модель авто:* ${inquiry.carModel}\n` : ''}
💬 *Сообщение:*
${inquiry.message}

📅 *Дата:* ${date}
🆔 *ID заявки:* #${inquiry.id}

---
*Ответьте клиенту как можно скорее!*`;
  }

  async sendInquiryNotification(inquiry: Inquiry): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Telegram bot not configured. Skipping notification.');
      return false;
    }

    try {
      const message: TelegramMessage = {
        chat_id: this.chatId,
        text: this.formatInquiryMessage(inquiry),
        parse_mode: 'Markdown'
      };

      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Telegram API error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Telegram notification sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }

  async sendTestMessage(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Telegram bot not configured. Cannot send test message.');
      return false;
    }

    try {
      const message: TelegramMessage = {
        chat_id: this.chatId,
        text: '✅ *Тест уведомлений TPMS*\n\nВаш бот успешно настроен и готов отправлять уведомления о новых заявках!',
        parse_mode: 'Markdown'
      };

      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending test message:', error);
      return false;
    }
  }
}

export const telegramService = new TelegramService();