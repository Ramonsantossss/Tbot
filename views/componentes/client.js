const socket = io();

// Enviar mensagem ao pressionar 'Enter'
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        e.preventDefault();
        const message = e.target.value.trim();

        // Verificar se o usuário enviou o comando /menu
        switch(message) {
        case "/menu": {
        sendMessage(message);
            reply(`
            <b>Menu de Comandos:</b>
             <div style="color: white;">
                <p><b>/ajuda</b> - Mostra os comandos disponíveis<br>
                <b>/info</b> - Mostra informações sobre o usuário<br>
                <b>/contato</b> - Informações de contato<br>
                
                </p>
            </div>
        `);
        }break
        
        case "/info": {
        sendMessage(message);
        reply(`
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @keyframes piscando {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }

        .piscante {
            text-align: center;
            color: rgb(173, 255, 47);
            font-family: Impact;
            animation: piscando 1s infinite;
        }
    </style>
</head>
<body>
<img src="https://telegra.ph/file/6aa46ec85b1ffd8c750ef.jpg" style="width: 100%; border-radius: 7px; border: 4px solid gold;"/>
<br>
<h1 style="color: gold;">
<i>Eae, Gostaram? </i>
</h1>
<p>Sistema de chat na api!!</p>
<a href="https://youtube.com/@clovermyt" style="font-family: Arial;">
<h2 class="piscante">
By: CloverMYT
</h2>
</body>
</html>
        `)
        }break
        
        default: 
        sendMessage(message);
        }
    }
});

// Função para enviar o comando /menu
function reply(mensagem) {
    let menuMessage = {
        user: "<b>SISTEMA</b>",
        photo: "https://cdn.discordapp.com/attachments/1278119847124799651/1282034777448255579/IMG-20240907-WA0057.jpg?ex=66dde36d&is=66dc91ed&hm=ded125ea66333e3efda7d7180f7a9ec3465ba42da87b44ef1958ccebed42fcd0&",
        message: mensagem
    };

    appendMessage(menuMessage, 'incoming');
    scrollToBottom();
    // Emitir o comando para o servidor (opcional)
    socket.emit('message', menuMessage);
}

// Função normal para enviar mensagem
function sendMessage(message) {
    let msg = {
        user: name,
        photo: userPhoto,
        message: message.trim()
    };
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Enviar para o servidor
    socket.emit('message', msg);
}

        function appendMessage(msg, type) {
            let mainDiv = document.createElement('div');
            mainDiv.classList.add(type, 'message');

            let markup = `
                <div class="message__header">
                    <img src="${msg.photo}" alt="User Photo" class="user__photo">
                    <h4>${msg.user}</h4>
                </div>
                <p>${msg.message}</p>
            `;
            mainDiv.innerHTML = markup;
            messageArea.appendChild(mainDiv);
        }

        socket.on('message', (msg) => {
            appendMessage(msg, 'incoming');
            scrollToBottom();
        });

        function scrollToBottom() {
            messageArea.scrollTop = messageArea.scrollHeight;
        }

        // Manter o campo de texto fixo ao aparecer o teclado (dispositivos móveis)
        window.addEventListener('resize', () => {
            scrollToBottom(); // Rolagem automática ao abrir o teclado
        });
