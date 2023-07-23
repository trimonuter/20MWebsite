const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000; // You can use any available port number

// Enable CORS to allow requests from the frontend (replace the origin URL with your frontend URL)
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// Asynchronous function to scrape anime data
async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://myanimelist.net/topanime.php');

  const getAllAnime = await page.evaluate(() => {
    const ANIME_LIST = [];
    const allAnime = document.querySelectorAll(".di-ib.clearfix h3 a");
    const allPosters = document.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8 img");
    const allScores = document.querySelectorAll(".score.ac.fs14 span");
    const allURL = document.querySelectorAll(".hoverinfo_trigger.fl-l.ml12.mr8");

    for (let i = 0; i < allAnime.length; i++) {
      const data = {
        title: allAnime[i].innerHTML,
        posterURL: allPosters[i].getAttribute("src"),
        rating: parseFloat(allScores[i].innerHTML),
        season: "Fall 2016",
        members: "1.5M",
        URL: allURL[i].getAttribute("href")
      };

      ANIME_LIST.push(data);
    }

    return ANIME_LIST;
  });

  await browser.close();

  return getAllAnime;
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
