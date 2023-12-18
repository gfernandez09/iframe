let chatContext = "";

function onEnterPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    var input = document.getElementById('chat-message');
    var message = input.value.trim();
    if (message !== '') {
        try {
            await sendMessageToChatbase(message);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
    userMessageInput.value = '';
}

async function sendMessageToChatbase(userMessage) {
    const chatbotId = "zSO6Sk6htdxWvmCn2IhXL";
    const apiUrl = "https://76dd-145-1-219-48.ngrok-free.app/Assistant/SendMessage";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatbotId: chatbotId,
                message: userMessage,
                user: "user" // Se puede enviar información del usuario si es necesario
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.json();
        handleChatbaseResponse(data.text);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

function handleChatbaseResponse(response) {
    var messageWindow = document.getElementById('message-window');
    var botMessage = document.createElement('div');
    botMessage.classList.add('message', 'received');
    botMessage.textContent = response;
    messageWindow.appendChild(botMessage);
    messageWindow.scrollTop = messageWindow.scrollHeight;
}