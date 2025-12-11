const axios = require('axios');

const sendTelegramNotification = async (shortCode, originalUrl, ip, userAgent) => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN || '8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk';
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!chatId) {
            console.log('⚠️ Telegram Chat ID not configured');
            return;
        }

        const message = `
🔗 <b>New Link Click!</b>

📎 Short Code: <code>${shortCode}</code>
🌐 Original URL: ${originalUrl}
📍 IP Address: ${ip}
💻 User Agent: ${userAgent}
⏰ Time: ${new Date().toLocaleString('vi-VN')}
    `;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });

        console.log('✅ Telegram notification sent');
    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error.message);
    }
};

module.exports = { sendTelegramNotification };
