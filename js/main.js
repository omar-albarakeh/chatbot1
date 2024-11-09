
const send_btn = document.getElementById("btn-primary");
const input_text = document.getElementById("input-text");
const chat_container = document.getElementById("container");

function sendMessage(messageText) {
    let messageElement = document.createElement('div');
    messageElement.classList.add('user-messages');
    messageElement.innerHTML = '<span>You:</span>' +
                               '<span>' + messageText + '</span>';
    chat_container.appendChild(messageElement); 
    input_text.value = ""; 
}

send_btn.addEventListener('click', () => {
    let messageText = input_text.value.trim();
    if (messageText) {
        sendMessage(messageText);
    }
});
