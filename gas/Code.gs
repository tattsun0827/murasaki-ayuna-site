/**
 * 紫あゆな公式サイト お問い合わせ受付GAS
 * このスクリプトをお問い合わせ管理用スプレッドシートから作成した
 * Apps Scriptプロジェクトへ貼り付けてください。
 */
const NOTIFICATION_EMAIL = 'kazutatsu0827@gmail.com';
const SHEET_NAME = 'お問い合わせ';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ success: false, message: '送信データがありません。' });
    }

    const data = JSON.parse(e.postData.contents);
    const name = sanitize_(data.name, 100);
    const company = sanitize_(data.company, 150);
    const email = sanitize_(data.email, 254);
    const category = sanitize_(data.category, 50);
    const message = sanitize_(data.message, 3000);

    if (!name || !email || !category || !message) {
      return jsonResponse_({ success: false, message: '必須項目が入力されていません。' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse_({ success: false, message: 'メールアドレスの形式が正しくありません。' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        sheet.appendRow(['日時', 'お名前', '貴社名', 'メールアドレス', 'ご相談カテゴリー', 'お問い合わせ内容']);
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([new Date(), name, company, email, category, message]);
    } finally {
      lock.releaseLock();
    }

    const subject = '【紫あゆな公式サイト】新しいお問い合わせ：' + category;
    const body = [
      '紫あゆな公式サイトからお問い合わせが届きました。', '',
      'お名前：' + name,
      '貴社名：' + (company || '未入力'),
      'メールアドレス：' + email,
      'ご相談カテゴリー：' + category, '',
      'お問い合わせ内容：', message, '',
      '受信日時：' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss')
    ].join('\n');
    MailApp.sendEmail({ to: NOTIFICATION_EMAIL, subject: subject, body: body, replyTo: email, name: '紫あゆな公式サイト' });

    return jsonResponse_({ success: true, message: 'お問い合わせを受け付けました。' });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ success: false, message: 'サーバーでエラーが発生しました。' });
  }
}

function doGet() {
  return jsonResponse_({ success: true, message: 'お問い合わせ受付GASは稼働中です。' });
}

function sanitize_(value, maxLength) {
  const text = String(value == null ? '' : value).trim().slice(0, maxLength);
  // スプレッドシートの数式として解釈される文字から始まる場合は無害化します。
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
