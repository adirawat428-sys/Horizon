const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY =
  "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";

const messages = [
  {
    role: "system",
    content: "You are a helpful AI tutor. Explain simply with examples.",
  },
];

const chatBox = document.getElementById("chat-box");
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("user-input");
const openBtn = document.getElementById("open-chat");

openBtn.onclick = () => {
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
  input.focus();
};

function fallbackReply() {
  return "Good question 👍 I will explain this simply.";
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  messagesDiv.innerHTML += `<div class="msg user-msg">${text}</div>`;
  input.value = "";
  messages.push({ role: "user", content: text });

  const loader = document.createElement("div");
  loader.className = "msg ai-msg";
  loader.innerText = "Study Buddy is thinking...";
  messagesDiv.appendChild(loader);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost",
        "X-Title": "Class 11 AI Tutor",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await res.json();
    loader.remove();

    const reply = data?.choices?.[0]?.message?.content || fallbackReply();

    messagesDiv.innerHTML += `<div class="msg ai-msg">${reply.replace(/\n/g, "<br>")}</div>`;

    messages.push({ role: "assistant", content: reply });
  } catch (e) {
    loader.remove();
    messagesDiv.innerHTML += `<div class="msg ai-msg">${fallbackReply()}</div>`;
  }

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
