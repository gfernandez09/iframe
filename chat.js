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
    renderConversation(botMessage,userMessage); // Renderizar la conversación
}

function renderConversation(botResponse, userResponse) {
    // Asumiendo que messageWindow y input son elementos del DOM
    var messageWindow = document.getElementById('messageWindow'); // Reemplaza 'messageWindow' con el ID de tu contenedor de mensajes
    var input = document.getElementById('inputField'); // Reemplaza 'inputField' con el ID de tu campo de entrada

    var userMessage = document.createElement('div');
    userMessage.classList.add('message', 'sent');
    userMessage.textContent = userResponse;
    messageWindow.appendChild(userMessage);

    const inputValue = input.value;
    input.value = '';

    // Mostrar la respuesta del bot después de un segundo (puedes ajustar este tiempo según tu preferencia)
    setTimeout(function() {
        var botMessage = document.createElement('div');
        botMessage.classList.add('message', 'received');
        botMessage.textContent = botResponse;
        messageWindow.appendChild(botMessage);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }, 1000);

    // Enfocar el campo de entrada después de enviar un mensaje (puede considerar quitar esto si es molesto para la experiencia del usuario)
    input.focus();
    messageWindow.scrollTop = messageWindow.scrollHeight;
}

// Esta función guardará la conversación en el almacenamiento local
function saveConversationToLocalStorage(conversation) {
    localStorage.setItem('conversation', JSON.stringify(conversation));
}

// Esta función obtendrá la conversación del almacenamiento local
function getConversationFromLocalStorage() {
    return JSON.parse(localStorage.getItem('conversation')) || [];
}
