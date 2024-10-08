process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const FormData = require('form-data');
var gis = require('g-i-s');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
var express = require('express'),
  cors = require('cors'),
  secure = require('ssl-express-www');
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
const { musicCard } = require("musicard-quartz");
const multer = require('multer');
const downloadImage = async (url, filename) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
};
const { Classic, ClassicPro, Dynamic, Mini,  } = require("musicard");
const nodemailer = require("nodemailer");
const mercadopago = require('mercadopago');

const htmlPath = path.join(__dirname, './views/error.html');
const creator = "CM";

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


const PORT = 8000;

const app = express();
const http = require('http').createServer(app)



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

app.enable('trust proxy');
app.set("json spaces", 2);
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
app.use(cors());
app.use(express.static("views"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://anikit:EPt96b3yMx3wmEC@cluster0.ukzkyjq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


mercadopago.configure({
  access_token: 'APP_USR-8259792445335336-080911-dea2c74872b688a02354a83a497effba-1445374797',
});

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

const mangaSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String],
  coverUrl: String,
  userId: mongoose.Schema.Types.ObjectId,
  chapters: [
    {
      chapterNumber: Number,
      title: String,
      images: [String]
    }
  ]
});

const User = mongoose.model('User', userSchema);
const Manga = mongoose.model('UPLOADS', mangaSchema);
Person = User;

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const chapterNumber = req.body.chapterNumber;
    const filename = `chapter${chapterNumber}_${Date.now()}_${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Funções auxiliares

const adicionarSaldoZero = async () => {
  try {
    const usuariosSemSaldo = await User.find({ saldo: 0 });
    if (usuariosSemSaldo.length > 0) {
      console.log(`Usuários sem saldo encontrado! Adicionando saldo...`);
      for (const usuario of usuariosSemSaldo) {
        await User.updateOne({ _id: usuario._id, saldo: 0 }, { $set: { saldo: 100 } });
        console.log(`Adicionado 100 de saldo para o usuário: ${usuario.username}`);
      }
    } else {
      console.log('Nenhum usuário sem saldo encontrado.');
    }
  } catch (error) {
    console.error("Erro ao adicionar saldo aos usuários sem saldo:", error);
  }
};

const adicionarSaldo = async (username) => {
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
};

const adicionarSaldoPix = async (username, novo) => {
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
};

const readUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    return [];
  }
};

const saveUsers = async (users) => {
  try {
    await User.deleteMany();
    await User.insertMany(users);
  } catch (error) {
    console.error('Erro ao salvar os dados no banco de dados:', error);
  }
};

const isUserBanned = async (username) => {
  try {
    const user = await User.findOne({ username, isPremium: true });
    return !!user;
  } catch (error) {
    console.error('Erro ao verificar status de banimento do usuário:', error);
    return false;
  }
};

// Middleware para verificar se o usuário está autenticado
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}


// Substitua pela sua chave de API do PostImages
const POSTIMAGES_API_KEY = 'e65af70085c92ecd489405848217cda8';

// Função para fazer upload no PostImages
async function uploadImageToPostImages(imagePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(imagePath));
  
  try {
    const response = await axios.post('https://api.postimages.org/1/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
      params: {
        key: POSTIMAGES_API_KEY,
      },
    });

    return response.data.url;  // Retorna o link direto da imagem
  } catch (error) {
    throw new Error(`Erro ao fazer upload no PostImages: ${error.message}`);
  }
}


// Rotas



//============\\

//============\\
app.get('/', async (req, res) => {
  const user = req.session.user;
  
  if (user) {
      const { username, password, verificationCode, isVerified } = user;
      const userDb = await User.findOne({ username, password });
      const userId = userDb._id;
      const mangas = await Manga.find({ userId: userId });
      const users = userDb;
      const quantidadeRegistrados = await User.countDocuments();
      const topUsers = await User.find().sort({ total: -1 }).limit(7);
      return res.render('dashboard', { user, userDb, users, topUsers, quantidade: quantidadeRegistrados, mangas });

  } else {
    return res.redirect('/login');
  }
});


app.get('/home', async (req, res) => {
  return res.redirect('/');
});


app.get('/perfil-aleatorio', async (req, res) => {
  try {
    const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
    if (randomUser.length === 0) {
      return res.status(404).send('Nenhum perfil encontrado.');
    }
    const dados = randomUser[0]
    res.render('usuario', { dados });
  } catch (error) {
    res.status(500).send('Erro ao buscar perfil aleatório: ' + error.message);
  }
});


app.get('/myperfil', async (req, res) => {
  const user = req.session.user;

  if (user) {
    const { username, password, verificationCode, isVerified } = user;


      const userDb = await User.findOne({ username, password });
      const users = userDb;
      const quantidadeRegistrados = await User.countDocuments();
      const topUsers = await User.find().sort({ total: -1 }).limit(7);
      return res.render('myperfil', { user, userDb, users, topUsers, quantidade: quantidadeRegistrados });
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
    const insta = "@clovermyt"
    const zap = "https://trevomangas.shop/"
    const yt = "https://youtube.com/@clovermods"
    const wallpaper = "https://telegra.ph/file/0f84f060434e1e4395e13.jpg"

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
    //console.log(user)
    req.session.user = user;
    res.redirect('/');

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
     // console.log(user.password, password, username)
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
  const { password, key, ft, saldo, total, isPremium, isAdm, isBaned, isVerified } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // Validação de entrada
    const isPremiumValue = isPremium === 'true';
    const isAdmValue = isAdm === 'true';
    const isBanedValue = isBaned === 'true';
    const isVerifiedValue = isVerified === 'true';
    
    // Atualize os valores
    user.password = password || user.password;
    user.key = key || user.key;
    user.ft = ft || user.ft;
    user.saldo = saldo || user.saldo;
    user.isPremium = isPremiumValue;
    user.isAdm = isAdmValue;
    user.isBaned = isBanedValue;
    user.isVerified = isVerifiedValue;
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


app.get('/loja', (req, res) => {
  const user = req.session.user;
  if (user) {
    if (user.isVerified) {
      res.sendFile(__dirname + '/views/loja.html');
    } else {
      return res.redirect('/verify');
    }
  } else {
    return res.redirect('/login');
  }
});


/// rotas de api normais \\\


/// rotas de upload \\\
app.get('/foto', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const mangas = await Manga.find({ userId: userId });
    res.render('index', { mangas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para página de upload de mangá
app.get('/foto/upload', ensureAuthenticated, (req, res) => {
  res.render('upload');
});


// Rota para upload de mangá (substituindo Telegra.ph)
app.post('/foto/upload', multer({ dest: './uploads/' }).single('cover'), async (req, res) => {
  try {
    const { name, alt_titles, author, artist, description, tags } = req.body;
    const userId = req.session.user._id;

    if (!req.file) {
      return res.status(400).json({ error: 'A capa do mangá é obrigatória' });
    }

    const coverPath = req.file.path;
    const coverUrl = await uploadImageToPostImages(coverPath);  // Faz upload no PostImages

    const newManga = new Manga({
      name,
      alt_titles: alt_titles.split(',').map(t => t.trim()),
      author,
      artist,
      description,
      tags,
      coverUrl,
      userId,
    });
    await newManga.save();

    fs.unlinkSync(coverPath);  // Remove o arquivo temporário após o upload

    res.redirect('/foto');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para upload de capítulos com imagens (substituindo Telegra.ph)
app.post('/foto/:id/uploadChapter', ensureAuthenticated, upload.array('images'), async (req, res) => {
  const user = req.session.user;
  const { username } = user;

  try {
    const mangaId = req.params.id;
    const manga = await Manga.findById(mangaId);

    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }

    if (manga.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Você não tem permissão para adicionar capítulo a este mangá' });
    }

    const { title, chapterNumber } = req.body;
    const chapterNum = Number(chapterNumber);
    if (isNaN(chapterNum)) {
      return res.status(400).json({ error: 'Número do capítulo inválido' });
    }

    const existingChapter = manga.chapters.find(chapter => chapter.chapterNumber === chapterNum);
    if (existingChapter) {
      return res.status(400).json({ error: 'Capítulo com esse número já existe' });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      const files = req.files;

      for (const file of files) {
        const imageUrl = await uploadImageToPostImages(file.path);  // Upload de cada imagem no PostImages
        images.push(imageUrl);
        fs.unlinkSync(file.path);  // Remove o arquivo temporário após o upload
      }
    }

    manga.chapters.push({ chapterNumber: chapterNum, title, images });
    adicionarSaldo(username);
    await manga.save();
    res.status(200).json({ message: 'Capítulo adicionado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao processar o upload de capítulo: ${error.message}` });
  }
});


app.get('/foto/:id', ensureAuthenticated, async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    const isOwner = manga.userId.toString() === req.session.user._id.toString();
    res.render('manga', { manga, isOwner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para adicionar imagens a um capítulo existente
app.post('/foto/:mangaId/chapters/:chapterId/uploadImages', ensureAuthenticated, upload.array('images', 50), async (req, res) => {
  const user = req.session.user;
  const { username } = user;

  try {
    const mangaId = req.params.mangaId;
    const chapterId = req.params.chapterId;

    const manga = await Manga.findById(mangaId);

    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }

    if (manga.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Você não tem permissão para adicionar imagens a este mangá' });
    }

    const chapter = manga.chapters.find(ch => ch._id.toString() === chapterId);

    if (!chapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }

    const images = [];
    const files = req.files;

    // Upload de imagens em lotes no PostImages
    for (const file of files) {
      const imageUrl = await uploadImageToPostImages(file.path);  // Faz o upload de cada imagem
      images.push(imageUrl);
      fs.unlinkSync(file.path);  // Remove o arquivo temporário após o upload
    }

    // Adiciona as novas imagens ao capítulo existente
    chapter.images.push(...images);
    adicionarSaldo(username);
    await manga.save();

    res.status(200).json({ message: 'Imagens adicionadas ao capítulo com sucesso' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao processar o upload de imagens: ${error.message}` });
  }
});


app.post('/foto/:mangaId/chapters/:chapterId/uploadImages', ensureAuthenticated, upload.array('images', 50), async (req, res) => {
  const user = req.session.user;
  const { username } = user;

  try {
    const mangaId = req.params.mangaId;
    const chapterId = req.params.chapterId;

    const manga = await Manga.findById(mangaId);

    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }

    if (manga.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Você não tem permissão para adicionar imagens a este mangá' });
    }

    const chapter = manga.chapters.find(ch => ch._id.toString() === chapterId);

    if (!chapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }

    const images = [];
    const files = req.files;

    // Função para fazer o upload em lotes
    const uploadBatch = async (batch) => {
      for (const file of batch) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));

        try {
          const response = await axios.post('https://telegra.ph/upload', formData, {
            headers: formData.getHeaders()
          });

          if (response.data && response.data[0] && response.data[0].src) {
            const imageUrl = `https://telegra.ph${response.data[0].src}`;
            images.push(imageUrl);
          } else {
            throw new Error('Falha ao fazer o upload da imagem: resposta inválida');
          }

          fs.unlinkSync(file.path);
        } catch (error) {
          throw new Error(`Erro ao processar o upload de imagens: ${error.message}`);
        }
      }
    };

    // Limitar o tamanho do lote para até 50 imagens
    const batchSize = Math.min(files.length, 50);
    const batch = files.slice(0, batchSize);
    await uploadBatch(batch);

    // Adiciona as novas imagens ao capítulo existente
    chapter.images.push(...images);
    adicionarSaldo(username);
    await manga.save();
    res.status(200).json({ message: 'Imagens adicionadas ao capítulo com sucesso' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao processar o upload de imagens: ${error.message}` });
  }
});



// Rota para deletar um mangá e todos os seus capítulos
app.get('/foto/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const mangaId = req.params.id;
    const manga = await Manga.findById(mangaId);

    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }

    if (manga.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este mangá' });
    }

    await Manga.findByIdAndDelete(mangaId);
    res.redirect('/home');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um capítulo de um mangá
app.get('/foto/:mangaId/deleteChapter/:chapterId', ensureAuthenticated, async (req, res) => {
  try {
    const { mangaId, chapterId } = req.params;
    const manga = await Manga.findById(mangaId);

    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }

    if (manga.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este capítulo' });
    }

    // Encontrando o índice do capítulo no array de capítulos
    const index = manga.chapters.findIndex(chapter => chapter._id.toString() === chapterId);

    // Verificando se o capítulo foi encontrado
    if (index === -1) {
      return res.status(400).json({ error: 'Capítulo não encontrado' });
    }

    // Removendo o capítulo do array de capítulos
    manga.chapters.splice(index, 1);

    // Salvando as alterações
    await manga.save();

    // Redirecionando apenas após a exclusão do capítulo
    res.redirect(`/foto/${mangaId}`);

  } catch (error) {
    // Lidando com erros
    res.status(500).json({ error: error.message });
  }
});

app.get('/foto/:mangaId/chapters/:chapterNumber', async (req, res) => {
  const { mangaId, chapterNumber } = req.params;

  try {
    // Buscar o manga pelo ID
    const manga = await Manga.findById(mangaId);
    const isOwner = manga.userId.toString() === req.session.user._id.toString();
    // Verificar se o manga existe
    if (!manga) {
      return res.status(404).send('Mangá não encontrado');
    }

    // Definir totalChapters como o número total de capítulos no manga
    const totalChapters = manga.chapters.length;

    // Encontrar o capítulo com o número especificado
    const selectedChapter = manga.chapters.find(chapter => chapter.chapterNumber == chapterNumber);

    // Verificar se o capítulo foi encontrado
    if (!selectedChapter) {
      return res.status(404).send('Capítulo não encontrado');
    }

    // Renderizar o template com os dados do capítulo
    res.render('chapter', { manga, isOwner, selectedChapter, totalChapters });

  } catch (error) {
    console.error('Erro ao buscar os dados do capítulo:', error);
    return res.status(500).send('Erro interno do servidor');
  }
});


app.get('/audio', async (req, res) => {
  try {
    const audioId = `https://files.catbox.moe/a2ndkj.mp3`;
    const audioUrl = `https://files.catbox.moe/a2ndkj.mp3`;


    const audioResponse = await axios.get(audioUrl, {
      responseType: 'stream'
    });

    // Define os cabeçalhos de resposta para o tipo de conteúdo e outros cabeçalhos necessários
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="audio.mp3"' // Define um nome de arquivo para o áudio
    });

    // Transmite o áudio de volta como resposta
    audioResponse.data.pipe(res);
  } catch (error) {
    console.error('Erro ao processar o áudio:', error);
    return res.status(500).json({ error: 'Erro ao processar o áudio' });
  }
});


// API para obter todos os Catálogos 
app.get('/all', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
    try {
      const dados = await User.findOne({ username });
      const userId = dados._id;
      const mangas = await Manga.find({ userId: userId });
      res.json(mangas)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    return res.sendFile(htmlPath);
  }
});

// pega um capítulo específico 
app.get('/catalogo/:mangaId/chapters/:chapterNumber', async (req, res) => {
  const { mangaId, chapterNumber } = req.params;
  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }
    const selectedChapter = manga.chapters.find(chapter => chapter.chapterNumber == chapterNumber);
    if (!selectedChapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }

    // Mapeia as URLs das imagens para o novo formato
    const baseUrl = 'https://anikit-apis.onrender.com/imagem';
    const mappedImages = selectedChapter.images.map((_, index) => `${baseUrl}/${mangaId}/chapters/${chapterNumber}/${index}`);

    // Cria um novo objeto para incluir as URLs mapeadas
    const responseChapter = {
      chapterNumber: selectedChapter.chapterNumber,
      title: selectedChapter.title,
      images: mappedImages, 
      _id: selectedChapter._id
    };

    res.json(responseChapter);
  } catch (error) {
    console.error('Erro ao buscar os dados do capítulo:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// pega os capítulos de um catalogo específico 
app.get('/catalogo/:mangaId', async (req, res) => {
  const { mangaId } = req.params;
  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }
    const selectedChapter = manga.chapters
    res.json(selectedChapter);
  } catch (error) {
    console.error('Erro ao buscar os dados dos capítulos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// pega uma foto do capítulo específico 
app.get('/imagem/:mangaId/chapters/:chapterNumber/:fotoNumber', async (req, res) => {
  const { mangaId, chapterNumber, fotoNumber } = req.params;
  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ error: 'Mangá não encontrado' });
    }
    const selectedChapter = manga.chapters.find(chapter => chapter.chapterNumber == chapterNumber);
    if (!selectedChapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }
    const imageUrl = selectedChapter.images[fotoNumber];
    if (!imageUrl) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    const imagePath = path.join(__dirname, 'clover.jpeg');
    const response = await axios({
      url: imageUrl,
      responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(imagePath));
    response.data.on('end', () => {
      res.sendFile(imagePath, (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo:', err);
          res.status(500).json({ error: 'Erro interno do servidor' });
        }
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Erro ao deletar a imagem temporária:', err);
        });
      });
    });
    response.data.on('error', (err) => {
      console.error('Erro ao baixar a imagem:', err);
      res.status(500).json({ error: 'Erro ao baixar a imagem' });
    });
  } catch (error) {
    console.error('Erro ao buscar os dados do capítulo:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/latest-mangas', async (req, res) => {
  const { username, key } = req.query;
  try {
    const user = await User.findOne({ username, key });
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.isBaned === true) {
      return res.status(403).send('User is banned');
    }
    const latestMangas = await Manga.aggregate([
      { $match: { userId: user._id } }, 
      { $unwind: '$chapters' }, 
      { $sort: { 'chapters.dateAdded': -1 } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          coverUrl: { $first: '$coverUrl' },
          latestChapter: { $first: '$chapters' }
        }
      }, 
      { $sort: { 'latestChapter.dateAdded': -1 } }, 
      { $limit: 10 } 
    ]);

    res.status(200).json(latestMangas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/pagar', async (req, res) => {
  const user = req.session.user;
  if (user) {
    if (user.isVerified) {
      try {
        let { valor } = req.query;
        valor = parseFloat(valor).toFixed(2);
        const transactionAmount = parseFloat(valor);
        const novosaldo = transactionAmount * 1000;
        const payment_data = {
          transaction_amount: transactionAmount,
          description: `Saldo AniKit`,
          payment_method_id: 'pix',
          payer: {
            email: user.email,
            first_name: 'Nome do Pagador',
          }
        };
        const data = await mercadopago.payment.create(payment_data);
        const qrcode = data.body.point_of_interaction.transaction_data.qr_code_base64;
        const paymentLink = data.body.point_of_interaction.transaction_data.ticket_url;
        const paymentId = data.body.id;
        const valorpagar = valor;
        const codigo = data.body.point_of_interaction.transaction_data.qr_code;
        return res.render('info', { username: user.username, qrcode, codigo, paymentId, paymentLink, valorpagar, novosaldo });
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

app.get('/cpremium', async (req, res) => {
  const user = req.session.user;
  if (user) {
    if (user.isVerified) {
      try {
        let { valor } = req.query;
        valor = parseFloat(valor).toFixed(2);
        const transactionAmount = parseFloat(valor);
        const novosaldo = 15000;
        const payment_data = {
          transaction_amount: transactionAmount,
          description: `Saldo AniKit`,
          payment_method_id: 'pix',
          payer: {
            email: user.email,
            first_name: 'Nome do Pagador',
          }
        };
        const data = await mercadopago.payment.create(payment_data);
        const qrcode = data.body.point_of_interaction.transaction_data.qr_code_base64;
        const paymentLink = data.body.point_of_interaction.transaction_data.ticket_url;
        const paymentId = data.body.id;
        const valorpagar = valor;
        const codigo = data.body.point_of_interaction.transaction_data.qr_code;
        return res.render('cpremium', { username: user.username, qrcode, codigo, paymentId, paymentLink, valorpagar, novosaldo });
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

app.get('/confirmarPagamento/:paymentId/:username', async (req, res) => {
  const paymentId = req.params.paymentId;
  const username = req.params.username;
  const timeout = Infinity;
  let isPaymentConfirmed = false;
  const startTime = Date.now();
  while (!isPaymentConfirmed && Date.now() - startTime < timeout) {
    const paymentResponse = await mercadopago.payment.get(paymentId);
    const pagamentoStatus = paymentResponse.body.status;

    if (pagamentoStatus === 'approved') {
      try {
        const usuario = await User.findOne({ username });
        usuario.isPremium = true;
        await usuario.save();
        console.log(`🎉 ${username} agora é um usuário Premium.`);
      } catch (error) {
        console.error('❌ Erro ao atualizar o status de Premium:', error);
      }
      isPaymentConfirmed = true;
    } else {
      console.log('Pagamento ainda não aprovado:', pagamentoStatus);
    }

    if (!isPaymentConfirmed) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (isPaymentConfirmed) {
    return res.redirect('/perfil');
  } else {
    console.log('⏰ Tempo limite atingido sem confirmação de pagamento.');
    return res.status(500).send('Tempo limite atingido sem confirmação de pagamento.');
  }
});

app.get('/addSaldoPix/:paymentId/:username/:novosaldo', async (req, res) => {
  const paymentId = req.params.paymentId;
  const username = req.params.username;
  const novosaldo = req.params.novosaldo;
  const timeout = Infinity;
  let isPaymentConfirmed = false;
  const startTime = Date.now();
  while (!isPaymentConfirmed && Date.now() - startTime < timeout) {
    const paymentResponse = await mercadopago.payment.get(paymentId);
    const pagamentoStatus = paymentResponse.body.status;

    if (pagamentoStatus === 'approved') {
      console.log('✅ Pagamento aprovado com sucesso!');
      await adicionarSaldoPix(username, novosaldo);
      console.log(username, novosaldo);
      isPaymentConfirmed = true;
    } else {
      console.log('Pagamento ainda não aprovado:', pagamentoStatus);
    }

    if (!isPaymentConfirmed) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (isPaymentConfirmed) {
    return res.redirect('/perfil');
  } else {
    console.log('⏰ Tempo limite atingido sem confirmação de pagamento.');
    return res.status(500).send('Tempo limite atingido sem confirmação de pagamento.');
  }
});


/// rotas normais \\\


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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
    /*
        const ahegao = JSON.parse(fs.readFileSync(__dirname + '/data/ahegao.json'));
        const randahegao = ahegao[Math.floor(Math.random() * ahegao.length)];
    
        res.json({
          url: `${randahegao}`
        })
        */
    fetch('https://nekos.life/api/hug').then(data => data.json()).then(data => {
      res.json({
        url: `${data.url}`
      })
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const ass = JSON.parse(fs.readFileSync(__dirname + '/data/ass.json'));
    const randass = ass[Math.floor(Math.random() * ass.length)];

    res.json({
      url: `${randass}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const bdsm = JSON.parse(fs.readFileSync(__dirname + '/data/bdsm.json'));
    const randbdsm = bdsm[Math.floor(Math.random() * bdsm.length)];

    res.json({
      url: `${randbdsm}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const blowjob = JSON.parse(fs.readFileSync(__dirname + '/data/blowjob.json'));
    const randblowjob = blowjob[Math.floor(Math.random() * blowjob.length)];

    res.json({
      url: `${randblowjob}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const cuckold = JSON.parse(fs.readFileSync(__dirname + '/data/cuckold.json'));
    const randcuckold = cuckold[Math.floor(Math.random() * cuckold.length)];

    res.json({
      url: `${randcuckold}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const cum = JSON.parse(fs.readFileSync(__dirname + '/data/cum.json'));
    const randcum = cum[Math.floor(Math.random() * cum.length)];

    res.json({
      url: `${randcum}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const ero = JSON.parse(fs.readFileSync(__dirname + '/data/ero.json'));
    const randero = ero[Math.floor(Math.random() * ero.length)];

    res.json({
      url: `${randero}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/memes-video.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const femdom = JSON.parse(fs.readFileSync(__dirname + '/data/femdom.json'));
    const randfemdom = femdom[Math.floor(Math.random() * femdom.length)];

    res.json({
      url: `${randfemdom}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const foot = JSON.parse(fs.readFileSync(__dirname + '/data/foot.json'));
    const randfoot = foot[Math.floor(Math.random() * foot.length)];

    res.json({
      url: `${randfoot}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const gangbang = JSON.parse(fs.readFileSync(__dirname + '/data/gangbang.json'));
    const randgangbang = gangbang[Math.floor(Math.random() * gangbang.length)];

    res.json({
      url: `${randgangbang}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const glasses = JSON.parse(fs.readFileSync(__dirname + '/data/glasses.json'));
    const randglasses = glasses[Math.floor(Math.random() * glasses.length)];

    res.json({
      url: `${randglasses}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const hentai = JSON.parse(fs.readFileSync(__dirname + '/data/hentai.json'));
    const randhentai = hentai[Math.floor(Math.random() * hentai.length)];

    res.json({
      url: `${randhentai}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const gifs = JSON.parse(fs.readFileSync(__dirname + '/data/gifs.json'));
    const randgifs = gifs[Math.floor(Math.random() * gifs.length)];

    res.json({
      url: `${randgifs}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const jahy = JSON.parse(fs.readFileSync(__dirname + '/data/jahy.json'));
    const randjahy = jahy[Math.floor(Math.random() * jahy.length)];

    res.json({
      url: `${randjahy}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const manga = JSON.parse(fs.readFileSync(__dirname + '/data/manga.json'));
    const randmanga = manga[Math.floor(Math.random() * manga.length)];

    res.json({
      url: `${randmanga}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const masturbation = JSON.parse(fs.readFileSync(__dirname + '/data/masturbation.json'));
    const randmasturbation = masturbation[Math.floor(Math.random() * masturbation.length)];

    res.json({
      url: `${randmasturbation}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const neko = JSON.parse(fs.readFileSync(__dirname + '/data/neko.json'));
    const randneko = neko[Math.floor(Math.random() * neko.length)];

    res.json({
      url: `${randneko}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const orgy = JSON.parse(fs.readFileSync(__dirname + '/data/orgy.json'));
    const randorgy = orgy[Math.floor(Math.random() * orgy.length)];

    res.json({
      url: `${randorgy}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const panties = JSON.parse(fs.readFileSync(__dirname + '/data/panties.json'));
    const randpanties = panties[Math.floor(Math.random() * panties.length)];

    res.json({
      url: `${randpanties}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const pussy = JSON.parse(fs.readFileSync(__dirname + '/data/pussy.json'));
    const randpussy = pussy[Math.floor(Math.random() * pussy.length)];

    res.json({
      url: `${randpussy}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const neko2 = JSON.parse(fs.readFileSync(__dirname + '/data/neko2.json'));
    const randneko2 = neko2[Math.floor(Math.random() * neko2.length)];

    res.json({
      url: `${randneko2}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const tentacles = JSON.parse(fs.readFileSync(__dirname + '/data/tentacles.json'));
    const randtentacles = tentacles[Math.floor(Math.random() * tentacles.length)];

    res.json({
      url: `${randtentacles}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const thighs = JSON.parse(fs.readFileSync(__dirname + '/data/thighs.json'));
    const randthighs = thighs[Math.floor(Math.random() * thighs.length)];

    res.json({
      url: `${randthighs}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const yuri = JSON.parse(fs.readFileSync(__dirname + '/data/yuri.json'));
    const randyuri = yuri[Math.floor(Math.random() * yuri.length)];

    res.json({
      url: `${randyuri}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const zettai = JSON.parse(fs.readFileSync(__dirname + '/data/zettai.json'));
    const randzettai = zettai[Math.floor(Math.random() * zettai.length)];

    res.json({
      url: `${randzettai}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const keneki = JSON.parse(fs.readFileSync(__dirname + '/data/keneki.json'));
    const randkeneki = keneki[Math.floor(Math.random() * keneki.length)];

    res.json({
      url: `${randkeneki}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const megumin = JSON.parse(fs.readFileSync(__dirname + '/data/megumin.json'));
    const randmegumin = megumin[Math.floor(Math.random() * megumin.length)];

    res.json({
      url: `${randmegumin}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const yotsuba = JSON.parse(fs.readFileSync(__dirname + '/data/yotsuba.json'));
    const randyotsuba = yotsuba[Math.floor(Math.random() * yotsuba.length)];

    res.json({
      url: `${randyotsuba}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shinomiya = JSON.parse(fs.readFileSync(__dirname + '/data/shinomiya.json'));
    const randshinomiya = shinomiya[Math.floor(Math.random() * shinomiya.length)];

    res.json({
      url: `${randshinomiya}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const yumeko = JSON.parse(fs.readFileSync(__dirname + '/data/yumeko.json'));
    const randyumeko = yumeko[Math.floor(Math.random() * yumeko.length)];

    res.json({
      url: `${randyumeko}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const tejina = JSON.parse(fs.readFileSync(__dirname + '/data/tejina.json'));
    const randtejina = tejina[Math.floor(Math.random() * tejina.length)];

    res.json({
      url: `${randtejina}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const chiho = JSON.parse(fs.readFileSync(__dirname + '/data/chiho.json'));
    const randchiho = chiho[Math.floor(Math.random() * chiho.length)];

    res.json({
      url: `${randchiho}`
    })
  } else {
    return res.sendFile(htmlPath);
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

  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const vid = require("./data/pack.js")
    const video_18 = vid.video_18
    const danvid = video_18[Math.floor(Math.random() * video_18.length)];

    res.json({
      url: `${danvid}`
    })
  } else {
    return res.sendFile(htmlPath);
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

  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const tra = require("./data/pack.js")
    const travazap = tra.travazap
    const traft = travazap[Math.floor(Math.random() * travazap.length)];

    res.json({
      url: `${traft}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const toukachan = JSON.parse(fs.readFileSync(__dirname + '/data/toukachan.json'));
    const randtoukachan = toukachan[Math.floor(Math.random() * toukachan.length)];

    res.json({
      url: `${randtoukachan}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const akira = JSON.parse(fs.readFileSync(__dirname + '/data/akira.json'));
    const randakira = akira[Math.floor(Math.random() * akira.length)];

    res.json({
      url: `${randakira}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const itori = JSON.parse(fs.readFileSync(__dirname + '/data/itori.json'));
    const randitori = itori[Math.floor(Math.random() * itori.length)];

    res.json({
      url: `${randitori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kurumi = JSON.parse(fs.readFileSync(__dirname + '/data/kurumi.json'));
    const randkurumi = kurumi[Math.floor(Math.random() * kurumi.length)];

    res.json({
      url: `${randkurumi}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const miku = JSON.parse(fs.readFileSync(__dirname + '/data/miku.json'));
    const randmiku = miku[Math.floor(Math.random() * miku.length)];

    res.json({
      url: `${randmiku}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const pokemon = JSON.parse(fs.readFileSync(__dirname + '/data/pokemon.json'));
    const randpokemon = pokemon[Math.floor(Math.random() * pokemon.length)];

    res.json({
      url: `${randpokemon}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const ryujin = JSON.parse(fs.readFileSync(__dirname + '/data/ryujin.json'));
    const randryujin = ryujin[Math.floor(Math.random() * ryujin.length)];

    res.json({
      url: `${randryujin}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const rose = JSON.parse(fs.readFileSync(__dirname + '/data/rose.json'));
    const randrose = rose[Math.floor(Math.random() * rose.length)];

    res.json({
      url: `${randrose}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kaori = JSON.parse(fs.readFileSync(__dirname + '/data/kaori.json'));
    const randkaori = kaori[Math.floor(Math.random() * kaori.length)];

    res.json({
      url: `${randkaori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shizuka = JSON.parse(fs.readFileSync(__dirname + '/data/shizuka.json'));
    const randshizuka = shizuka[Math.floor(Math.random() * shizuka.length)];

    res.json({
      url: `${randshizuka}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kaga = JSON.parse(fs.readFileSync(__dirname + '/data/kaga.json'));
    const randkaga = kaga[Math.floor(Math.random() * kaga.length)];

    res.json({
      url: `${randkaga}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kotori = JSON.parse(fs.readFileSync(__dirname + '/data/kotori.json'));
    const randkotori = kotori[Math.floor(Math.random() * kotori.length)];

    res.json({
      url: `${randkotori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const mikasa = JSON.parse(fs.readFileSync(__dirname + '/data/mikasa.json'));
    const randmikasa = mikasa[Math.floor(Math.random() * mikasa.length)];

    res.json({
      url: `${randmikasa}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const akiyama = JSON.parse(fs.readFileSync(__dirname + '/data/akiyama.json'));
    const randakiyama = akiyama[Math.floor(Math.random() * akiyama.length)];

    res.json({
      url: `${randakiyama}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const gremory = JSON.parse(fs.readFileSync(__dirname + '/data/gremory.json'));
    const randgremory = gremory[Math.floor(Math.random() * gremory.length)];

    res.json({
      url: `${randgremory}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const isuzu = JSON.parse(fs.readFileSync(__dirname + '/data/isuzu.json'));
    const randisuzu = isuzu[Math.floor(Math.random() * isuzu.length)];

    res.json({
      url: `${randisuzu}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const cosplay = JSON.parse(fs.readFileSync(__dirname + '/data/cosplay.json'));
    const randcosplay = cosplay[Math.floor(Math.random() * cosplay.length)];

    res.json({
      url: `${randcosplay}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shina = JSON.parse(fs.readFileSync(__dirname + '/data/shina.json'));
    const randshina = shina[Math.floor(Math.random() * shina.length)];

    res.json({
      url: `${randshina}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kagura = JSON.parse(fs.readFileSync(__dirname + '/data/kagura.json'));
    const randkagura = kagura[Math.floor(Math.random() * kagura.length)];

    res.json({
      url: `${randkagura}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shinka = JSON.parse(fs.readFileSync(__dirname + '/data/shinka.json'));
    const randshinka = shinka[Math.floor(Math.random() * shinka.length)];

    res.json({
      url: `${randshinka}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const eba = JSON.parse(fs.readFileSync(__dirname + '/data/eba.json'));
    const randeba = eba[Math.floor(Math.random() * eba.length)];

    res.json({
      url: `${randeba}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Deidara = JSON.parse(fs.readFileSync(__dirname + '/data/deidara.json'));
    const randDeidara = Deidara[Math.floor(Math.random() * Deidara.length)];

    res.json({
      url: `${randDeidara}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const jeni = JSON.parse(fs.readFileSync(__dirname + '/data/jeni.json'));
    const randjeni = jeni[Math.floor(Math.random() * jeni.length)];

    res.json({
      url: `${randjeni}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/meme.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const toukachan = JSON.parse(fs.readFileSync(__dirname + '/data/toukachan.json'));
    const randtoukachan = toukachan[Math.floor(Math.random() * toukachan.length)];

    res.json({
      url: `${randtoukachan}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const akira = JSON.parse(fs.readFileSync(__dirname + '/data/akira.json'));
    const randakira = akira[Math.floor(Math.random() * akira.length)];

    res.json({
      url: `${randakira}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const itori = JSON.parse(fs.readFileSync(__dirname + '/data/itori.json'));
    const randitori = itori[Math.floor(Math.random() * itori.length)];

    res.json({
      url: `${randitori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kurumi = JSON.parse(fs.readFileSync(__dirname + '/data/kurumi.json'));
    const randkurumi = kurumi[Math.floor(Math.random() * kurumi.length)];

    res.json({
      url: `${randkurumi}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const miku = JSON.parse(fs.readFileSync(__dirname + '/data/miku.json'));
    const randmiku = miku[Math.floor(Math.random() * miku.length)];

    res.json({
      url: `${randmiku}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const pokemon = JSON.parse(fs.readFileSync(__dirname + '/data/pokemon.json'));
    const randpokemon = pokemon[Math.floor(Math.random() * pokemon.length)];

    res.json({
      url: `${randpokemon}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const ryujin = JSON.parse(fs.readFileSync(__dirname + '/data/ryujin.json'));
    const randryujin = ryujin[Math.floor(Math.random() * ryujin.length)];

    res.json({
      url: `${randryujin}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const rose = JSON.parse(fs.readFileSync(__dirname + '/data/rose.json'));
    const randrose = rose[Math.floor(Math.random() * rose.length)];

    res.json({
      url: `${randrose}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kaori = JSON.parse(fs.readFileSync(__dirname + '/data/kaori.json'));
    const randkaori = kaori[Math.floor(Math.random() * kaori.length)];

    res.json({
      url: `${randkaori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shizuka = JSON.parse(fs.readFileSync(__dirname + '/data/shizuka.json'));
    const randshizuka = shizuka[Math.floor(Math.random() * shizuka.length)];

    res.json({
      url: `${randshizuka}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kaga = JSON.parse(fs.readFileSync(__dirname + '/data/kaga.json'));
    const randkaga = kaga[Math.floor(Math.random() * kaga.length)];

    res.json({
      url: `${randkaga}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kotori = JSON.parse(fs.readFileSync(__dirname + '/data/kotori.json'));
    const randkotori = kotori[Math.floor(Math.random() * kotori.length)];

    res.json({
      url: `${randkotori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const mikasa = JSON.parse(fs.readFileSync(__dirname + '/data/mikasa.json'));
    const randmikasa = mikasa[Math.floor(Math.random() * mikasa.length)];

    res.json({
      url: `${randmikasa}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const akiyama = JSON.parse(fs.readFileSync(__dirname + '/data/akiyama.json'));
    const randakiyama = akiyama[Math.floor(Math.random() * akiyama.length)];

    res.json({
      url: `${randakiyama}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const gremory = JSON.parse(fs.readFileSync('./data/gremory.json'));
    const randgremory = gremory[Math.floor(Math.random() * gremory.length)];
    console.log(randgremory)
    res.json({
      url: `${randgremory}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const isuzu = JSON.parse(fs.readFileSync(__dirname + '/data/isuzu.json'));
    const randisuzu = isuzu[Math.floor(Math.random() * isuzu.length)];

    res.json({
      url: `${randisuzu}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const cosplay = JSON.parse(fs.readFileSync(__dirname + '/data/cosplay.json'));
    const randcosplay = cosplay[Math.floor(Math.random() * cosplay.length)];

    res.json({
      url: `${randcosplay}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shina = JSON.parse(fs.readFileSync(__dirname + '/data/shina.json'));
    const randshina = shina[Math.floor(Math.random() * shina.length)];

    res.json({
      url: `${randshina}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const kagura = JSON.parse(fs.readFileSync(__dirname + '/data/kagura.json'));
    const randkagura = kagura[Math.floor(Math.random() * kagura.length)];

    res.json({
      url: `${randkagura}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const shinka = JSON.parse(fs.readFileSync(__dirname + '/data/shinka.json'));
    const randshinka = shinka[Math.floor(Math.random() * shinka.length)];

    res.json({
      url: `${randshinka}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const eba = JSON.parse(fs.readFileSync(__dirname + '/data/eba.json'));
    const randeba = eba[Math.floor(Math.random() * eba.length)];

    res.json({
      url: `${randeba}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Deidara = JSON.parse(fs.readFileSync(__dirname + '/data/deidara.json'));
    const randDeidara = Deidara[Math.floor(Math.random() * Deidara.length)];

    res.json({
      url: `${randDeidara}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const jeni = JSON.parse(fs.readFileSync(__dirname + '/data/jeni.json'));
    const randjeni = jeni[Math.floor(Math.random() * jeni.length)];

    res.json({
      url: `${randjeni}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const meme = JSON.parse(fs.readFileSync(__dirname + '/data/meme.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const satanic = JSON.parse(fs.readFileSync(__dirname + '/data/satanic.json'));
    const randsatanic = satanic[Math.floor(Math.random() * satanic.length)];

    res.json({
      url: `${randsatanic}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Itachi = JSON.parse(fs.readFileSync(__dirname + '/data/itachi.json'));
    const randItachi = Itachi[Math.floor(Math.random() * Itachi.length)];

    res.json({
      url: `${randItachi}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Madara = JSON.parse(fs.readFileSync(__dirname + '/data/madara.json'));
    const randMadara = Madara[Math.floor(Math.random() * Madara.length)];

    res.json({
      url: `${randMadara}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Yuki = JSON.parse(fs.readFileSync(__dirname + '/data/yuki.json'));
    const randYuki = Yuki[Math.floor(Math.random() * Yuki.length)];

    res.json({
      url: `${randYuki}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const asuna = JSON.parse(fs.readFileSync(__dirname + '/data/asuna.json'));
    const randasuna = asuna[Math.floor(Math.random() * asuna.length)];

    res.json({
      url: `${randasuna}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const ayuzawa = JSON.parse(fs.readFileSync(__dirname + '/data/ayuzawa.json'));
    const randayuzawa = ayuzawa[Math.floor(Math.random() * ayuzawa.length)];

    res.json({
      url: `${randayuzawa}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const chitoge = JSON.parse(fs.readFileSync(__dirname + '/data/chitoge.json'));
    const randchitoge = chitoge[Math.floor(Math.random() * chitoge.length)];

    res.json({
      url: `${randchitoge}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const emilia = JSON.parse(fs.readFileSync(__dirname + '/data/emilia.json'));
    const randemilia = emilia[Math.floor(Math.random() * emilia.length)];
    console.log(randemilia)
    res.json({
      url: `${randemilia}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const hestia = JSON.parse(fs.readFileSync(__dirname + '/data/hestia.json'));
    const randhestia = hestia[Math.floor(Math.random() * hestia.length)];

    res.json({
      url: `${randhestia}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const inori = JSON.parse(fs.readFileSync(__dirname + '/data/inori.json'));
    const randinori = inori[Math.floor(Math.random() * inori.length)];

    res.json({
      url: `${randinori}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const ana = JSON.parse(fs.readFileSync(__dirname + '/data/ana.json'));
    const randana = ana[Math.floor(Math.random() * ana.length)];

    res.json({
      url: `${randana}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Boruto = JSON.parse(fs.readFileSync(__dirname + '/data/boruto.json'));
    const randBoruto = Boruto[Math.floor(Math.random() * Boruto.length)];

    res.json({
      url: `${randBoruto}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Erza = JSON.parse(fs.readFileSync(__dirname + '/data/erza.json'));
    const randErza = Erza[Math.floor(Math.random() * Erza.length)];

    res.json({
      url: `${randErza}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Kakasih = JSON.parse(fs.readFileSync(__dirname + '/data/kakasih.json'));
    const randKakasih = Kakasih[Math.floor(Math.random() * Kakasih.length)];

    res.json({
      url: `${randKakasih}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Sagiri = JSON.parse(fs.readFileSync(__dirname + '/data/sagiri.json'));
    const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];

    res.json({
      url: `${randSagiri}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Minato = JSON.parse(fs.readFileSync(__dirname + '/data/minato.json'));
    const randMinato = Minato[Math.floor(Math.random() * Minato.length)];

    res.json({
      url: `${randMinato}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Naruto = JSON.parse(fs.readFileSync(__dirname + '/data/naruto.json'));
    const randNaruto = Naruto[Math.floor(Math.random() * Naruto.length)];

    res.json({
      url: `${randNaruto}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Nezuko = JSON.parse(fs.readFileSync(__dirname + '/data/nezuko.json'));
    const randNezuko = Nezuko[Math.floor(Math.random() * Nezuko.length)];

    res.json({
      url: `${randNezuko}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Pic = JSON.parse(fs.readFileSync(__dirname + '/data/onepiece.json'));
    const randPic = Pic[Math.floor(Math.random() * Pic.length)];

    res.json({
      url: `${randPic}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Rize = JSON.parse(fs.readFileSync(__dirname + '/data/rize.json'));
    const randRize = Rize[Math.floor(Math.random() * Rize.length)];

    res.json({
      url: `${randRize}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Sakura = JSON.parse(fs.readFileSync(__dirname + '/data/sakura.json'));
    const randSakura = Sakura[Math.floor(Math.random() * Sakura.length)];

    res.json({
      url: `${randSakura}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Sasuke = JSON.parse(fs.readFileSync(__dirname + '/data/sasuke.json'));
    const randSasuke = Sasuke[Math.floor(Math.random() * Sasuke.length)];

    res.json({
      url: `${randSasuke}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Su = JSON.parse(fs.readFileSync(__dirname + '/data/tsunade.json'));
    const randSu = Su[Math.floor(Math.random() * Su.length)];

    res.json({
      url: `${randSu}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Mon = JSON.parse(fs.readFileSync(__dirname + '/data/montor.json'));
    const randMon = Mon[Math.floor(Math.random() * Mon.length)];

    res.json({
      url: `${randMon}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Mob = JSON.parse(fs.readFileSync(__dirname + '/data/mobil.json'));
    const randMob = Mob[Math.floor(Math.random() * Mob.length)];

    res.json({
      url: `${randMob}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Wai23 = JSON.parse(fs.readFileSync(__dirname + '/data/wallhp2.json'));
    const randWai23 = Wai23[Math.floor(Math.random() * Wai23.length)];

    res.json({
      url: `${randWai23}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Wai22 = JSON.parse(fs.readFileSync(__dirname + '/data/wallhp.json'));
    const randWai22 = Wai22[Math.floor(Math.random() * Wai22.length)];

    res.json({
      url: `${randWai22}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Wai2 = JSON.parse(fs.readFileSync(__dirname + '/data/waifu2.json'));
    const randWai2 = Wai2[Math.floor(Math.random() * Wai2.length)];

    res.json({
      url: `${randWai2}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Wai = JSON.parse(fs.readFileSync(__dirname + '/data/waifu.json'));
    const randWai = Wai[Math.floor(Math.random() * Wai.length)];

    res.json({
      url: `${randWai}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    Hekel = JSON.parse(fs.readFileSync(__dirname + '/data/hekel.json'));
    const randHekel = Hekel[Math.floor(Math.random() * Hekel.length)]

    res.json({
      url: `${randHekel}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    Kucing = JSON.parse(fs.readFileSync(__dirname + '/data/kucing.json'));
    const randKucing = Kucing[Math.floor(Math.random() * Kucing.length)]

    res.json({
      url: `${randKucing}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    Pubg = JSON.parse(fs.readFileSync(__dirname + '/data/pubg.json'));
    const randPubg = Pubg[Math.floor(Math.random() * Pubg.length)]

    res.json({
      url: `${randPubg}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    Pp = JSON.parse(fs.readFileSync(__dirname + '/data/profil.json'));
    const randPp = Pp[Math.floor(Math.random() * Pp.length)]

    res.json({
      url: `${randPp}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    Anjing = JSON.parse(fs.readFileSync(__dirname + '/data/anjing.json'));
    const randAnjing = Anjing[Math.floor(Math.random() * Anjing.length)]

    res.json({
      url: `${randAnjing}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    Dora = JSON.parse(fs.readFileSync(__dirname + '/data/doraemon.json'));
    const randDora = Dora[Math.floor(Math.random() * Dora.length)]

    res.json({
      url: `${randDora}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Elaina = JSON.parse(fs.readFileSync(__dirname + '/data/elaina.json'))
    const randElaina = Elaina[Math.floor(Math.random() * Elaina.length)]
    //tansole.log(randLoli)

    res.json({
      url: `${randElaina}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Loli = JSON.parse(fs.readFileSync(__dirname + '/data/loli.json'))
    const randLoli = Loli[Math.floor(Math.random() * Loli.length)]
    //tansole.log(randLoli)

    res.json({
      url: `${randLoli}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Yuri = JSON.parse(fs.readFileSync(__dirname + '/data/yuri.json'))
    const randYuri = Yuri[Math.floor(Math.random() * Yuri.length)]
    //tansole.log(randTech))
    res.json({
      url: `${randYuri}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const cecan = JSON.parse(fs.readFileSync(__dirname + '/data/cecan.json'));
    const randCecan = cecan[Math.floor(Math.random() * cecan.length)];
    //data = await fetch(randCecan).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/cecan.jpeg', data)
    res.json({
      url: `${randCecan}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Aesthetic = JSON.parse(fs.readFileSync(__dirname + '/data/aesthetic.json'));
    const randAesthetic = Aesthetic[Math.floor(Math.random() * Aesthetic.length)];
    //data = await fetch(randAesthetic).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/aesthetic.jpeg', data)
    res.json({
      url: `${randAesthetic}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Sagiri = JSON.parse(fs.readFileSync(__dirname + '/data/sagiri.json'));
    const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];
    //data = await fetch(randSagiri).then(v => v.buffer())
    //await fs.writeFileSync(__dirname + '/tmp/sagiri.jpeg', data)
    res.json({
      url: `${randSagiri}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Shota = JSON.parse(fs.readFileSync(__dirname + '/data/shota.json'));
    const randShota = Shota[Math.floor(Math.random() * Shota.length)];
    //data = await fetch(randShota).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/shota.jpeg', data)
    res.json({
      url: `${randShota}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Lol = JSON.parse(fs.readFileSync(__dirname + '/data/nsfwloli.json'));
    const randLol = Lol[Math.floor(Math.random() * Lol.length)];
    //data = await fetch(randLol).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/lol.jpeg', data)
    res.json({
      url: `${randLol}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const Hinata = JSON.parse(fs.readFileSync(__dirname + '/data/hinata.json'));
    const randHin = Hinata[Math.floor(Math.random() * Hinata.length)];
    //data = await fetch(randHin).then(v => v.buffer());
    //await fs.writeFileSync(__dirname + '/tmp/Hinata.jpeg', data)
    res.json({
      url: `${randHin}`
    })
  } else {
    return res.sendFile(htmlPath);
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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


  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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

  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const vid = require("./data/pack.js")
    const video_18 = vid.video_18
    const danvid = video_18[Math.floor(Math.random() * video_18.length)];

    res.json({
      url: `${danvid}`
    })
  } else {
    return res.sendFile(htmlPath);
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

  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const tra = require("./data/pack.js")
    const travazap = tra.travazap
    const traft = travazap[Math.floor(Math.random() * travazap.length)];

    res.json({
      url: `${traft}`
    })
  } else {
    return res.sendFile(htmlPath);
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

  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const tra = require("./data/pack.js")
    const foto_18 = tra.foto_18
    const traft = foto_18[Math.floor(Math.random() * foto_18.length)];

    res.json({
      url: `${traft}`
    })
  } else {
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
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
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

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
    return res.sendFile(htmlPath);
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
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
    const username = req.query.nick || 'clover';
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
  } else {
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const appName = req.query.appName;
    const result = await playStoreSearch(appName);
    res.json(result);

  } else {
    return res.sendFile(htmlPath);
  }
});


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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const result = await fraseAmor();
    res.json(result);

  } else {
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const result = await frasesPensador();
    res.json(result);

  } else {
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {

    const text = req.query.text;
    const result = await styletext(text);
    res.json(result);

  } else {
    return res.sendFile(htmlPath);
  }
});

// fim do attp 
app.get('/cardgame', async (req, res) => {
  const { username, key } = req.query;
  const users = Person
  const user = await User.findOne({ username, key });
  if (!user) {
    return res.sendFile(htmlPath);
  }
  if (user.isBaned === true) {
    return res.sendFile(htmlPath);
  }
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
    const { foto, atk, def, legenda, nick } = req.query
    try {
      // Tamanho da thumbnail
      const width = 400;
      const height = 580;

      // Criar o canvas
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Carregar a imagem de fundo a partir do link fornecido (ou use uma imagem padrão se nenhum link for fornecido)
      const backgroundImageURL = req.query.background || 'https://telegra.ph/file/08ded60bd97d0550f722c.png';
      const backgroundImage = await loadImage(backgroundImageURL);
      const fotoimage = await loadImage(foto || 'https://i.pinimg.com/550x/1a/46/23/1a4623024e77ca419b01f00c12cd245d.jpg');

      ctx.drawImage(backgroundImage, 0, 0, width, height);
      ctx.drawImage(fotoimage, 46, 121, 300, 300);

      ctx.fillStyle = '#000000'; // preto
      ctx.font = '20px Arial';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000'; // vermelho
      ctx.fillText(nick || 'Clover Mods', 100, 55);
      ctx.fillStyle = '#000000'; // preto
      ctx.font = '19px Arial';
      const lines = (legenda || 'Um mago de grande poder... \nporem tem medo de baratas ;-;').split('\n');
      lines.forEach((line, index) => {
        ctx.fillText(line, 40, 470 + index * 25);
      });
      ctx.fillStyle = '#000000'; // preto
      ctx.font = '18px Arial';
      ctx.fillText(atk || '2500', 240, 537);
      ctx.fillStyle = '#000000'; // preto
      ctx.font = '18px Arial';
      ctx.fillText(def || '2500', 320, 537);

      // Enviar a imagem como resposta
      res.set('Content-Type', 'image/png');
      canvas.createPNGStream().pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao gerar a thumbnail.');
    }
  } else {
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
    try {
      const width = 1920;
      const height = 895;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      const backgroundImageURL = req.query.background || 'https://marketplace.canva.com/EAFKIsxfWjI/1/0/1600w/canva-papel-de-parede-coração-gradiente-bege-rosa-e-azul-eS21LuYsgUs.jpg';
      const backgroundImage = await loadImage(backgroundImageURL);

      ctx.drawImage(backgroundImage, 0, 0, width, height);

      const overlayImagePath = './data/welcome.png';
      const overlayImage = await loadImage(overlayImagePath);

      ctx.drawImage(overlayImage, 0, 0, width, height);

      const perfilimageURL = req.query.perfil || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
      const fotoperfilimage = await loadImage(perfilimageURL);

      const grupoimageURL = req.query.grupo || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
      const fotogrupoimage = await loadImage(grupoimageURL);
      const nick = req.query.nick;

      ctx.fillStyle = '#ffffff';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(nick || 'clover', 1550, 795);

      ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';

      let text = req.query.numero || '#557598659560';
      let textWidth = ctx.measureText(text).width;
      ctx.fillRect(650 - textWidth / 2 - 10, 285 - 50, textWidth + 20, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(text, 650, 265);

      const x = 85;
      const y = 110;
      const diameter = 290;
      const radius = diameter / 2;
      const centerX = x + radius;
      const centerY = y + radius;

      ctx.save();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(fotoperfilimage, x, y, diameter, diameter);

      ctx.restore();

      const grupoX = 1383;
      const grupoY = 365;
      const diamete = 337;
      const radiu = diamete / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(grupoX + radiu, grupoY + radiu, radiu, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(fotogrupoimage, grupoX, grupoY, diamete, diamete);

      ctx.restore();

      res.set('Content-Type', 'image/png');
      canvas.createPNGStream().pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao gerar a imagem.');
    }
  } else {
    return res.sendFile(htmlPath);
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
  //diminuirSaldo(username);
  adicionarSaldo(username)
  if (user.saldo > 1) {
    try {
      const width = 1920;
      const height = 895;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      const backgroundImageURL = req.query.background || 'https://marketplace.canva.com/EAFKIsxfWjI/1/0/1600w/canva-papel-de-parede-coração-gradiente-bege-rosa-e-azul-eS21LuYsgUs.jpg';
      const backgroundImage = await loadImage(backgroundImageURL);

      ctx.drawImage(backgroundImage, 0, 0, width, height);

      const overlayImagePath = './data/goodbye.png';
      const overlayImage = await loadImage(overlayImagePath);

      ctx.drawImage(overlayImage, 0, 0, width, height);

      const perfilimageURL = req.query.perfil || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
      const fotoperfilimage = await loadImage(perfilimageURL);

      const grupoimageURL = req.query.grupo || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
      const fotogrupoimage = await loadImage(grupoimageURL);
      const nick = req.query.nick;

      ctx.fillStyle = '#ffffff';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(nick || 'clover', 1550, 795);

      ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';

      let text = req.query.numero || '#557598659560';
      let textWidth = ctx.measureText(text).width;
      ctx.fillRect(650 - textWidth / 2 - 10, 285 - 50, textWidth + 20, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(text, 650, 265);

      const x = 85;
      const y = 110;
      const diameter = 290;
      const radius = diameter / 2;
      const centerX = x + radius;
      const centerY = y + radius;

      ctx.save();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(fotoperfilimage, x, y, diameter, diameter);

      ctx.restore();

      const grupoX = 1383;
      const grupoY = 365;
      const diamete = 337;
      const radiu = diamete / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(grupoX + radiu, grupoY + radiu, radiu, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(fotogrupoimage, grupoX, grupoY, diamete, diamete);

      ctx.restore();

      res.set('Content-Type', 'image/png');
      canvas.createPNGStream().pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao gerar a imagem.');
    }
  } else {
    return res.sendFile(htmlPath);
  }
});




app.get('/music-cardTest', async (req, res) => {
  const { username, key } = req.query;

  try {
    // Verificar se o usuário existe e está autorizado
    const user = await User.findOne({ username, key });

    if (!user || user.isBanned) {
      return res.status(403).send('Unauthorized');
    }

    // Verificar saldo do usuário
    // diminuirSaldo(username);
    adicionarSaldo(username);

    if (user.saldo <= 1) {
      return res.status(403).send('Saldo insuficiente');
    }

    // Configurações do canvas e contexto
    const width = 1920;
    const height = 1080; // Ajuste conforme necessário

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Carregar imagem de fundo
    const backgroundImageURL = req.query.background || 'https://marketplace.canva.com/EAFKIsxfWjI/1/0/1600w/canva-papel-de-parede-coração-gradiente-bege-rosa-e-azul-eS21LuYsgUs.jpg';
    const backgroundImage = await loadImage(backgroundImageURL);
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Carregar foto da música (substituir pela URL ou caminho da imagem da música)
    const musicPhotoURL = req.query.musicphoto || 'https://telegra.ph/file/87fe9fdbf08280460e531.jpg';
    const musicPhoto = await loadImage(musicPhotoURL);
    const musicPhotoSize = 600; // Tamanho da foto da música
    ctx.drawImage(musicPhoto, 50, 200, musicPhotoSize, musicPhotoSize);

    // Nome da música
    const musicName = req.query.musicname || 'Nome da Música';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial'; // Fonte em negrito
    ctx.textAlign = 'left';
    ctx.fillText(musicName, 700, 300); // Posição do nome da música

    // Tempo de início da música
    const startTime = req.query.starttime || '00:00';
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px Arial';
    ctx.fillText(`Início: ${startTime}`, 700, 370); // Posição do tempo de início

    // Minuto final da música
    const endTime = req.query.endtime || '03:45';
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px Arial';
    ctx.fillText(`Final: ${endTime}`, 700, 430); // Posição do minuto final

    // Barra de progresso da música
    const progress = req.query.progress || 75; // Valor da barra de progresso (exemplo)
    const progressBarWidth = 800;
    const progressBarHeight = 20;
    const progressBarX = 700;
    const progressBarY = 500;
    const progressBarColor = '#00ff00'; // Cor da barra de progresso
    const progressBarBackground = '#808080'; // Cor do fundo da barra de progresso

    // Desenhar fundo da barra de progresso
    ctx.fillStyle = progressBarBackground;
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    // Desenhar barra de progresso preenchida
    const progressWidth = (progress / 100) * progressBarWidth;
    ctx.fillStyle = progressBarColor;
    ctx.fillRect(progressBarX, progressBarY, progressWidth, progressBarHeight);

    // Finalizar e enviar imagem
    res.set('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error('Erro ao gerar o card de música:', error);
    res.status(500).send('Erro ao gerar a imagem.');
  }
});

app.get('/music-card1', async (req, res) => {
  try {
    const { username, key, thumbnail, backgroundcolor, autor, nome, starttime, endtime } = req.query;

    const backgroundColor = backgroundcolor ? `#${backgroundcolor}` : "#070707";
    const startTime = starttime 
    const endTime = endtime 

    const musicard = await Classic({
      thumbnailImage: thumbnail,
      backgroundImage: thumbnail,
      imageDarkness: 60,
      progress: 10,
      progressColor: "#FF7A00",
      progressBarColor: "#5F2D00",
      name: nome,
      nameColor: "#FF7A00",
      author: autor,
      authorColor: "#FF7A00",
      startTime,
      endTime,
      timeColor: "#FF7A00"
    });

    fs.writeFileSync("musicard.png", musicard);
    console.log("Music card gerado com sucesso!");
    
    res.sendFile(__dirname + '/musicard.png');
  } catch (err) {
    console.error("Erro ao gerar o music card:", err);
    res.status(500).send("Erro ao gerar o music card. Verifique o console para mais detalhes.");
  }
});

app.get('/music-card2', async (req, res) => {
  try {
    const { username, key, thumbnail, backgroundcolor, autor, nome, starttime, endtime } = req.query;

    const backgroundColor = backgroundcolor ? `#${backgroundcolor}` : "#070707";
    const startTime = starttime 
    const endTime = endtime 

    const musicard = await ClassicPro({
      thumbnailImage: thumbnail,
      backgroundImage: thumbnail,
      imageDarkness: 60,
      progress: 10,
      progressColor: "#FF7A00",
      progressBarColor: "#5F2D00",
      name: nome,
      nameColor: "#FF7A00",
      author: autor,
      authorColor: "#FF7A00",
      startTime,
      endTime,
      timeColor: "#FF7A00"
    });

    fs.writeFileSync("musicard.png", musicard);
    console.log("Music card gerado com sucesso!");
    
    res.sendFile(__dirname + '/musicard.png');
  } catch (err) {
    console.error("Erro ao gerar o music card:", err);
    res.status(500).send("Erro ao gerar o music card. Verifique o console para mais detalhes.");
  }
});

app.get('/music-card3', async (req, res) => {
  try {
    const { username, key, thumbnail, backgroundcolor, autor, nome, starttime, endtime } = req.query;

    const backgroundColor = backgroundcolor ? `#${backgroundcolor}` : "#070707";
    const startTime = starttime 
    const endTime = endtime 

    const musicard = await Dynamic({
      thumbnailImage: thumbnail,
      backgroundImage: thumbnail,
      imageDarkness: 60,
      progress: 10,
      progressColor: "#FF7A00",
      progressBarColor: "#5F2D00",
      name: nome,
      nameColor: "#FF7A00",
      author: autor,
      authorColor: "#FF7A00"
    });

    fs.writeFileSync("musicard.png", musicard);
    console.log("Music card gerado com sucesso!");
    
    res.sendFile(__dirname + '/musicard.png');
  } catch (err) {
    console.error("Erro ao gerar o music card:", err);
    res.status(500).send("Erro ao gerar o music card. Verifique o console para mais detalhes.");
  }
});

app.get('/music-card4', async (req, res) => {
  try {
    const { username, key, thumbnail, backgroundcolor, autor, nome, starttime, endtime } = req.query;

    const backgroundColor = backgroundcolor ? `#${backgroundcolor}` : "#070707";
    const startTime = starttime 
    const endTime = endtime 
    

    const musicard = await Mini({
      thumbnailImage: thumbnail,
      backgroundImage: thumbnail,
      imageDarkness: 60,
      progress: 10,
      progressColor: "#FF7A00",
      progressBarColor: "#5F2D00",
      menuColor: "#FF7A00",
      paused: false
    });

    fs.writeFileSync("musicard.png", musicard);
    console.log("Music card gerado com sucesso!");
    
    res.sendFile(__dirname + '/musicard.png');
  } catch (err) {
    console.error("Erro ao gerar o music card:", err);
    res.status(500).send("Erro ao gerar o music card. Verifique o console para mais detalhes.");
  }
});


app.get('/googlefoto', async (req, res) => {
  const { username, key } = req.query;
  const user = await User.findOne({ username, key });

  if (!user || user.isBaned) {
    return res.sendFile(htmlPath);
  }

  //diminuirSaldo(username);
  adicionarSaldo(username);

  if (user.saldo > 1) {
    const q = req.query.q;
    gis(q, logResults);

    function logResults(error, results) {
      if (error) {
        console.log(error);
      } else {
        const formattedResults = results.map(result => ({
          url: result.url,
          width: result.width,
          height: result.height
        }));
        res.json(formattedResults);
      }
    }
  } else {
    return res.sendFile(htmlPath);
  }
});









// Rota para retornar a imagem
app.get('/teste', async (req, res) => {
  try {
    // Tamanho da thumbnail
    const width = 1920;
    const height = 1077;

    // Criar o canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Carregar a imagem de fundo a partir do link fornecido (ou use uma imagem padrão se nenhum link for fornecido)
    const backgroundImageURL = req.query.background || 'https://telegra.ph/file/4d53a1c47a45e47961e27.jpg';
    const backgroundImage = await loadImage(backgroundImageURL);
    const espadaimage = await loadImage('https://magic-island.weebly.com/uploads/1/9/3/3/19337587/448104667.png')
    const escudoimage = await loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4mcDkWR_6vrNmdl9xAvdxMmaUTRZSuNZ2slVtiHHpE5Ri0zdlt_6iY_kfyE6KB5iLOGY&usqp=CAU')
    const itemimage = await loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-kG3UInEhf1mSSBkCEFy8IiXqyry7FhVo_Q&usqp=CAU')

    // Desenhar a imagem de fundo
    ctx.drawImage(backgroundImage, 0, 0, width, height);
    ctx.drawImage(espadaimage, 502, 380, 170, 170);
    ctx.drawImage(escudoimage, 52, 380, 170, 170)
    ctx.drawImage(itemimage, 882, 94, 93, 93)
    // Texto "oi" em branco no centro
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';


    // Enviar a imagem como resposta
    res.set('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar a thumbnail.');
  }

});



// Rotas de chat //
app.get('/chat-global', async(req, res) => {
  const user = req.session.user;
  if (user) {
    const { username, password, verificationCode, isVerified } = user;
    const userDb = await User.findOne({ username, password });
    const userId = userDb._id;
    const users = userDb;
    
    return res.render('chat', { user, userDb, users });
    
  } else {
    return res.redirect('/login');
  }
})




http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})
