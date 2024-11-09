
const sendBtn = document.getElementById("btn-primary");
const inputText = document.getElementById("input-text");
const container = document.getElementById("container");

const toggleButtonState = () => {
    sendBtn.disabled = !inputText.value.trim();
};

toggleButtonState();
inputText.addEventListener('input', toggleButtonState);


function userMessage(messageText) {
    let userMessagesDiv = document.createElement('div');
    userMessagesDiv.classList.add('user-messages');
    userMessagesDiv.innerHTML = `<span>You:</span><span>${messageText}</span>`;
    container.appendChild(userMessagesDiv);
}

function chatBotMessage(messageText) {
    let messageElement = document.createElement('div');
    messageElement.classList.add('bot-messages');
    messageElement.innerHTML = `<span>Chat:</span><span>${messageText}</span>`;
    container.appendChild(messageElement);
}


chatBotMessage("Hi from the chatbot!");


sendBtn.addEventListener('click', () => {
    let messageText = inputText.value.trim();
    if (messageText) {
        userMessage(messageText); 
        chatBotMessage("Got your message!"); 
        inputText.value = ''; 
        toggleButtonState();  
    }
});
