function onEnterPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    var input = document.getElementById('chat-message');
    var messageWindow = document.getElementById('message-window');

    if (input.value.trim() === '') return;

    var userMessage = document.createElement('div');
    userMessage.classList.add('message', 'sent');
    userMessage.textContent = input.value;
    messageWindow.appendChild(userMessage);

    const inputValue = input.value;
    input.value = '';

    setTimeout(function() {
    var botMessage = document.createElement('div');
    botMessage.classList.add('message', 'received');
    botMessage.textContent = inputValue;
    messageWindow.appendChild(botMessage);
    messageWindow.scrollTop = messageWindow.scrollHeight;
    }, 1000);

    input.focus();
    messageWindow.scrollTop = messageWindow.scrollHeight;
}