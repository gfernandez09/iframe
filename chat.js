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
            await sendMessageToChatbase(userMessage); // Enviar el mensaje del usuario al bot
            input.value = ''; // Vaciar el input de texto después de enviar el mensaje
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

// Esta función enviará el mensaje al bot y manejará la respuesta
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
        handleChatbaseResponse(data, userMessage); // Manejar la respuesta del bot
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

function handleChatbaseResponse(botMessage, userMessage) {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage

    // Agregar mensaje del usuario a la conversación con su respectivo estilo
    conversation.push({ content: userMessage, role: 'sent' });

    // Agregar respuesta del bot a la conversación con su respectivo estilo
    conversation.push({ content: botMessage, role: 'received' });

    saveConversationToLocalStorage(conversation); // Guardar la conversación actualizada en el local storage
    renderConversation(); // Renderizar la conversación
}

// Esta función renderizará la conversación en el chat
function renderConversation() {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage
    var messageWindow = document.getElementById('message-window');
    messageWindow.innerHTML = ''; // Limpiar el contenido actual del contenedor de la conversación

    conversation.forEach(item => {
        var messageElement = document.createElement('div');

        // Agregar la clase correspondiente al rol del mensaje
        messageElement.classList.add('message', item.role.toLowerCase());

        // Crear un párrafo para el contenido del mensaje
        var messageContent = document.createElement('p');
        messageContent.textContent = item.role === 'User' ? `User: ${item.content}` : `Traveltool Bot Assistant: ${item.content}`;

        // Agregar contenido al elemento del mensaje
        messageElement.appendChild(messageContent);
        messageWindow.appendChild(messageElement);
    });
}


// Esta función guardará la conversación en el almacenamiento local
function saveConversationToLocalStorage(conversation) {
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

// Esta función obtendrá la conversación del almacenamiento local
function getConversationFromLocalStorage() {
    return JSON.parse(localStorage.getItem('conversation')) || [];
}
