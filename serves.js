require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const BodyParser = require('body-parser');
const DNS = require('node:dns');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.use(BodyParser.urlencoded(
  {
    extended: false
  }
));
const URLs = [];    
let id = 0;       


app.post('/api/shorturl', (req, rsp) => {

  const { url: _url } = req.body;


  if (_url === "") {
    res.json({
      "error": "invalid url"
    });
  }


  const shortenedURL = _url.replace(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/, '');

  let urlCheck;
  try {
    urlCheck = new URL(_url);
  } catch (err) {
    rsp.json({
      "error": "invalid url"
    });
  }


  DNS.lookup(shortenedURL, (err) => {if (err) {
      rsp.json({
        "error": "invalid url"
      });


    } else {

      const urlIsReal = URLs.find(l => l.original_url === _url)
      if (urlIsReal) {
        rsp.json({
          "original_url": _url,
          "short_url": id
        });
      } else {
        ++id;


        const urlObj = {
          "original_url": _url,
          "short_url": `${id}`
        };

      URLs.push(urlObj);
        rsp.json({
          "original_url": _url,
          "short_url": id
        });
      }
    }
  });
});

app.get('/api/shorturl/:id', (req, rsp) => {
const { id: _id } = req.params;
const shortUrlIsReal = URLs.find(sl => sl.short_url === _id);


  if (shortUrlIsReal) {
    rsp.redirect(shortUrlIsReal.original_url);
  } else {
    rsp.json({
      "error": "invalid url"
    });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
