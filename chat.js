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
        renderConversation(data,userMessage); // Manejar la respuesta del bot
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}


function renderConversation(botResponse, userResponse) {
    var messageWindow = document.getElementById('message-window');
    var input = document.getElementById('chat-message');

   // Mostrar el mensaje del usuario
   var formattedUserMessage = "User: " + userResponse;
   var userMessage = document.createElement('div');
   userMessage.classList.add('message', 'sent');
   userMessage.textContent = formattedUserMessage;
   messageWindow.appendChild(userMessage);

   // Mostrar la respuesta del bot
   var formattedBotMessage = "Quonversa AI: " + botResponse;
   setTimeout(function() {
       var botMessage = document.createElement('div');
       botMessage.classList.add('message', 'received');
       botMessage.textContent = formattedBotMessage;
       messageWindow.appendChild(botMessage);
       messageWindow.scrollTop = messageWindow.scrollHeight;
   }, 1000);

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
