(function() {
    var chatButton = document.createElement('button');
    chatButton.textContent = 'Chat';
    Object.assign(chatButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '1010',
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        height: '50px',
        width: '50px',
        cursor: 'pointer'
    });

    var chatHeader = document.createElement('div');
    chatHeader.textContent = 'ChatbotName';
    Object.assign(chatHeader.style, {
        backgroundColor: '#4CAF50',
        color: 'white',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '10px',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px'
    });

    var chatFrame = document.createElement('iframe');
    chatFrame.src = 'https://iframe-tan.vercel.app/';
    Object.assign(chatFrame.style, {
        border: 'none',
        width: '100%', // Ancho del iframe al 100% del contenedor
        height: '90%', // Alto apropiado según el tamaño del contenedor
        boxSizing: 'border-box'
    });

    var chatContainer = document.createElement('div');
    Object.assign(chatContainer.style, {
        position: 'fixed',
        bottom: '100px', // Ajusta esta propiedad para elevar el pop-up y separarlo del fondo
        right: '20px',
        width: '500px', // Ancho del contenedor del chat
        height: '600px', // Alto del contenedor del chat
        border: '1px solid #ccc',
        borderRadius: '4px',
        display: 'none',
        zIndex: '1000',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        boxSizing: 'border-box'
    });

    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatFrame);
    document.body.appendChild(chatButton);
    document.body.appendChild(chatContainer);

    chatButton.onclick = function() {
        var isDisplayed = chatContainer.style.display !== 'none';
        chatContainer.style.display = isDisplayed ? 'none' : 'block';
    };
})();