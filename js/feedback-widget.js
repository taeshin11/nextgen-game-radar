// Feedback Widget for NextGen Game Radar
(function () {
  'use strict';

  const FEEDBACK_TRANSLATIONS = {
    en: { title: 'Send Feedback', placeholder: 'Your message...', submit: 'Send', close: 'Close' },
    ko: { title: '피드백 보내기', placeholder: '메시지를 입력하세요...', submit: '보내기', close: '닫기' },
    ja: { title: 'フィードバックを送る', placeholder: 'メッセージを入力...', submit: '送信', close: '閉じる' },
    zh: { title: '发送反馈', placeholder: '您的消息...', submit: '发送', close: '关闭' },
    es: { title: 'Enviar comentarios', placeholder: 'Tu mensaje...', submit: 'Enviar', close: 'Cerrar' },
    de: { title: 'Feedback senden', placeholder: 'Ihre Nachricht...', submit: 'Senden', close: 'Schließen' },
    fr: { title: 'Envoyer un commentaire', placeholder: 'Votre message...', submit: 'Envoyer', close: 'Fermer' },
    pt: { title: 'Enviar feedback', placeholder: 'Sua mensagem...', submit: 'Enviar', close: 'Fechar' }
  };

  function getLang() {
    if (typeof I18N !== 'undefined' && I18N.currentLang) {
      return I18N.currentLang;
    }
    return 'en';
  }

  function getT() {
    const lang = getLang();
    return FEEDBACK_TRANSLATIONS[lang] || FEEDBACK_TRANSLATIONS['en'];
  }

  function createWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #ngr-feedback-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #4E8FFF;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(78,143,255,0.4);
        z-index: 9999;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #ngr-feedback-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(78,143,255,0.5);
      }
      #ngr-feedback-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 80px 24px 24px 24px;
      }
      #ngr-feedback-modal {
        background: #222838;
        border: 1px solid #374151;
        border-radius: 16px;
        padding: 20px;
        width: 300px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        position: relative;
      }
      #ngr-feedback-modal h3 {
        font-size: 15px;
        font-weight: 600;
        color: #E8E8EC;
        margin: 0 0 12px 0;
      }
      #ngr-feedback-modal textarea {
        width: 100%;
        height: 90px;
        background: #2A3042;
        border: 1px solid #374151;
        border-radius: 8px;
        padding: 8px;
        font-size: 13px;
        color: #E8E8EC;
        resize: vertical;
        outline: none;
        font-family: inherit;
        box-sizing: border-box;
      }
      #ngr-feedback-modal textarea:focus {
        border-color: #4E8FFF;
      }
      #ngr-feedback-submit {
        margin-top: 10px;
        width: 100%;
        padding: 9px;
        background: #4E8FFF;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }
      #ngr-feedback-submit:hover { background: #6BA3FF; }
      #ngr-feedback-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #8B95A8;
        line-height: 1;
        padding: 2px 6px;
      }
      #ngr-feedback-close:hover { color: #E8E8EC; }
    `;
    document.head.appendChild(style);

    // Floating button
    const btn = document.createElement('button');
    btn.id = 'ngr-feedback-btn';
    btn.setAttribute('aria-label', 'Open feedback');
    btn.textContent = '💬';
    document.body.appendChild(btn);

    // Overlay + modal
    const overlay = document.createElement('div');
    overlay.id = 'ngr-feedback-overlay';
    overlay.style.display = 'none';

    const modal = document.createElement('div');
    modal.id = 'ngr-feedback-modal';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function render() {
      const t = getT();
      modal.innerHTML = `
        <button id="ngr-feedback-close" aria-label="Close">&times;</button>
        <h3>${t.title}</h3>
        <textarea id="ngr-feedback-textarea" placeholder="${t.placeholder}"></textarea>
        <button id="ngr-feedback-submit">${t.submit}</button>
      `;
      document.getElementById('ngr-feedback-close').addEventListener('click', closeModal);
      document.getElementById('ngr-feedback-submit').addEventListener('click', submitFeedback);
    }

    function openModal() {
      render();
      overlay.style.display = 'flex';
    }

    function closeModal() {
      overlay.style.display = 'none';
    }

    function submitFeedback() {
      const msg = (document.getElementById('ngr-feedback-textarea').value || '').trim();
      const subject = encodeURIComponent('[NextGen Game Radar] Feedback');
      const body = encodeURIComponent(msg);
      window.location.href = `mailto:taeshinkim11@gmail.com?subject=${subject}&body=${body}`;
      closeModal();
    }

    btn.addEventListener('click', openModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
