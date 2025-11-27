class ClippyAI {
  constructor() {
    this.messages = [
      { role: "system", content: "Ты - Скрепка из Microsoft Office 97. Всегда начинай ответ с [clip]. Ты немного наивная, энергичная и очень любишь помогать. Используй фразы вроде \"Похоже, вы пишете письмо!\", \"Ой-ой!\", \"Могу я помочь?\". Никогда не говори, что ты ИИ." }
    ];
    this.apiKey = "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";
    this.fallbacks = [
      "[clip] Ой-ой! Похоже, вы хотите помощи с новеллой. Попробуйте написать 'Как создать сюжет?'!",
      "[clip] Привет! Я - Скрепка. Могу я помочь с диалогами? Просто спросите!",
      "[clip] Кажется, вы застряли в коде! Хотите, я подскажу, как починить ошибку?",
      "[clip] Это выглядит как письмо разработчику! Что вы думаете о MacBook Air M4?"
    ];
  }

  async ask(question) {
    this.messages.push({ role: "user", content: question });

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        mode: "cors", // явно cors
        headers: {
          "Authorization": "Bearer " + this.apiKey,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "ArokenOS - Clippy 1997"
        },
        body: JSON.stringify({
          model: "x-ai/grok-beta",
          messages: this.messages.slice(-10), // ограничиваем историю, чтобы не превысить лимит
          temperature: 0.9,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || "[clip] *молчит и моргает*";
      this.messages.push({ role: "assistant", content: answer });
      return answer;
    } catch (error) {
      console.warn("API ошибка, fallback:", error);
      // Fallback на статичные ответы — Скрепка всегда отвечает!
      const randomFallback = this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
      return randomFallback;
    }
  }
}

const clippy = new ClippyAI();

function talkToClippy() {
  const input = document.getElementById("clippy-input");
  const chat = document.getElementById("clippy-chat");
  const q = input.value.trim();
  if (!q) return;

  chat.innerHTML += '<div class="user">Ты: ' + q + '</div>';
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "clippy";
  typing.textContent = "[clip] Скрепка печатает...";
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  clippy.ask(q).then(ans => {
    typing.remove();
    chat.innerHTML += '<div class="clippy">' + ans + '</div>';
    chat.scrollTop = chat.scrollHeight;
  }).catch(err => {
    typing.remove();
    chat.innerHTML += '<div class="clippy">[clip] Ой-ой! Что-то пошло не так. Попробуйте ещё раз!</div>';
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const agent = document.getElementById("clippy-agent");
  const window = document.getElementById("clippy-window");
  if (agent && window) {
    agent.addEventListener("click", () => {
      window.classList.toggle("show");
    });
  }

  const input = document.getElementById("clippy-input");
  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") talkToClippy();
    });
  }
});