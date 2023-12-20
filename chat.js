document.addEventListener('DOMContentLoaded', function() {
    showWelcomeMessage();
});

function showWelcomeMessage() {
    var welcomeMessage = "¡Hola! Soy el Asistente de Traveltool creado por Quonversa. ¿En qué puedo ayudarte?";
    renderConversation(welcomeMessage, ''); // Mostrar mensaje de bienvenida
}

function onEnterPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Esta función enviará el mensaje del usuario al bot
async function sendMessage() {
    var input = document.getElementById('chat-message');
    var userMessage = input.value.trim();

    if (userMessage !== '') {
        try {
            input.value = '';
            await sendMessageToChatbase(userMessage);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

async function sendMessageToChatbase(userMessage) {
    const input = document.getElementById('chat-message');
    const messageWindow = document.getElementById('message-window');

    try {
        // Mostrar "Escribiendo..." antes de enviar el mensaje al bot
        const writingIndicator = document.createElement('div');
        writingIndicator.classList.add('message', 'received');
        writingIndicator.textContent = 'Escribiendo...';
        messageWindow.appendChild(writingIndicator);
        messageWindow.scrollTop = messageWindow.scrollHeight;

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
        renderConversation(data, userMessage); // Manejar la respuesta del bot
        messageWindow.removeChild(writingIndicator); // Eliminar "Escribiendo..."
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}


function renderConversation(botResponse, userResponse) {
    var messageWindow = document.getElementById('message-window');
    var input = document.getElementById('chat-message');

    // Mostrar el mensaje del usuario
    var formattedUserMessage = userResponse;
    var userMessage = document.createElement('div');
    userMessage.classList.add('message', 'sent');
    userMessage.textContent = formattedUserMessage;
    messageWindow.appendChild(userMessage);

    // Mostrar "Escribiendo..." antes de la respuesta del bot (será eliminado cuando llegue la respuesta real)
    var writingIndicator = document.createElement('div');
    writingIndicator.classList.add('message', 'received');
    writingIndicator.textContent = 'Escribiendo...';
    messageWindow.appendChild(writingIndicator);
    messageWindow.scrollTop = messageWindow.scrollHeight;

    // Mostrar la respuesta del bot después de un pequeño retraso simulando la solicitud al servidor
    setTimeout(function () {
        // Eliminar "Escribiendo..." antes de agregar la respuesta real del bot
        messageWindow.removeChild(writingIndicator);

        var formattedBotMessage = botResponse;
        var botMessage = document.createElement('div');
        botMessage.classList.add('message', 'received');
        botMessage.textContent = formattedBotMessage;
        messageWindow.appendChild(botMessage);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }, 1500);

    input.value = '';
    input.focus();
    messageWindow.scrollTop = messageWindow.scrollHeight;

    // Obtener la conversación actual del localStorage
    var conversation = getConversationFromLocalStorage() || [];
    
    // Agregar los nuevos mensajes a la conversación
    conversation.push({ botMessage, userMessage });

    // Guardar la conversación actualizada en el localStorage
    saveConversationToLocalStorage(conversation);
}

// Esta función guardará la conversación en el almacenamiento local
function saveConversationToLocalStorage(conversation) {
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

// Esta función obtendrá la conversación del almacenamiento local
function getConversationFromLocalStorage() {
    return JSON.parse(localStorage.getItem('conversation')) || [];
}
