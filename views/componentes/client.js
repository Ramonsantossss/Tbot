const socket = io();
const prefix = '/';
// Enviar mensagem ao pressionar 'Enter'
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        e.preventDefault();
        const message = e.target.value.trim();

        // Verificar se o usuário enviou o comando /menu
        switch(message) {
        case prefix + "menu": {
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
<h1 class="piscante" style="color: gold;">
<i>MENU LADY BOT</i>
</h1>
<p>
╭──────────────⊣<br>
│ <h2>COMANDOS</h2><br>
├────────────<br>
╠🐞➽ ${prefix}info<br>
╠🐞➽ ${prefix}ajuda<br>
╠🐞➽ ${prefix}lady-bot whatsapp<br>
║<br>
╚════• 〘1.0.0〙<br>
╭──────────────⊣<br>
│ <h2 class="piscante">FOTOS</h2><br>
├────────────<br>
╠🐞➽${prefix}cosplay<br>
╠🐞➽${prefix}waifu<br>
╠🐞➽${prefix}waifu2<br>
╠🐞➽${prefix}shota<br>
╠🐞➽${prefix}loli<br>
╠🐞➽${prefix}yotsuba<br>
╠🐞➽${prefix}shinomiya<br>
╠🐞➽${prefix}yumeko<br>
╠🐞➽${prefix}tejina<br>
╠🐞➽${prefix}chiho<br>
╠🐞➽${prefix}shizuka<br>
╠🐞➽${prefix}boruto<br>
╠🐞➽${prefix}kagori<br>
╠🐞➽${prefix}kaga<br>
╠🐞➽${prefix}kotori<br>
╠🐞➽${prefix}mikasa<br>
╠🐞➽${prefix}akiyama<br>
╠🐞➽${prefix}hinata<br>
╠🐞➽${prefix}minato<br>
╠🐞➽${prefix}naruto<br>
╠🐞➽${prefix}nezuko<br>
╠🐞➽${prefix}yuki<br>
╠🐞➽${prefix}hestia<br>
╠🐞➽${prefix}emilia<br>
╠🐞➽${prefix}itachi<br>
╠🐞➽${prefix}madara<br>
╠🐞➽${prefix}sasuke<br>
╠🐞➽${prefix}sakura<br>
╠🐞➽${prefix}tsunade<br>
┃<br>
╚════• 〘1.0.0〙<br>
</p>
<a href="https://youtube.com/@clovermyt" style="font-family: Arial;">
<p class="piscante">
By: CloverMYT
</p>
</body>
</html>
            `);
        }break;
        
        case prefix + "info": {
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

</body>
</html>
            `);
        }break;
        
        case prefix + "cosplay":
        case prefix + "waifu":
        case prefix + "waifu2":
        case prefix + "shota":
        case prefix + "loli":
        case prefix + "yotsuba":
        case prefix + "shinomiya":
        case prefix + "yumeko":
        case prefix + "tejina":
        case prefix + "chiho":
        case prefix + "shizuka":
        case prefix + "boruto":
        case prefix + "kagori":
        case prefix + "kaga":
        case prefix + "kotori":
        case prefix + "mikasa":
        case prefix + "akiyama":
        case prefix + "hinata":
        case prefix + "minato":
        case prefix + "naruto":
        case prefix + "nezuko":
        case prefix + "yuki":
        case prefix + "hestia":
        case prefix + "emilia":
        case prefix + "itachi":
        case prefix + "elaina":
        case prefix + "madara":
        case prefix + "sasuke":
        case prefix + "deidara":
        case prefix + "sakura":
        case prefix + "tsunade":
            sendMessage(message);
            reply(`procurando...`);
            try {
                fetch(encodeURI(`https://clover-t-bot-r0wt.onrender.com/nime/${message}?username=SUPREMO&key=SER_SUPREMO`))
                .then(response => response.json())
                .then(data => {
                    var resultado = data.url;
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
<img src="${resultado}" style="width: 100%; border-radius: 7px; border: 4px solid gold;"/>
<br>
</body>
</html>
                    `);
                });
            } catch (e) {
                reply(`nao achei a foto, tente novamente mais tarde`);
            }
            break;

            default: 
                sendMessage(message);
        }
    }
});

// Função para enviar o comando /menu
function reply(mensagem) {
    let menuMessage = {
        user: "<b>Lady Bot OFC</b>",
        photo: "https://clover-t-bot-r0wt.onrender.com/imagem/66773f5b92bcc365ced63d3a/chapters/1/2",
        message: mensagem
    };

    appendMessage(menuMessage, 'incoming');
    scrollToBottom();
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

window.addEventListener('resize', () => {
    scrollToBottom(); // Rolagem automática ao abrir o teclado
});
