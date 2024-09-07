
        const socket = io();

        // Enviar mensagem ao pressionar 'Enter'
        textarea.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== '') {
                e.preventDefault();
                sendMessage(e.target.value);
            }
        });

        function sendMessage(message) {
            let msg = {
                user: name,
                photo: userPhoto,
                message: message.trim()
            };
            appendMessage(msg, 'outgoing');
            textarea.value = '';
            scrollToBottom();
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
