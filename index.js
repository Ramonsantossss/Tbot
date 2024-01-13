const TelegramBot = require('node-telegram-bot-api');
const { prefix, nomeBot, token } = require("./config.js");
var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
const PORT = 8080
var mainrouter = require('./routes/main'),
    apirouter = require('./routes/api')
const { menu, nsfw, sfw } = require('./menu.js')


const bot = new TelegramBot(token, { polling: true });


const master = `
Informações do criador:

Telegram: t.me/cinco_folhas
WhatsApp: wa.me/557598659560
Youtube: @clovermods
`;

console.log(`Bot Online\n\nPrefixo: ${prefix}\nNome Bot: ${nomeBot}\n`);

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const pushname = msg.from.first_name;
  const messageText = msg.text;
  const body = messageText.trim();
  const isCmd = body.startsWith(prefix);
  const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
  const args = body.split(/ +/).slice(1);
  const q = args.join(" ");
console.log(command)
  const reply = (text) => {
  bot.sendMessage(chatId, text)
  }


  switch (isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null) {
    case "menu":
    case 'start': {
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '❤️ NSFW ❤️', callback_data: 'button1' }, { text: '❤️ SFW ❤️', callback_data: 'button2' }],
            [{ text: '👑 CLOVER MODS 👑', callback_data: 'button3' }],
          ],
        },
      };

      bot.sendMessage(chatId, menu(prefix, nomeBot, pushname), keyboard);
      break;
    }

      case 'info':{
        bot.sendMessage(chatId, `Informações do usuário:\nID: ${userId}\nNome: ${msg.from.first_name}`);
      }break

      case 'play_video':
      case 'play-vídeo':
      case 'play-video':{ 
      if (!args.join(' ' < 1)) return reply("Coloque o nume do video junto ou o link mas tem que ser do youtube...")
      reply("enviando...")
      fetch(`https://fine-gold-squid-yoke.cyclic.app/anikit/playmp4?query=${q}&username=SUPREMO&key=Adm`).then(response => response.json()).then(data => {
      bot.sendVideo(chatId, data.url, {caption: `🏕 Olá ${msg.from.first_name}, aqui está seu video 🎲`});
      })
      } break

case 'cosplay':
case 'waifu':
case 'waifu2':
case 'shota':
case 'loli':
case 'yotsuba':
case 'shinomiya':
case 'yumeko':
case 'tejina':
case 'chiho':
case 'shizuka':
case 'boruto':
case 'kagori':
case 'kaga':
case 'kotori':
case 'mikasa':
case 'akiyama':
case 'hinata':
case 'minato':
case 'naruto':
case 'nezuko':
case 'yuki':
case 'hestia':
case 'emilia':
case 'itachi':
case 'elaina':
case 'madara':
case 'sasuke':
case 'deidara':
case 'sakura':
case 'tsunade': {
  try {
    fetch(`https://fine-gold-squid-yoke.cyclic.app/nime/${command}?username=SUPREMO&key=Adm`).then(response => response.json()).then(data => {
    bot.sendPhoto(chatId, data.url, {caption: `🏕 Olá ${msg.from.first_name}, aqui está sua imagem 🎲`});
   })

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `achei nao`);
  }
}break;

case 'ahegao':
case 'ass':
case 'bdsm':
case 'blowjob':
case 'cuckold':
case 'cum':
case 'ero':
case 'kasedaiki':
case 'femdom':
case 'foot':
case 'gangbang':
case 'glasses':
case 'jahy':
case 'manga':
case 'masturbation':
case 'neko':
case 'orgy':
case 'panties':
case 'pussy':
case 'neko2':
case 'neko':
case 'tentacles':
case 'thighs':
case 'yuri':
case 'zettai': {
  try {
    fetch(`https://fine-gold-squid-yoke.cyclic.app/nsfw/${command}?username=SUPREMO&key=Adm`).then(response => response.json()).then(data => {
    bot.sendPhoto(chatId, data.url, {caption: `🏕 Olá ${msg.from.first_name}, aqui está sua imagem 🎲`});
   })

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `achei nao`);
  }
} break;


    default:
      bot.sendMessage(chatId, 'Comando não reconhecido. Tente /start ou /info.');
  }
});

bot.on('callback_query', (callbackQuery) => {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const { menu, nsfw, sfw } = require('./menu.js');
  const pushname = callbackQuery.message.chat.first_name;

  switch (data) {
    case 'button2': {
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🍀 MENU 🍀', callback_data: 'mennu' }],
          ],
        },
      };

      bot.sendMessage(chatId, sfw(prefix, nomeBot, pushname), keyboard);
      break;
    }

    case 'button1': {
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🍀 MENU 🍀', callback_data: 'mennu' }],
          ],
        },
      };

      bot.sendMessage(chatId, nsfw(prefix, nomeBot, pushname), keyboard);
      break;
    }

    case 'button3': {
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🍀 MENU 🍀', callback_data: 'mennu' }],
          ],
        },
      };

      bot.sendMessage(chatId, master, keyboard);
      break;
    }

    case 'mennu': {
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '❤️ NSFW ❤️', callback_data: 'button1' }, { text: '❤️ SFW ❤️', callback_data: 'button2' }],
            [{ text: '👑 CLOVER MODS 👑', callback_data: 'button3' }],
          ],
        },
      };

      bot.sendMessage(chatId, menu(prefix, nomeBot, pushname), keyboard);
      break;
    }

    default:
      break;
  }
});



var app = express()
app.enable('trust proxy');
app.set("json spaces", 2)
app.use(cors())
app.use(secure)
app.use(express.static("public"))

app.use('/', mainrouter);
app.use('/api', apirouter);

app.listen(8000, () => {
    console.log("Server rodando na porta 8000")
})

module.exports = app