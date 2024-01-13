const path = process.cwd();
const express = require('express');
const fs = require('fs');
const router = express.Router();
const listkey = ["clover"];
const creator = "CM";
const neoxr = "yntkts";
const zeks = "administrator";
const zeks2 = "apivinz";

const loghandler = {
  notparam: {
    status: false,
    criador: creator,
    codigo: 406,
    mensagem: 'Está faltando o seguinte parâmetro: Apikey'
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
  ytSearch
} = require(__path + "/data/yt");
var pin = require(__path + '/data/pinterest.js');


const gpt = require(__path + "/data/scrape.js")
router.get('/gpt', async (req, res, next) => {
  const url = req.query.url;
  const apikey = req.query.apikey;
  if (!url) return res.json(loghandler.noturl)
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
    gpt.attp(url)
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

router.get('/download/ytmp3', async (req, res, next) => {
  const url = req.query.url;
  const apikey = req.query.apikey;
  if (!url) return res.json(loghandler.noturl)
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
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

router.get('/download/ytmp4', async (req, res, next) => {
  const url = req.query.url;
  const apikey = req.query.apikey;
  if (!url) return res.json(loghandler.noturl)
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
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

router.get("/yt/playmp3", async (req, res, next) => {
  const query = req.query.query;
  const apikey = req.query.apikey;

  if (!query) return res.json(loghandler.notquery)
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
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

router.get("/download/pinterest", async (req, res, next) => {
  const query = req.query.query;
  const apikey = req.query.apikey;
  if (!query) return res.json(loghandler.notquery)
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
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

router.get("/yt/playmp4", async (req, res, next) => {

  const query = req.query.query;

  const apikey = req.query.apikey;

  if (!query) return res.json(loghandler.notquery)
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
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


router.get('/anime/amv', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);

  if (listkey.includes(Apikey)) {
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

router.get('/nsfw/ahegao', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const ahegao = JSON.parse(fs.readFileSync(__path + '/data/ahegao.json'));
    const randahegao = ahegao[Math.floor(Math.random() * ahegao.length)];

    res.json({
      url: `${randahegao}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/ass', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const ass = JSON.parse(fs.readFileSync(__path + '/data/ass.json'));
    const randass = ass[Math.floor(Math.random() * ass.length)];

    res.json({
      url: `${randass}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/bdsm', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const bdsm = JSON.parse(fs.readFileSync(__path + '/data/bdsm.json'));
    const randbdsm = bdsm[Math.floor(Math.random() * bdsm.length)];

    res.json({
      url: `${randbdsm}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/blowjob', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const blowjob = JSON.parse(fs.readFileSync(__path + '/data/blowjob.json'));
    const randblowjob = blowjob[Math.floor(Math.random() * blowjob.length)];

    res.json({
      url: `${randblowjob}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/cuckold', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const cuckold = JSON.parse(fs.readFileSync(__path + '/data/cuckold.json'));
    const randcuckold = cuckold[Math.floor(Math.random() * cuckold.length)];

    res.json({
      url: `${randcuckold}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/cum', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const cum = JSON.parse(fs.readFileSync(__path + '/data/cum.json'));
    const randcum = cum[Math.floor(Math.random() * cum.length)];

    res.json({
      url: `${randcum}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/ero', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const ero = JSON.parse(fs.readFileSync(__path + '/data/ero.json'));
    const randero = ero[Math.floor(Math.random() * ero.length)];

    res.json({
      url: `${randero}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/femdom', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const femdom = JSON.parse(fs.readFileSync(__path + '/data/femdom.json'));
    const randfemdom = femdom[Math.floor(Math.random() * femdom.length)];

    res.json({
      url: `${randfemdom}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/foot', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const foot = JSON.parse(fs.readFileSync(__path + '/data/foot.json'));
    const randfoot = foot[Math.floor(Math.random() * foot.length)];

    res.json({
      url: `${randfoot}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/gangbang', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const gangbang = JSON.parse(fs.readFileSync(__path + '/data/gangbang.json'));
    const randgangbang = gangbang[Math.floor(Math.random() * gangbang.length)];

    res.json({
      url: `${randgangbang}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/glasses', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const glasses = JSON.parse(fs.readFileSync(__path + '/data/glasses.json'));
    const randglasses = glasses[Math.floor(Math.random() * glasses.length)];

    res.json({
      url: `${randglasses}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/hentai', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const hentai = JSON.parse(fs.readFileSync(__path + '/data/hentai.json'));
    const randhentai = hentai[Math.floor(Math.random() * hentai.length)];

    res.json({
      url: `${randhentai}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/gifs', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const gifs = JSON.parse(fs.readFileSync(__path + '/data/gifs.json'));
    const randgifs = gifs[Math.floor(Math.random() * gifs.length)];

    res.json({
      url: `${randgifs}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/jahy', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const jahy = JSON.parse(fs.readFileSync(__path + '/data/jahy.json'));
    const randjahy = jahy[Math.floor(Math.random() * jahy.length)];

    res.json({
      url: `${randjahy}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/manga', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const manga = JSON.parse(fs.readFileSync(__path + '/data/manga.json'));
    const randmanga = manga[Math.floor(Math.random() * manga.length)];

    res.json({
      url: `${randmanga}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/masturbation', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const masturbation = JSON.parse(fs.readFileSync(__path + '/data/masturbation.json'));
    const randmasturbation = masturbation[Math.floor(Math.random() * masturbation.length)];

    res.json({
      url: `${randmasturbation}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/neko', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const neko = JSON.parse(fs.readFileSync(__path + '/data/neko.json'));
    const randneko = neko[Math.floor(Math.random() * neko.length)];

    res.json({
      url: `${randneko}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/orgy', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const orgy = JSON.parse(fs.readFileSync(__path + '/data/orgy.json'));
    const randorgy = orgy[Math.floor(Math.random() * orgy.length)];

    res.json({
      url: `${randorgy}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/panties', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const panties = JSON.parse(fs.readFileSync(__path + '/data/panties.json'));
    const randpanties = panties[Math.floor(Math.random() * panties.length)];

    res.json({
      url: `${randpanties}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/pussy', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const pussy = JSON.parse(fs.readFileSync(__path + '/data/pussy.json'));
    const randpussy = pussy[Math.floor(Math.random() * pussy.length)];

    res.json({
      url: `${randpussy}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/neko2', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const neko2 = JSON.parse(fs.readFileSync(__path + '/data/neko2.json'));
    const randneko2 = neko2[Math.floor(Math.random() * neko2.length)];

    res.json({
      url: `${randneko2}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/tentacles', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const tentacles = JSON.parse(fs.readFileSync(__path + '/data/tentacles.json'));
    const randtentacles = tentacles[Math.floor(Math.random() * tentacles.length)];

    res.json({
      url: `${randtentacles}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/thighs', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const thighs = JSON.parse(fs.readFileSync(__path + '/data/thighs.json'));
    const randthighs = thighs[Math.floor(Math.random() * thighs.length)];

    res.json({
      url: `${randthighs}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/yuri', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const yuri = JSON.parse(fs.readFileSync(__path + '/data/yuri.json'));
    const randyuri = yuri[Math.floor(Math.random() * yuri.length)];

    res.json({
      url: `${randyuri}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/nsfw/zettai', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const zettai = JSON.parse(fs.readFileSync(__path + '/data/zettai.json'));
    const randzettai = zettai[Math.floor(Math.random() * zettai.length)];

    res.json({
      url: `${randzettai}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/keneki', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const keneki = JSON.parse(fs.readFileSync(__path + '/data/keneki.json'));
    const randkeneki = keneki[Math.floor(Math.random() * keneki.length)];

    res.json({
      url: `${randkeneki}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/megumin', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const megumin = JSON.parse(fs.readFileSync(__path + '/data/megumin.json'));
    const randmegumin = megumin[Math.floor(Math.random() * megumin.length)];

    res.json({
      url: `${randmegumin}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/yotsuba', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const yotsuba = JSON.parse(fs.readFileSync(__path + '/data/yotsuba.json'));
    const randyotsuba = yotsuba[Math.floor(Math.random() * yotsuba.length)];

    res.json({
      url: `${randyotsuba}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/shinomiya', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const shinomiya = JSON.parse(fs.readFileSync(__path + '/data/shinomiya.json'));
    const randshinomiya = shinomiya[Math.floor(Math.random() * shinomiya.length)];

    res.json({
      url: `${randshinomiya}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/yumeko', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const yumeko = JSON.parse(fs.readFileSync(__path + '/data/yumeko.json'));
    const randyumeko = yumeko[Math.floor(Math.random() * yumeko.length)];

    res.json({
      url: `${randyumeko}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/tejina', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const tejina = JSON.parse(fs.readFileSync(__path + '/data/tejina.json'));
    const randtejina = tejina[Math.floor(Math.random() * tejina.length)];

    res.json({
      url: `${randtejina}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/chiho', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const chiho = JSON.parse(fs.readFileSync(__path + '/data/chiho.json'));
    const randchiho = chiho[Math.floor(Math.random() * chiho.length)];

    res.json({
      url: `${randchiho}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/cyberspace', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const cyberspace = JSON.parse(fs.readFileSync(__path + '/data/CyberSpace.json'));
    const randcyberspace = cyberspace[Math.floor(Math.random() * cyberspace.length)];

    res.json({
      url: `${randcyberspace}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/gaming', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const gaming = JSON.parse(fs.readFileSync(__path + '/data/GameWallp.json'));
    const randgaming = gaming[Math.floor(Math.random() * gaming.length)];

    res.json({
      url: `${randgaming}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/programing', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const programing = JSON.parse(fs.readFileSync(__path + '/data/Programming.json'));
    const randprograming = programing[Math.floor(Math.random() * programing.length)];

    res.json({
      url: `${randprograming}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/wallpapertec', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const teknologi = JSON.parse(fs.readFileSync(__path + '/data/Technology.json'));
    const randteknologi = teknologi[Math.floor(Math.random() * teknologi.length)];

    res.json({
      url: `${randteknologi}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/mountain', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const mountain = JSON.parse(fs.readFileSync(__path + '/data/Mountain.json'));
    const randmountain = mountain[Math.floor(Math.random() * mountain.length)];

    res.json({
      url: `${randmountain}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})



router.get('/anime/toukachan', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const toukachan = JSON.parse(fs.readFileSync(__path + '/data/toukachan.json'));
    const randtoukachan = toukachan[Math.floor(Math.random() * toukachan.length)];

    res.json({
      url: `${randtoukachan}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/akira', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const akira = JSON.parse(fs.readFileSync(__path + '/data/akira.json'));
    const randakira = akira[Math.floor(Math.random() * akira.length)];

    res.json({
      url: `${randakira}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/itori', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const itori = JSON.parse(fs.readFileSync(__path + '/data/itori.json'));
    const randitori = itori[Math.floor(Math.random() * itori.length)];

    res.json({
      url: `${randitori}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kurumi', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const kurumi = JSON.parse(fs.readFileSync(__path + '/data/kurumi.json'));
    const randkurumi = kurumi[Math.floor(Math.random() * kurumi.length)];

    res.json({
      url: `${randkurumi}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/miku', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const miku = JSON.parse(fs.readFileSync(__path + '/data/miku.json'));
    const randmiku = miku[Math.floor(Math.random() * miku.length)];

    res.json({
      url: `${randmiku}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/pokemon', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const pokemon = JSON.parse(fs.readFileSync(__path + '/data/pokemon.json'));
    const randpokemon = pokemon[Math.floor(Math.random() * pokemon.length)];

    res.json({
      url: `${randpokemon}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/ryujin', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const ryujin = JSON.parse(fs.readFileSync(__path + '/data/ryujin.json'));
    const randryujin = ryujin[Math.floor(Math.random() * ryujin.length)];

    res.json({
      url: `${randryujin}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/rose', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const rose = JSON.parse(fs.readFileSync(__path + '/data/rose.json'));
    const randrose = rose[Math.floor(Math.random() * rose.length)];

    res.json({
      url: `${randrose}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kaori', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const kaori = JSON.parse(fs.readFileSync(__path + '/data/kaori.json'));
    const randkaori = kaori[Math.floor(Math.random() * kaori.length)];

    res.json({
      url: `${randkaori}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/shizuka', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const shizuka = JSON.parse(fs.readFileSync(__path + '/data/shizuka.json'));
    const randshizuka = shizuka[Math.floor(Math.random() * shizuka.length)];

    res.json({
      url: `${randshizuka}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kaga', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const kaga = JSON.parse(fs.readFileSync(__path + '/data/kaga.json'));
    const randkaga = kaga[Math.floor(Math.random() * kaga.length)];

    res.json({
      url: `${randkaga}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kotori', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const kotori = JSON.parse(fs.readFileSync(__path + '/data/kotori.json'));
    const randkotori = kotori[Math.floor(Math.random() * kotori.length)];
    
    res.json({
      url: `${randkotori}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/mikasa', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const mikasa = JSON.parse(fs.readFileSync(__path + '/data/mikasa.json'));
    const randmikasa = mikasa[Math.floor(Math.random() * mikasa.length)];

    res.json({
      url: `${randmikasa}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/akiyama', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const akiyama = JSON.parse(fs.readFileSync(__path + '/data/akiyama.json'));
    const randakiyama = akiyama[Math.floor(Math.random() * akiyama.length)];

    res.json({
      url: `${randakiyama}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/gremory', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const gremory = JSON.parse(fs.readFileSync(__path + '/data/gremory.json'));
    const randgremory = gremory[Math.floor(Math.random() * gremory.length)];
    
    res.json({
      url: `${randgremory}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/isuzu', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const isuzu = JSON.parse(fs.readFileSync(__path + '/data/isuzu.json'));
    const randisuzu = isuzu[Math.floor(Math.random() * isuzu.length)];

    res.json({
      url: `${randisuzu}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/cosplay', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const cosplay = JSON.parse(fs.readFileSync(__path + '/data/cosplay.json'));
    const randcosplay = cosplay[Math.floor(Math.random() * cosplay.length)];

    res.json({
      url: `${randcosplay}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/shina', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const shina = JSON.parse(fs.readFileSync(__path + '/data/shina.json'));
    const randshina = shina[Math.floor(Math.random() * shina.length)];

    res.json({
      url: `${randshina}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kagura', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const kagura = JSON.parse(fs.readFileSync(__path + '/data/kagura.json'));
    const randkagura = kagura[Math.floor(Math.random() * kagura.length)];

    res.json({
      url: `${randkagura}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/shinka', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const shinka = JSON.parse(fs.readFileSync(__path + '/data/shinka.json'));
    const randshinka = shinka[Math.floor(Math.random() * shinka.length)];

    res.json({
      url: `${randshinka}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/eba', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const eba = JSON.parse(fs.readFileSync(__path + '/data/eba.json'));
    const randeba = eba[Math.floor(Math.random() * eba.length)];

    res.json({
      url: `${randeba}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/deidara', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Deidara = JSON.parse(fs.readFileSync(__path + '/data/deidara.json'));
    const randDeidara = Deidara[Math.floor(Math.random() * Deidara.length)];

    res.json({
      url: `${randDeidara}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})



router.get('/anime/jeni', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const jeni = JSON.parse(fs.readFileSync(__path + '/data/jeni.json'));
    const randjeni = jeni[Math.floor(Math.random() * jeni.length)];

    res.json({
      url: `${randjeni}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/random/meme', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const meme = JSON.parse(fs.readFileSync(__path + '/data/meme.json'));
    const randmeme = meme[Math.floor(Math.random() * meme.length)];

    res.json({
      url: `${randmeme}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/satanic', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const satanic = JSON.parse(fs.readFileSync(__path + '/data/satanic.json'));
    const randsatanic = satanic[Math.floor(Math.random() * satanic.length)];

    res.json({
      url: `${randsatanic}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})



router.get('/anime/itachi', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Itachi = JSON.parse(fs.readFileSync(__path + '/data/itachi.json'));
    const randItachi = Itachi[Math.floor(Math.random() * Itachi.length)];

    res.json({
      url: `${randItachi}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/madara', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Madara = JSON.parse(fs.readFileSync(__path + '/data/madara.json'));
    const randMadara = Madara[Math.floor(Math.random() * Madara.length)];

    res.json({
      url: `${randMadara}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/yuki', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Yuki = JSON.parse(fs.readFileSync(__path + '/data/yuki.json'));
    const randYuki = Yuki[Math.floor(Math.random() * Yuki.length)];

    res.json({
      url: `${randYuki}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/asuna', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const asuna = JSON.parse(fs.readFileSync(__path + '/data/asuna.json'));
    const randasuna = asuna[Math.floor(Math.random() * asuna.length)];

    res.json({
      url: `${randasuna}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/ayuzawa', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const ayuzawa = JSON.parse(fs.readFileSync(__path + '/data/ayuzawa.json'));
    const randayuzawa = ayuzawa[Math.floor(Math.random() * ayuzawa.length)];

    res.json({
      url: `${randayuzawa}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/chitoge', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const chitoge = JSON.parse(fs.readFileSync(__path + '/data/chitoge.json'));
    const randchitoge = chitoge[Math.floor(Math.random() * chitoge.length)];

    res.json({
      url: `${randchitoge}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/emilia', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const emilia = JSON.parse(fs.readFileSync(__path + '/data/emilia.json'));
    const randemilia = emilia[Math.floor(Math.random() * emilia.length)];

    res.json({
      url: `${randemilia}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/hestia', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const hestia = JSON.parse(fs.readFileSync(__path + '/data/hestia.json'));
    const randhestia = hestia[Math.floor(Math.random() * hestia.length)];

    res.json({
      url: `${randhestia}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/inori', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const inori = JSON.parse(fs.readFileSync(__path + '/data/inori.json'));
    const randinori = inori[Math.floor(Math.random() * inori.length)];

    res.json({
      url: `${randinori}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/ana', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const ana = JSON.parse(fs.readFileSync(__path + '/data/ana.json'));
    const randana = ana[Math.floor(Math.random() * ana.length)];

    res.json({
      url: `${randana}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/boruto', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Boruto = JSON.parse(fs.readFileSync(__path + '/data/boruto.json'));
    const randBoruto = Boruto[Math.floor(Math.random() * Boruto.length)];

    res.json({
      url: `${randBoruto}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/erza', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Erza = JSON.parse(fs.readFileSync(__path + '/data/erza.json'));
    const randErza = Erza[Math.floor(Math.random() * Erza.length)];

    res.json({
      url: `${randErza}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kakasih', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Kakasih = JSON.parse(fs.readFileSync(__path + '/data/kakasih.json'));
    const randKakasih = Kakasih[Math.floor(Math.random() * Kakasih.length)];

    res.json({
      url: `${randKakasih}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/sagiri', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Sagiri = JSON.parse(fs.readFileSync(__path + '/data/sagiri.json'));
    const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];

    res.json({
      url: `${randSagiri}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/minato', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Minato = JSON.parse(fs.readFileSync(__path + '/data/minato.json'));
    const randMinato = Minato[Math.floor(Math.random() * Minato.length)];

    res.json({
      url: `${randMinato}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/naruto', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Naruto = JSON.parse(fs.readFileSync(__path + '/data/naruto.json'));
    const randNaruto = Naruto[Math.floor(Math.random() * Naruto.length)];

    res.json({
      url: `${randNaruto}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/nezuko', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Nezuko = JSON.parse(fs.readFileSync(__path + '/data/nezuko.json'));
    const randNezuko = Nezuko[Math.floor(Math.random() * Nezuko.length)];

    res.json({
      url: `${randNezuko}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/onepiece', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Pic = JSON.parse(fs.readFileSync(__path + '/data/onepiece.json'));
    const randPic = Pic[Math.floor(Math.random() * Pic.length)];

    res.json({
      url: `${randPic}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/rize', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Rize = JSON.parse(fs.readFileSync(__path + '/data/rize.json'));
    const randRize = Rize[Math.floor(Math.random() * Rize.length)];

    res.json({
      url: `${randRize}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/sakura', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Sakura = JSON.parse(fs.readFileSync(__path + '/data/sakura.json'));
    const randSakura = Sakura[Math.floor(Math.random() * Sakura.length)];

    res.json({
      url: `${randSakura}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/sasuke', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Sasuke = JSON.parse(fs.readFileSync(__path + '/data/sasuke.json'));
    const randSasuke = Sasuke[Math.floor(Math.random() * Sasuke.length)];

    res.json({
      url: `${randSasuke}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/tsunade', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Su = JSON.parse(fs.readFileSync(__path + '/data/tsunade.json'));
    const randSu = Su[Math.floor(Math.random() * Su.length)];

    res.json({
      url: `${randSu}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/montor', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Mon = JSON.parse(fs.readFileSync(__path + '/data/montor.json'));
    const randMon = Mon[Math.floor(Math.random() * Mon.length)];

    res.json({
      url: `${randMon}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})
// ain
router.get('/anime/mobil', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Mob = JSON.parse(fs.readFileSync(__path + '/data/mobil.json'));
    const randMob = Mob[Math.floor(Math.random() * Mob.length)];

    res.json({
      url: `${randMob}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/anime', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Wai23 = JSON.parse(fs.readFileSync(__path + '/data/wallhp2.json'));
    const randWai23 = Wai23[Math.floor(Math.random() * Wai23.length)];

    res.json({
      url: `${randWai23}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/wallhp', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Wai22 = JSON.parse(fs.readFileSync(__path + '/data/wallhp.json'));
    const randWai22 = Wai22[Math.floor(Math.random() * Wai22.length)];

    res.json({
      url: `${randWai22}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/waifu2', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Wai2 = JSON.parse(fs.readFileSync(__path + '/data/waifu2.json'));
    const randWai2 = Wai2[Math.floor(Math.random() * Wai2.length)];

    res.json({
      url: `${randWai2}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/waifu', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Wai = JSON.parse(fs.readFileSync(__path + '/data/waifu.json'));
    const randWai = Wai[Math.floor(Math.random() * Wai.length)];
    
    res.json({
      url: `${randWai}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/hekel', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    Hekel = JSON.parse(fs.readFileSync(__path + '/data/hekel.json'));
    const randHekel = Hekel[Math.floor(Math.random() * Hekel.length)]

    res.json({
      url: `${randHekel}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/kucing', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    Kucing = JSON.parse(fs.readFileSync(__path + '/data/kucing.json'));
    const randKucing = Kucing[Math.floor(Math.random() * Kucing.length)]

    res.json({
      url: `${randKucing}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/pubg', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    Pubg = JSON.parse(fs.readFileSync(__path + '/data/pubg.json'));
    const randPubg = Pubg[Math.floor(Math.random() * Pubg.length)]

    res.json({
      url: `${randPubg}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/ppcouple', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    Pp = JSON.parse(fs.readFileSync(__path + '/data/profil.json'));
    const randPp = Pp[Math.floor(Math.random() * Pp.length)]

    res.json({
      url: `${randPp}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/wallpaper/anjing', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    Anjing = JSON.parse(fs.readFileSync(__path + '/data/anjing.json'));
    const randAnjing = Anjing[Math.floor(Math.random() * Anjing.length)]

    res.json({
      url: `${randAnjing}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/doraemon', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    Dora = JSON.parse(fs.readFileSync(__path + '/data/doraemon.json'));
    const randDora = Dora[Math.floor(Math.random() * Dora.length)]

    res.json({
      url: `${randDora}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/elaina', async (req, res, next) => {
  const Apikey = req.query.apikey;
  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Elaina = JSON.parse(fs.readFileSync(__path + '/data/elaina.json'))
    const randElaina = Elaina[Math.floor(Math.random() * Elaina.length)]
    //tansole.log(randLoli)

    res.json({
      url: `${randElaina}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/loli', async (req, res, next) => {
  const Apikey = req.query.apikey;
  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Loli = JSON.parse(fs.readFileSync(__path + '/data/loli.json'))
    const randLoli = Loli[Math.floor(Math.random() * Loli.length)]
    //tansole.log(randLoli)

    res.json({
      url: `${randLoli}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/yuri', async (req, res, next) => {
  const Apikey = req.query.apikey;
  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Yuri = JSON.parse(fs.readFileSync(__path + '/data/yuri.json'))
    const randYuri = Yuri[Math.floor(Math.random() * Yuri.length)]
    //tansole.log(randTech))
    res.json({
      url: `${randYuri}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/anime/cecan', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const cecan = JSON.parse(fs.readFileSync(__path + '/data/cecan.json'));
    const randCecan = cecan[Math.floor(Math.random() * cecan.length)];
    data = await fetch(randCecan).then(v => v.buffer());
    await fs.writeFileSync(__path + '/tmp/cecan.jpeg', data)
    res.json({
      url: `${randCecan}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})


router.get('/wallpaper/aesthetic', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Aesthetic = JSON.parse(fs.readFileSync(__path + '/data/aesthetic.json'));
    const randAesthetic = Aesthetic[Math.floor(Math.random() * Aesthetic.length)];
    data = await fetch(randAesthetic).then(v => v.buffer());
    await fs.writeFileSync(__path + '/tmp/aesthetic.jpeg', data)
    res.json({
      url: `${randAesthetic}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})



router.get('/anime/sagiri', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Sagiri = JSON.parse(fs.readFileSync(__path + '/data/sagiri.json'));
    const randSagiri = Sagiri[Math.floor(Math.random() * Sagiri.length)];
    data = await fetch(randSagiri).then(v => v.buffer())
    await fs.writeFileSync(__path + '/tmp/sagiri.jpeg', data)
    res.json({
      url: `${randSagiri}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/shota', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Shota = JSON.parse(fs.readFileSync(__path + '/data/shota.json'));
    const randShota = Shota[Math.floor(Math.random() * Shota.length)];
    data = await fetch(randShota).then(v => v.buffer());
    await fs.writeFileSync(__path + '/tmp/shota.jpeg', data)
    res.json({
      url: `${randShota}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/nsfwloli', async (req, res, next) => {
  var Apikey = req.query.apikey

  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {

    const Lol = JSON.parse(fs.readFileSync(__path + '/data/nsfwloli.json'));
    const randLol = Lol[Math.floor(Math.random() * Lol.length)];
    data = await fetch(randLol).then(v => v.buffer());
    await fs.writeFileSync(__path + '/tmp/lol.jpeg', data)
    res.json({
      url: `${randLol}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/anime/hinata', async (req, res, next) => {
  var Apikey = req.query.apikey
  if (!Apikey) return res.json(loghandler.notparam)
  if (listkey.includes(Apikey)) {
    const Hinata = JSON.parse(fs.readFileSync(__path + '/data/hinata.json'));
    const randHin = Hinata[Math.floor(Math.random() * Hinata.length)];
    data = await fetch(randHin).then(v => v.buffer());
    await fs.writeFileSync(__path + '/tmp/Hinata.jpeg', data)
    res.json({
      url: `${randHin}`
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.get('/cekapikey', async (req, res, next) => {
  const apikey = req.query.apikey;
  if (!apikey) return res.json(loghandler.notparam)
  if (listkey.includes(apikey)) {
    res.json({
      status: 'Ativa',
      criador: `${creator}`,
      apikey: `${apikey}`,
      mensagem: 'APIKEY ATIVA, LIMITE: 999'
    })
  } else {
    res.json(loghandler.invalidKey)
  }
})

router.use(function (req, res) {

  res.status(404)
    .set("Content-Type", "text/html")
    .sendFile(__path + '/views/404.html');
});

module.exports = router
