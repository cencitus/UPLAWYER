// Получаем элементы
const chatIcon = document.getElementById("chatIcon");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

// Открытие и закрытие окна чата
chatIcon.addEventListener("click", () => {
    chatWindow.style.display = "flex";
});
closeChat.addEventListener("click", () => {
    chatWindow.style.display = "none";
});

// Функция для добавления сообщения в чат
function addMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    
    // Рендерим Markdown -> HTML
    messageDiv.innerHTML = marked.parse(text);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Функция для отправки сообщения на API OpenRouter
async function sendMessage(message) {
    addMessage("user", message);
  
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
  
      if (!response.ok) {
        throw new Error("Ошибка API");
      }
  
      const data = await response.json();
      const botReply = data.reply;
      addMessage("bot", botReply);
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      addMessage("bot", "Ошибка: не удалось получить ответ от сервера.");
    }
  }

// Обработчик кнопки "Отправить"
sendChat.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message !== "") {
    sendMessage(message);
    chatInput.value = "";
    }
});

// Отправка сообщения по нажатию Enter
chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
    const message = chatInput.value.trim();
    if (message !== "") {
        sendMessage(message);
        chatInput.value = "";
    }
    }
}); 