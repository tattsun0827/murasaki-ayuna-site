(() => {
  // GASをデプロイしたら、下記のプレースホルダーをWebアプリURLへ置換してください。
  const GAS_WEB_APP_URL = 'YOUR_GAS_WEB_APP_URL_HERE';
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const button = form?.querySelector('button[type="submit"]');

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = `form-status show ${type}`;
    status.focus();
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (GAS_WEB_APP_URL === 'YOUR_GAS_WEB_APP_URL_HERE') {
      showStatus('現在フォームを準備中です。GAS WebアプリURLの設定後に送信できます。', 'error');
      return;
    }

    if (!form.reportValidity()) return;
    if (form.elements.website.value) return;

    const payload = {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(),
      category: form.elements.category.value,
      message: form.elements.message.value.trim()
    };

    button.disabled = true;
    button.textContent = '送信中…';
    status.className = 'form-status';

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      if (!response.ok) throw new Error('送信に失敗しました');
      const result = await response.json();
      if (!result.success) throw new Error(result.message || '送信に失敗しました');
      form.reset();
      showStatus('お問い合わせありがとうございます。内容を確認のうえ、ご連絡いたします。', 'success');
    } catch (error) {
      console.error(error);
      showStatus('送信できませんでした。時間をおいて再度お試しください。', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'お問い合わせを送信';
    }
  });
})();
