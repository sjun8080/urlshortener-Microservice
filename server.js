require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors()); //Middlewear-to handle 
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const originalUrls = []; //array
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const indexNo = originalUrls.indexOf(url);
  //if the url matches with originalUrl 
  
  if(!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: 'invalid url' })
  }

  if (indexNo < 0) {// "<0" means not able to find it (do not exist)
    originalUrls.push(url); //google.com
    shortUrls.push(shortUrls.length); //0 because there is nothing in shortUrls array[]. Push (0) 

    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1 //because it should be '0'
    });
  };

  return res.json({
    original_url: url,
    short_url: shortUrls[indexNo]
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl)
  const indexNo = shortUrls.indexOf(shorturl)

  if(indexNo < 0) {
    return res.json({
      "error": "No short URL found for the given input"
    })
}
  res.redirect(originalUrls[indexNo])
})       

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
