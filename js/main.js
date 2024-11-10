const sendBtn = document.getElementById("send-btn");
const inputText = document.getElementById("input-text");
const container = document.getElementById("chat-container");
const historyPanel = document.getElementById("saved-responses");

const toggleButtonState = () => {
    sendBtn.disabled = !inputText.value.trim();
};

toggleButtonState();
inputText.addEventListener('input', toggleButtonState);

const scrollToBottom = (element) => {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth"
    });
};
function userMessage(messageText) {
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('user-message');
    userMessageDiv.innerHTML = `<span>You:</span><span>${messageText}</span>`;
    container.appendChild(userMessageDiv);
    addMessageToHistory("You", messageText);
    scrollToBottom(container);
}

function chatBotMessage(messageText) {
    const botMessageDiv = document.createElement('div');
    botMessageDiv.classList.add('bot-message');
    botMessageDiv.innerHTML = `<span>Chat:</span><span>${messageText}</span>`;
    botMessageDiv.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        easing: 'ease-in',
    });
    container.appendChild(botMessageDiv);
    addMessageToHistory("Chatbot", messageText);
    scrollToBottom(container);
}

setTimeout(() => {
    chatBotMessage("Hi ! How can I help you with movies today?");
}, 1000);

const sendMessageToServer = (messageText) => {
    fetch('chatbot.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
    })
    .then(response => response.json())
    .then(data => {
        const botReply = data.choices[0].message.content;
        chatBotMessage(botReply);
    })
    .catch(error => {
        console.error('Error:', error);
        chatBotMessage("Sorry, there was an error processing your request.");
    });
};

sendBtn.addEventListener('click', () => {
    const messageText = inputText.value.trim();
    if (messageText) {
        userMessage(messageText);
        inputText.value = '';
        toggleButtonState();

        if (/recommend|suggest/i.test(messageText)) {
            chatBotMessage("Looking for some movie recommendations...");
        } else if (/plot|summary/i.test(messageText)) {
            chatBotMessage("Summarizing the movie plot...");
        } else if (/question|what|who|how/i.test(messageText)) {
            chatBotMessage("I'm here to help answer your movie questions!");
        }

        sendMessageToServer(messageText);
    }
});

const addMessageToHistory = (sender, messageText) => {
    const historyEntry = document.createElement('div');
    historyEntry.classList.add('history-entry');
    historyEntry.innerHTML = `<strong>${sender}:</strong> ${messageText}`;
    historyPanel.appendChild(historyEntry);
    scrollToBottom(historyPanel);
};
