import express from "express"
import { parse } from "node-html-parser";
import fetch from "node-fetch";
import livereload from "livereload"
import connectLivereload from "connect-livereload"

const app = express();
const port = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch('./public');

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLivereload());
app.use(express.static("./public"))

// Asynchronous function to scrape anime data
async function scrapeData() {
  const res = await fetch("https://myanimelist.net/topanime.php")
  const text = await res.text()
  const document = parse(text)

  const ANIME_LIST = [];
  const allAnime = document.querySelectorAll(".di-ib.clearfix h3 a");
  const allPosters = document.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8 img");
  const allScores = document.querySelectorAll(".score.ac.fs14 span");
  const allURL = document.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8");

  for (let i = 0; i < allAnime.length; i++) {
    const data = {
      title: allAnime[i].innerHTML,
      posterURL: allPosters[i].getAttribute("data-src"),
      rating: parseFloat(allScores[i].innerHTML),
      season: "Fall 2016",
      members: "1.5M",
      URL: allURL[i].getAttribute("href")
    };

    ANIME_LIST.push(data);
  }

  return ANIME_LIST;
}

// Endpoint to serve the scraped anime data
app.get('/scrape', async (req, res) => {
  try {
    const animeList = await scrapeData();
    res.json(animeList);
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'An error occurred while scraping data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});