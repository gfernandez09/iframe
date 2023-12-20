document.addEventListener('DOMContentLoaded', function() {
    showWelcomeMessage();
    document.getElementById('chat-message').addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});

function showWelcomeMessage() {
    renderConversation("¡Hola! Soy el Asistente de Traveltool creado por Quonversa. ¿En qué puedo ayudarte?", 'bot');
}

async function sendMessage() {
    var input = document.getElementById('chat-message');
    var userMessage = input.value.trim();

    if (userMessage !== '') {
        try {
            input.value = '';
            renderConversation(userMessage, 'user');
            renderConversation('...', 'bot');
            const response = await sendMessageToChatbase(userMessage);
            removeTypingIndicator();
            renderConversation(response, 'bot');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

async function sendMessageToChatbase(userMessage) {
    const chatbotId = "zSO6Sk6htdxWvmCn2IhXL";
    const apiUrl = "https://bot-assistant-api-c67ioiv6sa-no.a.run.app/Assistant/SendMessage";

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatbotId: chatbotId,
            message: userMessage,
            user: "user"
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.text();
}

function renderConversation(message, sender) {
    const messageWindow = document.getElementById('message-window');
    const messageType = sender === 'bot' ? 'received' : 'sent';
    const messageDiv = createMessageElement(message, messageType, sender);
    messageWindow.appendChild(messageDiv);
    messageWindow.scrollTop = messageWindow.scrollHeight;

    saveConversationToLocalStorage({ message, sender });
}

function createMessageElement(message, messageType, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', messageType);
    messageDiv.textContent = message;
    
    if (sender === 'user') {
        messageDiv.style.textAlign = 'right'; 
    }
    
    return messageDiv;
}

function saveConversationToLocalStorage(message) {
    const conversation = JSON.parse(localStorage.getItem('conversation')) || [];
    conversation.push(message);
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

function removeTypingIndicator() {
    const messageWindow = document.getElementById('message-window');
    const typingIndicator = messageWindow.querySelector('.message.received:last-child');

    if (typingIndicator.textContent === '...') {
        messageWindow.removeChild(typingIndicator);
    }
}