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

    var role = 'Traveltool Bot Assistant'; // Por defecto, asumimos que el mensaje es del asistente (bot)
    var userMessage = document.getElementById('chat-message').value.trim();

    // Comprobar si el último mensaje de la conversación es igual al mensaje actual
    if (conversation.length > 0 && conversation[conversation.length - 1].content === message) {
        return; // Evitar repetir mensajes
    }

    // Si el mensaje actual es diferente al último mensaje del usuario, entonces es del asistente (bot)
    if (userMessage !== '' && message !== userMessage) {
        role = 'Traveltool Bot Assistant';
    } else {
        role = 'User'; // Si el mensaje recibido es el mismo que el mensaje del usuario, entonces es del usuario
    }

    conversation.push({ content: message, role: role }); // Agregar el mensaje a la conversación con el rol correspondiente
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
        messageElement.classList.add('message', item.role);
        messageElement.textContent = item.content;

        if (item.role === 'assistant') {
            messageElement.classList.add('received'); // Establecer el mensaje del asistente a la izquierda
        } else {
            messageElement.classList.add('sent'); // Establecer el mensaje del usuario a la derecha
        }

        messageWindow.appendChild(messageElement);
    });
}
