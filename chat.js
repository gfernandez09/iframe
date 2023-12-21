document.addEventListener('DOMContentLoaded', function() {
    // Vaciar la conversación al inicio
    clearConversation();

    // Llamar a la función para borrar la conversación cada 30 minutos
    setInterval(clearConversation, 30 * 60 * 1000); // 30 minutos * 60 segundos * 1000 milisegundos

    showWelcomeMessage();
    const chatInput = document.getElementById('chat-message');
    chatInput.addEventListener('keypress', function (e) {
        onEnterPress(e);
    })
});

function showWelcomeMessage() {
    renderConversation("¡Hola! Soy el Asistente de Traveltool creado por Quonversa. ¿En qué puedo ayudarte?", 'bot');
}

function onEnterPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-message');
    const userMessage = input.value.trim();

    if (userMessage !== '') {
        try {
            input.value = '';
            renderConversation(userMessage, 'user');
            renderConversation('...', 'bot');
            const fullConversation = getConversationFromLocalStorage();
            const response = await sendMessageToBotAssistant(fullConversation);
            removeTypingIndicator();
            renderConversation(response, 'bot');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

async function sendMessageToBotAssistant(fullConversation) {
    const chatbotId = "zSO6Sk6htdxWvmCn2IhXL";
    const apiUrl = "https://162c-79-98-220-55.ngrok-free.app/Assistant/SendMessage";

    console.log(fullConversation);

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: JSON.stringify(fullConversation),
            chatbotId,
            stream: false,
            model: 'gpt-3.5-turbo',
            temperature: 0
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    const data = await response.json();
    return data.messages[0].content;
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
    let conversation = JSON.parse(localStorage.getItem('conversation')) || [];
    conversation.push(message);
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

function getConversationFromLocalStorage() {
    const conversation = JSON.parse(localStorage.getItem('conversation')) || [];
    return conversation;
}

function removeTypingIndicator() {
    const messageWindow = document.getElementById('message-window');
    const typingIndicator = messageWindow.querySelector('.message.received:last-child');

    if (typingIndicator.textContent === '...') {
        messageWindow.removeChild(typingIndicator);
    }
}

// Función para borrar la conversación del almacenamiento local
function clearConversation() {
    localStorage.removeItem('conversation');
    console.log('La conversación ha sido borrada.');
}