const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const text2png = require('text2png');
const gm = require('gm');
const {spawn} = require('child_process');
const exec = require('child_process').exec;
const crypto = require('crypto')
const wordwrap = require('word-wrapper')

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


const attp2 = (text) => new Promise((resolve, reject) => {
  try {
    canvasx('red', 0, text);
    canvasx('lime', 1, text);
    canvasx('blue', 2, text);
    exec('convert -delay 10 -loop 0 "./modulos-api/src/frames/*.png" -scale 512x512 ./modulos-api/src/ttp.gif', (error, stdout, stderr) => {
      if (error) reject(error); // Corrigido para utilizar 'reject' em vez de 'rejects'
      ffmpeg("./modulos-api/src/ttp.gif")
        .on('error', function (err) {
          console.error(err);
          reject(err); // Adicionado para rejeitar a promessa em caso de erro do ffmpeg
        })
        .on('end', async function () {
          resolve('./modulos-api/src/attp.webp');
        })
        .toFormat('webp')
        .save('./modulos-api/src/attp.webp');
    });
  } catch (error) {
    reject(error);
  }
});


  function canvasx(color, i, text) {
   fs.writeFileSync('./modulos-api/src/frames/frame' + i + '.png', text2png(wordWrap(text, 7), randomChoice([{
			font: '145px attp2',
			localFontPath: './modulos-api/src/attp2.ttf',
			localFontName: 'attp2',
			color: color,
			strokeWidth: 2,
			strokeColor: 'black',
			textAlign: 'center',
			lineSpacing: 5,
			padding: 110,
			backgroundColor: 'transparent',
            }])))
          }

          function wordWrap(str, maxWidth) {
            var newLineStr = "\n";
            done = false;
            res = '';
            while (str.length > maxWidth) {
              found = false;
              for (i = maxWidth - 1; i >= 0; i--) {
                if (testWhite(str.charAt(i))) {
                  res = res + [str.slice(0, i), newLineStr].join('')
                  str = str.slice(i + 1)
                  found = true;
                  break;
                }
              }
              if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('')
                str = str.slice(maxWidth)
              }
            }
            return res + str;
          }

          function testWhite(x) {
            var white = new RegExp(/^\s$/)
            return white.test(x.charAt(0))
          }
        
          
 module.exports = { attp2 }         