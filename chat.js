document.addEventListener('DOMContentLoaded', function() {
    clearConversation();

    startConversationClearInterval();

    showWelcomeMessage();
    const chatInput = document.getElementById('chat-message');
    chatInput.addEventListener('keypress', function (e) {
        onEnterPress(e);
    })
});

function showWelcomeMessage() {
    renderConversation("¡Hola! Soy el Asistente de Traveltool creado por Quonversa. ¿En qué puedo ayudarte?", 'assistant');
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
            renderConversation('...', 'assistant');
            const fullConversation = getConversationFromLocalStorage();
            const response = await sendMessageToBotAssistant(fullConversation);
            removeTypingIndicator();
            renderConversation(response, 'assistant');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

async function sendMessageToBotAssistant(fullConversation) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var chatbotId = urlParams.get('chatbotId');

    const apiUrl = "https://bot-assistant-api-c67ioiv6sa-no.a.run.app/Assistant/SendMessage";

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: fullConversation,
            chatbotId: chatbotId,
            stream: false,
            model: 'gpt-3.5-turbo',
            temperature: 0,
            conversationId: sessionStorage.getItem('conversationId') || null
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    const responseData = await response.json();

    if (responseData.conversationId && responseData.conversationId != "undefined") {
        sessionStorage.setItem('conversationId', responseData.conversationId);
    }

    return responseData.text;
}


function renderConversation(message, sender) {
    const messageWindow = document.getElementById('message-window');
    const messageType = sender === 'assistant' ? 'received' : 'sent';
    const messageDiv = createMessageElement(message, messageType, sender);
    messageWindow.appendChild(messageDiv);
    messageWindow.scrollTop = messageWindow.scrollHeight;

    let content = message;
    let role = sender;
    if (message != "..."){
        saveConversationToLocalStorage({ content, role });
    }
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

function clearConversation(clearChat) {
    localStorage.removeItem('conversation');
    if (clearChat) {
        clearChatMessages();
    }
    console.log('La conversación ha sido borrada.');
}

function clearChatMessages() {
    const messageWindow = document.getElementById('message-window');
    messageWindow.innerHTML = '';
}

function startConversationClearInterval() {
    setInterval(() => {
        clearConversation(true);
    }, 30 * 60 * 1000);
}