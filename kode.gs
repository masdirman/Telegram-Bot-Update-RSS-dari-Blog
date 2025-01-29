const TOKEN = "API-TOKET-BOT-DISINI"; // API token bot dari BotFather
const CHAT_ID = "-1234567890"; // ID chat/grup
const RSS_URL = "https://feeds.feedburner.com/dirman/blog"; // Gunakan URL RSS feed
const API_URL = `https://api.telegram.org/bot${TOKEN}`;

function fetchRSSFeed() {
  const response = UrlFetchApp.fetch(RSS_URL);
  const xml = response.getContentText();
  const document = XmlService.parse(xml);
  const root = document.getRootElement();
  const channel = root.getChild("channel");
  
  // Ambil item pertama (berita terbaru)
  const item = channel.getChildren("item")[0];
  const title = item.getChildText("title");
  const link = item.getChildText("link");
  const pubDate = item.getChildText("pubDate");

  // Format pesan
  const message = `🔄 Dirman.web.id #UpdateBlog\n\n✍️ Judul: *${title}*\n⏰ ${pubDate}`;

  // Kirim dengan tombol interaktif
  sendMessageWithButton(message, link);
}

// Fungsi untuk mengirim pesan ke Telegram dengan tombol
function sendMessageWithButton(message, link) {
  const replyMarkup = {
    inline_keyboard: [
      [{ text: "📚 Baca Konten", url: link }]
    ]
  };

  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: JSON.stringify(replyMarkup)
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(`${API_URL}/sendMessage`, options);
}
