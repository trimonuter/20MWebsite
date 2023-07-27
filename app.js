const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// CORS
app.use(cors());

// Handle fetchHTML request
app.get('/fetchHTML', async (req, res) => {
    try {
        const response = await fetch('https://myanimelist.net/topanime.php');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
        const text = await response.text();
    
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})