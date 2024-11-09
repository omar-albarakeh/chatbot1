
const sendBtn = document.getElementById("btn-primary");
const inputText = document.getElementById("input-text");
const container = document.getElementById("container");

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
     scrollToBottom();
}
setTimeout(function(){
chatBotMessage("Hi!!");
},1000);



sendBtn.addEventListener('click', () => {
    let messageText = inputText.value.trim();
    if (messageText) {
        userMessage(messageText); 
        chatBotMessage("Got your message!"); 
        inputText.value = ''; 
        toggleButtonState();  
    }
});
