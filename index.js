process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const wordwrap = require('word-wrap');
const text2png = require('text2png');
const axios = require('axios');
const { create, create2 } = require('./data/attp.js');
//const TelegramBot = require('node-telegram-bot-api');
const { prefix, nomeBot, token } = require("./config.js");
var express = require('express'),
  cors = require('cors'),
  secure = require('ssl-express-www');
const PORT = 8080
const { menu, nsfw, sfw } = require('./menu.js')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const session = require('express-session');
const path = require('path');
const MemoryStore = require('memorystore')(session);
const fs = require('fs');
const knights = require('knights-canvas');

const downloadImage = async (url, filename) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
};

const nodemailer = require("nodemailer");
const mercadopago = require('mercadopago');
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devscommunityoficial@gmail.com",
    pass: "ukqqrlxtfctasdhp"
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const htmlPath = path.join(__dirname, './views/error.html');
const creator = "CM";
const neoxr = "yntkts";
const zeks = "administrator";
const zeks2 = "apivinz";

const loghandler = {
  notparam: {
    status: false,
    criador: creator,
    codigo: 406,
    mensagem: 'Sem Saldo'
  },
  // ... outras mensagens de erro
  error: {
    status: false,
    criador: creator,
    codigo: 404,
    mensagem: '404 ERROR'
  }
};

var {
  ytDonlodMp3,
  ytDonlodMp4,
  ytPlayMp3,
  ytPlayMp4,
  ytSearch,
  TiktokDownload
} = require(__dirname + "/data/yt");
var pin = require(__dirname + '/data/pinterest.js');

var app = express()
app.enable('trust proxy');
app.set("json spaces", 2)
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
}));
app.use(cors())
app.use(secure)
app.use(express.static("public"))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const email = 'devscommunityoficial@gmail.com'

//app.use('/', mainrouter);
//app.use('/api', apirouter);

// Configuração da sessão
app.use(session({
  secret: 'seuSegredo',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas em milissegundos
  }
}));

mongoose.connect('mongodb+srv://anikit:EPt96b3yMx3wmEC@cluster0.ukzkyjq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mercadopago.configure({
  access_token: 'APP_USR-8259792445335336-080911-dea2c74872b688a02354a83a497effba-1445374797',
});
//mongoose.connect('mongodb+srv://clover:clover@cluster0.6lnnwns.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  key: { type: String, required: true },
  saldo: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  ft: { type: String, default: null },
  yt: { type: String, default: null },
  zap: { type: String, default: null },
  insta: { type: String, default: null },
  wallpaper: { type: String, default: null },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  isAdm: { type: Boolean, default: false },
  isBaned: { type: Boolean, default: false },
});

// Criando o modelo do usuário
const User = mongoose.model('User', userSchema);
Person = User;

const {
  playStoreSearch,
  memesDroid,
  gruposZap,
  animeFireDownload,
  animesFireSearch,
  animesFireEps,
  ultimasNoticias,
  randomGrupos,
  xvideosDownloader,
  xvideosSearch,
  fraseAmor,
  iFunny,
  frasesPensador,
  wallpaper2,
  hentai,
  styletext,
} = require("./data/scraper.js");


async function diminuirSaldo(username) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return false;
    }
    if (user.isPremium || user.isAdm) {
      console.log('Usuário premium ou administrador. Saldo não será diminuído.');
      return false;
    }

    if (user.saldo > 0) {
      user.saldo--;
      await user.save();
      return true; // Saldo diminuído com sucesso
    } else {
      return false; // Saldo insuficiente
    }
  } catch (error) {
    console.error('Erro ao diminuir saldo:', error);
    return false;
  }
}


async function adicionarSaldo(username) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return false;
    }

    user.total += 1;
    await user.save();
    return true;
  } catch (error) {
    console.error('Erro ao adicionar saldo:', error);
    return false;
  }
}

async function adicionarSaldoPix(username, novo) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return false;
    }

    const transactionAmountMoney = parseFloat(novo);
    user.saldo += transactionAmountMoney;
    await user.save();
    return true;
  } catch (error) {
    console.error('Erro ao adicionar saldo:', error);
    return false;
  }
}

async function readUsers() {
  try {
    return await User.find();
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    return [];
  }
}

async function saveUsers(users) {
  try {
    await User.deleteMany();
    await User.insertMany(users);
  } catch (error) {
    console.error('Erro ao salvar os dados no banco de dados:', error);
  }
}

const isUserBanned = async (username) => {
  try {
    const user = await User.findOne({ username, isPremium: true });

    return !!user;
  } catch (error) {
    console.error('Erro ao verificar status de banimento do usuário:', error);
    return false;
  }
};


// pagamentos \\


app.get('/loja', (req, res) => {

  const user = req.session.user;

  if (user) {
    const { username, password, verificationCode, isVerified } = user;
    if (isVerified === true) {
      res.sendFile(__dirname + '/views/loja.html');
    } else {
      return res.redirect('/verify');
    }
  } else {
    return res.redirect('/login');
  }
})

app.get('/pagar', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const { username, password, verificationCode, isVerified } = user;
    if (isVerified === true) {

      try {

        const { valor } = req.query;
        const transactionAmount = parseFloat(valor);

        const payment_data = {
          transaction_amount: transactionAmount,
          description: `Saldo AniKit`,
          payment_method_id: 'pix',
          payer: {
            email,
            first_name: 'Nome do Pagador',
          }
        };


        const data = await mercadopago.payment.create(payment_data);
        const qrcode = data.body.point_of_interaction.transaction_data.qr_code_base64;
        const paymentLink = data.body.point_of_interaction.transaction_data.ticket_url;
        const paymentId = data.body.id;
        const valorpagar = valor
        const codigo = data.body.point_of_interaction.transaction_data.qr_code;

        // Renderiza uma página HTML com os dados do pagamento
        return res.render('info', { username, qrcode, codigo, paymentId, paymentLink, valorpagar });



      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao iniciar o pagamento' });
      }

    } else {
      return res.redirect('/verify');
    }
  } else {
    return res.redirect('/login');
  }
});


app.get('/payment/:paymentId/:username', async (req, res) => {
  const paymentId = req.params.paymentId;
  const username = req.params.username;
  const timeout = Infinity; // Tempo infinito

  let isPaymentConfirmed = false;
  const startTime = Date.now();

  while (!isPaymentConfirmed && Date.now() - startTime < timeout) {
    const res = await mercadopago.payment.get(paymentId);
    const pagamentoStatus = res.body.status;

    if (pagamentoStatus === 'approved') {
      console.log('✅ Pagamento aprovado com sucesso!');
      const novosaldo = 1000;
      await adicionarSaldoPix(username, novosaldo); // Espera pela conclusão da função adicionarSaldoPix antes de continuar
      console.log(username, novosaldo);
      isPaymentConfirmed = true;
    } else {
      //console.log('Aguardando pagamento...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // Verificar a cada 10 segundos
    }
  }

  if (!isPaymentConfirmed) {
    console.log('❗ Tempo de pagamento expirado ou pagamento não confirmado.');
  }

  res.render('payment', { isPaymentConfirmed });
});



//============\\
app.get('/', async (req, res) => {
  const user = req.session.user;

  if (user) {
    const { username, password, verificationCode, isVerified } = user;
    if (isVerified === true) {
      const userDb = await User.findOne({ username, password });
      const users = userDb;
      const quantidadeRegistrados = await User.countDocuments();
      const topUsers = await User.find().sort({ total: -1 }).limit(7);
      return res.render('dashboard', { user, userDb, users, topUsers, quantidade: quantidadeRegistrados });
    } else {
      return res.redirect('/verify');
    }
  } else {
    return res.redirect('/login');
  }
});

app.get('/myperfil', async (req, res) => {
  const user = req.session.user;

  if (user) {
    const { username, password, verificationCode, isVerified } = user;
    if (isVerified === true) {

      const userDb = await User.findOne({ username, password });
      const users = userDb;
      const quantidadeRegistrados = await User.countDocuments();
      const topUsers = await User.find().sort({ total: -1 }).limit(7);
      return res.render('myperfil', { user, userDb, users, topUsers, quantidade: quantidadeRegistrados });

    } else {
      return res.redirect('/verify');
    }
  } else {
    return res.redirect('/login');
  }
});

// Adicione isso às suas rotas
app.get('/search', async (req, res) => {
  const searchTerm = req.query.search || '';

  try {
    const searchResults = await User.find({ username: { $regex: searchTerm, $options: 'i' } });

    return res.render('search', { searchTerm, searchResults });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
  }
});




app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('Nome de usuário já existe. Por favor, escolha outro.');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const keycode = Math.floor(100000 + Math.random() * 900000).toString();

    const ft = "https://telegra.ph/file/f932f56e19397b0c7c448.jpg"; // URL padrão da foto
    const saldo = 200; // Saldo padrão
    const total = 0;
    const key = keycode;
    const desc = "Ola, estou usando a AniKit"
    const insta = "@clovermods"
    const zap = "55759865969696"
    const yt = "youtube.com/@clovermods"
    const wallpaper = "https://telegra.ph/file/56fa53ec05377a51311cc.jpg"

    const motivo = `Ola ${username} Seu código de verificação é: ${verificationCode}`
    const texto = "código de verificação"

    function emailsend(texto, motivo) {
      const mailSent = transporter.sendMail({
        text: `${motivo}`,
        subject: `${texto}`,
        to: [email]
      });

      console.log(mailSent);
    }
    emailsend(texto, motivo)

    const user = new User({ username, password, email, key, saldo, total, ft, zap, insta, yt, wallpaper, verificationCode, isVerified: false, isPremium: false, isAdm: false, isBaned: false });

    await user.save();
    console.log(user)
    req.session.user = user;
    res.redirect('/verify');

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

app.get('/verify', async (req, res) => {
  const user = req.session.user;
  if (user && !user.isVerified) {
    // Renderiza a página de verificação
    res.render('verify');
  } else {
    // Usuário já verificado, redireciona para a dashboard
    res.redirect('/');
  }
});

app.post('/verify', async (req, res) => {
  try {
    const { username, verificationCode } = req.body;
    const userDb = await User.findOne({ username, verificationCode, isVerified: false });
    if (userDb) {
      userDb.isVerified = true;
      await userDb.save();
      req.session.user = userDb;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao verificar o código de verificação.' });
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

//const bcrypt = require('bcrypt');


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const senha = password
  const user = await User.findOne({ username });

  if (user) {

    try {

      if (user.password !== senha) {
        return res.status(401).send('Nome de usuário ou senha incorretos. Por favor, tente novamente.');
      }
      // Salva o username do usuário na sessão para autenticação
      console.log(user.password, password, username)
      req.session.user = user;
      res.redirect('/');
    } catch (error) {
      console.error('Erro ao acessar o banco de dados:', error);
      return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  } else {
    res.status(401).json({ message: 'Usuário não encontrado.' });
  }

})

app.get('/admin', async (req, res) => {
  const user = req.session.user;

  if (user && user.isVerified) {
    try {
      const isAdmin = await User.findOne({ _id: user._id, isAdm: true });

      if (isAdmin) {
        const users = await User.find();
        return res.render('adminDashboard', { users, user });
      } else {
        return res.sendFile(htmlPath);
      }
    } catch (error) {
      console.error('Erro ao acessar usuários:', error);
      return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  } else {
    return res.sendFile(htmlPath);
  }
});


app.get('/editar/:username', async (req, res) => {
  const { user: currentUser, senha: currentPassword } = req.session;
  const { username: targetUsername } = req.params;
  const specialKey = 'SUPREMnO';

  try {
    const user = await User.findOne({ username: targetUsername });

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    const isAdminOrSpecialUser = currentUser.isAdm || currentUser.key === specialKey;

    if (!isAdminOrSpecialUser && (user.key !== currentPassword || user.username !== currentUser.username)) {
      return res.status(401).send('Acesso não autorizado para editar.');
    }

    res.render('edit', { user });
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
  }
});

app.get('/deletar/:username', async (req, res) => {
  const { user: currentUser, senha: currentPassword } = req.session;
  const { username: targetUsername } = req.params;
  const specialKey = 'SUPREMnO';

  try {
    const user = await User.findOne({ username: targetUsername });

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    const isAdminOrSpecialUser = currentUser.isAdm || currentUser.key === specialKey;

    if (!isAdminOrSpecialUser && (user.key !== currentPassword || user.username !== currentUser.username)) {
      return res.status(401).send('Acesso não autorizado para deletar.');
    }

    await User.deleteOne({ username: targetUsername });
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
  }
});


app.post('/edit/:username', async (req, res) => {
  const { username } = req.params;
  const { password, key, ft, saldo, total, isPremium, isAdm, isBaned } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // Validação de entrada
    const isPremiumValue = isPremium === 'true';
    const isAdmValue = isAdm === 'true';
    const isBanedValue = isBaned === 'true';

    // Atualize os valores
    user.password = password || user.password;
    user.key = key || user.key;
    user.ft = ft || user.ft;
    user.saldo = saldo || user.saldo;
    user.isPremium = isPremiumValue;
    user.isAdm = isAdmValue;
    user.isBaned = isBanedValue;
    user.total = total || user.total;

    // Salve as alterações no banco de dados
    await user.save();

    return res.redirect('/');
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
  }
});


app.post('/editarr/:username', async (req, res) => {
  const { username } = req.params;
  const { password, key, ft, insta, wallpaper, zap, yt } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // Atualize os valores
    user.password = password || user.password;
    user.key = key || user.key;
    user.ft = ft || user.ft;
    user.yt = yt || user.yt;
    user.insta = insta || user.insta
    user.zap = zap || user.zap
    user.wallpaper = wallpaper || user.wallpaper

    // Salve as alterações no banco de dados
    await user.save();

    return res.redirect('/login');
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    return res.status(500).send('Erro interno do servidor. Por favor, tente novamente mais tarde.');
  }
});


app.get('/ver/:username', async (req, res) => {
  const username = req.params.username;
  const dados = await User.findOne({ username });
  res.render('usuario', { dados });
});

// Fim do sistemas e inicio das Apis \\

app.get('/nsfw/ahegao', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ahegao = JSON.parse(fs.readFileSync(__dirname + '/data/ahegao.json'));
    const randahegao = ahegao[Math.floor(Math.random() * ahegao.length)];

    res.json({
      url: `${randahegao}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/ass', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ass = JSON.parse(fs.readFileSync(__dirname + '/data/ass.json'));
    const randass = ass[Math.floor(Math.random() * ass.length)];

    res.json({
      url: `${randass}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/bdsm', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const bdsm = JSON.parse(fs.readFileSync(__dirname + '/data/bdsm.json'));
    const randbdsm = bdsm[Math.floor(Math.random() * bdsm.length)];

    res.json({
      url: `${randbdsm}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/blowjob', async (req, res, next) => {
  const { username, key } = req.query;
  console.log(username, key)
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const blowjob = JSON.parse(fs.readFileSync(__dirname + '/data/blowjob.json'));
    const randblowjob = blowjob[Math.floor(Math.random() * blowjob.length)];

    res.json({
      url: `${randblowjob}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/cuckold', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const cuckold = JSON.parse(fs.readFileSync(__dirname + '/data/cuckold.json'));
    const randcuckold = cuckold[Math.floor(Math.random() * cuckold.length)];

    res.json({
      url: `${randcuckold}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/cum', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const cum = JSON.parse(fs.readFileSync(__dirname + '/data/cum.json'));
    const randcum = cum[Math.floor(Math.random() * cum.length)];

    res.json({
      url: `${randcum}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/ero', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ero = JSON.parse(fs.readFileSync(__dirname + '/data/ero.json'));
    const randero = ero[Math.floor(Math.random() * ero.length)];

    res.json({
      url: `${randero}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/memes', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/memes-video.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/femdom', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const femdom = JSON.parse(fs.readFileSync(__dirname + '/data/femdom.json'));
    const randfemdom = femdom[Math.floor(Math.random() * femdom.length)];

    res.json({
      url: `${randfemdom}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/foot', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const foot = JSON.parse(fs.readFileSync(__dirname + '/data/foot.json'));
    const randfoot = foot[Math.floor(Math.random() * foot.length)];

    res.json({
      url: `${randfoot}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/gangbang', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const gangbang = JSON.parse(fs.readFileSync(__dirname + '/data/gangbang.json'));
    const randgangbang = gangbang[Math.floor(Math.random() * gangbang.length)];

    res.json({
      url: `${randgangbang}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/glasses', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const glasses = JSON.parse(fs.readFileSync(__dirname + '/data/glasses.json'));
    const randglasses = glasses[Math.floor(Math.random() * glasses.length)];

    res.json({
      url: `${randglasses}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/hentai', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const hentai = JSON.parse(fs.readFileSync(__dirname + '/data/hentai.json'));
    const randhentai = hentai[Math.floor(Math.random() * hentai.length)];

    res.json({
      url: `${randhentai}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/gifs', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const gifs = JSON.parse(fs.readFileSync(__dirname + '/data/gifs.json'));
    const randgifs = gifs[Math.floor(Math.random() * gifs.length)];

    res.json({
      url: `${randgifs}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/jahy', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const jahy = JSON.parse(fs.readFileSync(__dirname + '/data/jahy.json'));
    const randjahy = jahy[Math.floor(Math.random() * jahy.length)];

    res.json({
      url: `${randjahy}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/manga', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const manga = JSON.parse(fs.readFileSync(__dirname + '/data/manga.json'));
    const randmanga = manga[Math.floor(Math.random() * manga.length)];

    res.json({
      url: `${randmanga}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/masturbation', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const masturbation = JSON.parse(fs.readFileSync(__dirname + '/data/masturbation.json'));
    const randmasturbation = masturbation[Math.floor(Math.random() * masturbation.length)];

    res.json({
      url: `${randmasturbation}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/neko', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const neko = JSON.parse(fs.readFileSync(__dirname + '/data/neko.json'));
    const randneko = neko[Math.floor(Math.random() * neko.length)];

    res.json({
      url: `${randneko}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/orgy', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const orgy = JSON.parse(fs.readFileSync(__dirname + '/data/orgy.json'));
    const randorgy = orgy[Math.floor(Math.random() * orgy.length)];

    res.json({
      url: `${randorgy}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})



app.get('/nsfw/panties', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const panties = JSON.parse(fs.readFileSync(__dirname + '/data/panties.json'));
    const randpanties = panties[Math.floor(Math.random() * panties.length)];

    res.json({
      url: `${randpanties}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/pussy', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const pussy = JSON.parse(fs.readFileSync(__dirname + '/data/pussy.json'));
    const randpussy = pussy[Math.floor(Math.random() * pussy.length)];

    res.json({
      url: `${randpussy}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/neko2', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const neko2 = JSON.parse(fs.readFileSync(__dirname + '/data/neko2.json'));
    const randneko2 = neko2[Math.floor(Math.random() * neko2.length)];

    res.json({
      url: `${randneko2}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/tentacles', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const tentacles = JSON.parse(fs.readFileSync(__dirname + '/data/tentacles.json'));
    const randtentacles = tentacles[Math.floor(Math.random() * tentacles.length)];

    res.json({
      url: `${randtentacles}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/thighs', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const thighs = JSON.parse(fs.readFileSync(__dirname + '/data/thighs.json'));
    const randthighs = thighs[Math.floor(Math.random() * thighs.length)];

    res.json({
      url: `${randthighs}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/yuri', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const yuri = JSON.parse(fs.readFileSync(__dirname + '/data/yuri.json'));
    const randyuri = yuri[Math.floor(Math.random() * yuri.length)];

    res.json({
      url: `${randyuri}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nsfw/zettai', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const zettai = JSON.parse(fs.readFileSync(__dirname + '/data/zettai.json'));
    const randzettai = zettai[Math.floor(Math.random() * zettai.length)];

    res.json({
      url: `${randzettai}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/keneki', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const keneki = JSON.parse(fs.readFileSync(__dirname + '/data/keneki.json'));
    const randkeneki = keneki[Math.floor(Math.random() * keneki.length)];

    res.json({
      url: `${randkeneki}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/megumin', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const megumin = JSON.parse(fs.readFileSync(__dirname + '/data/megumin.json'));
    const randmegumin = megumin[Math.floor(Math.random() * megumin.length)];

    res.json({
      url: `${randmegumin}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/yotsuba', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const yotsuba = JSON.parse(fs.readFileSync(__dirname + '/data/yotsuba.json'));
    const randyotsuba = yotsuba[Math.floor(Math.random() * yotsuba.length)];

    res.json({
      url: `${randyotsuba}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shinomiya', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shinomiya = JSON.parse(fs.readFileSync(__dirname + '/data/shinomiya.json'));
    const randshinomiya = shinomiya[Math.floor(Math.random() * shinomiya.length)];

    res.json({
      url: `${randshinomiya}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/yumeko', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const yumeko = JSON.parse(fs.readFileSync(__dirname + '/data/yumeko.json'));
    const randyumeko = yumeko[Math.floor(Math.random() * yumeko.length)];

    res.json({
      url: `${randyumeko}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/tejina', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const tejina = JSON.parse(fs.readFileSync(__dirname + '/data/tejina.json'));
    const randtejina = tejina[Math.floor(Math.random() * tejina.length)];

    res.json({
      url: `${randtejina}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/chiho', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const chiho = JSON.parse(fs.readFileSync(__dirname + '/data/chiho.json'));
    const randchiho = chiho[Math.floor(Math.random() * chiho.length)];

    res.json({
      url: `${randchiho}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/18/video', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }

  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const vid = require("./data/pack.js")
    const video_18 = vid.video_18
    const danvid = video_18[Math.floor(Math.random() * video_18.length)];

    res.json({
      url: `${danvid}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/18/travazap', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }

  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const tra = require("./data/pack.js")
    const travazap = tra.travazap
    const traft = travazap[Math.floor(Math.random() * travazap.length)];

    res.json({
      url: `${traft}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})



app.get('/nime/toukachan', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const toukachan = JSON.parse(fs.readFileSync(__dirname + '/data/toukachan.json'));
    const randtoukachan = toukachan[Math.floor(Math.random() * toukachan.length)];

    res.json({
      url: `${randtoukachan}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/akira', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const akira = JSON.parse(fs.readFileSync(__dirname + '/data/akira.json'));
    const randakira = akira[Math.floor(Math.random() * akira.length)];

    res.json({
      url: `${randakira}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/itori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const itori = JSON.parse(fs.readFileSync(__dirname + '/data/itori.json'));
    const randitori = itori[Math.floor(Math.random() * itori.length)];

    res.json({
      url: `${randitori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kurumi', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kurumi = JSON.parse(fs.readFileSync(__dirname + '/data/kurumi.json'));
    const randkurumi = kurumi[Math.floor(Math.random() * kurumi.length)];

    res.json({
      url: `${randkurumi}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/miku', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const miku = JSON.parse(fs.readFileSync(__dirname + '/data/miku.json'));
    const randmiku = miku[Math.floor(Math.random() * miku.length)];

    res.json({
      url: `${randmiku}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/pokemon', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const pokemon = JSON.parse(fs.readFileSync(__dirname + '/data/pokemon.json'));
    const randpokemon = pokemon[Math.floor(Math.random() * pokemon.length)];

    res.json({
      url: `${randpokemon}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/ryujin', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ryujin = JSON.parse(fs.readFileSync(__dirname + '/data/ryujin.json'));
    const randryujin = ryujin[Math.floor(Math.random() * ryujin.length)];

    res.json({
      url: `${randryujin}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/rose', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const rose = JSON.parse(fs.readFileSync(__dirname + '/data/rose.json'));
    const randrose = rose[Math.floor(Math.random() * rose.length)];

    res.json({
      url: `${randrose}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kaori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kaori = JSON.parse(fs.readFileSync(__dirname + '/data/kaori.json'));
    const randkaori = kaori[Math.floor(Math.random() * kaori.length)];

    res.json({
      url: `${randkaori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shizuka', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shizuka = JSON.parse(fs.readFileSync(__dirname + '/data/shizuka.json'));
    const randshizuka = shizuka[Math.floor(Math.random() * shizuka.length)];

    res.json({
      url: `${randshizuka}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kaga', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kaga = JSON.parse(fs.readFileSync(__dirname + '/data/kaga.json'));
    const randkaga = kaga[Math.floor(Math.random() * kaga.length)];

    res.json({
      url: `${randkaga}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kotori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kotori = JSON.parse(fs.readFileSync(__dirname + '/data/kotori.json'));
    const randkotori = kotori[Math.floor(Math.random() * kotori.length)];

    res.json({
      url: `${randkotori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/mikasa', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const mikasa = JSON.parse(fs.readFileSync(__dirname + '/data/mikasa.json'));
    const randmikasa = mikasa[Math.floor(Math.random() * mikasa.length)];

    res.json({
      url: `${randmikasa}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/akiyama', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const akiyama = JSON.parse(fs.readFileSync(__dirname + '/data/akiyama.json'));
    const randakiyama = akiyama[Math.floor(Math.random() * akiyama.length)];

    res.json({
      url: `${randakiyama}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/gremory', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const gremory = JSON.parse(fs.readFileSync(__dirname + '/data/gremory.json'));
    const randgremory = gremory[Math.floor(Math.random() * gremory.length)];

    res.json({
      url: `${randgremory}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/isuzu', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const isuzu = JSON.parse(fs.readFileSync(__dirname + '/data/isuzu.json'));
    const randisuzu = isuzu[Math.floor(Math.random() * isuzu.length)];

    res.json({
      url: `${randisuzu}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/cosplay', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const cosplay = JSON.parse(fs.readFileSync(__dirname + '/data/cosplay.json'));
    const randcosplay = cosplay[Math.floor(Math.random() * cosplay.length)];

    res.json({
      url: `${randcosplay}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shina', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shina = JSON.parse(fs.readFileSync(__dirname + '/data/shina.json'));
    const randshina = shina[Math.floor(Math.random() * shina.length)];

    res.json({
      url: `${randshina}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kagura', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kagura = JSON.parse(fs.readFileSync(__dirname + '/data/kagura.json'));
    const randkagura = kagura[Math.floor(Math.random() * kagura.length)];

    res.json({
      url: `${randkagura}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shinka', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shinka = JSON.parse(fs.readFileSync(__dirname + '/data/shinka.json'));
    const randshinka = shinka[Math.floor(Math.random() * shinka.length)];

    res.json({
      url: `${randshinka}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/eba', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const eba = JSON.parse(fs.readFileSync(__dirname + '/data/eba.json'));
    const randeba = eba[Math.floor(Math.random() * eba.length)];

    res.json({
      url: `${randeba}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/deidara', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Deidara = JSON.parse(fs.readFileSync(__dirname + '/data/deidara.json'));
    const randDeidara = Deidara[Math.floor(Math.random() * Deidara.length)];

    res.json({
      url: `${randDeidara}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})



app.get('/nime/jeni', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const jeni = JSON.parse(fs.readFileSync(__dirname + '/data/jeni.json'));
    const randjeni = jeni[Math.floor(Math.random() * jeni.length)];

    res.json({
      url: `${randjeni}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/random/meme', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/meme.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})
app.get('/nime/toukachan', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const toukachan = JSON.parse(fs.readFileSync(__dirname + '/data/toukachan.json'));
    const randtoukachan = toukachan[Math.floor(Math.random() * toukachan.length)];

    res.json({
      url: `${randtoukachan}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/akira', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const akira = JSON.parse(fs.readFileSync(__dirname + '/data/akira.json'));
    const randakira = akira[Math.floor(Math.random() * akira.length)];

    res.json({
      url: `${randakira}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/itori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const itori = JSON.parse(fs.readFileSync(__dirname + '/data/itori.json'));
    const randitori = itori[Math.floor(Math.random() * itori.length)];

    res.json({
      url: `${randitori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kurumi', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kurumi = JSON.parse(fs.readFileSync(__dirname + '/data/kurumi.json'));
    const randkurumi = kurumi[Math.floor(Math.random() * kurumi.length)];

    res.json({
      url: `${randkurumi}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/miku', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const miku = JSON.parse(fs.readFileSync(__dirname + '/data/miku.json'));
    const randmiku = miku[Math.floor(Math.random() * miku.length)];

    res.json({
      url: `${randmiku}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/pokemon', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const pokemon = JSON.parse(fs.readFileSync(__dirname + '/data/pokemon.json'));
    const randpokemon = pokemon[Math.floor(Math.random() * pokemon.length)];

    res.json({
      url: `${randpokemon}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/ryujin', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ryujin = JSON.parse(fs.readFileSync(__dirname + '/data/ryujin.json'));
    const randryujin = ryujin[Math.floor(Math.random() * ryujin.length)];

    res.json({
      url: `${randryujin}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/rose', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const rose = JSON.parse(fs.readFileSync(__dirname + '/data/rose.json'));
    const randrose = rose[Math.floor(Math.random() * rose.length)];

    res.json({
      url: `${randrose}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kaori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kaori = JSON.parse(fs.readFileSync(__dirname + '/data/kaori.json'));
    const randkaori = kaori[Math.floor(Math.random() * kaori.length)];

    res.json({
      url: `${randkaori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shizuka', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shizuka = JSON.parse(fs.readFileSync(__dirname + '/data/shizuka.json'));
    const randshizuka = shizuka[Math.floor(Math.random() * shizuka.length)];

    res.json({
      url: `${randshizuka}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kaga', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kaga = JSON.parse(fs.readFileSync(__dirname + '/data/kaga.json'));
    const randkaga = kaga[Math.floor(Math.random() * kaga.length)];

    res.json({
      url: `${randkaga}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kotori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kotori = JSON.parse(fs.readFileSync(__dirname + '/data/kotori.json'));
    const randkotori = kotori[Math.floor(Math.random() * kotori.length)];

    res.json({
      url: `${randkotori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/mikasa', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const mikasa = JSON.parse(fs.readFileSync(__dirname + '/data/mikasa.json'));
    const randmikasa = mikasa[Math.floor(Math.random() * mikasa.length)];

    res.json({
      url: `${randmikasa}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/akiyama', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const akiyama = JSON.parse(fs.readFileSync(__dirname + '/data/akiyama.json'));
    const randakiyama = akiyama[Math.floor(Math.random() * akiyama.length)];

    res.json({
      url: `${randakiyama}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/gremory', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const gremory = JSON.parse(fs.readFileSync('./data/gremory.json'));
    const randgremory = gremory[Math.floor(Math.random() * gremory.length)];
    console.log(randgremory)
    res.json({
      url: `${randgremory}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/isuzu', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const isuzu = JSON.parse(fs.readFileSync(__dirname + '/data/isuzu.json'));
    const randisuzu = isuzu[Math.floor(Math.random() * isuzu.length)];

    res.json({
      url: `${randisuzu}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/cosplay', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const cosplay = JSON.parse(fs.readFileSync(__dirname + '/data/cosplay.json'));
    const randcosplay = cosplay[Math.floor(Math.random() * cosplay.length)];

    res.json({
      url: `${randcosplay}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shina', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shina = JSON.parse(fs.readFileSync(__dirname + '/data/shina.json'));
    const randshina = shina[Math.floor(Math.random() * shina.length)];

    res.json({
      url: `${randshina}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kagura', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const kagura = JSON.parse(fs.readFileSync(__dirname + '/data/kagura.json'));
    const randkagura = kagura[Math.floor(Math.random() * kagura.length)];

    res.json({
      url: `${randkagura}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shinka', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const shinka = JSON.parse(fs.readFileSync(__dirname + '/data/shinka.json'));
    const randshinka = shinka[Math.floor(Math.random() * shinka.length)];

    res.json({
      url: `${randshinka}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/eba', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const eba = JSON.parse(fs.readFileSync(__dirname + '/data/eba.json'));
    const randeba = eba[Math.floor(Math.random() * eba.length)];

    res.json({
      url: `${randeba}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/deidara', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Deidara = JSON.parse(fs.readFileSync(__dirname + '/data/deidara.json'));
    const randDeidara = Deidara[Math.floor(Math.random() * Deidara.length)];

    res.json({
      url: `${randDeidara}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})



app.get('/nime/jeni', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const jeni = JSON.parse(fs.readFileSync(__dirname + '/data/jeni.json'));
    const randjeni = jeni[Math.floor(Math.random() * jeni.length)];

    res.json({
      url: `${randjeni}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/random/meme', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/meme.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/wallpaper/satanic', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const satanic = JSON.parse(fs.readFileSync(__dirname + '/data/satanic.json'));
    const randsatanic = satanic[Math.floor(Math.random() * satanic.length)];

    res.json({
      url: `${randsatanic}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})



app.get('/nime/itachi', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Itachi = JSON.parse(fs.readFileSync(__dirname + '/data/itachi.json'));
    const randItachi = Itachi[Math.floor(Math.random() * Itachi.length)];

    res.json({
      url: `${randItachi}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/madara', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Madara = JSON.parse(fs.readFileSync(__dirname + '/data/madara.json'));
    const randMadara = Madara[Math.floor(Math.random() * Madara.length)];

    res.json({
      url: `${randMadara}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/yuki', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Yuki = JSON.parse(fs.readFileSync(__dirname + '/data/yuki.json'));
    const randYuki = Yuki[Math.floor(Math.random() * Yuki.length)];

    res.json({
      url: `${randYuki}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/wallpaper/asuna', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const asuna = JSON.parse(fs.readFileSync(__dirname + '/data/asuna.json'));
    const randasuna = asuna[Math.floor(Math.random() * asuna.length)];

    res.json({
      url: `${randasuna}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/ayuzawa', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ayuzawa = JSON.parse(fs.readFileSync(__dirname + '/data/ayuzawa.json'));
    const randayuzawa = ayuzawa[Math.floor(Math.random() * ayuzawa.length)];

    res.json({
      url: `${randayuzawa}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/chitoge', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const chitoge = JSON.parse(fs.readFileSync(__dirname + '/data/chitoge.json'));
    const randchitoge = chitoge[Math.floor(Math.random() * chitoge.length)];

    res.json({
      url: `${randchitoge}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/emilia', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const emilia = JSON.parse(fs.readFileSync(__dirname + '/data/emilia.json'));
    const randemilia = emilia[Math.floor(Math.random() * emilia.length)];
    console.log(randemilia)
    res.json({
      url: `${randemilia}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/hestia', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const hestia = JSON.parse(fs.readFileSync(__dirname + '/data/hestia.json'));
    const randhestia = hestia[Math.floor(Math.random() * hestia.length)];

    res.json({
      url: `${randhestia}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/inori', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const inori = JSON.parse(fs.readFileSync(__dirname + '/data/inori.json'));
    const randinori = inori[Math.floor(Math.random() * inori.length)];

    res.json({
      url: `${randinori}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/ana', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const ana = JSON.parse(fs.readFileSync(__dirname + '/data/ana.json'));
    const randana = ana[Math.floor(Math.random() * ana.length)];

    res.json({
      url: `${randana}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/boruto', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Boruto = JSON.parse(fs.readFileSync(__dirname + '/data/boruto.json'));
    const randBoruto = Boruto[Math.floor(Math.random() * Boruto.length)];

    res.json({
      url: `${randBoruto}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/erza', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Erza = JSON.parse(fs.readFileSync(__dirname + '/data/erza.json'));
    const randErza = Erza[Math.floor(Math.random() * Erza.length)];

    res.json({
      url: `${randErza}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kakasih', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Kakasih = JSON.parse(fs.readFileSync(__dirname + '/data/kakasih.json'));
    const randKakasih = Kakasih[Math.floor(Math.random() * Kakasih.length)];

    res.json({
      url: `${randKakasih}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/sagiri', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Sagiri = JSON.parse(fs.readFileSync(__dirname + '/data/sagiri.json'));
    const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];

    res.json({
      url: `${randSagiri}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/minato', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Minato = JSON.parse(fs.readFileSync(__dirname + '/data/minato.json'));
    const randMinato = Minato[Math.floor(Math.random() * Minato.length)];

    res.json({
      url: `${randMinato}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/naruto', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Naruto = JSON.parse(fs.readFileSync(__dirname + '/data/naruto.json'));
    const randNaruto = Naruto[Math.floor(Math.random() * Naruto.length)];

    res.json({
      url: `${randNaruto}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/nezuko', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Nezuko = JSON.parse(fs.readFileSync(__dirname + '/data/nezuko.json'));
    const randNezuko = Nezuko[Math.floor(Math.random() * Nezuko.length)];

    res.json({
      url: `${randNezuko}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/onepiece', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Pic = JSON.parse(fs.readFileSync(__dirname + '/data/onepiece.json'));
    const randPic = Pic[Math.floor(Math.random() * Pic.length)];

    res.json({
      url: `${randPic}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/rize', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Rize = JSON.parse(fs.readFileSync(__dirname + '/data/rize.json'));
    const randRize = Rize[Math.floor(Math.random() * Rize.length)];

    res.json({
      url: `${randRize}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/sakura', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Sakura = JSON.parse(fs.readFileSync(__dirname + '/data/sakura.json'));
    const randSakura = Sakura[Math.floor(Math.random() * Sakura.length)];

    res.json({
      url: `${randSakura}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/sasuke', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Sasuke = JSON.parse(fs.readFileSync(__dirname + '/data/sasuke.json'));
    const randSasuke = Sasuke[Math.floor(Math.random() * Sasuke.length)];

    res.json({
      url: `${randSasuke}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/tsunade', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Su = JSON.parse(fs.readFileSync(__dirname + '/data/tsunade.json'));
    const randSu = Su[Math.floor(Math.random() * Su.length)];

    res.json({
      url: `${randSu}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/montor', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Mon = JSON.parse(fs.readFileSync(__dirname + '/data/montor.json'));
    const randMon = Mon[Math.floor(Math.random() * Mon.length)];

    res.json({
      url: `${randMon}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})
// ain
app.get('/nime/mobil', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Mob = JSON.parse(fs.readFileSync(__dirname + '/data/mobil.json'));
    const randMob = Mob[Math.floor(Math.random() * Mob.length)];

    res.json({
      url: `${randMob}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/anime', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Wai23 = JSON.parse(fs.readFileSync(__dirname + '/data/wallhp2.json'));
    const randWai23 = Wai23[Math.floor(Math.random() * Wai23.length)];

    res.json({
      url: `${randWai23}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/wallhp', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Wai22 = JSON.parse(fs.readFileSync(__dirname + '/data/wallhp.json'));
    const randWai22 = Wai22[Math.floor(Math.random() * Wai22.length)];

    res.json({
      url: `${randWai22}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/waifu2', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Wai2 = JSON.parse(fs.readFileSync(__dirname + '/data/waifu2.json'));
    const randWai2 = Wai2[Math.floor(Math.random() * Wai2.length)];

    res.json({
      url: `${randWai2}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/waifu', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Wai = JSON.parse(fs.readFileSync(__dirname + '/data/waifu.json'));
    const randWai = Wai[Math.floor(Math.random() * Wai.length)];

    res.json({
      url: `${randWai}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/hekel', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Hekel = JSON.parse(fs.readFileSync(__dirname + '/data/hekel.json'));
    const randHekel = Hekel[Math.floor(Math.random() * Hekel.length)]

    res.json({
      url: `${randHekel}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/kucing', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Kucing = JSON.parse(fs.readFileSync(__dirname + '/data/kucing.json'));
    const randKucing = Kucing[Math.floor(Math.random() * Kucing.length)]

    res.json({
      url: `${randKucing}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/wallpaper/pubg', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Pubg = JSON.parse(fs.readFileSync(__dirname + '/data/pubg.json'));
    const randPubg = Pubg[Math.floor(Math.random() * Pubg.length)]

    res.json({
      url: `${randPubg}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/wallpaper/ppcouple', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Pp = JSON.parse(fs.readFileSync(__dirname + '/data/profil.json'));
    const randPp = Pp[Math.floor(Math.random() * Pp.length)]

    res.json({
      url: `${randPp}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/wallpaper/anjing', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Anjing = JSON.parse(fs.readFileSync(__dirname + '/data/anjing.json'));
    const randAnjing = Anjing[Math.floor(Math.random() * Anjing.length)]

    res.json({
      url: `${randAnjing}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/doraemon', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Dora = JSON.parse(fs.readFileSync(__dirname + '/data/doraemon.json'));
    const randDora = Dora[Math.floor(Math.random() * Dora.length)]

    res.json({
      url: `${randDora}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/elaina', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Elaina = JSON.parse(fs.readFileSync(__dirname + '/data/elaina.json'))
    const randElaina = Elaina[Math.floor(Math.random() * Elaina.length)]
    //tansole.log(randLoli)

    res.json({
      url: `${randElaina}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/loli', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Loli = JSON.parse(fs.readFileSync(__dirname + '/data/loli.json'))
    const randLoli = Loli[Math.floor(Math.random() * Loli.length)]
    //tansole.log(randLoli)

    res.json({
      url: `${randLoli}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/yuri', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Yuri = JSON.parse(fs.readFileSync(__dirname + '/data/yuri.json'))
    const randYuri = Yuri[Math.floor(Math.random() * Yuri.length)]
    //tansole.log(randTech))
    res.json({
      url: `${randYuri}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/nime/cecan', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const cecan = JSON.parse(fs.readFileSync(__dirname + '/data/cecan.json'));
    const randCecan = cecan[Math.floor(Math.random() * cecan.length)];
    //data = await fetch(randCecan).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/cecan.jpeg', data)
    res.json({
      url: `${randCecan}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/wallpaper/aesthetic', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Aesthetic = JSON.parse(fs.readFileSync(__dirname + '/data/aesthetic.json'));
    const randAesthetic = Aesthetic[Math.floor(Math.random() * Aesthetic.length)];
    //data = await fetch(randAesthetic).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/aesthetic.jpeg', data)
    res.json({
      url: `${randAesthetic}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})



app.get('/nime/sagiri', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Sagiri = JSON.parse(fs.readFileSync(__dirname + '/data/sagiri.json'));
    const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];
    //data = await fetch(randSagiri).then(v => v.buffer())
    //await fs.writeFileSync(__dirname + '/tmp/sagiri.jpeg', data)
    res.json({
      url: `${randSagiri}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/shota', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Shota = JSON.parse(fs.readFileSync(__dirname + '/data/shota.json'));
    const randShota = Shota[Math.floor(Math.random() * Shota.length)];
    //data = await fetch(randShota).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/shota.jpeg', data)
    res.json({
      url: `${randShota}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/nsfwloli', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Lol = JSON.parse(fs.readFileSync(__dirname + '/data/nsfwloli.json'));
    const randLol = Lol[Math.floor(Math.random() * Lol.length)];
    //data = await fetch(randLol).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/lol.jpeg', data)
    res.json({
      url: `${randLol}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/nime/hinata', async (req, res, next) => {

  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Hinata = JSON.parse(fs.readFileSync(__dirname + '/data/hinata.json'));
    const randHin = Hinata[Math.floor(Math.random() * Hinata.length)];
    //data = await fetch(randHin).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/Hinata.jpeg', data)
    res.json({
      url: `${randHin}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/download/ytmp3', async (req, res, next) => {
  const url = req.query.url;
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    ytDonlodMp3(url)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error)
        res.json(error)
      });
  } else {
    res.json(loghandler.invalidKey)
  }
});



app.get('/download/tiktok', async (req, res, next) => {
  const url = req.query.url;
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    TiktokDownload(url)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json(error)
      });
  } else {
    res.json(loghandler.invalidKey)
  }
});

app.get('/download/ytmp4', async (req, res, next) => {
  const url = req.query.url;
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    ytDonlodMp4(url)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json(error)
      });
  } else {
    res.json(loghandler.invalidKey)
  }
});

app.get("/yt/playmp3", async (req, res, next) => {
  const query = req.query.query;
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    ytPlayMp3(query)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json(error);
      });
  } else {
    res.json(loghandler.invalidKey)
  }
});


app.get("/yt/playmp4", async (req, res, next) => {

  const query = req.query.query;

  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    ytPlayMp4(query)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json(error);
      });
  } else {
    res.json(loghandler.invalidKey)
  }
});


app.get('/anime/amv', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    const amv = JSON.parse(fs.readFileSync(path + '/data/amv.json'));
    const randomAmv = amv[Math.floor(Math.random() * amv.length)];

    res.status(200).json({
      codigo: 200,
      successo: true,
      ...randomAmv
    });
  } else {
    res.json(loghandler.invalidKey);
  }
});


app.get('/wallpaper/cyberspace', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const cyberspace = JSON.parse(fs.readFileSync(__dirname + '/data/CyberSpace.json'));
    const randcyberspace = cyberspace[Math.floor(Math.random() * cyberspace.length)];

    res.json({
      url: `${randcyberspace}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/gaming', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const gaming = JSON.parse(fs.readFileSync(__dirname + '/data/GameWallp.json'));
    const randgaming = gaming[Math.floor(Math.random() * gaming.length)];

    res.json({
      url: `${randgaming}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/programing', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const programing = JSON.parse(fs.readFileSync(__dirname + '/data/Programming.json'));
    const randprograming = programing[Math.floor(Math.random() * programing.length)];

    res.json({
      url: `${randprograming}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/wallpapertec', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const teknologi = JSON.parse(fs.readFileSync(__dirname + '/data/Technology.json'));
    const randteknologi = teknologi[Math.floor(Math.random() * teknologi.length)];

    res.json({
      url: `${randteknologi}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/mountain', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const mountain = JSON.parse(fs.readFileSync(__dirname + '/data/Mountain.json'));
    const randmountain = mountain[Math.floor(Math.random() * mountain.length)];

    res.json({
      url: `${randmountain}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})



app.get('/wallpaper/satanic', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const satanic = JSON.parse(fs.readFileSync(__dirname + '/data/satanic.json'));
    const randsatanic = satanic[Math.floor(Math.random() * satanic.length)];

    res.json({
      url: `${randsatanic}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})



app.get('/wallpaper/asuna', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const asuna = JSON.parse(fs.readFileSync(__dirname + '/data/asuna.json'));
    const randasuna = asuna[Math.floor(Math.random() * asuna.length)];

    res.json({
      url: `${randasuna}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


app.get('/wallpaper/pubg', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Pubg = JSON.parse(fs.readFileSync(__dirname + '/data/pubg.json'));
    const randPubg = Pubg[Math.floor(Math.random() * Pubg.length)]

    res.json({
      url: `${randPubg}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/ppcouple', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Pp = JSON.parse(fs.readFileSync(__dirname + '/data/profil.json'));
    const randPp = Pp[Math.floor(Math.random() * Pp.length)]

    res.json({
      url: `${randPp}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/anjing', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    Anjing = JSON.parse(fs.readFileSync(__dirname + '/data/anjing.json'));
    const randAnjing = Anjing[Math.floor(Math.random() * Anjing.length)]

    res.json({
      url: `${randAnjing}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get('/wallpaper/aesthetic', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const Aesthetic = JSON.parse(fs.readFileSync(__dirname + '/data/aesthetic.json'));
    const randAesthetic = Aesthetic[Math.floor(Math.random() * Aesthetic.length)];
    data = await fetch(randAesthetic).then(v => v.buffer());
    await fs.writeFileSync(__dirname + '/tmp/aesthetic.jpeg', data)
    res.json({
      url: `${randAesthetic}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

app.get("/download/pinterest", async (req, res, next) => {
  const query = req.query.query;
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    pin.pinterest(query)
      .then(result => {
        res.json(result)
      }).catch((error) => {
        res.json(error);
      });
  } else {
    res.json(loghandler.invalidKey)
  }
});

app.get('/memes', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  // Verifica se o usuário existe e a chave está correta
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }


  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/memes-video.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/18/video', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }

  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const vid = require("./data/pack.js")
    const video_18 = vid.video_18
    const danvid = video_18[Math.floor(Math.random() * video_18.length)];

    res.json({
      url: `${danvid}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/18/travazap', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }

  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const tra = require("./data/pack.js")
    const travazap = tra.travazap
    const traft = travazap[Math.floor(Math.random() * travazap.length)];

    res.json({
      url: `${traft}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})

app.get('/18/foto_18', async (req, res, next) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });

  if (!user) {
    return res.sendFile(htmlPath);
  }

  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }

  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const tra = require("./data/pack.js")
    const foto_18 = tra.foto_18
    const traft = foto_18[Math.floor(Math.random() * foto_18.length)];

    res.json({
      url: `${traft}`
    })
  } else {
    console.log('Saldo insuficiente.');
  }
})


app.get('/welcome', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    const nick = req.query.nick || 'clover';
    const guildName = req.query.guildName || 'clover grupo';
    const guildIcon = req.query.guildIcon || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
    const memberCount = req.query.memberCount || '120';
    const avatar = req.query.avatar || 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg';
    const background = req.query.background || 'https://i.ibb.co/4YBNyvP/images-76.jpg';

    try {
      // Download images
      await downloadImage(guildIcon, 'guildIcon.jpg');
      await downloadImage(avatar, 'avatar.jpg');
      await downloadImage(background, 'background.jpg');

      // Generate welcome image
      const image = await new knights.Welcome()
        .setUsername(nick)
        .setGuildName(guildName)
        .setGuildIcon('./guildIcon.jpg')
        .setMemberCount(memberCount)
        .setAvatar('./avatar.jpg')
        .setBackground('./background.jpg')
        .toAttachment();

      const data = image.toBuffer();
      const filename = `welcome-${username}.png`;
      fs.writeFileSync(filename, data);

      res.sendFile(__dirname + '/' + filename);
    } catch (error) {
      console.error('Error generating welcome image:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Delete downloaded images
      fs.unlinkSync('guildIcon.jpg');
      fs.unlinkSync('avatar.jpg');
      fs.unlinkSync('background.jpg');
    }
  } else {
    console.log('Saldo insuficiente.');
  }
});
app.get('/goodbye', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const nick = req.query.nick || "clover";
    const guildName = req.query.guildName || "clover grupo";
    const guildIcon = req.query.guildIcon || "https://telegra.ph/file/87fe9fdbf08280460e531.jpg";
    const memberCount = req.query.memberCount || "120";
    const avatar = req.query.avatar || "https://i.pinimg.com/originals/6a/6b/26/6a6b2619c79441b69fd716053613c6ec.png";
    const background = req.query.background || "https://telegra.ph/file/e28fabcd7e856b4bcef0a.jpg";

    try {
      // Download images
      await downloadImage(guildIcon, 'guildIcon.jpg');
      await downloadImage(avatar, 'avatar.jpg');
      await downloadImage(background, 'background.jpg');

      // Generate leave image
      const image = await new knights.Goodbye()
        .setUsername(nick)
        .setGuildName(guildName)
        .setGuildIcon('./guildIcon.jpg')
        .setMemberCount(memberCount)
        .setAvatar('./avatar.jpg')
        .setBackground('./background.jpg')
        .toAttachment();

      const data = image.toBuffer();
      const filename = `leave-${username}.png`;
      fs.writeFileSync(filename, data);

      res.sendFile(__dirname + '/' + filename);
    } catch (error) {
      console.error('Error generating leave image:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Delete downloaded images
      fs.unlinkSync('guildIcon.jpg');
      fs.unlinkSync('avatar.jpg');
      fs.unlinkSync('background.jpg');
    }
  } else {
    console.log('Saldo insuficiente.');
  }
});

app.get('/welcome2', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    const nick = req.query.nick || 'clover';
    const guildName = req.query.guildName || 'clover grupo';
    const guildIcon = req.query.guildIcon || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
    const memberCount = req.query.memberCount || '120';
    const avatar = req.query.avatar || 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg';
    const background = req.query.background || 'https://i.ibb.co/4YBNyvP/images-76.jpg';

    try {
      // Download images
      await downloadImage(guildIcon, 'guildIcon.jpg');
      await downloadImage(avatar, 'avatar.jpg');
      await downloadImage(background, 'background.jpg');

      // Generate welcome image
      const image = await new knights.Welcome2()
      .setUsername(nick)
      .setGuildName(guildName)
      .setGuildIcon(Buffer.from('', 'utf-8')) // Empty buffer for guild icon
      .setMemberCount(memberCount)
      .setAvatar(avatar)
      .setBackground(background)
      .toAttachment();

      const data = image.toBuffer();
      const filename = `welcome-${username}.png`;
      fs.writeFileSync(filename, data);

      res.sendFile(__dirname + '/' + filename);
    } catch (error) {
      console.error('Error generating welcome image:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Delete downloaded images
      fs.unlinkSync('guildIcon.jpg');
      fs.unlinkSync('avatar.jpg');
      fs.unlinkSync('background.jpg');
    }
  } else {
    console.log('Saldo insuficiente.');
  }
});
app.get('/goodbye2', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const nick = req.query.nick || "clover";
    const guildName = req.query.guildName || "clover grupo";
    const guildIcon = req.query.guildIcon || "https://telegra.ph/file/87fe9fdbf08280460e531.jpg";
    const memberCount = req.query.memberCount || "120";
    const avatar = req.query.avatar || "https://i.pinimg.com/originals/6a/6b/26/6a6b2619c79441b69fd716053613c6ec.png";
    const background = req.query.background || "https://telegra.ph/file/e28fabcd7e856b4bcef0a.jpg";

    try {
      // Download images
      await downloadImage(guildIcon, 'guildIcon.jpg');
      await downloadImage(avatar, 'avatar.jpg');
      await downloadImage(background, 'background.jpg');

      // Generate leave image
      const image = await new knights.Goodbye2()
        .setUsername(nick)
        .setGuildName(guildName)
        .setGuildIcon('./guildIcon.jpg')
        .setMemberCount(memberCount)
        .setAvatar('./avatar.jpg')
        .setBackground('./background.jpg')
        .toAttachment();

      const data = image.toBuffer();
      const filename = `leave-${username}.png`;
      fs.writeFileSync(filename, data);

      res.sendFile(__dirname + '/' + filename);
    } catch (error) {
      console.error('Error generating leave image:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      // Delete downloaded images
      fs.unlinkSync('guildIcon.jpg');
      fs.unlinkSync('avatar.jpg');
      fs.unlinkSync('background.jpg');
    }
  } else {
    console.log('Saldo insuficiente.');
  }
});

app.get('/levelup', async (req, res) => {
  const avatar = req.query.avatar || 'https://i.pinimg.com/originals/6a/6b/26/6a6b2619c79441b69fd716053613c6ec.png';

  try {
    // Download avatar
    await downloadImage(avatar, 'avatar.jpg');

    // Generate level up image
    const image = await new knights.Up()
      .setAvatar('./avatar.jpg')
      .toAttachment();

    const data = image.toBuffer();
    const filename = `levelup.png`;
    fs.writeFileSync(filename, data);

    res.sendFile(__dirname + '/' + filename);
  } catch (error) {
    console.error('Error generating level up image:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Delete downloaded avatar
    fs.unlinkSync('avatar.jpg');
  }
});

app.get('/ranking', async (req, res) => {
  const username = req.query.username || 'clover';
  const currxp = req.query.currxp || '100';
  const needxp = req.query.needxp || '1000';
  const level = req.query.level || '6';
  const rank = req.query.rank || 'https://i.ibb.co/Wn9cvnv/FABLED.png';
  const avatar = req.query.avatar || 'https://i.pinimg.com/originals/6a/6b/26/6a6b2619c79441b69fd716053613c6ec.png';
  const background = req.query.background || 'https://telegra.ph/file/e28fabcd7e856b4bcef0a.jpg';

  try {
    // Download images
    await downloadImage(avatar, 'avatar.jpg');
    await downloadImage(background, 'background.jpg');
    await downloadImage(rank, 'rank.png');

    // Generate rank up image
    const image = await new knights.Rank()
      .setUsername(username)
      .setBg('./background.jpg')
      .setNeedxp(needxp)
      .setCurrxp(currxp)
      .setLevel(level)
      .setRank('./rank.png')
      .setAvatar('./avatar.jpg')
      .toAttachment();

    const data = image.toBuffer();
    const filename = `rankup-${username}.png`;
    fs.writeFileSync(filename, data);

    res.sendFile(__dirname + '/' + filename);
  } catch (error) {
    console.error('Error generating rank up image:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Delete downloaded images
    fs.unlinkSync('avatar.jpg');
    fs.unlinkSync('background.jpg');
    fs.unlinkSync('rank.png');
  }
});

// Rota para playStoreSearch
app.get('/play-store-search', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const appName = req.query.appName;
    const result = await playStoreSearch(appName);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para memesDroid
app.get('/memes-droid', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await memesDroid();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para gruposZap
app.get('/grupos-zap', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await gruposZap();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para animeFireDownload
app.get('/anime-fire-download', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const url = req.query.url;
    const result = await animeFireDownload(url);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para animesFireSearch
app.get('/animes-fire-search', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const query = req.query.q;
    const result = await animesFireSearch(query);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para animesFireEps
app.get('/animes-fire-eps', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const url = req.query.url;
    const result = await animesFireEps(url);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para ultimasNoticias
app.get('/ultimas-noticias', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await ultimasNoticias();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para randomGrupos
app.get('/random-grupos', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await randomGrupos();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para xvideosDownloader
app.get('/xvideos-downloader', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const url = req.query.url;
    const result = await xvideosDownloader(url);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para xvideosSearch
app.get('/xvideos-search', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const query = req.query.q;
    const result = await xvideosSearch(query);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para fraseAmor
app.get('/frase-amor', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await fraseAmor();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para iFunny
app.get('/ifunny', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await iFunny();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para frasesPensador
app.get('/frases-pensador', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await frasesPensador();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para wallpaper2
app.get('/wallpaper2', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await wallpaper2();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para hentai
app.get('/hentai', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const result = await hentai();
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});

// Rota para styletext
app.get('/styletext', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {

    const text = req.query.text;
    const result = await styletext(text);
    res.json(result);

  } else {
    console.log('Saldo insuficiente.');
  }
});


const createATTP = async (text) => {
    const canvasWidth = 512;
    const canvasHeight = 512;
    const encoder = new GIFEncoder(canvasWidth, canvasHeight);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(100);
    encoder.setQuality(10);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const colors = [
        { r: 255, g: 0, b: 0 },    // red
        { r: 0, g: 255, b: 0 },    // lime
        { r: 255, g: 255, b: 0 },  // yellow
        { r: 255, g: 0, b: 255 },  // magenta
        { r: 0, g: 255, b: 255 }   // cyan
    ];

    for (let i = 0; i < colors.length; i++) {
        const { r, g, b } = colors[i];

        const textImage = text2png(wordwrap(text, { width: 50 }), {
            font: '40px sans-serif',
            color: `rgb(${r}, ${g}, ${b})`, // Usar cores RGB diretamente
            strokeWidth: 0, // Remover bordas
            strokeColor: 'transparent', // Cor das bordas transparente
            textAlign: 'center',
            lineSpacing: 10,
            padding: 80,
            backgroundColor: 'transparent', // Fundo transparente
            output: 'dataURL'
        });

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const image = await loadImage(textImage);
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

        encoder.addFrame(ctx);
    }

    encoder.finish();

    return encoder.out.getData();
};

// Restante do código para criar a rota e iniciar o servidor...


app.get('/attp', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
    const { texto } = req.query;
    if (!texto) {
        return res.status(400).json({ error: 'O parâmetro "texto" é obrigatório.' });
    }

    try {
        const attpData = await createATTP(texto);
        res.set('Content-Type', 'image/gif');
        res.send(attpData);
    } catch (error) {
        console.error('Erro ao criar o efeito ATTP:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação.' });
    }
  } else {
    console.log('Saldo insuficiente.');
  }
});


app.get('/attp2', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  const resultadoDiminuicao = diminuirSaldo(username);
  const add = adicionarSaldo(username)
  if (resultadoDiminuicao && add) {
  const { texto } = req.query;
  if (!texto) {
      return res.status(400).json({ error: 'O parâmetro "texto" é obrigatório.' });
  }

  try {
      const attpData = await createATTP(texto);
      res.set('Content-Type', 'image/gif');
      res.send(attpData);
  } catch (error) {
      console.error('Erro ao criar o efeito ATTP:', error);
      res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação.' });
  }
} else {
  console.log('Saldo insuficiente.');
}
});




app.listen(8000, () => {
  console.log("Server rodando na porta 8000")
})

module.exports = app
