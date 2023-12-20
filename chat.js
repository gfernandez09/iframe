document.addEventListener('DOMContentLoaded', function() {
    showWelcomeMessage();
});

function showWelcomeMessage() {
    var welcomeMessage = "¡Hola! Soy el Asistente de Traveltool creado por Quonversa. ¿En qué puedo ayudarte?";
    renderConversation(welcomeMessage, 'bot'); // Mostrar mensaje de bienvenida
}

function onEnterPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    var input = document.getElementById('chat-message');
    var userMessage = input.value.trim();

    if (userMessage !== '') {
        try {
            input.value = '';

            // Mostrar el mensaje del usuario en la ventana de chat
            renderConversation(userMessage, 'user'); // Añadir mensaje del usuario

            // Mostrar el mensaje de "Escribiendo..." del bot
            renderConversation('...', 'bot');

            // Enviar el mensaje del usuario al bot y esperar la respuesta
            await sendMessageToChatbase(userMessage);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

async function sendMessageToChatbase(userMessage) {
    const messageWindow = document.getElementById('message-window');

    try {
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

        const data = await response.text();

        // Eliminar el mensaje de "Escribiendo..." del bot
        removeTypingIndicator();

        // Mostrar la respuesta del bot en la ventana de chat
        renderConversation(data, 'bot');
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

function renderConversation(message, sender) {
    var messageWindow = document.getElementById('message-window');
    var messageDiv = document.createElement('div');
    var messageType = sender === 'bot' ? 'received' : 'sent';

    messageDiv.classList.add('message', messageType);

    if (sender === 'user') {
        messageDiv.style.textAlign = 'right'; // Alinea el mensaje del usuario a la derecha
    }

    messageDiv.textContent = message;
    messageWindow.appendChild(messageDiv);
    messageWindow.scrollTop = messageWindow.scrollHeight;

    // Guardar la conversación en el almacenamiento local
    var conversation = getConversationFromLocalStorage() || [];
    conversation.push({ message: message, sender: sender });
    saveConversationToLocalStorage(conversation);
}

function getConversationFromLocalStorage() {
    return JSON.parse(localStorage.getItem('conversation')) || [];
}

function saveConversationToLocalStorage(conversation) {
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

function removeTypingIndicator() {
    const messageWindow = document.getElementById('message-window');
    const typingIndicator = messageWindow.querySelector('.received');

    if (typingIndicator.textContent === '...') {
        messageWindow.removeChild(typingIndicator);
    }
}