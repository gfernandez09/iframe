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
            var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage
            conversation.push({ content: message, role: 'user' }); // Agregar el mensaje del usuario a la conversación
            saveConversationToLocalStorage(conversation); // Guardar la conversación actualizada en el local storage
            await sendMessageToChatbase(conversation); // Enviar la conversación completa con el mensaje del usuario al bot
            input.value = ''; // Vaciar el input de texto después de enviar el mensaje
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

async function sendMessageToChatbase(conversation) {
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
                messages: conversation // Enviar la conversación completa con el mensaje del usuario
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.text();
        handleChatbaseResponse(data, 'assistant'); // Manejar la respuesta como un mensaje del bot
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

function getConversationFromLocalStorage() {
    return JSON.parse(localStorage.getItem('conversation')) || [];
}

function saveConversationToLocalStorage(conversation) {
    localStorage.setItem('conversation', JSON.stringify(conversation));
}
function handleChatbaseResponse(message, role) {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage
    conversation.push({ content: message, role: role }); // Agregar el mensaje del bot a la conversación
    saveConversationToLocalStorage(conversation); // Guardar la conversación actualizada en el local storage
    renderConversation(conversation); // Renderizar la conversación
}

function renderConversation(conversation) {
    var messageWindow = document.getElementById('message-window');
    messageWindow.innerHTML = ''; // Limpiar el contenido actual del contenedor de la conversación
    conversation.forEach(item => {
        var messageElement = document.createElement('div');
        messageElement.classList.add('message', item.role);
        messageElement.textContent = `${item.role === 'assistant' ? 'Traveltool Bot Assistant' : 'User'}: ${item.content}`;
        messageWindow.appendChild(messageElement);
    });
}