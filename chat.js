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
            await sendMessageToChatbase(message); // Enviar el mensaje del usuario al bot
            input.value = ''; // Vaciar el input de texto después de enviar el mensaje
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
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
                user: "user"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.text();
        handleChatbaseResponse(data);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

function handleChatbaseResponse(message) {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage

    var userMessage = document.getElementById('chat-message').value.trim();

    // Si el mensaje actual es diferente al último mensaje del usuario, entonces es del asistente (bot)
    if (userMessage !== '' && message !== userMessage) {
        conversation.push({ content: message, role: 'Traveltool Bot Assistant' });
    } else {
        conversation.push({ content: message, role: 'User' }); // Si el mensaje recibido es el mismo que el mensaje del usuario, entonces es del usuario
    }

    saveConversationToLocalStorage(conversation); // Guardar la conversación actualizada en el local storage
    renderConversation(); // Renderizar la conversación
}

function getConversationFromLocalStorage() {
    return JSON.parse(localStorage.getItem('conversation')) || [];
}

function saveConversationToLocalStorage(conversation) {
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

function renderConversation() {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage
    var messageWindow = document.getElementById('message-window');
    messageWindow.innerHTML = ''; // Limpiar el contenido actual del contenedor de la conversación

    conversation.forEach(item => {
        var messageElement = document.createElement('div');
        messageElement.classList.add('message', item.role.toLowerCase()); // Aplicar clase correspondiente al rol

        var messageContent = document.createElement('p');
        messageContent.textContent = item.content;

        messageElement.appendChild(messageContent);
        messageWindow.appendChild(messageElement);
    });

    alignMessages(); // Llamar a la función para alinear los mensajes después de que se agreguen al DOM
}

function alignMessages() {
    var messages = document.querySelectorAll('.message'); // Seleccionar todos los mensajes

    var previousRole = null;
    messages.forEach(message => {
        var currentRole = message.classList.contains('traveltool bot assistant') ? 'received' : 'sent';

        if (previousRole !== null && currentRole !== previousRole) {
            message.style.clear = 'both'; // Limpiar flotación para evitar que los mensajes se superpongan
        }

        message.classList.add(currentRole); // Alinear mensajes según el remitente
        previousRole = currentRole;
    });
}


