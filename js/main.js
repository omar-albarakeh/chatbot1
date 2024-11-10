const sendBtn = document.getElementById("btn-primary");
const inputText = document.getElementById("input-text");
const container = document.getElementById("container");
const historyPanel = document.getElementById("history-panel");

const toggleButtonState = () => {
    sendBtn.disabled = !inputText.value.trim();
};

toggleButtonState();
inputText.addEventListener('input', toggleButtonState);


const scrollToBottom = () => {
    container.scrollTop = container.scrollHeight;
};

function userMessage(messageText) {
    let userMessagesDiv = document.createElement('div');
    userMessagesDiv.classList.add('user-messages');
    userMessagesDiv.innerHTML = `<span>You:</span><span>${messageText}</span>`;
    container.appendChild(userMessagesDiv); 
    addMessageToHistory("You", messageText);
    scrollToBottom();
}

function chatBotMessage(messageText) {
    let messageElement = document.createElement('div');
    messageElement.classList.add('bot-messages');
    messageElement.innerHTML = `<span>Chat:</span><span>${messageText}</span>`;
    messageElement.animate(
        [
            { opacity: 0 },
            { opacity: 1 },
        ],
        {
            duration: 500,
            easing: 'ease-in',
        }
    );
    container.appendChild(messageElement);
    addMessageToHistory("Chatbot", messageText);
    scrollToBottom();
}

setTimeout(() => {
    chatBotMessage("Hi!!");
}, 1000);

const sendMessageToServer = (messageText) => {
    fetch('chatbot.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
    })
    .then(response => response.json())
    .then(data => {
        let botReply = data.choices[0].message.content;
        chatBotMessage(botReply);
    })
    .catch(error => {
        console.error('Error:', error);
        chatBotMessage("Sorry, there was an error processing your request.");
    });
};

sendBtn.addEventListener('click', () => {
    let messageText = inputText.value.trim();
    if (messageText) {
        userMessage(messageText);
        sendMessageToServer(messageText);
        inputText.value = '';
        toggleButtonState();  
    }
});

const addMessageToHistory = (sender, messageText) => {
    let historyEntry = document.createElement('div');
    historyEntry.classList.add('history-entry');
    historyEntry.innerHTML = `<strong>${sender}:</strong> ${messageText}`;
    historyPanel.appendChild(historyEntry);
    historyPanel.scrollTop = historyPanel.scrollHeight;
};
